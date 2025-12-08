"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { useCreateTestimonial } from "@/hooks/useTestimonials";
import withAuth from "@/components/withAuth";
import TestimonialFormPage from "@/components/dashboard/TestimonialFormPage";

const AddTestimonialPage = () => {
    const router = useRouter();
    const { isDarkMode } = useStore();
    const createTestimonial = useCreateTestimonial();
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (testimonialData: any) => {
        setUploading(true);
        try {
            await createTestimonial.mutateAsync(testimonialData);
            router.push("/dashboard?tab=testimonials");
        } catch (error) {
            console.error("Failed to create testimonial:", error);
            alert("Failed to create testimonial");
        } finally {
            setUploading(false);
        }
    };

    return (
        <TestimonialFormPage
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard?tab=testimonials")}
            uploading={uploading}
            isDarkMode={isDarkMode}
        />
    );
};

export default withAuth(AddTestimonialPage);
