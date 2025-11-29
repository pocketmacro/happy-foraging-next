-- Add slug field to guides table for SEO-friendly URLs
ALTER TABLE guides ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slugs for existing guides with unique constraint handling
UPDATE guides
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || id::text
WHERE slug IS NULL;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);

-- Add comment
COMMENT ON COLUMN guides.slug IS 'SEO-friendly URL slug for the guide';
