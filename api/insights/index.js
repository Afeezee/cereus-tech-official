import { sql, ensureSchema, ok, bad, methodNotAllowed } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';
import { slugify } from '../_lib/slug.js';

export default async function handler(req, res) {
  await ensureSchema();

  if (req.method === 'GET') {
    const { category, includeUnpublished, limit } = req.query || {};
    const n = Math.min(parseInt(limit || '50', 10) || 50, 100);
    try {
      if (includeUnpublished) {
        // Admin listing — still requires auth.
        try { await requireAdmin(req); }
        catch (e) { return bad(res, e.message, e.status || 401); }
        const rows = category
          ? await sql`SELECT * FROM insights WHERE category = ${category} ORDER BY published_date DESC NULLS LAST, created_at DESC LIMIT ${n}`
          : await sql`SELECT * FROM insights ORDER BY published_date DESC NULLS LAST, created_at DESC LIMIT ${n}`;
        return ok(res, { items: rows });
      }
      const rows = category
        ? await sql`SELECT * FROM insights WHERE published = true AND category = ${category} ORDER BY published_date DESC LIMIT ${n}`
        : await sql`SELECT * FROM insights WHERE published = true ORDER BY published_date DESC LIMIT ${n}`;
      return ok(res, { items: rows });
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'POST') {
    try { await requireAdmin(req); }
    catch (e) { return bad(res, e.message, e.status || 401); }

    const b = req.body || {};
    if (!b.title) return bad(res, 'title required');
    const slug = b.slug || slugify(b.title);

    try {
      const [row] = await sql`
        INSERT INTO insights (
          slug, title, category, excerpt, content, featured_image, author, reading_time,
          tags, published, published_date
        ) VALUES (
          ${slug}, ${b.title}, ${b.category || null}, ${b.excerpt || null},
          ${b.content || null}, ${b.featured_image || null}, ${b.author || null},
          ${b.reading_time || null},
          ${JSON.stringify(b.tags || [])}::jsonb,
          ${b.published !== false},
          ${b.published_date || null}
        )
        RETURNING *
      `;
      return ok(res, row, { status: 201 });
    } catch (e) {
      if (String(e.message).includes('duplicate')) return bad(res, 'Slug already exists', 409);
      return bad(res, e.message, 500);
    }
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}
