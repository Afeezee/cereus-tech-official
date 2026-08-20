import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, admin } from '@/lib/api';
import { PageHeader, EmptyBox, FormField } from './_ui';

const EMPTY = {
  slug: '', name: '', category: '', status: 'Active', short_description: '',
  detailed_description: '', primary_benefit: '', demo_url: '', image_url: '',
  tags: '', features: '', use_cases: '', tech_stack: '', screenshot_urls: '',
  sort_order: 0,
};

export default function AdminProducts() {
  const { getToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.products.list();
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
      features: (p.features || []).join('\n'),
      use_cases: (p.use_cases || []).join('\n'),
      tech_stack: (p.tech_stack || []).join(', '),
      screenshot_urls: (p.screenshot_urls || []).join('\n'),
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
        tags: splitCsv(form.tags),
        features: splitLines(form.features),
        use_cases: splitLines(form.use_cases),
        tech_stack: splitCsv(form.tech_stack),
        screenshot_urls: splitLines(form.screenshot_urls),
        sort_order: Number(form.sort_order) || 0,
      };
      if (editing?.id) {
        await admin.products.update(editing.id, payload, token);
        toast.success('Product updated');
      } else {
        await admin.products.create(payload, token);
        toast.success('Product created');
      }
      close();
      await load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      const token = await getToken();
      await admin.products.remove(p.id, token);
      toast.success('Deleted');
      setItems((xs) => xs.filter((x) => x.id !== p.id));
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${items.length} product${items.length === 1 ? '' : 's'} in your catalog`}
        actions={<Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New product</Button>}
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-700" /></div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <Card key={p.id} className="border border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-brand-900 truncate">{p.name}</p>
                    {p.category && <Badge className="bg-brand-50 text-brand-800 hover:bg-brand-50">{p.category}</Badge>}
                    {p.status && <Badge variant="outline" className="border-slate-200 text-slate-600">{p.status}</Badge>}
                  </div>
                  <p className="text-sm text-slate-500 truncate">/{p.slug}</p>
                </div>
                {p.demo_url && (
                  <a href={p.demo_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" title="Open demo"><ExternalLink className="w-4 h-4" /></Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(p)} title="Delete" className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyBox
          title="No products yet"
          body="Create your first product to see it on the site."
          action={<Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New product</Button>}
        />
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit product' : 'New product'}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Name *"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
              <FormField label="Slug" hint="Leave blank to auto-generate from name"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Health, Education, Environment…" /></FormField>
              <FormField label="Status">
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="In Development">In development</SelectItem>
                    <SelectItem value="Coming Soon">Coming soon</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Sort order"><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></FormField>
            </div>
            <FormField label="Short description"><Textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></FormField>
            <FormField label="Primary benefit"><Input value={form.primary_benefit} onChange={(e) => setForm({ ...form, primary_benefit: e.target.value })} /></FormField>
            <FormField label="Detailed description"><Textarea rows={5} value={form.detailed_description} onChange={(e) => setForm({ ...form, detailed_description: e.target.value })} /></FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Demo URL"><Input type="url" value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} /></FormField>
              <FormField label="Image URL"><Input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></FormField>
            </div>
            <FormField label="Tags" hint="Comma-separated"><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></FormField>
            <FormField label="Tech stack" hint="Comma-separated"><Input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} /></FormField>
            <FormField label="Features" hint="One per line"><Textarea rows={4} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></FormField>
            <FormField label="Use cases" hint="One per line"><Textarea rows={4} value={form.use_cases} onChange={(e) => setForm({ ...form, use_cases: e.target.value })} /></FormField>
            <FormField label="Screenshot URLs" hint="One per line"><Textarea rows={3} value={form.screenshot_urls} onChange={(e) => setForm({ ...form, screenshot_urls: e.target.value })} /></FormField>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand-800 hover:bg-brand-900">
                {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving…</> : 'Save product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function splitCsv(s) { return String(s || '').split(',').map((x) => x.trim()).filter(Boolean); }
function splitLines(s) { return String(s || '').split('\n').map((x) => x.trim()).filter(Boolean); }
