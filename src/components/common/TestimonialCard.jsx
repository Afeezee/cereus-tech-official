import { memo } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp } from '@/lib/motion';

const TestimonialCard = memo(function TestimonialCard({ testimonial }) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="h-full glass lift">
        <CardContent className="p-6 flex flex-col h-full">
          <Quote className="w-8 h-8 text-brand-300 mb-3" />
          <blockquote className="text-slate-700 leading-relaxed flex-grow">
            "{testimonial.quote}"
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            {testimonial.author_photo ? (
              <img
                src={testimonial.author_photo}
                alt={testimonial.author_name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-brand-gradient text-white flex items-center justify-center font-semibold">
                {(testimonial.author_name || '?').charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-brand-900 text-sm">{testimonial.author_name}</p>
              {testimonial.location && (
                <p className="text-xs text-slate-500">{testimonial.location}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default TestimonialCard;
