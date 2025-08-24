
import { Router } from "express";
import { requireAuth } from "./simple-auth";
import { storage } from "./storage";
import { z } from "zod";

const router = Router();

const createInvestmentPlanSchema = z.object({
  name: z.string().min(1).max(200),
  assetSymbol: z.string().min(1).max(10),
  assetName: z.string().min(1).max(100),
  assetType: z.enum(['crypto', 'stock', 'etf', 'metal']),
  amount: z.number().min(1),
  frequency: z.enum(['weekly', 'bi-weekly', 'monthly', 'quarterly']),
  isActive: z.boolean().default(true)
});

const updateInvestmentPlanSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  amount: z.number().min(1).optional(),
  frequency: z.enum(['weekly', 'bi-weekly', 'monthly', 'quarterly']).optional(),
  isActive: z.boolean().optional()
});

// Get user's investment plans
router.get('/', requireAuth, async (req, res) => {
  try {
    const plans = await storage.getUserInvestmentPlans(req.user!.id);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching investment plans:', error);
    res.status(500).json({ message: 'Failed to fetch investment plans' });
  }
});

// Create new investment plan
router.post('/', requireAuth, async (req, res) => {
  try {
    const planData = createInvestmentPlanSchema.parse(req.body);
    
    const plan = await storage.createInvestmentPlan({
      ...planData,
      userId: req.user!.id,
      totalInvested: '0',
      currentValue: '0',
      nextExecution: calculateNextExecution(planData.frequency)
    });

    res.json(plan);
  } catch (error) {
    console.error('Error creating investment plan:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create investment plan' });
  }
});

// Update investment plan
router.patch('/:planId', requireAuth, async (req, res) => {
  try {
    const updates = updateInvestmentPlanSchema.parse(req.body);
    
    const plan = await storage.updateInvestmentPlan(req.params.planId, req.user!.id, updates);
    if (!plan) {
      return res.status(404).json({ message: 'Investment plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Error updating investment plan:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update investment plan' });
  }
});

// Delete investment plan
router.delete('/:planId', requireAuth, async (req, res) => {
  try {
    const success = await storage.deleteInvestmentPlan(req.params.planId, req.user!.id);
    if (!success) {
      return res.status(404).json({ message: 'Investment plan not found' });
    }

    res.json({ message: 'Investment plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment plan:', error);
    res.status(500).json({ message: 'Failed to delete investment plan' });
  }
});

// Execute investment plan manually
router.post('/:planId/execute', requireAuth, async (req, res) => {
  try {
    const execution = await storage.executeInvestmentPlan(req.params.planId, req.user!.id);
    if (!execution) {
      return res.status(404).json({ message: 'Investment plan not found or execution failed' });
    }

    res.json(execution);
  } catch (error) {
    console.error('Error executing investment plan:', error);
    res.status(500).json({ message: 'Failed to execute investment plan' });
  }
});

// Get investment plan execution history
router.get('/:planId/history', requireAuth, async (req, res) => {
  try {
    const history = await storage.getInvestmentPlanHistory(req.params.planId, req.user!.id);
    res.json(history);
  } catch (error) {
    console.error('Error fetching investment plan history:', error);
    res.status(500).json({ message: 'Failed to fetch execution history' });
  }
});

function calculateNextExecution(frequency: string): string {
  const now = new Date();
  const next = new Date(now);

  switch (frequency) {
    case 'weekly':
      next.setDate(now.getDate() + 7);
      break;
    case 'bi-weekly':
      next.setDate(now.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(now.getMonth() + 3);
      break;
  }

  return next.toISOString().split('T')[0];
}

export default router;
