// Typing indicator component
import React from "react";
import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";

interface TypingIndicatorProps {
  isDarkMode: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isDarkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-start space-x-2 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <FiCpu className="text-white" size={14} />
        </div>
        <div
          className={`px-3 py-2 rounded-lg ${
            isDarkMode
              ? "bg-slate-700 text-slate-200"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
