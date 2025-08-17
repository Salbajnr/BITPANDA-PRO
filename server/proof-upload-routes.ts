import type { Express } from "express";
import { depositService, uploadProof } from "./deposit-service";
import { isAuthenticated } from "./simple-auth";
import path from "path";
import fs from "fs";

export function registerProofUploadRoutes(app: Express) {
  console.log("📎 Registering proof upload routes");

  // Serve uploaded proof images
  app.use('/uploads/proofs', (req, res, next) => {
    const filePath = path.join(__dirname, '..', 'uploads', 'proofs', req.path);
    
    // Check if file exists and user is authenticated
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.sendFile(filePath);
  });

  // Create deposits folder if it doesn't exist
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'proofs');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsDir);
  }

  // Upload proof of payment
  app.post("/api/deposits/upload-proof", isAuthenticated, uploadProof.single('proof'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const proofImageUrl = `/uploads/proofs/${req.file.filename}`;
      
      res.json({
        success: true,
        proofImageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Error uploading proof:', error);
      res.status(500).json({ error: 'Failed to upload proof of payment' });
    }
  });

  // Submit deposit request with proof
  app.post("/api/deposits/create", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { amount, currency, assetType, paymentMethod, proofImageUrl } = req.body;

      if (!amount || !currency || !assetType || !paymentMethod) {
        return res.status(400).json({ 
          error: "Missing required fields: amount, currency, assetType, paymentMethod" 
        });
      }

      const depositRequest = {
        userId,
        amount: parseFloat(amount),
        currency,
        assetType: assetType as 'crypto' | 'metal',
        paymentMethod: paymentMethod as any,
        proofImageUrl
      };

      const deposit = await depositService.createDeposit(depositRequest);
      
      res.json({
        success: true,
        deposit
      });
    } catch (error) {
      console.error('Error creating deposit:', error);
      res.status(500).json({ error: 'Failed to create deposit request' });
    }
  });

  // Get user's deposits
  app.get("/api/deposits/my-deposits", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const deposits = await depositService.getUserDeposits(userId);
      res.json(deposits);
    } catch (error) {
      console.error('Error fetching user deposits:', error);
      res.status(500).json({ error: 'Failed to fetch deposits' });
    }
  });

  // Admin routes
  
  // Get pending deposits (admin only)
  app.get("/api/admin/deposits/pending", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const deposits = await depositService.getPendingDeposits();
      res.json(deposits);
    } catch (error) {
      console.error('Error fetching pending deposits:', error);
      res.status(500).json({ error: 'Failed to fetch pending deposits' });
    }
  });

  // Approve/reject deposit (admin only)
  app.post("/api/admin/deposits/:id/review", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { id } = req.params;
      const { approved, adminNotes, rejectionReason } = req.body;

      if (typeof approved !== 'boolean') {
        return res.status(400).json({ error: "Approved field must be true or false" });
      }

      const approval = {
        depositId: id,
        adminId: user.id,
        approved,
        adminNotes,
        rejectionReason: approved ? undefined : rejectionReason
      };

      const updatedDeposit = await depositService.approveDeposit(approval);
      res.json({
        success: true,
        deposit: updatedDeposit
      });
    } catch (error) {
      console.error('Error reviewing deposit:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to review deposit' 
      });
    }
  });

  // Get all deposits (admin only)
  app.get("/api/admin/deposits", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const deposits = await depositService.getAllDeposits(limit, offset);
      res.json(deposits);
    } catch (error) {
      console.error('Error fetching all deposits:', error);
      res.status(500).json({ error: 'Failed to fetch deposits' });
    }
  });

  // Get deposit statistics (admin only)
  app.get("/api/admin/deposits/stats", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const stats = await depositService.getDepositStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching deposit stats:', error);
      res.status(500).json({ error: 'Failed to fetch deposit statistics' });
    }
  });

  // Get specific deposit (admin only)
  app.get("/api/admin/deposits/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { id } = req.params;
      const deposit = await depositService.getDepositById(id);
      
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }
      
      res.json(deposit);
    } catch (error) {
      console.error('Error fetching deposit:', error);
      res.status(500).json({ error: 'Failed to fetch deposit' });
    }
  });

  console.log("✅ Proof upload routes registered successfully");
}