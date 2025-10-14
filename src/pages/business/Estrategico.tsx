import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Target,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Lightbulb,
  Flag,
  Rocket,
  BarChart3,
  Calendar,
  Award,
  Globe,
  Download,
  Filter,
  Search,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Objective {
  id: string;
  title: string;
  description: string;
  category: "financeiro" | "crescimento" | "produto" | "operacional" | "pessoas";
  priority: "alta" | "media" | "baixa";
  status: "nao-iniciado" | "em-andamento" | "concluido" | "pausado";
  deadline: string;
  progress: number;
  responsible?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  keyResults: KeyResult[];
}

interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

const categoryConfig = {
  financeiro: {
    label: "Financeiro",
    color: "text-success",
    bgColor: "bg-success/10",
    icon: TrendingUp,
  },
  crescimento: {
    label: "Crescimento",
    color: "text-primary",
    bgColor: "bg-primary/10",
    icon: Rocket,
  },
  produto: {
    label: "Produto",
    color: "text-accent",
    bgColor: "bg-accent/10",
    icon: Lightbulb,
  },
  operacional: {
    label: "Operacional",
    color: "text-warning",
    bgColor: "bg-warning/10",
    icon: BarChart3,
  },
  pessoas: {
    label: "Pessoas",
    color: "text-info",
    bgColor: "bg-info/10",
    icon: Users,
  },
};

const priorityConfig = {
  alta: {
    label: "Alta",
    color: "text-destructive",
    variant: "destructive" as const,
  },
  media: {
    label: "Média",
    color: "text-warning",
    variant: "secondary" as const,
  },
  baixa: {
    label: "Baixa",
    color: "text-muted-foreground",
    variant: "outline" as const,
  },
};

const statusConfig = {
  "nao-iniciado": {
    label: "Não Iniciado",
    color: "text-muted-foreground",
    icon: Circle,
  },
  "em-andamento": {
    label: "Em Andamento",
    color: "text-primary",
    icon: AlertCircle,
  },
  concluido: {
    label: "Concluído",
    color: "text-success",
    icon: CheckCircle2,
  },
  pausado: {
    label: "Pausado",
    color: "text-warning",
    icon: Circle,
  },
};

export const Estrategico = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("okrs");
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("deadline"); // deadline, priority, progress, created
  
  const [swot, setSwot] = useState<SWOT>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  });

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: "financeiro" | "crescimento" | "produto" | "operacional" | "pessoas";
    priority: "alta" | "media" | "baixa";
    status: "nao-iniciado" | "em-andamento" | "concluido" | "pausado";
    deadline: string;
    progress: number;
    responsible: string;
  }>({
    title: "",
    description: "",
    category: "financeiro",
    priority: "media",
    status: "nao-iniciado",
    deadline: "",
    progress: 0,
    responsible: "",
  });

  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [values, setValues] = useState<string[]>([]);

  const handleOpenDialog = (objective?: Objective) => {
    if (objective) {
      setSelectedObjective(objective);
      setFormData({
        title: objective.title,
        description: objective.description,
        category: objective.category,
        priority: objective.priority,
        status: objective.status,
        deadline: objective.deadline,
        progress: objective.progress,
        responsible: objective.responsible || "",
      });
    } else {
      setSelectedObjective(null);
      setFormData({
        title: "",
        description: "",
        category: "financeiro",
        priority: "media",
        status: "nao-iniciado",
        deadline: "",
        progress: 0,
        responsible: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveObjective = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios: Título e Descrição",
        variant: "destructive",
      });
      return;
    }

    if (selectedObjective) {
      setObjectives(
        objectives.map((obj) =>
          obj.id === selectedObjective.id
            ? {
                ...selectedObjective,
                ...formData,
              }
            : obj
        )
      );
      toast({
        title: "Objetivo atualizado",
        description: "O objetivo foi atualizado com sucesso.",
      });
    } else {
      const now = new Date().toISOString();
      const newObjective: Objective = {
        id: Date.now().toString(),
        ...formData,
        keyResults: [],
        createdAt: now,
        updatedAt: now,
        tags: [],
      };
      setObjectives([...objectives, newObjective]);
      toast({
        title: "Objetivo adicionado",
        description: "Novo objetivo adicionado com sucesso.",
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteObjective = () => {
    if (selectedObjective) {
      setObjectives(objectives.filter((obj) => obj.id !== selectedObjective.id));
      toast({
        title: "Objetivo removido",
        description: "O objetivo foi removido com sucesso.",
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedObjective(null);
  };

  const openDeleteDialog = (objective: Objective) => {
    setSelectedObjective(objective);
    setIsDeleteDialogOpen(true);
  };

  // Filtros
  const filteredObjectives = objectives.filter((obj) => {
    const matchesSearch =
      obj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (obj.responsible && obj.responsible.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === "all" || obj.category === filterCategory;
    const matchesStatus = filterStatus === "all" || obj.status === filterStatus;
    const matchesPriority = filterPriority === "all" || obj.priority === filterPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Ordenação
  const sortedObjectives = [...filteredObjectives].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'priority':
        const priorityOrder = { alta: 0, media: 1, baixa: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'progress':
        return b.progress - a.progress;
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Função de exportar para JSON
  const handleExport = () => {
    const exportData = {
      objectives,
      swot,
      vision,
      mission,
      values,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plano-estrategico-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado com sucesso",
      description: "Plano estratégico exportado em JSON.",
    });
  };

  // Métricas
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter((obj) => obj.status === "concluido").length;
  const inProgressObjectives = objectives.filter((obj) => obj.status === "em-andamento").length;
  const avgProgress =
    totalObjectives > 0
      ? Math.round(objectives.reduce((sum, obj) => sum + obj.progress, 0) / totalObjectives)
      : 0;

  const highPriorityObjectives = objectives.filter((obj) => obj.priority === "alta").length;
  
  // Objetivos atrasados
  const overdueObjectives = objectives.filter((obj) => {
    if (!obj.deadline || obj.status === "concluido") return false;
    return new Date(obj.deadline) < new Date();
  }).length;

  // Objetivos próximos do prazo (próximos 7 dias)
  const upcomingDeadlines = objectives.filter((obj) => {
    if (!obj.deadline || obj.status === "concluido") return false;
    const deadline = new Date(obj.deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Estratégico</h1>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Objetivos
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObjectives}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {highPriorityObjectives} de alta prioridade
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concluídos
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedObjectives}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalObjectives > 0
                ? `${((completedObjectives / totalObjectives) * 100).toFixed(0)}% do total`
                : "0% do total"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Andamento
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{inProgressObjectives}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Progresso médio: {avgProgress}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progresso Geral
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Objetivos Atrasados
            </CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueObjectives}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prazo vencido
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prazos Próximos
            </CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Sucesso
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalObjectives > 0
                ? `${((completedObjectives / totalObjectives) * 100).toFixed(0)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Objetivos finalizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="okrs">
            <Target className="h-4 w-4 mr-2" />
            OKRs
          </TabsTrigger>
          <TabsTrigger value="swot">
            <BarChart3 className="h-4 w-4 mr-2" />
            Análise SWOT
          </TabsTrigger>
          <TabsTrigger value="visao">
            <Globe className="h-4 w-4 mr-2" />
            Visão & Missão
          </TabsTrigger>
        </TabsList>

        {/* Tab OKRs */}
        <TabsContent value="okrs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle>Objetivos e Resultados-Chave (OKRs)</CardTitle>
                  <CardDescription>Defina e acompanhe seus objetivos estratégicos</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Objetivo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar objetivos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="crescimento">Crescimento</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="pessoas">Pessoas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="nao-iniciado">Não Iniciado</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Prioridades</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Prazo</SelectItem>
                    <SelectItem value="priority">Prioridade</SelectItem>
                    <SelectItem value="progress">Progresso</SelectItem>
                    <SelectItem value="created">Mais Recentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sortedObjectives.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {objectives.length === 0 ? "Nenhum objetivo definido" : "Nenhum objetivo encontrado"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {objectives.length === 0
                      ? "Comece adicionando seus objetivos estratégicos"
                      : "Tente ajustar os filtros de busca"}
                  </p>
                  {objectives.length === 0 && (
                    <Button onClick={() => handleOpenDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Objetivo
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedObjectives.map((objective) => {
                    const categoryInfo = categoryConfig[objective.category];
                    const priorityInfo = priorityConfig[objective.priority];
                    const statusInfo = statusConfig[objective.status];
                    const CategoryIcon = categoryInfo.icon;
                    const StatusIcon = statusInfo.icon;

                    return (
                      <Card
                        key={objective.id}
                        className="border-l-4"
                        style={{ borderLeftColor: `hsl(var(--${objective.category}))` }}
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CategoryIcon className={`h-5 w-5 ${categoryInfo.color}`} />
                                  <h3 className="text-lg font-semibold">{objective.title}</h3>
                                  <Badge variant={priorityInfo.variant}>
                                    {priorityInfo.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {objective.description}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    <div className="flex items-center gap-1">
                                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                                      <span className={`text-sm font-semibold ${statusInfo.color}`}>
                                        {statusInfo.label}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Categoria</p>
                                    <Badge
                                      variant="outline"
                                      className={`${categoryInfo.bgColor} ${categoryInfo.color} border-transparent`}
                                    >
                                      {categoryInfo.label}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Prazo</p>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span className="text-sm font-semibold">
                                        {objective.deadline
                                          ? new Date(objective.deadline).toLocaleDateString("pt-BR")
                                          : "Sem prazo"}
                                      </span>
                                    </div>
                                  </div>
                                  {objective.responsible && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Responsável</p>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span className="text-sm font-semibold">
                                          {objective.responsible}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-muted-foreground">Progresso</p>
                                    <span className="text-sm font-bold">{objective.progress}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        objective.progress === 100
                                          ? "bg-success"
                                          : objective.progress >= 50
                                          ? "bg-primary"
                                          : "bg-warning"
                                      }`}
                                      style={{ width: `${objective.progress}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenDialog(objective)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteDialog(objective)}
                                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab SWOT */}
        <TabsContent value="swot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise SWOT</CardTitle>
              <CardDescription>
                Forças, Fraquezas, Oportunidades e Ameaças do negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Forças */}
                <Card className="border-l-4 border-l-success">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="h-4 w-4 text-success" />
                      Forças (Strengths)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Liste as forças internas do negócio..."
                      rows={6}
                      className="resize-none"
                      value={swot.strengths.join("\n")}
                      onChange={(e) =>
                        setSwot({ ...swot, strengths: e.target.value.split("\n") })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Ex: Equipe qualificada, tecnologia própria, boa reputação
                    </p>
                  </CardContent>
                </Card>

                {/* Fraquezas */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Fraquezas (Weaknesses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Liste as fraquezas internas do negócio..."
                      rows={6}
                      className="resize-none"
                      value={swot.weaknesses.join("\n")}
                      onChange={(e) =>
                        setSwot({ ...swot, weaknesses: e.target.value.split("\n") })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Ex: Dependência de fornecedor, capital limitado, processos manuais
                    </p>
                  </CardContent>
                </Card>

                {/* Oportunidades */}
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-primary" />
                      Oportunidades (Opportunities)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Liste as oportunidades externas..."
                      rows={6}
                      className="resize-none"
                      value={swot.opportunities.join("\n")}
                      onChange={(e) =>
                        setSwot({ ...swot, opportunities: e.target.value.split("\n") })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Ex: Mercado em crescimento, novas tecnologias, parcerias
                    </p>
                  </CardContent>
                </Card>

                {/* Ameaças */}
                <Card className="border-l-4 border-l-warning">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Flag className="h-4 w-4 text-warning" />
                      Ameaças (Threats)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Liste as ameaças externas..."
                      rows={6}
                      className="resize-none"
                      value={swot.threats.join("\n")}
                      onChange={(e) =>
                        setSwot({ ...swot, threats: e.target.value.split("\n") })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Ex: Concorrência, mudanças regulatórias, crise econômica
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Visão & Missão */}
        <TabsContent value="visao" className="space-y-4">
          <div className="grid gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Visão
                </CardTitle>
                <CardDescription>
                  Onde a empresa quer chegar no futuro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva a visão de futuro da empresa..."
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Ex: Ser a empresa líder em [setor] até 2030, reconhecida pela inovação e excelência
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Missão
                </CardTitle>
                <CardDescription>
                  Propósito e razão de existir da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva a missão da empresa..."
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Ex: Transformar a experiência de [clientes] através de soluções inovadoras
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-success" />
                  Valores
                </CardTitle>
                <CardDescription>
                  Princípios que guiam a empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Liste os valores da empresa (um por linha)..."
                  value={values.join("\n")}
                  onChange={(e) => setValues(e.target.value.split("\n").filter((v) => v.trim()))}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Ex: Integridade, Inovação, Foco no Cliente, Excelência, Colaboração
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de Adicionar/Editar Objetivo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedObjective ? "Editar Objetivo" : "Novo Objetivo"}
            </DialogTitle>
            <DialogDescription>
              Defina um objetivo estratégico (OKR)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título do Objetivo *</label>
              <Input
                placeholder="Ex: Aumentar receita recorrente em 50%"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição *</label>
              <Textarea
                placeholder="Descreva o objetivo e como ele será alcançado..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="crescimento">Crescimento</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="pessoas">Pessoas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao-iniciado">Não Iniciado</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prazo</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Progresso (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsável</label>
                <Input
                  placeholder="Nome do responsável"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveObjective}>
              {selectedObjective ? "Salvar Alterações" : "Criar Objetivo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o objetivo "{selectedObjective?.title}"? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteObjective}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Estrategico;
