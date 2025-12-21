-- Create gallery_images table for standalone gallery functionality
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    file_size INTEGER,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    category TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_featured ON gallery_images(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_images_uploaded_at ON gallery_images(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_images_updated_at 
    BEFORE UPDATE ON gallery_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to gallery_images" 
    ON gallery_images FOR SELECT 
    USING (true);

-- Create policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert to gallery_images" 
    ON gallery_images FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update to gallery_images" 
    ON gallery_images FOR UPDATE 
    USING (true);

CREATE POLICY "Allow authenticated delete from gallery_images" 
    ON gallery_images FOR DELETE 
    USING (true);