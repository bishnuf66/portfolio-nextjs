# CV Management System

This feature allows you to upload, manage, and dynamically serve your CV/resume through your portfolio website.

## Features

### For Administrators (Dashboard)
- **Upload CV**: Upload PDF files up to 10MB
- **Multiple CVs**: Store multiple versions of your CV
- **Set Active CV**: Choose which CV is publicly available
- **Preview & Download**: View and download any uploaded CV
- **Delete CVs**: Remove unwanted CV files
- **File Management**: Automatic file naming and storage

### For Visitors (Public)
- **Download CV**: Visitors can download your active CV
- **Always Updated**: The download button automatically uses your latest active CV
- **Fallback Handling**: Graceful handling when no CV is available

## Setup Instructions

### 1. Database Setup
Run the SQL script in your Supabase dashboard:
```sql
-- Copy and paste the contents of scripts/setup-cv-database.sql
-- into your Supabase SQL editor and execute
```

### 2. Storage Setup
Make sure you have a storage bucket named "uploads" in Supabase:
1. Go to Supabase Dashboard → Storage
2. Create a bucket named "uploads" if it doesn't exist
3. Set appropriate permissions for file uploads

### 3. Environment Variables
Ensure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## How to Use

### Dashboard (Admin)
1. Go to your dashboard
2. Click on the "CV Management" tab
3. Upload your CV (PDF only, max 10MB)
4. Set one CV as "Active" - this will be publicly available
5. Manage your CVs (preview, download, delete)

### Frontend (Public)
The `DownloadCVButton` component automatically:
- Fetches your active CV from the database
- Shows a download button if CV is available
- Shows appropriate loading/error states
- Allows visitors to download your current CV

## API Endpoints

### Public Endpoints
- `GET /api/cv/active` - Get the currently active CV (public access)

### Protected Endpoints (Require Authentication)
- `GET /api/cv` - Get all CV documents
- `POST /api/cv/upload` - Upload a new CV
- `PATCH /api/cv/[id]/activate` - Set a CV as active
- `DELETE /api/cv/[id]` - Delete a CV

## File Storage

CVs are stored in Supabase Storage under the `uploads/cv/` directory with the naming pattern:
```
cv_[timestamp]_[sanitized_filename].pdf
```

## Security Features

- **Authentication Required**: Only authenticated users can manage CVs
- **Public Read Access**: Only active CVs are publicly readable
- **File Type Validation**: Only PDF files are accepted
- **File Size Limits**: Maximum 10MB per file
- **Row Level Security**: Database policies ensure proper access control

## Components

### CVManager (`src/components/dashboard/CVManager.tsx`)
- Full CV management interface for dashboard
- Upload, preview, activate, delete functionality
- Progress indicators and error handling

### DownloadCVButton (`src/components/DownloadCVButton.tsx`)
- Public-facing download button
- Automatically fetches active CV
- Handles loading and error states

## Database Schema

```sql
CREATE TABLE cv_documents (
    id UUID PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    is_active BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Benefits

1. **Dynamic Updates**: No need to manually replace files in your codebase
2. **Version Control**: Keep multiple versions of your CV
3. **Easy Management**: Simple dashboard interface
4. **Professional**: Always serve the most up-to-date CV
5. **Secure**: Proper authentication and file validation
6. **User-Friendly**: Clear feedback and error handling

## Troubleshooting

### CV Not Showing
- Check if you have an active CV set in the dashboard
- Verify the database policies are correctly set up
- Ensure the storage bucket exists and has proper permissions

### Upload Failures
- Check file size (must be under 10MB)
- Verify file type (must be PDF)
- Ensure you're authenticated
- Check Supabase storage permissions

### Download Issues
- Verify the active CV exists in the database
- Check if the file URL is accessible
- Ensure proper CORS settings in Supabase