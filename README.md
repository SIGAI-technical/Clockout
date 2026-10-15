# Clockout 4.0 — The Doom Takeover
### AIML Department Presents

An interactive cinematic web experience for **Clockout 4.0**, themed after Doctor Doom's sovereign takeover and Avengers: Doomsday.

---

## Key Features & Architecture

1. **Ultra-Smooth Cinematic Scroll Engine (`CinematicScroll.tsx`)**
   - Non-blocking sequential seek queue (`seeked` event listener + `fastSeek` hardware acceleration).
   - Prevents browser decoder stalls, dropped frames, and stuck scrubbing across desktop and mobile.
   - Pinned GSAP ScrollTrigger timeline orchestrating three consecutive chapters:
     - **Chapter 1: The Gates** (Video 1 + Latverian Sovereign Protocol)
     - **Chapter 2: The Hallway** (Video 2 + The Ruler Awaits)
     - **Chapter 3: The Throne** (Video 3 + Doctor Doom Freeze Frame & Hero Reveal)

2. **Anti-Pixelation Treatment & Hollywood Film Aesthetic**
   - Procedural SVG film grain overlay that binds digital compression artifacts.
   - Cinematic color grading filter (`contrast(1.08) brightness(0.92) saturate(1.15)`).
   - Anamorphic edge vignetting and Latverian tactical HUD framing.

3. **Mobile-First Responsiveness**
   - Quick Chapter Navigation Pills (`01 GATES`, `02 HALL`, `03 THRONE`).
   - Hands-free **Auto-Play** mode for instant cinematic playback without excessive scrolling.
   - Adaptive scroll multiplier (4.2x on mobile vs 6.0x on desktop) for comfortable thumb scrolling.
   - Fully responsive modal, cards, grids, and touch targets.

4. **Avengers: Doomsday Lore & Animations**
   - Rotating Latverian Eldritch Sorcery Runes (Doctor Doom's green mystical shields).
   - **Decrees of Doom (`DoomDecrees.tsx`)**: Interactive holographic communicator cycling Doctor Doom quotes.
   - **Mission Chronology (`DoomsdayTimeline.tsx`)**: Interactive 3-phase takeover breakdown (The Breach, The Crucible, Throne Judgment).
   - **The Latverian Vault (`LatverianVault.tsx`)**: Tiers of sovereign awards, trophies, and commendations.
   - **Directives & FAQ (`DoomsdayFaq.tsx`)**: Expandable rules accordion for eligibility, squads, and criteria.
   - Ambient Web Audio synthesizer drone with toggle in the navbar.

---

## Configuration

Event details are centralized in [`src/config/event.ts`](file:///Users/roystonsoans/Desktop/Clockout/src/config/event.ts):

- `name`: "Clockout 4.0"
- `subtitle`: "THE DOOM TAKEOVER"
- `location`: "4th Floor, AIML Department"
- `time`: "2:00 PM onwards"
- `date`: "To be provided"
- `googleFormUrl`: Provide via environment variable `NEXT_PUBLIC_GOOGLE_FORM_URL` in `.env.local` or directly in the config.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Building for Production

```bash
npm run build
npm start
```
