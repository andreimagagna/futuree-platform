import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Bot, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM (Leads)', icon: Users },
  { id: 'tasks', label: 'Tarefas/Projetos', icon: CheckSquare },
  { id: 'funnel', label: 'Funil de Qualificação', icon: TrendingUp },
  { id: 'agent', label: 'Agente SDR', icon: Bot },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-[var(--topbar-height)] h-[calc(100vh-var(--topbar-height))] bg-card border-r transition-all duration-300 z-30",
        collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "justify-center px-0"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full h-9", collapsed && "justify-center px-0")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Recolher</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};
