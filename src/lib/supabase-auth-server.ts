import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export function createAuthenticatedClient(accessToken: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase environment variables are not set");
    }

    return createClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        },
    );
}
