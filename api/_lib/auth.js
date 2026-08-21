// Verify the Bearer token attached by the Clerk-authenticated admin UI, then
// enforce that the user's email is in ADMIN_EMAILS.

import { createClerkClient } from '@clerk/backend';

const secretKey = process.env.CLERK_SECRET_KEY;

// Guard against a common footgun: pasting the publishable key into
// CLERK_SECRET_KEY. Both start with "pk_"/"sk_" respectively — a pk_ value
// here silently breaks every admin write with an opaque "Invalid token"
// error, so we surface it up front instead.
const secretLooksValid = !!secretKey && /^sk_(test|live)_/.test(secretKey);
if (secretKey && !secretLooksValid) {
  // eslint-disable-next-line no-console
  console.error(
    '[auth] CLERK_SECRET_KEY does not look like a secret key (expected sk_test_… or sk_live_…). ' +
    'Copy the "Secret keys" value from Clerk Dashboard → API Keys.'
  );
}
const clerk = secretLooksValid ? createClerkClient({ secretKey }) : null;

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Returns the user record when authorized, or throws with a status.
export async function requireAdmin(req) {
  if (!clerk) {
    const err = new Error(
      secretKey
        ? 'CLERK_SECRET_KEY must start with sk_test_ or sk_live_ (looks like a publishable key was pasted here).'
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
    const err = new Error('Invalid or expired session token');
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
    const err = new Error('Not authorized for admin');
    err.status = 403;
    throw err;
  }

  return { userId, email };
}
