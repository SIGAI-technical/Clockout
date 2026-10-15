"use client";

import React from "react";
import Image from "next/image";

interface BackgroundThroneProps {
  opacity?: number;
  dimLevel?: number; // 0 to 1 dark overlay
}

export default function BackgroundThrone({
  opacity = 1,
  dimLevel = 0.55,
}: BackgroundThroneProps) {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ease-out"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* High-Resolution Freeze Frame of Doctor Doom's Throne */}
      <Image
        src="/images/v3_freeze_frame.jpg"
        alt="Doctor Doom on the Throne"
        fill
        priority
        className="object-cover object-center select-none transform-gpu"
        sizes="100vw"
        quality={75}
      />

      {/* Volumetric Lighting Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(61,220,132,0.06) 0%, rgba(5,6,5,0.42) 55%, rgba(5,6,5,0.9) 100%)",
        }}
      />

      {/* Dynamic Dim Level for Content Readability */}
      <div
        className="absolute inset-0 bg-[#050605] transition-opacity duration-500"
        style={{ opacity: dimLevel }}
      />

      {/* Subtle Bottom & Top Cinematic Gradients */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#050605] via-[#050605]/60 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#050605] via-[#050605]/80 to-transparent" />


    </div>
  );
}
