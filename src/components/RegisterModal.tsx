"use client";

import React, { useState } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { ExternalLink, X, Copy, Check, Calendar, ShieldAlert } from "lucide-react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [copied, setCopied] = useState(false);
  const formUrl = EVENT_CONFIG.googleFormUrl;
  const isUrlConfigured =
    Boolean(formUrl) &&
    (formUrl.startsWith("http://") || formUrl.startsWith("https://")) &&
    !formUrl.includes("example.com");

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `${EVENT_CONFIG.name} — ${EVENT_CONFIG.subtitle}
Location: ${EVENT_CONFIG.location}
Time: ${EVENT_CONFIG.time}
Date: ${EVENT_CONFIG.date}
Department: ${EVENT_CONFIG.department}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Clockout 4.0//AIML Department//EN
BEGIN:VEVENT
SUMMARY:Clockout 4.0 — The Doom Takeover
DESCRIPTION:Clockout 4.0 at the AIML Department. Location: 4th Floor\\, AIML Department. Time: 2:00 PM onwards. Date: ${EVENT_CONFIG.date}.
LOCATION:${EVENT_CONFIG.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Clockout_4.0_Event.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-lg shadow-2xl glow-emerald overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "rgba(10,14,11,0.95)", border: "1px solid rgba(61,220,132,0.28)" }}
      >
        {/* Latverian Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(61,220,132,0.8), rgba(201,162,39,0.5), transparent)" }} />

        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-[#A3A8A4] hover:text-[#39D98A] transition-colors rounded-full hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-md border text-[#3ddc84]" style={{ background: "rgba(61,220,132,0.08)", borderColor: "rgba(61,220,132,0.25)" }}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#3ddc84] mb-0.5">
              Official Latverian Dispatch
            </div>
            <h3 id="modal-title" className="text-xl font-bold font-cinzel text-[#F7F7F6]">
              Registration Status
            </h3>
          </div>
        </div>

        {isUrlConfigured ? (
          <div className="space-y-4">
            <p className="text-sm text-[#A3A8A4] leading-relaxed">
              The official Google Form for <span className="text-[#F7F7F6] font-semibold">{EVENT_CONFIG.name}</span> is live.
              Click below to proceed to the registration form.
            </p>
            <div className="pt-2">
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#39D98A] hover:bg-[#34c77e] text-[#050605] font-bold text-sm tracking-wider uppercase rounded transition-all duration-300 shadow-lg hover:shadow-[#39D98A]/40"
              >
                <span>Proceed to Google Form</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded bg-[#050605]/80 border border-[#39D98A]/20">
              <div className="text-xs font-mono uppercase tracking-wider text-[#39D98A] mb-1">
                Portal Status: Awaiting Form Link
              </div>
              <p className="text-sm text-[#A3A8A4] leading-relaxed">
                The official registration Google Form link has not yet been attached to this deployment
                (<code className="text-xs text-[#39D98A] font-mono">NEXT_PUBLIC_GOOGLE_FORM_URL</code>).
                Registration will unlock once published by the AIML Department organizers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded border border-white/10">
                <div className="text-[#A3A8A4] uppercase tracking-wider">Venue</div>
                <div className="font-semibold text-[#F7F7F6] mt-0.5">{EVENT_CONFIG.location}</div>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/10">
                <div className="text-[#A3A8A4] uppercase tracking-wider">Time</div>
                <div className="font-semibold text-[#F7F7F6] mt-0.5">{EVENT_CONFIG.time}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#F7F7F6] font-medium tracking-wider uppercase transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#39D98A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Details Copied!" : "Copy Event Details"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#39D98A]/15 hover:bg-[#39D98A]/25 border border-[#39D98A]/30 text-xs text-[#39D98A] font-medium tracking-wider uppercase transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Save to Calendar</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[11px] text-[#A3A8A4]">
          <span>{EVENT_CONFIG.department}</span>
            <span className="font-mono" style={{ color: "#3ddc84" }}>LATVERIA // CLOCKOUT 4.0</span>
        </div>
      </div>
    </div>
  );
}
