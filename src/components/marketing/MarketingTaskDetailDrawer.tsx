import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import type { MarketingTask, MarketingTaskStatus, MarketingTaskType, MarketingCategory } from "@/types/Marketing";
import { 
  CalendarDays, Tag, CheckSquare, Clock, 
  User, Trash2, Plus, Edit,
  Timer, Lightbulb, Megaphone, Palette, Mail, 
  BarChart3, Search as SearchIcon, LayoutGrid
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 as uuid } from "uuid";

interface MarketingTaskDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: MarketingTask;
  onUpdate: (task: MarketingTask) => void;
  onEdit: (task: MarketingTask) => void;
  onDelete: (taskId: string) => void;
}

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

const statusLabels: Record<MarketingTaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
};

const priorityColors: Record<'P1' | 'P2' | 'P3', string> = {
  P1: 'bg-destructive text-destructive-foreground',
  P2: 'bg-warning text-warning-foreground',
  P3: 'bg-muted text-muted-foreground',
};

export function MarketingTaskDetailDrawer({ 
  open, 
  onOpenChange, 
  task, 
  onUpdate,
  onEdit,
  onDelete
}: MarketingTaskDetailDrawerProps) {
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newTag, setNewTag] = useState("");

  const CategoryIcon = categoryIcons[task.category];

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const updatedTask = {
      ...task,
      checklist: [
        ...task.checklist,
        { id: uuid(), text: newChecklistItem, done: false }
      ],
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedTask);
    setNewChecklistItem("");
  };

  const handleToggleChecklistItem = (checklistId: string) => {
    const updatedTask = {
      ...task,
      checklist: task.checklist.map(c => 
        c.id === checklistId ? { ...c, done: !c.done } : c
      ),
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedTask);
  };

  const handleDeleteChecklistItem = (checklistId: string) => {
    const updatedTask = {
      ...task,
      checklist: task.checklist.filter(c => c.id !== checklistId),
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedTask);
  };

  const handleAddTag = () => {
    if (!newTag.trim() || task.tags.includes(newTag)) return;
    const updatedTask = {
      ...task,
      tags: [...task.tags, newTag],
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedTask);
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTask = {
      ...task,
      tags: task.tags.filter(t => t !== tag),
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedTask);
  };

  const handleUpdateStatus = (status: MarketingTaskStatus) => {
    const updatedTask = {
      ...task,
      status,
      updatedAt: new Date().toISOString(),
      completedAt: status === 'done' ? new Date().toISOString() : task.completedAt,
    };
    onUpdate(updatedTask);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir "${task.title}"?`)) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  const completedCount = task.checklist.filter((c) => c.done).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-hidden flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                <Badge className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
                <Badge variant="outline">{statusLabels[task.status]}</Badge>
              </div>
              <SheetTitle className="text-2xl">{task.title}</SheetTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            {/* Descrição */}
            {task.description && (
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Informações */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-3">Informações</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Responsável:</span>
                    <span className="font-medium">{task.assignedTo}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="font-medium capitalize">{task.category.replace('_', ' ')}</span>
                  </div>

                  {task.estimatedHours && (
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Estimativa:</span>
                      <span className="font-medium">{task.estimatedHours}h</span>
                    </div>
                  )}

                  {task.actualHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tempo real:</span>
                      <span className="font-medium">{task.actualHours}h</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Status</h3>
                <Select value={task.status} onValueChange={(v) => handleUpdateStatus(v as MarketingTaskStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="review">Em Revisão</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>

                {task.dueDate && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Vencimento:</span>
                    <span className="font-medium">
                      {format(new Date(task.dueDate), "dd 'de' MMMM", { locale: ptBR })}
                      {task.dueTime && ` às ${task.dueTime}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Checklist</h3>
                {totalCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {completedCount} de {totalCount} ({Math.round(progress)}%)
                  </span>
                )}
              </div>
              
              {totalCount > 0 && (
                <Progress value={progress} className="h-2 mb-4" />
              )}

              <div className="space-y-2">
                {task.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleChecklistItem(item.id)}
                    >
                      <CheckSquare 
                        className={item.done ? "h-4 w-4 text-success" : "h-4 w-4 text-muted-foreground"} 
                      />
                    </Button>
                    <span className={item.done ? "line-through text-muted-foreground flex-1" : "flex-1"}>
                      {item.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Nova subtarefa..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                />
                <Button onClick={handleAddChecklistItem} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-2">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Datas */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Criado em: {format(new Date(task.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</div>
              <div>Atualizado em: {format(new Date(task.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</div>
              {task.completedAt && (
                <div>Concluído em: {format(new Date(task.completedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
