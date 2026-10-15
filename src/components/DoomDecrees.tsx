"use client";

import React, { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

const DECREES = [
  {
    quote: "None shall rival Doom. In computational design as in sovereign empire, excellence is the only currency accepted in Latveria.",
    citation: "VICTOR VON DOOM // SOVEREIGN DIRECTIVE 01",
    theme: "EMERALD",
  },
  {
    quote: "I was a god once. I found it... beneath me. True supremacy is engineered through absolute mastery of logic, code, and will.",
    citation: "DOCTOR DOOM // SECRET WARS ARCHIVE",
    theme: "GOLD",
  },
  {
    quote: "The multiversal incursion is inevitable. Only those who forge superior models and unyielding algorithms will survive the collapse.",
    citation: "DOOMSDAY PROTOCOL // LATVERIA COMMAND",
    theme: "EMERALD",
  },
  {
    quote: "Do not bring me excuses. Bring me mathematical certainty, flawless execution, and systems that defy limits.",
    citation: "CLOCKOUT 4.0 SUMMONS // 4TH FLOOR",
    theme: "GOLD",
  },
];

export default function DoomDecrees() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const nextDecree = () => {
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % DECREES.length);
      setAnimating(false);
    }, 250);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % DECREES.length);
        setAnimating(false);
      }, 250);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Decrees of Doctor Doom"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-xl p-8 sm:p-12 border border-[#3ddc84]/30 overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(10,18,13,0.92) 0%, rgba(5,8,6,0.96) 100%)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Subtle Latverian Mask Watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-5 select-none pointer-events-none">
            <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor" className="text-[#3ddc84]">
              <polygon points="50,5 90,30 80,85 50,95 20,85 10,30" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="25" y="40" width="18" height="8" rx="2" fill="currentColor" />
              <rect x="57" y="40" width="18" height="8" rx="2" fill="currentColor" />
              <line x1="50" y1="20" x2="50" y2="75" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          {/* Top Bar HUD */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3ddc84] animate-ping" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#3ddc84]">
                LATVERIAN HOLO-TRANSMISSION // ENCRYPTED
              </span>
            </div>

            <button
              onClick={nextDecree}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-white/10 hover:border-[#3ddc84]/40 text-[10px] font-mono text-[#8a9490] hover:text-[#3ddc84] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>CYCLE DECREE</span>
            </button>
          </div>

          {/* Quote Display */}
          <div className="min-h-[110px] sm:min-h-[90px] flex items-center">
            <p
              className={`font-cinzel text-lg sm:text-2xl md:text-3xl text-[#f2f2f0] leading-snug transition-all duration-300 ${
                animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              &ldquo;{DECREES[index].quote}&rdquo;
            </p>
          </div>

          {/* Citation Footer */}
          <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between">
            <span className="text-xs font-mono text-[#c9a227] tracking-[0.2em] uppercase font-bold">
              {DECREES[index].citation}
            </span>

            <div className="flex items-center gap-1">
              {DECREES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`View decree ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === i ? "bg-[#3ddc84] w-5" : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
