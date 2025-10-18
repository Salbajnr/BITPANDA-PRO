
import { Router } from "express";
import { requireAuth } from "./simple-auth";
import { storage } from "./storage";
import { z } from "zod";

const router = Router();

const createLoanSchema = z.object({
  assetSymbol: z.string().min(1).max(10),
  amount: z.number().min(1),
  collateralSymbol: z.string().min(1).max(10),
  collateralAmount: z.number().min(0.001),
  loanTerm: z.enum(['7d', '14d', '30d', '60d', '90d', '180d']),
  interestRate: z.number().min(0.01).max(50)
});

const lendingPools = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    apy: '12.5%',
    minAmount: 100,
    maxAmount: 100000,
    availableLiquidity: 500000,
    description: 'Lend USDC to earn high yields'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    apy: '11.8%',
    minAmount: 100,
    maxAmount: 100000,
    availableLiquidity: 750000,
    description: 'Stable lending with USDT'
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    apy: '10.2%',
    minAmount: 100,
    maxAmount: 50000,
    availableLiquidity: 250000,
    description: 'Decentralized stablecoin lending'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    apy: '6.5%',
    minAmount: 0.001,
    maxAmount: 10,
    availableLiquidity: 50,
    description: 'Lend Bitcoin for steady returns'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    apy: '7.2%',
    minAmount: 0.01,
    maxAmount: 100,
    availableLiquidity: 500,
    description: 'Ethereum lending pool'
  }
];

const collateralRatios = {
  'BTC': 150, // 150% collateral required
  'ETH': 150,
  'USDC': 110,
  'USDT': 110,
  'DAI': 110
};

// Get lending pools
router.get('/pools', requireAuth, async (req, res) => {
  try {
    res.json(lendingPools);
  } catch (error) {
    console.error('Error fetching lending pools:', error);
    res.status(500).json({ message: 'Failed to fetch lending pools' });
  }
});

// Get user's lending positions
router.get('/positions', requireAuth, async (req, res) => {
  try {
    const positions = await storage.getUserLendingPositions(req.user!.id);
    res.json(positions);
  } catch (error) {
    console.error('Error fetching lending positions:', error);
    res.status(500).json({ message: 'Failed to fetch lending positions' });
  }
});

// Lend assets
router.post('/lend', requireAuth, async (req, res) => {
  try {
    const { assetSymbol, amount } = req.body;

    // Validate lending pool
    const pool = lendingPools.find(p => p.symbol === assetSymbol);
    if (!pool) {
      return res.status(400).json({ message: 'Invalid lending asset' });
    }

    // Validate amount
    if (amount < pool.minAmount || amount > pool.maxAmount) {
      return res.status(400).json({
        message: `Amount must be between ${pool.minAmount} and ${pool.maxAmount} ${pool.symbol}`
      });
    }

    // Check user balance
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holding = await storage.getHolding(portfolio.id, assetSymbol);
    if (!holding || parseFloat(holding.amount) < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create lending position
    const position = await storage.createLendingPosition({
      userId: req.user!.id,
      assetSymbol,
      amount: amount.toString(),
      apy: pool.apy,
      startDate: new Date(),
      status: 'active',
      type: 'lend'
    });

    // Update holding (reduce available amount)
    await storage.updateHolding(holding.id, {
      amount: (parseFloat(holding.amount) - amount).toString()
    });

    res.json(position);
  } catch (error) {
    console.error('Error creating lending position:', error);
    res.status(500).json({ message: 'Failed to create lending position' });
  }
});

// Borrow assets
router.post('/borrow', requireAuth, async (req, res) => {
  try {
    const loanData = createLoanSchema.parse(req.body);

    // Validate collateral ratio
    const requiredRatio = collateralRatios[loanData.collateralSymbol as keyof typeof collateralRatios];
    if (!requiredRatio) {
      return res.status(400).json({ message: 'Invalid collateral asset' });
    }

    // Check if collateral is sufficient
    const collateralValue = loanData.collateralAmount; // Simplified - should use real prices
    const loanValue = loanData.amount;
    const actualRatio = (collateralValue / loanValue) * 100;

    if (actualRatio < requiredRatio) {
      return res.status(400).json({
        message: `Insufficient collateral. Required: ${requiredRatio}%, Provided: ${actualRatio.toFixed(2)}%`
      });
    }

    // Check user has collateral
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const collateralHolding = await storage.getHolding(portfolio.id, loanData.collateralSymbol);
    if (!collateralHolding || parseFloat(collateralHolding.amount) < loanData.collateralAmount) {
      return res.status(400).json({ message: 'Insufficient collateral balance' });
    }

    // Create loan
    const loan = await storage.createLoan({
      userId: req.user!.id,
      assetSymbol: loanData.assetSymbol,
      amount: loanData.amount.toString(),
      collateralSymbol: loanData.collateralSymbol,
      collateralAmount: loanData.collateralAmount.toString(),
      interestRate: loanData.interestRate.toString(),
      loanTerm: loanData.loanTerm,
      startDate: new Date(),
      endDate: calculateLoanEndDate(loanData.loanTerm),
      status: 'active'
    });

    // Lock collateral
    await storage.updateHolding(collateralHolding.id, {
      amount: (parseFloat(collateralHolding.amount) - loanData.collateralAmount).toString()
    });

    // Add borrowed asset to portfolio
    const borrowedHolding = await storage.getHolding(portfolio.id, loanData.assetSymbol);
    if (borrowedHolding) {
      await storage.updateHolding(borrowedHolding.id, {
        amount: (parseFloat(borrowedHolding.amount) + loanData.amount).toString()
      });
    } else {
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        assetType: 'crypto',
        symbol: loanData.assetSymbol,
        name: loanData.assetSymbol,
        amount: loanData.amount.toString(),
        averagePurchasePrice: '0',
        currentPrice: '0'
      });
    }

    res.json(loan);
  } catch (error) {
    console.error('Error creating loan:', error);
    const { formatErrorForResponse } = await import('./lib/errorUtils');
    const formatted = formatErrorForResponse(error);
    if (Array.isArray(formatted)) {
      return res.status(400).json({ message: 'Invalid input data', errors: formatted });
    }
    res.status(500).json({ message: 'Failed to create loan' });
  }
});

// Get user's loans
router.get('/loans', requireAuth, async (req, res) => {
  try {
    const loans = await storage.getUserLoans(req.user!.id);
    res.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ message: 'Failed to fetch loans' });
  }
});

// Repay loan
router.post('/repay/:loanId', requireAuth, async (req, res) => {
  try {
    const { amount } = req.body;

    const loan = await storage.getLoan(req.params.loanId, req.user!.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.status !== 'active') {
      return res.status(400).json({ message: 'Loan is not active' });
    }

    // Calculate interest
    const interest = await calculateLoanInterest(loan);
    const totalOwed = parseFloat(loan.amount) + interest;

    if (amount < totalOwed) {
      return res.status(400).json({
        message: `Insufficient repayment. Total owed: ${totalOwed.toFixed(6)} ${loan.assetSymbol}`
      });
    }

    // Check user has enough assets to repay
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holding = await storage.getHolding(portfolio.id, loan.assetSymbol);
    if (!holding || parseFloat(holding.amount) < totalOwed) {
      return res.status(400).json({ message: 'Insufficient balance to repay loan' });
    }

    // Repay loan
    await storage.updateLoan(req.params.loanId, {
      status: 'repaid',
      repaymentDate: new Date(),
      totalInterest: interest.toString()
    });

    // Deduct repayment from holdings
    await storage.updateHolding(holding.id, {
      amount: (parseFloat(holding.amount) - totalOwed).toString()
    });

    // Release collateral
    const collateralHolding = await storage.getHolding(portfolio.id, loan.collateralSymbol);
    if (collateralHolding) {
      await storage.updateHolding(collateralHolding.id, {
        amount: (parseFloat(collateralHolding.amount) + parseFloat(loan.collateralAmount)).toString()
      });
    }

    res.json({
      message: 'Loan repaid successfully',
      principal: loan.amount,
      interest: interest,
      totalPaid: totalOwed
    });
  } catch (error) {
    console.error('Error repaying loan:', error);
    res.status(500).json({ message: 'Failed to repay loan' });
  }
});

// Withdraw from lending position
router.post('/withdraw/:positionId', requireAuth, async (req, res) => {
  try {
    const position = await storage.getLendingPosition(req.params.positionId, req.user!.id);
    if (!position) {
      return res.status(404).json({ message: 'Lending position not found' });
    }

    if (position.status !== 'active') {
      return res.status(400).json({ message: 'Position is not active' });
    }

    // Calculate earned interest
    const interest = await calculateLendingInterest(position);

    // Update position
    await storage.updateLendingPosition(req.params.positionId, {
      status: 'completed',
      endDate: new Date(),
      totalEarned: interest.toString()
    });

    // Return principal + interest to portfolio
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (portfolio) {
      const holding = await storage.getHolding(portfolio.id, position.assetSymbol);
      if (holding) {
        const newAmount = parseFloat(holding.amount) + parseFloat(position.amount) + interest;
        await storage.updateHolding(holding.id, {
          amount: newAmount.toString()
        });
      }
    }

    res.json({
      message: 'Successfully withdrawn from lending position',
      principal: position.amount,
      interest: interest,
      totalReturned: parseFloat(position.amount) + interest
    });
  } catch (error) {
    console.error('Error withdrawing from lending position:', error);
    res.status(500).json({ message: 'Failed to withdraw from position' });
  }
});

function calculateLoanEndDate(term: string): Date {
  const now = new Date();
  const endDate = new Date(now);

  switch (term) {
    case '7d':
      endDate.setDate(now.getDate() + 7);
      break;
    case '14d':
      endDate.setDate(now.getDate() + 14);
      break;
    case '30d':
      endDate.setDate(now.getDate() + 30);
      break;
    case '60d':
      endDate.setDate(now.getDate() + 60);
      break;
    case '90d':
      endDate.setDate(now.getDate() + 90);
      break;
    case '180d':
      endDate.setDate(now.getDate() + 180);
      break;
  }

  return endDate;
}

async function calculateLoanInterest(loan: any): Promise<number> {
  const startDate = new Date(loan.startDate);
  const now = new Date();
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const annualRate = parseFloat(loan.interestRate) / 100;
  const dailyRate = annualRate / 365;

  const interest = parseFloat(loan.amount) * dailyRate * daysElapsed;
  return Math.max(0, interest);
}

async function calculateLendingInterest(position: any): Promise<number> {
  const startDate = new Date(position.startDate);
  const now = new Date();
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const annualRate = parseFloat(position.apy.replace('%', '')) / 100;
  const dailyRate = annualRate / 365;

  const interest = parseFloat(position.amount) * dailyRate * daysElapsed;
  return Math.max(0, interest);
}

export default router;
