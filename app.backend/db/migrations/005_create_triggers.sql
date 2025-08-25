-- Migration: Create update triggers
-- Created: 2025-01-25

-- Create update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_details_updated_at ON user_details;
CREATE TRIGGER update_user_details_updated_at 
BEFORE UPDATE ON user_details 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_data_updated_at ON company_data;
CREATE TRIGGER update_company_data_updated_at 
BEFORE UPDATE ON company_data 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();