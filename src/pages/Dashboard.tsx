import { DashboardView } from "@/components/dashboard/DashboardView";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view === 'dashboard' ? '' : view}`);
  };

  return <DashboardView onNavigate={handleNavigate} />;
};

export default Dashboard;
