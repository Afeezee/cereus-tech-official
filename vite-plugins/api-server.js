// Vite dev-server middleware that turns the Vercel-style /api/**/*.js
// handlers into a live Node HTTP endpoint. In dev, `npm run dev` alone is
// enough — no separate `vercel dev` needed. In production, Vercel picks
// up the same files as serverless functions from the /api directory.
import path from 'node:path';
import { promises as fs, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const API_ROOT = path.resolve(process.cwd(), 'api');

// Cache resolved routes across requests to avoid the fs walk every call.
// Cleared automatically when Vite HMRs the plugin.
let routeIndex = null;

// Walk /api and build a list of { pattern, filePath, params } routes.
// Supports both `/api/products/index.js` and `/api/products/[id].js`.
async function buildRouteIndex() {
  const routes = [];
  if (!existsSync(API_ROOT)) return routes;

  async function walk(dir, urlPrefix) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // `_lib` and any other underscore-prefixed folder is helpers, not routes.
        if (entry.name.startsWith('_')) continue;
        await walk(abs, `${urlPrefix}/${entry.name}`);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
      // Underscore-prefixed files are helpers (e.g. _util.js).
      if (entry.name.startsWith('_')) continue;

      const stem = entry.name.replace(/\.js$/, '');
      // Turn [id].js into a regex capture + param name.
      const isDynamic = stem.startsWith('[') && stem.endsWith(']');
      const paramName = isDynamic ? stem.slice(1, -1) : null;
      const segment = isDynamic ? null : stem === 'index' ? '' : stem;

      const urlPath = segment !== null
        ? (segment ? `${urlPrefix}/${segment}` : urlPrefix)
        : `${urlPrefix}/:${paramName}`;

      routes.push({
        urlPath,
        filePath: abs,
        paramName,
        // Pre-compile a matcher: escape static parts, replace :param with capture
        matcher: new RegExp('^' + urlPath.replace(/:[^/]+/g, '([^/]+)').replace(/\//g, '\\/') + '\\/?$'),
      });
    }
  }

  await walk(API_ROOT, '/api');
  // Longest static path first so /api/products/index wins over /api/products/[id]
  // when both could match (`/api/products` matches only the index one).
  routes.sort((a, b) => b.urlPath.length - a.urlPath.length - (a.paramName ? 1 : 0) + (b.paramName ? 1 : 0));
  return routes;
}

// Read the full request body as JSON (or an empty object).
function readBody(req) {
  return new Promise((resolve) => {
    let chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { resolve(raw); }
    });
    req.on('error', () => resolve({}));
  });
}

export default function apiServer() {
  return {
    name: 'cereus-api-server',
    async configureServer(server) {
      // Route index is built once per boot; if you add a new /api file,
      // restart `npm run dev`. HMR of handler bodies is handled by
      // cache-busting the dynamic import below.
      routeIndex = await buildRouteIndex();

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) return next();

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        // Find the first matching route.
        let match = null;
        for (const r of routeIndex) {
          const m = pathname.match(r.matcher);
          if (m) { match = { route: r, groups: m.slice(1) }; break; }
        }
        if (!match) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: `No API route for ${pathname}` }));
        }

        const { route, groups } = match;

        // Vercel gives handlers a merged query object (path params + query string).
        const query = Object.fromEntries(url.searchParams.entries());
        if (route.paramName) query[route.paramName] = decodeURIComponent(groups[0]);
        // Also populate req.query for common patterns.
        req.query = query;

        // Vercel's req.body is auto-parsed for JSON. Match that.
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
          req.body = await readBody(req);
        }

        // Import (with cache-buster so edits reload) and invoke.
        try {
          const mod = await import(pathToFileURL(route.filePath).href + `?t=${Date.now()}`);
          const handler = mod.default || mod.handler;
          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: `${route.filePath} has no default export handler` }));
          }
          // Shim res.status/.json/.send in case a handler expects Express-style.
          const originalStatus = res.status;
          if (!originalStatus) {
            res.status = function (code) { res.statusCode = code; return res; };
          }
          if (!res.json) {
            res.json = function (obj) {
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(obj));
            };
          }
          if (!res.send) {
            res.send = function (body) {
              return res.end(typeof body === 'string' ? body : JSON.stringify(body));
            };
          }
          await handler(req, res);
        } catch (err) {
          console.error(`[api] ${req.method} ${pathname} →`, err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
          }
        }
      });
    },
  };
}
