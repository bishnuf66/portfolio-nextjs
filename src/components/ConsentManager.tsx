"use client";

import React, { useState, useEffect } from "react";
import CookieConsent from "./CookieConsent";
import AudioExperiencePopup from "./AudioExperiencePopup";
import AudioManager from "./AudioManager";

export default function ConsentManager() {
    const [showCookieConsent, setShowCookieConsent] = useState(false);
    const [showAudioPopup, setShowAudioPopup] = useState(false);
    const [cookiesAccepted, setCookiesAccepted] = useState(false);
    const [audioAccepted, setAudioAccepted] = useState(false);
    const [audioManagerRef, setAudioManagerRef] = useState<any>(null);

    useEffect(() => {
        // Check existing consents
        const cookieConsent = localStorage.getItem("cookie-consent");
        const audioConsent = localStorage.getItem("audio-consent");

        if (!cookieConsent) {
            setShowCookieConsent(true);
        } else {
            setCookiesAccepted(cookieConsent === "accepted");

            // If cookies accepted but no audio choice, show audio popup
            if (cookieConsent === "accepted" && !audioConsent) {
                setTimeout(() => setShowAudioPopup(true), 1500);
            } else if (audioConsent === "accepted") {
                setAudioAccepted(true);
            }
        }
    }, []);

    const handleCookieAccept = () => {
        setCookiesAccepted(true);
        setShowCookieConsent(false);

        // Show audio popup after cookie consent
        setTimeout(() => setShowAudioPopup(true), 800);
    };

    const handleCookieReject = () => {
        setCookiesAccepted(false);
        setShowCookieConsent(false);
        // Don't show audio popup if cookies rejected
    };

    const handleAudioAccept = () => {
        setAudioAccepted(true);
        setShowAudioPopup(false);

        // Trigger audio to play
        setTimeout(() => {
            const audioButton = document.querySelector('[aria-label="Play music"]') as HTMLButtonElement;
            if (audioButton) {
                audioButton.click();
            }
        }, 500);
    };

    const handleAudioDecline = () => {
        setAudioAccepted(false);
        setShowAudioPopup(false);
    };

    return (
        <>
            {/* Cookie Consent Popup */}
            {showCookieConsent && (
                <CookieConsent
                    onAccept={handleCookieAccept}
                    onReject={handleCookieReject}
                />
            )}

            {/* Audio Experience Popup */}
            {showAudioPopup && (
                <AudioExperiencePopup
                    onAccept={handleAudioAccept}
                    onDecline={handleAudioDecline}
                />
            )}

            {/* Audio Manager - Always render but only functional after consent */}
            <AudioManager />
        </>
    );
}
