// One-shot seed script: creates schema (via API bootstrap) and inserts a few
// starter products, testimonials, insights, careers and default site content.
// Usage: DATABASE_URL="postgres://…" node scripts/seed.mjs
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required (add it to .env or export it).');
  process.exit(1);
}
const sql = neon(url);

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

const PRODUCTS = [
  {
    slug: 'clinicsync', name: 'ClinicSync', category: 'Health', status: 'Active',
    short_description: 'A patient-record and appointment platform designed for African primary-care clinics.',
    primary_benefit: 'Cut average patient wait times by 40%.',
    demo_url: 'https://example.com/clinicsync-demo',
    tags: ['Health', 'EMR', 'Mobile'],
    features: ['Digital patient records', 'SMS reminders', 'Offline-first mobile app', 'Doctor rota planner'],
    use_cases: ['Community clinics scaling to multiple locations', 'Public-health outreach programs'],
    tech_stack: ['React Native', 'PostgreSQL', 'Node.js'],
  },
  {
    slug: 'lumen-lms', name: 'Lumen LMS', category: 'Education', status: 'Active',
    short_description: 'A low-bandwidth learning platform used by 30+ African universities.',
    primary_benefit: '5× less data usage than typical LMS platforms.',
    demo_url: 'https://example.com/lumen-demo',
    tags: ['Education', 'LMS', 'Web'],
    features: ['Adaptive video streaming', 'Offline lesson downloads', 'Auto-grading', 'Analytics dashboard'],
    use_cases: ['Universities running blended-learning programs', 'Corporate training academies'],
    tech_stack: ['React', 'Django', 'Redis', 'S3'],
  },
  {
    slug: 'terra-monitor', name: 'Terra Monitor', category: 'Environment', status: 'In Development',
    short_description: 'IoT-based air-quality and water-quality monitoring for cities and NGOs.',
    primary_benefit: 'Real-time environmental data your team can act on.',
    tags: ['Environment', 'IoT', 'Dashboard'],
    features: ['LoRa sensor network', 'Alerting rules', 'Public dashboards', 'Open data export'],
    use_cases: ['Municipal environmental agencies', 'Environmental NGOs and research teams'],
    tech_stack: ['Rust', 'InfluxDB', 'Grafana', 'React'],
  },
];

const INSIGHTS = [
  {
    slug: 'shipping-software-in-lagos', title: 'What shipping software in Lagos taught us',
    category: 'Engineering', excerpt: 'Five practical lessons from delivering products in low-bandwidth, high-variance environments.',
    author: 'Afeez Olagunju', reading_time: 6,
    content: '# What shipping software in Lagos taught us\n\nWhen you build for the African market, resilience is a feature, not a nice-to-have.\n\n## Lesson 1: Design for offline\n\nEven in metropolitan areas, connectivity is intermittent. Every product we ship treats offline as the default and online as the enhancement.\n\n## Lesson 2: Data is expensive\n\nWe pay per megabyte on behalf of every user. Small bundles, aggressive caching and lazy-loading move the needle.\n\n> The best software is the software that respects your users\' constraints.\n\n## Lesson 3: Localize\n\nIt goes beyond translation — currencies, phone formats, date rituals.\n\n## Lesson 4: Simplify onboarding\n\nA sign-up flow with fewer fields wins every A/B test we\'ve ever run.\n\n## Lesson 5: Ship early\n\nA v0 in your users\' hands teaches you more than a year of internal design.',
    tags: ['engineering', 'africa', 'shipping'], published: true,
    published_date: new Date().toISOString(),
  },
  {
    slug: 'why-we-chose-neon', title: 'Why we picked Neon Postgres for our stack',
    category: 'Engineering', excerpt: 'A pragmatic walk-through of the Postgres landscape for serverless-first teams.',
    author: 'Enoch Abe', reading_time: 4,
    content: '# Why we picked Neon Postgres\n\nWe run everything on Vercel functions. Any database we pick has to handle:\n\n- **cold starts** — connection pools that survive re-hydration\n- **spiky traffic** — instant scale-to-zero and back\n- **branching** — separate databases per PR\n\nNeon nails all three. Its HTTP driver is a first-class citizen on Vercel and its branching is genuinely magical for previews.\n',
    tags: ['engineering', 'postgres'], published: true, published_date: new Date().toISOString(),
  },
];

const TESTIMONIALS = [
  { author_name: 'Dr. Chinonso Okafor', role: 'Medical Director', company: 'Bethel Family Clinic', location: 'Lagos, Nigeria', quote: 'Cereus turned around our clinic operations in six weeks. Patient wait times are down by half and our records are finally in one place.', featured: true, approved: true },
  { author_name: 'Prof. Zainab Adegoke', role: 'Vice-Chancellor', company: 'Redwood University', location: 'Ibadan, Nigeria', quote: 'Lumen LMS handles our 12,000-student cohort without breaking a sweat. The Cereus team feels like an extension of ours.', featured: true, approved: true },
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

  // site content — upsert
  await sql`INSERT INTO site_content (id, data) VALUES (1, ${JSON.stringify(DEFAULT_SITE_CONTENT)}::jsonb)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`;
  console.log('✓ site content upserted');

  for (const p of PRODUCTS) {
    await sql`INSERT INTO products (slug, name, category, status, short_description, primary_benefit, demo_url, tags, features, use_cases, tech_stack)
              VALUES (${p.slug}, ${p.name}, ${p.category}, ${p.status}, ${p.short_description}, ${p.primary_benefit}, ${p.demo_url || null},
                      ${JSON.stringify(p.tags)}::jsonb, ${JSON.stringify(p.features)}::jsonb,
                      ${JSON.stringify(p.use_cases)}::jsonb, ${JSON.stringify(p.tech_stack)}::jsonb)
              ON CONFLICT (slug) DO NOTHING`;
  }
  console.log(`✓ ${PRODUCTS.length} products seeded`);

  for (const i of INSIGHTS) {
    await sql`INSERT INTO insights (slug, title, category, excerpt, content, author, reading_time, tags, published, published_date)
              VALUES (${i.slug}, ${i.title}, ${i.category}, ${i.excerpt}, ${i.content}, ${i.author}, ${i.reading_time},
                      ${JSON.stringify(i.tags)}::jsonb, ${i.published}, ${i.published_date})
              ON CONFLICT (slug) DO NOTHING`;
  }
  console.log(`✓ ${INSIGHTS.length} insights seeded`);

  // Only insert testimonials/careers if the tables are empty (idempotent-ish).
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
