
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

// KYC submission schema
const kycSubmissionSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string(),
  nationality: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phoneNumber: z.string().min(1),
  documentType: z.enum(['passport', 'driver_license', 'national_id']),
  documentNumber: z.string().min(1),
  documentFrontImageUrl: z.string().optional(),
  documentBackImageUrl: z.string().optional(),
  selfieImageUrl: z.string().optional(),
});

// User endpoints - Submit KYC
router.post('/submit', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = kycSubmissionSchema.parse(req.body);

    // Check if KYC already exists
    const existingKyc = await storage.getKycVerification(userId);
    if (existingKyc && existingKyc.status !== 'rejected') {
      return res.status(400).json({ 
        message: 'KYC verification already submitted or approved' 
      });
    }

    const kycData = {
      userId,
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      status: 'pending' as const,
      documentFrontImageUrl: data.documentFrontImageUrl || 'placeholder-front.jpg',
      selfieImageUrl: data.selfieImageUrl || 'placeholder-selfie.jpg',
    };

    let kyc;
    if (existingKyc) {
      // Update existing rejected KYC
      kyc = await storage.updateKycVerification(existingKyc.id, kycData);
    } else {
      // Create new KYC
      kyc = await storage.createKycVerification(kycData);
    }

    res.json({ message: 'KYC submitted successfully', kyc });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ message: 'Failed to submit KYC verification' });
  }
});

// User endpoints - Get KYC status
router.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const kyc = await storage.getKycVerification(userId);
    
    if (!kyc) {
      return res.status(404).json({ message: 'No KYC verification found' });
    }

    res.json(kyc);
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ message: 'Failed to fetch KYC status' });
  }
});

// User endpoints - Update KYC
router.patch('/update', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = kycSubmissionSchema.partial().parse(req.body);

    const existingKyc = await storage.getKycVerification(userId);
    if (!existingKyc) {
      return res.status(404).json({ message: 'No KYC verification found' });
    }

    if (existingKyc.status === 'approved') {
      return res.status(400).json({ message: 'Cannot update approved KYC' });
    }

    const updateData = {
      ...data,
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      status: 'pending' as const,
    };

    const updatedKyc = await storage.updateKycVerification(existingKyc.id, updateData);
    res.json(updatedKyc);
  } catch (error) {
    console.error('Update KYC error:', error);
    res.status(500).json({ message: 'Failed to update KYC verification' });
  }
});

// Admin endpoints - Get all KYC verifications
router.get('/admin/verifications', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const verifications = await storage.getAllKycVerifications({ 
      page, 
      limit, 
      status, 
      search 
    });

    res.json(verifications);
  } catch (error) {
    console.error('Get KYC verifications error:', error);
    res.status(500).json({ message: 'Failed to fetch KYC verifications' });
  }
});

// Admin endpoints - Get specific KYC verification
router.get('/admin/verifications/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const verification = await storage.getKycVerificationById(id);
    
    if (!verification) {
      return res.status(404).json({ message: 'KYC verification not found' });
    }

    // Get user details
    const user = await storage.getUser(verification.userId);
    
    res.json({ ...verification, user });
  } catch (error) {
    console.error('Get KYC verification error:', error);
    res.status(500).json({ message: 'Failed to fetch KYC verification' });
  }
});

// Admin endpoints - Review KYC verification
const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
});

router.post('/admin/verifications/:id/review', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, notes } = reviewSchema.parse(req.body);
    const adminId = req.user!.id;

    const verification = await storage.getKycVerificationById(id);
    if (!verification) {
      return res.status(404).json({ message: 'KYC verification not found' });
    }

    if (verification.status === 'approved') {
      return res.status(400).json({ message: 'KYC already approved' });
    }

    const updateData = {
      status,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      rejectionReason: status === 'rejected' ? rejectionReason : null,
      notes,
    };

    const updatedVerification = await storage.updateKycVerification(id, updateData);

    // Log admin action
    await storage.logAdminAction({
      adminId,
      action: `kyc_${status}`,
      targetUserId: verification.userId,
      details: { kycId: id, rejectionReason, notes },
      timestamp: new Date()
    });

    res.json(updatedVerification);
  } catch (error) {
    console.error('Review KYC error:', error);
    res.status(500).json({ message: 'Failed to review KYC verification' });
  }
});

// Admin endpoints - Bulk approve/reject
router.post('/admin/verifications/bulk-review', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { ids, status, rejectionReason, notes } = req.body;
    const adminId = req.user!.id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid verification IDs' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const updateData = {
          status,
          reviewedBy: adminId,
          reviewedAt: new Date(),
          rejectionReason: status === 'rejected' ? rejectionReason : null,
          notes,
        };

        const updatedVerification = await storage.updateKycVerification(id, updateData);
        results.push({ id, success: true, verification: updatedVerification });

        // Log admin action
        await storage.logAdminAction({
          adminId,
          action: `kyc_bulk_${status}`,
          details: { kycId: id, rejectionReason, notes },
          timestamp: new Date()
        });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Bulk review KYC error:', error);
    res.status(500).json({ message: 'Failed to bulk review KYC verifications' });
  }
});

// Admin endpoints - KYC statistics
router.get('/admin/statistics', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await storage.getKycStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Get KYC statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch KYC statistics' });
  }
});

export default router;



// Admin: Get KYC statistics
router.get('/admin/statistics', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await storage.getKycStatistics();
    res.json(stats || {
      total: 0,
      pending: 0,
      underReview: 0,
      approved: 0,
      rejected: 0
    });
  } catch (error) {
    console.error('KYC statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch KYC statistics' });
  }
});

// Admin: Bulk review KYC verifications
router.post('/admin/verifications/bulk-review', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { ids, status, rejectionReason, notes } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid verification IDs' });
    }

    const results = await Promise.all(
      ids.map(id => storage.updateKycVerification(id, {
        status,
        rejectionReason,
        notes,
        reviewedAt: new Date(),
        reviewedBy: req.user!.id
      }))
    );

    res.json({ 
      message: 'Bulk review completed',
      updated: results.length 
    });
  } catch (error) {
    console.error('Bulk review error:', error);
    res.status(500).json({ message: 'Failed to complete bulk review' });
  }
});
