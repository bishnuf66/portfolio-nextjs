    import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";
import { rateLimit } from "@/lib/rate-limit";
import { deleteImageFromStorage } from "@/lib/storage-cleanup";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get("url");

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, {
                status: 400,
            });
        }

        // Get the authorization header
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        const token = authHeader.replace("Bearer ", "");

        const supabase = await createClient();

        // Verify the token and get user
        const { data: { user }, error: authError } = await supabase.auth
            .getUser(
                token,
            );

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        // Rate limiting: 30 image deletions per minute per user
        const rateLimitResult = rateLimit(`delete-image:${user.id}`, {
            interval: 60000,
            maxRequests: 30,
        });

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: "Too many requests. Please try again later.",
                    resetTime: rateLimitResult.resetTime,
                },
                { status: 429 },
            );
        }

        // Create an authenticated client with the user's token for RLS
        const authenticatedSupabase = createAuthenticatedClient(token);

        // Get current project data
        const { data: project, error: fetchError } = await authenticatedSupabase
            .from("projects")
            .select("gallery_images, gallery_images_with_titles")
            .eq("id", id)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, {
                status: 500,
            });
        }

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, {
                status: 404,
            });
        }

        // Remove image from both gallery formats
        let updatedGalleryImages = project.gallery_images || [];
        let updatedGalleryImagesWithTitles =
            Array.isArray(project.gallery_images_with_titles)
                ? project.gallery_images_with_titles as {
                    url: string;
                    title: string;
                }[]
                : [];

        // Remove from legacy gallery_images array
        updatedGalleryImages = updatedGalleryImages.filter((url: string) =>
            url !== imageUrl
        );

        // Remove from new gallery_images_with_titles array
        updatedGalleryImagesWithTitles = updatedGalleryImagesWithTitles.filter(
            (img: { url: string; title: string }) => img.url !== imageUrl,
        );

        // Update the project in database
        const { error: updateError } = await authenticatedSupabase
            .from("projects")
            .update({
                gallery_images: updatedGalleryImages,
                gallery_images_with_titles: updatedGalleryImagesWithTitles,
            })
            .eq("id", id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, {
                status: 500,
            });
        }

        // Delete the image from storage
        const storageResult = await deleteImageFromStorage(imageUrl);

        return NextResponse.json({
            message: "Image removed successfully",
            storageDeleted: storageResult.success,
            storageError: storageResult.error || null,
        });
    } catch (error) {
        console.error("Delete image error:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 },
        );
    }
}
