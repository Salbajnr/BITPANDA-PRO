
import { EventEmitter } from 'events';
import { storage } from './storage';
import { sendSSEToUser, broadcastSSEToAdmins } from './sse-routes';
import { adminWebSocketManager } from './admin-websocket';

interface PushNotification {
  id: string;
  userId: string;
  type: 'price_alert' | 'security_alert' | 'system_alert' | 'trade_alert' | 'portfolio_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data?: any;
  sent: boolean;
  createdAt: Date;
}

interface CriticalAlert {
  type: 'security_breach' | 'system_down' | 'large_withdrawal' | 'unusual_activity';
  severity: 'high' | 'critical';
  userId?: string;
  message: string;
  data: any;
}

class PushNotificationService extends EventEmitter {
  private notifications = new Map<string, PushNotification>();
  private criticalAlerts: CriticalAlert[] = [];

  constructor() {
    super();
    this.setMaxListeners(1000);
  }

  // Send push notification to specific user
  async sendNotification(notification: Omit<PushNotification, 'id' | 'sent' | 'createdAt'>) {
    const id = this.generateNotificationId();
    const fullNotification: PushNotification = {
      ...notification,
      id,
      sent: false,
      createdAt: new Date()
    };

    this.notifications.set(id, fullNotification);

    try {
      // Store in database
      await storage.createNotification({
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message
      });

      // Send via SSE
      sendSSEToUser(notification.userId, {
        type: 'push_notification',
        notification: fullNotification,
        timestamp: Date.now()
      });

      // Mark as sent
      fullNotification.sent = true;
      this.notifications.set(id, fullNotification);

      // Emit event
      this.emit('notificationSent', fullNotification);

      console.log(`📱 Push notification sent to user ${notification.userId}: ${notification.title}`);

      return fullNotification;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Send critical alert to admins and relevant users
  async sendCriticalAlert(alert: CriticalAlert) {
    this.criticalAlerts.push(alert);
    
    const alertData = {
      id: this.generateNotificationId(),
      ...alert,
      timestamp: new Date()
    };

    try {
      // Send to all admins via WebSocket
      adminWebSocketManager.broadcastToChannel('security_alerts', alertData);

      // Send to all admins via SSE
      broadcastSSEToAdmins({
        type: 'critical_alert',
        alert: alertData,
        timestamp: Date.now()
      });

      // If alert is user-specific, also notify the user
      if (alert.userId) {
        await this.sendNotification({
          userId: alert.userId,
          type: 'security_alert',
          title: 'Security Alert',
          message: alert.message,
          priority: 'critical',
          data: alert.data
        });
      }

      // Store critical alert in database
      await storage.createSecurityLog?.({
        type: alert.type,
        severity: alert.severity,
        userId: alert.userId,
        message: alert.message,
        data: JSON.stringify(alert.data),
        createdAt: new Date()
      });

      console.log(`🚨 Critical alert sent: ${alert.type} - ${alert.message}`);

      return alertData;
    } catch (error) {
      console.error('Error sending critical alert:', error);
      throw error;
    }
  }

  // Send price alert notification
  async sendPriceAlert(userId: string, symbol: string, price: number, targetPrice: number, condition: 'above' | 'below') {
    const message = `${symbol} is now ${condition} $${targetPrice.toFixed(2)}! Current price: $${price.toFixed(2)}`;
    
    return await this.sendNotification({
      userId,
      type: 'price_alert',
      title: `Price Alert: ${symbol}`,
      message,
      priority: 'medium',
      data: {
        symbol,
        currentPrice: price,
        targetPrice,
        condition
      }
    });
  }

  // Send trade execution notification
  async sendTradeAlert(userId: string, tradeData: any) {
    const message = `${tradeData.type.toUpperCase()} order executed: ${tradeData.amount} ${tradeData.symbol} at $${tradeData.price}`;
    
    return await this.sendNotification({
      userId,
      type: 'trade_alert',
      title: 'Trade Executed',
      message,
      priority: 'medium',
      data: tradeData
    });
  }

  // Send portfolio milestone notification
  async sendPortfolioAlert(userId: string, milestone: string, currentValue: number) {
    return await this.sendNotification({
      userId,
      type: 'portfolio_alert',
      title: 'Portfolio Milestone',
      message: `Your portfolio has ${milestone}! Current value: $${currentValue.toLocaleString()}`,
      priority: 'low',
      data: {
        milestone,
        currentValue
      }
    });
  }

  // Send system maintenance notification
  async sendSystemAlert(message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    // Get all active users
    const activeUsers = await this.getActiveUsers();
    
    const notifications = await Promise.all(
      activeUsers.map(user => 
        this.sendNotification({
          userId: user.id,
          type: 'system_alert',
          title: 'System Notification',
          message,
          priority,
          data: {
            maintenanceNotice: true
          }
        })
      )
    );

    // Also broadcast to admins
    broadcastSSEToAdmins({
      type: 'system_alert',
      message,
      priority,
      userCount: activeUsers.length,
      timestamp: Date.now()
    });

    return notifications;
  }

  // Detect and alert on unusual activity
  async detectUnusualActivity(userId: string, activityData: any) {
    const riskScore = this.calculateRiskScore(activityData);
    
    if (riskScore > 0.8) {
      await this.sendCriticalAlert({
        type: 'unusual_activity',
        severity: 'high',
        userId,
        message: `Unusual activity detected for user ${userId}`,
        data: {
          riskScore,
          activityData,
          detectedAt: new Date()
        }
      });
    } else if (riskScore > 0.6) {
      await this.sendNotification({
        userId,
        type: 'security_alert',
        title: 'Security Notice',
        message: 'We noticed unusual activity on your account. Please verify recent transactions.',
        priority: 'high',
        data: {
          riskScore,
          activityData
        }
      });
    }
  }

  // Monitor large transactions
  async monitorTransaction(transaction: any) {
    const amount = parseFloat(transaction.total);
    const threshold = 10000; // $10,000

    if (amount > threshold) {
      await this.sendCriticalAlert({
        type: 'large_withdrawal',
        severity: 'high',
        userId: transaction.userId,
        message: `Large transaction detected: $${amount.toLocaleString()}`,
        data: {
          transactionId: transaction.id,
          amount,
          type: transaction.type,
          symbol: transaction.symbol
        }
      });

      // Also notify the user
      await this.sendNotification({
        userId: transaction.userId,
        type: 'trade_alert',
        title: 'Large Transaction Alert',
        message: `Your ${transaction.type} order for $${amount.toLocaleString()} has been processed.`,
        priority: 'high',
        data: transaction
      });
    }
  }

  // Private helper methods
  private calculateRiskScore(activityData: any): number {
    // Implement risk scoring algorithm
    let score = 0;
    
    // Multiple rapid transactions
    if (activityData.transactionCount > 10) score += 0.3;
    
    // Large amounts
    if (activityData.totalAmount > 50000) score += 0.4;
    
    // Unusual time patterns
    if (activityData.outsideBusinessHours) score += 0.2;
    
    // New device/IP
    if (activityData.newDevice) score += 0.3;
    
    return Math.min(score, 1.0);
  }

  private async getActiveUsers() {
    try {
      return await storage.getActiveUsers?.() || [];
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  }

  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public getters
  public getNotificationStats() {
    const notifications = Array.from(this.notifications.values());
    return {
      total: notifications.length,
      sent: notifications.filter(n => n.sent).length,
      pending: notifications.filter(n => !n.sent).length,
      byType: this.groupBy(notifications, 'type'),
      byPriority: this.groupBy(notifications, 'priority'),
      criticalAlerts: this.criticalAlerts.length
    };
  }

  public getCriticalAlerts(): CriticalAlert[] {
    return [...this.criticalAlerts];
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }
}

export const pushNotificationService = new PushNotificationService();
