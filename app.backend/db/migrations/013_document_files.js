const { sql } = require('../config/database');

// Create a migration to add document file fields
// We need to create a migration file to add the necessary fields to store document files

const migration = `
-- Add document file fields to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255),
ADD COLUMN IF NOT EXISTS s3_key VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS uploaded_by INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create document files table for multiple files per document
CREATE TABLE IF NOT EXISTS document_files (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  s3_key VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by INTEGER REFERENCES users(id),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  is_main BOOLEAN DEFAULT FALSE
);
`;

module.exports = {
  migration
};
