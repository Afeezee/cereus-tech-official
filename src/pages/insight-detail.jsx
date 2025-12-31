import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Tag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function InsightDetail() {
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [location]);

  const loadPost = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const identifier = urlParams.get('id') || urlParams.get('slug');
      
      if (!identifier) {
        setLoading(false);
        return;
      }

      const results = await base44.entities.BlogPost.filter({ slug: identifier });
      if (results.length > 0) {
        setPost(results[0]);
      } else {
        console.error("Post not found");
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/insights">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Insights
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {post.featured_image && (
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${post.featured_image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <Card className="mb-8">
          <CardHeader>
            <Link to="/insights">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Insights
              </Button>
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <Badge>{post.category}</Badge>
              )}
              {post.tags && post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <CardTitle className="text-4xl mb-4">{post.title}</CardTitle>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {post.author && (
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {post.author}
                </span>
              )}
              {post.published_date && (
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(post.published_date), 'MMMM d, yyyy')}
                </span>
              )}
              {post.reading_time && (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.reading_time} min read
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {post.excerpt && (
              <div className="text-xl text-gray-700 mb-8 pb-8 border-b">
                {post.excerpt}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Author Info */}
        {post.author && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">About the Author</h3>
                  <p className="text-gray-600">{post.author}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Articles CTA */}
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Want to Read More?</h3>
            <p className="text-gray-600 mb-6">
              Check out our other articles and insights
            </p>
            <Link to="/insights">
              <Button>View All Insights</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="h-20"></div>
    </div>
  );
}