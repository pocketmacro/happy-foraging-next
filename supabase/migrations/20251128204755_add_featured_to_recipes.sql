-- Add featured column to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create index for faster querying of featured recipes
CREATE INDEX IF NOT EXISTS idx_recipes_featured ON recipes(featured) WHERE featured = true;

-- Set some existing recipes as featured (optional - for testing)
-- You can remove this if you want to manually set featured recipes in the admin
UPDATE recipes SET featured = true WHERE id IN (1, 2, 3);
