import React from 'react';
import { Button } from '@/components/ui/button';
import { PricingTierProps } from '@/types/LandingPage';
import { Check } from 'lucide-react';

interface PricingComponentProps {
  props: {
    title?: string;
    subtitle?: string;
    tiers: PricingTierProps[];
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function PricingComponent({ props, styles, isEditing, onEdit }: PricingComponentProps) {
  const { title, subtitle, tiers } = props;

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-lg border p-8 flex flex-col ${
                tier.highlighted
                  ? 'border-primary shadow-xl scale-105 bg-primary/5'
                  : 'bg-card'
              }`}
            >
              {tier.highlighted && (
                <div className="text-xs font-semibold text-primary mb-4 text-center uppercase tracking-wider">
                  Mais Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className="text-muted-foreground ml-2">{tier.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  tier.highlighted
                    ? 'bg-primary hover:bg-primary-hover text-primary-foreground'
                    : ''
                }`}
                variant={tier.highlighted ? 'default' : 'outline'}
                size="lg"
              >
                {tier.ctaText}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Pricing
          </span>
        </div>
      )}
    </section>
  );
}
