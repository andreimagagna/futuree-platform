import { LayoutDashboard, Users2, CheckSquare, Target, BarChart4, Settings, ChevronRight, ChevronLeft, FileSpreadsheet, Radio, Building2, Bot, BookOpen, Megaphone, TrendingUp, FolderOpen, Brain, GitBranch, Zap, Layout, Sparkles, Database, Palette, HeartHandshake, DollarSign, Settings as SettingsIcon, FileText, Layers, ChevronDown, TrendingUpIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface SolutionGroup {
  title: string;
  icon: React.FC<{ className?: string }>;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  path: string;
  comingSoon?: boolean;
}

const solutions: SolutionGroup[] = [
  {
    title: "Sales Solution",
    icon: TrendingUpIcon,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
      },
      {
        id: "crm",
        label: "CRM",
        icon: Users2,
        path: "/crm",
      },
      {
        id: "tasks",
        label: "Tarefas",
        icon: CheckSquare,
        path: "/tasks",
      },
      {
        id: "funnel",
        label: "Funil",
        icon: FileSpreadsheet,
        path: "/funnel",
      },
      {
        id: "reports",
        label: "Relatórios",
        icon: BarChart4,
        path: "/reports",
      },
      {
        id: "automations",
        label: "Automações",
        icon: Zap,
        path: "/automations",
      },
      {
        id: "agent",
        label: "Agente Virtual",
        icon: Bot,
        path: "/agent",
        comingSoon: true,
      },
      {
        id: "guide",
        label: "Guia",
        icon: BookOpen,
        path: "/guide",
      },
    ],
  },
  {
    title: "Marketing Solution",
    icon: Radio,
    items: [
      {
        id: "campanhas",
        label: "Campanhas",
        icon: Megaphone,
        path: "/marketing/campanhas",
      },
      {
        id: "marketing-tasks",
        label: "Tasks",
        icon: CheckSquare,
        path: "/marketing/tasks",
      },
      {
        id: "construtor-funil",
        label: "Construtor de Funis",
        icon: GitBranch,
        path: "/marketing/construtor-funil",
      },
      {
        id: "creator-solutions",
        label: "Creator Solutions",
        icon: Sparkles,
        path: "/marketing/creator-solutions",
      },
      {
        id: "base-leads",
        label: "Base de Leads",
        icon: Database,
        path: "/marketing/base-leads",
      },
      {
        id: "branding",
        label: "Branding",
        icon: Palette,
        path: "/marketing/branding",
      },
      {
        id: "landing-pages",
        label: "Landing Pages",
        icon: Layout,
        path: "/marketing/landing-pages",
        comingSoon: true,
      },
      {
        id: "marketing-guide",
        label: "Guia",
        icon: BookOpen,
        path: "/marketing/guide",
      },
    ],
  },
  {
    title: "Business Solution",
    icon: Building2,
    items: [
      {
        id: "cs",
        label: "Customer Success",
        icon: HeartHandshake,
        path: "/business/cs",
      },
      {
        id: "financas",
        label: "Finanças",
        icon: DollarSign,
        path: "/business/financas",
      },
      {
        id: "estrategico",
        label: "Estratégico",
        icon: Target,
        path: "/business/estrategico",
      },
      {
        id: "operacional",
        label: "Processos",
        icon: SettingsIcon,
        path: "/business/operacional",
      },
      {
        id: "arquivos",
        label: "Arquivos",
        icon: FileText,
        path: "/business/arquivos",
      },
      {
        id: "notion",
        label: "Notion Solutions",
        icon: Layers,
        path: "/business/notion",
      },
      {
        id: "business-guide",
        label: "Guia",
        icon: BookOpen,
        path: "/business/guia",
      },
    ],
  },
];

export const Sidebar = ({ currentView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSolutions, setExpandedSolutions] = useState<string[]>(['Sales Solution', 'Marketing Solution', 'Business Solution']);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const isSolutionActive = (solution: SolutionGroup) => {
    return solution.items.some(item => isActive(item.path));
  };

  const toggleSolution = (title: string) => {
    setExpandedSolutions(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-[var(--topbar-height)] bottom-0 z-20",
        "bg-gradient-to-b from-card via-card to-muted/30 border-r border-border/50",
        "transition-all duration-300 ease-in-out shadow-sm",
        collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
    >
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 py-4">
          {solutions.map((solution) => {
            const isExpanded = expandedSolutions.includes(solution.title);
            
            return (
              <div 
                key={solution.title} 
                className={cn(
                  "mb-4 px-3 relative",
                  isSolutionActive(solution) && "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary before:to-accent before:rounded-r"
                )}
              >
                <button
                  onClick={() => !collapsed && toggleSolution(solution.title)}
                  className={cn(
                    "w-full flex items-center gap-3 mb-2 hover:bg-muted/50 rounded-lg transition-colors p-2",
                    collapsed ? "justify-center" : "px-3"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-200 shadow-sm",
                    isSolutionActive(solution) 
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md ring-1 ring-primary/20" 
                      : "bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 hover:shadow"
                  )}>
                    <solution.icon className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <>
                      <span className={cn(
                        "text-sm font-semibold tracking-tight flex-1 text-left",
                        isSolutionActive(solution) ? "text-primary" : "text-muted-foreground"
                      )}>
                        {solution.title}
                      </span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )} />
                    </>
                  )}
                </button>

                {(!collapsed && isExpanded) && (
                  <div className={cn(
                    "space-y-1",
                    "ml-4"
                  )}>
                    {solution.items.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full py-2 px-3 h-auto rounded-lg",
                      "transition-all duration-200",
                      "hover:bg-muted/80",
                      "text-left",
                      item.comingSoon && "relative overflow-visible",
                      isActive(item.path) && [
                        "bg-primary/10 text-primary shadow-sm",
                        "hover:bg-primary/15",
                        "font-medium",
                        "border-l-2 border-primary",
                      ],
                      !isActive(item.path) && "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => !item.comingSoon && navigate(item.path)}
                    disabled={item.comingSoon}
                  >
                    <div className="flex items-center justify-start gap-3 w-full text-left">
                      <item.icon className={cn(
                        "w-4 h-4 transition-colors flex-shrink-0",
                        isActive(item.path) ? "text-primary" : "text-muted-foreground"
                      )} />
                      {!collapsed && (
                        <span className="text-sm text-left">{item.label}</span>
                      )}
                      {item.comingSoon && !collapsed && (
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/20 text-warning border border-warning/30 backdrop-blur-sm flex-shrink-0">
                          EM BREVE
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
            </div>
          );
          })}
        </ScrollArea>

        <div className="p-2 border-t border-border/50">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start rounded-lg hover:bg-muted/80 transition-colors", 
              collapsed ? "px-2" : "px-3"
            )}
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
            {!collapsed && <span className="ml-3 text-sm text-muted-foreground">Configurações</span>}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-3 h-6 w-6 rounded-full border border-border bg-card shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={onToggleCollapse}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
};