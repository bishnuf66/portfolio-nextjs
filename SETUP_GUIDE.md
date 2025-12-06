# Portfolio Setup Guide - Blog & Projects

## 🎉 What's New

### 1. **Featured Projects Section (Homepage)**
- Shows top 6 featured projects on the homepage
- Cleaner, more focused presentation
- "View All Projects" button links to full projects page

### 2. **Featured Blog Section (Homepage)**
- Displays latest 3 blog posts
- Beautiful card design with images
- "Read All Articles" button for full blog

### 3. **Projects Hub Page** (`/projects`)
- Central page with two categories:
  - Professional Projects
  - Personal Projects
- Beautiful card-based navigation
- Stats section showing your achievements

### 4. **SEO Optimizations**
- ✅ Comprehensive metadata
- ✅ Structured data (JSON-LD)
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Image optimization
- ✅ Performance improvements

## 🚀 Quick Start

### Step 1: Database Migration
Run the migration to add the featured flag:

```sql
-- Run this in your Supabase SQL editor
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = true;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
```

Or use the migration file:
```bash
# Copy the SQL from database/migrations/add_featured_flag.sql
# and run it in Supabase SQL Editor
```

### Step 2: Mark Projects as Featured
In your Supabase dashboard or via SQL:

```sql
-- Mark your best projects as featured
UPDATE projects 
SET is_featured = true 
WHERE id IN ('project-id-1', 'project-id-2', 'project-id-3');
```

### Step 3: Add Cover Images (Optional but Recommended)
```sql
UPDATE projects 
SET cover_image_url = 'https://your-image-url.com/image.jpg'
WHERE id = 'project-id';
```

### Step 4: Create OG Image
Create a social sharing image:
- Size: 1200x630px
- Save as: `/public/og-image.jpg`
- Include your name, title, and branding

### Step 5: Submit Sitemap to Google
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://www.bishnubk.com.np`
3. Submit sitemap: `https://www.bishnubk.com.np/sitemap.xml`

## 📁 New Files Created

### Components
- `src/components/FeaturedProjects.tsx` - Featured projects for homepage
- `src/components/FeaturedBlogs.tsx` - Featured blog posts for homepage
- `src/components/SEO.tsx` - SEO component for dynamic pages

### Pages
- `src/app/projects/page.tsx` - Main projects hub page

### Utilities
- `src/lib/seo.ts` - SEO configuration and helpers
- `src/app/sitemap.ts` - Dynamic sitemap generation
- `src/app/robots.ts` - Robots.txt configuration

### Documentation
- `SEO_OPTIMIZATION.md` - Complete SEO guide
- `SETUP_GUIDE.md` - This file

### Database
- `database/migrations/add_featured_flag.sql` - Migration for featured flag

## 🎨 Updated Files

### Homepage (`src/app/page.tsx`)
- ✅ Replaced full project showcase with featured projects
- ✅ Added featured blog section
- ✅ Better section organization
- ✅ Improved visual hierarchy

### Layout (`src/app/layout.tsx`)
- ✅ Enhanced metadata with better SEO
- ✅ Added structured data (JSON-LD)
- ✅ Improved Open Graph tags
- ✅ Better Twitter Card configuration

### API (`src/app/api/projects/route.ts`)
- ✅ Added featured filter: `?featured=true`
- ✅ Added limit parameter: `?limit=6`
- ✅ Added category filter: `?category=professional`

### Next Config (`next.config.ts`)
- ✅ Image optimization settings
- ✅ Compression enabled
- ✅ Performance improvements
- ✅ Package import optimization

## 🔧 Configuration

### Environment Variables
Make sure you have these in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Site Configuration
Update site details in `src/lib/seo.ts`:
```typescript
export const siteConfig = {
  name: "Bishnu BK",
  title: "Bishnu BK - Full Stack Developer & Creative Coder",
  url: "https://www.bishnubk.com.np",
  // ... update as needed
};
```

## 📊 API Endpoints

### Projects API
```
GET /api/projects
GET /api/projects?featured=true
GET /api/projects?featured=true&limit=6
GET /api/projects?category=professional
GET /api/projects?category=personal&limit=10
```

### Blog API
```
GET /api/blog
GET /api/blog?published=true
```

## 🎯 Usage Examples

### Marking a Project as Featured
```typescript
// In your dashboard or admin panel
await supabase
  .from('projects')
  .update({ is_featured: true })
  .eq('id', projectId);
```

### Fetching Featured Projects
```typescript
const response = await fetch('/api/projects?featured=true&limit=6');
const featuredProjects = await response.json();
```

## 🌐 Page Structure

```
/                          - Homepage with featured content
├── /projects              - Projects hub (NEW)
│   ├── /professional      - Professional projects
│   ├── /personal          - Personal projects
│   └── /[id]              - Individual project
├── /blog                  - Blog listing
│   └── /[slug]            - Individual blog post
├── /dashboard             - Admin dashboard
└── /contact               - Contact page
```

## ✅ Testing Checklist

- [ ] Homepage loads with featured projects (max 6)
- [ ] Homepage shows latest blog posts (max 3)
- [ ] Projects hub page displays both categories
- [ ] Professional projects page works
- [ ] Personal projects page works
- [ ] Blog page displays all posts
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Meta tags visible in page source
- [ ] Open Graph preview works (use [OpenGraph.xyz](https://www.opengraph.xyz/))
- [ ] Twitter Card preview works
- [ ] Mobile responsive design
- [ ] Fast page load times

## 🚀 Deployment

### Before Deploying
1. ✅ Run database migration
2. ✅ Mark projects as featured
3. ✅ Create OG image
4. ✅ Test locally
5. ✅ Check all links work

### After Deploying
1. Submit sitemap to Google Search Console
2. Test all pages in production
3. Check mobile responsiveness
4. Run Lighthouse audit
5. Monitor Google Search Console for errors

## 📈 Performance Tips

1. **Images**: Always use Next.js Image component
2. **Lazy Loading**: Components load on demand
3. **Code Splitting**: Automatic with Next.js
4. **Caching**: API responses cached appropriately
5. **Compression**: Enabled in next.config.ts

## 🎨 Customization

### Change Featured Project Count
In `src/components/FeaturedProjects.tsx`:
```typescript
const response = await fetch("/api/projects?featured=true&limit=9"); // Change 6 to 9
```

### Change Featured Blog Count
In `src/components/FeaturedBlogs.tsx`:
```typescript
const featuredBlogs = blogs.slice(0, 6); // Change 3 to 6
```

### Update SEO Metadata
Edit `src/lib/seo.ts` to update site-wide SEO settings.

## 🐛 Troubleshooting

### Featured Projects Not Showing
1. Check database has `is_featured` column
2. Verify projects are marked as featured
3. Check API endpoint: `/api/projects?featured=true`

### Sitemap Not Generating
1. Ensure API endpoints are accessible
2. Check `src/app/sitemap.ts` for errors
3. Verify base URL is correct

### Images Not Loading
1. Add domain to `next.config.ts` images.domains
2. Check image URLs are valid
3. Verify Supabase storage permissions

## 📚 Resources

- [SEO_OPTIMIZATION.md](./SEO_OPTIMIZATION.md) - Complete SEO guide
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Search Console](https://search.google.com/search-console)

## 🎉 You're All Set!

Your portfolio now has:
- ✅ Featured projects section
- ✅ Featured blog section
- ✅ Organized projects page
- ✅ Comprehensive SEO optimization
- ✅ Better performance
- ✅ Improved user experience

Happy coding! 🚀
