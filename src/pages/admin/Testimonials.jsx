import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Pencil, Trash2, Loader2, Star, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { admin } from '@/lib/api';
import { PageHeader, EmptyBox, FormField } from './_ui';

const EMPTY = {
  author_name: '', quote: '', author_photo: '', location: '', role: '', company: '',
  featured: false, approved: true,
};

export default function AdminTestimonials() {
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
      const r = await admin.testimonials.listAll(token);
      setItems(r.items || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({}); setForm(EMPTY); };
  const openEdit = (p) => { setEditing(p); setForm({ ...EMPTY, ...p }); };
  const close = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      if (editing?.id) await admin.testimonials.update(editing.id, form, token);
      else await admin.testimonials.create(form, token);
      toast.success('Saved');
      close();
      await load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete testimonial from "${p.author_name}"?`)) return;
    try {
      const token = await getToken();
      await admin.testimonials.remove(p.id, token);
      toast.success('Deleted');
      setItems((xs) => xs.filter((x) => x.id !== p.id));
    } catch (e) { toast.error(e.message); }
  };

  const toggle = async (p, key) => {
    try {
      const token = await getToken();
      const updated = await admin.testimonials.update(p.id, { [key]: !p[key] }, token);
      setItems((xs) => xs.map((x) => (x.id === p.id ? updated : x)));
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader
        title="Testimonials"
        subtitle={`${items.length} testimonial${items.length === 1 ? '' : 's'}`}
        actions={<Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New</Button>}
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-700" /></div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <Card key={p.id} className="border border-slate-200">
              <CardContent className="p-4 flex items-start gap-4">
                {p.author_photo ? (
                  <img src={p.author_photo} alt={p.author_name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-semibold">
                    {p.author_name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-brand-900">{p.author_name}</p>
                  {(p.role || p.company) && <p className="text-xs text-slate-500">{[p.role, p.company].filter(Boolean).join(' · ')}</p>}
                  <p className="text-sm text-slate-700 mt-2 line-clamp-2">"{p.quote}"</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Button variant={p.featured ? 'default' : 'outline'} size="sm" onClick={() => toggle(p, 'featured')} className={p.featured ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-white' : 'border-amber-200 text-amber-700'}>
                    <Star className="w-3 h-3 mr-1" />{p.featured ? 'Featured' : 'Feature'}
                  </Button>
                  <Button variant={p.approved ? 'default' : 'outline'} size="sm" onClick={() => toggle(p, 'approved')} className={p.approved ? 'bg-leaf-600 hover:bg-leaf-700 text-white' : 'border-slate-200'}>
                    {p.approved ? <><Check className="w-3 h-3 mr-1" />Live</> : <><X className="w-3 h-3 mr-1" />Hidden</>}
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyBox title="No testimonials yet" body="Add quotes from happy clients." action={
          <Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New testimonial</Button>
        } />
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit testimonial' : 'New testimonial'}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <FormField label="Author name *"><Input required value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} /></FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Role"><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></FormField>
              <FormField label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
              <FormField label="Photo URL"><Input type="url" value={form.author_photo} onChange={(e) => setForm({ ...form, author_photo: e.target.value })} /></FormField>
            </div>
            <FormField label="Quote *"><Textarea required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></FormField>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-brand-900">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /> Featured on homepage
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-900">
                <Switch checked={form.approved} onCheckedChange={(v) => setForm({ ...form, approved: v })} /> Approved / visible
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand-800 hover:bg-brand-900">
                {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving…</> : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
