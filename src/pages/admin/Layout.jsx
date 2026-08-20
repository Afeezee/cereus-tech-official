import { NavLink, Outlet, Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import {
  LayoutDashboard, Package, Newspaper, MessageSquareQuote, Briefcase,
  Settings2, Inbox, ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/insights', label: 'Insights', icon: Newspaper },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/careers', label: 'Careers', icon: Briefcase },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { to: '/admin/site', label: 'Site content', icon: Settings2 },
];

export default function AdminLayout() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 w-64 bg-brand-radial text-white hidden md:flex md:flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block w-9 h-9 rounded-xl bg-white/10 backdrop-blur border border-white/20" />
            <div className="leading-tight">
              <p className="font-display font-bold">Cereus</p>
              <p className="text-[11px] text-white/60 uppercase tracking-wider">Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5"
          >
            View live site
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      <div className="md:ml-64">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <MobileMenu />
            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-brand-900">{user?.fullName || user?.username || 'Admin'}</p>
                <p className="text-xs text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MobileMenu() {
  return (
    <details className="md:hidden">
      <summary className="cursor-pointer list-none w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center">
        <LayoutDashboard className="w-4 h-4 text-brand-900" />
      </summary>
      <div className="absolute left-4 top-16 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-40">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                isActive ? 'bg-brand-50 text-brand-900' : 'text-slate-700 hover:bg-slate-50')
            }
          >
            <Icon className="w-4 h-4" /> {label}
          </NavLink>
        ))}
      </div>
    </details>
  );
}
