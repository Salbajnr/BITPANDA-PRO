
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
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(400).json({ message: 'Portfolio not found' });
    }

    const availableCash = parseFloat(portfolio.availableCash);
    if (availableCash < data.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create investment record
    const investment = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      planId: data.planId,
      investedAmount: data.amount,
      currentValue: data.amount,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString(), // 1 year from now
      status: 'active',
      expectedReturn: 12.0, // Default expected return
      actualReturn: 0,
      createdAt: new Date().toISOString()
    };

    // Update portfolio balance
    const newAvailableCash = availableCash - data.amount;
    await storage.updatePortfolio(portfolio.id, {
      availableCash: newAvailableCash.toString()
    });

    // Store investment (you might want to add this to your storage layer)
    // For now, we'll simulate success

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

    // Mock user investments data
    const mockInvestments = [
      {
        id: 'inv_1',
        planId: 'balanced-portfolio',
        planName: 'Balanced Portfolio',
        investedAmount: 5000,
        currentValue: 5420,
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2025-01-15T00:00:00.000Z',
        status: 'active',
        expectedReturn: 12.0,
        actualReturn: 8.4
      },
      {
        id: 'inv_2',
        planId: 'dividend-income',
        planName: 'Dividend Income',
        investedAmount: 2500,
        currentValue: 2680,
        startDate: '2024-03-01T00:00:00.000Z',
        endDate: '2025-06-01T00:00:00.000Z',
        status: 'active',
        expectedReturn: 9.2,
        actualReturn: 7.2
      }
    ];

    res.json(mockInvestments);
  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({ message: 'Failed to fetch user investments' });
  }
});

export default router;
