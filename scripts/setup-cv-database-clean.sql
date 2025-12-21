-- Clean CV Management Database Setup
-- This script handles existing policies and creates everything needed

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to active CV documents" ON cv_documents;
DROP POLICY IF EXISTS "Allow authenticated users to read all CV documents" ON cv_documents;
DROP POLICY IF EXISTS "Allow authenticated users to insert CV documents" ON cv_documents;
DROP POLICY IF EXISTS "Allow authenticated users to update CV documents" ON cv_documents;
DROP POLICY IF EXISTS "Allow authenticated users to delete CV documents" ON cv_documents;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_cv_documents_updated_at ON cv_documents;
DROP FUNCTION IF EXISTS update_cv_documents_updated_at();

-- Create the CV documents table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS cv_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    is_active BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_documents_active ON cv_documents(is_active);

-- Enable RLS
ALTER TABLE cv_documents ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "Allow public read access to active CV documents" ON cv_documents
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to read all CV documents" ON cv_documents
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert CV documents" ON cv_documents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update CV documents" ON cv_documents
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete CV documents" ON cv_documents
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_cv_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_cv_documents_updated_at
    BEFORE UPDATE ON cv_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_cv_documents_updated_at();

-- Success message
SELECT 'CV Management database setup completed successfully!' as message;