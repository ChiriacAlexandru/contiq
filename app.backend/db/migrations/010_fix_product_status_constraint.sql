-- Fix products status constraint to allow all valid statuses
-- First, drop the existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS trigger_product_status_update ON products;

-- Drop the existing constraint if it exists
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;

-- Add the correct constraint that allows all valid statuses including 'stoc_redus'
ALTER TABLE products ADD CONSTRAINT products_status_check 
    CHECK (status IN ('activ', 'inactiv', 'stoc_redus', 'epuizat'));

-- Update any existing products that might have invalid statuses
UPDATE products SET status = 'activ' WHERE status IS NULL OR status = '';

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Only auto-update status based on stock levels if status is not being explicitly set
    -- and if we're changing stock values
    IF (OLD.stoc_actual IS DISTINCT FROM NEW.stoc_actual OR OLD.stoc_minim IS DISTINCT FROM NEW.stoc_minim) THEN
        IF NEW.stoc_actual = 0 THEN
            NEW.status = 'epuizat';
        ELSIF NEW.stoc_actual <= NEW.stoc_minim AND NEW.stoc_actual > 0 THEN
            NEW.status = 'stoc_redus';
        ELSIF OLD.status IN ('epuizat', 'stoc_redus') AND NEW.stoc_actual > NEW.stoc_minim THEN
            NEW.status = 'activ';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate the trigger
CREATE TRIGGER trigger_product_status_update
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_status();