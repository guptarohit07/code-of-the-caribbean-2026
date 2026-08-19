import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Waves,
  Sparkles,
  Bomb,
  Music,
  Sliders,
  ChevronUp,
} from 'lucide-react';
import {
  getSFXState,
  setSFXState,
  getAmbientState,
  toggleAmbientOceanAudio,
  playPlankClick,
  playCannonBlast,
  getMasterVolume,
  setMasterVolume,
} from '../utils/audio';
import { ThemeMode } from '../types';

interface AudioControllerProps {
  theme: ThemeMode;
}

export const AudioController = memo(function AudioController({ theme }: AudioControllerProps) {
  const isDark = theme === 'dark';
  const [sfxOn, setSfxOn] = useState(getSFXState);
  const [ambientOn, setAmbientOn] = useState(getAmbientState);
  const [volume, setVol] = useState(getMasterVolume);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close audio menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleToggleSfx = useCallback(() => {
    const next = !sfxOn;
    setSfxOn(next);
    setSFXState(next);
    if (next) playPlankClick();
  }, [sfxOn]);

  const handleToggleAmbient = useCallback(() => {
    const active = toggleAmbientOceanAudio();
    setAmbientOn(active);
    if (sfxOn) playPlankClick();
  }, [sfxOn]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVol(val);
    setMasterVolume(val);
  }, []);

  const handleTestCannon = useCallback(() => {
    playCannonBlast();
  }, []);

  return (
    <div ref={menuRef} className="relative inline-flex items-center">
      {/* Primary Audio Toggle Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          playPlankClick();
        }}
        aria-label="Sound and Ambience Controls"
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-200 shadow-sm ${
          ambientOn || sfxOn
            ? isDark
              ? 'bg-slate-900 border-amber-500/50 text-amber-400 hover:border-amber-400 shadow-amber-500/10'
              : 'bg-white border-blue-200 text-blue-600 hover:border-blue-400 shadow-blue-500/10'
            : isDark
            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
        }`}
      >
        {ambientOn ? (
          <div className="relative flex items-center">
            <Waves className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
        ) : sfxOn ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}

        <span className="hidden sm:inline">
          {ambientOn ? 'Ocean Audio' : sfxOn ? 'SFX On' : 'Muted'}
        </span>
        <ChevronUp
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Audio Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl border shadow-2xl z-50 backdrop-blur-lg ${
              isDark
                ? 'bg-slate-950/95 border-amber-500/40 text-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
                : 'bg-white/95 border-sky-200 text-slate-900 shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Music className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                <span className="font-heading font-bold text-xs uppercase tracking-wider">
                  Pirate Sound Controls
                </span>
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-amber-400/70' : 'text-blue-600'}`}>
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              {/* SFX Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      sfxOn
                        ? isDark
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                        : isDark
                        ? 'bg-slate-900 text-slate-500'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Sound Effects (SFX)</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Plank clicks & treasure
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSfx}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    sfxOn
                      ? isDark
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                      : isDark
                      ? 'bg-slate-800'
                      : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${
                      sfxOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Ambient Ocean Waves & Timber Creak */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      ambientOn
                        ? isDark
                          ? 'bg-sky-950/80 text-sky-400 border border-sky-500/40'
                          : 'bg-sky-50 text-sky-600 border border-sky-200'
                        : isDark
                        ? 'bg-slate-900 text-slate-500'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Waves className={`w-3.5 h-3.5 ${ambientOn ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Ocean Ambience</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Wave swells & ship timber
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAmbient}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    ambientOn
                      ? 'bg-sky-500'
                      : isDark
                      ? 'bg-slate-800'
                      : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${
                      ambientOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Master Volume</span>
                  <Sliders className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Cannon Blast Preview */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cannon Blast SFX
                </span>
                <button
                  type="button"
                  onClick={handleTestCannon}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all hover:scale-105 active:scale-95 ${
                    isDark
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                      : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Bomb className="w-3 h-3 text-red-400" />
                  Fire Cannon!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
