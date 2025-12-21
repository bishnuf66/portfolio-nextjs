# ISR (Incremental Static Regeneration) Setup Guide

This document explains the ISR implementation for your Next.js portfolio application.

## Overview

ISR has been implemented for the following pages:
- **Home page** (`/`) - Revalidates every 1 hour
- **Blog list** (`/blog`) - Revalidates every 1 hour
- **Blog detail** (`/blog/[slug]`) - Revalidates every 1 hour with static generation
- **Projects list** (`/projects`) - Revalidates every 1 hour
- **Project detail** (`/projects/[id]`) - Revalidates every 1 hour with static generation

## How It Works

### 1. Static Generation with ISR

Pages are pre-rendered at build time and revalidated on-demand when data changes:

```typescript
export const revalidate = 3600; // Revalidate every hour (in seconds)
```

### 2. Automatic Revalidation on Data Changes

When you create, update, or delete data through the API, the affected pages are automatically revalidated:

#### Projects
- **Create**: Revalidates `/` and `/projects`
- **Update**: Revalidates `/`, `/projects`, and `/projects/[id]`
- **Delete**: Revalidates `/`, `/projects`, and `/projects/[id]`

#### Blogs
- **Create**: Revalidates `/` and `/blog`
- **Update**: Revalidates `/`, `/blog`, and `/blog/[slug]`
- **Delete**: Revalidates `/`, `/blog`, and `/blog/[slug]`

### 3. Static Params Generation

For dynamic routes, static params are generated at build time:

```typescript
export async function generateStaticParams() {
  // Fetch all IDs/slugs from database
  // Pre-render pages for each ID/slug
}
```

## API Endpoints

### Revalidation Endpoint

**POST** `/api/revalidate`

Manually trigger revalidation with a secret token:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: your-secure-revalidation-secret-key-change-in-production" \
  -d '{
    "type": "blog",
    "path": "my-blog-slug"
  }'
```

**Parameters:**
- `type`: `"home"`, `"blog"`, `"project"`, or `"all"`
- `path`: (optional) Specific blog slug or project ID to revalidate

**Response:**
```json
{
  "revalidated": true,
  "paths": ["/blog", "/blog/my-blog-slug"]
}
```

### Blog API Routes

- **GET** `/api/blogs` - Fetch all blogs
- **POST** `/api/blogs` - Create a new blog (auto-revalidates)
- **GET** `/api/blogs/[slug]` - Fetch a specific blog
- **PUT** `/api/blogs/[slug]` - Update a blog (auto-revalidates)
- **DELETE** `/api/blogs/[slug]` - Delete a blog (auto-revalidates)

### Project API Routes

- **GET** `/api/projects` - Fetch all projects
- **POST** `/api/projects` - Create a new project (auto-revalidates)
- **GET** `/api/projects/[id]` - Fetch a specific project
- **PUT** `/api/projects/[id]` - Update a project (auto-revalidates)
- **DELETE** `/api/projects/[id]` - Delete a project (auto-revalidates)

## Environment Variables

Add to your `.env` file:

```env
# ISR Revalidation Secret (change this to a secure random string in production)
REVALIDATE_SECRET=your-secure-revalidation-secret-key-change-in-production
```

**Important**: Change this to a strong, random secret in production!

## Benefits

1. **Fast Page Loads**: Pages are pre-rendered and served as static HTML
2. **Fresh Content**: Pages are automatically updated when data changes
3. **SEO Friendly**: Static pages are better for search engines
4. **Reduced Server Load**: No need to render pages on every request
5. **Fallback Support**: New pages are generated on-demand if not pre-rendered

## Revalidation Timing

- **Scheduled**: Pages revalidate every 1 hour (3600 seconds)
- **On-Demand**: Pages revalidate immediately when data is modified through the API
- **Manual**: Use the `/api/revalidate` endpoint to manually trigger revalidation

## Build Time Considerations

During build time:
1. All blog posts with `published: true` are pre-rendered
2. All projects are pre-rendered
3. The home page is pre-rendered

This means your build time may increase slightly, but the performance benefit is significant.

## Monitoring

To monitor revalidation:
1. Check Next.js build logs for static generation details
2. Monitor API response times for revalidation endpoints
3. Use Next.js analytics to track page performance

## Troubleshooting

### Pages not updating after changes

1. Verify the API route is being called correctly
2. Check that `revalidatePath()` is being called in the API route
3. Ensure the `REVALIDATE_SECRET` matches in your requests
4. Check Next.js logs for any errors

### Build time too long

If your build takes too long:
1. Consider increasing the `revalidate` time (e.g., 7200 for 2 hours)
2. Limit the number of static params generated
3. Use incremental static regeneration for less critical pages

### Memory issues during build

If you encounter memory issues:
1. Reduce the number of items fetched in `generateStaticParams()`
2. Implement pagination for large datasets
3. Consider using dynamic rendering for less critical pages

## Next Steps

1. Update `REVALIDATE_SECRET` in production
2. Test the revalidation endpoints
3. Monitor page performance and adjust revalidation times as needed
4. Consider implementing webhooks from your CMS to trigger revalidation
