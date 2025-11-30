# Quick Start Guide - Blog & Testimonials

## 🚀 Setup (5 minutes)

### Step 1: Run Database Schema
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database/blog_testimonial_schema.sql`
4. Click "Run"

### Step 2: Verify Storage Buckets
1. Go to Storage in Supabase
2. Confirm these buckets exist and are public:
   - `blog-images`
   - `testimonial-avatars`
   - `project-images`

### Step 3: Start Using!
You're ready to go! 🎉

## 📝 Creating Your First Blog Post

1. Login to your dashboard
2. Click the **"Blogs"** tab
3. Click **"Add Blog Post"**
4. Fill in:
   - Title: "My First Blog Post"
   - Slug: Auto-generated (or customize)
   - Excerpt: "A brief summary..."
   - Content: Your blog content
   - Upload a cover image
   - Author: Your name
   - Tags: "React, Next.js"
   - ✅ Check "Publish immediately"
5. Click **"Add Blog"**
6. Visit `/blog` to see it live!

## 💬 Adding Your First Testimonial

1. In dashboard, click the **"Testimonials"** tab
2. Click **"Add Testimonial"**
3. Fill in:
   - Name: "John Doe"
   - Role: "CEO"
   - Company: "Tech Corp" (optional)
   - Testimonial: "Great work!"
   - Upload avatar (optional)
   - Click stars for rating (1-5)
   - ✅ Check "Publish immediately"
4. Click **"Add Testimonial"**
5. Check your homepage to see it!

## 🎯 Key URLs

- **Blog List**: `/blog`
- **Single Blog**: `/blog/[slug]` (e.g., `/blog/my-first-post`)
- **Dashboard**: `/dashboard`
- **Homepage**: `/` (includes testimonials section)

## 💡 Pro Tips

1. **Slugs**: Keep them short and SEO-friendly (e.g., "react-hooks-guide")
2. **Images**: Optimize before uploading (recommended: 1200x630px for blog covers)
3. **Drafts**: Uncheck "Publish" to save as draft while working
4. **Tags**: Use consistent naming (e.g., always "React" not "react" or "ReactJS")
5. **Testimonials**: 5 stars = excellent, use sparingly for impact

## 🔍 Troubleshooting

**Blog posts not showing?**
- Make sure "Published" is checked
- Check you're logged in to dashboard
- Verify SQL schema ran successfully

**Images not uploading?**
- Check storage buckets exist in Supabase
- Verify buckets are set to public
- Check file size (keep under 5MB)

**Can't access dashboard?**
- Make sure you're logged in
- Check authentication is working

## 📚 Full Documentation

For detailed information, see:
- `BLOG_TESTIMONIAL_SETUP.md` - Complete setup guide
- `FEATURES_SUMMARY.md` - All features overview

## 🎨 Customization

All components support:
- ✅ Dark mode
- ✅ Responsive design
- ✅ Custom styling via Tailwind
- ✅ Loading skeletons

Happy blogging! 📝✨
