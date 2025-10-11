import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, MessageSquare, CheckSquare } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  icon: typeof AlertCircle;
  type: 'lead' | 'task' | 'conversation';
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Leads sem contato há 7+ dias',
    description: '3 leads aguardando primeiro contato',
    severity: 'high',
    icon: AlertCircle,
    type: 'lead',
  },
  {
    id: '2',
    title: 'Tarefas atrasadas',
    description: '2 tarefas com prazo vencido',
    severity: 'high',
    icon: Clock,
    type: 'task',
  },
  {
    id: '3',
    title: 'Conversas aguardando resposta',
    description: '5 mensagens do WhatsApp sem resposta',
    severity: 'medium',
    icon: MessageSquare,
    type: 'conversation',
  },
];

const severityConfig = {
  high: { color: 'bg-destructive-light text-destructive border-destructive/20', label: 'Alto' },
  medium: { color: 'bg-warning-light text-warning border-warning/20', label: 'Médio' },
  low: { color: 'bg-info-light text-info border-info/20', label: 'Baixo' },
};

export const PriorityAlerts = () => {
  const handleResolve = (alertId: string, title: string) => {
    toast.success(`Resolvendo: ${title}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mockAlerts.map((alert) => {
            const Icon = alert.icon;
            const config = severityConfig[alert.severity];
            
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary/50 transition-all group"
              >
                <div className={`p-2 rounded-lg ${config.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{alert.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
                <Button size="sm" onClick={() => handleResolve(alert.id, alert.title)}>
                  Resolver
                </Button>
              </div>
            );
          })}
          {mockAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Tudo em dia!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
