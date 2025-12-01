/*
  # Create KYC, Deposits, Withdrawals, and Lending Tables

  1. New Tables
    - `kyc_documents` - KYC document metadata for Supabase Storage references
    - `deposit_transactions` - Enhanced deposit tracking
    - `withdrawal_transactions` - Enhanced withdrawal tracking
    - `lending_pools` - Available lending pool configurations
    - `user_lending_positions` - User lending positions
    - `lending_interest_accrual` - Track accrued interest over time

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_id uuid NOT NULL,
  user_id uuid NOT NULL,
  document_type text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_kyc ON kyc_documents(kyc_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user ON kyc_documents(user_id);

ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own KYC documents"
  ON kyc_documents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own KYC documents"
  ON kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

--

CREATE TABLE IF NOT EXISTS deposit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric(20, 8) NOT NULL,
  currency text NOT NULL,
  asset_type text DEFAULT 'crypto',
  payment_method text NOT NULL,
  proof_image_url text,
  status text DEFAULT 'pending',
  admin_notes text,
  rejection_reason text,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposit_transactions(status);
CREATE INDEX IF NOT EXISTS idx_deposits_created ON deposit_transactions(created_at DESC);

ALTER TABLE deposit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own deposits"
  ON deposit_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create deposits"
  ON deposit_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

--

CREATE TABLE IF NOT EXISTS withdrawal_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric(20, 8) NOT NULL,
  currency text NOT NULL,
  withdrawal_method text NOT NULL,
  destination_address text NOT NULL,
  destination_details jsonb,
  fees numeric(20, 8) DEFAULT 0,
  net_amount numeric(20, 8),
  status text DEFAULT 'pending_confirmation',
  confirmation_token text,
  confirmation_expires_at timestamptz,
  admin_notes text,
  rejection_reason text,
  approved_by uuid,
  approved_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawal_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawal_transactions(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created ON withdrawal_transactions(created_at DESC);

ALTER TABLE withdrawal_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own withdrawals"
  ON withdrawal_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create withdrawals"
  ON withdrawal_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

--

CREATE TABLE IF NOT EXISTS lending_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  asset_symbol text NOT NULL,
  interest_rate numeric(10, 4) NOT NULL,
  min_amount numeric(20, 8) NOT NULL,
  max_amount numeric(20, 8) NOT NULL,
  term_days integer NOT NULL,
  risk_level text DEFAULT 'medium',
  is_active boolean DEFAULT true,
  total_supplied numeric(20, 8) DEFAULT 0,
  total_borrowed numeric(20, 8) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lending_pools_active ON lending_pools(is_active);
CREATE INDEX IF NOT EXISTS idx_lending_pools_asset ON lending_pools(asset_symbol);

ALTER TABLE lending_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active lending pools"
  ON lending_pools FOR SELECT
  USING (is_active = true);

--

CREATE TABLE IF NOT EXISTS user_lending_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pool_id text NOT NULL,
  amount_lent numeric(20, 8) NOT NULL,
  interest_rate numeric(10, 4) NOT NULL,
  accrued_interest numeric(20, 8) DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'active',
  auto_reinvest boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_lending_user ON user_lending_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lending_pool ON user_lending_positions(pool_id);
CREATE INDEX IF NOT EXISTS idx_user_lending_status ON user_lending_positions(status);

ALTER TABLE user_lending_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own lending positions"
  ON user_lending_positions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create lending positions"
  ON user_lending_positions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

--

CREATE TABLE IF NOT EXISTS lending_interest_accrual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id uuid NOT NULL,
  user_id uuid NOT NULL,
  accrued_amount numeric(20, 8) NOT NULL,
  accrual_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accrual_position ON lending_interest_accrual(position_id);
CREATE INDEX IF NOT EXISTS idx_accrual_user ON lending_interest_accrual(user_id);
CREATE INDEX IF NOT EXISTS idx_accrual_date ON lending_interest_accrual(accrual_date DESC);

ALTER TABLE lending_interest_accrual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own accrual records"
  ON lending_interest_accrual FOR SELECT
  USING (user_id = auth.uid());
