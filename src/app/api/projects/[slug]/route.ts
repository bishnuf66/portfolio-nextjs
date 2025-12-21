import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { supabasePublic } from "@/lib/supabase-public";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";
import { rateLimit } from "@/lib/rate-limit";
import { validateProjectData } from "@/lib/validation";
import { cleanupProjectImages } from "@/lib/storage-cleanup";
import { Database } from "@/lib/database.types";

type ProjectUpdateData = Database["public"]["Tables"]["projects"]["Update"];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;

        const { data, error } = await supabasePublic()
            .from("projects")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch project" },
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

        // Rate limiting: 20 updates per minute per user
        const rateLimitResult = rateLimit(`update-project:${user.id}`, {
            interval: 60000,
            maxRequests: 20,
        });

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: "Too many requests. Please try again later.",
                    resetTime: rateLimitResult.resetTime,
                },
                { status: 429 },
            );
        }

        const body = await request.json();

        // Validate input data
        const validation = validateProjectData(body);
        if (!validation.valid) {
            console.log(
                "Validation failed for project update:",
                validation.errors,
            );
            console.log("Received data:", body);
            return NextResponse.json(
                { error: "Validation failed", details: validation.errors },
                { status: 400 },
            );
        }

        // Create an authenticated client with the user's token for RLS
        const authenticatedSupabase = createAuthenticatedClient(token);

        // Update the project with proper typing
        const { data, error } = await authenticatedSupabase
            .from("projects")
            .update<ProjectUpdateData>(body)
            .eq("slug", slug)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: "Project not found" }, {
                status: 404,
            });
        }

        // Revalidate pages after updating project
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath(`/projects/${slug}`);

        return NextResponse.json(data[0]);
    } catch {
        return NextResponse.json(
            { error: "Failed to update project" },
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
        console.log("DELETE request received for project:", slug);

        // Get the authorization header
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("No authorization header found");
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

        console.log("Auth check result:", { user: user?.email, authError });

        if (authError || !user) {
            console.log("Authentication failed:", authError?.message);
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        console.log("User authenticated, proceeding with delete");

        // Rate limiting: 10 deletes per minute per user
        const rateLimitResult = rateLimit(`delete-project:${user.id}`, {
            interval: 60000,
            maxRequests: 10,
        });

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: "Too many requests. Please try again later.",
                    resetTime: rateLimitResult.resetTime,
                },
                { status: 429 },
            );
        }

        // Create an authenticated client with the user's token for RLS
        const authenticatedSupabase = createAuthenticatedClient(token);

        // First, get the project data to clean up associated images
        const { data: project, error: fetchError } = await authenticatedSupabase
            .from("projects")
            .select(
                "cover_image_url, gallery_images, gallery_images_with_titles",
            )
            .eq("slug", slug)
            .single();

        if (fetchError) {
            console.error("Error fetching project for cleanup:", fetchError);
            return NextResponse.json({ error: fetchError.message }, {
                status: 500,
            });
        }

        // Delete the project from database first
        const { error: deleteError } = await authenticatedSupabase
            .from("projects")
            .delete()
            .eq("slug", slug);

        if (deleteError) {
            console.error("Delete error:", deleteError);
            return NextResponse.json({ error: deleteError.message }, {
                status: 500,
            });
        }

        console.log("Project deleted from database successfully");

        // Clean up associated images from storage
        if (project) {
            // Convert the Json type to the expected array type
            const projectForCleanup = {
                cover_image_url: project.cover_image_url ?? undefined,
                gallery_images: project.gallery_images ?? undefined,
                gallery_images_with_titles:
                    Array.isArray(project.gallery_images_with_titles)
                        ? project.gallery_images_with_titles as Array<
                            { url: string; title: string }
                        >
                        : undefined,
            };

            const cleanupResult = await cleanupProjectImages(projectForCleanup);
            if (!cleanupResult.success) {
                console.warn(
                    "Some images could not be deleted from storage:",
                    cleanupResult.errors,
                );
                // Don't fail the request if storage cleanup fails, just log it
            } else {
                console.log(
                    "All project images cleaned up from storage successfully",
                );
            }
        }

        // Revalidate pages after deleting project
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath(`/projects/${slug}`);

        return NextResponse.json({
            message: "Project deleted successfully",
            storageCleanup: project ? "completed" : "skipped",
        });
    } catch (error) {
        console.error("Delete catch error:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 },
        );
    }
}
