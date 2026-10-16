import { jsPDF } from 'jspdf';
import { ProposalData } from '../types/proposal';

export async function exportProposalPdf(proposal: ProposalData): Promise<boolean> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    const bottomLimit = pageHeight - 56;

    let y = margin;

    // Helper: Add new page with proper header & reset y
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > bottomLimit) {
        doc.addPage();
        y = margin;
        drawPageHeader();
      }
    };

    const drawPageHeader = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(155, 132, 108); // Taupe
      doc.text('SCOPECRAFT PROPOSAL STUDIO', margin, 32);
      doc.text(
        `CLIENT: ${proposal.clientName.toUpperCase()} · ${proposal.category.toUpperCase()}`,
        pageWidth - margin,
        32,
        { align: 'right' }
      );
      doc.setDrawColor(220, 215, 205);
      doc.setLineWidth(0.5);
      doc.line(margin, 38, pageWidth - margin, 38);
      y = Math.max(y, 54);
    };

    // First page top masthead
    doc.setFillColor(245, 240, 231); // Warm ivory header card
    doc.rect(margin, y, contentWidth, 76, 'F');
    doc.setDrawColor(57, 72, 59); // Forest green accent bar
    doc.rect(margin, y, 4, 76, 'F');

    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(34, 34, 31); // Charcoal
    const titleLines = doc.splitTextToSize(proposal.title, contentWidth - 32);
    doc.text(titleLines, margin + 18, y + 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(57, 72, 59);
    doc.text(
      `PREPARED FOR: ${proposal.clientName.toUpperCase()}   |   DATE: ${new Date(proposal.createdAt).toLocaleDateString()}   |   STATUS: ${proposal.status.toUpperCase()}`,
      margin + 18,
      y + 56
    );

    y += 94;

    // Helper for Section Titles
    const renderSectionTitle = (numberStr: string, title: string) => {
      checkPageBreak(38);
      y += 12;
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(57, 72, 59); // Forest green
      doc.text(`${numberStr}  ${title}`, margin, y);

      doc.setDrawColor(200, 195, 185);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 4, pageWidth - margin, y + 4);
      y += 18;
    };

    // Helper for paragraph prose
    const renderParagraph = (text: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(45, 45, 42);
      const lines = doc.splitTextToSize(text, contentWidth);
      const height = lines.length * 13.5;
      checkPageBreak(height + 10);
      doc.text(lines, margin, y);
      y += height + 8;
    };

    // 01. Executive Summary
    if (proposal.executiveSummary) {
      renderSectionTitle('01.', 'Executive Summary');
      renderParagraph(proposal.executiveSummary);
    }

    // 02. Understanding of Client Requirements
    if (proposal.clientNeedsUnderstanding) {
      renderSectionTitle('02.', 'Understanding of Client Requirements');
      renderParagraph(proposal.clientNeedsUnderstanding);
    }

    // 03. Proposed Solution
    if (proposal.proposedSolution) {
      renderSectionTitle('03.', 'Proposed Solution & Approach');
      renderParagraph(proposal.proposedSolution);
    }

    // 04. Scope and Deliverables
    if (proposal.deliverables && proposal.deliverables.length > 0) {
      renderSectionTitle('04.', 'Scope and Key Deliverables');
      proposal.deliverables.forEach((group) => {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(57, 72, 59);
        doc.text(group.category, margin, y);
        y += 14;

        group.items.forEach((item) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(45, 45, 42);
          const itemLines = doc.splitTextToSize(`•  ${item}`, contentWidth - 14);
          const h = itemLines.length * 13;
          checkPageBreak(h + 4);
          doc.text(itemLines, margin + 8, y);
          y += h + 2;
        });
        y += 6;
      });
    }

    // 05. Milestones and Timeline
    if (proposal.milestones && proposal.milestones.length > 0) {
      renderSectionTitle('05.', 'Milestones and Phased Timeline');
      proposal.milestones.forEach((m, idx) => {
        checkPageBreak(50);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(34, 34, 31);
        doc.text(`Milestone ${idx + 1}: ${m.title}`, margin, y);
        if (m.durationOrDate) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(155, 132, 108);
          doc.text(`Timeframe: ${m.durationOrDate}`, pageWidth - margin, y, { align: 'right' });
        }
        y += 13;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 48);
        const descLines = doc.splitTextToSize(m.description, contentWidth);
        const h = descLines.length * 12.5;
        doc.text(descLines, margin, y);
        y += h + 4;

        if (m.deliverablesSummary) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(57, 72, 59);
          const artLines = doc.splitTextToSize(`Artifacts: ${m.deliverablesSummary}`, contentWidth);
          doc.text(artLines, margin, y);
          y += artLines.length * 12 + 6;
        }
        y += 4;
      });

      if (proposal.timelineEstimate) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(57, 72, 59);
        doc.text('Estimated Overall Cadence:', margin, y);
        y += 12;
        renderParagraph(proposal.timelineEstimate);
      }
    }

    // 06. Pricing and Assumptions
    const pricingContent = proposal.pricingAndAssumptions || proposal.budgetEstimate;
    if (pricingContent) {
      renderSectionTitle('06.', 'Pricing and Commercial Assumptions');
      renderParagraph(pricingContent);
    }

    // 07. Exclusions and Revision Policy
    if (proposal.scopeExclusions.length > 0 || proposal.revisionPolicy) {
      renderSectionTitle('07.', 'Exclusions and Revision Policy');

      if (proposal.revisionPolicy) {
        renderParagraph(proposal.revisionPolicy);
      }

      if (proposal.scopeExclusions.length > 0) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(155, 132, 108);
        doc.text('Explicit Out-of-Scope Items:', margin, y);
        y += 13;

        proposal.scopeExclusions.forEach((exc) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(55, 55, 52);
          const lines = doc.splitTextToSize(`✕  ${exc}`, contentWidth - 14);
          const h = lines.length * 13;
          checkPageBreak(h + 4);
          doc.text(lines, margin + 8, y);
          y += h + 2;
        });
        y += 6;
      }
    }

    // 08. Acceptance Criteria
    if (proposal.acceptanceCriteria && proposal.acceptanceCriteria.length > 0) {
      renderSectionTitle('08.', 'Acceptance Criteria');
      proposal.acceptanceCriteria.forEach((crit) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(45, 45, 42);
        const lines = doc.splitTextToSize(`[✓]  ${crit}`, contentWidth - 14);
        const h = lines.length * 13;
        checkPageBreak(h + 4);
        doc.text(lines, margin + 8, y);
        y += h + 2;
      });
      y += 6;
    }

    // 09. Next Steps to Proceed
    if (proposal.nextSteps && proposal.nextSteps.length > 0) {
      renderSectionTitle('09.', 'Next Steps to Proceed');
      proposal.nextSteps.forEach((step, idx) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(45, 45, 42);
        const lines = doc.splitTextToSize(`${idx + 1}.  ${step}`, contentWidth - 14);
        const h = lines.length * 13;
        checkPageBreak(h + 4);
        doc.text(lines, margin + 8, y);
        y += h + 2;
      });
    }

    // Final Page Numbers across all pages
    const totalPages = doc.internal.pages.length - 1; // jsPDF 1-indexed internal array
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 145);
      doc.setDrawColor(220, 215, 205);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);
      doc.text(
        'ScopeCraft Proposal Studio · Confidential Client Proposal',
        margin,
        pageHeight - 22
      );
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 22, {
        align: 'right',
      });
    }

    // Sanitize filename
    const safeTitle = (proposal.clientName || proposal.title || 'proposal')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const filename = `${safeTitle}-proposal.pdf`;

    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return false;
  }
}
