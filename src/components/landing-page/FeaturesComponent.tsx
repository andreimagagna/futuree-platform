import React from 'react';
import { FeatureProps } from '@/types/LandingPage';
import { Target, TrendingUp, Users, Mail, MessageSquare, DollarSign, CheckCircle, Zap, Cloud, Phone } from 'lucide-react';

interface FeaturesComponentProps {
  props: {
    title?: string;
    subtitle?: string;
    features: FeatureProps[];
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

const ICON_MAP: Record<string, any> = {
  Target,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Zap,
  Cloud,
  Phone,
};

export function FeaturesComponent({ props, styles, isEditing, onEdit }: FeaturesComponentProps) {
  const { title, subtitle, features } = props;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon ? ICON_MAP[feature.icon] : null;
            
            return (
              <div
                key={index}
                className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
              >
                {IconComponent && (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Features
          </span>
        </div>
      )}
    </section>
  );
}
