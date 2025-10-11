import { DashboardView } from "@/components/dashboard/DashboardView";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <AppLayout currentView="dashboard">
      <DashboardView onNavigate={handleNavigate} />
    </AppLayout>
  );
};

export default Dashboard;
