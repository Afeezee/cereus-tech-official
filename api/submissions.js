// Consolidated submissions endpoint.
//
// Public forms POST here with a `kind` query param:
//   POST /api/submissions?kind=contact       { name, email, message }
//   POST /api/submissions?kind=newsletter    { email }
//   POST /api/submissions?kind=career        { name, email, role_applying_for, … }
//   POST /api/submissions?kind=student       { full_name, email, phone, … }
//   POST /api/submissions?kind=instructor    { full_name, email, phone, location, … }
//
// Admin lists / deletes via the same file:
//   GET    /api/submissions              → all submissions, newest first (admin)
//   GET    /api/submissions?kind=contact → filter by kind (admin)
//   DELETE /api/submissions?id=…         → delete by id (admin)
//
// Collapsing the 6 previous sibling files into one keeps us under the
// Vercel Hobby-plan 12-function ceiling.
import { sql, ensureSchema, ok, bad, methodNotAllowed } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

// Required fields per kind — kept close to the handler so the mapping is
// readable at a glance rather than buried in a separate module.
const REQUIRED_BY_KIND = {
  contact:    ['name', 'email', 'message'],
  newsletter: ['email'],
  career:     ['name', 'email', 'role_applying_for'],
  student:    ['full_name', 'email', 'phone'],
  instructor: ['full_name', 'email', 'phone', 'location'],
};

export default async function handler(req, res) {
  await ensureSchema();

  // ─── POST (public write) ────────────────────────────────────────────
  if (req.method === 'POST') {
    const kind = String(req.query?.kind || '').trim();
    if (!REQUIRED_BY_KIND[kind]) {
      return bad(res, `Unknown submission kind "${kind}". Expected one of: ${Object.keys(REQUIRED_BY_KIND).join(', ')}.`);
    }
    const payload = req.body || {};
    for (const f of REQUIRED_BY_KIND[kind]) {
      if (!payload[f]) return bad(res, `${f} is required`);
    }
    try {
      const [row] = await sql`
        INSERT INTO submissions (kind, payload)
        VALUES (${kind}, ${JSON.stringify(payload)}::jsonb)
        RETURNING id, kind, created_at
      `;
      return ok(res, { ok: true, id: row.id }, { status: 201 });
    } catch (e) {
      return bad(res, e.message || 'Failed to save submission', 500);
    }
  }

  // ─── GET / DELETE (admin only) ──────────────────────────────────────
  try { await requireAdmin(req); }
  catch (e) { return bad(res, e.message, e.status || 401); }

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

  return methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
}
