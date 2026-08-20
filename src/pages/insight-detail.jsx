import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function InsightDetail() {
  const { slug: routeSlug } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const identifier = routeSlug || params.get('slug') || params.get('id');
    if (!identifier) { setLoading(false); return; }
    api.insights.get(identifier)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [routeSlug, location.search]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" /></div>;
  if (!post) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="h-section">Article not found</h2>
      <p className="text-slate-500 mt-2">The article you're looking for doesn't exist.</p>
      <Link to="/insights" className="mt-6"><Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to insights</Button></Link>
    </div>
  );

  return (
    <>
      {post.featured_image && (
        <div className="relative h-[400px] bg-brand-radial overflow-hidden">
          <img src={post.featured_image} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-900/40 to-brand-950/80" />
        </div>
      )}

      <div className="container-page max-w-3xl -mt-40 relative z-10 pb-16">
        <Card className="border border-slate-200 shadow-glow">
          <CardContent className="p-8 md:p-10">
            <Link to="/insights" className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-900 text-sm mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to insights
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">{post.category}</Badge>}
              {post.tags?.map((t) => (
                <Badge key={t} variant="outline" className="border-brand-200 text-brand-700">
                  <Tag className="w-3 h-3 mr-1" />{t}
                </Badge>
              ))}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-900 leading-tight">{post.title}</h1>

            <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
              {post.author && <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>}
              {post.published_date && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.published_date)}</span>}
              {post.reading_time && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.reading_time} min read</span>}
            </div>

            {post.excerpt && (
              <p className="mt-8 pb-8 border-b border-slate-200 text-lg text-slate-700 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="prose-brand mt-8">
              <ReactMarkdown>{post.content || ''}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {post.author && (
          <Card className="mt-6 border border-slate-200">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-gradient text-white flex items-center justify-center font-bold text-xl">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-display font-semibold text-brand-900">{post.author}</p>
                <p className="text-sm text-slate-500">Author</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Link to="/insights">
            <Button variant="outline" className="border-brand-300 text-brand-800 hover:bg-brand-50">
              View all insights
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
