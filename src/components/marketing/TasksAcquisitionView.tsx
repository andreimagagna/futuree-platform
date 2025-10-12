import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  AcquisitionTask,
  AcquisitionStatus,
  AcquisitionChannel,
  AcquisitionPriority,
  statusLabels,
  statusColors,
  columnColors,
  priorityColors,
  priorityLabels,
  channelLabels,
  channelColors,
  channelIcons,
} from "@/types/Acquisition";
import {
  GripVertical,
  LayoutGrid,
  Plus,
  List,
  TrendingUp,
  DollarSign,
  Target,
  MousePointer,
  Eye,
  Calendar as CalendarIcon,
} from "lucide-react";
import { mockAcquisitionTasks, availableAcquisitionTags } from "@/utils/acquisitionMockData";
import { differenceInDays, isPast, isToday } from "date-fns";

interface AcquisitionCardProps {
  task: AcquisitionTask;
  onOpen: (task: AcquisitionTask) => void;
}

const AcquisitionCard = ({ task, onOpen }: AcquisitionCardProps) => {
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

  const daysUntil = task.endDate ? differenceInDays(new Date(task.endDate), new Date()) : null;
  const isOverdue = task.endDate && isPast(new Date(task.endDate)) && !isToday(new Date(task.endDate)) && task.status !== 'completed';
  const isDueToday = task.endDate && isToday(new Date(task.endDate));

  const budgetUsed = task.metrics.budget > 0 ? (task.metrics.spent / task.metrics.budget) * 100 : 0;
  const leadsProgress = task.goals.targetLeads > 0 ? (task.metrics.leads / task.goals.targetLeads) * 100 : 0;

  const roi = task.metrics.spent > 0 ? ((task.metrics.conversions * 1000 - task.metrics.spent) / task.metrics.spent) * 100 : 0;

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
                  {priorityLabels[task.priority]}
                </Badge>
              </div>

              {/* Canal */}
              <div>
                <Badge className={channelColors[task.channel]} variant="secondary">
                  {channelIcons[task.channel]} {channelLabels[task.channel]}
                </Badge>
              </div>

              {/* Métricas Principais */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Leads:</span>
                  <span className="font-bold">{task.metrics.leads}</span>
                  <span className="text-muted-foreground">/{task.goals.targetLeads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-success dark:text-green-400" />
                  <span className="text-muted-foreground">CPL:</span>
                  <span className="font-bold">R$ {task.metrics.cpl.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  <span className="text-muted-foreground">Conv:</span>
                  <span className="font-bold">{task.metrics.conversions}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-bold">{budgetUsed.toFixed(0)}%</span>
                </div>
              </div>

              {/* Progress do Budget */}
              {task.metrics.budget > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Budget</span>
                    <span>R$ {task.metrics.spent.toLocaleString()} / R$ {task.metrics.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={budgetUsed} className="h-1.5" />
                </div>
              )}

              {/* Progress de Leads */}
              {task.goals.targetLeads > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Meta de Leads</span>
                    <span>{leadsProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={leadsProgress} className="h-1.5" />
                </div>
              )}

              {/* Progresso do checklist */}
              {totalCount > 0 && (
                <div className="flex items-center gap-2 pt-1 border-t">
                  <div className="flex-1">
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {completedCount}/{totalCount} ações
                  </span>
                </div>
              )}

              {/* Data de término */}
              {task.endDate && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs pt-1",
                  isOverdue && "text-destructive font-medium",
                  isDueToday && !isOverdue && "text-warning font-medium",
                  !isOverdue && !isDueToday && "text-muted-foreground"
                )}>
                  <CalendarIcon className="h-3 w-3" />
                  <span>Término: {new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                  {isOverdue && daysUntil !== null && (
                    <Badge variant="destructive" className="ml-auto text-xs py-0 h-5">
                      {Math.abs(daysUntil)}d atraso
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const TasksAcquisitionView = () => {
  const [tasks, setTasks] = useState<AcquisitionTask[]>(mockAcquisitionTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AcquisitionStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<AcquisitionChannel | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<AcquisitionPriority | "all">("all");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [openNewTask, setOpenNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AcquisitionTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as AcquisitionStatus;

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    ));
  };

  const statuses: AcquisitionStatus[] = ['planning', 'in-progress', 'active', 'completed'];

  const filteredTasks: AcquisitionTask[] = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = search
        ? t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter;
      const matchesChannel = channelFilter === "all" ? true : t.channel === channelFilter;
      const matchesPriority = priorityFilter === "all" ? true : t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesChannel && matchesPriority;
    });
  }, [tasks, search, statusFilter, channelFilter, priorityFilter]);

  // Calcular métricas totais
  const totalMetrics = useMemo(() => {
    const activeTasks = filteredTasks.filter(t => t.status === 'active' || t.status === 'in-progress');
    return {
      totalBudget: activeTasks.reduce((sum, t) => sum + t.metrics.budget, 0),
      totalSpent: activeTasks.reduce((sum, t) => sum + t.metrics.spent, 0),
      totalLeads: activeTasks.reduce((sum, t) => sum + t.metrics.leads, 0),
      totalConversions: activeTasks.reduce((sum, t) => sum + t.metrics.conversions, 0),
      avgCPL: activeTasks.length > 0
        ? activeTasks.reduce((sum, t) => sum + t.metrics.cpl, 0) / activeTasks.length
        : 0,
    };
  }, [filteredTasks]);

  return (
    <div className="space-y-4">
      {/* Header & Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tasks Acquisition</h2>
          <p className="text-sm text-muted-foreground">
            Planejador de Canais de Aquisição
          </p>
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

      {/* KPIs Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {filteredTasks.filter(t => t.status === 'active').length}
              </div>
              <TrendingUp className="h-5 w-5 text-success dark:text-green-400" />
            </div>
            <div className="text-sm text-muted-foreground">Campanhas Ativas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                R$ {(totalMetrics.totalSpent / 1000).toFixed(0)}K
              </div>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">
              Investido / R$ {(totalMetrics.totalBudget / 1000).toFixed(0)}K
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{totalMetrics.totalLeads}</div>
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div className="text-sm text-muted-foreground">Total de Leads</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{totalMetrics.totalConversions}</div>
              <MousePointer className="h-5 w-5 text-warning" />
            </div>
            <div className="text-sm text-muted-foreground">Conversões</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">R$ {totalMetrics.avgCPL.toFixed(0)}</div>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">CPL Médio</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por título ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[320px]"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AcquisitionStatus | "all")}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={channelFilter} onValueChange={(v) => setChannelFilter(v as AcquisitionChannel | "all")}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Canal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos canais</SelectItem>
            {Object.entries(channelLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{channelIcons[key as AcquisitionChannel]} {label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as AcquisitionPriority | "all")}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Prioridade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === "board" ? (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map((status) => {
              const statusTasks = filteredTasks.filter((t) => t.status === status);
              const totalBudget = statusTasks.reduce((sum, t) => sum + t.metrics.budget, 0);
              const totalSpent = statusTasks.reduce((sum, t) => sum + t.metrics.spent, 0);
              const totalLeads = statusTasks.reduce((sum, t) => sum + t.metrics.leads, 0);

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
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Budget:</span>
                            <span className="font-medium">R$ {(totalSpent / 1000).toFixed(0)}K / {(totalBudget / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Leads:</span>
                            <span className="font-medium">{totalLeads}</span>
                          </div>
                        </div>
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
                          <AcquisitionCard
                            key={task.id}
                            task={task}
                            onOpen={(t) => {
                              setSelectedTask(t);
                              setDetailOpen(true);
                            }}
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
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground py-12">
              Vista de lista em desenvolvimento
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Dialog open={openNewTask} onOpenChange={setOpenNewTask}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Task de Aquisição</DialogTitle>
          </DialogHeader>
          <div className="text-center text-muted-foreground py-12">
            Formulário em desenvolvimento
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">{selectedTask.description}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Métricas</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Leads:</span>
                      <span className="font-medium">{selectedTask.metrics.leads} / {selectedTask.goals.targetLeads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversões:</span>
                      <span className="font-medium">{selectedTask.metrics.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPL:</span>
                      <span className="font-medium">R$ {selectedTask.metrics.cpl.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-medium">R$ {selectedTask.metrics.spent.toLocaleString()} / R$ {selectedTask.metrics.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Informações</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{statusLabels[selectedTask.status]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prioridade:</span>
                      <span className="font-medium">{priorityLabels[selectedTask.priority]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Canal:</span>
                      <span className="font-medium">{channelLabels[selectedTask.channel]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Responsável:</span>
                      <span className="font-medium">{selectedTask.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
