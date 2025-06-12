-- =====================================================
-- RACING FINANCIAL APP - DATABASE SETUP
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS shared_access CASCADE;
DROP TABLE IF EXISTS racer_transactions CASCADE;
DROP TABLE IF EXISTS investor_incomes CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racer TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investor incomes table
CREATE TABLE investor_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create racer transactions table
CREATE TABLE racer_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racer_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shared access table
CREATE TABLE shared_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_investor_incomes_date ON investor_incomes(date DESC);
CREATE INDEX idx_racer_transactions_date ON racer_transactions(date DESC);
CREATE INDEX idx_shared_access_share_id ON shared_access(share_id);
CREATE INDEX idx_shared_access_expires ON shared_access(expires_at);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE racer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (no authentication required)
CREATE POLICY "Allow all operations on transactions" 
  ON transactions FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on investor_incomes" 
  ON investor_incomes FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on racer_transactions" 
  ON racer_transactions FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on shared_access" 
  ON shared_access FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Insert sample data with updated prices
INSERT INTO investor_incomes (investor_name, amount, description, date) VALUES
('Initial Capital', 20000.00, 'Starting fund for racing team operations', '2024-12-01'),
('Speed Ventures', 15000.00, 'Investment for equipment and racers', '2024-12-02');

INSERT INTO transactions (racer, item, quantity, price, date) VALUES
('Racer 1', 'Extrapart', 2, 150.00, '2024-12-03'),
('Racer 2', 'Harness', 1, 1000.00, '2024-12-03'),
('Racer 3', 'Repair Kit', 1, 500.00, '2024-12-04'),
('Racer 4', 'Fake Plate', 1, 800.00, '2024-12-04'),
('Racer 1', 'Voucher Chip', 3, 1500.00, '2024-12-05');

INSERT INTO racer_transactions (racer_name, type, price, description, date) VALUES
('Lightning McQueen', 'buy', 8000.00, 'Professional racer with 5 years experience', '2024-12-03'),
('Speed Demon', 'buy', 6500.00, 'Young talent with great potential', '2024-12-04'),
('Thunder Bolt', 'sell', 7200.00, 'Sold to rival team for profit', '2024-12-05');

-- Create a function to clean expired shared access links
CREATE OR REPLACE FUNCTION clean_expired_shared_access()
RETURNS void AS $$
BEGIN
  DELETE FROM shared_access WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a sample shared access link that's valid for 30 days
INSERT INTO shared_access (share_id, expires_at) VALUES
('demo-access-link', NOW() + INTERVAL '30 days');

-- Display setup completion message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Sample data has been inserted.';
  RAISE NOTICE 'You can now connect your application.';
END $$;
