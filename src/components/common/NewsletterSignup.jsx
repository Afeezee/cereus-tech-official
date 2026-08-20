import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function NewsletterSignup({ className = '' }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.submissions.newsletter({
        email,
        first_name: firstName || null,
        source: window.location.pathname,
      });
      setDone(true);
      setEmail('');
      setFirstName('');
      toast.success('Thanks! You are on the list.');
      setTimeout(() => setDone(false), 5000);
    } catch (err) {
      toast.error(err.message || 'Could not subscribe — try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-leaf-300 text-sm">
        <CheckCircle className="w-5 h-5" />
        <span>Subscribed — check your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`space-y-3 ${className}`}>
      <Input
        placeholder="First name (optional)"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:border-leaf-400"
      />
      <Input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:border-leaf-400"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-leaf-600 hover:bg-leaf-700 text-white font-semibold"
      >
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Subscribing…</> : 'Subscribe'}
      </Button>
      <p className="text-xs text-white/50">We respect your privacy. Unsubscribe any time.</p>
    </form>
  );
}
