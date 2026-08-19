import React, { useRef, useEffect, memo, useId } from 'react';
import { motion, useInView } from 'motion/react';
import confetti from 'canvas-confetti';

/**
 * Custom Pirate Hat with Jolly Roger Skull
 */
export const PirateHatSkull = memo(function PirateHatSkull({
  className = 'w-8 h-8',
  theme = 'dark',
}: {
  className?: string;
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pirate Tricorn Hat */}
      <path
        d="M6 34C10 26 24 16 32 16C40 16 54 26 58 34C60 38 52 40 46 39C40 38 36 34 32 34C28 34 24 38 18 39C12 40 4 38 6 34Z"
        fill={isDark ? '#0f172a' : '#1e293b'}
        stroke={isDark ? '#f59e0b' : '#0284c7'}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Top brim curve */}
      <path
        d="M20 22C24 10 40 10 44 22"
        fill={isDark ? '#020617' : '#0f172a'}
        stroke={isDark ? '#fbbf24' : '#38bdf8'}
        strokeWidth="2"
      />
      {/* Golden Feather plume */}
      <path
        d="M44 18C48 10 56 8 58 12C60 16 54 22 48 24"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#fbbf24"
      />
      {/* Skull Face */}
      <circle
        cx="32"
        cy="42"
        r="10"
        fill={isDark ? '#f8fafc' : '#ffffff'}
        stroke={isDark ? '#e2e8f0' : '#cbd5e1'}
        strokeWidth="1.5"
      />
      {/* Eye sockets */}
      <circle cx="28" cy="41" r="2.5" fill="#0f172a" />
      <circle cx="36" cy="41" r="2.5" fill="#0f172a" />
      {/* Nose */}
      <path d="M32 44L31 46H33L32 44Z" fill="#0f172a" />
      {/* Skull Teeth */}
      <path d="M29 50H35M31 49V51M33 49V51" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
      {/* Crossbones behind */}
      <path
        d="M18 52L46 36M46 52L18 36"
        stroke={isDark ? '#f59e0b' : '#38bdf8'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

/**
 * 3D Golden Doubloon with shimmer & spin (unique SVG IDs for clean render)
 */
export const GoldDoubloon = memo(function GoldDoubloon({
  size = 'w-6 h-6',
  className = '',
}: {
  size?: string;
  className?: string;
}) {
  const outerGradId = useId();
  const innerGradId = useId();

  return (
    <div className={`relative inline-flex items-center justify-center ${size} ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-md">
        <circle cx="20" cy="20" r="18" fill={`url(#${outerGradId})`} stroke="#b45309" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="14" fill={`url(#${innerGradId})`} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 1.5" />
        {/* Skull embossed emblem in center of coin */}
        <circle cx="20" cy="18" r="4.5" fill="#78350f" opacity="0.85" />
        <circle cx="18.5" cy="17.5" r="1" fill="#fef08a" />
        <circle cx="21.5" cy="17.5" r="1" fill="#fef08a" />
        <path d="M19 22H21" stroke="#78350f" strokeWidth="1.5" />
        <defs>
          <linearGradient id={outerGradId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.4" stopColor="#f59e0b" />
            <stop offset="0.8" stopColor="#d97706" />
            <stop offset="1" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id={innerGradId} x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="0.6" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
});

/**
 * Interactive Animated Treasure Chest Component:
 * Automatically opens lid and erupts golden rays & sparkles when scrolled into view!
 */
export const InteractiveTreasureChest = memo(function InteractiveTreasureChest({
  bountyAmount = '₹50,000',
  tierTitle = 'Grand Fleet Bounty',
  isPrimary = false,
}: {
  bountyAmount?: string;
  tierTitle?: string;
  isPrimary?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.35, once: true });
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (isInView && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      try {
        confetti({
          particleCount: isPrimary ? 65 : 40,
          spread: 65,
          origin: { y: 0.65 },
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#38bdf8', '#ffffff'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isInView, isPrimary]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-3 select-none"
    >
      {/* Golden Sunburst Rays on Auto-Open */}
      {isInView && (
        <div className="absolute -top-10 w-44 h-44 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.35)_0%,transparent_70%)] animate-pulse pointer-events-none z-0" />
      )}

      {/* Floating Gold Coin Badge */}
      {isInView && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.6 }}
          animate={{ opacity: 1, y: -22, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
          className="absolute -top-8 flex items-center gap-1 z-20 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-400 text-amber-300 text-xs font-black shadow-lg shadow-amber-500/30"
        >
          <GoldDoubloon size="w-4 h-4" />
          <span>{bountyAmount} Unlocked!</span>
        </motion.div>
      )}

      {/* Vector Treasure Chest SVG */}
      <svg
        viewBox="0 0 100 80"
        className={`w-20 h-16 sm:w-24 sm:h-20 transition-transform duration-500 ${
          isInView ? 'scale-110' : 'scale-100'
        }`}
      >
        {/* Chest Base */}
        <path
          d="M15 35H85L80 72C80 74 78 76 75 76H25C22 76 20 74 20 72L15 35Z"
          fill="#5a2e12"
          stroke="#2d1305"
          strokeWidth="3"
        />
        {/* Wood Planks Lines */}
        <path d="M17 48H83M18 62H81" stroke="#3d1b08" strokeWidth="2" />
        {/* Iron/Gold Corner Straps */}
        <path d="M22 35L25 76M78 35L75 76" stroke="#f59e0b" strokeWidth="4" />
        
        {/* Glowing Gold Coins Spill (visible when in view and opened) */}
        {isInView && (
          <g className="animate-pulse">
            <ellipse cx="50" cy="35" rx="26" ry="10" fill="#fbbf24" />
            <circle cx="42" cy="33" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            <circle cx="58" cy="34" r="5.5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            <circle cx="50" cy="30" r="6" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            {/* Sparkles */}
            <path d="M50 20L52 24L56 25L52 26L50 30L48 26L44 25L48 24Z" fill="#ffffff" />
            <path d="M64 24L65 26L67 27L65 28L64 30L63 28L61 27L63 26Z" fill="#fef08a" />
          </g>
        )}

        {/* Chest Lid - Automatic Rotation when in view */}
        <g
          style={{
            transformOrigin: '50px 35px',
            transform: isInView ? 'rotate(-38deg) translateY(-8px)' : 'rotate(0deg)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Lid Dome */}
          <path
            d="M12 35C12 20 28 12 50 12C72 12 88 20 88 35H12Z"
            fill="#783c19"
            stroke="#2d1305"
            strokeWidth="3"
          />
          {/* Gold Ribs on Lid */}
          <path d="M22 35C24 22 32 15 50 15C68 15 76 22 78 35" stroke="#f59e0b" strokeWidth="3.5" fill="none" />
          {/* Lock Buckle */}
          <rect x="45" y="30" width="10" height="12" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="50" cy="35" r="2" fill="#2d1305" />
        </g>
      </svg>

      <span className="text-[11px] font-mono font-bold tracking-wider text-amber-500 mt-1 uppercase flex items-center gap-1">
        <GoldDoubloon size="w-3.5 h-3.5" />
        <span>{tierTitle}</span>
      </span>
    </div>
  );
});

/**
 * Constantly Moving Celestial Stars & Constellations Background
 */
export const MovingStarfield = memo(function MovingStarfield({
  theme = 'dark',
}: {
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Deep Celestial Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950/40 to-slate-950'
            : 'bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-sky-50/70 to-blue-50/40'
        }`}
      />

      {/* Nebula Fog Lights */}
      {isDark ? (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[700px] h-[700px] bg-amber-900/10 rounded-full blur-3xl" />
        </>
      ) : (
        <>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-sky-100/60 rounded-full blur-3xl" />
        </>
      )}

      {/* Star Array Layer 1 - Twinkling Gold & Cyan Stars (Visible in dark mode) */}
      {isDark && (
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-twinkle" />
          <div className="absolute top-[18%] left-[70%] w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_10px_#38bdf8] animate-twinkle-delayed" />
          <div className="absolute top-[35%] left-[25%] w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#fff] animate-twinkle-fast" />
          <div className="absolute top-[45%] left-[85%] w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#fde68a] animate-twinkle" />
          <div className="absolute top-[60%] left-[10%] w-1.5 h-1.5 rounded-full bg-sky-200 shadow-[0_0_8px_#7dd3fc] animate-twinkle-delayed" />
          <div className="absolute top-[75%] left-[60%] w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-twinkle-fast" />
          <div className="absolute top-[88%] left-[30%] w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-twinkle" />
          <div className="absolute top-[28%] left-[45%] w-1 h-1 rounded-full bg-white animate-twinkle" />
          <div className="absolute top-[68%] left-[90%] w-1 h-1 rounded-full bg-amber-100 animate-twinkle-delayed" />

          {/* Shooting Stars */}
          <div className="absolute top-12 left-1/3 w-28 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-white animate-shooting-star" />
          <div className="absolute top-1/2 left-2/3 w-36 h-0.5 bg-gradient-to-r from-transparent via-sky-300 to-white animate-shooting-star-2" />
        </div>
      )}

      {/* Nautical Astrolabe Grid Lines */}
      <div
        className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 ${
          isDark
            ? 'bg-[linear-gradient(to_right,#38bdf812_1px,transparent_1px),linear-gradient(to_bottom,#38bdf812_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)]'
        }`}
      />
    </div>
  );
});

/**
 * Astrolabe Dial & Nautical Navigator
 */
export const AstrolabeDial = memo(function AstrolabeDial({
  className = 'w-16 h-16',
  theme = 'dark',
}: {
  className?: string;
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Rotating Brass Ring */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-spin"
        style={{ animationDuration: '60s' }}
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={isDark ? '#f59e0b' : '#0284c7'}
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={isDark ? '#d97706' : '#38bdf8'}
          strokeWidth="1.5"
        />
        {/* Cardinal Markers */}
        <text x="50" y="18" textAnchor="middle" fill={isDark ? '#fbbf24' : '#0369a1'} fontSize="9" fontWeight="bold" fontFamily="serif">N</text>
        <text x="50" y="90" textAnchor="middle" fill={isDark ? '#fbbf24' : '#0369a1'} fontSize="9" fontWeight="bold" fontFamily="serif">S</text>
        <text x="86" y="53" textAnchor="middle" fill={isDark ? '#fbbf24' : '#0369a1'} fontSize="9" fontWeight="bold" fontFamily="serif">E</text>
        <text x="14" y="53" textAnchor="middle" fill={isDark ? '#fbbf24' : '#0369a1'} fontSize="9" fontWeight="bold" fontFamily="serif">W</text>
      </svg>
      {/* Inner Compass Star */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 40 40" className="w-2/3 h-2/3">
          <polygon points="20,4 23,17 36,20 23,23 20,36 17,23 4,20 17,17" fill={isDark ? '#fbbf24' : '#0284c7'} />
          <circle cx="20" cy="20" r="3" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
});

/**
 * Flowing Ocean Waves Section Divider
 */
export const OceanWavesDivider = memo(function OceanWavesDivider({
  theme = 'dark',
  flip = false,
}: {
  theme?: 'dark' | 'light';
  flip?: boolean;
}) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`relative block w-full h-8 sm:h-12 ${
          theme === 'dark' ? 'text-slate-900/60' : 'text-sky-100/70'
        }`}
        fill="currentColor"
      >
        <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
});
