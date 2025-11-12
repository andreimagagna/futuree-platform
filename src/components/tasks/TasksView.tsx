import { useState, useMemo } from "react";
import type { TaskStatus, Task, Priority } from "@/store/useStore";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasksAPI';
// TODO: Substituir por useTasksAPI quando disponível
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DndContext, DragEndEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  GripVertical, 
  CalendarDays, 
  LayoutGrid, 
  Plus, 
  List,
  AlertCircle,
  CheckSquare,
  TrendingUp,
  Calendar as CalendarIcon
} from "lucide-react";
import { differenceInDays, isPast, isToday } from "date-fns";
import { TaskCalendar } from "./TaskCalendar";
import { TaskForm } from "./TaskForm";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { TaskListView } from "./TaskListView";

const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
};

const statusColors: Record<TaskStatus, string> = {
  backlog: 'border-l-muted-foreground',
  in_progress: 'border-l-accent',
  review: 'border-l-warning',
  done: 'border-l-success',
};

const columnColors: Record<TaskStatus, string> = {
  backlog: 'bg-muted',
  in_progress: 'bg-accent/10',
  review: 'bg-warning/10',
  done: 'bg-success/10',
};

const priorityColors: Record<Priority, string> = {
  P1: 'bg-destructive text-destructive-foreground',
  P2: 'bg-warning text-warning-foreground',
  P3: 'bg-muted text-muted-foreground',
};

// Apenas 3 colunas: Backlog, Em Progresso, Concluído
const ACTIVE_STATUSES: TaskStatus[] = ['backlog', 'in_progress', 'done'];

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
}

const TaskCard = ({ task, onOpen }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedCount = task.checklist.filter((c) => c.done).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const daysUntil = task.dueDate ? differenceInDays(new Date(task.dueDate), new Date()) : null;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-l-4",
        statusColors[task.status]
      )}>
        <CardContent className="p-3" onClick={() => onOpen(task)} role="button">
          <div className="flex items-start gap-2">
            <div {...listeners} className="mt-0.5 cursor-grab hover:bg-muted/50 rounded p-0.5">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2.5">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm leading-tight flex-1">{task.title}</p>
                <Badge className={priorityColors[task.priority]} variant="secondary">
                  {task.priority}
                </Badge>
              </div>

              {/* Data de vencimento */}
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs",
                  isOverdue && "text-destructive font-medium",
                  isDueToday && !isOverdue && "text-warning font-medium",
                  !isOverdue && !isDueToday && "text-muted-foreground"
                )}>
                  <Clock className="h-3 w-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                  {task.dueTime && <span>• {task.dueTime}</span>}
                  {isOverdue && daysUntil !== null && (
                    <Badge variant="destructive" className="ml-auto text-xs py-0 h-5">
                      {Math.abs(daysUntil)}d atraso
                    </Badge>
                  )}
                </div>
              )}

              {/* Progresso do checklist */}
              {totalCount > 0 && (
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-3 w-3 text-muted-foreground" />
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {completedCount}/{totalCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Droppable Column Component
const DroppableColumn = ({ status, children }: { status: TaskStatus; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id: status });
  
  return (
    <div ref={setNodeRef} className="space-y-3 min-h-[400px] p-3 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/5">
      {children}
    </div>
  );
};

export const TasksView = () => {
  const { data: tasks = [] } = useTasks();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [tagFilter, setTagFilter] = useState<string | "all">("all");
  const [viewMode, setViewMode] = useState<"board" | "calendar" | "list">("board");
  const [openNewTask, setOpenNewTask] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const statuses: TaskStatus[] = ACTIVE_STATUSES;

  const filteredTasks: Task[] = useMemo(() => {
    return tasks.filter((t: Task) => {
      const matchesSearch = search
        ? t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter;
      const matchesPriority = priorityFilter === "all" ? true : t.priority === priorityFilter;
      const matchesTag = tagFilter === "all" ? true : t.tags.includes(tagFilter as string);
      return matchesSearch && matchesStatus && matchesPriority && matchesTag;
    });
  }, [tasks, search, statusFilter, priorityFilter, tagFilter]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t: Task) => t.id === taskId);
    if (!task) return;

    // over.id pode ser tanto um status (coluna) quanto um taskId (dentro da lista)
    // Vamos verificar se é um status válido primeiro
    let newStatus: TaskStatus;
    
    if (statuses.includes(over.id as TaskStatus)) {
      // Arrastou diretamente para a coluna
      newStatus = over.id as TaskStatus;
      console.log(`✅ Dropped on column: ${over.id}`);
    } else {
      // Arrastou sobre outra tarefa - encontrar o status dessa tarefa
      const overTask = tasks.find((t: Task) => t.id === over.id);
      if (!overTask) {
        console.log(`❌ Could not find task with id: ${over.id}`);
        return;
      }
      newStatus = overTask.status;
      console.log(`✅ Dropped on task in column: ${newStatus}`);
    }

    // Não fazer nada se o status não mudou
    if (task.status === newStatus) {
      console.log(`⚠️ Status unchanged: ${newStatus}`);
      return;
    }

    console.log(`🚀 Moving task "${task.title}" from ${task.status} to ${newStatus}`);

    // ✅ ATUALIZAR STATUS NO BACKEND
    updateTask({ id: taskId, updates: { status: newStatus } });
  };

  return (
    <div className="space-y-4">
      {/* Header & Toolbar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Tarefas & Projetos</h1>
          <p className="text-muted-foreground">Gerencie e organize suas tarefas e projetos</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "board" | "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="board" className="gap-1">
                <LayoutGrid className="h-4 w-4" /> Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1">
                <List className="h-4 w-4" /> Lista
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-1">
                <CalendarDays className="h-4 w-4" /> Calendário
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setOpenNewTask(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por título ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[320px]"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | "all")}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Prioridade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="P1">P1</SelectItem>
            <SelectItem value="P2">P2</SelectItem>
            <SelectItem value="P3">P3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tagFilter} onValueChange={(v) => setTagFilter(v as string | "all")}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Tag" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas tags</SelectItem>
            {/* TODO: Carregar tags do backend se necessário */}
          </SelectContent>
        </Select>
      </div>

      {viewMode === "board" ? (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statuses.map((status) => {
              const statusTasks = filteredTasks.filter((t) => t.status === status);
              const totalChecklist = statusTasks.reduce((sum, t) => sum + t.checklist.length, 0);
              const completedChecklist = statusTasks.reduce((sum, t) => sum + t.checklist.filter(c => c.done).length, 0);
              
              return (
                <div key={status} className="space-y-3">
                  <Card className={cn("border-2", columnColors[status])}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm">{statusLabels[status]}</h3>
                          <Badge variant="secondary" className="font-semibold">
                            {statusTasks.length}
                          </Badge>
                        </div>
                        {totalChecklist > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progresso total</span>
                              <span className="font-medium">
                                {completedChecklist}/{totalChecklist}
                              </span>
                            </div>
                            <Progress 
                              value={(completedChecklist / totalChecklist) * 100} 
                              className="h-1.5"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <DroppableColumn status={status}>
                    <SortableContext
                      id={status}
                      items={statusTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {statusTasks.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                          Arraste tarefas aqui
                        </div>
                      ) : (
                        statusTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onOpen={(t) => {
                              setSelectedTask(t);
                              setDetailOpen(true);
                            }}
                          />
                        ))
                      )}
                    </SortableContext>
                  </DroppableColumn>
                </div>
              );
            })}
          </div>
        </DndContext>
      ) : viewMode === "list" ? (
        <TaskListView 
          tasks={filteredTasks} 
          onOpenTask={(t) => {
            setSelectedTask(t);
            setDetailOpen(true);
          }}
        />
      ) : (
        <TaskCalendar tasks={filteredTasks} />
      )}

      {/* New Task Dialog */}
      <Dialog open={openNewTask} onOpenChange={setOpenNewTask}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
            <DialogDescription>
              Crie uma nova tarefa para organizar seu trabalho
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSubmit={(task) => {
              // ✅ USAR createTask do hook ao invés de addTask
              createTask(task as any);
              setOpenNewTask(false);
            }}
            onCancel={() => setOpenNewTask(false)}
          />
        </DialogContent>
      </Dialog>
      {selectedTask && (
        <TaskDetailDrawer
          open={detailOpen}
          onOpenChange={setDetailOpen}
          task={selectedTask}
          onUpdate={(updates) => {
            // ✅ Atualizar no backend
            updateTask({ id: selectedTask.id, updates });
            
            // ✅ Atualizar task local imediatamente para UX responsivo
            setSelectedTask({ ...selectedTask, ...updates });
          }}
        />
      )}
    </div>
  );
};
