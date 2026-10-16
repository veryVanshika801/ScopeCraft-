import React from 'react';
import { BriefGap, ProjectBrief } from '../types/proposal';
import { analyzeBriefGaps } from '../utils/gapDetector';

interface SmartGapDetectorProps {
  brief: ProjectBrief;
  onApplyFix: (field: keyof ProjectBrief, textToAppendOrSet: string) => void;
}

export const SmartGapDetector: React.FC<SmartGapDetectorProps> = ({ brief, onApplyFix }) => {
  const gaps = analyzeBriefGaps(brief);

  if (brief.requirements.trim().length < 15) {
    return null;
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#22221F]/10 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#39483B]" />
          <h4 className="font-serif text-lg font-medium text-[#22221F]">
            Smart Brief Gap Detector
          </h4>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-[#E9E0D2] text-[#39483B] font-medium">
            Risk Analysis
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#22221F]/60">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const text = gaps.length === 0
                  ? 'Scope parameters are well-defined. All primary parameters are addressed.'
                  : `Smart Brief Gap Detector found ${gaps.length} potential scope ambiguity items. ` +
                    gaps.map((g, idx) => `Item ${idx + 1}: ${g.title}. ${g.description}. Recommendation: ${g.recommendation}.`).join(' ');
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.0;
                window.speechSynthesis.speak(utterance);
              }
            }}
            className="text-[11px] text-[#39483B] hover:text-[#22221F] underline underline-offset-2 cursor-pointer flex items-center gap-1"
            title="Read gap analysis aloud"
          >
            <span>🔊 Listen</span>
          </button>
          {gaps.length === 0 ? (
            <span className="text-emerald-800 font-medium">✓ Scope parameters well-defined</span>
          ) : (
            <span>{gaps.length} potential scope ambiguity {gaps.length === 1 ? 'item' : 'items'}</span>
          )}
        </div>
      </div>

      {gaps.length === 0 ? (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs flex items-center justify-between">
          <p className="font-sans leading-relaxed">
            All primary parameters (platform constraints, asset dependencies, milestone budget, and delivery cadence) are addressed. Your proposal is primed for high client clarity.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-[#22221F]/70 font-sans mb-3">
            A few details need clarification before this proposal is ready. Addressing these gaps now prevents uncompensated scope expansion later:
          </p>

          <div className="space-y-3">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className="p-3.5 bg-[#F5F0E7]/40 border border-[#22221F]/10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[9px] uppercase px-1.5 py-0.5 font-semibold ${
                        gap.severity === 'critical'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : gap.severity === 'moderate'
                          ? 'bg-[#E9E0D2] text-[#39483B]'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {gap.severity}
                    </span>
                    <span className="font-serif font-medium text-sm text-[#22221F]">{gap.title}</span>
                  </div>
                  <p className="text-[#22221F]/75 font-sans leading-relaxed">{gap.description}</p>
                  <p className="text-[#39483B] font-mono text-[11px] pt-1">
                    Recommendation: {gap.recommendation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onApplyFix(gap.suggestedField, gap.suggestedText)}
                  className="self-start sm:self-center shrink-0 px-3 py-1.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-[11px] font-mono tracking-wider transition-colors cursor-pointer"
                  title="Click to automatically append this clarifying clause into the brief"
                >
                  + Apply Clause
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
