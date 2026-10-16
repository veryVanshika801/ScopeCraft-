/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CinematicWelcome } from './components/CinematicWelcome';
import { Navigation } from './components/Navigation';
import { WorkspaceHero } from './components/WorkspaceHero';
import { BriefForm } from './components/BriefForm';
import { VoiceWorkflowGuide } from './components/VoiceWorkflowGuide';
import { GenerationScreen } from './components/GenerationScreen';
import { ProposalEditor } from './components/ProposalEditor';
import { Dashboard } from './components/Dashboard';
import { ModelSettingsModal } from './components/ModelSettingsModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { LegalModal } from './components/LegalModal';

import { ProjectBrief, ProposalData, UserSession } from './types/proposal';
import {
  clearSession,
  deleteProposalFromStorage,
  getStoredProposals,
  getStoredSession,
  saveProposalToStorage,
  saveSession,
} from './utils/storage';

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<'workspace' | 'proposals' | 'editor'>('workspace');
  const [currentProposal, setCurrentProposal] = useState<ProposalData | null>(null);
  const [savedProposals, setSavedProposals] = useState<ProposalData[]>([]);
  const [activeBrief, setActiveBrief] = useState<ProjectBrief | null>(null);

  // Undo deletion buffer
  const [lastDeletedProposal, setLastDeletedProposal] = useState<ProposalData | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCompleted, setGenerationCompleted] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Modals
  const [showModelModal, setShowModelModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalDefaultTab, setLegalDefaultTab] = useState<'privacy' | 'terms' | 'licenses'>('privacy');

  // Initial load from local storage
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUserSession(session);
    }
    const proposals = getStoredProposals();
    setSavedProposals(proposals);
  }, []);

  // Enter session handler
  const handleEnterSession = (session: UserSession) => {
    saveSession(session);
    setUserSession(session);
    setCurrentView('workspace');
  };

  // Sign out / switch session handler
  const handleSignOut = () => {
    clearSession();
    setUserSession(null);
    setCurrentProposal(null);
    setCurrentView('workspace');
  };

  // Select sample brief
  const handleSelectSample = (sample: ProjectBrief) => {
    setActiveBrief(sample);
    const formElement = document.getElementById('brief-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Direct sample project loader (loads both brief & default proposal into state)
  const handleLoadSampleProject = (brief: ProjectBrief, defaultProposal?: ProposalData) => {
    setActiveBrief(brief);
    if (defaultProposal) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setCurrentProposal(defaultProposal);
      saveProposalToStorage(defaultProposal);
      setSavedProposals(getStoredProposals());
      setCurrentView('editor');
    } else {
      setCurrentView('workspace');
      setTimeout(() => {
        const formElement = document.getElementById('brief-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Scroll to brief form
  const handleScrollToForm = () => {
    const formElement = document.getElementById('brief-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit brief to /api/generate
  const handleGenerateProposal = async (brief: ProjectBrief, instructions?: string) => {
    setActiveBrief(brief);
    setIsGenerating(true);
    setGenerationCompleted(false);
    setGenerationError(null);

    // Unfocus any active element (e.g. submit button) so browser doesn't preserve focus down page
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // Prevent browser auto-scroll restoration
    if ('scrollRestoration' in history) {
      try {
        history.scrollRestoration = 'manual';
      } catch {
        // ignore
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, instructions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate proposal from server.');
      }

      const generatedProposal: ProposalData = data.proposal;

      // Small pacing grace before transition
      setGenerationCompleted(true);
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        // Reset scroll position to top BEFORE mounting editor
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        setCurrentProposal(generatedProposal);
        saveProposalToStorage(generatedProposal);
        setSavedProposals(getStoredProposals());
        setIsGenerating(false);
        setCurrentView('editor');

        // Multi-stage post-render scroll check to guarantee position is at the title/opening
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;

          setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            const topEl = document.getElementById('sec-title') || document.getElementById('proposal-editor-top');
            if (topEl) {
              topEl.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
          }, 60);

          setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }, 200);
        });
      }, 700);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Generation error:', error);
      setIsGenerating(false);
      setGenerationError(
        error.message || 'We couldn’t complete that action. Your current draft is still available.'
      );
    }
  };

  // Update proposal in editor
  const handleUpdateProposal = (updated: ProposalData) => {
    setCurrentProposal(updated);
    saveProposalToStorage(updated);
    setSavedProposals(getStoredProposals());
  };

  // Open existing proposal from library
  const handleOpenProposal = (proposal: ProposalData) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setCurrentProposal(proposal);
    setCurrentView('editor');
  };

  // Duplicate proposal
  const handleDuplicateProposal = (proposal: ProposalData) => {
    const cloned: ProposalData = {
      ...proposal,
      id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${proposal.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Proposal Draft',
    };
    saveProposalToStorage(cloned);
    setSavedProposals(getStoredProposals());
  };

  // Rename proposal
  const handleRenameProposal = (id: string, newTitle: string) => {
    const target = savedProposals.find((p) => p.id === id);
    if (target) {
      const updated = { ...target, title: newTitle, updatedAt: new Date().toISOString() };
      saveProposalToStorage(updated);
      setSavedProposals(getStoredProposals());
      if (currentProposal?.id === id) {
        setCurrentProposal(updated);
      }
    }
  };

  // Delete proposal from library with undo buffer
  const handleDeleteProposal = (id: string) => {
    const target = savedProposals.find((p) => p.id === id);
    if (target) {
      setLastDeletedProposal(target);
      setShowUndoToast(true);
      setTimeout(() => setShowUndoToast(false), 5000);
    }
    deleteProposalFromStorage(id);
    setSavedProposals(getStoredProposals());
    if (currentProposal?.id === id) {
      setCurrentProposal(null);
    }
  };

  // Undo delete action
  const handleUndoDelete = () => {
    if (lastDeletedProposal) {
      saveProposalToStorage(lastDeletedProposal);
      setSavedProposals(getStoredProposals());
      setLastDeletedProposal(null);
      setShowUndoToast(false);
    }
  };

  // Clear all stored data
  const handleClearAllLocalData = () => {
    localStorage.removeItem('scopecraft_proposals_v1');
    setSavedProposals([]);
    setCurrentProposal(null);
  };

  // Start over
  const handleStartOver = () => {
    setCurrentProposal(null);
    setCurrentView('workspace');
  };

  // Open legal modal with specific tab
  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'licenses') => {
    setLegalDefaultTab(tab);
    setShowLegalModal(true);
  };

  // If user is not yet logged into the demo session, show Screen 1: Cinematic Welcome
  if (!userSession) {
    return <CinematicWelcome onEnter={handleEnterSession} />;
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#F5F0E7] text-[#22221F] selection:bg-[#39483B] selection:text-[#F5F0E7] bg-paper-grain flex flex-col justify-between">
      {/* Top Navigation */}
      <Navigation
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenModelModal={() => setShowModelModal(true)}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        userSession={userSession}
        onSignOut={handleSignOut}
        hasActiveProposal={Boolean(currentProposal)}
        onNewProposalClick={handleStartOver}
      />

      {/* Undo Delete Toast Notification */}
      {showUndoToast && lastDeletedProposal && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#22221F] text-[#F5F0E7] text-xs px-5 py-3 shadow-2xl border border-[#F5F0E7]/20 flex items-center gap-4 transition-all animate-in fade-in duration-300">
          <span>Deleted "{lastDeletedProposal.title}".</span>
          <button
            onClick={handleUndoDelete}
            className="text-[#A6AD99] hover:text-[#F5F0E7] font-mono uppercase underline underline-offset-2 cursor-pointer font-medium"
          >
            Undo Delete
          </button>
        </div>
      )}

      {/* Generation Screen Overlay */}
      {isGenerating && activeBrief && (
        <GenerationScreen
          projectTitle={activeBrief.projectTitle}
          clientName={activeBrief.clientName}
          isCompleted={generationCompleted}
        />
      )}

      {/* Main View Router */}
      <div className="flex-1">
        {/* Error Alert Banner if generation failed */}
        {generationError && (
          <div className="max-w-4xl mx-auto px-6 pt-6">
            <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between">
              <div>
                <strong>Inference Notice:</strong> {generationError}
              </div>
              <button
                onClick={() => setGenerationError(null)}
                className="text-amber-800 font-bold ml-4 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {currentView === 'workspace' && (
          <main>
            <WorkspaceHero
              userName={userSession.fullName}
              onSelectSample={handleSelectSample}
              onLoadSampleProject={handleLoadSampleProject}
              onScrollToForm={handleScrollToForm}
            />
            <div className="max-w-7xl mx-auto px-6 -mt-4 mb-8">
              <VoiceWorkflowGuide
                onStartVoiceIntake={handleScrollToForm}
                onScrollToForm={handleScrollToForm}
              />
            </div>
            <BriefForm
              initialBrief={activeBrief}
              onSubmit={(brief) => handleGenerateProposal(brief)}
              isLoading={isGenerating}
            />
          </main>
        )}

        {currentView === 'editor' && currentProposal && (
          <ProposalEditor
            proposal={currentProposal}
            onUpdateProposal={handleUpdateProposal}
            onRegenerate={(instructions) => {
              if (activeBrief) {
                handleGenerateProposal(activeBrief, instructions);
              } else {
                handleGenerateProposal(
                  {
                    projectTitle: currentProposal.title,
                    clientName: currentProposal.clientName,
                    projectCategory: currentProposal.category,
                    requirements: currentProposal.clientNeedsUnderstanding,
                    goals: currentProposal.proposedSolution,
                    tone: 'Premium',
                  },
                  instructions
                );
              }
            }}
            onStartOver={handleStartOver}
            onOpenModelModal={() => setShowModelModal(true)}
          />
        )}

        {currentView === 'proposals' && (
          <Dashboard
            proposals={savedProposals}
            onOpenProposal={handleOpenProposal}
            onDuplicateProposal={handleDuplicateProposal}
            onRenameProposal={handleRenameProposal}
            onDeleteProposal={handleDeleteProposal}
            onCreateNew={handleStartOver}
            onLoadSample={handleLoadSampleProject}
          />
        )}
      </div>

      {/* Editorial Footer with Governance Links */}
      <footer className="border-t border-[#22221F]/10 py-8 bg-[#F5F0E7] text-xs text-[#22221F]/60 no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-semibold text-[#22221F]">ScopeCraft</span>
            <span aria-hidden="true">·</span>
            <span>Cinematic AI Freelancer Proposal Studio</span>
            <span aria-hidden="true">·</span>
            <span>© {currentYear}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans">
            <button
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-[#22221F] underline underline-offset-2 cursor-pointer"
            >
              Privacy Information
            </button>
            <span aria-hidden="true" className="opacity-40">·</span>
            <button
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-[#22221F] underline underline-offset-2 cursor-pointer"
            >
              Terms & Limitations
            </button>
            <span aria-hidden="true" className="opacity-40">·</span>
            <button
              onClick={() => handleOpenLegal('licenses')}
              className="hover:text-[#22221F] underline underline-offset-2 cursor-pointer"
            >
              Open-Source Notices
            </button>
            <span aria-hidden="true" className="opacity-40">·</span>
            <button
              onClick={() => setShowModelModal(true)}
              className="hover:text-[#22221F] underline underline-offset-2 cursor-pointer"
            >
              Model Engine
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ModelSettingsModal isOpen={showModelModal} onClose={() => setShowModelModal(false)} />
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        defaultTab={legalDefaultTab}
        onClearAllLocalData={handleClearAllLocalData}
      />
    </div>
  );
}
