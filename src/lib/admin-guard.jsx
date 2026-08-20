import { useAuth, useUser, SignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

// Wraps admin routes: forces Clerk sign-in, then verifies the signed-in email
// is on the admin allow-list (also enforced server-side).
export default function AdminGuard({ children }) {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!key) return <MissingClerk />;

  return (
    <>
      <SignedIn>
        <AdminOnly>{children}</AdminOnly>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-brand-radial p-6">
          <div className="w-full max-w-md">
            <SignIn routing="path" path="/admin/sign-in" signUpUrl="/admin/sign-in" fallbackRedirectUrl="/admin" />
          </div>
        </div>
      </SignedOut>
    </>
  );
}

function AdminOnly({ children }) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <Loader label="Checking admin access…" />;

  const emails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  // Client-side gate is informational — the server always re-checks.
  // If VITE_ADMIN_EMAILS is not set on the client, we let it pass and defer
  // the decision to the API (which reads ADMIN_EMAILS on the server).
  if (emails.length && userEmail && !emails.includes(userEmail)) {
    return <Forbidden email={userEmail} />;
  }
  return children;
}

function MissingClerk() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-radial text-white p-6">
      <div className="max-w-lg glass p-8 text-brand-900">
        <ShieldAlert className="w-8 h-8 text-brand-700 mb-3" />
        <h2 className="h-section mb-3">Admin is not configured yet</h2>
        <p className="text-slate-700 mb-4">
          Set <code className="bg-brand-50 px-1.5 py-0.5 rounded">VITE_CLERK_PUBLISHABLE_KEY</code>{' '}
          and <code className="bg-brand-50 px-1.5 py-0.5 rounded">CLERK_SECRET_KEY</code> in your
          environment (see <code>.env.example</code>), then redeploy.
        </p>
      </div>
    </div>
  );
}

function Forbidden({ email }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-radial text-white p-6">
      <div className="max-w-lg glass p-8 text-brand-900">
        <ShieldAlert className="w-8 h-8 text-red-600 mb-3" />
        <h2 className="h-section mb-2">Not authorized</h2>
        <p className="text-slate-700">
          <strong>{email}</strong> is signed in, but this account isn't on the admin allow-list.
          Ask an existing admin to add it to <code>ADMIN_EMAILS</code>.
        </p>
      </div>
    </div>
  );
}

function Loader({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin mx-auto mb-3" />
        <p className="text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// Convenience hook — returns a getToken() suitable for API calls.
export function useAuthedToken() {
  const { getToken } = useAuth();
  return () => getToken();
}
