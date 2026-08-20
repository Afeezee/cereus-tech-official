import { sql, ensureSchema, ok, bad } from '../_lib/db.js';

// Shared writer for the various public submission endpoints.
export async function saveSubmission(kind, req, res, { requireFields = [] } = {}) {
  await ensureSchema();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return bad(res, 'Method not allowed', 405);
  }
  const body = req.body || {};
  for (const f of requireFields) {
    if (!body[f]) return bad(res, `${f} is required`);
  }
  try {
    const [row] = await sql`
      INSERT INTO submissions (kind, payload)
      VALUES (${kind}, ${JSON.stringify(body)}::jsonb)
      RETURNING id, kind, created_at
    `;
    return ok(res, { ok: true, id: row.id }, { status: 201 });
  } catch (e) {
    return bad(res, e.message || 'Failed to save', 500);
  }
}
