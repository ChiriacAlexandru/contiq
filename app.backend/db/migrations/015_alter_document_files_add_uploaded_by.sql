-- Ensure uploaded_by column exists on document_files to link to users
ALTER TABLE document_files
  ADD COLUMN IF NOT EXISTS uploaded_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL;

-- Helpful index for listing by uploader
CREATE INDEX IF NOT EXISTS idx_document_files_uploaded_by ON document_files(uploaded_by);
