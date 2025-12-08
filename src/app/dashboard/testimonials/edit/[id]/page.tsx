"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useStore from "@/store/store";
import { useTestimonials, useUpdateTestimonial } from "@/hooks/useTestimonials";
import withAuth from "@/components/withAuth";
import TestimonialFormPage from "@/components/dashboard/TestimonialFormPage";
import { Testimonial } from "@/types/blog";

const EditTestimonialPage = () => {
  const router = useRouter();
  const params = useParams();
  const { isDarkMode } = useStore();
  const { data: testimonials = [] } = useTestimonials(false);
  const updateTestimonial = useUpdateTestimonial();
  const [uploading, setUploading] = useState(false);
  const [initialData, setInitialData] = useState<Testimonial | null>(null);

  useEffect(() => {
    const testimonial = testimonials.find((t) => t.id === params.id);
    if (testimonial) {
      setInitialData(testimonial);
    }
  }, [testimonials, params.id]);

  const handleSubmit = async (testimonialData: any) => {
    setUploading(true);
    try {
      await updateTestimonial.mutateAsync({
        id: params.id as string,
        testimonialData,
      });
      router.push("/dashboard?tab=testimonials");
    } catch (error) {
      console.error("Failed to update testimonial:", error);
      alert("Failed to update testimonial");
    } finally {
      setUploading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <TestimonialFormPage
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/dashboard?tab=testimonials")}
      uploading={uploading}
      isDarkMode={isDarkMode}
    />
  );
};

export default withAuth(EditTestimonialPage);
