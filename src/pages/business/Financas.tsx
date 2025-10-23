import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Loader2,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ============================================================================
// TYPES (conforme SQL criado)
// ============================================================================

interface FinanceRecord {
  id: string;
  type: "receita" | "despesa";
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "pago" | "pendente" | "atrasado" | null;
  payment_method: string | null;
  notes: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

const categoryOptions = {
  receita: ["Vendas", "Serviços", "Assinaturas", "Consultoria", "Investimentos", "Outros"],
  despesa: ["Salários", "Marketing", "Infraestrutura", "Fornecedores", "Impostos", "Aluguel", "Serviços", "Outros"],
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Financas = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // ============================================================================
  // SUPABASE HOOKS
  // ============================================================================

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['finance_records', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('finance_records')
        .select('*')
        .eq('owner_id', user?.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as FinanceRecord[];
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (newRecord: Partial<FinanceRecord>) => {
      const { data, error } = await (supabase as any)
        .from('finance_records')
        .insert({ ...newRecord, owner_id: user?.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_records'] });
      toast({ title: "Transação criada com sucesso!" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar transação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FinanceRecord> }) => {
      const { data, error } = await (supabase as any)
        .from('finance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_records'] });
      toast({ title: "Transação atualizada!" });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('finance_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_records'] });
      toast({ title: "Transação removida!" });
    },
  });

  // ============================================================================
  // STATE & HANDLERS
  // ============================================================================

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FinanceRecord | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [formData, setFormData] = useState({
    type: "receita" as "receita" | "despesa",
    category: "",
    description: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: "pendente" as "pago" | "pendente" | "atrasado",
    payment_method: "",
    notes: "",
  });

  const handleOpenDialog = (record?: FinanceRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData({
        type: record.type,
        category: record.category,
        description: record.description,
        amount: record.amount,
        date: record.date,
        status: (record.status || "pendente") as "pago" | "pendente" | "atrasado",
        payment_method: record.payment_method || "",
        notes: record.notes || "",
      });
    } else {
      setSelectedRecord(null);
      setFormData({
        type: "receita",
        category: "",
        description: "",
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        status: "pendente",
        payment_method: "",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.description || formData.amount <= 0) {
      toast({
        title: "Erro",
        description: "Preencha a descrição e valor corretamente",
        variant: "destructive",
      });
      return;
    }

    // Preparar dados: converter strings vazias para null em campos de data
    const dataToSave = {
      ...formData,
      date: formData.date || null,
    };

    if (selectedRecord) {
      updateMutation.mutate({ id: selectedRecord.id, updates: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      deleteMutation.mutate(id);
    }
  };

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  const filteredRecords = records.filter((record) => {
    const matchesType = filterType === "all" || record.type === filterType;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const totalReceita = records
    .filter((r) => r.type === "receita" && r.status === "pago")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalDespesa = records
    .filter((r) => r.type === "despesa" && r.status === "pago")
    .reduce((sum, r) => sum + r.amount, 0);

  const saldoAtual = totalReceita - totalDespesa;

  const pendingReceita = records
    .filter((r) => r.type === "receita" && r.status === "pendente")
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingDespesa = records
    .filter((r) => r.type === "despesa" && r.status === "pendente")
    .reduce((sum, r) => sum + r.amount, 0);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Finanças</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Total Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pendente: R$ {pendingReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              Total Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalDespesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pendente: R$ {pendingDespesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoAtual >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="receita">Receitas</SelectItem>
            <SelectItem value="despesa">Despesas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TRANSACTIONS LIST - DESIGN MELHORADO */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({filteredRecords.length})</TabsTrigger>
          <TabsTrigger value="receita">
            Receitas ({filteredRecords.filter(r => r.type === "receita").length})
          </TabsTrigger>
          <TabsTrigger value="despesa">
            Despesas ({filteredRecords.filter(r => r.type === "despesa").length})
          </TabsTrigger>
          <TabsTrigger value="pendente">
            Pendentes ({filteredRecords.filter(r => r.status === "pendente").length})
          </TabsTrigger>
        </TabsList>

        {["all", "receita", "despesa", "pendente"].map((tab) => {
          const tabRecords = tab === "all" 
            ? filteredRecords 
            : tab === "pendente"
            ? filteredRecords.filter(r => r.status === "pendente")
            : filteredRecords.filter(r => r.type === tab);

          return (
            <TabsContent key={tab} value={tab} className="space-y-3">
              {tabRecords.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <DollarSign className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma transação encontrada</p>
                  </CardContent>
                </Card>
              ) : (
                tabRecords.map((record) => (
                  <Card 
                    key={record.id} 
                    className="hover:shadow-md transition-shadow border-l-4"
                    style={{
                      borderLeftColor: record.type === "receita" 
                        ? "hsl(var(--success))" 
                        : "hsl(var(--destructive))"
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-full ${
                            record.type === "receita" 
                              ? "bg-success/10 text-success" 
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {record.type === "receita" ? (
                              <TrendingUp className="w-6 h-6" />
                            ) : (
                              <TrendingDown className="w-6 h-6" />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{record.description}</h3>
                              <Badge 
                                variant={
                                  record.status === "pago" ? "default" :
                                  record.status === "pendente" ? "secondary" :
                                  "destructive"
                                }
                                className="text-xs"
                              >
                                {record.status}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-3 text-sm text-muted-foreground flex-wrap">
                              <span className="font-medium">{record.category}</span>
                              <span>•</span>
                              <span>{new Date(record.date).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'long', 
                                year: 'numeric' 
                              })}</span>
                              {record.payment_method && (
                                <>
                                  <span>•</span>
                                  <span>{record.payment_method}</span>
                                </>
                              )}
                            </div>

                            {record.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                "{record.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className={`text-2xl font-bold ${
                            record.type === "receita" ? "text-success" : "text-destructive"
                          }`}>
                            {record.type === "receita" ? "+" : "-"} R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleOpenDialog(record)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(record.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRecord ? "Editar" : "Nova"} Transação</DialogTitle>
            <DialogDescription>
              Preencha os dados da transação financeira
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "receita" | "despesa") => 
                  setFormData({ ...formData, type: value, category: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions[formData.type].map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input
                placeholder="Ex: Pagamento de cliente X"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Data</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

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
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Método de Pagamento</label>
              <Input
                placeholder="Ex: Cartão de Crédito"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {selectedRecord ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Financas;
