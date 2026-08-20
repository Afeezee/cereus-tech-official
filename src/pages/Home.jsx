import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Users, Award, Globe, TrendingUp,
  Shield, Zap, Sparkles, HeartPulse, GraduationCap, Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/common/ProductCard';
import TestimonialCard from '@/components/common/TestimonialCard';
import { useSiteContent } from '@/lib/site-content';
import { api } from '@/lib/api';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

const PILLARS = [
  {
    icon: HeartPulse,
    title: 'Health technology',
    body: 'Digital health platforms that improve patient care, clinical workflows and public-health decisioning.',
    accent: 'text-rose-600 bg-rose-50 ring-rose-100',
  },
  {
    icon: GraduationCap,
    title: 'Education technology',
    body: 'Learning tools that make world-class training accessible to the next wave of African talent.',
    accent: 'text-brand-700 bg-brand-50 ring-brand-100',
  },
  {
    icon: Leaf,
    title: 'Environmental tech',
    body: 'Monitoring, sensing and analytics for organisations working on environmental sustainability.',
    accent: 'text-leaf-700 bg-leaf-50 ring-leaf-100',
  },
];

const WHY = [
  { icon: CheckCircle, title: 'Proven track record', body: '50+ successful projects across health, education and environment.' },
  { icon: Zap, title: 'Fast delivery', body: 'Small teams, agile process, weekly demos and predictable ship dates.' },
  { icon: Award, title: 'Quality first', body: 'Every product ships with test coverage, monitoring and a runbook.' },
  { icon: TrendingUp, title: 'Continuous innovation', body: 'AI, mobile and cloud embedded in everything we design.' },
];

export default function Home() {
  const { content } = useSiteContent();
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.products.list({ limit: 3 }).then((r) => setProducts(r.items || r || [])).catch(() => {});
    api.testimonials.list({ featured: 1, limit: 3 }).then((r) => setTestimonials(r.items || r || [])).catch(() => {});
  }, []);

  const hero = content.hero || {};
  const stats = content.stats || [];

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-radial text-white">
        <div className="hero-grid absolute inset-0" />
        {hero.background_image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
            style={{ backgroundImage: `url(${hero.background_image})` }}
          />
        )}
        <div className="absolute -top-32 -left-32 blob bg-brand-500 w-[520px] h-[520px] animate-float" />
        <div className="absolute -bottom-32 -right-24 blob bg-leaf-500 w-[520px] h-[520px]" style={{ animationDelay: '1.5s' }} />

        <div className="container-page relative py-24 md:py-32">
          <motion.div variants={stagger(0, 0.1)} initial="hidden" animate="show" className="max-w-4xl">
            {hero.eyebrow && (
              <motion.p variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-widest text-leaf-200">
                <Sparkles className="w-3 h-3" />
                {hero.eyebrow}
              </motion.p>
            )}
            <motion.h1 variants={fadeUp} className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight">
              {hero.title_line_1}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-leaf-200 to-white bg-[length:200%_auto] animate-gradient-x">
                {hero.title_line_2}
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              {hero.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {hero.cta_primary?.href && (
                <Link to={hero.cta_primary.href}>
                  <Button size="lg" className="bg-white text-brand-900 hover:bg-white/90 font-semibold shadow-glow-green">
                    {hero.cta_primary.label}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
              {hero.cta_secondary?.href && (
                <Link to={hero.cta_secondary.href}>
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10 backdrop-blur">
                    {hero.cta_secondary.label}
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip — sits on the hero base */}
        {stats.length > 0 && (
          <div className="relative border-t border-white/10">
            <div className="container-page py-8">
              <motion.div
                variants={stagger()}
                {...revealOnce}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {stats.map((s, i) => (
                  <motion.div key={i} variants={fadeUp} className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-white">
                      {s.value}
                    </div>
                    <div className="text-sm text-white/60 mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* ─── Pillars ──────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-page">
          <motion.div {...revealOnce} variants={stagger()} className="max-w-2xl mb-14">
            <motion.p variants={fadeUp} className="eyebrow">What we do</motion.p>
            <motion.h2 variants={fadeUp} className="h-display mt-3">
              Software with a <span className="text-gradient">purpose</span>.
            </motion.h2>
            <motion.p variants={fadeUp} className="lead mt-4">
              Three sectors, one operating philosophy: build technology that measurably improves lives.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map(({ icon: Icon, title, body, accent }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="h-full lift border border-slate-200 hover:border-brand-200 bg-gradient-to-br from-white to-slate-50/50">
                  <CardContent className="p-7">
                    <div className={`w-12 h-12 rounded-xl ring-1 ${accent} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-brand-900 mb-2">{title}</h3>
                    <p className="text-slate-600 leading-relaxed">{body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Featured products ───────────────────────────────── */}
      {products.length > 0 && (
        <section className="section bg-slate-50/60">
          <div className="container-page">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="eyebrow">Featured</p>
                <h2 className="h-section mt-3">Recent products, live in the wild.</h2>
              </div>
              <Link to="/products">
                <Button variant="outline" className="border-brand-300 text-brand-800 hover:bg-brand-50">
                  View all products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Why Cereus ──────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow">Why Cereus</p>
            <h2 className="h-section mt-3">Technical depth. Delivery discipline.</h2>
            <p className="lead mt-4">
              We pair engineering rigour with a bias for shipping so that value lands in your users' hands.
            </p>
          </div>
          <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map(({ icon: Icon, title, body }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="h-full lift text-center border border-slate-200">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-gradient text-white flex items-center justify-center mb-4 shadow-glow">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-brand-900 mb-1">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section bg-slate-50/60">
          <div className="container-page">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow">Kind words</p>
              <h2 className="h-section mt-3">What clients tell their teams.</h2>
            </div>
            <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-radial text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="container-page relative py-20 md:py-24 text-center">
          <p className="eyebrow bg-white/10 border-white/20 text-leaf-200 mx-auto">Let's build</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold text-white">
            Ready to ship your next big thing?
          </h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto text-lg">
            Tell us the outcome you're after and we'll come back with a working plan within two working days.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-leaf-500 hover:bg-leaf-600 text-white font-semibold shadow-glow-green">
                Start your project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10">
                Explore services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
