"use client";

import React, { useEffect, useRef } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { ExternalLink, MapPin, Clock, Calendar, ShieldAlert } from "lucide-react";

interface RegistrationCtaProps {
  onRegisterClick: () => void;
}

export default function RegistrationCta({ onRegisterClick }: RegistrationCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const formUrl = EVENT_CONFIG.googleFormUrl;
  const isUrlConfigured =
    Boolean(formUrl) &&
    (formUrl.startsWith("http://") || formUrl.startsWith("https://")) &&
    !formUrl.includes("example.com");

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
              }, i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="registration-cta"
      className="relative z-10 w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8"
      aria-label="Registration"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-2xl overflow-hidden text-center"
          data-animate
          style={{
            opacity: 0,
            transform: "translateY(32px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            background: "rgba(8,12,9,0.88)",
            border: "1px solid rgba(61,220,132,0.22)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Ambient emerald backlight */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(61,220,132,0.07) 0%, transparent 70%)",
          }} />

          {/* Top gold accent line */}
          <div className="absolute top-0 inset-x-0 h-px" style={{
            background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.6), rgba(61,220,132,0.6), transparent)",
          }} />

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[#3ddc84]/30 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-[#3ddc84]/30 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-[#c9a227]/30 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[#c9a227]/30 rounded-br-sm pointer-events-none" />

          <div className="relative z-10 px-8 sm:px-14 py-14 sm:py-16">
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#3ddc84]/35 text-[#3ddc84] text-[10px] font-mono tracking-[0.35em] uppercase mb-7 glow-emerald"
              data-animate
              style={{ opacity: 0, transform: "translateY(16px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", background: "rgba(61,220,132,0.1)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84] animate-pulse" />
              PORTAL READY — ACCESS PROTOCOL
            </div>

            <h2
              className="font-cinzel font-black text-3xl sm:text-5xl md:text-6xl tracking-[0.08em] uppercase text-[#f2f2f0] leading-tight"
              data-animate
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}
            >
              READY TO ENTER<br />
              <span className="shimmer-gold">DOOM&apos;S DOMAIN?</span>
            </h2>

            <div
              className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg font-cinzel font-semibold tracking-[0.22em] uppercase shimmer-text"
              data-animate
              style={{ opacity: 0, transform: "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
            >
              SECURE YOUR ACCESS TO CLOCKOUT 4.0
            </div>

            <p
              className="mt-5 text-sm text-[#8a9490] max-w-xl mx-auto leading-relaxed"
              data-animate
              style={{ opacity: 0, transform: "translateY(16px)", transition: "opacity 0.7s ease 0.38s, transform 0.7s ease 0.38s" }}
            >
              Traverse the fortress of the AIML Department. Take your place before the sovereign conclave.
              Registration is processed exclusively through Google Forms.
            </p>

            {/* CTA */}
            <div
              className="mt-10 sm:mt-12 flex flex-col items-center gap-4"
              data-animate
              style={{ opacity: 0, transform: "translateY(16px)", transition: "opacity 0.7s ease 0.46s, transform 0.7s ease 0.46s" }}
            >
              {isUrlConfigured ? (
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-10 sm:px-14 py-4 sm:py-5 bg-[#3ddc84] hover:bg-[#34c97a] text-[#050605] font-black font-mono text-sm sm:text-base tracking-[0.2em] uppercase rounded-sm glow-emerald-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  REGISTER NOW
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <button
                  onClick={onRegisterClick}
                  type="button"
                  className="group inline-flex items-center gap-3 px-10 sm:px-14 py-4 sm:py-5 bg-[#3ddc84] hover:bg-[#34c97a] text-[#050605] font-black font-mono text-sm sm:text-base tracking-[0.2em] uppercase rounded-sm glow-emerald-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  REGISTER NOW
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}

              {!isUrlConfigured && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#7bb898]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#3ddc84]" />
                  Google Form link will be attached directly by organizers
                </div>
              )}
            </div>

            {/* Quick info strip */}
            <div
              className="mt-12 pt-7 border-t border-white/8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] font-mono text-[#8a9490]"
              data-animate
              style={{ opacity: 0, transform: "translateY(12px)", transition: "opacity 0.7s ease 0.54s, transform 0.7s ease 0.54s" }}
            >
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#3ddc84]" />
                {EVENT_CONFIG.location}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#3ddc84]" />
                {EVENT_CONFIG.time}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#c9a227]" />
                {EVENT_CONFIG.date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
