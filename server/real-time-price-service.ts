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
  private readonly UPDATE_FREQUENCY = 15000; // 15 seconds for more responsive updates
  private isRunning = false;

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  start() {
    if (this.isRunning) return;

    console.log('🚀 Starting Real-Time Price Service (HTTP mode for Replit)...');
    this.isRunning = true;
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

    this.subscriptions.clear();
    this.priceCache.clear();
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
    // Start HTTP-based price updates
    this.updateInterval = setInterval(async () => {
      await this.updatePrices();
    }, this.UPDATE_FREQUENCY);

    // Initial update
    setTimeout(() => this.updatePrices(), 1000);

    console.log('⚡ Real-time price updates started (HTTP mode)');
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

        // Always broadcast to ensure clients get updates (even small changes)
        this.priceCache.set(update.symbol, update);
        this.broadcastPriceUpdate(update);
      });

      console.log(`📊 Updated prices for ${updates.length} symbols`);
    } catch (error) {
      console.error('Error updating prices:', error);
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
}

export const realTimePriceService = new RealTimePriceService();