import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | { times: number; currency: string; percentage: number };
  last_updated: string;
}

export interface ChartData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

const fetchMarketData = async (vs_currency = 'usd', page = 1, per_page = 100) => {
  const response = await api.get('/coins/markets', {
    params: { vs_currency, page, per_page }
  });
  return response.data;
};

const fetchChartData = async (coinId: string, days = 7) => {
    const response = await api.get(`/coins/${coinId}/market_chart`, {
        params: { vs_currency: 'usd', days }
    });
    return response.data;
};

export const useCryptoData = (coinId?: string, days?: number, per_page?: number) => {
  const marketQuery = useQuery<CryptoData[], Error>({
    queryKey: ['marketData', per_page],
    queryFn: () => fetchMarketData('usd', 1, per_page),
    enabled: !coinId
  });

  const chartQuery = useQuery<ChartData, Error>({
    queryKey: ['chartData', coinId, days],
    queryFn: () => fetchChartData(coinId!, days),
    enabled: !!coinId
  });

  return {
    marketData: marketQuery.data ?? [],
    isMarketLoading: marketQuery.isLoading,
    marketError: marketQuery.error,
    chartData: chartQuery.data,
    isChartLoading: chartQuery.isLoading,
    chartError: chartQuery.error,
  };
};