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
import { Users, CheckSquare, Target, Briefcase, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (view: string, id?: string) => void;
}

export const GlobalSearch = ({ open, onOpenChange, onNavigate }: GlobalSearchProps) => {
  const { data: leads = [] } = useLeads();
  const { data: tasks = [] } = useTasks();
  const [search, setSearch] = useState("");

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

  // Filtrar leads baseado na busca
  const filteredLeads = leads.filter((lead: any) => 
    lead.nome?.toLowerCase().includes(search.toLowerCase()) ||
    lead.name?.toLowerCase().includes(search.toLowerCase()) ||
    lead.email?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  // Filtrar tasks baseado na busca
  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  // Páginas do sistema para navegação rápida (somente páginas existentes)
  const pages = [
    // Sales Solution
  { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, path: 'dashboard' },
    { id: 'crm', name: 'CRM', icon: Users, path: 'crm' },
    { id: 'tasks', name: 'Tarefas', icon: CheckSquare, path: 'tasks' },
    { id: 'funnel', name: 'Funil', icon: Target, path: 'funnel' },
    { id: 'reports', name: 'Relatórios', icon: Target, path: 'reports' },
    { id: 'guide', name: 'Guia de Sales', icon: Briefcase, path: 'guide' },
    
    // Marketing Solution
    { id: 'campanhas', name: 'Campanhas', icon: TrendingUp, path: 'marketing/campanhas' },
    { id: 'marketing-tasks', name: 'Marketing Tasks', icon: CheckSquare, path: 'marketing/tasks' },
    { id: 'creator-solutions', name: 'Creator Solutions', icon: TrendingUp, path: 'marketing/creator-solutions' },
    { id: 'base-leads', name: 'Base de Leads', icon: Users, path: 'marketing/base-leads' },
    { id: 'marketing-guide', name: 'Guia de Marketing', icon: Briefcase, path: 'marketing/guide' },
    
    // Business Solution
    { id: 'cs', name: 'Customer Success', icon: Users, path: 'business/cs' },
    { id: 'financas', name: 'Finanças', icon: TrendingUp, path: 'business/financas' },
    { id: 'estrategico', name: 'Estratégico', icon: Target, path: 'business/estrategico' },
    { id: 'arquivos', name: 'Arquivos', icon: Briefcase, path: 'business/arquivos' },
    { id: 'notion', name: 'Notion Solutions', icon: Briefcase, path: 'business/notion' },
    { id: 'business-guide', name: 'Guia de Business', icon: Briefcase, path: 'business/guia' },
  ].filter(page => 
    page.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Buscar leads, tarefas, páginas..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        {filteredLeads.length > 0 && (
          <CommandGroup heading="Leads">
            {filteredLeads.map((lead: any) => (
              <CommandItem
                key={lead.id}
                onSelect={() => {
                  onNavigate('crm', lead.id);
                  onOpenChange(false);
                  setSearch("");
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{lead.nome || lead.name || 'Sem nome'}</span>
                  {lead.email && (
                    <span className="text-xs text-muted-foreground">{lead.email}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredTasks.length > 0 && (
          <CommandGroup heading="Tarefas">
            {filteredTasks.map((task) => (
              <CommandItem
                key={task.id}
                onSelect={() => {
                  onNavigate('tasks', task.id);
                  onOpenChange(false);
                  setSearch("");
                }}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{task.title}</span>
                  {task.due_date && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {pages.length > 0 && (
          <CommandGroup heading="Páginas">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <CommandItem 
                  key={page.id}
                  onSelect={() => { 
                    onNavigate(page.path); 
                    onOpenChange(false); 
                    setSearch("");
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{page.name}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
