import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";

export async function PATCH(
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

        // First, deactivate all CV documents
        const { error: deactivateError } = await authenticatedSupabase
            .from("cv_documents")
            .update({ is_active: false })
            .neq("id", "00000000-0000-0000-0000-000000000000"); // Update all records

        if (deactivateError) {
            console.error("Error deactivating CVs:", deactivateError);
            return NextResponse.json(
                { error: "Failed to deactivate existing CVs" },
                { status: 500 },
            );
        }

        // Then, activate the selected CV
        const { data: activatedCV, error: activateError } =
            await authenticatedSupabase
                .from("cv_documents")
                .update({ is_active: true })
                .eq("id", id)
                .select()
                .single();

        if (activateError) {
            console.error("Error activating CV:", activateError);
            return NextResponse.json(
                { error: "Failed to activate CV document" },
                { status: 500 },
            );
        }

        if (!activatedCV) {
            return NextResponse.json(
                { error: "CV document not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(activatedCV);
    } catch (error) {
        console.error("CV activation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
