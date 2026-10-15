"use client";

import React, { useMemo } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { MapPin, Calendar, Clock } from "lucide-react";

interface CinematicTitleRevealProps {
  t: number | null;
  isCompleted: boolean;
  onRegisterClick: () => void;
  reducedMotion?: boolean;
}

// ─── Key Sequence Timestamps (seconds into V3/Audio) ────────────────────────
const T_V3_END        = 9.333; // Doom throne reaches final frame
const T_GLOW_START    = 9.7;   // Faint emerald backlight introduces
const T_TITLE_START   = 10.2;  // CLOCKOUT 4.0 begins smooth scale-up & fade-in
const T_TITLE_REST    = 13.2;  // Title settles in its final position
const T_SWEEP_START   = 13.5;  // Specular light sweep starts across letters
const T_SWEEP_END     = 15.3;  // Specular light sweep finishes
const T_TAGLINE_START = 15.5;  // THE DOOM TAKEOVER fades in beneath title
const T_TAGLINE_REST  = 17.2;  // Tagline fully visible; finished title holds
const T_DETAILS_START = 19.2;  // Event meta cards fade in beneath title

// Subtle drifting atmospheric particles behind the title
const PARTICLES = [
  { id: 1, left: "20%", top: "42%", size: 3, delay: "0s", dur: "7s", drift: "-20px" },
  { id: 2, left: "32%", top: "58%", size: 2, delay: "1.2s", dur: "6.5s", drift: "18px" },
  { id: 3, left: "50%", top: "35%", size: 3, delay: "2.5s", dur: "8s", drift: "-12px" },
  { id: 4, left: "68%", top: "60%", size: 2, delay: "0.8s", dur: "7.2s", drift: "20px" },
  { id: 5, left: "80%", top: "45%", size: 3, delay: "2.0s", dur: "6.8s", drift: "-16px" },
];

export default function CinematicTitleReveal({
  t,
  isCompleted,
  onRegisterClick,
  reducedMotion = false,
}: CinematicTitleRevealProps) {
  // Reveal activates when video 3 reaches final frame or when intro is skipped/completed
  const isRevealed = isCompleted || (t !== null && t >= T_V3_END);

  const state = useMemo(() => {
    if (!isRevealed) {
      return {
        visible: false,
        backlightOpacity: 0,
        titleOpacity: 0,
        titleScale: 0.92,
        titleY: 12,
        showSweep: false,
        sweepPos: -30,
        tagOpacity: 0,
        tagY: 6,
        detailsOpacity: 0,
        detailsY: 14,
        detailsInteractive: false,
      };
    }

    if (reducedMotion || isCompleted) {
      return {
        visible: true,
        backlightOpacity: 1,
        titleOpacity: 1,
        titleScale: 1,
        titleY: 0,
        showSweep: false,
        sweepPos: 140,
        tagOpacity: 1,
        tagY: 0,
        detailsOpacity: 1,
        detailsY: 0,
        detailsInteractive: true,
      };
    }

    const curT = t ?? 0;

    // 1. Faint emerald backlight introducing behind screen center
    let backlightOpacity = 0;
    if (curT >= T_GLOW_START) {
      backlightOpacity = Math.min(1, (curT - T_GLOW_START) / 1.2);
    }

    // 2. Single CLOCKOUT 4.0 title reveal: smooth scale-up & fade-in from darkness
    let titleOpacity = 0;
    let titleScale = 0.92;
    let titleY = 12;

    if (curT >= T_TITLE_START) {
      const rawP = Math.min(1, Math.max(0, (curT - T_TITLE_START) / (T_TITLE_REST - T_TITLE_START)));
      // Controlled deceleration ease (cubic ease-out)
      const ease = 1 - Math.pow(1 - rawP, 3);
      titleOpacity = Math.min(1, rawP * 2.2);
      titleScale = 0.92 + 0.08 * ease;
      titleY = 12 * (1 - ease);
    }

    // 3. Narrow emerald-green / silver light sweep across the letters
    let showSweep = false;
    let sweepPos = -30;
    if (curT >= T_SWEEP_START && curT <= T_SWEEP_END) {
      showSweep = true;
      const swP = (curT - T_SWEEP_START) / (T_SWEEP_END - T_SWEEP_START);
      sweepPos = -20 + swP * 140; // sweeps smoothly from -20% to 120%
    } else if (curT > T_SWEEP_END) {
      sweepPos = 140; // held past the text
    }

    // 4. Tagline: THE DOOM TAKEOVER appears beneath the title with an elegant fade
    let tagOpacity = 0;
    let tagY = 6;
    if (curT >= T_TAGLINE_START) {
      const p = Math.min(1, (curT - T_TAGLINE_START) / (T_TAGLINE_REST - T_TAGLINE_START));
      const easeTag = 1 - Math.pow(1 - p, 3);
      tagOpacity = Math.min(1, p * 1.5);
      tagY = 6 * (1 - easeTag);
    }

    // 5. Event Details appear beneath title during normal scrolling
    let detailsOpacity = 0;
    let detailsY = 14;
    let detailsInteractive = false;
    if (curT >= T_DETAILS_START) {
      const p = Math.min(1, (curT - T_DETAILS_START) / 1.4);
      const easeDet = 1 - Math.pow(1 - p, 3);
      detailsOpacity = Math.min(1, p * 1.3);
      detailsY = 14 * (1 - easeDet);
      detailsInteractive = p > 0.6;
    }

    return {
      visible: true,
      backlightOpacity,
      titleOpacity,
      titleScale,
      titleY,
      showSweep,
      sweepPos,
      tagOpacity,
      tagY,
      detailsOpacity,
      detailsY,
      detailsInteractive,
    };
  }, [isRevealed, isCompleted, reducedMotion, t]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none select-none overflow-hidden transition-opacity duration-300"
      style={{
        zIndex: 35,
        opacity: state.visible ? 1 : 0,
        visibility: state.visible ? "visible" : "hidden",
      }}
      aria-label="Clockout 4.0 — The Doom Takeover Title"
    >
      {/* ── Subtle Black Overlay keeping Doctor Doom on the Throne visible behind ── */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: state.visible ? 0.48 : 0 }}
      />

      {/* ── Faint Emerald Atmospheric Backlight ── */}
      <div
        className="avengers-backlight"
        style={{
          opacity: state.backlightOpacity,
          transition: isCompleted ? "none" : "opacity 0.6s ease-out",
        }}
      />
      <div
        className="avengers-core-glint"
        style={{
          opacity: state.backlightOpacity * 0.7,
          transition: isCompleted ? "none" : "opacity 0.6s ease-out",
        }}
      />

      {/* ── Drifting Atmospheric Micro-Particles ── */}
      {state.backlightOpacity > 0.1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="metal-particle"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                ["--delay" as string]: p.delay,
                ["--dur" as string]: p.dur,
                ["--drift" as string]: p.drift,
              }}
            />
          ))}
        </div>
      )}

      {/* ── EXACT TITLE LAYOUT (Rendered Once In The DOM) ── */}
      <div
        className="cinematic-title-card"
        style={{
          opacity: state.titleOpacity,
          transform: `scale(${state.titleScale}) translateY(${state.titleY}px)`,
          ["--sweep-pos" as string]: `${state.sweepPos}%`,
        }}
      >
        {/* Single Monumental Heading */}
        <h1 className="cinematic-title">
          CLOCKOUT <span className="title-number">4.0</span>
          {/* Anamorphic light sweep flare */}
          {state.showSweep && (
            <span
              className="title-sweep-flare"
              style={{ left: `calc(${state.sweepPos}% - 70px)` }}
              aria-hidden="true"
            />
          )}
        </h1>

        {/* Tagline directly underneath in smaller uppercase lettering */}
        <p
          className="cinematic-tagline"
          style={{
            opacity: state.tagOpacity,
            transform: `translateY(${state.tagY}px)`,
          }}
        >
          {EVENT_CONFIG.subtitle}
        </p>
      </div>

      {/* ── Event Details & Registration Appearing Beneath During Normal Scrolling ── */}
      <div
        className="relative z-20 flex flex-col items-center mt-5 sm:mt-7 max-w-2xl w-full"
        style={{
          opacity: state.detailsOpacity,
          transform: `translateY(${state.detailsY}px)`,
          pointerEvents: state.detailsInteractive ? "auto" : "none",
          transition: isCompleted ? "none" : "opacity 0.4s ease-out, transform 0.4s ease-out",
        }}
      >
        {/* AIML Department Badge */}
        <div
          className="inline-flex items-center gap-2 mb-3 sm:mb-4 backdrop-blur-md px-3.5 py-1.5"
          style={{
            borderLeft: "2px solid #3ddc84",
            background: "rgba(0,0,0,0.85)",
            color: "#3ddc84",
            fontSize: "0.62rem",
            fontFamily: "var(--font-inter),monospace",
            fontWeight: 700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            boxShadow: "0 4px 16px rgba(0,0,0,0.8)",
          }}
        >
          <span className="w-1.5 h-1.5 bg-[#3ddc84] animate-status-pulse flex-shrink-0" />
          AIML DEPARTMENT PRESENTS
        </div>

        {/* Event Meta Cards: Venue, Date, Time */}
        <div
          className="w-full backdrop-blur-xl"
          style={{
            background: "rgba(8, 12, 9, 0.88)",
            border: "1px solid rgba(61, 220, 132, 0.22)",
            boxShadow: "0 18px 48px rgba(0,0,0,0.8), 0 0 25px -10px rgba(61,220,132,0.2)",
          }}
        >
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="flex items-center gap-2.5 px-4 py-2.5 sm:py-3 flex-1 text-left">
              <MapPin className="w-3.5 h-3.5 text-[#3ddc84] shrink-0" />
              <div>
                <div className="text-[8px] font-mono text-[#3ddc84] tracking-[.32em] uppercase">
                  VENUE
                </div>
                <div className="text-xs font-mono text-[#e5e7eb] mt-0.5 font-medium">
                  {EVENT_CONFIG.location}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 sm:py-3 flex-1 text-left">
              <Calendar className="w-3.5 h-3.5 text-[#c9a227] shrink-0" />
              <div>
                <div className="text-[8px] font-mono text-[#c9a227] tracking-[.32em] uppercase">
                  DATE
                </div>
                <div className="text-xs font-mono text-[#e5e7eb] mt-0.5 font-medium">
                  {EVENT_CONFIG.date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 sm:py-3 flex-1 text-left">
              <Clock className="w-3.5 h-3.5 text-[#3ddc84] shrink-0" />
              <div>
                <div className="text-[8px] font-mono text-[#3ddc84] tracking-[.32em] uppercase">
                  TIME
                </div>
                <div className="text-xs font-mono text-[#e5e7eb] mt-0.5 font-medium">
                  {EVENT_CONFIG.time}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Call-to-Action */}
        <div className="mt-4 sm:mt-6 pointer-events-auto">
          <button
            onClick={onRegisterClick}
            type="button"
            className="group px-10 sm:px-14 py-3.5 sm:py-4 bg-[#3ddc84] hover:bg-[#4ee893] text-[#050605] font-black text-xs sm:text-sm tracking-[.24em] uppercase transition-all duration-200 hover:scale-[1.04] active:scale-[.98] cursor-pointer shadow-2xl flex items-center gap-2.5"
            style={{ fontFamily: "var(--font-oswald),sans-serif" }}
          >
            <span>REGISTER NOW</span>
            <span className="group-hover:translate-x-1.5 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
