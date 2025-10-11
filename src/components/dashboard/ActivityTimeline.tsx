import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, FileText, MessageSquare, CheckCircle, Phone } from "lucide-react";

interface Activity {
  id: string;
  type: 'lead_created' | 'proposal_sent' | 'message_received' | 'task_completed' | 'call_scheduled';
  title: string;
  entity: string;
  time: string;
  icon: typeof UserPlus;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'message_received',
    title: 'Nova mensagem recebida',
    entity: 'WhatsApp - João Silva',
    time: 'há 12 min',
    icon: MessageSquare,
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Tarefa concluída',
    entity: 'Enviar proposta - Tech Corp',
    time: 'há 1 hora',
    icon: CheckCircle,
  },
  {
    id: '3',
    type: 'lead_created',
    title: 'Novo lead criado',
    entity: 'Maria Santos - Innovation Labs',
    time: 'há 2 horas',
    icon: UserPlus,
  },
  {
    id: '4',
    type: 'proposal_sent',
    title: 'Proposta enviada',
    entity: 'Pedro Costa - Digital Solutions',
    time: 'há 3 horas',
    icon: FileText,
  },
  {
    id: '5',
    type: 'call_scheduled',
    title: 'Ligação agendada',
    entity: 'Ana Oliveira - StartupXYZ',
    time: 'há 4 horas',
    icon: Phone,
  },
];

const typeConfig = {
  lead_created: { color: 'bg-primary-light text-primary', label: 'Lead' },
  proposal_sent: { color: 'bg-accent-light text-accent', label: 'Proposta' },
  message_received: { color: 'bg-success-light text-success', label: 'Mensagem' },
  task_completed: { color: 'bg-info-light text-info', label: 'Tarefa' },
  call_scheduled: { color: 'bg-warning-light text-warning', label: 'Ligação' },
};

export const ActivityTimeline = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockActivities.slice(0, 5).map((activity, index) => {
            const Icon = activity.icon;
            const config = typeConfig[activity.type];
            
            return (
              <div key={activity.id} className="flex gap-3 group">
                <div className="relative">
                  <div className={`p-2 rounded-lg ${config.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < mockActivities.slice(0, 5).length - 1 && (
                    <div className="absolute left-1/2 top-10 w-px h-5 bg-border -translate-x-1/2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold truncate">{activity.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{activity.entity}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
