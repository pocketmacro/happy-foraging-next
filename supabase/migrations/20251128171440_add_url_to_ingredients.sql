-- Add url field to ingredients table for purchase links
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS url TEXT;

-- Add comment to describe the url field
COMMENT ON COLUMN ingredients.url IS 'Optional URL where users can purchase this ingredient';
