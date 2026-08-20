import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle, Target, Code, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

export default function ProductDetail() {
  const { slug: routeSlug } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const identifier = routeSlug || params.get('slug') || params.get('id');
    if (!identifier) { setLoading(false); return; }
    api.products.get(identifier)
      .then((p) => setProduct(p))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [routeSlug, location.search]);

  if (loading) return <Loading />;
  if (!product) return <NotFound />;

  const hero = product.screenshot_urls?.[0] || product.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80';

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-radial text-white">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity" style={{ backgroundImage: `url(${hero})` }} />
        <div className="container-page relative py-24 md:py-32">
          <Link to="/products" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to products
          </Link>
          <motion.div variants={stagger()} initial="hidden" animate="show" className="max-w-3xl">
            {product.category && (
              <motion.div variants={fadeUp}>
                <Badge className="bg-white/15 text-white border border-white/20 mb-4">{product.category}</Badge>
              </motion.div>
            )}
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-6xl font-bold leading-tight">
              {product.name}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl">
              {product.short_description}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex gap-3 flex-wrap">
              {product.demo_url && (
                <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-leaf-500 hover:bg-leaf-600 text-white font-semibold shadow-glow-green">
                    Try live demo <ExternalLink className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              )}
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10">
                  Talk to sales
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {product.primary_benefit && (
        <section className="py-14 bg-gradient-to-r from-brand-800 to-leaf-700 text-white">
          <div className="container-page text-center">
            <Target className="w-10 h-10 mx-auto mb-3 opacity-80" />
            <h2 className="font-display text-2xl md:text-3xl font-bold">Primary benefit</h2>
            <p className="mt-3 text-lg text-white/85 max-w-2xl mx-auto">{product.primary_benefit}</p>
          </div>
        </section>
      )}

      {product.detailed_description && (
        <section className="section bg-white">
          <div className="container-page max-w-4xl">
            <p className="eyebrow">About the product</p>
            <h2 className="h-section mt-3 mb-6">What it does.</h2>
            <div className="text-slate-700 leading-relaxed text-lg space-y-4">
              {product.detailed_description.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>
      )}

      {product.features?.length > 0 && (
        <section className="section bg-slate-50/60">
          <div className="container-page">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow">Features</p>
              <h2 className="h-section mt-3">What you get out of the box.</h2>
            </div>
            <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card className="lift border border-slate-200 h-full">
                    <CardContent className="p-5 flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-leaf-600 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">{f}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {product.use_cases?.length > 0 && (
        <section className="section bg-white">
          <div className="container-page">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow">Use cases</p>
              <h2 className="h-section mt-3">Who uses it.</h2>
            </div>
            <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.use_cases.map((u, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card className="lift border border-slate-200 h-full">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <p className="text-slate-700 leading-relaxed">{u}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {product.tech_stack?.length > 0 && (
        <section className="section bg-slate-50/60">
          <div className="container-page max-w-4xl">
            <div className="text-center mb-8">
              <p className="eyebrow">Under the hood</p>
              <h2 className="h-section mt-3">Technology stack.</h2>
            </div>
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-brand-700">
                  <Code className="w-5 h-5" />
                  <h3 className="font-semibold">Built with</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tech_stack.map((t, i) => (
                    <span key={i} className="text-sm font-medium text-brand-800 bg-brand-50 rounded-full px-3 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {product.screenshot_urls?.length > 1 && (
        <section className="section bg-white">
          <div className="container-page">
            <div className="text-center mb-10">
              <p className="eyebrow">Product screenshots</p>
              <h2 className="h-section mt-3">See it in action.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.screenshot_urls.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-glow ring-1 ring-brand-100">
                  <img src={url} alt={`${product.name} screenshot ${i + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-brand-radial text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="container-page relative py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            Book a scoping call with our team to see how {product.name} fits your organisation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {product.demo_url && (
              <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-brand-900 hover:bg-white/90 font-semibold">
                  Try demo <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </a>
            )}
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10">
                Contact sales <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" />
    </div>
  );
}
function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="h-section">Product not found</h2>
      <p className="text-slate-500 mt-2">The product you're looking for doesn't exist or is no longer available.</p>
      <Link to="/products" className="mt-6 inline-block">
        <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to products</Button>
      </Link>
    </div>
  );
}
