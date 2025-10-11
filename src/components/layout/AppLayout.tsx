import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CreateDialog } from "@/components/dashboard/CreateDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  currentView?: string;
}

export const AppLayout = ({ children, currentView = "dashboard" }: AppLayoutProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
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
      
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />

      <main className="pt-[var(--topbar-height)] pl-[var(--sidebar-width)] transition-all duration-300">
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
