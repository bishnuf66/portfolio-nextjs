-- Allow public insert for projects (for demo purposes)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON projects;
CREATE POLICY "Enable insert for all users" ON projects
  FOR INSERT WITH CHECK (true);
