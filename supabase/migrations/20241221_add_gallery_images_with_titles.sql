-- Enhance projects table to support gallery images with titles
-- Add a new column to store gallery images with titles as JSON

-- Add gallery_images_with_titles column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS gallery_images_with_titles JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on JSON queries
CREATE INDEX IF NOT EXISTS idx_projects_gallery_images_with_titles 
ON projects USING GIN (gallery_images_with_titles);

-- Migration script to convert existing gallery_images to new format
-- (Run this if you have existing projects with gallery_images)
UPDATE projects 
SET gallery_images_with_titles = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'url', value,
      'title', ''
    )
  )
  FROM jsonb_array_elements_text(
    CASE 
      WHEN jsonb_typeof(gallery_images) = 'array' THEN gallery_images
      ELSE '[]'::jsonb
    END
  ) AS value
)
WHERE gallery_images IS NOT NULL 
AND gallery_images != '[]'::jsonb 
AND (gallery_images_with_titles IS NULL OR gallery_images_with_titles = '[]'::jsonb);
