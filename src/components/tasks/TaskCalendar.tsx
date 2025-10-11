import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, CheckSquare } from "lucide-react";
import { Task, Priority } from "@/store/useStore";
import { addMonths, addWeeks, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, isSameMonth, isToday, format, eachHourOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type CalendarView = "day" | "week" | "month";

const priorityColors: Record<Priority, string> = {
  P1: 'bg-destructive',
  P2: 'bg-warning',
  P3: 'bg-muted-foreground',
};

export function TaskCalendar({ tasks }: { tasks: Task[] }) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<CalendarView>("month");

  const tasksByDay = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    const key = t.dueDate ? format(t.dueDate, "yyyy-MM-dd") : "Sem data";
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});

  const handlePrev = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, -1));
    else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, -1));
    else setCurrentDate(addDays(currentDate, -1));
  };

  const handleNext = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const getHeaderText = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(weekStart, "d MMM", { locale: ptBR })} - ${format(weekEnd, "d MMM yyyy", { locale: ptBR })}`;
    } else {
      return format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  const renderMonthView = () => {
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(startMonth, { weekStartsOn: 0 });
    const endDate = endOfWeek(endMonth, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="text-xs text-muted-foreground text-center font-medium py-2">{d}</div>
        ))}
        {days.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          const inMonth = isSameMonth(date, currentDate);
          const isTodayFlag = isToday(date);
          const dayTasks = tasksByDay[key] || [];

          return (
            <div
              key={key}
              className={cn(
                "min-h-[120px] rounded-lg border p-2 flex flex-col gap-1",
                inMonth ? "bg-card" : "bg-muted/30",
                isTodayFlag && "border-primary shadow-sm ring-2 ring-primary/20"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm font-semibold", 
                  inMonth ? "text-foreground" : "text-muted-foreground",
                  isTodayFlag && "text-primary"
                )}>
                  {format(date, "d")}
                </span>
                {isTodayFlag && <Badge variant="default" className="text-[10px] h-5">Hoje</Badge>}
              </div>

              {dayTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">-</span>
                </div>
              ) : (
                <div className="flex-1 space-y-1 overflow-auto">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="rounded-md bg-card border p-1.5 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start gap-1.5">
                        <div className={cn("w-1 h-full rounded-full flex-shrink-0 mt-0.5", priorityColors[task.priority])} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{task.title}</p>
                          {task.dueTime && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                              <Clock className="h-3 w-3" />
                              {task.dueTime}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] w-full justify-center">
                      +{dayTasks.length - 3} mais
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date) => {
            const key = format(date, "yyyy-MM-dd");
            const isTodayFlag = isToday(date);
            const dayTasks = tasksByDay[key] || [];

            return (
              <div key={key} className="space-y-2">
                <div className={cn(
                  "text-center p-2 rounded-lg",
                  isTodayFlag && "bg-primary text-primary-foreground"
                )}>
                  <div className="text-xs font-medium">{format(date, "EEE", { locale: ptBR })}</div>
                  <div className="text-xl font-bold">{format(date, "d")}</div>
                </div>

                <div className={cn(
                  "min-h-[400px] rounded-lg border-2 p-3 space-y-2",
                  isTodayFlag && "border-primary bg-primary/5"
                )}>
                  {dayTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <span className="text-sm text-muted-foreground">Sem tarefas</span>
                    </div>
                  ) : (
                    dayTasks.map((task) => {
                      const completedCount = task.checklist.filter((c) => c.done).length;
                      const totalCount = task.checklist.length;
                      
                      return (
                        <Card key={task.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-sm flex-1">{task.title}</p>
                              <Badge variant="secondary" className="text-xs">
                                {task.priority}
                              </Badge>
                            </div>
                            
                            {task.dueTime && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {task.dueTime}
                              </div>
                            )}

                            {totalCount > 0 && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckSquare className="h-3 w-3" />
                                <span>{completedCount}/{totalCount}</span>
                              </div>
                            )}

                            {task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const key = format(currentDate, "yyyy-MM-dd");
    const dayTasks = tasksByDay[key] || [];
    const hours = eachHourOfInterval({
      start: startOfDay(currentDate),
      end: endOfDay(currentDate),
    });

    const tasksByHour = dayTasks.reduce<Record<string, Task[]>>((acc, task) => {
      if (task.dueTime) {
        const hour = task.dueTime.split(':')[0];
        acc[hour] = acc[hour] || [];
        acc[hour].push(task);
      } else {
        acc['no-time'] = acc['no-time'] || [];
        acc['no-time'].push(task);
      }
      return acc;
    }, {});

    return (
      <div className="space-y-4">
        {tasksByHour['no-time'] && tasksByHour['no-time'].length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Sem horário definido</h4>
              <div className="space-y-2">
                {tasksByHour['no-time'].map((task) => {
                  const completedCount = task.checklist.filter((c) => c.done).length;
                  const totalCount = task.checklist.length;
                  
                  return (
                    <Card key={task.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm flex-1">{task.title}</p>
                          <Badge variant="secondary" className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>

                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {totalCount > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckSquare className="h-3 w-3" />
                            <span>{completedCount}/{totalCount}</span>
                          </div>
                        )}

                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-1 border rounded-lg p-4">
          {hours.map((hour) => {
            const hourStr = format(hour, "HH");
            const hourTasks = tasksByHour[hourStr] || [];

            return (
              <div key={hourStr} className="flex gap-4 min-h-[60px] border-b last:border-b-0 py-2">
                <div className="w-20 flex-shrink-0">
                  <span className="text-sm font-medium text-muted-foreground">
                    {format(hour, "HH:mm")}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  {hourTasks.length === 0 ? (
                    <div className="h-full flex items-center">
                      <span className="text-xs text-muted-foreground">-</span>
                    </div>
                  ) : (
                    hourTasks.map((task) => {
                      const completedCount = task.checklist.filter((c) => c.done).length;
                      const totalCount = task.checklist.length;
                      
                      return (
                        <Card key={task.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{task.title}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3" />
                                  {task.dueTime}
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {task.priority}
                              </Badge>
                            </div>

                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            {totalCount > 0 && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckSquare className="h-3 w-3" />
                                <span>{completedCount}/{totalCount}</span>
                              </div>
                            )}

                            {task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-bold">
            {getHeaderText()}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as CalendarView)}>
            <TabsList>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "month" && renderMonthView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}
    </div>
  );
}
