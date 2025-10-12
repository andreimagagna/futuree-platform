import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Check } from 'lucide-react';

interface HeroSplitProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  primaryCTA: string;
  secondaryCTA?: string;
  image?: string;
  video?: string;
  layout?: 'image-right' | 'image-left';
  theme?: 'light' | 'dark';
  isEditing?: boolean;
  onEdit?: () => void;
}

export const HeroSplit: React.FC<HeroSplitProps> = ({
  badge,
  title,
  subtitle,
  description,
  features = [],
  primaryCTA,
  secondaryCTA,
  image,
  video,
  layout = 'image-right',
  theme = 'light',
  isEditing,
  onEdit,
}) => {
  const isDark = theme === 'dark';
  const isImageLeft = layout === 'image-left';

  return (
    <div
      className={`relative py-24 px-6 overflow-hidden ${
        isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      } ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          isImageLeft ? 'lg:grid-flow-dense' : ''
        }`}>
          {/* Content Side */}
          <div className={`space-y-8 ${isImageLeft ? 'lg:col-start-2' : ''}`}>
            {badge && (
              <Badge className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {badge}
              </Badge>
            )}

            {subtitle && (
              <p className="text-sm font-bold tracking-widest uppercase text-blue-600">
                {subtitle}
              </p>
            )}

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              {title}
            </h1>

            <p className={`text-xl md:text-2xl leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {description}
            </p>

            {features.length > 0 && (
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                {primaryCTA}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {secondaryCTA && (
                <Button
                  size="lg"
                  variant="outline"
                  className={`group px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    isDark
                      ? 'border-gray-700 text-white hover:bg-gray-900'
                      : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  {secondaryCTA}
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className={`flex items-center gap-6 pt-6 border-t ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="font-bold">10,000+ clientes satisfeitos</p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                  <span className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    4.9/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`relative ${isImageLeft ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {video ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source src={video} type="video/mp4" />
                </video>
              ) : image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <Play className="w-12 h-12" />
                    </div>
                    <p className="text-xl font-bold">Preview</p>
                  </div>
                </div>
              )}

              {/* Floating Elements */}
              <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold text-gray-900">1,234 online agora</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 px-6 py-4 rounded-xl bg-gray-900/90 backdrop-blur-xl text-white shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black">99.9%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                  <div className="w-px h-10 bg-gray-700" />
                  <div className="text-center">
                    <div className="text-3xl font-black">&lt;50ms</div>
                    <div className="text-xs text-gray-400">Response</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
