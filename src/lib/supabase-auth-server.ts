import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export function createAuthenticatedClient(accessToken: string) {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        },
    );
}
