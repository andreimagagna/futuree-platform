import { Campaign } from '@/types/Marketing';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Eye,
  MousePointer,
  Zap,
  ArrowUpRight,
  Edit,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface CampaignDetailsDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (campaign: Campaign) => void;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--accent))'];

export const CampaignDetailsDialog = ({
  campaign,
  open,
  onOpenChange,
  onEdit,
}: CampaignDetailsDialogProps) => {
  if (!campaign) return null;

  const roi = campaign.spent > 0 ? ((campaign.revenue - campaign.spent) / campaign.spent) * 100 : 0;
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
  const costPerLead = campaign.leads > 0 ? campaign.spent / campaign.leads : 0;
  const costPerConversion = campaign.conversions > 0 ? campaign.spent / campaign.conversions : 0;
  const budgetUsed = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
  
  const daysRemaining = differenceInDays(new Date(campaign.endDate), new Date());
  const totalDays = differenceInDays(new Date(campaign.endDate), new Date(campaign.startDate));
  const daysPassed = totalDays - daysRemaining;
  const progressPercentage = totalDays > 0 ? (daysPassed / totalDays) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Mock data para gráfico de evolução temporal
  const performanceData = [
    { name: 'Sem 1', impressions: campaign.impressions * 0.15, clicks: campaign.clicks * 0.12, conversions: campaign.conversions * 0.10 },
    { name: 'Sem 2', impressions: campaign.impressions * 0.20, clicks: campaign.clicks * 0.18, conversions: campaign.conversions * 0.15 },
    { name: 'Sem 3', impressions: campaign.impressions * 0.25, clicks: campaign.clicks * 0.24, conversions: campaign.conversions * 0.22 },
    { name: 'Sem 4', impressions: campaign.impressions * 0.40, clicks: campaign.clicks * 0.46, conversions: campaign.conversions * 0.53 },
  ];

  // Dados do funil
  const funnelData = [
    { name: 'Impressões', value: campaign.impressions, fill: COLORS[0] },
    { name: 'Cliques', value: campaign.clicks, fill: COLORS[1] },
    { name: 'Conversões', value: campaign.conversions, fill: COLORS[2] },
    { name: 'Leads', value: campaign.leads, fill: COLORS[3] },
  ];

  // Dados de distribuição de canais
  const channelData = campaign.channels.map((channel, index) => ({
    name: channel,
    value: Math.floor(campaign.leads / campaign.channels.length) + (index === 0 ? campaign.leads % campaign.channels.length : 0),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2">{campaign.name}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant={campaign.status === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    campaign.status === 'active' && 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
                    campaign.status === 'paused' && 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
                    campaign.status === 'completed' && 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  )}
                >
                  {campaign.status === 'active' ? 'Ativa' : campaign.status === 'paused' ? 'Pausada' : campaign.status === 'completed' ? 'Concluída' : 'Rascunho'}
                </Badge>
                <Badge variant="outline">{campaign.type}</Badge>
                {daysRemaining > 0 && daysRemaining <= 7 && campaign.status === 'active' && (
                  <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                    Termina em {daysRemaining}d
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit?.(campaign)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="targeting">Segmentação</TabsTrigger>
            <TabsTrigger value="goals">Objetivos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {campaign.description && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Cronograma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Início</span>
                  <span className="font-medium">
                    {format(new Date(campaign.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Término</span>
                  <span className="font-medium">
                    {format(new Date(campaign.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {daysPassed} de {totalDays} dias
                    {daysRemaining > 0 && ` • ${daysRemaining} dias restantes`}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-success dark:text-green-400">
                      {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
                    </div>
                    <TrendingUp className="h-5 w-5 text-success dark:text-green-400" />
                  </div>
                  <div className="text-sm text-muted-foreground">ROI</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{formatCurrency(campaign.revenue)}</div>
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">Receita</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{formatNumber(campaign.leads)}</div>
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-sm text-muted-foreground">Leads</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{formatNumber(campaign.conversions)}</div>
                    <Zap className="h-5 w-5 text-warning" />
                  </div>
                  <div className="text-sm text-muted-foreground">Conversões</div>
                </CardContent>
              </Card>
            </div>

            {/* Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orçamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investido</span>
                    <span className="font-medium">
                      {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full transition-all',
                        budgetUsed >= 90 ? 'bg-destructive' : budgetUsed >= 70 ? 'bg-warning' : 'bg-primary'
                      )}
                      style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {budgetUsed.toFixed(1)}% utilizado • {formatCurrency(campaign.budget - campaign.spent)} disponível
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Custo por Lead</div>
                    <div className="text-lg font-bold">{formatCurrency(costPerLead)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Custo por Conversão</div>
                    <div className="text-lg font-bold">{formatCurrency(costPerConversion)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            {/* Métricas de Performance */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{formatNumber(campaign.impressions)}</div>
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">Impressões</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{formatNumber(campaign.clicks)}</div>
                    <MousePointer className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">Cliques</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{ctr.toFixed(2)}%</div>
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">CTR</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{conversionRate.toFixed(2)}%</div>
                    <Target className="h-5 w-5 text-success dark:text-green-400" />
                  </div>
                  <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Performance ao Longo do Tempo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance ao Longo do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="impressions" stroke={COLORS[0]} name="Impressões" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicks" stroke={COLORS[1]} name="Cliques" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke={COLORS[2]} name="Conversões" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Funil de Conversão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Funil de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={funnelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição por Canal */}
              {channelData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Leads por Canal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Targeting Tab */}
          <TabsContent value="targeting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Canais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {campaign.channels.map(channel => (
                    <Badge key={channel} variant="secondary" className="text-sm">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Público-Alvo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {campaign.targetAudience.map(audience => (
                    <Badge key={audience} variant="outline" className="text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      {audience}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Objetivos da Campanha</CardTitle>
              </CardHeader>
              <CardContent>
                {campaign.goals && campaign.goals.length > 0 ? (
                  <ul className="space-y-3">
                    {campaign.goals.map((goal, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum objetivo definido</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
