import axios from "axios";

// Create axios instance with default configuration
export const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // This enables sending cookies for authentication
});

// Optional: Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access - redirect to login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);
