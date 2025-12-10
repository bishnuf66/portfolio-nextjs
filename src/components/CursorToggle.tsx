"use client";

import React, { useState, useEffect } from "react";
import { MousePointer, MousePointer2 } from "lucide-react";
import useStore from "@/store/store";

const CursorToggle = () => {
    const { isDarkMode } = useStore();
    const [customCursorEnabled, setCustomCursorEnabled] = useState(true);

    useEffect(() => {
        // Check if user has a preference stored
        const stored = localStorage.getItem("customCursorEnabled");
        if (stored !== null) {
            setCustomCursorEnabled(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        // Store user preference
        localStorage.setItem("customCursorEnabled", JSON.stringify(customCursorEnabled));

        // Toggle cursor visibility
        const cursorElement = document.querySelector('[data-cursor="custom"]');
        if (cursorElement) {
            (cursorElement as HTMLElement).style.display = customCursorEnabled ? 'block' : 'none';
        }

        // Toggle default cursor
        if (customCursorEnabled) {
            document.body.style.cursor = "none";
            document.documentElement.style.cursor = "none";
        } else {
            document.body.style.cursor = "auto";
            document.documentElement.style.cursor = "auto";
        }
    }, [customCursorEnabled]);

    const toggleCursor = () => {
        setCustomCursorEnabled(!customCursorEnabled);
    };

    return (
        <button
            onClick={toggleCursor}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isDarkMode
                    ? "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                }`}
            title={customCursorEnabled ? "Disable Custom Cursor" : "Enable Custom Cursor"}
        >
            {customCursorEnabled ? (
                <MousePointer2 size={20} className="text-blue-500" />
            ) : (
                <MousePointer size={20} className="text-gray-500" />
            )}
        </button>
    );
};

export default CursorToggle;