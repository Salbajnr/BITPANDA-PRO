
import { supabase, supabaseAdmin, isSupabaseConfigured, checkSupabaseHealth } from './supabase';

export interface SupabaseHealthStatus {
  configured: boolean;
  clientHealthy: boolean;
  adminHealthy: boolean;
  issues: string[];
  lastChecked: Date;
}

export class SupabaseHealthMonitor {
  private lastStatus: SupabaseHealthStatus | null = null;
  private checkInterval: NodeJS.Timeout | null = null;

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<SupabaseHealthStatus> {
    const issues: string[] = [];
    const now = new Date();

    // Check if configured
    const configured = isSupabaseConfigured();
    if (!configured) {
      issues.push('Supabase not configured - missing environment variables');
    }

    // Check client health
    let clientHealthy = false;
    if (configured && supabase) {
      try {
        const { error } = await supabase.auth.getSession();
        if (!error) {
          clientHealthy = true;
        } else {
          issues.push(`Client connection error: ${error.message}`);
        }
      } catch (error: any) {
        issues.push(`Client connection failed: ${error.message}`);
      }
    }

    // Check admin client health
    let adminHealthy = false;
    if (configured && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin.auth.getSession();
        if (!error) {
          adminHealthy = true;
        } else {
          issues.push(`Admin connection error: ${error.message}`);
        }
      } catch (error: any) {
        issues.push(`Admin connection failed: ${error.message}`);
      }
    } else if (configured) {
      issues.push('Admin client not configured - missing SUPABASE_SERVICE_ROLE_KEY');
    }

    const status: SupabaseHealthStatus = {
      configured,
      clientHealthy,
      adminHealthy,
      issues,
      lastChecked: now,
    };

    this.lastStatus = status;
    return status;
  }

  /**
   * Start continuous health monitoring
   */
  startMonitoring(intervalMs: number = 60000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      const status = await this.performHealthCheck();
      if (status.issues.length > 0) {
        console.warn('⚠️ Supabase Health Issues:', status.issues);
      }
    }, intervalMs);

    console.log('🩺 Supabase health monitoring started');
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Get last health status
   */
  getLastStatus(): SupabaseHealthStatus | null {
    return this.lastStatus;
  }

  /**
   * Get diagnostic report
   */
  async getDiagnosticReport(): Promise<{
    status: SupabaseHealthStatus;
    environment: {
      supabaseUrl: string | undefined;
      hasAnonKey: boolean;
      hasServiceKey: boolean;
    };
    recommendations: string[];
  }> {
    const status = await this.performHealthCheck();
    const recommendations: string[] = [];

    if (!status.configured) {
      recommendations.push('Configure Supabase environment variables in Replit Secrets');
      recommendations.push('Add SUPABASE_URL and SUPABASE_ANON_KEY');
    }

    if (status.configured && !status.adminHealthy) {
      recommendations.push('Add SUPABASE_SERVICE_ROLE_KEY for admin operations');
    }

    if (status.issues.some(issue => issue.includes('connection'))) {
      recommendations.push('Check Supabase project status and billing');
      recommendations.push('Verify environment variables are correct');
    }

    return {
      status,
      environment: {
        supabaseUrl: process.env.SUPABASE_URL,
        hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      recommendations,
    };
  }
}

// Export singleton instance
export const supabaseHealthMonitor = new SupabaseHealthMonitor();
