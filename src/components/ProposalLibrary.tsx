import React, { useState } from 'react';
import { ProposalData } from '../types/proposal';
import { BotanicalDivider, LaurelCrest } from './Ornaments';
import { copyToClipboard, downloadTextFile, formatProposalMarkdown } from '../utils/export';

interface ProposalLibraryProps {
  proposals: ProposalData[];
  onOpenProposal: (proposal: ProposalData) => void;
  onDeleteProposal: (id: string) => void;
  onCreateNew: () => void;
}

export const ProposalLibrary: React.FC<ProposalLibraryProps> = ({
  proposals,
  onOpenProposal,
  onDeleteProposal,
  onCreateNew,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopy = async (p: ProposalData, e: React.MouseEvent) => {
    e.stopPropagation();
    const md = formatProposalMarkdown(p);
    const ok = await copyToClipboard(md);
    if (ok) {
      setCopyFeedback(`Copied "${p.title}" to clipboard`);
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  const handleExport = (p: ProposalData, e: React.MouseEvent) => {
    e.stopPropagation();
    const md = formatProposalMarkdown(p);
    const filename = `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    downloadTextFile(filename, md);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Toast */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#39483B] text-[#F5F0E7] text-xs px-4 py-2.5 shadow-xl font-medium border border-[#A6AD99]/30 transition-all">
          {copyFeedback}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#22221F]/15 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#39483B] block mb-1">
            Studio Archives
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#22221F]">
            My Saved Proposals
          </h1>
          <p className="text-xs text-[#22221F]/60 mt-1 font-sans">
            Drafts saved in your current browser local storage · No external cloud synchronization
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="py-3 px-6 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          + Create New Proposal
        </button>
      </div>

      {/* Empty State */}
      {proposals.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <LaurelCrest className="w-14 h-14 text-[#22221F]/30 mx-auto mb-6" label="EMPTY" year="ARCHIVE" />
          <h3 className="font-serif text-2xl font-medium text-[#22221F] mb-2">
            No drafts saved yet
          </h3>
          <p className="text-sm text-[#22221F]/65 leading-relaxed mb-6">
            Proposals you save from the editor will appear here in your browser storage for ongoing refinement and export.
          </p>
          <button
            onClick={onCreateNew}
            className="py-3 px-6 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            Draft Your First Proposal
          </button>
          <BotanicalDivider className="mt-12" />
        </div>
      ) : (
        /* Proposals Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenProposal(p)}
              className="bg-[#FFFFFF] border border-[#22221F]/15 hover:border-[#39483B]/50 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="flex items-center justify-between text-[11px] text-[#22221F]/60 font-mono mb-3">
                  <span>{p.category}</span>
                  <span>{new Date(p.updatedAt || p.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="font-serif text-xl font-medium text-[#22221F] group-hover:text-[#39483B] transition-colors leading-snug mb-2">
                  {p.title}
                </h3>

                <div className="text-xs text-[#22221F]/70 font-sans mb-4">
                  Client: <strong className="font-medium text-[#22221F]">{p.clientName}</strong>
                </div>

                <p className="text-xs text-[#22221F]/60 line-clamp-3 leading-relaxed mb-6">
                  {p.executiveSummary}
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-[#22221F]/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#39483B]">
                    {p.modelMetadata.isDemoSynthesis ? 'Demo Studio' : p.modelMetadata.provider}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleCopy(p, e)}
                      className="text-[#22221F]/60 hover:text-[#22221F] font-mono text-[11px] underline underline-offset-2"
                      title="Copy Markdown to clipboard"
                    >
                      Copy
                    </button>
                    <button
                      onClick={(e) => handleExport(p, e)}
                      className="text-[#22221F]/60 hover:text-[#22221F] font-mono text-[11px] underline underline-offset-2"
                      title="Export as markdown file"
                    >
                      Export
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(p.id);
                      }}
                      className="text-amber-800/70 hover:text-amber-900 font-mono text-[11px] underline underline-offset-2"
                      title="Delete draft"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-[#22221F]/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-2xl font-medium text-[#22221F] mb-2">
              Delete this proposal?
            </h3>
            <p className="text-xs text-[#22221F]/70 leading-relaxed mb-6">
              This will remove this draft from your browser's local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#22221F]/70 hover:text-[#22221F]"
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
