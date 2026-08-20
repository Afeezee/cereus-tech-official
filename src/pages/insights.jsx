import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Hero from '@/components/common/Hero';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

export default function Insights() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api.insights.list().then((r) => setPosts(r.items || r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
    [posts]
  );

  const filtered = useMemo(() => posts.filter((p) => {
    if (q && !`${p.title} ${p.excerpt || ''}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (category !== 'all' && p.category !== category) return false;
    return true;
  }), [posts, q, category]);

  return (
    <>
      <Hero
        eyebrow="Insights & resources"
        title="Ideas from the workshop."
        subtitle="Deep-dives, engineering notes and thought leadership from the Cereus team."
      />

      <section className="section bg-white">
        <div className="container-page">
          <div className="glass p-5 md:p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="pl-10 bg-white" />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{filtered.length} of {posts.length} articles</span>
              {(q || category !== 'all') && (
                <Button variant="ghost" size="sm" onClick={() => { setQ(''); setCategory('all'); }}>Clear</Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-500">Loading articles…</div>
          ) : filtered.length ? (
            <motion.div variants={stagger()} {...revealOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <PostCard key={p.id} post={p} />)}
            </motion.div>
          ) : (
            <EmptyState onClear={() => { setQ(''); setCategory('all'); }} />
          )}
        </div>
      </section>
    </>
  );
}

function PostCard({ post }) {
  return (
    <motion.div variants={fadeUp}>
      <Link to={`/insights/${post.slug || post.id}`} className="block h-full">
        <Card className="group h-full overflow-hidden lift border border-slate-200 hover:border-brand-200">
          <div className="h-48 overflow-hidden bg-brand-radial relative">
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 to-transparent" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
              {post.category && <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">{post.category}</Badge>}
              {post.published_date && (
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.published_date)}</span>
              )}
            </div>
            <h3 className="font-display text-xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors line-clamp-2">
              {post.title}
            </h3>
            {post.excerpt && <p className="text-slate-600 mt-3 line-clamp-3">{post.excerpt}</p>}
            <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
              {post.author && <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>}
              {post.reading_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time} min read</span>}
            </div>
            <div className="mt-4 inline-flex items-center gap-1 text-brand-700 font-medium text-sm">
              Read article
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
      <p className="text-xl text-slate-700 mb-2">No articles found</p>
      <p className="text-slate-500 mb-6">Try adjusting your filters.</p>
      <Button onClick={onClear}>Clear filters</Button>
    </div>
  );
}
