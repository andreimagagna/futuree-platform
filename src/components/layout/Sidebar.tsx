import { LayoutDashboard, Users2, CheckSquare, Target, BarChart4, Settings, ChevronRight, ChevronLeft, FileSpreadsheet, Radio, Building2 } from "lucide-react";
import "@/styles/sidebar.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
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
    ],
  },
  {
    title: "Marketing Solution",
    icon: Radio,
    items: [
      {
        id: "campaigns",
        label: "Campanhas",
        icon: Target,
        path: "/marketing/campaigns",
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
        "sidebar-container",
        "bg-card",
        "border-r border-r-slate-200 dark:border-r-slate-800",
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
                isSolutionActive(solution) && "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-primary"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3 mb-3",
                  collapsed ? "justify-center px-2" : "px-3",
                  "group"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isSolutionActive(solution) 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                )}>
                  <solution.icon className="w-5 h-5" />
                </div>
                {!collapsed && (
                  <div>
                    <span className={cn(
                      "text-sm font-semibold tracking-wide",
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
                      "w-full justify-start py-2 px-3 h-auto",
                      "transition-all duration-200",
                      "hover:bg-muted/80",
                      isActive(item.path) && [
                        "bg-primary/10 text-primary",
                        "hover:bg-primary/20",
                        "font-medium",
                      ],
                      !isActive(item.path) && "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => onViewChange(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-4 h-4",
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

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
            onClick={() => onViewChange("settings")}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span className="ml-3 text-sm">Configurações</span>}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-3 h-6 w-6 rounded-full border bg-background shadow-sm"
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