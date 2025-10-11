import { useStore, TaskStatus } from "@/store/useStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical } from "lucide-react";

const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
};

const statusColors: Record<TaskStatus, string> = {
  backlog: 'border-muted',
  in_progress: 'border-primary bg-primary/5',
  review: 'border-warning bg-warning/5',
  done: 'border-success bg-success/5',
};

const priorityColors = {
  P1: 'bg-destructive text-destructive-foreground',
  P2: 'bg-warning text-warning-foreground',
  P3: 'bg-muted text-muted-foreground',
};

interface TaskCardProps {
  task: any;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${statusColors[task.status]}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div {...listeners} className="mt-1 cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm leading-tight">{task.title}</p>
                <Badge className={priorityColors[task.priority]} variant="secondary">
                  {task.priority}
                </Badge>
              </div>
              {task.leadId && (
                <p className="text-xs text-muted-foreground">Lead relacionado</p>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  {task.dueTime && ` às ${task.dueTime}`}
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const TasksView = () => {
  const { tasks, updateTask } = useStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    
    updateTask(taskId, { status: newStatus });
  };

  const statuses: TaskStatus[] = ['backlog', 'in_progress', 'review', 'done'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tarefas & Projetos</h2>
          <p className="text-muted-foreground">Organize e acompanhe suas tarefas</p>
        </div>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map((status) => {
            const statusTasks = tasks.filter((t) => t.status === status);
            
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{statusLabels[status]}</h3>
                  <Badge variant="secondary">{statusTasks.length}</Badge>
                </div>
                
                <SortableContext
                  id={status}
                  items={statusTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed">
                    {statusTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};
