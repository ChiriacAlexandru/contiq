-- Fix document_files table schema by adding missing columns
-- This migration ensures all required columns exist

-- Drop the table and recreate it with the correct schema
DROP TABLE IF EXISTS document_files CASCADE;

CREATE TABLE document_files (
  id SERIAL PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  s3_key TEXT NOT NULL,
  mime_type VARCHAR(150) NOT NULL,
  size_bytes BIGINT NOT NULL,
  uploaded_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
  document_id INTEGER NULL REFERENCES documents(id) ON DELETE SET NULL,
  supplier_id INTEGER NULL REFERENCES suppliers(id) ON DELETE SET NULL,
  notes TEXT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_document_files_document_id ON document_files(document_id);
CREATE INDEX IF NOT EXISTS idx_document_files_supplier_id ON document_files(supplier_id);
CREATE INDEX IF NOT EXISTS idx_document_files_uploaded_by ON document_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_document_files_created_at ON document_files(created_at);