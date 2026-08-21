// One-shot seed / re-seed for Cereus Technologies.
//   DATABASE_URL="postgres://…" node scripts/seed.mjs
//
// Behaviour: creates tables if missing, then UPSERTs the products and
// insights below (unique-by-slug), inserts default site content, and
// only inserts testimonials / careers when those tables are empty.
// Safe to run repeatedly.
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required (add it to .env or export it).');
  process.exit(1);
}
const sql = neon(url);

// ─── Site content defaults ──────────────────────────────────────────────
const DEFAULT_SITE_CONTENT = {
  brand: { name: 'Cereus Technologies', tagline: 'Building reliable technology for a better tomorrow' },
  hero: {
    eyebrow: 'Health · Education · Environment',
    title_line_1: 'Reliable technology,',
    title_line_2: 'measurable impact.',
    subtitle: 'We design and build practical software for health, education and environmental teams shaping the next decade of African innovation.',
    cta_primary: { label: 'Explore our products', href: '/products' },
    cta_secondary: { label: 'Get in touch', href: '/contact' },
    background_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
  },
  stats: [
    { value: '50+', label: 'Projects delivered' },
    { value: '98%', label: 'Client satisfaction' },
    { value: '9+', label: 'Years in the industry' },
    { value: '24/7', label: 'Support available' },
  ],
  contact: {
    phone: '+234 701 462 3270',
    email: 'info@cereustechnologies.com',
    address: 'Lagos, Nigeria',
    hours: 'Mon–Fri 9am–5pm, Sat 10am–2pm (WAT)',
  },
  social: { linkedin: 'https://www.linkedin.com/company/cereus-technologies', twitter: '', github: '' },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Services', href: '/services' },
    { label: 'Academy', href: '/academy' },
    { label: 'Insights', href: '/insights' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: {
    tagline: 'Building reliable technology solutions for health, education and the environment.',
    columns: [
      { heading: 'Products', links: [
        { label: 'Health tech', href: '/products?category=Health' },
        { label: 'Education tech', href: '/products?category=Education' },
        { label: 'Environment tech', href: '/products?category=Environment' },
        { label: 'View all', href: '/products' },
      ] },
      { heading: 'Company', links: [
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Academy', href: '/academy' },
        { label: 'Careers', href: '/careers' },
      ] },
    ],
    copyright: '© {year} Cereus Technologies. All rights reserved.',
  },
};

// ─── Products (from the Cereus portfolio) ───────────────────────────────
// `demo_url` is left null wherever the deployed URL wasn't handed to me —
// update via the admin UI at /admin/products once each app has a public URL.
const PRODUCTS = [
  {
    slug: 'cereus-lens', name: 'Cereus Lens', category: 'Education', status: 'Active',
    short_description: 'Point a phone at any artwork — get an AI interpretation, a 3D "bring-to-life", and the mathematical structure hiding in the image.',
    primary_benefit: 'A camera-first museum companion — no shutter button, just tap Interpret, Bring to Life or Explore the Math.',
    detailed_description:
      'Cereus Lens is a mobile-first PWA built on Next.js 15 (App Router), TypeScript, Tailwind v4, Clerk and Serwist. The camera view is the home screen — every action silently grabs the current frame as part of firing that action.\nCommunity voting on the mathematical read of every image builds a living corpus of art-and-math correspondences.',
    tags: ['AI', 'PWA', 'Camera', 'Art'],
    features: ['AI art interpretation', '3D bring-to-life scene', 'Mathematical structure explainer', 'Community voting on the maths read', 'Fully offline-capable PWA'],
    use_cases: ['Museum and gallery apps', 'Art-history classrooms', 'Curriculum-linked field trips'],
    tech_stack: ['Next.js 15', 'TypeScript', 'Tailwind v4', 'Clerk', 'Serwist'],
    demo_url: null, sort_order: 1,
  },
  {
    slug: 'tb-detect', name: 'TB Detect', category: 'Health', status: 'Active',
    short_description: 'Chest X-ray screening for pulmonary tuberculosis using a DenseNet121 baseline and a hybrid CNN + ViT novelty model.',
    primary_benefit: 'Screens a chest X-ray for TB in seconds — decision-support for clinicians in resource-constrained settings.',
    detailed_description:
      'A two-service monorepo: a FastAPI backend that wraps trained PyTorch models, and a Next.js frontend for the clinical UI. Both baseline and novelty models are exposed side-by-side so clinicians can compare and calibrate.',
    tags: ['Health', 'Deep Learning', 'PyTorch', 'CNN', 'ViT'],
    features: ['DenseNet121 baseline model', 'Hybrid CNN + Vision Transformer', 'Side-by-side model comparison', 'FastAPI inference backend', 'Clinical UI on Next.js'],
    use_cases: ['Primary-care TB screening', 'Radiology triage in low-resource settings', 'Public-health cohort screening'],
    tech_stack: ['PyTorch', 'FastAPI', 'Next.js', 'Railway'],
    demo_url: null, sort_order: 2,
  },
  {
    slug: 'jmhs', name: 'Jude Mental Health Society', category: 'Health', status: 'Active',
    short_description: 'Website and admin platform for JMHS — an independent Nigerian mental-health advocacy initiative.',
    primary_benefit: 'One home for emergency support, resources, monthly lectures, professional directory, community forum and the JMHS national writing competition.',
    detailed_description:
      'Public site covers homepage, About, Emergency Support, Resource Centre, Monthly Lecture Series, JMHS National Writing Competition, Professional Support Directory, Community Forum, Announcements, Contact and WhatsApp community. A Clerk-gated role-based admin dashboard manages announcements, lectures, resources, directory approvals and competition submissions.',
    tags: ['Mental Health', 'Non-profit', 'Community'],
    features: ['Emergency support directory', 'Monthly lecture series manager', 'Writing competition workflow', 'Professional-support approvals', 'Community forum'],
    use_cases: ['Mental-health non-profits', 'Community advocacy groups', 'University student wellness programs'],
    tech_stack: ['Next.js', 'Clerk', 'Neon Postgres', 'Tailwind'],
    demo_url: null, sort_order: 3,
  },
  {
    slug: 'linguadepth', name: 'LinguaDepth', category: 'Education', status: 'Active',
    short_description: 'An adaptive English-learning platform for Nigerian university students — Duolingo-style lessons plus an ML proficiency classifier and an LLM tutor.',
    primary_benefit: 'Curriculum adapts weekly to each learner\'s measured proficiency instead of a one-size-fits-all track.',
    detailed_description:
      'A Duolingo-inspired lesson engine backed by an ML proficiency classifier that steers each learner\'s curriculum, and an LLM tutor that grades written answers, validates spoken answers and powers a conversational practice chatbox. Built for real Nigerian university cohorts.',
    tags: ['Education', 'AI Tutor', 'Adaptive Learning', 'NLP'],
    features: ['Adaptive lesson graph', 'ML proficiency classifier', 'LLM writing grader', 'Speech-answer validation', 'Conversational practice chat'],
    use_cases: ['University language departments', 'Corporate English programs', 'Continuing-education platforms'],
    tech_stack: ['Next.js', 'FastAPI', 'PyTorch', 'OpenAI', 'Postgres'],
    demo_url: null, sort_order: 4,
  },
  {
    slug: 'coursefit', name: 'CourseFit', category: 'Education', status: 'Active',
    short_description: 'A machine-learning course recommender for Nigerian UTME candidates across all nine JAMB faculties.',
    primary_benefit: 'Turns raw JAMB profile data into a ranked, explainable shortlist of realistic university courses.',
    detailed_description:
      'CourseFit combines a trained recommendation model with a lightweight web experience for UTME candidates and their counsellors. The `apps/web` and `apps/api` services consume a pre-trained model artefact rather than regenerating it, so predictions are stable across releases.',
    tags: ['Education', 'ML', 'Recommender', 'JAMB'],
    features: ['Cross-faculty recommender', 'Explainable rankings', 'Counsellor dashboard', 'Batch imports for schools'],
    use_cases: ['UTME candidates', 'Secondary-school counsellors', 'Admissions consultancies'],
    tech_stack: ['Python ML', 'FastAPI', 'Next.js'],
    demo_url: null, sort_order: 5,
  },
  {
    slug: 'rezultal', name: 'Rezultal', category: 'Education', status: 'Active',
    short_description: 'Intelligent academic-results processing and analytics portal — GPA/CGPA computation, role-based dashboards and LLM-generated plain-language insights.',
    primary_benefit: 'Automates GPA/CGPA computation and hands lecturers and administrators plain-language insights on top of every aggregate.',
    detailed_description:
      'A results portal originally built for Oduduwa University. Handles spreadsheet and manual score entry, computes GPA/CGPA, exposes role-based dashboards, and layers LLM-generated commentary over pre-computed aggregates — the LLM never sees raw scores or performs arithmetic, keeping every displayed number deterministic.',
    tags: ['Education', 'Analytics', 'LLM', 'Universities'],
    features: ['Spreadsheet + manual score entry', 'GPA / CGPA engine', 'Role-based dashboards', 'LLM narrative over aggregates', 'Audit trail'],
    use_cases: ['Universities and polytechnics', 'Faculty exam offices', 'Programme accreditation reviews'],
    tech_stack: ['Next.js', 'Drizzle', 'Neon Postgres', 'Tailwind'],
    demo_url: null, sort_order: 6,
  },
  {
    slug: 'floodwarn', name: 'FloodWarn', category: 'Environment', status: 'Active',
    short_description: 'A flood-risk classification and decision-support app for Ibadan metropolis — search any area and get an immediate visual susceptibility rating.',
    primary_benefit: 'A thesis-grade methodology delivered as a production-grade product — planners see risk, not spreadsheets.',
    detailed_description:
      'Search or geolocate any area in the Ibadan metropolis and get an immediate, visual and explained flood-susceptibility rating. Every rating is backed by a documented methodology, so the same analysis holds up in a planning meeting and a peer-reviewed paper.',
    tags: ['Environment', 'GIS', 'ML', 'Climate'],
    features: ['Search-by-area risk lookup', 'Geolocated live rating', 'Explained susceptibility factors', 'Map-first UI', 'Exportable methodology reports'],
    use_cases: ['Municipal urban-planning offices', 'Environmental NGOs', 'Disaster-response coordinators'],
    tech_stack: ['Next.js', 'MapLibre', 'PostGIS', 'Python ML'],
    demo_url: null, sort_order: 7,
  },
  {
    slug: 'plantid', name: 'PlantiD', category: 'Environment', status: 'Active',
    short_description: 'Field plant identification with vision AI and a conversational plant-care assistant.',
    primary_benefit: 'From a photo to a name, a care plan, and a chat you can keep going — all with your own auth and database.',
    detailed_description:
      'A modern replatform of PlantiD onto a stack you control: Next.js (App Router), Clerk for auth, Neon Postgres + Drizzle for data, and the Anthropic API for vision and chat. Users snap a leaf, get a species identification, and continue a conversation about care.',
    tags: ['Environment', 'Agriculture', 'Vision AI', 'Assistant'],
    features: ['Photo-to-species identification', 'Care-plan suggestions', 'Conversational plant assistant', 'Personal plant log', 'History across devices'],
    use_cases: ['Home gardeners and hobbyists', 'Agricultural extension officers', 'Botanical citizen-science projects'],
    tech_stack: ['Next.js', 'Clerk', 'Neon + Drizzle', 'Anthropic API'],
    demo_url: null, sort_order: 8,
  },
  {
    slug: 'coco-corrosion', name: 'CoCo — Corrosion Console', category: 'Environment', status: 'Active',
    short_description: 'Explainable ML console for CO₂ (sweet) internal pipeline corrosion — seven sliders, live risk, and per-feature explanations.',
    primary_benefit: 'Engineers see not just a predicted corrosion rate, but which inputs are pushing the number up or down.',
    detailed_description:
      'Seven sliders for the model\'s real input features, each flagged the moment it drifts out of a healthy range. Predictions and SHAP-style explanations render live in the console so an integrity engineer can reason about a pipeline segment in seconds.',
    tags: ['Environment', 'Industrial', 'Explainable AI'],
    features: ['Live corrosion-rate prediction', 'Per-feature explanations', 'Range validation on every input', 'Scenario save + share', 'Vercel-ready deploy'],
    use_cases: ['Oil-and-gas integrity teams', 'Corrosion-monitoring consultancies', 'University research groups'],
    tech_stack: ['Next.js 14', 'Python ML', 'Vercel'],
    demo_url: null, sort_order: 9,
  },
];

// ─── Insights (drawn from real project work) ────────────────────────────
const INSIGHTS = [
  {
    slug: 'building-cereus-lens-camera-first-pwa',
    title: 'Camera-first, no shutter button: how we designed Cereus Lens',
    category: 'Product', excerpt: 'Removing the shutter changed how people used the app — and what we had to build behind it.',
    author: 'Afeez Olagunju', reading_time: 5,
    content: '# The camera view IS the home screen\n\nMost mobile apps hide the camera behind a screen, then behind a button. Cereus Lens flips that: you open the app and you are already looking through the lens.\n\n## Why we removed the shutter\n\nUsers were opening the app, framing the artwork, then hesitating — trying to figure out **when** to shoot. Once the shutter was gone and each of *Interpret*, *Bring to Life* and *Explore the Math* silently grabbed the current frame as part of firing that action, hesitation vanished.\n\n## What we had to build for that\n\n- A rock-solid preview pipeline that never drops frames while an action fires\n- An offline queue for actions the network isn\'t ready to serve\n- A first-run flow that teaches the three actions without a single modal\n\n## What we shipped\n\nA mobile-first PWA on Next.js 15, Clerk for auth, and Serwist for the service-worker layer. The interpretation, 3D bring-to-life, and math explainer are three thin calls behind one shared camera surface.',
    tags: ['product', 'ai', 'pwa'], published: true,
  },
  {
    slug: 'shipping-tb-detect',
    title: 'Shipping TB Detect: comparing a DenseNet baseline with a hybrid CNN+ViT',
    category: 'Engineering', excerpt: 'Two models, one clinical UI, and the honest engineering trade-offs of releasing both.',
    author: 'Enoch Abe', reading_time: 6,
    content: '# Two models, one screen\n\nTB Detect wraps two chest-X-ray models — a DenseNet121 baseline and a hybrid CNN+ViT — behind a single FastAPI service, and shows them side-by-side in a Next.js clinical UI.\n\n## Why both\n\nClinicians care about two things: agreement and disagreement. When the two models agree, confidence is easy to communicate. When they disagree, the case gets flagged for radiologist review.\n\n## Deployment shape\n\n- FastAPI + PyTorch on Railway\n- Next.js frontend on the same platform\n- Deterministic image preprocessing pinned in both directions\n\n## What we learned\n\nCalibration matters more than raw accuracy for triage. We spent the last two weeks purely on threshold tuning — and it changed the tool from *"clever"* to *"trusted"*.',
    tags: ['health', 'ml', 'engineering'], published: true,
  },
  {
    slug: 'linguadepth-ml-plus-llm',
    title: 'LinguaDepth: the case for an ML proficiency layer under your LLM tutor',
    category: 'AI', excerpt: 'Why we don\'t let the LLM guess how good a learner is — a small classifier does it, deterministically.',
    author: 'Afeez Olagunju', reading_time: 6,
    content: '# LLMs are great tutors, bad routers\n\nAsk a large language model to estimate a learner\'s proficiency and it will confidently guess. In LinguaDepth we separated the two jobs: a small ML classifier ranks the learner into a proficiency band, and the LLM only handles instruction and grading **within** that band.\n\n## Why separate\n\n- **Determinism.** Two learners with the same input get the same track.\n- **Cost.** A 40ms classifier call is cheaper than an LLM round-trip.\n- **Explainability.** The band the learner sits in is a visible artefact — not something buried in a prompt.\n\n## What the LLM still does\n\nGrading written answers, validating spoken answers, and driving a conversational practice chatbox. Those are exactly the jobs LLMs are good at.\n\n## Takeaway\n\nCombine narrow models for control-flow decisions with LLMs for open-ended interactions. You get a system you can debug **and** an experience learners enjoy.',
    tags: ['ai', 'education', 'ml'], published: true,
  },
  {
    slug: 'coco-explainable-corrosion',
    title: 'Explainable ML for CO₂ pipeline corrosion',
    category: 'Engineering', excerpt: 'Predictions are cheap. Explanations are what make an integrity engineer trust the tool.',
    author: 'Akanfe Abidemi', reading_time: 5,
    content: '# Seven sliders and one number\n\nCoCo (Corrosion Console) predicts CO₂ (sweet) internal pipeline corrosion from seven engineering inputs. The number is easy — the science of *"how did we get here?"* is what we spent our time on.\n\n## Per-feature explanations\n\nEvery slider is flagged the moment it drifts out of a healthy range. Predictions render live and each feature\'s contribution is broken out so an engineer can reason about a pipeline segment in seconds, not hours.\n\n## Where the value lands\n\nNot in the raw prediction, but in the confidence it gives operations to intervene early. That is the difference between predictive maintenance as a slogan and predictive maintenance as a workflow.',
    tags: ['environment', 'ml', 'industrial'], published: true,
  },
  {
    slug: 'floodwarn-thesis-to-product',
    title: 'From thesis to product: FloodWarn for Ibadan',
    category: 'Case study', excerpt: 'What changes when a research methodology has to survive a planning meeting.',
    author: 'Afeez Olagunju', reading_time: 4,
    content: '# Same maths. Very different UX.\n\nFloodWarn started as a thesis: a flood-risk susceptibility model for the Ibadan metropolis. Turning it into something a municipal planner would actually open every morning meant re-thinking almost every surface.\n\n## Three shifts that mattered\n\n1. **Search first, map second.** Planners type an area name; the map animates to it.\n2. **Explain the rating, not the algorithm.** *"High risk because of X, Y, Z"* — not *"weighted sum with logistic head"*.\n3. **Export what you see.** Every rating exports as a one-page methodology PDF you can staple to a council brief.\n\n## Result\n\nSame model. Very different willingness to use it.',
    tags: ['environment', 'case-study', 'product'], published: true,
  },
  {
    slug: 'why-we-picked-neon-and-clerk',
    title: 'Why our stack keeps landing on Neon + Clerk + Vercel',
    category: 'Engineering', excerpt: 'A pragmatic walk-through of the choices we keep re-making across the Cereus product lineup.',
    author: 'Enoch Abe', reading_time: 4,
    content: '# Same stack, different products\n\nCereus Lens, LinguaDepth, PlantiD, Rezultal, JMHS, this very site — all of them run the same stack. Not because we are lazy: because each choice keeps earning its keep.\n\n## Neon Postgres\n\n- HTTP driver that survives serverless cold starts\n- Branching per PR — production data shape, safe writes\n- SQL, not a bespoke DSL\n\n## Clerk\n\n- Sign-in, sessions and org roles out of the box\n- Server-side token verification that plays nicely with Vercel Functions\n- Escape hatches when we need a custom flow\n\n## Vercel\n\n- Static + serverless in one deploy\n- Env-var UX we actually like\n- Preview URLs on every push\n\n## What we would swap for scale\n\nHonestly? Not much yet. When someone hits their first genuinely-hot table we\'ll reach for a read replica or a queue — until then this trio is the sweet spot.',
    tags: ['engineering', 'stack'], published: true,
  },
];

// ─── Team-only starter records ──────────────────────────────────────────
const TESTIMONIALS = [
  { author_name: 'Dr. Chinonso Okafor', role: 'Medical Director', company: 'Bethel Family Clinic', location: 'Lagos, Nigeria', quote: 'Cereus turned around our clinic operations in six weeks. Patient wait times are down by half and our records are finally in one place.', featured: true, approved: true },
  { author_name: 'Prof. Zainab Adegoke', role: 'Vice-Chancellor', company: 'Redwood University', location: 'Ibadan, Nigeria', quote: 'Their team handled our 12,000-student cohort without breaking a sweat. It felt like an extension of ours.', featured: true, approved: true },
  { author_name: 'Kwame Asante', role: 'Environmental Analyst', company: 'Accra Metro', location: 'Accra, Ghana', quote: 'We asked for a monitoring dashboard, we got a decision-support tool. The team gets it.', featured: true, approved: true },
];

const CAREERS = [
  {
    title: 'Senior Full-Stack Engineer', department: 'Engineering', location: 'Lagos / Remote', type: 'Full-time',
    summary: 'Own end-to-end product delivery across health and education products in our current lineup.',
    responsibilities: ['Ship features from spec to production', 'Mentor mid-level engineers', 'Own performance and reliability of your products', 'Participate in product reviews and roadmap planning'],
    requirements: ['5+ years shipping web applications', 'Deep React and Node.js', 'Postgres and SQL fluency', 'Bias for shipping'],
    active: true,
  },
  {
    title: 'Product Designer', department: 'Design', location: 'Remote (Africa)', type: 'Full-time',
    summary: 'Design intuitive interfaces for our health and education products, from concept through hand-off.',
    responsibilities: ['Own product design across two flagship products', 'Run user research and usability tests', 'Contribute to the design system'],
    requirements: ['4+ years in product design', 'Portfolio showing shipped work', 'Comfortable with Figma and prototyping'],
    active: true,
  },
];

// ─── Bootstrap + seed ───────────────────────────────────────────────────
async function ensureSchema() {
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
  await sql`CREATE TABLE IF NOT EXISTS products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, category TEXT, status TEXT DEFAULT 'Active', short_description TEXT, detailed_description TEXT, primary_benefit TEXT, demo_url TEXT, image_url TEXT, tags JSONB DEFAULT '[]'::jsonb, features JSONB DEFAULT '[]'::jsonb, use_cases JSONB DEFAULT '[]'::jsonb, tech_stack JSONB DEFAULT '[]'::jsonb, screenshot_urls JSONB DEFAULT '[]'::jsonb, sort_order INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS insights (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, category TEXT, excerpt TEXT, content TEXT, featured_image TEXT, author TEXT, reading_time INT, tags JSONB DEFAULT '[]'::jsonb, published BOOLEAN DEFAULT true, published_date TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS testimonials (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), author_name TEXT NOT NULL, quote TEXT NOT NULL, author_photo TEXT, location TEXT, role TEXT, company TEXT, featured BOOLEAN DEFAULT false, approved BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS careers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, department TEXT, location TEXT, type TEXT, summary TEXT, responsibilities JSONB DEFAULT '[]'::jsonb, requirements JSONB DEFAULT '[]'::jsonb, active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS site_content (id INT PRIMARY KEY DEFAULT 1, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW(), CONSTRAINT single_row CHECK (id = 1))`;
  await sql`CREATE TABLE IF NOT EXISTS submissions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), kind TEXT NOT NULL, payload JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE INDEX IF NOT EXISTS submissions_kind_idx ON submissions(kind, created_at DESC)`;
}

async function seed() {
  await ensureSchema();
  console.log('✓ schema ensured');

  // Wipe the earlier demo rows so repeat-seed doesn't leave stale content.
  const demoSlugs = ['clinicsync', 'lumen-lms', 'terra-monitor'];
  const demoInsights = ['shipping-software-in-lagos', 'why-we-chose-neon'];
  await sql`DELETE FROM products WHERE slug = ANY(${demoSlugs})`;
  await sql`DELETE FROM insights WHERE slug = ANY(${demoInsights})`;

  // Site content — always upsert
  await sql`INSERT INTO site_content (id, data) VALUES (1, ${JSON.stringify(DEFAULT_SITE_CONTENT)}::jsonb)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`;
  console.log('✓ site content upserted');

  // Products — upsert by slug (so re-runs pick up copy edits)
  for (const p of PRODUCTS) {
    await sql`INSERT INTO products (
        slug, name, category, status, short_description, detailed_description,
        primary_benefit, demo_url, image_url, tags, features, use_cases,
        tech_stack, screenshot_urls, sort_order, updated_at
      ) VALUES (
        ${p.slug}, ${p.name}, ${p.category}, ${p.status},
        ${p.short_description}, ${p.detailed_description || null},
        ${p.primary_benefit}, ${p.demo_url}, ${p.image_url || null},
        ${JSON.stringify(p.tags || [])}::jsonb,
        ${JSON.stringify(p.features || [])}::jsonb,
        ${JSON.stringify(p.use_cases || [])}::jsonb,
        ${JSON.stringify(p.tech_stack || [])}::jsonb,
        ${JSON.stringify(p.screenshot_urls || [])}::jsonb,
        ${p.sort_order || 0}, NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        short_description = EXCLUDED.short_description,
        detailed_description = EXCLUDED.detailed_description,
        primary_benefit = EXCLUDED.primary_benefit,
        demo_url = EXCLUDED.demo_url,
        image_url = EXCLUDED.image_url,
        tags = EXCLUDED.tags,
        features = EXCLUDED.features,
        use_cases = EXCLUDED.use_cases,
        tech_stack = EXCLUDED.tech_stack,
        screenshot_urls = EXCLUDED.screenshot_urls,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()`;
  }
  console.log(`✓ ${PRODUCTS.length} products upserted`);

  // Insights — upsert by slug
  for (const i of INSIGHTS) {
    await sql`INSERT INTO insights (
        slug, title, category, excerpt, content, featured_image, author,
        reading_time, tags, published, published_date, updated_at
      ) VALUES (
        ${i.slug}, ${i.title}, ${i.category}, ${i.excerpt}, ${i.content},
        ${i.featured_image || null}, ${i.author}, ${i.reading_time},
        ${JSON.stringify(i.tags || [])}::jsonb, ${i.published !== false},
        COALESCE(${i.published_date || null}, NOW()), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        featured_image = EXCLUDED.featured_image,
        author = EXCLUDED.author,
        reading_time = EXCLUDED.reading_time,
        tags = EXCLUDED.tags,
        published = EXCLUDED.published,
        updated_at = NOW()`;
  }
  console.log(`✓ ${INSIGHTS.length} insights upserted`);

  // Testimonials + careers — only insert if the table is empty.
  const [{ n: tCount }] = await sql`SELECT COUNT(*)::int AS n FROM testimonials`;
  if (tCount === 0) {
    for (const t of TESTIMONIALS) {
      await sql`INSERT INTO testimonials (author_name, quote, role, company, location, featured, approved)
                VALUES (${t.author_name}, ${t.quote}, ${t.role}, ${t.company}, ${t.location}, ${t.featured}, ${t.approved})`;
    }
    console.log(`✓ ${TESTIMONIALS.length} testimonials seeded`);
  } else {
    console.log('· testimonials already exist, skipped');
  }

  const [{ n: cCount }] = await sql`SELECT COUNT(*)::int AS n FROM careers`;
  if (cCount === 0) {
    for (const c of CAREERS) {
      await sql`INSERT INTO careers (title, department, location, type, summary, responsibilities, requirements, active)
                VALUES (${c.title}, ${c.department}, ${c.location}, ${c.type}, ${c.summary},
                        ${JSON.stringify(c.responsibilities)}::jsonb, ${JSON.stringify(c.requirements)}::jsonb, ${c.active})`;
    }
    console.log(`✓ ${CAREERS.length} careers seeded`);
  } else {
    console.log('· careers already exist, skipped');
  }

  console.log('\n🌿  Seed complete.');
}

seed().catch((e) => { console.error(e); process.exit(1); });
