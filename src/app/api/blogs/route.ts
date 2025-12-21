import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const published = searchParams.get("published");
        const limit = searchParams.get("limit");

        let query = getSupabase()
            .from("blogs")
            .select("*")
            .order("created_at", { ascending: false });

        // Filter by published status
        if (published === "true") {
            query = query.eq("published", true);
        }

        // Limit results
        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch blogs" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { data, error } = await getSupabase()
            .from("blogs")
            .insert([body])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Revalidate pages after creating blog
        revalidatePath("/");
        revalidatePath("/blog");

        return NextResponse.json(data as Blog, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "Failed to create blog" },
            { status: 500 },
        );
    }
}
