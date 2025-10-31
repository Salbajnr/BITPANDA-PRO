
import { Router } from 'express';
import { supabaseHealthMonitor } from './supabase-health-check';
import { isSupabaseConfigured } from './supabase';

const router = Router();

/**
 * @route   GET /api/supabase-health/status
 * @desc    Get Supabase health status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = await supabaseHealthMonitor.performHealthCheck();
    
    const statusCode = status.configured && status.clientHealthy ? 200 : 503;
    
    res.status(statusCode).json({
      success: status.configured && status.clientHealthy,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route   GET /api/supabase-health/diagnostic
 * @desc    Get detailed diagnostic report
 * @access  Public
 */
router.get('/diagnostic', async (req, res) => {
  try {
    const report = await supabaseHealthMonitor.getDiagnosticReport();
    
    res.status(200).json({
      success: true,
      report,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
