-- Migration: Create company_data table
-- Created: 2025-01-25

CREATE TABLE IF NOT EXISTS company_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nume_firma VARCHAR(255) NOT NULL,
  cui VARCHAR(50) NOT NULL,
  nr_reg_comert VARCHAR(100),
  adresa_sediu TEXT,
  oras VARCHAR(100),
  judet VARCHAR(100),
  cod_postal VARCHAR(20),
  tara VARCHAR(100) DEFAULT 'România',
  telefon VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  capital_social DECIMAL(15,2),
  cont_bancar VARCHAR(100),
  banca VARCHAR(255),
  platitor_tva BOOLEAN DEFAULT false,
  reprezentant_legal VARCHAR(255),
  functie_reprezentant VARCHAR(100),
  cnp_reprezentant VARCHAR(13),
  an_fiscal VARCHAR(4),
  moneda_principala VARCHAR(5) DEFAULT 'RON',
  limba_implicita VARCHAR(5) DEFAULT 'RO',
  timp_zona VARCHAR(50) DEFAULT 'Europe/Bucharest',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);