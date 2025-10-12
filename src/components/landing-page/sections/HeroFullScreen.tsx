import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

interface HeroFullScreenProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  palette?: string;
  typography?: string;
  style?: string;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
  overlayOpacity?: number;
  isEditing?: boolean;
  onEdit?: () => void;
}

export const HeroFullScreen: React.FC<HeroFullScreenProps> = ({
  title,
  subtitle,
  description,
  primaryCTA = 'Começar Agora',
  secondaryCTA = 'Saiba Mais',
  backgroundImage,
  backgroundVideo,
  palette = 'cyberpunk',
  typography = 'modern',
  style = 'glassmorphism',
  alignment = 'center',
  overlay = true,
  overlayOpacity = 60,
  isEditing,
  onEdit,
}) => {
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  const typographyClasses = {
    modern: 'font-["Inter"]',
    elegant: 'font-["Playfair_Display"]',
    tech: 'font-["Space_Grotesk"]',
    minimal: 'font-["Helvetica_Neue"]',
    luxury: 'font-["Bodoni_Moda"]',
    creative: 'font-["Poppins"]',
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-center px-6 py-20 overflow-hidden ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      {/* Background */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : backgroundImage ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black" />
      )}

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
        />
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto w-full flex flex-col ${alignmentClasses[alignment]} gap-8`}>
        {subtitle && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-white tracking-wide">{subtitle}</span>
          </div>
        )}

        <h1
          className={`text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none ${typographyClasses[typography as keyof typeof typographyClasses]}`}
          style={{
            background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h1>

        {description && (
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            {primaryCTA}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="group backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl transition-all duration-300"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            {secondaryCTA}
          </Button>
        </div>

        {/* Stats or trust indicators */}
        <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-4xl font-black text-white">10K+</span>
            <span className="text-sm text-gray-400">Clientes Ativos</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-white">98%</span>
            <span className="text-sm text-gray-400">Satisfação</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-white">4.9/5</span>
            <span className="text-sm text-gray-400">Avaliação</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-white/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
