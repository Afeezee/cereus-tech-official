import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Newspaper, MessageSquareQuote, Briefcase, Inbox, ArrowRight } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { api, admin } from '@/lib/api';
import { PageHeader } from './_ui';

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    products: 0, insights: 0, testimonials: 0, careers: 0, submissions: 0,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      try {
        const [p, i, t, c, s] = await Promise.all([
          api.products.list(),
          api.insights.list(),
          admin.testimonials.listAll(token).catch(() => ({ items: [] })),
          admin.careers.listAll(token).catch(() => ({ items: [] })),
          admin.submissions.list('', token).catch(() => ({ items: [] })),
        ]);
        setStats({
          products: p.items?.length || 0,
          insights: i.items?.length || 0,
          testimonials: t.items?.length || 0,
          careers: c.items?.length || 0,
          submissions: s.items?.length || 0,
        });
        setRecent((s.items || []).slice(0, 6));
      } catch {}
    })();
  }, [getToken]);

  const cards = [
    { icon: Package, label: 'Products', value: stats.products, href: '/admin/products', tint: 'bg-brand-50 text-brand-700' },
    { icon: Newspaper, label: 'Insights', value: stats.insights, href: '/admin/insights', tint: 'bg-indigo-50 text-indigo-700' },
    { icon: MessageSquareQuote, label: 'Testimonials', value: stats.testimonials, href: '/admin/testimonials', tint: 'bg-rose-50 text-rose-700' },
    { icon: Briefcase, label: 'Open roles', value: stats.careers, href: '/admin/careers', tint: 'bg-leaf-50 text-leaf-700' },
    { icon: Inbox, label: 'Submissions', value: stats.submissions, href: '/admin/submissions', tint: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="An at-a-glance view of your content and inbox."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.href}>
            <Card className="hover:shadow-glow transition-all border border-slate-200">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-lg ${c.tint} flex items-center justify-center mb-3`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-display font-bold text-brand-900">{c.value}</div>
                <div className="text-sm text-slate-500">{c.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xl font-bold text-brand-900">Recent submissions</h2>
          <Link to="/admin/submissions" className="text-sm text-brand-700 hover:text-brand-900 inline-flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <Card className="border border-slate-200">
          <CardContent className="p-0 divide-y divide-slate-100">
            {recent.length === 0 ? (
              <div className="p-6 text-slate-500 text-sm">Nothing yet — form submissions from the public site will appear here.</div>
            ) : recent.map((s) => (
              <div key={s.id} className="p-4 flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 rounded px-2 py-0.5">
                  {s.kind}
                </span>
                <span className="text-sm text-slate-700 truncate flex-1">
                  {s.payload?.name || s.payload?.full_name || s.payload?.email || '—'}
                </span>
                <span className="text-xs text-slate-400">{new Date(s.created_at).toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
