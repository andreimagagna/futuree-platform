import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task, TaskStatus, Priority, Project, Lead, TaskActivity, TaskComment } from "@/store/useStore";
import { useStore } from "@/store/useStore";
import { 
  CalendarDays, Mail, Phone, Video, Tag, CheckSquare, Clock, 
  User, Paperclip, MessageSquare, Activity, Trash2, Plus, Eye,
  Timer, Target
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 as uuid } from "uuid";

interface TaskDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
}

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Video,
  note: MessageSquare,
  status_change: Activity,
  comment: MessageSquare,
};

export function TaskDetailDrawer({ open, onOpenChange, task, onUpdate }: TaskDetailDrawerProps) {
  const { 
    availableTags, 
    projects, 
    leads,
  } = useStore();
  
  const [newComment, setNewComment] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [activityType, setActivityType] = useState<"call" | "email" | "meeting">("call");
  const [activityContent, setActivityContent] = useState("");
  const [activityDuration, setActivityDuration] = useState("");

  const relatedLead = leads.find((l: Lead) => l.id === task.leadId);
  const relatedProject = projects.find((p: Project) => p.id === task.projectId);

  const toggleTag = (tag: string) => {
    const has = task.tags.includes(tag);
    const next = has ? task.tags.filter((t) => t !== tag) : [...task.tags, tag];
    onUpdate({ tags: next });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: TaskComment = {
      id: uuid(),
      content: newComment,
      createdAt: new Date(),
      createdBy: "Você",
    };
    
    // ✅ Salvar no backend via onUpdate
    const updatedComments = [...task.comments, comment];
    onUpdate({ comments: updatedComments });
    setNewComment("");
  };

  const handleAddActivity = () => {
    if (!activityContent.trim()) return;
    const activity: TaskActivity = {
      id: uuid(),
      type: activityType,
      content: activityContent,
      createdAt: new Date(),
      createdBy: "Você",
      metadata: activityDuration ? { duration: parseInt(activityDuration) } : undefined,
    };
    
    // ✅ Salvar no backend via onUpdate
    const updatedActivities = [...task.activities, activity];
    onUpdate({ activities: updatedActivities });
    setActivityContent("");
    setActivityDuration("");
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    // ✅ Salvar no backend via onUpdate
    const newItem = { id: uuid(), text: newChecklistItem, done: false };
    const updatedChecklist = [...task.checklist, newItem];
    onUpdate({ checklist: updatedChecklist });
    setNewChecklistItem("");
  };

  const completedCount = task.checklist.filter((c) => c.done).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b">
            <div className="space-y-3">
              <Input
                value={task.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="text-xl font-semibold border-none shadow-none px-0 focus-visible:ring-0"
              />
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={task.status === "done" ? "default" : "secondary"}>
                  {task.status === "backlog" && "Backlog"}
                  {task.status === "in_progress" && "Em Progresso"}
                  {task.status === "review" && "Em Revisão"}
                  {task.status === "done" && "Concluído"}
                </Badge>
                <Badge variant={task.priority === "P1" ? "destructive" : "outline"}>
                  {task.priority}
                </Badge>
                {task.timeTracked && (
                  <Badge variant="outline" className="gap-1">
                    <Timer className="h-3 w-3" />
                    {task.timeTracked}min
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-6">
              {/* Quick Meta Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Select value={task.status} onValueChange={(v) => onUpdate({ status: v as TaskStatus })}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="in_progress">Em Progresso</SelectItem>
                      <SelectItem value="review">Em Revisão</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Prioridade</label>
                  <Select value={task.priority} onValueChange={(v) => onUpdate({ priority: v as Priority })}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1">P1 - Alta</SelectItem>
                      <SelectItem value="P2">P2 - Média</SelectItem>
                      <SelectItem value="P3">P3 - Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> Data
                  </label>
                  <Input
                    type="date"
                    className="h-9"
                    value={task.dueDate ? format(task.dueDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => onUpdate({ dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Hora
                  </label>
                  <Input 
                    type="time" 
                    className="h-9"
                    value={task.dueTime || ""} 
                    onChange={(e) => onUpdate({ dueTime: e.target.value })} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Responsável
                  </label>
                  <Input 
                    className="h-9"
                    value={task.assignee} 
                    onChange={(e) => onUpdate({ assignee: e.target.value })} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3" /> Tempo estimado
                  </label>
                  <Input 
                    type="number"
                    className="h-9"
                    placeholder="minutos"
                    value={task.estimatedTime || ""} 
                    onChange={(e) => onUpdate({ estimatedTime: e.target.value ? parseInt(e.target.value) : undefined })} 
                  />
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Descrição</label>
                <Textarea 
                  rows={4} 
                  value={task.description} 
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Adicione uma descrição detalhada..."
                />
              </div>

              <Separator />

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Checklist</h3>
                    {totalCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {completedCount}/{totalCount} ({Math.round(progress)}%)
                      </span>
                    )}
                  </div>
                </div>
                
                {totalCount > 0 && (
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {task.checklist.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 group">
                      <input 
                        type="checkbox" 
                        checked={c.done} 
                        onChange={() => {
                          // ✅ Toggle no backend
                          const updatedChecklist = task.checklist.map(item =>
                            item.id === c.id ? { ...item, done: !item.done } : item
                          );
                          onUpdate({ checklist: updatedChecklist });
                        }}
                        className="rounded"
                      />
                      <span className={`flex-1 text-sm ${c.done ? "line-through text-muted-foreground" : ""}`}>
                        {c.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => {
                          // ✅ Deletar no backend
                          const updatedChecklist = task.checklist.filter(item => item.id !== c.id);
                          onUpdate({ checklist: updatedChecklist });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Nova subtarefa..."
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddChecklistItem()}
                    className="h-9"
                  />
                  <Button size="sm" onClick={handleAddChecklistItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((t) => {
                    const selected = task.tags.includes(t);
                    return (
                      <Button
                        key={t}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTag(t)}
                      >
                        {t}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Related Items */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Projeto</label>
                  <Select
                    value={task.projectId || "none"}
                    onValueChange={(v) => onUpdate({ projectId: v === "none" ? undefined : v })}
                  >
                    <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {projects.map((p: Project) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {relatedProject && (
                    <div className="text-xs text-muted-foreground mt-1">
                      🎯 {relatedProject.name}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Lead</label>
                  <Select
                    value={task.leadId || "none"}
                    onValueChange={(v) => onUpdate({ leadId: v === "none" ? undefined : v })}
                  >
                    <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {leads.map((l: Lead) => (
                        <SelectItem key={l.id} value={l.id}>{l.name} - {l.company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {relatedLead && (
                    <div className="text-xs text-muted-foreground mt-1">
                      👤 {relatedLead.name} ({relatedLead.company})
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Watchers */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Observadores</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.watchers.map((w) => (
                    <Badge key={w} variant="secondary">{w}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quick Engagement */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Registrar Atividade
                </h3>
                <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                  <Select value={activityType} onValueChange={(v) => setActivityType(v as any)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">📞 Ligação</SelectItem>
                      <SelectItem value="email">📧 E-mail</SelectItem>
                      <SelectItem value="meeting">🎥 Reunião</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Descreva a atividade..."
                    value={activityContent}
                    onChange={(e) => setActivityContent(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Duração (min)"
                      value={activityDuration}
                      onChange={(e) => setActivityDuration(e.target.value)}
                      className="h-9"
                    />
                    <Button size="sm" onClick={handleAddActivity} className="gap-1">
                      <Plus className="h-4 w-4" /> Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Comments */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Comentários ({task.comments.length})</h3>
                </div>
                
                <div className="space-y-3">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.createdBy}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(comment.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            // ✅ Deletar no backend
                            const updatedComments = task.comments.filter(c => c.id !== comment.id);
                            onUpdate({ comments: updatedComments });
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Adicionar comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                  />
                  <Button size="sm" onClick={handleAddComment}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Activity Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Timeline de Atividades ({task.activities.length})</h3>
                </div>
                
                <div className="space-y-3">
                  {task.activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
                  ) : (
                    task.activities.map((activity) => {
                      const Icon = activityIcons[activity.type];
                      return (
                        <div key={activity.id} className="flex gap-3 p-3 border rounded-lg">
                          <div className="mt-0.5">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm capitalize">
                                {activity.type === "call" && "Ligação"}
                                {activity.type === "email" && "E-mail"}
                                {activity.type === "meeting" && "Reunião"}
                                {activity.type === "note" && "Nota"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(activity.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </span>
                              {activity.metadata?.duration && (
                                <Badge variant="outline" className="text-xs">
                                  {activity.metadata.duration}min
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">por {activity.createdBy}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4">
                <p>Criado em {format(task.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} por {task.createdBy}</p>
                {task.updatedAt && (
                  <p>Última atualização: {format(task.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
