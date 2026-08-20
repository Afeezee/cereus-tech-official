import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Trash2, Loader2, Mail, Phone, Link as LinkIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { admin } from '@/lib/api';
import { PageHeader, EmptyBox } from './_ui';

const KINDS = [
  { key: '', label: 'All' },
  { key: 'contact', label: 'Contact' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'career', label: 'Career applications' },
  { key: 'student', label: 'Students' },
  { key: 'instructor', label: 'Instructors' },
];

export default function AdminSubmissions() {
  const { getToken } = useAuth();
  const [kind, setKind] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const r = await admin.submissions.list(kind, token);
      setItems(r.items || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [kind]);

  const remove = async (s) => {
    if (!confirm('Delete this submission?')) return;
    try {
      const token = await getToken();
      await admin.submissions.remove(s.kind, s.id, token);
      setItems((xs) => xs.filter((x) => x.id !== s.id));
      toast.success('Deleted');
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader title="Submissions" subtitle="Everything visitors have sent through the site's forms." />
      <Tabs value={kind} onValueChange={setKind}>
        <TabsList className="mb-6 flex-wrap">
          {KINDS.map((k) => <TabsTrigger key={k.key} value={k.key}>{k.label}</TabsTrigger>)}
        </TabsList>
        <TabsContent value={kind}>
          {loading ? (
            <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-700" /></div>
          ) : items.length ? (
            <div className="grid gap-3">
              {items.map((s) => (
                <SubmissionRow key={s.id} s={s} expanded={expanded[s.id]} onToggle={() => setExpanded((x) => ({ ...x, [s.id]: !x[s.id] }))} onDelete={() => remove(s)} />
              ))}
            </div>
          ) : (
            <EmptyBox title="No submissions here yet" body="They'll appear as visitors interact with your site." />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

function SubmissionRow({ s, expanded, onToggle, onDelete }) {
  const p = s.payload || {};
  const primary = p.name || p.full_name || p.email || 'Anonymous';
  const email = p.email;
  const phone = p.phone;
  return (
    <Card className="border border-slate-200">
      <CardContent className="p-0">
        <button className="w-full p-4 flex items-center gap-3 text-left" onClick={onToggle}>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          <Badge className="bg-brand-50 text-brand-800 hover:bg-brand-50 uppercase tracking-wider">{s.kind}</Badge>
          <span className="font-medium text-brand-900 truncate flex-1">{primary}</span>
          <span className="hidden md:inline text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</span>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 rounded hover:bg-red-50 text-red-600" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </button>
        {expanded && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-4 grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              {email && <ContactLine icon={Mail} value={email} href={`mailto:${email}`} />}
              {phone && <ContactLine icon={Phone} value={phone} href={`tel:${phone}`} />}
              {p.linkedin_profile && <ContactLine icon={LinkIcon} value="LinkedIn" href={p.linkedin_profile} />}
              {p.cv_url && <ContactLine icon={LinkIcon} value="CV / Resume" href={p.cv_url} />}
              {p.portfolio_url && <ContactLine icon={LinkIcon} value="Portfolio" href={p.portfolio_url} />}
            </div>
            <div className="md:col-span-2">
              <pre className="text-xs bg-white border border-slate-200 rounded p-3 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(p, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function ContactLine({ icon: Icon, value, href }) {
  return (
    <a href={href} className="flex items-center gap-2 text-sm text-brand-800 hover:text-brand-900" target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
      <Icon className="w-4 h-4" /> {value}
    </a>
  );
}
