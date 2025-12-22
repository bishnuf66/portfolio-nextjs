# Stale Cache and Filtering Issues - Fixed

## Problem Summary
1. **Projects disappearing when clicking filter tabs** - Race conditions and improper state management
2. **Stale data showing in frontend** - Frontend not reflecting database updates
3. **Incorrect counts in tabs** - Frontend filtering showing wrong numbers
4. **Pagination/sorting/filtering not working properly** - Frontend filtering conflicting with backend data

## Root Causes
1. **Frontend filtering** - Projects page and dashboard were filtering data on the frontend instead of using backend API
2. **No loading states** - UI showed empty state during API calls, making cards "disappear"
3. **Aggressive caching** - React Query cache was too aggressive (30s staleTime)
4. **Missing query invalidation** - Mutations weren't invalidating all relevant query keys
5. **Race conditions** - Multiple API calls happening simultaneously causing inconsistent state

## Solutions Implemented

### 1. Backend Filtering & Pagination
**Files Modified:**
- `src/app/projects/page.tsx`
- `src/components/dashboard/projects/ProjectList.tsx`
- `src/hooks/useProjects.ts`
- `src/app/api/projects/route.ts`

**Changes:**
- Replaced frontend filtering with backend API filtering
- Added `useProjectsFiltered()` hook for paginated, filtered data
- Added `useProjectCounts()` hook for accurate category counts
- Updated API route to handle `featured=false` parameter
- Added support for `category` sorting in API

### 2. Proper Loading States
**Files Modified:**
- `src/app/projects/page.tsx`
- `src/components/dashboard/projects/ProjectList.tsx`

**Changes:**
- Added loading skeletons during data fetch
- Added error states with retry buttons
- Added loading indicators for counts ("...")
- Prevented cards from disappearing by showing loading state

### 3. State Management Improvements
**Files Modified:**
- `src/app/projects/page.tsx`
- `src/components/dashboard/projects/ProjectList.tsx`

**Changes:**
- Reset to page 1 when filters change
- Reset to page 1 when search changes
- Reset to page 1 when items per page changes
- Reset to page 1 when tab/category changes
- Proper handler functions for all state changes

### 4. React Query Cache Configuration
**Files Modified:**
- `src/hooks/useProjects.ts`
- `src/components/QueryProvider.tsx`

**Changes:**
- Set `staleTime: 0` for projects queries (always fetch fresh data)
- Set `gcTime: 5 minutes` (keep in cache for 5 minutes)
- Added `refetchOnWindowFocus: true`
- Added `refetchOnMount: true`
- Invalidate all query keys on mutations:
  - `["projects"]`
  - `["projects", "featured"]`
  - `["projects", "filtered"]`
  - `["projects", "counts"]`

### 5. Dashboard Updates
**Files Modified:**
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/projects/ProjectList.tsx`

**Changes:**
- Removed `projects` prop from ProjectList (now fetches its own data)
- Added backend filtering for category, featured status, search
- Added proper pagination with backend support
- Added loading and error states

## API Enhancements

### GET /api/projects
**Query Parameters:**
- `category` - Filter by "professional" or "personal"
- `search` - Search in name, description, tech_stack
- `sortBy` - Sort by "name", "created_at", "is_featured", or "category"
- `sortOrder` - "asc" or "desc"
- `page` - Page number for pagination
- `limit` - Items per page
- `featured` - Filter by featured status ("true" or "false")

**Response:**
```typescript
{
  data: Project[],
  pagination: {
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalItems: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

## New React Query Hooks

### useProjectsFiltered(params)
Fetches projects with backend filtering and pagination.

**Parameters:**
```typescript
{
  category?: "all" | "professional" | "personal",
  search?: string,
  sortBy?: "name" | "created_at" | "is_featured" | "category",
  sortOrder?: "asc" | "desc",
  page?: number,
  limit?: number,
  featured?: boolean
}
```

### useProjectCounts()
Fetches accurate counts for all categories.

**Returns:**
```typescript
{
  all: number,
  professional: number,
  personal: number,
  featured: number
}
```

## Testing Checklist

### Projects Page (/projects)
- [ ] Tabs show correct counts immediately
- [ ] Clicking tabs filters projects correctly
- [ ] Search filters projects in real-time
- [ ] Sorting works (name, date, featured)
- [ ] Pagination works correctly
- [ ] Items per page selector works
- [ ] No cards disappear during filtering
- [ ] Loading skeletons show during fetch
- [ ] Stats bar shows correct counts

### Dashboard (/dashboard)
- [ ] Projects list shows all projects
- [ ] Category filter works (all/professional/personal)
- [ ] Featured filter works (all/featured/not-featured)
- [ ] Search works across name, description, tech stack, slug
- [ ] Sorting works (name, date, category, featured)
- [ ] Pagination works correctly
- [ ] Edit/Delete buttons work
- [ ] Loading state shows during fetch
- [ ] Counts update after mutations

### Data Consistency
- [ ] Updating `is_featured` in dashboard reflects immediately
- [ ] Deleting project removes it from all views
- [ ] Creating project adds it to all views
- [ ] Featured projects show in homepage
- [ ] Counts match actual database values

## Performance Improvements
1. **Reduced bundle size** - No longer loading all projects on every page
2. **Faster page loads** - Pagination reduces data transfer
3. **Better UX** - Loading states prevent confusion
4. **Optimistic updates** - Immediate UI feedback on mutations
5. **Efficient caching** - Only cache what's needed, invalidate properly

## Breaking Changes
- `ProjectList` component no longer accepts `projects` prop
- Projects page now requires backend API for filtering
- Dashboard now requires backend API for filtering

## Migration Notes
If you have other components using the old `useProjects()` hook with frontend filtering:
1. Switch to `useProjectsFiltered()` for filtered data
2. Add loading and error states
3. Handle pagination from backend
4. Remove frontend filtering logic
