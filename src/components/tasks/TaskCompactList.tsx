import { Task, Priority, TaskStatus } from "@/store/useStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCompactListProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}

const priorityColors: Record<Priority, string> = {
  P1: 'bg-destructive text-destructive-foreground',
  P2: 'bg-warning text-warning-foreground',
  P3: 'bg-muted text-muted-foreground',
};

export function TaskCompactList({ tasks, onOpenTask }: TaskCompactListProps) {
  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="text-center text-muted-foreground py-8 border rounded-lg">
          Nenhuma tarefa encontrada
        </div>
      ) : (
        tasks.map((task) => {
          const completedCount = task.checklist.filter((c) => c.done).length;
          const totalCount = task.checklist.length;
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

          return (
            <Card
              key={task.id}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => onOpenTask(task)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge className={priorityColors[task.priority]} variant="secondary">
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignee}
                      </div>
                      
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive font-medium' : ''}`}>
                          <Clock className="h-3 w-3" />
                          {format(task.dueDate, "dd/MM", { locale: ptBR })}
                          {task.dueTime && ` ${task.dueTime}`}
                        </div>
                      )}

                      {totalCount > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {completedCount}/{totalCount}
                        </div>
                      )}

                      <Badge variant="outline" className="text-xs">
                        {task.status === 'backlog' && 'Backlog'}
                        {task.status === 'in_progress' && 'Em Progresso'}
                        {task.status === 'review' && 'Revisão'}
                        {task.status === 'done' && 'Concluído'}
                      </Badge>
                    </div>

                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
