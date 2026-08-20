import { sql, ensureSchema, ok, bad, methodNotAllowed } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  await ensureSchema();

  if (req.method === 'GET') {
    const { featured, includeUnapproved, limit } = req.query || {};
    const n = Math.min(parseInt(limit || '30', 10) || 30, 100);
    try {
      if (includeUnapproved) {
        try { await requireAdmin(req); } catch (e) { return bad(res, e.message, e.status || 401); }
        const rows = await sql`SELECT * FROM testimonials ORDER BY created_at DESC LIMIT ${n}`;
        return ok(res, { items: rows });
      }
      const rows = featured
        ? await sql`SELECT * FROM testimonials WHERE approved = true AND featured = true ORDER BY created_at DESC LIMIT ${n}`
        : await sql`SELECT * FROM testimonials WHERE approved = true ORDER BY created_at DESC LIMIT ${n}`;
      return ok(res, { items: rows });
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'POST') {
    try { await requireAdmin(req); } catch (e) { return bad(res, e.message, e.status || 401); }
    const b = req.body || {};
    if (!b.author_name || !b.quote) return bad(res, 'author_name and quote are required');
    try {
      const [row] = await sql`
        INSERT INTO testimonials (author_name, quote, author_photo, location, role, company, featured, approved)
        VALUES (${b.author_name}, ${b.quote}, ${b.author_photo || null}, ${b.location || null},
                ${b.role || null}, ${b.company || null}, ${!!b.featured}, ${b.approved !== false})
        RETURNING *
      `;
      return ok(res, row, { status: 201 });
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}
