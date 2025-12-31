import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Globe,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/common/ProductCard";
import TestimonialCard from "../components/common/TestimonialCard";

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [products, testimonialsData] = await Promise.all([
        base44.entities.Product.list("-created_date", 3),
        base44.entities.Testimonial.filter({ featured: true, approved: true }, "-created_date", 3)
      ]);

      setLatestProducts(products);
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Purple gradient background with image */}
      <section 
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Building Reliable Technology
            <span className="block text-white mt-2">For A Better Tomorrow</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto font-medium">
            We create innovative solutions in health, education, and environmental technology
            that drive measurable impact across African markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-semibold">
                Explore Our Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 font-semibold">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-900">50+</div>
              <div className="text-gray-700 font-medium">Projects Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">98%</div>
              <div className="text-gray-700 font-medium">Client Satisfaction</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-900">9+</div>
              <div className="text-gray-700 font-medium">Years in the Industry</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">24/7</div>
              <div className="text-gray-700 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              We specialize in creating technology solutions that address real-world challenges
              in health, education, and environmental sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-purple-900">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Health Technology</h3>
                <p className="text-gray-700">
                  Building digital health solutions that improve patient care and healthcare delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-green-600">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Education Technology</h3>
                <p className="text-gray-700">
                  Empowering learners with innovative educational platforms and tools.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-purple-900">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Environmental Tech</h3>
                <p className="text-gray-700">
                  Creating sustainable solutions for environmental monitoring and management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {latestProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="mb-6 md:mb-0">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                <p className="text-xl text-gray-700 font-medium">
                  Discover our latest innovative solutions
                </p>
              </div>
              <Link to="/products">
                <Button variant="outline" className="border-2 border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white font-semibold">
                  View All Products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Cereus Technologies</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              We combine technical excellence with deep market understanding to deliver solutions that work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-purple-900 hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Proven Track Record</h3>
                <p className="text-gray-700 text-sm">
                  Years of successful project delivery across multiple sectors
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-600 hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Fast Delivery</h3>
                <p className="text-gray-700 text-sm">
                  Agile development process ensuring quick turnaround times
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-900 hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Quality Assurance</h3>
                <p className="text-gray-700 text-sm">
                  Rigorous testing and quality control processes
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-600 hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Continuous Innovation</h3>
                <p className="text-gray-700 text-sm">
                  Always exploring new technologies and methodologies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-700 font-medium">
                Don't just take our word for it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Purple gradient background */}
      <section className="py-24 bg-gradient-to-r from-purple-900 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 font-medium text-white">
            Let's discuss how we can help you achieve your technology goals
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              Start Your Project Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}