import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code, Users, Lightbulb, Settings, ArrowRight, CheckCircle,
  Target, Zap, BrainCircuit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Hero from '@/components/common/Hero';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

const SERVICES = [
  { icon: Code, title: 'Custom software development', body: 'End-to-end product engineering tailored to your business needs.', features: ['Web & mobile applications', 'Enterprise integrations', 'API development', 'Cloud-native architecture'] },
  { icon: BrainCircuit, title: 'AI & machine learning', body: 'Automate processes, extract insights from unstructured data.', features: ['Predictive analytics', 'NLP & document understanding', 'Computer vision', 'Intelligent workflows'] },
  { icon: Users, title: 'Digital transformation consulting', body: 'Strategic guidance for the entire modernisation journey.', features: ['Technology strategy', 'Process optimisation', 'Change management', 'Digital roadmap planning'] },
  { icon: Settings, title: 'IT support & maintenance', body: 'Comprehensive support to keep systems running smoothly.', features: ['24/7 technical support', 'System monitoring', 'Patch management', 'Performance tuning'] },
  { icon: Lightbulb, title: 'Product innovation', body: 'From concept to launch, we help you build things users love.', features: ['Product strategy', 'UX/UI design', 'MVP development', 'Market testing'] },
  { icon: Target, title: 'Technology training', body: 'Level up your team through custom curricula and workshops.', features: ['Custom training programs', 'Workshops & bootcamps', 'Online courses', 'Certification paths'] },
];

const PROCESS = [
  { step: '01', title: 'Discovery', body: 'Deep-dive workshops to understand your business, users and constraints.' },
  { step: '02', title: 'Planning', body: 'Detailed scope, milestones and success metrics — before we write a line of code.' },
  { step: '03', title: 'Execution', body: 'Weekly demos, agile sprints and transparent progress reporting.' },
  { step: '04', title: 'Delivery', body: 'Deployment, training and handover — with a runbook you can operate.' },
  { step: '05', title: 'Support', body: 'Ongoing maintenance, optimisation and roadmap iteration.' },
];

export default function Services() {
  return (
    <>
      <Hero
        eyebrow="Services"
        title="Full-stack partners for your next product."
        subtitle="From strategy to shipped software — bring us in for the phase you need or for the whole journey."
      />

      {/* Services grid */}
      <section className="section bg-white">
        <div className="container-page">
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, body, features }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="group h-full lift border border-slate-200 hover:border-brand-200 relative overflow-hidden">
                  <div className="pointer-events-none absolute -top-20 -right-20 w-52 h-52 rounded-full bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors blur-3xl" />
                  <CardContent className="relative p-7">
                    <div className="w-12 h-12 rounded-xl bg-brand-gradient text-white flex items-center justify-center mb-5 shadow-glow">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors">{title}</h3>
                    <p className="text-slate-600 mt-2">{body}</p>
                    <ul className="mt-4 space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-leaf-600 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-slate-50/60">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow">How we work</p>
            <h2 className="h-section mt-3">A proven, five-step delivery playbook.</h2>
          </div>
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PROCESS.map((p) => (
              <motion.div key={p.step} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white ring-1 ring-brand-100 text-brand-800 font-display text-xl font-bold flex items-center justify-center shadow-card">
                  {p.step}
                </div>
                <h3 className="mt-4 font-display font-semibold text-brand-900">{p.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why us */}
      <section className="section bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...revealOnce} variants={stagger()}>
            <motion.p variants={fadeUp} className="eyebrow">Why choose us</motion.p>
            <motion.h2 variants={fadeUp} className="h-section mt-3">Fast, focused, and technically deep.</motion.h2>
            <motion.div variants={fadeUp} className="space-y-6 mt-6">
              <Bullet icon={Zap} title="Fast turnaround" body="Agile sprints and weekly demos — with predictable ship dates." tint="bg-brand-50 text-brand-700" />
              <Bullet icon={Target} title="Results-driven" body="Every engagement anchored on measurable business outcomes." tint="bg-leaf-50 text-leaf-700" />
              <Bullet icon={Users} title="Expert team" body="Multi-disciplinary specialists across engineering, design and research." tint="bg-rose-50 text-rose-700" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl bg-brand-gradient opacity-90 blur-lg" />
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80"
              alt="Our team collaborating"
              className="relative rounded-3xl shadow-glow w-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-radial text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="container-page relative py-20 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto text-lg">
            Let's talk through your goals and turn them into a working plan.
          </p>
          <Link to="/contact" className="inline-block mt-8">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-white/90 font-semibold shadow-glow-green">
              Schedule a consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

function Bullet({ icon: Icon, title, body, tint }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${tint} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-brand-900 text-lg">{title}</h3>
        <p className="text-slate-600 mt-1">{body}</p>
      </div>
    </div>
  );
}
