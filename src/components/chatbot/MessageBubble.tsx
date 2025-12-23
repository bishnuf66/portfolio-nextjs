// Message bubble component
import React from "react";
import { motion } from "framer-motion";
import { FiUser, FiCpu, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { Message } from "@/types/chatbot";

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
  onFeedback?: (messageId: string, liked: boolean) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isDarkMode,
  onFeedback,
}) => {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%]`}>
        {isBot && (
          <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <FiCpu className="text-white" size={14} />
          </div>
        )}
        <div
          className={`px-3 py-2 rounded-lg ${
            isBot
              ? isDarkMode
                ? "bg-slate-700 text-slate-200"
                : "bg-slate-100 text-slate-800"
              : "bg-blue-500 text-white"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          {isBot && onFeedback && (
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => onFeedback(message.id, true)}
                className={`p-1 rounded ${
                  message.liked === true
                    ? "bg-green-500 text-white"
                    : "hover:bg-slate-600 text-slate-400"
                }`}
              >
                <FiThumbsUp size={12} />
              </button>
              <button
                onClick={() => onFeedback(message.id, false)}
                className={`p-1 rounded ${
                  message.liked === false
                    ? "bg-red-500 text-white"
                    : "hover:bg-slate-600 text-slate-400"
                }`}
              >
                <FiThumbsDown size={12} />
              </button>
            </div>
          )}
        </div>
        {!isBot && (
          <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center">
            <FiUser className="text-white" size={14} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
