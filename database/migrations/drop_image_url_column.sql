-- Drop the image_url column from projects table
ALTER TABLE projects DROP COLUMN IF EXISTS image_url;
