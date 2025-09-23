
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useRealTimePrices } from '../hooks/useRealTimePrices';
import { TrendingUp, TrendingDown, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function RealTimePriceIntegration() {
  const [selectedSymbols, setSelectedSymbols] = useState(['BTC', 'ETH', 'ADA']);
  const [logs, setLogs] = useState<string[]>([]);

  const { 
    prices, 
    isConnected, 
    isConnecting, 
    connectionError, 
    lastUpdate,
    getPrice,
    getChange,
    connect,
    disconnect,
    subscribe
  } = useRealTimePrices({
    symbols: selectedSymbols,
    enabled: true,
    onPriceUpdate: (priceData) => {
      addLog(`Price update: ${priceData.symbol} = $${priceData.price.toFixed(2)}`);
    },
    onConnectionChange: (connected) => {
      addLog(`Connection ${connected ? 'established' : 'lost'}`);
    }
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
  };

  const availableSymbols = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'LINK'];

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Real-Time Price Integration Test
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {isConnecting && <RefreshCw className="w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Connection Status */}
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-2">
              <Button onClick={connect} disabled={isConnected || isConnecting}>
                Connect
              </Button>
              <Button onClick={disconnect} disabled={!isConnected}>
                Disconnect
              </Button>
            </div>
            {connectionError && (
              <p className="text-red-500 text-sm">{connectionError}</p>
            )}
            {lastUpdate && (
              <p className="text-gray-500 text-sm">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Symbol Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Select Symbols</h3>
            <div className="flex flex-wrap gap-2">
              {availableSymbols.map(symbol => (
                <Button
                  key={symbol}
                  variant={selectedSymbols.includes(symbol) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSymbol(symbol)}
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {selectedSymbols.map(symbol => {
              const price = getPrice(symbol);
              const change = getChange(symbol);
              const isPositive = change >= 0;

              return (
                <Card key={symbol}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{symbol}</h4>
                      <Badge variant={isPositive ? "default" : "destructive"}>
                        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">
                      ${price > 0 ? price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: price < 1 ? 6 : 2
                      }) : 'Loading...'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Activity Log */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Activity Log</h3>
            <div className="bg-gray-100 p-3 rounded-lg h-40 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No activity yet...</p>
              ) : (
                logs.map((log, index) => (
                  <p key={index} className="text-sm font-mono mb-1">{log}</p>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
            <p><strong>Connecting:</strong> {isConnecting ? 'Yes' : 'No'}</p>
            <p><strong>Selected Symbols:</strong> {selectedSymbols.join(', ')}</p>
            <p><strong>Prices Received:</strong> {prices.length}</p>
            <p><strong>Last Update:</strong> {lastUpdate ? lastUpdate.toISOString() : 'Never'}</p>
            {connectionError && <p><strong>Error:</strong> {connectionError}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
