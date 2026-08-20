import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteContent } from '@/lib/site-content';

// Rules-based FAQ chatbot — no API key required. Answers common questions
// using site content; falls back to a "contact us" prompt for anything else.
export default function Chatbot() {
  const { content } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content:
        `Hi! I'm the Cereus assistant. Ask me about our products, services, academy, careers, or how to get in touch.`,
    },
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  const answer = (q) => {
    const t = q.toLowerCase();
    const contact = content.contact || {};
    if (/(contact|reach|email|phone|call|talk)/.test(t)) {
      return `You can reach us at ${contact.email || 'info@cereustechnologies.com'} or ${contact.phone || '+234 701 462 3270'}. Business hours: ${contact.hours || 'Mon–Fri 9am–5pm WAT'}.`;
    }
    if (/(product|solution|platform)/.test(t)) {
      return `We build products across Health, Education and Environment. Visit /products for the full catalogue — each product page has a live demo link where available.`;
    }
    if (/(service|consulting|development|hire)/.test(t)) {
      return `We offer custom software, AI/ML, digital transformation consulting, product design and IT support. See /services for details, or head to /contact to start a scoping call.`;
    }
    if (/(academy|course|training|learn|teach|instructor)/.test(t)) {
      return `Cereus Academy trains the next wave of African tech talent. Enroll or apply to teach at /academy.`;
    }
    if (/(career|job|position|hiring|apply|work)/.test(t)) {
      return `Open roles and applications live at /careers. We're always keen to meet great engineers, designers and researchers.`;
    }
    if (/(insight|blog|article|news|resource)/.test(t)) {
      return `Read our team's write-ups at /insights.`;
    }
    if (/(about|company|team|history|founder)/.test(t)) {
      return `Cereus Technologies was founded in 2016 in Lagos and has served 50+ clients across 12 countries. Meet the team at /about.`;
    }
    if (/(hello|hi|hey|good (morning|afternoon|evening))/.test(t)) {
      return `Hey! What can I help you find today? Try "products", "services", "academy", or "careers".`;
    }
    return `Great question — I don't have that off-hand. Please reach the team at ${contact.email || 'info@cereustechnologies.com'} or ${contact.phone || '+234 701 462 3270'} and someone will get back within 24 hours.`;
  };

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { type: 'user', content: q }, { type: 'bot', content: answer(q) }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-3 w-[340px] h-[460px] rounded-2xl overflow-hidden shadow-glow bg-white border border-slate-200 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-brand-gradient text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-sm">Cereus Assistant</p>
                  <p className="text-[11px] text-white/70">Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={bodyRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${m.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${m.type === 'user' ? 'bg-leaf-600' : 'bg-brand-800'}`}>
                      {m.type === 'user' ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-white" />}
                    </div>
                    <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.type === 'user' ? 'bg-leaf-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500 flex items-center gap-3">
              <Phone className="w-3 h-3 text-brand-700" />{content.contact?.phone}
              <Mail className="w-3 h-3 text-brand-700" />{content.contact?.email}
            </div>

            <div className="border-t border-slate-200 p-2 flex gap-2 bg-white">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                placeholder="Ask a question…"
                className="text-sm"
              />
              <Button size="sm" onClick={send} className="bg-brand-800 hover:bg-brand-900">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-brand-gradient text-white shadow-glow flex items-center justify-center hover:scale-105 transition-transform animate-pulse-glow"
        aria-label="Open chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
