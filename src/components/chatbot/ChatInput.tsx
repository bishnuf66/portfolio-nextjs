// Chat input component
import React from "react";
import { FiSend, FiMic, FiMicOff } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  inputText: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onToggleVoice: () => void;
  isListening: boolean;
  isTyping: boolean;
  isDarkMode: boolean;
  messageCount: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputChange,
  onSendMessage,
  onKeyPress,
  onToggleVoice,
  isListening,
  isTyping,
  isDarkMode,
  messageCount,
}) => {
  return (
    <div
      className={`p-4 border-t ${
        isDarkMode
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-lg ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : isDarkMode
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
              : "bg-white text-slate-600 hover:bg-slate-100"
          } border ${isDarkMode ? "border-slate-700" : "border-slate-300"}`}
        >
          {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Ask me about Bishnu's skills, experience..."
          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
            isDarkMode
              ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isTyping}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={onSendMessage}
          icon={<FiSend size={16} />}
          disabled={inputText.trim() === "" || isTyping}
          className="shrink-0"
        >
          {""}
        </Button>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p
          className={`text-xs ${
            isDarkMode ? "text-slate-500" : "text-slate-500"
          }`}
        >
          Press Enter to send • Voice input available
        </p>
        <span
          className={`text-xs px-2 py-1 rounded ${
            isDarkMode
              ? "bg-slate-800 text-slate-400"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {messageCount} messages
        </span>
      </div>
    </div>
  );
};
