# Blog & Testimonial Features Setup Guide

This guide will help you set up the new blog and testimonial features in your portfolio.

## Database Setup

### 1. Run the SQL Schema

Execute the SQL file to create the necessary tables and storage buckets:

```sql
-- Run this in your Supabase SQL Editor
-- File: database/blog_testimonial_schema.sql
```

This will create:
- `blogs` table with fields: id, title, slug, excerpt, content, cover_image_url, author, tags, published, created_at, updated_at
- `testimonials` table with fields: id, name, role, company, content, avatar_url, rating, published, created_at, updated_at
- Storage buckets: `blog-images` and `testimonial-avatars`
- Row Level Security (RLS) policies for both tables
- Storage policies for authenticated uploads

### 2. Verify Storage Buckets

Go to Supabase Dashboard → Storage and verify these buckets exist:
- `project-images` (existing)
- `blog-images` (new)
- `testimonial-avatars` (new)

All buckets should be set to **public**.

## Features Overview

### Blog System

#### Public Pages
- **Blog List Page**: `/blog` - Shows all published blog posts with cover images, excerpts, tags, and author info
- **Single Blog Page**: `/blog/[slug]` - Displays full blog post with formatted content

#### Dashboard Management
Access via Dashboard → Blogs tab:
- Create new blog posts
- Edit existing posts
- Delete posts
- Upload cover images
- Add tags (comma-separated)
- Toggle publish status (draft/published)
- Auto-generate slugs from titles

#### Features
- Rich text content support
- Cover image uploads
- Tag system for categorization
- Author attribution
- Draft/Published status
- SEO-friendly slugs
- Responsive design
- Loading skeletons

### Testimonial System

#### Public Display
- Testimonials section on homepage (after projects, before contact)
- Shows published testimonials only
- Star ratings (1-5)
- Avatar images with fallback to initials
- Company and role information

#### Dashboard Management
Access via Dashboard → Testimonials tab:
- Add new testimonials
- Edit existing testimonials
- Delete testimonials
- Upload avatar images
- Set star ratings (1-5)
- Toggle publish status
- Add company information (optional)

#### Features
- 5-star rating system
- Avatar image uploads with fallback
- Company attribution (optional)
- Draft/Published status
- Responsive card layout
- Loading skeletons

### Loading Skeletons

All pages now include beautiful loading skeletons:
- Project cards
- Blog cards
- Testimonial cards
- Blog detail page
- Dashboard items

## Usage Guide

### Creating a Blog Post

1. Go to Dashboard → Blogs tab
2. Click "Add Blog Post"
3. Fill in the form:
   - **Title**: Your blog post title (slug auto-generates)
   - **Slug**: URL-friendly identifier (e.g., "my-first-post")
   - **Excerpt**: Short summary (shown on blog list page)
   - **Content**: Full blog post content
   - **Cover Image**: Upload a featured image
   - **Author**: Your name
   - **Tags**: Comma-separated (e.g., "React, Next.js, TypeScript")
   - **Publish**: Check to publish immediately, uncheck for draft
4. Click "Add Blog" to save

### Adding a Testimonial

1. Go to Dashboard → Testimonials tab
2. Click "Add Testimonial"
3. Fill in the form:
   - **Name**: Person's name
   - **Role**: Their job title
   - **Company**: Company name (optional)
   - **Testimonial**: The testimonial text
   - **Avatar Image**: Upload their photo (optional)
   - **Rating**: Click stars to set rating (1-5)
   - **Publish**: Check to show on homepage
4. Click "Add Testimonial" to save

## Navigation

The header now includes a "Blog" link that takes users to `/blog`.

## API Endpoints

### Existing
- `GET /api/projects` - Fetch all projects
- `POST /api/upload` - Upload images (now supports multiple buckets)

### New (via Supabase)
- Blogs: Managed through `useBlogs`, `useCreateBlog`, `useUpdateBlog`, `useDeleteBlog` hooks
- Testimonials: Managed through `useTestimonials`, `useCreateTestimonial`, `useUpdateTestimonial`, `useDeleteTestimonial` hooks

## File Structure

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx              # Blog list page
│   │   └── [slug]/
│   │       └── page.tsx          # Single blog page
│   ├── dashboard/
│   │   └── page.tsx              # Updated with blog & testimonial tabs
│   └── api/
│       └── upload/
│           └── route.ts          # Updated to support multiple buckets
├── components/
│   ├── dashboard/
│   │   ├── BlogManager.tsx       # Blog management component
│   │   └── TestimonialManager.tsx # Testimonial management component
│   ├── LoadingSkeleton.tsx       # All loading skeleton components
│   ├── Testimonials.tsx          # Testimonials section for homepage
│   └── Header.tsx                # Updated with blog link
├── hooks/
│   ├── useBlogs.ts               # Blog CRUD hooks
│   └── useTestimonials.ts        # Testimonial CRUD hooks
├── types/
│   └── blog.ts                   # Blog & Testimonial types
└── database/
    └── blog_testimonial_schema.sql # Database schema
```

## Styling

All components use:
- Tailwind CSS for styling
- Dark mode support via `useStore` hook
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Consistent color scheme with existing design

## Security

- Row Level Security (RLS) enabled on all tables
- Only authenticated users can create/edit/delete
- Public users can only view published content
- Storage buckets have proper access policies

## Tips

1. **SEO-Friendly Slugs**: Slugs are auto-generated from titles but can be customized
2. **Draft Mode**: Use draft status to work on content before publishing
3. **Image Optimization**: Upload optimized images for better performance
4. **Tags**: Use consistent tag names for better organization
5. **Ratings**: Use 5 stars for excellent testimonials, adjust as needed

## Troubleshooting

### Images not uploading
- Check Supabase storage buckets are created and public
- Verify storage policies are set correctly
- Check file size limits

### Blog posts not showing
- Ensure posts are marked as "published"
- Check RLS policies in Supabase
- Verify user is authenticated in dashboard

### Testimonials not appearing
- Ensure testimonials are marked as "published"
- Check that at least one testimonial exists
- Verify RLS policies

## Next Steps

1. Run the SQL schema in Supabase
2. Create your first blog post
3. Add some testimonials
4. Customize the styling to match your brand
5. Add more features as needed (comments, likes, etc.)

Enjoy your new blog and testimonial features! 🎉
