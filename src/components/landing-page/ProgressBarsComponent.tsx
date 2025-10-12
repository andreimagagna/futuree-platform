import React from 'react';

interface ProgressItem {
  label: string;
  value: number; // 0-100
  color?: string;
  showValue?: boolean;
}

interface ProgressBarsComponentProps {
  props: {
    title?: string;
    subtitle?: string;
    items?: ProgressItem[];
    animated?: boolean;
    style?: 'bar' | 'circular' | 'semi-circular';
    height?: number;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function ProgressBarsComponent({
  props,
  styles,
  isEditing,
  onEdit,
}: ProgressBarsComponentProps) {
  const {
    title = 'Nossas Habilidades',
    subtitle,
    items = [],
    animated = true,
    style = 'bar',
    height = 12,
  } = props;

  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!animated) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  if (items.length === 0) {
    return (
      <div
        style={styles}
        onClick={isEditing ? onEdit : undefined}
        className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="bg-muted rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Adicione barras de progresso</p>
          </div>
        </div>
        {isEditing && (
          <div className="absolute top-2 right-2 z-20">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              Barras de Progresso
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

        {/* Progress Bars */}
        {style === 'bar' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{item.label}</span>
                  {item.showValue !== false && (
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  )}
                </div>
                <div
                  className="w-full bg-muted rounded-full overflow-hidden"
                  style={{ height: `${height}px` }}
                >
                  <div
                    className={`h-full rounded-full ${
                      animated ? 'transition-all duration-1000 ease-out' : ''
                    }`}
                    style={{
                      width: isVisible ? `${item.value}%` : '0%',
                      backgroundColor: item.color || 'hsl(25, 40%, 35%)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Circular Progress */}
        {style === 'circular' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item, index) => {
              const radius = 60;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = isVisible
                ? circumference - (item.value / 100) * circumference
                : circumference;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative w-40 h-40">
                    <svg className="transform -rotate-90 w-full h-full">
                      {/* Background circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="12"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={item.color || 'hsl(25, 40%, 35%)'}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={animated ? 'transition-all duration-1000 ease-out' : ''}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{item.value}%</span>
                    </div>
                  </div>
                  <span className="mt-4 font-semibold text-center">{item.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Semi-Circular Progress */}
        {style === 'semi-circular' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item, index) => {
              const radius = 60;
              const circumference = Math.PI * radius;
              const strokeDashoffset = isVisible
                ? circumference - (item.value / 100) * circumference
                : circumference;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative w-40 h-24">
                    <svg className="w-full h-full" viewBox="0 0 160 100">
                      {/* Background arc */}
                      <path
                        d={`M 20 80 A ${radius} ${radius} 0 0 1 140 80`}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                      {/* Progress arc */}
                      <path
                        d={`M 20 80 A ${radius} ${radius} 0 0 1 140 80`}
                        fill="none"
                        stroke={item.color || 'hsl(25, 40%, 35%)'}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={animated ? 'transition-all duration-1000 ease-out' : ''}
                      />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <span className="text-2xl font-bold">{item.value}%</span>
                    </div>
                  </div>
                  <span className="mt-4 font-semibold text-center">{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Barras de Progresso
          </span>
        </div>
      )}
    </div>
  );
}
