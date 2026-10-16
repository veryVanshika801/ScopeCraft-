/**
 * Scope Change Time Machine Comparison Engine
 * Analyzes differences between original brief, agreed proposal scope, and incoming client requests.
 */

import { ProjectBrief, ProposalData, ScopeChangeItem, ScopeTimeMachineComparison } from '../types/proposal';

export function compareScopeInTimeMachine(
  brief: ProjectBrief,
  proposal: ProposalData,
  newClientRequest: string
): ScopeTimeMachineComparison {
  const reqLower = newClientRequest.toLowerCase().trim();
  const changes: ScopeChangeItem[] = [];

  // Helper to find affected deliverables
  const findAffectedDeliverables = (keywords: string[]): string[] => {
    const hits: string[] = [];
    proposal.deliverables.forEach((delivGroup) => {
      delivGroup.items.forEach((item) => {
        if (keywords.some((kw) => item.toLowerCase().includes(kw))) {
          hits.push(item);
        }
      });
    });
    return hits.length > 0 ? hits : [proposal.deliverables[0]?.items[0] || 'Core Project Architecture'];
  };

  // Helper to find affected milestones
  const findAffectedMilestones = (keywords: string[]): string[] => {
    const hits = proposal.milestones.filter((m) =>
      keywords.some((kw) => m.title.toLowerCase().includes(kw) || m.description.toLowerCase().includes(kw))
    );
    return hits.length > 0 ? hits.map((m) => m.title) : [proposal.milestones[proposal.milestones.length - 1]?.title || 'Final Milestone'];
  };

  // 1. Check for Added Requirements
  const additionKeywords = [
    'also add', 'can we include', 'new feature', 'add an', 'support for', 'additional page',
    'portal', 'checkout', 'booking', 'blog', 'analytics', 'dashboard', 'integration', 'export', 'cms'
  ];
  if (additionKeywords.some((kw) => reqLower.includes(kw))) {
    const affected = findAffectedDeliverables(['feature', 'page', 'build', 'template', 'integration']);
    const affectedM = findAffectedMilestones(['staging', 'build', 'launch', 'phase']);
    changes.push({
      id: 'change-added-1',
      category: 'added_requirements',
      title: 'Newly Proposed Capabilities or Feature Expansion',
      description: `Client requested additions beyond the baseline brief: "${newClientRequest.slice(0, 140)}..."`,
      whyItMatters: 'Adds new user workflows and architectural components not accounted for in initial milestone velocity.',
      affectedDeliverables: affected,
      affectedMilestones: affectedM,
      estimatedEffortImpact: 'Significant (1-2 weeks)',
      acceptanceCriteriaImpact: 'Requires authoring new validation criteria and staging test passes for the added capability.',
    });
  }

  // 2. Check for Removed Requirements
  const removalKeywords = ['remove', 'cancel', 'drop', 'no longer need', 'skip', 'take out', 'without', 'omit'];
  if (removalKeywords.some((kw) => reqLower.includes(kw))) {
    changes.push({
      id: 'change-removed-1',
      category: 'removed_requirements',
      title: 'De-scoped Feature or Sub-Component',
      description: 'Client indicates readiness to drop or defer specific modules to save time or budget.',
      whyItMatters: 'Frees up sprint capacity but may alter downstream architectural dependencies already in progress.',
      affectedDeliverables: [proposal.deliverables[0]?.items[0] || 'Modular Deliverable'],
      affectedMilestones: [proposal.milestones[0]?.title || 'Milestone 1'],
      estimatedEffortImpact: 'Low (1-2 days)',
      acceptanceCriteriaImpact: 'Remove associated test cases from acceptance checklist.',
    });
  }

  // 3. Check for Changed Expectations (Schedule, Platform, or Tech Direction)
  const changeExpectKeywords = [
    'faster', 'urgent', 'tighten deadline', 'earlier', 'asap', 'next week', 'switch to', 'change the tech',
    'instead of', 'rebrand', 'completely redesign', 'pivoting', 'direction change'
  ];
  if (changeExpectKeywords.some((kw) => reqLower.includes(kw))) {
    changes.push({
      id: 'change-expected-1',
      category: 'changed_expectations',
      title: 'Compressed Delivery Cadence or Paradigm Shift',
      description: 'The requested schedule acceleration or design pivot alters foundational project assumptions.',
      whyItMatters: 'Compressing milestone timelines without reducing scope risks quality degradation or overtime hours.',
      affectedDeliverables: proposal.deliverables.flatMap((d) => d.items.slice(0, 2)),
      affectedMilestones: proposal.milestones.map((m) => m.title),
      estimatedEffortImpact: 'Moderate (3-5 days)',
      acceptanceCriteriaImpact: 'QA review cycle must be consolidated or milestone gates re-sequenced.',
    });
  }

  // 4. Check for Potentially Out-of-Scope Requests
  const outOfScopeKeywords = [
    'manage ads', 'ad spend', 'ppc', 'marketing campaign', 'cad', '3d model', 'die-line', 'manufacturing',
    'video shoot', 'photographer', 'app store', 'native ios', 'hardware', 'webrtc', 'zoom', 'insurance',
    'legal contract', 'vpat certification', '24/7 support', 'hosting server management'
  ];
  if (outOfScopeKeywords.some((kw) => reqLower.includes(kw))) {
    changes.push({
      id: 'change-oos-1',
      category: 'potentially_out_of_scope',
      title: 'Discipline or Domain Boundary Expansion',
      description: 'Request spans into third-party logistics, paid ad management, or separate specialized disciplines not in statement of work.',
      whyItMatters: 'Requires distinct skillsets and external tools outside the agreed freelance service boundary.',
      affectedDeliverables: ['Protected Statement of Work Exclusions'],
      affectedMilestones: ['Phase 2 or Separate Retainer Agreement'],
      estimatedEffortImpact: 'Major Architectural Shift',
      acceptanceCriteriaImpact: 'Requires a standalone service agreement or trusted subcontractor partnership.',
    });
  }

  // 5. Check for Unclear Changes Requiring Confirmation
  const unclearKeywords = [
    'make it modern', 'better feel', 'cleaner look', 'some tweaks', 'viral', 'pop',
    'few adjustments', 'etc', 'stuff', 'everything'
  ];
  if (unclearKeywords.some((kw) => reqLower.includes(kw)) || changes.length === 0) {
    changes.push({
      id: 'change-unclear-1',
      category: 'unclear_change',
      title: 'Subjective or Unbounded Specification',
      description: 'The terminology used ("modern", "cleaner", "tweaks") lacks quantifiable acceptance boundaries.',
      whyItMatters: 'Subjective directives without specific mockup benchmarks frequently cause repeated revision cycles.',
      affectedDeliverables: [proposal.deliverables[0]?.items[1] || 'Design System Tokens'],
      affectedMilestones: [proposal.milestones[0]?.title || 'Milestone 1'],
      estimatedEffortImpact: 'Low (1-2 days)',
      acceptanceCriteriaImpact: 'Define 2-3 objective visual reference points before beginning adjustments.',
    });
  }

  // Generate a diplomatic, constructive client response where the freelancer retains full decision agency
  const recommendedResponse = `Hi ${proposal.clientName || 'there'},\n\n` +
    `Thank you for thinking through this and sharing the update! I took a close look at how this fits with our current project plan.\n\n` +
    `Here is a quick look at where things stand:\n` +
    changes.map((c) => `• ${c.title}: ${c.description} (Impact: ${c.estimatedEffortImpact})`).join('\n') + `\n\n` +
    `To keep our upcoming milestone on track without sacrificing craft or deadline certainty, here are two practical ways we can move forward:\n\n` +
    `Option A (Recommended): We can keep our agreed ${proposal.timelineEstimate || 'timeline'} focused on the core deliverables we have already mapped, and schedule this new addition as Phase 2 right after launch.\n\n` +
    `Option B (Scope Swap): If this new requirement is a higher priority than an existing item, we can swap it in place of a secondary deliverable so our overall schedule and budget remain unchanged.\n\n` +
    `Let me know which option feels best for your team, and I will adjust our project tracker accordingly!\n\n` +
    `Warm regards,\nFreelance Studio Lead`;

  const executiveSummary =
    `Comparison of "${proposal.title}" against new incoming request identified ${changes.length} scope variation ${changes.length === 1 ? 'item' : 'items'}. ` +
    `The primary areas impacted are ${changes.map((c) => c.title).slice(0, 2).join(' and ')}.`;

  return {
    originalBriefSummary: brief.requirements || proposal.clientNeedsUnderstanding,
    originalAgreedScope: {
      deliverablesCount: proposal.deliverables.reduce((acc, d) => acc + d.items.length, 0),
      milestonesCount: proposal.milestones.length,
      timeline: proposal.timelineEstimate,
      budget: proposal.budgetEstimate,
      keyDeliverables: proposal.deliverables.flatMap((d) => d.items).slice(0, 5),
    },
    newClientRequest,
    changes,
    executiveSummary,
    recommendedResponse,
  };
}
