import React from 'react';
import { TestimonialProps } from '@/types/LandingPage';
import { Star } from 'lucide-react';

interface TestimonialComponentProps {
  props: {
    title?: string;
    subtitle?: string;
    testimonials: TestimonialProps[];
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function TestimonialComponent({ props, styles, isEditing, onEdit }: TestimonialComponentProps) {
  const { title, subtitle, testimonials } = props;

  return (
    <section
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className="relative"
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Rating */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
              )}

              {/* Quote */}
              <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                    {testimonial.company && ` • ${testimonial.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Testimonials
          </span>
        </div>
      )}
    </section>
  );
}
