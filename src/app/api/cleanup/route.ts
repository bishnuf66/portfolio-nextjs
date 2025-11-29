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
                // Extract file path from URL
                const url = new URL(imageUrl);
                const filePath = url.pathname.split("/").pop();

                if (filePath) {
                    const { error } = await supabase.storage
                        .from("project-images")
                        .remove([`project-images/${filePath}`]);

                    if (!error) {
                        deletedImages.push(imageUrl);
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
