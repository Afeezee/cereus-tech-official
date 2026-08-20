import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Loader2, Save, Plus, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api, admin } from '@/lib/api';
import { DEFAULT_SITE_CONTENT, useSiteContent } from '@/lib/site-content';
import { PageHeader, FormField } from './_ui';

export default function AdminSiteContent() {
  const { getToken } = useAuth();
  const { refresh } = useSiteContent();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.siteContent.get()
      .then((d) => setData({ ...DEFAULT_SITE_CONTENT, ...(d || {}) }))
      .catch(() => setData(DEFAULT_SITE_CONTENT))
      .finally(() => setLoading(false));
  }, []);

  const set = (path, value) => {
    setData((d) => setDeep(structuredClone(d), path, value));
  };

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      await admin.siteContent.update(data, token);
      toast.success('Site content updated');
      refresh();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const reset = () => {
    if (confirm('Reset to default content? This will discard your current edits until you save.')) {
      setData(structuredClone(DEFAULT_SITE_CONTENT));
    }
  };

  if (loading || !data) return <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-700" /></div>;

  return (
    <>
      <PageHeader
        title="Site content"
        subtitle="Everything on the public site that isn't a database record — hero, stats, contact info, navigation, footer."
        actions={
          <>
            <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" />Reset to default</Button>
            <Button onClick={save} disabled={saving} className="bg-brand-800 hover:bg-brand-900">
              {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving…</> : <><Save className="w-4 h-4 mr-1" />Save changes</>}
            </Button>
          </>
        }
      />

      <Tabs defaultValue="brand">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="nav">Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Brand */}
        <TabsContent value="brand">
          <Card><CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Brand name"><Input value={data.brand?.name || ''} onChange={(e) => set('brand.name', e.target.value)} /></FormField>
            <FormField label="Tagline"><Input value={data.brand?.tagline || ''} onChange={(e) => set('brand.tagline', e.target.value)} /></FormField>
          </CardContent></Card>
        </TabsContent>

        {/* Hero */}
        <TabsContent value="hero">
          <Card><CardContent className="p-6 space-y-4">
            <FormField label="Eyebrow (small tag above headline)"><Input value={data.hero?.eyebrow || ''} onChange={(e) => set('hero.eyebrow', e.target.value)} /></FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Title — line 1"><Input value={data.hero?.title_line_1 || ''} onChange={(e) => set('hero.title_line_1', e.target.value)} /></FormField>
              <FormField label="Title — line 2 (gradient)"><Input value={data.hero?.title_line_2 || ''} onChange={(e) => set('hero.title_line_2', e.target.value)} /></FormField>
            </div>
            <FormField label="Subtitle"><Textarea rows={3} value={data.hero?.subtitle || ''} onChange={(e) => set('hero.subtitle', e.target.value)} /></FormField>
            <FormField label="Background image URL"><Input type="url" value={data.hero?.background_image || ''} onChange={(e) => set('hero.background_image', e.target.value)} /></FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Primary CTA — label"><Input value={data.hero?.cta_primary?.label || ''} onChange={(e) => set('hero.cta_primary.label', e.target.value)} /></FormField>
              <FormField label="Primary CTA — link"><Input value={data.hero?.cta_primary?.href || ''} onChange={(e) => set('hero.cta_primary.href', e.target.value)} /></FormField>
              <FormField label="Secondary CTA — label"><Input value={data.hero?.cta_secondary?.label || ''} onChange={(e) => set('hero.cta_secondary.label', e.target.value)} /></FormField>
              <FormField label="Secondary CTA — link"><Input value={data.hero?.cta_secondary?.href || ''} onChange={(e) => set('hero.cta_secondary.href', e.target.value)} /></FormField>
            </div>
          </CardContent></Card>
        </TabsContent>

        {/* Stats */}
        <TabsContent value="stats">
          <Card><CardContent className="p-6">
            <ArrayEditor
              items={data.stats || []}
              onChange={(v) => set('stats', v)}
              newItem={() => ({ value: '', label: '' })}
              renderRow={(item, i, onEdit) => (
                <div className="grid grid-cols-2 gap-3">
                  <Input value={item.value} onChange={(e) => onEdit({ ...item, value: e.target.value })} placeholder="e.g. 50+" />
                  <Input value={item.label} onChange={(e) => onEdit({ ...item, label: e.target.value })} placeholder="e.g. Projects delivered" />
                </div>
              )}
            />
          </CardContent></Card>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact">
          <Card><CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Phone"><Input value={data.contact?.phone || ''} onChange={(e) => set('contact.phone', e.target.value)} /></FormField>
            <FormField label="Email"><Input type="email" value={data.contact?.email || ''} onChange={(e) => set('contact.email', e.target.value)} /></FormField>
            <FormField label="Address"><Input value={data.contact?.address || ''} onChange={(e) => set('contact.address', e.target.value)} /></FormField>
            <FormField label="Business hours"><Input value={data.contact?.hours || ''} onChange={(e) => set('contact.hours', e.target.value)} /></FormField>
          </CardContent></Card>
        </TabsContent>

        {/* Social */}
        <TabsContent value="social">
          <Card><CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="LinkedIn URL"><Input value={data.social?.linkedin || ''} onChange={(e) => set('social.linkedin', e.target.value)} /></FormField>
            <FormField label="Twitter / X URL"><Input value={data.social?.twitter || ''} onChange={(e) => set('social.twitter', e.target.value)} /></FormField>
            <FormField label="GitHub URL"><Input value={data.social?.github || ''} onChange={(e) => set('social.github', e.target.value)} /></FormField>
          </CardContent></Card>
        </TabsContent>

        {/* Nav */}
        <TabsContent value="nav">
          <Card><CardContent className="p-6">
            <ArrayEditor
              items={data.nav || []}
              onChange={(v) => set('nav', v)}
              newItem={() => ({ label: '', href: '/' })}
              renderRow={(item, i, onEdit) => (
                <div className="grid grid-cols-2 gap-3">
                  <Input value={item.label} onChange={(e) => onEdit({ ...item, label: e.target.value })} placeholder="Label" />
                  <Input value={item.href} onChange={(e) => onEdit({ ...item, href: e.target.value })} placeholder="/path" />
                </div>
              )}
            />
          </CardContent></Card>
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer">
          <Card><CardContent className="p-6 space-y-6">
            <FormField label="Footer tagline"><Textarea rows={2} value={data.footer?.tagline || ''} onChange={(e) => set('footer.tagline', e.target.value)} /></FormField>
            <FormField label="Copyright line" hint="Use {year} to auto-insert the current year"><Input value={data.footer?.copyright || ''} onChange={(e) => set('footer.copyright', e.target.value)} /></FormField>

            <div>
              <h3 className="font-display font-semibold text-brand-900 mb-2">Footer columns</h3>
              <ArrayEditor
                items={data.footer?.columns || []}
                onChange={(v) => set('footer.columns', v)}
                newItem={() => ({ heading: '', links: [] })}
                renderRow={(col, i, onEdit) => (
                  <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
                    <Input value={col.heading} onChange={(e) => onEdit({ ...col, heading: e.target.value })} placeholder="Column heading" />
                    <ArrayEditor
                      items={col.links || []}
                      onChange={(links) => onEdit({ ...col, links })}
                      newItem={() => ({ label: '', href: '/' })}
                      renderRow={(link, li, onEditLink) => (
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={link.label} onChange={(e) => onEditLink({ ...link, label: e.target.value })} placeholder="Link label" />
                          <Input value={link.href} onChange={(e) => onEditLink({ ...link, href: e.target.value })} placeholder="/path or https://…" />
                        </div>
                      )}
                    />
                  </div>
                )}
              />
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

// Editor for an array of homogeneous items. `renderRow` gets (item, index, onEdit).
function ArrayEditor({ items, onChange, renderRow, newItem }) {
  const set = (i, next) => onChange(items.map((x, idx) => (idx === i ? next : x)));
  const add = () => onChange([...(items || []), newItem()]);
  const rm = (i) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="flex-1">{renderRow(item, i, (v) => set(i, v))}</div>
          <div className="flex flex-col gap-1">
            <button type="button" onClick={() => move(i, -1)} className="text-xs text-slate-500 hover:text-brand-800 px-2">▲</button>
            <button type="button" onClick={() => move(i, +1)} className="text-xs text-slate-500 hover:text-brand-800 px-2">▼</button>
            <button type="button" onClick={() => rm(i)} className="text-red-600 hover:text-red-700 px-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={add} className="border-dashed">
        <Plus className="w-4 h-4 mr-1" /> Add
      </Button>
    </div>
  );
}

// setDeep('a.b.c', v) — mutates and returns the object
function setDeep(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}
