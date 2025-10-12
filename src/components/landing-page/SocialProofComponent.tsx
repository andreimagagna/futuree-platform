import React from 'react';
import { SocialProofProps } from '@/types/LandingPage';

interface SocialProofComponentProps {
  props: SocialProofProps;
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function SocialProofComponent({ props, styles, isEditing, onEdit }: SocialProofComponentProps) {
  const { type, items } = props;

  return (
    <section
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className="relative"
    >
      <div className="container mx-auto px-4">
        {type === 'numbers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {items.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold">
                  {item.value}
                </div>
                <div className="text-sm md:text-base opacity-80">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {type === 'logos' && (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {items.map((item, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                {item.logo && (
                  <img
                    src={item.logo}
                    alt={item.label || ''}
                    className="h-8 md:h-12 object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {type === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-warning fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.label}
                </p>
                <p className="text-xs opacity-70">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Social Proof
          </span>
        </div>
      )}
    </section>
  );
}
