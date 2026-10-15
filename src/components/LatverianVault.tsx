"use client";

import React, { useEffect, useRef } from "react";
import { Trophy, Award, Sparkles } from "lucide-react";

interface VaultReward {
  title: string;
  rank: string;
  category: string;
  perks: string[];
  borderGlow: string;
  isGrandPrize?: boolean;
}

const VAULT_REWARDS: VaultReward[] = [
  {
    title: "The Sovereign Victor",
    rank: "CHAMPION",
    category: "GRAND CHAMPION OF CLOCKOUT 4.0",
    perks: [
      "Clockout 4.0 Grand Sovereign Trophy",
      "Direct Faculty & Industry Mentorship Conclave",
      "Official Sovereign Champion Gold Credentials",
      "Exclusive Latverian Takeover Artifact Kit",
    ],
    borderGlow: "#c9a227",
    isGrandPrize: true,
  },
  {
    title: "Neural Architecture Laureate",
    rank: "FIRST RUNNER UP",
    category: "TECHNICAL COMPUTATIONAL EXCELLENCE",
    perks: [
      "Silver Latverian Seal of Distinction",
      "Advanced Research & Prototyping Commendation",
      "Faculty Certificate of Merit",
      "Clockout 4.0 Official Swag Package",
    ],
    borderGlow: "#3ddc84",
  },
  {
    title: "Innovation Vanguard",
    rank: "SECOND RUNNER UP",
    category: "RAPID APPLIED INTELLIGENCE",
    perks: [
      "Bronze Sovereign Seal Award",
      "Special Innovation Category Citation",
      "Verified Certificate of Achievement",
      "Department Commendation Badge",
    ],
    borderGlow: "#3ddc84",
  },
];

export default function LatverianVault() {
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
              }, i * 90);
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
      id="latverian-vault"
      className="relative z-10 w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      aria-label="Latverian Bounty & Rewards Vault"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16 sm:mb-20"
          data-animate
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c9a227]/30 text-[#c9a227] text-[10px] font-mono tracking-[0.35em] uppercase mb-5 glow-gold"
            style={{ background: "rgba(201,162,39,0.08)" }}
          >
            <Trophy className="w-3.5 h-3.5 text-[#c9a227]" />
            SOVEREIGN ACCLAIM & RECOGNITION
          </div>

          <h2 className="font-cinzel font-black text-4xl sm:text-6xl tracking-[0.08em] uppercase text-[#f2f2f0] leading-tight">
            The Latverian Vault
          </h2>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a227]/60" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#c9a227]">
              HONORS DECREED BY DOOM
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a227]/60" />
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {VAULT_REWARDS.map((reward, i) => (
            <div
              key={reward.title}
              data-animate
              className={`relative rounded-xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden group transition-all duration-300 ${
                reward.isGrandPrize
                  ? "border-2 border-[#c9a227]/60 bg-gradient-to-b from-[#141005] via-[#0d0f0c] to-[#070907] shadow-2xl glow-gold md:-translate-y-2"
                  : "border border-[#3ddc84]/20 bg-[#0a0d0b]/80 hover:border-[#3ddc84]/50 hover:bg-[#0c120e]"
              }`}
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s, border-color 0.3s, background 0.3s`,
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Grand prize banner */}
              {reward.isGrandPrize && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[9px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-bold ${
                      reward.isGrandPrize
                        ? "bg-[#c9a227] text-[#050605]"
                        : "bg-[#3ddc84]/15 text-[#3ddc84] border border-[#3ddc84]/30"
                    }`}
                  >
                    {reward.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                    {reward.isGrandPrize ? (
                      <Trophy className="w-4 h-4 text-[#c9a227]" />
                    ) : (
                      <Award className="w-4 h-4 text-[#3ddc84]" />
                    )}
                  </div>
                </div>

                <h3 className="font-cinzel font-black text-2xl text-[#f2f2f0] mb-1">
                  {reward.title}
                </h3>

                <p className="text-[10px] font-mono text-[#8a9490] tracking-wider uppercase mb-6">
                  {reward.category}
                </p>

                <div className="space-y-3 border-t border-white/10 pt-5 mb-8">
                  {reward.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-[#d1d5db]">
                      <span className="text-[#3ddc84] mt-0.5">•</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-[#8a9490] tracking-widest uppercase flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#c9a227]" />
                <span>LATVERIAN CERTIFIED RECORD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
