import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
    try {
        // Verify the secret token
        const secret = request.headers.get("x-revalidate-secret");
        if (secret !== REVALIDATE_SECRET) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { type, path, tag } = body;

        if (!type) {
            return NextResponse.json(
                { error: "Missing type parameter" },
                { status: 400 },
            );
        }

        // Revalidate based on type
        switch (type) {
            case "home":
                revalidatePath("/");
                return NextResponse.json({ revalidated: true, path: "/" });

            case "blog":
                if (path) {
                    // Revalidate specific blog post
                    revalidatePath(`/blog/${path}`);
                }
                // Always revalidate blog list
                revalidatePath("/blog");
                return NextResponse.json({
                    revalidated: true,
                    paths: ["/blog", `/blog/${path}`],
                });

            case "project":
                if (path) {
                    // Revalidate specific project
                    revalidatePath(`/projects/${path}`);
                }
                // Always revalidate projects list
                revalidatePath("/projects");
                return NextResponse.json({
                    revalidated: true,
                    paths: ["/projects", `/projects/${path}`],
                });

            case "all":
                // Revalidate all pages
                revalidatePath("/");
                revalidatePath("/blog");
                revalidatePath("/projects");
                return NextResponse.json({
                    revalidated: true,
                    paths: ["/", "/blog", "/projects"],
                });

            default:
                return NextResponse.json(
                    { error: "Invalid type parameter" },
                    { status: 400 },
                );
        }
    } catch (error) {
        console.error("Revalidation error:", error);
        return NextResponse.json(
            { error: "Revalidation failed" },
            { status: 500 },
        );
    }
}
