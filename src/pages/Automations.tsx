import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock, Sparkles } from "lucide-react";

export default function Automations() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
          <p className="text-muted-foreground mt-1">
            Automatize seus processos de vendas
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-2xl w-full border-2 border-dashed">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Em Breve</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6 pb-8">
            <p className="text-muted-foreground text-lg">
              Estamos desenvolvendo funcionalidades incríveis de automação para você!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Workflows Inteligentes</h3>
                <p className="text-sm text-muted-foreground">
                  Crie fluxos automatizados personalizados
                </p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Gatilhos Automáticos</h3>
                <p className="text-sm text-muted-foreground">
                  Ações baseadas em eventos do CRM
                </p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Integrações</h3>
                <p className="text-sm text-muted-foreground">
                  Conecte com ferramentas externas
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground pt-4">
               Em breve você poderá automatizar follow-ups, qualificação de leads, 
              notificações e muito mais!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
