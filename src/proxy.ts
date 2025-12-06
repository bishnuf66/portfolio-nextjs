import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        // Check if there's a Supabase auth token in cookies or localStorage
        // Since we can't access localStorage in middleware, we'll let the client-side handle this
        // But we can add additional headers for security
        const response = NextResponse.next();

        // Add security headers
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set(
            "Referrer-Policy",
            "strict-origin-when-cross-origin",
        );

        return response;
    }

    // Protect API routes that modify data
    if (
        pathname.startsWith("/api/projects") &&
        (request.method === "POST" ||
            request.method === "PUT" ||
            request.method === "DELETE" ||
            request.method === "PATCH")
    ) {
        // Check for Authorization header
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized - No valid authorization header" },
                { status: 401 },
            );
        }

        // Add security headers
        const response = NextResponse.next();
        response.headers.set("X-Content-Type-Options", "nosniff");

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/projects/:path*",
    ],
};
