import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, Clock, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import { useStore } from "@/store/useStore";

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export const DashboardView = ({ onNavigate }: DashboardViewProps = {}) => {
  const { leads, tasks } = useStore();
  
  const stats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.stage !== 'captured').length,
    activeTasks: tasks.filter(t => t.status !== 'done').length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
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

  const recentActivity = [
    {
      type: "lead",
      title: "3 novos leads capturados",
      time: "Há 2 horas",
    },
    {
      type: "task",
      title: "2 tarefas concluídas",
      time: "Há 4 horas",
    },
    {
      type: "qualification",
      title: "1 lead qualificado BANT",
      time: "Há 6 horas",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas atividades e métricas
        </p>
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
              {stats.qualifiedLeads} qualificados
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
            <div className="text-2xl font-bold">{stats.qualifiedLeads}</div>
            <p className="text-xs text-success mt-1">
              +{Math.round((stats.qualifiedLeads / stats.totalLeads) * 100) || 0}% do total
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
            <div className="text-2xl font-bold">
              {Math.round((stats.qualifiedLeads / stats.totalLeads) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Leads qualificados
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
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};
