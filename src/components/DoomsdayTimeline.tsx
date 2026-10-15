"use client";

import React, { useEffect, useRef, useState } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { Clock, Terminal } from "lucide-react";

interface TimelinePhase {
  phase: string;
  codename: string;
  timeRange: string;
  title: string;
  summary: string;
  deliverables: string[];
  status: "SCHEDULED" | "UPCOMING" | "CLASSIFIED";
}

const PHASES: TimelinePhase[] = [
  {
    phase: "PHASE 01",
    codename: "INCURSION_PROTOCOL",
    timeRange: "2:00 PM — 2:45 PM",
    title: "The Sovereign Conclave & Gate Check",
    summary:
      "Gates open at the 4th Floor proving grounds. Participants register credentials, receive Latverian security badges, and attend the opening keynote.",
    deliverables: ["Credential Verification", "Track Problem Statements Unveiled", "Squad Assembly"],
    status: "SCHEDULED",
  },
  {
    phase: "PHASE 02",
    codename: "NEURAL_FORGE",
    timeRange: "2:45 PM — 6:00 PM",
    title: "The Crucible: Computational Warfare",
    summary:
      "Intensive sprint where squads architect, train, and deploy models against benchmark problem statements under real-time faculty inspection.",
    deliverables: ["Model Architecture", "Rapid Prototyping", "Interim Checkpoint Review"],
    status: "UPCOMING",
  },
  {
    phase: "PHASE 03",
    codename: "THRONE_JUDGMENT",
    timeRange: "6:00 PM Onwards",
    title: "Doomsday Evaluation & Sovereign Honors",
    summary:
      "Final project pitch before the jury. Top architectures are summoned to stand before the throne to receive honors and commendation.",
    deliverables: ["Live System Demonstration", "Jury Defense", "Ceremony of Accolades"],
    status: "CLASSIFIED",
  },
];

export default function DoomsdayTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll("[data-animate]").forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = "1";
                (el as HTMLElement).style.transform = "translateY(0)";
              }, i * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="event-timeline"
      className="relative z-10 w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      aria-label="Event Timeline"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16 sm:mb-20"
          data-animate
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#3ddc84]/30 text-[#3ddc84] text-[10px] font-mono tracking-[0.35em] uppercase mb-5 glow-emerald"
            style={{ background: "rgba(61,220,132,0.08)" }}
          >
            <Clock className="w-3.5 h-3.5 text-[#3ddc84]" />
            MISSION CHRONOLOGY
          </div>

          <h2 className="font-cinzel font-black text-4xl sm:text-6xl tracking-[0.08em] uppercase text-[#f2f2f0] leading-tight">
            The Takeover Protocol
          </h2>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#3ddc84]/60" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#7bb898]">
              {EVENT_CONFIG.location} • {EVENT_CONFIG.time}
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#3ddc84]/60" />
          </div>
        </div>

        {/* Interactive Phase Selector for Mobile & Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Phase Navigation Tabs (Left 4 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {PHASES.map((p, idx) => {
              const isActive = activePhaseIndex === idx;
              return (
                <button
                  key={p.codename}
                  onClick={() => setActivePhaseIndex(idx)}
                  type="button"
                  data-animate
                  className={`text-left p-5 sm:p-6 rounded-lg border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    isActive
                      ? "border-[#3ddc84]/50 bg-[#0c140e] shadow-xl glow-emerald"
                      : "border-white/10 bg-[#090c0a]/60 hover:border-white/25 hover:bg-[#090c0a]"
                  }`}
                  style={{
                    opacity: 0,
                    transform: "translateY(20px)",
                    transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s, border-color 0.2s, background 0.2s`,
                  }}
                >
                  {/* Left accent indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3ddc84] to-[#c9a227]" />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#3ddc84]">
                      {p.phase} {"//"} {p.codename}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                        isActive
                          ? "bg-[#3ddc84]/20 text-[#3ddc84] border border-[#3ddc84]/40"
                          : "bg-white/5 text-[#8a9490]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h3 className="font-cinzel font-bold text-lg text-[#f2f2f0] mb-2 leading-snug">
                    {p.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#8a9490]">
                    <Clock className="w-3.5 h-3.5 text-[#c9a227]" />
                    <span>{p.timeRange}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Deep Dive Card (Right 7 cols) */}
          <div
            className="lg:col-span-7 relative p-6 sm:p-10 rounded-xl border border-[#3ddc84]/25 backdrop-blur-xl overflow-hidden"
            style={{
              background: "rgba(10,15,11,0.85)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            {/* Top accent glow */}
            <div
              className="absolute top-0 inset-x-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, #3ddc84, #c9a227, transparent)",
              }}
            />

            {/* Tactical watermarking */}
            <div className="absolute right-4 bottom-4 text-[4rem] sm:text-[6rem] font-black font-cinzel text-white/[0.02] select-none pointer-events-none">
              0{activePhaseIndex + 1}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-sm border border-[#3ddc84]/40 flex items-center justify-center text-[#3ddc84]"
                style={{ background: "rgba(61,220,132,0.1)" }}
              >
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#3ddc84]">
                  DIRECTIVE DOSSIER
                </span>
                <h4 className="font-cinzel font-black text-2xl sm:text-3xl text-[#f2f2f0]">
                  {PHASES[activePhaseIndex].title}
                </h4>
              </div>
            </div>

            <div className="p-4 rounded-sm border border-white/5 bg-black/40 mb-6 font-mono text-xs text-[#7bb898] flex items-center gap-3">
              <span className="text-[#c9a227] font-bold">TIMING:</span>
              <span>{PHASES[activePhaseIndex].timeRange}</span>
              <span className="text-white/20">•</span>
              <span className="text-[#3ddc84] font-bold">STAGE:</span>
              <span>{PHASES[activePhaseIndex].phase}</span>
            </div>

            <p className="text-sm sm:text-base text-[#a3a8a4] leading-relaxed mb-8">
              {PHASES[activePhaseIndex].summary}
            </p>

            {/* Deliverables Checklist */}
            <div className="border-t border-white/10 pt-6">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#c9a227] block mb-4">
                CORE PROTOCOL OBJECTIVES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PHASES[activePhaseIndex].deliverables.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-sm border border-white/8 bg-white/[0.02] flex items-center gap-2 text-xs font-mono text-[#f2f2f0]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
