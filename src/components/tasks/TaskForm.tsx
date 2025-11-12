import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, Task, TaskStatus, Priority } from "@/store/useStore";
import { v4 as uuid } from "uuid";
import { Sparkles, Loader2, Plus, Copy } from "lucide-react";
import { assistTextWithAI } from "@/services/textAssistantAI";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  title: z.string().min(3, "Informe um título"),
  description: z.string().optional(),
  priority: z.enum(["P1", "P2", "P3"]),
  status: z.enum(["backlog", "in_progress", "review", "done"]),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assignee: z.string().min(1, "Responsável obrigatório"),
});

export function TaskForm({ onSubmit, onCancel }: { onSubmit: (task: Task) => void; onCancel: () => void }) {
  const { availableTags } = useStore();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "P2",
      status: "backlog",
      assignee: "Você",
    },
  });

  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const currentTitle = watch("title");
  const currentDescription = watch("description");

  const handleAIAssist = async () => {
    if (!currentTitle.trim()) {
      toast({
        title: "Título necessário",
        description: "Preencha o título da tarefa primeiro",
        variant: "destructive",
      });
      return;
    }

    setIsAILoading(true);
    setAiSuggestion("");

    try {
      const prompt = `Crie uma descrição detalhada e estruturada para esta tarefa:

Título: ${currentTitle}
${currentDescription ? `Descrição atual: ${currentDescription}` : ''}

Forneça uma descrição profissional com:
- Objetivo claro
- Passos ou checklist quando aplicável
- Critérios de aceitação
- Contexto relevante

Use Markdown para formatação (negrito, listas, etc).`;

      const response = await assistTextWithAI(prompt, currentTitle, currentDescription || "");
      setAiSuggestion(response);
      
      toast({
        title: "✨ Descrição gerada!",
        description: "Confira a sugestão da IA abaixo",
      });
    } catch (error) {
      console.error("Erro ao gerar descrição:", error);
      toast({
        title: "Erro ao gerar descrição",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleInsertAI = () => {
    setValue("description", aiSuggestion);
    setAiSuggestion("");
    toast({
      title: "✅ Descrição inserida!",
      description: "A sugestão da IA foi adicionada",
    });
  };

  const submit = handleSubmit((values) => {
    const task: Task = {
      id: uuid(),
      title: values.title,
      description: values.description || "",
      priority: values.priority as Priority,
      status: values.status as TaskStatus,
      dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
      dueTime: values.dueTime,
      tags: values.tags || [],
      assignee: values.assignee,
      checklist: [],
      createdAt: new Date(),
      createdBy: "Você",
      activities: [],
      comments: [],
      attachments: [],
      watchers: ["Você"],
    };
    onSubmit(task);
  });

  const tags = watch("tags") || [];

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input {...register("title")} placeholder="Ex: Ligar para cliente sobre proposta" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Responsável</label>
          <Input {...register("assignee")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Prioridade</label>
          <Select onValueChange={(v) => setValue("priority", v as "P1" | "P2" | "P3")} defaultValue="P2">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="P1">P1</SelectItem>
              <SelectItem value="P2">P2</SelectItem>
              <SelectItem value="P3">P3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select onValueChange={(v) => setValue("status", v as TaskStatus)} defaultValue="backlog">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="review">Em Revisão</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data</label>
          <Input type="date" {...register("dueDate")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Hora</label>
          <Input type="time" {...register("dueTime")} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Descrição</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAIAssist}
            disabled={!currentTitle.trim() || isAILoading}
            className="gap-2"
          >
            {isAILoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                Gerar com IA
              </>
            )}
          </Button>
        </div>
        <Textarea 
          rows={6} 
          {...register("description")} 
          placeholder="Descreva a tarefa... ou clique em 'Gerar com IA' para obter sugestões"
        />
      </div>

      {/* Sugestão da IA */}
      {aiSuggestion && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Sugestão da IA
              </label>
            </div>
            
            <div className="bg-card rounded-lg p-3 text-sm whitespace-pre-wrap max-h-[300px] overflow-auto border">
              {aiSuggestion}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleInsertAI}
                className="flex-1 gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Usar Esta Descrição
              </Button>
              <Button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(aiSuggestion);
                  toast({
                    title: "📋 Copiado!",
                    description: "Descrição copiada",
                  });
                }}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((t) => {
            const selected = tags.includes(t);
            return (
              <Button
                key={t}
                type="button"
                variant={selected ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const next = selected ? tags.filter((x) => x !== t) : [...tags, t];
                  setValue("tags", next);
                }}
              >
                {t}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
