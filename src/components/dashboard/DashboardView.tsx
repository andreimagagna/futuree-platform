import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  ArrowUpRight,
  DollarSign,
  Target,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export const DashboardView = ({ onNavigate }: DashboardViewProps = {}) => {
  const { leads, tasks } = useStore();
  
  // Calcular métricas reais do projeto
  const totalLeads = leads.length;
  const openLeads = leads.filter(l => l.status === 'open' || !l.status).length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const lostLeads = leads.filter(l => l.status === 'lost').length;
  
  // Leads com BANT completo (todos os 4 critérios preenchidos)
  const qualifiedLeadsBANT = leads.filter(l => {
    const bant = l.bant;
    return bant && bant.budget && bant.authority && bant.need && bant.timeline;
  }).length;
  
  // Leads em estágios avançados (proposal, closing)
  const advancedStageLeads = leads.filter(l => 
    l.stage === 'proposal' || l.stage === 'closing'
  ).length;
  
  // Tarefas
  const activeTasks = tasks.filter(t => t.status !== 'done').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  
  // Taxa de conversão (ganhos / total)
  const conversionRate = totalLeads > 0 
    ? Math.round((wonLeads / totalLeads) * 100) 
    : 0;
  
  // Valor total em negociação
  const totalDealValue = leads
    .filter(l => l.status === 'open' || !l.status)
    .reduce((sum, l) => sum + (l.dealValue || 0), 0);
  
  // Valor ganho
  const wonValue = leads
    .filter(l => l.status === 'won')
    .reduce((sum, l) => sum + (l.dealValue || 0), 0);
  
  const stats = {
    totalLeads,
    openLeads,
    wonLeads,
    qualifiedLeadsBANT,
    advancedStageLeads,
    activeTasks,
    completedTasks,
    overdueTasks,
    conversionRate,
    totalDealValue,
    wonValue,
  };

  const quickActions = [
    {
      title: "Adicionar Lead",
      description: "Capture um novo contato",
      icon: Users,
      action: () => onNavigate?.('crm'),
    },
    {
      title: "Nova Tarefa",
      description: "Organize seu trabalho",
      icon: CheckCircle2,
      action: () => onNavigate?.('tasks'),
    },
    {
      title: "Ver Funil",
      description: "Acompanhe qualificações",
      icon: TrendingUp,
      action: () => onNavigate?.('funnel'),
    },
  ];

  // Atividade recente real baseada em dados
  const recentActivity: Array<{
    type: string;
    title: string;
    time: string;
    value?: number;
  }> = [
    // Leads ganhos recentemente
    ...leads
      .filter(l => l.status === 'won' && l.wonDate)
      .sort((a, b) => (b.wonDate?.getTime() || 0) - (a.wonDate?.getTime() || 0))
      .slice(0, 2)
      .map(l => ({
        type: "won",
        title: `Lead ganho: ${l.name}`,
        time: l.wonDate ? formatDistanceToNow(l.wonDate, { addSuffix: true, locale: ptBR }) : '',
        value: l.dealValue,
      })),
    
    // Leads qualificados BANT recentemente
    ...leads
      .filter(l => l.bant?.qualifiedAt)
      .sort((a, b) => (b.bant?.qualifiedAt?.getTime() || 0) - (a.bant?.qualifiedAt?.getTime() || 0))
      .slice(0, 2)
      .map(l => ({
        type: "qualification",
        title: `Lead qualificado BANT: ${l.name}`,
        time: l.bant?.qualifiedAt ? formatDistanceToNow(l.bant.qualifiedAt, { addSuffix: true, locale: ptBR }) : '',
      })),
    
    // Tarefas concluídas (assumindo que existe updatedAt ou similar)
    ...tasks
      .filter(t => t.status === 'done')
      .slice(0, 2)
      .map(t => ({
        type: "task",
        title: `Tarefa concluída: ${t.title}`,
        time: "Recentemente",
      })),
  ]
    .slice(0, 5)
    .sort(() => Math.random() - 0.5); // Mix para variedade

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Leads
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.openLeads} ativos • {stats.wonLeads} ganhos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Qualificados BANT
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualifiedLeadsBANT}</div>
            <p className="text-xs text-success mt-1">
              {stats.totalLeads > 0 
                ? `${Math.round((stats.qualifiedLeadsBANT / stats.totalLeads) * 100)}% do total`
                : 'Nenhum lead ainda'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas Ativas
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completedTasks} concluídas
              {stats.overdueTasks > 0 && (
                <span className="text-destructive"> • {stats.overdueTasks} atrasadas</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.wonLeads} leads ganhos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pipeline Ativo
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalDealValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.openLeads} oportunidades ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Conquistada
            </CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {stats.wonValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.wonLeads} negócio{stats.wonLeads !== 1 ? 's' : ''} fechado{stats.wonLeads !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={action.action}
                >
                  <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 ml-2 flex-shrink-0" />
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0"
                  >
                    <div 
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'won' 
                          ? 'bg-success' 
                          : activity.type === 'qualification'
                          ? 'bg-primary'
                          : 'bg-muted-foreground'
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        {activity.value && (
                          <span className="text-xs font-semibold text-success">
                            R$ {activity.value.toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Nenhuma atividade recente</p>
                <p className="text-xs mt-1">Comece adicionando leads e tarefas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  );
};
