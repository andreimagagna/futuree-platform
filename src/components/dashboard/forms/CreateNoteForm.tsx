import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  content: z.string().min(2, {
    message: "A nota precisa ter pelo menos 2 caracteres.",
  }),
});

interface CreateNoteFormProps {
  onSuccess: () => void;
  leadId?: string;
  dealId?: string;
}

export const CreateNoteForm = ({ onSuccess, leadId, dealId }: CreateNoteFormProps) => {
  const addNote = useStore((state) => state.addNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addNote({
      id: uuidv4(),
      content: values.content,
      leadId,
      dealId,
      createdAt: new Date(),
      createdBy: "Você",
    });
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo da Nota</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite sua nota aqui..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Salvar Nota</Button>
      </form>
    </Form>
  );
};
