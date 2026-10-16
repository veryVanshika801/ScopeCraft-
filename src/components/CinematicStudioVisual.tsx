import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import emptyStudioImg from '../assets/images/studio_craft_still_life_1791899517456.jpg';

export const CinematicStudioVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Mouse parallax handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Drifting ambient particles configuration
  const particles = [
    { id: 1, x: '18%', y: '24%', size: 3, delay: 0, duration: 8 },
    { id: 2, x: '78%', y: '18%', size: 4, delay: 1.5, duration: 9 },
    { id: 3, x: '86%', y: '64%', size: 3, delay: 3, duration: 7.5 },
    { id: 4, x: '24%', y: '78%', size: 2.5, delay: 2, duration: 8.5 },
    { id: 5, x: '52%', y: '36%', size: 3.5, delay: 0.8, duration: 10 },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-[#22221F] select-none rounded-none"
    >
      {/* Layer 1: Atmospheric Background (Empty Architectural Studio Still Life) */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * -10,
                y: mousePos.y * -10,
                scale: isHovered ? 1.03 : 1.01,
              }
        }
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        <img
          src={emptyStudioImg}
          alt="Architectural studio drafting desk with blueprints, brass lamp, and instruments"
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover grayscale-[25%] contrast-[1.08] transition-opacity duration-700 ${
            imgLoaded ? 'opacity-70' : 'opacity-0'
          }`}
        />
        {/* Soft atmospheric scrim overlay in brand charcoal & forest */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#22221F] via-[#22221F]/75 to-[#22221F]/45" />
      </motion.div>

      {/* Layer 2: Subtle Slow Orbital Lines & Constellation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.svg
          viewBox="0 0 600 700"
          className="w-full h-full text-[#A6AD99] opacity-35"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 48%' }}
          aria-hidden="true"
        >
          {/* Orbital Ellipses */}
          <ellipse
            cx="300"
            cy="330"
            rx="210"
            ry="190"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="4 6"
          />
          <ellipse
            cx="300"
            cy="330"
            rx="140"
            ry="125"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <circle
            cx="300"
            cy="330"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            opacity="0.4"
          />
        </motion.svg>

        {/* Milestone Connecting Vector Paths */}
        <svg
          viewBox="0 0 600 700"
          className="absolute inset-0 w-full h-full text-[#9B846C]"
          aria-hidden="true"
        >
          {/* Pathway connecting Milestone 01 -> 02 -> 03 */}
          <motion.path
            d="M 120 180 Q 280 230 320 340 T 480 490"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="6 6"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    strokeDashoffset: [0, -48],
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear',
            }}
            opacity="0.55"
          />

          {/* Golden Milestone Nodes */}
          <circle cx="120" cy="180" r="4.5" fill="#E9E0D2" />
          <circle cx="120" cy="180" r="9" fill="none" stroke="#9B846C" strokeWidth="1" opacity="0.6" />

          <circle cx="320" cy="340" r="5" fill="#E9E0D2" />
          <circle cx="320" cy="340" r="11" fill="none" stroke="#A6AD99" strokeWidth="1" opacity="0.6" />

          <circle cx="480" cy="490" r="4.5" fill="#E9E0D2" />
          <circle cx="480" cy="490" r="9" fill="none" stroke="#9B846C" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* Layer 3: Drifting Ambient Golden/Sage Particles */}
      {!shouldReduceMotion &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#E9E0D2]/70 pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              boxShadow: '0 0 8px rgba(233, 224, 210, 0.4)',
            }}
            animate={{
              y: [0, -16, 0],
              x: [0, 8, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Layer 4: Floating Deliverable Documents & Proposal Cards (The Studio Artifacts) */}

      {/* Card A: Top-Left "Scope Defined" Mini Sheet */}
      <motion.div
        className="absolute top-8 left-6 sm:top-10 sm:left-8 z-10 pointer-events-none"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * 16,
                y: mousePos.y * 16 + (Math.sin(Date.now() / 2000) * 3 || 0),
              }
        }
        transition={{ type: 'spring', damping: 20, stiffness: 90 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-[#F5F0E7]/95 backdrop-blur-md text-[#22221F] p-3.5 sm:p-4 rounded-none border border-[#22221F]/15 shadow-xl max-w-[210px] sm:max-w-[240px]"
        >
          <div className="flex items-center justify-between gap-3 pb-1.5 mb-2 border-b border-[#22221F]/10">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#39483B] font-semibold">
              SCOPE DEFINED · 01
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#39483B]" />
          </div>
          <div className="font-serif text-xs sm:text-sm font-medium text-[#22221F] leading-snug mb-2">
            Strategic Discovery & Architecture
          </div>
          <div className="space-y-1 font-mono text-[9px] text-[#22221F]/70">
            <div className="flex items-center gap-1.5">
              <span className="text-[#39483B] font-bold">✓</span>
              <span>Requirements Synthesized</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#39483B] font-bold">✓</span>
              <span>Out-of-Scope Bounds Set</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Card B: Center Master Proposal Monograph Sheet */}
      <motion.div
        className="absolute top-[28%] sm:top-[26%] left-[10%] sm:left-[14%] right-[10%] sm:right-[14%] z-20 pointer-events-none"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * 8,
                y: mousePos.y * 8,
                rotate: -1.2 + mousePos.x * 1.5,
              }
        }
        transition={{ type: 'spring', damping: 22, stiffness: 100 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 8.5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative bg-[#F5F0E7] text-[#22221F] p-5 sm:p-6 rounded-none border border-[#E9E0D2] shadow-2xl overflow-hidden"
        >
          {/* Subtle light sweep animation */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none -skew-x-12"
              initial={{ x: '-150%' }}
              animate={{ x: '250%' }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 6,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Document Masthead */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#22221F]/15">
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-[#39483B]">
              SCOPECRAFT STUDIO MONOGRAPH
            </span>
            <span className="font-mono text-[8px] text-[#9B846C] font-medium">
              READY FOR REVIEW
            </span>
          </div>

          <div className="font-serif text-base sm:text-lg font-medium text-[#22221F] leading-tight mb-1">
            Client Project Proposal
          </div>
          <div className="text-[11px] font-sans text-[#22221F]/60 mb-3">
            Bespoke Architecture & Implementation Roadmaps
          </div>

          {/* Scope Tags & Deliverables Summary */}
          <div className="p-2.5 bg-[#E9E0D2]/50 border border-[#22221F]/10 space-y-1.5 mb-3 font-sans">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#22221F]/70">Phased Execution:</span>
              <span className="font-mono font-medium text-[#39483B]">3 Milestones</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#22221F]/70">Exclusions:</span>
              <span className="font-mono font-medium text-[#9B846C]">Explicitly Protected</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#22221F]/70">Estimated Cadence:</span>
              <span className="font-mono font-medium text-[#22221F]">6 Weeks</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-[#22221F]/60">
            <span>EXPORT: MD · TXT · PDF</span>
            <span className="text-[#39483B] font-semibold">100% STRUCTURED</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Card C: Bottom-Right "Milestone 02 Review Gate" Floating Badge */}
      <motion.div
        className="absolute bottom-20 right-5 sm:bottom-24 sm:right-7 z-25 pointer-events-none"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * 22,
                y: mousePos.y * 22,
              }
        }
        transition={{ type: 'spring', damping: 18, stiffness: 85 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -7, 0] }}
          transition={{ duration: 6.5, delay: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-[#39483B] text-[#F5F0E7] p-3.5 sm:p-4 rounded-none border border-[#A6AD99]/30 shadow-2xl max-w-[200px] sm:max-w-[230px]"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#A6AD99]">
              MILESTONE 02
            </span>
            <span className="text-[8px] font-mono bg-[#F5F0E7]/10 px-1.5 py-0.5 text-[#E9E0D2]">
              GATE
            </span>
          </div>
          <div className="font-serif text-xs font-medium text-[#F5F0E7] leading-snug mb-1">
            Core Production & Review
          </div>
          <div className="text-[10px] text-[#E9E0D2]/75 font-sans">
            Client feedback checkpoint scheduled prior to deployment.
          </div>
        </motion.div>
      </motion.div>

      {/* Layer 5: Overlaid Editorial Bottom Pullout Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-30 p-4 bg-[#F5F0E7]/95 text-[#22221F] backdrop-blur-md border border-[#22221F]/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#39483B] font-mono font-medium">
            01. The Architecture of Proposals
          </span>
          <span className="text-[9px] font-mono text-[#9B846C] hidden sm:inline">
            STUDIO EDITION
          </span>
        </div>
        <p className="font-serif text-xs sm:text-sm italic text-[#22221F] leading-snug">
          "When requirements are shaped into clear milestones and boundaries, both client
          and creator find common ground."
        </p>
      </div>
    </div>
  );
};
