"use client";

import React, { useState, useEffect } from "react";
import { MousePointer, MousePointer2 } from "lucide-react";
import useStore from "@/store/store";

const CursorToggle = () => {
  const { isDarkMode } = useStore();
  const [customCursorEnabled, setCustomCursorEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag and initialize from localStorage
    setIsClient(true);
    const stored = localStorage.getItem("customCursorEnabled");
    if (stored !== null) {
      setCustomCursorEnabled(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // This effect now only handles side effects, not state initialization
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

    // Dispatch custom event to notify SimpleCursor component
    window.dispatchEvent(
      new CustomEvent("cursorToggle", {
        detail: { enabled: customCursorEnabled },
      })
    );
  }, [customCursorEnabled, isClient]);

  const toggleCursor = () => {
    setCustomCursorEnabled(!customCursorEnabled);
  };

  return (
    <button
      onClick={toggleCursor}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode
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
