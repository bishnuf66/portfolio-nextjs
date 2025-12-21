import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabase();

        // Fetch the active CV document (public endpoint, no auth required)
        const { data: activeCV, error } = await supabase
            .from("cv_documents")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error || !activeCV) {
            return NextResponse.json(
                { error: "No active CV found" },
                { status: 404 },
            );
        }

        return NextResponse.json(activeCV);
    } catch (error) {
        console.error("Active CV fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
