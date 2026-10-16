import React from 'react';
import { LaurelCrest } from './Ornaments';
import { SAMPLE_PROJECTS } from '../data/sampleBriefs';
import { ProjectBrief, ProposalData } from '../types/proposal';
import landscapeImg from '../assets/images/documentary_landscape_mist_1791898197753.jpg';

interface WorkspaceHeroProps {
  userName: string;
  onSelectSample: (brief: ProjectBrief) => void;
  onLoadSampleProject?: (brief: ProjectBrief, defaultProposal?: ProposalData) => void;
  onScrollToForm: () => void;
}

export const WorkspaceHero: React.FC<WorkspaceHeroProps> = ({
  userName,
  onSelectSample,
  onLoadSampleProject,
  onScrollToForm,
}) => {
  const firstName = userName ? userName.split(' ')[0] : 'Freelancer';
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const categories = ['All', 'Web Development', 'UI/UX Design', 'Branding', 'SaaS and Software', 'Marketing & Operations'];

  const filteredSamples = SAMPLE_PROJECTS.filter((sample) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Marketing & Operations') {
      return sample.category === 'Marketing' || sample.category === 'Business Operations';
    }
    return sample.category === selectedCategory;
  });

  const displayedSamples = isExpanded ? filteredSamples : filteredSamples.slice(0, 3);

  return (
    <section className="relative pt-12 pb-16 border-b border-[#22221F]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Eyebrow row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#39483B] font-mono">
            <span>Welcome back, {firstName}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#22221F]/50">Editorial Studio</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#22221F]/60">
            <span className="font-serif italic">Open-Weight Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Llama 3.3 / Mistral / Qwen Ready</span>
          </div>
        </div>

        {/* Hero 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Editorial Headline & Copy */}
          <div className="lg:col-span-7">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#22221F] leading-[1.08] mb-6">
              Let's give your next project a{' '}
              <span className="italic font-normal text-[#39483B]">clear direction.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#22221F]/75 leading-relaxed max-w-xl mb-8">
              Share what your client needs. We'll help you shape it into a proposal worth
              presenting — with strategic milestones, protected scope boundaries, and clear next steps.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onScrollToForm}
                className="py-3.5 px-7 bg-[#39483B] hover:bg-[#2e3a2f] active:bg-[#222e23] text-[#F5F0E7] text-[13px] sm:text-sm uppercase tracking-wider font-semibold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39483B] cursor-pointer"
              >
                Create a Proposal
              </button>

              <a
                href="#sample-briefs"
                className="py-3.5 px-6 border border-[#22221F]/20 hover:border-[#22221F]/50 text-[#22221F] text-[13px] sm:text-sm uppercase tracking-wider font-semibold transition-colors bg-[#F5F0E7]"
              >
                Explore {SAMPLE_PROJECTS.length} Demonstration Samples
              </a>
            </div>

            {/* Quick Sample Brief Injectors */}
            <div id="sample-briefs" className="pt-6 border-t border-[#22221F]/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] uppercase tracking-wider text-[#22221F]/85 font-mono font-medium">
                    Try Interactive Fictional Brief:
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#39483B] bg-[#E9E0D2] px-2 py-0.5">
                    {SAMPLE_PROJECTS.length} DEMOS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[13px] font-mono font-medium text-[#39483B] hover:text-[#22221F] underline underline-offset-2 cursor-pointer text-left"
                >
                  {isExpanded ? 'Show Curated (3)' : `Browse All ${filteredSamples.length} Samples ↓`}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-3.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 font-mono font-medium transition-colors cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B]'
                        : 'bg-[#F5F0E7] text-[#22221F]/75 border-[#22221F]/15 hover:border-[#22221F]/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sample Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {displayedSamples.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-3.5 bg-[#E9E0D2]/60 hover:bg-[#E9E0D2] border border-[#22221F]/12 text-[#22221F] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#39483B] mb-1.5">
                        <span className="font-semibold">{sample.category}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-[#F5F0E7] text-[#22221F]/70 border border-[#22221F]/10 font-medium">
                          {sample.completeness === 'Complete & Detailed' ? 'Complete' : 'Test Gap'}
                        </span>
                      </div>
                      <div className="font-semibold text-sm sm:text-[15px] text-[#22221F] line-clamp-1 mb-1.5" title={sample.label}>
                        {sample.label.split('—')[1]?.trim() || sample.label}
                      </div>
                      <p className="text-xs sm:text-[13px] text-[#22221F]/80 line-clamp-2 leading-relaxed mb-3 font-sans">
                        {sample.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#22221F]/10 flex items-center justify-between gap-1 text-xs sm:text-[13px]">
                      <button
                        type="button"
                        onClick={() => onSelectSample(sample.brief)}
                        className="text-[#39483B] hover:text-[#22221F] font-mono font-semibold underline underline-offset-2 cursor-pointer"
                        title="Populate brief form to edit and generate"
                      >
                        Try Brief →
                      </button>
                      {onLoadSampleProject && (
                        <button
                          type="button"
                          onClick={() => onLoadSampleProject(sample.brief, sample.defaultProposal)}
                          className="text-[#22221F]/70 hover:text-[#22221F] font-mono text-xs cursor-pointer font-medium"
                          title="Open pre-built proposal and living scope map"
                        >
                          Scope Map
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Framed Documentary Landscape Card */}
          <div className="lg:col-span-5">
            <div className="relative p-2 bg-[#E9E0D2]/80 border border-[#22221F]/10 shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#39483B]/10">
                <img
                  src={landscapeImg}
                  alt="Mist-covered mountain forest at dawn, documentary style"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[10%] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22221F]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-[#F5F0E7]">
                  <span className="text-[10px] tracking-widest uppercase font-mono text-[#A6AD99] block mb-1">
                    Editorial Philosophy
                  </span>
                  <p className="font-serif italic text-sm text-[#F5F0E7] leading-snug">
                    "Clarity in the proposal is the seed of peace during the project."
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#22221F]/60 px-2 mt-4 font-mono">
              <span>EST. 2026 ARCHIVE</span>
              <LaurelCrest className="w-10 h-10 text-[#39483B]" label="STUDIO" year="2026" />
              <span>CRAFTED IN IVORY & CHARCOAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
