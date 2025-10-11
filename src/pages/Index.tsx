import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CreateDialog } from "@/components/dashboard/CreateDialog";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { CRMView } from "@/components/crm/CRMView";
import { TasksView } from "@/components/tasks/TasksView";
import { QualificationFunnel } from "@/components/QualificationFunnel";
import { AgentView } from "@/components/agent/AgentView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Settings as SettingsIcon } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleNavigate = (view: string, id?: string) => {
    setCurrentView(view);
    // TODO: Handle navigation to specific item with id
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'crm':
        return <CRMView />;
      case 'tasks':
        return <TasksView />;
      case 'funnel':
        return <QualificationFunnel />;
      case 'agent':
        return <AgentView />;
      case 'reports':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Relatórios</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estatísticas do Agente SDR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold text-primary">147</div>
                    <p className="text-sm text-muted-foreground">Conversas iniciadas</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold text-success">89%</div>
                    <p className="text-sm text-muted-foreground">Taxa de resposta</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold text-accent">34</div>
                    <p className="text-sm text-muted-foreground">Leads qualificados</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold text-warning">2.5h</div>
                    <p className="text-sm text-muted-foreground">Tempo médio de resposta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Configurações</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Preferências do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configurações em desenvolvimento...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCreate={() => setCreateOpen(true)}
      />
      
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="pt-[var(--topbar-height)] pl-[var(--sidebar-width)] transition-all duration-300">
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          {renderView()}
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

export default Index;
