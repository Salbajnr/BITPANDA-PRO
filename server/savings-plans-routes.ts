
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Validation schemas
const savingsPlanSchema = z.object({
  planId: z.string(),
  amount: z.number().positive(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  duration: z.number().positive(),
  autoDeposit: z.boolean(),
});

// Get available savings plans
router.get('/', async (req: Request, res: Response) => {
  try {
    // Mock savings plans data
    const plans = [
      {
        id: 'basic-saver',
        name: 'Basic Saver',
        description: 'Start your savings journey with our entry-level plan',
        minAmount: 10,
        maxAmount: 500,
        frequency: 'monthly',
        interestRate: 3.5,
        compounding: 'monthly',
        minDuration: 6,
        maxDuration: 60,
        category: 'Beginner',
        features: [
          'No minimum balance fees',
          'Easy withdrawal access',
          'Mobile app integration',
          'Educational resources'
        ],
        isActive: true
      },
      {
        id: 'smart-saver',
        name: 'Smart Saver',
        description: 'Intelligent savings with automated optimization',
        minAmount: 50,
        maxAmount: 2000,
        frequency: 'weekly',
        interestRate: 4.2,
        compounding: 'monthly',
        minDuration: 12,
        maxDuration: 60,
        category: 'Popular',
        features: [
          'AI-powered saving recommendations',
          'Automatic round-up features',
          'Goal-based saving targets',
          'Higher interest rates'
        ],
        isActive: true
      },
      {
        id: 'premium-saver',
        name: 'Premium Saver',
        description: 'Maximum returns for serious savers',
        minAmount: 100,
        maxAmount: 5000,
        frequency: 'daily',
        interestRate: 5.8,
        compounding: 'quarterly',
        minDuration: 24,
        maxDuration: 120,
        category: 'Premium',
        features: [
          'Premium interest rates',
          'Dedicated savings advisor',
          'Flexible withdrawal options',
          'Investment opportunities'
        ],
        isActive: true
      },
      {
        id: 'goal-oriented',
        name: 'Goal-Oriented Saver',
        description: 'Save for specific life goals with targeted strategies',
        minAmount: 25,
        maxAmount: 1000,
        frequency: 'monthly',
        interestRate: 4.0,
        compounding: 'monthly',
        minDuration: 6,
        maxDuration: 60,
        category: 'Goal-Based',
        features: [
          'Customizable saving goals',
          'Progress tracking',
          'Milestone rewards',
          'Flexible contributions'
        ],
        isActive: true
      },
      {
        id: 'emergency-fund',
        name: 'Emergency Fund Builder',
        description: 'Build your financial safety net systematically',
        minAmount: 20,
        maxAmount: 800,
        frequency: 'weekly',
        interestRate: 3.8,
        compounding: 'monthly',
        minDuration: 3,
        maxDuration: 36,
        category: 'Emergency',
        features: [
          'Quick access when needed',
          'No penalties for emergency withdrawals',
          'Automatic emergency detection',
          'Financial planning tools'
        ],
        isActive: true
      },
      {
        id: 'vacation-saver',
        name: 'Vacation Saver',
        description: 'Save for your dream vacation with travel-focused benefits',
        minAmount: 30,
        maxAmount: 1500,
        frequency: 'monthly',
        interestRate: 4.5,
        compounding: 'monthly',
        minDuration: 6,
        maxDuration: 24,
        category: 'Lifestyle',
        features: [
          'Travel reward partnerships',
          'Currency conversion tools',
          'Destination planning assistance',
          'Bonus interest for travel goals'
        ],
        isActive: true
      }
    ];

    res.json(plans);
  } catch (error) {
    console.error('Get savings plans error:', error);
    res.status(500).json({ message: 'Failed to fetch savings plans' });
  }
});

// Create savings plan
router.post('/create', requireAuth, async (req: Request, res: Response) => {
  try {
    const data = savingsPlanSchema.parse(req.body);
    const userId = req.user!.id;

    // Create savings plan record
    const savingsPlan = await storage.createSavingsPlan({
      userId,
      planId: data.planId,
      amount: data.amount.toString(),
      frequency: data.frequency,
      duration: data.duration,
      autoDeposit: data.autoDeposit,
      nextDeposit: new Date(Date.now() + (24 * 60 * 60 * 1000)), // Tomorrow
      startDate: new Date(),
      endDate: new Date(Date.now() + (data.duration * 30 * 24 * 60 * 60 * 1000)),
      totalSaved: '0',
      interestEarned: '0',
      status: 'active'
    });

    res.json(savingsPlan);
  } catch (error) {
    console.error('Create savings plan error:', error);
    res.status(500).json({ message: 'Failed to create savings plan' });
  }
});

// Get user savings plans
router.get('/my-plans', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const plans = await storage.getUserSavingsPlans(userId);
    res.json(plans);
  } catch (error) {
    console.error('Get user savings plans error:', error);
    res.status(500).json({ message: 'Failed to fetch user savings plans' });
  }
});

// Update savings plan
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
    if (autoDeposit !== undefined) updateData.autoDeposit = autoDeposit;

    const updated = await storage.updateSavingsPlan(planId, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Update savings plan error:', error);
    res.status(500).json({ message: 'Failed to update savings plan' });
  }
});

// Delete/Cancel savings plan
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

// Get single savings plan
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


    // Pause savings plan
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

// Resume savings plan
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

// Withdraw from savings plan
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

    // Update plan balance
    const newBalance = totalSaved - withdrawAmount;
    await storage.updateSavingsPlan(planId, { 
      totalSaved: newBalance.toString(),
      status: newBalance === 0 ? 'completed' : plan.status
    });

    // Add funds back to portfolio
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
