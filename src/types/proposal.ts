export type ProjectCategory =
  | 'Web Development'
  | 'UI/UX Design'
  | 'Branding'
  | 'Marketing'
  | 'SaaS and Software'
  | 'Business Operations'
  | 'Content Writing'
  | 'Other';

export type TonePreference = 'Professional' | 'Friendly' | 'Premium';

export type ProposalStatus =
  | 'Brief in Progress'
  | 'Needs Clarification'
  | 'Proposal Draft'
  | 'Ready for Review'
  | 'Exported';

export type ProjectComplexity = 'Simple' | 'Moderate' | 'Advanced';

export type BriefCompleteness =
  | 'Complete & Detailed'
  | 'Vague / Short'
  | 'Missing Budget & Timeline'
  | 'Conflicting Requirements'
  | 'Ambiguous Deliverable';

export interface ProjectBrief {
  projectTitle: string;
  clientName: string;
  projectCategory: ProjectCategory;
  requirements: string;
  goals: string;
  budget?: string;
  deadline?: string;
  tone: TonePreference;
  notes?: string;
}

export interface ProposalDeliverable {
  category: string;
  items: string[];
}

export interface ProposalMilestone {
  title: string;
  description: string;
  durationOrDate?: string;
  deliverablesSummary?: string;
}

export interface ScopeMapItem {
  id: string;
  requirement: string;
  deliverable: string;
  milestone: string;
  acceptanceCriteria: string;
  outcome: string;
  status: 'defined' | 'in_review' | 'verified';
  isInferred?: boolean;
  notes?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'hinglish';

export interface ProposalTranslation {
  language: SupportedLanguage;
  translatedAt: string;
  title: string;
  executiveSummary: string;
  clientNeedsUnderstanding: string;
  proposedSolution: string;
  deliverables: ProposalDeliverable[];
  scopeInclusions: string[];
  scopeExclusions: string[];
  milestones: ProposalMilestone[];
  timelineEstimate: string;
  budgetEstimate?: string;
  pricingAndAssumptions?: string;
  revisionPolicy?: string;
  acceptanceCriteria: string[];
  assumptionsAndDependencies: string[];
  clarificationQuestions: string[];
  nextSteps: string[];
  phrasesForReview?: string[];
  isHumanReviewed?: boolean;
}

export interface ProposalData {
  id: string;
  title: string;
  clientName: string;
  category: ProjectCategory;
  createdAt: string;
  updatedAt: string;
  status: ProposalStatus;
  executiveSummary: string;
  clientNeedsUnderstanding: string;
  proposedSolution: string;
  deliverables: ProposalDeliverable[];
  scopeInclusions: string[];
  scopeExclusions: string[];
  milestones: ProposalMilestone[];
  timelineEstimate: string;
  budgetEstimate?: string;
  pricingAndAssumptions?: string;
  revisionPolicy?: string;
  acceptanceCriteria: string[];
  assumptionsAndDependencies: string[];
  clarificationQuestions: string[];
  nextSteps: string[];
  scopeMap?: ScopeMapItem[];
  tone?: TonePreference;
  translations?: Partial<Record<SupportedLanguage, ProposalTranslation>>;
  activeLanguage?: SupportedLanguage;
  modelMetadata: {
    provider: string;
    model: string;
    isDemoSynthesis: boolean;
  };
}

export interface UserSession {
  fullName: string;
  email: string;
  enteredAt: string;
}

export interface ModelProviderStatus {
  hasKey: boolean;
  provider: string;
  model: string;
  endpoint: string;
}

export interface BriefGap {
  id: string;
  category: 'technical' | 'timeline' | 'budget' | 'stakeholder' | 'dependency';
  severity: 'critical' | 'moderate' | 'advisory';
  title: string;
  description: string;
  recommendation: string;
  suggestedField: keyof ProjectBrief;
  suggestedText: string;
}

export interface ScopeCreepAnalysis {
  clientMessage: string;
  verdict: 'within_scope' | 'boundary' | 'out_of_scope';
  summary: string;
  reasoning: string[];
  impactAssessment: {
    timelineImpact: string;
    budgetImpact: string;
  };
  relevantSectionsCited: string[];
  recommendedResponse: string;
}

export type ScopeChangeCategory =
  | 'added_requirements'
  | 'removed_requirements'
  | 'changed_expectations'
  | 'potentially_out_of_scope'
  | 'unclear_change';

export interface ScopeChangeItem {
  id: string;
  category: ScopeChangeCategory;
  title: string;
  description: string;
  whyItMatters: string;
  affectedDeliverables: string[];
  affectedMilestones: string[];
  estimatedEffortImpact: 'Low (1-2 days)' | 'Moderate (3-5 days)' | 'Significant (1-2 weeks)' | 'Major Architectural Shift';
  acceptanceCriteriaImpact: string;
}

export interface ScopeTimeMachineComparison {
  originalBriefSummary: string;
  originalAgreedScope: {
    deliverablesCount: number;
    milestonesCount: number;
    timeline: string;
    budget?: string;
    keyDeliverables: string[];
  };
  newClientRequest: string;
  changes: ScopeChangeItem[];
  executiveSummary: string;
  recommendedResponse: string;
  freelancerVerdictNotes?: string;
}

export interface VoiceTranscriptResult {
  text: string;
  language: 'en' | 'hi' | 'hinglish';
  isAccepted: boolean;
}

export interface SampleChangeRequest {
  title: string;
  message: string;
  expectedVerdict: 'within_scope' | 'boundary' | 'out_of_scope';
}

export interface SampleProject {
  id: string;
  label: string;
  shortDesc: string;
  category: ProjectCategory;
  complexity: ProjectComplexity;
  completeness: BriefCompleteness;
  highlightFeature?: string;
  brief: ProjectBrief;
  defaultProposal: ProposalData;
  sampleChangeRequests: SampleChangeRequest[];
}
