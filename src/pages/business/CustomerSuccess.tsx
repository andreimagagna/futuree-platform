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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  segment: string;
  healthScore: number;
  mrr: number;
  status: "active" | "at-risk" | "churned";
  onboardingDate: string;
  lastContact: string;
  csm: string;
  notes: string;
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterHealth, setFilterHealth] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    company: string;
    segment: string;
    healthScore: number;
    mrr: number;
    status: "active" | "at-risk" | "churned";
    csm: string;
    notes: string;
  }>({
    name: "",
    email: "",
    company: "",
    segment: "",
    healthScore: 75,
    mrr: 0,
    status: "active",
    csm: "",
    notes: "",
  });

  const getHealthScoreCategory = (score: number) => {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    
    const matchesHealth =
      filterHealth === "all" || getHealthScoreCategory(customer.healthScore) === filterHealth;

    return matchesSearch && matchesStatus && matchesHealth;
  });

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        company: customer.company,
        segment: customer.segment,
        healthScore: customer.healthScore,
        mrr: customer.mrr,
        status: customer.status,
        csm: customer.csm,
        notes: customer.notes,
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        name: "",
        email: "",
        company: "",
        segment: "",
        healthScore: 75,
        mrr: 0,
        status: "active",
        csm: "",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.email || !formData.company) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios: Nome, Email e Empresa",
        variant: "destructive",
      });
      return;
    }

    if (selectedCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...selectedCustomer,
                ...formData,
                lastContact: new Date().toISOString().split("T")[0],
              }
            : c
        )
      );
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        onboardingDate: new Date().toISOString().split("T")[0],
        lastContact: new Date().toISOString().split("T")[0],
      };
      setCustomers([...customers, newCustomer]);
      toast({
        title: "Cliente adicionado",
        description: "Novo cliente adicionado com sucesso.",
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  // Métricas gerais
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const atRiskCustomers = customers.filter((c) => c.status === "at-risk").length;
  const totalMRR = customers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.mrr, 0);
  const avgHealthScore =
    totalCustomers > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.healthScore, 0) / totalCustomers)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Customer Success</h1>
        <p className="text-muted-foreground">
          Gerencie o sucesso e a saúde dos seus clientes
        </p>
      </div>

      {/* Métricas */}
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
            <BarChart3 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMRR.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Receita recorrente mensal
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
              Saúde geral da base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes em Risco
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{atRiskCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requerem atenção imediata
            </p>
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
                              <p className="text-sm font-semibold">{customer.segment}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">CSM</p>
                              <p className="text-sm font-semibold">{customer.csm}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
