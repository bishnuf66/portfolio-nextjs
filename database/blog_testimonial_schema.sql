-- Create blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_published ON blogs(published);
CREATE INDEX idx_blogs_created_at ON blogs(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to published blogs for all users
CREATE POLICY "Enable read access for published blogs" ON blogs
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

-- Create policy to allow insert for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON blogs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow update for authenticated users
CREATE POLICY "Enable update for authenticated users" ON blogs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow delete for authenticated users
CREATE POLICY "Enable delete for authenticated users" ON blogs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_testimonials_published ON testimonials(published);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to published testimonials for all users
CREATE POLICY "Enable read access for published testimonials" ON testimonials
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

-- Create policy to allow insert for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON testimonials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow update for authenticated users
CREATE POLICY "Enable update for authenticated users" ON testimonials
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow delete for authenticated users
CREATE POLICY "Enable delete for authenticated users" ON testimonials
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for blog images storage bucket
CREATE POLICY "Anyone can view blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Create storage bucket for testimonial avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('testimonial-avatars', 'testimonial-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for testimonial avatars storage bucket
CREATE POLICY "Anyone can view testimonial avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'testimonial-avatars');

CREATE POLICY "Authenticated users can upload testimonial avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'testimonial-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonial avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'testimonial-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonial avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'testimonial-avatars' AND auth.role() = 'authenticated');
