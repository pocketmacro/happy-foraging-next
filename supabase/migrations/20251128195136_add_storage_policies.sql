-- =====================================================
-- STORAGE POLICIES FOR RECIPE IMAGES BUCKET
-- =====================================================

-- Drop existing policies if they exist (to make migration idempotent)
DROP POLICY IF EXISTS "Public can view recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete recipe images" ON storage.objects;

-- Allow anyone to view images (public read)
CREATE POLICY "Public can view recipe images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload recipe images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recipe-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update image metadata
CREATE POLICY "Authenticated users can update recipe images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'recipe-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete recipe images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'recipe-images' AND
  auth.role() = 'authenticated'
);
