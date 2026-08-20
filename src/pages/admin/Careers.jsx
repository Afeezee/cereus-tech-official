import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Pencil, Trash2, Loader2, MapPin, Clock, Briefcase } from 'lucide-react';
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

const EMPTY = {
  title: '', department: '', location: '', type: 'Full-time',
  summary: '', responsibilities: '', requirements: '', active: true,
};

export default function AdminCareers() {
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
      const r = await admin.careers.listAll(token);
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
      responsibilities: (p.responsibilities || []).join('\n'),
      requirements: (p.requirements || []).join('\n'),
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
        responsibilities: String(form.responsibilities || '').split('\n').map((s) => s.trim()).filter(Boolean),
        requirements: String(form.requirements || '').split('\n').map((s) => s.trim()).filter(Boolean),
      };
      if (editing?.id) await admin.careers.update(editing.id, payload, token);
      else await admin.careers.create(payload, token);
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
      await admin.careers.remove(p.id, token);
      toast.success('Deleted');
      setItems((xs) => xs.filter((x) => x.id !== p.id));
    } catch (e) { toast.error(e.message); }
  };

  const toggleActive = async (p) => {
    try {
      const token = await getToken();
      const updated = await admin.careers.update(p.id, { active: !p.active }, token);
      setItems((xs) => xs.map((x) => x.id === p.id ? updated : x));
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader
        title="Careers"
        subtitle={`${items.length} position${items.length === 1 ? '' : 's'}`}
        actions={<Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New position</Button>}
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-700" /></div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <Card key={p.id} className="border border-slate-200">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-semibold text-brand-900">{p.title}</p>
                    {p.active
                      ? <Badge className="bg-leaf-100 text-leaf-800 hover:bg-leaf-100">Active</Badge>
                      : <Badge variant="outline" className="border-slate-200 text-slate-500">Inactive</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                    {p.department && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{p.department}</span>}
                    {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>}
                    {p.type && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.type}</span>}
                  </div>
                  {p.summary && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{p.summary}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(p)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyBox title="No open positions yet" body="Publish your first role to accept applications." action={
          <Button onClick={openNew} className="bg-brand-800 hover:bg-brand-900"><Plus className="w-4 h-4 mr-1" />New position</Button>
        } />
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit position' : 'New position'}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <FormField label="Title *"><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Department"><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></FormField>
              <FormField label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
              <FormField label="Type"><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Full-time / Part-time" /></FormField>
            </div>
            <FormField label="Summary"><Textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></FormField>
            <FormField label="Responsibilities" hint="One per line"><Textarea rows={6} value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} /></FormField>
            <FormField label="Requirements" hint="One per line"><Textarea rows={6} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></FormField>
            <label className="flex items-center gap-2 text-sm text-brand-900">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /> Active (visible on /careers)
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand-800 hover:bg-brand-900">
                {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving…</> : 'Save position'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
