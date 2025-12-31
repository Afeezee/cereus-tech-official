import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Menu,
  X,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewsletterSignup from "./components/common/NewsletterSignup";
import Chatbot from "./components/common/Chatbot";

const navigationItems = [
  { name: "Home", path: createPageUrl("Home") },
  { name: "About", path: createPageUrl("About") },
  { name: "Products", path: createPageUrl("products") },
  { name: "Services", path: createPageUrl("services") },
  { name: "Academy", path: createPageUrl("academy") },
  { name: "Careers", path: createPageUrl("careers") },
  { name: "Contact", path: createPageUrl("contact") }
];

const Layout = ({ children, currentPageName }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Redesigned Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Text Only */}
            <div className="flex items-center">
              <Link to={createPageUrl("Home")}>
                <span className="text-2xl font-bold text-purple-900">Cereus Technologies</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path || 
                                (item.path.includes('Home') && location.pathname === '/');
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive 
                        ? 'bg-purple-900 text-white' 
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                className="text-purple-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white pb-4">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                                  (item.path.includes('Home') && location.pathname === '/');
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-3 py-3 rounded-lg font-medium transition-all ${
                        isActive 
                          ? 'bg-purple-900 text-white' 
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-900'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Chatbot */}
      <Chatbot />

      {/* Footer - Black background with white text */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link to={createPageUrl("Home")}>
                <span className="text-lg font-semibold text-green-500">Cereus Technologies</span>
              </Link>
              <p className="text-gray-300 text-sm">
                Building reliable technology solutions for health, education and the environment.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>+234 701 462 3270</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  <span>info@cereustechnologies.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-4 text-green-500">Products</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to={createPageUrl("products") + "?category=Health"} className="hover:text-white transition-colors">Health Tech</Link></li>
                <li><Link to={createPageUrl("products") + "?category=Education"} className="hover:text-white transition-colors">Education Tech</Link></li>
                <li><Link to={createPageUrl("products") + "?category=Agriculture"} className="hover:text-white transition-colors">Agriculture Tech</Link></li>
                <li><Link to={createPageUrl("products")} className="hover:text-white transition-colors">View All Products</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-green-500">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to={createPageUrl("About")} className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to={createPageUrl("services")} className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to={createPageUrl("academy")} className="hover:text-white transition-colors">Academy</Link></li>
                <li><Link to={createPageUrl("careers")} className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to={createPageUrl("contact")} className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-4 text-green-500">Stay Connected</h3>
              <p className="text-sm text-gray-300 mb-4">
                Subscribe for product updates and insights.
              </p>
              <NewsletterSignup />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2025 Cereus Technologies. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;