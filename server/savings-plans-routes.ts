
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { supabaseDB } from './supabase-db-service';

const router = Router();

const savingsPlanSchema = z.object({
  planId: z.string(),
  amount: z.number().positive(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  duration: z.number().positive(),
  autoDeposit: z.boolean(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    let plans = await supabaseDB.getActiveSavingsPlans();

    if (!plans || plans.length === 0) {
      const defaultPlans = [
        {
          plan_id: 'basic-saver',
          name: 'Basic Saver',
          description: 'Start your savings journey with our entry-level plan',
          min_amount: 10,
          interest_rate: 3.5,
          category: 'Beginner'
        },
        {
          plan_id: 'smart-saver',
          name: 'Smart Saver',
          description: 'Intelligent savings with automated optimization',
          min_amount: 50,
          interest_rate: 4.2,
          category: 'Popular'
        },
        {
          plan_id: 'premium-saver',
          name: 'Premium Saver',
          description: 'Maximum returns for serious savers',
          min_amount: 100,
          interest_rate: 5.8,
          category: 'Premium'
        },
        {
          plan_id: 'goal-oriented',
          name: 'Goal-Oriented Saver',
          description: 'Save for specific life goals with targeted strategies',
          min_amount: 25,
          interest_rate: 4.0,
          category: 'Goal-Based'
        },
        {
          plan_id: 'emergency-fund',
          name: 'Emergency Fund Builder',
          description: 'Build your financial safety net systematically',
          min_amount: 20,
          interest_rate: 3.8,
          category: 'Emergency'
        },
        {
          plan_id: 'vacation-saver',
          name: 'Vacation Saver',
          description: 'Save for your dream vacation with travel-focused benefits',
          min_amount: 30,
          interest_rate: 4.5,
          category: 'Lifestyle'
        }
      ];

      for (const plan of defaultPlans) {
        try {
          await supabaseDB.createSavingsPlan(plan);
        } catch (error) {
          console.warn(`Failed to create plan ${plan.plan_id}:`, error);
        }
      }

      plans = await supabaseDB.getActiveSavingsPlans();
    }

    res.json(plans);
  } catch (error) {
    console.error('Get savings plans error:', error);
    res.status(500).json({ message: 'Failed to fetch savings plans' });
  }
});

router.post('/create', requireAuth, async (req: Request, res: Response) => {
  try {
    const data = savingsPlanSchema.parse(req.body);
    const userId = req.user!.id;

    const savingsPlan = await supabaseDB.createUserSavingsPlan({
      user_id: userId,
      plan_id: data.planId,
      amount: data.amount,
      frequency: data.frequency,
      duration_months: data.duration
    });

    res.json(savingsPlan);
  } catch (error) {
    console.error('Create savings plan error:', error);
    res.status(500).json({ message: 'Failed to create savings plan' });
  }
});

router.get('/my-plans', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const plans = await supabaseDB.getUserSavingsPlans(userId);
    res.json(plans);
  } catch (error) {
    console.error('Get user savings plans error:', error);
    res.status(500).json({ message: 'Failed to fetch user savings plans' });
  }
});

router.put('/:planId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = req.user!.id;
    const { amount, frequency, autoDeposit } = req.body;

    const plan = await storage.getSavingsPlanById(planId);
    if (!plan || plan.userId !== userId) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    const updateData: any = {};
    if (amount) updateData.amount = parseFloat(amount);
    if (frequency) updateData.frequency = frequency;
    if (autoDeposit !== undefined) updateData.auto_deposit = autoDeposit;

    const updated = await storage.updateSavingsPlan(planId, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Update savings plan error:', error);
    res.status(500).json({ message: 'Failed to update savings plan' });
  }
});

router.delete('/:planId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = req.user!.id;

    const plan = await storage.getSavingsPlanById(planId);
    if (!plan || plan.userId !== userId) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    await storage.deleteSavingsPlan(planId);
    res.json({ message: 'Savings plan cancelled successfully' });
  } catch (error) {
    console.error('Delete savings plan error:', error);
    res.status(500).json({ message: 'Failed to delete savings plan' });
  }
});

router.get('/:planId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = req.user!.id;

    const plan = await storage.getSavingsPlanById(planId);
    if (!plan || plan.userId !== userId) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Get savings plan error:', error);
    res.status(500).json({ message: 'Failed to fetch savings plan' });
  }
});

router.post('/:planId/pause', requireAuth, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = req.user!.id;

    const plan = await storage.getSavingsPlanById(planId);
    if (!plan || plan.userId !== userId) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    if (plan.status !== 'active') {
      return res.status(400).json({ message: 'Only active plans can be paused' });
    }

    const updated = await storage.updateSavingsPlan(planId, { status: 'paused' });
    res.json(updated);
  } catch (error) {
    console.error('Pause savings plan error:', error);
    res.status(500).json({ message: 'Failed to pause savings plan' });
  }
});

router.post('/:planId/resume', requireAuth, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = req.user!.id;

    const plan = await storage.getSavingsPlanById(planId);
    if (!plan || plan.userId !== userId) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    if (plan.status !== 'paused') {
      return res.status(400).json({ message: 'Only paused plans can be resumed' });
    }

    const updated = await storage.updateSavingsPlan(planId, { status: 'active' });
    res.json(updated);
  } catch (error) {
    console.error('Resume savings plan error:', error);
    res.status(500).json({ message: 'Failed to resume savings plan' });
  }
});

router.post('/:planId/withdraw', requireAuth, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = req.user!.id;
    const { amount } = req.body;

    const plan = await storage.getSavingsPlanById(planId);
    if (!plan || plan.userId !== userId) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    const totalSaved = parseFloat(plan.totalSaved);
    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount > totalSaved) {
      return res.status(400).json({ message: 'Insufficient balance in savings plan' });
    }

    const newBalance = totalSaved - withdrawAmount;
    await storage.updateSavingsPlan(planId, {
      totalSaved: newBalance.toString(),
      status: newBalance === 0 ? 'completed' : plan.status
    });

    const portfolio = await storage.getPortfolio(userId);
    if (portfolio) {
      const newCash = parseFloat(portfolio.availableCash) + withdrawAmount;
      await storage.updatePortfolio(portfolio.id, {
        availableCash: newCash.toString()
      });
    }

    res.json({
      message: 'Withdrawal successful',
      withdrawnAmount: withdrawAmount,
      remainingBalance: newBalance
    });
  } catch (error) {
    console.error('Withdraw from savings error:', error);
    res.status(500).json({ message: 'Failed to withdraw from savings plan' });
  }
});

export default router;
