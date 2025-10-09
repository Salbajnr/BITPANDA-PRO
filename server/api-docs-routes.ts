
import { Router } from 'express';

const router = Router();

// API documentation endpoint
router.get('/endpoints', (req, res) => {
  const endpoints = [
    // Authentication
    { method: 'POST', path: '/api/user/auth/login', description: 'User login' },
    { method: 'POST', path: '/api/user/auth/register', description: 'User registration' },
    { method: 'POST', path: '/api/user/auth/logout', description: 'User logout' },
    { method: 'GET', path: '/api/user/auth/user', description: 'Get current user' },
    { method: 'POST', path: '/api/admin/auth/login', description: 'Admin login' },
    { method: 'POST', path: '/api/admin/auth/logout', description: 'Admin logout' },
    { method: 'GET', path: '/api/admin/auth/user', description: 'Get current admin' },
    
    // Crypto
    { method: 'GET', path: '/api/crypto/top/:limit?', description: 'Get top cryptocurrencies' },
    { method: 'GET', path: '/api/crypto/price/:symbol', description: 'Get single crypto price' },
    { method: 'POST', path: '/api/crypto/prices', description: 'Get multiple crypto prices' },
    { method: 'GET', path: '/api/crypto/details/:coinId', description: 'Get crypto details' },
    { method: 'GET', path: '/api/crypto/market-data', description: 'Get market overview' },
    { method: 'GET', path: '/api/crypto/search', description: 'Search cryptocurrencies' },
    { method: 'GET', path: '/api/crypto/history/:coinId', description: 'Get price history' },
    { method: 'GET', path: '/api/crypto/trending', description: 'Get trending cryptos' },
    
    // Metals
    { method: 'GET', path: '/api/metals/price/:symbol', description: 'Get metal price' },
    { method: 'POST', path: '/api/metals/prices', description: 'Get multiple metal prices' },
    { method: 'GET', path: '/api/metals/top/:limit?', description: 'Get top metals' },
    { method: 'GET', path: '/api/metals/market-data', description: 'Get metals market data' },
    { method: 'GET', path: '/api/metals/history/:symbol', description: 'Get metal price history' },
    { method: 'GET', path: '/api/metals/health', description: 'Metals API health check' },
    
    // Trading
    { method: 'POST', path: '/api/trade', description: 'Execute trade' },
    { method: 'GET', path: '/api/trading/orders', description: 'Get user orders' },
    { method: 'POST', path: '/api/trading/buy', description: 'Buy asset' },
    { method: 'POST', path: '/api/trading/sell', description: 'Sell asset' },
    
    // Portfolio
    { method: 'GET', path: '/api/portfolio', description: 'Get portfolio' },
    { method: 'GET', path: '/api/portfolio/holdings', description: 'Get holdings' },
    { method: 'GET', path: '/api/portfolio/transactions', description: 'Get transactions' },
    { method: 'GET', path: '/api/portfolio/analytics', description: 'Get portfolio analytics' },
    { method: 'GET', path: '/api/portfolio/performance', description: 'Get performance metrics' },
    
    // Alerts
    { method: 'GET', path: '/api/alerts', description: 'Get user alerts' },
    { method: 'POST', path: '/api/alerts', description: 'Create alert' },
    { method: 'PUT', path: '/api/alerts/:alertId', description: 'Update alert' },
    { method: 'DELETE', path: '/api/alerts/:alertId', description: 'Delete alert' },
    { method: 'GET', path: '/api/alerts/notifications', description: 'Get notifications' },
    
    // Deposits
    { method: 'GET', path: '/api/deposits', description: 'Get deposits' },
    { method: 'POST', path: '/api/deposits', description: 'Create deposit' },
    { method: 'POST', path: '/api/deposits/:depositId/proof', description: 'Upload proof' },
    
    // Withdrawals
    { method: 'GET', path: '/api/withdrawals', description: 'Get withdrawals' },
    { method: 'POST', path: '/api/withdrawals/request', description: 'Request withdrawal' },
    { method: 'POST', path: '/api/withdrawals/confirm', description: 'Confirm withdrawal' },
    { method: 'GET', path: '/api/withdrawals/limits', description: 'Get withdrawal limits' },
    
    // News
    { method: 'GET', path: '/api/news', description: 'Get news articles' },
    { method: 'GET', path: '/api/news/:id', description: 'Get news by ID' },
    { method: 'GET', path: '/api/news/search', description: 'Search news' },
    { method: 'GET', path: '/api/news/categories', description: 'Get news categories' },
    
    // Admin
    { method: 'GET', path: '/api/admin/users', description: 'Get all users (admin)' },
    { method: 'POST', path: '/api/admin/simulate-balance', description: 'Simulate balance (admin)' },
    { method: 'GET', path: '/api/admin/deposits', description: 'Get all deposits (admin)' },
    { method: 'POST', path: '/api/admin/deposits/:id/approve', description: 'Approve deposit (admin)' },
    { method: 'POST', path: '/api/admin/deposits/:id/reject', description: 'Reject deposit (admin)' },
    
    // KYC
    { method: 'GET', path: '/api/kyc', description: 'Get KYC status' },
    { method: 'POST', path: '/api/kyc/submit', description: 'Submit KYC' },
    
    // Support
    { method: 'GET', path: '/api/support/chat/messages', description: 'Get chat messages' },
    { method: 'POST', path: '/api/support/chat/send', description: 'Send chat message' },
    
    // Market Research
    { method: 'GET', path: '/api/research/reports', description: 'Get research reports' },
    { method: 'GET', path: '/api/research/reports/:id', description: 'Get report by ID' },
    
    // Investment Plans
    { method: 'GET', path: '/api/investment-plans', description: 'Get investment plans' },
    { method: 'POST', path: '/api/investment-plans/subscribe', description: 'Subscribe to plan' },
    
    // Savings Plans
    { method: 'GET', path: '/api/savings-plans', description: 'Get savings plans' },
    { method: 'POST', path: '/api/savings-plans/create', description: 'Create savings plan' },
    
    // Staking
    { method: 'GET', path: '/api/staking/pools', description: 'Get staking pools' },
    { method: 'POST', path: '/api/staking/stake', description: 'Stake tokens' },
    
    // Lending
    { method: 'GET', path: '/api/lending/offers', description: 'Get lending offers' },
    { method: 'POST', path: '/api/lending/lend', description: 'Lend assets' },
    
    // Health & Status
    { method: 'GET', path: '/health', description: 'Server health check' },
  ];

  res.json({
    success: true,
    count: endpoints.length,
    endpoints: endpoints
  });
});

export default router;
