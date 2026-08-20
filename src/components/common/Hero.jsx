import { motion } from 'framer-motion';
import { fadeUp, stagger, revealOnce } from '@/lib/motion';

// Shared hero shell — used by every non-home page to keep visual rhythm.
// Home page uses its own richer hero.
export default function Hero({ eyebrow, title, subtitle, image, children, className = '' }) {
  return (
    <section className={`hero-shell ${className}`}>
      <div className="hero-grid absolute inset-0" />
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute -top-24 -left-24 blob bg-brand-500 w-[420px] h-[420px] animate-float" />
      <div className="absolute -bottom-32 -right-32 blob bg-leaf-500 w-[420px] h-[420px]" style={{ animationDelay: '1.5s' }} />

      <div className="container-page relative py-24 md:py-32">
        <motion.div variants={stagger()} {...revealOnce} className="max-w-3xl">
          {eyebrow && (
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-leaf-300 mb-4 font-semibold">
              {eyebrow}
            </motion.p>
          )}
          {title && (
            <motion.h1 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold leading-[1.05] text-white">
              {title}
            </motion.h1>
          )}
          {subtitle && (
            <motion.p variants={fadeUp} className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
