/*
  # Create Investment Plans, Savings Plans, and Staking Tables

  1. New Tables
    - `investment_plans` - Available investment plan configurations
    - `user_investments` - User investment records
    - `savings_plans` - Available savings plan configurations
    - `user_savings_plans` - User savings plan subscriptions
    - `staking_pools` - Available staking pool configurations
    - `user_staking_positions` - User active staking positions

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

CREATE TABLE IF NOT EXISTS investment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  min_investment numeric(20, 8) NOT NULL,
  expected_return numeric(10, 4) NOT NULL,
  duration_months integer NOT NULL,
  risk_level text NOT NULL,
  category text NOT NULL,
  features text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  total_invested numeric(20, 8) DEFAULT 0,
  total_investors integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_investment_plans_active ON investment_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_investment_plans_category ON investment_plans(category);

ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active investment plans"
  ON investment_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage investment plans"
  ON investment_plans FOR ALL
  TO authenticated
  USING (true);

--

CREATE TABLE IF NOT EXISTS user_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id text NOT NULL,
  invested_amount numeric(20, 8) NOT NULL,
  current_value numeric(20, 8) NOT NULL,
  expected_return numeric(10, 4) NOT NULL,
  actual_return numeric(10, 4) DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'active',
  notes text,
  auto_reinvest boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_investments_user ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);
CREATE INDEX IF NOT EXISTS idx_user_investments_plan ON user_investments(plan_id);

ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own investments"
  ON user_investments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create investments"
  ON user_investments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own investments"
  ON user_investments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

--

CREATE TABLE IF NOT EXISTS savings_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  min_amount numeric(20, 8) NOT NULL,
  max_amount numeric(20, 8) NOT NULL,
  interest_rate numeric(10, 4) NOT NULL,
  compounding text NOT NULL,
  min_duration_months integer NOT NULL,
  max_duration_months integer NOT NULL,
  category text NOT NULL,
  features text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_savings_plans_active ON savings_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_savings_plans_category ON savings_plans(category);

ALTER TABLE savings_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active savings plans"
  ON savings_plans FOR SELECT
  USING (is_active = true);

--

CREATE TABLE IF NOT EXISTS user_savings_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id text NOT NULL,
  amount numeric(20, 8) NOT NULL,
  frequency text NOT NULL,
  duration_months integer NOT NULL,
  auto_deposit boolean DEFAULT false,
  next_deposit timestamptz,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  total_saved numeric(20, 8) DEFAULT 0,
  interest_earned numeric(20, 8) DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_savings_user ON user_savings_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_savings_status ON user_savings_plans(status);
CREATE INDEX IF NOT EXISTS idx_user_savings_next_deposit ON user_savings_plans(next_deposit) WHERE status = 'active';

ALTER TABLE user_savings_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own savings plans"
  ON user_savings_plans FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create savings plans"
  ON user_savings_plans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own savings plans"
  ON user_savings_plans FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

--

CREATE TABLE IF NOT EXISTS staking_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  apy numeric(10, 4) NOT NULL,
  min_amount numeric(20, 8) NOT NULL,
  max_amount numeric(20, 8) NOT NULL,
  terms text[] NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staking_pools_symbol ON staking_pools(symbol);
CREATE INDEX IF NOT EXISTS idx_staking_pools_active ON staking_pools(is_active);

ALTER TABLE staking_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active staking pools"
  ON staking_pools FOR SELECT
  USING (is_active = true);

--

CREATE TABLE IF NOT EXISTS user_staking_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  asset_symbol text NOT NULL,
  amount numeric(20, 8) NOT NULL,
  apy numeric(10, 4) NOT NULL,
  staking_term text NOT NULL,
  auto_reinvest boolean DEFAULT false,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  total_rewards numeric(20, 8) DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_staking_user ON user_staking_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_staking_status ON user_staking_positions(status);
CREATE INDEX IF NOT EXISTS idx_user_staking_symbol ON user_staking_positions(asset_symbol);

ALTER TABLE user_staking_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own staking positions"
  ON user_staking_positions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create staking positions"
  ON user_staking_positions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own staking positions"
  ON user_staking_positions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
