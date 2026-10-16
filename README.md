# ScopeCraft — Cinematic AI Freelancer Proposal Studio

An editorial, cinema-grade web studio that transforms rough client briefs into structured, persuasive project proposals with the assistance of open-weight language models.

---

## 1. Signature Freelancer Features

### A. Smart Brief Gap Detector
Proactively analyzes intake briefs for hidden commercial and operational risks:
- Platform and hosting environment ambiguity.
- Unspecified copywriting and photography asset dependencies.
- Open-ended delivery timelines or missing turnaround SLAs.
- Ambiguous budget brackets.
- One-click clause injection to automatically fortify the brief before presenting to clients.

### B. Scope-Creep Sentinel
Compares new client change requests against the contracted proposal:
- Categorizes requests into **Within Scope**, **Boundary / Grey Area**, or **Out of Scope**.
- Estimates schedule impact (calendar days/weeks) and commercial delta (change-order fees).
- Cites specific proposal sections and contracted exclusions.
- Automatically drafts a polite, boundary-protecting freelancer email response ready to copy with one click.

### C. Living Project Scope Map
Interactive traceability matrix linking:
`Client Need -> Tangible Deliverable -> Phased Milestone -> Acceptance Test -> Measurable Outcome`
- Real-time synchronization as proposal sections are edited.
- Milestone filtering, node addition, and verification status tracking (`Defined`, `In Review`, `Verified`).

### D. Professional PDF Export
Generates client-ready, multi-page PDFs using `jsPDF`:
- Warm ivory and charcoal typography hierarchy with forest-green accents.
- Structured across 9 key sections (Executive Summary, Client Requirements, Proposed Solution, Deliverables, Milestones, Pricing, Exclusions, Acceptance Criteria, Next Steps).
- Multi-page wrapping and dynamic page numbering (`Page X of Y`).

---

## 2. Realistic Demonstration Projects

Explore the full workflow using three interactive, clearly labeled demonstration projects:
1. **Website Redesign — Beacon Peak Outfitting**: Mobile-first information architecture, trip indexing, and inquiry conversion.
2. **Brand Identity — Luminary Ventures**: Authoritative venture fund identity system, typography, Figma LP deck, and brand monograph.
3. **E-commerce Store — Sylvan Ceramic Works**: Small-batch artisan pottery store with product catalog, cart drawer, and Stripe integration.

---

## 3. Open-Weight Model Architecture

ScopeCraft is architected to run with **open-weight foundation models** (e.g., Meta Llama 3.3 70B, Mistral NeMo, Qwen 2.5):
- **Groq Cloud (Recommended Free Tier)**: Ultra-fast inference with `llama-3.3-70b-versatile`.
- **Hugging Face Serverless**: `meta-llama/Llama-3.3-70B-Instruct`.
- **Together AI**: `meta-llama/Llama-3.3-70B-Instruct-Turbo`.
- **Local Studio Engine (Demo Mode)**: Operates out-of-the-box with zero keys required, clearly indicating demonstration synthesis mode.

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

```env
# Optional API key for Open-Weight inference (e.g., Groq)
# Free key available at https://console.groq.com/keys
OPEN_WEIGHT_API_KEY=""

# Provider: "groq" | "huggingface" | "together" | "custom"
OPEN_WEIGHT_PROVIDER="groq"

# Model identifier
OPEN_WEIGHT_MODEL="llama-3.3-70b-versatile"

# Base URL (defaults to provider's OpenAI-compatible endpoint)
OPEN_WEIGHT_BASE_URL="https://api.groq.com/openai/v1"
```

---

## 5. Local Development & Deployment

### Run locally
```bash
npm install
npm run dev
```

### Build for production
```bash
npm run build
npm start
```

### Vercel Deployment
1. Import repository into Vercel.
2. Add optional `OPEN_WEIGHT_API_KEY`, `OPEN_WEIGHT_PROVIDER`, and `OPEN_WEIGHT_MODEL` in Project Settings > Environment Variables.
3. Deploy!
