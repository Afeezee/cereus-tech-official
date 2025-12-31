import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const TestimonialCard = React.memo(({ testimonial }) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-2 hover:border-purple-900">
      <CardContent className="p-6">
        <div className="flex items-start space-x-1 mb-4">
          <Quote className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
          <blockquote className="text-gray-800 font-medium leading-relaxed">
            "{testimonial.quote}"
          </blockquote>
        </div>
        
        <div className="flex items-center space-x-4">
          {testimonial.author_photo ? (
            <img 
              src={testimonial.author_photo} 
              alt={testimonial.author_name}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-900 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {testimonial.author_name.charAt(0)}
            </div>
          )}
          
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {testimonial.author_name}
            </p>
            {testimonial.location && (
              <p className="text-sm text-gray-700">
                {testimonial.location}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;