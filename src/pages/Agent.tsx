import { AgentView } from "@/components/agent/AgentView";
import { AppLayout } from "@/components/layout/AppLayout";
import { Construction } from "lucide-react";

const Agent = () => {
  return (
    <AppLayout currentView="agent">
      <AgentView />
    </AppLayout>
  );
};

export default Agent;
