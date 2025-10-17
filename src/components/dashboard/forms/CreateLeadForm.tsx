import { apiRequest } from '@/utils/apiClient';
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead } from "@/store/useStore";
import { useCreateLead } from "@/hooks/useLeadsAPI";
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
  dealValue: z.coerce
    .number({ invalid_type_error: "Valor inválido" })
    .min(0, { message: "Valor deve ser positivo" })
    .optional()
    .or(z.literal("")),
  expectedCloseDate: z.date().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface CreateLeadFormProps {
  onSuccess: () => void;
}

export const CreateLeadForm = ({ onSuccess }: CreateLeadFormProps) => {
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
      dealValue: undefined,
      expectedCloseDate: undefined,
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    try {
      // Garantir que nome seja sempre preenchido
      const nome = data.name?.trim() || '';
      if (!nome) {
        toast.error('O campo nome é obrigatório.');
        console.error('[CreateLeadForm] ❌ Falha: campo nome vazio. Dados do formulário:', data);
        return;
      }

      // Map payload to actual database columns (avoid unknown columns)
      const leadPayload: any = {
        nome, // required by DB
        etapa: data.stage, // etapa (stage)
        origem: data.source, // source
        email: data.email || null,
        whatsapp: data.phone || null,
        // company_id not available from form (requires separate mapping); omit for now
        score: 50,
        // If you want to store expected close date, map to proxima_acao_at (date string)
        proxima_acao_at: data.expectedCloseDate ? data.expectedCloseDate.toISOString() : null,
        tags: [],
      };

      // Call backend via hook
      const { mutateAsync } = useCreateLead();
      const created = await mutateAsync(leadPayload);

      if (created && created.id) {
        toast.success('Lead criado com sucesso!');
        form.reset();
        onSuccess();
      } else {
        console.error('[CreateLeadForm] ❌ Falha ao criar lead, resposta:', created);
        toast.error('Erro ao criar lead. Verifique o console.');
      }
    } catch (error) {
      console.error('[CreateLeadForm] ❌ Erro inesperado ao criar lead:', error);
      toast.error("Erro inesperado ao criar lead. Verifique o console para detalhes.");
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dealValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Negócio (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="45000"
                    {...field}
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedCloseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Prevista de Fechamento</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP", { locale: ptBR })
                          : "Selecione a data"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
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
                  placeholder="Observações adicionais sobre o lead"
                  {...field}
                  maxLength={1000}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Criar Lead
        </Button>
      </form>
    </Form>
  );
};

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}
