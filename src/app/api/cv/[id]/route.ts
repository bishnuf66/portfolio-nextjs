import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
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

        // Await the params Promise (Next.js 15 requirement)
        const { id } = await params;

        // Get the CV document to find the file path
        const { data: cvDocument, error: fetchError } =
            await authenticatedSupabase
                .from("cv_documents")
                .select("*")
                .eq("id", id)
                .single();

        if (fetchError || !cvDocument) {
            return NextResponse.json(
                { error: "CV document not found" },
                { status: 404 },
            );
        }

        // Delete the file from storage
        const filePath = `cv/${cvDocument.filename}`;
        const { error: storageError } = await authenticatedSupabase.storage
            .from("uploads")
            .remove([filePath]);

        if (storageError) {
            console.error("Storage deletion error:", storageError);
            // Continue with database deletion even if storage deletion fails
        }

        // Delete the database record
        const { error: deleteError } = await authenticatedSupabase
            .from("cv_documents")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("Database deletion error:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete CV document" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            message: "CV document deleted successfully",
        });
    } catch (error) {
        console.error("CV deletion error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
