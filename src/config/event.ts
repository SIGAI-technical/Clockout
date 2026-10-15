export interface EventHighlight {
  id: string;
  title: string;
  category: string;
  description: string;
  statusBadge: string;
}

export interface EventConfig {
  name: string;
  edition: string;
  subtitle: string;
  entryTagline: string;
  location: string;
  department: string;
  floor: string;
  time: string;
  date: string;
  googleFormUrl: string;
  theme: {
    background: string;
    secondaryBg: string;
    emerald: string;
    mutedGreen: string;
    gold: string;
    textPrimary: string;
    textSecondary: string;
  };
  briefing: {
    headline: string;
    statement: string;
    decree: string;
  };
  highlights: EventHighlight[];
}

export const EVENT_CONFIG: EventConfig = {
  name: "Clockout 4.0",
  edition: "4.0",
  subtitle: "THE DOOM TAKEOVER",
  entryTagline: "YOUR ENTRY BEGINS NOW.",
  location: "4th Floor, AIML Department",
  department: "Department of Artificial Intelligence & Machine Learning",
  floor: "4th Floor",
  time: "2:00 PM onwards",
  date: "To be provided", // The event date has not been provided. Do not invent one.
  googleFormUrl: process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "", // Configurable Google Form URL
  theme: {
    background: "#050605",
    secondaryBg: "#101311",
    emerald: "#39D98A",
    mutedGreen: "#85C99B",
    gold: "#D4AF37",
    textPrimary: "#F7F7F6",
    textSecondary: "#A3A8A4",
  },
  briefing: {
    headline: "THE SOVEREIGN SUMMONS",
    statement:
      "Doctor Doom has cast his shadow across the AIML Department. Clockout 4.0 transforms the proving grounds into a theater of calculated dominance, where intellect, strategy, and resilience define your standing before the throne.",
    decree:
      "Attendance is not merely requested — it is decreed. Traverse the grand hall, behold the throne, and pledge your presence in Latveria's technological vanguard.",
  },
  highlights: [
    {
      id: "highlight-1",
      title: "Algorithmic Gauntlet",
      category: "TECHNICAL PROVING GROUND",
      description:
        "High-stakes problem-solving arena testing algorithmic agility, rapid execution, and computational mastery under the gaze of Doom.",
      statusBadge: "Track briefing releasing soon",
    },
    {
      id: "highlight-2",
      title: "Neural Dominion Challenge",
      category: "INTELLIGENCE & AI ARENA",
      description:
        "Frontier exploration into artificial intelligence, machine learning architectures, and strategic optimization.",
      statusBadge: "Format unveiling soon",
    },
    {
      id: "highlight-3",
      title: "Latverian Sprint Sprintathon",
      category: "RAPID INNOVATION PROTOCOL",
      description:
        "A concentrated burst of collaborative innovation where solutions are forged against the clock with uncompromising precision.",
      statusBadge: "Rules releasing soon",
    },
    {
      id: "highlight-4",
      title: "The Grand Assembly",
      category: "CONCLAVE & HONORS",
      description:
        "The climactic gathering where triumphant minds are recognized and the sovereign legacy of Clockout 4.0 is etched into history.",
      statusBadge: "Schedule releasing soon",
    },
  ],
};
