-- Run this script in your Supabase SQL editor to set up CV management

-- CV Management Table
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

-- Create an index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_documents_active ON cv_documents(is_active);

-- Add RLS (Row Level Security) policies
ALTER TABLE cv_documents ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to active CV documents
CREATE POLICY "Allow public read access to active CV documents" ON cv_documents
    FOR SELECT USING (is_active = true);

-- Policy to allow authenticated users to read all CV documents
CREATE POLICY "Allow authenticated users to read all CV documents" ON cv_documents
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to insert CV documents
CREATE POLICY "Allow authenticated users to insert CV documents" ON cv_documents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users to update CV documents
CREATE POLICY "Allow authenticated users to update CV documents" ON cv_documents
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete CV documents
CREATE POLICY "Allow authenticated users to delete CV documents" ON cv_documents
    FOR DELETE USING (auth.role() = 'authenticated');

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_cv_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_cv_documents_updated_at
    BEFORE UPDATE ON cv_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_cv_documents_updated_at();