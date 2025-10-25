
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Admin middleware
const requireAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const user = await storage.getUser(req.user!.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Authorization failed' });
  }
};

// Validation schemas
const investmentPlanSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  minInvestment: z.number().positive(),
  expectedReturn: z.number(),
  duration: z.number().positive(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  category: z.string(),
  features: z.array(z.string()),
  isActive: z.boolean(),
  totalInvested: z.number().optional(),
  totalInvestors: z.number().optional(),
});

const savingsPlanSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  minAmount: z.number().positive(),
  maxAmount: z.number().positive(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  interestRate: z.number(),
  compounding: z.enum(['monthly', 'quarterly', 'annually']),
  minDuration: z.number().positive(),
  maxDuration: z.number().positive(),
  category: z.string(),
  features: z.array(z.string()),
  isActive: z.boolean(),
});

// Get all investment plan templates
router.get('/investment-plans/templates', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const templates = await storage.getInvestmentPlanTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Get investment plan templates error:', error);
    res.status(500).json({ message: 'Failed to fetch investment plan templates' });
  }
});

// Create investment plan template
router.post('/investment-plans/templates', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = investmentPlanSchema.parse(req.body);
    const template = await storage.createInvestmentPlanTemplate(data);
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'create_investment_plan_template',
      details: { planName: data.name },
      timestamp: new Date()
    });

    res.json(template);
  } catch (error) {
    console.error('Create investment plan template error:', error);
    res.status(500).json({ message: 'Failed to create investment plan template' });
  }
});

// Update investment plan template
router.put('/investment-plans/templates/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = investmentPlanSchema.partial().parse(req.body);
    const template = await storage.updateInvestmentPlanTemplate(id, data);
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'update_investment_plan_template',
      targetId: id,
      details: data,
      timestamp: new Date()
    });

    res.json(template);
  } catch (error) {
    console.error('Update investment plan template error:', error);
    res.status(500).json({ message: 'Failed to update investment plan template' });
  }
});

// Delete investment plan template
router.delete('/investment-plans/templates/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.deleteInvestmentPlanTemplate(id);
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'delete_investment_plan_template',
      targetId: id,
      timestamp: new Date()
    });

    res.json({ message: 'Investment plan template deleted successfully' });
  } catch (error) {
    console.error('Delete investment plan template error:', error);
    res.status(500).json({ message: 'Failed to delete investment plan template' });
  }
});

// Get all savings plan templates
router.get('/savings-plans/templates', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const templates = await storage.getSavingsPlanTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Get savings plan templates error:', error);
    res.status(500).json({ message: 'Failed to fetch savings plan templates' });
  }
});

// Create savings plan template
router.post('/savings-plans/templates', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = savingsPlanSchema.parse(req.body);
    const template = await storage.createSavingsPlanTemplate(data);
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'create_savings_plan_template',
      details: { planName: data.name },
      timestamp: new Date()
    });

    res.json(template);
  } catch (error) {
    console.error('Create savings plan template error:', error);
    res.status(500).json({ message: 'Failed to create savings plan template' });
  }
});

// Update savings plan template
router.put('/savings-plans/templates/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = savingsPlanSchema.partial().parse(req.body);
    const template = await storage.updateSavingsPlanTemplate(id, data);
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'update_savings_plan_template',
      targetId: id,
      details: data,
      timestamp: new Date()
    });

    res.json(template);
  } catch (error) {
    console.error('Update savings plan template error:', error);
    res.status(500).json({ message: 'Failed to update savings plan template' });
  }
});

// Delete savings plan template
router.delete('/savings-plans/templates/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.deleteSavingsPlanTemplate(id);
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'delete_savings_plan_template',
      targetId: id,
      timestamp: new Date()
    });

    res.json({ message: 'Savings plan template deleted successfully' });
  } catch (error) {
    console.error('Delete savings plan template error:', error);
    res.status(500).json({ message: 'Failed to delete savings plan template' });
  }
});

// Get all user investment plans (for admin oversight)
router.get('/investment-plans/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const plans = await storage.getAllUserInvestmentPlans();
    res.json(plans);
  } catch (error) {
    console.error('Get all user investment plans error:', error);
    res.status(500).json({ message: 'Failed to fetch user investment plans' });
  }
});

// Get all user savings plans (for admin oversight)
router.get('/savings-plans/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const plans = await storage.getAllUserSavingsPlans();
    res.json(plans);
  } catch (error) {
    console.error('Get all user savings plans error:', error);
    res.status(500).json({ message: 'Failed to fetch user savings plans' });
  }
});

// Update user investment plan returns
router.put('/investment-plans/users/:planId/returns', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const { actualReturn, currentValue } = req.body;
    
    await storage.updateInvestmentPlanReturns(planId, {
      actualReturn: actualReturn.toString(),
      currentValue: currentValue.toString(),
    });
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'update_investment_returns',
      targetId: planId,
      details: { actualReturn, currentValue },
      timestamp: new Date()
    });

    res.json({ message: 'Investment returns updated successfully' });
  } catch (error) {
    console.error('Update investment returns error:', error);
    res.status(500).json({ message: 'Failed to update investment returns' });
  }
});

// Update user savings plan interest
router.put('/savings-plans/users/:planId/interest', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const { interestEarned, totalSaved } = req.body;
    
    await storage.updateSavingsPlanInterest(planId, {
      interestEarned: interestEarned.toString(),
      totalSaved: totalSaved.toString(),
    });
    
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'update_savings_interest',
      targetId: planId,
      details: { interestEarned, totalSaved },
      timestamp: new Date()
    });

    res.json({ message: 'Savings interest updated successfully' });
  } catch (error) {
    console.error('Update savings interest error:', error);
    res.status(500).json({ message: 'Failed to update savings interest' });
  }
});

export default router;
