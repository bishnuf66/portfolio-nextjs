// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated rate limiting service

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    interval: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests allowed in the time window
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { interval: 60000, maxRequests: 10 },
): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;

    if (!store[key] || store[key].resetTime < now) {
        // Initialize or reset the rate limit
        store[key] = {
            count: 1,
            resetTime: now + config.interval,
        };
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetTime: store[key].resetTime,
        };
    }

    if (store[key].count >= config.maxRequests) {
        // Rate limit exceeded
        return {
            success: false,
            remaining: 0,
            resetTime: store[key].resetTime,
        };
    }

    // Increment the count
    store[key].count++;
    return {
        success: true,
        remaining: config.maxRequests - store[key].count,
        resetTime: store[key].resetTime,
    };
}
