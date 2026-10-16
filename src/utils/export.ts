import { ProposalData } from '../types/proposal';

export function formatProposalMarkdown(p: ProposalData): string {
  const lines: string[] = [];

  lines.push(`# ${p.title}`);
  lines.push(`**Client:** ${p.clientName} | **Discipline:** ${p.category} | **Date:** ${new Date(p.createdAt).toLocaleDateString()}`);
  lines.push(`*Generated via ScopeCraft Proposal Studio — ${p.modelMetadata.provider} (${p.modelMetadata.model})*`);
  lines.push(`\n---\n`);

  lines.push(`## 01. Executive Summary`);
  lines.push(p.executiveSummary);
  lines.push(`\n`);

  lines.push(`## 02. Understanding of Client Context & Needs`);
  lines.push(p.clientNeedsUnderstanding);
  lines.push(`\n`);

  lines.push(`## 03. Proposed Solution & Strategic Approach`);
  lines.push(p.proposedSolution);
  lines.push(`\n`);

  lines.push(`## 04. Key Deliverables`);
  p.deliverables.forEach((cat) => {
    lines.push(`### ${cat.category}`);
    cat.items.forEach((item) => lines.push(`- ${item}`));
    lines.push(``);
  });

  lines.push(`## 05. Scope Boundary: Inclusions & Exclusions`);
  lines.push(`### Inclusions`);
  p.scopeInclusions.forEach((inc) => lines.push(`- [x] ${inc}`));
  lines.push(`\n### Exclusions`);
  p.scopeExclusions.forEach((exc) => lines.push(`- [ ] ${exc}`));
  lines.push(`\n`);

  lines.push(`## 06. Project Milestones`);
  p.milestones.forEach((m, i) => {
    lines.push(`### Milestone ${i + 1}: ${m.title}`);
    if (m.durationOrDate) lines.push(`*Target Timeframe:* ${m.durationOrDate}`);
    lines.push(`${m.description}`);
    if (m.deliverablesSummary) lines.push(`*Artifacts:* ${m.deliverablesSummary}`);
    lines.push(``);
  });

  lines.push(`## 07. Estimated Timeline`);
  lines.push(p.timelineEstimate);
  lines.push(`\n`);

  if (p.budgetEstimate) {
    lines.push(`## 08. Investment & Financial Structure`);
    lines.push(p.budgetEstimate);
    lines.push(`\n`);
  }

  lines.push(`## 09. Assumptions & Operational Dependencies`);
  p.assumptionsAndDependencies.forEach((a) => lines.push(`- ${a}`));
  lines.push(`\n`);

  lines.push(`## 10. Questions for Client Clarification`);
  p.clarificationQuestions.forEach((q, idx) => lines.push(`${idx + 1}. ${q}`));
  lines.push(`\n`);

  lines.push(`## 11. Next Steps to Proceed`);
  p.nextSteps.forEach((step, idx) => lines.push(`${idx + 1}. ${step}`));
  lines.push(`\n`);

  lines.push(`---\n*ScopeCraft Proposal Studio · Crafted with care*`);
  return lines.join('\n');
}

export function downloadTextFile(filename: string, content: string, mimeType = 'text/markdown'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
