import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, Mail, Phone, MapPin, Linkedin, Twitter, Github, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import NewsletterSignup from '@/components/common/NewsletterSignup';
import Chatbot from '@/components/common/Chatbot';
import { useSiteContent } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export default function Layout() {
  const { content } = useSiteContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const nav = content.nav || [];
  const brandName = content.brand?.name || 'Cereus Technologies';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200 shadow-sm'
            : 'bg-white/40 backdrop-blur border-b border-transparent'
        )}
      >
        <div className="container-page">
          <div className="flex items-center justify-between h-18 py-3">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="inline-block w-9 h-9 rounded-xl bg-brand-gradient shadow-glow group-hover:scale-105 transition-transform" />
              <span className="font-display text-lg md:text-xl font-bold text-brand-900">
                {brandName}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-brand-900 bg-brand-50'
                        : 'text-slate-600 hover:text-brand-900 hover:bg-brand-50/60'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/contact">
                <Button className="bg-brand-800 hover:bg-brand-900 text-white shadow-glow">
                  Start a project
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <button
              className="lg:hidden p-2 rounded-lg text-brand-900 hover:bg-brand-50"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden overflow-hidden border-t border-slate-200 bg-white"
            >
              <div className="container-page py-3 space-y-1">
                {nav.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      cn(
                        'block px-3 py-3 rounded-lg text-base font-medium',
                        isActive ? 'bg-brand-50 text-brand-900' : 'text-slate-700 hover:bg-brand-50'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link to="/contact" className="block pt-2">
                  <Button className="w-full bg-brand-800 hover:bg-brand-900 text-white">Start a project</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Chatbot />

      <Footer content={content} brandName={brandName} />
    </div>
  );
}

function Footer({ content, brandName }) {
  const social = content.social || {};
  const contact = content.contact || {};
  const columns = content.footer?.columns || [];
  const copyright = (content.footer?.copyright || '© {year} Cereus Technologies.').replace(
    '{year}',
    new Date().getFullYear()
  );

  return (
    <footer className="relative overflow-hidden bg-brand-radial text-white">
      <div className="absolute inset-0 opacity-30 hero-grid" />
      <div className="container-page relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-block w-9 h-9 rounded-xl bg-white/10 backdrop-blur border border-white/20" />
              <span className="font-display text-lg font-bold text-white">{brandName}</span>
            </Link>
            <p className="text-sm text-white/70">
              {content.footer?.tagline}
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              {contact.phone && (
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-leaf-300" />{contact.phone}</li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-leaf-300" />{contact.email}</li>
              )}
              {contact.address && (
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-leaf-300" />{contact.address}</li>
              )}
            </ul>
            <div className="flex items-center gap-2 pt-1">
              {social.linkedin && <SocialLink href={social.linkedin} icon={Linkedin} />}
              {social.twitter && <SocialLink href={social.twitter} icon={Twitter} />}
              {social.github && <SocialLink href={social.github} icon={Github} />}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-display text-sm font-semibold text-leaf-300 uppercase tracking-wider mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                {(col.links || []).map((l) => (
                  <li key={l.href + l.label}>
                    <Link className="hover:text-white transition-colors link-underline" to={l.href}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-sm font-semibold text-leaf-300 uppercase tracking-wider mb-4">
              Stay in the loop
            </h4>
            <p className="text-sm text-white/70 mb-3">Product updates and monthly insights, no spam.</p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <p>{copyright}</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-white">Support</Link>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}
