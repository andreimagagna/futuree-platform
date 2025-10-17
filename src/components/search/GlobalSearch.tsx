import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLeads } from "@/hooks/useLeadsAPI";
import { useTasks } from "@/hooks/useTasksAPI";
import { Users, CheckSquare, TrendingUp } from "lucide-react";
import { useEffect } from "react";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (view: string, id?: string) => void;
}

export const GlobalSearch = ({ open, onOpenChange, onNavigate }: GlobalSearchProps) => {
  const { data: leads = [] } = useLeads();
  const { data: tasks = [] } = useTasks();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar leads, tarefas, projetos..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        <CommandGroup heading="Leads">
          {leads.slice(0, 5).map((lead) => (
            <CommandItem
              key={lead.id}
              onSelect={() => {
                onNavigate('crm', lead.id);
                onOpenChange(false);
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>{lead.name} - {lead.company}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Tarefas">
          {tasks.slice(0, 5).map((task) => (
            <CommandItem
              key={task.id}
              onSelect={() => {
                onNavigate('tasks', task.id);
                onOpenChange(false);
              }}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>{task.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Atalhos">
          <CommandItem onSelect={() => { onNavigate('dashboard'); onOpenChange(false); }}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Ir para Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => { onNavigate('agent'); onOpenChange(false); }}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Abrir Agente SDR</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
