import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  stage: string;
  owner: string;
  score: number;
  nextAction: string;
}

const mockLeads: Lead[] = [
  { id: '1', name: 'João Silva', company: 'Tech Corp', stage: 'Qualificar', owner: 'Você', score: 85, nextAction: 'Ligar hoje 15h' },
  { id: '2', name: 'Maria Santos', company: 'Innovation Labs', stage: 'Contato', owner: 'Você', score: 72, nextAction: 'Email follow-up' },
  { id: '3', name: 'Pedro Costa', company: 'Digital Solutions', stage: 'Proposta', owner: 'Equipe', score: 90, nextAction: 'Apresentar proposta' },
  { id: '4', name: 'Ana Oliveira', company: 'StartupXYZ', stage: 'Capturado', owner: 'Você', score: 65, nextAction: 'Primeira qualificação' },
];

const stages = ['Capturado', 'Qualificar', 'Contato', 'Proposta', 'Fechamento'];

export const PipelineSummary = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pipeline
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const count = mockLeads.filter((l) => l.stage === stage).length;
            const total = mockLeads.length;
            const percentage = (count / total) * 100;
            const width = 100 - index * 15;
            
            return (
              <div key={stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{stage}</span>
                  <span className="text-muted-foreground">{count} leads</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent flex items-center px-3 text-white text-sm font-semibold transition-all"
                    style={{ width: `${width}%` }}
                  >
                    {count > 0 && `${percentage.toFixed(0)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
