import { ProposalData, ScopeCreepAnalysis } from '../types/proposal';

export function analyzeScopeCreep(proposal: ProposalData, clientMessage: string): ScopeCreepAnalysis {
  const msgLower = clientMessage.toLowerCase();

  const allExclusions = proposal.scopeExclusions.map((e) => e.toLowerCase());
  const allInclusions = proposal.scopeInclusions.map((i) => i.toLowerCase());
  const allDeliverableItems = proposal.deliverables.flatMap((d) => d.items.map((i) => i.toLowerCase()));

  // Heuristic analysis
  const mentionsEcommerce =
    msgLower.includes('cart') ||
    msgLower.includes('checkout') ||
    msgLower.includes('payment') ||
    msgLower.includes('shop') ||
    msgLower.includes('store') ||
    msgLower.includes('stripe') ||
    msgLower.includes('credit card');

  const mentionsCopywriting =
    msgLower.includes('write the copy') ||
    msgLower.includes('write our articles') ||
    msgLower.includes('write the text') ||
    msgLower.includes('copywriting');

  const mentionsMigration =
    msgLower.includes('migrate') ||
    msgLower.includes('import') ||
    msgLower.includes('database import') ||
    msgLower.includes('blog posts') ||
    msgLower.includes('historical');

  const mentionsSubscription =
    msgLower.includes('subscription') ||
    msgLower.includes('recurring') ||
    msgLower.includes('membership');

  const mentionsMinorTweak =
    msgLower.includes('font') ||
    msgLower.includes('color') ||
    msgLower.includes('typography') ||
    msgLower.includes('headline') ||
    msgLower.includes('padding') ||
    msgLower.includes('spacing') ||
    msgLower.includes('minor change');

  // Check if directly matched in explicit exclusions
  const matchedExclusion = allExclusions.find((exc) => {
    const words = exc.split(' ').filter((w) => w.length > 4);
    return words.some((w) => msgLower.includes(w));
  });

  // Evaluate Verdict
  let verdict: 'within_scope' | 'boundary' | 'out_of_scope' = 'boundary';
  let summary = '';
  const reasoning: string[] = [];
  const relevantSectionsCited: string[] = [];
  let timelineImpact = 'Negligible';
  let budgetImpact = '$0 (Covered under revision buffer)';
  let recommendedResponse = '';

  if (matchedExclusion || (mentionsEcommerce && proposal.category !== 'Web Development') || mentionsSubscription) {
    verdict = 'out_of_scope';
    summary = 'This request represents a substantial scope expansion explicitly excluded or unbudgeted in your initial agreement.';
    if (matchedExclusion) {
      reasoning.push(`Directly conflicts with contracted exclusion: "${matchedExclusion}".`);
      relevantSectionsCited.push('Section 05: Scope Exclusions');
    }
    if (mentionsSubscription || mentionsEcommerce) {
      reasoning.push('Requires additional payment gateways, webhook infrastructure, and recurring billing security compliance.');
      relevantSectionsCited.push('Section 04: Project Deliverables');
    }
    timelineImpact = '+1 to 2 additional calendar weeks';
    budgetImpact = 'Estimated change order: +$1,200 – $2,400 USD';

    recommendedResponse =
      `Hi ${proposal.clientName},\n\n` +
      `Thank you for thinking through this feature! Adding this functionality would definitely elevate the project experience.\n\n` +
      `Looking back at our agreed proposal scope, this capability is currently outside our Phase 1 deliverables (specifically noted in our Exclusions section to keep our primary launch on schedule).\n\n` +
      `We have two great options to handle this seamlessly:\n` +
      `1. We can execute a mini change-order (~$1,400 / +1.5 weeks) and build it directly into Milestone 2.\n` +
      `2. We can preserve our current launch deadline and queue this as our top priority for a dedicated Phase 2 enhancement sprint right after deployment.\n\n` +
      `Let me know which path fits your timeline best and I’ll prep the quick paperwork!`;
  } else if (mentionsMinorTweak) {
    verdict = 'within_scope';
    summary = 'This request falls cleanly within your contracted milestone revision rounds.';
    reasoning.push('Covers visual adjustments, styling tokens, or minor copy polish covered by active milestone feedback gates.');
    relevantSectionsCited.push('Section 05: Scope Inclusions (2 revision rounds per milestone)');
    timelineImpact = 'Zero impact on overall schedule';
    budgetImpact = '$0 (Included in milestone retainer)';

    recommendedResponse =
      `Hi ${proposal.clientName},\n\n` +
      `Sounds great! I have noted these adjustments and will fold them directly into our current milestone revision cycle. You'll see this reflected in our next staging update.`;
  } else {
    // Boundary / grey area
    verdict = 'boundary';
    summary = 'This request touches existing deliverables but significantly expands data volume or technical complexity.';
    if (mentionsMigration) {
      reasoning.push('Content or data migrations exceeding initial sample bounds create unforeseen manual reformatting hours.');
      relevantSectionsCited.push('Section 05: Exclusions & Assumptions');
    } else {
      reasoning.push('While related to the project direction, this was not included in our initial deliverable estimates.');
      relevantSectionsCited.push('Section 04: Project Deliverables');
    }
    timelineImpact = '+3 to 5 business days';
    budgetImpact = 'Estimated delta: +$450 – $800 USD or scope trade-off';

    recommendedResponse =
      `Hi ${proposal.clientName},\n\n` +
      `Thanks for sending this over! While we can certainly accommodate this, the additional volume goes beyond our initial deliverable estimates.\n\n` +
      `To keep our target completion date intact, we could either:\n` +
      `• Swap this in place of another non-critical deliverable in Milestone 2 at no extra cost, or\n` +
      `• Add a modest extension (~$600 / 4 days) to cover the dedicated migration and testing.\n\n` +
      `Which approach would you prefer?`;
  }

  return {
    clientMessage,
    verdict,
    summary,
    reasoning,
    impactAssessment: {
      timelineImpact,
      budgetImpact,
    },
    relevantSectionsCited,
    recommendedResponse,
  };
}
