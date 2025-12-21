// Input validation helpers

export function validateProjectData(data: any): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Validate name
    if (!data.name || typeof data.name !== "string") {
        errors.push("Project name is required and must be a string");
    } else if (data.name.length < 3 || data.name.length > 100) {
        errors.push("Project name must be between 3 and 100 characters");
    }

    // Validate URL
    if (!data.url || typeof data.url !== "string") {
        errors.push("Project URL is required and must be a string");
    } else {
        try {
            new URL(data.url);
        } catch {
            errors.push("Project URL must be a valid URL");
        }
    }

    // Validate description
    if (!data.description || typeof data.description !== "string") {
        errors.push("Description is required and must be a string");
    } else if (
        data.description.length < 10 || data.description.length > 10000
    ) {
        errors.push("Description must be between 10 and 1000 characters");
    }

    // Validate tech_stack
    if (!Array.isArray(data.tech_stack)) {
        errors.push("Tech stack must be an array");
    } else if (data.tech_stack.length === 0) {
        errors.push("At least one technology is required");
    } else if (data.tech_stack.length > 20) {
        errors.push("Maximum 20 technologies allowed");
    } else {
        const invalidTechs = data.tech_stack.filter(
            (tech: any) => typeof tech !== "string" || tech.length > 50,
        );
        if (invalidTechs.length > 0) {
            errors.push(
                "Each technology must be a string with max 50 characters",
            );
        }
    }

    // Validate category
    if (
        !data.category || !["professional", "personal"].includes(data.category)
    ) {
        errors.push("Category must be either 'professional' or 'personal'");
    }

    // Validate cover_image_url (optional)
    if (data.cover_image_url && typeof data.cover_image_url !== "string") {
        errors.push("Cover image URL must be a string");
    }

    // Validate gallery_images (optional)
    if (data.gallery_images) {
        if (!Array.isArray(data.gallery_images)) {
            errors.push("Gallery images must be an array");
        } else if (data.gallery_images.length > 10) {
            errors.push("Maximum 10 gallery images allowed");
        } else {
            const invalidImages = data.gallery_images.filter(
                (img: any) => typeof img !== "string",
            );
            if (invalidImages.length > 0) {
                errors.push("Each gallery image must be a string URL");
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

export function sanitizeString(str: string): string {
    // Remove any potential XSS attempts
    return str
        .replace(/[<>]/g, "") // Remove < and >
        .trim();
}
