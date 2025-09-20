
-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url VARCHAR,
  source VARCHAR(100) NOT NULL,
  source_url VARCHAR,
  published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id),
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  target_price TEXT NOT NULL,
  condition TEXT NOT NULL,
  message TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
