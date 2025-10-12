import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroProps } from '@/types/LandingPage';

interface HeroComponentProps {
  props: HeroProps;
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function HeroComponent({ props, styles, isEditing, onEdit }: HeroComponentProps) {
  const { title, subtitle, ctaText, ctaLink, backgroundImage, backgroundVideo, alignment, overlay, overlayOpacity } = props;

  return (
    <section
      className="relative overflow-hidden"
      style={styles}
      onClick={isEditing ? onEdit : undefined}
    >
      {/* Background Image/Video */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black z-0"
          style={{ opacity: overlayOpacity || 0.5 }}
        />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-4xl ${
            alignment === 'center' ? 'mx-auto text-center' : 
            alignment === 'right' ? 'ml-auto text-right' : 
            'text-left'
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90">
              {subtitle}
            </p>
          )}
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground text-lg px-8 py-6"
            onClick={() => ctaLink && (window.location.href = ctaLink)}
          >
            {ctaText}
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Hero Section
          </span>
        </div>
      )}
    </section>
  );
}
