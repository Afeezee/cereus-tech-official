// Verify the Bearer token attached by the Clerk-authenticated admin UI, then
// enforce that the user's email is in ADMIN_EMAILS.
//
// Common footguns this file surfaces up front:
//   1. CLERK_SECRET_KEY missing entirely.
//   2. CLERK_SECRET_KEY is actually a publishable key (starts with pk_).
//   3. The publishable key on the client and the secret key on the server
//      belong to DIFFERENT Clerk instances (a very quiet failure mode —
//      Clerk just returns "Invalid or expired session token").

import { createClerkClient } from '@clerk/backend';

const secretKey = process.env.CLERK_SECRET_KEY;
const secretLooksValid = !!secretKey && /^sk_(test|live)_/.test(secretKey);
if (secretKey && !secretLooksValid) {
  // eslint-disable-next-line no-console
  console.error(
    '[auth] CLERK_SECRET_KEY does not look like a secret key (expected sk_test_… or sk_live_…). ' +
    'Copy the "Secret keys" value from Clerk Dashboard → API Keys.'
  );
}

const clerk = secretLooksValid ? createClerkClient({ secretKey }) : null;

// The publishable key encodes the instance's domain in base64 right after the
// pk_test_/pk_live_ prefix — we can decode it once and print it at boot so
// mismatches with the token's issuer are easy to spot.
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
  // eslint-disable-next-line no-console
  console.log(`[auth] Clerk publishable key targets instance: ${publishableInstance}`);
}

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Decode a JWT's payload without verifying — used only for diagnostics.
function peekJwt(token) {
  try {
    const [, payloadB64] = token.split('.');
    if (!payloadB64) return null;
    const json = Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    return JSON.parse(json);
  } catch { return null; }
}

// Returns the user record when authorized, or throws with a status.
export async function requireAdmin(req) {
  if (!clerk) {
    const err = new Error(
      secretKey
        ? 'CLERK_SECRET_KEY must start with sk_test_ or sk_live_ (a publishable key was pasted here).'
        : 'CLERK_SECRET_KEY is not set on the server.'
    );
    err.status = 500;
    throw err;
  }

  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    const err = new Error('Missing bearer token');
    err.status = 401;
    throw err;
  }

  let payload;
  try {
    payload = await clerk.verifyToken(token);
  } catch (e) {
    // Decode the token (unverified) to help the developer spot the actual issue.
    const peek = peekJwt(token);
    const tokenInstance = peek?.iss ? String(peek.iss).replace(/^https?:\/\//, '') : null;
    const expired = peek?.exp && (peek.exp * 1000 < Date.now());

    let hint = '';
    if (expired) {
      hint = ' — the token is past its `exp`; the client should refresh and retry.';
    } else if (tokenInstance && publishableInstance && !tokenInstance.includes(publishableInstance)) {
      hint = ` — token was issued by "${tokenInstance}" but CLERK_PUBLISHABLE_KEY targets "${publishableInstance}". The keys are for different Clerk instances.`;
    } else if (tokenInstance && publishableInstance && tokenInstance.includes(publishableInstance)) {
      hint = ` — token was issued by "${tokenInstance}" (matches the publishable key). CLERK_SECRET_KEY probably belongs to a DIFFERENT Clerk instance — copy the sk_ value from the same project as pk_${publishableInstance}.`;
    } else if (tokenInstance) {
      hint = ` — token was issued by "${tokenInstance}"; confirm CLERK_SECRET_KEY is the sk_ value from that same Clerk project.`;
    }

    const err = new Error('Invalid or expired session token' + hint);
    err.status = 401;
    err.cause = e;
    throw err;
  }

  const userId = payload.sub;
  if (!userId) {
    const err = new Error('Token has no subject');
    err.status = 401;
    throw err;
  }

  // ADMIN_EMAILS empty ⇒ allow any signed-in user (bootstrap mode).
  // Otherwise, look up the user and match their primary email.
  if (adminEmails.length === 0) {
    return { userId, email: null };
  }

  const user = await clerk.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
    || user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    || null;

  if (!email || !adminEmails.includes(email)) {
    const err = new Error(`Not authorized for admin (${email || 'no email on account'}). Add this email to ADMIN_EMAILS.`);
    err.status = 403;
    throw err;
  }

  return { userId, email };
}
