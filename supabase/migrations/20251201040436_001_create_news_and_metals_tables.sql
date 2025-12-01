/*
  # Create News Articles and Metals Pricing Tables

  1. New Tables
    - `news_articles` - Store cached news articles with metadata
    - `metals_prices` - Store real-time and historical metal prices
    - `metals_price_history` - Store price history for charting
    - `price_alerts` - User price alert subscriptions

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  summary text,
  url text UNIQUE NOT NULL,
  image_url text,
  published_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  source_id text,
  source_name text,
  category text DEFAULT 'general',
  sentiment text DEFAULT 'neutral',
  coins text[] DEFAULT ARRAY[]::text[],
  cached_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news articles"
  ON news_articles FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert news articles"
  ON news_articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

--

CREATE TABLE IF NOT EXISTS metals_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric(20, 8) NOT NULL,
  change_24h numeric(10, 4) DEFAULT 0,
  unit text NOT NULL,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metals_symbol ON metals_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_metals_last_updated ON metals_prices(last_updated DESC);

ALTER TABLE metals_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read metals prices"
  ON metals_prices FOR SELECT
  USING (true);

--

CREATE TABLE IF NOT EXISTS metals_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price numeric(20, 8) NOT NULL,
  timestamp timestamptz DEFAULT now(),
  period text DEFAULT '1h'
);

CREATE INDEX IF NOT EXISTS idx_metals_history_symbol_timestamp ON metals_price_history(symbol, timestamp DESC);

ALTER TABLE metals_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read metals price history"
  ON metals_price_history FOR SELECT
  USING (true);

--

CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  target_price numeric(20, 8) NOT NULL,
  alert_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own price alerts"
  ON price_alerts FOR SELECT
  USING (user_id = auth.uid());
