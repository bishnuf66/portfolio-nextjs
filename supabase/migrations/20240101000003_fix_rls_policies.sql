-- Drop temporary policies and restore proper RLS
DROP POLICY IF EXISTS "Enable insert for all users temporarily" ON projects;
DROP POLICY IF EXISTS "Enable delete for all users temporarily" ON projects;

-- Recreate proper policies for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');
