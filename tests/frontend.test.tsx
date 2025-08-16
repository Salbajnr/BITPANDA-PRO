
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../client/src/pages/Dashboard';
import Trading from '../client/src/pages/Trading';
import PortfolioAnalytics from '../client/src/pages/PortfolioAnalytics';
import Auth from '../client/src/pages/Auth';

// Mock API calls
vi.mock('../client/src/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

const createWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Frontend Component Tests', () => {
  describe('Authentication Page', () => {
    it('should render login form', () => {
      render(<Auth />, { wrapper: createWrapper });
      
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should switch to register form', async () => {
      render(<Auth />, { wrapper: createWrapper });
      
      const registerTab = screen.getByText(/register/i);
      fireEvent.click(registerTab);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Page', () => {
    it('should render portfolio overview', async () => {
      const mockPortfolio = {
        totalValue: '50000',
        totalGainLoss: '5000',
        totalGainLossPercentage: '10'
      };

      vi.mocked(require('../client/src/lib/api').api.get).mockResolvedValue({
        data: mockPortfolio
      });

      render(<Dashboard />, { wrapper: createWrapper });
      
      await waitFor(() => {
        expect(screen.getByText(/portfolio value/i)).toBeInTheDocument();
      });
    });
  });

  describe('Trading Page', () => {
    it('should render trading interface', () => {
      render(<Trading />, { wrapper: createWrapper });
      
      expect(screen.getByText(/buy/i)).toBeInTheDocument();
      expect(screen.getByText(/sell/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument();
    });

    it('should handle buy order submission', async () => {
      const mockBuyOrder = { success: true, orderId: '123' };
      
      vi.mocked(require('../client/src/lib/api').api.post).mockResolvedValue({
        data: mockBuyOrder
      });

      render(<Trading />, { wrapper: createWrapper });
      
      const buyButton = screen.getByRole('button', { name: /buy/i });
      fireEvent.click(buyButton);
      
      // Add more specific test logic based on your trading component
    });
  });

  describe('Portfolio Analytics Page', () => {
    it('should render analytics charts', async () => {
      const mockAnalytics = {
        totalValue: '50000',
        totalGainLoss: '5000',
        holdings: [
          { symbol: 'BTC', amount: '0.5', value: '22500' },
          { symbol: 'ETH', amount: '10', value: '25000' }
        ]
      };

      vi.mocked(require('../client/src/lib/api').api.get).mockResolvedValue({
        data: mockAnalytics
      });

      render(<PortfolioAnalytics />, { wrapper: createWrapper });
      
      await waitFor(() => {
        expect(screen.getByText(/portfolio analytics/i)).toBeInTheDocument();
      });
    });
  });
});
