import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLeadForm } from "./forms/CreateLeadForm";
import { CreateTaskForm } from "./forms/CreateTaskForm";
import { CreateMeetingForm } from "./forms/CreateMeetingForm";
import { CreateDealForm } from "./forms/CreateDealForm";

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

export const CreateDialog = ({ open, onOpenChange, defaultTab = "lead" }: CreateDialogProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo</DialogTitle>
          <DialogDescription>
            Adicione novos leads, tarefas, reuniões ou deals ao sistema
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lead">Lead</TabsTrigger>
            <TabsTrigger value="task">Tarefa</TabsTrigger>
            <TabsTrigger value="meeting">Reunião</TabsTrigger>
            <TabsTrigger value="deal">Deal</TabsTrigger>
          </TabsList>

          <TabsContent value="lead" className="mt-4">
            <CreateLeadForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>

          <TabsContent value="task" className="mt-4">
            <CreateTaskForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>

          <TabsContent value="meeting" className="mt-4">
            <CreateMeetingForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>

          <TabsContent value="deal" className="mt-4">
            <CreateDealForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
