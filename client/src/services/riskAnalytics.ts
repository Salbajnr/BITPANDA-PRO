
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
    // Simplified beta calculation
    return 1.0; // Placeholder
  }

  private static calculateCorrelation(portfolio: any[]): number {
    // Correlation with market
    return 0.7; // Placeholder
  }

  private static calculateVolatility(portfolio: any[]): number {
    const returns = portfolio.map(asset => asset.dailyReturn || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    return Math.sqrt(variance) * 100; // As percentage
  }
}
