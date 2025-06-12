-- Enable real-time for all tables
-- This script sets up the database with real-time capabilities

-- First, create the tables if they don't exist
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    racer TEXT NOT NULL,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investor_incomes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    investor_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS racer_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    racer_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shared_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    share_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investor_incomes_created_at ON investor_incomes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_racer_transactions_created_at ON racer_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_access_share_id ON shared_access(share_id);
CREATE INDEX IF NOT EXISTS idx_shared_access_expires_at ON shared_access(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investor_incomes_updated_at ON investor_incomes;
CREATE TRIGGER update_investor_incomes_updated_at
    BEFORE UPDATE ON investor_incomes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_racer_transactions_updated_at ON racer_transactions;
CREATE TRIGGER update_racer_transactions_updated_at
    BEFORE UPDATE ON racer_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) but allow all operations for public access
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE racer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we want anyone with link to access)
DROP POLICY IF EXISTS "Allow public access to transactions" ON transactions;
CREATE POLICY "Allow public access to transactions" ON transactions
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to investor_incomes" ON investor_incomes;
CREATE POLICY "Allow public access to investor_incomes" ON investor_incomes
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to racer_transactions" ON racer_transactions;
CREATE POLICY "Allow public access to racer_transactions" ON racer_transactions
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to shared_access" ON shared_access;
CREATE POLICY "Allow public access to shared_access" ON shared_access
    FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time for all tables
-- Note: This requires Supabase dashboard configuration or direct SQL execution
-- The following commands enable real-time replication for the tables

-- For Supabase, you need to run these in the SQL editor:
-- ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE investor_incomes;
-- ALTER PUBLICATION supabase_realtime ADD TABLE racer_transactions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE shared_access;

-- Grant necessary permissions
GRANT ALL ON transactions TO anon, authenticated;
GRANT ALL ON investor_incomes TO anon, authenticated;
GRANT ALL ON racer_transactions TO anon, authenticated;
GRANT ALL ON shared_access TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert some sample data for testing (optional)
INSERT INTO transactions (racer, item, quantity, price, date) VALUES
    ('Racer 1', 'Extrapart', 2, 150.00, CURRENT_DATE - INTERVAL '1 day'),
    ('Racer 2', 'Harness', 1, 1000.00, CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

INSERT INTO investor_incomes (investor_name, amount, description, date) VALUES
    ('John Investor', 5000.00, 'Initial funding', CURRENT_DATE - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

INSERT INTO racer_transactions (racer_name, type, price, description, date) VALUES
    ('Speed Racer', 'buy', 2000.00, 'Experienced racer with good track record', CURRENT_DATE - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Clean up expired shared access links (optional maintenance)
DELETE FROM shared_access WHERE expires_at < NOW();

-- Create a function to clean up expired links automatically
CREATE OR REPLACE FUNCTION cleanup_expired_shared_access()
RETURNS void AS $$
BEGIN
    DELETE FROM shared_access WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can set up a cron job to run this function periodically
-- For example, using pg_cron extension (if available):
-- SELECT cron.schedule('cleanup-expired-links', '0 0 * * *', 'SELECT cleanup_expired_shared_access();');

COMMIT;
