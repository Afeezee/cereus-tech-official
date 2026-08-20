import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/common/ProductCard';
import Hero from '@/components/common/Hero';
import { api } from '@/lib/api';
import { stagger, revealOnce } from '@/lib/motion';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    // Preselect category from ?category=Health etc.
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setCategory(cat);

    api.products.list().then((r) => setProducts(r.items || r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (q && !`${p.name} ${p.short_description || ''}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (category !== 'all' && p.category !== category) return false;
      if (status !== 'all' && p.status !== status) return false;
      return true;
    });
  }, [products, q, category, status]);

  return (
    <>
      <Hero
        eyebrow="Products"
        title="Solutions built for real problems."
        subtitle="Explore our catalogue of health, education, environment and agriculture technology — many with live demos you can try today."
      />

      <section className="section bg-white">
        <div className="container-page">
          <div className="glass p-5 md:p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-10 bg-white" />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Development">In development</SelectItem>
                  <SelectItem value="Coming Soon">Coming soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>Showing {filtered.length} of {products.length} products</span>
              {(q || category !== 'all' || status !== 'all') && (
                <Button variant="ghost" size="sm" onClick={() => { setQ(''); setCategory('all'); setStatus('all'); }}>
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0,1,2,3,4,5].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length ? (
            <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-xl text-slate-700 mb-2">No products match those filters</p>
              <p className="text-slate-500 mb-6">Try clearing the search or picking a different category.</p>
              <Button onClick={() => { setQ(''); setCategory('all'); setStatus('all'); }}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 bg-white animate-pulse">
      <div className="h-4 w-20 bg-slate-200 rounded mb-4" />
      <div className="h-6 w-2/3 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-full bg-slate-100 rounded mb-2" />
      <div className="h-3 w-11/12 bg-slate-100 rounded mb-2" />
      <div className="h-3 w-9/12 bg-slate-100 rounded mb-6" />
      <div className="h-10 w-full bg-slate-100 rounded" />
    </div>
  );
}
