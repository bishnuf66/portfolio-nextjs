"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield } from "lucide-react";
import useStore from "@/store/store";
import { Button } from "@/components/ui/Button";

interface CookieConsentProps {
  onAccept: () => void;
  onReject: () => void;
}

export default function CookieConsent({
  onAccept,
  onReject,
}: CookieConsentProps) {
  const { isDarkMode } = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show popup after a short delay
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShow(false);
    onReject();
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
            onClick={() => {}}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-101 p-4"
          >
            <div
              className={`relative max-w-lg w-full rounded-2xl p-8 shadow-2xl ${
                isDarkMode
                  ? "bg-linear-to-br from-gray-900 to-gray-800 border border-gray-700"
                  : "bg-linear-to-br from-white to-gray-50 border border-gray-200"
              }`}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 mb-6 mx-auto">
                  <Cookie className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h2
                  className={`text-2xl md:text-3xl font-bold text-center mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  We Value Your Privacy
                </h2>

                {/* Description */}
                <p
                  className={`text-center mb-6 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  We use cookies and analytics to improve your experience and
                  understand how you interact with our site.
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Anonymous Tracking
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        We track page views and interactions anonymously
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        No Personal Data
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        We don&apos;t collect names, emails, or personal
                        information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Improve Experience
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Help us understand what content you enjoy most
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAccept}
                    variant="gradient"
                    size="md"
                    className="flex-1 transform hover:scale-105"
                  >
                    Accept & Continue
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    size="md"
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>

                {/* Privacy Link */}
                <p
                  className={`text-xs text-center mt-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  By accepting, you agree to our use of cookies for analytics
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
