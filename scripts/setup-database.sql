-- Create tables for the racing financial application

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racer TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor incomes table
CREATE TABLE IF NOT EXISTS investor_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  user_id UUID NOT NULL,
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
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared access table
CREATE TABLE IF NOT EXISTS shared_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_incomes_user_id ON investor_incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_racer_transactions_user_id ON racer_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_access_share_id ON shared_access(share_id);

-- Create Row Level Security policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE racer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view their own transactions" 
  ON transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
  ON transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
  ON transactions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
  ON transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Similar policies for other tables
-- Investor incomes
CREATE POLICY "Users can view their own investor incomes" 
  ON investor_incomes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investor incomes" 
  ON investor_incomes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investor incomes" 
  ON investor_incomes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investor incomes" 
  ON investor_incomes FOR DELETE 
  USING (auth.uid() = user_id);

-- Racer transactions
CREATE POLICY "Users can view their own racer transactions" 
  ON racer_transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own racer transactions" 
  ON racer_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own racer transactions" 
  ON racer_transactions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own racer transactions" 
  ON racer_transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Shared access
CREATE POLICY "Users can view their own shared access" 
  ON shared_access FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shared access" 
  ON shared_access FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared access" 
  ON shared_access FOR DELETE 
  USING (auth.uid() = user_id);
