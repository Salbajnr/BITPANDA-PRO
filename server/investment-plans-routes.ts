
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { supabaseDB } from './supabase-db-service';

const router = Router();

const investmentSchema = z.object({
  planId: z.string(),
  amount: z.number().positive(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    let plans = await supabaseDB.getActiveInvestmentPlans();

    if (!plans || plans.length === 0) {
      const defaultPlans = [
        {
          plan_id: 'conservative-growth',
          name: 'Conservative Growth',
          description: 'Low-risk investment plan with steady returns',
          min_investment: 100,
          expected_return: 7.5,
          duration_months: 12,
          risk_level: 'low',
          category: 'Bonds & Fixed Income',
          features: ['Government bonds', 'Capital preservation', 'Quarterly dividends', 'Low volatility']
        },
        {
          plan_id: 'balanced-portfolio',
          name: 'Balanced Portfolio',
          description: 'Diversified mix of stocks and bonds',
          min_investment: 500,
          expected_return: 12.0,
          duration_months: 18,
          risk_level: 'medium',
          category: 'Mixed Assets',
          features: ['60/40 allocation', 'Professional management', 'Monthly rebalancing', 'Global diversification']
        },
        {
          plan_id: 'growth-equity',
          name: 'Growth Equity',
          description: 'High-growth potential with emerging markets focus',
          min_investment: 1000,
          expected_return: 18.5,
          duration_months: 24,
          risk_level: 'high',
          category: 'Equity',
          features: ['Growth stocks', 'Emerging markets', 'Active management', 'High returns']
        },
        {
          plan_id: 'crypto-diversified',
          name: 'Crypto Diversified',
          description: 'Cryptocurrency portfolio with major digital assets',
          min_investment: 250,
          expected_return: 25.0,
          duration_months: 12,
          risk_level: 'high',
          category: 'Cryptocurrency',
          features: ['Bitcoin & Ethereum', 'DeFi protocols', 'Institutional custody', 'Weekly rebalancing']
        },
        {
          plan_id: 'dividend-income',
          name: 'Dividend Income',
          description: 'Focus on dividend-paying stocks for regular income',
          min_investment: 750,
          expected_return: 9.2,
          duration_months: 15,
          risk_level: 'medium',
          category: 'Dividend Stocks',
          features: ['High yield stocks', 'Monthly distribution', 'Dividend aristocrats', 'Reinvestment options']
        },
        {
          plan_id: 'esg-sustainable',
          name: 'ESG Sustainable',
          description: 'Environmental, social, and governance focused investments',
          min_investment: 500,
          expected_return: 11.8,
          duration_months: 20,
          risk_level: 'medium',
          category: 'ESG',
          features: ['Sustainable practices', 'Climate focus', 'Social impact', 'Long-term value']
        }
      ];

      for (const plan of defaultPlans) {
        try {
          await supabaseDB.createInvestmentPlan(plan);
        } catch (error) {
          console.warn(`Failed to create plan ${plan.plan_id}:`, error);
        }
      }

      plans = await supabaseDB.getActiveInvestmentPlans();
    }

    res.json(plans);
  } catch (error) {
    console.error('Get investment plans error:', error);
    res.status(500).json({ message: 'Failed to fetch investment plans' });
  }
});

router.post('/invest', requireAuth, async (req: Request, res: Response) => {
  try {
    const data = investmentSchema.parse(req.body);
    const userId = req.user!.id;

    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(400).json({ message: 'Portfolio not found' });
    }

    const availableCash = parseFloat(portfolio.availableCash);
    if (availableCash < data.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const investment = await supabaseDB.createUserInvestment({
      user_id: userId,
      plan_id: data.planId,
      invested_amount: data.amount,
      expected_return: 12.0,
      start_date: new Date().toISOString(),
      duration_months: 12
    });

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
    if (autoReinvest !== undefined) updateData.auto_reinvest = autoReinvest;

    const updated = await supabaseDB.updateUserInvestment(id, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({ message: 'Failed to update investment' });
  }
});

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

    const updated = await supabaseDB.updateUserInvestment(id, { status: 'paused' });
    res.json(updated);
  } catch (error) {
    console.error('Pause investment error:', error);
    res.status(500).json({ message: 'Failed to pause investment' });
  }
});

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

    const updated = await supabaseDB.updateUserInvestment(id, { status: 'active' });
    res.json(updated);
  } catch (error) {
    console.error('Resume investment error:', error);
    res.status(500).json({ message: 'Failed to resume investment' });
  }
});

router.delete('/my-investments/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const investment = await storage.getInvestmentById(id);
    if (!investment || investment.userId !== userId) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.status !== 'active') {
      return res.status(400).json({ message: 'Cannot cancel this investment' });
    }

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

router.get('/my-investments', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const investments = await supabaseDB.getUserInvestments(userId);
    res.json(investments);
  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({ message: 'Failed to fetch user investments' });
  }
});

export default router;
