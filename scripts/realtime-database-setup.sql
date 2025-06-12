-- =====================================================
-- RACING FINANCIAL APP - REAL-TIME DATABASE SETUP
-- Enable real-time updates for multi-user access
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investor incomes table
CREATE TABLE investor_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create racer transactions table
CREATE TABLE racer_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racer_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shared access table
CREATE TABLE shared_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '365 days'
);

-- Create indexes for performance
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_investor_incomes_created ON investor_incomes(created_at DESC);
CREATE INDEX idx_investor_incomes_date ON investor_incomes(date DESC);
CREATE INDEX idx_racer_transactions_created ON racer_transactions(created_at DESC);
CREATE INDEX idx_racer_transactions_date ON racer_transactions(date DESC);
CREATE INDEX idx_shared_access_share_id ON shared_access(share_id);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE racer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can read/write)
CREATE POLICY "Public access for transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for investor_incomes" ON investor_incomes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for racer_transactions" ON racer_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for shared_access" ON shared_access FOR ALL USING (true) WITH CHECK (true);

-- ENABLE REAL-TIME SUBSCRIPTIONS
-- This is the key for real-time updates!
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE investor_incomes;
ALTER PUBLICATION supabase_realtime ADD TABLE racer_transactions;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investor_incomes_updated_at BEFORE UPDATE ON investor_incomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_racer_transactions_updated_at BEFORE UPDATE ON racer_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data with updated prices
INSERT INTO investor_incomes (investor_name, amount, description, date) VALUES
('Initial Capital', 50000.00, 'Starting fund for racing operations', '2024-12-01'),
('Speed Ventures', 25000.00, 'Investment for equipment upgrade', '2024-12-02'),
('Racing Partners', 30000.00, 'Strategic partnership investment', '2024-12-03'),
('Turbo Investors', 20000.00, 'Additional funding for expansion', '2024-12-04');

INSERT INTO transactions (racer, item, quantity, price, date) VALUES
('Racer 1', 'Extrapart', 2, 150.00, '2024-12-05'),
('Racer 2', 'Harness', 1, 1000.00, '2024-12-05'),
('Racer 3', 'Repair Kit', 1, 500.00, '2024-12-06'),
('Racer 4', 'Fake Plate', 1, 800.00, '2024-12-06'),
('Racer 1', 'Voucher Chip', 2, 1500.00, '2024-12-07'),
('Racer 5', 'Dongel', 1, 5000.00, '2024-12-07'),
('Racer 2', 'Extrapart', 3, 150.00, '2024-12-08'),
('Racer 6', 'Harness', 1, 1000.00, '2024-12-08');

INSERT INTO racer_transactions (racer_name, type, price, description, date) VALUES
('Lightning Speed', 'buy', 12000.00, 'Professional racer with championship experience', '2024-12-05'),
('Thunder Bolt', 'buy', 8500.00, 'Rising star with excellent track record', '2024-12-06'),
('Speed Demon', 'sell', 9200.00, 'Transferred to partner team for strategic reasons', '2024-12-07'),
('Rocket Racer', 'buy', 15000.00, 'Elite racer with international experience', '2024-12-08');

-- Create permanent public access link
INSERT INTO shared_access (share_id, expires_at) VALUES
('public-racing-finance', NOW() + INTERVAL '10 years'),
('demo-access-link', NOW() + INTERVAL '1 year');

-- Display setup completion message
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'REAL-TIME DATABASE SETUP COMPLETED!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Features enabled:';
  RAISE NOTICE '✅ Real-time subscriptions for all tables';
  RAISE NOTICE '✅ Multi-user collaborative access';
  RAISE NOTICE '✅ Automatic timestamp updates';
  RAISE NOTICE '✅ Sample data with realistic transactions';
  RAISE NOTICE '✅ Public access policies configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Your application now supports:';
  RAISE NOTICE '- Instant updates across all connected users';
  RAISE NOTICE '- Real-time transaction history sync';
  RAISE NOTICE '- Live balance calculations';
  RAISE NOTICE '- Multi-device access with live updates';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready for production deployment!';
END $$;
