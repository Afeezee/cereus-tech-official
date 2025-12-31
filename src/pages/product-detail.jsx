import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  Code, 
  Users,
  ArrowRight,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import ParallaxSection from "../components/common/ParallaxSection";

export default function ProductDetail() {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [location]);

  const loadProduct = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const identifier = urlParams.get('id') || urlParams.get('slug');
      
      if (!identifier) {
        setLoading(false);
        return;
      }

      let results = await base44.entities.Product.filter({ slug: identifier });
      
      if (results.length === 0) {
        const allProducts = await base44.entities.Product.list();
        results = allProducts.filter(p => p.id === identifier);
      }

      if (results.length > 0) {
        setProduct(results[0]);
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ParallaxSection imageUrl={product.screenshot_urls?.[0] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <Link to="/products">
            <Button variant="outline" className="mb-6 bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {product.name}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mb-8">
            {product.short_description}
          </p>
          {product.demo_url && (
            <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                Try Live Demo
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </a>
          )}
        </div>
      </ParallaxSection>

      {/* Key Benefit */}
      {product.primary_benefit && (
        <section className="py-16 bg-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Primary Benefit</h2>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              {product.primary_benefit}
            </p>
          </div>
        </section>
      )}

      {/* Detailed Description */}
      {product.detailed_description && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Product</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              {product.detailed_description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <CheckCircle className="w-8 h-8 text-teal-600 mb-3" />
                    <p className="text-gray-700">{feature}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Use Cases */}
      {product.use_cases && product.use_cases.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.use_cases.map((useCase, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Users className="w-5 h-5 text-teal-600" />
                      </div>
                      <p className="text-gray-700">{useCase}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {product.tech_stack && product.tech_stack.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technology Stack</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Code className="w-6 h-6 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold">Built With</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tech_stack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Screenshots */}
      {product.screenshot_urls && product.screenshot_urls.length > 1 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Product Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.screenshot_urls.map((url, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={url}
                    alt={`${product.name} screenshot ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Contact us to learn more about how {product.name} can benefit your organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {product.demo_url && (
              <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                  Try Demo
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </a>
            )}
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
                Contact Sales
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}