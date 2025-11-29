-- Add cover_image and gallery_images columns to projects table (if they don't exist)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- Update existing projects to use their current image as cover image
UPDATE projects SET cover_image_url = image_url WHERE cover_image_url IS NULL AND image_url IS NOT NULL;

-- Drop the image_url column
ALTER TABLE projects DROP COLUMN IF EXISTS image_url;
