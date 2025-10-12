import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InteractiveShowcaseProps {
  title?: string;
  subtitle?: string;
  tabs?: Array<{
    name: string;
    title: string;
    description: string;
    image?: string;
    video?: string;
    features?: string[];
  }>;
  palette?: string;
  isEditing?: boolean;
  onEdit?: () => void;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({
  title = 'Explore Recursos',
  subtitle = 'Tecnologia de ponta',
  tabs = [
    {
      name: 'Dashboard',
      title: 'Analytics Avançado',
      description: 'Visualize seus dados em tempo real com dashboards interativos e personalizáveis',
      features: ['Gráficos em tempo real', 'Filtros avançados', 'Exportação de dados', 'Alertas customizáveis'],
    },
    {
      name: 'Automação',
      title: 'Fluxos Inteligentes',
      description: 'Automatize processos complexos com nossa engine de workflow visual',
      features: ['Drag & Drop', 'Templates prontos', 'Integrações', 'Triggers customizados'],
    },
    {
      name: 'API',
      title: 'Integração Total',
      description: 'API RESTful completa com documentação interativa e SDKs em múltiplas linguagens',
      features: ['REST & GraphQL', 'Webhooks', 'Rate limiting', 'Autenticação OAuth'],
    },
  ],
  palette = 'cyberpunk',
  isEditing,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      className={`py-20 px-6 bg-gradient-to-b from-black via-purple-950/20 to-black ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={onEdit}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            {subtitle}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            {title}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab, index) => (
            <Button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
                px-8 py-6 text-lg rounded-xl font-semibold transition-all duration-300
                ${activeTab === index
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-105'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {tab.name}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <div className="space-y-8">
            <div>
              <h3 className="text-4xl font-black text-white mb-4">
                {tabs[activeTab].title}
              </h3>
              <p className="text-xl text-gray-100 leading-relaxed">
                {tabs[activeTab].description}
              </p>
            </div>

            {tabs[activeTab].features && (
              <div className="space-y-3">
                {tabs[activeTab].features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Experimentar Agora
            </Button>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10 p-8 shadow-2xl">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-[gradient_8s_ease_infinite]" />
              
              {tabs[activeTab].video ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative z-10 rounded-xl w-full"
                >
                  <source src={tabs[activeTab].video} type="video/mp4" />
                </video>
              ) : tabs[activeTab].image ? (
                <img
                  src={tabs[activeTab].image}
                  alt={tabs[activeTab].title}
                  className="relative z-10 rounded-xl w-full"
                />
              ) : (
                <div className="relative z-10 aspect-video rounded-xl bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" />
                    </div>
                    <p className="text-white text-lg font-semibold">{tabs[activeTab].name}</p>
                  </div>
                </div>
              )}

              {/* Floating elements */}
              <div className="absolute top-4 right-4 p-3 rounded-lg bg-green-500/20 backdrop-blur-xl border border-green-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400 font-semibold">LIVE</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 p-4 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                  <div>
                    <p className="text-white text-sm font-semibold">99.9% Uptime</p>
                    <p className="text-gray-200 text-xs">Última atualização: agora</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
