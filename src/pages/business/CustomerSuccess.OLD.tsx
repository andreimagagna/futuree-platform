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
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Edit,
  Trash2,
  Heart,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  TrendingDown,
  UserCheck,
  DollarSign,
  Target,
  Activity,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

interface Customer {
  id: string;
  customer_name: string;
  customer_id: string;
  health_score: number;
  nps_score?: number;
  mrr: number;
  churn_risk: "low" | "medium" | "high";
  last_interaction?: string;
  contract_end_date?: string;
  notes?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

const healthScoreConfig = {
  high: {
    label: "Saudável",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    range: "80-100",
  },
  medium: {
    label: "Atenção",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    range: "50-79",
  },
  low: {
    label: "Risco",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    range: "0-49",
  },
};

const statusConfig = {
  active: {
    label: "Ativo",
    color: "text-success",
    variant: "default" as const,
  },
  "at-risk": {
    label: "Em Risco",
    color: "text-warning",
    variant: "secondary" as const,
  },
  churned: {
    label: "Cancelado",
    color: "text-muted-foreground",
    variant: "outline" as const,
  },
};

export const CustomerSuccess = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  
  // Supabase hooks diretos
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['cs_metrics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cs_metrics')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Customer[];
    },
    enabled: !!user?.id,
  });

  const createMetric = useMutation({
    mutationFn: async (data: Partial<Customer>) => {
      const { data: result, error } = await supabase
        .from('cs_metrics')
        .insert({ ...data, owner_id: user?.id })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cs_metrics'] });
    },
  });

  const updateMetric = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Customer> }) => {
      const { data, error } = await supabase
        .from('cs_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cs_metrics'] });
    },
  });

  const deleteMetric = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cs_metrics')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cs_metrics'] });
    },
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterHealth, setFilterHealth] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<{
    customer_name: string;
    customer_id: string;
    health_score: number;
    mrr: number;
    churn_risk: "low" | "medium" | "high";
    notes: string;
    nps_score?: number;
    contract_end_date?: string;
    last_interaction?: string;
  }>({
    customer_name: "",
    customer_id: "",
    health_score: 75,
    mrr: 0,
    churn_risk: "low",
    notes: "",
    nps_score: undefined,
    contract_end_date: "",
    last_interaction: "",
  });

  const getHealthScoreCategory = (score: number) => {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || customer.churn_risk === filterStatus;
    
    const matchesHealth =
      filterHealth === "all" || getHealthScoreCategory(customer.health_score) === filterHealth;

    return matchesSearch && matchesStatus && matchesHealth;
  });

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        customer_name: customer.customer_name,
        customer_id: customer.customer_id,
        health_score: customer.health_score || 75,
        mrr: customer.mrr || 0,
        churn_risk: customer.churn_risk || "low",
        notes: customer.notes || "",
        nps_score: customer.nps_score,
        contract_end_date: customer.contract_end_date || "",
        last_interaction: customer.last_interaction || "",
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        customer_name: "",
        customer_id: "",
        health_score: 75,
        mrr: 0,
        churn_risk: "low",
        notes: "",
        nps_score: undefined,
        contract_end_date: "",
        last_interaction: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formData.customer_name || !formData.customer_id) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios: Nome e ID do Cliente",
        variant: "destructive",
      });
      return;
    }

    if (selectedCustomer) {
      updateMetric.mutate(
        {
          id: selectedCustomer.id,
          updates: {
            ...formData,
            last_interaction: new Date().toISOString().split("T")[0],
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Cliente atualizado",
              description: "As informações do cliente foram atualizadas com sucesso.",
            });
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Erro ao atualizar",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createMetric.mutate(
        {
          ...formData,
          last_interaction: new Date().toISOString().split("T")[0],
        },
        {
          onSuccess: () => {
            toast({
              title: "Cliente adicionado",
              description: "Novo cliente adicionado com sucesso.",
            });
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Erro ao criar",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      deleteMetric.mutate(selectedCustomer.id, {
        onSuccess: () => {
          toast({
            title: "Cliente removido",
            description: "O cliente foi removido com sucesso.",
          });
          setIsDeleteDialogOpen(false);
          setSelectedCustomer(null);
        },
        onError: (error) => {
          toast({
            title: "Erro ao deletar",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  // Métricas gerais
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const atRiskCustomers = customers.filter((c) => c.status === "at-risk").length;
  const churnedCustomers = customers.filter((c) => c.status === "churned").length;
  
  const totalMRR = customers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.mrr, 0);
  
  const avgHealthScore =
    totalCustomers > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.healthScore, 0) / totalCustomers)
      : 0;

  // Churn Rate (últimos 30 dias simulado)
  const churnRate = totalCustomers > 0 
    ? ((churnedCustomers / totalCustomers) * 100).toFixed(1)
    : "0.0";

  // Retention Rate
  const retentionRate = totalCustomers > 0
    ? (((totalCustomers - churnedCustomers) / totalCustomers) * 100).toFixed(1)
    : "100.0";

  // NPS Médio (Net Promoter Score)
  const customersWithNPS = customers.filter((c) => c.nps !== undefined);
  const avgNPS = customersWithNPS.length > 0
    ? Math.round(customersWithNPS.reduce((sum, c) => sum + (c.nps || 0), 0) / customersWithNPS.length)
    : 0;

  // ARPU (Average Revenue Per User)
  const arpu = activeCustomers > 0
    ? totalMRR / activeCustomers
    : 0;

  // Clientes que precisam de atenção (health score < 50 ou sem contato há mais de 30 dias)
  const needsAttention = customers.filter((c) => {
    if (c.status !== "active") return false;
    const daysSinceContact = c.lastContact 
      ? Math.floor((new Date().getTime() - new Date(c.lastContact).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    return c.healthScore < 50 || daysSinceContact > 30;
  }).length;

  // Segmentação por Health Score
  const healthyCustomers = customers.filter((c) => c.status === "active" && c.healthScore >= 80).length;
  const mediumHealthCustomers = customers.filter((c) => c.status === "active" && c.healthScore >= 50 && c.healthScore < 80).length;
  const lowHealthCustomers = customers.filter((c) => c.status === "active" && c.healthScore < 50).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Customer Success</h1>
          <p className="text-muted-foreground">Gerencie o sucesso e a retenção de clientes</p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {totalCustomers} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MRR Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMRR.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ARPU: {arpu.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Retention Rate
            </CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{retentionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Churn: {churnRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Score Médio
            </CardTitle>
            <Heart className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHealthScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthyCustomers} saudáveis, {lowHealthCustomers} em risco
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes em Risco
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{atRiskCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Status marcado como risco
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Precisam Atenção
            </CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{needsAttention}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Health baixo ou sem contato
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NPS Médio
            </CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNPS}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customersWithNPS.length} respostas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Segmentação
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-success">Saudável:</span>
                <span className="font-semibold">{healthyCustomers}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-warning">Atenção:</span>
                <span className="font-semibold">{mediumHealthCustomers}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-destructive">Risco:</span>
                <span className="font-semibold">{lowHealthCustomers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações e Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Base de Clientes</CardTitle>
              <CardDescription>Gerencie seus clientes e acompanhe a saúde</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, empresa ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="at-risk">Em Risco</SelectItem>
                <SelectItem value="churned">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterHealth} onValueChange={setFilterHealth}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Health Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="high">Saudável (80-100)</SelectItem>
                <SelectItem value="medium">Atenção (50-79)</SelectItem>
                <SelectItem value="low">Risco (0-49)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Clientes */}
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {customers.length === 0
                  ? "Adicione seu primeiro cliente para começar"
                  : "Tente ajustar os filtros de busca"}
              </p>
              {customers.length === 0 && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Cliente
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => {
                const healthCategory = getHealthScoreCategory(customer.healthScore);
                const healthConfig = healthScoreConfig[healthCategory];
                const statusInfo = statusConfig[customer.status];

                return (
                  <Card
                    key={customer.id}
                    className={`${healthConfig.borderColor} border-l-4 hover:shadow-md transition-all`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{customer.name}</h3>
                                <Badge variant={statusInfo.variant}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {customer.company} • {customer.email}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`text-lg font-bold ${healthConfig.color}`}
                                >
                                  {customer.healthScore}%
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`${healthConfig.bgColor} ${healthConfig.color} border-transparent`}
                                >
                                  {healthConfig.label}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">MRR</p>
                              <p className="text-sm font-semibold">
                                {customer.mrr.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Segmento</p>
                              <p className="text-sm font-semibold">{customer.segment || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">CSM</p>
                              <p className="text-sm font-semibold">{customer.csm || "N/A"}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {customer.nps !== undefined && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">NPS</p>
                                <div className="flex items-center gap-1">
                                  <p className="text-sm font-semibold">{customer.nps}/10</p>
                                  <Badge
                                    variant="outline"
                                    className={
                                      customer.nps >= 9
                                        ? "bg-success/10 text-success border-transparent"
                                        : customer.nps >= 7
                                        ? "bg-warning/10 text-warning border-transparent"
                                        : "bg-destructive/10 text-destructive border-transparent"
                                    }
                                  >
                                    {customer.nps >= 9 ? "Promotor" : customer.nps >= 7 ? "Passivo" : "Detrator"}
                                  </Badge>
                                </div>
                              </div>
                            )}
                            {customer.contractEndDate && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Renovação</p>
                                <p className="text-sm font-semibold">
                                  {new Date(customer.contractEndDate).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Onboarding: {new Date(customer.onboardingDate).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Último contato: {new Date(customer.lastContact).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>

                        <div className="flex lg:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(customer)}
                            className="flex-1 lg:flex-none"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(customer)}
                            className="flex-1 lg:flex-none text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
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

      {/* Dialog de Adicionar/Editar Cliente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? "Editar Cliente" : "Adicionar Novo Cliente"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do cliente
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="health">Saúde & Métricas</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    placeholder="Nome do contato"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="email@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Empresa *</label>
                  <Input
                    placeholder="Nome da empresa"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Segmento</label>
                  <Input
                    placeholder="Ex: SaaS, E-commerce, Educação"
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CSM Responsável</label>
                <Input
                  placeholder="Nome do Customer Success Manager"
                  value={formData.csm}
                  onChange={(e) => setFormData({ ...formData, csm: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <Textarea
                  placeholder="Informações adicionais sobre o cliente..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Health Score (0-100)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="75"
                    value={formData.healthScore}
                    onChange={(e) =>
                      setFormData({ ...formData, healthScore: Number(e.target.value) })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    80-100: Saudável | 50-79: Atenção | 0-49: Risco
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">MRR (R$)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.mrr}
                    onChange={(e) => setFormData({ ...formData, mrr: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Receita recorrente mensal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">NPS (0-10)</label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="8"
                    value={formData.nps || ""}
                    onChange={(e) =>
                      setFormData({ 
                        ...formData, 
                        nps: e.target.value ? Number(e.target.value) : undefined 
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Net Promoter Score (opcional)
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Término do Contrato</label>
                  <Input
                    type="date"
                    value={formData.contractEndDate || ""}
                    onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Data de renovação (opcional)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status do Cliente</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="at-risk">Em Risco</SelectItem>
                    <SelectItem value="churned">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCustomer}>
              {selectedCustomer ? "Salvar Alterações" : "Adicionar Cliente"}
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
              Tem certeza que deseja excluir o cliente "{selectedCustomer?.name}"? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
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

export default CustomerSuccess;
