import { AgentView } from "@/components/agent/AgentView";
import { AppLayout } from "@/components/layout/AppLayout";
import { Construction } from "lucide-react";

const Agent = () => {
  return (
    <AppLayout currentView="agent">
      <div className="relative">
        <AgentView />
        
        {/* Glass Overlay - Em Desenvolvimento */}
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/30 cursor-not-allowed pointer-events-auto">
          <div className="bg-card/95 backdrop-blur-md border-2 border-warning shadow-2xl rounded-lg p-8 max-w-md text-center pointer-events-none">
            <Construction className="h-16 w-16 mx-auto mb-4 text-warning" />
            <h2 className="text-2xl font-bold mb-2">Em Desenvolvimento</h2>
            <p className="text-muted-foreground">
              Esta funcionalidade ainda está sendo desenvolvida e não está disponível para uso no momento.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Agent;
