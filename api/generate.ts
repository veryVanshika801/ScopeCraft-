import type { IncomingMessage, ServerResponse } from 'http';
import { ProjectBrief, ProposalData, TonePreference } from '../src/types/proposal';
import {
  getProviderConfig,
  generateStudioEngineProposal,
  verifyToneConsistency,
} from '../src/utils/proposalEngine';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: Record<string, string | string[]>;
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  send: (data: any) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Options
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

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
        // ignore parse error
      }
    }

    const { brief, instructions, forceDemo } = (body || {}) as {
      brief: ProjectBrief;
      instructions?: string;
      forceDemo?: boolean;
    };

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
      res.status(200).json({
        proposal: verified,
        source: 'studio_engine_demo',
        message: key
          ? `Generated via ScopeCraft Studio Engine (${requestedTone} Tone).`
          : `No OPEN_WEIGHT_API_KEY detected. Generated via ScopeCraft Studio Engine (${requestedTone} Tone). Add your key in .env to enable live model inference.`,
      });
      return;
    }

    // Explicit Tone Instructions for Live Inference Models
    const toneInstructions =
      requestedTone === 'Professional'
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

    const data: any = await apiResponse.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('Received empty content from language model response.');
    }

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
      acceptanceCriteria:
        Array.isArray(parsed.acceptanceCriteria) && parsed.acceptanceCriteria.length > 0
          ? parsed.acceptanceCriteria
          : [
              `Delivery of all primary ${brief.projectCategory} artifacts meeting brief objectives.`,
              'Client staging walkthrough and milestone review sign-off.',
              'Production asset handover with zero blocking errors.',
            ],
      revisionPolicy:
        parsed.revisionPolicy ||
        'Includes two consolidated rounds of structured revisions for each agreed milestone.',
      pricingAndAssumptions:
        parsed.pricingAndAssumptions ||
        parsed.budgetEstimate ||
        (brief.budget ? `Aligned with specified budget parameters of ${brief.budget}` : undefined),
      modelMetadata: {
        provider,
        model,
        isDemoSynthesis: false,
      },
    };

    proposal = verifyToneConsistency(proposal, requestedTone);

    res.status(200).json({
      proposal,
      source: 'live_model',
      message: `Successfully synthesized via ${model} (${provider}) in ${requestedTone} tone.`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Vercel API proposal generation failed:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate proposal due to server error.',
    });
  }
}
