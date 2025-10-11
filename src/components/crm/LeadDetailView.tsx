import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStore, LeadStage, type Lead, type BANTMethodology, type Product } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  CheckCircle, 
  MoreHorizontal, 
  XCircle, 
  Copy, 
  Archive, 
  Trash2, 
  AlertCircle,
  DollarSign,
  Users,
  Target,
  Clock,
  CheckCircle2,
  Plus,
  Minus,
  Package,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const STAGE_LABELS: Record<LeadStage, string> = {
  captured: "Capturado",
  qualify: "Qualificar",
  contact: "Contato",
  proposal: "Proposta",
  closing: "Fechamento",
};

const STAGE_ORDER: LeadStage[] = ["captured", "qualify", "contact", "proposal", "closing"];

const TIMELINE_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "note", label: "Notas" },
  { id: "call", label: "Chamadas" },
  { id: "email", label: "E-mails" },
  { id: "wa", label: "WhatsApp" },
  { id: "file", label: "Arquivos" },
] as const;

type TimelineFilterId = (typeof TIMELINE_FILTERS)[number]["id"];

type TabKey = "notes" | "activity" | "call" | "email" | "wa" | "files" | "docs" | "invoice";

const TAB_LABELS: Record<TabKey, string> = {
  activity: "Atividade",
  notes: "Notas",
  call: "Chamada",
  email: "E-mail",
  wa: "WhatsApp",
  files: "Arquivos",
  docs: "Documentos",
  invoice: "Fatura",
};

const MOCK_FILES = [
  { id: "file-1", name: "proposta.pdf", date: "10/10/2025" },
  { id: "file-2", name: "contrato.docx", date: "05/10/2025" },
];

interface TimelineItem {
  id: string;
  type: Exclude<TimelineFilterId, "all">;
  typeLabel: string;
  content: string;
  date: Date;
}

export const LeadDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead, addLead, deleteLead } = useStore();
  const lead = leads.find((l) => l.id === id);
  const { toast } = useToast();

  const [lostOpen, setLostOpen] = useState(false);
  const [lostReason, setLostReason] = useState("");
  const [lostCompetitor, setLostCompetitor] = useState("");
  const [tab, setTab] = useState<TabKey>("activity");
  const [nextActionText, setNextActionText] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [nextActionTime, setNextActionTime] = useState("");
  const [priority, setPriority] = useState("P2");
  const [filters, setFilters] = useState<TimelineFilterId[]>(["all"]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const nextActionMissing = !nextActionText || !nextActionDate || !nextActionTime;

  const daysInStage = useMemo(() => {
    if (!lead?.lastContact) return 0;
    const diff = Date.now() - lead.lastContact.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [lead?.lastContact]);

  const timelineItems = useMemo(() => buildTimeline(filters), [filters]);

  const followersCount = 3;

  const handleDuplicate = () => {
    if (!lead) return;
    
    const duplicatedLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      name: `${lead.name} (Cópia)`,
      lastContact: new Date(),
    };
    
    addLead(duplicatedLead);
    navigate(`/crm/${duplicatedLead.id}`);
  };

  const handleArchive = () => {
    if (!lead) return;
    
    // Add archived tag and update status
    const archivedTags = lead.tags.includes('arquivado') 
      ? lead.tags 
      : [...lead.tags, 'arquivado'];
    
    updateLead(lead.id, { tags: archivedTags });
    navigate('/crm');
  };

  const handleDelete = () => {
    if (!lead) return;
    
    deleteLead(lead.id);
    navigate('/crm');
  };

  const handleWon = () => {
    if (!lead) return;
    
    updateLead(lead.id, { 
      status: 'won',
      wonDate: new Date()
    });
  };

  const handleLost = () => {
    if (!lead) return;
    
    updateLead(lead.id, { 
      status: 'lost',
      lostReason,
      lostCompetitor,
      lostDate: new Date()
    });
    
    setLostOpen(false);
  };

  const handleSaveNextAction = () => {
    if (!lead || nextActionMissing) return;
    
    // Combine date and time into a Date object
    const dateTimeString = `${nextActionDate}T${nextActionTime}`;
    const nextActionDate_obj = new Date(dateTimeString);
    
    updateLead(lead.id, {
      nextAction: nextActionDate_obj
    });
    
    // Show success message
    toast({
      title: "Próxima ação salva!",
      description: `${nextActionText} agendado para ${format(nextActionDate_obj, "dd/MM/yyyy 'às' HH:mm")}`,
      variant: "default",
    });
    
    // Clear the form
    setNextActionText("");
    setNextActionDate("");
    setNextActionTime("");
    setPriority("P2");
  };

  if (!lead) {
    return <div className="text-muted-foreground">Lead não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      {renderHeader({ lead, followersCount, daysInStage, setLostOpen, onWon: handleWon, onDuplicate: handleDuplicate, onArchive: handleArchive, onDeleteClick: () => setDeleteConfirmOpen(true) })}

      <div className="grid gap-4 xl:grid-cols-12">
        {renderProfileColumn(lead, updateLead)}

        {renderMiddleColumn({
          nextActionText,
          setNextActionText,
          nextActionDate,
          setNextActionDate,
          nextActionTime,
          setNextActionTime,
          priority,
          setPriority,
          nextActionMissing,
          tab,
          setTab,
          filters,
          setFilters,
          timelineItems,
          onSaveNextAction: handleSaveNextAction,
        })}

        {renderSummaryColumn({ lead, nextActionMissing, nextActionText, nextActionDate, nextActionTime })}
      </div>

      <LostDealDialog
        open={lostOpen}
        onOpenChange={setLostOpen}
        lostReason={lostReason}
        setLostReason={setLostReason}
        lostCompetitor={lostCompetitor}
        setLostCompetitor={setLostCompetitor}
        onConfirm={handleLost}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lead</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

function renderHeader({
  lead,
  followersCount,
  daysInStage,
  setLostOpen,
  onWon,
  onDuplicate,
  onArchive,
  onDeleteClick,
}: {
  lead: Lead;
  followersCount: number;
  daysInStage: number;
  setLostOpen: (open: boolean) => void;
  onWon: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDeleteClick: () => void;
}) {
  const status = lead.status || 'open';
  
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight text-foreground">{lead.name}</h2>
              <Link
                to="#"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Building2 className="h-4 w-4" />
                {lead.company}
              </Link>
            </div>
            {status !== "open" && (
              <Badge
                className={status === "won" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}
              >
                {status === "won" ? "Ganho" : "Perdido"}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full border-dashed bg-background px-3 py-1 text-xs font-medium">
              Seguidores {followersCount}
            </Badge>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">Etapa atual: {STAGE_LABELS[lead.stage]}</span>
            <span className="hidden sm:flex items-center gap-1">• <span>{daysInStage} dias no estágio</span></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2" onClick={onWon} disabled={status !== 'open'}>
            <CheckCircle className="h-4 w-4" /> Ganho
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setLostOpen(true)} disabled={status !== 'open'}>
            <XCircle className="h-4 w-4" /> Perdido
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border bg-card">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Arquivar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDeleteClick}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/** Contact quick-actions removed for a cleaner header per request */}

      <div className="rounded-xl border bg-card/70 p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {STAGE_ORDER.map((stage) => (
              <span
                key={stage}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  stage === lead.stage
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {STAGE_LABELS[stage]}
              </span>
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground">{daysInStage} dias no estágio</span>
        </div>
      </div>
    </div>
  );
}

function renderProfileColumn(
  lead: Lead,
  updateLead: (id: string, updates: Partial<Lead>) => void,
) {
  return (
    <div className="space-y-4 xl:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Nome do negócio">
            <Input defaultValue={lead.name} onBlur={(e) => updateLead(lead.id, { name: e.target.value })} />
          </Field>
          <Field label="Empresa">
            <Input defaultValue={lead.company} onBlur={(e) => updateLead(lead.id, { company: e.target.value })} />
          </Field>
          <Field label="Website">
            <Input 
              defaultValue={lead.website || ''} 
              placeholder="https://exemplo.com.br"
              onBlur={(e) => updateLead(lead.id, { website: e.target.value })} 
            />
          </Field>
          <Field label="Porte da empresa">
            <Select 
              value={lead.companySize || ''} 
              onValueChange={(value) => updateLead(lead.id, { companySize: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEI">MEI</SelectItem>
                <SelectItem value="Pequena">Pequena</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Grande">Grande</SelectItem>
                <SelectItem value="Corporativa">Corporativa</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Número de funcionários">
            <Select 
              value={lead.employeeCount || ''} 
              onValueChange={(value) => updateLead(lead.id, { employeeCount: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="501-1000">501-1000</SelectItem>
                <SelectItem value="1000+">1000+</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Contato principal">
            <Input defaultValue={lead.email} onBlur={(e) => updateLead(lead.id, { email: e.target.value })} />
            <Input defaultValue={lead.whatsapp} onBlur={(e) => updateLead(lead.id, { whatsapp: e.target.value })} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comercial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Valor do negócio">
            <Input 
              type="number" 
              defaultValue={lead.dealValue || 0} 
              placeholder="R$ 0,00"
              step="0.01"
              min={0}
              onBlur={(e) => updateLead(lead.id, { dealValue: parseFloat(e.target.value) || 0 })} 
            />
          </Field>
          <Field label="Etapa">
            <Select value={lead.stage} onValueChange={(value: LeadStage) => updateLead(lead.id, { stage: value })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Probabilidade %">
            <Input type="number" defaultValue={70} min={0} max={100} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newProduct: Product = {
                  id: `product-${Date.now()}`,
                  name: '',
                  price: 0,
                  quantity: 1,
                };
                const currentProducts = lead.products || [];
                updateLead(lead.id, { products: [...currentProducts, newProduct] });
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!lead.products || lead.products.length === 0) ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum produto adicionado
            </p>
          ) : (
            <>
              {lead.products.map((product, index) => (
                <div key={product.id} className="flex gap-2 items-start p-3 border rounded-lg bg-card">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Nome do produto"
                      defaultValue={product.name}
                      onBlur={(e) => {
                        const updatedProducts = [...(lead.products || [])];
                        updatedProducts[index] = { ...product, name: e.target.value };
                        updateLead(lead.id, { products: updatedProducts });
                      }}
                      className="h-8"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Preço"
                        defaultValue={product.price}
                        step="0.01"
                        min={0}
                        onBlur={(e) => {
                          const updatedProducts = [...(lead.products || [])];
                          updatedProducts[index] = { ...product, price: parseFloat(e.target.value) || 0 };
                          updateLead(lead.id, { products: updatedProducts });
                        }}
                        className="h-8 flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Qtd"
                        defaultValue={product.quantity}
                        min={1}
                        onBlur={(e) => {
                          const updatedProducts = [...(lead.products || [])];
                          updatedProducts[index] = { ...product, quantity: parseInt(e.target.value) || 1 };
                          updateLead(lead.id, { products: updatedProducts });
                        }}
                        className="h-8 w-20"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Subtotal: R$ {((product.price || 0) * (product.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const updatedProducts = (lead.products || []).filter((_, i) => i !== index);
                      updateLead(lead.id, { products: updatedProducts });
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total dos Produtos:</span>
                  <span className="text-lg font-bold text-primary">
                    R$ {(lead.products || []).reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function renderMiddleColumn(params: {
  nextActionText: string;
  setNextActionText: (value: string) => void;
  nextActionDate: string;
  setNextActionDate: (value: string) => void;
  nextActionTime: string;
  setNextActionTime: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  nextActionMissing: boolean;
  tab: TabKey;
  setTab: (value: TabKey) => void;
  filters: TimelineFilterId[];
  setFilters: Dispatch<SetStateAction<TimelineFilterId[]>>;
  timelineItems: TimelineItem[];
  onSaveNextAction: () => void;
}) {
  const {
    nextActionText,
    setNextActionText,
    nextActionDate,
    setNextActionDate,
    nextActionTime,
    setNextActionTime,
    priority,
    setPriority,
    nextActionMissing,
    tab,
    setTab,
    filters,
    setFilters,
    timelineItems,
    onSaveNextAction,
  } = params;

  return (
    <div className="space-y-4 xl:col-span-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Próxima Ação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-5 pt-0">
          <form
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 xl:items-end"
            onSubmit={e => {
              e.preventDefault();
              if (!nextActionMissing) {
                onSaveNextAction();
              }
            }}
          >
            <div className="xl:col-span-2">
              <Field label="Tipo de ação">
                <Select
                  value={nextActionText}
                  onValueChange={v => setNextActionText(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="Ligação">Ligação</SelectItem>
                    <SelectItem value="Técnica">Técnica</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div>
              <Field label="Data">
                <Input
                  type="date"
                  value={nextActionDate}
                  onChange={e => setNextActionDate(e.target.value)}
                  required
                  placeholder="dd/mm/aaaa"
                />
              </Field>
            </div>
            <div>
              <Field label="Hora">
                <Input
                  type="time"
                  value={nextActionTime}
                  onChange={e => setNextActionTime(e.target.value)}
                  required
                  placeholder="--:--"
                />
              </Field>
            </div>
            <div className="xl:col-span-4 flex flex-wrap items-center gap-2">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-[104px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="P2">P2</SelectItem>
                  <SelectItem value="P3">P3</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                variant="default"
                disabled={nextActionMissing}
                className="ml-auto"
              >
                Salvar
              </Button>
            </div>
          </form>
          {nextActionMissing && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Preencha todos os campos para salvar a próxima ação</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(value) => setTab(value as TabKey)} className="space-y-3">
        <TabsList className="w-full justify-start gap-1 overflow-x-auto rounded-xl border bg-muted/30 p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="min-w-[92px] sm:min-w-[110px] flex-1 snap-start whitespace-nowrap rounded-lg px-3 py-1 text-xs sm:text-sm text-muted-foreground bg-muted/40 hover:bg-muted/50 transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {TAB_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="notes">
          <Card>
            <CardContent className="space-y-2 p-4">
              <Textarea placeholder="Escreva uma nota com @menções e #tags..." />
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Salvar</Button>
                <Button size="sm" variant="outline">
                  Fixar no topo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TIMELINE_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      isFilterActive(filters, filter.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-transparent bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => toggleFilter(filter.id, setFilters)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {timelineItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-lg border bg-card/80 p-3 shadow-sm">
                    <Badge variant="secondary">{item.typeLabel}</Badge>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">{item.content}</p>
                      <p className="text-xs text-muted-foreground">{format(item.date, "dd/MM/yyyy HH:mm")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="call">
          <Card>
            <CardContent className="space-y-2 p-4">
              <Input placeholder="Resultado" />
              <Input placeholder="Duração (min)" type="number" />
              <Textarea placeholder="Próximo passo" />
              <Button size="sm">Salvar chamada</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm text-muted-foreground">Conversas mockadas (Responder / Template)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wa">
          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm">Mensagens (Enviada/Recebida)</p>
              <Button variant="outline" size="sm">
                Abrir no SDR
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
              {MOCK_FILES.map((file) => (
                <div key={file.id} className="rounded-lg border bg-card/70 p-3">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm">Proposta: rascunho | Contrato: enviado</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice">
          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm">Status: Aguardando | Valor: R$ 10.000 | Vencimento: 30/10</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderSummaryColumn({
  lead,
  nextActionMissing,
  nextActionText,
  nextActionDate,
  nextActionTime,
}: {
  lead: Lead;
  nextActionMissing: boolean;
  nextActionText: string;
  nextActionDate: string;
  nextActionTime: string;
}) {
  const { updateLead } = useStore();
  
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const calculateBANTScore = (bant: BANTMethodology) => {
    let score = 0;
    if (bant.budget) score += 25;
    if (bant.authority) score += 25;
    if (bant.need) score += 25;
    if (bant.timeline) score += 25;
    return score;
  };

  const handleBANTChange = (field: keyof BANTMethodology, value: boolean) => {
    const currentBant = lead.bant || {
      budget: false,
      authority: false,
      need: false,
      timeline: false,
    };
    
    const updatedBant = {
      ...currentBant,
      [field]: value,
      qualifiedAt: currentBant.qualifiedAt || new Date(),
      qualifiedBy: currentBant.qualifiedBy || lead.owner,
    };
    
    const newScore = calculateBANTScore(updatedBant);
    
    updateLead(lead.id, {
      bant: updatedBant,
      score: newScore,
    });
  };

  return (
    <div className="space-y-4 xl:col-span-3">
      {/* BANT Qualification Card */}
      {lead.bant ? (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Qualificação BANT
              </CardTitle>
              <Badge variant="secondary" className={`${getScoreColor(lead.score)} font-bold`}>
                {lead.score} pts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Budget */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('budget', !lead.bant?.budget)}>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Budget</p>
                <p className="text-xs text-muted-foreground">Orçamento definido</p>
              </div>
              <Checkbox
                checked={lead.bant.budget}
                onCheckedChange={(checked) => handleBANTChange('budget', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Authority */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('authority', !lead.bant?.authority)}>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Authority</p>
                <p className="text-xs text-muted-foreground">Fala com decisor</p>
              </div>
              <Checkbox
                checked={lead.bant.authority}
                onCheckedChange={(checked) => handleBANTChange('authority', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Need */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-warning/5 border border-warning/20 hover:bg-warning/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('need', !lead.bant?.need)}>
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-warning-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Need</p>
                <p className="text-xs text-muted-foreground">Necessidade clara</p>
              </div>
              <Checkbox
                checked={lead.bant.need}
                onCheckedChange={(checked) => handleBANTChange('need', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('timeline', !lead.bant?.timeline)}>
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-success-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Timeline</p>
                <p className="text-xs text-muted-foreground">Prazo definido</p>
              </div>
              <Checkbox
                checked={lead.bant.timeline}
                onCheckedChange={(checked) => handleBANTChange('timeline', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Qualification Info */}
            {lead.bant.qualifiedAt && (
              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium">Qualificado:</span>{' '}
                  {formatDistanceToNow(lead.bant.qualifiedAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
                {lead.bant.qualifiedBy && (
                  <p>
                    <span className="font-medium">Por:</span> {lead.bant.qualifiedBy}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              Sem Qualificação BANT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Este lead ainda não foi qualificado pela metodologia BANT.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Score atual: <span className="font-semibold">{lead.score} pontos</span>
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <SummaryRow label="Owner" value={lead.owner} />
          <SummaryRow label="Empresa" value={lead.company} />
          <SummaryRow label="Etapa" value={STAGE_LABELS[lead.stage]} />
          <SummaryRow label="Probabilidade" value="70%" />
          <SummaryRow
            label="Próxima ação"
            value={nextActionMissing ? "—" : `${nextActionText} · ${nextActionDate} ${nextActionTime}`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fontes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <SourceBadge source={lead.source} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {nextActionMissing && <AlertRow text="Sem próxima ação (crítico)" />}
          <AlertRow text="Parado há X dias no estágio" />
          <AlertRow text="Sem resposta há Y horas/dias" />
          <AlertRow text="Probabilidade baixa vs valor alto" />
        </CardContent>
      </Card>
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
      {source}
    </span>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function AlertRow({ text }: { text: string }) {
  return <p className="font-medium text-destructive">{text}</p>;
}

function LostDealDialog({
  open,
  onOpenChange,
  lostReason,
  setLostReason,
  lostCompetitor,
  setLostCompetitor,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lostReason: string;
  setLostReason: (value: string) => void;
  lostCompetitor: string;
  setLostCompetitor: (value: string) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Motivo de perda</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Select value={lostReason} onValueChange={setLostReason}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preco">Preço</SelectItem>
              <SelectItem value="timing">Timing</SelectItem>
              <SelectItem value="sem_fit">Sem fit</SelectItem>
              <SelectItem value="sem_resposta">Sem resposta</SelectItem>
              <SelectItem value="concorrencia">Concorrência</SelectItem>
              <SelectItem value="orc_publico">Orçamento público</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Concorrente" value={lostCompetitor} onChange={(e) => setLostCompetitor(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!lostReason || !lostCompetitor}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function buildTimeline(filters: TimelineFilterId[]): TimelineItem[] {
  const items: TimelineItem[] = [
    {
      id: "n1",
      type: "note",
      typeLabel: "Nota",
      content: "Cliente mencionou budget de 5k.",
      date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: "w1",
      type: "wa",
      typeLabel: "WhatsApp",
      content: "Mensagem enviada com proposta.",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "e1",
      type: "email",
      typeLabel: "E-mail",
      content: "Follow-up enviado com materiais.",
      date: new Date(Date.now() - 90 * 60 * 1000),
    },
    {
      id: "c1",
      type: "call",
      typeLabel: "Chamada",
      content: "Ligação de qualificação (10min).",
      date: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      id: "f1",
      type: "file",
      typeLabel: "Arquivo",
      content: "Proposta.pdf anexada.",
      date: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  const activeFilters = filters.includes("all") ? ["note", "call", "email", "wa", "file"] : filters;
  return items
    .filter((item) => activeFilters.includes(item.type))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function toggleFilter(filterId: TimelineFilterId, setFilters: Dispatch<SetStateAction<TimelineFilterId[]>>) {
  if (filterId === "all") {
    setFilters(["all"]);
    return;
  }

  setFilters((prev) => {
    const withoutAll = prev.includes("all") ? [] : [...prev];
    return withoutAll.includes(filterId)
      ? (withoutAll.filter((value) => value !== filterId) as TimelineFilterId[])
      : ([...withoutAll, filterId] as TimelineFilterId[]);
  });
}

function isFilterActive(filters: TimelineFilterId[], filterId: TimelineFilterId) {
  if (filterId === "all") {
    return filters.includes("all") || filters.length === 0;
  }
  return filters.includes("all") ? false : filters.includes(filterId);
}

function presetNextAction(setDate: (value: string) => void, setTime: (value: string) => void) {
  const now = new Date();
  setDate(now.toISOString().slice(0, 10));
  setTime("09:00");
}

function completeNextAction(
  setText: (value: string) => void,
  setDate: (value: string) => void,
  setTime: (value: string) => void,
) {
  const now = new Date();
  setText("Concluído");
  setDate(now.toISOString().slice(0, 10));
  setTime(now.toTimeString().slice(0, 5));
}

function bumpDate(currentDate: string, amount: number, setDate: (value: string) => void) {
  if (!currentDate) return;
  const base = new Date(currentDate);
  base.setDate(base.getDate() + amount);
  setDate(base.toISOString().slice(0, 10));
}
