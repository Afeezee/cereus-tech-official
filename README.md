# Cereus Technologies

Marketing site and content admin for **Cereus Technologies** — Vite + React on the front, Vercel Functions + Neon Postgres on the back, Clerk for admin auth.

- **`/`** public marketing site (Home, About, Products, Services, Academy, Careers, Insights, Contact)
- **`/admin`** Clerk-gated dashboard for editing products, insights, testimonials, careers, site content, and reading form submissions

## Stack

| Concern | Choice |
|---|---|
| Framework | Vite + React 18 + React Router |
| Styling | Tailwind CSS + shadcn/ui components + framer-motion |
| Backend | Vercel Serverless Functions (`/api/*`) |
| Database | [Neon Postgres](https://neon.tech) via `@neondatabase/serverless` |
| Auth | [Clerk](https://clerk.com) (`@clerk/clerk-react` on the client, `@clerk/backend` on the server) |
| Hosting | [Vercel](https://vercel.com) |

## Local setup

Prerequisites: Node 20+, an existing Neon and Clerk account.

```bash
git clone https://github.com/Afeezee/cereus-technologies.git
cd cereus-technologies
npm install
cp .env.example .env
# fill in DATABASE_URL, VITE_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, ADMIN_EMAILS
npm run seed        # creates tables + seeds demo content
npm run dev         # vite dev server on :5173
# in a second terminal (for API routes locally):
npx vercel dev      # runs the api/* functions on :3000, proxied by vite
```

Open http://localhost:5173. Admin lives at http://localhost:5173/admin.

> **You can also run the site without `vercel dev`** — the front-end will fall back to defaults for site content and simply show empty lists for products, insights, etc.

## Environment variables

| Var | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | server + `scripts/seed.mjs` | Neon Postgres connection string (pooled) |
| `VITE_CLERK_PUBLISHABLE_KEY` | client | Clerk frontend key |
| `CLERK_SECRET_KEY` | server | Clerk backend key for verifying admin tokens |
| `ADMIN_EMAILS` | server | Comma-separated list of admin emails |
| `VITE_ADMIN_EMAILS` | client (optional) | Same list, for a friendlier "not authorized" screen |

If `ADMIN_EMAILS` is empty **any** signed-in Clerk user can hit admin APIs — a bootstrap mode for first setup only. Set it as soon as you deploy.

## Deploying to Vercel

1. Push this repo to GitHub (already done).
2. In Vercel: **New project → Import** the repo.
3. Framework preset: **Vite** (auto-detected).
4. Add every env var from `.env.example` in the **Environment Variables** panel.
5. Click **Deploy**.
6. Run the seed against your production Neon database once:
   ```bash
   DATABASE_URL="<your-neon-url>" npm run seed
   ```
   (Or from a Neon SQL console — everything is idempotent.)

Vercel picks up:
- `vite build` → `dist/` for the static site
- `api/**/*.js` → serverless functions

## Editing content

Sign in at **`/admin`** with an email that matches `ADMIN_EMAILS`, and edit:

- **Products** — CRUD with categories, features, use cases, tech stack, screenshots, demo URL
- **Insights** — Markdown-authored articles with cover image, publish toggle, tags
- **Testimonials** — quotes with feature / approve toggles
- **Careers** — job posts with responsibilities & requirements
- **Site content** — hero copy, stats, contact details, nav, footer columns, socials
- **Submissions** — everything visitors have sent through Contact, Newsletter, Careers, Academy student & instructor forms

## Project layout

```
api/                 Vercel serverless functions
  _lib/              shared db + auth helpers
  products/          GET/POST /api/products, GET/PATCH/DELETE /api/products/[id]
  insights/          ...
  testimonials/      ...
  careers/           ...
  submissions/       public writes + admin read
  site-content.js    GET (public) / PUT (admin)

src/
  Layout.jsx         header/footer + chatbot
  App.jsx            routes
  main.jsx           providers (Clerk, React Query, SiteContent)
  components/
    common/          Hero, ProductCard, TestimonialCard, Chatbot, NewsletterSignup
    ui/              shadcn/ui primitives
  lib/
    api.js           typed-ish fetch helpers for /api
    admin-guard.jsx  Clerk sign-in + admin allow-list gate
    site-content.jsx SiteContentProvider (fetches /api/site-content)
    motion.js        framer-motion variants
    utils.js         cn(), slugify(), formatDate()
  pages/             public pages
    admin/           admin dashboard pages

scripts/seed.mjs     one-shot schema + demo data
```

## Design system

Colours are defined once in `tailwind.config.js` (brand purple + leaf green) and referenced via utilities like `bg-brand-800`, `text-leaf-600`, `bg-brand-gradient`, `bg-brand-radial`. Every page uses shared building blocks (`.container-page`, `.section`, `.h-display`, `.h-section`, `.eyebrow`, `.lead`, `.glass`, `.lift`, `.text-gradient`) so tweaking the palette or spacing rhythm is a one-file change.

Motion is centralised in `src/lib/motion.js` — reuse `fadeUp`, `stagger()`, and `revealOnce` on any section for consistent scroll reveals.
