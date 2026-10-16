import React, { useState } from 'react';
import { BotanicalDivider, LaurelCrest } from './Ornaments';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'licenses';
  onClearAllLocalData: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
  onClearAllLocalData,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'licenses'>(defaultTab);
  const [clearedNotice, setClearedNotice] = useState(false);
  const currentYear = new Date().getFullYear();

  if (!isOpen) return null;

  const handleClear = () => {
    onClearAllLocalData();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#22221F]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 selection:bg-[#39483B] selection:text-[#F5F0E7]">
      <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-6 sm:p-10 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#22221F]/15">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#39483B] block">
              Governance & Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#22221F]">
              Privacy, Terms & Open-Source Notices
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#22221F]/10 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#39483B] text-[#F5F0E7]'
                : 'text-[#22221F]/70 hover:text-[#22221F]'
            }`}
          >
            Privacy & Data Storage
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#39483B] text-[#F5F0E7]'
                : 'text-[#22221F]/70 hover:text-[#22221F]'
            }`}
          >
            Terms & Limitations
          </button>
          <button
            onClick={() => setActiveTab('licenses')}
            className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              activeTab === 'licenses'
                ? 'bg-[#39483B] text-[#F5F0E7]'
                : 'text-[#22221F]/70 hover:text-[#22221F]'
            }`}
          >
            Attribution & Licenses
          </button>
        </div>

        {/* Content by Tab */}
        <div className="space-y-4 text-xs text-[#22221F]/80 leading-relaxed font-sans">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  1. Browser Local Storage Architecture
                </h4>
                <p>
                  ScopeCraft persists all draft proposals and session markers strictly in your browser's local storage (<code>localStorage</code>). Data is stored locally on your device and is not synchronized to external servers or cloud databases. Clearing your browser cache or switching devices will reset saved drafts.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  2. AI Inference Transmission
                </h4>
                <p>
                  When you submit a brief to generate a proposal, the brief parameters are transmitted via server-side proxy (<code>/api/generate</code>) directly to your configured open-weight model provider (e.g. Groq Cloud, Hugging Face, or Together AI). When no external key is configured, proposals are synthesized locally by ScopeCraft’s built-in Studio Engine. We do not store or sell client briefs.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  3. Clearing Local Project Data
                </h4>
                <p className="mb-3">
                  You can permanently delete all locally stored proposals, drafts, and demo sessions from this browser at any time:
                </p>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-amber-900/10 hover:bg-amber-900 text-amber-950 hover:text-white border border-amber-900/20 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {clearedNotice ? 'Local Data Cleared! ✓' : 'Clear All Stored Proposals from This Browser'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  1. Human Review Requirement
                </h4>
                <p>
                  ScopeCraft is an architectural proposal studio designed to assist professional freelancers. All generated text, milestones, deliverables, and scope boundaries are decision-support drafts that require your independent professional review before being presented to clients.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  2. Pricing & Timeline Estimates
                </h4>
                <p>
                  Calculated timelines and fee recommendations are preliminary projections. They do not constitute binding agreements, warranties, or price guarantees. You remain solely responsible for the commercial terms of your client agreements.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  3. Scope-Creep Sentinel Guidance
                </h4>
                <p>
                  The Scope-Creep Sentinel provides strategic communication recommendations and change-order templates. These recommendations do not constitute legal advice or formal contract dispute resolution.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'licenses' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  Open-Weight Foundation Model Licenses
                </h4>
                <p>
                  • <strong>Meta Llama 3.3</strong>: Licensed under the Meta Llama 3.3 Community License Agreement.<br />
                  • <strong>Mistral NeMo & Mistral 7B</strong>: Apache License, Version 2.0.<br />
                  • <strong>Qwen 2.5</strong>: Apache License, Version 2.0.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  Open-Source Libraries
                </h4>
                <p>
                  • <strong>React 19 & React DOM</strong>: MIT License (Meta Platforms, Inc.)<br />
                  • <strong>Tailwind CSS</strong>: MIT License (Tailwind Labs, Inc.)<br />
                  • <strong>Motion (Framer Motion)</strong>: MIT License (Motion Software Ltd)<br />
                  • <strong>jsPDF</strong>: MIT License (James Hall & contributors)<br />
                  • <strong>Lucide Icons</strong>: ISC License
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base font-medium text-[#22221F] mb-1">
                  Typography & Imagery
                </h4>
                <p>
                  • <strong>Cormorant Garamond</strong>: Open Font License (Christian Thalmann)<br />
                  • <strong>Plus Jakarta Sans</strong>: Open Font License (Tokotype)<br />
                  • Original editorial documentary photography generated via Google AI Studio creative engine.
                </p>
              </div>
            </div>
          )}
        </div>

        <BotanicalDivider className="my-6" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#22221F]/60">
          <div className="flex items-center gap-2">
            <LaurelCrest className="w-8 h-8 text-[#39483B]" label="STUDIO" year={currentYear.toString()} />
            <span>© {currentYear} ScopeCraft Proposal Studio. All rights reserved.</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer self-end sm:self-auto"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
