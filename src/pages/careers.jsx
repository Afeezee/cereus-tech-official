import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Briefcase, Heart, Zap, Target, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Hero from '@/components/common/Hero';
import { api } from '@/lib/api';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

const WHY = [
  { icon: Heart, title: 'Great culture', body: 'Collaborative environment where innovation and creativity thrive.', tint: 'bg-brand-50 text-brand-700' },
  { icon: Zap, title: 'Growth opportunities', body: 'Continuous learning and career development programs.', tint: 'bg-leaf-50 text-leaf-700' },
  { icon: Target, title: 'Meaningful work', body: 'Build solutions that positively impact communities.', tint: 'bg-rose-50 text-rose-700' },
];

const EMPTY = { name: '', email: '', phone: '', role_applying_for: '', linkedin_profile: '', cv_url: '', cover_note: '' };

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.careers.list().then((r) => setJobs(r.items || r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const apply = (job) => {
    setSelectedJob(job);
    setForm({ ...EMPTY, role_applying_for: job?.title || '' });
    setShowForm(true);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submissions.career({ ...form, consent_given: true });
      setDone(true);
      toast.success('Application received.');
      setTimeout(() => { setShowForm(false); setDone(false); setForm(EMPTY); }, 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Hero
        eyebrow="Careers"
        title="Ship things that matter."
        subtitle="Join a dynamic team building innovative technology for African markets — remote-friendly, mission-driven."
      />

      {/* Why join */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow">Why work with us</p>
            <h2 className="h-section mt-3">More than a job — a mission.</h2>
          </div>
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY.map(({ icon: Icon, title, body, tint }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="h-full lift text-center border border-slate-200">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${tint} flex items-center justify-center mb-5`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-brand-900 mb-2">{title}</h3>
                    <p className="text-slate-600">{body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roles */}
      <section className="section bg-slate-50/60">
        <div className="container-page">
          <div className="mb-10">
            <p className="eyebrow">Open positions</p>
            <h2 className="h-section mt-3">Roles we're hiring for.</h2>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-500">Loading positions…</div>
          ) : jobs.length ? (
            <div className="space-y-5">
              {jobs.map((job) => (
                <Card key={job.id} className="border border-slate-200 lift">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl text-brand-900">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                          {job.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
                          {job.type && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>}
                          {job.department && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>}
                        </div>
                      </div>
                      <Button onClick={() => apply(job)} className="bg-brand-800 hover:bg-brand-900 text-white">Apply now</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-slate-700">
                    {job.summary && <p className="mb-4">{job.summary}</p>}
                    {job.responsibilities?.length > 0 && (
                      <Details title="Responsibilities" items={job.responsibilities} />
                    )}
                    {job.requirements?.length > 0 && (
                      <Details title="Requirements" items={job.requirements} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-dashed border-slate-200">
              <CardContent className="py-14 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-brand-900 mb-2">No open positions right now</h3>
                <p className="text-slate-500 mb-6">We're always excited to meet great people. Send us your resume for future roles.</p>
                <Button onClick={() => apply(null)} className="bg-brand-800 hover:bg-brand-900">Send us your resume</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Application dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob ? `Apply for ${selectedJob.title}` : 'Submit your application'}</DialogTitle>
          </DialogHeader>

          {done ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-leaf-500 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-brand-900 mb-2">Application submitted!</h3>
              <p className="text-slate-600">Thank you — we'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full name *"><Input required value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
                <Field label="Email *"><Input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Phone *"><Input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
                <Field label="LinkedIn"><Input type="url" value={form.linkedin_profile} onChange={(e) => set('linkedin_profile', e.target.value)} placeholder="https://linkedin.com/in/…" /></Field>
              </div>
              <Field label="Position applying for *"><Input required value={form.role_applying_for} onChange={(e) => set('role_applying_for', e.target.value)} /></Field>
              <Field label="CV / resume URL"><Input type="url" value={form.cv_url} onChange={(e) => set('cv_url', e.target.value)} placeholder="Paste a Google Drive / Dropbox link" /></Field>
              <Field label="Cover note *">
                <Textarea required rows={5} value={form.cover_note} onChange={(e) => set('cover_note', e.target.value)} placeholder="Tell us why you'd be a great fit…" />
              </Field>
              <Button type="submit" className="w-full bg-brand-800 hover:bg-brand-900" disabled={submitting}>
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</> : <><Send className="w-4 h-4 mr-2" />Submit application</>}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Details({ title, items }) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold text-brand-900 mb-2">{title}</h4>
      <ul className="list-disc list-inside space-y-1 text-slate-600">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-900 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
