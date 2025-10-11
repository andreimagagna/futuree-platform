import { AgentView } from "@/components/agent/AgentView";
import { AppLayout } from "@/components/layout/AppLayout";

const Agent = () => {
  return (
    <AppLayout currentView="agent">
      <AgentView />
    </AppLayout>
  );
};

export default Agent;
