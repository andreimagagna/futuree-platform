import { useState } from "react";
import { useStore, LeadStage } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

const stageLabels: Record<LeadStage, string> = {
  captured: 'Capturado',
  qualify: 'Qualificar',
  contact: 'Contato',
  proposal: 'Proposta',
  closing: 'Fechamento',
};

const stageColors: Record<LeadStage, string> = {
  captured: 'bg-blue-500',
  qualify: 'bg-purple-500',
  contact: 'bg-green-500',
  proposal: 'bg-orange-500',
  closing: 'bg-pink-500',
};

export const CRMView = () => {
  const { leads, updateLead } = useStore();
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.company.toLowerCase().includes(search.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (view === 'kanban') {
    const stages: LeadStage[] = ['captured', 'qualify', 'contact', 'proposal', 'closing'];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">CRM - Leads</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView('table')}
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="flex-1 min-w-[280px]">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{stageLabels[stage]}</h3>
                    <Badge variant="secondary">{stageLeads.length}</Badge>
                  </div>
                  <div className={`h-1 rounded-full ${stageColors[stage]}`} />
                </div>
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.company}</p>
                            </div>
                            <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {lead.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(lead.lastContact, { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CRM - Leads</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-4 font-medium">Nome</th>
                  <th className="py-3 px-4 font-medium">Empresa</th>
                  <th className="py-3 px-4 font-medium">Contato</th>
                  <th className="py-3 px-4 font-medium">Etapa</th>
                  <th className="py-3 px-4 font-medium">Score</th>
                  <th className="py-3 px-4 font-medium">Owner</th>
                  <th className="py-3 px-4 font-medium">Último Contato</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{lead.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{lead.company}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{lead.email}</div>
                        <div className="text-muted-foreground">{lead.whatsapp}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={lead.stage}
                        onValueChange={(value: LeadStage) =>
                          updateLead(lead.id, { stage: value })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(stageLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="py-3 px-4">{lead.owner}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDistanceToNow(lead.lastContact, { addSuffix: true, locale: ptBR })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
