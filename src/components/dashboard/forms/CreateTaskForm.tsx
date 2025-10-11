import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string()
    .trim()
    .min(3, { message: "Título deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Título deve ter no máximo 200 caracteres" }),
  description: z.string()
    .trim()
    .max(1000, { message: "Descrição deve ter no máximo 1000 caracteres" })
    .optional()
    .or(z.literal("")),
  priority: z.enum(["P1", "P2", "P3"]),
  status: z.enum(["backlog", "in_progress", "done"]),
  dueDate: z.date().optional(),
  relatedTo: z.string()
    .trim()
    .max(100, { message: "Relacionado deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  onSuccess: () => void;
}

export const CreateTaskForm = ({ onSuccess }: CreateTaskFormProps) => {
  const { addTask } = useStore();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "P2",
      status: "backlog",
      relatedTo: "",
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    try {
      addTask({
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate,
        assignee: 'Você',
        tags: [],
        checklist: [],
      });

      toast.success("Tarefa criada com sucesso!");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Erro ao criar tarefa. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título *</FormLabel>
              <FormControl>
                <Input placeholder="Enviar proposta comercial" {...field} maxLength={200} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes da tarefa..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  maxLength={1000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="P3">Baixa (P3)</SelectItem>
                    <SelectItem value="P2">Média (P2)</SelectItem>
                    <SelectItem value="P1">Alta (P1)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="backlog">A Fazer</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relatedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relacionado a</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Lead/Cliente" {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">Criar Tarefa</Button>
        </div>
      </form>
    </Form>
  );
};
