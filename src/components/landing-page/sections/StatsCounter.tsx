import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatsCounterProps {
  stats?: Array<{
    number: string;
    label: string;
    description?: string;
    prefix?: string;
    suffix?: string;
  }>;
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'horizontal' | 'vertical';
  palette?: string;
  style?: string;
  isEditing?: boolean;
  onEdit?: () => void;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({
  stats = [
    { number: '50', suffix: 'K+', label: 'Usuários Ativos', description: 'Em todo o mundo' },
    { number: '99.9', suffix: '%', label: 'Uptime', description: 'Garantia de disponibilidade' },
    { number: '24', suffix: '/7', label: 'Suporte', description: 'Sempre disponível' },
    { number: '150', suffix: '+', label: 'Países', description: 'Presença global' },
  ],
  title = 'Números que Impressionam',
  subtitle = 'Confiança comprovada',
  layout = 'grid',
  palette = 'cyberpunk',
  style = 'glassmorphism',
  isEditing,
  onEdit,
}) => {
  const layoutClasses = {
    grid: 'grid grid-cols-2 lg:grid-cols-4 gap-8',
    horizontal: 'flex flex-wrap justify-center gap-12',
    vertical: 'flex flex-col gap-8 max-w-md mx-auto',
  };

  return (
    <div
      className={`py-20 px-6 bg-gradient-to-b from-black via-blue-950/10 to-black ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0">
            {subtitle}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
            {title}
          </h2>
        </div>

        <div className={layoutClasses[layout]}>
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/20 group-hover:to-blue-600/20 transition-all duration-500" />

              <div className="relative p-8 text-center">
                {/* Number */}
                <div className="mb-4">
                  <span className="text-6xl md:text-7xl font-black text-cyan-400 drop-shadow-lg">
                    {stat.prefix}{stat.number}
                  </span>
                  {stat.suffix && (
                    <span className="text-4xl md:text-5xl font-black text-cyan-300">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                  {stat.label}
                </h3>

                {/* Description */}
                {stat.description && (
                  <p className="text-sm text-gray-300 font-medium">
                    {stat.description}
                  </p>
                )}

                {/* Animated progress bar */}
                <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full transition-all duration-1000 group-hover:w-full"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              </div>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Confiado por empresas líderes mundiais</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-32 h-12 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
