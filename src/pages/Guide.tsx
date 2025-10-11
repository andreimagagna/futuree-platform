import { GuideView } from "@/components/guide/GuideView";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";

const Guide = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <AppLayout currentView="guide">
      <GuideView onNavigate={handleNavigate} />
    </AppLayout>
  );
};

export default Guide;
