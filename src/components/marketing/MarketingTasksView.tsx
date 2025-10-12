import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
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
  CheckSquare,
  Megaphone,
  Palette,
  Mail,
  BarChart3,
  Search as SearchIcon,
  Lightbulb,
  MoreVertical,
  Edit,
  Trash2,
  User
} from "lucide-react";
import { differenceInDays, isPast, isToday } from "date-fns";
import { mockMarketingTasks } from "@/utils/marketingMockData";
import type { MarketingTask, MarketingTaskStatus } from "@/types/Marketing";
import { useToast } from "@/hooks/use-toast";
import { MarketingTaskForm } from "./MarketingTaskForm";
import { MarketingTaskDetailDrawer } from "./MarketingTaskDetailDrawer";

const statusLabels: Record<MarketingTaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
};

const statusColors: Record<MarketingTaskStatus, string> = {
  backlog: 'border-l-muted-foreground',
  in_progress: 'border-l-accent',
  review: 'border-l-warning',
  done: 'border-l-success',
};

const columnColors: Record<MarketingTaskStatus, string> = {
  backlog: 'bg-muted',
  in_progress: 'bg-accent/10',
  review: 'bg-warning/10',
  done: 'bg-success/10',
};

const priorityColors: Record<'P1' | 'P2' | 'P3', string> = {
  P1: 'bg-destructive text-destructive-foreground',
  P2: 'bg-warning text-warning-foreground',
  P3: 'bg-muted text-muted-foreground',
};

const categoryIcons = {
  conteudo: Lightbulb,
  social_media: Megaphone,
  email: Mail,
  paid_ads: BarChart3,
  seo: SearchIcon,
  eventos: CalendarDays,
  branding: Palette,
  analytics: BarChart3,
  planejamento: LayoutGrid,
};

interface TaskCardProps {
  task: MarketingTask;
  onOpen: (task: MarketingTask) => void;
  onEdit: (task: MarketingTask) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onOpen, onEdit, onDelete }: TaskCardProps) => {
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

  const CategoryIcon = categoryIcons[task.category];

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-l-4",
        statusColors[task.status]
      )}>
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div {...listeners} className="mt-0.5 cursor-grab hover:bg-muted/50 rounded p-0.5">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2.5" onClick={() => onOpen(task)} role="button">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm leading-tight">{task.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={priorityColors[task.priority]} variant="secondary">
                    {task.priority}
                  </Badge>
                </div>
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

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
            
            {/* Menu de Ações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const MarketingTasksView = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<MarketingTask[]>(mockMarketingTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MarketingTaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "P1" | "P2" | "P3">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [selectedTask, setSelectedTask] = useState<MarketingTask | null>(null);
  const [openNewTask, setOpenNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState<MarketingTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newStatus = over.id as MarketingTaskStatus;
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    ));

    toast({
      title: "Task atualizada",
      description: `Status alterado para ${statusLabels[newStatus]}`,
    });
  };

  const handleCreateTask = (task: MarketingTask) => {
    setTasks(prev => [task, ...prev]);
    setOpenNewTask(false);
    toast({
      title: "Task criada",
      description: `"${task.title}" foi criada com sucesso.`,
    });
  };

  const handleUpdateTask = (task: MarketingTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    setEditingTask(null);
    toast({
      title: "Task atualizada",
      description: `"${task.title}" foi atualizada com sucesso.`,
    });
  };

  const handleUpdateTaskFromDrawer = (task: MarketingTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    toast({
      title: "Task atualizada",
      description: `"${task.title}" foi atualizada.`,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast({
      title: "Task excluída",
      description: `"${task?.title}" foi excluída.`,
    });
  };

  const handleToggleChecklistItem = (taskId: string, checklistId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          checklist: t.checklist.map(c => 
            c.id === checklistId ? { ...c, done: !c.done } : c
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
  };

  const statuses: MarketingTaskStatus[] = ['backlog', 'in_progress', 'review', 'done'];

  const filteredTasks: MarketingTask[] = useMemo(() => {
    return tasks.filter((t: MarketingTask) => {
      const matchesSearch = search
        ? t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter;
      const matchesPriority = priorityFilter === "all" ? true : t.priority === priorityFilter;
      const matchesCategory = categoryFilter === "all" ? true : t.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, search, statusFilter, priorityFilter, categoryFilter]);

  const availableCategories = Array.from(new Set(tasks.map(t => t.category)));

  return (
    <div className="space-y-4">
      {/* Header & Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tasks de Marketing</h2>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "board" | "list")}>
            <TabsList>
              <TabsTrigger value="board" className="gap-1">
                <LayoutGrid className="h-4 w-4" /> Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1">
                <List className="h-4 w-4" /> Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setOpenNewTask(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Nova Task
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
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MarketingTaskStatus | "all")}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as "P1" | "P2" | "P3" | "all")}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Prioridade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="P1">P1</SelectItem>
            <SelectItem value="P2">P2</SelectItem>
            <SelectItem value="P3">P3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {availableCategories.map((c) => (
              <SelectItem key={c} value={c}>
                {c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {viewMode === "board" ? (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  
                  <SortableContext
                    id={status}
                    items={statusTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-[400px] p-3 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                      {statusTasks.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                          Arraste tasks aqui
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
                            onEdit={(t) => setEditingTask(t)}
                            onDelete={handleDeleteTask}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </DndContext>
      ) : (
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  Nenhuma task encontrada
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const CategoryIcon = categoryIcons[task.category];
              const completedCount = task.checklist.filter(c => c.done).length;
              const totalCount = task.checklist.length;
              
              return (
                <Card
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setDetailOpen(true);
                  }}
                  className="cursor-pointer hover:shadow-md transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          <p className="font-semibold">{task.title}</p>
                          <Badge className={priorityColors[task.priority]} variant="secondary">
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">{statusLabels[task.status]}</Badge>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignedTo}
                          </div>
                          
                          {totalCount > 0 && (
                            <div className="flex items-center gap-1">
                              <CheckSquare className="h-3 w-3" />
                              {completedCount}/{totalCount}
                            </div>
                          )}
                          
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                              {task.dueTime && ` ${task.dueTime}`}
                            </div>
                          )}
                        </div>
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
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
      )}

      {/* Dialog Nova Task */}
      <Dialog open={openNewTask} onOpenChange={setOpenNewTask}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Task de Marketing</DialogTitle>
          </DialogHeader>
          <MarketingTaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setOpenNewTask(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Task */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Task</DialogTitle>
            </DialogHeader>
            <MarketingTaskForm
              initialData={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Drawer de Detalhes */}
      {selectedTask && (
        <MarketingTaskDetailDrawer
          open={detailOpen}
          onOpenChange={setDetailOpen}
          task={selectedTask}
          onUpdate={handleUpdateTaskFromDrawer}
          onEdit={(t) => {
            setEditingTask(t);
            setDetailOpen(false);
          }}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};
