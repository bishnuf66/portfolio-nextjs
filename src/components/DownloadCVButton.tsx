"use client";

import React from "react";
import { Download, Eye, FileText, Loader2 } from "lucide-react";
import useStore from "@/store/store";
import { useActiveCV } from "@/hooks/useCV";

const DownloadCVButton = () => {
  const { isDarkMode } = useStore();
  const { data: activeCV, isLoading: loading, error } = useActiveCV();

  if (loading) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${isDarkMode
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  if (error || !activeCV) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${isDarkMode
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
      >
        <FileText className="w-4 h-4" />
        CV Not Available
      </button>
    );
  }

  const handleCVClick = () => {
    import("@/lib/analytics").then(({ trackSectionInteraction }) => {
      trackSectionInteraction("cv-download", "click", {
        cvId: activeCV?.id,
        filename: activeCV?.original_filename,
        source: "download-button"
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
      <button
        type="button"
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${isDarkMode
          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/50"
          : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-green-500/50"
          }`}
      >
        <Eye className="w-4 h-4" />
        View CV
      </button>
    </a>
  );
};

export default DownloadCVButton;
