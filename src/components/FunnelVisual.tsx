import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStore, FunnelCategory } from "@/store/useStore";
import { 
  ArrowRight,
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Target,
  Filter,
  ChevronDown,
  AlertCircle,
  Layers,
  ShoppingCart,
  ExternalLink,
  Award,
  BarChart3,
  Zap,
  Clock,
  Percent,
  XCircle,
  CheckCircle,
  Timer,
  Activity,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Lead } from "@/store/useStore";
import { useNavigate } from "react-router-dom";

interface CategoryMetric {
  category: FunnelCategory;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  count: number;
  totalValue: number;
  leads: Lead[];
  conversionRate: number;
  stageNames: string[];
}

// Função inteligente para categorizar etapas automaticamente
// 🧠 Usa múltiplas heurísticas: palavras-chave, posição, padrões semânticos
const inferStageCategory = (stageName: string, order: number, totalStages: number): FunnelCategory => {
  const lowerName = stageName.toLowerCase();
  
  // Score system para categorização mais precisa
  const scores = {
    topo: 0,
    meio: 0,
    fundo: 0,
    vendas: 0,
  };
  
  // ============================================
  // VENDAS - Palavras-chave (peso: 10)
  // ============================================
  const vendasKeywords = [
    'fechamento', 'closing', 'fechado', 'closed', 'won', 'ganho',
    'negociação', 'negotiation', 'proposta', 'proposal',
    'contrato', 'contract', 'assinatura', 'signature',
    'aprovação', 'approval', 'venda', 'sale',
  ];
  
  if (vendasKeywords.some(kw => lowerName.includes(kw))) {
    scores.vendas += 10;
  }
  
  // ============================================
  // TOPO - Palavras-chave (peso: 10)
  // ============================================
  const topoKeywords = [
    'capturado', 'captured', 'lead', 'novo', 'new',
    'prospect', 'primeiro', 'first', 'entrada', 'entry',
    'inicial', 'initial', 'origem', 'source', 'inbound',
  ];
  
  if (topoKeywords.some(kw => lowerName.includes(kw))) {
    scores.topo += 10;
  }
  
  // ============================================
  // MEIO - Palavras-chave (peso: 10)
  // ============================================
  const meioKeywords = [
    'qualif', 'discovery', 'demo', 'apresentação', 'presentation',
    'análise', 'analysis', 'pesquisa', 'research',
    'exploração', 'exploration', 'diagnóstico', 'diagnostic',
    'reunião', 'meeting', 'call',
  ];
  
  if (meioKeywords.some(kw => lowerName.includes(kw))) {
    scores.meio += 10;
  }
  
  // ============================================
  // FUNDO - Palavras-chave (peso: 10)
  // ============================================
  const fundoKeywords = [
    'contato', 'contact', 'poc', 'prova', 'trial', 'teste',
    'avaliação', 'evaluation', 'validação', 'validation',
    'piloto', 'pilot', 'experimento', 'experiment',
  ];
  
  if (fundoKeywords.some(kw => lowerName.includes(kw))) {
    scores.fundo += 10;
  }
  
  // ============================================
  // Análise de padrões numéricos
  // ============================================
  const numberMatch = lowerName.match(/\d+/);
  if (numberMatch) {
    const number = parseInt(numberMatch[0]);
    if (number === 1) scores.topo += 3;
    else if (number === 2 || number === 3) scores.meio += 3;
    else if (number === 4 || number === 5) scores.fundo += 3;
    else if (number >= 6) scores.vendas += 3;
  }
  
  // ============================================
  // Análise de posição relativa (peso: 5)
  // ============================================
  const position = totalStages > 1 ? order / (totalStages - 1) : 0;
  
  if (position < 0.2) scores.topo += 5;
  else if (position < 0.45) scores.meio += 5;
  else if (position < 0.7) scores.fundo += 5;
  else scores.vendas += 5;
  
  // ============================================
  // Análise semântica avançada
  // ============================================
  
  // Verbos de ação inicial → Topo
  if (/^(criar|captur|cadastr|adicion|registr)/i.test(lowerName)) {
    scores.topo += 4;
  }
  
  // Verbos de análise → Meio
  if (/^(analis|avali|qualif|revis|estud)/i.test(lowerName)) {
    scores.meio += 4;
  }
  
  // Verbos de teste → Fundo
  if (/^(test|valid|experiment|prov)/i.test(lowerName)) {
    scores.fundo += 4;
  }
  
  // Verbos de conclusão → Vendas
  if (/^(fech|finali|conclu|aprova|assin)/i.test(lowerName)) {
    scores.vendas += 4;
  }
  
  // ============================================
  // Detecção de padrões de fluxo de trabalho
  // ============================================
  
  // Padrão MQL/SQL (Marketing/Sales Qualified Lead)
  if (lowerName.includes('mql')) scores.meio += 6;
  if (lowerName.includes('sql')) scores.fundo += 6;
  
  // Padrão BANT (Budget, Authority, Need, Timeline)
  if (lowerName.includes('bant')) scores.meio += 6;
  
  // Padrão de pipeline comum
  if (lowerName.includes('oportunidade') || lowerName.includes('opportunity')) {
    scores.meio += 3;
  }
  
  // ============================================
  // Retornar categoria com maior score
  // ============================================
  const maxScore = Math.max(scores.topo, scores.meio, scores.fundo, scores.vendas);
  
  // Se empate ou score muito baixo, usa posição como desempate
  if (maxScore < 5) {
    if (position < 0.25) return 'topo';
    if (position < 0.5) return 'meio';
    if (position < 0.75) return 'fundo';
    return 'vendas';
  }
  
  if (scores.vendas === maxScore) return 'vendas';
  if (scores.fundo === maxScore) return 'fundo';
  if (scores.meio === maxScore) return 'meio';
  return 'topo';
};

export const FunnelVisual = () => {
  const { leads, funnels } = useStore();
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<FunnelCategory | null>(null);
  
  // Agregar TODOS os leads de TODOS os funis
  const allStages = funnels.flatMap(funnel => 
    funnel.stages.map(stage => ({
      ...stage,
      funnelId: funnel.id,
      funnelName: funnel.name,
      // Usa categoria definida ou infere automaticamente
      category: stage.category || inferStageCategory(stage.name, stage.order, funnel.stages.length),
    }))
  );
  
  // Categorizar todos os leads por Topo, Meio, Fundo, Vendas
  const categoryMetrics: CategoryMetric[] = [
    {
      category: 'topo',
      name: 'Topo do Funil',
      description: 'Captura e primeiro contato',
      color: 'hsl(var(--muted-foreground))',
      icon: <Layers className="h-5 w-5" />,
      count: 0,
      totalValue: 0,
      leads: [],
      conversionRate: 100,
      stageNames: [],
    },
    {
      category: 'meio',
      name: 'Meio do Funil',
      description: 'Qualificação e descoberta',
      color: 'hsl(var(--accent))',
      icon: <Target className="h-5 w-5" />,
      count: 0,
      totalValue: 0,
      leads: [],
      conversionRate: 0,
      stageNames: [],
    },
    {
      category: 'fundo',
      name: 'Fundo do Funil',
      description: 'Demonstração e validação',
      color: 'hsl(var(--primary))',
      icon: <TrendingUp className="h-5 w-5" />,
      count: 0,
      totalValue: 0,
      leads: [],
      conversionRate: 0,
      stageNames: [],
    },
    {
      category: 'vendas',
      name: 'Vendas',
      description: 'Negócios ganhos e fechados',
      color: 'hsl(var(--success))',
      icon: <ShoppingCart className="h-5 w-5" />,
      count: 0,
      totalValue: 0,
      leads: [],
      conversionRate: 0,
      stageNames: [],
    },
  ];
  
  // Mapear leads para categorias
  leads.forEach(lead => {
    // Encontrar a etapa do lead
    let leadStage = null;
    
    // Se o lead tem funnelId customizado, procurar nesse funil
    if (lead.funnelId && lead.customStageId) {
      leadStage = allStages.find(
        s => s.funnelId === lead.funnelId && s.id === lead.customStageId
      );
    } else {
      // Senão, usar o funil padrão e o stage padrão
      leadStage = allStages.find(
        s => s.id === lead.stage
      );
    }
    
    if (leadStage) {
      let finalCategory = leadStage.category;
      
      // ✨ REGRA ESPECIAL: Status sobrepõe categoria do estágio
      const statusStr = String(lead.status || '').toLowerCase();
      const isWon = statusStr === 'won' || statusStr === 'ganho';
      const isLost = statusStr === 'lost' || statusStr === 'perdido';
      
      if (isWon) {
        // Lead ganho SEMPRE vai para "Vendas", independente do estágio
        finalCategory = 'vendas';
      } else if (isLost) {
        // Lead perdido não entra em nenhuma categoria (pode adicionar categoria "perdidos" se quiser)
        return; // Pula este lead
      } else if (finalCategory === 'vendas') {
        // Se a categoria seria "vendas" mas o lead não está ganho,
        // considera como "fundo" (ainda em negociação)
        finalCategory = 'fundo';
      }
      
      const categoryIndex = categoryMetrics.findIndex(c => c.category === finalCategory);
      
      if (categoryIndex !== -1) {
        categoryMetrics[categoryIndex].count++;
        categoryMetrics[categoryIndex].totalValue += lead.dealValue || 0;
        categoryMetrics[categoryIndex].leads.push(lead);
        
        // Adicionar nome da etapa se ainda não estiver
        if (!categoryMetrics[categoryIndex].stageNames.includes(leadStage.name)) {
          categoryMetrics[categoryIndex].stageNames.push(leadStage.name);
        }
      }
    } else {
      // Lead sem estágio definido - categorizar pelo status
      const statusStr = String(lead.status || '').toLowerCase();
      const isWon = statusStr === 'won' || statusStr === 'ganho';
      const isLost = statusStr === 'lost' || statusStr === 'perdido';
      
      if (isWon) {
        // Lead ganho vai para Vendas
        const vendasIndex = categoryMetrics.findIndex(c => c.category === 'vendas');
        if (vendasIndex !== -1) {
          categoryMetrics[vendasIndex].count++;
          categoryMetrics[vendasIndex].totalValue += lead.dealValue || 0;
          categoryMetrics[vendasIndex].leads.push(lead);
        }
      } else if (!isLost) {
        // Lead sem estágio e não perdido vai para Topo por padrão
        const topoIndex = categoryMetrics.findIndex(c => c.category === 'topo');
        if (topoIndex !== -1) {
          categoryMetrics[topoIndex].count++;
          categoryMetrics[topoIndex].totalValue += lead.dealValue || 0;
          categoryMetrics[topoIndex].leads.push(lead);
        }
      }
    }
  });
  
  // Calcular taxas de conversão
  categoryMetrics.forEach((metric, index) => {
    if (index > 0) {
      const previousMetric = categoryMetrics[index - 1];
      if (previousMetric.count > 0) {
        metric.conversionRate = (metric.count / previousMetric.count) * 100;
      }
    }
  });
  
  // Calcular métricas totais
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  const avgDealValue = totalLeads > 0 ? totalValue / totalLeads : 0;
  
  // Conversão geral (topo → vendas)
  const overallConversion = categoryMetrics[0].count > 0
    ? (categoryMetrics[3].count / categoryMetrics[0].count) * 100
    : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 70) return 'text-success';
    if (rate >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getConversionIcon = (rate: number) => {
    if (rate >= 70) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  // ============================================
  // 🧠 INTELIGÊNCIA DE GAPS E INSIGHTS
  // ============================================

  // Identificar gargalos (conversões baixas)
  const bottlenecks = categoryMetrics
    .filter((_, index) => index > 0) // Ignora topo (sempre 100%)
    .filter(metric => metric.conversionRate < 50)
    .sort((a, b) => a.conversionRate - b.conversionRate);

  // Identificar oportunidades (alto valor, baixa conversão)
  const opportunities = categoryMetrics
    .filter((_, index) => index > 0)
    .filter(metric => metric.totalValue > avgDealValue * metric.count && metric.conversionRate < 60)
    .sort((a, b) => b.totalValue - a.totalValue);

  // 🎯 ANÁLISE DE PADRÕES E TENDÊNCIAS
  
  // Padrão de conversão ideal (benchmark)
  const idealConversionRates = {
    'meio': 70,      // Topo → Meio ideal: 70%
    'fundo': 60,     // Meio → Fundo ideal: 60%
    'vendas': 50,    // Fundo → Vendas ideal: 50%
  };
  
  // Calcular gap vs ideal
  const conversionGaps = categoryMetrics
    .filter((_, index) => index > 0)
    .map(metric => ({
      category: metric.name,
      current: metric.conversionRate,
      ideal: idealConversionRates[metric.category] || 50,
      gap: idealConversionRates[metric.category] ? 
        idealConversionRates[metric.category] - metric.conversionRate : 0,
      potentialLeads: Math.floor(
        categoryMetrics[0].count * 
        ((idealConversionRates[metric.category] || 50) / 100) - 
        metric.count
      ),
    }))
    .filter(gap => gap.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  // Calcular velocidade do funil (leads por dia - com inteligência temporal)
  const now = new Date();
  const last30Days = leads.filter(lead => {
    const createdAt = lead.createdAt || new Date();
    const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  });
  
  const funnelVelocity = {
    topoPerDay: categoryMetrics[0].count / 30,
    meioPerDay: categoryMetrics[1].count / 30,
    fundoPerDay: categoryMetrics[2].count / 30,
    vendasPerDay: categoryMetrics[3].count / 30,
    totalLast30Days: last30Days.length,
    growthRate: last30Days.length > 0 ? 
      ((last30Days.length - totalLeads) / totalLeads) * 100 : 0,
  };

  // Calcular tempo médio no funil com distribuição por categoria
  const timeAnalysis = categoryMetrics.map(metric => {
    const times = metric.leads.map(lead => {
      const createdAt = lead.createdAt || new Date();
      return Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    });
    
    const avgTime = times.length > 0 ? 
      times.reduce((sum, t) => sum + t, 0) / times.length : 0;
    
    return {
      category: metric.name,
      avgDays: avgTime,
      minDays: times.length > 0 ? Math.min(...times) : 0,
      maxDays: times.length > 0 ? Math.max(...times) : 0,
    };
  });
  
  const avgTimeInFunnel = timeAnalysis.reduce((sum, t) => sum + t.avgDays, 0) / 
    (timeAnalysis.length || 1);

  // 🎯 Leads estagnados por categoria COM ANÁLISE DE URGÊNCIA
  const stagnantByCategory = categoryMetrics.map(metric => {
    const urgent = metric.leads.filter(lead => {
      const createdAt = lead.createdAt || new Date();
      const days = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return days > 14; // Muito estagnado
    }).length;
    
    const warning = metric.leads.filter(lead => {
      const createdAt = lead.createdAt || new Date();
      const days = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return days > 7 && days <= 14; // Estagnado
    }).length;
    
    return { 
      category: metric.name, 
      urgent,
      warning,
      total: metric.count,
      urgencyRate: metric.count > 0 ? (urgent / metric.count) * 100 : 0,
    };
  });

  // 🎯 Taxa de perda estimada COM ANÁLISE PREDITIVA
  const atRiskLeads = leads.filter(lead => {
    const lastContactDate = lead.lastContact || new Date();
    const daysSinceContact = Math.floor((now.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
    const statusStr = String(lead.status || '').toLowerCase();
    const isWon = statusStr === 'won' || statusStr === 'ganho';
    const isLost = statusStr === 'lost' || statusStr === 'perdido';
    return daysSinceContact > 14 && !isWon && !isLost;
  });
  
  // Análise de risco por score
  const highValueAtRisk = atRiskLeads.filter(lead => (lead.dealValue || 0) > avgDealValue);
  const highScoreAtRisk = atRiskLeads.filter(lead => lead.score >= 70);

  // Análise de valor por categoria com insights
  const valueAnalysis = categoryMetrics.map(metric => ({
    category: metric.name,
    avgDealValue: metric.count > 0 ? metric.totalValue / metric.count : 0,
    totalValue: metric.totalValue,
    percentage: totalValue > 0 ? (metric.totalValue / totalValue) * 100 : 0,
    quality: metric.count > 0 ? 
      (metric.totalValue / metric.count) / (avgDealValue || 1) : 0, // Qualidade vs média
  })).sort((a, b) => b.quality - a.quality);

  // 🎯 Previsão de vendas COM MÚLTIPLOS CENÁRIOS
  const conservativeRate = Math.min(categoryMetrics[3].conversionRate * 0.8, categoryMetrics[3].conversionRate - 10);
  const optimisticRate = Math.min(categoryMetrics[3].conversionRate * 1.2, 100);
  
  const salesForecast = {
    // Cenário conservador
    conservative: {
      expectedWins: Math.floor(categoryMetrics[2].count * (conservativeRate / 100)),
      expectedValue: categoryMetrics[2].totalValue * (conservativeRate / 100),
      probability: 80,
    },
    // Cenário realista
    realistic: {
      expectedWins: Math.floor(categoryMetrics[2].count * (categoryMetrics[3].conversionRate / 100)),
      expectedValue: categoryMetrics[2].totalValue * (categoryMetrics[3].conversionRate / 100),
      probability: 50,
    },
    // Cenário otimista
    optimistic: {
      expectedWins: Math.floor(categoryMetrics[2].count * (optimisticRate / 100)),
      expectedValue: categoryMetrics[2].totalValue * (optimisticRate / 100),
      probability: 20,
    },
    timeToClose: avgTimeInFunnel * 1.5,
  };

  // Identificar melhor e pior performance COM ANÁLISE DE TENDÊNCIA
  const performanceMetrics = categoryMetrics
    .filter((_, i) => i > 0)
    .map(m => ({
      ...m,
      performance: m.conversionRate,
      vsIdeal: m.conversionRate - (idealConversionRates[m.category] || 50),
      efficiency: m.count > 0 ? m.totalValue / m.count : 0,
    }))
    .sort((a, b) => b.performance - a.performance);

  const bestPerformer = performanceMetrics[0];
  const worstPerformer = performanceMetrics[performanceMetrics.length - 1];

  // 🎯 Calcular health score do funil COM PESOS INTELIGENTES
  const volumeScore = Math.min(100, (totalLeads / 50) * 100); // Benchmark: 50 leads
  const conversionScore = overallConversion * 2.5; // Max 100
  const velocityScore = Math.min(100, funnelVelocity.topoPerDay * 50); // Benchmark: 2 leads/dia
  const qualityScore = categoryMetrics.filter(m => m.conversionRate >= 50).length * 33.33; // 3 etapas
  
  const funnelHealthScore = Math.min(100, Math.round(
    (conversionScore * 0.35) +   // 35% conversão
    (volumeScore * 0.25) +        // 25% volume
    (qualityScore * 0.25) +       // 25% qualidade das etapas
    (velocityScore * 0.15)        // 15% velocidade
  ));

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Crítico';
  };
  
  // 🎯 SCORE DE URGÊNCIA (0-100) - Quanto maior, mais urgente agir
  const urgencyScore = Math.min(100, Math.round(
    (atRiskLeads.length / (totalLeads || 1)) * 100 * 0.4 +  // 40% leads em risco
    (bottlenecks.length * 20) * 0.3 +                        // 30% gargalos
    (stagnantByCategory.reduce((sum, s) => sum + s.urgent, 0) / (totalLeads || 1)) * 100 * 0.3 // 30% estagnados urgentes
  ));
  
  const getUrgencyColor = (score: number) => {
    if (score >= 60) return 'text-destructive';
    if (score >= 30) return 'text-warning';
    return 'text-success';
  };
  
  const getUrgencyLabel = (score: number) => {
    if (score >= 70) return 'Crítico - Ação Imediata';
    if (score >= 50) return 'Alto - Agir Hoje';
    if (score >= 30) return 'Médio - Monitorar';
    return 'Baixo - Estável';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Funil de Vendas</h1>
          <p className="text-muted-foreground">Visualize e analise seu pipeline de vendas</p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              Total no Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">leads ativos</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-success/20 hover:border-success/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">em negociação</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/20 hover:border-warning/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {formatCurrency(avgDealValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">por lead</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Conversão Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getConversionColor(overallConversion)}`}>
              {Math.round(overallConversion)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">topo → vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* 🎯 HEALTH SCORE E ANÁLISE INTELIGENTE */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel Health Score */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Saúde do Funil
              </div>
              <Badge variant="outline" className="text-xs">
                Em tempo real
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className={`text-6xl font-bold ${getHealthColor(funnelHealthScore)}`}>
                  {funnelHealthScore}
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">de 100</div>
                  <Badge 
                    variant={funnelHealthScore >= 70 ? 'default' : funnelHealthScore >= 40 ? 'secondary' : 'destructive'}
                    className="text-sm px-2 py-0.5"
                  >
                    {getHealthLabel(funnelHealthScore)}
                  </Badge>
                </div>
              </div>
              
              <Progress value={funnelHealthScore} className="h-2" />
              
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground">
                  {funnelHealthScore >= 70 
                    ? "✅ Funil saudável, continue assim!" 
                    : funnelHealthScore >= 40 
                    ? "⚠️ Precisa de ajustes, revise processos" 
                    : "🚨 Ação urgente! Funil em risco"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Conversão</span>
                    <span className="font-semibold">{Math.round(overallConversion)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Leads</span>
                    <span className="font-semibold">{totalLeads}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previsão de Vendas */}
        <Card className="border-2 border-success/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Previsão de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Fechamentos Esperados</div>
                <div className="text-3xl font-bold text-success">
                  {salesForecast.realistic.expectedWins}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  dos {categoryMetrics[2].count} leads em Fundo
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Valor Previsto</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(salesForecast.realistic.expectedValue)}
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Timer className="h-3 w-3" />
                  Tempo médio até fechamento: {salesForecast.timeToClose.toFixed(0)} dias
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas e Atenção */}
        <Card className="border-2 border-warning/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertas de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-destructive-light rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Leads em Risco</span>
                  <Badge variant="destructive">{atRiskLeads.length}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Sem contato há mais de 14 dias
                </div>
              </div>

              {bottlenecks.length > 0 && (
                <div className="p-3 bg-warning-light rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">Gargalo Identificado</span>
                    <Badge variant="outline">{bottlenecks[0].conversionRate.toFixed(0)}%</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {bottlenecks[0].name} com baixa conversão
                  </div>
                </div>
              )}

              <div className="p-3 bg-info-light rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Leads Estagnados</span>
                  <Badge variant="secondary">
                    {stagnantByCategory.reduce((sum, s) => sum + s.urgent + s.warning, 0)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Há mais de 7 dias na mesma etapa
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* 📊 ANÁLISE DE GAPS E OPORTUNIDADES */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gargalos do Funil */}
        <Card className="border-2 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Gargalos Identificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bottlenecks.length > 0 ? (
              <div className="space-y-3">
                {bottlenecks.map((bottleneck, index) => (
                  <div key={bottleneck.category} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{index + 1}</Badge>
                        <span className="font-semibold">{bottleneck.name}</span>
                      </div>
                      <span className="text-lg font-bold text-destructive">
                        {bottleneck.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Leads perdidos:</span>
                        <span className="font-semibold text-destructive">
                          ~{Math.floor(categoryMetrics[0].count * ((100 - bottleneck.conversionRate) / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor em risco:</span>
                        <span className="font-semibold text-destructive">
                          {formatCurrency(bottleneck.totalValue * 0.3)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-warning mt-0.5" />
                        <div className="text-xs">
                          <strong>Ação recomendada:</strong> Revisar processo de {bottleneck.name.toLowerCase()} 
                          e identificar pontos de fricção
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
                <p>Nenhum gargalo crítico identificado!</p>
                <p className="text-xs mt-1">Todas as conversões estão acima de 50%</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Oportunidades de Melhoria */}
        <Card className="border-2 border-success/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Oportunidades de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Melhor e Pior Performance */}
              <div className="p-3 bg-success-light rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold">Melhor Performance</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{bestPerformer?.name}</span>
                  <span className="text-lg font-bold text-success">
                    {bestPerformer?.conversionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ✨ Replicar esse processo nas outras etapas
                </div>
              </div>

              {worstPerformer && worstPerformer.conversionRate < 70 && (
                <div className="p-3 bg-warning-light rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-warning" />
                    <span className="text-sm font-semibold">Maior Oportunidade</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{worstPerformer.name}</span>
                    <span className="text-lg font-bold text-warning">
                      {worstPerformer.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    💡 Potencial de ganho se melhorar para 70%: +
                    {Math.floor(worstPerformer.count * 0.2)} leads
                  </div>
                </div>
              )}

              {/* Análise de Valor */}
              <div className="p-3 bg-primary-light rounded-lg">
                <div className="text-sm font-semibold mb-2">Distribuição de Valor</div>
                <div className="space-y-2">
                  {valueAnalysis
                    .filter(v => v.totalValue > 0)
                    .sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 3)
                    .map(analysis => (
                      <div key={analysis.category} className="flex items-center justify-between text-xs">
                        <span>{analysis.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{formatCurrency(analysis.totalValue)}</span>
                          <Badge variant="outline" className="text-xs">
                            {analysis.percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Velocidade do Funil */}
              <div className="p-3 bg-accent-light rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-semibold">Velocidade do Funil</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Leads/dia (Topo)</div>
                    <div className="font-bold">{funnelVelocity.topoPerDay.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Vendas/dia</div>
                    <div className="font-bold text-success">{funnelVelocity.vendasPerDay.toFixed(1)}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  ⏱️ Tempo médio no funil: {avgTimeInFunnel.toFixed(0)} dias
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Funnel Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Categorias do Funil
        </h3>

        {categoryMetrics.map((metric, index) => {
          const isExpanded = expandedCategory === metric.category;
          const maxCount = Math.max(...categoryMetrics.map(m => m.count), 1);
          const widthPercent = Math.max(20, (metric.count / maxCount) * 100);

          return (
            <div key={metric.category}>
              <Card 
                className={`
                  relative overflow-hidden transition-all duration-300 cursor-pointer
                  ${isExpanded ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
                `}
                style={{
                  borderColor: metric.color,
                  borderWidth: '2px',
                }}
                onClick={() => setExpandedCategory(isExpanded ? null : metric.category)}
              >
                {/* Background gradient */}
                <div 
                  className="absolute top-0 left-0 h-full opacity-10 transition-all duration-500"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: metric.color,
                  }}
                />

                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ 
                          backgroundColor: `${metric.color}20`,
                          color: metric.color,
                        }}
                      >
                        {metric.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{metric.name}</h4>
                        <p className="text-sm text-muted-foreground">{metric.description}</p>
                      </div>
                    </div>

                    <ChevronDown 
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {/* Main metrics */}
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Leads
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.count}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Valor
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(metric.totalValue)}
                      </div>
                    </div>

                    {index > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          {getConversionIcon(metric.conversionRate)}
                          Conversão
                        </div>
                        <div className={`text-2xl font-bold ${getConversionColor(metric.conversionRate)}`}>
                          {Math.round(metric.conversionRate)}%
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-muted-foreground">Etapas</div>
                      <div className="text-sm font-medium">
                        {metric.stageNames.length > 0 
                          ? metric.stageNames.slice(0, 2).join(', ') 
                          : 'Nenhuma'}
                        {metric.stageNames.length > 2 && ` +${metric.stageNames.length - 2}`}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: metric.color,
                      }}
                    >
                      <span className="text-xs font-bold text-white">
                        {Math.round((metric.count / totalLeads) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && metric.leads.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold">
                          Leads nesta categoria ({metric.leads.length})
                        </h5>
                        {metric.stageNames.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {metric.stageNames.map(stageName => (
                              <Badge key={stageName} variant="secondary" className="text-xs">
                                {stageName}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {metric.leads.slice(0, 10).map(lead => (
                          <div 
                            key={lead.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback 
                                  className="text-xs font-semibold"
                                  style={{ backgroundColor: metric.color, color: 'white' }}
                                >
                                  {lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{lead.name}</span>
                                  {(String(lead.status).toLowerCase() === 'won' || String(lead.status).toLowerCase() === 'ganho') && (
                                    <Badge variant="default" className="bg-success text-success-foreground gap-1">
                                      <Award className="h-3 w-3" />
                                      Ganho
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{lead.company}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-sm font-bold">
                                  {formatCurrency(lead.dealValue || 0)}
                                </div>
                                <Badge variant="outline" className="text-xs mt-1">
                                  Score: {lead.score}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/crm', { state: { selectedLeadId: lead.id } });
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {metric.leads.length > 10 && (
                          <Button variant="ghost" size="sm" className="w-full">
                            Ver mais {metric.leads.length - 10} leads
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Arrow between categories */}
              {index < categoryMetrics.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-info/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribuição do Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryMetrics.map(metric => (
              <div key={metric.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {metric.count} leads
                  </span>
                  <span className="text-sm font-bold">
                    {Math.round((metric.count / totalLeads) * 100) || 0}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Insights do Funil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-success-light rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Melhor Conversão</span>
                <span className="text-lg font-bold text-success">
                  {(() => {
                    const best = [...categoryMetrics]
                      .filter((_, i) => i > 0)
                      .sort((a, b) => b.conversionRate - a.conversionRate)[0];
                    return best ? `${best.conversionRate.toFixed(1)}%` : '-';
                  })()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(() => {
                  const best = [...categoryMetrics]
                    .filter((_, i) => i > 0)
                    .sort((a, b) => b.conversionRate - a.conversionRate)[0];
                  return best ? best.name : '-';
                })()}
              </p>
            </div>

            <div className="p-3 bg-primary-light rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Valor Médio</span>
                <span className="text-lg font-bold">
                  {formatCurrency(avgDealValue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ticket médio por lead
              </p>
            </div>

            <div className="p-3 bg-accent-light rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Funis Ativos</span>
                <span className="text-lg font-bold">{funnels.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {funnels.map(f => f.name).join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
