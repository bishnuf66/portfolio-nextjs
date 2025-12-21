"use client";

import React from "react";
import CustomScrollbar from "./ui/CustomScrollbar";
import useStore from "@/store/store";

const ScrollbarDemo = () => {
    const { isDarkMode } = useStore();

    const demoContent = Array.from({ length: 50 }, (_, i) => (
        <div
            key={i}
            className={`p-4 mb-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
        >
            <h3 className="font-semibold">Demo Item {i + 1}</h3>
            <p className="text-sm opacity-75">
                This is demo content to showcase the custom scrollbar. Lorem ipsum dolor sit amet.
            </p>
        </div>
    ));

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
                Custom Scrollbar Variants
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Default Scrollbar */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Default</h3>
                    <CustomScrollbar
                        variant="default"
                        height="300px"
                        className={`p-4 rounded-lg border ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                            }`}
                    >
                        {demoContent.slice(0, 20)}
                    </CustomScrollbar>
                </div>

                {/* Rainbow Scrollbar */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Rainbow</h3>
                    <CustomScrollbar
                        variant="rainbow"
                        height="300px"
                        className={`p-4 rounded-lg border ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                            }`}
                    >
                        {demoContent.slice(0, 20)}
                    </CustomScrollbar>
                </div>

                {/* Minimal Scrollbar */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Minimal</h3>
                    <CustomScrollbar
                        variant="minimal"
                        height="300px"
                        className={`p-4 rounded-lg border ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                            }`}
                    >
                        {demoContent.slice(0, 20)}
                    </CustomScrollbar>
                </div>

                {/* Glow Scrollbar */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Glow</h3>
                    <CustomScrollbar
                        variant="glow"
                        height="300px"
                        className={`p-4 rounded-lg border ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                            }`}
                    >
                        {demoContent.slice(0, 20)}
                    </CustomScrollbar>
                </div>
            </div>

            {/* Usage Examples */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Usage Examples</h3>
                <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                        <h4 className="font-semibold mb-2">Enhanced Scrollbar (CSS Class)</h4>
                        <code className="text-sm">
                            {`<div className="enhanced-scrollbar overflow-auto max-h-96">...</div>`}
                        </code>
                    </div>

                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                        <h4 className="font-semibold mb-2">Code Scrollbar (CSS Class)</h4>
                        <code className="text-sm">
                            {`<pre className="code-scrollbar overflow-auto">...</pre>`}
                        </code>
                    </div>

                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                        <h4 className="font-semibold mb-2">Custom Component</h4>
                        <code className="text-sm">
                            {`<CustomScrollbar variant="rainbow" height="400px">...</CustomScrollbar>`}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollbarDemo;