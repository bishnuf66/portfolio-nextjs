-- Gallery Management Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    title VARCHAR(255), -- Optional title for each image
    description TEXT, -- Optional description
    file_size INTEGER,
    mime_type VARCHAR(100),
    width INTEGER, -- Image dimensions
    height INTEGER,
    is_featured BOOLEAN DEFAULT false, -- Featured images for homepage
    display_order INTEGER DEFAULT 0, -- For custom ordering
    category VARCHAR(100) DEFAULT 'general', -- Category grouping
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON gallery_images(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images(display_order);

-- Add RLS (Row Level Security) policies
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to all gallery images
CREATE POLICY "Allow public read access to gallery images" ON gallery_images
    FOR SELECT USING (true);

-- Policy to allow authenticated users to manage gallery images
CREATE POLICY "Allow authenticated users to insert gallery images" ON gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update gallery images" ON gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete gallery images" ON gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_gallery_images_updated_at();