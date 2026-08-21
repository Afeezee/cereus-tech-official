// Verify the Bearer token attached by the Clerk-authenticated admin UI, then
// enforce that the user's email is in ADMIN_EMAILS.
//
// Two verification paths, tried in order:
//   1. Local JWKS — fetch the public key from
//      https://<instance>/.well-known/jwks.json once, cache it, and verify
//      every token locally. No secret key needed for this step.
//   2. Fallback to @clerk/backend's clerk.verifyToken() (needs the secret).
//
// On any failure the raw underlying error string is both logged to the
// server console AND returned in the JSON error body, so we never guess
// again about what went wrong.

import { createClerkClient, verifyToken as clerkVerifyToken } from '@clerk/backend';
import { createPublicKey, createVerify } from 'node:crypto';

const secretKey = process.env.CLERK_SECRET_KEY;
const secretLooksValid = !!secretKey && /^sk_(test|live)_/.test(secretKey);
if (secretKey && !secretLooksValid) {
  console.error(
    '[auth] CLERK_SECRET_KEY does not look like a secret key (expected sk_test_… or sk_live_…). ' +
    'Copy the "Secret keys" value from Clerk Dashboard → API Keys.'
  );
}
const clerk = secretLooksValid ? createClerkClient({ secretKey }) : null;

// Decode the instance domain out of the publishable key.
function decodePublishableInstance() {
  const pk = process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!pk) return null;
  const m = pk.match(/^pk_(test|live)_(.+)$/);
  if (!m) return null;
  try {
    return Buffer.from(m[2], 'base64').toString('utf8').replace(/\$+$/, '');
  } catch { return null; }
}
const publishableInstance = decodePublishableInstance();
if (publishableInstance) {
  console.log(`[auth] Clerk publishable key targets instance: ${publishableInstance}`);
}

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// ─── JWKS cache ─────────────────────────────────────────────────────────
// Fetched lazily on first use and reused for the lifetime of the process.
// A signature failure re-fetches once (in case Clerk rotated keys).
let jwksCache = null;
let jwksFetchedAt = 0;
async function fetchJwks(force = false) {
  const stale = Date.now() - jwksFetchedAt > 10 * 60 * 1000;
  if (!force && jwksCache && !stale) return jwksCache;
  const jwksUrl = process.env.CLERK_JWKS_URL
    || (publishableInstance ? `https://${publishableInstance}/.well-known/jwks.json` : null);
  if (!jwksUrl) throw new Error('No JWKS URL — set CLERK_PUBLISHABLE_KEY or CLERK_JWKS_URL.');
  const res = await fetch(jwksUrl);
  if (!res.ok) throw new Error(`JWKS fetch ${jwksUrl} → HTTP ${res.status}`);
  jwksCache = await res.json();
  jwksFetchedAt = Date.now();
  return jwksCache;
}

// Small in-house JWT verifier. Enough for RS256 (which Clerk uses), no deps.
async function verifyLocally(token) {
  const [h, p, s] = token.split('.');
  if (!h || !p || !s) throw new Error('malformed JWT');
  const header = JSON.parse(Buffer.from(h.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  const payload = JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));

  if (header.alg !== 'RS256') throw new Error(`unsupported alg ${header.alg}`);
  const jwks = await fetchJwks();
  let jwk = jwks.keys?.find((k) => k.kid === header.kid);
  if (!jwk) {
    // Key rotation — refetch once.
    const fresh = await fetchJwks(true);
    jwk = fresh.keys?.find((k) => k.kid === header.kid);
  }
  if (!jwk) throw new Error(`no JWKS key matches kid ${header.kid}`);

  const key = createPublicKey({ key: jwk, format: 'jwk' });
  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${h}.${p}`);
  const sig = Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const ok = verifier.verify(key, sig);
  if (!ok) throw new Error('signature does not match JWKS');

  const now = Math.floor(Date.now() / 1000);
  const skew = 30; // seconds — Clerk tokens are short-lived; small skew is fine.
  if (payload.exp && payload.exp + skew < now) throw new Error('token expired');
  if (payload.nbf && payload.nbf - skew > now) throw new Error('token not yet valid');

  return payload;
}

function peekJwt(token) {
  try {
    const [, p] = token.split('.');
    if (!p) return null;
    return JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  } catch { return null; }
}

export async function requireAdmin(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) { const e = new Error('Missing bearer token'); e.status = 401; throw e; }

  // ─── Step 1: local JWKS verification ─────────────────────────────────
  // Preferred: doesn't touch the secret key at all.
  let payload;
  let localError = null;
  try {
    payload = await verifyLocally(token);
  } catch (localErr) {
    localError = localErr;
    // ─── Step 2: fall back to the SDK's standalone verifyToken ─────────
    // `clerk.verifyToken` doesn't exist on the client instance in @clerk/backend
    // v1+ — verifyToken is a top-level import.
    if (secretLooksValid) {
      try {
        payload = await clerkVerifyToken(token, { secretKey });
      } catch (sdkErr) {
        payload = null;
        // Give the developer both errors, plus a diagnostic hint.
        const peek = peekJwt(token);
        const tokenInstance = peek?.iss ? String(peek.iss).replace(/^https?:\/\//, '') : null;
        const parts = [`local JWKS verify: ${localErr.message}`, `SDK verify: ${sdkErr.message}`];
        if (tokenInstance) parts.push(`token iss: ${tokenInstance}`);
        if (publishableInstance) parts.push(`publishable instance: ${publishableInstance}`);
        console.error(`[auth] verifyToken failed → ${parts.join(' | ')}`);
        const err = new Error(`Invalid or expired session token — ${parts.join(' — ')}`);
        err.status = 401;
        throw err;
      }
    } else {
      // No secret set at all → local was our only chance; surface its raw error.
      console.error(`[auth] local verifyToken failed and CLERK_SECRET_KEY not set → ${localErr.message}`);
      const err = new Error(`Invalid or expired session token — ${localErr.message} (no CLERK_SECRET_KEY set to fall back on)`);
      err.status = 401;
      throw err;
    }
  }

  if (!payload?.sub) { const e = new Error('Token has no subject'); e.status = 401; throw e; }

  // ─── Admin allow-list check ─────────────────────────────────────────
  // If ADMIN_EMAILS is empty ⇒ allow any signed-in user (bootstrap mode).
  if (adminEmails.length === 0) {
    return { userId: payload.sub, email: null };
  }

  // Prefer the email out of the JWT if Clerk put it in a custom claim.
  const jwtEmail = payload.email || payload.primary_email_address || null;
  if (jwtEmail) {
    const emailLc = String(jwtEmail).toLowerCase();
    if (adminEmails.includes(emailLc)) return { userId: payload.sub, email: emailLc };
    const err = new Error(`Not authorized for admin (${emailLc}). Add this email to ADMIN_EMAILS.`);
    err.status = 403;
    throw err;
  }

  // Fall back to Clerk API to fetch the email — needs the secret key.
  if (!clerk) {
    const err = new Error('Token verified, but CLERK_SECRET_KEY is required to look up the user email for the admin allow-list.');
    err.status = 500;
    throw err;
  }
  try {
    const user = await clerk.users.getUser(payload.sub);
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
      || user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
      || null;
    if (!email || !adminEmails.includes(email)) {
      const err = new Error(`Not authorized for admin (${email || 'no email on account'}). Add this email to ADMIN_EMAILS.`);
      err.status = 403;
      throw err;
    }
    return { userId: payload.sub, email };
  } catch (userErr) {
    if (userErr.status === 403) throw userErr;
    console.error(`[auth] clerk.users.getUser(${payload.sub}) failed → ${userErr.message}`);
    const err = new Error(`Token verified but user lookup failed: ${userErr.message}. Confirm CLERK_SECRET_KEY belongs to the same Clerk project as CLERK_PUBLISHABLE_KEY.`);
    err.status = 500;
    throw err;
  }
}

