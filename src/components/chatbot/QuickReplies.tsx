// Quick replies component
import React from "react";
import { motion } from "framer-motion";

interface QuickRepliesProps {
  replies: string[];
  onReplyClick: (reply: string) => void;
  isDarkMode: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  replies,
  onReplyClick,
  isDarkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <p
        className={`text-xs mb-2 ${
          isDarkMode ? "text-slate-400" : "text-slate-600"
        }`}
      >
        Quick questions:
      </p>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onReplyClick(reply)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              isDarkMode
                ? "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {reply}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
