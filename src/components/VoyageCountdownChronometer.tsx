import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import { TARGET_DATE_TIME } from '../data';
import { ThemeMode } from '../types';

interface VoyageCountdownProps {
  theme: ThemeMode;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeRemaining(): TimeRemaining {
  const difference = TARGET_DATE_TIME - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(difference / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export const VoyageCountdownChronometer = memo(function VoyageCountdownChronometer({
  theme,
}: VoyageCountdownProps) {
  const isDark = theme === 'dark';
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(getTimeRemaining);

  useEffect(() => {
    const updateCountdown = () => {
      const next = getTimeRemaining();
      setTimeLeft((prev) => {
        if (
          prev.seconds === next.seconds &&
          prev.minutes === next.minutes &&
          prev.hours === next.hours &&
          prev.days === next.days
        ) {
          return prev;
        }
        return next;
      });
    };

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`w-full max-w-2xl rounded-2xl p-6 backdrop-blur-md relative overflow-hidden transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/90 border-2 border-amber-500/40 shadow-2xl shadow-amber-950/30'
          : 'bg-white/95 border border-sky-200/80 shadow-xl shadow-sky-950/5'
      }`}
    >
      {/* Top Gradient Trim */}
      <div
        className={`absolute top-0 inset-x-0 h-1.5 ${
          isDark
            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 shadow-[0_0_15px_#f59e0b]'
            : 'bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600'
        }`}
      />

      <div
        className={`flex items-center justify-between mb-4 pb-3 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <div
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
            isDark ? 'text-amber-400' : 'text-blue-700'
          }`}
        >
          <Compass
            className={`w-4 h-4 animate-spin ${isDark ? 'text-amber-400' : 'text-blue-600'}`}
            style={{ animationDuration: '20s' }}
          />
          <span>Voyage Departure Chronometer</span>
        </div>
        <div className={`text-[11px] font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Time to Cast Anchor: 09:00 AM IST
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {/* Days */}
        <div
          className={`rounded-xl p-3 sm:p-4 shadow-sm border transition-colors ${
            isDark
              ? 'bg-slate-950/80 border-slate-800 text-white'
              : 'bg-sky-50/70 border-sky-100 text-blue-950'
          }`}
        >
          <div className="text-2xl sm:text-4xl font-heading font-bold">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div
            className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1 ${
              isDark ? 'text-amber-400/80' : 'text-slate-500'
            }`}
          >
            Days
          </div>
        </div>

        {/* Hours */}
        <div
          className={`rounded-xl p-3 sm:p-4 shadow-sm border transition-colors ${
            isDark
              ? 'bg-slate-950/80 border-slate-800 text-white'
              : 'bg-sky-50/70 border-sky-100 text-blue-950'
          }`}
        >
          <div className="text-2xl sm:text-4xl font-heading font-bold">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div
            className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1 ${
              isDark ? 'text-amber-400/80' : 'text-slate-500'
            }`}
          >
            Hours
          </div>
        </div>

        {/* Minutes */}
        <div
          className={`rounded-xl p-3 sm:p-4 shadow-sm border transition-colors ${
            isDark
              ? 'bg-slate-950/80 border-slate-800 text-white'
              : 'bg-sky-50/70 border-sky-100 text-blue-950'
          }`}
        >
          <div className="text-2xl sm:text-4xl font-heading font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div
            className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1 ${
              isDark ? 'text-amber-400/80' : 'text-slate-500'
            }`}
          >
            Minutes
          </div>
        </div>

        {/* Seconds */}
        <div
          className={`rounded-xl p-3 sm:p-4 shadow-sm border transition-colors ${
            isDark
              ? 'bg-slate-950/80 border-amber-500/30 text-amber-400'
              : 'bg-sky-50/70 border-sky-100 text-blue-600'
          }`}
        >
          <div className="text-2xl sm:text-4xl font-heading font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div
            className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1 ${
              isDark ? 'text-amber-400/80' : 'text-slate-500'
            }`}
          >
            Seconds
          </div>
        </div>
      </div>
    </motion.div>
  );
});
