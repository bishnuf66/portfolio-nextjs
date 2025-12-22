"use client";

import React, { useState, useEffect } from "react";
import { MousePointer, MousePointer2 } from "lucide-react";
import useStore from "@/store/store";

const CursorToggle = () => {
  const { isDarkMode } = useStore();
  const [customCursorEnabled, setCustomCursorEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("customCursorEnabled");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });
  const [isClient] = useState(() => typeof window !== "undefined");
  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    const isMobileViewport = window.innerWidth < 768;
    const isCoarsePointer = window.matchMedia
      ? window.matchMedia("(pointer: coarse)").matches
      : false;
    return isMobileViewport || isCoarsePointer;
  });

  useEffect(() => {
    if (!isClient) return;

    // Store user preference
    localStorage.setItem(
      "customCursorEnabled",
      JSON.stringify(customCursorEnabled)
    );

    // Toggle cursor visibility
    const cursorElement = document.querySelector('[data-cursor="custom"]');
    if (cursorElement) {
      (cursorElement as HTMLElement).style.display = customCursorEnabled
        ? "block"
        : "none";
    }

    // Toggle default cursor
    if (customCursorEnabled) {
      document.body.style.cursor = "none";
      document.documentElement.style.cursor = "none";
    } else {
      document.body.style.cursor = "auto";
      document.documentElement.style.cursor = "auto";
    }

    // Dispatch custom event to notify CustomCursor component
    window.dispatchEvent(
      new CustomEvent("cursorToggle", {
        detail: { enabled: customCursorEnabled },
      })
    );
  }, [customCursorEnabled, isClient]);

  const toggleCursor = () => {
    setCustomCursorEnabled(!customCursorEnabled);
  };

  if (isMobile) return null;

  return (
    <button
      onClick={toggleCursor}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
        isDarkMode
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
      title={
        customCursorEnabled ? "Disable Custom Cursor" : "Enable Custom Cursor"
      }
    >
      {customCursorEnabled ? (
        <MousePointer2 size={16} className="text-blue-500" />
      ) : (
        <MousePointer size={16} className="text-gray-500" />
      )}
    </button>
  );
};

export default CursorToggle;
