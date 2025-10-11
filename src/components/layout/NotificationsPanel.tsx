import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Trash2, User, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  type: 'lead' | 'task' | 'deal' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'lead',
    title: 'Novo Lead Atribuído',
    message: 'Maria Silva foi atribuída a você',
    timestamp: new Date(2025, 9, 11, 14, 30),
    read: false,
  },
  {
    id: '2',
    type: 'task',
    title: 'Tarefa Vencendo',
    message: 'Reunião com João Santos em 30 minutos',
    timestamp: new Date(2025, 9, 11, 13, 45),
    read: false,
  },
  {
    id: '3',
    type: 'deal',
    title: 'Negócio Ganho',
    message: 'Contrato fechado: R$ 50.000',
    timestamp: new Date(2025, 9, 11, 10, 20),
    read: false,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Lead Inativo',
    message: 'Pedro Costa sem contato há 7 dias',
    timestamp: new Date(2025, 9, 10, 16, 15),
    read: true,
  },
  {
    id: '5',
    type: 'task',
    title: 'Follow-up Agendado',
    message: 'Lembrete: Ligar para Ana Oliveira',
    timestamp: new Date(2025, 9, 10, 9, 0),
    read: true,
  },
];

export const NotificationsPanel = ({ open, onOpenChange }: NotificationsPanelProps) => {
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'lead':
        return <User className="h-4 w-4" />;
      case 'task':
        return <Calendar className="h-4 w-4" />;
      case 'deal':
        return <DollarSign className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'lead':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'task':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'deal':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'alert':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
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
            <Button variant="outline" size="sm" className="flex-1">
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                  !notification.read ? 'bg-muted/30 border-primary/20' : 'bg-card'
                }`}
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
                        <div className="h-2 w-2 rounded-full bg-primary" />
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
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Marcar como lida
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {MOCK_NOTIFICATIONS.length === 0 && (
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
