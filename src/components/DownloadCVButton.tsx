import React from "react";
import useStore from "@/store/store";

const DownloadCVButton = () => {
  const { isDarkMode } = useStore();
  return (
    <a
      href="/assets/Bishnu-Bk-CV.pdf" // Path to your CV file in the public folder
      download="Bishnu_CV.pdf" // The name the file will be downloaded as
      target="_blank" // Optional: Opens in a new tab before download
      rel="noopener noreferrer"
    >
      <button
        type="submit"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Download CV
      </button>
    </a>
  );
};

export default DownloadCVButton;
