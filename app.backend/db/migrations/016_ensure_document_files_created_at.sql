-- Ensure created_at column exists on document_files table
ALTER TABLE document_files 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();