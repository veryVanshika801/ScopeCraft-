import React from 'react';
import { BotanicalDivider, LaurelCrest } from './Ornaments';
import craftImg from '../assets/images/editorial_craft_archival_1791898196404.jpg';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#22221F]/70 backdrop-blur-xs flex items-center justify-center p-6 selection:bg-[#39483B] selection:text-[#F5F0E7]">
      <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 sm:p-10 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#22221F]/15">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#39483B] block">
              Editorial Studio Monograph
            </span>
            <h2 className="font-serif text-3xl font-medium text-[#22221F]">
              How ScopeCraft Works
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-[#22221F]/40 hover:text-[#22221F] p-1 leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Featured Editorial Still */}
        <div className="relative aspect-[16/7] overflow-hidden bg-[#39483B]/10 mb-8 border border-[#22221F]/10">
          <img
            src={craftImg}
            alt="Crafted architectural notebook with fountain pen on stone table"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale-[10%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#22221F]/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-[#F5F0E7] flex items-center justify-between">
            <span className="font-serif italic text-sm">
              "Clarity is the greatest courtesy you can offer a client."
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#A6AD99]">
              STUDIO SERIES I
            </span>
          </div>
        </div>

        {/* 4 Chapters */}
        <div className="space-y-6 text-sm text-[#22221F]/80 leading-relaxed font-sans">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#39483B] font-semibold">01.</span>
              <h4 className="font-serif text-lg font-medium text-[#22221F]">
                Start from Raw Requirements
              </h4>
            </div>
            <p className="text-xs text-[#22221F]/70">
              Clients rarely send tidy specifications. They send stream-of-consciousness emails, bullet points, or hasty meeting recordings. ScopeCraft extracts key objectives, dependencies, and implicit expectations.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#39483B] font-semibold">02.</span>
              <h4 className="font-serif text-lg font-medium text-[#22221F]">
                Defend Your Margin with Exclusions
              </h4>
            </div>
            <p className="text-xs text-[#22221F]/70">
              Freelancers lose profitability not from initial estimates, but from unstated boundaries. ScopeCraft explicitly articulates Out-of-Scope Exclusions (such as paid licenses, unlimited revision loops, or 3rd party maintenance) right alongside your deliverables.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#39483B] font-semibold">03.</span>
              <h4 className="font-serif text-lg font-medium text-[#22221F]">
                Phased Milestones with Feedback Gates
              </h4>
            </div>
            <p className="text-xs text-[#22221F]/70">
              Transform single nebulous deadlines into staged review gates (Discovery → Build → Release). Each milestone binds deliverables to explicit client sign-off intervals.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#39483B] font-semibold">04.</span>
              <h4 className="font-serif text-lg font-medium text-[#22221F]">
                Open-Weight AI Craftsmanship
              </h4>
            </div>
            <p className="text-xs text-[#22221F]/70">
              Your proposals are structured via open-weight foundation models (Meta Llama 3.3 70B, Mistral, Qwen). The model acts as an architectural copilot, leaving you in complete editorial command.
            </p>
          </div>
        </div>

        <BotanicalDivider className="my-6" />

        <div className="flex items-center justify-between">
          <LaurelCrest className="w-10 h-10 text-[#39483B]" label="STUDIO" year="2026" />
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
