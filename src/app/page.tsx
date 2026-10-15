"use client";

import React, { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import BackgroundThrone from "@/components/BackgroundThrone";
import CinematicScroll, { CinematicScrollHandle } from "@/components/CinematicScroll";
import RegisterModal from "@/components/RegisterModal";
import Footer from "@/components/Footer";
import { EVENT_CONFIG } from "@/config/event";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cinematicCompleted, setCinematicCompleted] = useState(false);
  const cinematicRef = useRef<CinematicScrollHandle>(null);

  const handleRegisterClick = useCallback(() => {
    const url = EVENT_CONFIG.googleFormUrl;
    if (
      url &&
      (url.startsWith("http://") || url.startsWith("https://")) &&
      !url.includes("example.com")
    ) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleCinematicComplete = useCallback((completed: boolean) => {
    setCinematicCompleted((prev) => (prev !== completed ? completed : prev));
  }, []);

  const handleSkipIntro = useCallback(() => {
    if (cinematicRef.current) {
      cinematicRef.current.skipIntro();
    }
  }, []);

  const handleReplayIntro = useCallback(() => {
    if (cinematicRef.current) {
      cinematicRef.current.replayIntro();
    }
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#000000] text-[#F7F7F6] overflow-x-hidden">
      {/* Permanent Background Throne (Doctor Doom Frozen Final Frame) */}
      <BackgroundThrone opacity={cinematicCompleted ? 1 : 0} dimLevel={0.4} />

      {/* Global Navbar with unified controls */}
      <Navbar
        onRegisterClick={handleRegisterClick}
        onSkipIntro={handleSkipIntro}
        onReplayIntro={handleReplayIntro}
        showSkipIntro={!cinematicCompleted}
        showReplayButton={cinematicCompleted}
        reachedRegistration={cinematicCompleted}
      />

      {/* Primary Cinematic Sequence (Videos 1, 2, 3 + Transitions 1, 2 + Throne Reveal + Event Details) */}
      <CinematicScroll
        ref={cinematicRef}
        onRegisterClick={handleRegisterClick}
        onCinematicComplete={handleCinematicComplete}
      />

      {/* Minimalist Footer */}
      <Footer />

      {/* Google Form Status / Action Modal */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
