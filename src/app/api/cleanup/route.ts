import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { imageUrls } = await request.json();

        if (!Array.isArray(imageUrls)) {
            return NextResponse.json({ error: "Invalid imageUrls array" }, {
                status: 400,
            });
        }

        const deletedImages = [];

        for (const imageUrl of imageUrls) {
            try {
                // Skip blob URLs
                if (imageUrl.startsWith("blob:")) {
                    continue;
                }

                // Extract file path from Supabase URL
                // URL format: https://{project}.supabase.co/storage/v1/object/public/project-images/project-images/{filename}
                const url = new URL(imageUrl);
                const pathParts = url.pathname.split("/");

                // Find the index of 'project-images' bucket name and get everything after it
                const bucketIndex = pathParts.indexOf("project-images");
                if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
                    // Get the path after the bucket name (e.g., "project-images/123456.jpg")
                    const filePath = pathParts.slice(bucketIndex + 1).join("/");

                    if (filePath) {
                        const { error } = await supabase.storage
                            .from("project-images")
                            .remove([filePath]);

                        if (!error) {
                            deletedImages.push(imageUrl);
                        } else {
                            console.error(
                                `Supabase delete error for ${filePath}:`,
                                error,
                            );
                        }
                    }
                }
            } catch (error) {
                console.error(`Failed to delete image: ${imageUrl}`, error);
            }
        }

        return NextResponse.json({
            message: "Cleanup completed",
            deletedImages,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to cleanup images" },
            { status: 500 },
        );
    }
}
