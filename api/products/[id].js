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
        ? await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`
        : await sql`SELECT * FROM products WHERE slug = ${id} LIMIT 1`;
      if (!rows[0]) return bad(res, 'Product not found', 404);
      return ok(res, rows[0]);
    } catch (e) { return bad(res, e.message, 500); }
  }

  try { await requireAdmin(req); }
  catch (e) { return bad(res, e.message, e.status || 401); }

  if (req.method === 'PATCH') {
    const b = req.body || {};
    const slug = b.slug || (b.name ? slugify(b.name) : undefined);
    try {
      const rows = isUuid(id)
        ? await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`
        : await sql`SELECT * FROM products WHERE slug = ${id} LIMIT 1`;
      const current = rows[0];
      if (!current) return bad(res, 'Product not found', 404);

      const merged = {
        slug: slug ?? current.slug,
        name: b.name ?? current.name,
        category: b.category ?? current.category,
        status: b.status ?? current.status,
        short_description: b.short_description ?? current.short_description,
        detailed_description: b.detailed_description ?? current.detailed_description,
        primary_benefit: b.primary_benefit ?? current.primary_benefit,
        demo_url: b.demo_url ?? current.demo_url,
        image_url: b.image_url ?? current.image_url,
        tags: b.tags ?? current.tags,
        features: b.features ?? current.features,
        use_cases: b.use_cases ?? current.use_cases,
        tech_stack: b.tech_stack ?? current.tech_stack,
        screenshot_urls: b.screenshot_urls ?? current.screenshot_urls,
        sort_order: b.sort_order ?? current.sort_order,
      };

      const [row] = await sql`
        UPDATE products SET
          slug = ${merged.slug},
          name = ${merged.name},
          category = ${merged.category},
          status = ${merged.status},
          short_description = ${merged.short_description},
          detailed_description = ${merged.detailed_description},
          primary_benefit = ${merged.primary_benefit},
          demo_url = ${merged.demo_url},
          image_url = ${merged.image_url},
          tags = ${JSON.stringify(merged.tags || [])}::jsonb,
          features = ${JSON.stringify(merged.features || [])}::jsonb,
          use_cases = ${JSON.stringify(merged.use_cases || [])}::jsonb,
          tech_stack = ${JSON.stringify(merged.tech_stack || [])}::jsonb,
          screenshot_urls = ${JSON.stringify(merged.screenshot_urls || [])}::jsonb,
          sort_order = ${merged.sort_order},
          updated_at = NOW()
        WHERE id = ${current.id}
        RETURNING *
      `;
      return ok(res, row);
    } catch (e) {
      if (String(e.message).includes('duplicate')) return bad(res, 'Slug already in use', 409);
      return bad(res, e.message, 500);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = isUuid(id)
        ? await sql`DELETE FROM products WHERE id = ${id}`
        : await sql`DELETE FROM products WHERE slug = ${id}`;
      return ok(res, { deleted: true });
    } catch (e) { return bad(res, e.message, 500); }
  }

  return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
}
