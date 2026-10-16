import { ProjectBrief, ProposalData, TonePreference, ScopeMapItem } from '../types/proposal';

// Determine Open-Weight provider configuration
export function getProviderConfig() {
  const env = typeof process !== 'undefined' ? process.env : ({} as Record<string, string>);
  const key = env.OPEN_WEIGHT_API_KEY || '';
  let provider = env.OPEN_WEIGHT_PROVIDER || '';
  let model = env.OPEN_WEIGHT_MODEL || '';
  let baseUrl = env.OPEN_WEIGHT_BASE_URL || '';

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

// Tone writing instructions and vocabulary profiles
export const TONE_PROFILES = {
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

/**
 * Intelligent Studio Engine Synthesis
 * Generates context-aware, varied, and genuinely distinct proposals based on brief inputs and selected tone.
 */
export function generateStudioEngineProposal(brief: ProjectBrief, instructions?: string): ProposalData {
  const now = new Date().toISOString();
  const id = `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const tone: TonePreference = brief.tone || 'Professional';

  // Seed for deterministic yet varied variation across multiple generations
  const variationSeed = Math.floor(Math.random() * 3);

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

  const goalSnippet =
    brief.goals && brief.goals.trim().length > 0
      ? brief.goals.trim()
      : `advance the digital capabilities and commercial presence of ${brief.clientName}`;

  const reqSnippet =
    brief.requirements && brief.requirements.trim().length > 0
      ? brief.requirements.trim()
      : 'defined functional and creative parameters';

  if (tone === 'Professional') {
    const openings = [
      `This proposal establishes the formal scope of work, technical architecture, and delivery governance for ${brief.clientName}. Engineered around the objective of "${goalSnippet}", the engagement enforces rigorous milestone management, risk mitigation protocols, and verified acceptance gates. Our methodology pairs operational discipline with precise technical execution, ensuring that all initial requirements are translated into a robust, production-ready release within agreed parameters.`,
      `This Statement of Work outlines a structured, phased execution plan to fulfill the technical and business objectives of ${brief.clientName}. With primary focus on "${goalSnippet}", our delivery model prioritizes clear milestone boundaries, comprehensive quality assurance, and formal verification gates. All requirements are systematically addressed to deliver measurable outcomes without scope ambiguity.`,
      `Prepared specifically for ${brief.clientName}, this proposal establishes the formal baseline, deliverable architecture, and acceptance criteria required to achieve "${goalSnippet}". Operating through milestone-based verification, this engagement provides operational clarity, defined risk controls, and predictable scheduling for your internal team.`,
    ];
    executiveSummary = openings[variationSeed] + (instructions ? `\n\n*Special Revision Directives*: ${instructions}` : '');

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

    timelineEstimate =
      brief.deadline && brief.deadline.trim().length > 0
        ? `Contractual target completion by ${brief.deadline}, structured over approximately 6 calendar weeks with bi-weekly milestone checkpoints.`
        : 'Estimated 5 to 7 calendar weeks from kick-off date, structured over three distinct verification gates.';

    budgetEstimate =
      brief.budget && brief.budget.trim().length > 0
        ? `Fixed-fee scope aligned with your specified parameter of ${brief.budget}, invoiced 40% upon commencement, 30% at Milestone 2 approval, and 30% upon final delivery.`
        : 'Custom fee proposal to be finalized upon scope confirmation (recommended structure: 50% deposit, 50% handover).';

    pricingAndAssumptions =
      brief.budget && brief.budget.trim().length > 0
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
    const friendlyOpenings = [
      `We are genuinely thrilled at the opportunity to team up with ${brief.clientName} on this project! Our shared vision is to bring "${goalSnippet}" to life through a collaborative, transparent creative partnership. We've mapped out clear, friendly milestones so you always know what to expect, when you'll see progress, and how your feedback directly shapes each iteration. By combining thoughtful design with open communication, we'll turn your ideas into a polished, delightful reality that your audience will love.`,
      `Working together on "${goalSnippet}" is going to be an exciting journey! This roadmap is designed around open communication, shared milestones, and zero guesswork for the ${brief.clientName} team. You'll have regular video walkthroughs and staging previews every step of the way, making the build experience as enjoyable and clear as the final deliverable itself.`,
      `Hello ${brief.clientName}! We've put together this collaborative plan to bring "${goalSnippet}" to life smoothly and thoughtfully. Our approach is built on teamwork, prompt feedback loops, and friendly support. From day one to launch day, you'll always have complete visibility and a supportive partner in your corner.`,
    ];
    executiveSummary = friendlyOpenings[variationSeed] + (instructions ? `\n\n*Special Notes from Our Conversation*: ${instructions}` : '');

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

    timelineEstimate =
      brief.deadline && brief.deadline.trim().length > 0
        ? `We'll pace our work to comfortably reach your goal of ${brief.deadline}, with weekly video check-ins so you always feel in control.`
        : 'Estimated 5 to 7 weeks from our kick-off call, paced with friendly weekly milestones.';

    budgetEstimate =
      brief.budget && brief.budget.trim().length > 0
        ? `Transparent pricing shaped around your budget of ${brief.budget}, split comfortably across milestones (40% kick-off deposit, 30% midway review, 30% upon launch).`
        : 'Fair, transparent milestone pricing to be agreed together before we begin (typically 50% deposit, 50% launch).';

    pricingAndAssumptions =
      brief.budget && brief.budget.trim().length > 0
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
    const premiumOpenings = [
      `This monograph outlines an elevated, high-craft engagement designed to translate the vision of ${brief.clientName} into an enduring industry benchmark. Grounded in the strategic imperative of "${goalSnippet}", our methodology marries architectural rigor with meticulous art direction. In a digital landscape crowded with generic execution, this engagement establishes distinct category leadership through deliberate craft, refined aesthetics, and measurable commercial authority.`,
      `Engineered for ${brief.clientName}, this monograph establishes the bespoke creative strategy and architectural framework required to realize "${goalSnippet}". By eschewing off-the-shelf templates in favor of deliberate typography, spatial balance, and performance integrity, this engagement delivers a digital touchpoint of exceptional fidelity and lasting market equity.`,
      `This strategic monograph formalizes the high-touch engagement between our studio and ${brief.clientName}. Focused squarely on "${goalSnippet}", our objective is singular: to create a benchmark artifact of exceptional visual authority and technical durability that elevates your commercial standing.`,
    ];
    executiveSummary = premiumOpenings[variationSeed] + (instructions ? `\n\n*Curated Directives*: ${instructions}` : '');

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
        deliverablesSummary: 'Interactive staging prototype and bespoke deliverable suite.',
      },
      {
        title: 'Milestone 3: Refinement, Hardening & White-Glove Handover',
        description:
          'Final aesthetic tuning, performance audits, production launch cutover, and executive handover briefing.',
        durationOrDate: brief.deadline ? `Final week of ${brief.deadline}` : 'Week 6',
        deliverablesSummary: 'Production release, executive monograph, and verified performance audit.',
      },
    ];

    timelineEstimate =
      brief.deadline && brief.deadline.trim().length > 0
        ? `Deliberately orchestrated for completion by ${brief.deadline}, structured over approximately 6 calendar weeks with bi-weekly milestone checkpoints.`
        : 'Curated 5 to 7 calendar weeks from kick-off date, structured over three distinct verification salons.';

    budgetEstimate =
      brief.budget && brief.budget.trim().length > 0
        ? `Strategic investment aligned with specified parameter of ${brief.budget}, invoiced 40% upon commencement, 30% at Milestone 2 approval, and 30% upon final delivery.`
        : 'Bespoke retainer structure to be finalized upon architectural scoping (recommended model: 50% deposit, 50% handover).';

    pricingAndAssumptions =
      brief.budget && brief.budget.trim().length > 0
        ? `Strategic investment aligned with specified budget of ${brief.budget}. Structured across milestone review gates: 40% commencement deposit, 30% Milestone 2 approval, and 30% upon final delivery.`
        : `Bespoke retainer structure to be finalized upon architectural scoping (recommended model: 50% deposit, 50% handover).`;

    revisionPolicy =
      `Includes two curated revision salons for each agreed milestone. Revisions must be consolidated and delivered within 3 business days of milestone presentation. Pivot requests outside approved specifications are estimated on a standard change-order basis.`;

    acceptanceCriteria = [
      `Art direction and ${brief.projectCategory} artifacts satisfy aesthetic benchmarks and brief requirements.`,
      `Milestone sign-off with documented consolidation feedback rounds.`,
      `Production asset transfer and executive enablement walkthrough completed.`,
      `Flawless responsiveness across all targeted modern viewports and displays.`,
    ];

    assumptionsAndDependencies = [
      `Consolidated executive feedback delivered within 3 business days of milestone presentations.`,
      `Brand assets, access credentials, and third-party integrations provisioned during Week 1.`,
      `Single designated executive stakeholder empowered with final sign-off authority.`,
      `Target viewports include modern high-DPI desktop, tablet, and mobile displays.`,
    ];

    clarificationQuestions = [
      `Who holds final executive sign-off authority for aesthetic and technical milestones?`,
      `Are there proprietary fonts, legacy software, or third-party APIs requiring early provisioning?`,
      `What aesthetic benchmarks or competitor examples best represent the standard of polish desired?`,
      `What strategic business outcomes will determine the ultimate commercial success of this engagement?`,
    ];

    nextSteps = [
      `Step 1: Review this strategic monograph and confirm alignment on scope boundaries.`,
      `Step 2: Execute master services agreement (MSA) and statement of work (SOW).`,
      `Step 3: Remit commencement retainer to secure studio production window.`,
      `Step 4: Convene 45-minute executive briefing salon to formalize discovery sprint.`,
    ];
  }

  const scopeMap: ScopeMapItem[] = [
    {
      id: `map-${Date.now()}-1`,
      requirement: reqSnippet.slice(0, 80) || 'Initial Client Requirements',
      deliverable: deliverables[0]?.items[0] || 'Discovery & Specifications',
      milestone: milestones[0]?.title || 'Milestone 1',
      acceptanceCriteria: acceptanceCriteria[0] || 'Initial requirements verified',
      outcome: 'Clear structural alignment and frozen technical specifications',
      status: 'approved' as const,
    },
    {
      id: `map-${Date.now()}-2`,
      requirement: goalSnippet.slice(0, 80) || 'Core Project Goals',
      deliverable: deliverables[1]?.items[0] || 'Core Production Build',
      milestone: milestones[1]?.title || 'Milestone 2',
      acceptanceCriteria: acceptanceCriteria[1] || 'Interactive build approval',
      outcome: 'Interactive staging prototype ready for client review',
      status: 'in_progress' as const,
    },
    {
      id: `map-${Date.now()}-3`,
      requirement: 'Delivery verification and team enablement',
      deliverable: deliverables[2]?.items[0] || 'Production Release & Asset Handover',
      milestone: milestones[2]?.title || 'Milestone 3',
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
export function verifyToneConsistency(proposal: ProposalData, expectedTone: TonePreference): ProposalData {
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
  const hasExpectedTerm =
    tone === 'Professional'
      ? proposal.title.toLowerCase().includes('statement of work')
      : tone === 'Friendly'
      ? proposal.title.toLowerCase().includes('roadmap')
      : proposal.title.toLowerCase().includes('monograph');

  if (!proposal.title || !hasExpectedTerm) {
    const raw = proposal.title || `Project for ${proposal.clientName}`;
    const cleaned = raw.replace(
      /^(Master Statement of Work:\s*|Collaborative Project Roadmap:\s*|Strategic Monograph:\s*)/i,
      ''
    );
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
