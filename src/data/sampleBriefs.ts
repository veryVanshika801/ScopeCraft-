import { SampleProject } from '../types/proposal';

export const SAMPLE_PROJECTS: SampleProject[] = [
  // 1. Restaurant Website & Online Booking
  {
    id: 'sample-restaurant-booking',
    label: 'Restaurant Website & Online Booking — Osteria Stella Del Nord',
    shortDesc: 'Artisan northern Italian restaurant needing responsive website, seasonal digital menu, TableCheck reservation widget, and private dining inquiry flow.',
    category: 'Web Development',
    complexity: 'Moderate',
    completeness: 'Complete & Detailed',
    highlightFeature: 'Digital Menu & Table Reservation Integration',
    brief: {
      projectTitle: 'Osteria Stella Del Nord Digital Presence & Reservation System',
      clientName: 'Osteria Stella Del Nord',
      projectCategory: 'Web Development',
      requirements:
        'Osteria Stella Del Nord is a 65-seat farm-to-table Italian restaurant in Portland. Their current website is a single static PDF menu uploaded to a dead Squarespace page. Guests are constantly calling during dinner rush to ask for dietary options and table availability. They need a warm, responsive website showcasing their heritage, daily rotating pasta menu, wine list, private dining room inquiries, and embedded OpenTable / Resy booking widget. Host team needs to update menu prices and holiday hours from a mobile phone.',
      goals:
        '1. Direct at least 70% of table reservations through online booking to relieve front-of-house phone lines during service.\n2. Enable staff to update daily specials and 85-bottle wine list in under 5 minutes without code.\n3. Increase private party and buyout inquiries by 50% via a dedicated event intake form.\n4. Optimize mobile page speeds so guests browsing on mobile cellular connections load menus in under 2 seconds.',
      budget: '$5,500 – $7,200',
      deadline: '5 weeks (before spring tasting menu debut)',
      tone: 'Premium',
      notes:
        'Food photography already commissioned and shot by local photographer. OpenTable booking widget embed code ready. Excludes direct takeout delivery logistics.',
    },
    defaultProposal: {
      id: 'prop-sample-restaurant',
      title: 'Osteria Stella Del Nord Digital Presence & Reservation System',
      clientName: 'Osteria Stella Del Nord',
      category: 'Web Development',
      createdAt: '2026-10-12T12:00:00.000Z',
      updatedAt: '2026-10-13T08:00:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'This proposal outlines a 5-week digital architecture and website engagement for Osteria Stella Del Nord. By marrying rich culinary editorial photography with a responsive, lightning-fast digital menu and seamless reservation integration, we will eliminate dinner-rush phone congestion and elevate the restaurant’s hospitality presence online.',
      clientNeedsUnderstanding:
        'Osteria Stella Del Nord suffers from an inaccessible static PDF menu that frustrates mobile guests and prevents search engines from indexing signature dishes. The front-of-house staff is burdened by phone calls for routine reservation checks and private dining bookings during peak service hours.',
      proposedSolution:
        'We propose a tailored, high-craft web solution built on modern lightweight frontend architecture:\n\n1. Dynamic Dietary-Tagged Menu Engine: Easily updated by kitchen staff with gluten-free, vegetarian, and wine pairing annotations.\n2. Streamlined Booking & Event Funnel: Direct Resy/OpenTable widget integration plus a bespoke private dining buyout inquiry flow.\n3. Mobile-First Editorial Polish: High-contrast typography and subtle motion reflecting the warmth of the dining room.',
      deliverables: [
        {
          category: 'Design & Information Architecture',
          items: [
            'Interactive mobile-first wireframes for Home, Menus, Private Dining, and Location/Hours',
            'Bespoke digital typography system pairing classic serif titles with clean sans-serif menu pricing',
            'Interactive food & beverage menu component with dietary filter tags',
          ],
        },
        {
          category: 'Frontend Development & Integrations',
          items: [
            'Responsive website templates (Desktop, Tablet, Mobile)',
            'Embedded OpenTable/Resy reservation modal integration',
            'Private dining event inquiry form with automated guest confirmation email',
            'Lightweight headless CMS setup for rapid staff menu updates without code',
          ],
        },
      ],
      scopeInclusions: [
        'Up to 5 core page templates (Home, Food & Wine Menu, Private Events, Story/Chef, Contact & Hours)',
        'Two rounds of structured revisions for design and staging milestones',
        'Google Business Profile and Open Graph social sharing card configuration',
        '30-day post-launch warranty and staff training walkthrough',
      ],
      scopeExclusions: [
        'Direct online food ordering, payment gateway processing, or third-party delivery dispatch (DoorDash/UberEats)',
        'Original food photography sessions or commercial food styling',
        'Ongoing monthly hosting fees (client maintains Vercel or Netlify hosting)',
      ],
      milestones: [
        {
          title: 'Milestone 1: Information Architecture & Menu UX',
          description: 'Define navigation taxonomy, digital menu filtering, and mobile reservation wireframes.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Approved interactive wireframe prototype and technical specification.',
        },
        {
          title: 'Milestone 2: High-Fidelity Design & Staging Build',
          description: 'Construct responsive templates with integrated photo assets and live reservation widget.',
          durationOrDate: 'Weeks 3 – 4',
          deliverablesSummary: 'Interactive staging site on private preview URL for client menu review.',
        },
        {
          title: 'Milestone 3: Staff Training, QA & Public Launch',
          description: 'Lighthouse speed optimization, DNS cutover to custom domain, and recorded 20-min CMS training video.',
          durationOrDate: 'Week 5',
          deliverablesSummary: 'Live production deployment and recorded staff walkthrough video.',
        },
      ],
      timelineEstimate: '5 calendar weeks from kick-off to live launch.',
      budgetEstimate: 'Fixed fee of $6,200 USD, invoiced 40% commencement deposit, 30% Milestone 2 approval, and 30% final cutover.',
      pricingAndAssumptions:
        'Fixed investment of $6,200 USD. Assumes client supplies high-res food photos and finalized menu copy by end of Week 1.',
      revisionPolicy:
        'Includes two consolidated revision rounds per milestone. Additional kitchen requests outside agreed sitemap are billed at $110/hr.',
      acceptanceCriteria: [
        'Google Lighthouse mobile performance score of 92+ on menu and reservation pages',
        'Reservation widget opens reliably across iOS Safari, Android Chrome, and modern desktop browsers',
        'Kitchen staff successfully completes test menu item price update in under 3 minutes',
        'Private dining inquiry form routes to designated manager inbox with confirmation receipt',
      ],
      assumptionsAndDependencies: [
        'Client provides existing domain registrar login credentials and active OpenTable/Resy account API key.',
      ],
      clarificationQuestions: [
        'Do you plan to feature seasonal rotating chef tasting menus that require separate booking deposits?',
      ],
      nextSteps: [
        'Review and sign statement of work.',
        'Submit initial 40% milestone retainer.',
        'Share Dropbox folder with high-res food photography.',
      ],
      scopeMap: [
        {
          id: 'map-rest-1',
          requirement: 'Reduce phone calls during service rush',
          deliverable: 'Embedded OpenTable/Resy reservation modal',
          milestone: 'Milestone 2: High-Fidelity Design & Staging Build',
          acceptanceCriteria: 'One-click reservation booking without leaving the website',
          outcome: 'Direct at least 70% of bookings online',
          status: 'verified',
        },
        {
          id: 'map-rest-2',
          requirement: 'Kitchen staff must update menus in minutes without code',
          deliverable: 'Lightweight headless menu CMS with dietary tag filters',
          milestone: 'Milestone 2: High-Fidelity Design & Staging Build',
          acceptanceCriteria: 'Price & dish changes go live in < 30 seconds',
          outcome: 'Eliminate static outdated PDF menus forever',
          status: 'defined',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Add Online Takeout Ordering & Delivery Tracking',
        message: 'Can we also add an online ordering system with DoorDash driver dispatch, real-time delivery GPS tracking, and credit card processing before we launch?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Adjust Wine List Typography & Vintage Labeling',
        message: 'Could we tweak the wine list layout to show the vineyard region and vintage year in a smaller muted taupe font below the wine name?',
        expectedVerdict: 'within_scope',
      },
      {
        title: 'Bilingual Spanish Menu Translation',
        message: 'We want to provide the entire 40-item menu and dining history in Spanish as well. Can you translate and build a language toggle?',
        expectedVerdict: 'boundary',
      },
    ],
  },

  // 2. Personal Portfolio for a Developer (Vague / Short Brief demo)
  {
    id: 'sample-developer-portfolio',
    label: 'Personal Portfolio for a Developer — Elena Rostova',
    shortDesc: 'Senior backend and systems engineer needing an understated, high-credibility portfolio showcasing distributed systems and open-source contributions.',
    category: 'Web Development',
    complexity: 'Simple',
    completeness: 'Vague / Short',
    highlightFeature: 'Minimalist Engineering Showcase (Gap Detector Demo)',
    brief: {
      projectTitle: 'Elena Rostova Engineering Portfolio',
      clientName: 'Elena Rostova',
      projectCategory: 'Web Development',
      requirements:
        'I am a senior distributed systems engineer looking for a clean, brutalist or minimalist portfolio site. It should list my recent projects, open-source Rust libraries, speaking talks, and resume. I want something that looks like an engineer built it, not a marketing agency. Make it fast. Needs dark mode.',
      goals:
        'Showcase technical depth to staff/principal engineering hiring managers and conference committees. Keep it lightweight with no heavy JavaScript frameworks.',
      budget: '',
      deadline: 'ASAP',
      tone: 'Professional',
      notes: 'No marketing fluff. Dark mode default.',
    },
    defaultProposal: {
      id: 'prop-sample-portfolio',
      title: 'Elena Rostova Engineering Portfolio',
      clientName: 'Elena Rostova',
      category: 'Web Development',
      createdAt: '2026-10-11T16:00:00.000Z',
      updatedAt: '2026-10-12T14:30:00.000Z',
      status: 'Needs Clarification',
      executiveSummary:
        'A distraction-free, high-performance portfolio crafted specifically for senior engineering evaluation. Engineered with zero runtime bloat, bespoke monospace typography, interactive architectural case studies, and native dark mode support.',
      clientNeedsUnderstanding:
        'Elena needs to establish authority in distributed systems architecture without the visual gimmicks of generic tech portfolios. The site must prioritize technical artifacts: architecture diagrams, GitHub repository telemetry, benchmark metrics, and downloadable CV.',
      proposedSolution:
        'We propose a clean static site built with Astro or Next.js static export:\n\n1. Systems Architecture Case Study Format: Clean deep-dives featuring interactive ASCII/SVG system topology diagrams.\n2. GitHub & Open Source Showcase: Curated crates and PR contributions rendered with live metadata.\n3. Frictionless Contact & Resume: Printable CV and PGP-verified contact links.',
      deliverables: [
        {
          category: 'Core Portfolio Architecture',
          items: [
            'Single-page responsive layout with deep-link sections for Systems, Open Source, and Speaking',
            'Interactive architectural diagrams for 3 featured distributed systems projects',
            'Curated technical CV with accessible print stylesheet',
            'Clean dark/light theme switcher with system preference detection',
          ],
        },
      ],
      scopeInclusions: [
        'Single responsive landing page with 3 modular project expanders',
        'Two rounds of revisions on layout and typography tokens',
        'Perfect 100/100 Google Lighthouse score verification',
      ],
      scopeExclusions: [
        'Full content management system (CMS) or multi-author blogging engine',
        'Complex 3D WebGL animations or heavy interactive canvas shaders',
      ],
      milestones: [
        {
          title: 'Milestone 1: Typographic Wireframes & Content Structure',
          description: 'Establish type hierarchy, case study layout, and diagram styling.',
          durationOrDate: 'Week 1',
          deliverablesSummary: 'Interactive layout prototype.',
        },
        {
          title: 'Milestone 2: Static Build & Deployment',
          description: 'Frontend implementation, dark mode verification, and GitHub Pages / Vercel cutover.',
          durationOrDate: 'Week 2',
          deliverablesSummary: 'Live production portfolio.',
        },
      ],
      timelineEstimate: '2 calendar weeks from scope clarification.',
      budgetEstimate: 'Fixed rate of $2,800 USD based on clarified parameters.',
      pricingAndAssumptions: 'Fixed $2,800 USD. Assumes client provides project technical writeups in Markdown.',
      revisionPolicy: 'Includes two consolidated rounds of styling adjustments.',
      acceptanceCriteria: [
        'Lighthouse performance score of 100 on both mobile and desktop',
        'Total page payload under 150KB uncompressed',
        'Clean rendering in Lynx/text-browsers and full keyboard tab accessibility',
      ],
      assumptionsAndDependencies: [
        'Client provides project descriptions and GitHub repository links.',
      ],
      clarificationQuestions: [
        'Do you intend to publish long-form blog articles regularly in the future?',
        'Do you require custom domain DNS configuration assistance?',
      ],
      nextSteps: [
        'Confirm budget bracket and timeline target.',
        'Review and approve 2-week scope schedule.',
      ],
      scopeMap: [
        {
          id: 'map-port-1',
          requirement: 'Fast brutalist portfolio without marketing fluff',
          deliverable: 'Astro/Next static single-page portfolio with dark mode',
          milestone: 'Milestone 2: Static Build & Deployment',
          acceptanceCriteria: '100/100 Lighthouse score; < 150KB weight',
          outcome: 'Impress technical hiring committees with speed and precision',
          status: 'verified',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Add Full MDX Technical Blog & Comment System',
        message: 'Can we add a full multi-category technical blog with syntax-highlighted code blocks, search, and a Giscus/GitHub comment system before launch?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add Rust Crate Benchmark Table',
        message: 'Could we add a simple tabular comparison chart showing latency benchmarks for my open source library compared to Redis?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 3. E-commerce Store for Handmade Products (Missing Budget & Timeline Demo)
  {
    id: 'sample-handmade-ecommerce',
    label: 'E-commerce Store for Handmade Products — Meadowlark Wool & Weave',
    shortDesc: 'Artisan textile studio creating hand-spun blankets, requiring Shopify store, wool weight options, and yarn color swatches.',
    category: 'Web Development',
    complexity: 'Moderate',
    completeness: 'Missing Budget & Timeline',
    highlightFeature: 'Handmade Craft DTC Store (Gap Detector Demo)',
    brief: {
      projectTitle: 'Meadowlark Wool & Weave Direct-to-Consumer Flagship',
      clientName: 'Meadowlark Wool & Weave',
      projectCategory: 'Web Development',
      requirements:
        'We spin and weave heirloom woolen throws and woven scarves in Montana. We currently sell on Etsy, but fees are getting too high and we want our own brand flagship. We need product pages with colorway swatches, wool origin provenance stories, a shopping cart, gift wrapping add-on option, and smooth checkout. We have about 35 distinct products.',
      goals:
        'Migrate customer base off Etsy to our own domain. Build an email newsletter subscriber list with an initial 10% discount popup.',
      budget: '',
      deadline: '',
      tone: 'Friendly',
      notes: 'Need to import existing Etsy customer reviews.',
    },
    defaultProposal: {
      id: 'prop-sample-handmade',
      title: 'Meadowlark Wool & Weave Direct-to-Consumer Flagship',
      clientName: 'Meadowlark Wool & Weave',
      category: 'Web Development',
      createdAt: '2026-10-12T10:00:00.000Z',
      updatedAt: '2026-10-13T07:15:00.000Z',
      status: 'Needs Clarification',
      executiveSummary:
        'A tactile direct-to-consumer digital flagship built on Shopify to emancipate Meadowlark Wool & Weave from high marketplace commissions while deepening customer loyalty through bespoke craftsmanship storytelling.',
      clientNeedsUnderstanding:
        'Meadowlark is constrained by Etsy’s increasing take-rates (6.5% transaction + advertising fees) and generic marketplace branding. They need their own autonomous store where customer relationships and margins remain fully their own.',
      proposedSolution:
        'We will design and develop a custom Shopify 2.0 storefront with:\n\n1. Tactile Product Presentation: Interactive yarn swatch selectors, fleece weight indicators, and loom provenance notes.\n2. Conversion-Focused Cart: Slide-out drawer with gift message notes and free shipping progress bar.\n3. Smooth Etsy Migration: Import past product listings and verified customer reviews.',
      deliverables: [
        {
          category: 'Shopify Storefront Design & Development',
          items: [
            'Customized Shopify 2.0 theme adhering to warm tactile editorial aesthetic',
            'Product template with colorway swatches and wool care instruction drawer',
            'Cart drawer with gift-wrapping upsell checkbox',
            'Migration of 35 SKUs and past Etsy reviews',
          ],
        },
      ],
      scopeInclusions: [
        'Shopify payments, tax, and USPS shipping zone setup',
        'Klaviyo welcome flow integration for 10% discount capture',
        'Mobile optimization and end-to-end checkout verification',
      ],
      scopeExclusions: [
        'Shopify recurring app subscription fees (e.g. review app subscription)',
        'Physical product photography or studio styling',
      ],
      milestones: [
        {
          title: 'Milestone 1: Theme Art Direction & Catalog Architecture',
          description: 'Wireframing homepage, collection pages, and product swatch layout.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Approved design mockups in Figma.',
        },
        {
          title: 'Milestone 2: Shopify Theme Build & Product Migration',
          description: 'Theme customization, catalog SKU import, and cart drawer setup.',
          durationOrDate: 'Weeks 3 – 5',
          deliverablesSummary: 'Live preview store on password-protected Shopify domain.',
        },
        {
          title: 'Milestone 3: Payments, Email Capture & Launch',
          description: 'Payment testing, Klaviyo signup form, and custom domain cutover.',
          durationOrDate: 'Week 6',
          deliverablesSummary: 'Public launch and store owner fulfillment guide.',
        },
      ],
      timelineEstimate: '6 weeks from agreement and budget confirmation.',
      budgetEstimate: 'Fixed fee estimate of $5,400 USD (subject to final milestone schedule sign-off).',
      pricingAndAssumptions: 'Fixed $5,400 USD. Assumes client provides high-res weaving photos and yarn descriptions.',
      revisionPolicy: 'Includes two consolidated revision rounds per milestone.',
      acceptanceCriteria: [
        'Test checkout orders process smoothly through Shopify Payments and Apple Pay',
        'Customer email signup automatically issues 10% welcome coupon',
        'All 35 products display correct wool specifications and colorway swatches',
      ],
      assumptionsAndDependencies: ['Client maintains active Shopify plan and custom domain ownership.'],
      clarificationQuestions: [
        'What budget ceiling did your team have in mind for the initial migration?',
        'Do you plan to offer international shipping to Canada or Europe during Phase 1?',
      ],
      nextSteps: ['Confirm budget parameters.', 'Schedule store setup alignment call.'],
      scopeMap: [
        {
          id: 'map-hand-1',
          requirement: 'Escape Etsy commission fees with own store',
          deliverable: 'Custom Shopify 2.0 theme & payment gateway',
          milestone: 'Milestone 2: Shopify Theme Build',
          acceptanceCriteria: 'End-to-end checkout with 0 marketplace commission fees',
          outcome: 'Protect profit margin on heirloom wool throws',
          status: 'defined',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Add Automated Customer Loyalty Points Program',
        message: 'Can we install a multi-tier customer loyalty points program like Smile.io where shoppers earn wool points for social shares and referrals?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add Handwritten Gift Note Box in Cart',
        message: 'Could we ensure shoppers can type a 120-character handwritten gift note in the cart drawer that prints onto packing slips?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 4. Brand Identity for a Sustainable Startup
  {
    id: 'sample-sustainable-startup',
    label: 'Brand Identity for a Sustainable Startup — MycoCycle BioPackaging',
    shortDesc: 'Biotech materials startup transforming agricultural mycelium into compostable packaging, requiring comprehensive brand identity.',
    category: 'Branding',
    complexity: 'Moderate',
    completeness: 'Complete & Detailed',
    highlightFeature: 'Eco-Technology Brand Identity & Visual Language',
    brief: {
      projectTitle: 'MycoCycle BioPackaging Visual Identity & Brand System',
      clientName: 'MycoCycle BioPackaging',
      projectCategory: 'Branding',
      requirements:
        'MycoCycle is an industrial biotech startup that uses mushroom mycelium and hemp waste to manufacture molded protective packaging for electronics and luxury goods. We are raising our $4M Seed round and need a brand identity that looks scientifically credible, modern, and high-end—not like a hippie tie-dye granola brand. We need a primary logo mark, responsive wordmark, color palette, typography system, sample box packaging mockup, and comprehensive PDF brand guidelines book.',
      goals:
        '1. Instill confidence in venture capital and enterprise supply-chain procurement directors.\n2. Emphasize circularity and industrial engineering without visual clichés.\n3. Provide ready-to-use vector assets and Figma slide deck templates.',
      budget: '$6,500 – $8,000',
      deadline: '4 weeks',
      tone: 'Premium',
      notes: 'Colors should lean towards warm stone, deep lichen green, and subtle mycelial off-white.',
    },
    defaultProposal: {
      id: 'prop-sample-myco',
      title: 'MycoCycle BioPackaging Visual Identity & Brand System',
      clientName: 'MycoCycle BioPackaging',
      category: 'Branding',
      createdAt: '2026-10-10T11:00:00.000Z',
      updatedAt: '2026-10-12T16:00:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'A disciplined brand identity program for MycoCycle BioPackaging that bridges rigorous biotechnology with industrial elegance. By combining precise geometric vector marks with an organic earth-toned palette, we position MycoCycle as the premier high-performance circular packaging standard for Fortune 500 enterprises.',
      clientNeedsUnderstanding:
        'MycoCycle’s temporary brand identity looks amateurish and organic-hobbyist, undermining conversations with institutional venture funds and consumer electronics procurement officers.',
      proposedSolution:
        'A comprehensive 4-week identity sprint:\n\n1. Strategic Brand Pillars & Visual Directions: Exploring two distinct territories (Scientific Precision vs Tactile Circularity).\n2. Vector Geometry & Typographic Hierarchy: Designing the core mark, responsive lockups, and font pairing system.\n3. Brand Monograph & Packaging System: 28-page PDF Brand Book and Figma presentation master.',
      deliverables: [
        {
          category: 'Brand Geometry & Marks',
          items: [
            'Primary logo mark, wordmark, and compact icon for packaging stamps',
            'Full vector package in SVG, EPS, PDF, and high-res PNG formats',
            'Single-color reverse stamps optimized for kraft corrugated cardboard printing',
          ],
        },
        {
          category: 'Brand Architecture & Design System',
          items: [
            'Accessible color taxonomy (Hex, RGB, CMYK, Pantone equivalents)',
            'Typographic pairing guide with commercial licensing guidelines',
            '28-page digital Brand Guidelines PDF Monograph',
            '16-slide investor presentation deck template in Figma',
          ],
        },
      ],
      scopeInclusions: [
        'Two distinct creative directions presented during Milestone 1',
        'Up to 3 rounds of refinement on the selected direction',
        'Figma component library with auto-layout templates',
      ],
      scopeExclusions: [
        'Physical packaging manufacturing die-line engineering',
        'Commercial font software desktop/web license purchases (billed to client directly)',
        'Website frontend code development',
      ],
      milestones: [
        {
          title: 'Milestone 1: Positioning & Concept Territories',
          description: 'Present two divergent design territories in corporate context.',
          durationOrDate: 'Week 1',
          deliverablesSummary: 'Concept presentation deck with moodboards.',
        },
        {
          title: 'Milestone 2: Mark Geometry & Design System',
          description: 'Refine chosen concept, vector mathematics, palette, and typography scale.',
          durationOrDate: 'Weeks 2 – 3',
          deliverablesSummary: 'Finalized vector asset suite and Figma token system.',
        },
        {
          title: 'Milestone 3: Presentation Deck & Brand Book',
          description: 'Produce 16-slide pitch deck and 28-page Brand Monograph.',
          durationOrDate: 'Week 4',
          deliverablesSummary: 'Master vector archive, Figma deck, and Brand Guidelines PDF.',
        },
      ],
      timelineEstimate: '4 calendar weeks from kick-off.',
      budgetEstimate: 'Fixed fee of $7,200 USD, billed 50% deposit and 50% upon final asset handover.',
      pricingAndAssumptions: 'Fixed $7,200 USD. Assumes feedback turnaround within 3 business days.',
      revisionPolicy: 'Includes three rounds of refinements on the selected direction.',
      acceptanceCriteria: [
        'Marks remain legible down to 14px favicon and scale flawlessly to trade-show banners',
        'Single-color stamps produce crisp vector output for packaging stamping',
        'Figma presentation deck includes all 16 slide templates with variable components',
      ],
      assumptionsAndDependencies: ['Client executive stakeholders attend concept presentations.'],
      clarificationQuestions: ['Are there any trademark registries already filed for the MycoCycle name?'],
      nextSteps: ['Sign statement of work.', 'Schedule discovery kick-off workshop.'],
      scopeMap: [
        {
          id: 'map-myco-1',
          requirement: 'Credible enterprise biotech visual presence for $4M seed round',
          deliverable: 'Primary vector mark system & 28-page Brand Monograph',
          milestone: 'Milestone 2: Mark Geometry & Design System',
          acceptanceCriteria: 'Scalable vector geometry across light, dark, and kraft surfaces',
          outcome: 'Elevate institutional confidence during venture pitch roadshows',
          status: 'verified',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Design Physical Molded Packaging Tooling CAD Files',
        message: 'Can your team also create the 3D CAD injection mold die-lines and engineering specifications for our factory tooling machines?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Explore Stamp Embossing Effect for Cardboard',
        message: 'Could we see a mockup of how the icon mark looks when blind-debossed directly into molded hemp fiber pulp?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 5. Mobile App UI/UX Redesign (Conflicting Requirements Demo)
  {
    id: 'sample-mobile-redesign',
    label: 'Mobile App UI/UX Redesign — TrailPulse Fitness & Trail Tracker',
    shortDesc: 'GPS trail navigation and outdoor fitness tracking mobile app needing complete iOS/Android UI overhaul and streamlined offline map UI.',
    category: 'UI/UX Design',
    complexity: 'Advanced',
    completeness: 'Conflicting Requirements',
    highlightFeature: 'Complex Mobile Flow Architecture (Gap Detector Demo)',
    brief: {
      projectTitle: 'TrailPulse Mobile App UX Modernization',
      clientName: 'TrailPulse Outdoor Technologies',
      projectCategory: 'UI/UX Design',
      requirements:
        'TrailPulse has 140k monthly active hikers and trail runners on iOS and Android. Our app has grown bloated over 4 years. Users complain the GPS tracking interface is cluttered with confusing icons, offline map downloads fail frequently, and starting a workout requires 5 taps. We want an ultra-minimalist Zen interface like Apple Health, but our monetization team also insists we add social community leaderboards, animated badges, and sponsored gear store promos on the home screen. We need this ready in 3 weeks before our summer trail series.',
      goals:
        'Reduce friction to start a trail workout from 5 taps to 1 tap. Redesign offline map caching UX. Rebuild reusable Figma design system for engineers.',
      budget: '$9,000 – $12,000',
      deadline: '3 weeks (unrealistically tight for full dual-platform app redesign)',
      tone: 'Professional',
      notes: 'Need full iOS Human Interface Guidelines and Material You compatibility.',
    },
    defaultProposal: {
      id: 'prop-sample-trailpulse',
      title: 'TrailPulse Mobile App UX Modernization',
      clientName: 'TrailPulse Outdoor Technologies',
      category: 'UI/UX Design',
      createdAt: '2026-10-11T13:00:00.000Z',
      updatedAt: '2026-10-12T15:00:00.000Z',
      status: 'Needs Clarification',
      executiveSummary:
        'A comprehensive UI/UX overhaul of the TrailPulse mobile experience, reconciling high-velocity outdoor telemetry with distraction-free wilderness safety. By prioritizing single-tap workout initiation and clean map hierarchy, we preserve battery life and cognitive focus on the trail.',
      clientNeedsUnderstanding:
        'TrailPulse faces user churn due to excessive cognitive load during physical activity. Competing product priorities (minimalist workout safety vs intrusive monetization widgets) require deliberate information architecture resolution before UI styling.',
      proposedSolution:
        'A phased UX restructuring:\n\n1. Core Ergonomic Audit & Workflow Simplification: Single-tap "Quick Start" trail tracking and redesigned offline map storage indicator.\n2. Modular Screen Architecture: Separating active wilderness tracking mode from secondary community feeds.\n3. Turnkey Figma Design Token System: Auto-layout components with iOS and Android native conventions.',
      deliverables: [
        {
          category: 'User Research & Flow Architecture',
          items: [
            'End-to-end user flow diagrams for Trail Workout Initiation, Offline Map Caching, and Post-Run Summary',
            'Interactive low-fidelity wireframe prototype testing 1-tap recording',
            'Competitive ergonomics audit against Strava and AllTrails',
          ],
        },
        {
          category: 'High-Fidelity Interface & Design System',
          items: [
            'Over 25 production-ready mobile screen designs in Figma (Light & Dark outdoor contrast modes)',
            'Comprehensive design token library (Typography, Spacing, Map overlays, Health icons)',
            'Interactive micro-prototype demonstrating offline map download progress states',
          ],
        },
      ],
      scopeInclusions: [
        'Complete iOS and Android screen design specs in Figma',
        'Two rounds of structured stakeholder review cycles',
        'Developer handoff walkthrough call with mobile engineering lead',
      ],
      scopeExclusions: [
        'Native Swift/Kotlin mobile code implementation',
        'Backend GPS map server infrastructure and geo-caching APIs',
      ],
      milestones: [
        {
          title: 'Milestone 1: Core Trail Flow Architecture & Wireframes',
          description: 'Resolve conflicting UX priorities; test 1-tap workout and map hierarchy.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Validated wireframe prototype and flow deck.',
        },
        {
          title: 'Milestone 2: High-Fidelity UI & Design System',
          description: 'Design all 25+ screens, dark mode outdoor tokens, and Figma developer specs.',
          durationOrDate: 'Weeks 3 – 5',
          deliverablesSummary: 'Complete Figma master file with auto-layout components.',
        },
      ],
      timelineEstimate: '5 weeks recommended (adjusted from client’s unfeasible 3-week estimate to ensure rigorous QA).',
      budgetEstimate: 'Fixed investment of $10,500 USD.',
      pricingAndAssumptions: 'Fixed $10,500 USD. Assumes client engineering lead participates in weekly syncs.',
      revisionPolicy: 'Includes two consolidated revision rounds per milestone.',
      acceptanceCriteria: [
        'Workout initiation achievable in exactly 1 tap from home launch state',
        'All UI text meets outdoor high-glare contrast standards (WCAG AAA for active telemetry)',
        'Complete Figma library contains auto-layout components with zero detached instances',
      ],
      assumptionsAndDependencies: ['Client product owner arbitrates feature prioritization between safety and ads.'],
      clarificationQuestions: [
        'Can we push secondary social community features to a post-workout tab to prevent wilderness distraction?',
      ],
      nextSteps: ['Align on realistic 5-week schedule.', 'Sign statement of work.'],
      scopeMap: [
        {
          id: 'map-tp-1',
          requirement: 'Reduce workout start from 5 taps to 1 tap',
          deliverable: 'Single-tap Quick Start mobile interface & widget',
          milestone: 'Milestone 1: Core Trail Flow Architecture',
          acceptanceCriteria: '1-tap workout trigger validated in prototype user testing',
          outcome: 'Eliminate friction for athletes wearing gloves on trails',
          status: 'verified',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Add Native Apple Watch & Wear OS Companion App UI',
        message: 'Can we also design the full companion UI for Apple Watch and Wear OS smartwatches within this sprint?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Optimize Map Heart-Rate Elevation Graph',
        message: 'Can we adjust the workout summary graph to overlay heart rate beats-per-minute directly atop elevation climb?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 6. Social Media Marketing Campaign (Ambiguous Deliverables Demo)
  {
    id: 'sample-marketing-campaign',
    label: 'Social Media Marketing Campaign — Cotswold Botanical Herbals',
    shortDesc: 'Holistic skincare brand needing multi-channel spring product launch campaign, content calendar, asset templates, and copy prompts.',
    category: 'Marketing',
    complexity: 'Simple',
    completeness: 'Ambiguous Deliverable',
    highlightFeature: 'Multi-Channel Campaign Strategy (Gap Detector Demo)',
    brief: {
      projectTitle: 'Cotswold Botanical Herbals Spring Launch Campaign',
      clientName: 'Cotswold Botanical Herbals',
      projectCategory: 'Marketing',
      requirements:
        'We are launching a new organic botanical serum in May. We need marketing help to create a big splash on Instagram, TikTok, and Pinterest. We need creative concepts, post designs, caption copywriting, and a 6-week posting schedule. We also want good reach and sales.',
      goals:
        'Increase brand awareness, grow social following by 5,000, and generate $25,000 in launch-week serum sales.',
      budget: '$3,500 – $4,500',
      deadline: '4 weeks',
      tone: 'Friendly',
      notes: 'Unclear whether freelancer manages paid ad accounts or only creates assets.',
    },
    defaultProposal: {
      id: 'prop-sample-marketing',
      title: 'Cotswold Botanical Herbals Spring Launch Campaign',
      clientName: 'Cotswold Botanical Herbals',
      category: 'Marketing',
      createdAt: '2026-10-12T14:00:00.000Z',
      updatedAt: '2026-10-13T09:00:00.000Z',
      status: 'Needs Clarification',
      executiveSummary:
        'A multi-channel creative campaign strategy and content production sprint designed to introduce Cotswold Botanical Herbals’ new serum with organic visual storytelling and high customer engagement.',
      clientNeedsUnderstanding:
        'Cotswold needs cohesive editorial launch collateral to stand out amidst noisy beauty feeds. The scope must clearly differentiate organic creative asset production from paid media ad management.',
      proposedSolution:
        'A structured creative marketing engagement:\n\n1. Strategic Campaign Direction: Defining the "Rooted in Botany" campaign narrative and visual moodboards.\n2. Turnkey Content Kit: 24 bespoke social graphics, video reels templates, and caption copy.\n3. Content Calendar & Playbook: 6-week scheduling roadmap with hashtag clusters and influencer outreach scripts.',
      deliverables: [
        {
          category: 'Creative Strategy & Planning',
          items: [
            'Campaign Concept Deck with 3 core visual pillars',
            '6-Week Content Calendar with post timings, format specs, and hooks',
            'Influencer collaboration brief and outreach DM templates',
          ],
        },
        {
          category: 'Visual Assets & Copywriting',
          items: [
            '24 custom Canva/Figma post templates (Carousels, Static Posts, and Story frames)',
            '6 short-form video Reel/TikTok storyboard concepts with audio recommendations',
            'Complete caption copywriting suite with benefit-driven hooks and CTAs',
          ],
        },
      ],
      scopeInclusions: [
        'Design of 24 static/carousel templates and 6 video storyboards',
        'Full caption copy and hashtag strategy',
        'Two rounds of revisions on copy and visual assets',
      ],
      scopeExclusions: [
        'Management of paid ad spend budgets or daily Facebook/TikTok ad account bidding',
        'Direct community management (replying to customer DMs or comments during launch)',
        'Physical product shipping to influencers',
      ],
      milestones: [
        {
          title: 'Milestone 1: Campaign Narrative & Content Calendar',
          description: 'Establish creative angles, campaign narrative, and 6-week schedule.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Campaign playbook and scheduled calendar.',
        },
        {
          title: 'Milestone 2: Asset Production & Copy Handover',
          description: 'Design all templates, write captions, and deliver editable Canva/Figma links.',
          durationOrDate: 'Weeks 3 – 4',
          deliverablesSummary: 'Complete asset library and launch-ready media kit.',
        },
      ],
      timelineEstimate: '4 calendar weeks.',
      budgetEstimate: 'Fixed fee of $3,800 USD.',
      pricingAndAssumptions: 'Fixed $3,800 USD. Client provides raw serum photography and lab certifications.',
      revisionPolicy: 'Includes two consolidated revision rounds for copy and graphics.',
      acceptanceCriteria: [
        'Delivery of all 24 templates in editable Figma/Canva formats',
        'All captions include character-length optimization for respective platforms',
      ],
      assumptionsAndDependencies: ['Client team is responsible for publishing posts and managing ad spend.'],
      clarificationQuestions: ['Will your internal team be handling the daily scheduling through Buffer or Later?'],
      nextSteps: ['Confirm scope boundaries.', 'Execute agreement and deposit.'],
      scopeMap: [
        {
          id: 'map-mkt-1',
          requirement: 'Launch-week buzz and visual cohesion',
          deliverable: '24 custom social templates & 6-week content calendar',
          milestone: 'Milestone 2: Asset Production & Copy Handover',
          acceptanceCriteria: 'Complete delivery of 24 multi-platform templates with captions',
          outcome: 'Drive organic engagement and revenue for spring launch',
          status: 'defined',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Manage $10,000 Meta Paid Advertising Bidding',
        message: 'Can you also set up our Meta Ads Manager, build lookalike audiences, and run daily conversion ad testing with our $10k advertising budget?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add 2 Extra Carousel Slides on Ingredient Sourcing',
        message: 'Could we add two extra educational carousel slides detailing our organic cold-pressing extraction process?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 7. Online Learning Platform
  {
    id: 'sample-learning-platform',
    label: 'Online Learning Platform — Ars Typographica Academy',
    shortDesc: 'Editorial typography masterclasses platform with modular curriculum, video lessons, student project submissions, and instructor review dashboard.',
    category: 'SaaS and Software',
    complexity: 'Advanced',
    completeness: 'Complete & Detailed',
    highlightFeature: 'Curriculum & Student LMS Architecture',
    brief: {
      projectTitle: 'Ars Typographica Academy Educational Platform',
      clientName: 'Ars Typographica Academy',
      projectCategory: 'SaaS and Software',
      requirements:
        'Ars Typographica is a prestigious typography foundation offering masterclasses to designers worldwide. They need a custom web learning platform replacing fragmented Teachable courses. Features needed: course catalog with video lesson players, downloadable specimen PDFs, student typography project upload portals, instructor feedback review queue, student progress bar, and Stripe subscription / one-time checkout.',
      goals:
        'Deliver a distraction-free, beautifully typeset reading and learning environment. Increase course completion rate from 32% to over 65%.',
      budget: '$14,000 – $18,000',
      deadline: '10 weeks',
      tone: 'Premium',
      notes: 'Must support video streaming embed via Mux or Vimeo OTT. Clean typography first.',
    },
    defaultProposal: {
      id: 'prop-sample-learning',
      title: 'Ars Typographica Academy Educational Platform',
      clientName: 'Ars Typographica Academy',
      category: 'SaaS and Software',
      createdAt: '2026-10-10T09:00:00.000Z',
      updatedAt: '2026-10-12T12:00:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'An archival, high-craft online learning platform crafted to teach typographic discipline through an interface that itself embodies master typography. Features custom video player integration, student specimen upload channels, and asynchronous instructor critique workflows.',
      clientNeedsUnderstanding:
        'Off-the-shelf course builders (Teachable, Kajabi) feature clumsy typography and lack specialized tools for typographic critique (such as high-res specimen inspections and side-by-side kerning reviews).',
      proposedSolution:
        'A custom modern learning web application:\n\n1. Editorial Course Shell: Typographic hierarchy with distraction-free reading, video playback, and progress sync.\n2. Critique Portal: Students upload high-res PDF specimens; instructors leave timestamped visual feedback.\n3. Frictionless Commerce: Stripe checkout with single-purchase and institutional seat licenses.',
      deliverables: [
        {
          category: 'Frontend Learning Experience',
          items: [
            'Course curriculum dashboard and chapter lesson video viewer with Mux/Vimeo embed',
            'Downloadable resource vault with gated lesson access',
            'Student portfolio showcase and project submission interface',
          ],
        },
        {
          category: 'Instructor & Admin Infrastructure',
          items: [
            'Instructor critique review queue with inline comment annotations',
            'Stripe customer billing portal and automated enrollment email receipts',
            'Course progress telemetry and completion certificate generator',
          ],
        },
      ],
      scopeInclusions: [
        'Complete frontend application with user authentication integration',
        'Three rounds of iterative UX feedback gates',
        '60-day post-launch technical warranty',
      ],
      scopeExclusions: [
        'Video hosting bandwidth fees (billed through client Mux/Vimeo account)',
        'Original video course production or curriculum writing',
      ],
      milestones: [
        {
          title: 'Milestone 1: Learning Architecture & Lesson Wireframes',
          description: 'Design course taxonomy, video lesson player, and specimen critique flows.',
          durationOrDate: 'Weeks 1 – 3',
          deliverablesSummary: 'Interactive Figma prototype with student & instructor portals.',
        },
        {
          title: 'Milestone 2: Frontend Engineering & Video Integration',
          description: 'Build responsive learning dashboard, Mux video integration, and Stripe checkout.',
          durationOrDate: 'Weeks 4 – 7',
          deliverablesSummary: 'Functional staging application with live test video playback.',
        },
        {
          title: 'Milestone 3: Critique Queue, QA & Production Deployment',
          description: 'Implement instructor review queue, perform stress testing, and deploy.',
          durationOrDate: 'Weeks 8 – 10',
          deliverablesSummary: 'Live production release and platform documentation.',
        },
      ],
      timelineEstimate: '10 calendar weeks.',
      budgetEstimate: 'Fixed investment of $15,800 USD, structured 35% deposit, 35% Milestone 2, and 30% launch.',
      pricingAndAssumptions: 'Fixed $15,800 USD. Assumes client provides course videos and lesson text by Week 4.',
      revisionPolicy: 'Includes two consolidated revision rounds per milestone gate.',
      acceptanceCriteria: [
        'Video playback starts in < 1 second with adaptive streaming resolution',
        'Students can upload up to 25MB PDF specimens and receive instructor critique notifications',
        'Enrolled course state persists across sessions and devices',
      ],
      assumptionsAndDependencies: ['Client maintains active Mux and Stripe accounts.'],
      clarificationQuestions: ['Will you need team/enterprise bulk seat license purchase tiers?'],
      nextSteps: ['Sign agreement.', 'Begin technical architecture sprint.'],
      scopeMap: [
        {
          id: 'map-lms-1',
          requirement: 'Replace generic Teachable platform with master typographic interface',
          deliverable: 'Custom video player, specimen upload & critique portal',
          milestone: 'Milestone 2: Frontend Engineering & Video Integration',
          acceptanceCriteria: 'Distraction-free learning UI with sub-second page loads',
          outcome: 'Boost course completion rate from 32% to over 65%',
          status: 'verified',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Build Live 1-on-1 WebRTC Video Chat Classroom',
        message: 'Can we build an in-app live Zoom-like video classroom where professors can host live group video calls directly in the browser?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add Automated Completion Certificate Generator',
        message: 'Can we ensure that when a student hits 100% completion, a signed PDF certificate automatically generates with their name?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 8. Appointment Booking System
  {
    id: 'sample-appointment-system',
    label: 'Appointment Booking System — Nordic Spine & Physiotherapy',
    shortDesc: 'Specialized healthcare clinic needing patient intake, clinician availability calendar, appointment scheduling, and automated SMS/email reminders.',
    category: 'Business Operations',
    complexity: 'Moderate',
    completeness: 'Complete & Detailed',
    highlightFeature: 'Clinical Scheduling & Availability Engine',
    brief: {
      projectTitle: 'Nordic Spine Clinical Scheduling & Patient Intake System',
      clientName: 'Nordic Spine & Physiotherapy',
      projectCategory: 'Business Operations',
      requirements:
        'Nordic Spine is a premier rehabilitation clinic with 8 physical therapists in Minneapolis. Currently, receptionists spend 4 hours daily coordinating appointment times by telephone. They need a patient-friendly online booking portal that allows patients to select their therapist, pick an available 45-minute or 60-minute session, complete digital health history intake forms, and receive automated reminders. Needs seamless Google Calendar sync for clinicians.',
      goals:
        '1. Automate 60% of routine re-bookings online.\n2. Cut patient no-show rates from 18% to under 6% via automated reminder triggers.\n3. Save front-desk staff 20+ hours per week.',
      budget: '$7,000 – $9,500',
      deadline: '6 weeks',
      tone: 'Professional',
      notes: 'Must ensure patient intake form complies with state privacy requirements.',
    },
    defaultProposal: {
      id: 'prop-sample-appointment',
      title: 'Nordic Spine Clinical Scheduling & Patient Intake System',
      clientName: 'Nordic Spine & Physiotherapy',
      category: 'Business Operations',
      createdAt: '2026-10-11T10:00:00.000Z',
      updatedAt: '2026-10-12T16:30:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'A calm, reassuring appointment scheduling and intake ecosystem tailored for Nordic Spine & Physiotherapy. By synchronizing clinician availability with intuitive 3-step patient booking, this system eliminates front-desk bottlenecks and drastically reduces patient no-shows.',
      clientNeedsUnderstanding:
        'Front-desk staff is overwhelmed by repetitive calendar inquiries, while high patient no-show rates (18%) erode clinic revenue and create therapist idle time.',
      proposedSolution:
        'A comprehensive scheduling architecture:\n\n1. Multi-Clinician Availability Engine: Real-time slot management with therapist buffer times and calendar sync.\n2. Digital Patient Intake Flow: Mobile-friendly medical questionnaire completed prior to arrival.\n3. Automated Notification Sequences: Multi-channel SMS and email reminder cadence.',
      deliverables: [
        {
          category: 'Patient Booking Portal',
          items: [
            'Clinician selection directory with specialties and bio modal',
            '3-step appointment timepicker with real-time slot conflict prevention',
            'Encrypted digital patient intake questionnaire',
          ],
        },
        {
          category: 'Staff Operations & Integrations',
          items: [
            'Two-way Google Calendar synchronization for 8 therapists',
            'Twilio SMS and email reminder integration (24hr and 2hr alerts)',
            'Administrative master dashboard for appointment rescheduling and cancellations',
          ],
        },
      ],
      scopeInclusions: [
        'Setup for up to 8 staff clinician profiles and room assignment rules',
        'Configuration of email and SMS transactional templates',
        'Staff walkthrough training call and operational documentation',
      ],
      scopeExclusions: [
        'Direct electronic insurance claim processing (clearinghouse integration)',
        'Recurring third-party Twilio SMS message usage fees',
      ],
      milestones: [
        {
          title: 'Milestone 1: Workflow Mapping & Intake Wireframes',
          description: 'Map clinic scheduling rules, clinician shift hours, and patient questionnaire.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Validated wireframe prototype and schedule logic matrix.',
        },
        {
          title: 'Milestone 2: Engine Integration & Calendar Sync',
          description: 'Build booking widget, connect Google Calendar API, and configure Twilio alerts.',
          durationOrDate: 'Weeks 3 – 5',
          deliverablesSummary: 'Functional staging portal with end-to-end appointment testing.',
        },
        {
          title: 'Milestone 3: Clinic Staff Training & Live Go-Live',
          description: 'Front-desk staff training, live calendar cutover, and public website embed.',
          durationOrDate: 'Week 6',
          deliverablesSummary: 'Production release and clinic operational manual.',
        },
      ],
      timelineEstimate: '6 calendar weeks.',
      budgetEstimate: 'Fixed fee of $8,400 USD.',
      pricingAndAssumptions: 'Fixed $8,400 USD. Assumes clinic supplies therapist schedule hours by Week 2.',
      revisionPolicy: 'Includes two consolidated revision rounds per milestone.',
      acceptanceCriteria: [
        'Appointments booked online automatically create calendar events in the assigned therapist Google Calendar',
        'Test patients receive confirmation and 24h reminder SMS notifications',
        'Intake questionnaire securely encrypts submitted patient data',
      ],
      assumptionsAndDependencies: ['Clinic maintains Google Workspace account and Twilio SMS credentials.'],
      clarificationQuestions: ['Do you charge patient cancellation fees for late cancellations within 24 hours?'],
      nextSteps: ['Confirm clinic parameters.', 'Sign statement of work.'],
      scopeMap: [
        {
          id: 'map-app-1',
          requirement: 'Reduce patient no-show rate from 18% to under 6%',
          deliverable: 'Automated 24h & 2h SMS/Email reminder cadence via Twilio',
          milestone: 'Milestone 2: Engine Integration & Calendar Sync',
          acceptanceCriteria: '100% of booked appointments trigger scheduled SMS reminders',
          outcome: 'Protect therapist billable hours and clinical capacity',
          status: 'verified',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Full Insurance Clearinghouse & Billing Claim Adjudication',
        message: 'Can you integrate real-time health insurance eligibility verification with BlueCross and automate medical billing claim submissions?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add 15-Minute Therapist Cleaning Buffer Between Sessions',
        message: 'Could we ensure the system automatically inserts a 15-minute sanitization buffer between patient appointments so therapists can reset rooms?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 9. SaaS Dashboard Design
  {
    id: 'sample-saas-dashboard',
    label: 'SaaS Dashboard Design — PulseMetrics Telemetry',
    shortDesc: 'Cloud infrastructure monitoring platform needing high-density telemetry dashboard, server health cards, latency graphs, and alert center.',
    category: 'SaaS and Software',
    complexity: 'Advanced',
    completeness: 'Complete & Detailed',
    highlightFeature: 'High-Density Data Visualization Architecture',
    brief: {
      projectTitle: 'PulseMetrics Cloud Telemetry Dashboard UI/UX System',
      clientName: 'PulseMetrics Telemetry',
      projectCategory: 'SaaS and Software',
      requirements:
        'PulseMetrics provides server telemetry and Kubernetes observability for devops engineers. Our current dashboard was built by backend engineers and is hard to scan during incidents. We need a high-density, professional UI design system in Figma: KPI metric cards (CPU, Memory, P99 latency, Error Rate), filterable log inspection tables, service topology heatmaps, alerting rules modal, and user permission settings. Must support dark mode as the default.',
      goals:
        '1. Allow site reliability engineers to triage incidents in under 60 seconds.\n2. Create modular component library in Figma for frontend engineering team.\n3. Deliver high visual clarity with tabular numbers and accessible color alerts.',
      budget: '$11,000 – $14,000',
      deadline: '7 weeks',
      tone: 'Professional',
      notes: 'Dark mode primary. Must adhere strictly to WCAG AA contrast for status indicators.',
    },
    defaultProposal: {
      id: 'prop-sample-saas',
      title: 'PulseMetrics Cloud Telemetry Dashboard UI/UX System',
      clientName: 'PulseMetrics Telemetry',
      category: 'SaaS and Software',
      createdAt: '2026-10-10T15:00:00.000Z',
      updatedAt: '2026-10-12T17:00:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'A precision-engineered design system and dashboard architecture for PulseMetrics Telemetry. Designed for instant visual parsing during high-severity infrastructure incidents, featuring tabular typography, high-contrast status tokens, and modular telemetry widgets.',
      clientNeedsUnderstanding:
        'Devops engineers lose precious minutes during cloud outages attempting to decipher poorly structured dashboards. The current interface lacks typographic hierarchy and relies on ambiguous color coding.',
      proposedSolution:
        'A comprehensive design system sprint:\n\n1. Cognitive Load Architecture: Restructuring telemetry into three tiers (High-level Health Overview -> Metric Time-series -> Filterable Incident Logs).\n2. High-Density Token System: Modular cards, tabular monospace data alignment, and accessible alert levels (Info, Warning, Critical).\n3. Turnkey Figma Master System: 20+ production dashboard screens with auto-layout variables.',
      deliverables: [
        {
          category: 'Dashboard Architecture & Layouts',
          items: [
            'Cluster Health Overview screen with latency sparklines and resource gauges',
            'Filterable Log Inspection & Query Table with column sorting and expanders',
            'Incident Alert Rule Builder and notification routing modal',
            'Organization Settings, API keys, and RBAC user permissions screens',
          ],
        },
        {
          category: 'Figma Design System & Tokens',
          items: [
            'Complete dark-mode UI kit with auto-layout and interactive component states',
            'Color token taxonomy with accessible red/amber/green/blue alert thresholds',
            'Chart styling guide (Line graphs, Area curves, Bar charts, and Heatmaps)',
          ],
        },
      ],
      scopeInclusions: [
        'Over 20 unique high-fidelity dashboard views in Figma',
        'Component token documentation and developer handoff walkthrough',
        'Two rounds of structured stakeholder review cycles',
      ],
      scopeExclusions: [
        'Frontend React/Vue application code implementation',
        'Backend Prometheus/Elasticsearch database integration',
      ],
      milestones: [
        {
          title: 'Milestone 1: Metric Card Architecture & Data Hierarchy',
          description: 'Establish telemetry wireframes, metric card layouts, and chart visual styles.',
          durationOrDate: 'Weeks 1 – 3',
          deliverablesSummary: 'Approved interactive wireframe flow deck.',
        },
        {
          title: 'Milestone 2: High-Density UI Screens & Design Tokens',
          description: 'Build all 20+ screens, component library, and incident triaging modals.',
          durationOrDate: 'Weeks 4 – 6',
          deliverablesSummary: 'Complete Figma master file with auto-layout components.',
        },
        {
          title: 'Milestone 3: Developer Handoff & Token Specification',
          description: 'Annotate component specs, token exports, and conduct engineering walkthrough.',
          durationOrDate: 'Week 7',
          deliverablesSummary: 'Design token export package and recorded walkthrough video.',
        },
      ],
      timelineEstimate: '7 calendar weeks.',
      budgetEstimate: 'Fixed investment of $12,500 USD.',
      pricingAndAssumptions: 'Fixed $12,500 USD. Assumes client engineering team provides telemetry schema.',
      revisionPolicy: 'Includes two consolidated revision rounds per milestone.',
      acceptanceCriteria: [
        'All metric cards use tabular monospace figures for vertical number alignment',
        'Every alert color token maintains minimum 4.5:1 contrast against dark background',
        'Figma component system achieves 100% auto-layout compliance',
      ],
      assumptionsAndDependencies: ['Client provides list of all monitored server metrics and log attributes.'],
      clarificationQuestions: ['Do you require light mode designs or is the product exclusively dark mode?'],
      nextSteps: ['Confirm scope parameters.', 'Execute agreement and deposit.'],
      scopeMap: [
        {
          id: 'map-saas-1',
          requirement: 'Sub-60-second incident triage for devops engineers',
          deliverable: 'High-density Cluster Health & Latency Dashboard in Figma',
          milestone: 'Milestone 2: High-Density UI Screens & Design Tokens',
          acceptanceCriteria: 'Critical latency and error rates visible above the fold',
          outcome: 'Reduce Mean Time to Resolution (MTTR) during cloud outages',
          status: 'verified',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Code Production React Frontend Components',
        message: 'Can your team also write the production React and TypeScript code for all dashboard charts and log tables using Tailwind?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add Collapsible Sidebar Rail Variant',
        message: 'Could we design a slim icon-only sidebar variant so engineers can maximize screen real estate for wide data tables?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 10. Website Accessibility Improvement (WCAG Audit & Remediation)
  {
    id: 'sample-accessibility-audit',
    label: 'Website Accessibility Improvement — Evergreen Public Health Alliance',
    shortDesc: 'Non-profit health coalition needing comprehensive WCAG 2.1 AA accessibility audit, remediation blueprint, and screen-reader accessible overhaul.',
    category: 'Web Development',
    complexity: 'Moderate',
    completeness: 'Complete & Detailed',
    highlightFeature: 'WCAG 2.1 AA Accessibility Remediation',
    brief: {
      projectTitle: 'Evergreen Health Alliance Accessibility Audit & Remediation',
      clientName: 'Evergreen Public Health Alliance',
      projectCategory: 'Web Development',
      requirements:
        'Evergreen Public Health Alliance serves 200k residents, including seniors and individuals with visual and motor disabilities. Our public health portal recently received a formal complaint regarding inaccessible vaccine clinic forms, missing alt text, poor color contrast, and inability to navigate via keyboard. We need a formal WCAG 2.1 AA compliance audit, code remediation on 12 key templates, ARIA landmark integration, screen reader testing, and a VPAT Voluntary Product Accessibility Template statement.',
      goals:
        '1. Achieve full WCAG 2.1 AA compliance across all public health resources.\n2. Ensure 100% keyboard accessibility for clinic appointment booking forms.\n3. Publish a public Accessibility Statement to demonstrate community commitment.',
      budget: '$8,000 – $10,500',
      deadline: '5 weeks',
      tone: 'Professional',
      notes: 'Must include testing with NVDA, JAWS, and VoiceOver screen readers.',
    },
    defaultProposal: {
      id: 'prop-sample-access',
      title: 'Evergreen Health Alliance Accessibility Audit & Remediation',
      clientName: 'Evergreen Public Health Alliance',
      category: 'Web Development',
      createdAt: '2026-10-10T12:00:00.000Z',
      updatedAt: '2026-10-12T15:30:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'A comprehensive accessibility audit and technical remediation program for the Evergreen Public Health Alliance portal. By identifying code barriers and systematically implementing WCAG 2.1 AA standards, we ensure that every community member—regardless of ability—can independently access critical healthcare resources.',
      clientNeedsUnderstanding:
        'The current portal contains inaccessible form fields, missing focus rings, and contrast failures that exclude visually impaired residents and expose the alliance to legal risk under Section 508 and ADA Title III guidelines.',
      proposedSolution:
        'A rigorous three-step remediation methodology:\n\n1. Baseline Audit & Barrier Inventory: Automated scans combined with manual keyboard and screen reader verification.\n2. Direct Code Remediation: Fixing HTML semantic structure, ARIA landmarks, form labeling, and contrast tokens.\n3. Verification & Compliance Documentation: Re-testing with assistive technologies and authoring an official Accessibility Statement.',
      deliverables: [
        {
          category: 'Audit & Diagnostic Documentation',
          items: [
            'Comprehensive WCAG 2.1 AA Barrier Inventory Report categorized by severity',
            'Screen reader test recordings across NVDA, VoiceOver, and JAWS',
            'Color contrast remediation matrix for public health color tokens',
          ],
        },
        {
          category: 'Technical Code Remediation & Certification',
          items: [
            'Direct code fixes across 12 primary portal page templates and clinic booking forms',
            'Accessible keyboard navigation with visible focus indicators and skip-to-content links',
            'Accessible modal dialogs with focus trap and escape-key dismissal',
            'Official Voluntary Product Accessibility Template (VPAT) and public Accessibility Statement',
          ],
        },
      ],
      scopeInclusions: [
        'Direct remediation on up to 12 primary templates',
        'Manual testing with screen readers (VoiceOver, NVDA)',
        '30-day post-remediation verification warranty',
      ],
      scopeExclusions: [
        'Legal liability representation or formal indemnification guarantees in court',
        'Remediation of third-party external embedded iframes or legacy PDF archives',
      ],
      milestones: [
        {
          title: 'Milestone 1: Diagnostic Audit & Accessibility Report',
          description: 'Conduct automated and manual screen-reader audit across 12 templates.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Comprehensive Barrier Inventory Report.',
        },
        {
          title: 'Milestone 2: Direct Code Remediation & Testing',
          description: 'Implement semantic HTML, ARIA landmarks, keyboard focus traps, and contrast fixes.',
          durationOrDate: 'Weeks 3 – 4',
          deliverablesSummary: 'Remediated codebase deployed on staging environment.',
        },
        {
          title: 'Milestone 3: Verification & VPAT Compliance Handover',
          description: 'Perform re-testing verification and author public Accessibility Statement.',
          durationOrDate: 'Week 5',
          deliverablesSummary: 'VPAT document, public statement, and production code deployment.',
        },
      ],
      timelineEstimate: '5 calendar weeks.',
      budgetEstimate: 'Fixed fee of $9,200 USD.',
      pricingAndAssumptions: 'Fixed $9,200 USD. Assumes access to staging source code repository in Git.',
      revisionPolicy: 'Includes two consolidated verification review cycles.',
      acceptanceCriteria: [
        'Zero critical or serious violations detected by axe-core and WAVE automated linters',
        'All clinic appointment booking forms navigable using keyboard Tab and Enter keys exclusively',
        'Official VPAT document completed and signed by certified accessibility specialist',
      ],
      assumptionsAndDependencies: ['Client provides Git repository access and staging deployment environment.'],
      clarificationQuestions: ['Do you have legacy PDF documents that require separate document tagging?'],
      nextSteps: ['Grant repository access.', 'Execute agreement and deposit.'],
      scopeMap: [
        {
          id: 'map-acc-1',
          requirement: 'WCAG 2.1 AA compliance for public health clinic booking',
          deliverable: 'Semantic form overhaul with ARIA landmarks & keyboard focus traps',
          milestone: 'Milestone 2: Direct Code Remediation & Testing',
          acceptanceCriteria: '100% keyboard accessibility and screen-reader form field narration',
          outcome: 'Ensure equitable healthcare access and eliminate legal vulnerability',
          status: 'verified',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Remediate 400 Historical PDF Pamphlets',
        message: 'Can you also manually tag and remediate all 400 historical PDF pamphlets and board meeting minutes dating back to 2012 for screen readers?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add High-Contrast Dark Text Mode Toggle',
        message: 'Could we include an accessible high-contrast toggle button in the header for low-vision readers?',
        expectedVerdict: 'within_scope',
      },
    ],
  },

  // 11. (Existing) Website Redesign — Beacon Peak Outfitting
  {
    id: 'sample-website-redesign',
    label: 'Website Redesign — Beacon Peak Outfitting',
    shortDesc: 'Small business needing clearer information architecture, streamlined navigation, and modern mobile responsiveness.',
    category: 'Web Development',
    complexity: 'Moderate',
    completeness: 'Complete & Detailed',
    highlightFeature: 'Information Architecture & Mobile Inquiry Overhaul',
    brief: {
      projectTitle: 'Beacon Peak Outfitting Website Modernization',
      clientName: 'Beacon Peak Outfitting',
      projectCategory: 'Web Development',
      requirements:
        'Beacon Peak is a Pacific Northwest mountain guide and outdoor gear company founded in 2018. Their current WordPress site is slow, cluttered with outdated plugins, and hard to navigate on mobile phones. Customers frequently call because they cannot find trip departure schedules or equipment rental pricing. The redesign requires clean information architecture, a fast responsive layout, interactive gear checklist, and inquiry booking forms. They plan to keep their current hosting on WP Engine.',
      goals:
        '1. Reduce bounce rate on mobile devices from 68% to under 35%.\n2. Increase rental inquiry form completions by 40%.\n3. Implement a clear, intuitive 4-step navigation system for expeditions, rentals, and guides.\n4. Achieve Google Lighthouse mobile performance score of 90+.',
      budget: '$7,500 – $9,000',
      deadline: '6 weeks from project kick-off',
      tone: 'Professional',
      notes:
        'Client has brand photography ready in Dropbox. Copywriting for trips will be provided by client marketing manager. Excludes custom e-commerce checkout.',
    },
    defaultProposal: {
      id: 'sample-prop-website-redesign',
      title: 'Beacon Peak Outfitting Website Modernization',
      clientName: 'Beacon Peak Outfitting',
      category: 'Web Development',
      createdAt: '2026-10-10T14:00:00.000Z',
      updatedAt: '2026-10-12T10:30:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'This proposal outlines a focused 6-week website modernization for Beacon Peak Outfitting. By rebuilding the navigation architecture, streamlining mobile responsiveness, and creating dedicated reservation inquiry funnels, we will eliminate customer friction and turn casual visitors into booked expedition guests. Our approach prioritizes technical speed, accessibility, and clean visual hierarchy.',
      clientNeedsUnderstanding:
        'Beacon Peak Outfitting is currently losing prospective expedition guests due to high mobile bounce rates (68%) and confusing navigation menus. Customers struggle to locate departure dates, packing requirements, and equipment rental rates. The technical debt in the current WordPress installation prevents the internal team from publishing seasonal schedule updates efficiently.',
      proposedSolution:
        'We propose a clean, component-driven website redesign built on a modern lightweight stack compatible with your WP Engine environment:\n\n1. Information Architecture & Wireframing: Restructure the site into four core pillars (Expeditions, Equipment Rentals, Guide Profiles, and Direct Inquiries).\n2. Mobile-First Responsive Interface: Craft high-performance UI components optimized for outdoor enthusiasts checking trip details on cellular networks.\n3. Streamlined Inquiry Flow: Replace complex multi-page forms with an intuitive two-step expedition reservation request form.',
      deliverables: [
        {
          category: 'Architecture & UX Wireframes',
          items: [
            'Interactive site architecture map & content inventory',
            'Low-fidelity wireframes for Homepage, Expedition Index, Trip Detail, and Rental Guide',
            'Mobile touchpoint interaction flows',
          ],
        },
        {
          category: 'Visual Design & Frontend Build',
          items: [
            'High-fidelity responsive UI layouts (Desktop, Tablet, Mobile)',
            'Custom expedition filter component (by difficulty, season, and duration)',
            'Interactive gear checklist with printable summary',
            'Tailwind-based modular component system adhering to WCAG 2.1 AA accessibility',
          ],
        },
      ],
      scopeInclusions: [
        'Up to 8 custom page templates (Home, Expeditions, Single Trip, Rentals, About, Guides, FAQs, Contact)',
        'Two rounds of structured revisions for each milestone gate',
        'Cross-browser QA on modern versions of Chrome, Safari, and Edge',
        '30-day post-launch warranty for defect remediation',
      ],
      scopeExclusions: [
        'Direct online credit card payment processing (inquiry-based booking only)',
        'Original commercial copywriting (client supplies final trip descriptions)',
        'Video production and on-location photography shoots',
        'Migration of more than 15 historical blog articles',
      ],
      milestones: [
        {
          title: 'Milestone 1: Discovery, IA & Wireframes',
          description: 'Establish the streamlined sitemap, trip taxonomy, and responsive wireframes.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Approved sitemap, wireframe deck, and technical specification sheet.',
        },
        {
          title: 'Milestone 2: Design System & Staging Build',
          description: 'Build responsive templates on private staging environment with client asset integration.',
          durationOrDate: 'Weeks 3 – 5',
          deliverablesSummary: 'Functional staging site with working filter components and inquiry forms.',
        },
        {
          title: 'Milestone 3: QA, Performance Audit & Launch',
          description: 'Lighthouse optimization, cross-device verification, DNS cutover, and staff walkthrough.',
          durationOrDate: 'Week 6',
          deliverablesSummary: 'Live production release, Lighthouse audit report, and recorded admin guide.',
        },
      ],
      timelineEstimate: '6 calendar weeks from formal agreement execution and deposit receipt.',
      budgetEstimate: 'Fixed-fee engagement of $8,200 USD, billed 40% at commencement, 30% at Milestone 2 staging approval, and 30% at final deployment.',
      pricingAndAssumptions:
        'Fixed investment of $8,200 USD based on agreed scope. Assumes client provides copy assets within 5 business days of Milestone 1 sign-off.',
      revisionPolicy:
        'Includes two consolidated revision rounds per milestone. Additional requests outside agreed wireframes are estimated at standard studio change-order rate of $120/hr.',
      acceptanceCriteria: [
        'Google Lighthouse mobile performance score of 90 or higher on all primary templates',
        'All expedition inquiry submissions route correctly to designated team inboxes with confirmation email',
        'Zero layout breakage across iOS Safari, Android Chrome, and modern desktop browsers',
        'Passes automated WCAG 2.1 AA accessibility contrast checks',
      ],
      assumptionsAndDependencies: [
        'Client provides administrative credentials for WP Engine hosting and domain registrar prior to Week 2.',
        'Client appoints a single authorized decision-maker for milestone approval sign-offs.',
        'Existing domain and hosting account renewals remain client financial responsibility.',
      ],
      clarificationQuestions: [
        'Are there existing third-party trip booking calendars (such as FareHarbor or Peek Pro) that we should link out to?',
        'Who on your team will be responsible for reviewing and approving staging builds at the end of Week 4?',
      ],
      nextSteps: [
        'Confirm acceptance of scope and proposed milestone schedule.',
        'Execute master services contract and initial 40% retainer invoice.',
        'Schedule 45-minute kick-off discovery call to finalize sitemap parameters.',
      ],
      scopeMap: [
        {
          id: 'map-1',
          requirement: 'Clear navigation for expeditions & rental pricing',
          deliverable: 'Interactive 4-pillar sitemap & trip index',
          milestone: 'Milestone 1: Discovery & IA',
          acceptanceCriteria: 'Trip departures and rental costs reachable in 2 clicks or fewer',
          outcome: 'Reduce customer service call volume regarding trip schedules',
          status: 'verified',
        },
        {
          id: 'map-2',
          requirement: 'Mobile responsiveness & fast load times',
          deliverable: 'Responsive Tailwind UI components & asset optimization',
          milestone: 'Milestone 2: Design System & Staging Build',
          acceptanceCriteria: 'Lighthouse mobile score >= 90; load time < 2.2s on 4G',
          outcome: 'Lower mobile bounce rate from 68% to under 35%',
          status: 'defined',
        },
        {
          id: 'map-3',
          requirement: 'High-converting reservation inquiry form',
          deliverable: 'Two-step expedition booking inquiry component',
          milestone: 'Milestone 2: Design System & Staging Build',
          acceptanceCriteria: '100% test inquiries received in team inbox with auto-receipt',
          outcome: 'Increase booking inquiries by 40%',
          status: 'in_review',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Add Full E-Commerce Gear Store',
        message: 'Can we also let customers buy climbing ropes and jackets directly on the site with a shopping cart and credit card processing before launch?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Refine Hero Typography and Palette',
        message: 'Could we adjust the hero headline font to be slightly bolder and change the secondary forest green accent to a slightly deeper sage?',
        expectedVerdict: 'within_scope',
      },
      {
        title: 'Import 90 Historical Blog Posts',
        message: 'We realized we have 90 old blog posts from 2018 with image galleries that we need migrated and reformatted into the new layout.',
        expectedVerdict: 'boundary',
      },
    ],
  },

  // 12. (Existing) Brand Identity — Luminary Ventures
  {
    id: 'sample-brand-identity',
    label: 'Brand Identity — Luminary Ventures',
    shortDesc: 'Early-stage climate technology venture fund needing logo system, typography hierarchy, color palette, and brand guidelines.',
    category: 'Branding',
    complexity: 'Moderate',
    completeness: 'Complete & Detailed',
    highlightFeature: 'Institutional Investor Pitch System',
    brief: {
      projectTitle: 'Luminary Ventures Brand Identity & Design System',
      clientName: 'Luminary Ventures',
      projectCategory: 'Branding',
      requirements:
        'Luminary Ventures is a new $25M climate technology venture firm investing in decarbonization, grid resilience, and synthetic biology. They need a dignified, intellectual brand identity that appeals to both institutional limited partners (university endowments, family offices) and mission-driven founders. They need an iconic logo mark, secondary lockups, typographic scale, high-contrast color system, presentation pitch deck template in Figma, and a comprehensive brand book.',
      goals:
        '1. Establish authoritative visual credibility for limited partner fundraising rounds.\n2. Convey technological optimism without falling into generic green-leaf or tech-blue clichés.\n3. Deliver turnkey Figma templates for ongoing partner communications.',
      budget: '$6,000 – $7,500',
      deadline: '4 weeks',
      tone: 'Premium',
      notes: 'Must include dark and light background variations. Requires SVG vectors and print-ready vector formats.',
    },
    defaultProposal: {
      id: 'sample-prop-brand-identity',
      title: 'Luminary Ventures Brand Identity & Design System',
      clientName: 'Luminary Ventures',
      category: 'Branding',
      createdAt: '2026-10-11T09:15:00.000Z',
      updatedAt: '2026-10-12T11:00:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'This proposal outlines a 4-week identity sprint designed to position Luminary Ventures as an enduring leader in climate technology investing. By pairing institutional typographic gravitas with a distinctive chromatic language, we will build a brand system that commands respect among institutional endowments while inspiring visionary founders.',
      clientNeedsUnderstanding:
        'Luminary Ventures is preparing for institutional LP roadshows. Their current temporary identity lacks weight and differentiation, using generic stock imagery that fails to convey the scientific rigor of their investment thesis in decarbonization and grid infrastructure.',
      proposedSolution:
        'We will execute a structured three-phase brand design methodology:\n\n1. Strategic Positioning & Visual Territory: Define two distinct creative directions balancing archival prestige with scientific optimism.\n2. Core Identity System: Design the primary mark, responsive wordmark, typography scale, and color taxonomy.\n3. Asset System & Guidelines: Package ready-to-use vector assets, Figma pitch deck system, and a 32-page digital brand monograph.',
      deliverables: [
        {
          category: 'Core Identity Assets',
          items: [
            'Primary logo mark, responsive wordmark, and monogram crest',
            'Full vector package in SVG, EPS, PDF, and high-res PNG formats',
            'Light and dark mode asset variations for digital and print reproduction',
          ],
        },
        {
          category: 'Typography & Palette System',
          items: [
            'Typographic pairing guide with commercial font licensing recommendations',
            'Accessible color palette with hex, RGB, and CMYK specifications',
            'Digital presentation template in Figma (16:9 investor pitch deck with 18 slide layouts)',
            'Comprehensive 32-page PDF Brand Guidelines Monograph',
          ],
        },
      ],
      scopeInclusions: [
        'Two distinct visual direction concepts presented during Milestone 1',
        'Up to three rounds of refinement on the selected direction',
        'Figma source component library with auto-layout templates',
      ],
      scopeExclusions: [
        'Commercial font software desktop/web licensing fees (purchased directly by client)',
        'Website frontend code development (covered under separate scope)',
        'Physical print production and swag manufacturing procurement',
      ],
      milestones: [
        {
          title: 'Milestone 1: Visual Territories & Concept Directions',
          description: 'Present two divergent design directions with mock applications in investor contexts.',
          durationOrDate: 'Week 1',
          deliverablesSummary: 'Concept presentation deck with comparative moodboards.',
        },
        {
          title: 'Milestone 2: Identity Craft & System Refinement',
          description: 'Refine chosen direction, finalize vector geometry, color formulas, and typographic scale.',
          durationOrDate: 'Weeks 2 – 3',
          deliverablesSummary: 'Finalized mark geometry and Figma token library.',
        },
        {
          title: 'Milestone 3: Presentation Deck & Brand Monograph',
          description: 'Deliver the 18-slide Figma presentation system and complete brand guideline manual.',
          durationOrDate: 'Week 4',
          deliverablesSummary: 'Master vector archive, Figma deck, and PDF Brand Monograph.',
        },
      ],
      timelineEstimate: '4 calendar weeks from kick-off to final delivery.',
      budgetEstimate: 'Fixed fee of $6,800 USD, structured 50% deposit and 50% upon final asset handover.',
      pricingAndAssumptions:
        'Fixed investment of $6,800 USD. Assumes client provides feedback on visual directions within 3 business days.',
      revisionPolicy:
        'Includes three iterative revision rounds on the selected direction. Brand pivots after Milestone 1 approval billed separately.',
      acceptanceCriteria: [
        'All vector marks pass scalability inspection from 16px favicon to large-format vector output',
        'Palette meets WCAG AA contrast standards for digital pitch presentations',
        'Figma deck includes all 18 specified slide templates with responsive text styles',
      ],
      assumptionsAndDependencies: [
        'Final decision-maker attends concept presentations and provides consolidated written feedback.',
      ],
      clarificationQuestions: [
        'Do you have any registered trademark considerations for the Luminary Ventures name?',
      ],
      nextSteps: [
        'Sign statement of work and remit 50% kick-off deposit.',
        'Schedule discovery alignment session for Monday kick-off.',
      ],
      scopeMap: [
        {
          id: 'map-b1',
          requirement: 'Authoritative identity for LP fundraising',
          deliverable: 'Primary logo system & brand monograph',
          milestone: 'Milestone 2: Identity Craft',
          acceptanceCriteria: 'Scalable vector geometry across light & dark backgrounds',
          outcome: 'Convey institutional gravitas during investor roadshows',
          status: 'verified',
        },
        {
          id: 'map-b2',
          requirement: 'Turnkey investor presentation templates',
          deliverable: '18-slide modular Figma deck system',
          milestone: 'Milestone 3: Presentation Deck & Monograph',
          acceptanceCriteria: 'All 18 slide layouts built with Figma auto-layout and typography tokens',
          outcome: 'Empower partners to create custom LP decks in minutes',
          status: 'defined',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Full Website Development',
        message: 'Can you also build and code our full marketing website in Webflow or Next.js using the new brand guidelines before the end of Week 4?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Alternate Monogram Sub-Mark',
        message: 'Could we explore an alternate compact monogram icon variation for social avatar circular crops?',
        expectedVerdict: 'within_scope',
      },
      {
        title: 'Printed Stationery & Business Card Sourcing',
        message: 'Can you manage the physical foil-stamping print production and paper stock selection with a local printing house in Boston?',
        expectedVerdict: 'boundary',
      },
    ],
  },

  // 13. (Existing) E-commerce Store — Sylvan Ceramic Works
  {
    id: 'sample-ecommerce-store',
    label: 'E-commerce Store — Sylvan Ceramic Works',
    shortDesc: 'Artisan pottery studio requiring product catalog, inventory sync, cart, Stripe checkout, and transactional emails.',
    category: 'Web Development',
    complexity: 'Advanced',
    completeness: 'Complete & Detailed',
    highlightFeature: 'Artisan Drop Commerce & Fragile Packaging Rates',
    brief: {
      projectTitle: 'Sylvan Ceramic Works Direct-to-Consumer Flagship',
      clientName: 'Sylvan Ceramic Works',
      projectCategory: 'Web Development',
      requirements:
        'Sylvan is a boutique ceramics studio in Vermont selling small-batch stoneware and handmade tableware. Currently selling through weekend markets and sporadic Instagram direct messages, they need an elegant digital storefront. Requirements include: organized catalog of 120 products across 6 collections, live inventory availability indicators, shopping cart drawer, secure Stripe checkout, automated order confirmation emails, and Shopify or custom headless commerce integration.',
      goals:
        '1. Transition 80% of direct customer orders from manual Instagram DMs to automated web checkout.\n2. Handle high-traffic batch collection drops without site crashes.\n3. Present high-resolution ceramic textures with sub-second page loads.\n4. Enable easy product upload and inventory adjustments for studio apprentices.',
      budget: '$10,000 – $13,000',
      deadline: '8 weeks',
      tone: 'Friendly',
      notes: 'Must include gift note option on checkout and shipping calculation for fragile ceramic packaging.',
    },
    defaultProposal: {
      id: 'sample-prop-ecommerce-store',
      title: 'Sylvan Ceramic Works Direct-to-Consumer Flagship',
      clientName: 'Sylvan Ceramic Works',
      category: 'Web Development',
      createdAt: '2026-10-09T16:20:00.000Z',
      updatedAt: '2026-10-12T08:45:00.000Z',
      status: 'Ready for Review',
      executiveSummary:
        'This proposal presents an 8-week design and development engagement to establish Sylvan Ceramic Works’ flagship digital storefront. Built for quiet elegance and robust traffic handling during limited batch releases, the store combines tactile editorial photography with an effortless cart drawer, secure payment processing, and automated shipping workflows.',
      clientNeedsUnderstanding:
        'Sylvan Ceramic Works loses significant sales revenue and administrative hours manually handling custom orders via Instagram messages. During seasonal ceramic collection drops, overwhelming inquiries lead to double-booked inventory and delayed dispatch notifications.',
      proposedSolution:
        'We will develop a bespoke direct-to-consumer store with:\n\n1. Tactile Product Presentation: High-resolution zoom galleries and collection filter matrix (stoneware, tableware, glazed vases).\n2. Frictionless Commerce Flow: Slide-out cart drawer, fragile shipping rates calculator, gift note message field, and Apple Pay / Stripe integration.\n3. Operational Autonomy: Intuitive backend for studio inventory adjustments and automated customer order confirmations.',
      deliverables: [
        {
          category: 'Catalog & Storefront Frontend',
          items: [
            'Bespoke storefront templates (Home, Collection Index, Product Detail, Story, FAQ, Contact)',
            'Collection drop countdown banner and out-of-stock waitlist notifications',
            'Slide-out quick cart drawer with real-time inventory validation',
          ],
        },
        {
          category: 'Checkout, Payments & Integrations',
          items: [
            'Secure Stripe / Shop Pay checkout configuration with SSL encryption',
            'Tiered weight-based fragile shipping calculation for domestic US orders',
            'Custom branded transactional emails (Order Confirmation, Shipping Tracking Notification)',
            'Staff training walkthrough video for inventory replenishment',
          ],
        },
      ],
      scopeInclusions: [
        'Initial setup and catalog entry for up to 120 artisan ceramic products',
        'Integration with Stripe and automated sales tax configuration',
        'Mobile optimization and end-to-end checkout test transactions',
        '45-day post-launch technical warranty',
      ],
      scopeExclusions: [
        'Ongoing recurring fees for Shopify / Stripe transaction merchant fees',
        'International customs duties and cross-border currency conversions',
        'Warehouse fulfillment or physical shipping logistics management',
      ],
      milestones: [
        {
          title: 'Milestone 1: Wireframing & Catalog Hierarchy',
          description: 'Establish collection categories, product attribute matrix, and mobile cart wireframes.',
          durationOrDate: 'Weeks 1 – 2',
          deliverablesSummary: 'Catalog taxonomy blueprint and interactive cart wireframe.',
        },
        {
          title: 'Milestone 2: Frontend Design & Cart Architecture',
          description: 'Build responsive product detail templates, slide-out drawer, and collection filters.',
          durationOrDate: 'Weeks 3 – 5',
          deliverablesSummary: 'Staging storefront with interactive product zoom and test cart.',
        },
        {
          title: 'Milestone 3: Checkout Configuration & Inventory Import',
          description: 'Connect payment gateways, shipping tables, transactional emails, and import 120 SKUs.',
          durationOrDate: 'Weeks 6 – 7',
          deliverablesSummary: 'End-to-end test checkout transactions and populated catalog.',
        },
        {
          title: 'Milestone 4: Testing, DNS Cutover & Drop Launch',
          description: 'High-traffic drop load testing, staff training call, and live launch.',
          durationOrDate: 'Week 8',
          deliverablesSummary: 'Live storefront, verified live payments, and staff training recording.',
        },
      ],
      timelineEstimate: '8 calendar weeks from kick-off to launch.',
      budgetEstimate: 'Fixed investment of $11,500 USD, billed 35% deposit, 35% Milestone 2 approval, and 30% upon live launch.',
      pricingAndAssumptions:
        'Fixed investment of $11,500 USD. Assumes client provides product photos and dimension weights by Week 4.',
      revisionPolicy:
        'Two rounds of revisions per milestone. Complex third-party integrations not listed are estimated on a change-order basis.',
      acceptanceCriteria: [
        'Cart drawer updates instantly with zero page reload',
        'Successful test transactions processed via credit card and Apple Pay',
        'Order confirmation and receipt emails delivered within 60 seconds',
        'Product pages load under 2 seconds on standard mobile connections',
      ],
      assumptionsAndDependencies: [
        'Client provides active Stripe merchant account credentials by Week 5.',
        'High-resolution pottery photography provided with white or neutral backgrounds.',
      ],
      clarificationQuestions: [
        'Do you plan to offer international shipping to Canada or Europe during the initial launch phase?',
      ],
      nextSteps: [
        'Approve proposal scope and schedule.',
        'Sign master services contract and process initial deposit.',
        'Share product catalog spreadsheet and image folder.',
      ],
      scopeMap: [
        {
          id: 'map-c1',
          requirement: 'Automate Instagram DM sales into web checkout',
          deliverable: 'Frictionless cart drawer & Stripe checkout',
          milestone: 'Milestone 3: Checkout Configuration',
          acceptanceCriteria: 'End-to-end payment processing with automated receipts',
          outcome: 'Transition 80% of orders to automated self-service',
          status: 'verified',
        },
        {
          id: 'map-c2',
          requirement: 'Handle high-volume batch collection drops',
          deliverable: 'Drop countdown & real-time inventory validation',
          milestone: 'Milestone 2: Frontend & Cart Architecture',
          acceptanceCriteria: 'Zero inventory overselling during concurrent visitor checkouts',
          outcome: 'Eliminate double-booking during flash collection drops',
          status: 'defined',
        },
      ],
      modelMetadata: {
        provider: 'ScopeCraft Studio Engine (Demonstration Project)',
        model: 'Architectural Blueprint v2',
        isDemoSynthesis: true,
      },
    },
    sampleChangeRequests: [
      {
        title: 'Custom Subscription Ceramic Club',
        message: 'Can we build an automated monthly ceramic subscription box system with recurring recurring billing and customer portal before launch?',
        expectedVerdict: 'out_of_scope',
      },
      {
        title: 'Add Gift Message Field to Cart Drawer',
        message: 'Can we ensure there is a clear checkbox in the cart drawer saying "This is a gift" with a 150-character handwritten note message field?',
        expectedVerdict: 'within_scope',
      },
      {
        title: 'Multi-Location Inventory POS Sync',
        message: 'Could you sync inventory in real time with our weekend market Square POS iPad card reader so physical sales deduct from online inventory?',
        expectedVerdict: 'boundary',
      },
    ],
  },
];
