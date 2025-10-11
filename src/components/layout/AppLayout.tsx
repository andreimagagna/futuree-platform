import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CreateDialog } from "@/components/dashboard/CreateDialog";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardViewV2 as DashboardView } from '@/components/dashboard/DashboardViewV2';

interface AppLayoutProps {
  children: ReactNode;
  currentView?: string;
}

export const AppLayout = ({ children, currentView = "dashboard" }: AppLayoutProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view === 'dashboard' ? '' : view}`);
  };

  const handleViewChange = (view: string) => {
    navigate(`/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCreate={() => setCreateOpen(true)}
      />
      
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={cn(
        "pt-[var(--topbar-height)] transition-all duration-300",
        sidebarCollapsed ? "pl-[var(--sidebar-collapsed-width)]" : "pl-[var(--sidebar-width)]"
      )}>
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto animate-fade-in">
          {children}
        </div>
      </main>

      <GlobalSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigate={handleNavigate}
      />

      <CreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
};
