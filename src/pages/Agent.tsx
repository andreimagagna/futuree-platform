import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Bot, Sparkles, MessageSquare, BrainCircuit } from "lucide-react";

const Agent = () => {
  return (
    <AppLayout currentView="agent">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agente Virtual</h1>
            <p className="text-muted-foreground mt-1">
              Seu assistente de vendas com inteligência artificial
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-2xl w-full border-2 border-dashed">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Em Breve</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 pb-8">
              <p className="text-muted-foreground text-lg">
                Seu agente de IA está sendo treinado para ajudar você!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Respostas Inteligentes</h3>
                  <p className="text-sm text-muted-foreground">
                    Tire dúvidas e obtenha insights instantâneos
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <BrainCircuit className="h-6 w-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Análise Preditiva</h3>
                  <p className="text-sm text-muted-foreground">
                    Previsões baseadas em dados históricos
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Sugestões Personalizadas</h3>
                  <p className="text-sm text-muted-foreground">
                    Recomendações de ações e estratégias
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground pt-4">
                🤖 O agente virtual irá responder perguntas, analisar seu funil, 
                sugerir próximas ações e muito mais!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Agent;
