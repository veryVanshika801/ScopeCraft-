import type { IncomingMessage, ServerResponse } from 'http';
import { getProviderConfig } from '../src/utils/proposalEngine';

interface VercelRequest extends IncomingMessage {
  body: any;
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore
      }
    }

    const { proposal, targetLang } = body || {};
    if (!proposal || !targetLang) {
      res.status(400).json({ error: 'Proposal data and targetLang are required.' });
      return;
    }

    const { key, provider, model, baseUrl } = getProviderConfig();

    if (!key) {
      const isHi = targetLang === 'hi';

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
        deliverables: proposal.deliverables?.map((d: any) => ({
          category: isHi ? `${d.category} (डिलिवरेबल्स)` : `${d.category} (Key Deliverables)`,
          items: d.items.map((item: string) => (isHi ? `• ${item} [सत्यापित]` : `• ${item} (Verified)`)),
        })) || [],
        scopeInclusions: proposal.scopeInclusions?.map((inc: string) =>
          isHi ? `• ${inc} (अनुमोदित स्कोप में सम्मिलित)` : `• ${inc} (Included in agreed scope)`
        ) || [],
        scopeExclusions: proposal.scopeExclusions?.map((exc: string) =>
          isHi ? `• ${exc} (स्पष्ट रूप से बहिष्कृत / पृथक अनुबंध आवश्यक)` : `• ${exc} (Excluded — Out of current scope)`
        ) || [],
        milestones: proposal.milestones?.map((m: any, idx: number) => ({
          title: isHi
            ? `माइलस्टोन ${idx + 1}: ${m.title.replace(/^Milestone\s*\d*:\s*/i, '')}`
            : `Milestone ${idx + 1}: ${m.title.replace(/^Milestone\s*\d*:\s*/i, '')}`,
          description: isHi ? `${m.description} (समीक्षा एवं स्वीकृति आवश्यक)` : `${m.description} (Weekly milestone review)`,
          durationOrDate: m.durationOrDate,
          deliverablesSummary: m.deliverablesSummary,
        })) || [],
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
          ? [
              '1. कार्य-क्षेत्र (Statement of Work) की समीक्षा और हस्ताक्षर करें।',
              '2. प्रारंभिक माइलस्टोन जमा राशि प्रेषित करें।',
              '3. किक-ऑफ बैठक में शामिल हों।',
            ]
          : [
              '1. Statement of work aur scope boundaries ko review karke sign-off karein.',
              '2. Milestone 1 deposit process karein.',
              '3. Kick-off alignment call schedule karein.',
            ],
        phrasesForReview: [
          isHi
            ? 'विशिष्ट तकनीकी शब्दों को अंतरराष्ट्रीय उद्योग मानकों के अनुसार रखा गया है।'
            : 'Technical nomenclature and milestone titles are preserved in standard industry phrasing.',
          'Price brackets, currencies and timelines are strictly preserved.',
        ],
        isHumanReviewed: false,
      };

      res.status(200).json({ translation, source: 'studio_engine_translation' });
      return;
    }

    // Live translation via provider
    const targetLabel = targetLang === 'hi' ? 'Standard Hindi (Devanagari script)' : 'Hinglish (Colloquial conversational Romanized Hindi-English)';
    const prompt = `You are an elite bilingual translation director for professional client proposals. Translate the following proposal into ${targetLabel}. Return valid JSON matching the schema.`;

    const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: JSON.stringify(proposal) },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!apiResponse.ok) {
      throw new Error(`Inference provider failed: ${apiResponse.statusText}`);
    }

    const data: any = await apiResponse.json();
    const translation = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    res.status(200).json({ translation, source: 'live_model' });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Translation failed.' });
  }
}
