import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { cryptoService, type CryptoPrice } from './crypto-service';
import { storage } from './storage';
import { realTimePriceService } from './real-time-price-service';

interface ClientSubscription {
  ws: WebSocket;
  symbols: string[];
  userId?: string;
  lastPing: number;
  isAlive: boolean;
}

interface PriceUpdateMessage {
  type: 'price_update';
  data: CryptoPrice[];
  timestamp: number;
}

interface AlertMessage {
  type: 'price_alert';
  data: {
    symbol: string;
    price: number;
    alertType: 'above' | 'below';
    targetPrice: number;
  };
  timestamp: number;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private httpServer: Server | null = null;
  private clients = new Map<string, ClientSubscription>();
  private priceUpdateInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_INTERVAL = 10000; // 10 seconds
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private isInitialized = false;

  initialize(server: Server): void {
    if (this.isInitialized) {
      console.log('⚠️ WebSocket server already initialized, skipping...');
      return;
    }

    this.isInitialized = true;
    this.httpServer = server; // Store the http server instance

    this.wss = new WebSocketServer({
      noServer: true,
      perMessageDeflate: {
        threshold: 1024,
        concurrencyLimit: 10,
        memLevel: 7
      }
    });

    // Remove any existing upgrade listeners to prevent duplicates
    this.httpServer.removeAllListeners('upgrade');

    // Handle upgrade requests
    this.httpServer.once('upgrade', (request, socket, head) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const pathname = url.pathname;

        console.log(`🔌 WebSocket upgrade request for: ${pathname}`);

        if (pathname === '/ws') {
          this.wss!.handleUpgrade(request, socket, head, (ws) => {
            this.wss!.emit('connection', ws, request);
          });
        } else if (pathname === '/ws/chat') {
          // Let chat WebSocket handle this
          return;
        } else {
          console.log(`❌ Unknown WebSocket path: ${pathname}`);
          socket.destroy();
        }
      } catch (error) {
        console.error('❌ WebSocket upgrade error:', error);
        socket.destroy();
      }
    });

    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      const clientIp = request.socket.remoteAddress;

      console.log(`🔌 WebSocket client connected: ${clientId} from ${clientIp}`);

      // Initialize client
      this.clients.set(clientId, {
        ws,
        symbols: [],
        lastPing: Date.now(),
        isAlive: true
      });

      // Send welcome message
      this.sendMessage(ws, {
        type: 'connection',
        message: 'Connected to BitPanda Pro real-time price feed',
        timestamp: Date.now(),
        clientId,
        version: '2.0.0'
      });

      // Set up ping/pong for connection health
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.isAlive = true;
          client.lastPing = Date.now();
        }
      });

      // Handle client messages
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleClientMessage(clientId, ws, message);
        } catch (error) {
          console.error(`❌ WebSocket message error for ${clientId}:`, error);
          this.sendMessage(ws, {
            type: 'error',
            message: 'Invalid message format',
            timestamp: Date.now()
          });
        }
      });

      // Handle client disconnect
      ws.on('close', (code, reason) => {
        console.log(`🔌 WebSocket client disconnected: ${clientId}, code: ${code}, reason: ${reason.toString()}`);
        this.clients.delete(clientId);
        realTimePriceService.removeSubscription(clientId);
        this.checkActiveClients();
      });

      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
        realTimePriceService.removeSubscription(clientId);
        this.checkActiveClients();
      });
    });

    // Start services
    realTimePriceService.start();
    this.startHeartbeat();

    console.log('🚀 Enhanced WebSocket server initialized on /ws');
  }

  private async handleClientMessage(clientId: string, ws: WebSocket, message: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'subscribe':
        await this.handleSubscription(clientId, ws, message);
        break;

      case 'unsubscribe':
        this.handleUnsubscription(clientId, message.symbols);
        break;

      case 'authenticate':
        await this.handleAuthentication(clientId, ws, message);
        break;

      case 'ping':
        this.sendMessage(ws, { type: 'pong', timestamp: Date.now() });
        break;

      default:
        this.sendMessage(ws, {
          type: 'error',
          message: `Unknown message type: ${message.type}`,
          timestamp: Date.now()
        });
    }
  }

  private async handleSubscription(clientId: string, ws: WebSocket, message: any): Promise<void> {
    const { symbols, userId } = message;

    if (!Array.isArray(symbols) || symbols.length === 0) {
      this.sendMessage(ws, {
        type: 'error',
        message: 'Invalid symbols array',
        timestamp: Date.now()
      });
      return;
    }

    // Validate and normalize symbols
    const validSymbols = symbols
      .map((s: string) => s.toUpperCase().trim())
      .filter((s: string) => /^[A-Z]{2,10}$/.test(s))
      .slice(0, 50); // Limit to 50 symbols per client

    if (validSymbols.length === 0) {
      this.sendMessage(ws, {
        type: 'error',
        message: 'No valid symbols provided',
        timestamp: Date.now()
      });
      return;
    }

    // Update client subscription
    const client = this.clients.get(clientId);
    if (client) {
      client.symbols = validSymbols;
      client.userId = userId;
    }

    // Add to real-time price service
    realTimePriceService.addSubscription(clientId, ws, validSymbols, userId);

    this.sendMessage(ws, {
      type: 'subscription_confirmed',
      symbols: validSymbols,
      message: `Subscribed to ${validSymbols.length} symbols`,
      timestamp: Date.now()
    });

    console.log(`📊 Client ${clientId} subscribed to: ${validSymbols.join(', ')}`);

    // Start price updates if not already running
    this.startPriceUpdates();
  }

  private handleUnsubscription(clientId: string, symbols?: string[]): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (symbols && Array.isArray(symbols)) {
      // Unsubscribe from specific symbols
      client.symbols = client.symbols.filter(s => !symbols.includes(s));
    } else {
      // Unsubscribe from all symbols
      client.symbols = [];
    }

    realTimePriceService.removeSubscription(clientId);

    this.sendMessage(client.ws, {
      type: 'unsubscription_confirmed',
      symbols: symbols || 'all',
      timestamp: Date.now()
    });

    console.log(`📊 Client ${clientId} unsubscribed from: ${symbols ? symbols.join(', ') : 'all symbols'}`);
    this.checkActiveClients();
  }

  private async handleAuthentication(clientId: string, ws: WebSocket, message: any): Promise<void> {
    const { userId } = message;
    const client = this.clients.get(clientId);

    if (client && userId) {
      client.userId = userId;

      this.sendMessage(ws, {
        type: 'authenticated',
        message: 'User authenticated for personalized features',
        userId: userId,
        timestamp: Date.now()
      });

      console.log(`🔐 Client ${clientId} authenticated as user ${userId}`);
    }
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          console.log(`💔 Terminating dead connection: ${clientId}`);
          client.ws.terminate();
          this.clients.delete(clientId);
          return;
        }

        client.isAlive = false;
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping();
        }
      });
    }, this.HEARTBEAT_INTERVAL);
  }

  private startPriceUpdates(): void {
    if (this.priceUpdateInterval) {
      return; // Already running
    }

    this.priceUpdateInterval = setInterval(async () => {
      await this.broadcastPriceUpdates();
    }, this.UPDATE_INTERVAL);

    console.log('📊 Started enhanced real-time price updates');
  }

  private async broadcastPriceUpdates(): Promise<void> {
    if (this.clients.size === 0) {
      this.stopPriceUpdates();
      return;
    }

    // Get all unique symbols from all clients
    const allSymbols = new Set<string>();
    this.clients.forEach(client => {
      client.symbols.forEach(symbol => allSymbols.add(symbol));
    });

    if (allSymbols.size === 0) return;

    try {
      // Fetch prices in batches to avoid rate limits
      const symbolsArray = Array.from(allSymbols);
      const batchSize = 20;
      const allPrices: CryptoPrice[] = [];

      for (let i = 0; i < symbolsArray.length; i += batchSize) {
        const batch = symbolsArray.slice(i, i + batchSize);
        const batchPrices = await cryptoService.getPrices(batch);
        allPrices.push(...batchPrices);

        // Small delay between batches
        if (i + batchSize < symbolsArray.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      const priceMap = new Map(allPrices.map(p => [p.symbol, p]));

      // Send updates to each client based on their subscriptions
      const updatePromises = Array.from(this.clients.entries()).map(async ([clientId, client]) => {
        if (client.ws.readyState !== WebSocket.OPEN) {
          this.clients.delete(clientId);
          return;
        }

        const clientPrices = client.symbols
          .map(symbol => priceMap.get(symbol))
          .filter(Boolean) as CryptoPrice[];

        if (clientPrices.length > 0) {
          this.sendMessage(client.ws, {
            type: 'price_update',
            data: clientPrices,
            timestamp: Date.now(),
            count: clientPrices.length
          });

          // Check for price alerts if user is authenticated
          if (client.userId) {
            await this.checkPriceAlerts(client.userId, clientPrices, client.ws);
          }
        }
      });

      await Promise.all(updatePromises);

      console.log(`📊 Broadcasted prices for ${allPrices.length} symbols to ${this.clients.size} clients`);
    } catch (error) {
      console.error('❌ Error broadcasting price updates:', error);
    }
  }

  private async checkPriceAlerts(userId: string, prices: CryptoPrice[], ws: WebSocket): Promise<void> {
    try {
      const alerts = await storage.getUserPriceAlerts(userId);

      for (const alert of alerts) {
        if (!alert.isActive || alert.isTriggered) continue;

        const priceData = prices.find(p => p.symbol.toUpperCase() === alert.symbol.toUpperCase());
        if (!priceData) continue;

        const currentPrice = priceData.price;
        const targetPrice = parseFloat(alert.targetPrice);
        let triggered = false;

        if (alert.alertType === 'above' && currentPrice >= targetPrice) {
          triggered = true;
        } else if (alert.alertType === 'below' && currentPrice <= targetPrice) {
          triggered = true;
        }

        if (triggered) {
          // Mark alert as triggered
          await storage.updatePriceAlert(alert.id, { isTriggered: true });

          // Send alert to client
          this.sendMessage(ws, {
            type: 'price_alert',
            data: {
              symbol: alert.symbol,
              price: currentPrice,
              alertType: alert.alertType,
              targetPrice: targetPrice,
              alertId: alert.id
            },
            timestamp: Date.now()
          });

          // Create notification
          await storage.createNotification({
            userId: userId,
            type: 'price_alert',
            title: `Price Alert: ${alert.symbol}`,
            message: `${alert.symbol} has reached $${currentPrice.toFixed(2)} (${alert.alertType} $${targetPrice.toFixed(2)})`,
            data: JSON.stringify({
              symbol: alert.symbol,
              currentPrice,
              targetPrice,
              alertType: alert.alertType
            })
          });

          console.log(`🚨 Price alert triggered for user ${userId}: ${alert.symbol} ${alert.alertType} $${targetPrice}`);
        }
      }
    } catch (error) {
      console.error('❌ Error checking price alerts:', error);
    }
  }

  private stopPriceUpdates(): void {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = null;
      console.log('📊 Stopped price updates (no active clients)');
    }
  }

  private checkActiveClients(): void {
    // Clean up disconnected clients
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState !== WebSocket.OPEN) {
        this.clients.delete(clientId);
      }
    });

    // Stop updates if no clients
    if (this.clients.size === 0) {
      this.stopPriceUpdates();
    }
  }

  private sendMessage(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('❌ Error sending WebSocket message:', error);
      }
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for external use
  async broadcastToAll(message: any): Promise<void> {
    const promises = Array.from(this.clients.values()).map(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        return this.sendMessage(client.ws, message);
      }
    });

    await Promise.all(promises.filter(Boolean));
  }

  getActiveClientsCount(): number {
    return this.clients.size;
  }

  getActiveSymbols(): string[] {
    const symbols = new Set<string>();
    this.clients.forEach(client => {
      client.symbols.forEach(symbol => symbols.add(symbol));
    });
    return Array.from(symbols);
  }

  getConnectionStats(): any {
    return {
      totalClients: this.clients.size,
      uniqueSymbols: this.getActiveSymbols().length,
      rateLimitInfo: cryptoService.getRateLimitInfo(),
      uptime: process.uptime(),
      lastUpdate: new Date().toISOString()
    };
  }

  shutdown(): void {
    console.log('🛑 Shutting down WebSocket server...');

    // Clear all client subscriptions
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        this.sendMessage(client.ws, {
          type: 'server_shutdown',
          message: 'Server is shutting down',
          timestamp: Date.now()
        });
        client.ws.close(1001, 'Server shutdown');
      }
      this.clients.delete(clientId);
    });

    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Remove upgrade listeners
    if (this.httpServer) {
      this.httpServer.removeAllListeners('upgrade');
    }

    // Close WebSocket server
    if (this.wss) {
      this.wss.close(() => {
        console.log('✅ WebSocket server closed');
      });
      this.wss = null;
    }

    realTimePriceService.stop();
    this.isInitialized = false;
  }
}

export const webSocketManager = new WebSocketManager();