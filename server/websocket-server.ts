
import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Patch WebSocket type to allow isAlive for our use
type PatchedWebSocket = WebSocket & {
  isAlive?: boolean;
};

interface ClientSubscription {
  ws: WebSocket;
  symbols: string[];
  interval?: NodeJS.Timeout;
}

class WebSocketManager {
  private wss: any = null;
  private clients: Map<string, ClientSubscription> = new Map();
  private isInitialized = false;
  private connectionsByIp: Map<string, number> = new Map();
  // Rate limiting per IP - increased for real-time price updates
  private connectionLimits = new Map<string, number>();
  private readonly MAX_CONNECTIONS_PER_IP = 50; // Increased limit to handle reconnections

  initialize(httpServer: Server) {
    if (this.isInitialized) {
      console.warn("⚠️ WebSocket manager already initialized, skipping reinitialization");
      return;
    }

    this.wss = new WebSocketServer({
      noServer: true,
      path: '/ws'
    });

    // Handle upgrade requests only once
    httpServer.on('upgrade', (request, socket, head) => {
      const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;

      if (pathname === '/ws') {
        // Get client IP (safely handle string | string[])
                const xffHeader = request.headers['x-forwarded-for'];
                let clientIp = 'unknown';
                if (typeof xffHeader === 'string') {
                  clientIp = xffHeader.split(',')[0].trim();
                } else if (Array.isArray(xffHeader) && xffHeader.length > 0) {
                  // If it's an array, take the first element and split in case it contains multiple addresses
                  clientIp = String(xffHeader[0]).split(',')[0].trim();
                } else {
                  clientIp = request.socket.remoteAddress || 'unknown';
                }

        // Check connection limit
        const currentConnections = this.connectionsByIp.get(clientIp) || 0;
        if (currentConnections >= this.MAX_CONNECTIONS_PER_IP) {
          console.log(`❌ Connection limit reached for IP: ${clientIp}`);
          socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
          socket.destroy();
          return;
        }

        console.log('🔌 WebSocket upgrade request for:', pathname);
        this.wss!.handleUpgrade(request, socket, head, (ws: WebSocket) => {
          this.wss!.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });

  this.wss.on('connection', (ws: PatchedWebSocket, request: any) => {
      const clientIp = request.headers['x-forwarded-for']?.split(',')[0] ||
                      request.socket.remoteAddress ||
                      'unknown';

      // Increment connection count
      const currentCount = (this.connectionsByIp.get(clientIp) || 0) + 1;
      this.connectionsByIp.set(clientIp, currentCount);

      const clientId = Date.now().toString() + Math.random().toString(36);
      console.log(`✅ WebSocket connected - IP: ${clientIp}, Count: ${currentCount}/${this.MAX_CONNECTIONS_PER_IP}`);

      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to live price feed',
        timestamp: Date.now(),
        clientId
      }));

  (ws as any).on('message', async (data: any) => {
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

  (ws as any).on('close', () => {
        console.log(`Client disconnected from WebSocket (IP: ${clientIp})`);
        this.handleUnsubscribe(clientId);

        // Decrement connection count with safety check
        const count = this.connectionsByIp.get(clientIp) || 0;
        if (count <= 1) {
          this.connectionsByIp.delete(clientIp);
          console.log(`✓ All connections closed for IP: ${clientIp}`);
        } else {
          this.connectionsByIp.set(clientIp, count - 1);
          console.log(`✓ Connection closed for IP: ${clientIp} (${count - 1} remaining)`);
        }
      });

  (ws as any).on('error', async (error: any) => {
        console.error(`🔌 WebSocket error for IP ${clientIp}:`, error);

        // Log the error for monitoring
        try {
          const { auditService } = await import('./audit-service');
          await auditService.logSecurityEvent({
            type: 'suspicious_activity',
            ip: clientIp,
            userAgent: request.headers['user-agent'],
            details: {
              error: error.message,
              errorCode: error.code,
              wsClientId: clientId,
              action: 'websocket_error'
            },
            severity: 'medium'
          });
        } catch (logError) {
          console.error('Failed to log WebSocket error:', logError);
        }

        // Only handle cleanup if not already closed
        if (ws.readyState !== ws.CLOSED && ws.readyState !== ws.CLOSING) {
          this.handleUnsubscribe(clientId);

          // Decrement connection count on error with safety check
          const count = this.connectionsByIp.get(clientIp) || 0;
          if (count <= 1) {
            this.connectionsByIp.delete(clientIp);
            console.log(`✓ Cleaned up connections on error for IP: ${clientIp}`);
          } else {
            this.connectionsByIp.set(clientIp, count - 1);
            console.log(`✓ Error cleanup for IP: ${clientIp} (${count - 1} remaining)`);
          }

          // Attempt graceful close with timeout
          try {
            ws.close(1011, 'Server error occurred');
            
            // Force close if graceful close doesn't work within 5 seconds
            setTimeout(() => {
              if (ws.readyState !== ws.CLOSED) {
                console.log(`🔌 Force terminating WebSocket connection for IP: ${clientIp}`);
                if (typeof (ws as any).terminate === 'function') {
                  (ws as any).terminate();
                }
              }
            }, 5000);
          } catch (closeError) {
            console.error('Failed to close WebSocket on error:', closeError);
          }
        }
      });
    });

    // Periodic cleanup of stale connection tracking (every 5 minutes)
    setInterval(() => {
      const staleIps: string[] = [];
      this.connectionsByIp.forEach((count, ip) => {
        if (count <= 0) {
          staleIps.push(ip);
        }
      });
      staleIps.forEach(ip => this.connectionsByIp.delete(ip));
      if (staleIps.length > 0) {
        console.log(`🧹 Cleaned up ${staleIps.length} stale IP connection tracking entries`);
      }
    }, 5 * 60 * 1000);

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

  init(httpServer: Server) {
    this.initialize(httpServer);
  }

  shutdown() {
    console.log('🔌 Shutting down WebSocket server...');
    try {
      this.clients.forEach(client => {
        try {
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.close(1000, 'Server shutting down');
          }
        } catch (error) {
          console.error('Error closing WebSocket connection:', error);
        }
      });
      this.clients.clear();
      this.connectionsByIp.clear();
      console.log('✅ WebSocket server shutdown complete');
    } catch (error) {
      console.error('❌ Error during WebSocket shutdown:', error);
    }
  }
}

export const webSocketManager = new WebSocketManager();

export function setupWebSocketServer(server: any) {

  const wss = new WebSocketServer({
    server,
    path: '/ws/prices',
    perMessageDeflate: false,
    clientTracking: true
  });

  // Track connected clients
  const clients = new Set<PatchedWebSocket>();

  wss.on('connection', (ws: PatchedWebSocket, req: any) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`✅ WebSocket client connected from ${clientIp}`);


  ws.isAlive = true;
  clients.add(ws);

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'WebSocket connection established',
      timestamp: new Date().toISOString()
    }));

    (ws as any).on('pong', () => {
      ws.isAlive = true;
    });

    (ws as any).on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 Received message:', data);

        // Handle subscription requests
        if (data.type === 'subscribe') {
          ws.send(JSON.stringify({
            type: 'subscribed',
            symbols: data.symbols || []
          }));
        }
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    });

    (ws as any).on('close', (code: number, reason: string) => {
      console.log(`❌ WebSocket client disconnected: ${code} - ${reason}`);
      clients.delete(ws);
    });

    (ws as any).on('error', (error: Error) => {
      console.error('❌ WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Heartbeat to detect broken connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws: PatchedWebSocket) => {
      if (ws.isAlive === false) {
        console.log('🔌 Terminating inactive WebSocket connection');
        clients.delete(ws);
        if (typeof (ws as any).terminate === 'function') {
          return (ws as any).terminate();
        }
      }
      ws.isAlive = false;
      if (typeof (ws as any).ping === 'function') {
        (ws as any).ping();
      }
    });
  }, 30000);

  // Broadcast price updates every 5 seconds
  const priceUpdateInterval = setInterval(() => {
    if (clients.size === 0) return;

    const mockPrices = {
      type: 'price_update',
      data: [
        { symbol: 'BTC', price: (Math.random() * 1000 + 67000).toFixed(2), change24h: (Math.random() * 10 - 5).toFixed(2) },
        { symbol: 'ETH', price: (Math.random() * 100 + 3400).toFixed(2), change24h: (Math.random() * 10 - 5).toFixed(2) },
        { symbol: 'SOL', price: (Math.random() * 50 + 150).toFixed(2), change24h: (Math.random() * 10 - 5).toFixed(2) }
      ],
      timestamp: new Date().toISOString()
    };

    const message = JSON.stringify(mockPrices);
    clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }, 5000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
    clearInterval(priceUpdateInterval);
  });

  console.log('🚀 WebSocket server initialized on /ws/prices');
  console.log('📡 Broadcasting price updates every 5 seconds');

  return wss;
}