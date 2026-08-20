// Neon serverless HTTP driver — no persistent connection pool, perfect for
// Vercel Functions. `sql` is a tagged-template that parameterises safely.
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  // Don't throw at import time in local `vercel dev` when the user hasn't set
  // this yet — just log so the first request has a clear failure.
  // eslint-disable-next-line no-console
  console.warn('[db] DATABASE_URL is not set — API calls will fail until it is.');
}

export const sql = url ? neon(url) : async () => {
  throw new Error('DATABASE_URL is not configured');
};

// ─── Schema bootstrap ────────────────────────────────────────────
// Called once per cold start (idempotent). Creates tables if missing.
let bootstrapped = false;
let bootstrapPromise = null;

export async function ensureSchema() {
  if (bootstrapped) return;
  if (bootstrapPromise) return bootstrapPromise;
  bootstrapPromise = doBootstrap();
  await bootstrapPromise;
  bootstrapped = true;
}

async function doBootstrap() {
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      status TEXT DEFAULT 'Active',
      short_description TEXT,
      detailed_description TEXT,
      primary_benefit TEXT,
      demo_url TEXT,
      image_url TEXT,
      tags JSONB DEFAULT '[]'::jsonb,
      features JSONB DEFAULT '[]'::jsonb,
      use_cases JSONB DEFAULT '[]'::jsonb,
      tech_stack JSONB DEFAULT '[]'::jsonb,
      screenshot_urls JSONB DEFAULT '[]'::jsonb,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS insights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      excerpt TEXT,
      content TEXT,
      featured_image TEXT,
      author TEXT,
      reading_time INT,
      tags JSONB DEFAULT '[]'::jsonb,
      published BOOLEAN DEFAULT true,
      published_date TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      author_name TEXT NOT NULL,
      quote TEXT NOT NULL,
      author_photo TEXT,
      location TEXT,
      role TEXT,
      company TEXT,
      featured BOOLEAN DEFAULT false,
      approved BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS careers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      department TEXT,
      location TEXT,
      type TEXT,
      summary TEXT,
      responsibilities JSONB DEFAULT '[]'::jsonb,
      requirements JSONB DEFAULT '[]'::jsonb,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id INT PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT single_row CHECK (id = 1)
    )
  `;

  // Submissions — all in one table with a discriminator, easier to browse.
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      kind TEXT NOT NULL,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS submissions_kind_idx ON submissions(kind, created_at DESC)`;
}

// ─── Response helpers ────────────────────────────────────────────
export function ok(res, data, init = {}) {
  const status = init.status || 200;
  const cache = init.cache;
  res.status(status);
  if (cache) res.setHeader('Cache-Control', cache);
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

export function bad(res, error, status = 400) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ error }));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  return bad(res, `Method not allowed`, 405);
}
