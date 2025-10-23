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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  PiggyBank,
  Receipt,
  FileText,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "receita" | "despesa";
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "pago" | "pendente" | "atrasado";
  paymentMethod?: string;
  notes?: string;
}

const categoryOptions = {
  receita: [
    "Vendas",
    "Serviços",
    "Assinaturas",
    "Consultoria",
    "Investimentos",
    "Outros",
  ],
  despesa: [
    "Salários",
    "Marketing",
    "Infraestrutura",
    "Fornecedores",
    "Impostos",
    "Aluguel",
    "Serviços",
    "Outros",
  ],
};

const statusConfig = {
  pago: {
    label: "Pago",
    color: "text-success",
    variant: "default" as const,
  },
  pendente: {
    label: "Pendente",
    color: "text-warning",
    variant: "secondary" as const,
  },
  atrasado: {
    label: "Atrasado",
    color: "text-destructive",
    variant: "outline" as const,
  },
};

export const Financas = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<{
    type: "receita" | "despesa";
    category: string;
    description: string;
    amount: number;
    date: string;
    status: "pago" | "pendente" | "atrasado";
    paymentMethod: string;
    notes: string;
  }>({
    type: "receita",
    category: "",
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    status: "pendente",
    paymentMethod: "",
    notes: "",
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

    const matchesMonth =
      filterMonth === "all" ||
      transaction.date.startsWith(filterMonth);

    return matchesSearch && matchesType && matchesStatus && matchesMonth;
  });

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setFormData({
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod || "",
        notes: transaction.notes || "",
      });
    } else {
      setSelectedTransaction(null);
      setFormData({
        type: "receita",
        category: "",
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        status: "pendente",
        paymentMethod: "",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveTransaction = () => {
    if (!formData.description || !formData.category || formData.amount <= 0) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios: Descrição, Categoria e Valor",
        variant: "destructive",
      });
      return;
    }

    if (selectedTransaction) {
      setTransactions(
        transactions.map((t) =>
          t.id === selectedTransaction.id
            ? { ...selectedTransaction, ...formData }
            : t
        )
      );
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      });
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        ...formData,
      };
      setTransactions([...transactions, newTransaction]);
      toast({
        title: "Transação adicionada",
        description: "Nova transação adicionada com sucesso.",
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteTransaction = () => {
    if (selectedTransaction) {
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
      toast({
        title: "Transação removida",
        description: "A transação foi removida com sucesso.",
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  // Métricas Financeiras
  const totalReceitas = transactions
    .filter((t) => t.type === "receita" && t.status === "pago")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesas = transactions
    .filter((t) => t.type === "despesa" && t.status === "pago")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoAtual = totalReceitas - totalDespesas;

  const receitasPendentes = transactions
    .filter((t) => t.type === "receita" && t.status === "pendente")
    .reduce((sum, t) => sum + t.amount, 0);

  const despesasPendentes = transactions
    .filter((t) => t.type === "despesa" && t.status === "pendente")
    .reduce((sum, t) => sum + t.amount, 0);

  const transacoesAtrasadas = transactions.filter((t) => t.status === "atrasado").length;

  // Receitas e Despesas do mês atual
  const currentMonth = new Date().toISOString().slice(0, 7);
  const receitasMesAtual = transactions
    .filter((t) => t.type === "receita" && t.status === "pago" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const despesasMesAtual = transactions
    .filter((t) => t.type === "despesa" && t.status === "pago" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const lucroMesAtual = receitasMesAtual - despesasMesAtual;

  // Margem de lucro
  const margemLucro = totalReceitas > 0 ? ((saldoAtual / totalReceitas) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Finanças</h1>
          <p className="text-muted-foreground">Controle receitas, despesas e fluxo de caixa</p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Atual
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoAtual >= 0 ? 'text-success' : 'text-destructive'}`}>
              {saldoAtual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margem: {margemLucro}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas (Mês)
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {receitasMesAtual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pendente: {receitasPendentes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas (Mês)
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {despesasMesAtual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pendente: {despesasPendentes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lucro (Mês)
            </CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lucroMesAtual >= 0 ? 'text-success' : 'text-destructive'}`}>
              {lucroMesAtual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transacoesAtrasadas} em atraso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-success">
              {totalReceitas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-destructive">
              {totalDespesas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Total
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${saldoAtual >= 0 ? 'text-success' : 'text-destructive'}`}>
              {saldoAtual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transações */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Transações</CardTitle>
              <CardDescription>Gerencie receitas e despesas</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Meses</SelectItem>
                <SelectItem value={new Date().toISOString().slice(0, 7)}>Mês Atual</SelectItem>
                <SelectItem value={new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)}>
                  Mês Anterior
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Transações */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {transactions.length === 0
                  ? "Adicione sua primeira transação para começar"
                  : "Tente ajustar os filtros de busca"}
              </p>
              {transactions.length === 0 && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Transação
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => {
                const statusInfo = statusConfig[transaction.status];
                const isReceita = transaction.type === "receita";

                return (
                  <Card
                    key={transaction.id}
                    className={`border-l-4 ${
                      isReceita ? "border-l-success" : "border-l-destructive"
                    } hover:shadow-md transition-all`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {isReceita ? (
                                  <ArrowUpRight className="h-5 w-5 text-success" />
                                ) : (
                                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                                )}
                                <h3 className="text-lg font-semibold">{transaction.description}</h3>
                                <Badge variant={statusInfo.variant}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {transaction.category}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Valor</p>
                              <p
                                className={`text-lg font-bold ${
                                  isReceita ? "text-success" : "text-destructive"
                                }`}
                              >
                                {transaction.amount.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Data</p>
                              <p className="text-sm font-semibold">
                                {new Date(transaction.date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            {transaction.paymentMethod && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Pagamento</p>
                                <p className="text-sm font-semibold">{transaction.paymentMethod}</p>
                              </div>
                            )}
                          </div>

                          {transaction.notes && (
                            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                              {transaction.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(transaction)}
                            className="flex-1 lg:flex-none"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(transaction)}
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

      {/* Dialog de Adicionar/Editar Transação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da transação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo *</label>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions[formData.type].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição *</label>
              <Input
                placeholder="Ex: Pagamento de cliente X, Aluguel escritório..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor (R$) *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
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
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Forma de Pagamento</label>
                <Input
                  placeholder="Ex: PIX, Cartão, Boleto..."
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                placeholder="Informações adicionais sobre a transação..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTransaction}>
              {selectedTransaction ? "Salvar Alterações" : "Adicionar Transação"}
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
              Tem certeza que deseja excluir a transação "{selectedTransaction?.description}"? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTransaction}
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

export default Financas;
