
import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// Generate CSRF token
router.get('/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.json({ csrfToken: token });
});

export default router;
