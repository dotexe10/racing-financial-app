-- Create tables for the racing financial application (without user authentication)

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
  type TEXT NOT NULL,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_investor_incomes_date ON investor_incomes(date);
CREATE INDEX IF NOT EXISTS idx_racer_transactions_date ON racer_transactions(date);
CREATE INDEX IF NOT EXISTS idx_shared_access_share_id ON shared_access(share_id);

-- Enable Row Level Security but allow all operations (since no user authentication)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE racer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow all operations
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
