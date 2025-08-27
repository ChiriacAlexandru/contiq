-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    cod VARCHAR(50) NOT NULL UNIQUE,
    descriere TEXT,
    website VARCHAR(500),
    contact_email VARCHAR(255),
    contact_telefon VARCHAR(50),
    logo_path VARCHAR(500),
    activ BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_brands_cod ON brands(cod);
CREATE INDEX IF NOT EXISTS idx_brands_nume ON brands(nume);
CREATE INDEX IF NOT EXISTS idx_brands_activ ON brands(activ);
CREATE INDEX IF NOT EXISTS idx_brands_contact_email ON brands(contact_email);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_brands_updated_at ON brands;
CREATE TRIGGER trigger_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_brands_updated_at();

-- Insert some default brands
INSERT INTO brands (nume, cod, descriere) VALUES 
    ('Samsung', 'SAMS', 'Electronică și tehnologie'),
    ('Apple', 'APPL', 'Dispozitive și servicii tehnologice'),
    ('Nike', 'NIKE', 'Îmbrăcăminte și încălțăminte sportivă'),
    ('IKEA', 'IKEA', 'Mobilier și decorațiuni pentru casă'),
    ('Generic', 'GENR', 'Brand generic pentru produse fără marcă')
ON CONFLICT (cod) DO NOTHING;