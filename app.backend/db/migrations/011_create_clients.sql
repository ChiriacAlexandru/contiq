-- Create clients table for customer management
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    tip_client VARCHAR(20) DEFAULT 'persoana_fizica' CHECK (tip_client IN ('persoana_fizica', 'persoana_juridica')),
    
    -- Contact information
    email VARCHAR(255),
    telefon VARCHAR(50),
    fax VARCHAR(50),
    website VARCHAR(255),
    
    -- Address information
    adresa TEXT,
    oras VARCHAR(100),
    judet VARCHAR(100),
    cod_postal VARCHAR(20),
    tara VARCHAR(100) DEFAULT 'Romania',
    
    -- Business information (for juridical persons)
    cui VARCHAR(50), -- CUI/CIF for companies
    nr_reg_com VARCHAR(100), -- Registration number
    cont_bancar VARCHAR(100), -- Bank account
    banca VARCHAR(255), -- Bank name
    
    -- Personal information (for individuals)
    cnp VARCHAR(13), -- CNP for individuals
    ci_serie VARCHAR(10), -- ID card series
    ci_numar VARCHAR(20), -- ID card number
    
    -- Business relationship
    agent_vanzari VARCHAR(255), -- Sales agent
    conditii_plata VARCHAR(100) DEFAULT '30_zile', -- Payment terms
    limita_credit DECIMAL(12,2) DEFAULT 0, -- Credit limit
    discount_implicit DECIMAL(5,2) DEFAULT 0, -- Default discount percentage
    
    -- Status and categorization
    status VARCHAR(20) DEFAULT 'activ' CHECK (status IN ('activ', 'inactiv', 'suspendat')),
    categorie VARCHAR(100), -- Customer category
    sursa VARCHAR(100), -- How we found this client
    
    -- Additional information
    observatii TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_nume ON clients(nume);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_cui ON clients(cui);
CREATE INDEX IF NOT EXISTS idx_clients_cnp ON clients(cnp);
CREATE INDEX IF NOT EXISTS idx_clients_tip_client ON clients(tip_client);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_oras ON clients(oras);
CREATE INDEX IF NOT EXISTS idx_clients_judet ON clients(judet);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_clients_search ON clients USING gin(to_tsvector('romanian', nume || ' ' || COALESCE(email, '') || ' ' || COALESCE(cui, '') || ' ' || COALESCE(cnp, '')));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_clients_updated_at ON clients;
CREATE TRIGGER trigger_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_clients_updated_at();

-- Insert some sample clients
INSERT INTO clients (nume, tip_client, email, telefon, adresa, oras, judet, cui, conditii_plata, status, categorie)
VALUES 
    ('SC TECH SOLUTIONS SRL', 'persoana_juridica', 'contact@techsolutions.ro', '0740123456', 'Strada Tehnologiei, nr. 15', 'București', 'Ilfov', 'RO12345678', '30_zile', 'activ', 'Corporate'),
    ('Popescu Ion', 'persoana_fizica', 'ion.popescu@email.com', '0721234567', 'Strada Florilor, nr. 25', 'Cluj-Napoca', 'Cluj', NULL, '15_zile', 'activ', 'Retail'),
    ('SC CONSTRUCT EXPERT SRL', 'persoana_juridica', 'office@constructexpert.ro', '0744567890', 'Bdul Independenței, nr. 45', 'Timișoara', 'Timiș', 'RO87654321', '45_zile', 'activ', 'Construction')
ON CONFLICT DO NOTHING;