import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TrendingUp, Target, Award, Sparkles, Settings2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
  name: "Carlos Souza",
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

  // Estado para metas
  const [goals, setGoals] = useState({
    high: 10,
    medium: 15,
    low: 5,
  });

  const [tempGoals, setTempGoals] = useState(goals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveGoals = () => {
    setGoals(tempGoals);
    setIsDialogOpen(false);
    toast.success("Metas atualizadas com sucesso!", {
      description: `Alta: ${tempGoals.high} | Média: ${tempGoals.medium} | Baixa: ${tempGoals.low}`,
    });
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressStatus = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return { text: "Meta atingida!", color: "text-success" };
    if (percentage >= 80) return { text: "Perto da meta", color: "text-warning" };
    return { text: `Faltam ${goal - current}`, color: "text-muted-foreground" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Funil de Qualificação</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Configurar Metas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Metas do Funil</DialogTitle>
              <DialogDescription>
                Defina as metas mensais para cada nível de qualificação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="high-goal" className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-success" />
                  Meta - Alta Qualificação
                </Label>
                <Input
                  id="high-goal"
                  type="number"
                  min="0"
                  value={tempGoals.high}
                  onChange={(e) => setTempGoals({ ...tempGoals, high: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium-goal" className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-warning" />
                  Meta - Média Qualificação
                </Label>
                <Input
                  id="medium-goal"
                  type="number"
                  min="0"
                  value={tempGoals.medium}
                  onChange={(e) => setTempGoals({ ...tempGoals, medium: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="low-goal" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Meta - Baixa Qualificação
                </Label>
                <Input
                  id="low-goal"
                  type="number"
                  min="0"
                  value={tempGoals.low}
                  onChange={(e) => setTempGoals({ ...tempGoals, low: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveGoals}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Salvar Metas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-success/30 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-success" />
                Alta Qualificação
              </div>
              <Badge variant="outline" className="text-xs">
                Meta: {goals.high}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-success">{highQuality}</div>
              <span className={`text-sm ${getProgressStatus(highQuality, goals.high).color}`}>
                {getProgressStatus(highQuality, goals.high).text}
              </span>
            </div>
            <div>
              <Progress 
                value={calculateProgress(highQuality, goals.high)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Score 80-100 • {calculateProgress(highQuality, goals.high).toFixed(0)}% da meta
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/30 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-warning" />
                Média Qualificação
              </div>
              <Badge variant="outline" className="text-xs">
                Meta: {goals.medium}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-warning">{mediumQuality}</div>
              <span className={`text-sm ${getProgressStatus(mediumQuality, goals.medium).color}`}>
                {getProgressStatus(mediumQuality, goals.medium).text}
              </span>
            </div>
            <div>
              <Progress 
                value={calculateProgress(mediumQuality, goals.medium)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Score 60-79 • {calculateProgress(mediumQuality, goals.medium).toFixed(0)}% da meta
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-muted bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Baixa Qualificação
              </div>
              <Badge variant="outline" className="text-xs">
                Meta: {goals.low}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-muted-foreground">{lowQuality}</div>
              <span className={`text-sm ${getProgressStatus(lowQuality, goals.low).color}`}>
                {getProgressStatus(lowQuality, goals.low).text}
              </span>
            </div>
            <div>
              <Progress 
                value={calculateProgress(lowQuality, goals.low)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Score 0-59 • {calculateProgress(lowQuality, goals.low).toFixed(0)}% da meta
              </p>
            </div>
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
