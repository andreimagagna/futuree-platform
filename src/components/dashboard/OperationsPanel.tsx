import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useState } from "react";
import { CreateDialog } from "./CreateDialog";

const priorityColors = {
  P1: 'bg-destructive-light text-destructive border-destructive/20',
  P2: 'bg-warning-light text-warning border-warning/20',
  P3: 'bg-info-light text-info border-info/20',
};

const statusColumns = [
  { id: 'backlog', label: 'A Fazer', color: 'bg-muted' },
  { id: 'in_progress', label: 'Em Progresso', color: 'bg-primary-light' },
  { id: 'done', label: 'Concluído', color: 'bg-success-light' },
];

export const OperationsPanel = () => {
  const { tasks, deleteTask } = useStore();
  const { loading, error } = useLoadingError('tasks');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const filteredTasks = useDateRangeFilter(tasks);

  const handleStatusChange = (taskId: string, newStatus: 'backlog' | 'in_progress' | 'done') => {
    updateTask(taskId, { status: newStatus });
    toast.success('Status da tarefa atualizado!');
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    toast.success('Tarefa excluída!');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tarefas de Hoje</CardTitle>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              + Nova
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {statusColumns.map((column) => (
              <div key={column.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {tasks.filter((t) => t.status === column.id).length}
                  </Badge>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task) => (
                      <Card key={task.id} className={`border hover:shadow-sm transition-all`}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className={`text-sm font-medium leading-tight flex-1 ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                              {task.title}
                            </p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                {task.status !== 'done' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'done')}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Concluir
                                  </DropdownMenuItem>
                                )}
                                {task.status === 'done' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'backlog')}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Reabrir
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${priorityColors[task.priority]} text-xs h-5`}>
                              {task.priority}
                            </Badge>
                            {task.dueTime && (
                              <span className="text-xs text-muted-foreground">{task.dueTime}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultTab="task"
      />
    </>
  );
};
