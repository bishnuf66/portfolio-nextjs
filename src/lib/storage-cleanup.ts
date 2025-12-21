import { getSupabase } from "@/lib/supabase";

/**
 * Extract file path from Supabase storage URL
 */
function extractFilePathFromUrl(url: string): string | null {
    try {
        // Supabase storage URLs typically follow this pattern:
        // https://[project].supabase.co/storage/v1/object/public/[bucket]/[filepath]
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");

        // Find the bucket and file path
        const publicIndex = pathParts.indexOf("public");
        if (publicIndex !== -1 && pathParts.length > publicIndex + 2) {
            // Everything after /public/[bucket]/ is the file path
            return pathParts.slice(publicIndex + 2).join("/");
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Delete a single image from Supabase storage
 */
export async function deleteImageFromStorage(
    imageUrl: string,
    bucket: string = "project-images",
): Promise<{ success: boolean; error?: string }> {
    try {
        const filePath = extractFilePathFromUrl(imageUrl);

        if (!filePath) {
            return {
                success: false,
                error: "Could not extract file path from URL",
            };
        }

        const { error } = await getSupabase().storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Delete multiple images from Supabase storage
 */
export async function deleteImagesFromStorage(
    imageUrls: string[],
    bucket: string = "project-images",
): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const url of imageUrls) {
        const result = await deleteImageFromStorage(url, bucket);
        if (!result.success && result.error) {
            errors.push(`Failed to delete ${url}: ${result.error}`);
        }
    }

    return {
        success: errors.length === 0,
        errors,
    };
}

/**
 * Clean up all images associated with a project
 */
export async function cleanupProjectImages(project: {
    cover_image_url?: string;
    gallery_images?: string[];
    gallery_images_with_titles?: Array<{ url: string; title: string }>;
}): Promise<{ success: boolean; errors: string[] }> {
    const imagesToDelete: string[] = [];

    // Add cover image
    if (project.cover_image_url) {
        imagesToDelete.push(project.cover_image_url);
    }

    // Add gallery images (legacy format)
    if (project.gallery_images) {
        imagesToDelete.push(...project.gallery_images);
    }

    // Add gallery images with titles (new format)
    if (project.gallery_images_with_titles) {
        const galleryUrls = project.gallery_images_with_titles.map((img) =>
            img.url
        );
        imagesToDelete.push(...galleryUrls);
    }

    // Remove duplicates
    const uniqueImages = [...new Set(imagesToDelete)];

    if (uniqueImages.length === 0) {
        return { success: true, errors: [] };
    }

    return await deleteImagesFromStorage(uniqueImages);
}
