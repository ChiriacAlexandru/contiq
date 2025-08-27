-- Fix documents table structure
-- Drop existing table and recreate it properly
DROP TABLE IF EXISTS document_items CASCADE;
DROP TABLE IF EXISTS document_sequences CASCADE;
DROP TABLE IF EXISTS documents CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS get_next_document_number(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS calculate_document_totals(INTEGER);
DROP FUNCTION IF EXISTS recalculate_document_totals();
DROP FUNCTION IF EXISTS update_documents_updated_at();

-- Create documents table for invoices, proformas, delivery notes etc.
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    
    -- Document identification
    tip_document VARCHAR(20) NOT NULL CHECK (tip_document IN ('factura', 'factura_storno', 'proforma', 'aviz')),
    numar_document VARCHAR(50) NOT NULL,
    serie_document VARCHAR(10) DEFAULT '',
    
    -- Client information
    client_id INTEGER REFERENCES clients(id) ON DELETE RESTRICT,
    
    -- Document dates
    data_emitere DATE NOT NULL DEFAULT CURRENT_DATE,
    data_scadenta DATE,
    data_livrare DATE,
    
    -- Financial information
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_discount DECIMAL(12,2) DEFAULT 0,
    total_tva DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    moneda VARCHAR(3) DEFAULT 'RON',
    curs_valutar DECIMAL(10,4) DEFAULT 1,
    
    -- Payment information
    modalitate_plata VARCHAR(50) DEFAULT 'transfer',
    status_plata VARCHAR(20) DEFAULT 'neplatit' CHECK (status_plata IN ('neplatit', 'partial', 'platit', 'anulat')),
    suma_platita DECIMAL(12,2) DEFAULT 0,
    
    -- Document status
    status_document VARCHAR(20) DEFAULT 'draft' CHECK (status_document IN ('draft', 'emis', 'anulat', 'finalizat')),
    
    -- Additional information
    observatii TEXT,
    conditii_plata TEXT,
    modalitate_transport VARCHAR(100),
    delegate_info TEXT,
    
    -- References to other documents
    document_referinta_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
    document_referinta_tip VARCHAR(20),
    document_referinta_numar VARCHAR(50),
    
    -- Company information at time of creation (snapshot for historical accuracy)
    emitent_nume VARCHAR(255),
    emitent_cui VARCHAR(50),
    emitent_nr_reg_com VARCHAR(100),
    emitent_adresa TEXT,
    emitent_telefon VARCHAR(50),
    emitent_email VARCHAR(255),
    emitent_cont_bancar VARCHAR(100),
    emitent_banca VARCHAR(255),
    
    -- Client information at time of creation (snapshot)
    client_nume VARCHAR(255) NOT NULL,
    client_cui VARCHAR(50),
    client_cnp VARCHAR(13),
    client_nr_reg_com VARCHAR(100),
    client_adresa TEXT,
    client_telefon VARCHAR(50),
    client_email VARCHAR(255),
    
    -- User who created the document
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint per series and document type
    UNIQUE(tip_document, serie_document, numar_document)
);

-- Create document items table
CREATE TABLE document_items (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    
    -- Product information
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    
    -- Product information at time of creation (snapshot)
    product_nume VARCHAR(255) NOT NULL,
    product_cod VARCHAR(100),
    product_descriere TEXT,
    product_unitate_masura VARCHAR(20) DEFAULT 'buc',
    
    -- Quantity and pricing
    cantitate DECIMAL(10,3) NOT NULL DEFAULT 1,
    pret_unitar DECIMAL(12,4) NOT NULL DEFAULT 0,
    discount_procent DECIMAL(5,2) DEFAULT 0,
    discount_suma DECIMAL(12,2) DEFAULT 0,
    
    -- Tax information
    cota_tva DECIMAL(5,2) NOT NULL DEFAULT 19,
    valoare_fara_tva DECIMAL(12,2) NOT NULL DEFAULT 0,
    valoare_tva DECIMAL(12,2) NOT NULL DEFAULT 0,
    valoare_cu_tva DECIMAL(12,2) NOT NULL DEFAULT 0,
    
    -- Line order
    pozitie INTEGER DEFAULT 1,
    
    -- Additional information
    observatii TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create document numbering sequences table
CREATE TABLE document_sequences (
    id SERIAL PRIMARY KEY,
    tip_document VARCHAR(20) NOT NULL,
    serie_document VARCHAR(10) NOT NULL DEFAULT '',
    an INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    numar_curent INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tip_document, serie_document, an)
);

-- Create indexes for better performance
CREATE INDEX idx_documents_tip_document ON documents(tip_document);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_data_emitere ON documents(data_emitere);
CREATE INDEX idx_documents_status_document ON documents(status_document);
CREATE INDEX idx_documents_status_plata ON documents(status_plata);
CREATE INDEX idx_documents_numar_document ON documents(numar_document);
CREATE INDEX idx_documents_serie_numar ON documents(serie_document, numar_document);

CREATE INDEX idx_document_items_document_id ON document_items(document_id);
CREATE INDEX idx_document_items_product_id ON document_items(product_id);
CREATE INDEX idx_document_items_pozitie ON document_items(document_id, pozitie);

-- Create full-text search index for documents
CREATE INDEX idx_documents_search ON documents USING gin(to_tsvector('romanian', 
    COALESCE(numar_document, '') || ' ' || 
    COALESCE(client_nume, '') || ' ' || 
    COALESCE(observatii, '')
));

-- Create trigger for updated_at on documents
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_updated_at();

-- Create trigger for updated_at on document_sequences
CREATE TRIGGER trigger_document_sequences_updated_at
    BEFORE UPDATE ON document_sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_updated_at();

-- Function to get next document number
CREATE OR REPLACE FUNCTION get_next_document_number(p_tip_document VARCHAR, p_serie_document VARCHAR DEFAULT '')
RETURNS VARCHAR AS $$
DECLARE
    v_an INTEGER;
    v_numar_curent INTEGER;
    v_numar_nou INTEGER;
    v_numar_document VARCHAR(50);
BEGIN
    v_an := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Get or create sequence record
    SELECT numar_curent INTO v_numar_curent
    FROM document_sequences
    WHERE tip_document = p_tip_document 
      AND serie_document = p_serie_document 
      AND an = v_an;
    
    IF v_numar_curent IS NULL THEN
        -- Create new sequence
        INSERT INTO document_sequences (tip_document, serie_document, an, numar_curent)
        VALUES (p_tip_document, p_serie_document, v_an, 1)
        ON CONFLICT (tip_document, serie_document, an) DO NOTHING;
        v_numar_nou := 1;
    ELSE
        -- Increment existing sequence
        v_numar_nou := v_numar_curent + 1;
        UPDATE document_sequences 
        SET numar_curent = v_numar_nou, updated_at = CURRENT_TIMESTAMP
        WHERE tip_document = p_tip_document 
          AND serie_document = p_serie_document 
          AND an = v_an;
    END IF;
    
    -- Format document number
    IF p_serie_document != '' THEN
        v_numar_document := p_serie_document || LPAD(v_numar_nou::TEXT, 6, '0');
    ELSE
        v_numar_document := LPAD(v_numar_nou::TEXT, 6, '0');
    END IF;
    
    RETURN v_numar_document;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate document totals
CREATE OR REPLACE FUNCTION calculate_document_totals(p_document_id INTEGER)
RETURNS VOID AS $$
DECLARE
    v_subtotal DECIMAL(12,2);
    v_total_tva DECIMAL(12,2);
    v_total DECIMAL(12,2);
    v_total_discount DECIMAL(12,2);
BEGIN
    -- Calculate totals from document items
    SELECT 
        COALESCE(SUM(valoare_fara_tva), 0),
        COALESCE(SUM(valoare_tva), 0),
        COALESCE(SUM(valoare_cu_tva), 0),
        COALESCE(SUM(discount_suma), 0)
    INTO v_subtotal, v_total_tva, v_total, v_total_discount
    FROM document_items
    WHERE document_id = p_document_id;
    
    -- Update document totals
    UPDATE documents
    SET 
        subtotal = v_subtotal,
        total_tva = v_total_tva,
        total = v_total,
        total_discount = v_total_discount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_document_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate document totals when items change
CREATE OR REPLACE FUNCTION recalculate_document_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM calculate_document_totals(OLD.document_id);
        RETURN OLD;
    ELSE
        PERFORM calculate_document_totals(NEW.document_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalculate_document_totals
    AFTER INSERT OR UPDATE OR DELETE ON document_items
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_document_totals();

-- Insert initial document sequences for current year
INSERT INTO document_sequences (tip_document, serie_document, an, numar_curent)
VALUES 
    ('factura', '', EXTRACT(YEAR FROM CURRENT_DATE), 0),
    ('factura_storno', 'ST', EXTRACT(YEAR FROM CURRENT_DATE), 0),
    ('proforma', 'PF', EXTRACT(YEAR FROM CURRENT_DATE), 0),
    ('aviz', 'AV', EXTRACT(YEAR FROM CURRENT_DATE), 0)
ON CONFLICT (tip_document, serie_document, an) DO NOTHING;