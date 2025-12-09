# Content Seeding Script

This script seeds your database with sample testimonials and blog posts.

## Prerequisites

Make sure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** You need the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) to bypass RLS policies when seeding.

## What Gets Seeded

### Testimonials (4 items)
- Sarah Chen - Senior Product Manager at TechCorp Inc
- Michael Rodriguez - CTO at StartupHub
- Emily Thompson - Founder & CEO at DesignFlow Studio
- David Park - Lead Developer at CloudSystems

All testimonials are:
- Published and ready to display
- Rated 5 stars
- Include realistic professional feedback

### Blog Posts (4 items)
1. **Building Scalable Web Applications with Next.js 14**
   - Topics: Next.js, React, App Router, Server Components
   
2. **Mastering TypeScript: Advanced Patterns and Techniques**
   - Topics: TypeScript, Generics, Conditional Types, Utility Types
   
3. **The Future of Web Development: Trends to Watch in 2024**
   - Topics: AI Tools, Edge Computing, WebAssembly, Developer Experience
   
4. **Optimizing React Performance: A Comprehensive Guide**
   - Topics: Code Splitting, Memoization, Virtual Scrolling, Bundle Optimization

All blog posts are:
- Published and ready to display
- Include rich HTML content with headings, lists, and code examples
- Tagged with relevant topics
- Authored by "Tech Insights"

## How to Run

```bash
npm run seed
```

or

```bash
node scripts/seed-content.js
```

## Output

The script will show progress as it seeds:

```
🌱 Starting content seeding...

📝 Seeding testimonials...
✅ Seeded testimonial: Sarah Chen
✅ Seeded testimonial: Michael Rodriguez
✅ Seeded testimonial: Emily Thompson
✅ Seeded testimonial: David Park

📚 Seeding blog posts...
✅ Seeded blog: Building Scalable Web Applications with Next.js 14
✅ Seeded blog: Mastering TypeScript: Advanced Patterns and Techniques
✅ Seeded blog: The Future of Web Development: Trends to Watch in 2024
✅ Seeded blog: Optimizing React Performance: A Comprehensive Guide

✨ Content seeding completed!

🎉 All done!
```

## Notes

- The script will skip items that already exist (based on slug uniqueness)
- If you see errors, check that your database tables have the correct schema
- You can run this script multiple times safely
- To clear existing data before seeding, delete records from the dashboard first

## Customization

Feel free to edit `scripts/seed-content.js` to:
- Add more testimonials or blog posts
- Change the content to match your style
- Adjust ratings, tags, or other fields
- Add avatar images for testimonials
- Add cover images for blog posts
