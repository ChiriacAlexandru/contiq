-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    cod VARCHAR(100) NOT NULL UNIQUE,
    descriere TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    location_id INTEGER, -- For future implementation of locations/warehouses
    pret_vanzare DECIMAL(12,2),
    pret_achizitie DECIMAL(12,2),
    stoc_actual INTEGER DEFAULT 0,
    stoc_minim INTEGER DEFAULT 0,
    unitate_masura VARCHAR(20) DEFAULT 'buc',
    garantie_luni INTEGER,
    greutate DECIMAL(8,3), -- in kg
    dimensiuni_lungime DECIMAL(8,2), -- in cm
    dimensiuni_latime DECIMAL(8,2), -- in cm
    dimensiuni_inaltime DECIMAL(8,2), -- in cm
    cod_bare VARCHAR(50),
    imagine_principala VARCHAR(500),
    conditii_pastrare TEXT,
    instructiuni_folosire TEXT,
    status VARCHAR(20) DEFAULT 'activ' CHECK (status IN ('activ', 'inactiv', 'stoc_redus', 'epuizat')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_cod ON products(cod);
CREATE INDEX IF NOT EXISTS idx_products_nume ON products(nume);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_pret_vanzare ON products(pret_vanzare);
CREATE INDEX IF NOT EXISTS idx_products_stoc_actual ON products(stoc_actual);
CREATE INDEX IF NOT EXISTS idx_products_cod_bare ON products(cod_bare);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('romanian', nume || ' ' || COALESCE(descriere, '')));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

-- Create trigger to automatically update status based on stock levels
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stoc_actual = 0 THEN
        NEW.status = 'epuizat';
    ELSIF NEW.stoc_actual <= NEW.stoc_minim AND NEW.stoc_actual > 0 THEN
        NEW.status = 'stoc_redus';
    ELSIF OLD.status IN ('epuizat', 'stoc_redus') AND NEW.stoc_actual > NEW.stoc_minim THEN
        NEW.status = 'activ';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_product_status_update ON products;
CREATE TRIGGER trigger_product_status_update
    BEFORE UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.stoc_actual IS DISTINCT FROM NEW.stoc_actual OR OLD.stoc_minim IS DISTINCT FROM NEW.stoc_minim)
    EXECUTE FUNCTION update_product_status();

-- Insert some sample products (using dynamic IDs from categories, brands, suppliers)
INSERT INTO products (nume, cod, descriere, category_id, brand_id, supplier_id, pret_vanzare, pret_achizitie, stoc_actual, stoc_minim, unitate_masura)
SELECT 'Smartphone Galaxy S23', 'SAMS-S23', 'Telefon inteligent Samsung Galaxy S23, 128GB', 
       c.id, b.id, s.id, 3499.99, 2800.00, 15, 5, 'buc'
FROM categories c, brands b, suppliers s 
WHERE c.cod = 'ELEC' AND b.cod = 'SAMS' AND s.cod = 'FURN01'
ON CONFLICT (cod) DO NOTHING;

INSERT INTO products (nume, cod, descriere, category_id, brand_id, supplier_id, pret_vanzare, pret_achizitie, stoc_actual, stoc_minim, unitate_masura)
SELECT 'iPhone 14', 'APPL-I14', 'Apple iPhone 14, 128GB', 
       c.id, b.id, s.id, 4199.99, 3500.00, 8, 3, 'buc'
FROM categories c, brands b, suppliers s 
WHERE c.cod = 'ELEC' AND b.cod = 'APPL' AND s.cod = 'FURN01'
ON CONFLICT (cod) DO NOTHING;

INSERT INTO products (nume, cod, descriere, category_id, brand_id, supplier_id, pret_vanzare, pret_achizitie, stoc_actual, stoc_minim, unitate_masura)
SELECT 'Birou MALM', 'IKEA-MALM-DESK', 'Birou IKEA MALM, alb', 
       c.id, b.id, s.id, 399.99, 250.00, 12, 2, 'buc'
FROM categories c, brands b, suppliers s 
WHERE c.cod = 'MOBI' AND b.cod = 'IKEA' AND s.cod = 'DIST01'
ON CONFLICT (cod) DO NOTHING;

INSERT INTO products (nume, cod, descriere, category_id, brand_id, supplier_id, pret_vanzare, pret_achizitie, stoc_actual, stoc_minim, unitate_masura)
SELECT 'Adidași Air Max', 'NIKE-AIR-MAX', 'Adidași Nike Air Max pentru alergare', 
       c.id, b.id, s.id, 599.99, 350.00, 25, 5, 'pereche'
FROM categories c, brands b, suppliers s 
WHERE c.cod = 'IMBR' AND b.cod = 'NIKE' AND s.cod = 'IMP01'
ON CONFLICT (cod) DO NOTHING;