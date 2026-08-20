import { sql, ensureSchema, ok, bad, methodNotAllowed } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';
import { slugify } from '../_lib/slug.js';

export default async function handler(req, res) {
  await ensureSchema();

  if (req.method === 'GET') {
    const { category, status, limit } = req.query || {};
    const n = Math.min(parseInt(limit || '50', 10) || 50, 100);
    try {
      let rows;
      if (category && status) {
        rows = await sql`SELECT * FROM products WHERE category = ${category} AND status = ${status} ORDER BY sort_order ASC, created_at DESC LIMIT ${n}`;
      } else if (category) {
        rows = await sql`SELECT * FROM products WHERE category = ${category} ORDER BY sort_order ASC, created_at DESC LIMIT ${n}`;
      } else if (status) {
        rows = await sql`SELECT * FROM products WHERE status = ${status} ORDER BY sort_order ASC, created_at DESC LIMIT ${n}`;
      } else {
        rows = await sql`SELECT * FROM products ORDER BY sort_order ASC, created_at DESC LIMIT ${n}`;
      }
      return ok(res, { items: rows });
    } catch (e) {
      return bad(res, e.message || 'Failed to list products', 500);
    }
  }

  if (req.method === 'POST') {
    try {
      await requireAdmin(req);
    } catch (e) { return bad(res, e.message, e.status || 401); }

    const body = req.body || {};
    if (!body.name) return bad(res, 'name is required');
    const slug = body.slug || slugify(body.name);

    try {
      const [row] = await sql`
        INSERT INTO products (
          slug, name, category, status, short_description, detailed_description,
          primary_benefit, demo_url, image_url, tags, features, use_cases,
          tech_stack, screenshot_urls, sort_order
        ) VALUES (
          ${slug}, ${body.name}, ${body.category || null}, ${body.status || 'Active'},
          ${body.short_description || null}, ${body.detailed_description || null},
          ${body.primary_benefit || null}, ${body.demo_url || null}, ${body.image_url || null},
          ${JSON.stringify(body.tags || [])}::jsonb,
          ${JSON.stringify(body.features || [])}::jsonb,
          ${JSON.stringify(body.use_cases || [])}::jsonb,
          ${JSON.stringify(body.tech_stack || [])}::jsonb,
          ${JSON.stringify(body.screenshot_urls || [])}::jsonb,
          ${body.sort_order || 0}
        )
        RETURNING *
      `;
      return ok(res, row, { status: 201 });
    } catch (e) {
      if (String(e.message).includes('duplicate')) return bad(res, 'A product with that slug already exists', 409);
      return bad(res, e.message || 'Failed to create product', 500);
    }
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}
