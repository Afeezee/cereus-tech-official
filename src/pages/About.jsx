import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, ArrowRight, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Hero from '@/components/common/Hero';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

const TEAM = [
  {
    name: 'Afeez A. Olagunju',
    role: 'Founder & CEO',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c5f7011e8a4a27675b0091/cb8d32d4b_IMG_1187.jpg',
    linkedin: 'https://www.linkedin.com/in/afeez-olagunju-35b811a6/',
    email: 'olagunjuafeez@gmail.com',
  },
  {
    name: 'Abe Enoch A.',
    role: 'Chief Technology Officer',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c5f7011e8a4a27675b0091/8169d3f7d_AbePassport1.jpg',
    linkedin: 'https://www.linkedin.com/in/enoch-abe-b223a118b/',
    email: 'abeaboluwarin@gmail.com',
  },
  {
    name: 'Akanfe Abidemi M.',
    role: 'R&D Director',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c5f7011e8a4a27675b0091/0dec60d3c_Passport1.jpg',
    email: 'Akanfe.am.bm@gmail.com',
  },
];

const MILESTONES = [
  { year: '2016', event: 'Company founded', body: 'Started with a vision to transform African tech in Lagos, Nigeria.' },
  { year: '2019', event: 'First product launched', body: 'Rolled out our flagship health technology solution.' },
  { year: '2021', event: '50+ clients', body: 'Served 50+ organisations across 12 countries.' },
  { year: '2023', event: 'International expansion', body: 'Expanded operations across multiple African markets.' },
];

const VALUES = [
  { icon: Target, title: 'Our mission', body: 'Build reliable technology that drives measurable impact in health, education and environmental sectors across African markets.', tint: 'bg-brand-50 text-brand-700' },
  { icon: Eye, title: 'Our vision', body: 'Be the leading technology partner for organisations leveraging digital innovation for sustainable growth and social impact.', tint: 'bg-leaf-50 text-leaf-700' },
  { icon: Heart, title: 'Our values', body: 'Excellence, innovation, integrity, collaboration and customer success guide everything we do.', tint: 'bg-rose-50 text-rose-700' },
];

export default function About() {
  return (
    <>
      <Hero
        eyebrow="About us"
        title="Building the reliable tech backbone Africa deserves."
        subtitle="Since 2016 we've partnered with health, education and environment leaders to ship products that move the needle."
      />

      {/* Story */}
      <section className="section bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...revealOnce} variants={stagger()}>
            <motion.p variants={fadeUp} className="eyebrow">Our story</motion.p>
            <motion.h2 variants={fadeUp} className="h-section mt-3">From a Lagos studio to a continent-scale team.</motion.h2>
            <motion.div variants={fadeUp} className="mt-5 space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>Founded in 2016 in Lagos, Nigeria, Cereus Technologies began with a simple vision: create technology solutions that address real challenges in African markets.</p>
              <p>What started as a small team of passionate technologists has grown into a leading technology company serving 50+ institutional clients across 12 countries.</p>
              <p>Today, we're proud to have delivered over 50 successful projects, helping organizations leverage technology to achieve their goals and make a positive impact.</p>
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
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&q=80"
              alt="Our team"
              className="relative rounded-3xl shadow-glow w-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section bg-slate-50/60">
        <div className="container-page">
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, body, tint }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="h-full lift text-center border border-slate-200">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto rounded-full ${tint} flex items-center justify-center mb-5`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-brand-900 mb-3">{title}</h3>
                    <p className="text-slate-600 leading-relaxed">{body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-white">
        <div className="container-page max-w-4xl">
          <div className="text-center mb-14">
            <p className="eyebrow">Our journey</p>
            <h2 className="h-section mt-3">Milestones we're proud of.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[38px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-200 via-brand-400 to-leaf-400" />
            <motion.ol variants={stagger()} {...revealOnce} className="space-y-8">
              {MILESTONES.map((m, i) => (
                <motion.li key={m.year} variants={fadeUp} className="relative pl-24 md:pl-0 md:grid md:grid-cols-2 md:gap-10 md:items-center">
                  <div className={`absolute left-0 md:relative md:col-span-1 flex items-center ${i % 2 === 0 ? 'md:justify-end md:pr-10' : 'md:order-2 md:pl-10'}`}>
                    <div className="w-20 h-20 rounded-2xl bg-brand-gradient text-white flex items-center justify-center font-display font-bold text-xl shadow-glow ring-4 ring-white z-10">
                      {m.year}
                    </div>
                  </div>
                  <div className={i % 2 === 0 ? 'md:pl-10' : 'md:order-1 md:text-right md:pr-10'}>
                    <Card className="border border-slate-200 lift">
                      <CardContent className="p-5">
                        <h3 className="font-display text-xl font-bold text-brand-900">{m.event}</h3>
                        <p className="text-slate-600 mt-1">{m.body}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-slate-50/60">
        <div className="container-page">
          <div className="text-center mb-14">
            <p className="eyebrow">The team</p>
            <h2 className="h-section mt-3">People shipping the roadmap.</h2>
          </div>
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((m) => (
              <motion.div key={m.name} variants={fadeUp}>
                <Card className="lift text-center border border-slate-200 group overflow-hidden">
                  <div className="h-40 bg-brand-gradient relative">
                    <div className="hero-grid absolute inset-0 opacity-40" />
                  </div>
                  <CardContent className="pt-0 -mt-14 pb-6">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-28 h-28 rounded-full mx-auto object-cover ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <h3 className="mt-4 font-display text-xl font-bold text-brand-900">{m.name}</h3>
                    <p className="text-slate-600 mb-4">{m.role}</p>
                    <div className="flex justify-center gap-2">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="border-brand-200 text-brand-700 hover:bg-brand-50">
                            <Linkedin className="w-4 h-4 mr-1.5" /> LinkedIn
                          </Button>
                        </a>
                      )}
                      <a href={`mailto:${m.email}`}>
                        <Button size="sm" variant="outline" className="border-brand-200 text-brand-700 hover:bg-brand-50">
                          <Mail className="w-4 h-4 mr-1.5" /> Email
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-radial text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="container-page relative py-20 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Want to join us?</h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto text-lg">
            We're always looking for talented people who share our passion for shipping useful software.
          </p>
          <Link to="/careers" className="inline-block mt-8">
            <Button size="lg" className="bg-leaf-500 hover:bg-leaf-600 text-white font-semibold shadow-glow-green">
              View open positions <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
