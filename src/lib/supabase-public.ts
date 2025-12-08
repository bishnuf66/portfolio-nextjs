import { createClient } from "@supabase/supabase-js";

let supabasePublicInstance: ReturnType<typeof createClient> | null = null;

export const supabasePublic = () => {
    if (supabasePublicInstance) return supabasePublicInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase environment variables are not set");
    }

    supabasePublicInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabasePublicInstance;
};
