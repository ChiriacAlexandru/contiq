-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    cod VARCHAR(50) NOT NULL UNIQUE,
    cui VARCHAR(50),
    adresa TEXT,
    oras VARCHAR(100),
    judet VARCHAR(50),
    cod_postal VARCHAR(20),
    telefon VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(500),
    reprezentant_nume VARCHAR(255),
    reprezentant_telefon VARCHAR(50),
    reprezentant_email VARCHAR(255),
    conturi_bancare TEXT,
    termeni_plata VARCHAR(50),
    zile_plata INTEGER DEFAULT 30,
    rating DECIMAL(3,2) CHECK (rating >= 1 AND rating <= 5),
    observatii TEXT,
    activ BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_cod ON suppliers(cod);
CREATE INDEX IF NOT EXISTS idx_suppliers_nume ON suppliers(nume);
CREATE INDEX IF NOT EXISTS idx_suppliers_cui ON suppliers(cui);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_activ ON suppliers(activ);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_suppliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_suppliers_updated_at ON suppliers;
CREATE TRIGGER trigger_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_suppliers_updated_at();

-- Insert some default suppliers
INSERT INTO suppliers (nume, cod, cui, email, telefon, rating, activ) VALUES 
    ('Furnizor Principal SRL', 'FURN01', 'RO12345678', 'contact@furnizor1.ro', '+40123456789', 4.5, true),
    ('Distribuitorul ABC', 'DIST01', 'RO87654321', 'info@abc.ro', '+40987654321', 4.2, true),
    ('Importator XYZ', 'IMP01', 'RO11223344', 'comenzi@xyz.ro', '+40555666777', 3.8, true)
ON CONFLICT (cod) DO NOTHING;