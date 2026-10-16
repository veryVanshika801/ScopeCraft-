import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LaurelCrest, BotanicalDivider } from './Ornaments';
import { UserSession } from '../types/proposal';
import { CinematicStudioVisual } from './CinematicStudioVisual';

interface CinematicWelcomeProps {
  onEnter: (session: UserSession) => void;
  defaultEmail?: string;
}

export const CinematicWelcome: React.FC<CinematicWelcomeProps> = ({
  onEnter,
  defaultEmail = 'vanshikavkg2008@gmail.com',
}) => {
  const [fullName, setFullName] = useState('Vanshika');
  const [email, setEmail] = useState(defaultEmail);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; email?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address.';
    } else if (!emailTrimmed.endsWith('@gmail.com') && !emailTrimmed.includes('gmail')) {
      newErrors.email = 'Please enter a valid Gmail address (e.g. name@gmail.com).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      onEnter({
        fullName: fullName.trim(),
        email: emailTrimmed,
        enteredAt: new Date().toISOString(),
      });
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#22221F] text-[#F5F0E7] flex flex-col justify-between overflow-hidden selection:bg-[#39483B] selection:text-[#F5F0E7] bg-dark-paper-grain">
      {/* Background oversized typographic watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[18vw] font-bold text-white/[0.02] tracking-tighter select-none pointer-events-none"
        aria-hidden="true"
      >
        SCOPECRAFT
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl font-semibold tracking-wide text-[#F5F0E7]">
            ScopeCraft
          </span>
          <span className="text-xs text-[#A6AD99] font-serif italic tracking-wider">
            Studio Series I
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs tracking-widest uppercase text-[#A6AD99] font-mono">
            Edition 2026 · Demo
          </span>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 lg:py-12 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Column: Editorial Headline & Intake Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Subtle laurel award indicator */}
            <div className="flex items-center gap-6 mb-6">
              <LaurelCrest className="w-14 h-14 text-[#A6AD99]" label="CRAFT" year="MMXXVI" />
              <div className="text-xs uppercase tracking-widest text-[#A6AD99] font-mono">
                The Freelancer Proposal Studio
              </div>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F5F0E7] leading-[1.08] mb-6">
              Good work deserves a{' '}
              <span className="italic font-normal text-[#E9E0D2]">better beginning.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#E9E0D2]/80 leading-relaxed max-w-xl mb-10">
              Turn your next client brief into a thoughtful, professional proposal — with clarity,
              confidence, and less busywork. Built for independent designers, developers, and creators.
            </p>

            {/* Warm Ivory Form Card */}
            <div className="bg-[#F5F0E7] text-[#22221F] p-7 sm:p-9 rounded-sm shadow-2xl max-w-lg border border-[#E9E0D2]/40 relative">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#22221F]/10">
                <span className="text-xs uppercase tracking-widest text-[#39483B] font-mono font-medium">
                  Studio Access Gate
                </span>
                <span className="text-xs text-[#22221F]/50 font-serif italic">
                  Instant Demo Session
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs uppercase tracking-wider text-[#22221F]/70 mb-1.5 font-medium"
                  >
                    Your Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vanshika Sharma"
                    className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#22221F]/20 rounded-none text-[#22221F] text-sm placeholder-[#22221F]/35 focus:outline-none focus:border-[#39483B] focus:ring-1 focus:ring-[#39483B] transition-colors"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-amber-800 mt-1 font-medium">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-wider text-[#22221F]/70 mb-1.5 font-medium"
                  >
                    Gmail Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#22221F]/20 rounded-none text-[#22221F] text-sm placeholder-[#22221F]/35 focus:outline-none focus:border-[#39483B] focus:ring-1 focus:ring-[#39483B] transition-colors"
                  />
                  {errors.email && (
                    <p className="text-xs text-amber-800 mt-1 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 bg-[#39483B] hover:bg-[#2e3a2f] active:bg-[#222e23] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39483B]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#F5F0E7] border-t-transparent rounded-full animate-spin" />
                        <span>Opening Studio...</span>
                      </span>
                    ) : (
                      <>
                        <span>Enter ScopeCraft</span>
                        <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                          →
                        </span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#22221F]/60 mt-3 font-sans">
                    Interactive demo · No account required
                  </p>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Cinematic Studio Visual (Human-free Architectural Artboard) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative p-2 bg-[#2a2a26] border border-[#F5F0E7]/10 rounded-sm shadow-2xl">
              <CinematicStudioVisual />
            </div>

            {/* Subtle botanical ornament below visual panel */}
            <BotanicalDivider className="my-6 text-[#A6AD99]" />
          </motion.div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 border-t border-[#F5F0E7]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A6AD99]">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span>ScopeCraft Studio Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Open-Weight Inference Integration</span>
        </div>
        <div className="font-serif italic text-white/50">
          Designed with editorial documentary restraint.
        </div>
      </footer>
    </div>
  );
};
