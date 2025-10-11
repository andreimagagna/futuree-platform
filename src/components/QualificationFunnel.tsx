import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, Target, Award, Sparkles } from "lucide-react";

interface QualifiedLead {
  id: string;
  name: string;
  company: string;
  score: number;
  stage: string;
  insights: string[];
}

const mockQualifiedLeads: QualifiedLead[] = [
  {
    id: "1",
    name: "João Silva",
    company: "Tech Corp",
    score: 92,
    stage: "Alta Qualificação",
    insights: ["Budget confirmado", "Decisor identificado", "Urgência alta"],
  },
  {
    id: "2",
    name: "Maria Santos",
    company: "Innovation Labs",
    score: 87,
    stage: "Alta Qualificação",
    insights: ["Fit ideal ICP", "Projeto aprovado", "Timeline definido"],
  },
  {
    id: "3",
    name: "Pedro Costa",
    company: "Digital Solutions",
    score: 74,
    stage: "Média Qualificação",
    insights: ["Interesse confirmado", "Avaliando orçamento"],
  },
  {
    id: "4",
    name: "Ana Oliveira",
    company: "StartupXYZ",
    score: 68,
    stage: "Média Qualificação",
    insights: ["Prospect promissor", "Múltiplas interações"],
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    company: "Enterprise Inc",
    score: 45,
    stage: "Baixa Qualificação",
    insights: ["Necessita nutrição", "Baixo engajamento"],
  },
];

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

const getStageIcon = (stage: string) => {
  if (stage === "Alta Qualificação") return <Award className="h-5 w-5 text-success" />;
  if (stage === "Média Qualificação") return <Target className="h-5 w-5 text-warning" />;
  return <TrendingUp className="h-5 w-5 text-muted-foreground" />;
};

export const QualificationFunnel = () => {
  const highQuality = mockQualifiedLeads.filter((l) => l.score >= 80).length;
  const mediumQuality = mockQualifiedLeads.filter((l) => l.score >= 60 && l.score < 80).length;
  const lowQuality = mockQualifiedLeads.filter((l) => l.score < 60).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Funil de Qualificação</h2>
        <p className="text-muted-foreground">Leads analisados e pontuados pela IA</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-success/30 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-success" />
              Alta Qualificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{highQuality}</div>
            <p className="text-sm text-muted-foreground">Score 80-100</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/30 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-warning" />
              Média Qualificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{mediumQuality}</div>
            <p className="text-sm text-muted-foreground">Score 60-79</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-muted bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Baixa Qualificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">{lowQuality}</div>
            <p className="text-sm text-muted-foreground">Score 0-59</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {mockQualifiedLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {getStageIcon(lead.stage)}
                        <span className="ml-1">{lead.stage}</span>
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Score de Qualificação</span>
                      <span className="text-sm font-medium">{lead.score}%</span>
                    </div>
                    <Progress value={lead.score} className="h-2" />
                  </div>

                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {lead.insights.map((insight, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
