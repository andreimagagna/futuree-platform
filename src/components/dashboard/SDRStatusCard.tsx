import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bot } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const SDRStatusCard = () => {
  const [isActive, setIsActive] = useState(true);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    toast.success(checked ? 'Agente SDR ativado' : 'Agente SDR pausado');
  };

  const handleOpenPanel = () => {
    toast.info('Abrindo painel completo do Agente SDR...');
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Agente SDR
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
              {isActive ? 'Ativo' : 'Pausado'}
            </Badge>
            <Switch checked={isActive} onCheckedChange={handleToggle} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-primary-light">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-muted-foreground mt-1">Conversas</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-accent-light">
            <div className="text-2xl font-bold text-accent">2.5h</div>
            <div className="text-xs text-muted-foreground mt-1">Resposta</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-success-light">
            <div className="text-2xl font-bold text-success">47</div>
            <div className="text-xs text-muted-foreground mt-1">Mensagens</div>
          </div>
        </div>

        <Button size="sm" className="w-full" onClick={handleOpenPanel}>
          Abrir Painel Completo
        </Button>
      </CardContent>
    </Card>
  );
};
