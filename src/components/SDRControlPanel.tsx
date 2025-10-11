import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, Activity, Settings, Pause, Play } from "lucide-react";
import { useState } from "react";

export const SDRControlPanel = () => {
  const [isActive, setIsActive] = useState(true);
  const [autoRespond, setAutoRespond] = useState(true);
  const [qualifyLeads, setQualifyLeads] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Agente SDR Virtual</CardTitle>
                <CardDescription>Controle o seu assistente de vendas</CardDescription>
              </div>
            </div>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "bg-success" : "bg-muted"}
            >
              {isActive ? (
                <>
                  <Activity className="h-3 w-3 mr-1" />
                  Ativo
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pausado
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {isActive ? (
                <Play className="h-5 w-5 text-success" />
              ) : (
                <Pause className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Status do Agente</p>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Respondendo conversas ativamente" : "Agente pausado"}
                </p>
              </div>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Resposta Automática</p>
                  <p className="text-sm text-muted-foreground">
                    Responder leads automaticamente no WhatsApp
                  </p>
                </div>
              </div>
              <Switch checked={autoRespond} onCheckedChange={setAutoRespond} />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">Qualificação Inteligente</p>
                  <p className="text-sm text-muted-foreground">
                    Qualificar leads com IA durante conversas
                  </p>
                </div>
              </div>
              <Switch checked={qualifyLeads} onCheckedChange={setQualifyLeads} />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full gap-2">
              <Settings className="h-4 w-4" />
              Configurações Avançadas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas do Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-card rounded-lg border">
              <p className="text-2xl font-bold text-primary">147</p>
              <p className="text-sm text-muted-foreground">Conversas hoje</p>
            </div>
            <div className="p-4 bg-gradient-card rounded-lg border">
              <p className="text-2xl font-bold text-success">89%</p>
              <p className="text-sm text-muted-foreground">Taxa de resposta</p>
            </div>
            <div className="p-4 bg-gradient-card rounded-lg border">
              <p className="text-2xl font-bold text-accent">34</p>
              <p className="text-sm text-muted-foreground">Leads qualificados</p>
            </div>
            <div className="p-4 bg-gradient-card rounded-lg border">
              <p className="text-2xl font-bold text-warning">12</p>
              <p className="text-sm text-muted-foreground">Aguardando ação</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
