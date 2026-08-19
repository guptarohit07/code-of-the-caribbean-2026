import React, { memo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export const ThemeToggle = memo(function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 border transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20'
          : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-blue-800 shadow-sm'
      }`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light Oceanic Mode' : 'Dark Pirate Voyage Mode'}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20 transition-transform rotate-0" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 fill-amber-400/20 transition-transform rotate-90" />
        )}
      </div>

      <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-wider font-heading">
        {isDark ? 'Dark Seas' : 'Light Waters'}
      </span>

      {isDark && (
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
    </button>
  );
});
