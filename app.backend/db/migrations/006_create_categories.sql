-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    cod VARCHAR(50) NOT NULL UNIQUE,
    descriere TEXT,
    parinte_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    ordinea INTEGER,
    activ BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_cod ON categories(cod);
CREATE INDEX IF NOT EXISTS idx_categories_parinte_id ON categories(parinte_id);
CREATE INDEX IF NOT EXISTS idx_categories_ordinea ON categories(ordinea);
CREATE INDEX IF NOT EXISTS idx_categories_activ ON categories(activ);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_categories_updated_at();

-- Insert some default categories
INSERT INTO categories (nume, cod, descriere, ordinea) VALUES 
    ('Electronice', 'ELEC', 'Produse electronice și electrocasnice', 1),
    ('Mobilier', 'MOBI', 'Mobilier pentru casă și birou', 2),
    ('Îmbrăcăminte', 'IMBR', 'Articole de îmbrăcăminte și încălțăminte', 3),
    ('Cărți', 'CART', 'Cărți și materiale educaționale', 4),
    ('Sport', 'SPRT', 'Articole sportive și fitness', 5)
ON CONFLICT (cod) DO NOTHING;