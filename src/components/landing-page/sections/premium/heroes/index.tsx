// Premium Hero Components - Multiple variations
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Check, Sparkles } from 'lucide-react';

// HERO MINIMAL - Clean typography-focused hero
interface HeroMinimalProps {
  badge?: string;
  title: string;
  description: string;
  primaryCTA: string;
  secondaryCTA?: string;
  stats?: Array<{ value: string; label: string }>;
  theme?: 'light' | 'dark';
  isEditing?: boolean;
  onEdit?: () => void;
}

export const HeroMinimal: React.FC<HeroMinimalProps> = ({
  badge,
  title,
  description,
  primaryCTA,
  secondaryCTA,
  stats = [],
  theme = 'light',
  isEditing,
  onEdit,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`py-32 px-6 ${
        isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      } ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      <div className="max-w-5xl mx-auto text-center">
        {badge && (
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm px-6 py-2 font-bold">
            {badge}
          </Badge>
        )}

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-8">
          {title}
        </h1>

        <p className={`text-2xl md:text-3xl leading-relaxed max-w-4xl mx-auto mb-12 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            {primaryCTA}
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>

          {secondaryCTA && (
            <Button
              size="lg"
              variant="outline"
              className={`px-10 py-7 text-xl font-semibold rounded-2xl transition-all duration-300 ${
                isDark
                  ? 'border-gray-700 text-white hover:bg-gray-900'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Play className="mr-3 w-6 h-6" />
              {secondaryCTA}
            </Button>
          )}
        </div>

        {stats.length > 0 && (
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// HERO GRADIENT - Dynamic gradient background hero
interface HeroGradientProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  primaryCTA: string;
  features?: string[];
  gradientFrom?: string;
  gradientTo?: string;
  isEditing?: boolean;
  onEdit?: () => void;
}

export const HeroGradient: React.FC<HeroGradientProps> = ({
  badge,
  title,
  subtitle,
  description,
  primaryCTA,
  features = [],
  gradientFrom = 'from-blue-600',
  gradientTo = 'to-purple-600',
  isEditing,
  onEdit,
}) => {
  return (
    <div
      className={`relative py-32 px-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white overflow-hidden ${
        isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={onEdit}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <Badge className="mb-6 bg-white/20 backdrop-blur-xl text-white border-white/30 text-sm px-6 py-2 font-bold">
              <Sparkles className="w-4 h-4 mr-2" />
              {badge}
            </Badge>
          )}

          {subtitle && (
            <p className="text-lg font-bold uppercase tracking-widest text-white/90 mb-4">
              {subtitle}
            </p>
          )}

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-8">
            {title}
          </h1>

          <p className="text-2xl md:text-3xl leading-relaxed mb-12 text-white/90">
            {description}
          </p>

          {features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20"
                >
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          )}

          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-8 text-xl font-black rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {primaryCTA}
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>

          <p className="text-sm text-white/70 mt-6">
            ✓ Sem cartão de crédito  •  ✓ 14 dias grátis  •  ✓ Cancele quando quiser
          </p>
        </div>
      </div>
    </div>
  );
};

// HERO VIDEO - Full video background hero
interface HeroVideoProps {
  videoUrl?: string;
  overlayOpacity?: number;
  title: string;
  description: string;
  primaryCTA: string;
  secondaryCTA?: string;
  trustIndicators?: string[];
  isEditing?: boolean;
  onEdit?: () => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoUrl,
  overlayOpacity = 60,
  title,
  description,
  primaryCTA,
  secondaryCTA,
  trustIndicators = [],
  isEditing,
  onEdit,
}) => {
  return (
    <div
      className={`relative min-h-screen flex items-center justify-center px-6 overflow-hidden ${
        isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={onEdit}
    >
      {/* Video Background */}
      {videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-8 drop-shadow-2xl">
          {title}
        </h1>

        <p className="text-2xl md:text-3xl leading-relaxed mb-12 text-white/90 drop-shadow-lg">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-8 text-xl font-black rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {primaryCTA}
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>

          {secondaryCTA && (
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-8 text-xl font-bold rounded-2xl backdrop-blur-xl transition-all duration-300"
            >
              <Play className="mr-3 w-6 h-6" />
              {secondaryCTA}
            </Button>
          )}
        </div>

        {trustIndicators.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className="text-sm font-semibold text-white/80 flex items-center gap-2"
              >
                <Check className="w-5 h-5 text-green-400" />
                {indicator}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-white/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
