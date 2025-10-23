import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isPast, isFuture, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText,
  Calendar,
  AlertCircle,
  User,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  title?: string;
  description?: string;
  activity_date?: string;
  created_at: string;
  status?: 'pending' | 'completed' | 'cancelled';
  completed_at?: string;
  metadata?: {
    status?: 'pending' | 'completed' | 'cancelled';
    completed_at?: string;
    [key: string]: any;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
  onMarkComplete?: (activityId: string) => void;
  onMarkIncomplete?: (activityId: string) => void;
}

const activityIcons: Record<string, any> = {
  note: FileText,
  nota: FileText,
  call: Phone,
  chamada: Phone,
  email: Mail,
  wa_msg: MessageSquare,
  whatsapp: MessageSquare,
  meeting: Calendar,
  nextAction: TrendingUp,
  status_change: Circle,
  sistema: User,
};

const activityLabels: Record<string, string> = {
  note: "Nota",
  nota: "Nota",
  call: "Ligação",
  chamada: "Ligação",
  email: "E-mail",
  wa_msg: "WhatsApp",
  whatsapp: "WhatsApp",
  meeting: "Reunião",
  nextAction: "Próxima Ação",
  status_change: "Mudança de Status",
  sistema: "Sistema",
};

export function ActivityTimeline({ activities, onMarkComplete, onMarkIncomplete }: ActivityTimelineProps) {
  const getActivityStatus = (activity: Activity) => {
    // Verificar metadata primeiro (workaround até migration ser aplicada)
    const metadataStatus = activity.metadata?.status;
    const metadataCompletedAt = activity.metadata?.completed_at;
    
    // Se foi marcada como concluída (campo direto OU metadata)
    if (activity.status === 'completed' || activity.completed_at || metadataStatus === 'completed' || metadataCompletedAt) {
      return 'completed';
    }
    
    // Se foi cancelada
    if (activity.status === 'cancelled' || metadataStatus === 'cancelled') {
      return 'cancelled';
    }
    
    // Se tem data de atividade agendada
    if (activity.activity_date) {
      const activityDate = new Date(activity.activity_date);
      
      if (isPast(activityDate) && !isToday(activityDate)) {
        return 'overdue';
      }
      
      if (isToday(activityDate)) {
        return 'today';
      }
      
      if (isFuture(activityDate)) {
        return 'scheduled';
      }
    }
    
    // Atividades sem data (notas, logs) - considerar sempre concluídas
    // pois são registros históricos
    if (!activity.activity_date && (activity.type === 'note' || activity.type === 'nota')) {
      return 'completed';
    }
    
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success/10 text-success border-success/20 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Concluída
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
            <AlertCircle className="h-3 w-3" />
            Atrasada
          </Badge>
        );
      case 'today':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
            <Clock className="h-3 w-3" />
            Hoje
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-info/10 text-info border-info/20 gap-1">
            <Calendar className="h-3 w-3" />
            Agendada
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="opacity-60">
            Cancelada
          </Badge>
        );
      default:
        return null;
    }
  };

  // Ordenar por data (mais recentes primeiro)
  const sortedActivities = [...activities].sort((a, b) => {
    const dateA = new Date(a.activity_date || a.created_at);
    const dateB = new Date(b.activity_date || b.created_at);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-3">
      {sortedActivities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Nenhuma atividade registrada ainda</p>
          <p className="text-xs mt-1">O histórico de interações aparecerá aqui</p>
        </div>
      ) : (
        sortedActivities.map((activity) => {
          const status = getActivityStatus(activity);
          const Icon = activityIcons[activity.type] || FileText;
          const label = activityLabels[activity.type] || activity.type;
          const canToggleComplete = activity.type === 'nextAction' || activity.type === 'call' || activity.type === 'meeting';
          const isCompleted = status === 'completed';
          const isOverdue = status === 'overdue';
          
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all",
                isCompleted && "opacity-70 bg-muted/30",
                isOverdue && "border-destructive/30 bg-destructive/5"
              )}
            >
              {/* Ícone */}
              <div className={cn(
                "mt-0.5 rounded-full p-2",
                isCompleted ? "bg-success/10" : isOverdue ? "bg-destructive/10" : "bg-primary/10"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  isCompleted ? "text-success" : isOverdue ? "text-destructive" : "text-primary"
                )} />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                    {getStatusBadge(status)}
                  </div>
                  
                  {/* Checkbox para marcar como concluída (apenas para ações agendadas) */}
                  {canToggleComplete && onMarkComplete && onMarkIncomplete && (
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onMarkComplete(activity.id);
                        } else {
                          onMarkIncomplete(activity.id);
                        }
                      }}
                      className="h-5 w-5"
                    />
                  )}
                </div>

                {activity.title && (
                  <p className={cn(
                    "text-sm font-medium",
                    isCompleted && "line-through text-muted-foreground"
                  )}>
                    {activity.title}
                  </p>
                )}
                
                {activity.description && (
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                )}

                {/* Data e hora */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  {activity.activity_date && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(activity.activity_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  )}
                  {/* Verificar completed_at direto OU em metadata */}
                  {(activity.completed_at || activity.metadata?.completed_at) && (
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Concluída em {format(new Date(activity.completed_at || activity.metadata?.completed_at!), "dd/MM/yyyy HH:mm")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
