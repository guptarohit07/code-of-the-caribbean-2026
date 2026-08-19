import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Anchor,
  CheckCircle2,
  X,
  Skull,
  Compass,
  Shield,
  Zap,
} from 'lucide-react';
import { RegistrationFormState, MemberInfo, ThemeMode } from '../types';
import { DEFAULT_MEMBERS, VOYAGE_TRACKS } from '../data';
import { PirateHatSkull } from './PirateAssets';
import { playCannonBlast, playPlankClick } from '../utils/audio';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

function getCrewRoleIcon(index: number, isDark: boolean) {
  const iconColor = isDark ? 'text-amber-400' : 'text-blue-600';
  switch (index) {
    case 0:
      return <Skull className={`w-4 h-4 ${iconColor}`} />;
    case 1:
      return <Compass className={`w-4 h-4 ${iconColor}`} />;
    case 2:
      return <Shield className={`w-4 h-4 ${iconColor}`} />;
    default:
      return <Zap className={`w-4 h-4 ${iconColor}`} />;
  }
}

export const CrewRegistrationModal = memo(function CrewRegistrationModal({
  isOpen,
  onClose,
  theme,
}: RegistrationModalProps) {
  const isDark = theme === 'dark';

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

    // Fire explosive pirate cannon SFX
    playCannonBlast();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#0284c7', '#2563eb', '#38bdf8', '#ffffff'],
      });
    } catch {
      // Safe fallback
    }
  }, []);

  const handleCopyTicket = useCallback(() => {
    if (ticketId) {
      playPlankClick();
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto border transition-colors ${
              isDark
                ? 'bg-slate-900 border-amber-500/40 text-slate-100 shadow-amber-950/40'
                : 'bg-white border-sky-200 text-slate-900 shadow-sky-950/20'
            }`}
          >
            {/* Top Gradient Banner */}
            <div
              className={`absolute top-0 inset-x-0 h-1.5 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 shadow-[0_0_15px_#f59e0b]'
                  : 'bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600'
              }`}
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className={`sticky float-right top-0 -mr-2 -mt-2 p-2 rounded-xl transition-colors cursor-pointer z-20 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Close registration dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {!isRegistered ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 border ${
                      isDark
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                        : 'bg-sky-50 border-sky-200 text-blue-600'
                    }`}
                  >
                    <PirateHatSkull className="w-8 h-8" theme={theme} />
                  </div>
                  <div>
                    <h2
                      id="registration-modal-title"
                      className="font-heading text-2xl sm:text-3xl font-bold tracking-tight"
                    >
                      Register Your Crew Manifest
                    </h2>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${
                        isDark ? 'text-amber-400' : 'text-blue-600'
                      }`}
                    >
                      Code of the Caribbean 2026 • DJSCE Harbor Gate Entry
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs sm:text-sm">
                  {/* BLOCK 1: SHIP & VOYAGE DETAILS */}
                  <div
                    className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                      isDark
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-sky-50/60 border-sky-100'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 font-heading font-bold text-sm sm:text-base border-b pb-2.5 ${
                        isDark
                          ? 'text-amber-300 border-slate-800'
                          : 'text-blue-900 border-sky-200/80'
                      }`}
                    >
                      <Anchor className="w-4 h-4 text-amber-500" />
                      1. Vessel & Voyage Information
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="shipName"
                          className={`block font-semibold mb-1.5 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          Ship / Crew Name *
                        </label>
                        <input
                          id="shipName"
                          type="text"
                          required
                          value={regForm.shipName}
                          onChange={(e) => setRegForm({ ...regForm, shipName: e.target.value })}
                          placeholder="e.g. The Black Pearl"
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
                              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="college"
                          className={`block font-semibold mb-1.5 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          College / Institute *
                        </label>
                        <input
                          id="college"
                          type="text"
                          required
                          value={regForm.college}
                          onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                          placeholder="e.g. DJSCE Mumbai"
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
                              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="voyageTrack"
                          className={`block font-semibold mb-1.5 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          Preferred Voyage Track *
                        </label>
                        <select
                          id="voyageTrack"
                          value={regForm.voyageTrack}
                          onChange={(e) => setRegForm({ ...regForm, voyageTrack: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-400'
                              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                          }`}
                        >
                          {VOYAGE_TRACKS.map((track) => (
                            <option key={track} value={track} className={isDark ? 'bg-slate-900 text-white' : ''}>
                              {track}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block font-semibold mb-1.5 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
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
                                  ? isDark
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                                    : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                                  : isDark
                                  ? 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/50'
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
                            isDark
                              ? isCaptain
                                ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/5'
                                : 'bg-slate-950/60 border-slate-800'
                              : isCaptain
                              ? 'bg-white border-blue-300 shadow-md shadow-blue-500/5'
                              : 'bg-slate-50/70 border-slate-200'
                          }`}
                        >
                          <div
                            className={`flex items-center justify-between border-b pb-3 mb-4 ${
                              isDark ? 'border-slate-800' : 'border-slate-100'
                            }`}
                          >
                            <div
                              className={`flex items-center gap-2.5 font-heading font-bold text-sm sm:text-base ${
                                isDark ? 'text-slate-100' : 'text-slate-900'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                                  isDark
                                    ? 'bg-slate-800 border-slate-700'
                                    : 'bg-sky-50 border-sky-200'
                                }`}
                              >
                                {getCrewRoleIcon(idx, isDark)}
                              </div>
                              <span>{member.roleTitle}</span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                                isDark
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                  : 'bg-blue-100 text-blue-800 border-blue-200'
                              }`}
                            >
                              {member.badge} {isCaptain ? '★ Primary Contact' : `• Mate #${idx + 1}`}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor={`member-name-${idx}`}
                                className={`block font-semibold mb-1.5 ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                {member.badge} Full Name *
                              </label>
                              <input
                                id={`member-name-${idx}`}
                                type="text"
                                required
                                value={member.name}
                                onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                placeholder={isCaptain ? 'e.g. Jack Sparrow' : `e.g. Teammate ${idx + 1} Name`}
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                                  isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
                                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                                }`}
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`member-email-${idx}`}
                                className={`block font-semibold mb-1.5 ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                {member.badge} Email Address *
                              </label>
                              <input
                                id={`member-email-${idx}`}
                                type="email"
                                required
                                value={member.email}
                                onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                placeholder={isCaptain ? 'captain@djsce.edu' : `sailor${idx + 1}@djsce.edu`}
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                                  isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
                                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                                }`}
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`member-phone-${idx}`}
                                className={`block font-semibold mb-1.5 ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                {member.badge} Phone Number *
                              </label>
                              <input
                                id={`member-phone-${idx}`}
                                type="tel"
                                required
                                value={member.phone}
                                onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                placeholder="+91 98765 43210"
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                                  isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
                                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                                }`}
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`member-roll-${idx}`}
                                className={`block font-semibold mb-1.5 ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                College ID / Roll Number *
                              </label>
                              <input
                                id={`member-roll-${idx}`}
                                type="text"
                                required
                                value={member.rollNo}
                                onChange={(e) => handleMemberChange(idx, 'rollNo', e.target.value)}
                                placeholder="e.g. 60004220054"
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                                  isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
                                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                                }`}
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor={`member-spec-${idx}`}
                                className={`block font-semibold mb-1.5 ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                Seacraft Skill / Domain Role
                              </label>
                              <input
                                id={`member-spec-${idx}`}
                                type="text"
                                value={member.specialty}
                                onChange={(e) => handleMemberChange(idx, 'specialty', e.target.value)}
                                placeholder="e.g. Full-Stack / Machine Learning / UI Design / DevOps"
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
                                  isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
                                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                                }`}
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
                      className={`w-full py-4 rounded-xl font-heading font-bold text-sm sm:text-base tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                        isDark
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/25'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      }`}
                    >
                      <Anchor className="w-5 h-5" />
                      Confirm Manifest & Hoist Colors ({regForm.crewSize} {regForm.crewSize === 1 ? 'Sailor' : 'Sailors'})
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Ticket Confirmation with Full Crew Manifest */
              <div className="text-center py-4 space-y-6">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm border-2 ${
                    isDark
                      ? 'bg-amber-950/70 border-amber-400 text-amber-400'
                      : 'bg-blue-50 border-blue-500 text-blue-600'
                  }`}
                >
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
                    Fleet Boarding Pass Issued!
                  </h3>
                  <p className={`text-xs sm:text-sm max-w-lg mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Ship <strong className={isDark ? 'text-amber-400' : 'text-blue-700'}>&ldquo;{regForm.shipName || 'Your Fleet'}&rdquo;</strong> and all {regForm.crewSize} registered crew members are officially logged in the DJSCE Harbor Registry.
                  </p>
                </div>

                {/* Boarding Pass Ticket Card with Roster */}
                <div
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden max-w-2xl mx-auto shadow-sm space-y-4 ${
                    isDark
                      ? 'bg-slate-950/80 border-amber-500/50 text-slate-200'
                      : 'bg-slate-50 border-blue-300 text-slate-700'
                  }`}
                >
                  <div
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-2 ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-[10px] uppercase tracking-widest block font-bold ${
                          isDark ? 'text-amber-400' : 'text-blue-600'
                        }`}
                      >
                        Official Manifest
                      </span>
                      <span className="font-heading font-extrabold text-lg sm:text-xl">
                        {regForm.shipName || 'Royal Flagship'}
                      </span>
                      <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {regForm.college}
                      </span>
                    </div>
                    <div className="sm:text-right flex flex-col sm:items-end">
                      <span
                        className={`text-[10px] uppercase tracking-widest block font-bold ${
                          isDark ? 'text-amber-400' : 'text-blue-600'
                        }`}
                      >
                        Registry Pass ID
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-black text-base sm:text-lg ${
                            isDark ? 'text-amber-400' : 'text-blue-700'
                          }`}
                        >
                          {ticketId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyTicket}
                          className={`p-1 px-2 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                          aria-label="Copy ticket pass ID"
                        >
                          {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs py-1">
                    <div>
                      <span className={`block text-[10px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                        Voyage Track:
                      </span>
                      <span className="font-semibold">{regForm.voyageTrack}</span>
                    </div>
                    <div>
                      <span className={`block text-[10px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                        Harbor Port:
                      </span>
                      <span className="font-semibold">DJSCE Campus, Mumbai • Oct 24-25, 2026</span>
                    </div>
                  </div>

                  {/* Registered Crew Roster Grid */}
                  <div className={`border-t pt-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className={`text-[10px] uppercase tracking-widest font-bold block mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Enrolled Crew Members ({regForm.crewSize})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {regForm.members.slice(0, regForm.crewSize).map((member, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border text-xs shadow-xs ${
                            isDark
                              ? 'bg-slate-900 border-slate-800'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading font-bold">
                              {member.name || `Sailor #${i + 1}`}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${
                                isDark
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                  : 'bg-blue-50 text-blue-700 border-blue-100'
                              }`}
                            >
                              {member.badge}
                            </span>
                          </div>
                          <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {member.email || 'Email logged'}
                          </div>
                          <div className={`text-[10px] mt-1 flex justify-between ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span>ID: {member.rollNo || 'Verified'}</span>
                            <span>{member.phone || ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`text-[11px] border rounded-xl p-3 text-center font-semibold ${
                      isDark
                        ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                        : 'bg-blue-100/70 border-blue-200 text-blue-900'
                    }`}
                  >
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
                    className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md ${
                      isDark
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
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
