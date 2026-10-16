import React, { useState } from 'react';
import { ProposalData, ScopeMapItem } from '../types/proposal';

interface LivingScopeMapProps {
  proposal: ProposalData;
  onUpdateProposal: (updated: ProposalData) => void;
}

export const LivingScopeMap: React.FC<LivingScopeMapProps> = ({ proposal, onUpdateProposal }) => {
  const [activeTab, setActiveTab] = useState<'network' | 'matrix'>('network');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filterMilestone, setFilterMilestone] = useState<string>('all');
  const [editingField, setEditingField] = useState<string | null>(null);

  // Derive or initialize scope items
  const scopeItems: ScopeMapItem[] =
    proposal.scopeMap && proposal.scopeMap.length > 0
      ? proposal.scopeMap
      : [
          {
            id: 'map-auto-1',
            requirement: proposal.clientNeedsUnderstanding.slice(0, 110) || 'Core client requirement',
            deliverable: proposal.deliverables[0]?.items[0] || 'Core Deliverable Artifact',
            milestone: proposal.milestones[0]?.title || 'Milestone 1: Foundations',
            acceptanceCriteria: proposal.acceptanceCriteria[0] || 'Meets design and technical brief',
            outcome: 'Target operational outcome aligned with goals',
            status: 'defined',
            isInferred: true,
          },
          {
            id: 'map-auto-2',
            requirement: 'Responsive mobile interface & frictionless workflow',
            deliverable: proposal.deliverables[0]?.items[1] || 'Responsive Layout Templates',
            milestone: proposal.milestones[1]?.title || proposal.milestones[0]?.title || 'Milestone 2: Execution',
            acceptanceCriteria: proposal.acceptanceCriteria[1] || 'Passes cross-device QA validation',
            outcome: 'Boost mobile conversions and eliminate user friction',
            status: 'verified',
            isInferred: false,
          },
        ];

  const updateScopeItems = (newItems: ScopeMapItem[]) => {
    onUpdateProposal({
      ...proposal,
      scopeMap: newItems,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleStatusChange = (id: string, status: 'defined' | 'in_review' | 'verified') => {
    const updated = scopeItems.map((item) => (item.id === id ? { ...item, status } : item));
    updateScopeItems(updated);
  };

  const handleFieldChange = (id: string, field: keyof ScopeMapItem, value: any) => {
    const updated = scopeItems.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    updateScopeItems(updated);
  };

  const handleConfirmLink = (id: string) => {
    handleFieldChange(id, 'isInferred', false);
  };

  const handleAddNewRow = () => {
    const newItem: ScopeMapItem = {
      id: `map-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      requirement: 'New client requirement or capability',
      deliverable: proposal.deliverables[0]?.items[0] || 'Key Deliverable Specification',
      milestone: proposal.milestones[0]?.title || 'Milestone 1',
      acceptanceCriteria: 'Demonstrated test criteria in staging review',
      outcome: 'Measurable outcome for client business',
      status: 'defined',
      isInferred: false,
    };
    const updated = [...scopeItems, newItem];
    updateScopeItems(updated);
    setSelectedItemId(newItem.id);
  };

  const handleDeleteRow = (id: string) => {
    const updated = scopeItems.filter((i) => i.id !== id);
    updateScopeItems(updated);
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const filteredItems =
    filterMilestone === 'all'
      ? scopeItems
      : scopeItems.filter((i) => i.milestone.toLowerCase().includes(filterMilestone.toLowerCase()));

  const uniqueMilestones = Array.from(new Set(scopeItems.map((i) => i.milestone)));

  const selectedItem = scopeItems.find((i) => i.id === selectedItemId);

  // Traceability diagnostics
  const totalNodes = scopeItems.length;
  const verifiedNodes = scopeItems.filter((i) => i.status === 'verified').length;
  const inferredNodes = scopeItems.filter((i) => i.isInferred).length;
  const incompleteCriteria = scopeItems.filter((i) => !i.acceptanceCriteria || i.acceptanceCriteria.length < 5).length;

  return (
    <div className="bg-[#FFFFFF] border border-[#22221F]/15 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22221F]/10 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#39483B] mb-1">
            <span>Living Project Scope Map</span>
            <span aria-hidden="true">·</span>
            <span>Clickable Traceability Network</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#22221F]">
            Requirement → Deliverable → Milestone → Acceptance Criteria
          </h3>
          <p className="text-xs sm:text-sm text-[#22221F]/65 font-sans mt-1">
            Click any node below to inspect connected downstream deliverables, verify link health, and edit specifications in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center border border-[#22221F]/20 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('network')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'network' ? 'bg-[#39483B] text-[#F5F0E7]' : 'hover:bg-[#E9E0D2]'
              }`}
            >
              Network View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'matrix' ? 'bg-[#39483B] text-[#F5F0E7]' : 'hover:bg-[#E9E0D2]'
              }`}
            >
              Matrix Table
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddNewRow}
            className="px-4 py-2 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            + Add Scope Node
          </button>
        </div>
      </div>

      {/* Traceability Telemetry Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-[#F5F0E7]/60 p-4 border border-[#22221F]/10">
        <div>
          <span className="text-[10px] uppercase text-[#22221F]/50 block">Mapped Nodes</span>
          <span className="font-serif text-lg font-bold text-[#22221F]">{totalNodes} Total</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-[#22221F]/50 block">Verified Health</span>
          <span className="font-serif text-lg font-bold text-emerald-800">{verifiedNodes} / {totalNodes}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-[#22221F]/50 block">AI Inferred Links</span>
          <span className="font-serif text-lg font-bold text-amber-800">{inferredNodes} Suggested</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-[#22221F]/50 block">Missing Criteria</span>
          <span className="font-serif text-lg font-bold text-[#22221F]">
            {incompleteCriteria === 0 ? '✓ 100% Covered' : `${incompleteCriteria} Uncovered`}
          </span>
        </div>
      </div>

      {/* Filter Milestone Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-[#22221F]/60 text-[11px] uppercase mr-2">Filter Milestone:</span>
        <button
          type="button"
          onClick={() => setFilterMilestone('all')}
          className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer border ${
            filterMilestone === 'all'
              ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B]'
              : 'bg-[#F5F0E7]/60 text-[#22221F] border-[#22221F]/15 hover:bg-[#E9E0D2]'
          }`}
        >
          All Milestones ({scopeItems.length})
        </button>
        {uniqueMilestones.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setFilterMilestone(m)}
            className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer border truncate max-w-[200px] ${
              filterMilestone === m
                ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B]'
                : 'bg-[#F5F0E7]/60 text-[#22221F] border-[#22221F]/15 hover:bg-[#E9E0D2]'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Network View Mode */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b border-[#22221F]/10 text-xs font-mono uppercase tracking-wider text-[#39483B]">
            <div>01. Requirement</div>
            <div>02. Deliverable</div>
            <div>03. Milestone</div>
            <div>04. Acceptance Criteria</div>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item, idx) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                  className={`p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E9E0D2]/90 border-[#39483B] shadow-md ring-1 ring-[#39483B]'
                      : 'bg-[#F5F0E7]/40 hover:bg-[#F5F0E7] border-[#22221F]/15 hover:border-[#39483B]/40'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
                    {/* Requirement Node */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#22221F]/50">
                        <span>REQ {idx + 1}</span>
                        {item.isInferred && (
                          <span className="bg-amber-100 text-amber-900 px-1 py-0.2 border border-amber-300">
                            AI Inferred
                          </span>
                        )}
                      </div>
                      <p className="font-serif text-sm font-medium text-[#22221F] leading-snug">
                        {item.requirement}
                      </p>
                    </div>

                    {/* Deliverable Node */}
                    <div className="space-y-1 md:border-l md:border-[#22221F]/10 md:pl-4">
                      <span className="font-mono text-[10px] uppercase text-[#39483B] block">
                        Deliverable
                      </span>
                      <p className="font-sans text-xs text-[#22221F]/80">
                        {item.deliverable}
                      </p>
                    </div>

                    {/* Milestone Node */}
                    <div className="space-y-1 md:border-l md:border-[#22221F]/10 md:pl-4">
                      <span className="font-mono text-[10px] uppercase text-[#22221F]/50 block">
                        Scheduled
                      </span>
                      <p className="font-mono text-xs text-[#22221F] truncate">
                        {item.milestone}
                      </p>
                    </div>

                    {/* Acceptance Criteria & Status */}
                    <div className="space-y-1.5 md:border-l md:border-[#22221F]/10 md:pl-4 flex flex-col justify-between">
                      <p className="font-sans text-[11px] text-[#22221F]/70 italic line-clamp-2">
                        ✓ {item.acceptanceCriteria}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span
                          className={`px-2 py-0.5 uppercase font-semibold border ${
                            item.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : item.status === 'in_review'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[#39483B] underline underline-offset-2">
                          {isSelected ? 'Close Inspector' : 'Inspect Details →'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabular Matrix View Mode */}
      {activeTab === 'matrix' && (
        <div className="overflow-x-auto border border-[#22221F]/15">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#E9E0D2] font-mono text-[11px] uppercase tracking-wider text-[#39483B] border-b border-[#22221F]/15">
                <th className="p-3">#</th>
                <th className="p-3">Requirement</th>
                <th className="p-3">Deliverable</th>
                <th className="p-3">Milestone</th>
                <th className="p-3">Acceptance Criteria</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22221F]/10 font-sans">
              {filteredItems.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`hover:bg-[#F5F0E7] transition-colors cursor-pointer ${
                    selectedItemId === item.id ? 'bg-[#E9E0D2]/50 font-medium' : ''
                  }`}
                >
                  <td className="p-3 font-mono text-[#22221F]/50">0{idx + 1}</td>
                  <td className="p-3 font-medium max-w-xs">{item.requirement}</td>
                  <td className="p-3 max-w-xs">{item.deliverable}</td>
                  <td className="p-3 font-mono text-[11px]">{item.milestone}</td>
                  <td className="p-3 italic text-[#22221F]/70 max-w-xs">{item.acceptanceCriteria}</td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 uppercase bg-[#E9E0D2] text-[#39483B]">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(item.id)}
                      className="text-amber-800 hover:text-amber-950 text-xs underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Node Inspector Drawer / Detail Panel */}
      {selectedItem && (
        <div className="bg-[#FFFFFF] border-2 border-[#39483B] p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#22221F]/15">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#39483B]">
                  Node Inspector & Traceability Editor
                </span>
                {selectedItem.isInferred ? (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300">
                    AI Inferred Link
                  </span>
                ) : (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Verified Connection
                  </span>
                )}
              </div>
              <h4 className="font-serif text-xl font-medium text-[#22221F] mt-1">
                {selectedItem.requirement}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              {selectedItem.isInferred && (
                <button
                  type="button"
                  onClick={() => handleConfirmLink(selectedItem.id)}
                  className="px-3 py-1.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ✓ Confirm Link
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedItemId(null)}
                className="text-2xl text-[#22221F]/40 hover:text-[#22221F] leading-none cursor-pointer"
                aria-label="Close inspector"
              >
                ×
              </button>
            </div>
          </div>

          {/* Connected Traceability Chain Diagram */}
          <div className="p-4 bg-[#F5F0E7]/60 border border-[#22221F]/15 text-xs font-mono space-y-2">
            <span className="text-[10px] uppercase text-[#39483B] font-semibold block">
              Active Traceability Path:
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[#22221F]">
              <span className="p-2 bg-[#FFFFFF] border border-[#22221F]/15 truncate">
                Req: {selectedItem.requirement.slice(0, 30)}...
              </span>
              <span className="text-[#39483B] font-bold">→</span>
              <span className="p-2 bg-[#FFFFFF] border border-[#22221F]/15 truncate">
                Deliverable: {selectedItem.deliverable}
              </span>
              <span className="text-[#39483B] font-bold">→</span>
              <span className="p-2 bg-[#FFFFFF] border border-[#22221F]/15 truncate">
                {selectedItem.milestone}
              </span>
              <span className="text-[#39483B] font-bold">→</span>
              <span className="p-2 bg-[#FFFFFF] border border-[#22221F]/15 truncate">
                Criteria: {selectedItem.acceptanceCriteria.slice(0, 30)}...
              </span>
            </div>
          </div>

          {/* Editable Node Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Requirement Statement:
              </label>
              <textarea
                rows={3}
                value={selectedItem.requirement}
                onChange={(e) => handleFieldChange(selectedItem.id, 'requirement', e.target.value)}
                className="w-full p-2.5 bg-[#F5F0E7]/30 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B]"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Mapped Deliverable Artifact:
              </label>
              <textarea
                rows={3}
                value={selectedItem.deliverable}
                onChange={(e) => handleFieldChange(selectedItem.id, 'deliverable', e.target.value)}
                className="w-full p-2.5 bg-[#F5F0E7]/30 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B]"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Milestone Assignment:
              </label>
              <select
                value={selectedItem.milestone}
                onChange={(e) => handleFieldChange(selectedItem.id, 'milestone', e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B]"
              >
                {proposal.milestones.map((m, idx) => (
                  <option key={idx} value={m.title}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Verification Status:
              </label>
              <div className="flex items-center gap-2 pt-1">
                {(['defined', 'in_review', 'verified'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedItem.id, st)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors cursor-pointer border ${
                      selectedItem.status === st
                        ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B] font-semibold'
                        : 'bg-[#F5F0E7] text-[#22221F] border-[#22221F]/15 hover:border-[#22221F]/40'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-[10px] uppercase text-[#22221F]/60 block mb-1">
                Acceptance Criteria & Test Benchmark:
              </label>
              <textarea
                rows={2}
                value={selectedItem.acceptanceCriteria}
                onChange={(e) => handleFieldChange(selectedItem.id, 'acceptanceCriteria', e.target.value)}
                className="w-full p-2.5 bg-[#F5F0E7]/30 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#22221F]/10 text-xs">
            <button
              type="button"
              onClick={() => handleDeleteRow(selectedItem.id)}
              className="text-amber-800 hover:text-amber-950 font-mono text-[11px] underline cursor-pointer"
            >
              Delete Node
            </button>
            <button
              type="button"
              onClick={() => setSelectedItemId(null)}
              className="px-5 py-2 bg-[#39483B] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider cursor-pointer font-medium"
            >
              Done Inspecting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
