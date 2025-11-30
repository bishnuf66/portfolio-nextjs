"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2, Sparkles } from "lucide-react";
import useStore from "@/store/store";

interface AudioExperiencePopupProps {
    onAccept: () => void;
    onDecline: () => void;
}

export default function AudioExperiencePopup({ onAccept, onDecline }: AudioExperiencePopupProps) {
    const { isDarkMode } = useStore();
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const audioConsent = localStorage.getItem("audio-consent");
        const cookieConsent = localStorage.getItem("cookie-consent");

        // Only show if cookies are accepted and audio choice hasn't been made
        if (cookieConsent === "accepted" && !audioConsent) {
            setTimeout(() => setShow(true), 500);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("audio-consent", "accepted");
        setShow(false);
        onAccept();
    };

    const handleDecline = () => {
        localStorage.setItem("audio-consent", "declined");
        setShow(false);
        onDecline();
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
                        transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4"
                    >
                        <div
                            className={`relative max-w-md w-full rounded-3xl p-8 shadow-2xl overflow-hidden ${isDarkMode
                                    ? "bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-purple-500/30"
                                    : "bg-gradient-to-br from-white via-purple-50 to-white border border-purple-200"
                                }`}
                        >
                            {/* Animated Background Elements */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 0],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, -90, 0],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
                            />

                            {/* Content */}
                            <div className="relative">
                                {/* Animated Icon */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 mb-6 mx-auto relative"
                                >
                                    <Music className="w-10 h-10 text-white" />
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                        className="absolute inset-0 rounded-full bg-purple-500/50"
                                    />
                                </motion.div>

                                {/* Title with Sparkle */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                    <h2
                                        className={`text-2xl md:text-3xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        Enhance Your Experience
                                    </h2>
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                </div>

                                {/* Description */}
                                <p
                                    className={`text-center mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                        }`}
                                >
                                    Would you like to experience this portfolio with ambient background music?
                                </p>

                                {/* Features */}
                                <div className="space-y-3 mb-8">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <Music className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <p
                                                className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                                                    }`}
                                            >
                                                Ambient Background Music
                                            </p>
                                            <p
                                                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                                    }`}
                                            >
                                                Carefully selected to enhance your browsing
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <Volume2 className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p
                                                className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                                                    }`}
                                            >
                                                Full Volume Control
                                            </p>
                                            <p
                                                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                                    }`}
                                            >
                                                Adjust or mute anytime with the audio controls
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAccept}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Music className="w-5 h-5" />
                                        Yes, Play Music
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDecline}
                                        className={`w-full px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${isDarkMode
                                                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        No Thanks, Keep Silent
                                    </motion.button>
                                </div>

                                {/* Note */}
                                <p
                                    className={`text-xs text-center mt-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"
                                        }`}
                                >
                                    You can change this preference anytime using the audio controls
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
