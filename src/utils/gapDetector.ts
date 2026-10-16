import { ProjectBrief, BriefGap } from '../types/proposal';

export function analyzeBriefGaps(brief: ProjectBrief): BriefGap[] {
  const gaps: BriefGap[] = [];

  const textToScan = `${brief.requirements} ${brief.goals} ${brief.notes || ''}`.toLowerCase();

  // 1. Technical / Platform Constraints
  const mentionsPlatform =
    textToScan.includes('wordpress') ||
    textToScan.includes('shopify') ||
    textToScan.includes('next.js') ||
    textToScan.includes('webflow') ||
    textToScan.includes('react') ||
    textToScan.includes('figma') ||
    textToScan.includes('hosting');

  if (!mentionsPlatform && (brief.projectCategory === 'Web Development' || brief.projectCategory === 'UI/UX Design')) {
    gaps.push({
      id: 'gap-tech-platform',
      category: 'technical',
      severity: 'moderate',
      title: 'Target Platform & Hosting Undefined',
      description:
        'The brief does not specify where the project will be hosted or what CMS/tech stack is expected. Without this, freelancers risk building on an incompatible environment.',
      recommendation: 'Specify target hosting infrastructure (e.g. WP Engine, Vercel, Shopify, or Webflow).',
      suggestedField: 'notes',
      suggestedText: 'Target hosting environment: Modern Node/Vercel or client-managed cloud hosting. Client handles domain and hosting renewals.',
    });
  }

  // 2. Content & Asset Dependency
  const mentionsContent =
    textToScan.includes('copywriting') ||
    textToScan.includes('content') ||
    textToScan.includes('photography') ||
    textToScan.includes('images') ||
    textToScan.includes('assets provided');

  if (!mentionsContent) {
    gaps.push({
      id: 'gap-content-assets',
      category: 'dependency',
      severity: 'critical',
      title: 'Content & Photography Asset Ownership Unclear',
      description:
        'Clients frequently assume freelancers will write marketing copy and supply stock photos unless stated otherwise. This is the #1 cause of milestone delays.',
      recommendation: 'Clarify whether client provides final written copy and high-resolution photography.',
      suggestedField: 'notes',
      suggestedText: 'Content dependency: Client provides all final marketing text and high-res photography within 5 business days of wireframe sign-off.',
    });
  }

  // 3. Budget Clarity
  if (!brief.budget || brief.budget.trim().length === 0 || brief.budget.toLowerCase().includes('tbd') || brief.budget.toLowerCase().includes('cheap')) {
    gaps.push({
      id: 'gap-budget-missing',
      category: 'budget',
      severity: 'moderate',
      title: 'Unstated or Ambiguous Budget Range',
      description:
        'No budget range was provided. Without a financial anchor, proposal pricing may misalign with the client’s capital expectations.',
      recommendation: 'Define a realistic budget range or milestone bracket to set commercial expectations.',
      suggestedField: 'budget',
      suggestedText: '$6,000 – $9,000 (standard milestone-based bracket)',
    });
  }

  // 4. Deadline & Feedback Turnaround SLA
  if (!brief.deadline || brief.deadline.trim().length === 0 || brief.deadline.toLowerCase().includes('asap')) {
    gaps.push({
      id: 'gap-timeline-vague',
      category: 'timeline',
      severity: 'moderate',
      title: 'Indefinite Delivery Timeline',
      description:
        'Unspecified deadlines or "ASAP" requests create open-ended commitments that make scheduling difficult.',
      recommendation: 'Set an estimated calendar delivery window (e.g., 6 weeks).',
      suggestedField: 'deadline',
      suggestedText: '6 to 8 calendar weeks from kick-off',
    });
  }

  // 5. Decision-maker & Sign-off Authority
  const mentionsApproval =
    textToScan.includes('stakeholder') ||
    textToScan.includes('decision-maker') ||
    textToScan.includes('approval') ||
    textToScan.includes('sign-off');

  if (!mentionsApproval) {
    gaps.push({
      id: 'gap-stakeholder-approval',
      category: 'stakeholder',
      severity: 'advisory',
      title: 'Milestone Approval Authority Unspecified',
      description:
        'Projects with committee approvals often suffer from conflicting stakeholder directives. Appointing a single point of contact prevents review loops.',
      recommendation: 'Designate a single client decision-maker with 3-business-day feedback turnaround SLA.',
      suggestedField: 'notes',
      suggestedText: 'Review SLA: Client appoints single project lead for milestone sign-offs with 3-business-day consolidation feedback window.',
    });
  }

  return gaps;
}
