-- Change category from single text to array
-- First, create a new column to hold the array
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS categories TEXT[];

-- Migrate existing category data to array format
UPDATE recipes SET categories = ARRAY[category] WHERE category IS NOT NULL;

-- Drop the old category column
ALTER TABLE recipes DROP COLUMN IF EXISTS category;

-- Rename categories to category for consistency
ALTER TABLE recipes RENAME COLUMN categories TO category;

-- Create index for searching categories
CREATE INDEX IF NOT EXISTS idx_recipes_category_gin ON recipes USING GIN (category);

-- Update existing recipes to have proper categories
UPDATE recipes SET category = ARRAY['salads'] WHERE 'salads' = ANY(category) OR array_length(category, 1) IS NULL;
