import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Hero from '@/components/common/Hero';
import { useSiteContent } from '@/lib/site-content';
import { api } from '@/lib/api';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

const EMPTY = {
  name: '', email: '', phone: '', company: '', enquiry_about: '', message: '',
};

export default function Contact() {
  const { content } = useSiteContent();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submissions.contact(form);
      setDone(true);
      setForm(EMPTY);
      toast.success('Message sent — we will reply within 24 hours.');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const contact = content.contact || {};

  return (
    <>
      <Hero
        eyebrow="Get in touch"
        title="Let's talk about your project."
        subtitle="We reply to every message within one business day. Book a discovery call, ask a technical question, or explore a partnership."
      />

      <section className="section bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <motion.aside {...revealOnce} variants={stagger()} className="space-y-6 lg:sticky lg:top-24 self-start">
            <motion.div variants={fadeUp}>
              <Card className="border border-slate-200">
                <CardHeader><CardTitle className="text-brand-900">Contact information</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <Row icon={Phone} label="Phone" value={contact.phone} />
                  <Row icon={Mail} label="Email" value={contact.email} />
                  <Row icon={MapPin} label="Location" value={contact.address} />
                  <Row icon={Clock} label="Hours" value={contact.hours} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border border-leaf-200 bg-leaf-50">
                <CardContent className="pt-6">
                  <h3 className="font-display font-semibold text-leaf-900">Quick response</h3>
                  <p className="text-sm text-leaf-800 mt-2">
                    We typically respond within 24 hours on business days.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.aside>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 shadow-card">
              <CardHeader><CardTitle className="text-brand-900">Send us a message</CardTitle></CardHeader>
              <CardContent>
                {done ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-leaf-500 mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold text-brand-900 mb-2">Message sent!</h3>
                    <p className="text-slate-600 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                    <Button variant="outline" onClick={() => setDone(false)}>Send another</Button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Full name *"><Input required value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
                      <Field label="Email *"><Input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Phone"><Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
                      <Field label="Company"><Input value={form.company} onChange={(e) => set('company', e.target.value)} /></Field>
                    </div>
                    <Field label="Enquiry about">
                      <Select value={form.enquiry_about} onValueChange={(v) => set('enquiry_about', v)}>
                        <SelectTrigger><SelectValue placeholder="Pick a topic" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Inquiry">General inquiry</SelectItem>
                          <SelectItem value="Product Demo">Product demo</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Support">Technical support</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Message *">
                      <Textarea required rows={6} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us about your project or inquiry…" />
                    </Field>
                    <Button size="lg" type="submit" disabled={loading} className="w-full bg-brand-800 hover:bg-brand-900">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : <><Send className="w-4 h-4 mr-2" />Send message</>}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-medium text-brand-900 text-sm">{label}</p>
        <p className="text-slate-600 text-sm">{value}</p>
      </div>
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
