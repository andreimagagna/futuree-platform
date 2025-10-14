import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Tasks from "./pages/Tasks";
import Funnel from "./pages/Funnel";
import Reports from "./pages/Reports";
import Agent from "./pages/Agent";
import Guide from "./pages/Guide";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Campanhas } from "./pages/marketing/Campanhas";
import MarketingTasks from "./pages/marketing/MarketingTasks";
import ConstrutorFunil from "./pages/marketing/ConstrutorFunil";
import EditorLandingPage from "./pages/marketing/EditorLandingPage";
import { CreatorSolutions } from "./pages/marketing/CreatorSolutions";
import { BaseLeads } from "./pages/marketing/BaseLeads";
import { Branding } from "./pages/marketing/Branding";
import { MarketingGuide } from "./pages/marketing/MarketingGuide";
import CustomerSuccess from './pages/business/CustomerSuccess';
import Financas from './pages/business/Financas';
import Estrategico from './pages/business/Estrategico';
import Operacional from './pages/business/Operacional';
import Arquivos from './pages/business/Arquivos';
import NotionSolutions from './pages/business/NotionSolutions';
import GuiaBusiness from './pages/business/GuiaBusiness';
import Automations from "./pages/Automations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Sales Solution */}
          <Route path="/" element={<AppLayout currentView="dashboard"><Dashboard /></AppLayout>} />
          <Route path="/crm" element={<AppLayout currentView="crm"><CRM /></AppLayout>} />
          <Route path="/crm/:id" element={<AppLayout currentView="crm"><CRM /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout currentView="tasks"><Tasks /></AppLayout>} />
          <Route path="/funnel" element={<AppLayout currentView="funnel"><Funnel /></AppLayout>} />
          <Route path="/reports" element={<AppLayout currentView="reports"><Reports /></AppLayout>} />
          <Route path="/automations" element={<AppLayout currentView="automations"><Automations /></AppLayout>} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/guide" element={<Guide />} />
          
          {/* Marketing Solution */}
          <Route path="/marketing/campanhas" element={<AppLayout currentView="campanhas"><Campanhas /></AppLayout>} />
          <Route path="/marketing/tasks" element={<AppLayout currentView="marketing-tasks"><MarketingTasks /></AppLayout>} />
          <Route path="/marketing/construtor-funil" element={<ConstrutorFunil />} />
          <Route path="/marketing/landing-pages" element={<EditorLandingPage />} />
          <Route path="/marketing/creator-solutions" element={<AppLayout currentView="creator-solutions"><CreatorSolutions /></AppLayout>} />
          <Route path="/marketing/base-leads" element={<AppLayout currentView="base-leads"><BaseLeads /></AppLayout>} />
          <Route path="/marketing/branding" element={<AppLayout currentView="branding"><Branding /></AppLayout>} />
          <Route path="/marketing/guide" element={<AppLayout currentView="marketing-guide"><MarketingGuide /></AppLayout>} />
          
          {/* Business Solution */}
          <Route path="/business/cs" element={<AppLayout currentView="cs"><CustomerSuccess /></AppLayout>} />
          <Route path="/business/financas" element={<AppLayout currentView="financas"><Financas /></AppLayout>} />
          <Route path="/business/estrategico" element={<AppLayout currentView="estrategico"><Estrategico /></AppLayout>} />
          <Route path="/business/operacional" element={<AppLayout currentView="operacional"><Operacional /></AppLayout>} />
          <Route path="/business/arquivos" element={<AppLayout currentView="arquivos"><Arquivos /></AppLayout>} />
          <Route path="/business/notion" element={<AppLayout currentView="notion"><NotionSolutions /></AppLayout>} />
          <Route path="/business/guia" element={<AppLayout currentView="business-guide"><GuiaBusiness /></AppLayout>} />
          
          {/* Profile & Settings */}
          <Route path="/profile" element={<AppLayout currentView="profile"><Profile /></AppLayout>} />
          <Route path="/settings" element={<AppLayout currentView="settings"><Settings /></AppLayout>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
