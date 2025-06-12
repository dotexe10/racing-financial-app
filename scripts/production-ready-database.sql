-- =====================================================
-- RACING FINANCIAL APP - PRODUCTION DATABASE
-- Real-time updates for all users
-- =====================================================

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
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
CREATE TABLE IF NOT EXISTS investor_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create racer transactions table
CREATE TABLE IF NOT EXISTS racer_transactions (
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
CREATE TABLE IF NOT EXISTS shared_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '365 days'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_investor_incomes_created ON investor_incomes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_racer_transactions_created ON racer_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_access_share_id ON shared_access(share_id);

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

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE investor_incomes;
ALTER PUBLICATION supabase_realtime ADD TABLE racer_transactions;

-- Insert initial data
INSERT INTO investor_incomes (investor_name, amount, description, date) VALUES
('Initial Capital', 50000.00, 'Starting fund for racing operations', '2024-12-01'),
('Speed Ventures', 25000.00, 'Investment for equipment upgrade', '2024-12-02'),
('Racing Partners', 30000.00, 'Strategic partnership investment', '2024-12-03');

INSERT INTO transactions (racer, item, quantity, price, date) VALUES
('Racer 1', 'Extrapart', 2, 150.00, '2024-12-04'),
('Racer 2', 'Harness', 1, 1000.00, '2024-12-04'),
('Racer 3', 'Repair Kit', 1, 500.00, '2024-12-05'),
('Racer 4', 'Fake Plate', 1, 800.00, '2024-12-05'),
('Racer 1', 'Voucher Chip', 2, 1500.00, '2024-12-06'),
('Racer 5', 'Dongel', 1, 5000.00, '2024-12-06');

INSERT INTO racer_transactions (racer_name, type, price, description, date) VALUES
('Lightning Speed', 'buy', 12000.00, 'Professional racer with championship experience', '2024-12-04'),
('Thunder Bolt', 'buy', 8500.00, 'Rising star with excellent track record', '2024-12-05'),
('Speed Demon', 'sell', 9200.00, 'Transferred to partner team', '2024-12-06');

-- Create permanent public access link
INSERT INTO shared_access (share_id, expires_at) VALUES
('public-racing-finance', NOW() + INTERVAL '10 years');

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

-- Success message
SELECT 'Database setup completed! Ready for production use.' as status;
