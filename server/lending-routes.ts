
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

const lendSchema = z.object({
  symbol: z.string(),
  amount: z.string(),
  interestRate: z.string(),
  duration: z.number().min(1).max(365) // days
});

const borrowSchema = z.object({
  symbol: z.string(),
  amount: z.string(),
  collateralSymbol: z.string(),
  collateralAmount: z.string(),
  duration: z.number().min(1).max(365)
});

// Create lending offer
router.post('/lend', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const lendData = lendSchema.parse(req.body);
    
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user has sufficient balance
    const holding = await storage.getHolding(portfolio.id, lendData.symbol);
    if (!holding || parseFloat(holding.amount) < parseFloat(lendData.amount)) {
      return res.status(400).json({ message: "Insufficient balance to lend" });
    }

    // Create lending offer
    const lendingOffer = await storage.createLendingOffer({
      lenderId: userId,
      symbol: lendData.symbol,
      amount: lendData.amount,
      interestRate: parseFloat(lendData.interestRate),
      duration: lendData.duration,
      status: 'active',
      createdAt: new Date()
    });

    // Lock the lending amount
    const newAmount = parseFloat(holding.amount) - parseFloat(lendData.amount);
    await storage.upsertHolding({
      portfolioId: portfolio.id,
      symbol: lendData.symbol,
      name: holding.name,
      amount: newAmount.toString(),
      averagePurchasePrice: holding.averagePurchasePrice,
      currentPrice: holding.currentPrice,
    });

    res.json(lendingOffer);
  } catch (error) {
    console.error("Lending error:", error);
    res.status(500).json({ message: "Failed to create lending offer" });
  }
});

// Borrow cryptocurrency
router.post('/borrow', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const borrowData = borrowSchema.parse(req.body);
    
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check collateral
    const collateralHolding = await storage.getHolding(portfolio.id, borrowData.collateralSymbol);
    if (!collateralHolding || parseFloat(collateralHolding.amount) < parseFloat(borrowData.collateralAmount)) {
      return res.status(400).json({ message: "Insufficient collateral" });
    }

    // Find available lending offers
    const availableOffers = await storage.getAvailableLendingOffers(borrowData.symbol, borrowData.amount);
    if (availableOffers.length === 0) {
      return res.status(400).json({ message: "No available lending offers for this amount" });
    }

    const bestOffer = availableOffers[0]; // Assume sorted by best rate

    // Create borrowing record
    const borrowRecord = await storage.createBorrowingRecord({
      borrowerId: userId,
      lenderId: bestOffer.lenderId,
      lendingOfferId: bestOffer.id,
      symbol: borrowData.symbol,
      amount: borrowData.amount,
      collateralSymbol: borrowData.collateralSymbol,
      collateralAmount: borrowData.collateralAmount,
      interestRate: bestOffer.interestRate,
      duration: borrowData.duration,
      startDate: new Date(),
      endDate: new Date(Date.now() + borrowData.duration * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    // Lock collateral and give borrowed amount
    const newCollateralAmount = parseFloat(collateralHolding.amount) - parseFloat(borrowData.collateralAmount);
    await storage.upsertHolding({
      portfolioId: portfolio.id,
      symbol: borrowData.collateralSymbol,
      name: collateralHolding.name,
      amount: newCollateralAmount.toString(),
      averagePurchasePrice: collateralHolding.averagePurchasePrice,
      currentPrice: collateralHolding.currentPrice,
    });

    // Add borrowed amount to portfolio
    const borrowedHolding = await storage.getHolding(portfolio.id, borrowData.symbol);
    if (borrowedHolding) {
      const newAmount = parseFloat(borrowedHolding.amount) + parseFloat(borrowData.amount);
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: borrowData.symbol,
        name: borrowedHolding.name,
        amount: newAmount.toString(),
        averagePurchasePrice: borrowedHolding.averagePurchasePrice,
        currentPrice: borrowedHolding.currentPrice,
      });
    } else {
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: borrowData.symbol,
        name: borrowData.symbol,
        amount: borrowData.amount,
        averagePurchasePrice: '0',
        currentPrice: '0',
      });
    }

    res.json(borrowRecord);
  } catch (error) {
    console.error("Borrowing error:", error);
    res.status(500).json({ message: "Failed to borrow cryptocurrency" });
  }
});

// Get lending offers
router.get('/offers', async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string;
    const offers = await storage.getLendingOffers(symbol);
    res.json(offers);
  } catch (error) {
    console.error("Get offers error:", error);
    res.status(500).json({ message: "Failed to fetch lending offers" });
  }
});

// Get user's lending history
router.get('/lending-history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const history = await storage.getUserLendingHistory(userId);
    res.json(history);
  } catch (error) {
    console.error("Lending history error:", error);
    res.status(500).json({ message: "Failed to fetch lending history" });
  }
});

// Get user's borrowing history
router.get('/borrowing-history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const history = await storage.getUserBorrowingHistory(userId);
    res.json(history);
  } catch (error) {
    console.error("Borrowing history error:", error);
    res.status(500).json({ message: "Failed to fetch borrowing history" });
  }
});

// Repay loan
router.post('/repay/:borrowId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const borrowId = req.params.borrowId;
    
    const borrowRecord = await storage.getBorrowingRecord(borrowId);
    if (!borrowRecord || borrowRecord.borrowerId !== userId) {
      return res.status(404).json({ message: "Borrowing record not found" });
    }

    if (borrowRecord.status !== 'active') {
      return res.status(400).json({ message: "Loan is not active" });
    }

    // Calculate total repayment amount (principal + interest)
    const principal = parseFloat(borrowRecord.amount);
    const daysElapsed = Math.floor((Date.now() - new Date(borrowRecord.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const interest = (principal * borrowRecord.interestRate / 100) * (daysElapsed / 365);
    const totalRepayment = principal + interest;

    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user has enough to repay
    const holding = await storage.getHolding(portfolio.id, borrowRecord.symbol);
    if (!holding || parseFloat(holding.amount) < totalRepayment) {
      return res.status(400).json({ message: "Insufficient balance to repay loan" });
    }

    // Deduct repayment amount
    const newAmount = parseFloat(holding.amount) - totalRepayment;
    await storage.upsertHolding({
      portfolioId: portfolio.id,
      symbol: borrowRecord.symbol,
      name: holding.name,
      amount: newAmount.toString(),
      averagePurchasePrice: holding.averagePurchasePrice,
      currentPrice: holding.currentPrice,
    });

    // Return collateral
    const collateralHolding = await storage.getHolding(portfolio.id, borrowRecord.collateralSymbol);
    if (collateralHolding) {
      const newCollateralAmount = parseFloat(collateralHolding.amount) + parseFloat(borrowRecord.collateralAmount);
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: borrowRecord.collateralSymbol,
        name: collateralHolding.name,
        amount: newCollateralAmount.toString(),
        averagePurchasePrice: collateralHolding.averagePurchasePrice,
        currentPrice: collateralHolding.currentPrice,
      });
    }

    // Update borrowing record
    await storage.updateBorrowingRecord(borrowId, {
      status: 'repaid',
      repaidAt: new Date(),
      totalRepayment,
      interestPaid: interest
    });

    res.json({ 
      message: "Loan repaid successfully",
      totalRepayment,
      interest,
      collateralReturned: borrowRecord.collateralAmount
    });
  } catch (error) {
    console.error("Repay loan error:", error);
    res.status(500).json({ message: "Failed to repay loan" });
  }
});

export default router;
