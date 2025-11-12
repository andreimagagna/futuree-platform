import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Task, TaskStatus, Priority, TaskActivity, TaskComment } from "@/store/useStore";
import { useStore } from "@/store/useStore";
import { 
  CalendarDays, CheckSquare, 
  MessageSquare, Activity, Trash2, Plus,
  Timer, Sparkles, Loader2, Copy, Phone, Mail, Video
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 as uuid } from "uuid";
import { assistTextWithAI } from "@/services/textAssistantAI";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  
  // ✨ AI State
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  // ✨ AI Handler
  const handleAIAssist = async () => {
    if (!task.title.trim()) {
      toast({
        title: "⚠️ Título necessário",
        description: "Adicione um título à tarefa antes de gerar a descrição com IA",
      });
      return;
    }

    setIsAILoading(true);
    setAiSuggestion("");

    try {
      const prompt = `Crie uma descrição detalhada e estruturada para esta tarefa: "${task.title}".
${task.description ? `Descrição atual: ${task.description}` : ""}

Formate a resposta com:
- Objetivo principal
- Passos sugeridos
- Critérios de aceitação
- Pontos de atenção (se relevante)`;

      const suggestion = await assistTextWithAI(prompt, task.title, task.description || "");
      setAiSuggestion(suggestion);
      
      toast({
        title: "✨ Sugestão gerada!",
        description: "Revise e insira a descrição sugerida",
      });
    } catch (error) {
      console.error("Erro ao gerar sugestão:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível gerar a sugestão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleInsertAISuggestion = () => {
    onUpdate({ description: aiSuggestion });
    setAiSuggestion("");
    toast({
      title: "✅ Inserido!",
      description: "Descrição substituída pela sugestão da IA",
    });
  };

  const handleAppendAISuggestion = () => {
    const newDescription = task.description 
      ? `${task.description}\n\n---\n\n${aiSuggestion}`
      : aiSuggestion;
    onUpdate({ description: newDescription });
    setAiSuggestion("");
    toast({
      title: "✅ Adicionado!",
      description: "Sugestão adicionada à descrição existente",
    });
  };

  const handleCopyAISuggestion = () => {
    navigator.clipboard.writeText(aiSuggestion);
    toast({
      title: "📋 Copiado!",
      description: "Sugestão copiada para a área de transferência",
    });
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
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 overflow-hidden">
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
              <div className="grid grid-cols-3 gap-3">
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
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold">Descrição</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAIAssist}
                    disabled={isAILoading}
                    className="gap-1.5 h-8"
                  >
                    {isAILoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {isAILoading ? "Gerando..." : "Gerar com IA"}
                  </Button>
                </div>
                <Textarea 
                  rows={12} 
                  value={task.description} 
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Adicione uma descrição detalhada da tarefa..."
                  className="min-h-[300px] resize-y"
                />
                
                {aiSuggestion && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">Sugestão da IA</span>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={handleInsertAISuggestion}
                            className="h-7 gap-1.5"
                          >
                            <Plus className="h-3 w-3" />
                            Substituir
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAppendAISuggestion}
                            className="h-7 gap-1.5"
                          >
                            <Plus className="h-3 w-3" />
                            Adicionar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyAISuggestion}
                            className="h-7 gap-1.5"
                          >
                            <Copy className="h-3 w-3" />
                            Copiar
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm whitespace-pre-wrap bg-background/50 p-4 rounded-md border max-h-[400px] overflow-y-auto">
                        {aiSuggestion}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Checklist</h3>
                    {totalCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {completedCount}/{totalCount} • {Math.round(progress)}%
                      </Badge>
                    )}
                  </div>
                </div>
                
                {totalCount > 0 && (
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  {task.checklist.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma subtarefa ainda</p>
                  ) : (
                    task.checklist.map((c) => (
                      <div key={c.id} className="flex items-center gap-2.5 group p-2 rounded hover:bg-muted/50 transition-colors">
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
                          className="rounded w-4 h-4 cursor-pointer"
                        />
                        <span className={`flex-1 text-sm transition-all ${c.done ? "line-through text-muted-foreground" : "font-medium"}`}>
                          {c.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            // ✅ Deletar no backend
                            const updatedChecklist = task.checklist.filter(item => item.id !== c.id);
                            onUpdate({ checklist: updatedChecklist });
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Nova subtarefa..."
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddChecklistItem()}
                    className="h-9"
                  />
                  <Button size="sm" onClick={handleAddChecklistItem} className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Comments */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Comentários</h3>
                    <Badge variant="secondary" className="text-xs">{task.comments.length}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {task.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário ainda</p>
                  ) : (
                    task.comments.map((comment) => (
                      <div key={comment.id} className="p-3 border rounded-lg bg-muted/30 group hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-medium text-sm">{comment.createdBy}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(comment.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{comment.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Adicionar comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        handleAddComment();
                      }
                    }}
                    rows={3}
                    className="resize-none"
                  />
                  <Button size="sm" onClick={handleAddComment} className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Dica: Ctrl+Enter para adicionar</p>
              </div>

              <Separator />

              {/* Activity Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Timeline de Atividades</h3>
                    <Badge variant="secondary" className="text-xs">{task.activities.length}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {task.activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade registrada</p>
                  ) : (
                    task.activities.map((activity) => {
                      const Icon = activityIcons[activity.type];
                      return (
                        <div key={activity.id} className="flex gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="mt-0.5">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-1.5">
                              <span className="font-medium text-sm">
                                {activity.type === "call" && "📞 Ligação"}
                                {activity.type === "email" && "📧 E-mail"}
                                {activity.type === "meeting" && "🎥 Reunião"}
                                {activity.type === "note" && "📝 Nota"}
                              </span>
                              {activity.metadata?.duration && (
                                <Badge variant="outline" className="text-xs">
                                  {activity.metadata.duration}min
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground ml-auto">
                                {format(activity.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed mb-1">{activity.content}</p>
                            <p className="text-xs text-muted-foreground">por {activity.createdBy}</p>
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
