-- Add slug column to projects table
ALTER TABLE projects ADD COLUMN slug TEXT;

-- Create unique index on slug to ensure no duplicates
CREATE UNIQUE INDEX idx_projects_slug ON projects(slug);

-- Update existing projects with generated slugs
UPDATE projects 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Add cover_image_url and gallery_images columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='projects' AND column_name='cover_image_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN cover_image_url TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='projects' AND column_name='gallery_images'
    ) THEN
        ALTER TABLE projects ADD COLUMN gallery_images TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='projects' AND column_name='is_featured'
    ) THEN
        ALTER TABLE projects ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
