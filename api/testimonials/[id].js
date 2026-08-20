import { sql, ensureSchema, ok, bad, methodNotAllowed } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  await ensureSchema();
  try { await requireAdmin(req); } catch (e) { return bad(res, e.message, e.status || 401); }
  const { id } = req.query;
  if (!id) return bad(res, 'id required');

  if (req.method === 'PATCH') {
    const b = req.body || {};
    try {
      const [c] = await sql`SELECT * FROM testimonials WHERE id = ${id} LIMIT 1`;
      if (!c) return bad(res, 'Not found', 404);
      const [row] = await sql`
        UPDATE testimonials SET
          author_name = ${b.author_name ?? c.author_name},
          quote = ${b.quote ?? c.quote},
          author_photo = ${b.author_photo ?? c.author_photo},
          location = ${b.location ?? c.location},
          role = ${b.role ?? c.role},
          company = ${b.company ?? c.company},
          featured = ${b.featured ?? c.featured},
          approved = ${b.approved ?? c.approved}
        WHERE id = ${id}
        RETURNING *
      `;
      return ok(res, row);
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM testimonials WHERE id = ${id}`;
      return ok(res, { deleted: true });
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['PATCH', 'DELETE']);
}
