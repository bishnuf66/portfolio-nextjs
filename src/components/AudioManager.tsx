"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import useStore from "@/store/store";

export default function AudioManager() {
    const { isDarkMode } = useStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize background music
        bgMusicRef.current = new Audio("/audio/background-music.mp3");
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = volume;

        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if (bgMusicRef.current) {
            bgMusicRef.current.volume = volume;
        }
    }, [volume]);

    const toggleMusic = () => {
        if (!bgMusicRef.current) return;

        if (isPlaying) {
            bgMusicRef.current.pause();
            setIsPlaying(false);
        } else {
            bgMusicRef.current.play().catch((error) => {
                console.error("Failed to play music:", error);
                alert("Please interact with the page first to enable audio");
            });
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume === 0 && isPlaying) {
            bgMusicRef.current?.pause();
            setIsPlaying(false);
        } else if (newVolume > 0 && !isPlaying) {
            bgMusicRef.current?.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            {/* Volume Slider */}
            {showVolumeSlider && (
                <div
                    className={`p-4 rounded-full backdrop-blur-md shadow-lg transition-all ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"
                        }`}
                >
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-32 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        aria-label="Volume"
                    />
                </div>
            )}

            {/* Volume Toggle */}
            <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className={`p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${isDarkMode
                        ? "bg-gray-800/90 hover:bg-gray-700 text-white"
                        : "bg-white/90 hover:bg-gray-100 text-gray-900"
                    }`}
                aria-label="Toggle volume slider"
                title="Adjust volume"
            >
                {volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                ) : (
                    <Volume2 className="w-5 h-5" />
                )}
            </button>

            {/* Music Play/Pause */}
            <button
                onClick={toggleMusic}
                className={`p-4 rounded-full backdrop-blur-md transition-all shadow-lg ${isPlaying
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : isDarkMode
                            ? "bg-gray-800/90 hover:bg-gray-700 text-white"
                            : "bg-white/90 hover:bg-gray-100 text-gray-900"
                    }`}
                aria-label={isPlaying ? "Pause music" : "Play music"}
                title={isPlaying ? "Pause background music" : "Play background music"}
            >
                <Music className={`w-6 h-6 ${isPlaying ? "animate-pulse" : ""}`} />
            </button>
        </div>
    );
}
