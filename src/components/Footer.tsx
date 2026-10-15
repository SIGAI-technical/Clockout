"use client";

import React from "react";
import { EVENT_CONFIG } from "@/config/event";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="relative z-10 w-full py-10 px-4 sm:px-6 lg:px-8 text-[11px] font-mono text-[#8a9490]"
      style={{ borderTop: "1px solid rgba(61,220,132,0.12)", background: "rgba(5,6,5,0.95)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center border border-[#3ddc84]/30 rounded-sm" style={{ background: "rgba(61,220,132,0.06)" }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L17 15H1L9 1Z" stroke="#3ddc84" strokeWidth="1.5" fill="none"/>
                <path d="M9 5L14 14H4L9 5Z" fill="#3ddc84" opacity="0.2"/>
                <circle cx="9" cy="9" r="1.5" fill="#3ddc84"/>
              </svg>
            </div>
            <div>
              <div className="font-cinzel font-bold text-xs text-[#f2f2f0] tracking-[0.15em] uppercase">
                {EVENT_CONFIG.name} — {EVENT_CONFIG.subtitle}
              </div>
              <div className="text-[10px] text-[#7bb898] mt-0.5">{EVENT_CONFIG.department}</div>
            </div>
          </div>

          {/* Center status */}
          <div className="flex items-center gap-2 text-center text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]" />
            <span>Official AIML Department Event • Registration via Google Forms</span>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-white/10 hover:border-[#3ddc84]/40 hover:text-[#3ddc84] transition-all cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <span>ASCEND</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-7 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] text-white/30" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span>© 2026 {EVENT_CONFIG.department}. All rights reserved under Latverian Sovereign Directive.</span>
          <span className="text-[#8a9490]/60">
            {EVENT_CONFIG.location} • {EVENT_CONFIG.time}
          </span>
        </div>
      </div>
    </footer>
  );
}
