-- Migration: Create user_types table
-- Created: 2025-01-25

CREATE TABLE IF NOT EXISTS user_types (
  id SERIAL PRIMARY KEY,
  type_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default user types
INSERT INTO user_types (type_name, description) VALUES
('user', 'Utilizator standard cu acces limitat'),
('administrator', 'Administrator cu acces complet la sistem'),
('contabil', 'Contabil cu acces la modulele financiare')
ON CONFLICT (type_name) DO NOTHING;