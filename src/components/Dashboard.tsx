import React, { useState } from 'react';
import { ProposalData, ProjectBrief } from '../types/proposal';
import { SAMPLE_PROJECTS } from '../data/sampleBriefs';
import { BotanicalDivider, LaurelCrest } from './Ornaments';

interface DashboardProps {
  proposals: ProposalData[];
  onOpenProposal: (proposal: ProposalData) => void;
  onDuplicateProposal: (proposal: ProposalData) => void;
  onRenameProposal: (id: string, newTitle: string) => void;
  onDeleteProposal: (id: string) => void;
  onCreateNew: () => void;
  onLoadSample: (brief: ProjectBrief, defaultProposal?: ProposalData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  proposals,
  onOpenProposal,
  onDuplicateProposal,
  onRenameProposal,
  onDeleteProposal,
  onCreateNew,
  onLoadSample,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; currentTitle: string } | null>(null);
  const [newTitleInput, setNewTitleInput] = useState('');

  // Sample Demonstration Library filtering
  const [sampleCategoryFilter, setSampleCategoryFilter] = useState<string>('All');
  const [sampleSearchQuery, setSampleSearchQuery] = useState<string>('');

  const filteredSampleProjects = SAMPLE_PROJECTS.filter((sample) => {
    // Category match
    const matchesCategory =
      sampleCategoryFilter === 'All'
        ? true
        : sampleCategoryFilter === 'Operations & Marketing'
        ? sample.category === 'Marketing' || sample.category === 'Business Operations' || sample.category === 'Content Writing'
        : sample.category === sampleCategoryFilter;

    // Search query match
    const q = sampleSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      sample.label.toLowerCase().includes(q) ||
      sample.shortDesc.toLowerCase().includes(q) ||
      sample.category.toLowerCase().includes(q) ||
      (sample.highlightFeature && sample.highlightFeature.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const handleOpenRename = (p: ProposalData, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameTarget({ id: p.id, currentTitle: p.title });
    setNewTitleInput(p.title);
  };

  const handleSaveRename = () => {
    if (renameTarget && newTitleInput.trim()) {
      onRenameProposal(renameTarget.id, newTitleInput.trim());
      setRenameTarget(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready for Review':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Exported':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'Needs Clarification':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-[#E9E0D2] text-[#39483B] border-[#22221F]/15';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-[#22221F]/15 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#39483B] block mb-1">
            Freelancer Workspace Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#22221F] tracking-tight mb-2">
            Your studio, at a glance.
          </h1>
          <p className="text-sm sm:text-base text-[#22221F]/70 font-sans max-w-2xl leading-relaxed">
            Keep your briefs, proposals, and project scopes organized in one place. All drafts remain saved locally in this browser session.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={onCreateNew}
            className="py-3 px-6 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            + Create New Proposal
          </button>
        </div>
      </div>

      {/* Interactive Sample Project Quick-Launch Section */}
      <div className="p-6 sm:p-8 bg-[#FFFFFF] border border-[#22221F]/15 mb-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#22221F]/10 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#9B846C]" />
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#22221F]">
                Interactive Demonstration Library
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-[#E9E0D2] text-[#39483B] font-medium">
                {SAMPLE_PROJECTS.length} Scenarios
              </span>
            </div>
            <p className="text-xs text-[#22221F]/65 font-sans">
              Curated fictional client briefs and verified proposals designed to test proposal generation, Smart Gap detection, and Scope-Creep Sentinel.
            </p>
          </div>
          <span className="text-xs text-[#22221F]/50 font-mono shrink-0">
            Fully editable in workspace
          </span>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'All', label: `All (${SAMPLE_PROJECTS.length})` },
              { id: 'Web Development', label: 'Web Dev (5)' },
              { id: 'UI/UX Design', label: 'UI/UX (1)' },
              { id: 'Branding', label: 'Branding (2)' },
              { id: 'SaaS and Software', label: 'SaaS (2)' },
              { id: 'Operations & Marketing', label: 'Ops & Marketing (3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSampleCategoryFilter(tab.id)}
                className={`text-[11px] px-3 py-1 font-mono transition-colors cursor-pointer border ${
                  sampleCategoryFilter === tab.id
                    ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B] font-medium'
                    : 'bg-[#F5F0E7] text-[#22221F]/70 border-[#22221F]/15 hover:border-[#22221F]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search sample scenarios..."
              value={sampleSearchQuery}
              onChange={(e) => setSampleSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#F5F0E7]/40 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B]"
            />
          </div>
        </div>

        {/* Demonstration Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSampleProjects.map((sample, idx) => (
            <div
              key={sample.id}
              className="p-5 bg-[#F5F0E7]/40 border border-[#22221F]/12 hover:border-[#39483B]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#22221F]/70 mb-2">
                  <span className="font-semibold text-[#39483B]">SAMPLE 0{idx + 1}</span>
                  <span className="bg-[#E9E0D2] px-2 py-0.5 text-[#22221F]/80 font-medium">{sample.category}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span
                    className={`text-[11px] uppercase font-mono px-2 py-0.5 font-semibold border ${
                      sample.completeness === 'Complete & Detailed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : sample.completeness === 'Vague / Short'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : sample.completeness === 'Missing Budget & Timeline'
                        ? 'bg-purple-50 text-purple-900 border-purple-200'
                        : 'bg-rose-50 text-rose-900 border-rose-200'
                    }`}
                  >
                    {sample.completeness}
                  </span>
                  <span className="text-[11px] font-mono text-[#22221F]/60 font-medium">
                    {sample.complexity} Complexity
                  </span>
                </div>

                <h4 className="font-serif text-lg font-medium text-[#22221F] mb-1.5 leading-snug">
                  {sample.label}
                </h4>

                <p className="text-[13px] text-[#22221F]/75 font-sans leading-relaxed mb-3">
                  {sample.shortDesc}
                </p>

                {sample.highlightFeature && (
                  <div className="text-xs font-mono text-[#39483B] mb-4 flex items-center gap-1 font-medium">
                    <span className="opacity-60">✦</span>
                    <span className="line-clamp-1">{sample.highlightFeature}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#22221F]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onLoadSample(sample.brief)}
                  className="text-xs sm:text-[13px] font-mono text-[#39483B] hover:text-[#22221F] font-semibold underline underline-offset-2 cursor-pointer text-left"
                  title="Populate brief in intake form to edit and generate"
                >
                  Try Brief (Edit) →
                </button>
                <button
                  type="button"
                  onClick={() => onLoadSample(sample.brief, sample.defaultProposal)}
                  className="text-xs sm:text-[13px] font-mono text-[#22221F]/70 hover:text-[#22221F] font-medium underline underline-offset-2 cursor-pointer text-left"
                  title="Directly load complete proposal, milestones, and scope map"
                >
                  Full Proposal & Map →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSampleProjects.length === 0 && (
          <div className="py-8 text-center text-xs text-[#22221F]/60 font-mono">
            No sample projects match "{sampleSearchQuery}". Try clearing search.
          </div>
        )}
      </div>

      {/* Stored Proposals Grid or Empty State */}
      {proposals.length === 0 ? (
        <div className="py-20 text-center max-w-lg mx-auto bg-[#FFFFFF] border border-[#22221F]/10 p-10">
          <LaurelCrest className="w-14 h-14 text-[#22221F]/25 mx-auto mb-6" label="STUDIO" year="2026" />
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#22221F] mb-3">
            Your next project starts here.
          </h2>
          <p className="text-xs sm:text-sm text-[#22221F]/65 leading-relaxed mb-6">
            You don't have any saved proposals yet. Choose a sample project above to explore the workflow, or start from a raw client brief.
          </p>
          <button
            onClick={onCreateNew}
            className="py-3 px-8 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            Create Your First Proposal
          </button>
          <BotanicalDivider className="mt-8" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#22221F]/60">
            <span>SAVED PROJECTS ({proposals.length})</span>
            <span>SORTED BY RECENTLY EDITED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((p) => (
              <div
                key={p.id}
                onClick={() => onOpenProposal(p)}
                className="bg-[#FFFFFF] border border-[#22221F]/15 hover:border-[#39483B]/50 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top Status & Date Row */}
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-3 gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 text-xs uppercase font-semibold border ${getStatusColor(p.status)}`}>
                        {p.status || 'Proposal Draft'}
                      </span>
                      {p.tone && (
                        <span className="px-2 py-0.5 text-[11px] font-mono border border-[#22221F]/15 bg-[#F5F0E7] text-[#39483B] font-medium">
                          {p.tone}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#22221F]/60">
                      {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#22221F] group-hover:text-[#39483B] transition-colors leading-snug mb-2">
                    {p.title}
                  </h3>

                  <div className="text-[13px] sm:text-sm text-[#22221F]/75 font-sans mb-3">
                    Client: <strong className="font-semibold text-[#22221F]">{p.clientName}</strong>
                    <span className="mx-2 opacity-40">·</span>
                    <span>{p.category}</span>
                  </div>

                  <p className="text-[13px] text-[#22221F]/70 line-clamp-3 leading-relaxed mb-6 font-sans">
                    {p.executiveSummary || p.clientNeedsUnderstanding}
                  </p>
                </div>

                {/* Card Actions Ribbon */}
                <div className="pt-4 border-t border-[#22221F]/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-xs text-[#39483B] font-semibold">
                    {p.milestones?.length || 0} Milestones
                  </span>

                  <div className="flex items-center gap-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenProposal(p)}
                      className="text-[#39483B] hover:text-[#22221F] font-mono text-xs sm:text-[13px] font-semibold underline underline-offset-2 cursor-pointer"
                      title="Continue editing proposal"
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => handleOpenRename(p, e)}
                      className="text-[#22221F]/70 hover:text-[#22221F] font-mono text-xs sm:text-[13px] underline underline-offset-2 cursor-pointer"
                      title="Rename proposal title"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => onDuplicateProposal(p)}
                      className="text-[#22221F]/70 hover:text-[#22221F] font-mono text-xs sm:text-[13px] underline underline-offset-2 cursor-pointer"
                      title="Duplicate project"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="text-amber-800/80 hover:text-amber-900 font-mono text-xs sm:text-[13px] font-medium underline underline-offset-2 cursor-pointer"
                      title="Delete project"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 bg-[#22221F]/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-medium text-[#22221F]">
              Rename Project
            </h3>
            <p className="text-xs text-[#22221F]/70">
              Update the project title for this proposal:
            </p>
            <input
              type="text"
              value={newTitleInput}
              onChange={(e) => setNewTitleInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F5F0E7]/40 border border-[#22221F]/20 text-sm text-[#22221F] focus:outline-none focus:border-[#39483B]"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRenameTarget(null)}
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#22221F]/70"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRename}
                className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-[#39483B] text-[#F5F0E7]"
              >
                Save Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-[#22221F]/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-medium text-[#22221F]">
              Delete this proposal?
            </h3>
            <p className="text-xs text-[#22221F]/70 leading-relaxed">
              This will remove this draft from your browser's local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#22221F]/70"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProposal(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-amber-900 text-[#F5F0E7] hover:bg-amber-950"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
