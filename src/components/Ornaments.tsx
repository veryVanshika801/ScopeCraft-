import React from 'react';

// Delicate laurel wreath inspired by editorial documentary award crests
export const LaurelCrest: React.FC<{ className?: string; label?: string; year?: string }> = ({
  className = 'w-16 h-16',
  label = 'SCOPECRAFT',
  year = '2026',
}) => (
  <div className="flex flex-col items-center text-center">
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-current opacity-80"
        aria-hidden="true"
      >
        {/* Left Laurel Branch */}
        <path
          d="M 50 88 C 30 84 18 68 18 48 C 18 34 26 22 36 14"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M 23 72 C 16 68 14 62 17 56 C 21 62 26 66 23 72 Z" fill="currentColor" opacity="0.6" />
        <path d="M 18 55 C 11 50 10 44 14 38 C 18 44 22 49 18 55 Z" fill="currentColor" opacity="0.6" />
        <path d="M 21 38 C 16 31 17 25 23 20 C 25 27 27 32 21 38 Z" fill="currentColor" opacity="0.6" />
        <path d="M 31 22 C 27 15 31 10 38 7 C 38 15 37 19 31 22 Z" fill="currentColor" opacity="0.6" />

        {/* Right Laurel Branch */}
        <path
          d="M 50 88 C 70 84 82 68 82 48 C 82 34 74 22 64 14"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M 77 72 C 84 68 86 62 83 56 C 79 62 74 66 77 72 Z" fill="currentColor" opacity="0.6" />
        <path d="M 82 55 C 89 50 90 44 86 38 C 82 44 78 49 82 55 Z" fill="currentColor" opacity="0.6" />
        <path d="M 79 38 C 84 31 83 25 77 20 C 75 27 73 32 79 38 Z" fill="currentColor" opacity="0.6" />
        <path d="M 69 22 C 73 15 69 10 62 7 C 62 15 63 19 69 22 Z" fill="currentColor" opacity="0.6" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-serif text-[9px] tracking-widest text-current uppercase select-none">
        <span className="font-medium">{label}</span>
        <span className="text-[7px] tracking-normal font-sans opacity-70 mt-0.5">{year}</span>
      </div>
    </div>
  </div>
);

// Botanical leaf center divider
export const BotanicalDivider: React.FC<{ className?: string }> = ({ className = 'my-8' }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <div className="h-[1px] w-16 bg-[#22221F]/15 dark:bg-[#F5F0E7]/15" />
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#39483B] opacity-75" aria-hidden="true">
      <path
        d="M 12 2 C 12 2 7 7 7 12 C 7 16 10 19 12 21 C 14 19 17 16 17 12 C 17 7 12 2 12 2 Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M 12 6 L 12 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M 12 9 C 10 8 9 9 9 9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 12 12 C 14 11 15 12 15 12" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 12 15 C 10 14 9 15 9 15" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
    <div className="h-[1px] w-16 bg-[#22221F]/15 dark:bg-[#F5F0E7]/15" />
  </div>
);

// Organic zen ripple ring ornament
export const RippleRingWatermark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />
    <circle cx="100" cy="100" r="68" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <circle cx="100" cy="100" r="46" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.35" />
    <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
  </svg>
);
