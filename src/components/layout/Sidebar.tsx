import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Bot, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

// Menu items organized by priority and workflow
const mainMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'funnel', label: 'Funil BANT', icon: TrendingUp, badge: null },
  { id: 'crm', label: 'Leads', icon: Users, badge: null },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare, badge: null },
];

const secondaryMenuItems = [
  { id: 'agent', label: 'Agente SDR', icon: Bot, badge: 'AI' },
  { id: 'reports', label: 'Relatórios', icon: BarChart3, badge: null },
];

const bottomMenuItems = [
  { id: 'guide', label: 'Guia', icon: BookOpen, badge: null },
  { id: 'settings', label: 'Configurações', icon: Settings, badge: null },
];

const MenuSection = ({ 
  items, 
  currentView, 
  onViewChange, 
  collapsed 
}: { 
  items: typeof mainMenuItems; 
  currentView: string; 
  onViewChange: (view: string) => void;
  collapsed: boolean;
}) => (
  <>
    {items.map((item) => {
      const Icon = item.icon;
      const isActive = currentView === item.id;
      
      return (
        <Button
          key={item.id}
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 h-10 transition-all duration-200 relative",
            collapsed && "justify-center px-2",
            isActive && "shadow-sm font-semibold",
            !isActive && "hover:bg-muted/50 hover:translate-x-1"
          )}
          onClick={() => onViewChange(item.id)}
        >
          <Icon className={cn(
            "h-4 w-4 flex-shrink-0",
            isActive && "scale-110"
          )} />
          {!collapsed && (
            <>
              <span className="text-sm font-medium transition-opacity duration-200 flex-1 text-left">
                {item.label}
              </span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="h-5 px-1.5 text-[10px] font-bold"
                >
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </Button>
      );
    })}
  </>
);

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-[var(--topbar-height)] h-[calc(100vh-var(--topbar-height))] bg-card border-r transition-all duration-300 z-30 shadow-md",
        collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Primary Section */}
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Principal
              </p>
            </div>
          )}
          <div className="space-y-1">
            <MenuSection 
              items={mainMenuItems} 
              currentView={currentView} 
              onViewChange={onViewChange}
              collapsed={collapsed}
            />
          </div>

          {/* Separator */}
          <Separator className="my-3" />

          {/* Secondary Section */}
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ferramentas
              </p>
            </div>
          )}
          <div className="space-y-1">
            <MenuSection 
              items={secondaryMenuItems} 
              currentView={currentView} 
              onViewChange={onViewChange}
              collapsed={collapsed}
            />
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t bg-muted/20 space-y-1">
          <MenuSection 
            items={bottomMenuItems} 
            currentView={currentView} 
            onViewChange={onViewChange}
            collapsed={collapsed}
          />
          
          <Separator className="my-2" />
          
          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full h-9 transition-all duration-200 hover:bg-muted/50",
              collapsed && "justify-center px-0"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs font-medium">Recolher</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};
