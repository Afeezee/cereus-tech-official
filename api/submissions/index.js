// Admin-only listing / deletion of stored submissions across all kinds.
import { sql, ensureSchema, ok, bad, methodNotAllowed } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  await ensureSchema();
  try { await requireAdmin(req); } catch (e) { return bad(res, e.message, e.status || 401); }

  if (req.method === 'GET') {
    const { kind } = req.query || {};
    try {
      const rows = kind
        ? await sql`SELECT * FROM submissions WHERE kind = ${kind} ORDER BY created_at DESC LIMIT 200`
        : await sql`SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200`;
      return ok(res, { items: rows });
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) return bad(res, 'id required');
    try {
      await sql`DELETE FROM submissions WHERE id = ${id}`;
      return ok(res, { deleted: true });
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['GET', 'DELETE']);
}
