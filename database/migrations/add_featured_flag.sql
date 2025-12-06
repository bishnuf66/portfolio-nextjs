-- Add is_featured column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for better performance when filtering featured projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = true;

-- Add cover_image_url if it doesn't exist (for better SEO with images)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Update some existing projects to be featured (optional - adjust IDs as needed)
-- UPDATE projects SET is_featured = true WHERE category = 'professional' LIMIT 3;
-- UPDATE projects SET is_featured = true WHERE category = 'personal' LIMIT 3;

COMMENT ON COLUMN projects.is_featured IS 'Flag to mark projects as featured on homepage';
COMMENT ON COLUMN projects.cover_image_url IS 'URL to project cover image for better SEO and social sharing';
