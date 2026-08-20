import { sql, ensureSchema, ok, bad, methodNotAllowed } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  await ensureSchema();

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT data FROM site_content WHERE id = 1 LIMIT 1`;
      return ok(res, rows[0]?.data || {});
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'PUT') {
    try { await requireAdmin(req); } catch (e) { return bad(res, e.message, e.status || 401); }
    const data = req.body || {};
    try {
      await sql`
        INSERT INTO site_content (id, data, updated_at)
        VALUES (1, ${JSON.stringify(data)}::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      `;
      return ok(res, data);
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['GET', 'PUT']);
}
