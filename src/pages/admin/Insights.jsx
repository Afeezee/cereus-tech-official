import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Pencil, Trash2, Loader2, EyeOff, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { admin } from '@/lib/api';
import { PageHeader, EmptyBox, FormField } from './_ui';
import { formatDate } from '@/lib/utils';

const EMPTY = {
  slug: '', title: '', category: '', excerpt: '', content: '',
  featured_image: '', author: '', reading_time: '', tags: '', published: true,
  published_date: new Date().toISOString().slice(0, 10),
};

export default function AdminInsights() {
  const { getToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const r = await fetch('/api/insights?includeUnpublished=1', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      setItems(r.items || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({}); setForm(EMPTY); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...EMPTY, ...p,
      tags: (p.tags || []).join(', '),
      published_date: p.published_date ? p.published_date.slice(0, 10) : '',
    });
  };
  const close = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const payload = {
        ...form,
        tags: String(form.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
        reading_time: form.reading_time ? Number(form.reading_time) : null,
        published_date: form.published_date || null,
      };
      if (editing?.id) await admin.insights.update(editing.id, payload, token);
      else await admin.insights.create(payload, token);
      toast.success('Saved');
      close();
      await load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      const token = await getToken();
      await admin.insights.remove(p.id, token);
      toast.success('Deleted');
      setItems((xs) => xs.filter((x) => x.id !== p.id));
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader
        title="Insights"
        subtitle={`${items.length} article${items.length === 1 ? '' : 's'}`}
        actions={<Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New article</Button>}
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-700" /></div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <Card key={p.id} className="border border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-semibold text-brand-900 truncate">{p.title}</p>
                    {p.category && <Badge className="bg-brand-50 text-brand-800 hover:bg-brand-50">{p.category}</Badge>}
                    {!p.published && <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Draft</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    /{p.slug}{p.published_date && ` · ${formatDate(p.published_date)}`}{p.author && ` · ${p.author}`}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(p)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyBox title="No insights yet" body="Publish your first article to bring the /insights page to life." action={
          <Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New article</Button>
        } />
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit article' : 'New article'}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField label="Title *"><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
              </div>
              <FormField label="Slug" hint="Leave blank to auto-generate"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
              <FormField label="Author"><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></FormField>
              <FormField label="Reading time (min)"><Input type="number" value={form.reading_time} onChange={(e) => setForm({ ...form, reading_time: e.target.value })} /></FormField>
            </div>
            <FormField label="Featured image URL"><Input type="url" value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} /></FormField>
            <FormField label="Excerpt"><Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></FormField>
            <FormField label="Content (Markdown)"><Textarea rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="font-mono text-sm" /></FormField>
            <FormField label="Tags" hint="Comma-separated"><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Published date"><Input type="date" value={form.published_date || ''} onChange={(e) => setForm({ ...form, published_date: e.target.value })} /></FormField>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
                <div className="flex items-center gap-1 text-sm text-brand-900">
                  {form.published ? <><Eye className="w-4 h-4" /> Published</> : <><EyeOff className="w-4 h-4" /> Draft</>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand-800 hover:bg-brand-900">
                {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving…</> : 'Save article'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
