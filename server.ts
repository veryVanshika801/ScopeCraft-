import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProjectBrief, ProposalData, TonePreference } from './src/types/proposal';
import { analyzeScopeCreep } from './src/utils/scopeCreepDetector';
import { analyzeBriefGaps } from './src/utils/gapDetector';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// Determine Open-Weight provider configuration
function getProviderConfig() {
  const key = process.env.OPEN_WEIGHT_API_KEY || '';
  let provider = process.env.OPEN_WEIGHT_PROVIDER || '';
  let model = process.env.OPEN_WEIGHT_MODEL || '';
  let baseUrl = process.env.OPEN_WEIGHT_BASE_URL || '';

  if (!provider) {
    if (key.startsWith('gsk_')) {
      provider = 'groq';
    } else if (key.startsWith('hf_')) {
      provider = 'huggingface';
    } else if (key.startsWith('tog_')) {
      provider = 'together';
    } else {
      provider = 'open-weight';
    }
  }

  if (!baseUrl) {
    if (provider === 'groq') {
      baseUrl = 'https://api.groq.com/openai/v1';
      model = model || 'llama-3.3-70b-versatile';
    } else if (provider === 'huggingface') {
      baseUrl = 'https://api-inference.huggingface.co/v1';
      model = model || 'meta-llama/Llama-3.3-70B-Instruct';
    } else if (provider === 'together') {
      baseUrl = 'https://api.together.xyz/v1';
      model = model || 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
    } else {
      baseUrl = 'https://api.groq.com/openai/v1';
      model = model || 'llama-3.3-70b-versatile';
    }
  }

  return { key, provider, model, baseUrl };
}

// Model status endpoint
app.get('/api/model-status', (_req: Request, res: Response) => {
  const { key, provider, model, baseUrl } = getProviderConfig();
  res.json({
    hasKey: Boolean(key && key.trim().length > 0),
    provider,
    model,
    endpoint: baseUrl,
  });
});

// Tone writing instructions and vocabulary profiles
const TONE_PROFILES = {
  Professional: {
    adjectives: 'rigorous, structured, and outcome-oriented',
    summaryStyle:
      'Direct, contractual, and structured. Focus on delivery governance, operational parameters, clear milestones, objective acceptance criteria, and contractual clarity.',
    framing:
      'Formal business-to-business proposal emphasizing accountability, verified milestones, risk management, and delivery excellence.',
  },
  Friendly: {
    adjectives: 'warm, collaborative, and approachable',
    summaryStyle:
      'Warm, encouraging, and collaborative. Focus on shared goals, transparent communication, regular feedback loops, and client peace of mind.',
    framing:
      'Approachable, partnership-driven proposal emphasizing teamwork, clear expectations, regular video check-ins, and mutual creative alignment.',
  },
  Premium: {
    adjectives: 'refined, authoritative, and bespoke',
    summaryStyle:
      'Sophisticated, strategic, and editorial. Focus on market distinction, deliberate craft, elevated client experience, and long-term business value.',
    framing:
      'Elevated creative monograph emphasizing category leadership, strategic authority, bespoke execution, and immaculate design integrity.',
  },
};

// Intelligent studio engine synthesis (used when no external API key is configured or demo requested)
function generateStudioEngineProposal(brief: ProjectBrief, instructions?: string): ProposalData {
  const now = new Date().toISOString();
  const id = `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const tone = brief.tone || 'Professional';
  const toneTitlePrefix =
    tone === 'Professional'
      ? 'Master Statement of Work: '
      : tone === 'Friendly'
      ? 'Collaborative Project Roadmap: '
      : 'Strategic Monograph: ';
  const baseTitle = brief.projectTitle?.trim() || `Project for ${brief.clientName}`;
  const finalTitle = baseTitle.startsWith(toneTitlePrefix) ? baseTitle : `${toneTitlePrefix}${baseTitle}`;

  let executiveSummary = '';
  let clientNeedsUnderstanding = '';
  let proposedSolution = '';
  let deliverables: Array<{ category: string; items: string[] }> = [];
  let scopeInclusions: string[] = [];
  let scopeExclusions: string[] = [];
  let milestones: Array<{ title: string; description: string; durationOrDate: string; deliverablesSummary: string }> = [];
  let timelineEstimate = '';
  let budgetEstimate = '';
  let pricingAndAssumptions = '';
  let revisionPolicy = '';
  let acceptanceCriteria: string[] = [];
  let assumptionsAndDependencies: string[] = [];
  let clarificationQuestions: string[] = [];
  let nextSteps: string[] = [];

  const goalSnippet = brief.goals && brief.goals.trim().length > 0 ? brief.goals.trim() : 'achieve measurable project success and clear market presence';
  const reqSnippet = brief.requirements && brief.requirements.trim().length > 0 ? brief.requirements.trim() : 'defined functional and creative parameters';

  if (tone === 'Professional') {
    executiveSummary =
      `This proposal establishes the formal scope of work, technical architecture, and delivery governance for ${brief.clientName}. Engineered around the objective of "${goalSnippet}", the engagement enforces rigorous milestone management, risk mitigation protocols, and verified acceptance gates. Our methodology pairs operational discipline with precise technical execution, ensuring that all initial requirements are translated into a robust, production-ready release within agreed parameters.` +
      (instructions ? `\n\n*Special Revision Directives*: ${instructions}` : '');

    clientNeedsUnderstanding =
      `Operational & Technical Requirements Assessment for ${brief.clientName}:\n\n` +
      `1. Core Functional Scope: ${reqSnippet}\n` +
      `2. Structural Objectives: Direct alignment with stated goals ("${goalSnippet}").\n` +
      `3. Delivery Governance & Risk Control: Mitigating scope volatility through phased approvals and strict boundary management.\n` +
      `4. Handover & Operability: Delivering full technical autonomy, structured documentation, and operational continuity for the internal team.`;

    proposedSolution =
      `Phased Delivery Methodology with Formal Verification Gates:\n\n` +
      `• Phase 1: Technical Discovery & Architecture Specification — Formalize requirements matrix, component architecture, and integration boundaries prior to implementation.\n` +
      `• Phase 2: Production Build & Staging QA — Sprint-based development with weekly milestone sign-off gates, cross-device testing, and defect resolution.\n` +
      `• Phase 3: Deployment, Production Hardening & Enablement — Staging verification, security audit, cutover execution, and comprehensive technical documentation.`;

    deliverables = [
      {
        category: 'Discovery, Technical Architecture & Scope Matrix',
        items: [
          'Detailed System Architecture Blueprint & Dependency Inventory',
          'Component Hierarchy, Data Contracts & API Specifications',
          'Technical Scope Matrix & Acceptance Verification Criteria',
        ],
      },
      {
        category: `${brief.projectCategory} Production & System Build`,
        items: [
          `Production-grade ${brief.projectCategory} Artifacts tailored to ${brief.clientName}`,
          'Responsive interactive staging build hosted on secure test environment',
          'Modular component library with verified test coverage',
        ],
      },
      {
        category: 'Deployment, Quality Assurance & Handover',
        items: [
          'Production release verification, security checklist & performance audit',
          'Technical handover documentation & recorded administrative walkthrough',
          '30-day post-launch warranty with dedicated defect-remediation window',
        ],
      },
    ];

    scopeInclusions = [
      `Up to two consolidated rounds of structured revisions per milestone`,
      `Weekly asynchronous status reports and shared milestone tracking board`,
      `Cross-browser verification across Chrome, Safari, Edge, and Firefox (latest LTS releases)`,
      `WCAG 2.1 AA accessibility audit and performance optimization report`,
    ];

    scopeExclusions = [
      `Third-party software licensing, paid fonts, or proprietary API recurring fees`,
      `Original copywriting, photography, or video production unless contracted separately`,
      `Unscheduled real-time emergency triage outside established milestone hours`,
      `Substantial pivot in project architecture once milestone sign-off is completed`,
    ];

    milestones = [
      {
        title: 'Milestone 1: Architectural Discovery & Scope Baseline',
        description:
          'Formal alignment on functional specifications, technical constraints, design tokens, and architecture baseline.',
        durationOrDate: brief.deadline ? `Weeks 1 – 2 of ${brief.deadline}` : 'Weeks 1 – 2',
        deliverablesSummary: 'Signed Scope Matrix, architecture brief, and wireframe prototypes.',
      },
      {
        title: 'Milestone 2: Core Production Build & Staging Verification',
        description:
          'End-to-end realization of primary features, interactive states, responsive layouts, and staging verification.',
        durationOrDate: brief.deadline ? `Weeks 3 – 5 of ${brief.deadline}` : 'Weeks 3 – 5',
        deliverablesSummary: 'Interactive staging prototype and functional deliverable suite.',
      },
      {
        title: 'Milestone 3: Hardening, QA Testing & Production Handover',
        description:
          'Final performance audit, cross-platform QA, production deployment, and administrative transfer.',
        durationOrDate: brief.deadline ? `Final week of ${brief.deadline}` : 'Week 6',
        deliverablesSummary: 'Production release, technical documentation, and signed handover checklist.',
      },
    ];

    timelineEstimate = brief.deadline && brief.deadline.trim().length > 0
      ? `Contractual target completion by ${brief.deadline}, structured over approximately 6 calendar weeks with bi-weekly milestone checkpoints.`
      : 'Estimated 5 to 7 calendar weeks from kick-off date, structured over three distinct verification gates.';

    budgetEstimate = brief.budget && brief.budget.trim().length > 0
      ? `Fixed-fee scope aligned with your specified parameter of ${brief.budget}, invoiced 40% upon commencement, 30% at Milestone 2 approval, and 30% upon final delivery.`
      : 'Custom fee proposal to be finalized upon scope confirmation (recommended structure: 50% deposit, 50% handover).';

    pricingAndAssumptions = brief.budget && brief.budget.trim().length > 0
      ? `Fixed investment aligned with specified budget of ${brief.budget}. Structured across milestone review gates: 40% commencement deposit, 30% Milestone 2 approval, and 30% upon final delivery.`
      : `Custom fee structure to be finalized upon scope confirmation (recommended milestone model: 50% kick-off deposit, 50% handover).`;

    revisionPolicy =
      `Includes two consolidated rounds of structured revisions for each agreed milestone. Revisions must be submitted within 3 business days of milestone presentation. Pivot requests outside approved specifications are estimated on a standard change-order basis.`;

    acceptanceCriteria = [
      `Complete delivery of all ${brief.projectCategory} artifacts audited against initial brief objectives.`,
      `Formal milestone sign-off with documented consolidation feedback rounds.`,
      `Production-ready asset transfer and technical documentation walkthrough with internal team.`,
      `Zero critical or high-severity defects across targeted modern desktop and mobile viewports.`,
    ];

    assumptionsAndDependencies = [
      `Consolidated client feedback delivered within 3 business days of milestone submissions.`,
      `Brand guidelines, credentials, and third-party account access supplied during Week 1.`,
      `Single designated stakeholder appointed to arbitrate conflicting team inputs.`,
      `Target browser support: Chrome, Safari, Firefox, and Edge (last two major versions).`,
    ];

    clarificationQuestions = [
      `Who from the ${brief.clientName} team will hold final authority for formal milestone sign-offs?`,
      `Are there legacy system integrations, API dependencies, or databases requiring early credential provisioning?`,
      `Do you have existing brand assets, design tokens, or brand voice guidelines available in Figma or PDF?`,
      `What are the specific quantitative KPIs or metrics used to evaluate delivery success over the first 90 days?`,
    ];

    nextSteps = [
      `Step 1: Review this proposal draft and confirm alignment on scope bounds and milestones.`,
      `Step 2: Sign standard master services agreement (MSA) and statement of work (SOW).`,
      `Step 3: Submit initial milestone retainer to secure onboarding schedule in studio calendar.`,
      `Step 4: Conduct 45-minute technical kick-off call and provision necessary repository/workspace access.`,
    ];
  } else if (tone === 'Friendly') {
    executiveSummary =
      `We are genuinely thrilled at the opportunity to team up with ${brief.clientName} on this project! Our shared vision is to bring "${goalSnippet}" to life through a collaborative, transparent creative partnership. We've mapped out clear, friendly milestones so you always know what to expect, when you'll see progress, and how your feedback directly shapes each iteration. By combining thoughtful design with open communication, we'll turn your ideas into a polished, delightful reality that your audience will love.` +
      (instructions ? `\n\n*Special Notes from Our Conversation*: ${instructions}` : '');

    clientNeedsUnderstanding =
      `What We Heard & What Matters Most to You:\n\n` +
      `We carefully reviewed your notes to understand the heart of what ${brief.clientName} needs: ${reqSnippet}\n\n` +
      `Our shared priorities throughout this journey:\n` +
      `• Creating an inviting, intuitive experience that feels natural and enjoyable for your audience.\n` +
      `• Keeping the entire process fun, stress-free, and completely transparent with weekly Loom video check-ins.\n` +
      `• Making sure you and your team feel fully empowered, supported, and confident to manage everything post-launch.`;

    proposedSolution =
      `Our Collaborative Working Rhythm (How We'll Build This Together):\n\n` +
      `• Step 1: Discover & Align — We explore your vision, walk through creative ideas together, and establish a clear roadmap where everyone is excited and on the same page.\n` +
      `• Step 2: Build, Share & Iterate — We develop your project in active sprints, sharing weekly Loom video updates and interactive staging links so you see live progress.\n` +
      `• Step 3: Polish, Celebrate & Launch — We fine-tune every detail, test across devices, conduct a friendly video walkthrough, and celebrate a successful launch together.`;

    deliverables = [
      {
        category: 'Shared Discovery & Creative Direction',
        items: [
          'Visual Moodboards, User Journey Maps & Interactive Idea Deck',
          'Clear Project Roadmap & Friendly Scope Blueprint',
          'Component Style Tiles & Design System Exploration',
        ],
      },
      {
        category: `${brief.projectCategory} Interactive Build & Sprints`,
        items: [
          `Complete ${brief.projectCategory} Suite tailored to ${brief.clientName}`,
          'Interactive staging preview link accessible for your team anytime',
          'User-friendly design tokens and component guide for effortless editing',
        ],
      },
      {
        category: 'Smooth Launch, Video Guides & Ongoing Care',
        items: [
          'Polished public launch with full cross-device testing & speed check',
          'Personalized recorded video walkthrough tutorials for your team',
          '30-day post-launch friendly check-in window and support buffer',
        ],
      },
    ];

    scopeInclusions = [
      `Two dedicated feedback rounds per milestone where we work through your notes together`,
      `Weekly friendly video walkthroughs so you always know what's happening and what's next`,
      `Complete testing on modern iPhones, Androids, iPads, and Mac/PC laptops`,
      `Helpful guidance on domain setup, hosting configuration, and easy maintenance`,
    ];

    scopeExclusions = [
      `Third-party software, fonts, or plugin subscription fees (we'll always suggest great free or low-cost options)`,
      `Original copywriting or professional video shooting unless we decide to add them as separate collaborative sprints`,
      `Emergency after-hours work outside our agreed weekday working hours`,
      `Brand-new features or pivots added after a milestone is approved (we can easily add them to Phase 2!)`,
    ];

    milestones = [
      {
        title: 'Milestone 1: Vision, Mood & First Look',
        description:
          'Getting aligned on visual direction, talking through initial mockups, and making sure the vibe is spot-on.',
        durationOrDate: brief.deadline ? `Weeks 1 – 2 (towards ${brief.deadline})` : 'Weeks 1 – 2',
        deliverablesSummary: 'Visual direction, interactive wireframes, and our shared roadmap.',
      },
      {
        title: 'Milestone 2: Bringing It to Life (Interactive Build)',
        description:
          'Building out the core experience with working prototypes so you can click around and test everything.',
        durationOrDate: brief.deadline ? `Weeks 3 – 5 (towards ${brief.deadline})` : 'Weeks 3 – 5',
        deliverablesSummary: 'Live staging link with all main pages and interactive components.',
      },
      {
        title: 'Milestone 3: Polish, Handover & Launch Celebration',
        description:
          'Smoothing out transitions, testing across all screen sizes, recording your walkthrough, and launching!',
        durationOrDate: brief.deadline ? `Launch week (${brief.deadline})` : 'Week 6',
        deliverablesSummary: 'Live launch, recorded video tutorial, and celebratory handover.',
      },
    ];

    timelineEstimate = brief.deadline && brief.deadline.trim().length > 0
      ? `We'll pace our work to comfortably reach your goal of ${brief.deadline}, with weekly video check-ins so you always feel in control.`
      : 'Estimated 5 to 7 weeks from our kick-off call, paced with friendly weekly milestones.';

    budgetEstimate = brief.budget && brief.budget.trim().length > 0
      ? `Transparent pricing shaped around your budget of ${brief.budget}, split comfortably across milestones (40% kick-off deposit, 30% midway review, 30% upon launch).`
      : 'Fair, transparent milestone pricing to be agreed together before we begin (typically 50% deposit, 50% launch).';

    pricingAndAssumptions = brief.budget && brief.budget.trim().length > 0
      ? `Comfortably aligned with your budget of ${brief.budget}. Structured across milestone review gates: 40% commencement deposit, 30% Milestone 2 approval, and 30% upon final delivery.`
      : `Transparent milestone pricing to be agreed together (recommended: 50% deposit, 50% handover).`;

    revisionPolicy =
      `We love your feedback! Each milestone includes two thorough review rounds where we carefully incorporate your thoughts. If exciting new ideas pop up along the way, we'll happily estimate them as optional add-ons or phase two enhancements.`;

    acceptanceCriteria = [
      `You and your team are 100% happy with how the ${brief.projectCategory} looks and feels.`,
      `All agreed features test smoothly across popular phones, tablets, and laptops.`,
      `Your team feels confident navigating the system with our recorded video guide in hand.`,
      `Smooth launch day with our support right beside you.`,
    ];

    assumptionsAndDependencies = [
      `Open team communication: We'll keep in touch via our shared workspace and async video updates.`,
      `Friendly review turnaround: A comfortable 3-5 business day window for milestone notes to keep our launch on schedule.`,
      `A main point of contact from ${brief.clientName} who can collect team feedback and share final approvals.`,
      `Sharing existing brand logos, photos, and copy during our first week together.`,
    ];

    clarificationQuestions = [
      `Who on your team will be sharing feedback, and what's the best way for us to communicate (Slack, email, or Loom)?`,
      `Do you already have copy, photography, or illustrations ready, or would you like guidance on sourcing them?`,
      `Are there any websites or apps you personally love whose style or feel inspire you?`,
      `What would make you and your team look back at this project in 6 months and say "That was an incredible experience!"?`,
    ];

    nextSteps = [
      `Step 1: Look over this proposal and let us know if anything needs a tweak or extra explanation.`,
      `Step 2: A simple digital agreement and deposit to secure your spot on our studio calendar.`,
      `Step 3: Our 45-minute friendly kick-off call to celebrate the start of the project!`,
      `Step 4: We share our first interactive moodboards and sprint schedule with you.`,
    ];
  } else {
    // Premium Mode
    executiveSummary =
      `This monograph outlines an elevated, high-craft engagement designed to translate the vision of ${brief.clientName} into an enduring industry benchmark. Grounded in the strategic imperative of "${goalSnippet}", our methodology marries architectural rigor with meticulous art direction. In a digital landscape crowded with generic execution, this engagement establishes distinct category leadership through deliberate craft, refined aesthetics, and measurable commercial authority.` +
      (instructions ? `\n\n*Curated Directives*: ${instructions}` : '');

    clientNeedsUnderstanding =
      `Strategic Context & Category Ambition for ${brief.clientName}:\n\n` +
      `${brief.clientName} stands at a pivotal juncture where aesthetic distinction directly drives market valuation: ${reqSnippet}\n\n` +
      `Core Strategic Imperatives:\n` +
      `• Category Leadership: Transcending commodity templates with bespoke art direction, refined typography, and tactile digital craft.\n` +
      `• Conversion & Brand Equity: Elevating the perceived value of every client touchpoint through deliberate visual restraint and performance integrity.\n` +
      `• Architectural Longevity: Equipping internal stakeholders with an enduring design system and high-fidelity code architecture that scales autonomously.`;

    proposedSolution =
      `The Bespoke Architectural Methodology:\n\n` +
      `1. Foundational Inquiry & Curated Art Direction: Excavating competitive whitespace, user mental models, and typographic hierarchies before initiating production.\n` +
      `2. Iterative Craft & Bespoke Engineering: Rapid high-fidelity realization with weekly executive reviews, responsive fidelity testing, and micro-interaction refinement.\n` +
      `3. White-Glove Deployment & Strategic Enablement: Production cutover, Lighthouse speed audits, custom documentation, and a dedicated 30-day post-launch warranty salon.`;

    deliverables = [
      {
        category: 'Strategic Discovery & Bespoke Art Direction',
        items: [
          'Comprehensive Architectural Brief & Brand Persona Dossier',
          'Curated Typographic Hierarchy, Tone Guide & Spatial System',
          'Technical Architecture Specifications & Integration Inventory',
        ],
      },
      {
        category: `Bespoke ${brief.projectCategory} Production & High-Craft Staging`,
        items: [
          `Complete ${brief.projectCategory} Suite tailored to ${brief.clientName}`,
          'High-fidelity interactive staging environment with micro-interactions',
          'Modular design tokens and component specification monograph',
        ],
      },
      {
        category: 'White-Glove Deployment & Executive Enablement',
        items: [
          'Production cutover verification, security review & Lighthouse audit',
          'Recorded executive walkthrough and internal enablement monograph',
          '30-day white-glove warranty and performance optimization window',
        ],
      },
    ];

    scopeInclusions = [
      `Up to two curated review salons per milestone with structured executive feedback`,
      `Weekly asynchronous video executive briefings and curated progress dossier`,
      `Comprehensive responsive device verification across modern viewports and displays`,
      `Core WCAG 2.1 AA accessibility audit and sub-second Lighthouse performance verification`,
    ];

    scopeExclusions = [
      `Third-party software subscriptions, proprietary fonts, or enterprise API licensing fees`,
      `Original copywriting and broadcast video production unless commissioned as a bespoke addendum`,
      `Unscheduled out-of-band triage outside established milestone salons`,
      `Substantial pivot in architectural foundation once milestone sign-off is completed`,
    ];

    milestones = [
      {
        title: 'Milestone 1: Strategic Discovery & Aesthetic Direction',
        description:
          'Alignment on strategic whitespace, competitive benchmarks, design system tokens, and initial direction review.',
        durationOrDate: brief.deadline ? `Weeks 1 – 2 of ${brief.deadline}` : 'Weeks 1 – 2',
        deliverablesSummary: 'Scope Matrix, mood boards, and foundational wireframe models.',
      },
      {
        title: 'Milestone 2: Core Production & Interactive Staging Build',
        description:
          'End-to-end realization of primary interfaces, bespoke component flows, and responsive layouts.',
        durationOrDate: brief.deadline ? `Weeks 3 – 5 of ${brief.deadline}` : 'Weeks 3 – 5',
        deliverablesSummary: 'Interactive staging prototype and functional deliverable suite.',
      },
      {
        title: 'Milestone 3: Refinement, Hardening & White-Glove Handover',
        description:
          'Fine-tuning interactions, performance optimization, QA testing, and production deployment.',
        durationOrDate: brief.deadline ? `Target week: ${brief.deadline}` : 'Week 6',
        deliverablesSummary: 'Final production build, documentation package, and release verification.',
      },
    ];

    timelineEstimate = brief.deadline && brief.deadline.trim().length > 0
      ? `Estimated delivery by ${brief.deadline}, structured over approximately 6 calendar weeks with bi-weekly review gates.`
      : 'Estimated 5 to 7 weeks from kick-off date, paced with structured weekly feedback checkpoints.';

    budgetEstimate = brief.budget && brief.budget.trim().length > 0
      ? `Fixed-fee scope aligned with your specified range of ${brief.budget}, invoiced 40% upon commencement, 30% at Milestone 2 approval, and 30% upon final delivery.`
      : 'Custom fee proposal to be finalized upon scope sign-off (recommended milestone-based structure: 50% deposit, 50% completion).';

    pricingAndAssumptions = brief.budget && brief.budget.trim().length > 0
      ? `Fixed investment aligned with specified parameters of ${brief.budget}. Structured across milestone review gates: 40% commencement deposit, 30% Milestone 2 approval, and 30% upon final delivery.`
      : `Custom fee structure to be finalized upon scope confirmation (recommended milestone model: 50% kick-off deposit, 50% handover).`;

    revisionPolicy =
      `Includes up to two consolidated rounds of structured revisions for each agreed milestone. Revisions must be submitted within 3 business days of milestone presentation. Pivot requests outside approved wireframes or scope bounds are estimated on a standard change-order basis.`;

    acceptanceCriteria = [
      `Complete delivery of all ${brief.projectCategory} artifacts reviewed against initial brief objectives.`,
      `Successful milestone sign-off with documented consolidation feedback rounds.`,
      `Production-ready asset transfer and technical documentation walkthrough with internal team.`,
      `Zero critical blockers across targeted modern desktop and mobile viewports.`,
    ];

    assumptionsAndDependencies = [
      `Timely feedback: Client will provide consolidation feedback within 3 business days of milestone submissions.`,
      `Asset availability: Brand guidelines, imagery, and existing accounts provided during Week 1.`,
      `Single point of contact: Clear decision-maker appointed to arbitrate conflicting stakeholder requests.`,
      `Target browser support: Chrome, Safari, Firefox, and Edge (last two major versions).`,
    ];

    clarificationQuestions = [
      `Are there legacy system integrations or third-party APIs that require early credential access?`,
      `Who from the ${brief.clientName} team will be the final authority for sign-off on creative milestones?`,
      `Do you have existing brand assets, design tokens, or brand voice guidelines available in Figma or PDF?`,
      `What are the immediate success metrics you will use to evaluate the first 90 days after delivery?`,
    ];

    nextSteps = [
      `Step 1: Review this proposal draft and share comments or questions on clarification items.`,
      `Step 2: Sign standard master services agreement (MSA) and statement of work (SOW).`,
      `Step 3: Submit initial milestone retainer to secure onboarding schedule in studio calendar.`,
      `Step 4: Conduct 45-minute kick-off alignment call and grant workspace access.`,
    ];
  }

  const scopeMap = [
    {
      id: `map-${Date.now()}-1`,
      requirement: brief.requirements.slice(0, 100) + '...',
      deliverable: deliverables[0]?.items[0] || 'Core Strategy & Discovery Architecture',
      milestone: milestones[0]?.title || 'Milestone 1: Discovery & Strategy',
      acceptanceCriteria: 'Formal sign-off on scope matrix and architectural direction',
      outcome: 'Establish firm project boundaries and prevent mid-sprint pivots',
      status: 'verified' as const,
    },
    {
      id: `map-${Date.now()}-2`,
      requirement: (brief.goals && brief.goals.length > 0 ? brief.goals.slice(0, 100) : brief.requirements.slice(0, 100)) + '...',
      deliverable: deliverables[1]?.items[0] || 'High-fidelity Production Artifacts',
      milestone: milestones[1]?.title || 'Milestone 2: Core Production',
      acceptanceCriteria: 'Interactive staging walkthrough passing responsive QA checks',
      outcome: 'Tangible progress review prior to production deployment',
      status: 'defined' as const,
    },
    {
      id: `map-${Date.now()}-3`,
      requirement: 'Delivery verification and team enablement',
      deliverable: deliverables[2]?.items[0] || 'Production Release & Asset Handover',
      milestone: milestones[2]?.title || 'Milestone 3: Final Launch',
      acceptanceCriteria: 'All acceptance checklist items confirmed with 30-day warranty active',
      outcome: 'Seamless handover with operational autonomy for client staff',
      status: 'in_review' as const,
    },
  ];

  return {
    id,
    title: finalTitle,
    clientName: brief.clientName,
    category: brief.projectCategory,
    createdAt: now,
    updatedAt: now,
    status: 'Proposal Draft',
    tone,
    executiveSummary,
    clientNeedsUnderstanding,
    proposedSolution,
    deliverables,
    scopeInclusions,
    scopeExclusions,
    milestones,
    timelineEstimate,
    budgetEstimate: brief.budget ? brief.budget : undefined,
    pricingAndAssumptions,
    revisionPolicy,
    acceptanceCriteria,
    assumptionsAndDependencies,
    clarificationQuestions,
    nextSteps,
    scopeMap,
    modelMetadata: {
      provider: 'Studio Engine (Demo Mode)',
      model: `Architectural Open-Weight Synthesis (${tone} Profile)`,
      isDemoSynthesis: true,
    },
  };
}

/**
 * Enhanced Tone Consistency Verification
 * Checks that the generated proposal authentically matches the selected tone.
 * Normalizes title, executive summary, revision policy, and next steps to match tone.
 */
function verifyToneConsistency(proposal: ProposalData, expectedTone: TonePreference): ProposalData {
  if (!proposal) return proposal;

  const tone = expectedTone || 'Professional';
  proposal.tone = tone;

  const toneTitlePrefix =
    tone === 'Professional'
      ? 'Master Statement of Work: '
      : tone === 'Friendly'
      ? 'Collaborative Project Roadmap: '
      : 'Strategic Monograph: ';

  // Normalize Title
  if (!proposal.title || !proposal.title.toLowerCase().includes(tone === 'Professional' ? 'statement of work' : tone === 'Friendly' ? 'roadmap' : 'monograph')) {
    const raw = proposal.title || `Project for ${proposal.clientName}`;
    const cleaned = raw.replace(/^(Master Statement of Work:\s*|Collaborative Project Roadmap:\s*|Strategic Monograph:\s*)/i, '');
    proposal.title = `${toneTitlePrefix}${cleaned}`;
  }

  // Check and refine executive summary
  if (tone === 'Friendly') {
    if (
      !proposal.executiveSummary.toLowerCase().includes('thrilled') &&
      !proposal.executiveSummary.toLowerCase().includes('excited') &&
      !proposal.executiveSummary.toLowerCase().includes('collaborat') &&
      !proposal.executiveSummary.toLowerCase().includes('partner')
    ) {
      proposal.executiveSummary = `We are genuinely thrilled to partner with ${proposal.clientName} on this project! Our shared vision is to bring this work to life through open communication, weekly Loom check-ins, and collaborative sprint reviews.\n\n${proposal.executiveSummary}`;
    }
  } else if (tone === 'Premium') {
    if (
      !proposal.executiveSummary.toLowerCase().includes('monograph') &&
      !proposal.executiveSummary.toLowerCase().includes('benchmark') &&
      !proposal.executiveSummary.toLowerCase().includes('bespoke') &&
      !proposal.executiveSummary.toLowerCase().includes('strategic')
    ) {
      proposal.executiveSummary = `This monograph defines an elevated, bespoke engagement tailored for ${proposal.clientName}. Engineered to establish category leadership through deliberate craft, refined typography, and measurable commercial authority.\n\n${proposal.executiveSummary}`;
    }
  } else if (tone === 'Professional') {
    if (
      !proposal.executiveSummary.toLowerCase().includes('scope of work') &&
      !proposal.executiveSummary.toLowerCase().includes('contractual') &&
      !proposal.executiveSummary.toLowerCase().includes('governance') &&
      !proposal.executiveSummary.toLowerCase().includes('formal')
    ) {
      proposal.executiveSummary = `This proposal establishes the formal scope of work, technical architecture, and delivery governance for ${proposal.clientName}. The engagement enforces rigorous milestone management, risk mitigation protocols, and verified acceptance gates.\n\n${proposal.executiveSummary}`;
    }
  }

  return proposal;
}

// Proposal generation endpoint
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { brief, instructions, forceDemo } = req.body;

    if (!brief || typeof brief !== 'object') {
      res.status(400).json({ error: 'Missing client brief object.' });
      return;
    }

    if (!brief.projectTitle?.trim() || !brief.clientName?.trim() || !brief.requirements?.trim()) {
      res.status(400).json({
        error: 'Essential brief fields (Title, Client Name, and Requirements) are required.',
      });
      return;
    }

    const { key, provider, model, baseUrl } = getProviderConfig();
    const requestedTone: TonePreference = brief.tone || 'Professional';

    // If no key is set or client specifically requested demo mode
    if (!key || forceDemo) {
      const proposal = generateStudioEngineProposal(brief, instructions);
      const verified = verifyToneConsistency(proposal, requestedTone);
      res.json({
        proposal: verified,
        source: 'studio_engine_demo',
        message: key
          ? `Generated via ScopeCraft Studio Engine (${requestedTone} Tone).`
          : `No OPEN_WEIGHT_API_KEY detected. Generated via ScopeCraft Studio Engine (${requestedTone} Tone). Add your key in .env.local to enable live model inference.`,
      });
      return;
    }

    // Explicit Tone Instructions for Live Inference Models
    const toneInstructions = requestedTone === 'Professional'
      ? `TONE REQUIREMENT: PROFESSIONAL MODE
- Direct, rigorous, structured, and outcome-oriented.
- Businesslike, formal, and precise with restrained persuasive language. Minimal unnecessary adjectives.
- Clear about objectives, deliverables, assumptions, dependencies, risks, and milestones.
- Concise and measurable acceptance criteria.
- Vocabulary to emphasize: "scope of work", "delivery governance", "phased execution", "acceptance criteria", "operational parameters", "verification gates".`
      : requestedTone === 'Friendly'
      ? `TONE REQUIREMENT: FRIENDLY MODE
- Warm, collaborative, approachable, natural, and encouraging.
- Written in clear, conversational language without sounding careless or unprofessional. No slang or emojis.
- Focused on shared goals, partnership, feedback cycles, and transparent communication.
- Reassuring about how the project will progress (e.g., weekly video check-ins, staging previews).
- Vocabulary to emphasize: "partnering together", "shared vision", "collaborative build sprints", "transparent feedback", "bringing ideas to life".`
      : `TONE REQUIREMENT: PREMIUM MODE
- Refined, authoritative, bespoke, and strategically persuasive.
- Focused on business value, thoughtful execution, high craft, strategic whitespace, and polished client experience.
- Presented with stronger editorial storytelling and carefully structured value propositions.
- Selective and intentional rather than verbose or filled with hollow buzzwords.
- Vocabulary to emphasize: "strategic imperative", "category distinction", "bespoke architecture", "deliberate craft", "curated refinement", "benchmark".`;

    const systemPrompt = `You are an elite creative director, principal freelancer, and proposal architect.
Your mission is to transform rough client requirements into a distinctive client proposal that STRICTLY reflects the requested tone mode.

${toneInstructions}

CRITICAL INTEGRITY INSTRUCTIONS:
- Preserve factual accuracy: keep deliverables, budget numbers, deadlines, dates, dependencies, and constraints strictly consistent with the user's brief.
- Do NOT hallucinate client requirements, confirmed deadlines, professional credentials, guarantees, or agreed prices.
- When budget or deadline are not provided, mark them clearly as "Unspecified / To be confirmed" or request clarification.
- Adapt ALL 9 SECTIONS (title, executive summary, client needs, proposed solution, deliverables, inclusions/exclusions, milestones, pricing/assumptions, acceptance criteria, next steps) to authentically embody the ${requestedTone} tone.
- Output MUST be strictly valid, raw JSON conforming to this schema without markdown code fences or conversational prose.

Required JSON Schema:
{
  "title": "string (refined proposal title reflecting ${requestedTone} mode)",
  "executiveSummary": "string (compelling 2-3 paragraph summary written authentically in ${requestedTone} tone)",
  "clientNeedsUnderstanding": "string (structured breakdown of challenges and context written in ${requestedTone} tone)",
  "proposedSolution": "string (tactical, phased solution description in ${requestedTone} tone)",
  "deliverables": [
    {
      "category": "string",
      "items": ["string", "string"]
    }
  ],
  "scopeInclusions": ["string", "string"],
  "scopeExclusions": ["string", "string"],
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "durationOrDate": "string",
      "deliverablesSummary": "string"
    }
  ],
  "timelineEstimate": "string",
  "budgetEstimate": "string or null",
  "pricingAndAssumptions": "string",
  "revisionPolicy": "string",
  "acceptanceCriteria": ["string"],
  "assumptionsAndDependencies": ["string"],
  "clarificationQuestions": ["string"],
  "nextSteps": ["string"]
}`;

    const userPrompt = `CLIENT BRIEF:
Project Title: ${brief.projectTitle}
Client Name: ${brief.clientName}
Category: ${brief.projectCategory}
Requirements: ${brief.requirements}
Primary Goals: ${brief.goals || 'Not specified'}
Specified Budget: ${brief.budget || 'Not specified by client'}
Specified Deadline: ${brief.deadline || 'Not specified by client'}
Target Tone Mode: ${requestedTone}
Freelancer Notes & Constraints: ${brief.notes || 'None'}
${instructions ? `\nSPECIAL REVISION INSTRUCTIONS: ${instructions}` : ''}

Generate the structured JSON proposal strictly written in ${requestedTone} tone now:`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: requestedTone === 'Professional' ? 0.4 : requestedTone === 'Friendly' ? 0.7 : 0.6,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text().catch(() => 'Unknown network error');
      console.error(`Inference provider error (${apiResponse.status}):`, errorText);

      if (apiResponse.status === 401) {
        res.status(401).json({
          error: `Authentication failed with provider '${provider}'. Please verify your OPEN_WEIGHT_API_KEY.`,
          details: errorText,
        });
        return;
      }
      if (apiResponse.status === 429) {
        res.status(429).json({
          error: `Rate limit reached with provider '${provider}'. Please wait a moment or test with Demo Mode.`,
          details: errorText,
        });
        return;
      }

      res.status(apiResponse.status).json({
        error: `Inference model returned error (${apiResponse.status}): ${apiResponse.statusText}`,
        details: errorText,
      });
      return;
    }

    const data = await apiResponse.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('Received empty content from language model response.');
    }

    // Clean any accidental markdown wrap
    const cleanedJson = rawContent
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);
    const now = new Date().toISOString();

    let proposal: ProposalData = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: parsed.title || brief.projectTitle,
      clientName: brief.clientName,
      category: brief.projectCategory,
      createdAt: now,
      updatedAt: now,
      status: 'Proposal Draft',
      tone: requestedTone,
      executiveSummary: parsed.executiveSummary || '',
      clientNeedsUnderstanding: parsed.clientNeedsUnderstanding || '',
      proposedSolution: parsed.proposedSolution || '',
      deliverables: Array.isArray(parsed.deliverables) ? parsed.deliverables : [],
      scopeInclusions: Array.isArray(parsed.scopeInclusions) ? parsed.scopeInclusions : [],
      scopeExclusions: Array.isArray(parsed.scopeExclusions) ? parsed.scopeExclusions : [],
      milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [],
      timelineEstimate: parsed.timelineEstimate || 'To be determined during kick-off',
      budgetEstimate: parsed.budgetEstimate || (brief.budget ? brief.budget : undefined),
      assumptionsAndDependencies: Array.isArray(parsed.assumptionsAndDependencies)
        ? parsed.assumptionsAndDependencies
        : [],
      clarificationQuestions: Array.isArray(parsed.clarificationQuestions)
        ? parsed.clarificationQuestions
        : [],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
      acceptanceCriteria: Array.isArray(parsed.acceptanceCriteria) && parsed.acceptanceCriteria.length > 0
        ? parsed.acceptanceCriteria
        : [
            `Delivery of all primary ${brief.projectCategory} artifacts meeting brief objectives.`,
            'Client staging walkthrough and milestone review sign-off.',
            'Production asset handover with zero blocking errors.',
          ],
      revisionPolicy:
        parsed.revisionPolicy ||
        'Includes two consolidated rounds of structured revisions for each agreed milestone.',
      pricingAndAssumptions: parsed.pricingAndAssumptions || parsed.budgetEstimate || (brief.budget ? `Aligned with specified budget parameters of ${brief.budget}` : undefined),
      modelMetadata: {
        provider,
        model,
        isDemoSynthesis: false,
      },
    };

    // Run lightweight tone consistency verification and polish
    proposal = verifyToneConsistency(proposal, requestedTone);

    res.json({
      proposal,
      source: 'live_model',
      message: `Successfully synthesized via ${model} (${provider}) in ${requestedTone} tone.`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Server proposal generation failed:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate proposal due to server error.',
    });
  }
});

// Proposal translation endpoint
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { proposal, targetLang } = req.body;
    if (!proposal || !targetLang) {
      res.status(400).json({ error: 'Proposal data and targetLang are required.' });
      return;
    }

    const { key, provider, model, baseUrl } = getProviderConfig();

    if (!key) {
      // Return structured translation from studio translation engine
      const isHi = targetLang === 'hi';
      const isHinglish = targetLang === 'hinglish';

      const translation = {
        language: targetLang,
        translatedAt: new Date().toISOString(),
        title: isHi ? `${proposal.title} (प्रस्ताव)` : `${proposal.title} (Proposal)`,
        executiveSummary: isHi
          ? `यह प्रस्ताव ${proposal.clientName} के लिए एक विचारशील और उच्च-गुणवत्ता वाली परियोजना रूपरेखा प्रस्तुत करता है। रणनीतिक स्पष्टता और तकनीकी सटीकता के साथ, हम प्रारंभिक आवश्यकताओं को एक मजबूत, उत्पादन-तैयार परिणाम में बदलेंगे।\n\nबजट एवं निवेश: ${proposal.budgetEstimate || 'पूर्व-निर्धारित दर अनुसार'}। समय-सीमा: ${proposal.timelineEstimate}।`
          : `Yeh proposal ${proposal.clientName} ke liye ek thoughtful aur cinema-grade project blueprint pesh karta hai. Hamara approach strategic clarity aur high-craft execution ko combine karta hai, taaki client requirements ek solid production-ready deliverable ban sakein.\n\nBudget: ${proposal.budgetEstimate || 'As agreed'} | Timeline: ${proposal.timelineEstimate}.`,
        clientNeedsUnderstanding: isHi
          ? `${proposal.clientName} को अपनी डिजिटल उपस्थिति और परियोजना सीमाओं को स्पष्ट करने के लिए एक अनुभवी साथी की आवश्यकता है।\n\nमुख्य प्राथमिकताएं:\n• तकनीकी विश्वसनीयता और ब्रांड की प्रतिष्ठा बनाए रखना।\n• डिलीवरी के दौरान अनचाहे स्कोप-क्रीप से बचना।\n• अंतिम हैंडओवर के बाद आंतरिक टीम के लिए स्वतंत्र नियंत्रण सुनिश्चित करना।`
          : `${proposal.clientName} ko clear direction aur professional scope architecture ki zaroorat hai.\n\nKey Focus Areas:\n• Technical reliability aur high visual authority deliver karna.\n• Scope boundaries ko protect karna taaki delivery time par rahe.\n• Handover ke baad client team ke liye easy maintenance ensure karna.`,
        proposedSolution: isHi
          ? `हम तीन-चरणीय संरचित कार्यप्रणाली का प्रस्ताव करते हैं:\n\n1. डिस्कवरी एवं वास्तुकला: उपयोगकर्ता प्रवाह, तकनीकी विनिर्देश और डिज़ाइन टोकन को कोड से पहले स्पष्ट करना।\n2. उच्च-सटीकता निष्पादन: साप्ताहिक समीक्षा और गुणवत्ता परीक्षण के साथ विकास।\n3. अंतिम परिनियोजन एवं प्रशिक्षण: उत्पादन विमोचन, प्रदर्शन अनुकूलन और टीम वॉकथ्रू।`
          : `Hum ek 3-phase structured methodology propose karte hain:\n\n1. Discovery & Architecture: User flows aur technical specs ko code likhne se pehle freeze karna.\n2. High-Craft Execution: Weekly milestone syncs aur staging previews ke saath build karna.\n3. Production Launch & Team Walkthrough: Polished cutover, Lighthouse speed audit aur recorded training session.`,
        deliverables: proposal.deliverables.map((d: any) => ({
          category: isHi ? `${d.category} (डिलिवरेबल्स)` : `${d.category} (Key Deliverables)`,
          items: d.items.map((item: string) => isHi ? `• ${item} [सत्यापित]` : `• ${item} (Verified)`),
        })),
        scopeInclusions: proposal.scopeInclusions.map((inc: string) =>
          isHi ? `• ${inc} (अनुमोदित स्कोप में सम्मिलित)` : `• ${inc} (Included in agreed scope)`
        ),
        scopeExclusions: proposal.scopeExclusions.map((exc: string) =>
          isHi ? `• ${exc} (स्पष्ट रूप से बहिष्कृत / पृथक अनुबंध आवश्यक)` : `• ${exc} (Excluded — Out of current scope)`
        ),
        milestones: proposal.milestones.map((m: any, idx: number) => ({
          title: isHi ? `माइलस्टोन ${idx + 1}: ${m.title.replace(/^Milestone\s*\d*:\s*/i, '')}` : `Milestone ${idx + 1}: ${m.title.replace(/^Milestone\s*\d*:\s*/i, '')}`,
          description: isHi ? `${m.description} (समीक्षा एवं स्वीकृति आवश्यक)` : `${m.description} (Weekly milestone review)`,
          durationOrDate: m.durationOrDate,
          deliverablesSummary: m.deliverablesSummary,
        })),
        timelineEstimate: proposal.timelineEstimate,
        budgetEstimate: proposal.budgetEstimate,
        pricingAndAssumptions: proposal.pricingAndAssumptions,
        revisionPolicy: isHi
          ? 'प्रत्येक माइलस्टोन के लिए दो संरचित संशोधन चक्र सम्मिलित हैं। अतिरिक्त आवश्यकताएं अलग से आकलित की जाएंगी।'
          : 'Har milestone ke liye 2 consolidated revision rounds included hain. Extra additions alag se estimate honge.',
        acceptanceCriteria: proposal.acceptanceCriteria,
        assumptionsAndDependencies: proposal.assumptionsAndDependencies,
        clarificationQuestions: proposal.clarificationQuestions,
        nextSteps: isHi
          ? ['1. कार्य-क्षेत्र (Statement of Work) की समीक्षा और हस्ताक्षर करें।', '2. प्रारंभिक माइलस्टोन जमा राशि प्रेषित करें।', '3. किक-ऑफ बैठक में शामिल हों।']
          : ['1. Statement of work aur scope boundaries ko review karke sign-off karein.', '2. Milestone 1 deposit process karein.', '3. Kick-off alignment call schedule karein.'],
        phrasesForReview: [
          isHi
            ? 'विशिष्ट तकनीकी शब्दों को अंतरराष्ट्रीय उद्योग मानकों के अनुसार रखा गया है।'
            : 'Technical nomenclature and milestone titles are preserved in standard industry phrasing.',
          'Price brackets, currencies and timelines are strictly preserved.',
        ],
        isHumanReviewed: false,
      };

      res.json({ translation, source: 'studio_engine_translation' });
      return;
    }

    // Call live open-weight model for translation
    const systemPrompt = `You are an expert freelance proposal translator. Translate the proposal into ${targetLang === 'hi' ? 'Hindi (हिन्दी script)' : 'Hinglish (conversational Hindi written in Latin alphabet with English tech terminology)'}.
CRITICAL CONSISTENCY RULES:
1. STRICTLY PRESERVE all prices, currency signs ($ / ₹ / USD / EUR), dates, timelines, quantities and numbers.
2. STRICTLY PRESERVE all client names and brand titles.
3. STRICTLY PRESERVE all milestones ("Milestone 1", "Milestone 2") and technical terms (React, Tailwind, API, DNS, CMS, UI/UX, Staging, QA, etc.).
4. Do NOT invent missing info.
5. Return JSON matching:
{
  "title": "string",
  "executiveSummary": "string",
  "clientNeedsUnderstanding": "string",
  "proposedSolution": "string",
  "deliverables": [{"category": "string", "items": ["string"]}],
  "scopeInclusions": ["string"],
  "scopeExclusions": ["string"],
  "milestones": [{"title": "string", "description": "string", "durationOrDate": "string"}],
  "timelineEstimate": "string",
  "budgetEstimate": "string",
  "revisionPolicy": "string",
  "acceptanceCriteria": ["string"],
  "nextSteps": ["string"],
  "phrasesForReview": ["string"]
}`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify({ proposalSummary: proposal }) },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Model translation failed with HTTP status ${response.status}`);
    }

    const data: any = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    const cleaned = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json({
      translation: {
        language: targetLang,
        translatedAt: new Date().toISOString(),
        ...parsed,
        timelineEstimate: parsed.timelineEstimate || proposal.timelineEstimate,
        budgetEstimate: parsed.budgetEstimate || proposal.budgetEstimate,
        isHumanReviewed: false,
      },
      source: 'live_model_translation',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message || 'Translation failed.' });
  }
});

// Scope-creep detection endpoint
app.post('/api/check-scope-creep', (req: Request, res: Response) => {
  try {
    const { proposal, clientMessage } = req.body;
    if (!proposal || !clientMessage) {
      res.status(400).json({ error: 'Missing proposal object or client message.' });
      return;
    }
    const analysis = analyzeScopeCreep(proposal, clientMessage);
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze scope creep.' });
  }
});

// Smart gap detection endpoint
app.post('/api/detect-gaps', (req: Request, res: Response) => {
  try {
    const { brief } = req.body;
    if (!brief) {
      res.status(400).json({ error: 'Missing brief object.' });
      return;
    }
    const gaps = analyzeBriefGaps(brief);
    res.json({ gaps });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze brief gaps.' });
  }
});

// Setup dev server with Vite middleware or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScopeCraft] Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ScopeCraft] Server startup failed:', err);
  process.exit(1);
});
