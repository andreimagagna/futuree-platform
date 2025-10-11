import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, CheckSquare, Target, Clock, AlertCircle } from "lucide-react";

interface KPI {
  id: string;
  label: string;
  value: string | number;
  icon: typeof Users;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color: 'primary' | 'success' | 'warning' | 'accent' | 'info' | 'destructive';
}

const kpiData: KPI[] = [
  {
    id: 'new-leads',
    label: 'Leads Novos',
    value: 12,
    icon: Users,
    trend: { value: 8, direction: 'up' },
    color: 'primary',
  },
  {
    id: 'meetings',
    label: 'Reuniões do Dia',
    value: 3,
    icon: Calendar,
    color: 'success',
  },
  {
    id: 'tasks',
    label: 'Tarefas do Dia',
    value: 8,
    icon: CheckSquare,
    trend: { value: 2, direction: 'down' },
    color: 'warning',
  },
  {
    id: 'deals',
    label: 'Deals em Negociação',
    value: 5,
    icon: Target,
    trend: { value: 12, direction: 'up' },
    color: 'accent',
  },
  {
    id: 'response-time',
    label: 'Tempo Médio de Resposta',
    value: '2.5h',
    icon: Clock,
    color: 'info',
  },
  {
    id: 'no-action',
    label: 'Leads sem Próximo Passo',
    value: 4,
    icon: AlertCircle,
    color: 'destructive',
  },
];

const colorMap = {
  primary: 'text-primary bg-primary-light border-primary/20',
  success: 'text-success bg-success-light border-success/20',
  warning: 'text-warning bg-warning-light border-warning/20',
  accent: 'text-accent bg-accent-light border-accent/20',
  info: 'text-info bg-info-light border-info/20',
  destructive: 'text-destructive bg-destructive-light border-destructive/20',
};

import { useStore } from "@/store/useStore";
import { KPICard } from "./KPICard";
import { Users, CheckSquare, MessageSquare, Target, Percent } from "lucide-react";
import { useMemo } from "react";

// Mock data for sparklines
const generateSparklineData = () => Array.from({ length: 10 }, (_, i) => ({ name: `Page ${i}`, value: Math.floor(Math.random() * 30) + 5 }));

export const KPICards = () => {
  const { leads, tasks, conversations } = useStore();

  const kpiData = useMemo(() => {
    const newLeads = leads.filter(l => l.stage === 'captured').length;
    const bantQualified = leads.filter(l => l.stage === 'qualify').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksToday = tasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
    const openTasks = tasksToday.filter(t => t.status !== 'done').length;
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done').length;
    const tasksLabel = `${openTasks} abertas / ${overdueTasks} atrasadas`;

    const awaitingReply = conversations.filter(c => {
      const lastMessage = c.messages[c.messages.length - 1];
      return lastMessage && lastMessage.role === 'user';
    }).length;

    const conversionRate = 12.5; // Mock data

    return {
      newLeads,
      bantQualified,
      tasksLabel,
      awaitingReply,
      conversionRate,
    };
  }, [leads, tasks, conversations]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <KPICard
        title="Novos Leads"
        value={kpiData.newLeads.toString()}
        icon={Users}
        trend="+15%"
        trendDirection="up"
        chartData={generateSparklineData()}
      />
      <KPICard
        title="Qualificados (BANT)"
        value={kpiData.bantQualified.toString()}
        icon={Target}
        trend="+5%"
        trendDirection="up"
        chartData={generateSparklineData()}
      />
      <KPICard
        title="Tarefas do Dia"
        value={kpiData.tasksLabel}
        icon={CheckSquare}
        trend="-2%"
        trendDirection="down"
      />
      <KPICard
        title="Aguardando Resposta"
        value={kpiData.awaitingReply.toString()}
        icon={MessageSquare}
        trend="+8%"
        trendDirection="down"
        chartData={generateSparklineData()}
      />
      <KPICard
        title="Taxa de Conversão"
        value={`${kpiData.conversionRate}%`}
        icon={Percent}
        trend="+1.2%"
        trendDirection="up"
        chartData={generateSparklineData()}
      />
      
      {/* Example States */}
      {/* <KPICard title="Carregando..." value="" icon={Users} isLoading />
      <KPICard title="Erro ao Carregar" value="" icon={Users} error="Não foi possível conectar ao servidor." /> */}
    </div>
  );
};