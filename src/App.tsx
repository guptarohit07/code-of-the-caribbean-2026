import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Compass,
  Anchor,
  Skull,
  Map,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Coins,
  Shield,
  Sparkles,
  Users,
  CheckCircle2,
  ChevronDown,
  Ship,
  Award,
  Coffee,
  Flame,
  ArrowRight,
  Menu,
  X,
  Terminal,
  HelpCircle,
  Sword,
  User,
  Star,
  Zap,
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export interface MemberInfo {
  roleTitle: string;
  badge: string;
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  specialty: string;
}

export interface RegistrationFormState {
  shipName: string;
  college: string;
  crewSize: number;
  voyageTrack: string;
  members: MemberInfo[];
}

export interface NavLinkItem {
  name: string;
  href: string;
}

export interface TimelineEvent {
  timeTag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  markerIcon: React.ReactNode;
  subTitle: string;
  subDesc: string;
}

export interface SponsorGold {
  name: string;
  tagline: string;
  perk: string;
}

export interface SponsorSilver {
  name: string;
  spec: string;
}

export interface MentorLord {
  name: string;
  role: string;
  fleet: string;
  track: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// ============================================================================
// STATIC DATA & CONSTANTS (Zero re-allocations on render)
// ============================================================================
const TARGET_DATE_TIME = new Date('2026-10-24T09:00:00+05:30').getTime();

const NAV_LINKS: readonly NavLinkItem[] = [
  { name: 'The Legend', href: '#about' },
  { name: 'Treasure Map', href: '#timeline' },
  { name: 'The Bounty', href: '#prizes' },
  { name: 'Pirate Code', href: '#rules' },
  { name: 'Allies & Lords', href: '#allies' },
  { name: 'Messages', href: '#faqs' },
] as const;

const VOYAGE_TRACKS: readonly string[] = [
  'AI & Autonomous Navigation (Machine Learning / LLMs)',
  'Web3 & Pirate Ledgers (Blockchain & Smart Contracts)',
  'Full-Stack Island Systems (Cloud & Microservices)',
  'Cyber Fortresses (Defensive & Offensive Security)',
  'Open Ocean Discovery (Innovation Track)',
] as const;

const DEFAULT_MEMBERS: readonly MemberInfo[] = [
  {
    roleTitle: 'Captain (Fleet Commander)',
    badge: 'Captain',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'Lead Architect & Full-Stack',
  },
  {
    roleTitle: 'First Mate & Navigator',
    badge: 'Navigator',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'Frontend & UI/UX Seacraft',
  },
  {
    roleTitle: 'Quartermaster & Helmsman',
    badge: 'Quartermaster',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'Backend & Distributed Systems',
  },
  {
    roleTitle: 'Master Gunner & Deckhand',
    badge: 'Master Gunner',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'AI, Data & Security Protocols',
  },
] as const;

const THEMATIC_PILLARS = [
  {
    icon: <Terminal className="w-5 h-5" />,
    title: '24h Non-Stop Sprint',
    desc: 'Build raw ideas into deployed, battle-tested software prototypes under the pressure of the tide.',
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: '₹1,00,000+ Bounty',
    desc: 'Cash bounties, sponsor API grants, hardware credits, and developer swags for the swiftest crews.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Pirate Lord Mentors',
    desc: 'Direct 1-on-1 technical steering from veteran engineers, startup founders, and DJSCE alumni.',
  },
  {
    icon: <Coffee className="w-5 h-5" />,
    title: 'Plentiful Rations',
    desc: 'Full catering, midnight snacks, caffeine brews, and energized resting lounges at DJSCE.',
  },
] as const;

const GOLD_SPONSORS: readonly SponsorGold[] = [
  { name: 'TechCorsair', tagline: 'Next-Gen Cloud Infrastructure', perk: '₹25,000 API Credits' },
  { name: 'DevOcean', tagline: 'Distributed Database Systems', perk: 'Fast-Track Hiring' },
  { name: 'KrakenCloud', tagline: 'Scalable Container Fleets', perk: 'Compute Clusters' },
  { name: 'AnchorByte', tagline: 'Autonomous AI Protocols', perk: 'API Sovereign Pass' },
] as const;

const SILVER_SPONSORS: readonly SponsorSilver[] = [
  { name: 'Nautilus AI', spec: 'Model Inference' },
  { name: 'BlackPearl API', spec: 'Payment Gateway' },
  { name: 'CompassWorks', spec: 'Design Systems' },
  { name: 'SirenSec', spec: 'Code Fortification' },
] as const;

const MENTOR_LORDS: readonly MentorLord[] = [
  {
    name: 'Capt. Vikram Shenoy',
    role: 'Staff Systems Architect',
    fleet: 'TechCorsair Guild',
    track: 'Distributed Core & High Load',
  },
  {
    name: 'Lord Ananya Deshmukh',
    role: 'Principal AI Engineer',
    fleet: 'DevOcean Labs',
    track: 'LLMs & Cognitive Navigation',
  },
  {
    name: 'First Mate Rohan Mehta',
    role: 'VP of Engineering',
    fleet: 'KrakenCloud Services',
    track: 'Cloud Native & Edge Ops',
  },
  {
    name: 'Navigator Priya Iyer',
    role: 'Head of Product Design',
    fleet: 'AnchorByte Guild',
    track: 'Interactive UX & Visual Design',
  },
] as const;

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    q: 'Do I need to know how to code?',
    a: 'Yes, but beginners are welcome! We have dedicated mentoring tracks and starter kits to help deckhands build their first full-stack projects alongside seasoned sailors.',
  },
  {
    q: 'Is food provided?',
    a: 'Plentiful rations and caffeine will be supplied to all sailors! Complete breakfast, lunch, dinner, midnight pizza, energy drinks, and unlimited tea/coffee are on the house throughout the 24 hours.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No, the voyage is completely free. Code of the Caribbean charges zero registration or entry fees for shortlisted teams.',
  },
  {
    q: 'What should my crew bring onboard to DJSCE?',
    a: 'Each sailor should bring their laptop, chargers, extension cords, valid college identification card, personal hygiene essentials, and an insatiable desire to build!',
  },
  {
    q: 'Are overnight accommodations available at DJSCE campus?',
    a: 'Yes, secure snooze lounges, resting rooms, and round-the-clock campus security are active so sailors can take rest during the 24-hour sprint.',
  },
  {
    q: 'How are teams formed if I do not have a full crew yet?',
    a: 'You can register as a solo sailor or duo; our official Discord guild features a "Crew Matchmaking" channel to help you recruit remaining mates before sail date.',
  },
] as const;

// Helper SVG icon for scroll
function ScrollIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    </svg>
  );
}

// ============================================================================
// MEMOIZED SUB-COMPONENTS FOR HIGH PERFORMANCE RENDERING
// ============================================================================

/**
 * Isolated Countdown Chronometer Component:
 * Ticks every 1s internally without re-rendering parent tree.
 */
const VoyageCountdownChronometer = memo(function VoyageCountdownChronometer() {
  const calculateTimeLeft = useCallback(() => {
    const now = Date.now();
    const difference = TARGET_DATE_TIME - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full max-w-2xl bg-white/95 border border-sky-200/80 rounded-2xl p-6 backdrop-blur-md shadow-xl shadow-sky-950/5 relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600" />
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700">
          <Compass className="w-4 h-4 animate-spin text-blue-600" style={{ animationDuration: '20s' }} />
          Voyage Departure Countdown
        </div>
        <div className="text-[11px] text-slate-500 font-mono font-medium">Time to Cast Anchor: 09:00 AM IST</div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="text-2xl sm:text-4xl font-heading font-bold text-blue-950">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            Days
          </div>
        </div>
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="text-2xl sm:text-4xl font-heading font-bold text-blue-950">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            Hours
          </div>
        </div>
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="text-2xl sm:text-4xl font-heading font-bold text-blue-950">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            Minutes
          </div>
        </div>
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="text-2xl sm:text-4xl font-heading font-bold text-blue-600">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            Seconds
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/**
 * Isolated FAQ Accordion Sub-Component:
 * Manages active question state without re-rendering parent tree.
 */
const FaqAccordionSection = memo(function FaqAccordionSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {FAQ_ITEMS.map((faq, index) => {
        const isOpen = activeFaq === index;
        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-blue-500 shadow-md shadow-blue-500/10'
                : 'bg-white/80 border-sky-100 hover:border-sky-300'
            }`}
          >
            <button
              type="button"
              id={`faq-header-${index}`}
              aria-expanded={isOpen}
              aria-controls={`faq-body-${index}`}
              onClick={() => setActiveFaq(isOpen ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
            >
              <span className="font-heading font-bold text-base sm:text-lg text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-700 text-xs shrink-0 font-mono font-bold">
                  0{index + 1}
                </span>
                {faq.q}
              </span>
              <div
                className={`p-1.5 rounded-lg bg-sky-100 text-blue-700 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 bg-blue-600 text-white' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`faq-body-${index}`}
                  role="region"
                  aria-labelledby={`faq-header-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-sans">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
});

/**
 * Static helper for sailor role icons to eliminate allocations during member mapping.
 */
function getCrewRoleIcon(index: number) {
  switch (index) {
    case 0:
      return <Skull className="w-4 h-4 text-blue-600" />;
    case 1:
      return <Compass className="w-4 h-4 text-blue-600" />;
    case 2:
      return <Shield className="w-4 h-4 text-blue-600" />;
    default:
      return <Zap className="w-4 h-4 text-blue-600" />;
  }
}

/**
 * Isolated Crew Registration Modal:
 * Manages form keystrokes and validation internally for 0ms lag during typing.
 */
interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrewRegistrationModal = memo(function CrewRegistrationModal({
  isOpen,
  onClose,
}: RegistrationModalProps) {
  const [regForm, setRegForm] = useState<RegistrationFormState>({
    shipName: '',
    college: 'Dwarkadas J. Sanghvi College of Engineering (DJSCE)',
    crewSize: 4,
    voyageTrack: 'AI & Autonomous Navigation (Machine Learning / LLMs)',
    members: [...DEFAULT_MEMBERS],
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Clean up copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleMemberChange = useCallback(
    (index: number, field: keyof MemberInfo, value: string) => {
      setRegForm((prev) => {
        const updatedMembers = [...prev.members];
        updatedMembers[index] = {
          ...updatedMembers[index],
          [field]: value,
        };
        return { ...prev, members: updatedMembers };
      });
    },
    []
  );

  const handleRegisterSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = `COTCS-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setIsRegistered(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#2563eb', '#38bdf8', '#1d4ed8', '#93c5fd', '#ffffff'],
      });
    } catch {
      // Safe fallback
    }
  }, []);

  const handleCopyTicket = useCallback(() => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setIsCopied(true);
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 2000);
    }
  }, [ticketId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white border border-sky-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 shadow-sm" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="sticky float-right top-0 -mr-2 -mt-2 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer z-20"
              aria-label="Close registration dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {!isRegistered ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Ship className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 id="registration-modal-title" className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                      Register Your Crew Manifest
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-600 font-semibold">
                      Code of the Caribbean 2026 • DJSCE Harbor Gate Entry
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs sm:text-sm">
                  {/* BLOCK 1: SHIP & VOYAGE DETAILS */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-4">
                    <div className="flex items-center gap-2 text-blue-900 font-heading font-bold text-sm sm:text-base border-b border-sky-200/80 pb-2.5">
                      <Anchor className="w-4 h-4 text-blue-600" />
                      1. Vessel & Voyage Information
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="shipName" className="block text-slate-700 font-semibold mb-1.5">
                          Ship / Crew Name *
                        </label>
                        <input
                          id="shipName"
                          type="text"
                          required
                          value={regForm.shipName}
                          onChange={(e) => setRegForm({ ...regForm, shipName: e.target.value })}
                          placeholder="e.g. The Black Pearl"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="college" className="block text-slate-700 font-semibold mb-1.5">
                          College / Institute *
                        </label>
                        <input
                          id="college"
                          type="text"
                          required
                          value={regForm.college}
                          onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                          placeholder="e.g. DJSCE Mumbai"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="voyageTrack" className="block text-slate-700 font-semibold mb-1.5">
                          Preferred Voyage Track *
                        </label>
                        <select
                          id="voyageTrack"
                          value={regForm.voyageTrack}
                          onChange={(e) => setRegForm({ ...regForm, voyageTrack: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                        >
                          {VOYAGE_TRACKS.map((track) => (
                            <option key={track} value={track}>
                              {track}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Crew Manifest Size (1 to 4 Sailors) *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setRegForm({ ...regForm, crewSize: size })}
                              className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer border ${
                                regForm.crewSize === size
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-sky-50/50'
                              }`}
                            >
                              {size} {size === 1 ? 'Sailor' : 'Crew'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC TEAMMATE BLOCKS */}
                  <div className="space-y-4">
                    {regForm.members.slice(0, regForm.crewSize).map((member, idx) => {
                      const isCaptain = idx === 0;

                      return (
                        <div
                          key={idx}
                          className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                            isCaptain
                              ? 'bg-white border-blue-300 shadow-md shadow-blue-500/5'
                              : 'bg-slate-50/70 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-2.5 font-heading font-bold text-sm sm:text-base text-slate-900">
                              <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
                                {getCrewRoleIcon(idx)}
                              </div>
                              <span>{member.roleTitle}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                              {member.badge} {isCaptain ? '★ Primary Contact' : `• Mate #${idx + 1}`}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor={`member-name-${idx}`} className="block text-slate-700 font-semibold mb-1.5">
                                {member.badge} Full Name *
                              </label>
                              <input
                                id={`member-name-${idx}`}
                                type="text"
                                required
                                value={member.name}
                                onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                placeholder={isCaptain ? 'e.g. Jack Sparrow' : `e.g. Teammate ${idx + 1} Name`}
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                              />
                            </div>

                            <div>
                              <label htmlFor={`member-email-${idx}`} className="block text-slate-700 font-semibold mb-1.5">
                                {member.badge} Email Address *
                              </label>
                              <input
                                id={`member-email-${idx}`}
                                type="email"
                                required
                                value={member.email}
                                onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                placeholder={isCaptain ? 'captain@djsce.edu' : `sailor${idx + 1}@djsce.edu`}
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                              />
                            </div>

                            <div>
                              <label htmlFor={`member-phone-${idx}`} className="block text-slate-700 font-semibold mb-1.5">
                                {member.badge} Phone Number *
                              </label>
                              <input
                                id={`member-phone-${idx}`}
                                type="tel"
                                required
                                value={member.phone}
                                onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                              />
                            </div>

                            <div>
                              <label htmlFor={`member-roll-${idx}`} className="block text-slate-700 font-semibold mb-1.5">
                                College ID / Roll Number *
                              </label>
                              <input
                                id={`member-roll-${idx}`}
                                type="text"
                                required
                                value={member.rollNo}
                                onChange={(e) => handleMemberChange(idx, 'rollNo', e.target.value)}
                                placeholder="e.g. 60004220054"
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label htmlFor={`member-spec-${idx}`} className="block text-slate-700 font-semibold mb-1.5">
                                Seacraft Skill / Domain Role
                              </label>
                              <input
                                id={`member-spec-${idx}`}
                                type="text"
                                value={member.specialty}
                                onChange={(e) => handleMemberChange(idx, 'specialty', e.target.value)}
                                placeholder="e.g. Full-Stack / Machine Learning / UI Design / DevOps"
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-heading font-bold text-sm sm:text-base tracking-wider uppercase text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Anchor className="w-5 h-5 text-white" />
                      Confirm Manifest & Hoist Colors ({regForm.crewSize} {regForm.crewSize === 1 ? 'Sailor' : 'Sailors'})
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Ticket Confirmation with Full Crew Manifest */
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-500 flex items-center justify-center text-blue-600 mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Fleet Boarding Pass Issued!
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
                    Ship <strong className="text-blue-700">&ldquo;{regForm.shipName || 'Your Fleet'}&rdquo;</strong> and all {regForm.crewSize} registered crew members are officially logged in the DJSCE Harbor Registry.
                  </p>
                </div>

                {/* Boarding Pass Ticket Card with Roster */}
                <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden max-w-2xl mx-auto shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-blue-600 block font-bold">
                        Official Manifest
                      </span>
                      <span className="font-heading font-extrabold text-slate-900 text-lg sm:text-xl">
                        {regForm.shipName || 'Royal Flagship'}
                      </span>
                      <span className="text-xs text-slate-500 block">{regForm.college}</span>
                    </div>
                    <div className="sm:text-right flex flex-col sm:items-end">
                      <span className="text-[10px] uppercase tracking-widest text-blue-600 block font-bold">
                        Registry Pass ID
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-blue-700 text-base sm:text-lg">
                          {ticketId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyTicket}
                          className="p-1 px-2 text-[10px] font-bold rounded bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors cursor-pointer"
                          aria-label="Copy ticket pass ID"
                        >
                          {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 py-1">
                    <div>
                      <span className="text-blue-600 block text-[10px] font-bold uppercase">Voyage Track:</span>
                      <span className="font-semibold text-slate-900">{regForm.voyageTrack}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 block text-[10px] font-bold uppercase">Harbor Port:</span>
                      <span className="font-semibold text-slate-900">DJSCE Campus, Mumbai • Oct 24-25, 2026</span>
                    </div>
                  </div>

                  {/* Registered Crew Roster Grid */}
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-2.5">
                      Enrolled Crew Members ({regForm.crewSize})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {regForm.members.slice(0, regForm.crewSize).map((member, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading font-bold text-slate-900">
                              {member.name || `Sailor #${i + 1}`}
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                              {member.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{member.email || 'Email logged'}</div>
                          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                            <span>ID: {member.rollNo || 'Verified'}</span>
                            <span>{member.phone || ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] bg-blue-100/70 border border-blue-200 rounded-xl p-3 text-blue-900 text-center font-semibold">
                    ⚓ Bring this boarding pass & College ID to the DJSCE Harbor Gate at 09:00 AM.
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistered(false);
                      onClose();
                    }}
                    className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    Close Pass
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll-triggered boat animation state
  const [isSailing, setIsSailing] = useState(false);

  // Registration modal visibility state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Navigation and animation timer references
  const scrollTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Clean up navigation timers on unmount
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
      if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);
    };
  }, []);

  // Smooth scroll handler with sailing boat animation
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href.startsWith('#')) {
      const targetId = href.substring(1);

      // Clear any pending navigation timers
      if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
      if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);

      if (prefersReducedMotion) {
        if (targetId === '') {
          window.scrollTo({ top: 0, behavior: 'auto' });
        } else {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'auto' });
          }
        }
        return;
      }

      // Trigger sailing animation
      setIsSailing(true);

      // Smooth scroll halfway through the 1.5s animation (750ms)
      scrollTimerRef.current = window.setTimeout(() => {
        if (targetId === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 750);

      // Finish sailing after 1.5s
      finishTimerRef.current = window.setTimeout(() => {
        setIsSailing(false);
      }, 1500);
    }
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen bg-slate-50 bg-gradient-to-b from-white via-sky-50/50 to-blue-50/40 text-slate-800 relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Dynamic Oceanic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,233,0.12)_0%,transparent_70%)]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-sky-100/60 rounded-full blur-3xl" />

        {/* Crisp Ocean Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
      </div>

      {/* ========================================================================= */}
      {/* NAVIGATION BAR (FIXED IN PLACE AT TOP OF SCREEN) */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/95 border-b border-sky-100 transition-all duration-300 shadow-[0_4px_25px_rgba(2,132,199,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & College Brand */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 p-0.5 shadow-md shadow-blue-500/20 group-hover:shadow-[0_0_20px_rgba(2,132,199,0.4)] transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Skull className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 block leading-tight">
                CODE OF THE CARIBBEAN
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse" />
                DJSCE Mumbai • 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs uppercase tracking-widest font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="relative group px-5 py-2.5 rounded-xl font-heading font-bold text-xs tracking-wider uppercase bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 shadow-md shadow-blue-500/25 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Anchor className="w-3.5 h-3.5 text-white" />
                Register Crew
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-blue-700 shadow-sm focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 border-b border-sky-100 px-6 py-6 space-y-4 backdrop-blur-lg shadow-lg"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-sm uppercase tracking-widest font-semibold text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="w-full py-3 rounded-xl font-heading font-bold text-xs tracking-wider uppercase bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Anchor className="w-4 h-4 text-white" />
                  Register Your Crew
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 pt-20">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION (DISCOVER) */}
        {/* ========================================================================= */}
        <section className="relative min-h-[92vh] flex items-center justify-center py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Oceanic Glow & Radial Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.08)_0%,transparent_65%)] blur-2xl -z-10 pointer-events-none" />

          {/* Background Compass watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Compass className="w-[800px] h-[800px] text-blue-600 animate-spin" style={{ animationDuration: '180s' }} />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
            {/* College & Flagship pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-sky-50/80 backdrop-blur-sm text-blue-800 shadow-sm text-xs sm:text-sm font-semibold tracking-wide mb-6"
            >
              <Ship className="w-4 h-4 text-blue-600" />
              <span>DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING PRESENTS</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] mb-6"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-950 via-blue-700 to-sky-600 drop-shadow-sm">
                CODE OF THE CARIBBEAN
              </span>
              <span className="font-mono text-blue-600 tracking-widest text-sm sm:text-base md:text-lg block mt-3 font-bold uppercase">
                ~ 2026 ~
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="uppercase tracking-[0.2em] text-xs sm:text-sm md:text-base text-slate-600 font-semibold max-w-3xl mb-8 not-italic"
            >
              &ldquo;Hoist the Colors. Write the Code. Claim the Bounty.&rdquo;
            </motion.p>

            {/* Details Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full mb-10 text-slate-700 text-xs sm:text-sm font-medium"
            >
              <div className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-sm backdrop-blur">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800">24-Hour Hackathon</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-sm backdrop-blur">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800">DJSCE Campus, Mumbai</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-sm backdrop-blur">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800">October 24-25, 2026</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-14"
            >
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-heading font-bold text-base sm:text-lg uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <Anchor className="w-5 h-5 text-white animate-bounce" />
                  Register Your Crew
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>

              <a
                href="#timeline"
                onClick={(e) => handleNavClick(e, '#timeline')}
                className="px-6 py-4 rounded-xl font-heading font-semibold text-sm tracking-wider uppercase text-blue-900 hover:text-blue-700 bg-white hover:bg-sky-50 border border-sky-200 shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <Map className="w-4 h-4 text-blue-600" />
                The Treasure Map
              </a>
            </motion.div>

            {/* Voyage Countdown Chronometer (Optimized sub-tree) */}
            <VoyageCountdownChronometer />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: ABOUT (UNDERSTAND - THE LEGEND) */}
        {/* ========================================================================= */}
        <section id="about" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative border-t border-sky-100 bg-white/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-blue-700 text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
                <Compass className="w-3.5 h-3.5" />
                The Legend & Lore
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                Understand The Odyssey
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto rounded-full shadow-sm" />
            </div>

            {/* Central Legend Narrative Card */}
            <div className="relative bg-white border border-sky-200/80 rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl shadow-sky-950/5 backdrop-blur-md mb-16 overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-sky-100 rounded-full blur-3xl pointer-events-none opacity-60" />
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl pointer-events-none opacity-50" />

              <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
                  <Compass className="w-8 h-8" />
                </div>

                <p className="text-lg sm:text-2xl text-slate-800 font-medium leading-relaxed font-sans">
                  &ldquo;The digital seas of DJSCE are calling. <span className="text-blue-700 font-bold font-heading">Code of the Caribbean</span> is a premier 24-hour hackathon where developers, designers, and innovators unite to build legendary projects. Whether you are a seasoned captain or a deckhand writing your first lines of code, there is a place for you in our fleet.&rdquo;
                </p>

                <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                  Over one intense day and night, teams will navigate challenging open problems, craft full-stack marvels, deploy AI algorithms, and pitch before distinguished industry captains.
                </p>
              </div>

              {/* Four Thematic Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-10 border-t border-slate-100 relative z-10">
                {THEMATIC_PILLARS.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="p-6 rounded-2xl bg-slate-50 border border-sky-100 hover:border-blue-300 transition-colors group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-700 mb-4 group-hover:scale-110 transition-transform">
                      {pillar.icon}
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 text-base mb-2">{pillar.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: TIMELINE (THE TREASURE MAP) */}
        {/* ========================================================================= */}
        <section id="timeline" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-sky-50/50 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-blue-700 text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
                <Map className="w-3.5 h-3.5" />
                The Treasure Map
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                Voyage Timeline
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
                Chart the 24-hour course from boarding the ship at DJSCE to claiming the final bounty at sunset.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto mt-6 rounded-full shadow-sm" />
            </div>

            {/* Vertical Timeline with Dashed Trail */}
            <div className="relative">
              {/* Central Dashed Route Line */}
              <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-blue-300 -translate-x-1/2" />
              <div className="md:hidden absolute left-7 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-blue-300" />

              {/* TIMELINE ITEMS */}
              <div className="space-y-12 sm:space-y-16">
                {/* 1. 09:00 AM - Gates Open */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0"
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0">
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold mb-2">
                      09:00 AM • DAY 1
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      Gates Open (Boarding the Ship)
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Crew check-in at DJSCE campus main port, identity credential verification, high-speed sea-net allocation, and welcoming rations.
                    </p>
                  </div>

                  {/* Marker Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 z-10">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                      <Ship className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12 pl-16">
                    <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Harbor Check-in & Team Kit Distribution
                      </div>
                      <p className="text-slate-500">Receive your sailor badging, official swag pack, and station assignment.</p>
                    </div>
                  </div>
                </motion.div>

                {/* 2. 11:00 AM - Hack Begins */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0"
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0 md:order-1 order-2">
                    <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-700 font-bold md:justify-end">
                        <Flame className="w-3.5 h-3.5 text-blue-600" />
                        Grand Keynote & Track Problem Release
                      </div>
                      <p className="text-slate-500">The battle horn sounds across Mumbai. Repositories initialize.</p>
                    </div>
                  </div>

                  {/* Marker Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 z-10 md:order-2 order-1">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                      <Compass className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12 pl-16 md:order-3 order-3">
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold mb-2">
                      11:00 AM • DAY 1
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      Hack Begins (Setting Sail)
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      All ships cast off into open waters! 24-hour development chronometer officially starts. Ideate, architect, and start committing code.
                    </p>
                  </div>
                </motion.div>

                {/* 3. 06:00 PM - Mentoring Round 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0"
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0">
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold mb-2">
                      06:00 PM • DAY 1
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      Mentoring Round 1 (Navigating the Storm)
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Industry captains and mentor lords visit each deck. Pitch your architecture, resolve roadblocks, and pivot strategy before night falls.
                    </p>
                  </div>

                  {/* Marker Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 z-10">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                      <Skull className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12 pl-16">
                    <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        Code Review & Feasibility Calibrations
                      </div>
                      <p className="text-slate-500">Refine API integrations, UI mockups, and backend schemas with expert guidance.</p>
                    </div>
                  </div>
                </motion.div>

                {/* 4. 12:00 AM - Midnight Mini-Events */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0"
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0 md:order-1 order-2">
                    <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-700 font-bold md:justify-end">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Midnight Pizza, Red Bull, & Pirate Duels
                      </div>
                      <p className="text-slate-500">Type-racer faceoffs, cryptic scavenger challenges, and spot bounties.</p>
                    </div>
                  </div>

                  {/* Marker Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 z-10 md:order-2 order-1">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12 pl-16 md:order-3 order-3">
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold mb-2">
                      12:00 AM • MIDNIGHT
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      Midnight Mini-Events (The Kraken&apos;s Den)
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Take a breather from the keyboard storm. Engage in high-energy sea games, midnight feasts, and instant loot drops to recharge.
                    </p>
                  </div>
                </motion.div>

                {/* 5. 11:00 AM (Next Day) - Submission Deadline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0"
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0">
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold mb-2">
                      11:00 AM • DAY 2 (NEXT DAY)
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      Submission Deadline (Dropping Anchor)
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Hands off keyboards! Final Git commit freeze and project submission via portal. Captains assemble to demonstrate their triumphs to the judges.
                    </p>
                  </div>

                  {/* Marker Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 z-10">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                      <Anchor className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12 pl-16">
                    <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        Judges Evaluation & Award Ceremony
                      </div>
                      <p className="text-slate-500">Live 3-minute pitch sessions followed by the Grand Bounty proclamation.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: PRIZE POOL (THE BOUNTY) */}
        {/* ========================================================================= */}
        <section id="prizes" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative border-t border-sky-100 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-blue-700 text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
                <Coins className="w-3.5 h-3.5" />
                The Spoils of Victory
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                The Royal Bounty
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
                Explore the spoils and rewards awaiting the fiercest pirate crews on the high seas of DJSCE.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto mt-6 rounded-full shadow-sm" />
            </div>

            {/* 3 Elevated Treasure Cards with Framer Motion spring lift */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
              {/* 2nd Place: First Mates */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative bg-white border border-sky-200 rounded-3xl p-8 pb-10 flex flex-col justify-between shadow-lg shadow-sky-950/5 transition-all duration-300 order-2 md:order-1"
              >
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                  Silver Crest
                </div>

                <div>
                  <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                    <Shield className="w-8 h-8" />
                  </div>

                  <div className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-1">
                    2nd Place
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    First Mates
                  </h3>

                  <div className="text-3xl sm:text-4xl font-heading font-black text-slate-900 my-4">
                    ₹30,000
                    <span className="block text-sm font-sans font-semibold text-blue-700 mt-1">
                      + Swag Kits & Goodies
                    </span>
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 mt-6 pt-6 border-t border-slate-100">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Silver Captain&apos;s Plaque & Medals</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Official DJSCE Swag Box for all 4 crew</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Fast-Track Sponsor Interview Pool</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* 1st Place: Grand Fleet (Primary Royal Blue Highlight) */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white border-2 border-blue-400 rounded-3xl p-8 sm:p-10 pb-10 flex flex-col justify-between shadow-2xl shadow-blue-600/20 transition-all duration-300 order-1 md:order-2 md:-mt-4 z-10"
              >
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-md shadow-blue-500/30 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Supreme Champion
                  </span>
                </div>

                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 p-0.5 shadow-lg mb-6 mt-2 mx-auto sm:mx-0">
                    <div className="w-full h-full bg-blue-900/60 rounded-[14px] flex items-center justify-center text-sky-300">
                      <Trophy className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="text-xs uppercase tracking-widest font-bold text-sky-300 mb-1">
                    1st Place
                  </div>
                  <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-blue-200 mb-2">
                    Grand Fleet
                  </h3>

                  <div className="text-4xl sm:text-5xl font-heading font-black text-sky-300 drop-shadow-sm my-4">
                    ₹50,000
                    <span className="block text-sm font-sans font-semibold text-white/90 mt-1">
                      + Sponsored APIs & Cloud Grants
                    </span>
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm text-sky-100 mt-6 pt-6 border-t border-blue-800">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="font-semibold text-white">The Golden Sovereign Trophy</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>$5,000 in Sponsored AI & Cloud APIs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Direct Fast-Track Interviews with TechCorsair</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Elite Sailor Badges & Certificates of Valor</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* 3rd Place: Quartermasters */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative bg-white border border-sky-200 rounded-3xl p-8 pb-10 flex flex-col justify-between shadow-lg shadow-sky-950/5 transition-all duration-300 order-3"
              >
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                  Bronze Anchor
                </div>

                <div>
                  <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                    <Anchor className="w-8 h-8" />
                  </div>

                  <div className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-1">
                    3rd Place
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Quartermasters
                  </h3>

                  <div className="text-3xl sm:text-4xl font-heading font-black text-slate-900 my-4">
                    ₹20,000
                    <span className="block text-sm font-sans font-semibold text-blue-700 mt-1">
                      Direct Cash Prize
                    </span>
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 mt-6 pt-6 border-t border-slate-100">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Bronze Quartermaster Trophy</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Premium Software Subscriptions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Certificates of Distinction</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Supplementary Track Bounties */}
            <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center justify-center gap-2">
                <Coins className="w-5 h-5 text-blue-600" />
                Special Category Spoils & Side Quests
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                  <div className="text-blue-900 font-bold text-sm mb-1 font-heading">Best Fresher Crew</div>
                  <div className="text-xs text-slate-600">₹5,000 + Starter Hardware Toolkits for 1st-year navigators.</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                  <div className="text-blue-900 font-bold text-sm mb-1 font-heading">Best UI/UX Seacraft</div>
                  <div className="text-xs text-slate-600">₹5,000 + Design Guild Mentorship for the cleanest aesthetic.</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                  <div className="text-blue-900 font-bold text-sm mb-1 font-heading">Most Disruptive AI Innovation</div>
                  <div className="text-xs text-slate-600">₹5,000 + Cloud AI API Grant Package.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: RULES / ELIGIBILITY (THE PIRATE CODE) */}
        {/* ========================================================================= */}
        <section id="rules" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-sky-50/60 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-blue-700 text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
                <ScrollIcon />
                Honorable Conduct
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                The Pirate Code
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
                Every sailor must swear by the articles of the high seas before setting sail on the DJSCE waters.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto mt-6 rounded-full shadow-sm" />
            </div>

            {/* Clean White and Blue Code Container */}
            <div className="relative bg-white border-2 border-sky-200 rounded-3xl p-8 sm:p-12 shadow-xl shadow-sky-950/5 overflow-hidden">
              {/* Seal in Top-Right */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky-50 border-2 border-blue-500 shadow-sm flex items-center justify-center rotate-12">
                <div className="text-[9px] font-heading font-black text-blue-900 tracking-tighter text-center uppercase leading-tight">
                  DJSCE<br />SEAL
                </div>
              </div>

              <div className="max-w-3xl space-y-8">
                <div className="flex items-center gap-3 text-blue-900 font-heading text-lg font-bold border-b border-slate-100 pb-3">
                  <Sword className="w-5 h-5 rotate-45 text-blue-600" />
                  Articles of Seafaring & Eligibility
                </div>

                {/* THE 3 CORE RULES */}
                <div className="space-y-6">
                  {/* Rule 1 */}
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-heading font-bold text-sm shrink-0 mt-0.5 shadow-sm">
                      I
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base sm:text-lg mb-1 text-blue-950">
                        Maximum 4 crew members per ship.
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        Teams may comprise between 1 and 4 sailors. You may form cross-department or cross-college crews so long as all members are registered under the same ship manifest.
                      </p>
                    </div>
                  </div>

                  {/* Rule 2 */}
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-heading font-bold text-sm shrink-0 mt-0.5 shadow-sm">
                      II
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base sm:text-lg mb-1 text-blue-950">
                        All code must be written during the 24 hours (no buried treasure from past projects).
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        Every line of code, design asset, and architecture must be forged fresh after the 11:00 AM bell. Open-source libraries, standard boilerplate, and public APIs are permitted, but preexisting finished repositories are strictly forbidden.
                      </p>
                    </div>
                  </div>

                  {/* Rule 3 */}
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-heading font-bold text-sm shrink-0 mt-0.5 shadow-sm">
                      III
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base sm:text-lg mb-1 text-blue-950">
                        Open to all engineering undergraduates.
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        All students currently enrolled in recognized B.E. / B.Tech engineering programs across colleges are welcome. Bring your valid college sailor ID for onboard harbor entry.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-3 font-medium">
                  <Shield className="w-5 h-5 shrink-0 text-blue-600" />
                  <span>Fair play is non-negotiable. Any sailor found plagiarizing commits will be made to walk the plank!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: JUDGES / MENTORS & SPONSORS (ALLIES & THE PIRATE LORDS) */}
        {/* ========================================================================= */}
        <section id="allies" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative border-t border-sky-100 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* SPONSORS (ALLIES) */}
            <div>
              <div className="text-center max-w-3xl mx-auto mb-14">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-blue-700 text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
                  <Anchor className="w-3.5 h-3.5" />
                  Fleet Alliances
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                  Our High-Seas Sponsors
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Backed by legendary tech syndicates providing bounties, APIs, and cloud resources.
                </p>
              </div>

              {/* Gold Tier Sponsors */}
              <div className="mb-10">
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-widest font-bold text-blue-800 bg-sky-100 px-4 py-1.5 rounded-full border border-sky-200 shadow-sm">
                    ★ Gold Tier Armada ★
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {GOLD_SPONSORS.map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className="p-6 rounded-2xl bg-white border border-sky-200/80 hover:border-blue-500 transition-all duration-300 text-center group hover:shadow-lg hover:shadow-blue-500/10 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 mx-auto flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <Ship className="w-6 h-6" />
                      </div>
                      <div className="font-heading font-extrabold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                        {sponsor.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 mb-3">{sponsor.tagline}</div>
                      <span className="inline-block text-[11px] font-semibold text-blue-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                        {sponsor.perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Silver Tier Sponsors */}
              <div>
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-widest font-semibold text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                    Silver Tier Frigates
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {SILVER_SPONSORS.map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center hover:border-blue-400 transition-colors"
                    >
                      <div className="font-heading font-bold text-sm sm:text-base text-slate-800">
                        {sponsor.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{sponsor.spec}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PIRATE LORDS (JUDGES & MENTORS) */}
            <div className="pt-10 border-t border-slate-100">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-blue-700 text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
                  <Skull className="w-3.5 h-3.5" />
                  The High Council
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                  Judges & Mentor Lords
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Distinguished tech captains evaluating the fleet and helping you chart uncharted waters.
                </p>
              </div>

              {/* Grid of Mentors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MENTOR_LORDS.map((mentor) => (
                  <div
                    key={mentor.name}
                    className="p-6 rounded-2xl bg-white border border-sky-200/80 hover:border-blue-500 transition-all duration-300 text-center group hover:shadow-lg hover:shadow-blue-500/10 shadow-sm"
                  >
                    {/* Mentor Avatar */}
                    <div className="w-20 h-20 rounded-full bg-sky-50 border-2 border-sky-200 p-1 mx-auto mb-4 group-hover:border-blue-500 transition-colors shadow-sm">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-blue-600">
                        <User className="w-9 h-9" />
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {mentor.name}
                    </h3>
                    <div className="text-xs font-bold text-blue-600 mb-1">{mentor.role}</div>
                    <div className="text-[11px] text-slate-500 font-medium mb-3">{mentor.fleet}</div>

                    <div className="text-[10px] uppercase tracking-wider font-bold text-blue-800 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
                      {mentor.track}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: FAQS (MESSAGE IN A BOTTLE) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-sky-50/60 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-blue-700 text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
                <HelpCircle className="w-3.5 h-3.5" />
                Message in a Bottle
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Uncork the bottles washed ashore with all the answers you need before embarkation.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto mt-6 rounded-full shadow-sm" />
            </div>

            {/* Interactive Accordion Menu */}
            <FaqAccordionSection />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CALL TO ARMS (REGISTER CTA SECTION) */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-sky-100 bg-white">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-blue-500/25 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />

            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight mb-4 drop-shadow-sm">
              Will You Claim The Bounty?
            </h2>
            <p className="text-sky-100 text-sm sm:text-lg max-w-2xl mx-auto mb-8 font-sans">
              Assemble your crew of up to 4 sailors and prepare to embark on Mumbai&apos;s most thrilling collegiate hackathon.
            </p>

            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="px-10 py-5 rounded-xl font-heading font-bold text-base sm:text-lg tracking-wider uppercase text-blue-900 bg-white hover:bg-sky-50 shadow-xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
            >
              <Anchor className="w-5 h-5 text-blue-700" />
              Register Your Crew Now
              <ArrowRight className="w-5 h-5 text-blue-700" />
            </button>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* SECTION 8: FOOTER */}
      {/* ========================================================================= */}
      <footer className="relative z-10 bg-slate-900 border-t border-slate-800 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Column 1: Brand & DJSCE */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 shadow-md">
                  <Skull className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading text-lg font-bold text-white tracking-wide block">
                    CODE OF THE CARIBBEAN 2026
                  </span>
                  <span className="text-xs text-sky-400 font-semibold">
                    Dwarkadas J. Sanghvi College of Engineering, Mumbai
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md pt-2">
                Crafted for the DJSCE Tech Co-Com Web Recruitment Task. May your code compile and your servers hold steady. Stay bold, keep building, and sail onward toward greatness.
              </p>

              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Harbor Coordinates: 19.1075° N, 72.8372° E (Vile Parle West, Mumbai)</span>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-4">
                Navigation
              </h3>
              <ul className="space-y-2 text-xs">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="hover:text-sky-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Recruitment & Committee */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-4">
                Task Info
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                DJSCE Tech Co-Com Recruitment 2026. Task 2: Hackathon Landing Page Showcase.
              </p>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-sky-300 font-medium">
                ⚡ 24-Hour Oceanic Treasure Hunt Theme
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © 2026 Code of the Caribbean • DJSCE Technical Committee. All Rights Reserved.
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, '#about')}
                className="hover:text-sky-400 transition-colors"
              >
                Lore
              </a>
              <a
                href="#rules"
                onClick={(e) => handleNavClick(e, '#rules')}
                className="hover:text-sky-400 transition-colors"
              >
                Code
              </a>
              <a
                href="#"
                onClick={(e) => handleNavClick(e, '#')}
                className="hover:text-sky-400 transition-colors"
              >
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* SCROLL-TRIGGERED BOAT ANIMATION OVERLAY */}
      {/* ========================================================================= */}
      {isSailing && (
        <div className="fixed bottom-4 left-0 right-0 w-full pointer-events-none z-50 overflow-hidden h-28 flex items-end">
          <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: '100vw' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="flex items-center gap-3 relative transform-gpu will-change-transform"
          >
            <motion.div
              animate={{
                y: [0, -10, 0, -8, 0],
                rotate: [0, 4, -4, 2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative text-blue-600 drop-shadow-[0_4px_15px_rgba(2,132,199,0.5)] transform-gpu will-change-transform"
            >
              <Ship className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 fill-white stroke-blue-600 stroke-[1.5]" />

              {/* Oceanic glowing wake trail behind the ship */}
              <div className="absolute -left-16 bottom-2 w-20 h-2 bg-gradient-to-r from-transparent via-sky-400/50 to-blue-500 rounded-full blur-[2px]" />
              <div className="absolute -left-28 bottom-1 w-28 h-1 bg-gradient-to-r from-transparent to-sky-400/40 blur-[1px]" />
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREW REGISTRATION MODAL */}
      {/* ========================================================================= */}
      <CrewRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
