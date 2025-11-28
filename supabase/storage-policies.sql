-- =====================================================
-- STORAGE POLICIES FOR RECIPE IMAGES
-- Run this in your Supabase SQL Editor if db:push didn't apply the policies
-- =====================================================

-- First, create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
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
