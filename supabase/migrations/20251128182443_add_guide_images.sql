-- Create guide_images table for storing image metadata
CREATE TABLE IF NOT EXISTS guide_images (
  id BIGSERIAL PRIMARY KEY,
  guide_id BIGINT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_guide_images_guide_id ON guide_images(guide_id);

-- Storage bucket already exists (recipe-images), we'll reuse it for guides too
-- Add storage policies if they don't exist (they should from recipes migration)

-- Comment
COMMENT ON TABLE guide_images IS 'Stores metadata for guide images uploaded to Supabase Storage';
