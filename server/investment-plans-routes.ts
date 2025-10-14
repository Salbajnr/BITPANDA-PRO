
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Validation schemas
const investmentSchema = z.object({
  planId: z.string(),
  amount: z.number().positive(),
});

// Get available investment plans
router.get('/', async (req: Request, res: Response) => {
  try {
    // Mock investment plans data
    const plans = [
      {
        id: 'conservative-growth',
        name: 'Conservative Growth',
        description: 'Low-risk investment plan with steady returns',
        minInvestment: 100,
        expectedReturn: 7.5,
        duration: 12,
        riskLevel: 'low',
        category: 'Bonds & Fixed Income',
        features: [
          'Government bonds and high-grade corporate bonds',
          'Capital preservation focus',
          'Quarterly dividends',
          'Low volatility'
        ],
        isActive: true,
        totalInvested: 2500000,
        totalInvestors: 1250
      },
      {
        id: 'balanced-portfolio',
        name: 'Balanced Portfolio',
        description: 'Diversified mix of stocks and bonds for moderate growth',
        minInvestment: 500,
        expectedReturn: 12.0,
        duration: 18,
        riskLevel: 'medium',
        category: 'Mixed Assets',
        features: [
          '60% stocks, 40% bonds allocation',
          'Professional portfolio management',
          'Monthly rebalancing',
          'Global diversification'
        ],
        isActive: true,
        totalInvested: 5750000,
        totalInvestors: 2100
      },
      {
        id: 'growth-equity',
        name: 'Growth Equity',
        description: 'High-growth potential with focus on emerging markets',
        minInvestment: 1000,
        expectedReturn: 18.5,
        duration: 24,
        riskLevel: 'high',
        category: 'Equity',
        features: [
          'Growth stocks and tech companies',
          'Emerging markets exposure',
          'Active management strategy',
          'High potential returns'
        ],
        isActive: true,
        totalInvested: 3200000,
        totalInvestors: 890
      },
      {
        id: 'crypto-diversified',
        name: 'Crypto Diversified',
        description: 'Cryptocurrency portfolio with major digital assets',
        minInvestment: 250,
        expectedReturn: 25.0,
        duration: 12,
        riskLevel: 'high',
        category: 'Cryptocurrency',
        features: [
          'Bitcoin and Ethereum focus',
          'DeFi protocol investments',
          'Institutional custody',
          'Weekly rebalancing'
        ],
        isActive: true,
        totalInvested: 1800000,
        totalInvestors: 720
      },
      {
        id: 'dividend-income',
        name: 'Dividend Income',
        description: 'Focus on dividend-paying stocks for regular income',
        minInvestment: 750,
        expectedReturn: 9.2,
        duration: 15,
        riskLevel: 'medium',
        category: 'Dividend Stocks',
        features: [
          'High dividend yield stocks',
          'Monthly income distribution',
          'Dividend aristocrats focus',
          'Reinvestment options'
        ],
        isActive: true,
        totalInvested: 4100000,
        totalInvestors: 1560
      },
      {
        id: 'esg-sustainable',
        name: 'ESG Sustainable',
        description: 'Environmental, social, and governance focused investments',
        minInvestment: 500,
        expectedReturn: 11.8,
        duration: 20,
        riskLevel: 'medium',
        category: 'ESG',
        features: [
          'Sustainable business practices',
          'Climate-focused investments',
          'Social impact measurement',
          'Long-term value creation'
        ],
        isActive: true,
        totalInvested: 2900000,
        totalInvestors: 1340
      }
    ];

    res.json(plans);
  } catch (error) {
    console.error('Get investment plans error:', error);
    res.status(500).json({ message: 'Failed to fetch investment plans' });
  }
});

// Create investment
router.post('/invest', requireAuth, async (req: Request, res: Response) => {
  try {
    const data = investmentSchema.parse(req.body);
    const userId = req.user!.id;

    // Check if user has sufficient balance


// Update investment
router.put('/my-investments/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { notes, autoReinvest } = req.body;

    const investment = await storage.getInvestmentById(id);
    if (!investment || investment.userId !== userId) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    const updateData: any = {};
    if (notes !== undefined) updateData.notes = notes;
    if (autoReinvest !== undefined) updateData.autoReinvest = autoReinvest;

    const updated = await storage.updateInvestment(id, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({ message: 'Failed to update investment' });
  }
});

// Pause investment
router.post('/my-investments/:id/pause', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const investment = await storage.getInvestmentById(id);
    if (!investment || investment.userId !== userId) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.status !== 'active') {
      return res.status(400).json({ message: 'Only active investments can be paused' });
    }

    const updated = await storage.updateInvestment(id, { status: 'paused' });
    res.json(updated);
  } catch (error) {
    console.error('Pause investment error:', error);
    res.status(500).json({ message: 'Failed to pause investment' });
  }
});

// Resume investment
router.post('/my-investments/:id/resume', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const investment = await storage.getInvestmentById(id);
    if (!investment || investment.userId !== userId) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.status !== 'paused') {
      return res.status(400).json({ message: 'Only paused investments can be resumed' });
    }

    const updated = await storage.updateInvestment(id, { status: 'active' });
    res.json(updated);
  } catch (error) {
    console.error('Resume investment error:', error);
    res.status(500).json({ message: 'Failed to resume investment' });
  }
});

// Cancel/Delete investment (only if status allows)
router.delete('/my-investments/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const investment = await storage.getInvestmentById(id);
    if (!investment || investment.userId !== userId) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    // Only allow cancellation if investment is still active and within grace period
    if (investment.status !== 'active') {
      return res.status(400).json({ message: 'Cannot cancel this investment' });
    }

    // Refund the invested amount
    const portfolio = await storage.getPortfolio(userId);
    if (portfolio) {
      const newCash = parseFloat(portfolio.availableCash) + parseFloat(investment.investedAmount);
      await storage.updatePortfolio(portfolio.id, {
        availableCash: newCash.toString()
      });
    }

    await storage.deleteInvestment(id);
    res.json({ message: 'Investment cancelled successfully', refundedAmount: investment.investedAmount });
  } catch (error) {
    console.error('Cancel investment error:', error);
    res.status(500).json({ message: 'Failed to cancel investment' });
  }
});

// Get single investment details
router.get('/my-investments/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const investment = await storage.getInvestmentById(id);
    if (!investment || investment.userId !== userId) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json(investment);
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({ message: 'Failed to fetch investment' });
  }
});

    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(400).json({ message: 'Portfolio not found' });
    }

    const availableCash = parseFloat(portfolio.availableCash);
    if (availableCash < data.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create investment record
    const investment = await storage.createInvestment({
      userId,
      planId: data.planId,
      investedAmount: data.amount.toString(),
      currentValue: data.amount.toString(),
      startDate: new Date(),
      endDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year from now
      status: 'active',
      expectedReturn: '12.0',
      actualReturn: '0'
    });

    // Update portfolio balance
    const newAvailableCash = availableCash - data.amount;
    await storage.updatePortfolio(portfolio.id, {
      availableCash: newAvailableCash.toString()
    });

    res.json(investment);
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ message: 'Failed to create investment' });
  }
});

// Get user investments
router.get('/my-investments', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const investments = await storage.getUserInvestments(userId);
    res.json(investments);
  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({ message: 'Failed to fetch user investments' });
  }
});

export default router;
