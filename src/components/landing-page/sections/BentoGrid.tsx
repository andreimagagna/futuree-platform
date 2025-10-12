import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield, Award, TrendingUp } from 'lucide-react';

interface BentoGridProps {
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
    size?: 'small' | 'medium' | 'large';
    highlight?: boolean;
  }>;
  palette?: string;
  style?: string;
  isEditing?: boolean;
  onEdit?: () => void;
}

const iconMap: Record<string, any> = {
  check: Check,
  star: Star,
  zap: Zap,
  shield: Shield,
  award: Award,
  trending: TrendingUp,
};

export const BentoGrid: React.FC<BentoGridProps> = ({
  items = [
    { title: 'Performance Extrema', description: 'Velocidade incomparável', icon: 'zap', size: 'large', highlight: true },
    { title: 'Segurança Total', description: 'Proteção de dados', icon: 'shield', size: 'medium' },
    { title: 'Certificações', description: 'Padrões internacionais', icon: 'award', size: 'medium' },
    { title: 'Crescimento', description: 'Escalabilidade infinita', icon: 'trending', size: 'small' },
    { title: 'Qualidade', description: 'Excelência garantida', icon: 'star', size: 'small' },
    { title: 'Confiança', description: 'Aprovado por milhares', icon: 'check', size: 'medium' },
  ],
  palette = 'cyberpunk',
  style = 'glassmorphism',
  isEditing,
  onEdit,
}) => {
  const getSizeClasses = (size?: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'medium':
        return 'col-span-2 row-span-1';
      case 'small':
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <div
      className={`py-20 px-6 ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            Recursos Premium
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Tudo que você precisa
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Uma plataforma completa com recursos de última geração
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon || 'check'];
            
            return (
              <Card
                key={index}
                className={`
                  ${getSizeClasses(item.size)}
                  group relative overflow-hidden
                  backdrop-blur-xl bg-white/5 border-white/10
                  hover:bg-white/10 hover:border-white/20
                  transition-all duration-500 hover:scale-[1.02]
                  ${item.highlight ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30' : ''}
                `}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500" />
                
                {/* Background image if provided */}
                {item.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                )}

                <div className="relative h-full p-6 flex flex-col justify-between">
                  <div>
                    {Icon && (
                      <div className={`
                        inline-flex p-3 rounded-xl mb-4
                        bg-gradient-to-br from-purple-500 to-pink-500
                        transition-all duration-300
                        ${item.highlight ? 'scale-125' : ''}
                      `}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    
                    <h3 className={`
                      font-bold text-white mb-2 drop-shadow-lg
                      ${item.size === 'large' ? 'text-3xl' : 'text-xl'}
                    `}>
                      {item.title}
                    </h3>
                    
                    <p className={`
                      text-gray-200 font-medium
                      ${item.size === 'large' ? 'text-lg' : 'text-sm'}
                    `}>
                      {item.description}
                    </p>
                  </div>

                  {item.highlight && (
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white/20"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">+1000 usuários</span>
                    </div>
                  )}
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-[shimmer_2s_ease-in-out]" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
