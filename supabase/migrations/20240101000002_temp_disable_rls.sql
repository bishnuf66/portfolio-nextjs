-- Temporarily allow public insert for migration
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON projects;
CREATE POLICY "Enable insert for all users temporarily" ON projects
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON projects;
CREATE POLICY "Enable delete for all users temporarily" ON projects
  FOR DELETE USING (true);
