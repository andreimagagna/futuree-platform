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

import { Card, CardTitle, CardHeader } from "../ui/card";
import { History } from 'lucide-react';
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { LoadingState } from "../ui/loading-state";
import { useLoadingError } from "@/hooks/use-loading-error";
import { useDateRangeFilter } from "@/hooks/use-date-range-filter";
import { useStore } from "@/store/useStore";

export const ActivityTimeline = () => {
  const { loading, error } = useLoadingError('activities');
  const activities = useDateRangeFilter(useStore().activities);