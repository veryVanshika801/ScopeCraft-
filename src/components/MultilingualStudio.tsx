import React, { useState } from 'react';
import { ProposalData, ProposalTranslation, SupportedLanguage } from '../types/proposal';
import { translateProposal } from '../utils/translation';
import { copyToClipboard, downloadTextFile } from '../utils/export';
import { ScopeTextToSpeech } from '../utils/speechSynthesis';

interface MultilingualStudioProps {
  proposal: ProposalData;
  onUpdateProposal: (updated: ProposalData) => void;
  ttsEngine?: ScopeTextToSpeech;
  className?: string;
}

export const MultilingualStudio: React.FC<MultilingualStudioProps> = ({
  proposal,
  onUpdateProposal,
  ttsEngine,
  className = '',
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(
    proposal.activeLanguage || 'hi'
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [viewMode, setViewMode] = useState<'side_by_side' | 'translated_only'>('side_by_side');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Active translation object
  const activeTranslation: ProposalTranslation | undefined =
    proposal.translations?.[selectedLang];

  const handleSelectLanguage = async (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    if (lang === 'en') {
      onUpdateProposal({
        ...proposal,
        activeLanguage: 'en',
      });
      return;
    }

    // Check if translation exists, if not, generate it
    if (!proposal.translations?.[lang]) {
      setIsTranslating(true);
      try {
        const trans = await translateProposal(proposal, lang);
        const updatedTranslations = {
          ...(proposal.translations || {}),
          [lang]: trans,
        };
        onUpdateProposal({
          ...proposal,
          translations: updatedTranslations,
          activeLanguage: lang,
        });
      } catch (e) {
        console.error('Translation error:', e);
      } finally {
        setIsTranslating(false);
      }
    } else {
      onUpdateProposal({
        ...proposal,
        activeLanguage: lang,
      });
    }
  };

  const handleUpdateTranslationField = <K extends keyof ProposalTranslation>(
    field: K,
    value: ProposalTranslation[K]
  ) => {
    if (!activeTranslation) return;
    const updatedTrans: ProposalTranslation = {
      ...activeTranslation,
      [field]: value,
      isHumanReviewed: true,
    };
    onUpdateProposal({
      ...proposal,
      translations: {
        ...(proposal.translations || {}),
        [selectedLang]: updatedTrans,
      },
    });
  };

  const handleListenTranslation = () => {
    if (!ttsEngine || !activeTranslation) return;
    ttsEngine.setVoiceForLanguage(selectedLang);
    ttsEngine.speakSections([
      { title: activeTranslation.title, content: activeTranslation.title },
      { title: 'Executive Summary', content: activeTranslation.executiveSummary },
      { title: 'Proposed Solution', content: activeTranslation.proposedSolution },
    ]);
  };

  const handleCopyMarkdown = async () => {
    if (!activeTranslation) return;
    const md =
      `# ${activeTranslation.title}\n\n` +
      `**Client:** ${proposal.clientName} | **Language:** ${selectedLang.toUpperCase()}\n\n` +
      `## Executive Summary\n${activeTranslation.executiveSummary}\n\n` +
      `## Client Problem & Understanding\n${activeTranslation.clientNeedsUnderstanding}\n\n` +
      `## Proposed Solution\n${activeTranslation.proposedSolution}\n\n` +
      `## Deliverables\n` +
      activeTranslation.deliverables
        .map((d) => `### ${d.category}\n` + d.items.join('\n'))
        .join('\n\n') +
      `\n\n## Milestones & Schedule\n` +
      activeTranslation.milestones
        .map((m) => `• **${m.title}** (${m.durationOrDate}): ${m.description}`)
        .join('\n') +
      `\n\n## Scope Exclusions\n` +
      activeTranslation.scopeExclusions.join('\n') +
      `\n\n## Next Steps\n` +
      activeTranslation.nextSteps.join('\n');

    const ok = await copyToClipboard(md);
    if (ok) {
      setCopyFeedback('Copied translated proposal to clipboard as Markdown');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  const handleExportFile = () => {
    if (!activeTranslation) return;
    const text =
      `${activeTranslation.title}\n` +
      `Client: ${proposal.clientName} | Language: ${selectedLang.toUpperCase()}\n` +
      `----------------------------------------\n\n` +
      `EXECUTIVE SUMMARY\n${activeTranslation.executiveSummary}\n\n` +
      `CLIENT UNDERSTANDING\n${activeTranslation.clientNeedsUnderstanding}\n\n` +
      `PROPOSED SOLUTION\n${activeTranslation.proposedSolution}\n\n` +
      `DELIVERABLES\n` +
      activeTranslation.deliverables.map((d) => `${d.category}:\n${d.items.join('\n')}`).join('\n\n') +
      `\n\nMILESTONES\n` +
      activeTranslation.milestones.map((m) => `${m.title} (${m.durationOrDate}): ${m.description}`).join('\n') +
      `\n\nNEXT STEPS\n${activeTranslation.nextSteps.join('\n')}`;

    const filename = `${proposal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${selectedLang}.txt`;
    downloadTextFile(filename, text, 'text/plain');
    setCopyFeedback(`Exported ${selectedLang.toUpperCase()} version`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Top Banner & Language Controls */}
      <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#39483B] mb-1">
            <span>Multilingual Proposal Studio</span>
            <span aria-hidden="true">·</span>
            <span>Language Localization Matrix</span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#22221F]">
            Present proposals in English, हिन्दी (Hindi), or Hinglish.
          </h2>
          <p className="text-xs sm:text-sm text-[#22221F]/70 font-sans mt-1 max-w-2xl">
            Translate complete proposals or individual sections while strictly preserving prices, currencies, milestones, and technical terminology.
          </p>
        </div>

        {/* Language Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
          {[
            { id: 'en' as SupportedLanguage, label: 'English (Original)' },
            { id: 'hi' as SupportedLanguage, label: 'हिन्दी (Hindi)' },
            { id: 'hinglish' as SupportedLanguage, label: 'Hinglish (Conversational)' },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => handleSelectLanguage(lang.id)}
              className={`px-3 py-2 text-xs font-mono transition-colors cursor-pointer border ${
                selectedLang === lang.id
                  ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B] font-semibold'
                  : 'bg-[#F5F0E7] text-[#22221F] border-[#22221F]/20 hover:border-[#22221F]/50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Feedback */}
      {copyFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-mono">
          ✓ {copyFeedback}
        </div>
      )}

      {/* Translation Toolbar */}
      {selectedLang !== 'en' && (
        <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[#22221F]/60 uppercase text-[11px]">Display View:</span>
            <button
              type="button"
              onClick={() => setViewMode('side_by_side')}
              className={`px-2.5 py-1 font-mono transition-colors cursor-pointer border ${
                viewMode === 'side_by_side'
                  ? 'bg-[#22221F] text-[#F5F0E7] border-[#22221F]'
                  : 'bg-[#F5F0E7] text-[#22221F] border-[#22221F]/15'
              }`}
            >
              Side-by-Side (Compare)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('translated_only')}
              className={`px-2.5 py-1 font-mono transition-colors cursor-pointer border ${
                viewMode === 'translated_only'
                  ? 'bg-[#22221F] text-[#F5F0E7] border-[#22221F]'
                  : 'bg-[#F5F0E7] text-[#22221F] border-[#22221F]/15'
              }`}
            >
              Translated Only
            </button>
          </div>

          <div className="flex items-center gap-3">
            {ttsEngine && (
              <button
                type="button"
                onClick={handleListenTranslation}
                className="text-xs font-mono text-[#39483B] hover:text-[#22221F] underline underline-offset-2 cursor-pointer flex items-center gap-1"
              >
                <span>🔊 Listen to {selectedLang.toUpperCase()}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="text-xs font-mono text-[#22221F]/70 hover:text-[#22221F] underline underline-offset-2 cursor-pointer"
            >
              Copy Markdown
            </button>
            <button
              type="button"
              onClick={handleExportFile}
              className="text-xs font-mono px-3 py-1 bg-[#39483B] text-[#F5F0E7] hover:bg-[#2e3a2f] cursor-pointer"
            >
              Export {selectedLang.toUpperCase()} Text
            </button>
          </div>
        </div>
      )}

      {/* Loading state during synthesis */}
      {isTranslating && (
        <div className="p-12 text-center bg-[#FFFFFF] border border-[#22221F]/15 space-y-3">
          <div className="w-6 h-6 border-2 border-[#39483B] border-t-transparent rounded-full animate-spin mx-auto" />
          <h4 className="font-serif text-lg font-medium text-[#22221F]">
            Translating into {selectedLang === 'hi' ? 'हिन्दी (Hindi)' : 'Hinglish'}…
          </h4>
          <p className="text-xs font-mono text-[#22221F]/60">
            Applying consistency rules: preserving prices, milestones, currencies and technical terms.
          </p>
        </div>
      )}

      {/* Human Review Notes Box */}
      {activeTranslation?.phrasesForReview && activeTranslation.phrasesForReview.length > 0 && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
          <div className="flex items-center gap-2 font-mono uppercase text-[10px] text-amber-900 font-semibold">
            <span>✦ Precision Guardrails Active</span>
            <span aria-hidden="true">·</span>
            <span>Review Flags</span>
          </div>
          <ul className="space-y-1 font-sans text-[11px] leading-relaxed">
            {activeTranslation.phrasesForReview.map((phrase, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span>•</span>
                <span>{phrase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Side-by-Side or Full Canvas */}
      {!isTranslating && activeTranslation && selectedLang !== 'en' && (
        <div className={`grid ${viewMode === 'side_by_side' ? 'grid-cols-1 lg:grid-cols-2 gap-6' : 'grid-cols-1'} items-start`}>
          {/* Left Column: English Baseline (in side-by-side mode) */}
          {viewMode === 'side_by_side' && (
            <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 sm:p-8 space-y-6 text-xs text-[#22221F]">
              <div className="flex items-center justify-between pb-3 border-b border-[#22221F]/10 font-mono text-[11px] text-[#22221F]/60 uppercase">
                <span>English Baseline (Read-Only)</span>
                <span>ORIGINAL</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block mb-1">Title</span>
                <h3 className="font-serif text-xl font-medium text-[#22221F]">{proposal.title}</h3>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block mb-1">Executive Summary</span>
                <p className="p-3 bg-[#F5F0E7]/40 leading-relaxed font-sans">{proposal.executiveSummary}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block mb-1">Client Understanding</span>
                <p className="p-3 bg-[#F5F0E7]/40 leading-relaxed font-sans">{proposal.clientNeedsUnderstanding}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block mb-1">Proposed Solution</span>
                <p className="p-3 bg-[#F5F0E7]/40 leading-relaxed font-sans">{proposal.proposedSolution}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block mb-1">Milestones</span>
                <div className="space-y-2 p-3 bg-[#F5F0E7]/40">
                  {proposal.milestones.map((m, idx) => (
                    <div key={idx}>
                      <strong>{m.title}</strong>: {m.description}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Editable Translated Version */}
          <div className="bg-[#FFFFFF] border-2 border-[#39483B]/30 p-6 sm:p-8 space-y-6 text-xs text-[#22221F]">
            <div className="flex items-center justify-between pb-3 border-b border-[#22221F]/10 font-mono text-[11px] text-[#39483B] uppercase">
              <span>{selectedLang === 'hi' ? 'हिन्दी (Hindi) Version' : 'Hinglish Version'} (Editable)</span>
              <span>LIVE TRANSLATION</span>
            </div>

            {/* Editable Title */}
            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Translated Title
              </label>
              <input
                type="text"
                value={activeTranslation.title}
                onChange={(e) => handleUpdateTranslationField('title', e.target.value)}
                className="w-full font-serif text-xl font-medium text-[#22221F] p-2 bg-[#F5F0E7]/30 border border-[#22221F]/20 focus:outline-none focus:border-[#39483B]"
              />
            </div>

            {/* Editable Executive Summary */}
            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Executive Summary
              </label>
              <textarea
                rows={4}
                value={activeTranslation.executiveSummary}
                onChange={(e) => handleUpdateTranslationField('executiveSummary', e.target.value)}
                className="w-full p-3 bg-[#F5F0E7]/30 border border-[#22221F]/20 leading-relaxed font-sans focus:outline-none focus:border-[#39483B]"
              />
            </div>

            {/* Editable Client Problem */}
            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Client Needs & Understanding
              </label>
              <textarea
                rows={4}
                value={activeTranslation.clientNeedsUnderstanding}
                onChange={(e) => handleUpdateTranslationField('clientNeedsUnderstanding', e.target.value)}
                className="w-full p-3 bg-[#F5F0E7]/30 border border-[#22221F]/20 leading-relaxed font-sans focus:outline-none focus:border-[#39483B]"
              />
            </div>

            {/* Editable Proposed Solution */}
            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Proposed Solution
              </label>
              <textarea
                rows={4}
                value={activeTranslation.proposedSolution}
                onChange={(e) => handleUpdateTranslationField('proposedSolution', e.target.value)}
                className="w-full p-3 bg-[#F5F0E7]/30 border border-[#22221F]/20 leading-relaxed font-sans focus:outline-none focus:border-[#39483B]"
              />
            </div>

            {/* Milestones in Translation */}
            <div>
              <span className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Milestones & Dates (Preserved)
              </span>
              <div className="space-y-2 p-3 bg-[#F5F0E7]/30 border border-[#22221F]/20">
                {activeTranslation.milestones.map((m, idx) => (
                  <div key={idx} className="space-y-1 pb-2 border-b border-[#22221F]/10 last:border-0 last:pb-0">
                    <strong className="text-[#39483B]">{m.title}</strong>{' '}
                    <span className="font-mono text-[10px] text-[#22221F]/50">({m.durationOrDate})</span>
                    <p className="text-[11px] text-[#22221F]/80">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-[#39483B] flex items-center justify-between">
              <span>PRICES & CURRENCIES: {proposal.budgetEstimate || 'PRESERVED EXACTLY'}</span>
              <span>TIMELINE: {proposal.timelineEstimate}</span>
            </div>
          </div>
        </div>
      )}

      {selectedLang === 'en' && (
        <div className="p-8 bg-[#FFFFFF] border border-[#22221F]/15 text-center text-xs space-y-2">
          <p className="font-serif text-lg font-medium text-[#22221F]">
            Viewing Original English Proposal
          </p>
          <p className="text-[#22221F]/65 font-sans">
            Select <strong>हिन्दी (Hindi)</strong> or <strong>Hinglish</strong> above to generate and inspect a synchronized side-by-side translated version.
          </p>
        </div>
      )}
    </div>
  );
};
