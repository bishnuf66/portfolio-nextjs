-- Enhance projects table to support gallery images with titles
-- Add a new column to store gallery images with titles as JSON

-- Add gallery_images_with_titles column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS gallery_images_with_titles JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on JSON queries
CREATE INDEX IF NOT EXISTS idx_projects_gallery_images_with_titles 
ON projects USING GIN (gallery_images_with_titles);

-- Example structure for gallery_images_with_titles:
-- [
--   {
--     "url": "https://example.com/image1.jpg",
--     "title": "Optional title for image 1"
--   },
--   {
--     "url": "https://example.com/image2.jpg", 
--     "title": "Another optional title"
--   }
-- ]

-- Migration script to convert existing gallery_images to new format
-- (Run this if you have existing projects with gallery_images)
-- Handle both text[] and jsonb column types
UPDATE projects 
SET gallery_images_with_titles = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'url', value,
      'title', ''
    )
  )
  FROM unnest(gallery_images) AS value
)
WHERE gallery_images IS NOT NULL 
AND array_length(gallery_images, 1) > 0
AND (gallery_images_with_titles IS NULL OR gallery_images_with_titles = '[]'::jsonb);