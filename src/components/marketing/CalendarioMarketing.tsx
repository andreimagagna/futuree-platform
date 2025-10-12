import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Megaphone,
  Share2,
  Mail,
  Video,
  Users,
  AlertCircle,
  Clock,
  Eye,
} from "lucide-react";
import { CalendarEvent } from "@/types/Marketing";
import { useToast } from "@/hooks/use-toast";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const CalendarioMarketing = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Mock events
  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Lançamento Black Friday",
      type: "campaign_launch",
      date: new Date(2025, 9, 15),
      startTime: "09:00",
      endTime: "18:00",
      allDay: false,
      description: "Início oficial da campanha Black Friday",
      campaignId: "camp-1",
      taskIds: ["task-1", "task-2"],
      assignedTo: ["user-1", "user-2"],
      status: "scheduled",
      color: "hsl(var(--primary))",
      attachments: [],
      reminders: [
        { id: "r1", type: "email", timing: 1440, sent: false }, // 1 dia antes
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdBy: "Admin",
    },
    {
      id: "2",
      title: "Post Instagram - Promoção",
      type: "social_post",
      date: new Date(2025, 9, 16),
      startTime: "14:00",
      allDay: false,
      description: "Publicação sobre desconto de 40%",
      campaignId: "camp-1",
      taskIds: [],
      assignedTo: ["user-3"],
      status: "scheduled",
      color: "hsl(var(--accent))",
      attachments: [],
      reminders: [],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdBy: "Marketing",
    },
    {
      id: "3",
      title: "Email - Newsletter Semanal",
      type: "email_send",
      date: new Date(2025, 9, 18),
      startTime: "10:00",
      allDay: false,
      description: "Envio da newsletter com novidades",
      taskIds: ["task-3"],
      assignedTo: ["user-2"],
      status: "scheduled",
      color: "hsl(var(--success))",
      attachments: [],
      reminders: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdBy: "Marketing",
    },
    {
      id: "4",
      title: "Webinar - Marketing Digital",
      type: "webinar",
      date: new Date(2025, 9, 20),
      startTime: "15:00",
      endTime: "17:00",
      allDay: false,
      description: "Webinar sobre estratégias de marketing digital 2025",
      taskIds: [],
      assignedTo: ["user-1", "user-4"],
      status: "scheduled",
      color: "hsl(var(--info))",
      url: "https://zoom.us/webinar",
      attachments: [],
      reminders: [
        { id: "r2", type: "email", timing: 60, sent: false }, // 1 hora antes
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: "Admin",
    },
  ]);

  const getMonthDays = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const getEventTypeIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "campaign_launch":
        return <Megaphone className="h-3 w-3" />;
      case "social_post":
        return <Share2 className="h-3 w-3" />;
      case "email_send":
        return <Mail className="h-3 w-3" />;
      case "webinar":
        return <Video className="h-3 w-3" />;
      case "event":
        return <Users className="h-3 w-3" />;
      case "deadline":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const getEventTypeLabel = (type: CalendarEvent["type"]) => {
    const labels = {
      campaign_launch: "Lançamento",
      social_post: "Post Social",
      email_send: "Envio Email",
      webinar: "Webinar",
      event: "Evento",
      deadline: "Prazo",
    };
    return labels[type] || type;
  };

  const handleCreateEvent = () => {
    toast({
      title: "Evento criado",
      description: "O evento foi adicionado ao calendário",
    });
    setEventDialogOpen(false);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0]);
    } else {
      setEventDialogOpen(true);
    }
  };

  const monthDays = getMonthDays();
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h2 className="text-2xl font-bold capitalize">
                  {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleToday}>
                <Clock className="h-4 w-4 mr-2" />
                Hoje
              </Button>
              <Button onClick={() => setEventDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isDayToday = isToday(day);

                return (
                  <div
                    key={day.toString()}
                    className={`
                      min-h-[120px] p-2 rounded-lg border-2 transition-all cursor-pointer
                      ${isCurrentMonth ? "bg-card" : "bg-muted/30"}
                      ${isDayToday ? "border-primary bg-primary/5" : "border-border"}
                      hover:border-primary/40 hover:shadow-md
                    `}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`
                          text-sm font-medium
                          ${!isCurrentMonth && "text-muted-foreground"}
                          ${isDayToday && "text-primary font-bold"}
                        `}
                      >
                        {format(day, "d")}
                      </span>
                      {isDayToday && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0">
                          Hoje
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="group relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                        >
                          <div
                            className="text-xs p-1.5 rounded border-l-4 hover:shadow-sm transition-shadow cursor-pointer bg-background"
                            style={{ borderColor: event.color }}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              <span style={{ color: event.color }}>
                                {getEventTypeIcon(event.type)}
                              </span>
                              <span className="font-medium truncate text-foreground">
                                {event.title}
                              </span>
                            </div>
                            {event.startTime && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {event.startTime}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <button
                          className="text-xs text-primary hover:underline w-full text-left pl-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDayClick(day);
                          }}
                        >
                          +{dayEvents.length - 2} mais
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { type: "campaign_launch" as const, color: "hsl(var(--primary))" },
              { type: "social_post" as const, color: "hsl(var(--accent))" },
              { type: "email_send" as const, color: "hsl(var(--success))" },
              { type: "webinar" as const, color: "hsl(var(--info))" },
              { type: "event" as const, color: "hsl(var(--warning))" },
              { type: "deadline" as const, color: "hsl(var(--destructive))" },
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {getEventTypeLabel(item.type)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Dialog */}
      <Dialog
        open={eventDialogOpen}
        onOpenChange={(open) => {
          setEventDialogOpen(open);
          if (!open) setSelectedDate(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `Novo Evento - ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}`
                : "Novo Evento"}
            </DialogTitle>
            <DialogDescription>
              Adicione um evento ao calendário de marketing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título do evento</Label>
              <Input placeholder="Ex: Lançamento da campanha" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de evento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campaign_launch">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4" />
                        Lançamento de Campanha
                      </div>
                    </SelectItem>
                    <SelectItem value="social_post">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Post em Redes Sociais
                      </div>
                    </SelectItem>
                    <SelectItem value="email_send">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Envio de Email
                      </div>
                    </SelectItem>
                    <SelectItem value="webinar">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Webinar
                      </div>
                    </SelectItem>
                    <SelectItem value="event">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Evento
                      </div>
                    </SelectItem>
                    <SelectItem value="deadline">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Prazo/Deadline
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  defaultValue={
                    selectedDate
                      ? format(selectedDate, "yyyy-MM-dd")
                      : format(new Date(), "yyyy-MM-dd")
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Hora início</Label>
                <Input type="time" />
              </div>

              <div className="space-y-2">
                <Label>Hora fim</Label>
                <Input type="time" />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Dia inteiro</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Adicione detalhes sobre o evento..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Campanha relacionada (opcional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma campanha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camp-1">Campanha Black Friday</SelectItem>
                  <SelectItem value="camp-2">Campanha Cyber Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEventDialogOpen(false);
                setSelectedDate(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateEvent} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span style={{ color: selectedEvent?.color }}>
                {selectedEvent && getEventTypeIcon(selectedEvent.type)}
              </span>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
            </div>
            <DialogDescription>
              {selectedEvent && format(selectedEvent.date, "dd/MM/yyyy", { locale: ptBR })}
              {selectedEvent?.startTime && ` • ${selectedEvent.startTime}`}
              {selectedEvent?.endTime && ` - ${selectedEvent.endTime}`}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Badge
                  variant="outline"
                  style={{ borderColor: selectedEvent.color, color: selectedEvent.color }}
                >
                  {getEventTypeLabel(selectedEvent.type)}
                </Badge>
              </div>

              {selectedEvent.description && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Descrição</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.url && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Link</h4>
                  <a
                    href={selectedEvent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedEvent.url}
                  </a>
                </div>
              )}

              {selectedEvent.assignedTo && selectedEvent.assignedTo.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Responsáveis</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.assignedTo.length} pessoa(s)
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Fechar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Eye className="h-4 w-4 mr-2" />
              Editar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
