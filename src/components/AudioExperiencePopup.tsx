"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2 } from "lucide-react";
import useStore from "@/store/store";

interface AudioExperiencePopupProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function AudioExperiencePopup({
  onAccept,
  onDecline,
}: AudioExperiencePopupProps) {
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-[101] p-4"
          >
            <div
              className={`relative max-w-lg w-full rounded-2xl p-8 shadow-2xl ${
                isDarkMode
                  ? "bg-linear-to-br from-gray-900 to-gray-800 border border-gray-700"
                  : "bg-linear-to-br from-white to-gray-50 border border-gray-200"
              }`}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 mb-6 mx-auto">
                  <Music className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h2
                  className={`text-2xl md:text-3xl font-bold text-center mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Enhance Your Experience
                </h2>

                {/* Description */}
                <p
                  className={`text-center mb-6 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Would you like to experience this portfolio with ambient
                  background music?
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Music className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Ambient Background Music
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Carefully selected to enhance your browsing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Volume2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Full Volume Control
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Adjust or mute anytime with the audio controls
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Music className="w-5 h-5" />
                    Yes, Play Music
                  </button>
                  <button
                    onClick={handleDecline}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    No Thanks, Keep Silent
                  </button>
                </div>

                {/* Note */}
                <p
                  className={`text-xs text-center mt-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  You can change this preference anytime using the audio
                  controls
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
