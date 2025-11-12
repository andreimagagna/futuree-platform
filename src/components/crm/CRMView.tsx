import { useState } from "react";
import { KanbanBoard } from "./KanbanBoard";
import { ForecastKanban } from "./ForecastKanban";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, TrendingUp, Bot, X, Sparkles } from "lucide-react";
import { AIChat } from "@/components/AIChat";
import { MotivationalQuote } from "./MotivationalQuote";
import { cn } from "@/lib/utils";

export const CRMView = () => {
  const [view, setView] = useState<"pipeline" | "forecast">("pipeline");
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">Gerencie seu pipeline de vendas e previsões</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowMotivation(!showMotivation)}
            variant={showMotivation ? "secondary" : "outline"}
            className="gap-2"
          >
            {showMotivation ? (
              <>
                <X className="h-4 w-4" /> Fechar
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Frequência
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowAIChat(!showAIChat)}
            variant={showAIChat ? "secondary" : "outline"}
            className="gap-2"
          >
            {showAIChat ? (
              <>
                <X className="h-4 w-4" /> Fechar IA
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" /> Assistente IA
              </>
            )}
          </Button>
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
      </div>

      {/* Motivational Quote Sidebar */}
      {showMotivation && (
        <div className="fixed right-6 top-20 z-50 shadow-2xl animate-in slide-in-from-right duration-300">
          <MotivationalQuote onClose={() => setShowMotivation(false)} />
        </div>
      )}

      {/* AI Chat Sidebar */}
      {showAIChat && (
        <div className={cn(
          "fixed top-20 z-50 shadow-2xl animate-in slide-in-from-right duration-300",
          showMotivation ? "right-[460px]" : "right-6"
        )}>
          <AIChat onClose={() => setShowAIChat(false)} initialContext="leads" />
        </div>
      )}

      {view === "pipeline" ? (
        <KanbanBoard />
      ) : (
        <ForecastKanban onLeadClick={() => {}} />
      )}
    </div>
  );
};
