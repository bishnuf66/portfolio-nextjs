import axios from "axios";
import { supabase } from "./supabase";

// Axios instance configured to send cookies to Next.js API routes
export const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
});
