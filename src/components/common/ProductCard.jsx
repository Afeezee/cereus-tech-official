import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fadeUp } from '@/lib/motion';

const CATEGORY_TINT = {
  Health: 'from-rose-500/10 to-brand-500/10 border-rose-200',
  Education: 'from-brand-500/10 to-indigo-500/10 border-brand-200',
  Environment: 'from-leaf-500/10 to-emerald-500/10 border-leaf-200',
  Agriculture: 'from-leaf-500/10 to-amber-500/10 border-leaf-200',
};

const ProductCard = memo(function ProductCard({ product }) {
  const tint = CATEGORY_TINT[product.category] || 'from-brand-500/10 to-leaf-500/10 border-brand-100';
  const to = `/products/${product.slug || product.id}`;

  return (
    <motion.div variants={fadeUp}>
      <Card className={`group relative overflow-hidden lift border-2 ${tint} bg-gradient-to-br from-white to-white/60`}>
        <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-500/10 blur-3xl group-hover:bg-brand-500/20 transition-colors" />
        <CardContent className="relative p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              {product.category && (
                <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100 mb-3">{product.category}</Badge>
              )}
              <h3 className="font-display text-xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors">
                {product.name}
              </h3>
            </div>
            <ArrowUpRight className="w-5 h-5 text-brand-700 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
          </div>

          <p className="text-slate-600 mb-4 flex-grow">
            {product.short_description}
          </p>

          {product.primary_benefit && (
            <div className="bg-leaf-50 border-l-4 border-leaf-500 rounded-r-lg p-3 mb-4">
              <p className="text-sm font-medium text-leaf-900">{product.primary_benefit}</p>
            </div>
          )}

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-auto pt-2">
            <Link to={to} className="flex-1">
              <Button variant="outline" className="w-full border-brand-200 text-brand-800 hover:bg-brand-50">
                Learn more
              </Button>
            </Link>
            {product.demo_url && (
              <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-leaf-600 hover:bg-leaf-700 text-white">
                  Try demo
                  <ExternalLink className="ml-1.5 w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default ProductCard;
