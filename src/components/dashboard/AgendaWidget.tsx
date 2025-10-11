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
  { id: '3', time: '16:30', title: 'Follow-up comercial', participant: 'Pedro Costa - Digital Solutions', type: 'call' },
];

interface AgendaWidgetProps {
  onOpenCreate?: (tab: string) => void;
}

export const AgendaWidget = ({ onOpenCreate }: AgendaWidgetProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agenda do Dia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mockMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary-light text-primary rounded-lg group-hover:scale-110 transition-transform">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{meeting.time}</span>
                  {meeting.type === 'video' && <Video className="h-3 w-3 text-primary" />}
                </div>
                <p className="text-sm font-medium truncate">{meeting.title}</p>
                <p className="text-xs text-muted-foreground truncate">{meeting.participant}</p>
              </div>
            </div>
          ))}
          {mockMeetings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Sem reuniões hoje</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
