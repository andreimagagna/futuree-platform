import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { Settings as SettingsIcon, Plus, X, Users, Tag, Target } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { settings, addLeadSource, removeLeadSource, addOwner, removeOwner, updateGoals } = useStore();
  const { toast } = useToast();
  
  const [newSource, setNewSource] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleAddSource = () => {
    if (!newSource.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a fonte de lead",
        variant: "destructive",
      });
      return;
    }
    
    addLeadSource(newSource.trim());
    setNewSource("");
    toast({
      title: "Sucesso",
      description: "Fonte de lead adicionada",
    });
  };

  const handleAddOwner = () => {
    if (!newOwner.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para o responsável",
        variant: "destructive",
      });
      return;
    }
    
    addOwner(newOwner.trim());
    setNewOwner("");
    toast({
      title: "Sucesso",
      description: "Responsável adicionado",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Configurações</h2>
        <p className="text-muted-foreground">
          Personalize as opções do sistema
        </p>
      </div>

      {/* Fontes de Leads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Fontes de Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Adicionar nova fonte</Label>
            <div className="flex gap-2">
              <Input
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="Ex: Google Ads, Facebook, etc."
                onKeyDown={(e) => e.key === "Enter" && handleAddSource()}
              />
              <Button onClick={handleAddSource} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fontes disponíveis</Label>
            <div className="flex flex-wrap gap-2">
              {settings.leadSources.map((source) => (
                <Badge
                  key={source}
                  variant="secondary"
                  className="pl-3 pr-1 py-1 text-sm flex items-center gap-1"
                >
                  {source}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-destructive/20"
                    onClick={() => {
                      removeLeadSource(source);
                      toast({
                        title: "Removido",
                        description: `Fonte "${source}" removida`,
                      });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Responsáveis (Owners)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Adicionar novo responsável</Label>
            <div className="flex gap-2">
              <Input
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="Ex: João Silva, Maria Santos, etc."
                onKeyDown={(e) => e.key === "Enter" && handleAddOwner()}
              />
              <Button onClick={handleAddOwner} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Responsáveis disponíveis</Label>
            <div className="flex flex-wrap gap-2">
              {settings.owners.map((owner) => (
                <Badge
                  key={owner}
                  variant="secondary"
                  className="pl-3 pr-1 py-1 text-sm flex items-center gap-1"
                >
                  {owner}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-destructive/20"
                    onClick={() => {
                      removeOwner(owner);
                      toast({
                        title: "Removido",
                        description: `Responsável "${owner}" removido`,
                      });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metas para Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas para Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Receita Mensal */}
            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue">Meta de Receita Mensal (R$)</Label>
              <Input
                id="monthlyRevenue"
                type="number"
                value={settings.goals.monthlyRevenue}
                onChange={(e) => updateGoals({ monthlyRevenue: Number(e.target.value) })}
                placeholder="100000"
              />
            </div>

            {/* Leads Mensais */}
            <div className="space-y-2">
              <Label htmlFor="monthlyLeads">Meta de Leads Mensais</Label>
              <Input
                id="monthlyLeads"
                type="number"
                value={settings.goals.monthlyLeads}
                onChange={(e) => updateGoals({ monthlyLeads: Number(e.target.value) })}
                placeholder="50"
              />
            </div>

            {/* Taxa de Conversão */}
            <div className="space-y-2">
              <Label htmlFor="conversionRate">Meta de Taxa de Conversão (%)</Label>
              <Input
                id="conversionRate"
                type="number"
                value={settings.goals.conversionRate}
                onChange={(e) => updateGoals({ conversionRate: Number(e.target.value) })}
                placeholder="25"
                min="0"
                max="100"
              />
            </div>

            {/* Ticket Médio */}
            <div className="space-y-2">
              <Label htmlFor="averageTicket">Meta de Ticket Médio (R$)</Label>
              <Input
                id="averageTicket"
                type="number"
                value={settings.goals.averageTicket}
                onChange={(e) => updateGoals({ averageTicket: Number(e.target.value) })}
                placeholder="5000"
              />
            </div>

            {/* Reuniões Mensais */}
            <div className="space-y-2">
              <Label htmlFor="monthlyMeetings">Meta de Reuniões Mensais</Label>
              <Input
                id="monthlyMeetings"
                type="number"
                value={settings.goals.monthlyMeetings}
                onChange={(e) => updateGoals({ monthlyMeetings: Number(e.target.value) })}
                placeholder="30"
              />
            </div>

            {/* Negócios Ganhos */}
            <div className="space-y-2">
              <Label htmlFor="wonDeals">Meta de Negócios Ganhos por Mês</Label>
              <Input
                id="wonDeals"
                type="number"
                value={settings.goals.wonDeals}
                onChange={(e) => updateGoals({ wonDeals: Number(e.target.value) })}
                placeholder="10"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              💡 Estas metas serão usadas como referência nos relatórios e dashboards para comparar o desempenho atual.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Outras Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Mais opções de configuração serão adicionadas em breve...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
