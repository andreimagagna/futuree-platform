import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CreateDialog } from "@/components/dashboard/CreateDialog";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface AppLayoutProps {
  children: ReactNode;
  currentView?: string;
}

export const AppLayout = ({ children, currentView = "dashboard" }: AppLayoutProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Ativa atalhos de teclado para navegação rápida
  useKeyboardShortcuts();

  const handleNavigate = (view: string) => {
    const path = view.startsWith('/') ? view : `/${view}`;
    navigate(path);
    setMobileMenuOpen(false); // Fecha menu ao navegar
  };

  const handleViewChange = (view: string) => {
    const path = view.startsWith('/') ? view : `/${view}`;
    navigate(path);
    setMobileMenuOpen(false); // Fecha menu ao navegar
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar
        onOpenSearch={() => setSearchOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <main className={cn(
        "pt-[var(--topbar-height)] transition-all duration-300",
        sidebarCollapsed ? "pl-0 md:pl-[var(--sidebar-collapsed-width)]" : "pl-0 md:pl-[var(--sidebar-width)]"
      )}>
        <div className="p-3 sm:p-4 lg:p-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
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
