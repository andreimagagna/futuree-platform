import { Task, Priority, TaskStatus } from "@/store/useStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Clock, User, Tag, CheckSquare, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { format, differenceInDays, isPast, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TaskListViewProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}

const priorityColors: Record<Priority, string> = {
  P1: 'bg-destructive text-destructive-foreground',
  P2: 'bg-warning text-warning-foreground',
  P3: 'bg-muted text-muted-foreground',
};

const statusColors: Record<TaskStatus, string> = {
  backlog: 'border-muted-foreground text-muted-foreground bg-muted',
  in_progress: 'border-accent text-accent bg-accent/10',
  review: 'border-warning text-warning bg-warning/10',
  done: 'border-success text-success bg-success/10',
};

const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
};

export function TaskListView({ tasks, onOpenTask }: TaskListViewProps) {
  const getDateInfo = (dueDate: Date | null, status: TaskStatus) => {
    if (!dueDate || status === 'done') return null;
    
    const date = new Date(dueDate);
    const daysUntil = differenceInDays(date, new Date());
    const overdue = isPast(date) && !isToday(date);
    const today = isToday(date);
    const tomorrow = isTomorrow(date);
    
    return { date, daysUntil, overdue, today, tomorrow };
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[35%] font-semibold">Tarefa</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Prioridade</TableHead>
            <TableHead className="font-semibold">Responsável</TableHead>
            <TableHead className="font-semibold">Vencimento</TableHead>
            <TableHead className="font-semibold">Progresso</TableHead>
            <TableHead className="font-semibold">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                <div className="flex flex-col items-center gap-2">
                  <CheckSquare className="h-12 w-12 text-muted-foreground/50" />
                  <p className="font-medium">Nenhuma tarefa encontrada</p>
                  <p className="text-sm">Crie uma nova tarefa para começar</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const completedCount = task.checklist.filter((c) => c.done).length;
              const totalCount = task.checklist.length;
              const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
              const dateInfo = getDateInfo(task.dueDate, task.status);

              return (
                <TableRow
                  key={task.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/80",
                    dateInfo?.overdue && "bg-destructive/5 hover:bg-destructive/10",
                    task.status === 'done' && "opacity-60"
                  )}
                  onClick={() => onOpenTask(task)}
                >
                  <TableCell>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        {dateInfo?.overdue && (
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        )}
                        {dateInfo?.today && (
                          <Calendar className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        )}
                        <div className="font-medium leading-tight">{task.title}</div>
                      </div>
                      {task.description && (
                        <div className="text-xs text-muted-foreground line-clamp-2 pl-6">
                          {task.description}
                        </div>
                      )}
                      {task.leadId && (
                        <Badge variant="outline" className="text-xs ml-6">
                          <TrendingUp className="h-2.5 w-2.5 mr-1" />
                          Lead vinculado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn("border-2 font-medium", statusColors[task.status])}
                    >
                      {statusLabels[task.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-semibold", priorityColors[task.priority])} variant="secondary">
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium">{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dateInfo ? (
                      <div className="space-y-1">
                        <div className={cn(
                          "flex items-center gap-1.5 text-sm font-medium",
                          dateInfo.overdue && "text-destructive",
                          dateInfo.today && "text-warning",
                          dateInfo.tomorrow && "text-accent",
                          !dateInfo.overdue && !dateInfo.today && !dateInfo.tomorrow && "text-muted-foreground"
                        )}>
                          <Clock className="h-3.5 w-3.5" />
                          {format(dateInfo.date, "dd/MM", { locale: ptBR })}
                          {task.dueTime && ` • ${task.dueTime}`}
                        </div>
                        {dateInfo.overdue && (
                          <Badge variant="destructive" className="text-xs">
                            {Math.abs(dateInfo.daysUntil)}d atrasada
                          </Badge>
                        )}
                        {dateInfo.today && (
                          <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning">
                            Hoje
                          </Badge>
                        )}
                        {dateInfo.tomorrow && (
                          <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent">
                            Amanhã
                          </Badge>
                        )}
                      </div>
                    ) : task.dueDate ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckSquare className="h-3 w-3 text-success" />
                        Concluída
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem prazo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {totalCount > 0 ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {completedCount}/{totalCount}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(progress)}%)
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem checklist</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.tags.length === 0 ? (
                        <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <>
                          {task.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs font-semibold">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
