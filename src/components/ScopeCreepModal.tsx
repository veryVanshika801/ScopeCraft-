import React, { useState } from 'react';
import { ProposalData, ScopeCreepAnalysis } from '../types/proposal';
import { analyzeScopeCreep } from '../utils/scopeCreepDetector';
import { copyToClipboard } from '../utils/export';
import { SAMPLE_PROJECTS } from '../data/sampleBriefs';
import { VoiceInputButton } from './VoiceInputButton';

interface ScopeCreepModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ProposalData;
}

export const ScopeCreepModal: React.FC<ScopeCreepModalProps> = ({ isOpen, onClose, proposal }) => {
  const [clientMessage, setClientMessage] = useState('');
  const [analysis, setAnalysis] = useState<ScopeCreepAnalysis | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Look for matching sample project change requests or user-selected scenario
  const matchedSample = SAMPLE_PROJECTS.find(
    (s) => s.defaultProposal.clientName.toLowerCase() === proposal.clientName.toLowerCase()
  );
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    matchedSample ? matchedSample.id : SAMPLE_PROJECTS[0].id
  );

  const currentSample =
    SAMPLE_PROJECTS.find((s) => s.id === activeScenarioId) ||
    matchedSample ||
    SAMPLE_PROJECTS[0];
  const sampleRequests = currentSample.sampleChangeRequests;

  const handleRunAnalysis = (messageToAnalyze: string) => {
    if (!messageToAnalyze.trim()) return;
    setClientMessage(messageToAnalyze);
    const result = analyzeScopeCreep(proposal, messageToAnalyze);
    setAnalysis(result);
  };

  const handleCopyResponse = async () => {
    if (!analysis) return;
    const ok = await copyToClipboard(analysis.recommendedResponse);
    if (ok) {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#22221F]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 selection:bg-[#39483B] selection:text-[#F5F0E7]">
      <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-6 sm:p-10 max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#22221F]/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#39483B]" />
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#39483B]">
                Scope-Creep Boundary Sentinel
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#22221F]">
              Review what changed before agreeing to additional work.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-[#22221F]/40 hover:text-[#22221F] p-1 leading-none cursor-pointer"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Quick Sample Request Chips & Scenario Selector */}
        <div className="p-4 bg-[#F5F0E7]/60 border border-[#22221F]/15 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#22221F]/80 font-medium">
              Quick-Test Client Change Requests:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#22221F]/60">Scenario:</span>
              <select
                value={activeScenarioId}
                onChange={(e) => setActiveScenarioId(e.target.value)}
                className="text-xs px-2 py-1 bg-[#FFFFFF] border border-[#22221F]/20 text-[#22221F] font-sans focus:outline-none focus:border-[#39483B] cursor-pointer"
              >
                {SAMPLE_PROJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label.split('—')[0]?.trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {sampleRequests.map((req, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunAnalysis(req.message)}
                className="text-xs text-left px-3 py-2 bg-[#FFFFFF] hover:bg-[#E9E0D2] border border-[#22221F]/15 text-[#22221F] transition-colors cursor-pointer shadow-2xs"
              >
                <span className="font-serif italic text-[#39483B] mr-1.5">0{idx + 1}.</span>
                <span className="font-medium">{req.title}</span>
                <span
                  className={`ml-2 text-[9px] font-mono uppercase px-1 py-0.2 ${
                    req.expectedVerdict === 'out_of_scope'
                      ? 'text-rose-800 bg-rose-50'
                      : req.expectedVerdict === 'within_scope'
                      ? 'text-emerald-800 bg-emerald-50'
                      : 'text-amber-800 bg-amber-50'
                  }`}
                >
                  {req.expectedVerdict.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="client-msg" className="block text-xs uppercase font-mono tracking-wider text-[#22221F]/80">
              Paste Client Email / Message / Slack Request:
            </label>
            <VoiceInputButton
              fieldLabel="Client Change Request"
              currentValue={clientMessage}
              onAcceptTranscript={(text, mode) => {
                setClientMessage((prev) => (mode === 'append' && prev.trim() ? `${prev} ${text}` : text));
              }}
            />
          </div>
          <textarea
            id="client-msg"
            rows={3}
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            placeholder="e.g. Can you also integrate an automated recurring subscription system and translate all product descriptions into French?"
            className="w-full p-4 bg-[#F5F0E7]/30 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B] leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              onClick={() => handleRunAnalysis(clientMessage)}
              disabled={!clientMessage.trim()}
              className="px-5 py-2.5 bg-[#39483B] hover:bg-[#2e3a2f] disabled:opacity-40 text-[#F5F0E7] text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              Compare with Agreed Scope →
            </button>
          </div>
        </div>

        {/* Analysis Output */}
        {analysis && (
          <div className="p-6 bg-[#F5F0E7]/40 border border-[#22221F]/15 space-y-5 animate-in fade-in duration-300">
            {/* Verdict Badge Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#22221F]/10 gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase text-[#22221F]/60">Scope Verdict:</span>
                <span
                  className={`px-3 py-1 text-xs font-mono uppercase font-bold tracking-wider border ${
                    analysis.verdict === 'out_of_scope'
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : analysis.verdict === 'boundary'
                      ? 'bg-stone-200 text-stone-900 border-stone-300'
                      : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                  }`}
                >
                  {analysis.verdict === 'out_of_scope'
                    ? 'Out of Scope (Scope Expansion)'
                    : analysis.verdict === 'boundary'
                    ? 'Boundary / Grey Area'
                    : 'Within Contracted Scope'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#39483B]">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(
                        `Scope Sentinel Analysis. Verdict: ${analysis.verdict.replace('_', ' ')}. ${analysis.summary} Timeline Impact: ${analysis.impactAssessment.timelineImpact}. Commercial Alignment: ${analysis.impactAssessment.budgetImpact}.`
                      );
                      utterance.rate = 1.0;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="hover:text-[#22221F] underline underline-offset-2 cursor-pointer flex items-center gap-1"
                >
                  <span>🔊 Listen</span>
                </button>
                <span>Budget Impact: {analysis.impactAssessment.budgetImpact}</span>
              </div>
            </div>

            <p className="text-sm font-serif italic text-[#22221F] leading-snug">
              {analysis.summary}
            </p>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3 bg-white border border-[#22221F]/10 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9B846C] font-semibold">
                  Timeline Delta
                </span>
                <div className="font-medium text-[#22221F]">
                  {analysis.impactAssessment.timelineImpact}
                </div>
              </div>
              <div className="p-3 bg-white border border-[#22221F]/10 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#39483B] font-semibold">
                  Commercial Alignment
                </span>
                <div className="font-medium text-[#22221F]">
                  {analysis.impactAssessment.budgetImpact}
                </div>
              </div>
            </div>

            {/* Rationale & Contract Citations */}
            {analysis.reasoning.length > 0 && (
              <div className="space-y-1.5 text-xs text-[#22221F]/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#22221F]/60 font-semibold block">
                  Contract & Scope Citations:
                </span>
                {analysis.reasoning.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-mono text-[#39483B]">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Drafted Response with Copy Action */}
            <div className="pt-3 border-t border-[#22221F]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#39483B] font-semibold">
                  Drafted Freelancer Response:
                </span>
                <button
                  onClick={handleCopyResponse}
                  className="text-xs font-mono text-[#39483B] hover:text-[#22221F] underline underline-offset-2 cursor-pointer"
                >
                  {copyFeedback ? 'Copied to Clipboard! ✓' : 'Copy Email Response'}
                </button>
              </div>

              <div className="p-4 bg-white border border-[#22221F]/15 font-sans text-xs text-[#22221F] whitespace-pre-wrap leading-relaxed select-all">
                {analysis.recommendedResponse}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#22221F] hover:bg-[#39483B] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
