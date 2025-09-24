import { EventEmitter } from 'events';
import { WebSocketServer, WebSocket } from 'ws';
import { cryptoService, type CryptoPrice } from './crypto-service';

interface PriceSubscription {
  ws: WebSocket;
  symbols: string[];
  userId?: string;
  lastUpdate?: number;
}

interface PriceUpdate {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  timestamp: number;
}

class RealTimePriceService extends EventEmitter {
  private subscriptions = new Map<string, PriceSubscription>();
  private priceCache = new Map<string, PriceUpdate>();
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_FREQUENCY = 10000; // 10 seconds
  private isRunning = false;

  // WebSocket properties (kept for potential future use or debugging)
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 5000; // 5 seconds

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  start() {
    if (this.isRunning) return;

    console.log('🚀 Starting Real-Time Price Service...');
    this.isRunning = true;
    // Removed the call to connectToPriceFeed() as it's handled by startPriceUpdates and modified logic
    this.startPriceUpdates();
  }

  stop() {
    if (!this.isRunning) return;

    console.log('🛑 Stopping Real-Time Price Service...');
    this.isRunning = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // Clean up WebSocket if it was initialized
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
      this.ws = null;
    }

    this.subscriptions.clear();
    this.priceCache.clear();
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  addSubscription(clientId: string, ws: WebSocket, symbols: string[], userId?: string) {
    this.subscriptions.set(clientId, {
      ws,
      symbols: symbols.map(s => s.toLowerCase()),
      userId,
      lastUpdate: Date.now()
    });

    console.log(`📊 Client ${clientId} subscribed to: ${symbols.join(', ')}`);

    // Send immediate price update for subscribed symbols
    this.sendInitialPrices(clientId, symbols);
  }

  removeSubscription(clientId: string) {
    if (this.subscriptions.delete(clientId)) {
      console.log(`📊 Client ${clientId} unsubscribed`);
    }
  }

  private async sendInitialPrices(clientId: string, symbols: string[]) {
    const subscription = this.subscriptions.get(clientId);
    if (!subscription || subscription.ws.readyState !== WebSocket.OPEN) return;

    try {
      const prices = await cryptoService.getPrices(symbols);
      const updates: PriceUpdate[] = prices.map(price => ({
        symbol: price.symbol.toLowerCase(),
        price: price.price,
        change_24h: price.change_24h,
        volume_24h: price.volume_24h,
        market_cap: price.market_cap,
        timestamp: Date.now()
      }));

      this.sendToClient(subscription.ws, {
        type: 'price_update',
        data: updates,
        timestamp: Date.now()
      });

      // Cache the prices
      updates.forEach(update => {
        this.priceCache.set(update.symbol, update);
      });

    } catch (error) {
      console.error('Error sending initial prices:', error);
    }
  }

  private startPriceUpdates() {
    // Connect to price feed using the modified logic
    this.connectToPriceFeed();

    // Continue with interval-based updates, which will now rely on the HTTP fallback
    this.updateInterval = setInterval(async () => {
      // If not connected via WebSocket, this will still trigger HTTP fetches if startHttpPriceFetching is active
      await this.updatePrices();
    }, this.UPDATE_FREQUENCY);

    // Initial update attempt
    setTimeout(() => this.updatePrices(), 1000);
  }

  private async updatePrices() {
    if (this.subscriptions.size === 0) return;

    // Get all unique symbols from subscriptions
    const allSymbols = new Set<string>();
    this.subscriptions.forEach(sub => {
      sub.symbols.forEach(symbol => allSymbols.add(symbol));
    });

    if (allSymbols.size === 0) return;

    try {
      const symbolsArray = Array.from(allSymbols);
      const prices = await cryptoService.getPrices(symbolsArray);

      const updates: PriceUpdate[] = prices.map(price => ({
        symbol: price.symbol.toLowerCase(),
        price: price.price,
        change_24h: price.change_24h,
        volume_24h: price.volume_24h,
        market_cap: price.market_cap,
        timestamp: Date.now()
      }));

      // Update cache and broadcast to clients
      updates.forEach(update => {
        const cached = this.priceCache.get(update.symbol);

        // Only broadcast if price changed significantly (> 0.01% or first time)
        if (!cached || Math.abs((update.price - cached.price) / cached.price) > 0.0001) {
          this.priceCache.set(update.symbol, update);
          this.broadcastPriceUpdate(update);
        }
      });

      console.log(`📊 Updated prices for ${updates.length} symbols`);
    } catch (error) {
      console.error('Error updating prices:', error);
      // If HTTP fetching is the fallback, errors here are critical
      if (!this.isConnected) {
        console.error('HTTP price fetching also failed. Service may be unavailable.');
      }
    }
  }

  private broadcastPriceUpdate(update: PriceUpdate) {
    const message = {
      type: 'price_update',
      data: [update],
      timestamp: update.timestamp
    };

    this.subscriptions.forEach((subscription, clientId) => {
      if (subscription.symbols.includes(update.symbol)) {
        if (subscription.ws.readyState === WebSocket.OPEN) {
          this.sendToClient(subscription.ws, message);
        } else {
          // Clean up dead connections
          this.removeSubscription(clientId);
        }
      }
    });

    // Emit event for other services
    this.emit('priceUpdate', update);
  }

  private sendToClient(ws: WebSocket, message: any) {
    try {
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message to client:', error);
    }
  }

  // Public methods for other services
  getPrice(symbol: string): PriceUpdate | null {
    return this.priceCache.get(symbol.toLowerCase()) || null;
  }

  getAllPrices(): PriceUpdate[] {
    return Array.from(this.priceCache.values());
  }

  getActiveSymbols(): string[] {
    return Array.from(this.priceCache.keys());
  }

  getSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  // Modified connection logic
  private connectToPriceFeed(): void {
    try {
      console.log('🔌 Connecting to price feed...');

      // Try connecting to a reliable WebSocket endpoint
      if (this.connectionAttempts < this.MAX_RECONNECT_ATTEMPTS) {
        this.connectWebSocketWithRetry();
      } else {
        console.log('⚠️ WebSocket price feed disabled after max attempts, using HTTP fallback');
        this.isConnected = false;
        this.startHttpPriceFetching();
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.startHttpPriceFetching();
    }
  }

  private startHttpPriceFetching(): void {
    // Fetch prices via HTTP every 30 seconds as fallback
    // This logic is now integrated into the updatePrices method called by the interval
    console.log('⚡ Starting HTTP price fetching as fallback...');
    // The interval is already set in startPriceUpdates. This method mainly serves to log and confirm the fallback.
  }

  // WebSocket reconnection logic
  private connectWebSocketWithRetry(): void {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error('Max WebSocket reconnect attempts reached. Falling back to HTTP.');
      this.startHttpPriceFetching();
      return;
    }

    this.ws = new WebSocket('wss://ws-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest');

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected successfully.');
      this.isConnected = true;
      this.reconnectAttempts = 0; // Reset attempts on successful connection
      this.emit('connected');
      // Subscribe to initial symbols if any
      this.subscriptions.forEach((sub, clientId) => {
        this.sendSubscription(clientId, sub.symbols);
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        if (message.type === 'price_update') {
          const updates: PriceUpdate[] = message.data;
          updates.forEach(update => {
            this.priceCache.set(update.symbol, update);
            this.broadcastPriceUpdate(update); // Broadcast to internal subscribers
          });
          this.emit('pricesReceived', updates);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`❌ WebSocket disconnected: ${event.code} ${event.reason}`);
      this.isConnected = false;
      this.emit('disconnected');
      // Attempt to reconnect
      this.reconnectAttempts++;
      setTimeout(() => this.connectWebSocketWithRetry(), this.RECONNECT_DELAY);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // The 'onclose' event will typically follow, triggering reconnection
    };
  }

  private sendSubscription(clientId: string, symbols: string[]): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'subscribe',
        symbols: symbols,
        clientId: clientId
      };
      this.sendToClient(this.ws, message);
    } else {
      console.warn(`Cannot subscribe for ${clientId}: WebSocket not open.`);
    }
  }
}

export const realTimePriceService = new RealTimePriceService();