/**
 * ============================================================================
 * PÁGINA DE IA - ASSISTENTE INTELIGENTE
 * ============================================================================
 * Página dedicada ao chat com IA integrado ao CRM
 * ============================================================================
 */

import { AIChat } from '@/components/AIChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, TrendingUp, Target, Lightbulb, Zap, Brain } from 'lucide-react';

export default function AI() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Análise de Pipeline',
      description: 'Insights sobre seu funil de vendas em tempo real',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      icon: Target,
      title: 'Leads Prioritários',
      description: 'Identifique oportunidades com maior potencial',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      icon: Lightbulb,
      title: 'Recomendações',
      description: 'Sugestões inteligentes para aumentar conversão',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      icon: Zap,
      title: 'Previsões',
      description: 'Estimativas de vendas e performance futura',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section com Gradiente */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
        
        <div className="relative container mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-xl shadow-primary/20 mb-6">
              <Bot className="h-12 w-12 text-white" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <h1 className="text-5xl font-black tracking-tight">
                  Assistente de <span className="text-primary">IA</span>
                </h1>
                <Badge className="gap-1.5 px-3 py-1.5 bg-primary text-white border-0">
                  <Sparkles className="h-4 w-4" />
                  Powered by AI
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Seu consultor inteligente de vendas. Analise dados, obtenha insights personalizados 
                e tome decisões estratégicas com o poder da Inteligência Artificial.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`border-2 ${feature.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 bg-card/50 backdrop-blur-sm`}
              >
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-xl ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center mb-4 shadow-sm`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Section - Full Width */}
      <div className="container mx-auto px-6 pb-12">
        <div className="w-full max-w-6xl mx-auto">
          <AIChat initialContext="insights" />
        </div>
      </div>

      {/* Info Cards - Bottom Section */}
      <div className="bg-muted/30 border-t">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Análise em tempo real dos seus dados do CRM</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Processamento de linguagem natural avançado</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Insights personalizados para seu negócio</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Respostas baseadas em dados concretos</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  Exemplos de Perguntas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                  <p>"Quais leads devo priorizar hoje?"</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                  <p>"Como está minha taxa de conversão?"</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                  <p>"Qual a previsão de vendas deste mês?"</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                  <p>"Que ações posso tomar para melhorar?"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" />
                  Capacidades da IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>Análise preditiva de vendas</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>Identificação de padrões de sucesso</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>Recomendações personalizadas</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>Alertas inteligentes de oportunidades</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
