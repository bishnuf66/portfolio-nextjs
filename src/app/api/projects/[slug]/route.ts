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

        // Check if the parameter is a UUID (ID) or a slug
        const isUUID =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                .test(slug);

        let query = supabasePublic()
            .from("projects")
            .select("*");

        if (isUUID) {
            query = query.eq("id", slug);
        } else {
            query = query.eq("slug", slug);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: "Project not found" }, {
                status: 404,
            });
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
        console.log("PUT request received for project:", slug);
        console.log("Update data received:", body);

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

        // Check if the parameter is a UUID (ID) or a slug
        const isUUID =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                .test(slug);

        console.log("Is UUID:", isUUID);
        console.log("Updating project with data:", body);

        let updateQuery = authenticatedSupabase
            .from("projects")
            .update<ProjectUpdateData>(body);

        if (isUUID) {
            updateQuery = updateQuery.eq("id", slug);
            console.log("Updating by ID:", slug);
        } else {
            updateQuery = updateQuery.eq("slug", slug);
            console.log("Updating by slug:", slug);
        }

        const { data, error } = await updateQuery.select();

        console.log("Update result:", { data, error });

        if (error) {
            console.error("Update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data || data.length === 0) {
            console.log("No data returned from update");
            return NextResponse.json({ error: "Project not found" }, {
                status: 404,
            });
        }

        console.log("Update successful, returning:", data[0]);

        // Revalidate pages after updating project
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath(`/projects/${data[0].slug}`);

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
        console.log("Parameter received:", slug);
        console.log(
            "Is UUID:",
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                .test(slug),
        );

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

        // Check if the parameter is a UUID (ID) or a slug
        const isUUID =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                .test(slug);

        // First, get the project data to clean up associated images
        let fetchQuery = authenticatedSupabase
            .from("projects")
            .select(
                "slug, cover_image_url, gallery_images, gallery_images_with_titles",
            );

        if (isUUID) {
            fetchQuery = fetchQuery.eq("id", slug);
            console.log("Querying by ID:", slug);
        } else {
            fetchQuery = fetchQuery.eq("slug", slug);
            console.log("Querying by slug:", slug);
        }

        console.log("Executing fetch query...");
        const { data: project, error: fetchError } = await fetchQuery
            .maybeSingle();

        console.log("Fetch query result:", { project, fetchError });

        if (fetchError) {
            console.error("Error fetching project for cleanup:", fetchError);
            return NextResponse.json({ error: fetchError.message }, {
                status: 500,
            });
        }

        if (!project) {
            console.log("Project not found for deletion:", slug);

            // Let's try to check if the project exists at all (without RLS)
            const { data: publicCheck, error: publicError } =
                await supabasePublic()
                    .from("projects")
                    .select("id, slug")
                    .eq("id", slug)
                    .maybeSingle();

            console.log("Public check result:", { publicCheck, publicError });

            // Let's also check what projects exist in the database
            const { data: allProjects, error: allError } =
                await supabasePublic()
                    .from("projects")
                    .select("id, slug, name")
                    .limit(10);

            console.log("Available projects:", { allProjects, allError });

            // If the project doesn't exist, treat it as already deleted (success)
            return NextResponse.json({
                message: "Project already deleted or not found",
                storageCleanup: "skipped",
            });
        }

        // Delete the project from database first
        let deleteQuery = authenticatedSupabase
            .from("projects")
            .delete();

        if (isUUID) {
            deleteQuery = deleteQuery.eq("id", slug);
        } else {
            deleteQuery = deleteQuery.eq("slug", slug);
        }

        const { error: deleteError } = await deleteQuery;

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
        if (project?.slug) {
            revalidatePath(`/projects/${project.slug}`);
        }

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
