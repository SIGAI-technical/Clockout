"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENT_CONFIG } from "@/config/event";
import { Calendar, MapPin, Clock } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Precise video durations
const V1_DUR = 6.966;
const V2_DUR = 6.166;
const V3_DUR = 9.25;

export interface CinematicScrollHandle {
  skipIntro: () => void;
  replayIntro: () => void;
}

interface CinematicScrollProps {
  onRegisterClick: () => void;
  onCinematicComplete?: (isCompleted: boolean) => void;
}

// Subtle ambient embers
const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  x: 6 + (i / 16) * 88,
  delay: (i * 0.38) % 4,
  dur: 3.5 + (i % 4) * 0.8,
  size: 2 + (i % 2),
  isGold: i % 3 === 2,
}));

function EmberParticle({
  x,
  delay,
  dur,
  size,
  isGold,
}: {
  x: number;
  delay: number;
  dur: number;
  size: number;
  isGold: boolean;
}) {
  return (
    <div
      className="absolute bottom-0 rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: isGold ? "rgba(201,162,39,0.7)" : "rgba(61,220,132,0.7)",
        animation: `ember-float ${dur}s ease-out ${delay}s infinite`,
        "--drift": `${(x - 50) * 0.8}px`,
      } as React.CSSProperties}
    />
  );
}

const CinematicScroll = forwardRef<CinematicScrollHandle, CinematicScrollProps>(
  ({ onRegisterClick, onCinematicComplete }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);

    const v1Ref = useRef<HTMLVideoElement>(null);
    const v2Ref = useRef<HTMLVideoElement>(null);
    const v3Ref = useRef<HTMLVideoElement>(null);

    const v1LayerRef = useRef<HTMLDivElement>(null);
    const t1LayerRef = useRef<HTMLDivElement>(null);
    const v2LayerRef = useRef<HTMLDivElement>(null);
    const t2LayerRef = useRef<HTMLDivElement>(null);
    const v3LayerRef = useRef<HTMLDivElement>(null);
    const freezeLayerRef = useRef<HTMLDivElement>(null);
    const heroOverlayRef = useRef<HTMLDivElement>(null);
    const progressWrapRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);

    // Stable callback ref and completion state
    const onCinematicCompleteRef = useRef(onCinematicComplete);
    useEffect(() => {
      onCinematicCompleteRef.current = onCinematicComplete;
    }, [onCinematicComplete]);
    const completedStateRef = useRef(false);

    // Non-blocking seek manager refs
    const isSeekingRef = useRef<Record<string, boolean>>({ v1: false, v2: false, v3: false });
    const pendingSeekRef = useRef<Record<string, number | null>>({ v1: null, v2: null, v3: null });
    const fallbackTimerRef = useRef<Record<string, NodeJS.Timeout | null>>({ v1: null, v2: null, v3: null });
    const executeSeekRef = useRef<(key: "v1" | "v2" | "v3", targetTime: number) => void>(() => {});

    // Primary seek execution
    const executeSeek = useCallback((key: "v1" | "v2" | "v3", targetTime: number) => {
      const video = key === "v1" ? v1Ref.current : key === "v2" ? v2Ref.current : v3Ref.current;
      if (!video || video.readyState < 1) return;

      const dur = video.duration || (key === "v1" ? V1_DUR : key === "v2" ? V2_DUR : V3_DUR);
      // Keep safely away from exact EOF (0.08s) so browsers never trigger loop or onended reset
      const clamped = Math.max(0, Math.min(dur - 0.08, targetTime));

      // Skip negligible changes (< 20ms)
      if (Math.abs(video.currentTime - clamped) < 0.02) return;

      if (isSeekingRef.current[key]) {
        pendingSeekRef.current[key] = clamped;
        return;
      }

      isSeekingRef.current[key] = true;

      if (fallbackTimerRef.current[key]) {
        clearTimeout(fallbackTimerRef.current[key]!);
      }
      fallbackTimerRef.current[key] = setTimeout(() => {
        isSeekingRef.current[key] = false;
        if (pendingSeekRef.current[key] !== null) {
          const next = pendingSeekRef.current[key]!;
          pendingSeekRef.current[key] = null;
          executeSeekRef.current(key, next);
        }
      }, 50);

      try {
        video.currentTime = clamped;
      } catch {
        isSeekingRef.current[key] = false;
      }
    }, []);

    useEffect(() => {
      executeSeekRef.current = executeSeek;
    }, [executeSeek]);

    // Seeked listener cleanup
    useEffect(() => {
      const timers = fallbackTimerRef.current;
      const videos: { key: "v1" | "v2" | "v3"; el: HTMLVideoElement | null }[] = [
        { key: "v1", el: v1Ref.current },
        { key: "v2", el: v2Ref.current },
        { key: "v3", el: v3Ref.current },
      ];

      const cleanupFns = videos.map(({ key, el }) => {
        if (!el) return () => {};
        const onSeeked = () => {
          if (timers[key]) {
            clearTimeout(timers[key]!);
            timers[key] = null;
          }
          isSeekingRef.current[key] = false;
          if (pendingSeekRef.current[key] !== null) {
            const next = pendingSeekRef.current[key]!;
            pendingSeekRef.current[key] = null;
            executeSeekRef.current(key, next);
          }
        };

        el.addEventListener("seeked", onSeeked, { passive: true });
        return () => el.removeEventListener("seeked", onSeeked);
      });

      return () => {
        cleanupFns.forEach((fn) => fn());
        Object.values(timers).forEach((t) => {
          if (t) clearTimeout(t);
        });
      };
    }, []);

    // Reliable Skip Intro: instantly jumps to final frame + reveals event details
    const handleSkipIntro = useCallback(() => {
      const trigger = ScrollTrigger.getById("cinematic-trigger");
      const endPos = trigger
        ? trigger.end
        : containerRef.current
        ? containerRef.current.offsetTop + containerRef.current.offsetHeight
        : document.body.scrollHeight;

      // Cancel any pending seeks
      pendingSeekRef.current.v1 = null;
      pendingSeekRef.current.v2 = null;
      pendingSeekRef.current.v3 = null;

      // Instantly hide earlier video and transition layers
      if (v1LayerRef.current) v1LayerRef.current.style.opacity = "0";
      if (t1LayerRef.current) {
        t1LayerRef.current.style.opacity = "0";
        t1LayerRef.current.style.visibility = "hidden";
      }
      if (v2LayerRef.current) v2LayerRef.current.style.opacity = "0";
      if (t2LayerRef.current) {
        t2LayerRef.current.style.opacity = "0";
        t2LayerRef.current.style.visibility = "hidden";
      }
      if (v3LayerRef.current) v3LayerRef.current.style.opacity = "1";

      // Instantly reveal freeze frame & registration details
      if (freezeLayerRef.current) freezeLayerRef.current.style.opacity = "1";
      if (heroOverlayRef.current) {
        heroOverlayRef.current.style.opacity = "1";
        heroOverlayRef.current.style.transform = "translateY(0)";
        heroOverlayRef.current.style.visibility = "visible";
        heroOverlayRef.current.style.pointerEvents = "auto";
      }
      if (progressWrapRef.current) {
        progressWrapRef.current.style.opacity = "0";
      }

      // Scroll smoothly to registration area
      window.scrollTo({ top: endPos, behavior: "auto" });

      if (!completedStateRef.current) {
        completedStateRef.current = true;
        onCinematicCompleteRef.current?.(true);
      }
    }, []);

    // Replay Intro: reset to beginning
    const handleReplayIntro = useCallback(() => {
      window.scrollTo({ top: 0, behavior: "auto" });

      [v1Ref, v2Ref, v3Ref].forEach((r) => {
        if (r.current) {
          try {
            r.current.currentTime = 0;
          } catch {}
        }
      });

      if (v1LayerRef.current) v1LayerRef.current.style.opacity = "1";
      if (t1LayerRef.current) {
        t1LayerRef.current.style.opacity = "0";
        t1LayerRef.current.style.visibility = "hidden";
      }
      if (v2LayerRef.current) v2LayerRef.current.style.opacity = "0";
      if (t2LayerRef.current) {
        t2LayerRef.current.style.opacity = "0";
        t2LayerRef.current.style.visibility = "hidden";
      }
      if (v3LayerRef.current) v3LayerRef.current.style.opacity = "0";
      if (freezeLayerRef.current) freezeLayerRef.current.style.opacity = "0";
      if (heroOverlayRef.current) {
        heroOverlayRef.current.style.opacity = "0";
        heroOverlayRef.current.style.visibility = "hidden";
        heroOverlayRef.current.style.pointerEvents = "none";
      }
      if (progressWrapRef.current) {
        progressWrapRef.current.style.opacity = "1";
      }

      if (completedStateRef.current) {
        completedStateRef.current = false;
        onCinematicCompleteRef.current?.(false);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      skipIntro: handleSkipIntro,
      replayIntro: handleReplayIntro,
    }));

    // Detect mobile screen
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 768);
      check();
      window.addEventListener("resize", check, { passive: true });
      return () => window.removeEventListener("resize", check);
    }, []);

    // Prime videos once on mount
    const primedRef = useRef(false);
    useEffect(() => {
      if (primedRef.current) return;
      primedRef.current = true;
      [v1Ref, v2Ref, v3Ref].forEach((r) => {
        if (r.current) {
          r.current.muted = true;
          r.current.playsInline = true;
          r.current.setAttribute("webkit-playsinline", "true");
        }
      });
    }, []);

    // Main GSAP ScrollTrigger Integration
    useEffect(() => {
      const container = containerRef.current;
      const stage = stageRef.current;
      if (!container || !stage) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        requestAnimationFrame(() => {
          completedStateRef.current = true;
          onCinematicCompleteRef.current?.(true);
        });
        return;
      }

      const scrollHeightMultiplier = isMobile ? 4.5 : 6.0;

      const ctx = gsap.context(() => {
        const st = ScrollTrigger.create({
          id: "cinematic-trigger",
          trigger: container,
          start: "top top",
          end: `+=${scrollHeightMultiplier * 100}%`,
          pin: stage,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            const isComplete = p >= 0.88;
            if (completedStateRef.current !== isComplete) {
              completedStateRef.current = isComplete;
              onCinematicCompleteRef.current?.(isComplete);
            }

            // ── Phase 1: Video 1 (0.00 → 0.22) ──────────────────
            if (p <= 0.23) {
              const t = Math.min(1, Math.max(0, p / 0.20)) * V1_DUR;
              executeSeekRef.current("v1", t);
              if (v1LayerRef.current) {
                // Fade to complete pitch black as video 1 ends
                const fade = p > 0.16 ? Math.max(0, (0.21 - p) / 0.05) : 1;
                v1LayerRef.current.style.opacity = `${fade}`;
              }
            } else if (v1LayerRef.current) {
              v1LayerRef.current.style.opacity = "0";
            }

            // ── Phase 2: Transition 1 (Full Pitch Black) (0.21 → 0.38) ──
            if (t1LayerRef.current) {
              if (p >= 0.19 && p <= 0.39) {
                let op = 0;
                if (p >= 0.20 && p < 0.25) op = (p - 0.20) / 0.05;
                else if (p >= 0.25 && p <= 0.33) op = 1;
                else if (p > 0.33 && p <= 0.38) op = (0.38 - p) / 0.05;
                op = Math.max(0, Math.min(1, op));
                t1LayerRef.current.style.opacity = `${op}`;
                t1LayerRef.current.style.visibility = op > 0 ? "visible" : "hidden";
              } else {
                t1LayerRef.current.style.opacity = "0";
                t1LayerRef.current.style.visibility = "hidden";
              }
            }

            // ── Phase 3: Video 2 (Hallway) (0.38 → 0.58) ─────────────
            if (p >= 0.36 && p <= 0.60) {
              const t = Math.min(1, Math.max(0, (p - 0.38) / 0.18)) * V2_DUR;
              executeSeekRef.current("v2", t);
              if (v2LayerRef.current) {
                let op = 1;
                if (p < 0.40) op = (p - 0.36) / 0.04;
                else if (p > 0.53) op = (0.58 - p) / 0.05;
                v2LayerRef.current.style.opacity = `${Math.max(0, Math.min(1, op))}`;
              }
            } else if (v2LayerRef.current) {
              v2LayerRef.current.style.opacity = "0";
            }

            // ── Phase 4: Transition 2 (Full Pitch Black) (0.57 → 0.72) ──
            if (t2LayerRef.current) {
              if (p >= 0.56 && p <= 0.73) {
                let op = 0;
                if (p >= 0.57 && p < 0.62) op = (p - 0.57) / 0.05;
                else if (p >= 0.62 && p <= 0.68) op = 1;
                else if (p > 0.68 && p <= 0.73) op = (0.73 - p) / 0.05;
                op = Math.max(0, Math.min(1, op));
                t2LayerRef.current.style.opacity = `${op}`;
                t2LayerRef.current.style.visibility = op > 0 ? "visible" : "hidden";
              } else {
                t2LayerRef.current.style.opacity = "0";
                t2LayerRef.current.style.visibility = "hidden";
              }
            }

            // ── Phase 5: Video 3 (Throne Reveal) (0.71 → 0.88) ───────
            if (p >= 0.70 && p < 0.88) {
              const t = Math.min(1, Math.max(0, (p - 0.72) / 0.15)) * (V3_DUR - 0.08);
              executeSeekRef.current("v3", t);
              if (v3LayerRef.current) {
                let op = 1;
                if (p < 0.74) op = (p - 0.70) / 0.04;
                v3LayerRef.current.style.opacity = `${Math.max(0, Math.min(1, op))}`;
              }
            } else if (p >= 0.88) {
              // Video 3 reached final frame, clear any seeks and keep steady under freeze layer
              pendingSeekRef.current.v3 = null;
              if (fallbackTimerRef.current.v3) {
                clearTimeout(fallbackTimerRef.current.v3);
                fallbackTimerRef.current.v3 = null;
              }
              isSeekingRef.current.v3 = false;
              if (v3LayerRef.current) {
                v3LayerRef.current.style.opacity = "1";
              }
            } else if (v3LayerRef.current) {
              v3LayerRef.current.style.opacity = "0";
            }

            // ── Phase 6: Smooth Transition to Freeze Frame + Details (0.85 → 1.00) ──
            if (freezeLayerRef.current) {
              const op = p >= 0.85 ? Math.min(1, (p - 0.85) / 0.05) : 0;
              freezeLayerRef.current.style.opacity = `${op}`;
            }

            if (heroOverlayRef.current) {
              if (p >= 0.86) {
                const prog = Math.min(1, Math.max(0, (p - 0.86) / 0.06));
                heroOverlayRef.current.style.opacity = `${prog}`;
                heroOverlayRef.current.style.transform = `translateY(${(1 - prog) * 14}px)`;
                heroOverlayRef.current.style.pointerEvents = prog > 0.2 ? "auto" : "none";
                heroOverlayRef.current.style.visibility = "visible";
              } else {
                heroOverlayRef.current.style.opacity = "0";
                heroOverlayRef.current.style.visibility = "hidden";
                heroOverlayRef.current.style.pointerEvents = "none";
              }
            }

            // Minimal scroll prompt visibility
            if (progressWrapRef.current) {
              progressWrapRef.current.style.opacity = isComplete ? "0" : "1";
            }
          },
        });

        return () => st.kill();
      }, container);

      return () => {
        ctx.revert();
      };
    }, [isMobile]);

    return (
      <section
        ref={containerRef}
        id="cinematic-container"
        className="relative w-full"
        style={{ minHeight: isMobile ? "450vh" : "600vh" }}
        aria-label="Clockout 4.0 Cinematic Experience"
      >
        {/* ── Sticky Pinned Stage ── */}
        <div
          ref={stageRef}
          id="cinematic-stage"
          className="sticky top-0 w-full overflow-hidden select-none bg-[#000000]"
          style={{ height: "100svh" }}
        >
          {/* ── Film Grain & Grading Overlay (Anti-Pixelation) ── */}
          <div
            className="absolute inset-0 z-15 pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(rgba(61,220,132,0.12) 1px, transparent 1px)`,
              backgroundSize: "3px 3px",
            }}
          />

          {/* ── Video 1: Castle Entrance ── */}
          <div
            ref={v1LayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 1 }}
          >
            <video
              ref={v1Ref}
              src="/videos/v1_hd.mp4"
              poster="/images/v1_poster.jpg"
              muted
              playsInline
              loop={false}
              onEnded={(e) => {
                e.currentTarget.pause();
              }}
              preload="auto"
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center center",
                filter: "contrast(1.08) brightness(0.92) saturate(1.15)",
              }}
            />
          </div>

          {/* ── Transition 1: Full Pitch Black with Specific Text ── */}
          <div
            ref={t1LayerRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{
              opacity: 0,
              visibility: "hidden",
              background: "#000000",
            }}
          >
            <h2 className="font-cinzel font-black text-3xl sm:text-5xl md:text-6xl tracking-[0.14em] uppercase text-[#f2f2f0] leading-tight mb-4">
              THE GATES HAVE OPENED
            </h2>

            <p className="font-cinzel text-xs sm:text-base md:text-lg tracking-[0.25em] uppercase text-[#3ddc84]">
              ARE YOU READY TO FACE WHAT LIES AHEAD
            </p>
          </div>

          {/* ── Video 2: Hallway ── */}
          <div
            ref={v2LayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0 }}
          >
            <video
              ref={v2Ref}
              src="/videos/v2_hd.mp4"
              poster="/images/v2_poster.jpg"
              muted
              playsInline
              loop={false}
              onEnded={(e) => {
                e.currentTarget.pause();
              }}
              preload="auto"
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center center",
                filter: "contrast(1.08) brightness(0.92) saturate(1.15)",
              }}
            />
          </div>

          {/* ── Transition 2: Full Pitch Black with Specific Text ── */}
          <div
            ref={t2LayerRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{
              opacity: 0,
              visibility: "hidden",
              background: "#000000",
            }}
          >
            <h2 className="font-cinzel font-black text-3xl sm:text-5xl md:text-6xl tracking-[0.14em] uppercase text-[#f2f2f0] leading-tight mb-4">
              THE RULER AWAITS
            </h2>

            <p className="font-cinzel text-xs sm:text-base md:text-lg tracking-[0.25em] uppercase text-[#c9a227]">
              ENTER THE SANCTUM OF DOOM
            </p>
          </div>

          {/* ── Video 3: Throne Reveal ── */}
          <div
            ref={v3LayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0 }}
          >
            <video
              ref={v3Ref}
              src="/videos/v3_hd.mp4"
              poster="/images/v3_poster.jpg"
              muted
              playsInline
              loop={false}
              onEnded={(e) => {
                e.currentTarget.pause();
              }}
              preload="auto"
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center center",
                filter: "contrast(1.08) brightness(0.92) saturate(1.15)",
              }}
            />
          </div>

          {/* ── Permanent Freeze Frame (Doctor Doom on Throne) ── */}
          <div
            ref={freezeLayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/v3_freeze_frame.jpg"
              alt="Doctor Doom on the Throne"
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center center",
                filter: "contrast(1.08) brightness(0.92) saturate(1.15)",
              }}
            />
          </div>

          {/* ── Cinematic Darkening Vignette ── */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.95) 100%)",
            }}
          />

          {/* ── Subtle Floating Embers ── */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {EMBERS.map((e, i) => (
              <EmberParticle
                key={i}
                x={e.x}
                delay={e.delay}
                dur={e.dur}
                size={e.size}
                isGold={e.isGold}
              />
            ))}
          </div>

          {/* ── Minimalist Scroll Prompt ── */}
          <div
            ref={progressWrapRef}
            className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500"
          >
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-white/50 animate-pulse">
              scroll ↓
            </span>
          </div>

          {/* ── Final Stage: Smooth Event Details Reveal Over Throne ── */}
          <div
            ref={heroOverlayRef}
            id="main-hero"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {/* Subtle atmospheric backdrop blur & shade for maximum readability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 85% 70% at 50% 55%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 100%)",
              }}
            />

            {/* Department Label */}
            <div
              className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3ddc84]/35 text-[#3ddc84] text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase mb-4 sm:mb-6 backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.75)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84] animate-ping" />
              <span>AIML DEPARTMENT PRESENTS</span>
            </div>

            {/* Main Event Title */}
            <h1
              className="relative z-10 font-cinzel font-black uppercase text-[#f2f2f0] leading-none tracking-[0.08em] drop-shadow-2xl"
              style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)" }}
            >
              CLOCKOUT 4.0
            </h1>

            {/* Subtitle */}
            <div
              className="relative z-10 mt-3 sm:mt-4 font-cinzel font-bold uppercase tracking-[0.22em] text-[#3ddc84]"
              style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.6rem)" }}
            >
              {EVENT_CONFIG.subtitle}
            </div>

            {/* Streamlined Event Information Bar: Date, Venue, Time */}
            <div
              className="relative z-10 mt-6 sm:mt-8 p-4 sm:p-5 rounded-lg border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-[#e5e7eb] max-w-2xl w-full"
              style={{ background: "rgba(10,14,11,0.85)" }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3ddc84] shrink-0" />
                <span>
                  <strong className="text-white">VENUE:</strong> {EVENT_CONFIG.location}
                </span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-white/20" />

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c9a227] shrink-0" />
                <span>
                  <strong className="text-white">DATE:</strong> {EVENT_CONFIG.date}
                </span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-white/20" />

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3ddc84] shrink-0" />
                <span>
                  <strong className="text-white">TIME:</strong> {EVENT_CONFIG.time}
                </span>
              </div>
            </div>

            {/* Prominent Register Button */}
            <div className="relative z-10 mt-6 sm:mt-8 pointer-events-auto">
              <button
                onClick={onRegisterClick}
                type="button"
                className="group relative px-10 sm:px-14 py-4 sm:py-5 bg-[#3ddc84] hover:bg-[#34c97a] text-[#050605] font-black font-mono text-sm sm:text-base tracking-[0.2em] uppercase rounded-sm transition-all duration-200 glow-emerald hover:scale-105 cursor-pointer shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  REGISTER NOW
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

CinematicScroll.displayName = "CinematicScroll";
export default CinematicScroll;
