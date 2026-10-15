"use client";

import React, { useState, useEffect } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { FastForward, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  onRegisterClick: () => void;
  onSkipIntro: () => void;
  onReplayIntro: () => void;
  showSkipIntro?: boolean;
  showReplayButton?: boolean;
  reachedRegistration?: boolean;
}

export default function Navbar({
  onRegisterClick,
  onSkipIntro,
  onReplayIntro,
  showSkipIntro = true,
  showReplayButton = false,
  reachedRegistration = false,
}: NavbarProps) {
  const [muted, setMuted] = useState(true);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [droneRef, setDroneRef] = useState<{ stop: () => void } | null>(null);

  const toggleAudio = () => {
    if (muted) {
      // Start drone sound
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2);
        masterGain.connect(ctx.destination);

        // Low drone oscillator
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(40, ctx.currentTime);
        const g1 = ctx.createGain();
        g1.gain.setValueAtTime(0.6, ctx.currentTime);
        osc1.connect(g1);
        g1.connect(masterGain);
        osc1.start();

        // Sub-harmonic
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(60, ctx.currentTime);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.3, ctx.currentTime);
        osc2.connect(g2);
        g2.connect(masterGain);
        osc2.start();

        // Subtle texture
        const osc3 = ctx.createOscillator();
        osc3.type = "triangle";
        osc3.frequency.setValueAtTime(120, ctx.currentTime);
        const g3 = ctx.createGain();
        g3.gain.setValueAtTime(0.08, ctx.currentTime);
        osc3.connect(g3);
        g3.connect(masterGain);
        osc3.start();

        setAudioCtx(ctx);
        setDroneRef({
          stop: () => {
            masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
            setTimeout(() => ctx.close(), 1600);
          },
        });
        setMuted(false);
      } catch {
        // Audio not available
      }
    } else {
      droneRef?.stop();
      setDroneRef(null);
      setAudioCtx(null);
      setMuted(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtx) audioCtx.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDefined = reachedRegistration;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${
        isDefined
          ? "py-3 border-b border-[#3ddc84]/15 backdrop-blur-xl bg-[rgba(5,6,5,0.92)] shadow-lg"
          : "py-4 sm:py-5 border-b border-transparent bg-transparent backdrop-blur-none"
      }`}
      style={{
        background: isDefined ? "rgba(5,6,5,0.92)" : "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group cursor-pointer select-none" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          {/* Doom Crest Icon */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-sm border border-[#3ddc84]/40 group-hover:border-[#3ddc84]/70 transition-colors" />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="relative z-10">
              <path d="M9 1L17 15H1L9 1Z" stroke="#3ddc84" strokeWidth="1.5" fill="none"/>
              <path d="M9 5L14 14H4L9 5Z" fill="#3ddc84" opacity="0.25"/>
              <circle cx="9" cy="9" r="1.5" fill="#3ddc84"/>
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-cinzel font-black text-xs sm:text-sm tracking-[0.18em] text-[#f2f2f0] group-hover:text-[#3ddc84] transition-colors uppercase leading-tight">
              {EVENT_CONFIG.name}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#7bb898] uppercase leading-tight">
              AIML DEPARTMENT
            </span>
          </div>
        </a>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showSkipIntro && (
            <button
              onClick={onSkipIntro}
              type="button"
              className="group flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm border border-white/15 hover:border-[#3ddc84]/50 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#8a9490] hover:text-[#3ddc84] transition-all backdrop-blur-md cursor-pointer"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              <FastForward className="w-3 h-3" />
              <span className="inline font-bold">SKIP</span>
            </button>
          )}

          {showReplayButton && (
            <button
              onClick={onReplayIntro}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 hover:border-white/25 text-[10px] font-mono tracking-wider uppercase text-[#8a9490] hover:text-[#f2f2f0] transition-all cursor-pointer"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">REPLAY</span>
            </button>
          )}

          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            type="button"
            title={muted ? "Enable atmospheric audio" : "Disable audio"}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-sm border border-white/10 hover:border-[#3ddc84]/40 text-[#8a9490] hover:text-[#3ddc84] transition-all cursor-pointer"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#3ddc84]" />}
          </button>

          {/* Register CTA */}
          <button
            onClick={onRegisterClick}
            type="button"
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#3ddc84] hover:bg-[#34c97a] text-[#050605] font-extrabold font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase rounded-sm transition-all glow-emerald hover:scale-105 cursor-pointer"
          >
            REGISTER
          </button>
        </div>
      </div>
    </header>
  );
}
