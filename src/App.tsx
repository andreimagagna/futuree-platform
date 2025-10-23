import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
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
import { BaseLeadsSimple } from "./pages/marketing/BaseLeadsSimple";
import { MarketingGuide } from "./pages/marketing/MarketingGuide";
import CustomerSuccess from './pages/business/CustomerSuccess';
import Financas from './pages/business/Financas';
import Estrategico from './pages/business/Estrategico';
import Operacional from './pages/business/Operacional';
import Arquivos from './pages/business/Arquivos';
import NotionSolutions from './pages/business/NotionSolutions';
import GuiaBusiness from './pages/business/GuiaBusiness';
import Automations from "./pages/Automations";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* ============================================ */}
          {/* ROTA PÚBLICA - Login/Cadastro como INICIAL */}
          {/* ============================================ */}
          <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />
          
          {/* ============================================ */}
          {/* ROTAS PROTEGIDAS - Sales Solution */}
          {/* ============================================ */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout currentView="dashboard"><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><AppLayout currentView="crm"><CRM /></AppLayout></ProtectedRoute>} />
          <Route path="/crm/:id" element={<ProtectedRoute><AppLayout currentView="crm"><CRM /></AppLayout></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><AppLayout currentView="tasks"><Tasks /></AppLayout></ProtectedRoute>} />
          <Route path="/funnel" element={<ProtectedRoute><AppLayout currentView="funnel"><Funnel /></AppLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppLayout currentView="reports"><Reports /></AppLayout></ProtectedRoute>} />
          <Route path="/automations" element={<ProtectedRoute><AppLayout currentView="automations"><Automations /></AppLayout></ProtectedRoute>} />
          <Route path="/agent" element={<ProtectedRoute><Agent /></ProtectedRoute>} />
          <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
          
          {/* ============================================ */}
          {/* ROTAS PROTEGIDAS - Marketing Solution */}
          {/* ============================================ */}
          <Route path="/marketing/campanhas" element={<ProtectedRoute><AppLayout currentView="campanhas"><Campanhas /></AppLayout></ProtectedRoute>} />
          <Route path="/marketing/tasks" element={<ProtectedRoute><AppLayout currentView="marketing-tasks"><MarketingTasks /></AppLayout></ProtectedRoute>} />
          <Route path="/marketing/construtor-funil" element={<ProtectedRoute><ConstrutorFunil /></ProtectedRoute>} />
          <Route path="/marketing/landing-pages" element={<ProtectedRoute><EditorLandingPage /></ProtectedRoute>} />
          <Route path="/marketing/creator-solutions" element={<ProtectedRoute><AppLayout currentView="creator-solutions"><CreatorSolutions /></AppLayout></ProtectedRoute>} />
          <Route path="/marketing/base-leads" element={<ProtectedRoute><AppLayout currentView="base-leads"><BaseLeadsSimple /></AppLayout></ProtectedRoute>} />
          <Route path="/marketing/guide" element={<ProtectedRoute><AppLayout currentView="marketing-guide"><MarketingGuide /></AppLayout></ProtectedRoute>} />
          
          {/* ============================================ */}
          {/* ROTAS PROTEGIDAS - Business Solution */}
          {/* ============================================ */}
          <Route path="/business/cs" element={<ProtectedRoute><AppLayout currentView="cs"><CustomerSuccess /></AppLayout></ProtectedRoute>} />
          <Route path="/business/financas" element={<ProtectedRoute><AppLayout currentView="financas"><Financas /></AppLayout></ProtectedRoute>} />
          <Route path="/business/estrategico" element={<ProtectedRoute><AppLayout currentView="estrategico"><Estrategico /></AppLayout></ProtectedRoute>} />
          <Route path="/business/operacional" element={<ProtectedRoute><AppLayout currentView="operacional"><Operacional /></AppLayout></ProtectedRoute>} />
          <Route path="/business/arquivos" element={<ProtectedRoute><AppLayout currentView="arquivos"><Arquivos /></AppLayout></ProtectedRoute>} />
          <Route path="/business/notion" element={<ProtectedRoute><AppLayout currentView="notion"><NotionSolutions /></AppLayout></ProtectedRoute>} />
          <Route path="/business/guia" element={<ProtectedRoute><AppLayout currentView="business-guide"><GuiaBusiness /></AppLayout></ProtectedRoute>} />
          
          {/* ============================================ */}
          {/* ROTAS PROTEGIDAS - Profile & Settings */}
          {/* ============================================ */}
          <Route path="/profile" element={<ProtectedRoute><AppLayout currentView="profile"><Profile /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout currentView="settings"><Settings /></AppLayout></ProtectedRoute>} />
          
          {/* ============================================ */}
          {/* 404 - Página não encontrada */}
          {/* ============================================ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
