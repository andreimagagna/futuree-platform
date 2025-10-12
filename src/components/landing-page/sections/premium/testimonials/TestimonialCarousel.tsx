import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

interface TestimonialCarouselProps {
  title?: string;
  subtitle?: string;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar?: string;
    rating: number;
    logo?: string;
  }>;
  theme?: 'light' | 'dark';
  isEditing?: boolean;
  onEdit?: () => void;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  title = 'O Que Nossos Clientes Dizem',
  subtitle = 'Histórias reais de sucesso',
  testimonials = [
    {
      quote: 'Esta plataforma transformou completamente nossa operação. Aumentamos a produtividade em 300% em apenas 3 meses.',
      author: 'Maria Silva',
      role: 'CEO',
      company: 'TechCorp',
      rating: 5,
    },
    {
      quote: 'O melhor investimento que fizemos este ano. O ROI foi impressionante e a equipe de suporte é excepcional.',
      author: 'João Santos',
      role: 'CTO',
      company: 'StartupXYZ',
      rating: 5,
    },
    {
      quote: 'Simplicidade e poder em uma única ferramenta. Nossa equipe adotou em dias e os resultados são incríveis.',
      author: 'Ana Costa',
      role: 'Product Manager',
      company: 'Innovation Labs',
      rating: 5,
    },
  ],
  theme = 'light',
  isEditing,
  onEdit,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`py-24 px-6 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-sm px-4 py-2">
            {subtitle}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight">
            {title}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200 shadow-xl'
              }`}
            >
              {/* Quote Icon */}
              <div className={`absolute top-6 right-6 ${
                isDark ? 'text-gray-700' : 'text-gray-200'
              }`}>
                <Quote className="w-16 h-16" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className={`text-lg leading-relaxed mb-8 font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  index % 3 === 0
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                    : index % 3 === 1
                    ? 'bg-gradient-to-br from-green-500 to-teal-500'
                    : 'bg-gradient-to-br from-orange-500 to-pink-500'
                }`}>
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg">{testimonial.author}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 hover:from-blue-500/5 hover:via-purple-500/5 hover:to-pink-500/5 transition-all duration-500 pointer-events-none rounded-lg" />
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={`mt-16 pt-12 border-t grid grid-cols-2 md:grid-cols-4 gap-8 text-center ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div>
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Clientes Ativos
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Avaliação Média
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Taxa de Satisfação
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Países Atendidos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
