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
import { Analytics } from "./pages/business/Analytics";
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
          
          {/* Business Solution */}
          <Route path="/business/analytics" element={<AppLayout currentView="analytics"><Analytics /></AppLayout>} />
          
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
