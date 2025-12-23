"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiUser, FiCpu } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import useStore from "@/store/store";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface QAData {
  [key: string]: string;
}

const qaData: QAData = {
  // Basic Info
  "who are you":
    "I'm Bishnu BK, a Top Fullstack Developer from Nepal specializing in React, Next.js, Node.js, and modern web technologies.",
  "what is your name":
    "My name is Bishnu BK. I'm a professional Full Stack Developer based in Kathmandu, Nepal.",
  "where are you from":
    "I'm from Kathmandu, Nepal. I provide web development services throughout Nepal and internationally.",

  // Skills & Expertise
  "what are your skills":
    "I specialize in JavaScript, TypeScript, React, Next.js, Node.js, MongoDB, PostgreSQL, and modern web technologies. I'm experienced in both frontend and backend development.",
  "what technologies do you use":
    "I work with React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, Tailwind CSS, Three.js, and many other modern web technologies.",
  "are you a frontend or backend developer":
    "I'm a Full Stack Developer, which means I handle both frontend (what users see) and backend (server-side) development.",

  // Experience
  "how experienced are you":
    "I'm a professional Full Stack Developer with extensive experience in building modern web applications and providing development services in Nepal.",
  "what kind of projects do you work on":
    "I work on various web development projects including e-commerce sites, portfolio websites, web applications, APIs, and custom web solutions.",

  // Services
  "what services do you offer":
    "I offer Full Stack Development, Frontend Development, Backend Development, MERN Stack Development, UI/UX Design, API Development, and Database Design services.",
  "do you freelance":
    "Yes, I provide freelance web development services. You can contact me through my portfolio to discuss your project requirements.",

  // Contact
  "how can i contact you":
    "You can contact me via email at contact@bishnubk.com.np or through the contact form on my portfolio website.",
  "what is your email": "My email address is contact@bishnubk.com.np",

  // Location
  "where do you work":
    "I'm based in Kathmandu, Nepal, and work with clients both locally and internationally.",

  // Education/Background
  "what is your background":
    "I'm a professional web developer with expertise in modern web technologies and a focus on creating high-quality, responsive web applications.",

  // Default responses for common questions
  hello:
    "Hello! I'm Bishnu BK's virtual assistant. How can I help you learn more about Bishnu and his work?",
  hi: "Hi there! I'm here to answer questions about Bishnu BK. What would you like to know?",
  thanks: "You're welcome! Feel free to ask if you have more questions.",
  "thank you":
    "You're welcome! Is there anything else you'd like to know about Bishnu's work?",
  bye: "Goodbye! Feel free to visit again if you have more questions.",
  help: "I can help you learn about Bishnu BK's skills, experience, services, and contact information. Just ask me anything!",
};

const Chatbot: React.FC = () => {
  const { isDarkMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Bishnu's virtual assistant. Ask me anything about Bishnu BK's skills, experience, or services!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestAnswer = (question: string): string => {
    const normalizedQuestion = question.toLowerCase().trim();

    // Direct match first
    if (qaData[normalizedQuestion]) {
      return qaData[normalizedQuestion];
    }

    // Partial matches
    for (const key in qaData) {
      if (
        normalizedQuestion.includes(key) ||
        key.includes(normalizedQuestion) ||
        normalizedQuestion.includes(key.replace(/\s+/g, " ").split(" ")[0])
      ) {
        return qaData[key];
      }
    }

    // Keyword-based responses
    if (
      normalizedQuestion.includes("contact") ||
      normalizedQuestion.includes("reach")
    ) {
      return qaData["how can i contact you"];
    }
    if (
      normalizedQuestion.includes("skill") ||
      normalizedQuestion.includes("technology")
    ) {
      return qaData["what are your skills"];
    }
    if (
      normalizedQuestion.includes("service") ||
      normalizedQuestion.includes("work")
    ) {
      return qaData["what services do you offer"];
    }
    if (
      normalizedQuestion.includes("project") ||
      normalizedQuestion.includes("portfolio")
    ) {
      return qaData["what kind of projects do you work on"];
    }

    // Default fallback
    return "I'm not sure about that, but I can tell you about Bishnu's skills, experience, services, and how to contact him. Try asking about his web development services, technologies he uses, or how to reach him!";
  };

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findBestAnswer(inputText),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`fixed z-40 ${
        isMobile ? "bottom-4 left-4 right-4" : "bottom-4 left-4"
      }`}
    >
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="primary"
              size={isMobile ? "md" : "lg"}
              onClick={() => setIsOpen(true)}
              icon={<FiMessageSquare size={isMobile ? 18 : 20} />}
              className="rounded-full shadow-lg hover:shadow-xl"
            >
              {isMobile ? "Chat" : "Bishnu's Assistance"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`${
              isMobile ? "w-full h-[90vh] max-w-sm mx-auto" : "w-96 h-[500px]"
            } rounded-2xl shadow-2xl overflow-hidden ${
              isDarkMode
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 flex items-center justify-between ${
                isDarkMode
                  ? "bg-slate-900 border-b border-slate-700"
                  : "bg-slate-50 border-b border-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <FiCpu className="text-white" size={20} />
                </div>
                <div>
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Bishnu&apos;s Assistant
                  </h3>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Ask me about Bishnu BK
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                icon={<FiX size={18} />}
              >
                {""}
              </Button>
            </div>

            {/* Messages Area */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${
                isMobile ? "h-[calc(90vh-140px)]" : "h-[350px]"
              }`}
            >
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 ${
                        isMobile ? "max-w-[90%]" : "max-w-[80%]"
                      } ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user"
                            ? "bg-blue-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <FiUser className="text-white" size={14} />
                        ) : (
                          <FiCpu className="text-white" size={14} />
                        )}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-lg ${
                          message.sender === "user"
                            ? isDarkMode
                              ? "bg-blue-600 text-white"
                              : "bg-blue-500 text-white"
                            : isDarkMode
                            ? "bg-slate-700 text-slate-200"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
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
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div
              className={`p-4 border-t ${
                isDarkMode
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Bishnu's skills, experience..."
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  icon={<FiSend size={16} />}
                  disabled={inputText.trim() === "" || isTyping}
                >
                  {""}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
