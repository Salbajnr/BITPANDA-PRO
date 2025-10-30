
import { storage } from './storage';

export interface AuditEvent {
  id?: string;
  userId?: string;
  adminId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'trading' | 'admin' | 'security' | 'compliance' | 'system';
}

export interface SecurityEvent {
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'password_change' | 
        'rate_limit_exceeded' | 'suspicious_activity' | 'unauthorized_access';
  userId?: string;
  ip: string;
  userAgent?: string;
  endpoint?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: Date;
}

class AuditService {
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const auditEvent: AuditEvent = {
        ...event,
        timestamp: new Date()
      };

      await storage.createAuditLog(auditEvent);

      // Log critical events to console for immediate attention
      if (event.severity === 'critical') {
        console.error('🚨 CRITICAL AUDIT EVENT:', auditEvent);
      }

      // Trigger alerts for high-severity events
      if (event.severity === 'high' || event.severity === 'critical') {
        await this.triggerSecurityAlert(auditEvent);
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const securityEvent = {
        ...event,
        timestamp: event.timestamp || new Date()
      };

      await storage.createSecurityLog(securityEvent);

      // Enhanced logging for failed login attempts
      if (event.type === 'login_failure') {
        await this.trackFailedLogins(event.ip, event.userId);
      }

      console.log(`🔒 Security Event: ${event.type}`, {
        userId: event.userId,
        ip: event.ip,
        severity: event.severity
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private async trackFailedLogins(ip: string, userId?: string): Promise<void> {
    try {
      const key = userId ? `failed_login_user:${userId}` : `failed_login_ip:${ip}`;
      const count = await storage.incrementFailedLoginAttempts(key);
      
      if (count >= 5) {
        await this.logEvent({
          action: 'multiple_failed_logins',
          resource: 'auth',
          resourceId: userId || ip,
          ip,
          success: false,
          severity: 'high',
          category: 'security',
          metadata: { failedAttempts: count }
        });
      }
    } catch (error) {
      console.error('Failed to track failed logins:', error);
    }
  }

  private async triggerSecurityAlert(event: AuditEvent): Promise<void> {
    // In a production environment, this could send notifications
    // to security teams, trigger webhooks, or integrate with monitoring systems
    console.warn('🚨 Security Alert Triggered:', {
      action: event.action,
      severity: event.severity,
      userId: event.userId,
      timestamp: event.timestamp
    });
  }

  // Middleware for automatic audit logging
  createAuditMiddleware() {
    return (req: any, res: any, next: any) => {
      const originalSend = res.send;
      const startTime = Date.now();

      res.send = function(body: any) {
        const duration = Date.now() - startTime;
        const success = res.statusCode < 400;

        // Skip logging for certain endpoints to reduce noise
        const skipPaths = ['/health', '/api/health', '/favicon.ico'];
        if (!skipPaths.some(path => req.path.includes(path))) {
          auditService.logEvent({
            userId: req.user?.id,
            action: `${req.method} ${req.path}`,
            resource: req.path.split('/')[2] || 'unknown',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            success,
            severity: success ? 'low' : 'medium',
            category: this.categorizeEndpoint(req.path),
            metadata: {
              method: req.method,
              statusCode: res.statusCode,
              duration,
              query: req.query,
              params: req.params
            },
            ...(req.body && req.method !== 'GET' && { newValue: this.sanitizeBody(req.body) })
          });
        }

        return originalSend.call(this, body);
      };

      next();
    };
  }

  private categorizeEndpoint(path: string): AuditEvent['category'] {
    if (path.includes('/auth') || path.includes('/login') || path.includes('/register')) {
      return 'auth';
    }
    if (path.includes('/admin')) {
      return 'admin';
    }
    if (path.includes('/trade') || path.includes('/order')) {
      return 'trading';
    }
    if (path.includes('/security') || path.includes('/kyc')) {
      return 'security';
    }
    return 'system';
  }

  private sanitizeBody(body: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'otp'];
    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  // Helper methods for common audit scenarios
  async logUserAction(userId: string, action: string, resource: string, details?: any, req?: any): Promise<void> {
    await this.logEvent({
      userId,
      action,
      resource,
      success: true,
      severity: 'low',
      category: 'system',
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      metadata: details
    });
  }

  async logAdminAction(adminId: string, action: string, targetUserId?: string, details?: any, req?: any): Promise<void> {
    await this.logEvent({
      adminId,
      userId: targetUserId,
      action,
      resource: 'admin_action',
      resourceId: targetUserId,
      success: true,
      severity: 'medium',
      category: 'admin',
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      metadata: details
    });
  }

  async logTradingAction(userId: string, action: string, orderData: any, req?: any): Promise<void> {
    await this.logEvent({
      userId,
      action,
      resource: 'trading',
      resourceId: orderData.id,
      newValue: orderData,
      success: true,
      severity: 'medium',
      category: 'trading',
      ip: req?.ip,
      userAgent: req?.get('User-Agent')
    });
  }

  async logComplianceEvent(userId: string, event: string, details: any, req?: any): Promise<void> {
    await this.logEvent({
      userId,
      action: event,
      resource: 'compliance',
      success: true,
      severity: 'high',
      category: 'compliance',
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      metadata: details
    });
  }
}

export const auditService = new AuditService();
