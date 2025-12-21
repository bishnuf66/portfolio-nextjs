"use client";

import React from "react";
import useStore from "@/store/store";

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "rainbow" | "minimal" | "glow";
  height?: string;
  maxHeight?: string;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className = "",
  variant = "default",
  height,
  maxHeight,
}) => {
  const { isDarkMode } = useStore();

  const getScrollbarClass = () => {
    switch (variant) {
      case "rainbow":
        return "scrollbar-rainbow";
      case "minimal":
        return "scrollbar-minimal";
      case "glow":
        return "scrollbar-glow";
      default:
        return "scrollbar-default";
    }
  };

  const containerStyle = {
    height,
    maxHeight,
  };

  return (
    <div
      className={`${getScrollbarClass()} ${className} overflow-auto`}
      style={containerStyle}
    >
      {children}

      <style jsx>{`
        /* Rainbow Scrollbar Variant */
        .scrollbar-rainbow::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .scrollbar-rainbow::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 10px;
          margin: 2px;
        }
        
        .scrollbar-rainbow::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, 
            #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
          animation: rainbow-shift 4s ease-in-out infinite;
        }
        
        .scrollbar-rainbow::-webkit-scrollbar-thumb:hover {
          animation: rainbow-shift 2s ease-in-out infinite, pulse-glow 1s ease-in-out infinite;
          transform: scale(1.1);
        }
        
        /* Minimal Scrollbar Variant */
        .scrollbar-minimal::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-minimal::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-minimal::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
          border-radius: 3px;
          transition: all 0.2s ease;
        }
        
        .scrollbar-minimal::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
        }
        
        /* Glow Scrollbar Variant */
        .scrollbar-glow::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        .scrollbar-glow::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
          border-radius: 8px;
        }
        
        .scrollbar-glow::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          transition: all 0.3s ease;
        }
        
        .scrollbar-glow::-webkit-scrollbar-thumb:hover {
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        /* Animations */
        @keyframes rainbow-shift {
          0% { filter: hue-rotate(0deg); }
          25% { filter: hue-rotate(90deg); }
          50% { filter: hue-rotate(180deg); }
          75% { filter: hue-rotate(270deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.5); }
          50% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.8), 0 0 30px rgba(72, 219, 251, 0.6); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 25px rgba(102, 126, 234, 0.8), 0 0 35px rgba(118, 75, 162, 0.6);
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomScrollbar;