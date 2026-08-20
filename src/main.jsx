import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from '@/App.jsx';
import { SiteContentProvider } from '@/lib/site-content';
import '@/index.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

function Providers({ children }) {
  // If Clerk is not configured yet (fresh clone), still render the site — just no admin.
  const inner = (
    <QueryClientProvider client={queryClient}>
      <SiteContentProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </SiteContentProvider>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
  if (!publishableKey) return inner;
  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      {inner}
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
