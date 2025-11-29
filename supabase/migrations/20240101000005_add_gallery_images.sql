-- Add cover_image and gallery_images columns to projects table
ALTER TABLE projects 
ADD COLUMN cover_image_url TEXT,
ADD COLUMN gallery_images TEXT[] DEFAULT '{}';

-- Update existing projects to use their current image as cover image
UPDATE projects SET cover_image_url = image_url WHERE cover_image_url IS NULL;
