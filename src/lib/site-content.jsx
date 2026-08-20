import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

// Default site content — used at first paint and as a fallback if the API
// hasn't been reached yet or the DB is empty.
export const DEFAULT_SITE_CONTENT = {
  brand: {
    name: 'Cereus Technologies',
    tagline: 'Building reliable technology for a better tomorrow',
  },
  hero: {
    eyebrow: 'Health · Education · Environment',
    title_line_1: 'Reliable technology,',
    title_line_2: 'measurable impact.',
    subtitle:
      'We design and build practical software for health, education and environmental teams shaping the next decade of African innovation.',
    cta_primary: { label: 'Explore our products', href: '/products' },
    cta_secondary: { label: 'Get in touch', href: '/contact' },
    background_image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
  },
  stats: [
    { value: '50+', label: 'Projects delivered' },
    { value: '98%', label: 'Client satisfaction' },
    { value: '9+', label: 'Years in the industry' },
    { value: '24/7', label: 'Support available' },
  ],
  contact: {
    phone: '+234 701 462 3270',
    email: 'info@cereustechnologies.com',
    address: 'Lagos, Nigeria',
    hours: 'Mon–Fri 9am–5pm, Sat 10am–2pm (WAT)',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/cereus-technologies',
    twitter: '',
    github: '',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Services', href: '/services' },
    { label: 'Academy', href: '/academy' },
    { label: 'Insights', href: '/insights' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: {
    tagline:
      'Building reliable technology solutions for health, education and the environment.',
    columns: [
      {
        heading: 'Products',
        links: [
          { label: 'Health tech', href: '/products?category=Health' },
          { label: 'Education tech', href: '/products?category=Education' },
          { label: 'Environment tech', href: '/products?category=Environment' },
          { label: 'View all', href: '/products' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Services', href: '/services' },
          { label: 'Academy', href: '/academy' },
          { label: 'Careers', href: '/careers' },
        ],
      },
    ],
    copyright: '© {year} Cereus Technologies. All rights reserved.',
  },
};

const SiteContentContext = createContext({
  content: DEFAULT_SITE_CONTENT,
  loading: true,
  refresh: () => {},
});

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await api.siteContent.get();
      if (data && typeof data === 'object') {
        // Merge shallowly so partial edits don't wipe defaults.
        setContent((prev) => ({ ...prev, ...data }));
      }
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <SiteContentContext.Provider value={{ content, loading, refresh: load }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
