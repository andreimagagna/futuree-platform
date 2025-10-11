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
import { toast } from "sonner";

const meetingSchema = z.object({
  title: z.string()
    .trim()
    .min(3, { message: "Título deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Título deve ter no máximo 200 caracteres" }),
  participant: z.string()
    .trim()
    .min(2, { message: "Participante deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Participante deve ter no máximo 100 caracteres" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  time: z.string()
    .trim()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)" }),
  type: z.enum(["meeting", "call", "video"]),
  notes: z.string()
    .trim()
    .max(1000, { message: "Notas devem ter no máximo 1000 caracteres" })
    .optional()
    .or(z.literal("")),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface CreateMeetingFormProps {
  onSuccess: () => void;
}

export const CreateMeetingForm = ({ onSuccess }: CreateMeetingFormProps) => {
  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: "",
      participant: "",
      time: "",
      type: "video",
      notes: "",
    },
  });

  const onSubmit = (data: MeetingFormValues) => {
    try {
      // Mock - em produção, isso salvaria no backend
      toast.success("Reunião agendada com sucesso!");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Erro ao agendar reunião. Tente novamente.");
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
                <Input placeholder="Reunião de alinhamento" {...field} maxLength={200} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participante *</FormLabel>
              <FormControl>
                <Input placeholder="João Silva - Tech Corp" {...field} maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data *</FormLabel>
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
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="meeting">Reunião Presencial</SelectItem>
                  <SelectItem value="call">Ligação</SelectItem>
                  <SelectItem value="video">Videoconferência</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações sobre a reunião..."
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

        <div className="flex justify-end gap-2">
          <Button type="submit">Agendar Reunião</Button>
        </div>
      </form>
    </Form>
  );
};
