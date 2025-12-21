import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";

export async function GET(request: NextRequest) {
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

        // Fetch all CV documents ordered by upload date (newest first)
        const { data: cvDocuments, error } = await authenticatedSupabase
            .from("cv_documents")
            .select("*")
            .order("uploaded_at", { ascending: false });

        if (error) {
            console.error("Error fetching CV documents:", error);
            return NextResponse.json(
                { error: "Failed to fetch CV documents" },
                { status: 500 },
            );
        }

        return NextResponse.json(cvDocuments || []);
    } catch (error) {
        console.error("CV fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
