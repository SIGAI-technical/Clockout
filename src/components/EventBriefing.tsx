"use client";

import React, { useEffect, useRef } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { MapPin, Clock, Calendar, ShieldCheck, Compass, ArrowRight } from "lucide-react";

interface EventBriefingProps {
  onRegisterClick: () => void;
}

const INFO_CARDS = [
  {
    label: "DESIGNATION",
    sub: "Event Name",
    icon: ShieldCheck,
    color: "emerald" as const,
    value: EVENT_CONFIG.name,
    detail: EVENT_CONFIG.subtitle,
  },
  {
    label: "SECTOR",
    sub: "Location",
    icon: MapPin,
    color: "emerald" as const,
    value: EVENT_CONFIG.location,
    detail: "AIML Department",
  },
  {
    label: "CONVOCATION",
    sub: "Time",
    icon: Clock,
    color: "emerald" as const,
    value: EVENT_CONFIG.time,
    detail: "Gate check begins promptly",
  },
  {
    label: "DATE",
    sub: "Calendar",
    icon: Calendar,
    color: "gold" as const,
    value: EVENT_CONFIG.date,
    detail: "Announcement pending",
  },
];

export default function EventBriefing({ onRegisterClick }: EventBriefingProps) {
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.12 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="event-briefing"
      className="relative z-10 w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8"
      aria-label="Event Briefing"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <div
          className="text-center mb-16 sm:mb-20"
          data-animate
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#3ddc84]/30 text-[#3ddc84] text-[10px] font-mono tracking-[0.35em] uppercase mb-5 glow-emerald" style={{ background: "rgba(61,220,132,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84] animate-pulse" />
            OFFICIAL PROCLAMATION
          </div>

          <h2 className="font-cinzel font-black text-4xl sm:text-6xl tracking-[0.08em] uppercase text-[#f2f2f0] leading-tight">
            The Event Briefing
          </h2>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#3ddc84]/60" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#7bb898]">
              LATVERIAN PROTOCOL DIRECTIVE
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#3ddc84]/60" />
          </div>

          <p className="mt-6 text-sm sm:text-base text-[#8a9490] leading-relaxed max-w-2xl mx-auto">
            {EVENT_CONFIG.briefing.statement}
          </p>
        </div>

        {/* ── Info Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14">
          {INFO_CARDS.map((card, i) => {
            const Icon = card.icon;
            const isGold = card.color === "gold";
            return (
              <div
                key={card.label}
                data-animate
                className="glass-panel glass-panel-hover rounded-lg p-5 sm:p-6 relative overflow-hidden"
                style={{
                  opacity: 0,
                  transform: "translateY(24px)",
                  transition: `opacity 0.7s ease ${i * 0.08}s, transform 0.7s ease ${i * 0.08}s, border-color 0.3s, box-shadow 0.3s`,
                }}
              >
                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-30"
                  style={{ background: isGold ? "rgba(201,162,39,0.15)" : "rgba(61,220,132,0.12)" }}
                />

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[9px] font-mono tracking-[0.35em] uppercase ${isGold ? "text-[#c9a227]" : "text-[#7bb898]"}`}>
                    {card.label}
                  </span>
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: isGold ? "rgba(201,162,39,0.25)" : "rgba(61,220,132,0.2)",
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: isGold ? "#c9a227" : "#3ddc84" }}
                    />
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#8a9490] uppercase tracking-wider mb-1">{card.sub}</div>
                <div
                  className="text-xl sm:text-2xl font-black font-cinzel text-[#f2f2f0] leading-tight"
                >
                  {card.value}
                </div>
                <div
                  className="mt-2 text-[10px] font-mono"
                  style={{ color: isGold ? "#c9a227" : "#7bb898" }}
                >
                  {card.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Sovereign Decree Banner ── */}
        <div
          data-animate
          className="glass-panel rounded-xl p-8 sm:p-10 relative overflow-hidden border border-[#3ddc84]/20"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s" }}
        >
          {/* Emerald ambient blob */}
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full blur-[80px] pointer-events-none" style={{ background: "rgba(61,220,132,0.08)" }} />
          {/* Gold corner trace */}
          <div className="absolute bottom-0 left-0 w-40 h-px bg-gradient-to-r from-[#c9a227]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 h-40 w-px bg-gradient-to-t from-[#c9a227]/50 to-transparent" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#3ddc84] uppercase tracking-[0.35em] mb-3">
                <Compass className="w-3.5 h-3.5" />
                THE SOVEREIGN DECREE
              </div>

              <h3 className="font-cinzel font-bold text-xl sm:text-2xl lg:text-3xl text-[#f2f2f0] leading-snug mb-3">
                {EVENT_CONFIG.briefing.headline}
              </h3>

              <p className="text-sm text-[#8a9490] leading-relaxed">
                {EVENT_CONFIG.briefing.decree}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={onRegisterClick}
                type="button"
                className="group flex items-center gap-2 px-6 py-3 bg-[#3ddc84] hover:bg-[#34c97a] text-[#050605] font-extrabold font-mono text-[11px] tracking-[0.2em] uppercase rounded-sm transition-all glow-emerald hover:scale-105 cursor-pointer"
              >
                REGISTER NOW
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#event-highlights"
                className="flex items-center gap-2 px-5 py-3 rounded-sm border border-white/15 hover:border-[#3ddc84]/40 text-[11px] font-mono tracking-wider uppercase text-[#8a9490] hover:text-[#f2f2f0] transition-all"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                View Highlights
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
