import React, { useState, useEffect } from 'react';
import { ProjectBrief, ProjectCategory, TonePreference } from '../types/proposal';
import { BotanicalDivider } from './Ornaments';
import { SmartGapDetector } from './SmartGapDetector';
import { SAMPLE_PROJECTS } from '../data/sampleBriefs';
import { VoiceInputButton } from './VoiceInputButton';

const CATEGORIES: ProjectCategory[] = [
  'Web Development',
  'UI/UX Design',
  'Branding',
  'Content Writing',
  'Marketing',
  'Other',
];

const TONES: Array<{ value: TonePreference; label: string; desc: string }> = [
  { value: 'Professional', label: 'Professional', desc: 'Direct, rigorous, and outcome-oriented' },
  { value: 'Friendly', label: 'Friendly', desc: 'Warm, collaborative, and approachable' },
  { value: 'Premium', label: 'Premium', desc: 'Refined, authoritative, and bespoke' },
];

interface BriefFormProps {
  initialBrief?: ProjectBrief | null;
  onSubmit: (brief: ProjectBrief) => void;
  isLoading: boolean;
}

export const BriefForm: React.FC<BriefFormProps> = ({
  initialBrief,
  onSubmit,
  isLoading,
}) => {
  const [brief, setBrief] = useState<ProjectBrief>({
    projectTitle: '',
    clientName: '',
    projectCategory: 'Web Development',
    requirements: '',
    goals: '',
    budget: '',
    deadline: '',
    tone: 'Premium',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [loadedSampleName, setLoadedSampleName] = useState<string | null>(null);

  useEffect(() => {
    if (initialBrief) {
      setBrief(initialBrief);
      setErrors({});
      const matched = SAMPLE_PROJECTS.find(
        (s) => s.brief.projectTitle.toLowerCase() === initialBrief.projectTitle.toLowerCase()
      );
      setLoadedSampleName(matched ? matched.label : null);
    }
  }, [initialBrief]);

  const handleSelectSample = (sampleId: string) => {
    if (!sampleId) return;
    const sample = SAMPLE_PROJECTS.find((s) => s.id === sampleId);
    if (sample) {
      setBrief(sample.brief);
      setLoadedSampleName(sample.label);
      setErrors({});
      setTouched({});
    }
  };

  const handleClearForm = () => {
    setBrief({
      projectTitle: '',
      clientName: '',
      projectCategory: 'Web Development',
      requirements: '',
      goals: '',
      budget: '',
      deadline: '',
      tone: 'Premium',
      notes: '',
    });
    setLoadedSampleName(null);
    setErrors({});
    setTouched({});
  };

  const validate = (data: ProjectBrief) => {
    const errs: { [key: string]: string } = {};
    if (!data.projectTitle.trim()) {
      errs.projectTitle = 'Project title is required.';
    }
    if (!data.clientName.trim()) {
      errs.clientName = 'Client or business name is required.';
    }
    if (!data.requirements.trim()) {
      errs.requirements = 'Client requirements are needed to structure the proposal.';
    } else if (data.requirements.trim().length < 20) {
      errs.requirements = 'Please add a few more sentences describing what the client needs.';
    }
    return errs;
  };

  const handleChange = (field: keyof ProjectBrief, value: string) => {
    const updated = { ...brief, [field]: value };
    setBrief(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field: keyof ProjectBrief) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(brief));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors = validate(brief);
    setErrors(currentErrors);
    setTouched({
      projectTitle: true,
      clientName: true,
      requirements: true,
    });

    if (Object.keys(currentErrors).length === 0) {
      onSubmit(brief);
    }
  };

  const handleApplyGapFix = (field: keyof ProjectBrief, text: string) => {
    const currentVal = brief[field] || '';
    const newVal = currentVal.trim() ? `${currentVal}\n• ${text}` : text;
    handleChange(field, newVal);
  };

  const isFormValid =
    brief.projectTitle.trim().length > 0 &&
    brief.clientName.trim().length > 0 &&
    brief.requirements.trim().length >= 20;

  return (
    <div id="brief-form" className="py-16 max-w-4xl mx-auto px-6">
      {/* Editorial Form Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase tracking-widest font-mono text-[#39483B] block mb-2">
          Intake & Specification
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#22221F] mb-4">
          Start with the brief.
        </h2>
        <p className="text-[#22221F]/70 text-base leading-relaxed">
          Provide what you know about the project. We will synthesize this into a structured document
          complete with scope boundaries, deliverables, and estimated milestones.
        </p>
        <BotanicalDivider className="my-6" />
      </div>

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] border border-[#22221F]/15 p-8 sm:p-12 shadow-sm rounded-none space-y-12"
        noValidate
      >
        {/* Sample Demonstration Selector Toolbar */}
        <div className="p-4 bg-[#F5F0E7]/60 border border-[#22221F]/15 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9B846C]" />
              <label htmlFor="sample-brief-select" className="text-xs uppercase tracking-wider font-mono font-medium text-[#22221F]">
                Try Fictional Demonstration Brief:
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#E9E0D2] text-[#39483B]">
                {SAMPLE_PROJECTS.length} Scenarios Available
              </span>
              {loadedSampleName && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-[11px] font-mono text-[#22221F]/60 hover:text-amber-800 underline underline-offset-2 cursor-pointer"
                >
                  Clear Form
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-12">
              <select
                id="sample-brief-select"
                onChange={(e) => handleSelectSample(e.target.value)}
                defaultValue=""
                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#22221F]/20 text-xs text-[#22221F] font-sans focus:outline-none focus:border-[#39483B] cursor-pointer"
              >
                <option value="" disabled>
                  Select one of 13 interactive sample demonstrations to populate this form...
                </option>
                <optgroup label="Web Development (5 Projects)">
                  {SAMPLE_PROJECTS.filter((s) => s.category === 'Web Development').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} [{s.completeness}]
                    </option>
                  ))}
                </optgroup>
                <optgroup label="UI/UX & Product Design (1 Project)">
                  {SAMPLE_PROJECTS.filter((s) => s.category === 'UI/UX Design').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} [{s.completeness}]
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Brand Identity (2 Projects)">
                  {SAMPLE_PROJECTS.filter((s) => s.category === 'Branding').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} [{s.completeness}]
                    </option>
                  ))}
                </optgroup>
                <optgroup label="SaaS & Software Platforms (2 Projects)">
                  {SAMPLE_PROJECTS.filter((s) => s.category === 'SaaS and Software').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} [{s.completeness}]
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Marketing & Clinical Operations (3 Projects)">
                  {SAMPLE_PROJECTS.filter((s) => s.category === 'Marketing' || s.category === 'Business Operations' || s.category === 'Content Writing').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} [{s.completeness}]
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {loadedSampleName && (
            <div className="pt-2 border-t border-[#22221F]/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#22221F]/75 font-sans gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-emerald-800 font-semibold">✓ LOADED:</span>
                <span className="font-medium text-[#22221F]">{loadedSampleName}</span>
              </div>
              <span className="font-mono text-[10px] text-[#39483B] italic">
                Demonstration data — all fields can be edited freely.
              </span>
            </div>
          )}
        </div>

        {/* Chapter 1: Project Essentials */}
        <section className="space-y-6">
          <div className="border-b border-[#22221F]/10 pb-3 flex items-center justify-between">
            <h3 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2">
              <span className="text-[#39483B] font-mono text-base">01.</span>
              Project Essentials
            </h3>
            <span className="text-xs font-mono text-[#22221F]/60 uppercase font-semibold">Mandatory Fields</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="projectTitle"
                className="block text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85 mb-2"
              >
                Project Title <span className="text-amber-800">*</span>
              </label>
              <input
                id="projectTitle"
                type="text"
                value={brief.projectTitle}
                onChange={(e) => handleChange('projectTitle', e.target.value)}
                onBlur={() => handleBlur('projectTitle')}
                placeholder="e.g. Kinship Cultural Lab Digital Publication"
                className={`w-full px-4 py-3 bg-[#F5F0E7]/40 border ${
                  errors.projectTitle && touched.projectTitle
                    ? 'border-amber-800 focus:ring-amber-800'
                    : 'border-[#22221F]/20 focus:border-[#39483B] focus:ring-[#39483B]'
                } text-[#22221F] text-[15px] sm:text-base placeholder-[#22221F]/40 focus:outline-none focus:ring-1 transition-colors`}
              />
              {errors.projectTitle && touched.projectTitle && (
                <p className="text-[13px] text-amber-800 mt-1.5 font-medium">{errors.projectTitle}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="clientName"
                className="block text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85 mb-2"
              >
                Client or Business Name <span className="text-amber-800">*</span>
              </label>
              <input
                id="clientName"
                type="text"
                value={brief.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                onBlur={() => handleBlur('clientName')}
                placeholder="e.g. Kinship Cultural Lab"
                className={`w-full px-4 py-3 bg-[#F5F0E7]/40 border ${
                  errors.clientName && touched.clientName
                    ? 'border-amber-800 focus:ring-amber-800'
                    : 'border-[#22221F]/20 focus:border-[#39483B] focus:ring-[#39483B]'
                } text-[#22221F] text-[15px] sm:text-base placeholder-[#22221F]/40 focus:outline-none focus:ring-1 transition-colors`}
              />
              {errors.clientName && touched.clientName && (
                <p className="text-[13px] text-amber-800 mt-1.5 font-medium">{errors.clientName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85 mb-2.5">
              Project Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleChange('projectCategory', cat)}
                  className={`py-3 px-3.5 text-xs sm:text-[13px] font-medium text-left transition-colors border cursor-pointer ${
                    brief.projectCategory === cat
                      ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B] font-semibold'
                      : 'bg-[#F5F0E7]/40 text-[#22221F]/80 border-[#22221F]/15 hover:border-[#22221F]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter 2: Requirements & Vision */}
        <section className="space-y-6">
          <div className="border-b border-[#22221F]/10 pb-3 flex items-center justify-between">
            <h3 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2">
              <span className="text-[#39483B] font-mono text-base">02.</span>
              Requirements & Vision
            </h3>
            <span className="text-xs font-mono text-[#22221F]/60 uppercase font-semibold">Scope Foundation</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="requirements"
                  className="text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85"
                >
                  Client's Requirements <span className="text-amber-800">*</span>
                </label>
                <VoiceInputButton
                  fieldLabel="Requirements"
                  currentValue={brief.requirements}
                  onAcceptTranscript={(text, mode) => {
                    const updated = mode === 'append' && brief.requirements.trim() ? `${brief.requirements}\n\n${text}` : text;
                    handleChange('requirements', updated);
                  }}
                />
              </div>
              <span className="text-xs font-mono text-[#22221F]/60">
                {brief.requirements.length} characters
              </span>
            </div>
            <textarea
              id="requirements"
              rows={5}
              value={brief.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              onBlur={() => handleBlur('requirements')}
              placeholder="Paste or describe what the client stated they need: background, technical features, design expectations, current bottlenecks... (or use Talk-to-Scope microphone above)"
              className={`w-full p-4 bg-[#F5F0E7]/40 border ${
                errors.requirements && touched.requirements
                  ? 'border-amber-800 focus:ring-amber-800'
                  : 'border-[#22221F]/20 focus:border-[#39483B] focus:ring-[#39483B]'
              } text-[#22221F] text-[15px] sm:text-base placeholder-[#22221F]/40 focus:outline-none focus:ring-1 transition-colors leading-relaxed font-sans`}
            />
            {errors.requirements && touched.requirements && (
              <p className="text-[13px] text-amber-800 mt-1.5 font-medium">{errors.requirements}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="goals"
                className="text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85"
              >
                Main Goals & Desired Outcomes
              </label>
              <VoiceInputButton
                fieldLabel="Goals"
                currentValue={brief.goals}
                onAcceptTranscript={(text, mode) => {
                  const updated = mode === 'append' && brief.goals.trim() ? `${brief.goals}\n\n${text}` : text;
                  handleChange('goals', updated);
                }}
              />
            </div>
            <textarea
              id="goals"
              rows={3}
              value={brief.goals}
              onChange={(e) => handleChange('goals', e.target.value)}
              placeholder="e.g. Drive direct customer reservations, elevate brand positioning for series A round, increase reading time-on-page..."
              className="w-full p-4 bg-[#F5F0E7]/40 border border-[#22221F]/20 focus:border-[#39483B] focus:ring-1 focus:ring-[#39483B] text-[#22221F] text-[15px] sm:text-base placeholder-[#22221F]/40 focus:outline-none transition-colors leading-relaxed font-sans"
            />
          </div>

          {/* Smart Brief Gap Risk Sentinel */}
          <SmartGapDetector brief={brief} onApplyFix={handleApplyGapFix} />
        </section>

        {/* Chapter 3: Parameters & Tone */}
        <section className="space-y-6">
          <div className="border-b border-[#22221F]/10 pb-3 flex items-center justify-between">
            <h3 className="font-serif text-2xl sm:text-[26px] font-medium text-[#22221F] flex items-center gap-2">
              <span className="text-[#39483B] font-mono text-base">03.</span>
              Parameters & Tone
            </h3>
            <span className="text-xs font-mono text-[#22221F]/60 uppercase font-semibold">Voice & Bounds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="budget"
                className="block text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85 mb-2"
              >
                Expected Budget or Range <span className="text-[#22221F]/50 font-normal">(Optional)</span>
              </label>
              <input
                id="budget"
                type="text"
                value={brief.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                placeholder="e.g. $8,500 – $12,000 or Fixed $5,000"
                className="w-full px-4 py-3 bg-[#F5F0E7]/40 border border-[#22221F]/20 focus:border-[#39483B] focus:ring-1 focus:ring-[#39483B] text-[#22221F] text-[15px] sm:text-base placeholder-[#22221F]/40 focus:outline-none transition-colors"
              />
              <p className="text-xs text-[#22221F]/60 mt-1.5 font-serif italic">
                Left empty, the AI marks fees as custom quotation to preserve your pricing discretion.
              </p>
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85 mb-2"
              >
                Desired Deadline <span className="text-[#22221F]/50 font-normal">(Optional)</span>
              </label>
              <input
                id="deadline"
                type="text"
                value={brief.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                placeholder="e.g. 6 weeks, or September 15, 2026"
                className="w-full px-4 py-3 bg-[#F5F0E7]/40 border border-[#22221F]/20 focus:border-[#39483B] focus:ring-1 focus:ring-[#39483B] text-[#22221F] text-[15px] sm:text-base placeholder-[#22221F]/40 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85 mb-2.5">
              Preferred Tone of Voice
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {TONES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => handleChange('tone', t.value)}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    brief.tone === t.value
                      ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B] shadow-sm'
                      : 'bg-[#F5F0E7]/40 text-[#22221F] border-[#22221F]/15 hover:border-[#22221F]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif font-semibold text-base sm:text-[17px]">{t.label}</span>
                    {brief.tone === t.value && (
                      <span className="text-[11px] font-mono uppercase bg-[#F5F0E7] text-[#39483B] px-1.5 py-0.5 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-xs sm:text-[13px] leading-relaxed ${
                      brief.tone === t.value ? 'text-[#F5F0E7]/90' : 'text-[#22221F]/70'
                    }`}
                  >
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="notes"
                className="text-[13px] sm:text-sm uppercase tracking-wider font-semibold text-[#22221F]/85"
              >
                Optional Notes, Quirks & Freelancer Boundaries <span className="text-[#22221F]/50 font-normal">(Optional)</span>
              </label>
              <VoiceInputButton
                fieldLabel="Notes & Boundaries"
                currentValue={brief.notes}
                onAcceptTranscript={(text, mode) => {
                  const updated = mode === 'append' && brief.notes?.trim() ? `${brief.notes}\n\n${text}` : text;
                  handleChange('notes', updated);
                }}
              />
            </div>
            <textarea
              id="notes"
              rows={2}
              value={brief.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Do not include copywriting. Client tends to scope-creep during revisions. Must use Figma and Next.js."
              className="w-full p-4 bg-[#F5F0E7]/40 border border-[#22221F]/20 focus:border-[#39483B] focus:ring-1 focus:ring-[#39483B] text-[#22221F] text-[15px] sm:text-base placeholder-[#22221F]/40 focus:outline-none transition-colors leading-relaxed font-sans"
            />
          </div>
        </section>

        {/* Submit Action */}
        <div className="pt-6 border-t border-[#22221F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[13px] sm:text-sm text-[#22221F]/70 font-serif italic text-center sm:text-left">
            {!isFormValid ? (
              <span className="text-amber-800 font-sans font-medium">
                Please complete project title, client name, and requirements to generate.
              </span>
            ) : (
              <span>Structured proposal will be generated for your editorial review.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full sm:w-auto py-4 px-10 bg-[#39483B] hover:bg-[#2e3a2f] active:bg-[#222e23] disabled:bg-[#22221F]/30 disabled:cursor-not-allowed text-[#F5F0E7] text-[13px] sm:text-sm uppercase tracking-wider font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39483B] cursor-pointer flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#F5F0E7] border-t-transparent rounded-full animate-spin" />
                <span>Generating Proposal...</span>
              </span>
            ) : (
              <>
                <span>Shape My Proposal</span>
                <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                  →
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
