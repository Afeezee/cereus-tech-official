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
      const [c] = await sql`SELECT * FROM careers WHERE id = ${id} LIMIT 1`;
      if (!c) return bad(res, 'Not found', 404);
      const [row] = await sql`
        UPDATE careers SET
          title = ${b.title ?? c.title},
          department = ${b.department ?? c.department},
          location = ${b.location ?? c.location},
          type = ${b.type ?? c.type},
          summary = ${b.summary ?? c.summary},
          responsibilities = ${JSON.stringify(b.responsibilities ?? c.responsibilities ?? [])}::jsonb,
          requirements = ${JSON.stringify(b.requirements ?? c.requirements ?? [])}::jsonb,
          active = ${b.active ?? c.active}
        WHERE id = ${id}
        RETURNING *
      `;
      return ok(res, row);
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM careers WHERE id = ${id}`;
      return ok(res, { deleted: true });
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['PATCH', 'DELETE']);
}
