import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data';
import { ThemeMode } from '../types';

interface FaqAccordionProps {
  theme: ThemeMode;
}

export const FaqAccordionSection = memo(function FaqAccordionSection({
  theme,
}: FaqAccordionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      {FAQ_ITEMS.map((faq, index) => {
        const isOpen = activeFaq === index;
        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isDark
                ? isOpen
                  ? 'bg-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                : isOpen
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
              <span
                className={`font-heading font-bold text-base sm:text-lg flex items-center gap-3 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-mono font-bold border ${
                    isDark
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-sky-50 border-sky-200 text-blue-700'
                  }`}
                >
                  0{index + 1}
                </span>
                {faq.q}
              </span>
              <div
                className={`p-1.5 rounded-lg transition-transform duration-200 ${
                  isOpen
                    ? isDark
                      ? 'rotate-180 bg-amber-500 text-slate-950 font-bold'
                      : 'rotate-180 bg-blue-600 text-white'
                    : isDark
                    ? 'bg-slate-800 text-amber-400'
                    : 'bg-sky-100 text-blue-700'
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
                  <div
                    className={`px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t font-sans ${
                      isDark
                        ? 'text-slate-300 border-slate-800'
                        : 'text-slate-600 border-slate-100'
                    }`}
                  >
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
