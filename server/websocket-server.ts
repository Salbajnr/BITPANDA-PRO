
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { cryptoService, type CryptoPrice } from './crypto-service';
import { storage } from './storage';

interface ClientSubscription {
  ws: WebSocket;
  symbols: string[];
  userId?: string;
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
  private clients = new Map<string, ClientSubscription>();
  private priceUpdateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_INTERVAL = 10000; // 10 seconds

  initialize(server: Server): void {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws'
    });

    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      console.log(`🔌 WebSocket client connected: ${clientId}`);

      // Send welcome message
      this.sendMessage(ws, {
        type: 'connection',
        message: 'Connected to real-time price feed',
        timestamp: Date.now(),
        clientId
      });

      // Handle client messages
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleClientMessage(clientId, ws, message);
        } catch (error) {
          console.error('WebSocket message error:', error);
          this.sendMessage(ws, {
            type: 'error',
            message: 'Invalid message format',
            timestamp: Date.now()
          });
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log(`🔌 WebSocket client disconnected: ${clientId}`);
        this.clients.delete(clientId);
        this.checkActiveClients();
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
        this.checkActiveClients();
      });
    });

    console.log('🚀 WebSocket server initialized on /ws');
  }

  private async handleClientMessage(clientId: string, ws: WebSocket, message: any): Promise<void> {
    switch (message.type) {
      case 'subscribe':
        await this.handleSubscription(clientId, ws, message);
        break;
      
      case 'unsubscribe':
        this.handleUnsubscription(clientId);
        break;
      
      case 'authenticate':
        await this.handleAuthentication(clientId, ws, message);
        break;
      
      default:
        this.sendMessage(ws, {
          type: 'error',
          message: 'Unknown message type',
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

    // Store client subscription
    this.clients.set(clientId, {
      ws,
      symbols: symbols.map(s => s.toUpperCase()),
      userId
    });

    console.log(`📊 Client ${clientId} subscribed to: ${symbols.join(', ')}`);

    // Send initial prices
    try {
      const prices = await cryptoService.getPrices(symbols);
      this.sendMessage(ws, {
        type: 'price_update',
        data: prices,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending initial prices:', error);
    }

    // Start price updates if not already running
    this.startPriceUpdates();
  }

  private handleUnsubscription(clientId: string): void {
    this.clients.delete(clientId);
    console.log(`📊 Client ${clientId} unsubscribed`);
    this.checkActiveClients();
  }

  private async handleAuthentication(clientId: string, ws: WebSocket, message: any): Promise<void> {
    const { userId } = message;
    const client = this.clients.get(clientId);
    
    if (client) {
      client.userId = userId;
      this.clients.set(clientId, client);
      
      this.sendMessage(ws, {
        type: 'authenticated',
        message: 'User authenticated for personalized alerts',
        timestamp: Date.now()
      });
    }
  }

  private startPriceUpdates(): void {
    if (this.priceUpdateInterval) {
      return; // Already running
    }

    this.priceUpdateInterval = setInterval(async () => {
      await this.broadcastPriceUpdates();
    }, this.UPDATE_INTERVAL);

    console.log('📊 Started real-time price updates');
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
      // Fetch prices for all symbols
      const prices = await cryptoService.getPrices(Array.from(allSymbols));
      const priceMap = new Map(prices.map(p => [p.symbol, p]));

      // Send updates to each client based on their subscriptions
      this.clients.forEach(async (client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          const clientPrices = client.symbols
            .map(symbol => priceMap.get(symbol))
            .filter(Boolean) as CryptoPrice[];

          if (clientPrices.length > 0) {
            this.sendMessage(client.ws, {
              type: 'price_update',
              data: clientPrices,
              timestamp: Date.now()
            });
          }

          // Check for price alerts if user is authenticated
          if (client.userId) {
            await this.checkPriceAlerts(client.userId, clientPrices, client.ws);
          }
        } else {
          // Remove disconnected client
          this.clients.delete(clientId);
        }
      });
    } catch (error) {
      console.error('Error broadcasting price updates:', error);
    }
  }

  private async checkPriceAlerts(userId: string, prices: CryptoPrice[], ws: WebSocket): Promise<void> {
    try {
      const alerts = await storage.getPriceAlerts(userId);
      
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
              targetPrice: targetPrice
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
      console.error('Error checking price alerts:', error);
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
      ws.send(JSON.stringify(message));
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for external use
  async broadcastToAll(message: any): Promise<void> {
    this.clients.forEach((client) => {
      this.sendMessage(client.ws, message);
    });
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

  shutdown(): void {
    this.stopPriceUpdates();
    this.clients.clear();
    if (this.wss) {
      this.wss.close();
    }
  }
}

export const webSocketManager = new WebSocketManager();
