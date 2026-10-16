import React, { useState, useEffect, useRef } from 'react';
import { ProposalData, ProposalDeliverable, ProposalMilestone, ProjectBrief } from '../types/proposal';
import { BotanicalDivider, LaurelCrest } from './Ornaments';
import { copyToClipboard, downloadTextFile, formatProposalMarkdown } from '../utils/export';
import { exportProposalPdf } from '../utils/pdfExport';
import { saveProposalToStorage } from '../utils/storage';
import { LivingScopeMap } from './LivingScopeMap';
import { ScopeCreepModal } from './ScopeCreepModal';
import { ScopeTimeMachine } from './ScopeTimeMachine';
import { MultilingualStudio } from './MultilingualStudio';
import { AudioPlayerBar } from './AudioPlayerBar';
import { ScopeTextToSpeech, TTSState } from '../utils/speechSynthesis';

interface ProposalEditorProps {
  proposal: ProposalData;
  brief?: ProjectBrief | null;
  onUpdateProposal: (updated: ProposalData) => void;
  onRegenerate: (instructions?: string) => void;
  onStartOver: () => void;
  onOpenModelModal: () => void;
}

export const ProposalEditor: React.FC<ProposalEditorProps> = ({
  proposal,
  brief,
  onUpdateProposal,
  onRegenerate,
  onStartOver,
  onOpenModelModal,
}) => {
  // Current active view tab: document vs scope map vs time machine vs multilingual
  const [activeTab, setActiveTab] = useState<'document' | 'scope_map' | 'time_machine' | 'multilingual'>('document');
  const [activeSection, setActiveSection] = useState<string>('sec-exec');

  // Text-to-Speech Engine
  const [ttsState, setTtsState] = useState<TTSState>({
    isSupported: true,
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    currentVoiceURI: null,
    activeTextSnippet: null,
    currentSectionTitle: null,
  });
  const ttsEngineRef = useRef<ScopeTextToSpeech | null>(null);

  useEffect(() => {
    ttsEngineRef.current = new ScopeTextToSpeech((partial) => {
      setTtsState((prev) => ({ ...prev, ...partial }));
    });
    return () => {
      ttsEngineRef.current?.stop();
    };
  }, []);

  const editorRootRef = useRef<HTMLDivElement>(null);

  // Position at top of proposal whenever a proposal is newly loaded or regenerated
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const t1 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (editorRootRef.current) {
        editorRootRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, 50);

    const t2 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 160);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [proposal.id]);

  const effectiveBrief: ProjectBrief = brief || {
    projectTitle: proposal.title,
    clientName: proposal.clientName,
    projectCategory: proposal.category,
    requirements: proposal.clientNeedsUnderstanding,
    goals: proposal.proposedSolution,
    budget: proposal.budgetEstimate,
    deadline: proposal.timelineEstimate,
    tone: 'Premium',
  };

  const handleListenFullProposal = () => {
    if (!ttsEngineRef.current) return;
    ttsEngineRef.current.speakSections([
      { title: proposal.title, content: `${proposal.title}. Client: ${proposal.clientName}. Discipline: ${proposal.category}.` },
      { title: 'Executive Summary', content: proposal.executiveSummary },
      { title: 'Client Needs Understanding', content: proposal.clientNeedsUnderstanding },
      { title: 'Proposed Solution', content: proposal.proposedSolution },
      { title: 'Deliverables', content: proposal.deliverables.map((d) => `${d.category}. ${d.items.join('. ')}`).join('. ') },
      { title: 'Milestones & Schedule', content: proposal.milestones.map((m) => `${m.title}. Duration: ${m.durationOrDate || 'As scheduled'}. ${m.description}`).join('. ') },
      { title: 'Scope Exclusions', content: `Protected exclusions: ${proposal.scopeExclusions.join('. ')}` },
      { title: 'Acceptance Criteria', content: `Acceptance criteria: ${proposal.acceptanceCriteria.join('. ')}` },
      { title: 'Next Steps', content: `Next steps: ${proposal.nextSteps.join('. ')}` },
    ]);
  };

  const handleListenSection = (title: string, text: string) => {
    if (!ttsEngineRef.current) return;
    ttsEngineRef.current.speakSingleText(text, title);
  };

  // Autosave & edit tracking
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [originalProposal, setOriginalProposal] = useState<ProposalData>(proposal);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Feedbacks & Modals
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [regenInstructions, setRegenInstructions] = useState('');
  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showScopeCreepModal, setShowScopeCreepModal] = useState(false);

  // Helper to trigger temporary toast
  const triggerToast = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // Debounced Autosave (1500ms after last stroke)
  const triggerAutosave = (updatedProposal: ProposalData) => {
    setSaveState('unsaved');
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      setSaveState('saving');
      saveProposalToStorage(updatedProposal);
      setTimeout(() => {
        setSaveState('saved');
        setOriginalProposal(updatedProposal);
      }, 400);
    }, 1200);
  };

  // Immediate Manual Save
  const handleManualSave = () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setSaveState('saving');
    saveProposalToStorage(proposal);
    setTimeout(() => {
      setSaveState('saved');
      setOriginalProposal(proposal);
      triggerToast('Proposal draft saved locally');
    }, 300);
  };

  // Discard changes
  const handleDiscardChanges = () => {
    onUpdateProposal(originalProposal);
    setSaveState('saved');
    setShowDiscardModal(false);
    triggerToast('Reverted to last saved version');
  };

  // Mutator helper
  const updateField = <K extends keyof ProposalData>(field: K, value: ProposalData[K]) => {
    const updated: ProposalData = {
      ...proposal,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProposal(updated);
    triggerAutosave(updated);
  };

  // Export handlers
  const handleCopyFull = async () => {
    const md = formatProposalMarkdown(proposal);
    const ok = await copyToClipboard(md);
    if (ok) {
      triggerToast('Full proposal copied to clipboard as Markdown');
    }
  };

  const handleCopySection = async (title: string, text: string) => {
    const ok = await copyToClipboard(`### ${title}\n\n${text}`);
    if (ok) {
      triggerToast(`"${title}" copied to clipboard`);
    }
  };

  const handleExportMarkdown = () => {
    const md = formatProposalMarkdown(proposal);
    const filename = `${proposal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-proposal.md`;
    downloadTextFile(filename, md, 'text/markdown');
    triggerToast('Exported Markdown file');
  };

  const handleExportPlainText = () => {
    const md = formatProposalMarkdown(proposal);
    const filename = `${proposal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-proposal.txt`;
    downloadTextFile(filename, md, 'text/plain');
    triggerToast('Exported plain text file');
  };

  const handleExportPdf = async () => {
    setPdfGenerating(true);
    triggerToast('Generating high-craft PDF document...');
    const success = await exportProposalPdf(proposal);
    setPdfGenerating(false);
    if (success) {
      triggerToast('Proposal PDF exported successfully! ✓');
      // Update status to Exported
      updateField('status', 'Exported');
    } else {
      triggerToast('PDF generation failed. You can also use Print / Save as PDF.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // 9 Required Core Sections Navigation
  const outlineItems = [
    { id: 'sec-title', label: 'Document Masthead' },
    { id: 'sec-exec', label: '01. Executive Summary' },
    { id: 'sec-needs', label: '02. Client Requirements' },
    { id: 'sec-solution', label: '03. Proposed Solution' },
    { id: 'sec-deliverables', label: '04. Scope and Deliverables' },
    { id: 'sec-milestones', label: '05. Milestones and Timeline' },
    { id: 'sec-pricing', label: '06. Pricing and Assumptions' },
    { id: 'sec-exclusions', label: '07. Exclusions and Revision Policy' },
    { id: 'sec-acceptance', label: '08. Acceptance Criteria' },
    { id: 'sec-next', label: '09. Next Steps' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={editorRootRef} className="max-w-7xl mx-auto px-6 py-8">
      {/* Toast Feedback notification */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#39483B] text-[#F5F0E7] text-xs sm:text-sm px-4 py-2.5 shadow-xl font-medium border border-[#A6AD99]/30 transition-all flex items-center gap-2">
          <span>✓</span>
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* Editor Main Control Ribbon */}
      <div id="proposal-editor-top" className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#22221F]/15 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-[13px] uppercase tracking-widest font-mono text-[#39483B] mb-1">
            <span>Proposal Studio</span>
            <span aria-hidden="true">·</span>
            <span>{proposal.category}</span>
            <span aria-hidden="true">·</span>
            {/* Tone Mode Badge */}
            <span
              className={`font-mono text-xs px-2.5 py-0.5 border font-semibold ${
                (proposal.tone || brief?.tone) === 'Professional'
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : (proposal.tone || brief?.tone) === 'Friendly'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-[#39483B] border-[#39483B]/30'
              }`}
              title={`Synthesized in ${proposal.tone || brief?.tone || 'Professional'} Tone Mode`}
            >
              Mode: {proposal.tone || brief?.tone || 'Professional'}
            </span>
            <span aria-hidden="true">·</span>
            {/* Autosave Status Indicator */}
            <span
              className={`font-mono text-xs px-2.5 py-0.5 border ${
                saveState === 'saved'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : saveState === 'saving'
                  ? 'bg-blue-50 text-blue-900 border-blue-200 animate-pulse'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              {saveState === 'saved'
                ? 'Saved'
                : saveState === 'saving'
                ? 'Saving…'
                : 'Unsaved changes'}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-medium text-[#22221F]">
            {proposal.title}
          </h1>
        </div>

        {/* Tab & Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switchers */}
          <div className="p-1.5 bg-[#E9E0D2]/60 border border-[#22221F]/15 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('document')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-[#FFFFFF] text-[#22221F] shadow-xs font-semibold'
                  : 'text-[#22221F]/70 hover:text-[#22221F]'
              }`}
            >
              Document Editor
            </button>
            <button
              onClick={() => setActiveTab('scope_map')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'scope_map'
                  ? 'bg-[#FFFFFF] text-[#22221F] shadow-xs font-semibold'
                  : 'text-[#22221F]/70 hover:text-[#22221F]'
              }`}
            >
              <span>Scope Map</span>
              <span className="w-2 h-2 rounded-full bg-[#39483B]" />
            </button>
            <button
              onClick={() => setActiveTab('time_machine')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'time_machine'
                  ? 'bg-[#FFFFFF] text-[#22221F] shadow-xs font-semibold'
                  : 'text-[#22221F]/70 hover:text-[#22221F]'
              }`}
            >
              <span>Time Machine</span>
              <span className="text-[11px] font-mono bg-[#E9E0D2] px-1.5 py-0.5 text-[#39483B] font-semibold">3-Col</span>
            </button>
            <button
              onClick={() => setActiveTab('multilingual')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'multilingual'
                  ? 'bg-[#FFFFFF] text-[#22221F] shadow-xs font-semibold'
                  : 'text-[#22221F]/70 hover:text-[#22221F]'
              }`}
            >
              <span>Multilingual</span>
              <span className="text-[11px] font-mono bg-[#E9E0D2] px-1.5 py-0.5 text-[#39483B] font-semibold">हिन्दी</span>
            </button>
          </div>

          {/* Listen to Full Proposal (TTS) */}
          <button
            type="button"
            onClick={handleListenFullProposal}
            className={`px-4 py-2.5 text-xs sm:text-[13px] font-mono uppercase tracking-wider border transition-colors flex items-center gap-2 cursor-pointer ${
              ttsState.isPlaying
                ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B]'
                : 'bg-[#F5F0E7] hover:bg-[#E9E0D2] text-[#39483B] border-[#22221F]/20'
            }`}
            title="Listen to full proposal read aloud via Text-to-Speech"
          >
            <span>{ttsState.isPlaying ? '🔊 Playing…' : '🔊 Listen Aloud'}</span>
          </button>

          {/* Scope-Creep Sentinel Button */}
          <button
            onClick={() => setShowScopeCreepModal(true)}
            className="px-4 py-2.5 text-xs sm:text-[13px] font-medium uppercase tracking-wider bg-[#E9E0D2] hover:bg-[#ded2c1] text-[#22221F] border border-[#22221F]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Check a new client request against this scope"
          >
            <span>Scope Sentinel</span>
            <span className="font-mono text-[11px] text-[#39483B] font-bold">AI</span>
          </button>

          {/* Export PDF primary CTA */}
          <button
            onClick={handleExportPdf}
            disabled={pdfGenerating}
            className="px-5 py-2.5 text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-[#F5F0E7] bg-[#39483B] hover:bg-[#2e3a2f] transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            {pdfGenerating ? 'Preparing PDF…' : 'Export PDF'}
          </button>

          {/* Discard changes if unsaved */}
          {saveState === 'unsaved' && (
            <button
              onClick={() => setShowDiscardModal(true)}
              className="text-xs text-amber-900/80 hover:text-amber-900 underline underline-offset-2 px-1 cursor-pointer"
            >
              Discard edits
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'scope_map' ? (
        <LivingScopeMap proposal={proposal} onUpdateProposal={onUpdateProposal} />
      ) : activeTab === 'time_machine' ? (
        <ScopeTimeMachine
          brief={effectiveBrief}
          proposal={proposal}
          ttsEngine={ttsEngineRef.current || undefined}
        />
      ) : activeTab === 'multilingual' ? (
        <MultilingualStudio
          proposal={proposal}
          onUpdateProposal={onUpdateProposal}
          ttsEngine={ttsEngineRef.current || undefined}
        />
      ) : (
        /* Two-Column Document Editor */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Proposal Canvas */}
          <main className="lg:col-span-8 bg-[#FFFFFF] border border-[#22221F]/15 p-8 sm:p-14 shadow-sm text-[#22221F] proposal-document-export space-y-12">
            {/* Section 00: Document Masthead */}
            <section id="sec-title" className="pb-8 border-b border-[#22221F]/15 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#22221F]/60">
                <span>SCOPECRAFT ARCHIVAL MONOGRAPH</span>
                <span>STATUS: {proposal.status.toUpperCase()}</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#39483B] mb-1">
                  Editable Proposal Title
                </label>
                <input
                  type="text"
                  value={proposal.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full font-serif text-3xl sm:text-4xl font-medium text-[#22221F] border-b border-transparent hover:border-[#22221F]/20 focus:border-[#39483B] focus:outline-none py-1 bg-transparent transition-colors"
                />
              </div>

              {/* Unboxed Metadata (Zero-pill discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#22221F]/70 pt-2 font-sans">
                <span>Client: <strong className="font-medium text-[#22221F]">{proposal.clientName}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Category: {proposal.category}</span>
                <span aria-hidden="true">·</span>
                <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-[#39483B]">Version 1.2</span>
              </div>
            </section>

            {/* Section 01: Executive Summary */}
            <section id="sec-exec" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">01.</span>
                  Executive Summary
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleListenSection('Executive Summary', proposal.executiveSummary)}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Executive Summary read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => handleCopySection('Executive Summary', proposal.executiveSummary)}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={proposal.executiveSummary}
                onChange={(e) => updateField('executiveSummary', e.target.value)}
                className="w-full p-4 bg-[#F5F0E7]/30 border border-transparent hover:border-[#22221F]/20 focus:border-[#39483B] focus:bg-[#FFFFFF] focus:outline-none text-[#22221F] text-[15px] sm:text-base leading-relaxed transition-colors font-sans"
              />
            </section>

            {/* Section 02: Understanding of Client Requirements */}
            <section id="sec-needs" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">02.</span>
                  Understanding of Client Requirements
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleListenSection('Understanding of Client Requirements', proposal.clientNeedsUnderstanding)}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Client Requirements read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => handleCopySection('Client Requirements', proposal.clientNeedsUnderstanding)}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={proposal.clientNeedsUnderstanding}
                onChange={(e) => updateField('clientNeedsUnderstanding', e.target.value)}
                className="w-full p-4 bg-[#F5F0E7]/30 border border-transparent hover:border-[#22221F]/20 focus:border-[#39483B] focus:bg-[#FFFFFF] focus:outline-none text-[#22221F] text-[15px] sm:text-base leading-relaxed transition-colors font-sans"
              />
            </section>

            {/* Section 03: Proposed Solution */}
            <section id="sec-solution" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">03.</span>
                  Proposed Solution & Strategic Approach
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleListenSection('Proposed Solution', proposal.proposedSolution)}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Proposed Solution read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => handleCopySection('Proposed Solution', proposal.proposedSolution)}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={proposal.proposedSolution}
                onChange={(e) => updateField('proposedSolution', e.target.value)}
                className="w-full p-4 bg-[#F5F0E7]/30 border border-transparent hover:border-[#22221F]/20 focus:border-[#39483B] focus:bg-[#FFFFFF] focus:outline-none text-[#22221F] text-[15px] sm:text-base leading-relaxed transition-colors font-sans"
              />
            </section>

            {/* Section 04: Scope and Deliverables */}
            <section id="sec-deliverables" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2 border-b border-[#22221F]/10">
                <h2 className="font-serif text-2xl font-medium text-[#22221F] flex items-center gap-2">
                  <span className="text-[#39483B] font-mono text-xs">04.</span>
                  Scope and Deliverables
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const text = proposal.deliverables
                        .map((d) => `${d.category}. ${d.items.join('. ')}`)
                        .join('. ');
                      handleListenSection('Scope and Deliverables', text);
                    }}
                    className="text-xs text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1"
                    title="Listen to Deliverables read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => {
                      const serialized = proposal.deliverables
                        .map((d) => `${d.category}:\n${d.items.map((i) => `- ${i}`).join('\n')}`)
                        .join('\n\n');
                      handleCopySection('Deliverables', serialized);
                    }}
                    className="text-xs text-[#22221F]/60 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {proposal.deliverables.map((group, groupIdx) => (
                  <div key={groupIdx} className="p-5 bg-[#F5F0E7]/25 border border-[#22221F]/15 space-y-3">
                    <input
                      type="text"
                      value={group.category}
                      onChange={(e) => {
                        const updated = [...proposal.deliverables];
                        updated[groupIdx].category = e.target.value;
                        updateField('deliverables', updated);
                      }}
                      className="font-serif font-medium text-lg sm:text-xl text-[#39483B] w-full bg-transparent border-b border-transparent hover:border-[#22221F]/20 focus:outline-none py-1"
                    />
                    <div className="space-y-2.5">
                      {group.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2.5">
                          <span className="text-sm text-[#39483B] font-mono">•</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...proposal.deliverables];
                              updated[groupIdx].items[itemIdx] = e.target.value;
                              updateField('deliverables', updated);
                            }}
                            className="flex-1 text-[15px] sm:text-base text-[#22221F] bg-transparent border-b border-transparent hover:border-[#22221F]/15 focus:border-[#39483B] focus:outline-none py-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...proposal.deliverables];
                              updated[groupIdx].items.splice(itemIdx, 1);
                              updateField('deliverables', updated);
                            }}
                            className="text-sm text-[#22221F]/40 hover:text-amber-800 px-1.5 cursor-pointer"
                            title="Remove deliverable"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...proposal.deliverables];
                          updated[groupIdx].items.push('New deliverable item');
                          updateField('deliverables', updated);
                        }}
                        className="text-xs sm:text-[13px] text-[#39483B] font-medium hover:underline pt-1.5 cursor-pointer inline-block"
                      >
                        + Add deliverable item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 05: Milestones and Timeline */}
            <section id="sec-milestones" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">05.</span>
                  Milestones and Timeline
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const text = proposal.milestones
                        .map((m) => `${m.title}. Duration: ${m.durationOrDate || 'As scheduled'}. ${m.description}. Key artifacts: ${m.deliverablesSummary || 'See deliverables'}`)
                        .join('. ');
                      handleListenSection('Milestones and Timeline', text);
                    }}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Milestones and Timeline read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => {
                      const content = proposal.milestones
                        .map((m) => `${m.title} (${m.durationOrDate}):\n${m.description}\nArtifacts: ${m.deliverablesSummary}`)
                        .join('\n\n');
                      handleCopySection('Milestones', content);
                    }}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {proposal.milestones.map((m, idx) => (
                  <div key={idx} className="p-5 bg-[#F5F0E7]/25 border border-[#22221F]/15 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...proposal.milestones];
                          updated[idx].title = e.target.value;
                          updateField('milestones', updated);
                        }}
                        className="font-serif text-lg sm:text-xl font-medium text-[#22221F] bg-transparent border-b border-transparent hover:border-[#22221F]/15 focus:outline-none flex-1 py-1"
                      />
                      <input
                        type="text"
                        value={m.durationOrDate || ''}
                        placeholder="e.g. Weeks 1–2"
                        onChange={(e) => {
                          const updated = [...proposal.milestones];
                          updated[idx].durationOrDate = e.target.value;
                          updateField('milestones', updated);
                        }}
                        className="text-xs sm:text-[13px] font-mono text-[#39483B] font-semibold bg-transparent border-b border-transparent hover:border-[#22221F]/15 focus:outline-none max-w-[160px] py-1"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={m.description}
                      onChange={(e) => {
                        const updated = [...proposal.milestones];
                        updated[idx].description = e.target.value;
                        updateField('milestones', updated);
                      }}
                      className="w-full text-[14px] sm:text-[15px] text-[#22221F]/85 bg-transparent border border-transparent hover:border-[#22221F]/15 focus:border-[#39483B] focus:bg-[#FFFFFF] focus:outline-none leading-relaxed p-2.5 transition-colors font-sans"
                    />
                    <div>
                      <label className="text-xs uppercase tracking-wider font-mono text-[#22221F]/70 block mb-1">
                        Deliverable Summary:
                      </label>
                      <input
                        type="text"
                        value={m.deliverablesSummary || ''}
                        onChange={(e) => {
                          const updated = [...proposal.milestones];
                          updated[idx].deliverablesSummary = e.target.value;
                          updateField('milestones', updated);
                        }}
                        className="w-full text-[14px] sm:text-[15px] italic font-serif text-[#39483B] bg-transparent border-b border-transparent hover:border-[#22221F]/15 focus:outline-none py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] uppercase font-mono tracking-wider text-[#22221F]/80 mb-1.5 font-semibold">
                  Estimated Overall Timeline:
                </label>
                <textarea
                  rows={2}
                  value={proposal.timelineEstimate}
                  onChange={(e) => updateField('timelineEstimate', e.target.value)}
                  className="w-full p-4 bg-[#F5F0E7]/30 border border-transparent hover:border-[#22221F]/20 focus:border-[#39483B] focus:bg-[#FFFFFF] focus:outline-none text-[15px] sm:text-base text-[#22221F] leading-relaxed transition-colors font-sans"
                />
              </div>
            </section>

            {/* Section 06: Pricing and Assumptions */}
            <section id="sec-pricing" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">06.</span>
                  Pricing and Assumptions
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleListenSection('Pricing and Assumptions', proposal.pricingAndAssumptions || proposal.budgetEstimate || 'Pricing and assumptions specification.')}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Pricing and Assumptions read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => handleCopySection('Pricing and Assumptions', proposal.pricingAndAssumptions || proposal.budgetEstimate || '')}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>
              <textarea
                rows={4}
                value={proposal.pricingAndAssumptions || proposal.budgetEstimate || ''}
                onChange={(e) => {
                  updateField('pricingAndAssumptions', e.target.value);
                  updateField('budgetEstimate', e.target.value);
                }}
                className="w-full p-4 bg-[#F5F0E7]/30 border border-transparent hover:border-[#22221F]/20 focus:border-[#39483B] focus:bg-[#FFFFFF] focus:outline-none text-[#22221F] text-[15px] sm:text-base leading-relaxed transition-colors font-sans"
              />
            </section>

            {/* Section 07: Exclusions and Revision Policy */}
            <section id="sec-exclusions" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">07.</span>
                  Exclusions and Revision Policy
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Revision policy: ${proposal.revisionPolicy || 'Standard iterative revision policy'}. Protected scope exclusions: ${proposal.scopeExclusions.join('. ')}`;
                      handleListenSection('Exclusions and Revision Policy', text);
                    }}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Exclusions and Revision Policy read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => {
                      const content = `Revision Policy:\n${proposal.revisionPolicy || ''}\n\nExclusions:\n${proposal.scopeExclusions.map((e) => `- ${e}`).join('\n')}`;
                      handleCopySection('Exclusions and Revision Policy', content);
                    }}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] uppercase font-mono tracking-wider text-[#22221F]/80 mb-1.5 font-semibold">
                  Contract Revision Policy:
                </label>
                <textarea
                  rows={3}
                  value={proposal.revisionPolicy || ''}
                  onChange={(e) => updateField('revisionPolicy', e.target.value)}
                  className="w-full p-4 bg-[#F5F0E7]/30 border border-transparent hover:border-[#22221F]/20 focus:border-[#39483B] focus:bg-[#FFFFFF] focus:outline-none text-[15px] sm:text-base text-[#22221F] leading-relaxed transition-colors font-sans"
                />
              </div>

              <div className="p-5 bg-[#F5F0E7]/25 border border-[#22221F]/15 space-y-3">
                <h3 className="text-xs sm:text-[13px] uppercase tracking-wider font-mono text-[#9B846C] font-semibold">
                  Explicit Out-of-Scope Exclusions (Protects Freelancer)
                </h3>
                <div className="space-y-2.5">
                  {proposal.scopeExclusions.map((exc, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-sm text-[#9B846C] mt-1">✕</span>
                      <input
                        type="text"
                        value={exc}
                        onChange={(e) => {
                          const updated = [...proposal.scopeExclusions];
                          updated[i] = e.target.value;
                          updateField('scopeExclusions', updated);
                        }}
                        className="flex-1 text-[14px] sm:text-[15px] text-[#22221F] bg-transparent border-b border-transparent hover:border-[#22221F]/15 focus:outline-none py-1"
                      />
                      <button
                        onClick={() => {
                          const updated = [...proposal.scopeExclusions];
                          updated.splice(i, 1);
                          updateField('scopeExclusions', updated);
                        }}
                        className="text-sm text-[#22221F]/40 hover:text-amber-800 px-1.5 cursor-pointer"
                        title="Remove exclusion"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updateField('scopeExclusions', [...proposal.scopeExclusions, 'New out-of-scope exclusion item']);
                    }}
                    className="text-xs sm:text-[13px] text-[#9B846C] font-medium hover:underline pt-1.5 block cursor-pointer"
                  >
                    + Add exclusion item
                  </button>
                </div>
              </div>
            </section>

            {/* Section 08: Acceptance Criteria */}
            <section id="sec-acceptance" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">08.</span>
                  Acceptance Criteria
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Acceptance criteria for deliverables sign-off: ${proposal.acceptanceCriteria.join('. ')}`;
                      handleListenSection('Acceptance Criteria', text);
                    }}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Acceptance Criteria read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => {
                      const content = proposal.acceptanceCriteria.map((c) => `- [x] ${c}`).join('\n');
                      handleCopySection('Acceptance Criteria', content);
                    }}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {proposal.acceptanceCriteria.map((crit, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-sm font-mono text-[#39483B] mt-1 font-bold">✓</span>
                    <input
                      type="text"
                      value={crit}
                      onChange={(e) => {
                        const updated = [...proposal.acceptanceCriteria];
                        updated[i] = e.target.value;
                        updateField('acceptanceCriteria', updated);
                      }}
                      className="flex-1 text-[14px] sm:text-[15px] text-[#22221F] bg-transparent border-b border-transparent hover:border-[#22221F]/15 focus:outline-none py-1"
                    />
                    <button
                      onClick={() => {
                        const updated = [...proposal.acceptanceCriteria];
                        updated.splice(i, 1);
                        updateField('acceptanceCriteria', updated);
                      }}
                      className="text-sm text-[#22221F]/40 hover:text-amber-800 px-1.5 cursor-pointer"
                      title="Remove criteria"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateField('acceptanceCriteria', [
                      ...proposal.acceptanceCriteria,
                      'New objective acceptance criterion',
                    ]);
                  }}
                  className="text-xs sm:text-[13px] text-[#39483B] font-medium hover:underline pt-2 block cursor-pointer"
                >
                  + Add acceptance criterion
                </button>
              </div>
            </section>

            {/* Section 09: Next Steps */}
            <section id="sec-next" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#22221F]/15">
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2.5">
                  <span className="text-[#39483B] font-mono text-sm">09.</span>
                  Next Steps to Proceed
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Next steps to proceed: ${proposal.nextSteps.join('. ')}`;
                      handleListenSection('Next Steps', text);
                    }}
                    className="text-xs sm:text-[13px] text-[#39483B] hover:text-[#22221F] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Listen to Next Steps read aloud"
                  >
                    <span>🔊</span>
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => {
                      const content = proposal.nextSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
                      handleCopySection('Next Steps', content);
                    }}
                    className="text-xs sm:text-[13px] text-[#22221F]/70 hover:text-[#39483B] font-mono transition-colors cursor-pointer"
                  >
                    Copy Section
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {proposal.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-sm font-mono text-[#39483B] mt-1 font-bold">→</span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const updated = [...proposal.nextSteps];
                        updated[i] = e.target.value;
                        updateField('nextSteps', updated);
                      }}
                      className="flex-1 text-[14px] sm:text-[15px] text-[#22221F] bg-transparent border-b border-transparent hover:border-[#22221F]/15 focus:outline-none py-1"
                    />
                    <button
                      onClick={() => {
                        const updated = [...proposal.nextSteps];
                        updated.splice(i, 1);
                        updateField('nextSteps', updated);
                      }}
                      className="text-sm text-[#22221F]/40 hover:text-amber-800 px-1.5 cursor-pointer"
                      title="Remove step"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateField('nextSteps', [...proposal.nextSteps, 'New subsequent step']);
                  }}
                  className="text-xs sm:text-[13px] text-[#39483B] font-medium hover:underline pt-2 block cursor-pointer"
                >
                  + Add subsequent step
                </button>
              </div>
            </section>

            {/* Document Footer Sign-off */}
            <div className="pt-8 border-t border-[#22221F]/15 flex flex-col items-center text-center">
              <BotanicalDivider className="mb-4" />
              <LaurelCrest className="w-12 h-12 text-[#39483B]" label="CRAFT" year="2026" />
              <p className="text-xs font-serif italic text-[#22221F]/60 mt-2">
                ScopeCraft Proposal Studio · Crafted with editorial dignity.
              </p>
            </div>
          </main>

          {/* Sticky Companion Sidebar */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6 no-print">
            {/* Quick Actions Panel */}
            <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#22221F] pb-2 border-b border-[#22221F]/10">
                Document Actions
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={handleExportPdf}
                  disabled={pdfGenerating}
                  className="w-full py-3 px-4 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-[13px] sm:text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Export Proposal as PDF</span>
                  <span className="font-mono text-xs">PDF</span>
                </button>

                <button
                  onClick={handleCopyFull}
                  className="w-full py-2.5 px-4 bg-[#FFFFFF] border border-[#22221F]/20 hover:border-[#22221F]/50 text-[#22221F] text-[13px] font-medium uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Copy Full Proposal</span>
                  <span className="font-mono text-xs text-[#39483B]">MD</span>
                </button>

                <button
                  onClick={handleManualSave}
                  className="w-full py-2.5 px-4 bg-[#F5F0E7] hover:bg-[#E9E0D2] border border-[#22221F]/15 text-[#22221F] text-[13px] font-medium uppercase tracking-wider transition-colors text-left flex items-center justify-between cursor-pointer"
                >
                  <span>Save to Browser</span>
                  <span className="text-xs text-[#22221F]/60 font-mono">LOCAL</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleExportMarkdown}
                    className="py-2.5 px-3 text-xs sm:text-[13px] font-medium border border-[#22221F]/20 hover:border-[#22221F]/50 text-[#22221F] transition-colors text-center cursor-pointer"
                    title="Download .md file"
                  >
                    Export .MD
                  </button>
                  <button
                    onClick={handleExportPlainText}
                    className="py-2.5 px-3 text-xs sm:text-[13px] font-medium border border-[#22221F]/20 hover:border-[#22221F]/50 text-[#22221F] transition-colors text-center cursor-pointer"
                    title="Download .txt file"
                  >
                    Export .TXT
                  </button>
                </div>

                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 px-4 border border-[#22221F]/15 hover:border-[#22221F]/40 text-[#22221F] text-[13px] font-medium uppercase tracking-wider transition-colors text-center cursor-pointer"
                >
                  Browser Print Preview
                </button>
              </div>

              <div className="pt-3 border-t border-[#22221F]/10 space-y-2.5">
                <button
                  onClick={() => setShowScopeCreepModal(true)}
                  className="w-full py-2.5 px-3 bg-[#E9E0D2]/50 hover:bg-[#E9E0D2] text-[13px] font-medium text-[#22221F] border border-[#22221F]/12 text-center transition-colors cursor-pointer"
                >
                  Sentinel: Compare New Request
                </button>

                <button
                  onClick={() => setShowRegenModal(true)}
                  className="w-full py-2 text-[13px] sm:text-sm text-[#39483B] hover:text-[#22221F] underline underline-offset-2 text-center cursor-pointer font-medium"
                >
                  Regenerate Draft with AI Guidance
                </button>

                <button
                  onClick={() => setShowStartOverModal(true)}
                  className="w-full py-1 text-xs sm:text-[13px] text-amber-900/80 hover:text-amber-900 underline underline-offset-2 text-center cursor-pointer"
                >
                  Start Over with New Brief
                </button>
              </div>
            </div>

            {/* Table of Contents Navigator */}
            <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#22221F]/10">
                <h3 className="font-serif text-xl font-medium text-[#22221F]">
                  Table of Contents
                </h3>
                <span className="text-xs font-mono text-[#39483B] font-semibold">9 SECTIONS</span>
              </div>

              <nav className="space-y-1.5">
                {outlineItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left py-2 px-3 text-[13px] sm:text-sm transition-colors rounded-none flex items-center justify-between cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-[#39483B] text-[#F5F0E7] font-semibold'
                        : 'text-[#22221F]/75 hover:text-[#22221F] hover:bg-[#F5F0E7]/60'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-xs opacity-60">→</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Scope-Creep Sentinel Modal */}
      <ScopeCreepModal
        isOpen={showScopeCreepModal}
        onClose={() => setShowScopeCreepModal(false)}
        proposal={proposal}
      />

      {/* Regenerate Modal */}
      {showRegenModal && (
        <div className="fixed inset-0 z-50 bg-[#22221F]/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-medium text-[#22221F]">
              Regenerate Draft with AI
            </h3>
            <p className="text-xs text-[#22221F]/70 leading-relaxed">
              <strong>Caution:</strong> Regenerating will replace draft sections with fresh synthesis.
              Provide specific directives or areas to emphasize:
            </p>
            <textarea
              rows={4}
              value={regenInstructions}
              onChange={(e) => setRegenInstructions(e.target.value)}
              placeholder="e.g. Expand on Milestone 2 testing deliverables and sharpen the out-of-scope exclusions..."
              className="w-full p-3 bg-[#F5F0E7]/40 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B]"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRegenModal(false)}
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#22221F]/70 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRegenModal(false);
                  onRegenerate(regenInstructions.trim());
                }}
                className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-[#39483B] text-[#F5F0E7] hover:bg-[#2e3a2f] cursor-pointer"
              >
                Regenerate Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Changes Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 bg-[#22221F]/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-medium text-[#22221F]">
              Discard Unsaved Changes?
            </h3>
            <p className="text-xs text-[#22221F]/70 leading-relaxed">
              Are you sure you want to revert all manual edits back to the last saved state? Unsaved modifications will be lost.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#22221F]/70 cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                onClick={handleDiscardChanges}
                className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-amber-900 text-[#F5F0E7] hover:bg-amber-950 cursor-pointer"
              >
                Discard Edits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Over Modal */}
      {showStartOverModal && (
        <div className="fixed inset-0 z-50 bg-[#22221F]/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-medium text-[#22221F]">
              Start with a New Brief?
            </h3>
            <p className="text-xs text-[#22221F]/70 leading-relaxed">
              Your current proposal has been saved locally in your browser. You can return to the brief intake form to start another engagement.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowStartOverModal(false)}
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#22221F]/70 cursor-pointer"
              >
                Continue Proposal
              </button>
              <button
                onClick={() => {
                  setShowStartOverModal(false);
                  onStartOver();
                }}
                className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-[#39483B] text-[#F5F0E7] hover:bg-[#2e3a2f] cursor-pointer"
              >
                New Brief Intake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Audio Player Bar */}
      {ttsEngineRef.current && (
        <AudioPlayerBar
          ttsEngine={ttsEngineRef.current}
          ttsState={ttsState}
          onStop={() => ttsEngineRef.current?.stop()}
        />
      )}
    </div>
  );
};
