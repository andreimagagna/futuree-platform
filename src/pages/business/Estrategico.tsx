import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Rocket, 
  Users, 
  Settings,
  Plus, 
  Loader2,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  Clock,
  Filter,
  BarChart3,
  Award,
  TrendingDown,
  Flag,
  CheckCheck,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

interface StrategicGoal {
  id: string;
  title: string;
  description: string | null;
  category: "financeiro" | "crescimento" | "produto" | "operacional" | "pessoas" | null;
  priority: "alta" | "media" | "baixa" | null;
  status: "nao-iniciado" | "em-andamento" | "concluido" | "pausado" | null;
  progress: number;
  deadline: string | null;
  key_results: KeyResult[] | null;
  responsible: string | null;
  tags: string[] | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

const categoryConfig = {
  financeiro: { label: "Financeiro", icon: TrendingUp, color: "text-success" },
  crescimento: { label: "Crescimento", icon: Rocket, color: "text-primary" },
  produto: { label: "Produto", icon: Target, color: "text-accent" },
  operacional: { label: "Operacional", icon: Settings, color: "text-warning" },
  pessoas: { label: "Pessoas", icon: Users, color: "text-primary" },
};

const priorityConfig = {
  alta: { label: "Alta", color: "destructive" },
  media: { label: "Média", color: "default" },
  baixa: { label: "Baixa", color: "secondary" },
};

const statusConfig = {
  "nao-iniciado": { label: "Não Iniciado", icon: Circle, color: "text-muted-foreground" },
  "em-andamento": { label: "Em Andamento", icon: AlertCircle, color: "text-primary" },
  "concluido": { label: "Concluído", icon: CheckCircle2, color: "text-success" },
  "pausado": { label: "Pausado", icon: Circle, color: "text-warning" },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Estrategico = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // ============================================================================
  // SUPABASE HOOKS
  // ============================================================================

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['strategic_goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategic_goals')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StrategicGoal[];
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (newGoal: Partial<StrategicGoal>) => {
      const { data, error } = await (supabase as any)
        .from('strategic_goals')
        .insert({ ...newGoal, owner_id: user?.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic_goals'] });
      toast({ title: "Objetivo criado com sucesso!" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar objetivo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StrategicGoal> }) => {
      const { data, error } = await (supabase as any)
        .from('strategic_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic_goals'] });
      toast({ title: "Objetivo atualizado!" });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('strategic_goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic_goals'] });
      toast({ title: "Objetivo removido!" });
    },
  });

  // ============================================================================
  // STATE & HANDLERS
  // ============================================================================

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<StrategicGoal | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Filtros
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: "financeiro" | "crescimento" | "produto" | "operacional" | "pessoas";
    priority: "alta" | "media" | "baixa";
    status: "nao-iniciado" | "em-andamento" | "concluido" | "pausado";
    progress: number;
    deadline: string;
    responsible: string;
    key_results: KeyResult[];
  }>({
    title: "",
    description: "",
    category: "financeiro",
    priority: "media",
    status: "nao-iniciado",
    progress: 0,
    deadline: "",
    responsible: "",
    key_results: [],
  });

  // Calcular progresso automaticamente baseado nos Key Results
  const calculateProgress = (keyResults: KeyResult[]): number => {
    if (!keyResults || keyResults.length === 0) return 0;
    
    const totalProgress = keyResults.reduce((sum, kr) => {
      const krProgress = (kr.current / kr.target) * 100;
      return sum + Math.min(krProgress, 100);
    }, 0);
    
    return Math.round(totalProgress / keyResults.length);
  };

  const handleOpenDialog = (goal?: StrategicGoal) => {
    if (goal) {
      setSelectedGoal(goal);
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        category: (goal.category || "financeiro") as "financeiro" | "crescimento" | "produto" | "operacional" | "pessoas",
        priority: (goal.priority || "media") as "alta" | "media" | "baixa",
        status: (goal.status || "nao-iniciado") as "nao-iniciado" | "em-andamento" | "concluido" | "pausado",
        progress: goal.progress || 0,
        deadline: goal.deadline || "",
        responsible: goal.responsible || "",
        key_results: goal.key_results || [],
      });
    } else {
      setSelectedGoal(null);
      setFormData({
        title: "",
        description: "",
        category: "financeiro",
        priority: "media",
        status: "nao-iniciado",
        progress: 0,
        deadline: "",
        responsible: "",
        key_results: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Preencha o título do objetivo",
        variant: "destructive",
      });
      return;
    }

    // Calcular progresso automaticamente baseado nos Key Results
    const calculatedProgress = calculateProgress(formData.key_results);

    const dataToSave = {
      ...formData,
      progress: calculatedProgress, // Usar progresso calculado
      deadline: formData.deadline || null,
    };

    if (selectedGoal) {
      updateMutation.mutate({ id: selectedGoal.id, updates: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este objetivo?")) {
      deleteMutation.mutate(id);
    }
  };

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === "concluido").length;
  const inProgressGoals = goals.filter(g => g.status === "em-andamento").length;
  const notStartedGoals = goals.filter(g => g.status === "nao-iniciado").length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
    : 0;

  // Alertas de deadline
  const today = new Date();
  const goalsNearDeadline = goals.filter(g => {
    if (!g.deadline) return false;
    const deadline = new Date(g.deadline);
    const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0 && g.status !== "concluido";
  }).length;

  const overdueGoals = goals.filter(g => {
    if (!g.deadline) return false;
    const deadline = new Date(g.deadline);
    return deadline < today && g.status !== "concluido";
  }).length;

  // Filtros
  const filteredGoals = goals.filter(goal => {
    if (filterCategory !== "all" && goal.category !== filterCategory) return false;
    if (filterStatus !== "all" && goal.status !== filterStatus) return false;
    if (filterPriority !== "all" && goal.priority !== filterPriority) return false;
    return true;
  });

  // Helper para calcular dias até deadline
  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Estratégico & OKRs</h1>
          <p className="text-muted-foreground">Gerencie objetivos e resultados-chave</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Objetivo
        </Button>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <div className="text-2xl font-bold">{totalGoals}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <div className="text-2xl font-bold text-success">{completedGoals}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              <div className="text-2xl font-bold text-primary">{inProgressGoals}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Não Iniciados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{notStartedGoals}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximos 7 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              <div className="text-2xl font-bold text-warning">{goalsNearDeadline}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atrasados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <div className="text-2xl font-bold text-destructive">{overdueGoals}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PROGRESS OVERVIEW */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progresso Médio</span>
              <span className="text-lg font-bold">{avgProgress}%</span>
            </div>
            <Progress value={avgProgress} variant="gradient" className="h-3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Taxa de Conclusão:</span>
              <span className="font-semibold ml-2">
                {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Em Progresso:</span>
              <span className="font-semibold ml-2">
                {totalGoals > 0 ? Math.round((inProgressGoals / totalGoals) * 100) : 0}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Não Iniciados:</span>
              <span className="font-semibold ml-2">
                {totalGoals > 0 ? Math.round((notStartedGoals / totalGoals) * 100) : 0}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Com Atraso:</span>
              <span className="font-semibold ml-2 text-destructive">{overdueGoals}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FILTROS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(filterCategory !== "all" || filterStatus !== "all" || filterPriority !== "all") && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterCategory("all");
                  setFilterStatus("all");
                  setFilterPriority("all");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GOALS LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {goals.length === 0 ? "Nenhum objetivo cadastrado" : "Nenhum objetivo encontrado com os filtros aplicados"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => {
            const CategoryIcon = categoryConfig[goal.category || "financeiro"].icon;
            const StatusIcon = statusConfig[goal.status || "nao-iniciado"].icon;
            const daysUntil = getDaysUntilDeadline(goal.deadline);

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <CategoryIcon className={`w-5 h-5 ${categoryConfig[goal.category || "financeiro"].color}`} />
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        
                        {/* DEADLINE BADGE */}
                        {daysUntil !== null && goal.status !== "concluido" && (
                          <Badge 
                            variant={daysUntil < 0 ? "destructive" : daysUntil <= 7 ? "default" : "outline"}
                            className={daysUntil < 0 ? "" : daysUntil <= 7 ? "bg-warning text-warning-foreground" : ""}
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            {daysUntil < 0 
                              ? `${Math.abs(daysUntil)}d atrasado` 
                              : daysUntil === 0 
                              ? "Hoje" 
                              : `${daysUntil}d restantes`
                            }
                          </Badge>
                        )}
                      </div>
                      {goal.description && (
                        <CardDescription>{goal.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(goal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${statusConfig[goal.status || "nao-iniciado"].color}`} />
                      <span className="text-sm">{statusConfig[goal.status || "nao-iniciado"].label}</span>
                    </div>
                    <Badge variant={priorityConfig[goal.priority || "media"].color as any}>
                      <Flag className="w-3 h-3 mr-1" />
                      {priorityConfig[goal.priority || "media"].label}
                    </Badge>
                    <Badge variant="outline">
                      {categoryConfig[goal.category || "financeiro"].label}
                    </Badge>
                    {goal.responsible && (
                      <span className="text-sm text-muted-foreground">
                        Responsável: {goal.responsible}
                      </span>
                    )}
                    {goal.deadline && (
                      <span className="text-sm text-muted-foreground">
                        Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} variant="gradient" />
                  </div>

                  {/* KEY RESULTS */}
                  {goal.key_results && goal.key_results.length > 0 && (
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Award className="w-4 h-4 text-accent" />
                        <span>Key Results ({goal.key_results.length})</span>
                      </div>
                      <div className="space-y-3">
                        {goal.key_results.map((kr) => {
                          const krProgress = Math.round((kr.current / kr.target) * 100);
                          return (
                            <div key={kr.id} className="space-y-1 pl-6">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{kr.description}</span>
                                <span className="font-medium">
                                  {kr.current} / {kr.target} {kr.unit}
                                </span>
                              </div>
                              <Progress value={Math.min(krProgress, 100)} variant="success" className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedGoal ? "Editar Objetivo" : "Novo Objetivo"}
            </DialogTitle>
            <DialogDescription>
              Defina objetivos estratégicos e acompanhe seu progresso
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                placeholder="Ex: Aumentar MRR em 50%"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                placeholder="Descreva o objetivo..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Prioridade</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Progresso (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Responsável</label>
                <Input
                  placeholder="Nome do responsável"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Prazo</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            {/* KEY RESULTS SECTION */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    Key Results
                  </Label>
                  {formData.key_results.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Progresso Calculado: {calculateProgress(formData.key_results)}%
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newKR: KeyResult = {
                      id: Date.now().toString(),
                      description: "",
                      target: 100,
                      current: 0,
                      unit: "%"
                    };
                    setFormData({
                      ...formData,
                      key_results: [...formData.key_results, newKR]
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar KR
                </Button>
              </div>

              {formData.key_results.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Nenhum Key Result definido. O progresso será manual.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.key_results.map((kr, index) => {
                    const krProgress = Math.round((kr.current / kr.target) * 100);
                    return (
                      <Card key={kr.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Descrição do Key Result"
                              value={kr.description}
                              onChange={(e) => {
                                const updated = [...formData.key_results];
                                updated[index].description = e.target.value;
                                setFormData({ ...formData, key_results: updated });
                              }}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  key_results: formData.key_results.filter((_, i) => i !== index)
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">Meta</Label>
                              <Input
                                type="number"
                                min="0"
                                value={kr.target}
                                onChange={(e) => {
                                  const updated = [...formData.key_results];
                                  updated[index].target = Number(e.target.value);
                                  setFormData({ ...formData, key_results: updated });
                                }}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Atual</Label>
                              <Input
                                type="number"
                                min="0"
                                value={kr.current}
                                onChange={(e) => {
                                  const updated = [...formData.key_results];
                                  updated[index].current = Number(e.target.value);
                                  setFormData({ ...formData, key_results: updated });
                                }}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Unidade</Label>
                              <Input
                                placeholder="%"
                                value={kr.unit}
                                onChange={(e) => {
                                  const updated = [...formData.key_results];
                                  updated[index].unit = e.target.value;
                                  setFormData({ ...formData, key_results: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progresso deste KR</span>
                              <span className="font-semibold">{krProgress}%</span>
                            </div>
                            <Progress value={Math.min(krProgress, 100)} variant="success" className="h-1.5" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {selectedGoal ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o objetivo "{selectedGoal?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedGoal(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedGoal) {
                  handleDelete(selectedGoal.id);
                  setIsDeleteDialogOpen(false);
                  setSelectedGoal(null);
                }
              }}
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
