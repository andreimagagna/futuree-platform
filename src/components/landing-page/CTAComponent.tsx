import React from 'react';
import { Button } from '@/components/ui/button';

interface CTAComponentProps {
  props: {
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function CTAComponent({ props, styles, isEditing, onEdit }: CTAComponentProps) {
  const { title, subtitle, ctaText, ctaLink, ctaSecondaryText, ctaSecondaryLink } = props;

  return (
    <section
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className="relative"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto opacity-90">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            onClick={() => ctaLink && (window.location.href = ctaLink)}
          >
            {ctaText}
          </Button>
          
          {ctaSecondaryText && (
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              onClick={() => ctaSecondaryLink && (window.location.href = ctaSecondaryLink)}
            >
              {ctaSecondaryText}
            </Button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            CTA
          </span>
        </div>
      )}
    </section>
  );
}
