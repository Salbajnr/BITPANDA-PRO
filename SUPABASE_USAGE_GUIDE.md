# Supabase Integration Usage Guide

## Quick Reference

### Using the Supabase DB Service

Import and use the centralized database service in your routes:

```typescript
import { supabaseDB } from './supabase-db-service';

// News Operations
const articles = await supabaseDB.getNewsArticles(10, 'crypto');
const article = await supabaseDB.createNewsArticle({
  title: 'Bitcoin Rally',
  url: 'https://example.com/article',
  published_at: new Date().toISOString(),
  // ... other fields
});

// Metals Operations
const prices = await supabaseDB.getMetalsPrices();
const price = await supabaseDB.getMetalPrice('XAU');
await supabaseDB.updateMetalPrice('XAU', {
  symbol: 'XAU',
  name: 'Gold',
  price: 2000,
  change_24h: 0.5,
  unit: 'oz'
});

// Investment Plans
const plans = await supabaseDB.getActiveInvestmentPlans();
const investment = await supabaseDB.createUserInvestment({
  user_id: userId,
  plan_id: 'conservative-growth',
  invested_amount: 1000,
  expected_return: 7.5,
  start_date: new Date().toISOString(),
  duration_months: 12
});

// Savings Plans
const savingsPlans = await supabaseDB.getActiveSavingsPlans();
const savings = await supabaseDB.createUserSavingsPlan({
  user_id: userId,
  plan_id: 'basic-saver',
  amount: 50,
  frequency: 'monthly',
  duration_months: 24
});

// Staking Pools
const pools = await supabaseDB.getActiveStakingPools();
const stake = await supabaseDB.createUserStakingPosition({
  user_id: userId,
  asset_symbol: 'BTC',
  amount: 0.5,
  apy: 4.5,
  staking_term: '90d',
  start_date: new Date().toISOString()
});

// Price Alerts
const alert = await supabaseDB.createPriceAlert({
  user_id: userId,
  symbol: 'XAU',
  target_price: 2100,
  alert_type: 'above'
});
const alerts = await supabaseDB.getUserPriceAlerts(userId);
```

## API Endpoints

### News
- `GET /api/news` - List news articles
- `GET /api/news/search?q=bitcoin` - Search articles

### Metals
- `GET /api/metals` - Get metals prices
- `GET /api/metals/price/:symbol` - Get specific metal price
- `GET /api/metals/history/:symbol` - Get price history

### Investments
- `GET /api/investment-plans` - List available plans
- `POST /api/investment-plans/invest` - Create investment
- `GET /api/investment-plans/my-investments` - Get user investments
- `PUT /api/investment-plans/my-investments/:id` - Update investment
- `POST /api/investment-plans/my-investments/:id/pause` - Pause investment
- `POST /api/investment-plans/my-investments/:id/resume` - Resume investment
- `DELETE /api/investment-plans/my-investments/:id` - Cancel investment

### Savings
- `GET /api/savings-plans` - List available plans
- `POST /api/savings-plans/create` - Subscribe to plan
- `GET /api/savings-plans/my-plans` - Get user plans
- `POST /api/savings-plans/:planId/pause` - Pause plan
- `POST /api/savings-plans/:planId/resume` - Resume plan
- `POST /api/savings-plans/:planId/withdraw` - Withdraw funds

### Staking
- `GET /api/staking/pools` - List staking pools
- `GET /api/staking/positions` - Get user positions
- `POST /api/staking/stake` - Create staking position
- `POST /api/staking/unstake/:positionId` - Unstake and claim rewards
- `GET /api/staking/rewards` - Get rewards history
- `GET /api/staking/analytics` - Get analytics

## Database Access

### Authentication
All Supabase operations use the admin client (bypassing RLS):

```typescript
import { supabaseAdmin } from './supabase';

// This has full access to all data
const { data, error } = await supabaseAdmin
  .from('table_name')
  .select('*');
```

For user-facing operations that respect RLS:

```typescript
import { supabase } from './supabase';

// This respects RLS policies based on auth.uid()
const { data, error } = await supabase
  .from('price_alerts')
  .select('*');
```

## Data Models

### News Article
```typescript
{
  id: string;
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
  created_at: string;
}
```

### Metal Price
```typescript
{
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  unit: string;
  last_updated?: string;
}
```

### Investment
```typescript
{
  id: string;
  user_id: string;
  plan_id: string;
  invested_amount: number;
  current_value: number;
  expected_return: number;
  actual_return: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'completed';
  auto_reinvest: boolean;
}
```

### Savings Plan
```typescript
{
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  duration_months: number;
  total_saved: number;
  interest_earned: number;
  status: 'active' | 'paused' | 'completed';
}
```

### Staking Position
```typescript
{
  id: string;
  user_id: string;
  asset_symbol: string;
  amount: number;
  apy: number;
  staking_term: string;
  total_rewards: number;
  status: 'active' | 'completed';
  start_date: string;
  end_date: string;
}
```

## Error Handling

All database operations may throw errors:

```typescript
try {
  const result = await supabaseDB.getNewsArticles(10);
  return res.json(result);
} catch (error) {
  console.error('Database error:', error);
  return res.status(500).json({
    message: 'Failed to fetch articles',
    error: error.message
  });
}
```

## Adding New Operations

To add a new database operation:

1. **Define the interface** in supabase-db-service.ts
2. **Implement the method** in the SupabaseDBService class
3. **Export the function** from the class
4. **Use in routes** with proper error handling

Example:

```typescript
// In supabase-db-service.ts
async getUserMetalHoldings(userId: string) {
  const { data, error } = await this.db!
    .from('user_holdings')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to fetch holdings: ${error.message}`);
  return data || [];
}

// In routes
router.get('/my-holdings', requireAuth, async (req, res) => {
  try {
    const holdings = await supabaseDB.getUserMetalHoldings(req.user!.id);
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

## Testing Database Operations

```typescript
// Test in your route or test file
const testData = await supabaseDB.getNewsArticles(1);
console.log('✓ News articles retrieved:', testData.length);

const prices = await supabaseDB.getMetalsPrices(5);
console.log('✓ Metal prices retrieved:', prices.length);

const plans = await supabaseDB.getActiveInvestmentPlans();
console.log('✓ Investment plans loaded:', plans.length);
```

## Debugging

Enable detailed logging:

```typescript
// In supabase-db-service.ts constructor
constructor() {
  if (!this.db) {
    throw new Error('Supabase admin client not configured');
  }
  console.log('✓ Supabase DB Service initialized');
}
```

Check Supabase dashboard:
1. Navigate to your Supabase project
2. Go to SQL Editor
3. Run queries to inspect tables
4. Check Row Level Security policies
5. Monitor API usage in Analytics

## Best Practices

1. **Always use try-catch** around database calls
2. **Validate user input** before database operations
3. **Use specific queries** instead of SELECT *
4. **Add pagination** for large result sets
5. **Index frequently queried columns** (already done)
6. **Log errors** for debugging
7. **Check RLS policies** when getting unexpected results
8. **Use admin client** for admin-only operations
9. **Cache responses** when appropriate
10. **Monitor query performance** in Supabase dashboard
