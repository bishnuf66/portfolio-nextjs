// Chatbot types and interfaces
export interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: () => void;
    onend: () => void;
    start(): void;
    stop(): void;
}

export interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

export interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

export interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
    liked?: boolean;
    followUpOptions?: string[];
}

export interface QAData {
    [key: string]: {
        answer: string;
        keywords: string[];
        category: string;
        followUp?: string[];
    };
}

export interface SuggestedQuestion {
    question: string;
    category: string;
}
