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

export const KPICards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card 
            key={kpi.id} 
            className="hover:border-primary/50 transition-all group"
          >
            <CardContent className="p-4 space-y-2">
              <div className={`w-10 h-10 rounded-xl ${colorMap[kpi.color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <div className="text-xs text-muted-foreground leading-tight">{kpi.label}</div>
              {kpi.trend && (
                <div className="flex items-center gap-1 text-xs pt-1">
                  {kpi.trend.direction === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={kpi.trend.direction === 'up' ? 'text-success font-medium' : 'text-destructive font-medium'}>
                    {kpi.trend.value}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
