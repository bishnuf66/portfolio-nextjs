"use client";

import React from "react";
import { Eye, FileText } from "lucide-react";
import { useActiveCV } from "@/hooks/useCV";
import { Button } from "@/components/ui/Button";

const DownloadCVButton = () => {
  const { data: activeCV, isLoading: loading, error } = useActiveCV();

  if (loading) {
    return (
      <Button variant="secondary" size="sm" disabled loading>
        Loading...
      </Button>
    );
  }

  if (error || !activeCV) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        icon={<FileText className="w-4 h-4" />}
      >
        CV Not Available
      </Button>
    );
  }

  const handleCVClick = () => {
    import("@/lib/analytics").then(({ trackSectionInteraction }) => {
      trackSectionInteraction("cv-download", "click", {
        cvId: activeCV?.id,
        filename: activeCV?.original_filename,
        source: "download-button",
      });
    });
  };

  return (
    <a
      href={activeCV.file_url}
      download={activeCV.original_filename}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleCVClick}
    >
      <Button variant="primary" size="md" icon={<Eye className="w-4 h-4" />}>
        View CV
      </Button>
    </a>
  );
};

export default DownloadCVButton;
