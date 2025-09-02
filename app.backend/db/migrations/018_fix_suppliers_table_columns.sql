-- Fix suppliers table - ensure all required columns exist
-- This migration handles the case where the suppliers table exists but is missing columns

-- First, let's ensure the table exists with basic structure
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255),
    cod VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Check and add numele column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='nume') THEN
        ALTER TABLE suppliers ADD COLUMN nume VARCHAR(255) NOT NULL DEFAULT '';
        ALTER TABLE suppliers ALTER COLUMN nume DROP DEFAULT;
    END IF;

    -- Check and add cod column with unique constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='cod') THEN
        ALTER TABLE suppliers ADD COLUMN cod VARCHAR(50) NOT NULL DEFAULT '';
        ALTER TABLE suppliers ALTER COLUMN cod DROP DEFAULT;
    END IF;

    -- Add cui column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='cui') THEN
        ALTER TABLE suppliers ADD COLUMN cui VARCHAR(50);
    END IF;

    -- Add adresa column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='adresa') THEN
        ALTER TABLE suppliers ADD COLUMN adresa TEXT;
    END IF;

    -- Add oras column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='oras') THEN
        ALTER TABLE suppliers ADD COLUMN oras VARCHAR(100);
    END IF;

    -- Add judet column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='judet') THEN
        ALTER TABLE suppliers ADD COLUMN judet VARCHAR(50);
    END IF;

    -- Add cod_postal column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='cod_postal') THEN
        ALTER TABLE suppliers ADD COLUMN cod_postal VARCHAR(20);
    END IF;

    -- Add telefon column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='telefon') THEN
        ALTER TABLE suppliers ADD COLUMN telefon VARCHAR(50);
    END IF;

    -- Add email column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='email') THEN
        ALTER TABLE suppliers ADD COLUMN email VARCHAR(255);
    END IF;

    -- Add website column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='website') THEN
        ALTER TABLE suppliers ADD COLUMN website VARCHAR(500);
    END IF;

    -- Add reprezentant_nume column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='reprezentant_nume') THEN
        ALTER TABLE suppliers ADD COLUMN reprezentant_nume VARCHAR(255);
    END IF;

    -- Add reprezentant_telefon column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='reprezentant_telefon') THEN
        ALTER TABLE suppliers ADD COLUMN reprezentant_telefon VARCHAR(50);
    END IF;

    -- Add reprezentant_email column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='reprezentant_email') THEN
        ALTER TABLE suppliers ADD COLUMN reprezentant_email VARCHAR(255);
    END IF;

    -- Add conturi_bancare column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='conturi_bancare') THEN
        ALTER TABLE suppliers ADD COLUMN conturi_bancare TEXT;
    END IF;

    -- Add termeni_plata column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='termeni_plata') THEN
        ALTER TABLE suppliers ADD COLUMN termeni_plata VARCHAR(50);
    END IF;

    -- Add zile_plata column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='zile_plata') THEN
        ALTER TABLE suppliers ADD COLUMN zile_plata INTEGER DEFAULT 30;
    END IF;

    -- Add rating column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='rating') THEN
        ALTER TABLE suppliers ADD COLUMN rating DECIMAL(3,2) CHECK (rating >= 1 AND rating <= 5);
    END IF;

    -- Add observatii column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='observatii') THEN
        ALTER TABLE suppliers ADD COLUMN observatii TEXT;
    END IF;

    -- Add activ column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='activ') THEN
        ALTER TABLE suppliers ADD COLUMN activ BOOLEAN DEFAULT true;
    END IF;

    -- Add created_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='created_at') THEN
        ALTER TABLE suppliers ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Add updated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='updated_at') THEN
        ALTER TABLE suppliers ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_suppliers_cod ON suppliers(cod);
CREATE INDEX IF NOT EXISTS idx_suppliers_nume ON suppliers(nume);
CREATE INDEX IF NOT EXISTS idx_suppliers_cui ON suppliers(cui);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_activ ON suppliers(activ);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating);

-- Add unique constraint on cod if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name='suppliers' AND constraint_name='suppliers_cod_key'
    ) THEN
        ALTER TABLE suppliers ADD CONSTRAINT suppliers_cod_key UNIQUE (cod);
    END IF;
EXCEPTION
    WHEN duplicate_table THEN
        -- Constraint already exists, ignore
        NULL;
END $$;

-- Create trigger for updated_at if it doesn't exist
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

-- Insert some default suppliers if table is empty
INSERT INTO suppliers (nume, cod, cui, email, telefon, rating, activ) 
SELECT * FROM (VALUES 
    ('Furnizor Principal SRL', 'FURN01', 'RO12345678', 'contact@furnizor1.ro', '+40123456789', 4.5, true),
    ('Distribuitorul ABC', 'DIST01', 'RO87654321', 'info@abc.ro', '+40987654321', 4.2, true),
    ('Importator XYZ', 'IMP01', 'RO11223344', 'comenzi@xyz.ro', '+40555666777', 3.8, true)
) AS v(nume, cod, cui, email, telefon, rating, activ)
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE cod = v.cod);