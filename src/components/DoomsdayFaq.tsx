"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  code: string;
}

const FAQS: FaqItem[] = [
  {
    code: "FAQ-01",
    question: "Who is eligible to participate in Clockout 4.0?",
    answer:
      "Clockout 4.0 is open to all undergraduate and postgraduate students interested in AI, machine learning, systems engineering, and rapid software development. Multidisciplinary teams are strongly encouraged.",
  },
  {
    code: "FAQ-02",
    question: "What is the team size and composition protocol?",
    answer:
      "Participants can register in squads of 2 to 4 members. Solo participants may also apply and participate independently or connect with other engineers during Phase 01: The Breach.",
  },
  {
    code: "FAQ-03",
    question: "How is official registration confirmed?",
    answer:
      "Registration is processed exclusively through the official Google Form. Once submitted, your squad's credentials will be logged in the Latverian roster and email confirmations dispatched prior to the event.",
  },
  {
    code: "FAQ-04",
    question: "What equipment should squads bring to the proving grounds?",
    answer:
      "Squads must bring their own laptops, chargers, and development dependencies. High-speed connectivity, power outlets, testing environments, and faculty mentorship will be accessible throughout the 4th Floor proving grounds.",
  },
  {
    code: "FAQ-05",
    question: "What are the primary criteria for judging and the throne pitch?",
    answer:
      "Submissions are evaluated on technical innovation, model robustness, practical problem-solving impact, codebase craftsmanship, and the clarity of your final demonstration before the jury.",
  },
];

export default function DoomsdayFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="event-faq"
      className="relative z-10 w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3ddc84]/30 text-[#3ddc84] text-[10px] font-mono tracking-[0.35em] uppercase mb-4 glow-emerald"
            style={{ background: "rgba(61,220,132,0.08)" }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            DIRECTIVES & PROTOCOLS
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-5xl uppercase text-[#f2f2f0] leading-tight">
            Frequently Asked Directives
          </h2>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#3ddc84]/60" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#7bb898]">
              LATVERIAN CODE OF CONDUCT & RULES
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#3ddc84]/60" />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.code}
                className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#3ddc84]/40 bg-[#0c130e]"
                    : "border-white/10 bg-[#080b09]/80 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  type="button"
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[#3ddc84] font-bold tracking-wider">
                      {faq.code}
                    </span>
                    <span className="font-cinzel font-bold text-base sm:text-lg text-[#f2f2f0]">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-[#7bb898] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#3ddc84]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-[#a3a8a4] leading-relaxed border-t border-white/5 pt-4">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
