-- Analytics table for tracking page views and user interactions
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id TEXT,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  ip_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  screen_width INTEGER,
  screen_height INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  language TEXT,
  timezone TEXT,
  duration_seconds INTEGER DEFAULT 0,
  interactions JSONB DEFAULT '[]'::jsonb,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_analytics_session_id ON analytics(session_id);
CREATE INDEX idx_analytics_visitor_id ON analytics(visitor_id);
CREATE INDEX idx_analytics_page_path ON analytics(page_path);
CREATE INDEX idx_analytics_country ON analytics(country);
CREATE INDEX idx_analytics_visited_at ON analytics(visited_at DESC);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (for tracking)
CREATE POLICY "Allow public insert" ON analytics
  FOR INSERT WITH CHECK (true);

-- Alternative: If above doesn't work, use this instead
-- CREATE POLICY "Allow anon insert" ON analytics
--   FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users can read analytics (for dashboard)
CREATE POLICY "Allow authenticated read" ON analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Project views tracking
CREATE TABLE IF NOT EXISTS project_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  visitor_id TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_project_views_project_id ON project_views(project_id);
CREATE INDEX idx_project_views_session_id ON project_views(session_id);
CREATE INDEX idx_project_views_viewed_at ON project_views(viewed_at DESC);

-- Enable RLS
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON project_views
  FOR INSERT WITH CHECK (true);

-- Allow authenticated read
CREATE POLICY "Allow authenticated read" ON project_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Section interactions tracking
CREATE TABLE IF NOT EXISTS section_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  section_name TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'view', 'click', 'scroll'
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  interacted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_section_interactions_session_id ON section_interactions(session_id);
CREATE INDEX idx_section_interactions_section_name ON section_interactions(section_name);
CREATE INDEX idx_section_interactions_type ON section_interactions(interaction_type);
CREATE INDEX idx_section_interactions_interacted_at ON section_interactions(interacted_at DESC);

-- Enable RLS
ALTER TABLE section_interactions ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON section_interactions
  FOR INSERT WITH CHECK (true);

-- Allow authenticated read
CREATE POLICY "Allow authenticated read" ON section_interactions
  FOR SELECT USING (auth.role() = 'authenticated');
