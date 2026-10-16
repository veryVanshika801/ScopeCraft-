import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LaurelCrest, BotanicalDivider, RippleRingWatermark } from './Ornaments';

const STATUS_STEPS = [
  'Understanding the brief and client requirements...',
  'Organizing project scope and boundary constraints...',
  'Structuring deliverables into phased milestones...',
  'Preparing your first editorial proposal draft...',
];

interface GenerationScreenProps {
  projectTitle: string;
  clientName: string;
  isCompleted: boolean;
}

export const GenerationScreen: React.FC<GenerationScreenProps> = ({
  projectTitle,
  clientName,
  isCompleted,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STATUS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#22221F] text-[#F5F0E7] flex flex-col items-center justify-center p-6 bg-dark-paper-grain selection:bg-[#39483B] selection:text-[#F5F0E7]">
      {/* Background Watermark Zen Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <RippleRingWatermark className="w-[500px] h-[500px] text-[#A6AD99]" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
        {/* Laurel crest */}
        <LaurelCrest className="w-16 h-16 text-[#A6AD99] mb-8" label="STUDIO" year="2026" />

        {/* Project Target */}
        <span className="text-xs uppercase tracking-widest font-mono text-[#A6AD99] block mb-2">
          Shaping Proposal For
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#F5F0E7] tracking-tight mb-1">
          {clientName || 'Client Project'}
        </h2>
        <p className="text-xs font-mono text-[#E9E0D2]/60 mb-8 truncate max-w-md">
          {projectTitle}
        </p>

        {/* Thin Animated Hairline Progress Bar */}
        <div className="w-64 h-[1.5px] bg-[#F5F0E7]/20 relative overflow-hidden mb-6">
          <motion.div
            className="absolute top-0 bottom-0 bg-[#A6AD99]"
            initial={{ left: '-30%', width: '30%' }}
            animate={{ left: '100%', width: '35%' }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Paced Status Message Transition */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="font-serif italic text-base text-[#E9E0D2] tracking-wide"
            >
              {isCompleted ? 'Draft ready. Opening editor...' : STATUS_STEPS[currentStepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <BotanicalDivider className="my-8 text-[#A6AD99]" />

        <div className="text-[11px] text-[#A6AD99]/70 font-mono tracking-wider">
          OPEN-WEIGHT INFERENCE SYNTHESIS IN PROGRESS
        </div>
      </div>
    </div>
  );
};
