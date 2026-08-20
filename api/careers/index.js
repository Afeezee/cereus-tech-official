import { sql, ensureSchema, ok, bad, methodNotAllowed } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  await ensureSchema();

  if (req.method === 'GET') {
    const { includeInactive } = req.query || {};
    try {
      if (includeInactive) {
        try { await requireAdmin(req); } catch (e) { return bad(res, e.message, e.status || 401); }
        const rows = await sql`SELECT * FROM careers ORDER BY created_at DESC`;
        return ok(res, { items: rows });
      }
      const rows = await sql`SELECT * FROM careers WHERE active = true ORDER BY created_at DESC`;
      return ok(res, { items: rows });
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'POST') {
    try { await requireAdmin(req); } catch (e) { return bad(res, e.message, e.status || 401); }
    const b = req.body || {};
    if (!b.title) return bad(res, 'title required');
    try {
      const [row] = await sql`
        INSERT INTO careers (title, department, location, type, summary, responsibilities, requirements, active)
        VALUES (${b.title}, ${b.department || null}, ${b.location || null}, ${b.type || null},
                ${b.summary || null},
                ${JSON.stringify(b.responsibilities || [])}::jsonb,
                ${JSON.stringify(b.requirements || [])}::jsonb,
                ${b.active !== false})
        RETURNING *
      `;
      return ok(res, row, { status: 201 });
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}
