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
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  company: z.string()
    .trim()
    .min(2, { message: "Empresa deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Empresa deve ter no máximo 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
  phone: z.string()
    .trim()
    .min(8, { message: "Telefone inválido" })
    .max(20, { message: "Telefone deve ter no máximo 20 caracteres" })
    .optional()
    .or(z.literal("")),
  stage: z.enum(["captured", "qualify", "contact", "proposal", "closing"]),
  source: z.string()
    .trim()
    .min(2, { message: "Origem deve ter pelo menos 2 caracteres" })
    .max(50, { message: "Origem deve ter no máximo 50 caracteres" }),
  notes: z.string()
    .trim()
    .max(1000, { message: "Notas devem ter no máximo 1000 caracteres" })
    .optional()
    .or(z.literal("")),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface CreateLeadFormProps {
  onSuccess: () => void;
}

export const CreateLeadForm = ({ onSuccess }: CreateLeadFormProps) => {
  const { addLead } = useStore();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      stage: "captured",
      source: "",
      notes: "",
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    try {
      addLead({
        id: crypto.randomUUID(),
        name: data.name,
        company: data.company,
        email: data.email,
        whatsapp: data.phone || '',
        stage: data.stage,
        source: data.source,
        score: 50,
        owner: 'Você',
        lastContact: new Date(),
        tags: [],
        notes: data.notes || '',
      });

      toast.success("Lead criado com sucesso!");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Erro ao criar lead. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva" {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa *</FormLabel>
                <FormControl>
                  <Input placeholder="Tech Corp" {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="joao@techcorp.com"
                    {...field}
                    maxLength={255}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 98765-4321" {...field} maxLength={20} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etapa *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="captured">Capturado</SelectItem>
                    <SelectItem value="qualify">Qualificar</SelectItem>
                    <SelectItem value="contact">Contato</SelectItem>
                    <SelectItem value="proposal">Proposta</SelectItem>
                    <SelectItem value="closing">Fechamento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origem *</FormLabel>
                <FormControl>
                  <Input placeholder="Website, LinkedIn, etc" {...field} maxLength={50} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações sobre o lead..."
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
          <Button type="submit">Criar Lead</Button>
        </div>
      </form>
    </Form>
  );
};
