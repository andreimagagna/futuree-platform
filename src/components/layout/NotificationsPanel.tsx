import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Trash2, User, DollarSign, Calendar, AlertCircle, Target } from "lucide-react";
import { format, differenceInDays, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useStore } from "@/store/useStore";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: 'lead' | 'task' | 'deal' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  leadId?: string;
  taskId?: string;
}

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsPanel = ({ open, onOpenChange }: NotificationsPanelProps) => {
  const { leads, tasks } = useStore();
  const navigate = useNavigate();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  // Gerar notificações em tempo real baseadas nos dados do projeto
  const notifications = useMemo<Notification[]>(() => {
    const now = new Date();
    const notifs: Notification[] = [];

    // 1. Leads com alto score (≥80) não contatados recentemente
    leads.forEach(lead => {
      if (lead.score >= 80) {
        const lastContact = lead.lastContact || lead.createdAt || now;
        const daysSinceContact = differenceInDays(now, lastContact);
        
        if (daysSinceContact >= 3) {
          notifs.push({
            id: `lead-hot-${lead.id}`,
            type: 'alert',
            title: 'Lead Quente Precisando Atenção',
            message: `${lead.name} (${lead.score} pts) sem contato há ${daysSinceContact} dias`,
            timestamp: lastContact,
            read: readNotifications.has(`lead-hot-${lead.id}`),
            leadId: lead.id,
          });
        }
      }
    });

    // 2. Tarefas vencendo hoje ou atrasadas
    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'done') {
        const dueDate = new Date(task.dueDate);
        const daysUntil = differenceInDays(dueDate, now);
        
        if (isToday(dueDate)) {
          notifs.push({
            id: `task-today-${task.id}`,
            type: 'task',
            title: 'Tarefa para Hoje',
            message: `${task.title} ${task.dueTime ? `às ${task.dueTime}` : ''}`,
            timestamp: dueDate,
            read: readNotifications.has(`task-today-${task.id}`),
            taskId: task.id,
          });
        } else if (isPast(dueDate) && !isToday(dueDate)) {
          notifs.push({
            id: `task-overdue-${task.id}`,
            type: 'alert',
            title: 'Tarefa Atrasada',
            message: `${task.title} - ${Math.abs(daysUntil)} dia${Math.abs(daysUntil) !== 1 ? 's' : ''} de atraso`,
            timestamp: dueDate,
            read: readNotifications.has(`task-overdue-${task.id}`),
            taskId: task.id,
          });
        }
      }
    });

    // 3. Deals ganhos recentemente (últimas 24h)
    leads.forEach(lead => {
      if (lead.status === 'won') {
        const wonDate = lead.createdAt || now;
        const hoursSince = (now.getTime() - wonDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSince <= 24) {
          notifs.push({
            id: `deal-won-${lead.id}`,
            type: 'deal',
            title: '🎉 Negócio Fechado!',
            message: `${lead.name} - ${lead.dealValue ? `R$ ${lead.dealValue.toLocaleString('pt-BR')}` : 'Valor a definir'}`,
            timestamp: wonDate,
            read: readNotifications.has(`deal-won-${lead.id}`),
            leadId: lead.id,
          });
        }
      }
    });

    // 4. Novos leads (últimas 24h)
    leads.forEach(lead => {
      const createdAt = lead.createdAt || now;
      const hoursSince = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSince <= 24) {
        notifs.push({
          id: `lead-new-${lead.id}`,
          type: 'lead',
          title: 'Novo Lead Recebido',
          message: `${lead.name} - ${lead.company || 'Empresa não informada'}`,
          timestamp: createdAt,
          read: readNotifications.has(`lead-new-${lead.id}`),
          leadId: lead.id,
        });
      }
    });

    // 5. Leads sem atividade há 7+ dias
    leads.forEach(lead => {
      if (lead.status !== 'won' && lead.status !== 'lost') {
        const lastContact = lead.lastContact || lead.createdAt || now;
        const daysSinceContact = differenceInDays(now, lastContact);
        
        if (daysSinceContact >= 7) {
          notifs.push({
            id: `lead-inactive-${lead.id}`,
            type: 'alert',
            title: 'Lead Inativo',
            message: `${lead.name} sem contato há ${daysSinceContact} dias`,
            timestamp: lastContact,
            read: readNotifications.has(`lead-inactive-${lead.id}`),
            leadId: lead.id,
          });
        }
      }
    });

    // Ordenar por mais recente
    return notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [leads, tasks, readNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };

  const markAllAsRead = () => {
    setReadNotifications(new Set(notifications.map(n => n.id)));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.leadId) {
      navigate('/crm', { state: { selectedLeadId: notification.leadId } });
      onOpenChange(false);
    } else if (notification.taskId) {
      navigate('/tasks', { state: { selectedTaskId: notification.taskId } });
      onOpenChange(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'lead':
        return <User className="h-4 w-4" />;
      case 'task':
        return <Calendar className="h-4 w-4" />;
      case 'deal':
        return <Target className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'lead':
        return 'bg-accent/10 text-accent';
      case 'task':
        return 'bg-primary/10 text-primary';
      case 'deal':
        return 'bg-success/10 text-success';
      case 'alert':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Fique atualizado com suas atividades
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-2">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                  !notification.read ? 'bg-muted/30 border-primary/20' : 'bg-card'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-2 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(notification.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 ml-11">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhuma notificação
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Você está em dia!
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
