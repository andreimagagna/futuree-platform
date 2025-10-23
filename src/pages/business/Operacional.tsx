import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Settings,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Users,
  Zap,
  TrendingUp,
  Activity,
  Workflow,
  BarChart3,
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  Target,
  ArrowRight,
  Circle,
  PlayCircle,
  PauseCircle,
  GitBranch,
  Flag,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interfaces
interface ProcessStep {
  id: string;
  order: number;
  description: string;
  responsible?: string;
  estimatedTime?: string;
  status: 'pendente' | 'em-andamento' | 'concluido';
}

interface Resource {
  id: string;
  name: string;
  type: 'ferramenta' | 'sistema' | 'pessoa' | 'documento';
  description?: string;
}

interface KPI {
  id: string;
  name: string;
  target: string;
  current?: string;
  unit: string;
}

interface Process {
  id: string;
  name: string;
  description: string;
  department: 'vendas' | 'marketing' | 'operacoes' | 'financeiro' | 'rh' | 'ti';
  owner: string;
  status: 'ativo' | 'em-revisao' | 'descontinuado' | 'pausado';
  efficiency: number; // 0-100
  complexity: 'baixa' | 'media' | 'alta';
  automationLevel: number; // 0-100
  priority: 'alta' | 'media' | 'baixa';
  impactLevel: 'alto' | 'medio' | 'baixo';
  steps: ProcessStep[];
  resources: Resource[];
  kpis: KPI[];
  risks: string[];
  improvementOpportunities: string[];
  lastReview: string;
  nextReview: string;
  estimatedTime: string;
  actualTime?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const departmentConfig = {
  vendas: { label: 'Vendas', icon: TrendingUp, color: 'text-success' },
  marketing: { label: 'Marketing', icon: Zap, color: 'text-warning' },
  operacoes: { label: 'Operações', icon: Settings, color: 'text-info' },
  financeiro: { label: 'Financeiro', icon: BarChart3, color: 'text-primary' },
  rh: { label: 'RH', icon: Users, color: 'text-accent' },
  ti: { label: 'TI', icon: Activity, color: 'text-secondary' },
};

const complexityConfig = {
  baixa: { label: 'Baixa', variant: 'default' as const, color: 'bg-success' },
  media: { label: 'Média', variant: 'secondary' as const, color: 'bg-warning' },
  alta: { label: 'Alta', variant: 'destructive' as const, color: 'bg-destructive' },
};

const statusConfig = {
  ativo: { label: 'Ativo', variant: 'default' as const, color: 'text-success' },
  'em-revisao': { label: 'Em Revisão', variant: 'secondary' as const, color: 'text-warning' },
  descontinuado: { label: 'Descontinuado', variant: 'outline' as const, color: 'text-muted-foreground' },
  pausado: { label: 'Pausado', variant: 'destructive' as const, color: 'text-destructive' },
};

const priorityConfig = {
  alta: { label: 'Alta', variant: 'destructive' as const },
  media: { label: 'Média', variant: 'default' as const },
  baixa: { label: 'Baixa', variant: 'secondary' as const },
};

const impactConfig = {
  alto: { label: 'Alto', color: 'text-destructive' },
  medio: { label: 'Médio', color: 'text-warning' },
  baixo: { label: 'Baixo', color: 'text-success' },
};

export default function Operacional() {
  const { toast } = useToast();

  // Estados
  const [processes, setProcesses] = useState<Process[]>([]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Diálogos
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Visualização detalhada
  const [viewingProcess, setViewingProcess] = useState<Process | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFlowViewOpen, setIsFlowViewOpen] = useState(false);

  // Gerenciamento de steps do processo
  const [editingSteps, setEditingSteps] = useState<ProcessStep[]>([]);
  const [newStepDescription, setNewStepDescription] = useState('');

  // Form
  const [newProcess, setNewProcess] = useState<Partial<Process>>({
    name: '',
    description: '',
    department: 'operacoes',
    owner: '',
    status: 'ativo',
    efficiency: 75,
    complexity: 'media',
    automationLevel: 30,
    priority: 'media',
    impactLevel: 'medio',
    steps: [],
    resources: [],
    kpis: [],
    risks: [],
    improvementOpportunities: [],
    lastReview: new Date().toISOString().split('T')[0],
    nextReview: '',
    estimatedTime: '',
    tags: [],
  });

  // Métricas calculadas
  const totalProcesses = processes.length;
  const activeProcesses = processes.filter((p) => p.status === 'ativo').length;
  const processesInReview = processes.filter((p) => p.status === 'em-revisao').length;
  const highPriorityProcesses = processes.filter((p) => p.priority === 'alta').length;
  const avgEfficiency = processes.length > 0
    ? Math.round(processes.reduce((sum, p) => sum + p.efficiency, 0) / processes.length)
    : 0;
  const avgAutomation = processes.length > 0
    ? Math.round(processes.reduce((sum, p) => sum + p.automationLevel, 0) / processes.length)
    : 0;
  
  // Processos que precisam de revisão (próxima revisão nos próximos 30 dias)
  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const processesNeedingReview = processes.filter((p) => {
    if (!p.nextReview) return false;
    const reviewDate = new Date(p.nextReview);
    return reviewDate >= today && reviewDate <= in30Days;
  }).length;

  // Processos por departamento
  const processesByDepartment = Object.keys(departmentConfig).map((dept) => ({
    department: dept,
    count: processes.filter((p) => p.department === dept).length,
  }));

  // Filtros
  const filteredProcesses = processes.filter((process) => {
    const matchSearch =
      searchTerm === '' ||
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchDepartment = filterDepartment === 'all' || process.department === filterDepartment;
    const matchStatus = filterStatus === 'all' || process.status === filterStatus;
    const matchComplexity = filterComplexity === 'all' || process.complexity === filterComplexity;
    const matchPriority = filterPriority === 'all' || process.priority === filterPriority;
    return matchSearch && matchDepartment && matchStatus && matchComplexity && matchPriority;
  });

  // Handlers
  const handleOpenDialog = (process?: Process) => {
    if (process) {
      setEditingProcess(process);
      setNewProcess(process);
      setEditingSteps(process.steps || []);
    } else {
      setEditingProcess(null);
      setNewProcess({
        name: '',
        description: '',
        department: 'operacoes',
        owner: '',
        status: 'ativo',
        efficiency: 75,
        complexity: 'media',
        automationLevel: 30,
        priority: 'media',
        impactLevel: 'medio',
        steps: [],
        resources: [],
        kpis: [],
        risks: [],
        improvementOpportunities: [],
        lastReview: new Date().toISOString().split('T')[0],
        nextReview: '',
        estimatedTime: '',
        tags: [],
      });
      setEditingSteps([]);
    }
    setIsDialogOpen(true);
  };

  // Funções para gerenciar steps
  const handleAddStep = () => {
    if (!newStepDescription.trim()) return;
    
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      order: editingSteps.length + 1,
      description: newStepDescription,
      status: 'pendente',
    };
    
    setEditingSteps([...editingSteps, newStep]);
    setNewStepDescription('');
  };

  const handleRemoveStep = (stepId: string) => {
    const updatedSteps = editingSteps
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    setEditingSteps(updatedSteps);
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = editingSteps.findIndex((s) => s.id === stepId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editingSteps.length - 1)
    ) {
      return;
    }

    const newSteps = [...editingSteps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    
    const reorderedSteps = newSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
    setEditingSteps(reorderedSteps);
  };

  const handleViewFlow = (process: Process) => {
    setViewingProcess(process);
    setIsFlowViewOpen(true);
  };

  const handleSaveProcess = () => {
    if (!newProcess.name || !newProcess.owner) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    if (editingProcess) {
      setProcesses(
        processes.map((p) =>
          p.id === editingProcess.id
            ? { ...newProcess, steps: editingSteps, id: p.id, updatedAt: new Date().toISOString() } as Process
            : p
        )
      );
      toast({ title: 'Processo atualizado com sucesso!' });
    } else {
      const process: Process = {
        ...newProcess,
        steps: editingSteps,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Process;
      setProcesses([...processes, process]);
      toast({ title: 'Processo criado com sucesso!' });
    }

    setIsDialogOpen(false);
    setEditingProcess(null);
    setEditingSteps([]);
  };

  const handleDeleteProcess = () => {
    if (deleteId) {
      setProcesses(processes.filter((p) => p.id !== deleteId));
      toast({ title: 'Processo excluído com sucesso!' });
      setDeleteId(null);
    }
  };

  const handleViewProcess = (process: Process) => {
    setViewingProcess(process);
    setIsViewDialogOpen(true);
  };

  // Export
  const handleExport = () => {
    const data = {
      processes,
      metrics: {
        total: totalProcesses,
        active: activeProcesses,
        avgEfficiency,
        avgAutomation,
        byDepartment: processesByDepartment,
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Processos exportados com sucesso!' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Processos</h1>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Processos
            </CardTitle>
            <Workflow className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcesses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeProcesses} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Eficiência Média
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{avgEfficiency}%</div>
            <Progress value={avgEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Automação Média
            </CardTitle>
            <Zap className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{avgAutomation}%</div>
            <Progress value={avgAutomation} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Precisam Revisão
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{processesNeedingReview}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Próximos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Revisão
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processesInReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alta Prioridade
            </CardTitle>
            <Target className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityProcesses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Sucesso
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProcesses > 0 ? Math.round((activeProcesses / totalProcesses) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Processos */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Processos Organizacionais</CardTitle>
                <CardDescription>Mapeie e gerencie os processos da empresa</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Processo
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
                  placeholder="Buscar processos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Departamentos</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operacoes">Operações</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="ti">TI</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="em-revisao">Em Revisão</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="descontinuado">Descontinuado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterComplexity} onValueChange={setFilterComplexity}>
                <SelectTrigger>
                  <SelectValue placeholder="Complexidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Complexidades</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        {/* Lista de Processos */}
        <Card>
          <CardContent className="pt-6">
            {filteredProcesses.length === 0 ? (
              <div className="text-center py-12">
                <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {processes.length === 0 ? 'Nenhum processo cadastrado' : 'Nenhum processo encontrado'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {processes.length === 0
                    ? 'Comece mapeando os processos da sua organização'
                    : 'Tente ajustar os filtros de busca'}
                </p>
                {processes.length === 0 && (
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Processo
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProcesses.map((process) => {
                  const DeptIcon = departmentConfig[process.department].icon;
                  return (
                    <Card key={process.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <DeptIcon className={`h-5 w-5 ${departmentConfig[process.department].color}`} />
                              <CardTitle className="text-lg">{process.name}</CardTitle>
                            </div>
                            <CardDescription>{process.description}</CardDescription>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">
                                {departmentConfig[process.department].label}
                              </Badge>
                              <Badge variant={statusConfig[process.status].variant}>
                                {statusConfig[process.status].label}
                              </Badge>
                              <Badge variant={complexityConfig[process.complexity].variant}>
                                {complexityConfig[process.complexity].label}
                              </Badge>
                              <Badge variant={priorityConfig[process.priority].variant}>
                                {priorityConfig[process.priority].label}
                              </Badge>
                              {process.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {process.steps && process.steps.length > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewFlow(process)}
                                title="Ver fluxo do processo"
                              >
                                <GitBranch className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewProcess(process)}
                              title="Ver detalhes"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(process)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(process.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Eficiência</p>
                            <div className="flex items-center gap-2">
                              <Progress value={process.efficiency} className="flex-1" />
                              <span className="text-sm font-medium">{process.efficiency}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Automação</p>
                            <div className="flex items-center gap-2">
                              <Progress value={process.automationLevel} className="flex-1" />
                              <span className="text-sm font-medium">{process.automationLevel}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Responsável</p>
                            <p className="font-medium">{process.owner}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Última Revisão</p>
                            <p className="font-medium">
                              {new Date(process.lastReview).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {process.nextReview && (
                            <div>
                              <p className="text-muted-foreground">Próxima Revisão</p>
                              <p className="font-medium">
                                {new Date(process.nextReview).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                        </div>
                        {process.steps && process.steps.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Etapas do Processo ({process.steps.length})</p>
                            <div className="flex flex-wrap gap-2">
                              {process.steps.slice(0, 3).map((step) => (
                                <Badge key={step.id} variant="outline">
                                  {step.order}. {step.description.substring(0, 30)}{step.description.length > 30 ? '...' : ''}
                                </Badge>
                              ))}
                              {process.steps.length > 3 && (
                                <Badge variant="secondary">+{process.steps.length - 3} etapas</Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {process.kpis.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">KPIs ({process.kpis.length})</p>
                            <div className="flex flex-wrap gap-2">
                              {process.kpis.slice(0, 3).map((kpi) => (
                                <Badge key={kpi.id} variant="outline">
                                  {kpi.name}: {kpi.current || '-'}/{kpi.target} {kpi.unit}
                                </Badge>
                              ))}
                              {process.kpis.length > 3 && (
                                <Badge variant="secondary">+{process.kpis.length - 3}</Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      {/* Dialog Criar/Editar Processo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProcess ? 'Editar Processo' : 'Novo Processo'}</DialogTitle>
            <DialogDescription>
              Preencha as informações do processo organizacional
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Processo *</label>
                <Input
                  value={newProcess.name}
                  onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                  placeholder="Ex: Atendimento ao Cliente"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsável *</label>
                <Input
                  value={newProcess.owner}
                  onChange={(e) => setNewProcess({ ...newProcess, owner: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={newProcess.description}
                onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
                placeholder="Descreva o processo..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Departamento</label>
                <Select
                  value={newProcess.department}
                  onValueChange={(value: any) => setNewProcess({ ...newProcess, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="rh">RH</SelectItem>
                    <SelectItem value="ti">TI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newProcess.status}
                  onValueChange={(value: any) => setNewProcess({ ...newProcess, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="em-revisao">Em Revisão</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="descontinuado">Descontinuado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Complexidade</label>
                <Select
                  value={newProcess.complexity}
                  onValueChange={(value: any) => setNewProcess({ ...newProcess, complexity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <Select
                  value={newProcess.priority}
                  onValueChange={(value: any) => setNewProcess({ ...newProcess, priority: value })}
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Nível de Impacto</label>
                <Select
                  value={newProcess.impactLevel}
                  onValueChange={(value: any) => setNewProcess({ ...newProcess, impactLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="baixo">Baixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tempo Estimado</label>
                <Input
                  value={newProcess.estimatedTime}
                  onChange={(e) => setNewProcess({ ...newProcess, estimatedTime: e.target.value })}
                  placeholder="Ex: 2 horas"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Eficiência (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newProcess.efficiency}
                  onChange={(e) =>
                    setNewProcess({ ...newProcess, efficiency: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nível de Automação (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newProcess.automationLevel}
                  onChange={(e) =>
                    setNewProcess({ ...newProcess, automationLevel: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Última Revisão</label>
                <Input
                  type="date"
                  value={newProcess.lastReview}
                  onChange={(e) => setNewProcess({ ...newProcess, lastReview: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Próxima Revisão</label>
                <Input
                  type="date"
                  value={newProcess.nextReview}
                  onChange={(e) => setNewProcess({ ...newProcess, nextReview: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
              <Input
                value={newProcess.tags?.join(', ')}
                onChange={(e) =>
                  setNewProcess({
                    ...newProcess,
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="Ex: crítico, automação, cliente"
              />
            </div>

            {/* Gerenciamento de Etapas do Processo */}
            <div className="space-y-4 border-t pt-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Etapas do Processo (Fluxo)</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Desenhe o fluxo do processo adicionando as etapas em ordem
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  value={newStepDescription}
                  onChange={(e) => setNewStepDescription(e.target.value)}
                  placeholder="Descrição da etapa..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStep();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddStep} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              {editingSteps.length > 0 && (
                <div className="space-y-2">
                  {editingSteps.map((step, index) => (
                    <Card key={step.id} className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveStep(step.id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveStep(step.id, 'down')}
                            disabled={index === editingSteps.length - 1}
                          >
                            ↓
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <Badge variant="outline" className="font-mono">
                            {step.order}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm flex-1">{step.description}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStep(step.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProcess}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização do Fluxo do Processo */}
      <Dialog open={isFlowViewOpen} onOpenChange={setIsFlowViewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Fluxo do Processo: {viewingProcess?.name}
            </DialogTitle>
            <DialogDescription>
              Visualização do fluxo de trabalho com todas as etapas
            </DialogDescription>
          </DialogHeader>

          {viewingProcess && viewingProcess.steps && viewingProcess.steps.length > 0 ? (
            <div className="space-y-6">
              {/* Informações do Processo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Departamento</p>
                    <p className="font-medium">{departmentConfig[viewingProcess.department].label}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Responsável</p>
                    <p className="font-medium">{viewingProcess.owner}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Complexidade</p>
                    <Badge variant={complexityConfig[viewingProcess.complexity].variant}>
                      {complexityConfig[viewingProcess.complexity].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tempo Estimado</p>
                    <p className="font-medium">{viewingProcess.estimatedTime || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fluxograma Vertical */}
              <div className="space-y-1">
                {/* Início */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-success/20 border-2 border-success">
                    <div className="text-center">
                      <Flag className="h-6 w-6 mx-auto text-success mb-1" />
                      <p className="text-xs font-semibold text-success">INÍCIO</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{viewingProcess.name}</p>
                    <p className="text-xs text-muted-foreground">{viewingProcess.description}</p>
                  </div>
                </div>

                {/* Seta */}
                <div className="flex justify-start ml-12">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-border"></div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                  </div>
                </div>

                {/* Etapas */}
                {viewingProcess.steps.map((step, index) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-4">
                      {/* Número da etapa */}
                      <div className="flex items-center justify-center w-24 h-24 rounded-lg bg-primary/10 border-2 border-primary">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{step.order}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {step.status === 'concluido' ? 'Concluída' : 
                             step.status === 'em-andamento' ? 'Em Andamento' : 
                             'Pendente'}
                          </p>
                        </div>
                      </div>

                      {/* Descrição da etapa */}
                      <div className="flex-1 mt-4">
                        <Card className={
                          step.status === 'concluido' ? 'border-success' :
                          step.status === 'em-andamento' ? 'border-warning' :
                          'border-border'
                        }>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm flex items-center gap-2">
                                {step.status === 'concluido' && <CheckCircle2 className="h-4 w-4 text-success" />}
                                {step.status === 'em-andamento' && <PlayCircle className="h-4 w-4 text-warning" />}
                                {step.status === 'pendente' && <Circle className="h-4 w-4 text-muted-foreground" />}
                                {step.description}
                              </CardTitle>
                              <Badge variant={
                                step.status === 'concluido' ? 'default' :
                                step.status === 'em-andamento' ? 'secondary' :
                                'outline'
                              }>
                                {step.status === 'concluido' ? '✓ Concluída' :
                                 step.status === 'em-andamento' ? '⟳ Em Andamento' :
                                 '○ Pendente'}
                              </Badge>
                            </div>
                          </CardHeader>
                          {(step.responsible || step.estimatedTime) && (
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {step.responsible && (
                                  <div>
                                    <p className="text-muted-foreground text-xs">Responsável</p>
                                    <p className="font-medium">{step.responsible}</p>
                                  </div>
                                )}
                                {step.estimatedTime && (
                                  <div>
                                    <p className="text-muted-foreground text-xs">Tempo Estimado</p>
                                    <p className="font-medium">{step.estimatedTime}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      </div>
                    </div>

                    {/* Seta entre etapas */}
                    {index < viewingProcess.steps.length - 1 && (
                      <div className="flex justify-start ml-12 my-1">
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-6 bg-border"></div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Seta final */}
                <div className="flex justify-start ml-12">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-border"></div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                  </div>
                </div>

                {/* Fim */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary">
                    <div className="text-center">
                      <CheckCircle2 className="h-6 w-6 mx-auto text-primary mb-1" />
                      <p className="text-xs font-semibold text-primary">FIM</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Processo Concluído</p>
                    <p className="text-xs text-muted-foreground">
                      Total de {viewingProcess.steps.length} etapas
                    </p>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total de Etapas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{viewingProcess.steps.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Concluídas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      {viewingProcess.steps.filter(s => s.status === 'concluido').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Progresso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round((viewingProcess.steps.filter(s => s.status === 'concluido').length / viewingProcess.steps.length) * 100)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma etapa definida para este processo</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFlowViewOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização de Detalhes */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Processo</DialogTitle>
            <DialogDescription>
              Informações completas e métricas do processo
            </DialogDescription>
          </DialogHeader>
          
          {viewingProcess && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{viewingProcess.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewingProcess.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Departamento</p>
                    <Badge>{viewingProcess.department}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant={
                      viewingProcess.status === 'ativo' ? 'default' :
                      viewingProcess.status === 'em-revisao' ? 'secondary' : 'outline'
                    }>
                      {viewingProcess.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Complexidade</p>
                    <Badge variant="outline">{viewingProcess.complexity}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prioridade</p>
                    <Badge variant={
                      viewingProcess.priority === 'alta' ? 'destructive' :
                      viewingProcess.priority === 'media' ? 'default' : 'secondary'
                    }>
                      {viewingProcess.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Eficiência</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{viewingProcess.efficiency}%</div>
                    <Progress value={viewingProcess.efficiency} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Automação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{viewingProcess.automationLevel}%</div>
                    <Progress value={viewingProcess.automationLevel} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tempo Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{viewingProcess.averageTime}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Impacto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={
                      viewingProcess.impactLevel === 'alto' ? 'destructive' :
                      viewingProcess.impactLevel === 'medio' ? 'default' : 'secondary'
                    }>
                      {viewingProcess.impactLevel}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Etapas do Processo */}
              {viewingProcess.steps && viewingProcess.steps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    Etapas do Processo ({viewingProcess.steps.length})
                  </h4>
                  <div className="space-y-2">
                    {viewingProcess.steps.map((step) => (
                      <Card key={step.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                step.status === 'concluido' ? 'bg-success text-white' :
                                step.status === 'em-andamento' ? 'bg-info text-white' :
                                step.status === 'pendente' ? 'bg-muted text-muted-foreground' :
                                'bg-warning text-white'
                              }`}>
                                {step.order}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{step.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {step.responsible && (
                                  <Badge variant="outline">
                                    <Users className="h-3 w-3 mr-1" />
                                    {step.responsible}
                                  </Badge>
                                )}
                                {step.estimatedTime && (
                                  <Badge variant="outline">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {step.estimatedTime}
                                  </Badge>
                                )}
                                <Badge variant={
                                  step.status === 'concluido' ? 'default' :
                                  step.status === 'em-andamento' ? 'secondary' : 'outline'
                                }>
                                  {step.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* KPIs */}
              {viewingProcess.kpis && viewingProcess.kpis.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    KPIs ({viewingProcess.kpis.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {viewingProcess.kpis.map((kpi) => (
                      <Card key={kpi.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-sm">{kpi.name}</p>
                            <Badge variant="outline">{kpi.unit}</Badge>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{kpi.current || '-'}</span>
                            <span className="text-sm text-muted-foreground">/ {kpi.target}</span>
                          </div>
                          {kpi.current && kpi.target && (
                            <Progress 
                              value={(parseFloat(kpi.current) / parseFloat(kpi.target)) * 100} 
                              className="mt-2" 
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Recursos */}
              {viewingProcess.resources && viewingProcess.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Recursos Necessários ({viewingProcess.resources.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {viewingProcess.resources.map((resource) => (
                      <Badge key={resource.id} variant="outline" className="justify-start">
                        {resource.type === 'ferramenta' && '🔧'}
                        {resource.type === 'sistema' && '💻'}
                        {resource.type === 'pessoa' && '👤'}
                        {resource.type === 'documento' && '📄'}
                        <span className="ml-1">{resource.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Riscos */}
              {viewingProcess.risks && viewingProcess.risks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-warning">
                    <AlertCircle className="h-4 w-4" />
                    Riscos Identificados ({viewingProcess.risks.length})
                  </h4>
                  <div className="space-y-2">
                    {viewingProcess.risks.map((risk) => (
                      <div key={risk} className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Oportunidades de Melhoria */}
              {viewingProcess.improvementOpportunities && viewingProcess.improvementOpportunities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-success">
                    <TrendingUp className="h-4 w-4" />
                    Oportunidades de Melhoria ({viewingProcess.improvementOpportunities.length})
                  </h4>
                  <div className="space-y-2">
                    {viewingProcess.improvementOpportunities.map((opportunity) => (
                      <div key={opportunity} className="flex items-start gap-2 p-3 bg-success/10 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags e Informações Adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewingProcess.tags && viewingProcess.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingProcess.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Informações Adicionais</h4>
                  <div className="space-y-1 text-sm">
                    {viewingProcess.estimatedTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>Tempo estimado: {viewingProcess.estimatedTime}</span>
                      </div>
                    )}
                    {viewingProcess.nextReview && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />
                        <span>Próxima revisão: {new Date(viewingProcess.nextReview).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            {viewingProcess && (
              <>
                {viewingProcess.steps && viewingProcess.steps.length > 0 && (
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleViewFlow(viewingProcess);
                    }}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Ver Fluxo
                  </Button>
                )}
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleOpenDialog(viewingProcess);
                }}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este processo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProcess}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
