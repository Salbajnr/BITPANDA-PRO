
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from './simple-auth';
import fs from 'fs';
import crypto from 'crypto';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// File validation utilities
const validateFileType = (file: Express.Multer.File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.mimetype);
};

const validateFileSize = (file: Express.Multer.File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

const validateFileName = (filename: string): boolean => {
  // Check for malicious patterns
  const dangerousPatterns = [
    /\.\./,  // Directory traversal
    /[<>:"/\\|?*]/,  // Windows reserved characters
    /^\./,   // Hidden files
    /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i  // Executable extensions
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(filename));
};

const scanFileContent = async (filePath: string, mimetype: string): Promise<boolean> => {
  try {
    const fs = require('fs');
    const buffer = fs.readFileSync(filePath);
    
    // Basic malware signature detection (simplified)
    const maliciousSignatures = [
      Buffer.from('MZ'),  // PE executable header
      Buffer.from('%PDF-1.'), // PDF but check for embedded JS
    ];
    
    // Check file header matches declared MIME type
    const fileSignatures: Record<string, Buffer[]> = {
      'image/jpeg': [Buffer.from([0xFF, 0xD8, 0xFF])],
      'image/png': [Buffer.from([0x89, 0x50, 0x4E, 0x47])],
      'image/gif': [Buffer.from('GIF87a'), Buffer.from('GIF89a')],
      'application/pdf': [Buffer.from('%PDF-')]
    };
    
    const expectedSignatures = fileSignatures[mimetype];
    if (expectedSignatures) {
      const hasValidSignature = expectedSignatures.some(sig => 
        buffer.subarray(0, sig.length).equals(sig)
      );
      if (!hasValidSignature) {
        return false;
      }
    }
    
    // Additional security checks
    const content = buffer.toString('utf8', 0, Math.min(1024, buffer.length));
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(content));
  } catch (error) {
    console.error('File scan error:', error);
    return false;
  }
};

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const { type } = req.body;
  
  // Define allowed types per upload category
  const typeConfigs: Record<string, { mimeTypes: string[], maxSize: number }> = {
    'kyc_document': {
      mimeTypes: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf'
      ],
      maxSize: 5 * 1024 * 1024 // 5MB
    },
    'chat_attachment': {
      mimeTypes: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain'
      ],
      maxSize: 2 * 1024 * 1024 // 2MB
    },
    'proof_payment': {
      mimeTypes: [
        'image/jpeg', 'image/png', 'image/pdf'
      ],
      maxSize: 3 * 1024 * 1024 // 3MB
    },
    'profile_picture': {
      mimeTypes: [
        'image/jpeg', 'image/png', 'image/webp'
      ],
      maxSize: 1 * 1024 * 1024 // 1MB
    }
  };
  
  const config = typeConfigs[type] || typeConfigs['chat_attachment'];
  
  // Validate filename
  if (!validateFileName(file.originalname)) {
    return cb(new Error('Invalid filename. Contains forbidden characters or patterns.'));
  }
  
  // Validate file type
  if (!validateFileType(file, config.mimeTypes)) {
    return cb(new Error(`Invalid file type. Allowed types: ${config.mimeTypes.join(', ')}`));
  }
  
  // Validate file size
  if (!validateFileSize(file, config.maxSize)) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
    return cb(new Error(`File too large. Maximum size: ${maxSizeMB}MB`));
  }
  
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Upload file endpoint
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { type = 'general' } = req.body;
    const userId = req.user!.id;
    const filePath = path.join(uploadsDir, req.file.filename);

    // Perform additional security scan
    const isSafe = await scanFileContent(filePath, req.file.mimetype);
    if (!isSafe) {
      // Delete the potentially malicious file
      try {
        fs.unlinkSync(filePath);
      } catch (deleteError) {
        console.error('Failed to delete malicious file:', deleteError);
      }
      
      // Log security event
      const { auditService } = await import('./audit-service');
      await auditService.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'malicious_file_upload',
          filename: req.file.originalname,
          mimetype: req.file.mimetype
        },
        severity: 'high'
      });
      
      return res.status(400).json({ 
        message: 'File failed security scan. Upload rejected.',
        code: 'SECURITY_SCAN_FAILED'
      });
    }

    // Generate secure URL for the file
    const fileUrl = `/api/uploads/${req.file.filename}`;
    
    // Store file metadata in database
    const fileRecord = await (storage as any).createFileRecord({
      userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type,
      path: filePath,
      url: fileUrl
    });
    
    // Log the upload
    const { auditService } = await import('./audit-service');
    await auditService.logUserAction(
      userId,
      'file_upload',
      'file',
      {
        fileId: fileRecord.id,
        filename: req.file.originalname,
        type,
        size: req.file.size
      },
      req
    );

    console.log(`✅ File uploaded by user ${userId}:`, {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      type: type
    });

    res.json({
      id: fileRecord.id,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      uploadType: type,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up file on error
    if (req.file) {
      try {
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
      } catch (deleteError) {
        console.error('Failed to cleanup file on error:', deleteError);
      }
    }
    
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Serve uploaded files
router.get('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Security check - prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    const uploadsPath = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(uploadsPath)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Serve the file
    res.sendFile(resolvedPath);
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({ message: 'Failed to serve file' });
  }
});

// Delete file endpoint (admin only)
router.delete('/:filename', requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

export default router;
