// Chatbot utility functions
export const getRandomDelay = (): number => {
    return 800 + Math.random() * 400;
};

export const getRandomFollowUp = (followUpArray: string[]): string => {
    return followUpArray[Math.floor(Math.random() * followUpArray.length)];
};

export const calculateSimilarity = (str1: string, str2: string): number => {
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
};

export const generateMessageId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
