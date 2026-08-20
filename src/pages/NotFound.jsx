import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-brand-radial text-white relative overflow-hidden">
      <div className="hero-grid absolute inset-0 opacity-30" />
      <div className="absolute -top-20 -left-20 blob bg-brand-500 w-96 h-96 animate-float" />
      <div className="absolute -bottom-24 -right-16 blob bg-leaf-500 w-96 h-96" style={{ animationDelay: '1s' }} />
      <div className="container-page relative text-center max-w-xl">
        <Compass className="w-16 h-16 mx-auto mb-6 opacity-80" />
        <h1 className="font-display text-7xl md:text-8xl font-bold text-white">404</h1>
        <p className="mt-4 text-xl text-white/80">This page took a wrong turn.</p>
        <p className="mt-2 text-white/60">Let's get you back on the map.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-white/90 font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10">
              Contact us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
