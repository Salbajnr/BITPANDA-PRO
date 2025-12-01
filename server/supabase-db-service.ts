import { supabaseAdmin, supabase } from './supabase';

interface NewsArticle {
  id?: string;
  title: string;
  description?: string;
  summary?: string;
  url: string;
  image_url?: string;
  published_at: string;
  source_id?: string;
  source_name?: string;
  category?: string;
  sentiment?: string;
  coins?: string[];
}

interface MetalPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  unit: string;
  last_updated?: string;
}

interface PriceAlert {
  user_id: string;
  symbol: string;
  target_price: number;
  alert_type: 'above' | 'below';
}

interface InvestmentPlan {
  plan_id: string;
  name: string;
  description?: string;
  min_investment: number;
  expected_return: number;
  duration_months: number;
  risk_level: string;
  category: string;
  features?: string[];
}

interface UserInvestment {
  user_id: string;
  plan_id: string;
  invested_amount: number;
  expected_return: number;
  start_date: string;
  duration_months: number;
}

interface SavingsPlan {
  plan_id: string;
  name: string;
  description?: string;
  min_amount: number;
  interest_rate: number;
  category: string;
}

interface UserSavingsPlan {
  user_id: string;
  plan_id: string;
  amount: number;
  frequency: string;
  duration_months: number;
}

interface StakingPool {
  symbol: string;
  name: string;
  apy: number;
  min_amount: number;
  max_amount: number;
  terms: string[];
  description?: string;
}

interface UserStakingPosition {
  user_id: string;
  asset_symbol: string;
  amount: number;
  apy: number;
  staking_term: string;
  start_date: string;
}

class SupabaseDBService {
  private db = supabaseAdmin;

  constructor() {
    if (!this.db) {
      throw new Error('Supabase admin client not configured');
    }
  }

  // ============ NEWS ARTICLES ============

  async createNewsArticle(article: NewsArticle) {
    const { data, error } = await this.db!
      .from('news_articles')
      .insert([{
        title: article.title,
        description: article.description,
        summary: article.summary,
        url: article.url,
        image_url: article.image_url,
        published_at: article.published_at,
        source_id: article.source_id,
        source_name: article.source_name,
        category: article.category || 'general',
        sentiment: article.sentiment || 'neutral',
        coins: article.coins || [],
        cached_at: new Date().toISOString()
      }])
      .select();

    if (error) throw new Error(`Failed to create news article: ${error.message}`);
    return data?.[0];
  }

  async getNewsArticles(limit: number = 10, category?: string) {
    let query = this.db!
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch news: ${error.message}`);
    return data || [];
  }

  async searchNewsArticles(query: string, limit: number = 10) {
    const { data, error } = await this.db!
      .from('news_articles')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to search news: ${error.message}`);
    return data || [];
  }

  async deleteNewsArticle(id: string) {
    const { error } = await this.db!
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete news article: ${error.message}`);
  }

  // ============ METALS PRICES ============

  async updateMetalPrice(symbol: string, price: MetalPrice) {
    const { data, error } = await this.db!
      .from('metals_prices')
      .upsert({
        symbol: symbol.toUpperCase(),
        name: price.name,
        price: price.price,
        change_24h: price.change_24h,
        unit: price.unit,
        last_updated: new Date().toISOString()
      }, { onConflict: 'symbol' })
      .select();

    if (error) throw new Error(`Failed to update metal price: ${error.message}`);
    return data?.[0];
  }

  async getMetalsPrices(limit: number = 10) {
    const { data, error } = await this.db!
      .from('metals_prices')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch metals prices: ${error.message}`);
    return data || [];
  }

  async getMetalPrice(symbol: string) {
    const { data, error } = await this.db!
      .from('metals_prices')
      .select('*')
      .eq('symbol', symbol.toUpperCase())
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch metal price: ${error.message}`);
    return data;
  }

  // ============ METALS PRICE HISTORY ============

  async addMetalsPriceHistory(symbol: string, price: number, period: string = '1h') {
    const { data, error } = await this.db!
      .from('metals_price_history')
      .insert([{
        symbol: symbol.toUpperCase(),
        price,
        period,
        timestamp: new Date().toISOString()
      }])
      .select();

    if (error) throw new Error(`Failed to add price history: ${error.message}`);
    return data?.[0];
  }

  async getMetalsPriceHistory(symbol: string, limit: number = 24) {
    const { data, error } = await this.db!
      .from('metals_price_history')
      .select('*')
      .eq('symbol', symbol.toUpperCase())
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch price history: ${error.message}`);
    return data || [];
  }

  // ============ PRICE ALERTS ============

  async createPriceAlert(alert: PriceAlert) {
    const { data, error } = await this.db!
      .from('price_alerts')
      .insert([alert])
      .select();

    if (error) throw new Error(`Failed to create price alert: ${error.message}`);
    return data?.[0];
  }

  async getUserPriceAlerts(userId: string) {
    const { data, error } = await this.db!
      .from('price_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch price alerts: ${error.message}`);
    return data || [];
  }

  async deletePriceAlert(alertId: string) {
    const { error } = await this.db!
      .from('price_alerts')
      .delete()
      .eq('id', alertId);

    if (error) throw new Error(`Failed to delete price alert: ${error.message}`);
  }

  // ============ INVESTMENT PLANS ============

  async createInvestmentPlan(plan: InvestmentPlan) {
    const { data, error } = await this.db!
      .from('investment_plans')
      .insert([{
        plan_id: plan.plan_id,
        name: plan.name,
        description: plan.description,
        min_investment: plan.min_investment,
        expected_return: plan.expected_return,
        duration_months: plan.duration_months,
        risk_level: plan.risk_level,
        category: plan.category,
        features: plan.features || [],
        is_active: true
      }])
      .select();

    if (error) throw new Error(`Failed to create investment plan: ${error.message}`);
    return data?.[0];
  }

  async getActiveInvestmentPlans() {
    const { data, error } = await this.db!
      .from('investment_plans')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch investment plans: ${error.message}`);
    return data || [];
  }

  async createUserInvestment(investment: UserInvestment) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + investment.duration_months);

    const { data, error } = await this.db!
      .from('user_investments')
      .insert([{
        user_id: investment.user_id,
        plan_id: investment.plan_id,
        invested_amount: investment.invested_amount,
        current_value: investment.invested_amount,
        expected_return: investment.expected_return,
        start_date: investment.start_date,
        end_date: endDate.toISOString(),
        status: 'active'
      }])
      .select();

    if (error) throw new Error(`Failed to create user investment: ${error.message}`);
    return data?.[0];
  }

  async getUserInvestments(userId: string) {
    const { data, error } = await this.db!
      .from('user_investments')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to fetch user investments: ${error.message}`);
    return data || [];
  }

  async updateUserInvestment(investmentId: string, updates: any) {
    const { data, error } = await this.db!
      .from('user_investments')
      .update(updates)
      .eq('id', investmentId)
      .select();

    if (error) throw new Error(`Failed to update investment: ${error.message}`);
    return data?.[0];
  }

  // ============ SAVINGS PLANS ============

  async createSavingsPlan(plan: SavingsPlan) {
    const { data, error } = await this.db!
      .from('savings_plans')
      .insert([{
        plan_id: plan.plan_id,
        name: plan.name,
        description: plan.description,
        min_amount: plan.min_amount,
        max_amount: plan.min_amount * 10,
        interest_rate: plan.interest_rate,
        compounding: 'monthly',
        min_duration_months: 6,
        max_duration_months: 60,
        category: plan.category,
        is_active: true
      }])
      .select();

    if (error) throw new Error(`Failed to create savings plan: ${error.message}`);
    return data?.[0];
  }

  async getActiveSavingsPlans() {
    const { data, error } = await this.db!
      .from('savings_plans')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch savings plans: ${error.message}`);
    return data || [];
  }

  async createUserSavingsPlan(savingsPlan: UserSavingsPlan) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + savingsPlan.duration_months);

    const { data, error } = await this.db!
      .from('user_savings_plans')
      .insert([{
        user_id: savingsPlan.user_id,
        plan_id: savingsPlan.plan_id,
        amount: savingsPlan.amount,
        frequency: savingsPlan.frequency,
        duration_months: savingsPlan.duration_months,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        next_deposit: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        total_saved: '0',
        interest_earned: '0',
        status: 'active'
      }])
      .select();

    if (error) throw new Error(`Failed to create savings plan: ${error.message}`);
    return data?.[0];
  }

  async getUserSavingsPlans(userId: string) {
    const { data, error } = await this.db!
      .from('user_savings_plans')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to fetch user savings plans: ${error.message}`);
    return data || [];
  }

  // ============ STAKING POOLS ============

  async createStakingPool(pool: StakingPool) {
    const { data, error } = await this.db!
      .from('staking_pools')
      .insert([{
        symbol: pool.symbol,
        name: pool.name,
        apy: pool.apy,
        min_amount: pool.min_amount,
        max_amount: pool.max_amount,
        terms: pool.terms,
        description: pool.description,
        is_active: true
      }])
      .select();

    if (error) throw new Error(`Failed to create staking pool: ${error.message}`);
    return data?.[0];
  }

  async getActiveStakingPools() {
    const { data, error } = await this.db!
      .from('staking_pools')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch staking pools: ${error.message}`);
    return data || [];
  }

  async createUserStakingPosition(position: UserStakingPosition) {
    const startDate = new Date(position.start_date);
    const endDate = new Date(startDate);

    if (position.staking_term === 'flexible') {
      endDate.setDate(endDate.getDate() + 30);
    } else {
      const days = parseInt(position.staking_term);
      endDate.setDate(endDate.getDate() + days);
    }

    const { data, error } = await this.db!
      .from('user_staking_positions')
      .insert([{
        user_id: position.user_id,
        asset_symbol: position.asset_symbol,
        amount: position.amount,
        apy: position.apy,
        staking_term: position.staking_term,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_rewards: 0,
        status: 'active'
      }])
      .select();

    if (error) throw new Error(`Failed to create staking position: ${error.message}`);
    return data?.[0];
  }

  async getUserStakingPositions(userId: string) {
    const { data, error } = await this.db!
      .from('user_staking_positions')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to fetch staking positions: ${error.message}`);
    return data || [];
  }

  async updateStakingPosition(positionId: string, updates: any) {
    const { data, error } = await this.db!
      .from('user_staking_positions')
      .update(updates)
      .eq('id', positionId)
      .select();

    if (error) throw new Error(`Failed to update staking position: ${error.message}`);
    return data?.[0];
  }

  // ============ LENDING POOLS ============

  async createLendingPool(pool: any) {
    const { data, error } = await this.db!
      .from('lending_pools')
      .insert([pool])
      .select();

    if (error) throw new Error(`Failed to create lending pool: ${error.message}`);
    return data?.[0];
  }

  async getActiveLendingPools() {
    const { data, error } = await this.db!
      .from('lending_pools')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch lending pools: ${error.message}`);
    return data || [];
  }

  // ============ DEPOSIT/WITHDRAWAL TRANSACTIONS ============

  async createDepositTransaction(deposit: any) {
    const { data, error } = await this.db!
      .from('deposit_transactions')
      .insert([deposit])
      .select();

    if (error) throw new Error(`Failed to create deposit: ${error.message}`);
    return data?.[0];
  }

  async getUserDepositTransactions(userId: string) {
    const { data, error } = await this.db!
      .from('deposit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch deposits: ${error.message}`);
    return data || [];
  }

  async updateDepositTransaction(depositId: string, updates: any) {
    const { data, error } = await this.db!
      .from('deposit_transactions')
      .update(updates)
      .eq('id', depositId)
      .select();

    if (error) throw new Error(`Failed to update deposit: ${error.message}`);
    return data?.[0];
  }

  async createWithdrawalTransaction(withdrawal: any) {
    const { data, error } = await this.db!
      .from('withdrawal_transactions')
      .insert([withdrawal])
      .select();

    if (error) throw new Error(`Failed to create withdrawal: ${error.message}`);
    return data?.[0];
  }

  async getUserWithdrawalTransactions(userId: string) {
    const { data, error } = await this.db!
      .from('withdrawal_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch withdrawals: ${error.message}`);
    return data || [];
  }

  async updateWithdrawalTransaction(withdrawalId: string, updates: any) {
    const { data, error } = await this.db!
      .from('withdrawal_transactions')
      .update(updates)
      .eq('id', withdrawalId)
      .select();

    if (error) throw new Error(`Failed to update withdrawal: ${error.message}`);
    return data?.[0];
  }
}

export const supabaseDB = new SupabaseDBService();
