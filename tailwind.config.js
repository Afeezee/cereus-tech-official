/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // shadcn tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // brand
        brand: {
          50: '#f5f1fb',
          100: '#ebe2f7',
          200: '#d6c4ef',
          300: '#b294e0',
          400: '#8f66d0',
          500: '#6d3fbf',
          600: '#54299f',
          700: '#411f7c',
          800: '#2f175b',
          900: '#1f0f3f',
          950: '#150a2b',
        },
        leaf: {
          50: '#effaf3',
          100: '#d8f3e0',
          200: '#b1e5c2',
          300: '#7fd09c',
          400: '#4cb573',
          500: '#279a53',
          600: '#1a7c42',
          700: '#166237',
          800: '#134e2d',
          900: '#0f4026',
        },
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #1f0f3f 0%, #411f7c 40%, #54299f 70%, #279a53 100%)',
        'brand-radial':
          'radial-gradient(1200px 600px at 10% -10%, rgba(109,63,191,0.35), transparent 60%),radial-gradient(900px 500px at 100% 10%, rgba(39,154,83,0.28), transparent 60%),linear-gradient(180deg,#150a2b 0%,#1f0f3f 100%)',
        'grid-fade':
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      boxShadow: {
        glow: '0 20px 60px -20px rgba(84,41,159,0.45)',
        'glow-green': '0 20px 60px -20px rgba(39,154,83,0.45)',
        card: '0 8px 30px -12px rgba(31,15,63,0.15)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'gradient-x': {
          '0%,100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'pulse-glow': {
          '0%,100%': { 'box-shadow': '0 0 0 0 rgba(109,63,191,0.55)' },
          '50%': { 'box-shadow': '0 0 0 18px rgba(109,63,191,0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        float: 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
