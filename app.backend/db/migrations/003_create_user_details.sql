-- Migration: Create user_details table
-- Created: 2025-01-25

CREATE TABLE IF NOT EXISTS user_details (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nume VARCHAR(255) NOT NULL,
  telefon VARCHAR(20),
  pozitie VARCHAR(100),
  companie VARCHAR(255),
  locatie VARCHAR(255),
  bio TEXT,
  website VARCHAR(255),
  linkedin VARCHAR(255),
  tema VARCHAR(20) DEFAULT 'light',
  limba VARCHAR(5) DEFAULT 'ro',
  timezone VARCHAR(50) DEFAULT 'Europe/Bucharest',
  date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy',
  currency VARCHAR(5) DEFAULT 'RON',
  sounds BOOLEAN DEFAULT true,
  animations BOOLEAN DEFAULT true,
  compact_mode BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  session_timeout INTEGER DEFAULT 60,
  login_notifications BOOLEAN DEFAULT true,
  device_tracking BOOLEAN DEFAULT true,
  notifications_email JSONB DEFAULT '{"documente_noi": true, "cereri_concediu": true, "scadente": true, "newsletter": false, "marketing": false}',
  notifications_push JSONB DEFAULT '{"documente_noi": true, "cereri_concediu": true, "scadente": false, "mesaje": true}',
  notifications_sms JSONB DEFAULT '{"urgente": true, "autentificare": true}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);