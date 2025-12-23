// Custom hook for speech recognition
import { useCallback, useEffect, useRef, useState } from "react";
import { SpeechRecognition, SpeechRecognitionEvent } from "@/types/chatbot";

export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognitionConstructor =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                recognitionRef.current = new SpeechRecognitionConstructor();
                if (recognitionRef.current) {
                    recognitionRef.current.continuous = false;
                    recognitionRef.current.interimResults = false;
                    recognitionRef.current.lang = navigator.language || "en-US";
                }
            }
        }
    }, []);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) {
            alert("Voice recognition is not supported in your browser");
            return;
        }

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            return transcript;
        };

        recognitionRef.current.onerror = () => {
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current.start();
        setIsListening(true);
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return {
        isListening,
        startListening,
        stopListening,
        isSupported: !!recognitionRef.current,
    };
};
