import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from '@/Layout';
import AdminGuard from '@/lib/admin-guard';

// Lazy-load page bundles for a lighter first paint.
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Products = lazy(() => import('@/pages/products'));
const ProductDetail = lazy(() => import('@/pages/product-detail'));
const Services = lazy(() => import('@/pages/services'));
const Academy = lazy(() => import('@/pages/academy'));
const Careers = lazy(() => import('@/pages/careers'));
const Contact = lazy(() => import('@/pages/contact'));
const Insights = lazy(() => import('@/pages/insights'));
const InsightDetail = lazy(() => import('@/pages/insight-detail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin
const AdminLayout = lazy(() => import('@/pages/admin/Layout'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminInsights = lazy(() => import('@/pages/admin/Insights'));
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'));
const AdminCareers = lazy(() => import('@/pages/admin/Careers'));
const AdminSiteContent = lazy(() => import('@/pages/admin/SiteContent'));
const AdminSubmissions = lazy(() => import('@/pages/admin/Submissions'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public site — Layout provides header, footer, chatbot */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />
            <Route path="/insight-detail" element={<InsightDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin — protected by Clerk + email allow-list */}
          <Route
            path="/admin/*"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="insights" element={<AdminInsights />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="site" element={<AdminSiteContent />} />
            <Route path="submissions" element={<AdminSubmissions />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
