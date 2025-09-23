
-- Add new columns to transactions table for enhanced trading
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS fee DECIMAL(20, 8) DEFAULT 0,
ADD COLUMN IF NOT EXISTS order_type VARCHAR(20) DEFAULT 'market',
ADD COLUMN IF NOT EXISTS stop_loss DECIMAL(20, 8),
ADD COLUMN IF NOT EXISTS take_profit DECIMAL(20, 8),
ADD COLUMN IF NOT EXISTS slippage VARCHAR(10) DEFAULT '0.5';

-- Update existing transactions to have default values
UPDATE transactions 
SET 
  fee = 0,
  order_type = 'market',
  slippage = '0.5'
WHERE fee IS NULL OR order_type IS NULL OR slippage IS NULL;
