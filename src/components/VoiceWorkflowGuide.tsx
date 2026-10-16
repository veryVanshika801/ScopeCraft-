import React, { useState } from 'react';

interface VoiceWorkflowGuideProps {
  onStartVoiceIntake: () => void;
  onScrollToForm: () => void;
  className?: string;
}

export const VoiceWorkflowGuide: React.FC<VoiceWorkflowGuideProps> = ({
  onStartVoiceIntake,
  onScrollToForm,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Dictate Requirements',
      desc: 'Tap the microphone on any field. Speak naturally in English or Hinglish.',
    },
    {
      num: '02',
      title: 'Review Transcript',
      desc: 'Verify and edit the transcript in the review drawer before confirming insertion.',
    },
    {
      num: '03',
      title: 'Smart Gap Analysis',
      desc: 'The Sentinel scans for missing budgets, vague milestones, or hidden delivery risks.',
    },
    {
      num: '04',
      title: 'AI Synthesis',
      desc: 'Generate your architectural proposal using the configured open-weight model.',
    },
    {
      num: '05',
      title: 'Listen Aloud',
      desc: 'Use the built-in Text-to-Speech player to audit your proposal or sections effortlessly.',
    },
    {
      num: '06',
      title: 'Compare & Translate',
      desc: 'Test incoming changes in the Time Machine and localize into Hindi or Hinglish.',
    },
  ];

  return (
    <div className={`p-5 bg-[#FFFFFF] border border-[#22221F]/15 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#22221F]/10 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse" />
          <span className="text-xs uppercase font-mono tracking-widest text-[#39483B] font-semibold">
            Talk-to-Scope & Listen Aloud Workflow
          </span>
          <span className="text-[10px] uppercase font-mono bg-[#E9E0D2] px-2 py-0.5 text-[#39483B]">
            Speech Studio
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-mono text-[#39483B] hover:text-[#22221F] underline underline-offset-2 cursor-pointer"
          >
            {isOpen ? 'Hide Workflow Steps' : 'How the Voice Studio Works ↓'}
          </button>
          <button
            type="button"
            onClick={onStartVoiceIntake}
            className="px-3 py-1.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>🎙 Start Voice Brief</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className="p-3 bg-[#F5F0E7]/50 border border-[#22221F]/10 space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif italic font-bold text-xs text-[#39483B]">
                    {s.num}.
                  </span>
                  <h4 className="font-serif font-medium text-xs text-[#22221F] leading-snug">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#22221F]/70 font-sans leading-relaxed pt-1">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#E9E0D2]/40 border border-[#22221F]/10 text-xs text-[#22221F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]">
            <span>Privacy Notice: Audio recording is never executed in background. Microphones activate strictly upon user click.</span>
            <button
              type="button"
              onClick={onScrollToForm}
              className="text-[#39483B] hover:text-[#22221F] underline underline-offset-2 shrink-0 cursor-pointer"
            >
              Scroll to Brief Form →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
