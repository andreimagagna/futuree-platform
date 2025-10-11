import { useState } from "react";
import { KanbanBoard } from "./KanbanBoard";
import { ForecastKanban } from "./ForecastKanban";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, TrendingUp } from "lucide-react";

export const CRMView = () => {
  const [view, setView] = useState<"pipeline" | "forecast">("pipeline");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CRM</h2>
        <Tabs value={view} onValueChange={(v) => setView(v as "pipeline" | "forecast")}>
          <TabsList>
            <TabsTrigger value="pipeline" className="gap-1">
              <LayoutGrid className="h-4 w-4" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="forecast" className="gap-1">
              <TrendingUp className="h-4 w-4" /> Previsão
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "pipeline" ? (
        <KanbanBoard />
      ) : (
        <ForecastKanban onLeadClick={() => {}} />
      )}
    </div>
  );
};
