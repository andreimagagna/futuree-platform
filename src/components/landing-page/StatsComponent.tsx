import React from 'react';
import { TrendingUp, Users, DollarSign, Award, Target, Zap } from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: string;
  trend?: number; // percentage change
  color?: string;
}

interface StatsComponentProps {
  props: {
    title?: string;
    subtitle?: string;
    stats?: StatItem[];
    layout?: 'horizontal' | 'grid' | 'cards';
    animated?: boolean;
    showIcons?: boolean;
    showTrends?: boolean;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function StatsComponent({ props, styles, isEditing, onEdit }: StatsComponentProps) {
  const {
    title,
    subtitle,
    stats = [],
    layout = 'grid',
    animated = true,
    showIcons = true,
    showTrends = true,
  } = props;

  const [isVisible, setIsVisible] = React.useState(false);
  const [animatedValues, setAnimatedValues] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getIcon = (iconName?: string) => {
    const iconProps = { className: 'w-8 h-8' };
    switch (iconName) {
      case 'users':
        return <Users {...iconProps} />;
      case 'dollar':
        return <DollarSign {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'trending':
        return <TrendingUp {...iconProps} />;
      default:
        return <TrendingUp {...iconProps} />;
    }
  };

  React.useEffect(() => {
    if (!animated) {
      setIsVisible(true);
      setAnimatedValues(stats.map((stat) => stat.value));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateNumbers();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animated, stats]);

  const animateNumbers = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
      if (isNaN(numericValue)) {
        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = stat.value;
          return newValues;
        });
        return;
      }

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentValue = Math.floor(numericValue * progress);

        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = currentValue.toLocaleString();
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues((prev) => {
            const newValues = [...prev];
            newValues[index] = stat.value;
            return newValues;
          });
        }
      }, stepDuration);
    });
  };

  if (stats.length === 0) {
    return (
      <div
        style={styles}
        onClick={isEditing ? onEdit : undefined}
        className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="bg-muted rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Adicione estatísticas</p>
          </div>
        </div>
        {isEditing && (
          <div className="absolute top-2 right-2 z-20">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              Estatísticas
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {/* Horizontal Layout */}
        {layout === 'horizontal' && (
          <div className="flex flex-wrap justify-around items-center gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {showIcons && stat.icon && (
                  <div
                    className="mb-4"
                    style={{ color: stat.color || 'hsl(25, 40%, 35%)' }}
                  >
                    {getIcon(stat.icon)}
                  </div>
                )}
                <div className="text-4xl font-bold mb-2">
                  {stat.prefix}
                  {animated && isVisible ? animatedValues[index] || stat.value : stat.value}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
                {showTrends && stat.trend !== undefined && (
                  <div
                    className={`text-sm mt-2 flex items-center gap-1 ${
                      stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <TrendingUp
                      className={`w-4 h-4 ${stat.trend < 0 ? 'rotate-180' : ''}`}
                    />
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                {showIcons && stat.icon && (
                  <div
                    className="mb-4 flex justify-center"
                    style={{ color: stat.color || 'hsl(25, 40%, 35%)' }}
                  >
                    {getIcon(stat.icon)}
                  </div>
                )}
                <div className="text-4xl font-bold mb-2">
                  {stat.prefix}
                  {animated && isVisible ? animatedValues[index] || stat.value : stat.value}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
                {showTrends && stat.trend !== undefined && (
                  <div
                    className={`text-sm mt-2 flex items-center justify-center gap-1 ${
                      stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <TrendingUp
                      className={`w-4 h-4 ${stat.trend < 0 ? 'rotate-180' : ''}`}
                    />
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cards Layout */}
        {layout === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  {showIcons && stat.icon && (
                    <div style={{ color: stat.color || 'hsl(25, 40%, 35%)' }}>
                      {getIcon(stat.icon)}
                    </div>
                  )}
                  {showTrends && stat.trend !== undefined && (
                    <div
                      className={`text-sm flex items-center gap-1 ${
                        stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <TrendingUp
                        className={`w-4 h-4 ${stat.trend < 0 ? 'rotate-180' : ''}`}
                      />
                      {Math.abs(stat.trend)}%
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold mb-1">
                  {stat.prefix}
                  {animated && isVisible ? animatedValues[index] || stat.value : stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Estatísticas
          </span>
        </div>
      )}
    </div>
  );
}
