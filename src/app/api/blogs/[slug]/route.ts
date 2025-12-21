import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const { data, error } = await getSupabase()
            .from("blogs")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: "Blog not found" }, {
                status: 404,
            });
        }

        return NextResponse.json(data as Blog);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch blog" },
            { status: 500 },
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const body = await request.json();

        const { data, error } = await getSupabase()
            .from("blogs")
            .update({ ...body, updated_at: new Date().toISOString() })
            .eq("slug", slug)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: "Blog not found" }, {
                status: 404,
            });
        }

        // Revalidate pages after updating blog
        revalidatePath("/");
        revalidatePath("/blog");
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json(data as Blog);
    } catch {
        return NextResponse.json(
            { error: "Failed to update blog" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const { error } = await getSupabase()
            .from("blogs")
            .delete()
            .eq("slug", slug);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Revalidate pages after deleting blog
        revalidatePath("/");
        revalidatePath("/blog");
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json({
            message: "Blog deleted successfully",
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to delete blog" },
            { status: 500 },
        );
    }
}
