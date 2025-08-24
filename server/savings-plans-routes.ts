
import { Router } from "express";
import { requireAuth } from "./simple-auth";
import { storage } from "./storage";
import { z } from "zod";

const router = Router();

const createSavingsPlanSchema = z.object({
  name: z.string().min(1).max(200),
  goal: z.string().min(1).max(100),
  targetAmount: z.number().min(1),
  monthlyContribution: z.number().min(1),
  timeHorizon: z.number().min(1).max(50),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive', 'crypto']),
  autoInvest: z.boolean().default(true)
});

const updateSavingsPlanSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  targetAmount: z.number().min(1).optional(),
  monthlyContribution: z.number().min(1).optional(),
  timeHorizon: z.number().min(1).max(50).optional(),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive', 'crypto']).optional(),
  autoInvest: z.boolean().optional(),
  isActive: z.boolean().optional()
});

// Get user's savings plans
router.get('/', requireAuth, async (req, res) => {
  try {
    const plans = await storage.getUserSavingsPlans(req.user!.id);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching savings plans:', error);
    res.status(500).json({ message: 'Failed to fetch savings plans' });
  }
});

// Create new savings plan
router.post('/', requireAuth, async (req, res) => {
  try {
    const planData = createSavingsPlanSchema.parse(req.body);
    
    const plan = await storage.createSavingsPlan({
      ...planData,
      userId: req.user!.id,
      currentAmount: '0',
      totalContributions: '0',
      expectedReturn: calculateExpectedReturn(planData.riskTolerance),
      projectedValue: calculateProjectedValue(planData.monthlyContribution, planData.timeHorizon, planData.riskTolerance)
    });

    res.json(plan);
  } catch (error) {
    console.error('Error creating savings plan:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create savings plan' });
  }
});

// Update savings plan
router.patch('/:planId', requireAuth, async (req, res) => {
  try {
    const updates = updateSavingsPlanSchema.parse(req.body);
    
    const plan = await storage.updateSavingsPlan(req.params.planId, req.user!.id, updates);
    if (!plan) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Error updating savings plan:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update savings plan' });
  }
});

// Delete savings plan
router.delete('/:planId', requireAuth, async (req, res) => {
  try {
    const success = await storage.deleteSavingsPlan(req.params.planId, req.user!.id);
    if (!success) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    res.json({ message: 'Savings plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting savings plan:', error);
    res.status(500).json({ message: 'Failed to delete savings plan' });
  }
});

// Make contribution to savings plan
router.post('/:planId/contribute', requireAuth, async (req, res) => {
  try {
    const { amount, isScheduled = false } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid contribution amount' });
    }

    const contribution = await storage.addSavingsPlanContribution(req.params.planId, req.user!.id, amount, isScheduled);
    if (!contribution) {
      return res.status(404).json({ message: 'Savings plan not found or contribution failed' });
    }

    res.json(contribution);
  } catch (error) {
    console.error('Error adding contribution:', error);
    res.status(500).json({ message: 'Failed to add contribution' });
  }
});

// Get savings plan performance
router.get('/:planId/performance', requireAuth, async (req, res) => {
  try {
    const performance = await storage.getSavingsPlanPerformance(req.params.planId, req.user!.id);
    if (!performance) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    res.json(performance);
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
});

function calculateExpectedReturn(riskTolerance: string): string {
  const returns = {
    'conservative': '3-5%',
    'moderate': '5-8%', 
    'aggressive': '8-12%',
    'crypto': '10-15%'
  };
  return returns[riskTolerance as keyof typeof returns] || '5-8%';
}

function calculateProjectedValue(monthlyContribution: number, timeHorizon: number, riskTolerance: string): string {
  const annualRates = {
    'conservative': 0.04,
    'moderate': 0.065,
    'aggressive': 0.10,
    'crypto': 0.125
  };
  
  const rate = annualRates[riskTolerance as keyof typeof annualRates] || 0.065;
  const monthlyRate = rate / 12;
  const totalMonths = timeHorizon * 12;
  
  // Future value of annuity formula
  const futureValue = monthlyContribution * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate);
  
  return futureValue.toFixed(2);
}

export default router;
