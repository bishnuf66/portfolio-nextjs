import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";

export async function POST(request: NextRequest) {
    try {
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

        // Create authenticated client for RLS
        const authenticatedSupabase = createAuthenticatedClient(token);

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 },
            );
        }

        // Validate file type
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are allowed" },
                { status: 400 },
            );
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size must be less than 10MB" },
                { status: 400 },
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `cv_${timestamp}_${
            file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        }`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } =
            await authenticatedSupabase.storage
                .from("uploads")
                .upload(`cv/${filename}`, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

        if (uploadError) {
            console.error("File upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload file" },
                { status: 500 },
            );
        }

        // Get public URL
        const { data: urlData } = authenticatedSupabase.storage
            .from("uploads")
            .getPublicUrl(`cv/${filename}`);

        if (!urlData?.publicUrl) {
            return NextResponse.json(
                { error: "Failed to get file URL" },
                { status: 500 },
            );
        }

        // Save CV document record to database
        const { data: cvDocument, error: dbError } = await authenticatedSupabase
            .from("cv_documents")
            .insert({
                filename: filename,
                original_filename: file.name,
                file_url: urlData.publicUrl,
                file_size: file.size,
                mime_type: file.type,
                is_active: false, // New uploads are not active by default
            })
            .select()
            .single();

        if (dbError) {
            console.error("Database insert error:", dbError);

            // Clean up uploaded file if database insert fails
            await authenticatedSupabase.storage
                .from("uploads")
                .remove([`cv/${filename}`]);

            return NextResponse.json(
                { error: "Failed to save CV document" },
                { status: 500 },
            );
        }

        return NextResponse.json(cvDocument);
    } catch (error) {
        console.error("CV upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
