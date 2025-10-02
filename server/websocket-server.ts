import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

interface ClientSubscription {
  ws: WebSocket;
  symbols: string[];
  interval?: NodeJS.Timeout;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientSubscription> = new Map();
  private isInitialized = false;

  initialize(httpServer: Server) {
    if (this.isInitialized) {
      console.log('⚠️ WebSocket manager already initialized');
      return;
    }

    this.wss = new WebSocketServer({ noServer: true });

    // Handle upgrade requests only once
    httpServer.on('upgrade', (request, socket, head) => {
      const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;

      if (pathname === '/ws') {
        console.log('🔌 WebSocket upgrade request for:', pathname);
        this.wss!.handleUpgrade(request, socket, head, (ws) => {
          this.wss!.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });

    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = Date.now().toString() + Math.random().toString(36);
      console.log('Client connected to WebSocket');

      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to live price feed',
        timestamp: Date.now(),
        clientId
      }));

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());

          if (message.type === 'subscribe') {
            await this.handleSubscribe(clientId, ws, message.symbols);
          }

          if (message.type === 'unsubscribe') {
            this.handleUnsubscribe(clientId);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
        this.handleUnsubscribe(clientId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleUnsubscribe(clientId);
      });
    });

    this.isInitialized = true;
    console.log('✅ WebSocket manager initialized successfully');
  }

  private async handleSubscribe(clientId: string, ws: WebSocket, symbols: string[]) {
    console.log('Client subscribed to:', symbols);

    // Clear existing subscription
    this.handleUnsubscribe(clientId);

    // Send initial prices
    await this.sendPriceUpdates(ws, symbols);

    // Start periodic updates
    const interval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        await this.sendPriceUpdates(ws, symbols);
      } else {
        clearInterval(interval);
        this.clients.delete(clientId);
      }
    }, 30000); // 30 seconds

    this.clients.set(clientId, { ws, symbols, interval });
  }

  private handleUnsubscribe(clientId: string) {
    const client = this.clients.get(clientId);
    if (client?.interval) {
      clearInterval(client.interval);
    }
    this.clients.delete(clientId);
  }

  private async sendPriceUpdates(ws: WebSocket, symbols: string[]) {
    try {
      const { cryptoService } = await import('./crypto-service');

      for (const symbol of symbols) {
        try {
          const symbolKey = symbol.replace('bitcoin', 'BTC').replace('ethereum', 'ETH').toUpperCase();
          const priceData = await cryptoService.getPrice(symbolKey);

          if (priceData && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'price_update',
              symbol: symbol,
              price: priceData.price,
              change_24h: priceData.change_24h,
              volume_24h: priceData.volume_24h,
              market_cap: priceData.market_cap,
              timestamp: Date.now()
            }));
          }
        } catch (error) {
          console.error(`Error fetching price for ${symbol}:`, error);
        }
      }
    } catch (error) {
      console.error('Error sending price updates:', error);
    }
  }

  shutdown() {
    console.log('🔌 Shutting down WebSocket manager...');
    this.clients.forEach((client) => {
      if (client.interval) {
        clearInterval(client.interval);
      }
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.close();
      }
    });
    this.clients.clear();

    if (this.wss) {
      this.wss.close();
    }
    this.isInitialized = false;
    console.log('✅ WebSocket manager shutdown complete');
  }
}

export const webSocketManager = new WebSocketManager();