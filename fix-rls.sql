-- Fix RLS policy to allow public insert
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON projects;
CREATE POLICY "Enable insert for all users" ON projects
  FOR INSERT WITH CHECK (true);
