import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Award, Globe, TrendingUp, Users, Code, Brain, Smartphone, Database,
  Shield, Cloud, Palette, CheckCircle, Send, Loader2, Target, Zap, Brush, Film, Phone, Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Hero from '@/components/common/Hero';
import { useSiteContent } from '@/lib/site-content';
import { api } from '@/lib/api';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

const COURSES = [
  { icon: Brain, name: 'Artificial Intelligence', tint: 'from-purple-500 to-pink-500' },
  { icon: Code, name: 'Web Development', tint: 'from-blue-500 to-cyan-500' },
  { icon: Smartphone, name: 'Mobile Development', tint: 'from-green-500 to-teal-500' },
  { icon: Database, name: 'Data Analytics', tint: 'from-orange-500 to-red-500' },
  { icon: Database, name: 'Data Science', tint: 'from-indigo-500 to-purple-500' },
  { icon: Shield, name: 'Cybersecurity', tint: 'from-red-500 to-pink-500' },
  { icon: Cloud, name: 'Cloud Computing', tint: 'from-cyan-500 to-blue-500' },
  { icon: Palette, name: 'UI/UX Design', tint: 'from-pink-500 to-rose-500' },
  { icon: Brush, name: 'Graphics Design', tint: 'from-yellow-500 to-orange-500' },
  { icon: Film, name: 'Animation & Video', tint: 'from-purple-600 to-indigo-600' },
  { icon: CheckCircle, name: 'Quality Assurance', tint: 'from-emerald-500 to-green-500' },
  { icon: Code, name: 'DevOps', tint: 'from-violet-500 to-purple-500' },
  { icon: Target, name: 'Project Management', tint: 'from-amber-500 to-orange-500' },
  { icon: Zap, name: 'Robotics & Automation', tint: 'from-teal-500 to-cyan-500' },
];

const BENEFITS = [
  { icon: Award, title: 'Globally recognised certificates', body: 'Industry-standard credentials accepted internationally.' },
  { icon: Users, title: 'Expert instructors', body: 'Seasoned professionals with real-world experience.' },
  { icon: Globe, title: 'International opportunities', body: 'Skills that unlock global remote and on-site markets.' },
  { icon: TrendingUp, title: 'Career advancement', body: 'A strong foundation for growth in the digital economy.' },
];

const S_EMPTY = { full_name: '', email: '', phone: '', age: '', location: '', education_level: '', courses_interested: [], experience_level: 'Beginner', learning_goals: '', how_heard: '' };
const I_EMPTY = { full_name: '', email: '', phone: '', location: '', expertise_areas: [], years_experience: '', qualifications: '', linkedin_profile: '', portfolio_url: '', teaching_experience: '', why_teach: '', availability: '', cv_url: '' };

export default function Academy() {
  const { content } = useSiteContent();
  const [tab, setTab] = useState('student');
  const [student, setStudent] = useState(S_EMPTY);
  const [instructor, setInstructor] = useState(I_EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggleCourse = (name) => {
    if (tab === 'student') {
      setStudent((s) => ({ ...s, courses_interested: s.courses_interested.includes(name) ? s.courses_interested.filter(c => c !== name) : [...s.courses_interested, name] }));
    } else {
      setInstructor((s) => ({ ...s, expertise_areas: s.expertise_areas.includes(name) ? s.expertise_areas.filter(c => c !== name) : [...s.expertise_areas, name] }));
    }
  };

  const submitStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submissions.student(student);
      setDone(true);
      setStudent(S_EMPTY);
      toast.success('Registration submitted');
      setTimeout(() => setDone(false), 4000);
    } catch (err) { toast.error(err.message || 'Failed to submit'); }
    finally { setLoading(false); }
  };
  const submitInstructor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submissions.instructor(instructor);
      setDone(true);
      setInstructor(I_EMPTY);
      toast.success('Application submitted');
      setTimeout(() => setDone(false), 4000);
    } catch (err) { toast.error(err.message || 'Failed to submit'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Hero
        eyebrow="Cereus Academy"
        title="Train for the tech careers of tomorrow."
        subtitle="Empowering the next generation of technology professionals with world-class training and globally recognised certifications."
      >
        <Button size="lg" className="bg-white text-brand-900 hover:bg-white/90 font-semibold" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}>
          Enrol as a student
        </Button>
        <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10" onClick={() => { setTab('instructor'); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}>
          Become an instructor
        </Button>
      </Hero>

      {/* Benefits */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow">Why Cereus Academy</p>
            <h2 className="h-section mt-3">World-class training, African context.</h2>
          </div>
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="h-full lift text-center border border-slate-200">
                  <CardContent className="pt-8">
                    <div className="w-14 h-14 rounded-2xl mx-auto bg-brand-gradient text-white flex items-center justify-center mb-4 shadow-glow">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display font-semibold text-brand-900">{title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses */}
      <section className="section bg-slate-50/60">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow">Programs</p>
            <h2 className="h-section mt-3">Pick your path.</h2>
          </div>
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {COURSES.map(({ icon: Icon, name, tint }) => (
              <motion.div key={name} variants={fadeUp}>
                <Card className="group h-full lift text-center border border-slate-200 cursor-pointer" onClick={() => { toggleCourse(name); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <CardContent className="pt-6 pb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tint} text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-brand-900 text-sm group-hover:text-brand-700 transition-colors">{name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="section bg-white">
        <div className="container-page max-w-4xl">
          <div className="text-center mb-10">
            <p className="eyebrow">Get started</p>
            <h2 className="h-section mt-3">Register in a few minutes.</h2>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="student">Student registration</TabsTrigger>
              <TabsTrigger value="instructor">Instructor application</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border border-slate-200 shadow-card">
                <CardHeader><CardTitle className="text-brand-900">Student registration</CardTitle></CardHeader>
                <CardContent>
                  {done ? <Done label="Registration submitted!" /> : (
                    <form onSubmit={submitStudent} className="space-y-5">
                      <Row><Field label="Full name *"><Input required value={student.full_name} onChange={(e) => setStudent({ ...student, full_name: e.target.value })} /></Field>
                           <Field label="Email *"><Input required type="email" value={student.email} onChange={(e) => setStudent({ ...student, email: e.target.value })} /></Field></Row>
                      <Row><Field label="Phone *"><Input required type="tel" value={student.phone} onChange={(e) => setStudent({ ...student, phone: e.target.value })} /></Field>
                           <Field label="Age"><Input type="number" value={student.age} onChange={(e) => setStudent({ ...student, age: e.target.value })} /></Field></Row>
                      <Row><Field label="Location"><Input value={student.location} onChange={(e) => setStudent({ ...student, location: e.target.value })} placeholder="City, Country" /></Field>
                           <Field label="Education level">
                              <Select value={student.education_level} onValueChange={(v) => setStudent({ ...student, education_level: v })}>
                                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High School">High School</SelectItem>
                                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                  <SelectItem value="Graduate">Graduate</SelectItem>
                                  <SelectItem value="Professional">Professional</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field></Row>
                      <Field label="Courses interested in *">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {COURSES.map((c) => (
                            <button key={c.name} type="button" onClick={() => toggleCourse(c.name)}
                              className={`text-left text-sm rounded-lg border px-3 py-2 transition-all ${student.courses_interested.includes(c.name) ? 'bg-brand-800 border-brand-800 text-white' : 'border-slate-200 hover:border-brand-300 text-slate-700'}`}>
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Experience level">
                        <Select value={student.experience_level} onValueChange={(v) => setStudent({ ...student, experience_level: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Learning goals *">
                        <Textarea required rows={4} value={student.learning_goals} onChange={(e) => setStudent({ ...student, learning_goals: e.target.value })} placeholder="What do you hope to achieve?" />
                      </Field>
                      <Field label="How did you hear about us?"><Input value={student.how_heard} onChange={(e) => setStudent({ ...student, how_heard: e.target.value })} /></Field>
                      <Button type="submit" className="w-full bg-brand-800 hover:bg-brand-900" disabled={loading}>
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</> : <><Send className="w-4 h-4 mr-2" />Submit application</>}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor">
              <Card className="border border-slate-200 shadow-card">
                <CardHeader><CardTitle className="text-brand-900">Instructor application</CardTitle></CardHeader>
                <CardContent>
                  {done ? <Done label="Application submitted!" /> : (
                    <form onSubmit={submitInstructor} className="space-y-5">
                      <Row><Field label="Full name *"><Input required value={instructor.full_name} onChange={(e) => setInstructor({ ...instructor, full_name: e.target.value })} /></Field>
                           <Field label="Email *"><Input required type="email" value={instructor.email} onChange={(e) => setInstructor({ ...instructor, email: e.target.value })} /></Field></Row>
                      <Row><Field label="Phone *"><Input required type="tel" value={instructor.phone} onChange={(e) => setInstructor({ ...instructor, phone: e.target.value })} /></Field>
                           <Field label="Location *"><Input required value={instructor.location} onChange={(e) => setInstructor({ ...instructor, location: e.target.value })} placeholder="City, Country" /></Field></Row>
                      <Field label="Areas of expertise *">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {COURSES.map((c) => (
                            <button key={c.name} type="button" onClick={() => toggleCourse(c.name)}
                              className={`text-left text-sm rounded-lg border px-3 py-2 transition-all ${instructor.expertise_areas.includes(c.name) ? 'bg-brand-800 border-brand-800 text-white' : 'border-slate-200 hover:border-brand-300 text-slate-700'}`}>
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Row><Field label="Years of experience *"><Input required type="number" value={instructor.years_experience} onChange={(e) => setInstructor({ ...instructor, years_experience: e.target.value })} /></Field>
                           <Field label="Availability">
                              <Select value={instructor.availability} onValueChange={(v) => setInstructor({ ...instructor, availability: v })}>
                                <SelectTrigger><SelectValue placeholder="Availability" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Full-time">Full-time</SelectItem>
                                  <SelectItem value="Part-time">Part-time</SelectItem>
                                  <SelectItem value="Weekends">Weekends</SelectItem>
                                  <SelectItem value="Flexible">Flexible</SelectItem>
                                </SelectContent>
                              </Select>
                           </Field></Row>
                      <Field label="Qualifications *">
                        <Textarea required rows={3} value={instructor.qualifications} onChange={(e) => setInstructor({ ...instructor, qualifications: e.target.value })} placeholder="List your educational qualifications and certifications…" />
                      </Field>
                      <Row><Field label="LinkedIn profile"><Input type="url" value={instructor.linkedin_profile} onChange={(e) => setInstructor({ ...instructor, linkedin_profile: e.target.value })} placeholder="https://linkedin.com/in/…" /></Field>
                           <Field label="Portfolio / website"><Input type="url" value={instructor.portfolio_url} onChange={(e) => setInstructor({ ...instructor, portfolio_url: e.target.value })} placeholder="https://…" /></Field></Row>
                      <Field label="Teaching experience">
                        <Textarea rows={3} value={instructor.teaching_experience} onChange={(e) => setInstructor({ ...instructor, teaching_experience: e.target.value })} placeholder="Describe your previous teaching experience…" />
                      </Field>
                      <Field label="Why teach at Cereus Academy? *">
                        <Textarea required rows={4} value={instructor.why_teach} onChange={(e) => setInstructor({ ...instructor, why_teach: e.target.value })} placeholder="Your motivation…" />
                      </Field>
                      <Field label="CV / resume URL"><Input type="url" value={instructor.cv_url} onChange={(e) => setInstructor({ ...instructor, cv_url: e.target.value })} placeholder="Paste a Google Drive / Dropbox link" /></Field>
                      <Button type="submit" className="w-full bg-brand-800 hover:bg-brand-900" disabled={loading}>
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</> : <><Send className="w-4 h-4 mr-2" />Submit application</>}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-radial text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="container-page relative py-20 text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold">Have questions?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">Our admissions team is here to help you get started.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {content.contact?.phone && (
              <a href={`tel:${content.contact.phone}`}>
                <Button variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-2" />{content.contact.phone}
                </Button>
              </a>
            )}
            {content.contact?.email && (
              <a href={`mailto:${content.contact.email}`}>
                <Button variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10">
                  <Mail className="w-4 h-4 mr-2" />{content.contact.email}
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
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
function Row({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}
function Done({ label }) {
  return (
    <div className="text-center py-8">
      <CheckCircle className="w-16 h-16 text-leaf-500 mx-auto mb-4" />
      <h3 className="font-display text-2xl font-bold text-brand-900 mb-2">{label}</h3>
      <p className="text-slate-600">Thank you — we'll be in touch soon.</p>
    </div>
  );
}
