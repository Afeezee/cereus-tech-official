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

// ─── Products (Cereus portfolio, live URLs) ─────────────────────────────
// Every entry below has a real deployed URL. Edit copy or add screenshots
// via /admin/products — the seed re-runs are UPSERTs so edits survive.
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
    demo_url: 'https://lens.cereustechnologies.com', sort_order: 1,
  },
  {
    slug: 'skinaid', name: 'SkinAid', category: 'Health', status: 'Active',
    short_description: 'AI-assisted skin screening for everyday peace of mind — snap a photo, get a plain-English preliminary assessment.',
    primary_benefit: 'A private, always-available first look at any skin concern — never a substitute for a dermatologist, always a nudge to see one when it matters.',
    detailed_description:
      'SkinAid lets anyone take or upload a photo of a skin concern, get a plain-English preliminary assessment powered by Anthropic\'s Claude vision model, and keep a private history of past checks. Symptom notes ("itchy for three days", "spreading") are woven into every read so the assessment reflects the whole picture.',
    tags: ['Health', 'Vision AI', 'Dermatology'],
    features: ['Claude-powered image assessment', 'Symptom-note context', 'Private per-user history', 'Clear "see a doctor" prompts', 'Mobile-first web app'],
    use_cases: ['Everyday skin peace-of-mind', 'Rural triage before travelling to a clinic', 'Longitudinal tracking of a healing area'],
    tech_stack: ['Next.js', 'Clerk', 'Neon Postgres', 'Anthropic API'],
    demo_url: 'https://skinaid.cereustechnologies.com', sort_order: 2,
  },
  {
    slug: 'radioact', name: 'RadioAct', category: 'Health', status: 'Active',
    short_description: 'A patient-first radiology triage app — AI-assisted reads on chest, limb X-rays and CT slices, confirmed by a clinician.',
    primary_benefit: 'Patient uploads a scan, gets an AI-assisted read privately, sends it to a clinician for expert review — nothing becomes a confirmed outcome until a clinician reviews it.',
    detailed_description:
      'RadioAct is a workflow product, not just an image analyser. Built on the Ontomorph digital-twin platform, it runs an AI-assisted analysis (Anthropic first, Groq second, deterministic demo analyser as fallback) then hands the case to a clinician queue. The clinician sees a live handoff list, opens an inspector for context, and confirms reviewed findings back to the patient\'s history.',
    tags: ['Health', 'Radiology', 'Triage', 'Vision AI'],
    features: ['Multi-modality upload (X-ray, CT)', 'Symptom & context capture', 'Multi-provider AI pipeline with graceful fallback', 'Live clinician review queue', 'Confirmed-outcome audit trail'],
    use_cases: ['Rural clinics awaiting a radiologist', 'Second-opinion services', 'Telemedicine platforms'],
    tech_stack: ['Next.js', 'Anthropic', 'Groq', 'Ontomorph'],
    demo_url: 'https://radioact.app', sort_order: 3,
  },
  {
    slug: 'jmhs', name: 'Jude Mental Health Society', category: 'Health', status: 'Active',
    short_description: 'Website and admin platform for JMHS — an independent Nigerian mental-health advocacy initiative.',
    primary_benefit: 'One home for emergency support, resources, monthly lectures, professional directory, community forum and the JMHS national writing competition.',
    detailed_description:
      'Public site covers homepage, About, Emergency Support, Resource Centre, Monthly Lecture Series, JMHS National Writing Competition, Professional Support Directory, Community Forum, Announcements, Contact and a WhatsApp community. A Clerk-gated role-based admin dashboard manages announcements, lectures, resources, directory approvals and competition submissions.',
    tags: ['Mental Health', 'Non-profit', 'Community'],
    features: ['Emergency support directory', 'Monthly lecture series manager', 'Writing competition workflow', 'Professional-support approvals', 'Community forum'],
    use_cases: ['Mental-health non-profits', 'Community advocacy groups', 'University student wellness programs'],
    tech_stack: ['Next.js', 'Clerk', 'Neon Postgres', 'Tailwind'],
    demo_url: 'https://judementalhealthsociety.org', sort_order: 4,
  },
  {
    slug: 'mindbloom', name: 'MindBloom', category: 'Education', status: 'Active',
    short_description: 'AI-powered children\'s story-writing web app — generate child-safe stories, save them, revisit them in a polished library.',
    primary_benefit: 'Parents, teachers and young readers get a limitless bedtime-story engine with a library they own.',
    detailed_description:
      'MindBloom is a fully owned Next.js 14 application that generates child-safe stories via Groq and Llama 3.3 70B, saves them to Supabase, and surfaces them through a polished story library. Every story is scoped to its author, ready for reading-aloud sessions or classroom prompts.',
    tags: ['Education', 'AI Stories', 'Kids', 'Reading'],
    features: ['AI story generator with age filters', 'Personal story library', 'Read-aloud friendly layout', 'Simple sign-in for families and classes', 'Save + revisit workflow'],
    use_cases: ['Bedtime stories at home', 'Primary-school reading corners', 'Literacy after-school programs'],
    tech_stack: ['Next.js 14', 'Groq', 'Llama 3.3', 'Supabase'],
    demo_url: 'https://mindbloom.cereustechnologies.com', sort_order: 5,
  },
  {
    slug: 'sculptform', name: 'Sculptform', category: 'Education', status: 'Active',
    short_description: 'AI-native form and survey builder — describe the form you want, get a ready-to-share one back.',
    primary_benefit: 'Skip the drag-and-drop grind — describe your form in plain English and start collecting responses in minutes.',
    detailed_description:
      'Sculptform is an AI-native form and survey builder. Instead of dragging form fields onto a canvas, describe your form in natural language: "a five-question wellbeing check-in for university students, with a required consent step". Sculptform assembles the fields, wires the logic, and gives you a shareable link.',
    tags: ['Productivity', 'AI', 'Forms', 'Surveys'],
    features: ['Natural-language form generation', 'Shareable public links', 'Response collection dashboard', 'Conditional logic'],
    use_cases: ['University research consent forms', 'Community-programme surveys', 'Internal team check-ins'],
    tech_stack: ['Next.js', 'Tailwind', 'OpenAI'],
    demo_url: 'https://sculptform.live', sort_order: 6,
  },
  {
    slug: 'glotta', name: 'Glotta', category: 'Education', status: 'Active',
    short_description: 'Instant text and voice translation for every purchase — 50+ languages including 30+ African languages.',
    primary_benefit: 'Retailers and shoppers cross language barriers in real time — type, speak, or listen your way through any exchange.',
    detailed_description:
      'Glotta is a modern web app that lets retailers and shoppers cross language barriers in real time. Type a phrase or speak it, choose a target language, and Glotta translates, saves the exchange to a personal history, and can even read the result out loud. Ships with a light/dark UI, secure authentication and a persistent per-user history backed by PostgreSQL.',
    tags: ['Education', 'Translation', 'Voice', 'African Languages'],
    features: ['50+ languages including 30+ African languages', 'Voice-in translation via AssemblyAI', 'Text-to-speech playback via ElevenLabs', 'Persistent per-user history', 'Email/password + JWT auth'],
    use_cases: ['Retailers serving multi-lingual customers', 'Field workers in multi-lingual communities', 'Language-learning practice'],
    tech_stack: ['Next.js', 'PostgreSQL', 'AssemblyAI', 'ElevenLabs'],
    demo_url: 'https://glotta.cereustechnologies.com', sort_order: 7,
  },
  {
    slug: 'okawe', name: 'Okawe', category: 'Education', status: 'Active',
    short_description: 'A modern e-library platform for African readers — discover, save and read titles across devices.',
    primary_benefit: 'A single place to browse, borrow and read — with a shelf that follows you across devices.',
    detailed_description:
      'Okawe (Yoruba for "reader") is an e-library web app built on Next.js. Readers browse a curated catalogue, save titles to a personal shelf, and pick up where they left off across devices.',
    tags: ['Education', 'Library', 'Reading'],
    features: ['Curated catalogue', 'Personal shelf', 'Cross-device reading progress', 'Mobile-first reading UI'],
    use_cases: ['Public and community libraries', 'University reading lists', 'Book clubs and reading circles'],
    tech_stack: ['Next.js', 'PostgreSQL'],
    demo_url: 'https://okawe.vercel.app', sort_order: 8,
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
    demo_url: 'https://plantid.cereustechnologies.com', sort_order: 9,
  },
];

// ─── Insights (drawn from real project work on live apps) ───────────────
const INSIGHTS = [
  {
    slug: 'building-cereus-lens-camera-first-pwa',
    title: 'Camera-first, no shutter button: how we designed Cereus Lens',
    category: 'Product', excerpt: 'Removing the shutter changed how people used the app — and what we had to build behind it.',
    author: 'Afeez Olagunju', reading_time: 5,
    featured_image: 'https://images.unsplash.com/photo-1520453803296-c39eabe2dab4?w=1200&q=80',
    content: '# The camera view IS the home screen\n\nMost mobile apps hide the camera behind a screen, then behind a button. [Cereus Lens](https://lens.cereustechnologies.com) flips that: you open the app and you are already looking through the lens.\n\n## Why we removed the shutter\n\nUsers were opening the app, framing the artwork, then hesitating — trying to figure out **when** to shoot. Once the shutter was gone and each of *Interpret*, *Bring to Life* and *Explore the Math* silently grabbed the current frame as part of firing that action, hesitation vanished.\n\n## What we had to build for that\n\n- A rock-solid preview pipeline that never drops frames while an action fires\n- An offline queue for actions the network isn\'t ready to serve\n- A first-run flow that teaches the three actions without a single modal\n\n## What we shipped\n\nA mobile-first PWA on Next.js 15, Clerk for auth, and Serwist for the service-worker layer. The interpretation, 3D bring-to-life, and math explainer are three thin calls behind one shared camera surface.',
    tags: ['product', 'ai', 'pwa'], published: true,
  },
  {
    slug: 'skinaid-triage-not-diagnosis',
    title: 'Building SkinAid: triage-grade UX, not diagnosis-grade claims',
    category: 'Health', excerpt: 'A skin-screening tool people actually use requires humility, private history, and a firm nudge to see a real dermatologist.',
    author: 'Enoch Abe', reading_time: 5,
    featured_image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80',
    content: '# Three commitments we made before writing a line of code\n\n[SkinAid](https://skinaid.cereustechnologies.com) is a triage app, not a diagnosis app. That distinction shaped every product decision.\n\n## 1. Every reading includes context\n\nA photo alone is a partial story. Symptom notes — "itchy for three days", "spreading" — go straight into the model prompt so the read reflects the whole picture.\n\n## 2. Private history stays private\n\nEvery user\'s photos and past checks live in a per-user table, gated by Clerk. There is no admin backdoor to browse patient photos, and there never will be.\n\n## 3. Refer up, always\n\nEvery non-trivial finding ends with a clear "see a dermatologist" prompt. The value of the tool is *lowering the friction of that next step*, not replacing it.\n\n## Under the hood\n\nNext.js, Clerk, Neon Postgres, Anthropic Claude vision. A small stack that scales to zero, so the marginal cost of running it stays close to nothing.',
    tags: ['health', 'ai', 'privacy'], published: true,
  },
  {
    slug: 'radioact-clinician-loop',
    title: 'RadioAct: the AI is the intern, the clinician is the doctor',
    category: 'Health', excerpt: 'Why our radiology triage app was designed around a clinician queue, not an autonomous read.',
    author: 'Akanfe Abidemi', reading_time: 6,
    featured_image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=80',
    content: '# The workflow is the product\n\n[RadioAct](https://radioact.app) started as an image analyser. It ended as a workflow product — because that is what the clinicians we spoke to actually needed.\n\n## The loop\n\n1. Patient uploads a chest X-ray, limb X-ray, or CT slice.\n2. AI-assisted analysis runs (Anthropic first, Groq second, deterministic demo analyser as fallback so the app never *blank-screens*).\n3. Case appears in the clinician\'s live handoff queue.\n4. Clinician opens the inspector, confirms findings, and the confirmed result writes back to the patient\'s history.\n\nNothing becomes a confirmed outcome until a clinician reviews it — a rule we enforced in the schema, not just in the UI.\n\n## What we learned\n\nA graceful analyser fallback matters more than a shiny model choice. The moment RadioAct kept working during a Groq outage was the moment three clinicians started trusting the tool with their inbox.',
    tags: ['health', 'workflow', 'ai'], published: true,
  },
  {
    slug: 'glotta-african-languages-first',
    title: 'Glotta and the case for African-language-first translation',
    category: 'Product', excerpt: '30+ African languages in the picker, voice-in via AssemblyAI, TTS via ElevenLabs — and why we shipped it in that order.',
    author: 'Afeez Olagunju', reading_time: 5,
    featured_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
    content: '# A translator built for the exchange, not the essay\n\nMost translation apps optimise for the paragraph. [Glotta](https://glotta.cereustechnologies.com) optimises for the *exchange*: a customer, a retailer, and three seconds to make sense of each other.\n\n## African languages, first-class\n\nYoruba, Igbo, Hausa, Swahili, isiZulu — 30+ African languages sit next to the usual world set in the picker. Not buried under a submenu.\n\n## Voice in, voice out\n\n- **In** — record from the microphone, transcribe with AssemblyAI, then translate.\n- **Out** — play the translated result through ElevenLabs, with a browser SpeechSynthesis fallback so playback keeps working when the API is offline.\n\n## Persistence\n\nEvery exchange saves to your account, so you can go back and reuse a phrase that worked yesterday. Small, but the reason retailers we tested with kept opening the app.',
    tags: ['product', 'translation', 'africa'], published: true,
  },
  {
    slug: 'sculptform-forms-by-conversation',
    title: 'Sculptform: forms by description, not drag-and-drop',
    category: 'AI', excerpt: 'What we learned building an AI-native form builder — and why the sharpest wins were in the schema, not the model.',
    author: 'Enoch Abe', reading_time: 4,
    featured_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    content: '# The model is easy, the schema is hard\n\n[Sculptform](https://sculptform.live) turns a sentence — *"a five-question wellbeing check-in for university students, with a required consent step"* — into a shareable form.\n\nThe language model call was a one-day job. The three-week job was designing a form schema that survives:\n\n- **Iteration** — you edit the description, and only the affected fields change, not the whole form.\n- **Sharing** — every form has a stable public URL with a versioned response bucket underneath.\n- **Analysis** — responses land in a shape that answers questions, not just stores strings.\n\n## Why users kept coming back\n\nNot the AI generation. The *"share this"* button. Every product decision after we saw that in the analytics revolved around lowering the friction between "I want a form" and "someone filled it in".',
    tags: ['ai', 'product', 'forms'], published: true,
  },
  {
    slug: 'why-we-picked-neon-and-clerk',
    title: 'Why our stack keeps landing on Neon + Clerk + Vercel',
    category: 'Engineering', excerpt: 'A pragmatic walk-through of the choices we keep re-making across the Cereus product lineup.',
    author: 'Enoch Abe', reading_time: 4,
    featured_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    content: '# Same stack, different products\n\nCereus Lens, SkinAid, PlantiD, JMHS, Mindbloom, Glotta, this very site — all of them run the same stack. Not because we are lazy: because each choice keeps earning its keep.\n\n## Neon Postgres\n\n- HTTP driver that survives serverless cold starts\n- Branching per PR — production data shape, safe writes\n- SQL, not a bespoke DSL\n\n## Clerk\n\n- Sign-in, sessions and org roles out of the box\n- Server-side token verification that plays nicely with Vercel Functions\n- Escape hatches when we need a custom flow\n\n## Vercel\n\n- Static + serverless in one deploy\n- Env-var UX we actually like\n- Preview URLs on every push\n\n## What we would swap for scale\n\nHonestly? Not much yet. When someone hits their first genuinely-hot table we\'ll reach for a read replica or a queue — until then this trio is the sweet spot.',
    tags: ['engineering', 'stack'], published: true,
  },
  {
    slug: 'mindbloom-child-safe-generation',
    title: 'MindBloom: what "child-safe" means in a story-generation app',
    category: 'AI', excerpt: 'A generation pipeline for kids has to say no confidently, not scarily — here is how we tuned MindBloom for that.',
    author: 'Afeez Olagunju', reading_time: 5,
    featured_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80',
    content: '# Safety without the scary rails\n\n[MindBloom](https://mindbloom.cereustechnologies.com) generates children\'s stories with Groq and Llama 3.3 70B. It has to decline unsafe prompts, but a scary "I cannot help with that" screen is the wrong answer for a five-year-old with a parent leaning over their shoulder.\n\n## Three tuning knobs\n\n1. **Prompt scaffolding** — the story request template gently reframes tricky prompts before they reach the model.\n2. **Age filter** — the story\'s age band is a first-class input, and the model gets that band up front.\n3. **Fallback voices** — when the model declines, the app returns a gentle placeholder story with a nudge for a grown-up to help pick a new prompt.\n\n## Storage that respects the family\n\nStories save per-account to Supabase, and the story library UI is deliberately small — parents and teachers should feel in control of what is on the shelf.',
    tags: ['ai', 'kids', 'safety'], published: true,
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

  // Wipe stale product & insight rows from earlier seeds so repeat-runs
  // don't leave orphaned content behind (fictional demo apps, projects
  // that never got a live URL, insights that reference removed apps).
  const staleProductSlugs = [
    // v1 fictional demos
    'clinicsync', 'lumen-lms', 'terra-monitor',
    // v2 real apps without a public URL — kept in the codebase, removed
    // from the site catalogue until a demo URL exists for each.
    'tb-detect', 'linguadepth', 'coursefit', 'rezultal', 'floodwarn', 'coco-corrosion',
  ];
  const staleInsightSlugs = [
    'shipping-software-in-lagos', 'why-we-chose-neon',
    'shipping-tb-detect', 'linguadepth-ml-plus-llm',
    'coco-explainable-corrosion', 'floodwarn-thesis-to-product',
  ];
  await sql`DELETE FROM products WHERE slug = ANY(${staleProductSlugs})`;
  await sql`DELETE FROM insights WHERE slug = ANY(${staleInsightSlugs})`;

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
