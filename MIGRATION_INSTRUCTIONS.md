# Database Migration Instructions

## 🎯 Quick Migration Guide

### Step 1: Access Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Run the Migration

Copy and paste this SQL into the editor:

```sql
-- Add is_featured column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for better performance when filtering featured projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = true;

-- Add cover_image_url if it doesn't exist (for better SEO with images)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN projects.is_featured IS 'Flag to mark projects as featured on homepage';
COMMENT ON COLUMN projects.cover_image_url IS 'URL to project cover image for better SEO and social sharing';
```

Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Step 3: Mark Projects as Featured

After the migration, mark your best projects as featured:

```sql
-- View all your projects first
SELECT id, name, category FROM projects ORDER BY created_at DESC;

-- Mark specific projects as featured (replace with your actual project IDs)
UPDATE projects 
SET is_featured = true 
WHERE id IN (
  'your-project-id-1',
  'your-project-id-2',
  'your-project-id-3'
);

-- Or mark top 3 professional projects
UPDATE projects 
SET is_featured = true 
WHERE id IN (
  SELECT id FROM projects 
  WHERE category = 'professional' 
  ORDER BY created_at DESC 
  LIMIT 3
);

-- Or mark top 3 personal projects
UPDATE projects 
SET is_featured = true 
WHERE id IN (
  SELECT id FROM projects 
  WHERE category = 'personal' 
  ORDER BY created_at DESC 
  LIMIT 3
);
```

### Step 4: Verify the Migration

Check that everything worked:

```sql
-- Check if columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('is_featured', 'cover_image_url');

-- View featured projects
SELECT id, name, is_featured, category 
FROM projects 
WHERE is_featured = true;

-- Count featured projects
SELECT category, COUNT(*) as featured_count 
FROM projects 
WHERE is_featured = true 
GROUP BY category;
```

## 🎨 Optional: Add Cover Images

If you have cover images for your projects:

```sql
-- Update individual project
UPDATE projects 
SET cover_image_url = 'https://your-supabase-url.supabase.co/storage/v1/object/public/project-images/project1.jpg'
WHERE id = 'your-project-id';

-- Or update multiple at once
UPDATE projects 
SET cover_image_url = CASE id
  WHEN 'project-id-1' THEN 'https://url-to-image-1.jpg'
  WHEN 'project-id-2' THEN 'https://url-to-image-2.jpg'
  WHEN 'project-id-3' THEN 'https://url-to-image-3.jpg'
  ELSE cover_image_url
END
WHERE id IN ('project-id-1', 'project-id-2', 'project-id-3');
```

## 🔍 Troubleshooting

### Error: "column already exists"
This is fine! It means the column was already added. The `IF NOT EXISTS` clause prevents errors.

### Error: "permission denied"
Make sure you're logged in as the project owner or have admin access.

### No Projects Showing as Featured
Run this to check:
```sql
SELECT * FROM projects WHERE is_featured = true;
```

If empty, you need to mark some projects as featured (see Step 3).

## ✅ Verification Checklist

After migration, verify:
- [ ] `is_featured` column exists in projects table
- [ ] `cover_image_url` column exists in projects table
- [ ] Index `idx_projects_featured` is created
- [ ] At least 3-6 projects are marked as featured
- [ ] Featured projects API works: `/api/projects?featured=true`
- [ ] Homepage shows featured projects
- [ ] No console errors in browser

## 🚀 Next Steps

1. ✅ Migration complete
2. Mark your best projects as featured
3. Add cover images (optional but recommended)
4. Test the homepage
5. Deploy to production

## 📝 Rollback (If Needed)

If you need to undo the migration:

```sql
-- Remove the columns (WARNING: This deletes data!)
ALTER TABLE projects DROP COLUMN IF EXISTS is_featured;
ALTER TABLE projects DROP COLUMN IF EXISTS cover_image_url;

-- Remove the index
DROP INDEX IF EXISTS idx_projects_featured;
```

## 💡 Tips

1. **Start Small**: Mark 3-6 projects as featured initially
2. **Update Regularly**: Change featured projects to showcase different work
3. **Use Cover Images**: They improve SEO and social sharing
4. **Test First**: Try on a development database if available

## 🎉 Done!

Your database is now ready for the new featured projects functionality!

Need help? Check the main [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more information.
