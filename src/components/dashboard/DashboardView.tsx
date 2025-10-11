import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, MessageSquare, FileText, TrendingUp, Sparkles, CheckCircle2, DollarSign, Shield, Lightbulb, Clock } from "lucide-react";
import { useStore } from "@/store/useStore";

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export const DashboardView = ({ onNavigate }: DashboardViewProps = {}) => {
  const { leads, tasks } = useStore();
  
  const stats = {
    leads: leads.length,
    qualified: leads.filter(l => l.stage !== 'captured').length,
    active: tasks.filter(t => t.status !== 'done').length,
  };

  const methodology = [
    { 
      step: 1, 
      title: "Captura", 
      subtitle: "Identificação",
      icon: Target, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      description: "Capture leads de múltiplos canais"
    },
    { 
      step: 2, 
      title: "Qualificação BANT", 
      subtitle: "Budget, Authority, Need, Timeline",
      icon: Users, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      description: "Qualifique usando critérios BANT"
    },
    { 
      step: 3, 
      title: "Contato Estratégico", 
      subtitle: "Relacionamento",
      icon: MessageSquare, 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      description: "Engaje com decisores qualificados"
    },
    { 
      step: 4, 
      title: "Proposta", 
      subtitle: "Apresentação",
      icon: FileText, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10",
      description: "Envie proposta personalizada"
    },
    { 
      step: 5, 
      title: "Fechamento", 
      subtitle: "Conversão",
      icon: TrendingUp, 
      color: "text-pink-500", 
      bg: "bg-pink-500/10",
      description: "Negocie e feche o negócio"
    },
  ];

  const bantCriteria = [
    {
      letter: "B",
      title: "Budget",
      subtitle: "Orçamento",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      question: "O lead tem verba aprovada?"
    },
    {
      letter: "A",
      title: "Authority",
      subtitle: "Autoridade",
      icon: Shield,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      question: "Está falando com o decisor?"
    },
    {
      letter: "N",
      title: "Need",
      subtitle: "Necessidade",
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      question: "Existe uma dor real identificada?"
    },
    {
      letter: "T",
      title: "Timeline",
      subtitle: "Prazo",
      icon: Clock,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      question: "Quando precisam da solução?"
    },
  ];

  const verticals = [
    {
      title: "Gestão de Leads",
      description: "Captura, organização e qualificação inteligente de leads",
      icon: Users,
      count: stats.leads,
      color: "primary",
      route: "crm"
    },
    {
      title: "Funil de Qualificação",
      description: "Metodologia passo a passo para converter leads em clientes",
      icon: Target,
      count: stats.qualified,
      color: "accent",
      route: "funnel"
    },
    {
      title: "Tarefas & Projetos",
      description: "Organize seu trabalho e acompanhe o progresso",
      icon: CheckCircle2,
      count: stats.active,
      color: "success",
      route: "tasks"
    },
    {
      title: "Agente SDR Inteligente",
      description: "Automação com IA para qualificação e follow-up",
      icon: Sparkles,
      count: 0,
      color: "warning",
      route: "agent"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-accent p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-4xl">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-0">
            CRM Inteligente com Metodologia BANT
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Qualificação e Conversão Passo a Passo
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            Plataforma completa que une tecnologia, processo comercial estruturado com BANT e múltiplas vertentes para transformar leads qualificados em clientes.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.leads}</div>
              <div className="text-sm text-white/80">Leads Totais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.qualified}</div>
              <div className="text-sm text-white/80">Qualificados BANT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.active}</div>
              <div className="text-sm text-white/80">Tarefas Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{Math.round((stats.qualified / stats.leads) * 100) || 0}%</div>
              <div className="text-sm text-white/80">Taxa Qualificação</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => onNavigate?.('funnel')}
            >
              Ver Funil BANT
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => onNavigate?.('crm')}
            >
              Gerenciar Leads
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* BANT Framework */}
      <div>
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3 text-lg px-4 py-1">
            Metodologia BANT
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Qualificação Inteligente de Leads</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use os 4 critérios BANT para qualificar seus leads e focar nos que realmente têm potencial de conversão
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {bantCriteria.map((criterion) => {
            const Icon = criterion.icon;
            return (
              <Card key={criterion.letter} className="hover:shadow-lg transition-all border-2 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${criterion.bg}`}>
                      <Icon className={`h-6 w-6 ${criterion.color}`} />
                    </div>
                    <div className={`text-4xl font-bold ${criterion.color}`}>
                      {criterion.letter}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="font-bold text-lg">{criterion.title}</div>
                    <div className="text-sm text-muted-foreground">{criterion.subtitle}</div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    {criterion.question}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Methodology Flow */}
      <div>
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3">
            Processo Comercial
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">5 Etapas do Lead ao Cliente</h2>
          <p className="text-muted-foreground">
            Um fluxo estruturado que guia seus leads da captura ao fechamento, com foco em qualificação BANT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {methodology.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="relative hover:shadow-lg transition-all group">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bg} mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Etapa {step.step}
                    </div>
                    <div className="font-bold text-lg mb-1">{step.title}</div>
                    <div className="text-xs text-muted-foreground font-medium mb-2">
                      {step.subtitle}
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
                {index < methodology.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="bg-background rounded-full p-1">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Verticals */}
      <div>
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3">
            Múltiplas Vertentes
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Tudo que Você Precisa em Um Só Lugar</h2>
          <p className="text-muted-foreground">
            Ferramentas integradas para cada etapa do seu processo de vendas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {verticals.map((vertical) => {
            const Icon = vertical.icon;
            return (
              <Card 
                key={vertical.title} 
                className="group hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50"
                onClick={() => onNavigate?.(vertical.route)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-${vertical.color}/10`}>
                      <Icon className={`h-7 w-7 text-${vertical.color}`} />
                    </div>
                    {vertical.count > 0 && (
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {vertical.count}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {vertical.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{vertical.description}</p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.(vertical.route);
                    }}
                  >
                    Acessar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Process Highlight */}
      <Card className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-accent/5 border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Por que BANT funciona?</h3>
              <p className="text-muted-foreground mb-4">
                A metodologia BANT ajuda você a focar nos leads com maior potencial de conversão, economizando tempo e aumentando sua taxa de fechamento.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm">Qualificação objetiva e estruturada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm">Foco em leads com real potencial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm">Processo comercial previsível e escalável</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Button 
                size="lg" 
                onClick={() => onNavigate?.('funnel')}
                className="text-lg"
              >
                Começar Qualificação
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
