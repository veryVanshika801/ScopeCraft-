import React, { useState } from 'react';
import { ProjectBrief, ProposalData, ScopeTimeMachineComparison } from '../types/proposal';
import { compareScopeInTimeMachine } from '../utils/scopeTimeMachine';
import { copyToClipboard } from '../utils/export';
import { VoiceInputButton } from './VoiceInputButton';
import { ScopeTextToSpeech } from '../utils/speechSynthesis';

interface ScopeTimeMachineProps {
  brief: ProjectBrief;
  proposal: ProposalData;
  ttsEngine?: ScopeTextToSpeech;
  className?: string;
}

export const ScopeTimeMachine: React.FC<ScopeTimeMachineProps> = ({
  brief,
  proposal,
  ttsEngine,
  className = '',
}) => {
  const [newRequestInput, setNewRequestInput] = useState<string>(
    'Can we also add an online appointment booking calendar with automated SMS reminders and a French language translation before launch?'
  );
  const [comparison, setComparison] = useState<ScopeTimeMachineComparison>(() =>
    compareScopeInTimeMachine(brief, proposal, 'Can we also add an online appointment booking calendar with automated SMS reminders and a French language translation before launch?')
  );
  const [editedResponse, setEditedResponse] = useState<string>(comparison.recommendedResponse);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [freelancerNotes, setFreelancerNotes] = useState('');

  // Sample client requests for quick testing
  const sampleRequests = [
    {
      title: 'Add Online Booking & SMS Reminders',
      text: 'Can we also add an online appointment booking calendar with automated SMS reminders and a French language translation before launch?',
    },
    {
      title: 'Accelerate Timeline by 3 Weeks',
      text: 'Our board moved our investor launch date up. Can we compress the 6-week timeline to 3 weeks without dropping any deliverables?',
    },
    {
      title: 'Drop Blog CMS to Save Time',
      text: 'We realized we will not have time to write articles this quarter. Can we drop the blog and CMS module completely?',
    },
    {
      title: 'Manage $15k Google Ads Campaign',
      text: 'Can your team also manage our $15,000 monthly Google Ads and Facebook Ads bidding campaign post-launch?',
    },
    {
      title: 'Vague Aesthetic "Pop" Request',
      text: 'The site looks good, but can we make it pop more, feel way more modern and viral, and add some dynamic flair?',
    },
  ];

  const handleRunComparison = () => {
    if (!newRequestInput.trim()) return;
    const res = compareScopeInTimeMachine(brief, proposal, newRequestInput);
    setComparison(res);
    setEditedResponse(res.recommendedResponse);
  };

  const handleSelectSample = (text: string) => {
    setNewRequestInput(text);
    const res = compareScopeInTimeMachine(brief, proposal, text);
    setComparison(res);
    setEditedResponse(res.recommendedResponse);
  };

  const handleCopyResponse = async () => {
    const ok = await copyToClipboard(editedResponse);
    if (ok) {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2500);
    }
  };

  const handleListenAnalysis = () => {
    if (!ttsEngine) return;
    const speechText =
      `Scope Change Time Machine Analysis. ${comparison.executiveSummary}. ` +
      comparison.changes
        .map(
          (c, idx) =>
            `Change ${idx + 1}: ${c.title}. Category: ${c.category.replace('_', ' ')}. Impact: ${c.estimatedEffortImpact}. Why it matters: ${c.whyItMatters}.`
        )
        .join(' ');
    ttsEngine.speakSingleText(speechText, 'Scope Time Machine Analysis');
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'added_requirements':
        return { label: 'Added Requirement', bg: 'bg-emerald-50 text-emerald-900 border-emerald-300' };
      case 'removed_requirements':
        return { label: 'Removed Requirement', bg: 'bg-blue-50 text-blue-900 border-blue-300' };
      case 'changed_expectations':
        return { label: 'Changed Expectations', bg: 'bg-amber-50 text-amber-900 border-amber-300' };
      case 'potentially_out_of_scope':
        return { label: 'Out-of-Scope Domain', bg: 'bg-rose-50 text-rose-900 border-rose-300' };
      case 'unclear_change':
      default:
        return { label: 'Unclear / Needs Confirmation', bg: 'bg-purple-50 text-purple-900 border-purple-300' };
    }
  };

  return (
    <div className={`space-y-10 ${className}`}>
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#39483B] mb-1">
            <span>Scope Change Time Machine</span>
            <span aria-hidden="true">·</span>
            <span>Tri-Column Alignment Matrix</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#22221F]">
            Compare original intentions with new client requests.
          </h2>
          <p className="text-xs sm:text-sm text-[#22221F]/70 font-sans mt-2 max-w-2xl leading-relaxed">
            Inspect what changed between the initial brief, the agreed statement of work, and incoming client requests.
            Evaluate effort impact and craft a respectful, structured response where you retain full decision agency.
          </p>
        </div>

        {ttsEngine && (
          <button
            type="button"
            onClick={handleListenAnalysis}
            className="self-start md:self-center px-4 py-2.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 shrink-0"
            title="Read out Time Machine comparison via Text-to-Speech"
          >
            <span>🔊</span>
            <span>Listen to Analysis</span>
          </button>
        )}
      </div>

      {/* 3-Column Comparison Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Column 1: Original Client Brief */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#22221F]/15 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#22221F]/10">
              <span className="font-serif font-medium text-base text-[#22221F]">
                1. Original Client Brief
              </span>
              <span className="text-[10px] font-mono text-[#39483B] bg-[#E9E0D2] px-2 py-0.5">
                BASELINE
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans text-[#22221F]/80">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block">Project Title</span>
                <span className="font-medium text-[#22221F]">{brief.projectTitle || proposal.title}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block">Client & Discipline</span>
                <span>{brief.clientName || proposal.clientName} ({brief.projectCategory || proposal.category})</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block">Stated Requirements</span>
                <p className="p-3 bg-[#F5F0E7]/40 border border-[#22221F]/10 leading-relaxed text-[#22221F]/75 max-h-48 overflow-y-auto">
                  {brief.requirements || proposal.clientNeedsUnderstanding}
                </p>
              </div>

              {brief.goals && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block">Target Goals</span>
                  <p className="text-[11px] text-[#22221F]/70">{brief.goals}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#22221F]/10 font-mono text-[11px]">
                <span>Budget: {brief.budget || proposal.budgetEstimate || 'Fixed rate'}</span>
                <span>Timeline: {brief.deadline || proposal.timelineEstimate}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#22221F]/10 text-[10px] font-mono text-[#22221F]/50 mt-6">
            Source: Initial Brief Specification
          </div>
        </div>

        {/* Column 2: Original Agreed Scope & Proposal */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#22221F]/15 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#22221F]/10">
              <span className="font-serif font-medium text-base text-[#22221F]">
                2. Agreed Statement of Work
              </span>
              <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 px-2 py-0.5">
                SAVED PROPOSAL
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans text-[#22221F]/80">
              <div className="flex items-center justify-between text-xs font-mono bg-[#F5F0E7]/60 p-2.5 border border-[#22221F]/10">
                <span>{comparison.originalAgreedScope.deliverablesCount} Total Deliverables</span>
                <span>{comparison.originalAgreedScope.milestonesCount} Milestones</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block mb-1">Agreed Deliverables</span>
                <ul className="space-y-1.5 p-3 bg-[#F5F0E7]/40 border border-[#22221F]/10 text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  {proposal.deliverables.flatMap((d) => d.items).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#39483B] shrink-0 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block mb-1">Protected Exclusions</span>
                <ul className="space-y-1 text-[11px] text-[#22221F]/60">
                  {proposal.scopeExclusions.slice(0, 3).map((ex, idx) => (
                    <li key={idx}>✕ {ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#22221F]/10 text-[10px] font-mono text-[#22221F]/50 mt-6">
            Commitment: {proposal.timelineEstimate} ({proposal.budgetEstimate || 'Contractual fee'})
          </div>
        </div>

        {/* Column 3: New Client Request */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border-2 border-[#39483B]/30 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22221F]/10">
              <span className="font-serif font-medium text-base text-[#22221F]">
                3. New Client Request
              </span>
              <VoiceInputButton
                fieldLabel="Time Machine Client Request"
                onAcceptTranscript={(text, mode) => {
                  setNewRequestInput((prev) => (mode === 'append' && prev.trim() ? `${prev}\n${text}` : text));
                }}
              />
            </div>

            {/* Quick Sample Selector */}
            <div>
              <span className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1.5">
                Quick-Load Scenario Request:
              </span>
              <div className="flex flex-wrap gap-1">
                {sampleRequests.map((req, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(req.text)}
                    className="text-[10px] px-2 py-1 bg-[#F5F0E7] hover:bg-[#E9E0D2] border border-[#22221F]/15 text-[#22221F] cursor-pointer"
                  >
                    {req.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Request Textarea */}
            <div>
              <label htmlFor="tm-request" className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Incoming Client Message / Email / Note:
              </label>
              <textarea
                id="tm-request"
                rows={5}
                value={newRequestInput}
                onChange={(e) => setNewRequestInput(e.target.value)}
                placeholder="Paste incoming client email, Slack message, or dictate via microphone..."
                className="w-full p-3 bg-[#F5F0E7]/30 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B] leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleRunComparison}
              className="w-full py-2.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer font-medium"
            >
              ⚡ Re-run Comparison
            </button>
          </div>

          <div className="pt-4 border-t border-[#22221F]/10 text-[10px] font-mono text-[#39483B] mt-4 flex items-center justify-between">
            <span>LIVE COMPARISON ACTIVE</span>
            <span>{comparison.changes.length} Variations</span>
          </div>
        </div>
      </div>

      {/* Comparison Analysis Results */}
      <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22221F]/10 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39483B]" />
              <h3 className="font-serif text-2xl font-medium text-[#22221F]">
                Scope Variation Findings ({comparison.changes.length})
              </h3>
            </div>
            <p className="text-xs text-[#22221F]/70 font-sans">
              {comparison.executiveSummary}
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#E9E0D2] px-2 py-0.5 text-[#39483B]">
            Automated Impact Assessment
          </span>
        </div>

        {/* Change Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparison.changes.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className="p-5 bg-[#F5F0E7]/30 border border-[#22221F]/15 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 font-semibold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#39483B]">
                      Effort: {item.estimatedEffortImpact}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-medium text-[#22221F] mb-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#22221F]/80 font-sans leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Why it matters */}
                  <div className="p-3 bg-[#FFFFFF] border border-[#22221F]/10 text-xs space-y-1 mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#39483B] font-semibold block">
                      Why This Matters:
                    </span>
                    <p className="text-[#22221F]/75 font-sans leading-relaxed">
                      {item.whyItMatters}
                    </p>
                  </div>

                  {/* Affected Deliverables & Milestones */}
                  <div className="space-y-1.5 text-[11px] font-mono text-[#22221F]/70">
                    <div>
                      <strong className="text-[#22221F]">Affected Deliverables:</strong>{' '}
                      {item.affectedDeliverables.join(', ')}
                    </div>
                    <div>
                      <strong className="text-[#22221F]">Affected Milestones:</strong>{' '}
                      {item.affectedMilestones.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#22221F]/10 text-[10px] font-mono text-[#39483B]">
                  Acceptance Impact: {item.acceptanceCriteriaImpact}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section: Professional Client Response Generator */}
        <div className="pt-6 border-t border-[#22221F]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-serif text-xl font-medium text-[#22221F]">
                Recommended Client Response
              </h4>
              <p className="text-xs text-[#22221F]/65 font-sans">
                Review and edit the suggested response. You retain the final choice on whether to absorb, swap, or schedule as Phase 2.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyResponse}
                className="px-4 py-2 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer font-medium"
              >
                {copiedResponse ? '✓ Copied Response!' : 'Copy Response'}
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            value={editedResponse}
            onChange={(e) => setEditedResponse(e.target.value)}
            className="w-full p-4 bg-[#F5F0E7]/40 border border-[#22221F]/20 text-xs font-sans text-[#22221F] focus:outline-none focus:border-[#39483B] leading-relaxed"
          />

          {/* Freelancer Internal Notes */}
          <div>
            <label htmlFor="fl-notes" className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
              Private Freelancer Decision Notes (Stored locally):
            </label>
            <input
              id="fl-notes"
              type="text"
              value={freelancerNotes}
              onChange={(e) => setFreelancerNotes(e.target.value)}
              placeholder="e.g. Willing to swap the secondary contact form for this if client confirms by Wednesday..."
              className="w-full px-3 py-2 bg-[#F5F0E7]/20 border border-[#22221F]/15 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
