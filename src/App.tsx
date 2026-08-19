import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
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
import { ThemeMode } from './types';
import {
  NAV_LINKS,
  THEMATIC_PILLARS,
  TIMELINE_NODES,
  PRIZE_TIERS,
  CATEGORY_BOUNTIES,
  PIRATE_RULES,
  GOLD_SPONSORS,
  SILVER_SPONSORS,
  MENTOR_LORDS,
} from './data';
import {
  PirateHatSkull,
  GoldDoubloon,
  InteractiveTreasureChest,
  MovingStarfield,
  AstrolabeDial,
  OceanWavesDivider,
} from './components/PirateAssets';
import { ThemeToggle } from './components/ThemeToggle';
import { AudioController } from './components/AudioController';
import { playPlankClick } from './utils/audio';
import { VoyageCountdownChronometer } from './components/VoyageCountdownChronometer';
import { FaqAccordionSection } from './components/FaqAccordionSection';
import { CrewRegistrationModal } from './components/CrewRegistrationModal';

/**
 * Fast icon resolver for dynamic pillars and timeline nodes
 */
function renderThematicIcon(iconType: string, className: string = 'w-5 h-5') {
  switch (iconType) {
    case 'terminal':
      return <Terminal className={className} />;
    case 'trophy':
      return <Trophy className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'ship':
      return <Ship className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'skull':
      return <Skull className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'anchor':
      return <Anchor className={className} />;
    case 'check':
      return <CheckCircle2 className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'award':
      return <Award className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

function ScrollParchmentIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
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

export default function App() {
  // Theme state: defaults to dark pirate atmosphere with local persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('cotc_theme') as ThemeMode | null;
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    }
    return 'dark';
  });

  const isDark = theme === 'dark';

  // Synchronize HTML root class & localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('cotc_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active section tracking for navbar highlighting
  const [activeSection, setActiveSection] = useState<string>('');

  // Scroll sailing boat animation state
  const [isSailing, setIsSailing] = useState(false);

  // Registration modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const scrollTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // ScrollSpy with IntersectionObserver for clean active nav links
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => link.href.replace('#', '')).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Global Wooden Plank Click Audio Feedback on Interactive Controls
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer'))
      ) {
        playPlankClick();
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  // Cleanup navigation timers on unmount
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
      if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);
    };
  }, []);

  // Smooth scroll handler with animated sailing vessel
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);

      if (href.startsWith('#')) {
        const targetId = href.substring(1);

        if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
        if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);

        if (prefersReducedMotion) {
          if (!targetId) {
            window.scrollTo({ top: 0, behavior: 'auto' });
          } else {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'auto' });
          }
          return;
        }

        setIsSailing(true);

        scrollTimerRef.current = window.setTimeout(() => {
          if (!targetId) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 700);

        finishTimerRef.current = window.setTimeout(() => {
          setIsSailing(false);
        }, 1400);
      }
    },
    [prefersReducedMotion]
  );

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950'
          : 'bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white'
      }`}
    >
      {/* Dynamic Celestial Stars Background */}
      <MovingStarfield theme={theme} />

      {/* ========================================================================= */}
      {/* NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md transition-all duration-300 border-b ${
          isDark
            ? 'bg-slate-950/90 border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-white/95 border-sky-100 shadow-[0_4px_25px_rgba(2,132,199,0.06)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center gap-3 group"
            id="nav-logo"
          >
            <div
              className={`w-11 h-11 rounded-xl p-0.5 shadow-md transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 shadow-amber-500/20 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 shadow-blue-500/20 group-hover:shadow-[0_0_20px_rgba(2,132,199,0.4)]'
              }`}
            >
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  isDark ? 'bg-slate-900' : 'bg-white'
                }`}
              >
                <PirateHatSkull
                  className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300"
                  theme={theme}
                />
              </div>
            </div>
            <div>
              <span
                className={`font-heading text-lg sm:text-xl font-bold tracking-wider block leading-tight ${
                  isDark
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-950 via-blue-700 to-sky-600'
                }`}
              >
                CODE OF THE CARIBBEAN
              </span>
              <span
                className={`text-[10px] tracking-widest uppercase font-semibold flex items-center gap-1.5 ${
                  isDark ? 'text-amber-400/80' : 'text-slate-500'
                }`}
              >
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${
                    isDark ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-blue-600'
                  }`}
                />
                DJSCE Mumbai • 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const linkId = link.href.replace('#', '');
              const isActive = activeSection === linkId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-xs lg:text-sm font-semibold tracking-wide transition-all duration-200 relative py-1 ${
                    isActive
                      ? isDark
                        ? 'text-amber-400 font-bold'
                        : 'text-blue-600 font-bold'
                      : isDark
                      ? 'text-slate-300 hover:text-amber-300'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute bottom-0 inset-x-0 h-0.5 rounded-full ${
                        isDark ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-blue-600'
                      }`}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <AudioController theme={theme} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              type="button"
              id="header-register-btn"
              onClick={() => setIsRegisterOpen(true)}
              className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-amber-500/20 hover:shadow-amber-500/40'
                  : 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              <span>Register Crew</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className={`md:hidden p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden border-b px-4 py-6 space-y-4 shadow-xl ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-sky-100'
              }`}
            >
              <div className="flex flex-col space-y-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-sm font-semibold tracking-wide px-3 py-2 rounded-lg transition-colors ${
                      isDark
                        ? 'text-slate-200 hover:bg-slate-900 hover:text-amber-300'
                        : 'text-slate-700 hover:bg-sky-50 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className={`w-full py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                      : 'bg-gradient-to-r from-blue-600 to-sky-500 text-white'
                  }`}
                >
                  <Anchor className="w-4 h-4" />
                  <span>Register Crew</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================================= */}
      {/* MAIN BODY CONTENT */}
      {/* ========================================================================= */}
      <main className="relative z-10 pt-20">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO (DISCOVER) */}
        {/* ========================================================================= */}
        <section
          id="hero"
          className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden text-center"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
            {/* Top Anchor Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm ${
                isDark
                  ? 'bg-slate-900/90 border-amber-500/40 text-amber-300 shadow-amber-500/10'
                  : 'bg-white/90 border-sky-200 text-blue-700 shadow-sky-500/10'
              }`}
            >
              <PirateHatSkull className="w-4 h-4" theme={theme} />
              <span>DJSCE Presents • Mumbai&apos;s 24-Hour Oceanic Hackathon</span>
              <GoldDoubloon size="w-3.5 h-3.5" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6"
            >
              CODE OF THE{' '}
              <span
                className={`block sm:inline ${
                  isDark
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_4px_25px_rgba(245,158,11,0.3)]'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500 drop-shadow-[0_4px_20px_rgba(2,132,199,0.2)]'
                }`}
              >
                CARIBBEAN
              </span>
            </motion.h1>

            {/* Sub-tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-sans font-medium leading-relaxed mb-8 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Sail across 24 hours of uncharted code, high-stakes bounties, and legendary engineering.
              Gather your crew and claim the spoils of DJSCE.
            </motion.p>

            {/* Key Event Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold mb-10"
            >
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-white/90 border-sky-100 text-slate-700'
                }`}
              >
                <Calendar className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                <span>October 24–25, 2026</span>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-white/90 border-sky-100 text-slate-700'
                }`}
              >
                <Clock className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                <span>24-Hour Non-Stop Hack</span>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-white/90 border-sky-100 text-slate-700'
                }`}
              >
                <MapPin className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                <span>DJSCE Campus, Mumbai</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-14"
            >
              <button
                type="button"
                id="hero-register-cta"
                onClick={() => setIsRegisterOpen(true)}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-heading font-bold text-sm tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-amber-500/30'
                    : 'bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white shadow-blue-500/30'
                }`}
              >
                <Anchor className="w-5 h-5" />
                <span>Register Your Crew</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#timeline"
                onClick={(e) => handleNavClick(e, '#timeline')}
                className={`w-full sm:w-auto px-6 py-4 rounded-xl font-heading font-semibold text-sm tracking-wider uppercase border shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-amber-300'
                    : 'bg-white hover:bg-sky-50 border-sky-200 text-blue-900'
                }`}
              >
                <Map className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                The Treasure Map
              </a>
            </motion.div>

            {/* Voyage Countdown Chronometer */}
            <VoyageCountdownChronometer theme={theme} />
          </div>
        </section>

        {/* Ocean Wave Transition Divider */}
        <OceanWavesDivider theme={theme} />

        {/* ========================================================================= */}
        {/* SECTION 2: ABOUT (UNDERSTAND - THE LEGEND) */}
        {/* ========================================================================= */}
        <section
          id="about"
          className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20 ${
            isDark ? 'bg-slate-950/70 border-t border-slate-900' : 'bg-white/60 border-t border-sky-100'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs uppercase tracking-widest font-bold mb-3 shadow-sm ${
                  isDark
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    : 'bg-sky-50 border-sky-200 text-blue-700'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                The Legend & Lore
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Understand The Odyssey
              </h2>
              <div
                className={`w-24 h-1 mx-auto rounded-full shadow-sm ${
                  isDark ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-blue-600 to-sky-400'
                }`}
              />
            </div>

            {/* Central Legend Narrative Card */}
            <div
              className={`relative rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl backdrop-blur-md mb-16 overflow-hidden border ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 shadow-slate-950/50'
                  : 'bg-white border-sky-200/80 shadow-sky-950/5'
              }`}
            >
              <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                <div
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto shadow-sm ${
                    isDark
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                      : 'bg-sky-50 border-sky-200 text-blue-600'
                  }`}
                >
                  <PirateHatSkull className="w-10 h-10" theme={theme} />
                </div>

                <p className="text-lg sm:text-2xl font-medium leading-relaxed font-sans">
                  &ldquo;The digital seas of DJSCE are calling.{' '}
                  <span className={`font-bold font-heading ${isDark ? 'text-amber-400' : 'text-blue-700'}`}>
                    Code of the Caribbean
                  </span>{' '}
                  is a premier 24-hour hackathon where developers, designers, and innovators unite to build legendary projects. Whether you are a seasoned captain or a deckhand writing your first lines of code, there is a place for you in our fleet.&rdquo;
                </p>

                <p className={`text-sm sm:text-base max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Over one intense day and night, teams will navigate challenging open problems, craft full-stack marvels, deploy AI algorithms, and pitch before distinguished industry captains.
                </p>
              </div>

              {/* 4 Thematic Pillars */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-10 border-t relative z-10 ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                {THEMATIC_PILLARS.map((pillar) => (
                  <div
                    key={pillar.title}
                    className={`p-6 rounded-2xl border transition-colors group shadow-sm ${
                      isDark
                        ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50'
                        : 'bg-slate-50 border-sky-100 hover:border-blue-300'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                        isDark
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                          : 'bg-blue-100/80 border-blue-200 text-blue-700'
                      }`}
                    >
                      {renderThematicIcon(pillar.iconType, 'w-5 h-5')}
                    </div>
                    <h3 className="font-heading font-bold text-base mb-2">{pillar.title}</h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: TIMELINE (THE TREASURE MAP) */}
        {/* ========================================================================= */}
        <section
          id="timeline"
          className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20 ${
            isDark ? 'bg-slate-950/90' : 'bg-sky-50/50'
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs uppercase tracking-widest font-bold mb-3 shadow-sm ${
                  isDark
                    ? 'bg-slate-900 border-amber-500/40 text-amber-300'
                    : 'bg-white border-sky-200 text-blue-700'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                The Treasure Map
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Voyage Timeline
              </h2>
              <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Chart the 24-hour course from boarding the ship at DJSCE to claiming the final bounty at sunset.
              </p>
              <div
                className={`w-24 h-1 mx-auto mt-6 rounded-full shadow-sm ${
                  isDark ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-blue-600 to-sky-400'
                }`}
              />
            </div>

            {/* Vertical Timeline with Central Dashed Trail */}
            <div className="relative">
              <div
                className={`hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 border-l-2 border-dashed -translate-x-1/2 ${
                  isDark ? 'border-amber-500/40' : 'border-blue-300'
                }`}
              />
              <div
                className={`md:hidden absolute left-7 top-8 bottom-8 w-0.5 border-l-2 border-dashed ${
                  isDark ? 'border-amber-500/40' : 'border-blue-300'
                }`}
              />

              {/* TIMELINE NODES MAPPING */}
              <div className="space-y-12 sm:space-y-16">
                {TIMELINE_NODES.map((node, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div
                      key={node.timeTag}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0"
                    >
                      {/* Left Side Container (on desktop) */}
                      <div
                        className={`md:w-1/2 ${
                          isEven
                            ? 'md:pr-12 md:text-right pl-16 md:pl-0'
                            : 'md:pr-12 md:text-right pl-16 md:pl-0 md:order-1 order-2'
                        }`}
                      >
                        {isEven ? (
                          <>
                            <span
                              className={`inline-block px-3 py-1 rounded-md border font-mono text-xs font-bold mb-2 ${
                                isDark
                                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                  : 'bg-blue-100 border-blue-200 text-blue-800'
                              }`}
                            >
                              {node.timeTag}
                            </span>
                            <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">
                              {node.title}
                            </h3>
                            <p
                              className={`text-xs sm:text-sm leading-relaxed ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}
                            >
                              {node.desc}
                            </p>
                          </>
                        ) : (
                          <div
                            className={`p-4 rounded-xl border text-xs space-y-1.5 shadow-sm ${
                              isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-300'
                                : 'bg-white border-sky-100 text-slate-700'
                            }`}
                          >
                            <div
                              className={`flex items-center gap-2 font-bold md:justify-end ${
                                isDark ? 'text-amber-400' : 'text-blue-700'
                              }`}
                            >
                              <span>{node.subTitle}</span>
                              {renderThematicIcon(node.subIconType, 'w-3.5 h-3.5')}
                            </div>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                              {node.subDesc}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Center Marker Node */}
                      <div
                        className={`absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl p-0.5 shadow-md z-10 ${
                          isDark
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-600 shadow-amber-500/20'
                            : 'bg-gradient-to-br from-blue-600 to-sky-400 shadow-blue-500/20'
                        }`}
                      >
                        <div
                          className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                            isDark ? 'bg-slate-950 text-amber-400' : 'bg-white text-blue-600'
                          }`}
                        >
                          {renderThematicIcon(node.iconType, 'w-6 h-6')}
                        </div>
                      </div>

                      {/* Right Side Container (on desktop) */}
                      <div
                        className={`md:w-1/2 ${
                          isEven
                            ? 'md:pl-12 pl-16'
                            : 'md:pl-12 pl-16 md:order-2 order-1'
                        }`}
                      >
                        {isEven ? (
                          <div
                            className={`p-4 rounded-xl border text-xs space-y-1.5 shadow-sm ${
                              isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-300'
                                : 'bg-white border-sky-100 text-slate-700'
                            }`}
                          >
                            <div
                              className={`flex items-center gap-2 font-bold ${
                                isDark ? 'text-amber-400' : 'text-blue-700'
                              }`}
                            >
                              {renderThematicIcon(node.subIconType, 'w-3.5 h-3.5')}
                              <span>{node.subTitle}</span>
                            </div>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                              {node.subDesc}
                            </p>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`inline-block px-3 py-1 rounded-md border font-mono text-xs font-bold mb-2 ${
                                isDark
                                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                  : 'bg-blue-100 border-blue-200 text-blue-800'
                              }`}
                            >
                              {node.timeTag}
                            </span>
                            <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">
                              {node.title}
                            </h3>
                            <p
                              className={`text-xs sm:text-sm leading-relaxed ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}
                            >
                              {node.desc}
                            </p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: PRIZE POOL (THE BOUNTY) */}
        {/* ========================================================================= */}
        <section
          id="prizes"
          className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative border-t scroll-mt-20 ${
            isDark ? 'bg-slate-950/80 border-slate-900' : 'bg-white border-sky-100'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs uppercase tracking-widest font-bold mb-3 shadow-sm ${
                  isDark
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    : 'bg-sky-50 border-sky-200 text-blue-700'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                The Spoils of Victory
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                The Royal Bounty
              </h2>
              <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Explore the spoils and rewards awaiting the fiercest pirate crews on the high seas of DJSCE.
              </p>
              <div
                className={`w-24 h-1 mx-auto mt-6 rounded-full shadow-sm ${
                  isDark ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-blue-600 to-sky-400'
                }`}
              />
            </div>

            {/* 3 Elevated Treasure Cards with Animated Chests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
              {PRIZE_TIERS.map((tier) => {
                const isChampion = tier.isPrimary;
                return (
                  <motion.div
                    key={tier.title}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`relative rounded-3xl p-8 sm:p-9 pb-10 flex flex-col justify-between shadow-xl transition-all duration-300 ${
                      isChampion
                        ? isDark
                          ? 'bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950 text-white border-2 border-amber-400 shadow-amber-500/20 md:-mt-4 z-10 order-1 md:order-2'
                          : 'bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white border-2 border-blue-400 shadow-blue-600/20 md:-mt-4 z-10 order-1 md:order-2'
                        : tier.place === '2nd Place'
                        ? `border order-2 md:order-1 ${
                            isDark
                              ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                              : 'bg-white border-sky-200 shadow-sky-950/5'
                          }`
                        : `border order-3 ${
                            isDark
                              ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                              : 'bg-white border-sky-200 shadow-sky-950/5'
                          }`
                    }`}
                  >
                    {/* Top Tier Badge */}
                    {isChampion ? (
                      <div className="absolute -top-4 inset-x-0 flex justify-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md flex items-center gap-1.5 ${
                            isDark
                              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/40'
                              : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white shadow-blue-500/30'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {tier.badge}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          isDark
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {tier.badge}
                      </div>
                    )}

                    <div>
                      <div className="mb-4 mt-2">
                        <InteractiveTreasureChest
                          bountyAmount={tier.bounty}
                          tierTitle={tier.title}
                          isPrimary={isChampion}
                        />
                      </div>

                      <div
                        className={`text-xs uppercase tracking-widest font-bold mb-1 ${
                          isChampion
                            ? 'text-amber-300'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-blue-600'
                        }`}
                      >
                        {tier.place}
                      </div>

                      <h3
                        className={`font-heading text-2xl sm:text-3xl font-bold mb-2 ${
                          isChampion
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-yellow-300 text-3xl sm:text-4xl'
                            : ''
                        }`}
                      >
                        {tier.title}
                      </h3>

                      <div
                        className={`font-heading font-black my-4 ${
                          isChampion
                            ? 'text-4xl sm:text-5xl text-amber-300 drop-shadow-sm'
                            : 'text-3xl sm:text-4xl'
                        }`}
                      >
                        {tier.bounty}
                        <span
                          className={`block text-sm font-sans font-semibold mt-1 ${
                            isChampion
                              ? 'text-white/90'
                              : isDark
                              ? 'text-amber-400'
                              : 'text-blue-700'
                          }`}
                        >
                          {tier.subtitle}
                        </span>
                      </div>

                      <ul
                        className={`space-y-3.5 text-xs sm:text-sm mt-6 pt-6 border-t ${
                          isChampion
                            ? 'text-amber-100 border-amber-900/60'
                            : isDark
                            ? 'text-slate-300 border-slate-800'
                            : 'text-slate-700 border-slate-100'
                        }`}
                      >
                        {tier.perks.map((perk) => (
                          <li key={perk} className="flex items-center gap-2.5">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 ${
                                isChampion
                                  ? 'text-amber-400'
                                  : isDark
                                  ? 'text-amber-400'
                                  : 'text-blue-600'
                              }`}
                            />
                            <span className={isChampion ? 'font-medium text-white' : ''}>
                              {perk}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Supplementary Track Bounties */}
            <div
              className={`rounded-2xl p-6 sm:p-8 text-center shadow-sm border ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/70 border-sky-200/80'
              }`}
            >
              <h3 className="font-heading font-bold text-lg mb-4 flex items-center justify-center gap-2">
                <Coins className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                Special Category Spoils & Side Quests
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {CATEGORY_BOUNTIES.map((bounty) => (
                  <div
                    key={bounty.title}
                    className={`p-4 rounded-xl border shadow-sm ${
                      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-sky-100'
                    }`}
                  >
                    <div
                      className={`font-bold text-sm mb-1 font-heading ${
                        isDark ? 'text-amber-300' : 'text-blue-900'
                      }`}
                    >
                      {bounty.title}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {bounty.reward}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: RULES / ELIGIBILITY (THE PIRATE CODE) */}
        {/* ========================================================================= */}
        <section
          id="rules"
          className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20 ${
            isDark ? 'bg-slate-950/90' : 'bg-sky-50/60'
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs uppercase tracking-widest font-bold mb-3 shadow-sm ${
                  isDark
                    ? 'bg-slate-900 border-amber-500/40 text-amber-300'
                    : 'bg-white border-sky-200 text-blue-700'
                }`}
              >
                <ScrollParchmentIcon />
                Honorable Conduct
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                The Pirate Code
              </h2>
              <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Every sailor must swear by the articles of the high seas before setting sail on the DJSCE waters.
              </p>
              <div
                className={`w-24 h-1 mx-auto mt-6 rounded-full shadow-sm ${
                  isDark ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-blue-600 to-sky-400'
                }`}
              />
            </div>

            {/* Pirate Code Parchment */}
            <div
              className={`relative rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden border-2 ${
                isDark
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-slate-950/60 text-slate-100'
                  : 'bg-white border-sky-200 shadow-sky-950/5 text-slate-900'
              }`}
            >
              {/* DJSCE Seal Stamp */}
              <div
                className={`absolute top-6 right-6 sm:top-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 shadow-sm flex items-center justify-center rotate-12 ${
                  isDark
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                    : 'bg-sky-50 border-blue-500 text-blue-900'
                }`}
              >
                <div className="text-[9px] font-heading font-black tracking-tighter text-center uppercase leading-tight">
                  DJSCE<br />SEAL
                </div>
              </div>

              <div className="max-w-3xl space-y-8">
                <div
                  className={`flex items-center gap-3 font-heading text-lg font-bold border-b pb-3 ${
                    isDark ? 'text-amber-300 border-slate-800' : 'text-blue-900 border-slate-100'
                  }`}
                >
                  <Sword className={`w-5 h-5 rotate-45 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                  Articles of Seafaring & Eligibility
                </div>

                {/* 3 Core Rules from PIRATE_RULES */}
                <div className="space-y-6">
                  {PIRATE_RULES.map((rule) => (
                    <div
                      key={rule.numeral}
                      className={`flex items-start gap-4 p-5 rounded-2xl border ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-sky-50/60 border-sky-100'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-sm shrink-0 mt-0.5 shadow-sm ${
                          isDark ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {rule.numeral}
                      </div>
                      <div>
                        <h3
                          className={`font-heading font-bold text-base sm:text-lg mb-1 ${
                            isDark ? 'text-amber-300' : 'text-blue-950'
                          }`}
                        >
                          {rule.title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {rule.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`p-4 rounded-xl border text-xs flex items-center gap-3 font-medium ${
                    isDark
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                      : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}
                >
                  <Shield className="w-5 h-5 shrink-0 text-amber-400" />
                  <span>Fair play is non-negotiable. Any sailor found plagiarizing commits will be made to walk the plank!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: SPONSORS & PIRATE LORDS */}
        {/* ========================================================================= */}
        <section
          id="allies"
          className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative border-t scroll-mt-20 ${
            isDark ? 'bg-slate-950/80 border-slate-900' : 'bg-white border-sky-100'
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-20">
            {/* SPONSORS (ALLIES) */}
            <div>
              <div className="text-center max-w-3xl mx-auto mb-14">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs uppercase tracking-widest font-bold mb-3 shadow-sm ${
                    isDark
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-sky-50 border-sky-200 text-blue-700'
                  }`}
                >
                  <Anchor className="w-3.5 h-3.5" />
                  Fleet Alliances
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                  Our High-Seas Sponsors
                </h2>
                <p className={`text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Backed by legendary tech syndicates providing bounties, APIs, and cloud resources.
                </p>
              </div>

              {/* Gold Tier Sponsors */}
              <div className="mb-10">
                <div className="text-center mb-6">
                  <span
                    className={`text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-full border shadow-sm ${
                      isDark
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-sky-100 text-blue-800 border-sky-200'
                    }`}
                  >
                    ★ Gold Tier Armada ★
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {GOLD_SPONSORS.map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className={`p-6 rounded-2xl border transition-all duration-300 text-center group shadow-sm ${
                        isDark
                          ? 'bg-slate-900/90 border-slate-800 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
                          : 'bg-white border-sky-200/80 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl border mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                          isDark
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                            : 'bg-sky-50 border-sky-200 text-blue-600'
                        }`}
                      >
                        <Ship className="w-6 h-6" />
                      </div>
                      <div
                        className={`font-heading font-extrabold text-xl transition-colors ${
                          isDark ? 'text-slate-100 group-hover:text-amber-300' : 'text-slate-900 group-hover:text-blue-600'
                        }`}
                      >
                        {sponsor.name}
                      </div>
                      <div className={`text-xs mt-1 mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {sponsor.tagline}
                      </div>
                      <span
                        className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                          isDark
                            ? 'text-amber-300 bg-amber-950/40 border-amber-500/30'
                            : 'text-blue-700 bg-sky-50 border-sky-200'
                        }`}
                      >
                        {sponsor.perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Silver Tier Sponsors */}
              <div>
                <div className="text-center mb-6">
                  <span
                    className={`text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full border ${
                      isDark
                        ? 'text-slate-400 bg-slate-900 border-slate-800'
                        : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}
                  >
                    Silver Tier Frigates
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {SILVER_SPONSORS.map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className={`p-4 rounded-xl border text-center transition-colors ${
                        isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:border-amber-400/50 text-slate-200'
                          : 'bg-slate-50 border-slate-200/80 hover:border-blue-400 text-slate-800'
                      }`}
                    >
                      <div className="font-heading font-bold text-sm sm:text-base">
                        {sponsor.name}
                      </div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {sponsor.spec}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PIRATE LORDS (JUDGES & MENTORS) */}
            <div className={`pt-10 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="text-center max-w-3xl mx-auto mb-14">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs uppercase tracking-widest font-bold mb-3 shadow-sm ${
                    isDark
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-sky-50 border-sky-200 text-blue-700'
                  }`}
                >
                  <Skull className="w-3.5 h-3.5" />
                  The High Council
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                  Judges & Mentor Lords
                </h2>
                <p className={`text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Distinguished tech captains evaluating the fleet and helping you chart uncharted waters.
                </p>
              </div>

              {/* Grid of Mentors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MENTOR_LORDS.map((mentor) => (
                  <div
                    key={mentor.name}
                    className={`p-6 rounded-2xl border transition-all duration-300 text-center group shadow-sm ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-800 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
                        : 'bg-white border-sky-200/80 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full border-2 p-1 mx-auto mb-4 transition-colors shadow-sm ${
                        isDark
                          ? 'bg-slate-950 border-amber-500/40 group-hover:border-amber-400'
                          : 'bg-sky-50 border-sky-200 group-hover:border-blue-500'
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center ${
                          isDark ? 'bg-slate-900 text-amber-400' : 'bg-white text-blue-600'
                        }`}
                      >
                        <User className="w-9 h-9" />
                      </div>
                    </div>

                    <h3
                      className={`font-heading font-bold text-base sm:text-lg mb-1 transition-colors ${
                        isDark ? 'text-slate-100 group-hover:text-amber-300' : 'text-slate-900 group-hover:text-blue-600'
                      }`}
                    >
                      {mentor.name}
                    </h3>
                    <div className={`text-xs font-bold mb-1 ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                      {mentor.role}
                    </div>
                    <div className={`text-[11px] font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {mentor.fleet}
                    </div>

                    <div
                      className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg border ${
                        isDark
                          ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                          : 'bg-sky-50 text-blue-800 border-sky-100'
                      }`}
                    >
                      {mentor.track}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: FAQS */}
        {/* ========================================================================= */}
        <section
          id="faqs"
          className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20 ${
            isDark ? 'bg-slate-950/90' : 'bg-sky-50/60'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs uppercase tracking-widest font-bold mb-3 shadow-sm ${
                  isDark
                    ? 'bg-slate-900 border-amber-500/40 text-amber-300'
                    : 'bg-white border-sky-200 text-blue-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Message in a Bottle
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className={`text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Uncork the bottles washed ashore with all the answers you need before embarkation.
              </p>
              <div
                className={`w-24 h-1 mx-auto mt-6 rounded-full shadow-sm ${
                  isDark ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-blue-600 to-sky-400'
                }`}
              />
            </div>

            {/* Accordion List */}
            <FaqAccordionSection theme={theme} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL REGISTRATION CTA BANNER */}
        {/* ========================================================================= */}
        <section
          className={`py-20 px-4 sm:px-6 lg:px-8 relative border-t ${
            isDark ? 'bg-slate-950 border-slate-900' : 'bg-white border-sky-100'
          }`}
        >
          <div
            className={`max-w-5xl mx-auto rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl ${
              isDark
                ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 shadow-amber-500/20 text-slate-950'
                : 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-blue-500/25 text-white'
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />

            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight mb-4 drop-shadow-sm">
              Will You Claim The Bounty?
            </h2>
            <p className="text-sm sm:text-lg max-w-2xl mx-auto mb-8 font-sans opacity-90 font-medium">
              Assemble your crew of up to 4 sailors and prepare to embark on Mumbai&apos;s most thrilling collegiate hackathon.
            </p>

            <button
              type="button"
              id="cta-register-btn"
              onClick={() => setIsRegisterOpen(true)}
              className={`px-10 py-5 rounded-xl font-heading font-bold text-base sm:text-lg tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer ${
                isDark
                  ? 'bg-slate-950 text-amber-300 hover:bg-slate-900 shadow-slate-950/40'
                  : 'bg-white text-blue-900 hover:bg-sky-50 shadow-blue-900/30'
              }`}
            >
              <Anchor className="w-5 h-5" />
              Register Your Crew Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* SECTION 8: FOOTER */}
      {/* ========================================================================= */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
                  <PirateHatSkull className="w-6 h-6" theme="dark" />
                </div>
                <div>
                  <span className="font-heading text-lg font-bold text-white tracking-wide block">
                    CODE OF THE CARIBBEAN 2026
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    Dwarkadas J. Sanghvi College of Engineering, Mumbai
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md pt-2">
                Crafted for the DJSCE Tech Co-Com Web Recruitment Task. May your code compile and your servers hold steady. Stay bold, keep building, and sail onward toward greatness.
              </p>

              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Harbor Coordinates: 19.1075° N, 72.8372° E (Vile Parle West, Mumbai)</span>
              </div>
            </div>

            {/* Navigation links */}
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
                      className="hover:text-amber-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Task metadata */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-4">
                Task Info
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                DJSCE Tech Co-Com Recruitment 2026. Task 2: Hackathon Landing Page Showcase.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-medium">
                ⚡ 24-Hour Oceanic Treasure Hunt Theme
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © 2026 Code of the Caribbean • DJSCE Technical Committee. All Rights Reserved.
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, '#about')}
                className="hover:text-amber-400 transition-colors"
              >
                Lore
              </a>
              <a
                href="#rules"
                onClick={(e) => handleNavClick(e, '#rules')}
                className="hover:text-amber-400 transition-colors"
              >
                Code
              </a>
              <a
                href="#"
                onClick={(e) => handleNavClick(e, '#')}
                className="hover:text-amber-400 transition-colors"
              >
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* SCROLL-TRIGGERED SHIP ANIMATION OVERLAY */}
      {/* ========================================================================= */}
      {isSailing && (
        <div className="fixed bottom-4 left-0 right-0 w-full pointer-events-none z-50 overflow-hidden h-28 flex items-end">
          <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: '100vw' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="flex items-center gap-3 relative transform-gpu will-change-transform"
          >
            <motion.div
              animate={{
                y: [0, -10, 0, -8, 0],
                rotate: [0, 4, -4, 2, 0],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`relative drop-shadow-[0_4px_15px_rgba(245,158,11,0.5)] transform-gpu will-change-transform ${
                isDark ? 'text-amber-400' : 'text-blue-600'
              }`}
            >
              <Ship
                className={`w-16 h-16 sm:w-20 sm:h-20 stroke-[1.5] ${
                  isDark
                    ? 'text-amber-400 fill-slate-900 stroke-amber-400'
                    : 'text-blue-600 fill-white stroke-blue-600'
                }`}
              />

              {/* Oceanic glowing wake trail */}
              <div
                className={`absolute -left-16 bottom-2 w-20 h-2 rounded-full blur-[2px] ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-yellow-500'
                    : 'bg-gradient-to-r from-transparent via-sky-400/50 to-blue-500'
                }`}
              />
              <div
                className={`absolute -left-28 bottom-1 w-28 h-1 blur-[1px] ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent to-amber-400/40'
                    : 'bg-gradient-to-r from-transparent to-sky-400/40'
                }`}
              />
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
        theme={theme}
      />
    </div>
  );
}
