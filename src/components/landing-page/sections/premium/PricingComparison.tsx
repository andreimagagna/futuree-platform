import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, X } from 'lucide-react';

interface PricingComparisonProps {
  title?: string;
  subtitle?: string;
  plans?: Array<{
    name: string;
    price: string;
    period?: string;
    description: string;
    popular?: boolean;
    features: Array<{
      name: string;
      included: boolean;
      description?: string;
    }>;
    cta: string;
    highlight?: boolean;
  }>;
  theme?: 'light' | 'dark';
  isEditing?: boolean;
  onEdit?: () => void;
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({
  title = 'Planos e Preços',
  subtitle = 'Escolha o plano perfeito para você',
  plans = [
    {
      name: 'Starter',
      price: 'Grátis',
      period: 'para sempre',
      description: 'Perfeito para começar',
      features: [
        { name: '5 projetos', included: true },
        { name: '10GB armazenamento', included: true },
        { name: 'Suporte por email', included: true },
        { name: 'API access', included: false },
        { name: 'Prioridade', included: false },
      ],
      cta: 'Começar Grátis',
    },
    {
      name: 'Professional',
      price: 'R$ 99',
      period: '/mês',
      description: 'Para profissionais sérios',
      popular: true,
      highlight: true,
      features: [
        { name: 'Projetos ilimitados', included: true },
        { name: '100GB armazenamento', included: true },
        { name: 'Suporte prioritário', included: true },
        { name: 'API access completo', included: true },
        { name: 'Prioridade máxima', included: false },
      ],
      cta: 'Começar Teste Grátis',
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      period: '',
      description: 'Para grandes equipes',
      features: [
        { name: 'Tudo ilimitado', included: true },
        { name: 'Armazenamento ilimitado', included: true },
        { name: 'Suporte dedicado 24/7', included: true },
        { name: 'API personalizado', included: true },
        { name: 'SLA garantido', included: true },
      ],
      cta: 'Falar com Vendas',
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
        isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
      } ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm px-4 py-2">
            Preços Transparentes
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            {title}
          </h2>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-100' : 'text-gray-700'
          }`}>
            {subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.highlight
                  ? 'ring-2 ring-blue-600 shadow-2xl shadow-blue-500/50 transform scale-105'
                  : isDark
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
                    MAIS POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{plan.price}</span>
                    {plan.period && (
                      <span className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className={`w-full mb-8 font-bold py-6 rounded-xl transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : isDark
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Features List */}
                <div className="space-y-4">
                  <p className={`text-sm font-bold uppercase tracking-wider mb-4 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    O que está incluído:
                  </p>
                  {plan.features.map((feature, fIndex) => (
                    <div
                      key={fIndex}
                      className={`flex items-start gap-3 ${
                        !feature.included ? 'opacity-50' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included
                          ? 'bg-green-100 text-green-600'
                          : isDark
                          ? 'bg-gray-800 text-gray-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {feature.name}
                        </p>
                        {feature.description && (
                          <p className={`text-xs mt-1 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight Border */}
              {plan.highlight && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 pointer-events-none" />
              )}
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Todos os planos incluem 14 dias de teste grátis. Sem cartão de crédito necessário.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Cancele quando quiser
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Suporte dedicado
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Atualizações gratuitas
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
