# Code of the Caribbean 2026 — Hackathon Landing Page

> **prototype for hackathon landing page for DJS-CSI interviews.(Task 2)**  
> **Author / Developer:** Rohit Gupta

---

## 🏴‍☠️ Project Overview

<<<<<<< HEAD
**Code of the Caribbean 2026** is a polished, animated, interactive single-page landing page designed for the flagship annual 24-hour hackathon. Made for interview for web tech in  **DJS-CSI** (Computer Society of India student chapter at Dwarkadas J. Sanghvi College of Engineering, Mumbai).
=======
**Code of the Caribbean 2026** is a production-grade, animated, interactive single-page landing page designed for the flagship annual 24-hour hackathon. Made for interview for web tech in  **DJS-CSI** (Computer Society of India student chapter at Dwarkadas J. Sanghvi College of Engineering, Mumbai).
>>>>>>> origin/main

The application is built with **React**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lucide React**. It delivers a high-contrast nautical Caribbean visual identity and follows a clear user journey:
**Discover → Understand → Get Excited → Register**.

---

## 🧠 Architectural & Feature Logic

Below is a detailed breakdown of the technical logic and design decisions powering each feature of the platform:

---

### 1. ⏱️ Voyage Countdown Chronometer (The Clock)
* **Goal**: Provide a live countdown to the hackathon kick-off (October 24, 2026, 09:00 AM IST) without degrading page rendering performance.
* **Logic & Implementation**:
  - **Time Delta Calculation**: At every 1-second interval, the component computes the difference:
    $$\Delta t = \text{Target Timestamp} - \text{Current Timestamp}$$
  - **Mathematical Breakdown**:
    - $\text{Days} = \lfloor \Delta t / (1000 \times 60 \times 60 \times 24) \rfloor$
    - $\text{Hours} = \lfloor (\Delta t / (1000 \times 60 \times 60)) \bmod 24 \rfloor$
    - $\text{Minutes} = \lfloor (\Delta t / (1000 \times 60)) \bmod 60 \rfloor$
    - $\text{Seconds} = \lfloor (\Delta t / 1000) \bmod 60 \rfloor$
  - **Isolated State Optimization**: The chronometer is encapsulated inside a `memo` component (`VoyageCountdownChronometer`). State updates every 1,000ms remain localized to the timer card, completely preventing unnecessary re-renders across the rest of the 2,000-line DOM tree.
  - **Memory Leak Protection**: The `setInterval` reference is stored and automatically cleared inside the `useEffect` cleanup return handler when the component unmounts.

---

### 2. ⛵ Sailing Ship Animation & Synchronized Auto-Scroll
* **Goal**: Create a themed micro-interaction when navigating between sections.
* **Logic & Implementation**:
  - **Event Interception**: The `handleNavClick` callback intercepts default anchor link clicks (`e.preventDefault()`).
  - **Sailing Ship Overlay**: Triggering navigation toggles `isSailing = true`, rendering a full-width floating ship with dynamic water wake ripples moving across the viewport from `x: -100vw` to `x: 100vw` over 1.5 seconds via Framer Motion.
  - **Mid-Point Synchronized Scrolling**: Using a managed `scrollTimerRef` set to 750ms (the exact moment the ship passes the center of the screen), the window initiates a smooth scroll (`window.scrollTo` or `element.scrollIntoView({ behavior: 'smooth' })`).
  - **Ref-Based Cleanup**: `scrollTimerRef` and `finishTimerRef` use React `useRef` to prevent timer stacking, race conditions, and memory leaks if users rapidly click multiple nav links.
  - **Accessibility (`useReducedMotion`)**: Integrates Motion's `useReducedMotion()` hook to immediately bypass the delay and animations for users with motion sensitivity.

---

### 3. 📜 Dynamic Crew Manifest Registration & Boarding Pass System
* **Goal**: Enable teams of 1 to 4 sailors to register for specific tracks and receive an instant boarding pass with zero backend latency.
* **Logic & Implementation**:
  - **Dynamic Crew Array Slicing**: When the user selects a crew size (1 to 4), the form dynamically slices and renders the exact number of member cards while preserving filled data.
  - **Role & Icon Allocation**: Distinct roles are assigned (Captain / Primary Contact, Navigator, Gunner, Quartermaster). To optimize rendering, `getCrewRoleIcon(index)` is evaluated via a static switch function instead of allocating inline arrays during keystrokes.
  - **Deterministic Ticket ID Generator**: On submission, a unique ticket ID is generated using the pattern:
    $$\text{Ticket ID} = \text{"COTCS-"} + \lfloor 100000 + \text{Math.random}() \times 900000 \rfloor$$
  - **Celebration Confetti**: Triggers `canvas-confetti` particles customized with royal blue, azure, gold, and white hues.
  - **Interactive Boarding Pass**: Renders a printable pass displaying the team name, college, selected track, ticket number, and all member rosters.
  - **One-Click Copy with Feedback**: Copies the ticket ID to the system clipboard via `navigator.clipboard.writeText`, providing a 2-second visual confirmation managed by `copyTimeoutRef`.
  - **Modal UX**: Automatically locks document body scroll (`document.body.style.overflow = 'hidden'`) and attaches an `Escape` key listener for accessibility.

---

### 4. 🗺️ The Treasure Map (Interactive 24-Hour Timeline)
* **Goal**: Guide participants through the milestone journey from check-in to grand judging.
* **Logic & Implementation**:
  - **Chronological Array**: Configured in an array (`TIMELINE_EVENTS`) with metadata including time, title, phase, milestone deliverables, and description.
  - **Interactive Inspection**: Participants can click any milestone checkpoint to inspect specific criteria and schedules.
  - **Visual Rhythm**: Alternating left/right desktop timeline cards connected by a vertical gradient coordinate line.

---

### 5. 💎 The Bounty Prize Pool & Track Breakdown
* **Goal**: Showcase the ₹1,50,000+ prize pool with high visual hierarchy.
* **Logic & Implementation**:
  - **Main Podium Chests**: 1st Place (Grand Galleon Champion), 2nd Place (First Mate Runner-Up), and 3rd Place (Navigator Bronze) featured with distinct nautical badges, cash awards, cloud credits, and swag bundles.
  - **Domain Track Bounties**: Dedicated prize cards for AI & Autonomous Navigation, Decentralized Sea-Ledgers (Web3), Cyber Bastions (Security), and Open Sea Innovation.
  - **Interactive Micro-Interactions**: Hover transformations with smooth elevation and lighting highlights.

---

### 6. 🍾 Message in a Bottle (FAQ Accordion)
* **Goal**: Answer common participant questions regarding eligibility, teams, hardware, and judging.
* **Logic & Implementation**:
  - **Isolated State Engine**: Managed inside `FaqAccordionSection` using an `activeFaq` index state.
  - **Smooth Height Transitions**: Employs `AnimatePresence` with `initial={{ height: 0, opacity: 0 }}` and `animate={{ height: 'auto', opacity: 1 }}` for smooth dropdown expansion.
  - **ARIA Accessibility**: Configured with `aria-expanded`, `aria-controls`, and `role="region"` for full screen-reader compliance.

---

### 7. ⚓ Navigation Header & Layout Precision
* **Goal**: Provide constant, easy access to all sections and the registration action.
* **Logic & Implementation**:
  - **Fixed Header**: Configured with `fixed top-0 left-0 right-0 z-40` and backdrop blur.
  - **Content Offsets**: The root `<main>` container utilizes `pt-20` to prevent layout overlaps under the 80px fixed navbar.
  - **Scroll Margin Offsets**: All section targets contain `scroll-mt-20` so in-page anchor navigation stops precisely below the header.

---

### 8. 🛡️ Robustness & Zero-API Client-Side Reliability
* **Error Boundary**: Encapsulates the application in a React `ErrorBoundary` in `main.tsx` with a themed recovery screen to gracefully catch unexpected runtime errors.
<<<<<<< HEAD
* **No external API or backend is required at runtime.**: Operates 100% on the client side with no API keys, secrets, or server setup required.
=======
* **Zero External Dependencies / API Keys**: Operates 100% on the client side with no API keys, secrets, or server setup required.
>>>>>>> origin/main

---

## 🛠️ Tech Stack

<<<<<<< HEAD
- **Framework**: React 19 + Vite
=======
- **Framework**: React 18+ (Vite)
>>>>>>> origin/main
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

---

<<<<<<< HEAD
## 🚢 Project Structure

The project follows a simple React + Vite structure, keeping the application logic, styling, and entry-point configuration organized within the `src` directory.

```text
code-of-the-caribbean-2026/
│
├── public/
│   └── Static assets used by the application
│
├── src/
│   ├── App.tsx
│   │   └── Main application component
│   │       ├── Navigation header
│   │       ├── Hero section
│   │       ├── Countdown chronometer
│   │       ├── Hackathon timeline
│   │       ├── Prize pool and tracks
│   │       ├── FAQ accordion
│   │       ├── Registration / crew manifest
│   │       ├── Boarding pass modal
│   │       └── Themed animations and interactions
│   │
│   ├── main.tsx
│   │   └── React application entry point
│   │       ├── Mounts the application
│   │       └── Provides the Error Boundary
│   │
│   └── index.css
│       └── Global styles and Tailwind CSS configuration
│
├── index.html
│   └── Vite HTML entry point
│
├── package.json
│   └── Project metadata, scripts, and dependencies
│
├── package-lock.json
│   └── Locked npm dependency versions
│
├── vite.config.ts
│   └── Vite build and development configuration
│
├── tsconfig.json
│   └── TypeScript configuration
│
├── .gitignore
│   └── Files and directories excluded from version control
│
└── README.md
    └── Project documentation

*Designed & Developed by **Rohit Gupta** for the **DJS-CSI Task 2 Interview Process**
=======
## 🚢 Quick Start & Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build production bundle**:
   ```bash
   npm run build
   ```

---

*Designed & Developed by **Rohit Gupta** for the **DJS-CSI Task 2 Interview Process**.*
>>>>>>> origin/main
