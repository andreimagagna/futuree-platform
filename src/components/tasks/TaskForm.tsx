import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, Task, TaskStatus, Priority } from "@/store/useStore";
import { v4 as uuid } from "uuid";

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
        <label className="text-sm font-medium">Descrição</label>
        <Textarea rows={4} {...register("description")} />
      </div>

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
