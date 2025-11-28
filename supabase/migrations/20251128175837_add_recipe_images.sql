-- =====================================================
-- RECIPE IMAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS recipe_images (
  id BIGSERIAL PRIMARY KEY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_recipe_images_recipe ON recipe_images(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_images_primary ON recipe_images(recipe_id, is_primary) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;

-- Public can view images
CREATE POLICY "Anyone can view recipe images"
  ON recipe_images FOR SELECT
  USING (true);

-- Authenticated users can manage images
CREATE POLICY "Authenticated users can insert images"
  ON recipe_images FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
  ON recipe_images FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
  ON recipe_images FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE BUCKET SETUP
-- =====================================================

-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for recipe-images bucket
-- Allow public read access to all images
DROP POLICY IF EXISTS "Public can view recipe images" ON storage.objects;
CREATE POLICY "Public can view recipe images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'recipe-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their uploaded images
DROP POLICY IF EXISTS "Authenticated users can update recipe images" ON storage.objects;
CREATE POLICY "Authenticated users can update recipe images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'recipe-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete recipe images
DROP POLICY IF EXISTS "Authenticated users can delete recipe images" ON storage.objects;
CREATE POLICY "Authenticated users can delete recipe images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'recipe-images'
    AND auth.role() = 'authenticated'
  );

-- =====================================================
-- HELPER FUNCTION - Ensure only one primary image per recipe
-- =====================================================

CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE recipe_images
    SET is_primary = false
    WHERE recipe_id = NEW.recipe_id
      AND id != NEW.id
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single primary image
DROP TRIGGER IF EXISTS ensure_single_primary_image_trigger ON recipe_images;
CREATE TRIGGER ensure_single_primary_image_trigger
  BEFORE INSERT OR UPDATE ON recipe_images
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_image();
