import React, { useState } from 'react';
import { FAQItem } from '@/types/LandingPage';
import { ChevronDown } from 'lucide-react';

interface FAQComponentProps {
  props: {
    title?: string;
    subtitle?: string;
    items: FAQItem[];
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function FAQComponent({ props, styles, isEditing, onEdit }: FAQComponentProps) {
  const { title, subtitle, items } = props;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isEditing) {
                    setOpenIndex(openIndex === index ? null : index);
                  }
                }}
              >
                <span className="font-semibold pr-8">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            FAQ
          </span>
        </div>
      )}
    </section>
  );
}
