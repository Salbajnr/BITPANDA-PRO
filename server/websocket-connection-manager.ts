
interface ConnectionHealth {
  lastPing: number;
  lastPong: number;
  missedPings: number;
  isHealthy: boolean;
}

export class WebSocketConnectionManager {
  private connections = new Map<string, WebSocket & { health?: ConnectionHealth }>();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 30000; // 30 seconds
  private readonly PONG_TIMEOUT = 10000; // 10 seconds
  private readonly MAX_MISSED_PINGS = 3;

  initialize() {
    // Start health check monitoring
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.PING_INTERVAL);

    console.log('🔌 WebSocket Connection Manager initialized');
  }

  addConnection(clientId: string, ws: WebSocket): void {
    // Initialize health tracking
    (ws as any).health = {
      lastPing: Date.now(),
      lastPong: Date.now(),
      missedPings: 0,
      isHealthy: true
    };

    this.connections.set(clientId, ws as WebSocket & { health?: ConnectionHealth });

    // Set up pong handler
    (ws as any).on('pong', () => {
      const health = (ws as any).health;
      if (health) {
        health.lastPong = Date.now();
        health.missedPings = 0;
        health.isHealthy = true;
      }
    });

    // Enhanced error handling
    (ws as any).on('error', async (error: any) => {
      await this.handleConnectionError(clientId, error);
    });

    console.log(`✅ WebSocket connection added: ${clientId}`);
  }

  removeConnection(clientId: string): void {
    const ws = this.connections.get(clientId);
    if (ws) {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, 'Connection removed');
        }
      } catch (error) {
        console.error(`Error closing WebSocket ${clientId}:`, error);
      }
    }
    this.connections.delete(clientId);
    console.log(`❌ WebSocket connection removed: ${clientId}`);
  }

  private async performHealthCheck(): Promise<void> {
    const now = Date.now();
    const unhealthyConnections: string[] = [];

    for (const [clientId, ws] of this.connections.entries()) {
      const health = ws.health;
      if (!health) continue;

      try {
        if (ws.readyState === WebSocket.OPEN) {
          // Send ping
          (ws as any).ping();
          health.lastPing = now;

          // Check if pong is overdue
          if (now - health.lastPong > this.PONG_TIMEOUT) {
            health.missedPings++;
            
            if (health.missedPings >= this.MAX_MISSED_PINGS) {
              health.isHealthy = false;
              unhealthyConnections.push(clientId);
            }
          }
        } else {
          // Connection is not open, mark for removal
          unhealthyConnections.push(clientId);
        }
      } catch (error) {
        console.error(`Health check error for ${clientId}:`, error);
        unhealthyConnections.push(clientId);
      }
    }

    // Remove unhealthy connections
    for (const clientId of unhealthyConnections) {
      await this.handleUnhealthyConnection(clientId);
    }

    if (unhealthyConnections.length > 0) {
      console.log(`🧹 Cleaned up ${unhealthyConnections.length} unhealthy WebSocket connections`);
    }
  }

  private async handleConnectionError(clientId: string, error: any): Promise<void> {
    try {
      // Log error with audit service
      const { auditService } = await import('./audit-service');
      await auditService.logSecurityEvent({
        type: 'suspicious_activity',
        details: {
          action: 'websocket_connection_error',
          clientId,
          error: error.message,
          errorCode: error.code
        },
        severity: 'low',
        ip: 'unknown'
      });
    } catch (logError) {
      console.error('Failed to log WebSocket connection error:', logError);
    }

    // Remove the problematic connection
    this.removeConnection(clientId);
  }

  private async handleUnhealthyConnection(clientId: string): Promise<void> {
    console.log(`🔌 Removing unhealthy WebSocket connection: ${clientId}`);
    
    const ws = this.connections.get(clientId);
    if (ws && ws.health) {
      try {
        // Log the health issue
        const { auditService } = await import('./audit-service');
        await auditService.logEvent({
          action: 'websocket_health_check_failed',
          resource: 'websocket',
          resourceId: clientId,
          success: false,
          severity: 'low',
          category: 'system',
          metadata: {
            missedPings: ws.health.missedPings,
            lastPong: ws.health.lastPong,
            isHealthy: ws.health.isHealthy
          }
        });
      } catch (logError) {
        console.error('Failed to log unhealthy connection:', logError);
      }
    }

    this.removeConnection(clientId);
  }

  broadcastToHealthyConnections(message: any): void {
    const messageString = JSON.stringify(message);
    let successCount = 0;
    let failureCount = 0;

    for (const [clientId, ws] of this.connections.entries()) {
      try {
        if (ws.readyState === WebSocket.OPEN && ws.health?.isHealthy) {
          ws.send(messageString);
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        console.error(`Failed to broadcast to ${clientId}:`, error);
        failureCount++;
        // Schedule for removal
        setTimeout(() => this.removeConnection(clientId), 0);
      }
    }

    if (failureCount > 0) {
      console.log(`📡 Broadcast completed: ${successCount} success, ${failureCount} failures`);
    }
  }

  getConnectionStats(): { total: number; healthy: number; unhealthy: number } {
    let healthy = 0;
    let unhealthy = 0;

    for (const ws of this.connections.values()) {
      if (ws.health?.isHealthy) {
        healthy++;
      } else {
        unhealthy++;
      }
    }

    return {
      total: this.connections.size,
      healthy,
      unhealthy
    };
  }

  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Close all connections gracefully
    for (const [clientId, ws] of this.connections.entries()) {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, 'Server shutting down');
        }
      } catch (error) {
        console.error(`Error closing WebSocket ${clientId} on shutdown:`, error);
      }
    }

    this.connections.clear();
    console.log('🔌 WebSocket Connection Manager shutdown complete');
  }
}

export const wsConnectionManager = new WebSocketConnectionManager();
