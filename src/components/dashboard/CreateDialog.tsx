import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLeadForm } from "./forms/CreateLeadForm";
import { CreateTaskForm } from "./forms/CreateTaskForm";
import { CreateMeetingForm } from "./forms/CreateMeetingForm";
import { CreateDealForm } from "./forms/CreateDealForm";
import { CreateNoteForm } from "./forms/CreateNoteForm";
import { Users2, CheckSquare, Calendar, Target, StickyNote } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

interface TabOption {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  component: React.FC<{ onSuccess: () => void }>;
}

const tabOptions: TabOption[] = [
  {
    id: "lead",
    label: "Lead",
    icon: Users2,
    description: "Novo contato ou oportunidade de negócio",
    component: CreateLeadForm,
  },
  {
    id: "task",
    label: "Tarefa",
    icon: CheckSquare,
    description: "Nova atividade ou pendência",
    component: CreateTaskForm,
  },
  {
    id: "meeting",
    label: "Reunião",
    icon: Calendar,
    description: "Novo compromisso ou encontro",
    component: CreateMeetingForm,
  },
  {
    id: "deal",
    label: "Deal",
    icon: Target,
    description: "Nova oportunidade comercial",
    component: CreateDealForm,
  },
  {
    id: "note",
    label: "Nota",
    icon: StickyNote,
    description: "Nova anotação ou observação",
    component: CreateNoteForm,
  },
];

export const CreateDialog = ({ open, onOpenChange, defaultTab = "lead" }: CreateDialogProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const activeOption = tabOptions.find(tab => tab.id === activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            {activeOption && (
              <activeOption.icon className="w-6 h-6 text-primary" />
            )}
            <div>
              <DialogTitle className="text-2xl">
                Novo {activeOption?.label}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {activeOption?.description}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-5 p-1 h-auto mb-6">
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex flex-col items-center gap-2 py-3 px-3",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "transition-all duration-200 hover:bg-muted"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabOptions.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <tab.component onSuccess={() => onOpenChange(false)} />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
