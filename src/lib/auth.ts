import { getSupabase } from "@/lib/supabase";

export async function signIn(email: string, password: string) {
    const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signUp(email: string, password: string) {
    const { data, error } = await getSupabase().auth.signUp({
        email,
        password,
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await getSupabase().auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    const { data: { user } } = await getSupabase().auth.getUser();
    return user;
}
