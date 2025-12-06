# Quick Reference Card

## 🚀 Quick Start (3 Steps)

### 1. Run Database Migration
```sql
-- In Supabase SQL Editor
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = true;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
```

### 2. Mark Featured Projects

**Via Dashboard (Recommended):**
1. Go to `/dashboard`
2. Edit any project
3. Check "Featured Project" ✅
4. Save

**Via SQL:**
```sql
UPDATE projects SET is_featured = true WHERE id IN ('id1', 'id2', 'id3', 'id4', 'id5', 'id6');
```

### 3. Test & Deploy
```bash
npm run dev  # Test locally
npm run build  # Build for production
```

## 📁 New File Structure

```
src/
├── components/
│   ├── FeaturedProjects.tsx    ← Shows 6 featured projects
│   ├── FeaturedBlogs.tsx       ← Shows 3 latest blogs
│   └── SEO.tsx                 ← SEO helper component
├── app/
│   ├── page.tsx                ← Updated homepage
│   ├── layout.tsx              ← Enhanced SEO metadata
│   ├── projects/
│   │   └── page.tsx            ← NEW: Projects hub
│   ├── sitemap.ts              ← NEW: Dynamic sitemap
│   └── robots.ts               ← NEW: Robots config
└── lib/
    └── seo.ts                  ← NEW: SEO utilities
```

## 🔌 API Quick Reference

```bash
# Get featured projects
GET /api/projects?featured=true&limit=6

# Get by category
GET /api/projects?category=professional

# Get featured by category
GET /api/projects?featured=true&category=personal&limit=3
```

## 🎯 Page Routes

```
/                    → Homepage (featured content)
/projects            → Projects hub (NEW)
/projects/professional → Professional projects
/projects/personal   → Personal projects
/blog                → Blog listing
/sitemap.xml         → Sitemap (NEW)
/robots.txt          → Robots (NEW)
```

## 💾 Database Schema

```sql
projects table:
├── id (UUID)
├── name (TEXT)
├── description (TEXT)
├── url (TEXT)
├── tech_stack (TEXT[])
├── category (TEXT) - 'professional' | 'personal'
├── is_featured (BOOLEAN) ← NEW
├── cover_image_url (TEXT) ← NEW
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🎨 Component Usage

### Featured Projects
```tsx
import FeaturedProjects from "@/components/FeaturedProjects";

<FeaturedProjects />
```

### Featured Blogs
```tsx
import FeaturedBlogs from "@/components/FeaturedBlogs";

<FeaturedBlogs />
```

## 🔍 SEO Checklist

- [x] Metadata in layout.tsx
- [x] Structured data (JSON-LD)
- [x] Sitemap at /sitemap.xml
- [x] Robots.txt at /robots.txt
- [x] Open Graph tags
- [x] Twitter Cards
- [ ] Create /public/og-image.jpg (1200x630px)
- [ ] Submit sitemap to Google Search Console

## 📊 Key Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Featured Projects | 6 | Set in DB |
| Featured Blogs | 3 | Auto (latest) |
| Page Load | <2s | Optimized |
| SEO Score | 90+ | Enhanced |

## 🛠️ Common Tasks

### Add Featured Project
```sql
UPDATE projects SET is_featured = true WHERE id = 'project-id';
```

### Remove Featured Status
```sql
UPDATE projects SET is_featured = false WHERE id = 'project-id';
```

### Add Cover Image
```sql
UPDATE projects SET cover_image_url = 'https://image-url.jpg' WHERE id = 'project-id';
```

### View All Featured
```sql
SELECT name, category, is_featured FROM projects WHERE is_featured = true;
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No featured projects showing | Run migration, mark projects as featured |
| API returns empty | Check `is_featured = true` in database |
| Images not loading | Add domain to next.config.ts |
| Sitemap 404 | Rebuild project: `npm run build` |

## 📚 Documentation Files

- **IMPLEMENTATION_SUMMARY.md** - What changed overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **SEO_OPTIMIZATION.md** - Complete SEO guide
- **MIGRATION_INSTRUCTIONS.md** - Database migration steps
- **QUICK_REFERENCE.md** - This file

## 🎯 Testing Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Check for errors
npm run lint
```

## 🌐 Important URLs

```
Local:
- http://localhost:3000
- http://localhost:3000/projects
- http://localhost:3000/sitemap.xml
- http://localhost:3000/robots.txt

Production:
- https://www.bishnubk.com.np
- https://www.bishnubk.com.np/sitemap.xml
- https://www.bishnubk.com.np/robots.txt
```

## ✅ Pre-Deploy Checklist

- [ ] Database migration completed
- [ ] 6 projects marked as featured
- [ ] Cover images added (optional)
- [ ] OG image created at /public/og-image.jpg
- [ ] Tested locally (npm run dev)
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Mobile responsive checked
- [ ] Build successful (npm run build)

## 🚀 Post-Deploy Tasks

- [ ] Submit sitemap to Google Search Console
- [ ] Test all pages in production
- [ ] Check Open Graph preview
- [ ] Run Lighthouse audit
- [ ] Monitor for errors

## 💡 Pro Tips

1. **Update Featured Projects Quarterly** - Keep content fresh
2. **Write Blog Posts Regularly** - Better SEO
3. **Use High-Quality Images** - Better engagement
4. **Monitor Google Search Console** - Track performance
5. **Keep Dependencies Updated** - Security & performance

## 🎉 You're Ready!

Everything is set up and ready to go. Just complete the database migration and you're good to deploy!

---

**Quick Help:**
- Database issues? → See MIGRATION_INSTRUCTIONS.md
- SEO questions? → See SEO_OPTIMIZATION.md
- Setup help? → See SETUP_GUIDE.md
