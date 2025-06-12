-- Create tables for the racing financial application

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racer TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor incomes table
CREATE TABLE IF NOT EXISTS investor_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Racer transactions table
CREATE TABLE IF NOT EXISTS racer_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racer_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared access table
CREATE TABLE IF NOT EXISTS shared_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_investor_incomes_date ON investor_incomes(date DESC);
CREATE INDEX IF NOT EXISTS idx_racer_transactions_date ON racer_transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_shared_access_share_id ON shared_access(share_id);
CREATE INDEX IF NOT EXISTS idx_shared_access_expires ON shared_access(expires_at);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE racer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow all operations (no authentication required)
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

-- Insert some sample data for testing with updated prices
INSERT INTO transactions (racer, item, quantity, price, date) VALUES
('Racer 1', 'Extrapart', 2, 150.00, '2024-12-01'),
('Racer 2', 'Harness', 1, 1000.00, '2024-12-02'),
('Racer 3', 'Repair Kit', 1, 500.00, '2024-12-03'),
('Racer 4', 'Fake Plate', 1, 800.00, '2024-12-04'),
('Racer 5', 'Dongel', 1, 5000.00, '2024-12-05'),
('Racer 6', 'Voucher Chip', 2, 1500.00, '2024-12-06');

INSERT INTO investor_incomes (investor_name, amount, description, date) VALUES
('John Investor', 10000.00, 'Initial funding for racing team', '2024-11-30'),
('Sarah Capital', 5000.00, 'Additional investment for equipment', '2024-12-01');

INSERT INTO racer_transactions (racer_name, type, price, description, date) VALUES
('Speed Racer', 'buy', 2000.00, 'Experienced racer with good track record', '2024-12-02'),
('Lightning Fast', 'sell', 1500.00, 'Sold to another team', '2024-12-04');
