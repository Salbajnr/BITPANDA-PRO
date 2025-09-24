
export interface RiskMetrics {
  valueAtRisk: number;
  sharpeRatio: number;
  beta: number;
  correlation: number;
  volatility: number;
}

export class RiskAnalyticsService {
  static calculateVaR(portfolio: any[], confidenceLevel: number = 0.05): number {
    // Value at Risk calculation
    const returns = portfolio.map(asset => asset.dailyReturn || 0);
    returns.sort((a, b) => a - b);
    const index = Math.floor(returns.length * confidenceLevel);
    return returns[index] || 0;
  }

  static calculateSharpeRatio(portfolio: any[]): number {
    // Sharpe ratio calculation
    const returns = portfolio.map(asset => asset.dailyReturn || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);
    return volatility > 0 ? avgReturn / volatility : 0;
  }

  static calculatePortfolioMetrics(portfolio: any[]): RiskMetrics {
    return {
      valueAtRisk: this.calculateVaR(portfolio),
      sharpeRatio: this.calculateSharpeRatio(portfolio),
      beta: this.calculateBeta(portfolio),
      correlation: this.calculateCorrelation(portfolio),
      volatility: this.calculateVolatility(portfolio)
    };
  }

  private static calculateBeta(portfolio: any[]): number {
    if (portfolio.length === 0) return 1.0;
    
    // Calculate portfolio beta as weighted average of individual asset betas
    const totalValue = portfolio.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
    if (totalValue === 0) return 1.0;
    
    const weightedBeta = portfolio.reduce((sum, asset) => {
      const weight = (asset.currentValue || 0) / totalValue;
      const assetBeta = this.getAssetBeta(asset.symbol);
      return sum + (weight * assetBeta);
    }, 0);
    
    return Math.round(weightedBeta * 100) / 100;
  }

  private static calculateCorrelation(portfolio: any[]): number {
    if (portfolio.length < 2) return 0;
    
    // Calculate correlation between portfolio returns and market returns
    const portfolioReturns = portfolio.map(asset => asset.dailyReturn || 0);
    const marketReturns = this.getMarketReturns(portfolioReturns.length);
    
    if (portfolioReturns.length !== marketReturns.length) return 0.7;
    
    const correlation = this.pearsonCorrelation(portfolioReturns, marketReturns);
    return Math.round(correlation * 100) / 100;
  }

  private static getAssetBeta(symbol: string): number {
    // Asset-specific beta values (would normally come from financial data API)
    const betaMap: { [key: string]: number } = {
      'BTC': 1.8,
      'ETH': 1.5,
      'BNB': 1.3,
      'ADA': 1.4,
      'SOL': 2.0,
      'XRP': 1.2,
      'DOT': 1.6,
      'DOGE': 2.5,
      'AVAX': 1.7,
      'MATIC': 1.5,
      'LTC': 1.1,
      'UNI': 1.4,
      'LINK': 1.3
    };
    
    return betaMap[symbol.toUpperCase()] || 1.0;
  }

  private static getMarketReturns(length: number): number[] {
    // Simulate market returns (would normally come from market index data)
    return Array.from({ length }, () => (Math.random() - 0.5) * 0.1);
  }

  private static pearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  static calculateRiskScore(portfolio: any[]): number {
    const metrics = this.calculatePortfolioMetrics(portfolio);
    
    // Risk score based on volatility and VaR
    const volatilityWeight = 0.4;
    const varWeight = 0.3;
    const betaWeight = 0.2;
    const sharpeWeight = 0.1;
    
    const normalizedVolatility = Math.min(metrics.volatility / 50, 1); // Normalize to 0-1
    const normalizedVaR = Math.min(Math.abs(metrics.valueAtRisk) / 0.1, 1);
    const normalizedBeta = Math.min(metrics.beta / 2, 1);
    const normalizedSharpe = Math.max(0, Math.min(metrics.sharpeRatio / 2, 1));
    
    const riskScore = (
      normalizedVolatility * volatilityWeight +
      normalizedVaR * varWeight +
      normalizedBeta * betaWeight -
      normalizedSharpe * sharpeWeight
    ) * 100;
    
    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }

  private static calculateVolatility(portfolio: any[]): number {
    const returns = portfolio.map(asset => asset.dailyReturn || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    return Math.sqrt(variance) * 100; // As percentage
  }
}
