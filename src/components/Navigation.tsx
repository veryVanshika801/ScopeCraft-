import React from 'react';
import { UserSession } from '../types/proposal';

interface NavigationProps {
  currentView: 'workspace' | 'proposals' | 'editor';
  onNavigate: (view: 'workspace' | 'proposals') => void;
  onOpenModelModal: () => void;
  onOpenHowItWorks: () => void;
  userSession: UserSession | null;
  onSignOut: () => void;
  hasActiveProposal: boolean;
  onNewProposalClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  onOpenModelModal,
  onOpenHowItWorks,
  userSession,
  onSignOut,
  hasActiveProposal,
  onNewProposalClick,
}) => {
  const firstName = userSession?.fullName ? userSession.fullName.split(' ')[0] : 'Freelancer';

  return (
    <header className="sticky top-0 z-40 bg-[#F5F0E7]/95 backdrop-blur-sm border-b border-[#22221F]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('workspace')}
          className="text-2xl font-serif font-semibold tracking-tight text-[#22221F] hover:text-[#39483B] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39483B]"
        >
          ScopeCraft
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#22221F]/75">
          <button
            onClick={() => onNavigate('workspace')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#22221F] relative cursor-pointer ${
              currentView === 'workspace' ? 'text-[#22221F] font-semibold' : ''
            }`}
          >
            Workspace
            {currentView === 'workspace' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#39483B]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('proposals')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#22221F] relative cursor-pointer ${
              currentView === 'proposals' ? 'text-[#22221F] font-semibold' : ''
            }`}
          >
            My Proposals
            {currentView === 'proposals' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#39483B]" />
            )}
          </button>

          <button
            onClick={onOpenModelModal}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#22221F] hover:underline underline-offset-4 cursor-pointer"
          >
            Model Engine
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#22221F] hover:underline underline-offset-4 cursor-pointer"
          >
            How It Works
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-4 shrink-0">
          {currentView === 'editor' ? (
            <button
              onClick={onNewProposalClick}
              className="px-4.5 py-2.5 text-[13px] sm:text-sm font-semibold tracking-wider uppercase text-[#F5F0E7] bg-[#39483B] hover:bg-[#2e3a2f] rounded-none transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39483B] cursor-pointer"
            >
              New Brief
            </button>
          ) : hasActiveProposal ? (
            <button
              onClick={() => onNavigate('workspace')}
              className="px-4.5 py-2.5 text-[13px] sm:text-sm font-semibold tracking-wider uppercase text-[#F5F0E7] bg-[#22221F] hover:bg-[#39483B] rounded-none transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39483B] cursor-pointer"
            >
              Start Proposal
            </button>
          ) : (
            <button
              onClick={() => {
                const formEl = document.getElementById('brief-form');
                if (formEl) {
                  formEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate('workspace');
                }
              }}
              className="px-4.5 py-2.5 text-[13px] sm:text-sm font-semibold tracking-wider uppercase text-[#F5F0E7] bg-[#39483B] hover:bg-[#2e3a2f] rounded-none transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39483B] cursor-pointer"
            >
              Create Proposal
            </button>
          )}

          {/* User Profile switch action */}
          {userSession && (
            <button
              onClick={onSignOut}
              title={`Signed in as ${userSession.fullName} (${userSession.email}). Click to switch session.`}
              className="text-[13px] text-[#22221F]/70 hover:text-[#22221F] underline underline-offset-2 whitespace-nowrap shrink-0 hidden sm:inline-block cursor-pointer font-medium"
            >
              {firstName} · Switch
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
