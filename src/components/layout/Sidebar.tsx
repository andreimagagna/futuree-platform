import { LayoutDashboard, Users2, CheckSquare, Target, BarChart4, Settings, ChevronRight, ChevronLeft, FileSpreadsheet, Radio, Building2, Bot, BookOpen, Megaphone, TrendingUp, FolderOpen, Brain, GitBranch, Zap } from "lucide-react";

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
}

const solutions: SolutionGroup[] = [
  {
    title: "Sales Solution",
    icon: Target,
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
    ],
  },
  {
    title: "Business Solution",
    icon: Building2,
    items: [
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart4,
        path: "/business/analytics",
      },
    ],
  },
];

export const Sidebar = ({ currentView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const isSolutionActive = (solution: SolutionGroup) => {
    return solution.items.some(item => isActive(item.path));
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
          {solutions.map((solution) => (
            <div 
              key={solution.title} 
              className={cn(
                "mb-8 px-3 relative",
                isSolutionActive(solution) && "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary before:to-accent before:rounded-r"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3 mb-3",
                  collapsed ? "justify-center px-2" : "px-3",
                  "group"
                )}
              >
                {/* Light mode: fundo marrom, ícone branco */}
                {/* Dark mode: fundo bege, ícone marrom */}
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200 shadow-sm",
                  isSolutionActive(solution) 
                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md ring-1 ring-primary/20" 
                    : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 group-hover:shadow"
                )}>
                  <solution.icon className="w-5 h-5" />
                </div>
                {!collapsed && (
                  <div>
                    <span className={cn(
                      "text-sm font-semibold tracking-tight",
                      isSolutionActive(solution) ? "text-primary" : "text-muted-foreground"
                    )}>
                      {solution.title}
                    </span>
                  </div>
                )}
              </div>

              <div className={cn(
                "space-y-1",
                collapsed ? "px-2" : "ml-4"
              )}>
                {solution.items.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start py-2 px-3 h-auto rounded-lg",
                      "transition-all duration-200",
                      "hover:bg-muted/80",
                      isActive(item.path) && [
                        "bg-primary/10 text-primary shadow-sm",
                        "hover:bg-primary/15",
                        "font-medium",
                        "border-l-2 border-primary",
                      ],
                      !isActive(item.path) && "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-4 h-4 transition-colors",
                        isActive(item.path) ? "text-primary" : "text-muted-foreground"
                      )} />
                      {!collapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
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