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
interface MySpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent {
  results: any;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): any;
  [index: number]: any;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): any;
  [index: number]: any;
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

  "do you work remotely": {
    answer:
      "Yes, I work remotely and can collaborate with clients from anywhere in the world. I use modern communication tools and project management platforms to ensure smooth remote collaboration.",
    keywords: ["remote", "remotely", "work from home", "location", "distance"],
    category: "services",
    followUp: ["What timezone are you in?", "How do you communicate remotely?"],
  },

  "do you work with international clients": {
    answer:
      "Absolutely! I work with international clients and have experience delivering projects for clients from various countries. I handle time zone differences and cultural communication effectively.",
    keywords: [
      "international",
      "clients",
      "global",
      "foreign",
      "overseas",
      "abroad",
    ],
    category: "services",
    followUp: ["Do you work remotely?", "What services do you offer?"],
  },

  "what timezone are you in": {
    answer:
      "I'm in Nepal Time (NPT), which is UTC+5:45. I'm flexible with meeting times and can accommodate different time zones for client calls and collaboration.",
    keywords: ["timezone", "time", "schedule", "when", "hours"],
    category: "personal",
    followUp: ["Do you work remotely?", "How can I contact you?"],
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
  const recognitionRef = useRef<MySpeechRecognition | null>(null);
  const messageIdCounter = useRef(1);
  const voiceTranscriptRef = useRef("");

  const generateId = useCallback(() => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}-${Date.now()}`;
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
      const s1 = str1.toLowerCase().trim();
      const s2 = str2.toLowerCase().trim();

      if (s1 === s2) return 1;
      if (s1.includes(s2) || s2.includes(s1)) return 0.9;

      // Split into words
      const words1 = s1.split(/\s+/);
      const words2 = s2.split(/\s+/);

      // Count word matches
      let matches = 0;
      words1.forEach((word1) => {
        if (word1.length < 2) return; // Ignore short words
        words2.forEach((word2) => {
          if (word2.length < 2) return; // Ignore short words

          // Exact word match
          if (word1 === word2) {
            matches += 1;
          }
          // Partial word match (one contains the other)
          else if (word1.includes(word2) || word2.includes(word1)) {
            matches += 0.8;
          }
          // Similar words (edit distance < 2)
          else if (Math.abs(word1.length - word2.length) <= 2) {
            // Simple Levenshtein-like check for short words
            let diff = 0;
            const minLength = Math.min(word1.length, word2.length);
            for (let i = 0; i < minLength; i++) {
              if (word1[i] !== word2[i]) diff++;
              if (diff > 1) break; // Too many differences
            }
            if (diff <= 1) {
              matches += 0.5;
            }
          }
        });
      });

      // Calculate similarity score
      const totalWords = (words1.length + words2.length) / 2;
      return totalWords > 0 ? Math.min(matches / totalWords, 1) : 0;
    },
    []
  );

  // Helper function to get exact match with variations
  const getExactMatch = useCallback((question: string): string | null => {
    const normalized = question.toLowerCase().trim();

    // Remove punctuation and question marks
    const cleanQuestion = normalized
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ");

    // Try to find exact match first
    for (const key in qaData) {
      if (cleanQuestion === key.toLowerCase()) {
        return key;
      }
    }

    // Try to match with common variations
    const variations: { [key: string]: string[] } = {
      "who are you": [
        "who r u",
        "who are u",
        "tell me about yourself",
        "introduce yourself",
      ],
      "what are your skills": [
        "what skills do you have",
        "what can you do",
        "your skills",
        "skills",
      ],
      "how can i contact you": [
        "how to contact",
        "contact info",
        "get in touch",
        "contact details",
      ],
      "what is your name": ["your name", "name"],
      "where are you from": ["where you from", "your location", "location"],
      "what services do you offer": [
        "services",
        "what do you offer",
        "offerings",
      ],
    };

    for (const [mainQuestion, variantList] of Object.entries(variations)) {
      if (
        variantList.includes(cleanQuestion) ||
        cleanQuestion.includes(mainQuestion)
      ) {
        return mainQuestion;
      }
    }

    return null;
  }, []);

  const findBestAnswer = useCallback(
    (question: string): { answer: string; followUp?: string[] } => {
      const normalizedQuestion = question.toLowerCase().trim();

      // Update conversation history
      setConversationHistory((prev) => [...prev.slice(-5), normalizedQuestion]);

      // Try to get exact match first
      const exactMatchKey = getExactMatch(normalizedQuestion);
      if (exactMatchKey && qaData[exactMatchKey]) {
        return {
          answer: qaData[exactMatchKey].answer,
          followUp: qaData[exactMatchKey].followUp,
        };
      }

      // Check for keyword matches with priority
      let bestMatch = { key: "", similarity: 0 };

      Object.entries(qaData).forEach(([key, data]) => {
        // Check direct keyword matches with higher priority
        let keywordScore = 0;
        data.keywords.forEach((keyword) => {
          if (normalizedQuestion.includes(keyword)) {
            keywordScore += 0.2; // Add score for each keyword match
          }
        });

        if (keywordScore > 0) {
          const totalScore =
            keywordScore + calculateSimilarity(normalizedQuestion, key);
          if (totalScore > bestMatch.similarity) {
            bestMatch = { key, similarity: totalScore };
          }
        } else {
          // Calculate similarity only if no keyword matches
          const similarity = calculateSimilarity(normalizedQuestion, key);
          if (similarity > bestMatch.similarity) {
            bestMatch = { key, similarity };
          }
        }
      });

      // Check partial matches for questions with "?" or question words
      if (
        bestMatch.similarity < 0.4 &&
        (normalizedQuestion.includes("?") ||
          normalizedQuestion.includes("what") ||
          normalizedQuestion.includes("how") ||
          normalizedQuestion.includes("who") ||
          normalizedQuestion.includes("where") ||
          normalizedQuestion.includes("when") ||
          normalizedQuestion.includes("why"))
      ) {
        // Look for any word match in the knowledge base
        const questionWords = normalizedQuestion
          .split(/\s+/)
          .filter((w) => w.length > 2);
        for (const key in qaData) {
          const keyWords = key.split(/\s+/);
          const hasWordMatch = questionWords.some((qWord) =>
            keyWords.some(
              (kWord) => kWord.includes(qWord) || qWord.includes(kWord)
            )
          );

          if (hasWordMatch) {
            bestMatch = { key, similarity: 0.5 };
            break;
          }
        }
      }

      // Return best match if similarity is good enough
      if (bestMatch.similarity > 0.4 && qaData[bestMatch.key]) {
        return {
          answer: qaData[bestMatch.key].answer,
          followUp: qaData[bestMatch.key].followUp,
        };
      }

      // Context-aware responses based on conversation history
      const lastQuestion = conversationHistory[conversationHistory.length - 2];
      if (lastQuestion) {
        if (
          normalizedQuestion.includes("more") ||
          normalizedQuestion.includes("else") ||
          normalizedQuestion.includes("other") ||
          normalizedQuestion === "yes" ||
          normalizedQuestion === "ok"
        ) {
          // Find a related topic from the last question
          for (const key in qaData) {
            if (
              lastQuestion.includes(key.toLowerCase()) ||
              qaData[key].keywords.some((k) => lastQuestion.includes(k))
            ) {
              if (qaData[key].followUp && qaData[key].followUp.length > 0) {
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

      // Intelligent fallback based on question type
      if (
        normalizedQuestion.includes("?") ||
        normalizedQuestion.includes("what") ||
        normalizedQuestion.includes("how") ||
        normalizedQuestion.includes("who") ||
        normalizedQuestion.includes("where")
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
    [calculateSimilarity, getExactMatch, getRandomFollowUp, conversationHistory]
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

      // Create bot message with follow-up options included
      const botMessage: Message = {
        id: generateId(),
        text: response.answer,
        sender: "bot",
        timestamp: new Date(),
        followUpOptions: response.followUp,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, getRandomDelay());
  }, [inputText, generateId, findBestAnswer, getRandomDelay]);

  const handleQuickReply = useCallback(
    (reply: string) => {
      const userMessage: Message = {
        id: generateId(),
        text: reply,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setShowSuggestions(false);

      // Simulate bot typing delay
      setTimeout(() => {
        const response = findBestAnswer(reply);

        // Create bot message with follow-up options included
        const botMessage: Message = {
          id: generateId(),
          text: response.answer,
          sender: "bot",
          timestamp: new Date(),
          followUpOptions: response.followUp,
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, getRandomDelay());
    },
    [generateId, findBestAnswer, getRandomDelay]
  );

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
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = navigator.language || "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          voiceTranscriptRef.current = transcript; // Store the transcript
          setInputText(transcript);
          // We'll handle sending in onend
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event);
          setIsListening(false);
          // Send message if we have transcript
          if (voiceTranscriptRef.current.trim()) {
            setTimeout(() => {
              handleSendMessage();
              voiceTranscriptRef.current = "";
            }, 300);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          // Send message if we have transcript
          if (voiceTranscriptRef.current.trim()) {
            setTimeout(() => {
              handleSendMessage();
              voiceTranscriptRef.current = "";
            }, 300);
          }
        };
      }
    }

    // Load chat history from localStorage
    try {
      const savedMessages = localStorage.getItem("bishnu_chat_history");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsed.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(messagesWithDates);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bishnu_chat_history", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      // If we have text from voice, send it immediately
      if (voiceTranscriptRef.current.trim()) {
        setTimeout(() => {
          handleSendMessage();
          voiceTranscriptRef.current = "";
        }, 300);
      }
    } else {
      voiceTranscriptRef.current = ""; // Reset transcript
      setInputText(""); // Clear input field
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        setIsListening(false);
      }
    }
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
    alert("Chat copied to clipboard!");
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
                >
                  {""}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChatHistory}
                  icon={<FiTrash2 size={14} />}
                  title="Clear chat"
                >
                  {""}
                </Button>
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
                  <React.Fragment key={message.id}>
                    <motion.div
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
                        </div>
                      </div>
                    </motion.div>

                    {/* Show follow-up options directly below bot message */}
                    {message.sender === "bot" &&
                      message.followUpOptions &&
                      message.followUpOptions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="ml-10 mt-2"
                        >
                          <div className="flex flex-wrap gap-2">
                            {message.followUpOptions.map((option, index) => (
                              <button
                                key={`${message.id}-followup-${index}`}
                                onClick={() => handleQuickReply(option)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-colors flex items-center ${
                                  isDarkMode
                                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {option}
                                <FiChevronRight className="ml-1" size={10} />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                  </React.Fragment>
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
                          key={`quick-${index}`}
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
                          key={`suggested-${index}`}
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
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
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
                  {isListening
                    ? "Listening... Speak now"
                    : "Press Enter to send • Voice input available"}
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
