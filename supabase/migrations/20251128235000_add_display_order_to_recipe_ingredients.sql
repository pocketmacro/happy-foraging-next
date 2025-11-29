-- Add display_order column to recipe_ingredients table
ALTER TABLE recipe_ingredients ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial display_order based on current id order
UPDATE recipe_ingredients
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY recipe_id ORDER BY id) - 1 as row_num
  FROM recipe_ingredients
) AS subquery
WHERE recipe_ingredients.id = subquery.id;

-- Add comment
COMMENT ON COLUMN recipe_ingredients.display_order IS 'Order in which ingredient appears in the recipe';
