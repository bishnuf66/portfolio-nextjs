// Chat toggle button component
import React from "react";
import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface ChatToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isMobile: boolean;
  messageCount: number;
  isDarkMode: boolean;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  isOpen,
  onClick,
  isMobile,
  messageCount,
  isDarkMode,
}) => {
  if (isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="primary"
        size={isMobile ? "md" : "lg"}
        onClick={onClick}
        icon={<FiMessageSquare size={isMobile ? 18 : 20} />}
        className="rounded-full shadow-lg hover:shadow-xl relative group"
      >
        {isMobile ? "Chat" : "Ask Bishnu"}
        {/* Notification badge for unread */}
        {messageCount > 1 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {messageCount - 1}
          </span>
        )}
      </Button>
    </motion.div>
  );
};
