import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MarketingTask, MarketingTaskType, MarketingCategory } from "@/types/Marketing";
import { v4 as uuid } from "uuid";

const schema = z.object({
  title: z.string().min(3, "Informe um título"),
  description: z.string().optional(),
  type: z.string(),
  category: z.string(),
  priority: z.enum(["P1", "P2", "P3"]),
  status: z.enum(["backlog", "in_progress", "review", "done"]),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  assignedTo: z.string().min(1, "Responsável obrigatório"),
  estimatedHours: z.number().optional(),
});

const taskTypes: { value: MarketingTaskType; label: string }[] = [
  { value: 'criar_conteudo', label: 'Criar Conteúdo' },
  { value: 'revisar_copy', label: 'Revisar Copy' },
  { value: 'design', label: 'Design' },
  { value: 'agendar_post', label: 'Agendar Post' },
  { value: 'configurar_ads', label: 'Configurar Ads' },
  { value: 'criar_landing', label: 'Criar Landing Page' },
  { value: 'email_marketing', label: 'Email Marketing' },
  { value: 'analise', label: 'Análise' },
  { value: 'pesquisa', label: 'Pesquisa' },
  { value: 'reuniao', label: 'Reunião' },
  { value: 'aprovacao', label: 'Aprovação' },
  { value: 'outro', label: 'Outro' },
];

const categories: { value: MarketingCategory; label: string }[] = [
  { value: 'conteudo', label: 'Conteúdo' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email', label: 'Email Marketing' },
  { value: 'paid_ads', label: 'Paid Ads' },
  { value: 'seo', label: 'SEO' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'branding', label: 'Branding' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'planejamento', label: 'Planejamento' },
];

interface MarketingTaskFormProps {
  onSubmit: (task: MarketingTask) => void;
  onCancel: () => void;
  initialData?: MarketingTask;
}

export function MarketingTaskForm({ onSubmit, onCancel, initialData }: MarketingTaskFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description || "",
      type: initialData.type,
      category: initialData.category,
      priority: initialData.priority,
      status: initialData.status,
      dueDate: initialData.dueDate,
      dueTime: initialData.dueTime,
      assignedTo: initialData.assignedTo,
      estimatedHours: initialData.estimatedHours,
    } : {
      title: "",
      description: "",
      type: "criar_conteudo",
      category: "conteudo",
      priority: "P2",
      status: "backlog",
      assignedTo: "Você",
    },
  });

  const submit = handleSubmit((values) => {
    const task: MarketingTask = {
      id: initialData?.id || uuid(),
      title: values.title,
      description: values.description || "",
      type: values.type as MarketingTaskType,
      category: values.category as MarketingCategory,
      priority: values.priority,
      status: values.status,
      dueDate: values.dueDate,
      dueTime: values.dueTime,
      assignedTo: values.assignedTo,
      estimatedHours: values.estimatedHours,
      tags: initialData?.tags || [],
      checklist: initialData?.checklist || [],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(task);
  });

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input {...register("title")} placeholder="Ex: Criar post LinkedIn sobre novo produto" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Task</label>
          <Select onValueChange={(v) => setValue("type", v)} defaultValue={watch("type") || "criar_conteudo"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {taskTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select onValueChange={(v) => setValue("category", v)} defaultValue={watch("category") || "conteudo"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Responsável</label>
          <Input {...register("assignedTo")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prioridade</label>
          <Select onValueChange={(v) => setValue("priority", v as "P1" | "P2" | "P3")} defaultValue={watch("priority") || "P2"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="P1">P1 - Alta</SelectItem>
              <SelectItem value="P2">P2 - Média</SelectItem>
              <SelectItem value="P3">P3 - Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select onValueChange={(v) => setValue("status", v as any)} defaultValue={watch("status") || "backlog"}>
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
          <label className="text-sm font-medium">Data de Vencimento</label>
          <Input type="date" {...register("dueDate")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hora</label>
          <Input type="time" {...register("dueTime")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estimativa (horas)</label>
          <Input 
            type="number" 
            step="0.5"
            {...register("estimatedHours", { valueAsNumber: true })} 
            placeholder="Ex: 2.5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição</label>
        <Textarea rows={4} {...register("description")} placeholder="Descreva os detalhes da task..." />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{initialData ? 'Atualizar' : 'Criar'} Task</Button>
      </div>
    </form>
  );
}
