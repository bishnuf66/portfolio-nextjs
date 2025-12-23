"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiUser,
  FiCpu,
  FiMic,
  FiMicOff,
  FiCopy,
  FiTrash2,
  FiThumbsUp,
  FiThumbsDown,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import useStore from "@/store/store";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  liked?: boolean;
  followUpOptions?: string[];
}

interface QAData {
  [key: string]: {
    answer: string;
    keywords: string[];
    category: string;
    followUp?: string[];
  };
}

// Enhanced knowledge base with categories and relationships
const qaData: QAData = {
  // Basic Info
  "who are you": {
    answer:
      "I'm Bishnu BK, a Top Fullstack Developer from Nepal specializing in React, Next.js, Node.js, and modern web technologies.",
    keywords: ["introduction", "name", "who", "identity"],
    category: "personal",
    followUp: [
      "What are your skills?",
      "Where are you from?",
      "How can I contact you?",
    ],
  },

  "what is your name": {
    answer:
      "My name is Bishnu BK. I'm a professional Full Stack Developer based in Kathmandu, Nepal.",
    keywords: ["name", "called", "full name"],
    category: "personal",
    followUp: ["Who are you?", "Where are you from?"],
  },

  "where are you from": {
    answer:
      "I'm from Kathmandu, Nepal. I provide web development services throughout Nepal and internationally.",
    keywords: ["location", "based", "live", "country", "city"],
    category: "personal",
    followUp: ["Do you work remotely?", "What services do you offer?"],
  },

  // Skills & Expertise
  "what are your skills": {
    answer:
      "I specialize in JavaScript, TypeScript, React, Next.js, Node.js, MongoDB, PostgreSQL, and modern web technologies. I'm experienced in both frontend and backend development.",
    keywords: ["skills", "expertise", "proficient", "knowledge", "tech stack"],
    category: "skills",
    followUp: [
      "What technologies do you use?",
      "Are you a frontend or backend developer?",
      "What kind of projects do you work on?",
    ],
  },

  "what technologies do you use": {
    answer:
      "I work with React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, Tailwind CSS, Three.js, and many other modern web technologies.",
    keywords: ["technologies", "tools", "stack", "framework", "libraries"],
    category: "skills",
    followUp: ["What are your skills?", "What's your experience level?"],
  },

  "are you a frontend or backend developer": {
    answer:
      "I'm a Full Stack Developer, which means I handle both frontend (what users see) and backend (server-side) development.",
    keywords: ["frontend", "backend", "full stack", "both"],
    category: "skills",
    followUp: [
      "What are your frontend skills?",
      "What backend technologies do you know?",
    ],
  },

  // Experience
  "how experienced are you": {
    answer:
      "I'm a professional Full Stack Developer with extensive experience in building modern web applications and providing development services in Nepal.",
    keywords: ["experience", "years", "professional", "expert", "level"],
    category: "experience",
    followUp: [
      "What kind of projects do you work on?",
      "Can I see your portfolio?",
    ],
  },

  "what kind of projects do you work on": {
    answer:
      "I work on various web development projects including e-commerce sites, portfolio websites, web applications, APIs, and custom web solutions.",
    keywords: ["projects", "portfolio", "work", "build", "create"],
    category: "experience",
    followUp: ["What's your tech stack?", "Do you have examples?"],
  },

  // Services
  "what services do you offer": {
    answer:
      "I offer Full Stack Development, Frontend Development, Backend Development, MERN Stack Development, UI/UX Design, API Development, and Database Design services.",
    keywords: ["services", "offer", "provide", "do", "work"],
    category: "services",
    followUp: [
      "How can I contact you?",
      "What are your rates?",
      "What's your availability?",
    ],
  },

  "do you freelance": {
    answer:
      "Yes, I provide freelance web development services. You can contact me through my portfolio to discuss your project requirements.",
    keywords: ["freelance", "contract", "available", "hire", "work"],
    category: "services",
    followUp: ["What services do you offer?", "How can I contact you?"],
  },

  // Contact
  "how can i contact you": {
    answer:
      "You can contact me via email at bishowkarmabishnu@gmail.com or through the contact form on my portfolio website.",
    keywords: ["contact", "reach", "email", "phone", "connect", "get in touch"],
    category: "contact",
    followUp: [
      "What's your email?",
      "Where are you located?",
      "What's your availability?",
    ],
  },

  "what is your email": {
    answer: "My email address is bishowkarmabishnu@gmail.com",
    keywords: ["email", "address", "mail"],
    category: "contact",
    followUp: ["How can I contact you?", "Do you have a phone number?"],
  },

  // Location
  "where do you work": {
    answer:
      "I'm based in Kathmandu, Nepal, and work with clients both locally and internationally.",
    keywords: ["work", "office", "based", "remote", "location"],
    category: "personal",
    followUp: ["Do you work remotely?", "What timezone are you in?"],
  },

  // Education/Background
  "what is your background": {
    answer:
      "I'm a professional web developer with expertise in modern web technologies and a focus on creating high-quality, responsive web applications.",
    keywords: ["background", "education", "qualification", "degree"],
    category: "personal",
    followUp: ["What are your skills?", "How experienced are you?"],
  },

  // Pricing
  "what are your rates": {
    answer:
      "My rates vary based on project complexity and requirements. Please contact me with your project details for a custom quote.",
    keywords: ["rates", "pricing", "cost", "price", "how much", "charge"],
    category: "services",
    followUp: ["What services do you offer?", "How can I contact you?"],
  },

  // Availability
  "are you available": {
    answer:
      "My availability depends on current projects. Please contact me to discuss timelines and availability for your project.",
    keywords: ["available", "free", "busy", "timeline", "schedule"],
    category: "services",
    followUp: ["How can I contact you?", "What are your rates?"],
  },

  // Greetings
  hello: {
    answer:
      "Hello! I'm Bishnu BK's virtual assistant. How can I help you learn more about Bishnu and his work?",
    keywords: ["hello", "hi", "hey", "greetings"],
    category: "greeting",
    followUp: [
      "Who are you?",
      "What services do you offer?",
      "How can I contact you?",
    ],
  },

  hi: {
    answer:
      "Hi there! I'm here to answer questions about Bishnu BK. What would you like to know?",
    keywords: ["hi", "hello", "hey"],
    category: "greeting",
    followUp: ["What are your skills?", "What services do you offer?"],
  },

  thanks: {
    answer: "You're welcome! Feel free to ask if you have more questions.",
    keywords: ["thanks", "thank", "appreciate"],
    category: "greeting",
  },

  "thank you": {
    answer:
      "You're welcome! Is there anything else you'd like to know about Bishnu's work?",
    keywords: ["thank", "thanks", "appreciate"],
    category: "greeting",
    followUp: ["What are your skills?", "How can I contact you?"],
  },

  bye: {
    answer: "Goodbye! Feel free to visit again if you have more questions.",
    keywords: ["bye", "goodbye", "see you", "later"],
    category: "greeting",
  },

  help: {
    answer:
      "I can help you learn about Bishnu BK's skills, experience, services, and contact information. Just ask me anything!",
    keywords: ["help", "assist", "what can you do"],
    category: "greeting",
    followUp: [
      "What are your skills?",
      "How can I contact you?",
      "What services do you offer?",
    ],
  },
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
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messageIdCounter = useRef(1);

  const generateId = useCallback(() => {
    messageIdCounter.current += 1;
    return messageIdCounter.current.toString();
  }, []);

  const getRandomDelay = useCallback(() => {
    return 800 + Math.random() * 400;
  }, []);

  const getRandomFollowUp = useCallback((followUpArray: string[]) => {
    return followUpArray[Math.floor(Math.random() * followUpArray.length)];
  }, []);

  // Enhanced string similarity algorithm
  const calculateSimilarity = useCallback(
    (str1: string, str2: string): number => {
      const s1 = str1.toLowerCase();
      const s2 = str2.toLowerCase();

      if (s1 === s2) return 1;
      if (s1.includes(s2) || s2.includes(s1)) return 0.9;

      // Simple word matching
      const words1 = s1.split(" ");
      const words2 = s2.split(" ");
      const matches = words1.filter((word) => words2.includes(word)).length;
      const maxWords = Math.max(words1.length, words2.length);

      // Add a small value to avoid division by zero
      return (matches + 0.01) / (maxWords + 0.01);
    },
    []
  );

  const findBestAnswer = useCallback(
    (question: string): { answer: string; followUp?: string[] } => {
      const normalizedQuestion = question.toLowerCase().trim();

      // Update conversation history
      setConversationHistory((prev) => [...prev.slice(-5), normalizedQuestion]);

      // Direct match first
      if (qaData[normalizedQuestion]) {
        return {
          answer: qaData[normalizedQuestion].answer,
          followUp: qaData[normalizedQuestion].followUp,
        };
      }

      // Check for keyword matches
      let bestMatch = { key: "", similarity: 0 };

      Object.entries(qaData).forEach(([key, data]) => {
        // Check direct keyword matches
        if (
          data.keywords.some((keyword) => normalizedQuestion.includes(keyword))
        ) {
          bestMatch = { key, similarity: 0.8 };
          return;
        }

        // Calculate similarity
        const similarity = calculateSimilarity(normalizedQuestion, key);
        if (similarity > bestMatch.similarity) {
          bestMatch = { key, similarity };
        }
      });

      // Check partial matches
      if (bestMatch.similarity < 0.3) {
        for (const key in qaData) {
          const keyWords = key.split(" ");
          const questionWords = normalizedQuestion.split(" ");

          if (keyWords.some((word) => questionWords.includes(word))) {
            bestMatch = { key, similarity: 0.4 };
            break;
          }
        }
      }

      // Context-aware responses based on conversation history
      const lastQuestion = conversationHistory[conversationHistory.length - 2];
      if (lastQuestion) {
        if (
          normalizedQuestion.includes("more") ||
          normalizedQuestion.includes("else")
        ) {
          // Find a related topic
          for (const key in qaData) {
            if (
              lastQuestion.includes(key) ||
              qaData[key].keywords.some((k) => lastQuestion.includes(k))
            ) {
              if (qaData[key].followUp) {
                const randomFollowUp = getRandomFollowUp(qaData[key].followUp);
                const followUpKey = randomFollowUp.toLowerCase();
                if (qaData[followUpKey]) {
                  return {
                    answer: qaData[followUpKey].answer,
                    followUp: qaData[followUpKey].followUp,
                  };
                }
              }
            }
          }
        }
      }

      // Return best match or fallback
      if (bestMatch.similarity > 0.3 && qaData[bestMatch.key]) {
        return {
          answer: qaData[bestMatch.key].answer,
          followUp: qaData[bestMatch.key].followUp,
        };
      }

      // Intelligent fallback based on question type
      if (
        normalizedQuestion.includes("?") ||
        normalizedQuestion.includes("what") ||
        normalizedQuestion.includes("how")
      ) {
        return {
          answer:
            "I can help you with information about Bishnu's skills, experience, services, and contact details. Try asking more specific questions like 'What are your skills?' or 'How can I contact you?'",
          followUp: [
            "What are your skills?",
            "How can I contact you?",
            "What services do you offer?",
          ],
        };
      }

      // Default fallback with suggestions
      return {
        answer:
          "I'm here to help you learn about Bishnu BK! You can ask me about his skills, experience, services, or how to contact him.",
        followUp: [
          "What are your skills?",
          "What services do you offer?",
          "How experienced are you?",
        ],
      };
    },
    [
      setConversationHistory,
      conversationHistory,
      calculateSimilarity,
      getRandomFollowUp,
    ]
  );

  const handleSendMessage = useCallback(() => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: generateId(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate bot typing delay
    setTimeout(() => {
      const response = findBestAnswer(inputText);
      const botMessage: Message = {
        id: generateId(),
        text: response.answer,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Add follow-up questions
      if (response.followUp && response.followUp.length > 0) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateId(),
            text: "Would you like to know more about any of these?",
            sender: "bot",
            timestamp: new Date(),
            followUpOptions: response.followUp,
          };
          setMessages((prev) => [...prev, followUpMessage]);
        }, 500);
      }
    }, getRandomDelay()); // Variable typing speed
  }, [inputText, generateId, findBestAnswer, getRandomDelay]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Initialize Web Speech API
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Auto-send message after speech recognition completes
        if (transcript.trim()) {
          setTimeout(() => handleSendMessage(), 500);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Auto-send message when mic stops (backup to onresult)
        if (inputText.trim()) {
          setTimeout(() => handleSendMessage(), 300);
        }
      };
    }

    // Load chat history from localStorage
    const savedMessages = localStorage.getItem("bishnu_chat_history");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsed.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          // Use setTimeout to avoid synchronous setState in effect
          setTimeout(() => setMessages(messagesWithDates), 0);
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [handleSendMessage, inputText]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("bishnu_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: "1",
        text: "Hi! I'm Bishnu's virtual assistant. Ask me anything about Bishnu BK's skills, experience, or services!",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setConversationHistory([]);
    localStorage.removeItem("bishnu_chat_history");
  };

  const copyChatToClipboard = () => {
    const chatText = messages
      .map(
        (msg) => `${msg.sender === "user" ? "You" : "Assistant"}: ${msg.text}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(chatText);
    // You could add a toast notification here
  };

  const handleMessageFeedback = (messageId: string, liked: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, liked } : msg))
    );
  };

  const quickReplies = [
    "What are your skills?",
    "How can I contact you?",
    "What services do you offer?",
    "Tell me about your experience",
    "What's your tech stack?",
    "Do you work remotely?",
    "What are your rates?",
  ];

  const suggestedQuestions = [
    { question: "What projects have you worked on?", category: "Projects" },
    {
      question: "Are you available for new projects?",
      category: "Availability",
    },
    { question: "What's your preferred tech stack?", category: "Technology" },
    { question: "How long have you been developing?", category: "Experience" },
    {
      question: "Do you work with international clients?",
      category: "Clients",
    },
    { question: "What's your development process?", category: "Process" },
  ];

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
              className="rounded-full shadow-lg hover:shadow-xl relative group"
            >
              {isMobile ? "Chat" : "Ask Bishnu"}
              {/* Notification badge for unread */}
              {messages.length > 1 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {messages.length - 1}
                </span>
              )}
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
            } rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              isDarkMode
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-slate-200"
            }`}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => {
              e.stopPropagation();
              const container = e.currentTarget;
              const { scrollHeight, clientHeight } = container;

              // Prevent background scroll when chat can scroll
              if (scrollHeight > clientHeight) {
                e.preventDefault();
              }
            }}
            style={{
              touchAction: "none",
              overscrollBehavior: "contain",
            }}
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
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <FiCpu className="text-white" size={20} />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
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
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyChatToClipboard}
                  icon={<FiCopy size={14} />}
                  title="Copy chat"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChatHistory}
                  icon={<FiTrash2 size={14} />}
                  title="Clear chat"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  icon={<FiX size={18} />}
                >
                  {""}
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${
                isMobile ? "h-[calc(90vh-140px)]" : "h-[350px]"
              }`}
              style={{
                overscrollBehavior: "contain",
              }}
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message.sender === "user"
                            ? "bg-blue-500"
                            : "bg-linear-to-r from-blue-500 to-purple-600"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <FiUser className="text-white" size={14} />
                        ) : (
                          <FiCpu className="text-white" size={14} />
                        )}
                      </div>
                      <div className="flex flex-col">
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
                        {/* Message timestamp */}
                        <span
                          className={`text-xs mt-1 px-2 ${
                            isDarkMode ? "text-slate-500" : "text-slate-500"
                          } ${message.sender === "user" ? "text-right" : ""}`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {/* Feedback buttons for bot messages */}
                        {message.sender === "bot" && (
                          <div className="flex space-x-1 mt-1">
                            <button
                              onClick={() =>
                                handleMessageFeedback(message.id, true)
                              }
                              className={`p-1 rounded ${
                                message.liked === true
                                  ? "text-green-500"
                                  : isDarkMode
                                  ? "text-slate-500 hover:text-green-400"
                                  : "text-slate-400 hover:text-green-600"
                              }`}
                            >
                              <FiThumbsUp size={12} />
                            </button>
                            <button
                              onClick={() =>
                                handleMessageFeedback(message.id, false)
                              }
                              className={`p-1 rounded ${
                                message.liked === false
                                  ? "text-red-500"
                                  : isDarkMode
                                  ? "text-slate-500 hover:text-red-400"
                                  : "text-slate-400 hover:text-red-600"
                              }`}
                            >
                              <FiThumbsDown size={12} />
                            </button>
                          </div>
                        )}
                        {/* Follow-up options */}
                        {message.followUpOptions &&
                          message.followUpOptions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p
                                className={`text-xs font-medium ${
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-600"
                                }`}
                              >
                                Suggested questions:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {message.followUpOptions.map(
                                  (option, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleQuickReply(option)}
                                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors flex items-center ${
                                        isDarkMode
                                          ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                                          : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                      }`}
                                    >
                                      {option}
                                      <FiChevronRight
                                        className="ml-1"
                                        size={10}
                                      />
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}
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
                )}

                {/* Quick Replies */}
                {!isTyping && messages.length > 1 && showSuggestions && (
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
                      {quickReplies.slice(0, 4).map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors flex items-center ${
                            isDarkMode
                              ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                              : "border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {reply}
                          <FiChevronRight className="ml-1" size={10} />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Suggested Questions Grid */}
                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <p
                      className={`text-sm font-medium mb-3 ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      What would you like to know?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestedQuestions.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(item.question)}
                          className={`p-3 rounded-lg text-left transition-all hover:scale-[1.02] ${
                            isDarkMode
                              ? "bg-slate-700 hover:bg-slate-600"
                              : "bg-slate-100 hover:bg-slate-200"
                          }`}
                        >
                          <div className="flex items-start">
                            <FiSearch
                              className="mt-0.5 mr-2 shrink-0"
                              size={12}
                            />
                            <div>
                              <p className="text-xs font-medium mb-1">
                                {item.category}
                              </p>
                              <p className="text-xs opacity-90">
                                {item.question}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-lg ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  } border ${
                    isDarkMode ? "border-slate-700" : "border-slate-300"
                  }`}
                >
                  {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
                </button>
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
                  style={{ pointerEvents: "auto", userSelect: "text" }}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
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
                  {messages.length - 1} messages
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
