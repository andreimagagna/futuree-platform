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
import { toast } from "sonner";

const dealSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  company: z.string()
    .trim()
    .min(2, { message: "Empresa deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Empresa deve ter no máximo 100 caracteres" }),
  value: z.string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, { message: "Valor inválido (ex: 1000.00 ou 1000,00)" }),
  stage: z.enum(["captured", "qualify", "contact", "proposal", "closing"]),
  probability: z.string()
    .trim()
    .regex(/^(100|[1-9]?[0-9])$/, { message: "Probabilidade deve ser entre 0 e 100" }),
  expectedCloseDate: z.string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida (formato: YYYY-MM-DD)" })
    .optional()
    .or(z.literal("")),
  notes: z.string()
    .trim()
    .max(1000, { message: "Notas devem ter no máximo 1000 caracteres" })
    .optional()
    .or(z.literal("")),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface CreateDealFormProps {
  onSuccess: () => void;
}

export const CreateDealForm = ({ onSuccess }: CreateDealFormProps) => {
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: "",
      company: "",
      value: "",
      stage: "proposal",
      probability: "50",
      expectedCloseDate: "",
      notes: "",
    },
  });

  const onSubmit = (data: DealFormValues) => {
    try {
      // Mock - em produção, isso salvaria no backend
      toast.success("Deal criado com sucesso!");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Erro ao criar deal. Tente novamente.");
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
                <FormLabel>Nome do Deal *</FormLabel>
                <FormControl>
                  <Input placeholder="Contrato Anual SaaS" {...field} maxLength={100} />
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
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$) *</FormLabel>
                <FormControl>
                  <Input placeholder="25000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="probability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilidade (%) *</FormLabel>
                <FormControl>
                  <Input placeholder="75" {...field} maxLength={3} />
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
            name="expectedCloseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Prevista de Fechamento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  placeholder="Observações sobre o deal..."
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
          <Button type="submit">Criar Deal</Button>
        </div>
      </form>
    </Form>
  );
};
