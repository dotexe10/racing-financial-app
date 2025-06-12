-- Enable real-time replication for all tables in Supabase
-- Run this script in Supabase SQL Editor after running the main database setup

-- Enable real-time for transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;

-- Enable real-time for investor_incomes table
ALTER PUBLICATION supabase_realtime ADD TABLE investor_incomes;

-- Enable real-time for racer_transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE racer_transactions;

-- Enable real-time for shared_access table (optional, for monitoring)
ALTER PUBLICATION supabase_realtime ADD TABLE shared_access;

-- Verify that tables are added to real-time publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- The output should show all four tables:
-- public | transactions
-- public | investor_incomes  
-- public | racer_transactions
-- public | shared_access
