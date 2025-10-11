import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video } from "lucide-react";

interface Meeting {
  id: string;
  time: string;
  title: string;
  participant: string;
  type: 'meeting' | 'call' | 'video';
}

const mockMeetings: Meeting[] = [
  { id: '1', time: '09:00', title: 'Reunião de alinhamento', participant: 'João Silva - Tech Corp', type: 'video' },
  { id: '2', time: '14:00', title: 'Demo do produto', participant: 'Maria Santos - Innovation Labs', type: 'video' },
  { id: '3', time: '16:30', title: 'Follow-up comercial', participant: 'Carlos Souza - Digital Solutions', type: 'call' },
];

interface AgendaWidgetProps {
  onOpenCreate?: (tab: string) => void;
}

import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { LoadingState } from '../ui/loading-state';
import { useLoadingError } from '@/hooks/use-loading-error';
import { useDateRangeFilter } from '@/hooks/use-date-range-filter';
import { useStore } from '@/store/useStore';

export const AgendaWidget = () => {
  const { loading, error } = useLoadingError('meetings');
  const meetings = useDateRangeFilter(useStore().meetings || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agenda do Dia
        </CardTitle>
      </CardHeader>

      <LoadingState isLoading={loading} error={error}>
        <div className="p-4 space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium">{meeting.title}</p>
                <p className="text-muted-foreground">{meeting.description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Date(meeting.startTime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {meeting.duration}min
                </p>
              </div>
            </div>
          ))}

          {meetings.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma reunião agendada
            </p>
          )}
        </div>
      </LoadingState>
    </Card>
  );
