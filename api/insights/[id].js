import { sql, ensureSchema, ok, bad, methodNotAllowed } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';
import { isUuid, slugify } from '../_lib/slug.js';

export default async function handler(req, res) {
  await ensureSchema();
  const { id } = req.query;
  if (!id) return bad(res, 'id required');

  if (req.method === 'GET') {
    try {
      const rows = isUuid(id)
        ? await sql`SELECT * FROM insights WHERE id = ${id} LIMIT 1`
        : await sql`SELECT * FROM insights WHERE slug = ${id} LIMIT 1`;
      if (!rows[0]) return bad(res, 'Insight not found', 404);
      return ok(res, rows[0]);
    } catch (e) { return bad(res, e.message, 500); }
  }

  try { await requireAdmin(req); }
  catch (e) { return bad(res, e.message, e.status || 401); }

  if (req.method === 'PATCH') {
    const b = req.body || {};
    const slug = b.slug || (b.title ? slugify(b.title) : undefined);
    try {
      const rows = isUuid(id)
        ? await sql`SELECT * FROM insights WHERE id = ${id} LIMIT 1`
        : await sql`SELECT * FROM insights WHERE slug = ${id} LIMIT 1`;
      const c = rows[0];
      if (!c) return bad(res, 'Insight not found', 404);

      const [row] = await sql`
        UPDATE insights SET
          slug = ${slug ?? c.slug},
          title = ${b.title ?? c.title},
          category = ${b.category ?? c.category},
          excerpt = ${b.excerpt ?? c.excerpt},
          content = ${b.content ?? c.content},
          featured_image = ${b.featured_image ?? c.featured_image},
          author = ${b.author ?? c.author},
          reading_time = ${b.reading_time ?? c.reading_time},
          tags = ${JSON.stringify(b.tags ?? c.tags ?? [])}::jsonb,
          published = ${b.published ?? c.published},
          published_date = ${b.published_date ?? c.published_date},
          updated_at = NOW()
        WHERE id = ${c.id}
        RETURNING *
      `;
      return ok(res, row);
    } catch (e) { return bad(res, e.message, 500); }
  }

  if (req.method === 'DELETE') {
    try {
      isUuid(id)
        ? await sql`DELETE FROM insights WHERE id = ${id}`
        : await sql`DELETE FROM insights WHERE slug = ${id}`;
      return ok(res, { deleted: true });
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
}
