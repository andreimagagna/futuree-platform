import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStore, LeadStage, type Lead, type BANTMethodology, type Product, type Note, type Activity, type Settings } from "@/store/useStore";
import { useSupabaseLeads } from "@/hooks/useSupabaseLeads";
import { useSupabaseActivities } from "@/hooks/useSupabaseActivities";
import { useSupabaseTasks } from "@/hooks/useSupabaseTasks";
import { useLeadSources } from "@/hooks/useLeadSources";
import { useAuth } from "@/hooks/useAuth";
import { ActivityTimeline } from "./ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ArrowLeft,
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
  { id: "nextAction", label: "Próximas Ações" },
] as const;

type TimelineFilterId = (typeof TIMELINE_FILTERS)[number]["id"];

type TabKey = "focus" | "history";

const TAB_LABELS: Record<TabKey, string> = {
  focus: "Foco",
  history: "Histórico",
};

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
  const { user } = useAuth();
  
  // Buscar fontes de leads do Supabase (configuradas em Settings)
  const { activeSources, isLoading: isLoadingLeadSources } = useLeadSources();
  
  // ============================================================================
  // SUPABASE INTEGRATION
  // ============================================================================
  const { 
    leads: supabaseLeads,
    updateLead: updateSupabaseLead,
    deleteLead: deleteSupabaseLead,
  } = useSupabaseLeads({
    filters: {
      owner_id: user?.id,
    },
  });
  
  const { activities: supabaseActivities, createActivity, markAsCompleted, markAsPending } = useSupabaseActivities(id || undefined);
  const { tasks: supabaseTasks, createTask, updateTask } = useSupabaseTasks(id || undefined);
  
  // ============================================================================
  // LOCAL STORE (para funnels, tags, etc)
  // ============================================================================
  const { leads, updateLead, addLead, deleteLead, notes, addNote, activities, addActivity, settings } = useStore();
  
  // Buscar lead do Supabase primeiro, se não achar, busca do store local
  const supabaseLead = supabaseLeads.find((l) => l.id === id);
  const localLead = leads.find((l) => l.id === id);
  const rawLead: any = supabaseLead || localLead; // Usar any para evitar conflito de tipos
  
  // ✅ Mapear campos de custom_fields para facilitar acesso
  const lead: any = rawLead ? {
    ...rawLead,
    company: rawLead.custom_fields?.company || rawLead.company || '',
    owner: rawLead.custom_fields?.owner || rawLead.owner || '',
    website: rawLead.custom_fields?.website || rawLead.website || '',
    companySize: rawLead.custom_fields?.companySize || rawLead.companySize || '',
    employeeCount: rawLead.custom_fields?.employeeCount || rawLead.employeeCount || '',
  } : null;
  
  const leadNotes = notes.filter((n) => n.leadId === id);
  
  // ✅ Converter notes do Supabase para formato de timeline (SOMENTE LEITURA)
  const supabaseNotes = useMemo(() => {
    if (!lead?.notes || typeof lead.notes !== 'string') return [];
    
    // Parse notes do formato: "[DD/MM/YYYY HH:MM] Texto da nota"
    const noteBlocks = lead.notes.split('\n\n').filter(Boolean);
    return noteBlocks.map((block, index) => {
      const match = block.match(/^\[(.+?)\] (.+)$/s);
      if (match) {
        const [, timestamp, content] = match;
        // Tentar parsear a data
        try {
          const [datePart, timePart] = timestamp.split(' ');
          const [day, month, year] = datePart.split('/');
          const [hour, minute] = timePart.split(':');
          const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
          return {
            id: `supabase-note-${id}-${index}`,
            leadId: id,
            content: content.trim(),
            createdAt: date,
          };
        } catch {
          return {
            id: `supabase-note-${id}-${index}`,
            leadId: id,
            content: block,
            createdAt: new Date(),
          };
        }
      }
      return {
        id: `supabase-note-${id}-${index}`,
        leadId: id,
        content: block,
        createdAt: new Date(),
      };
    });
  }, [lead?.notes, id]);
  
  // ✅ Combinar notes do store local + notes do Supabase
  const allLeadNotes = useMemo(() => {
    return [...leadNotes, ...supabaseNotes].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [leadNotes, supabaseNotes]);
  
  // ✅ USAR ACTIVITIES DO SUPABASE ao invés do store local
  const leadActivities = supabaseActivities || [];
  const { toast } = useToast();

  const [lostOpen, setLostOpen] = useState(false);
  const [lostReason, setLostReason] = useState("");
  const [lostCompetitor, setLostCompetitor] = useState("");
  const [tab, setTab] = useState<TabKey>("focus");
  const [nextActionText, setNextActionText] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [nextActionTime, setNextActionTime] = useState("");
  const [priority, setPriority] = useState("P2");
  const [filters, setFilters] = useState<TimelineFilterId[]>(["all"]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // States for notes
  const [noteContent, setNoteContent] = useState("");

  const nextActionMissing = !nextActionText || !nextActionDate || !nextActionTime;

  const daysInStage = useMemo(() => {
    const lastContactDate = lead?.last_contact_date || lead?.lastContact;
    if (!lastContactDate) return 0;
    const contactDate = typeof lastContactDate === 'string' ? new Date(lastContactDate) : lastContactDate;
    const diff = Date.now() - contactDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [lead]);

  const timelineItems = useMemo(() => buildTimeline(filters, allLeadNotes, leadActivities), [filters, allLeadNotes, leadActivities]);

  const followersCount = 3;

  // ============================================================================
  // WRAPPER: Atualizar lead no Supabase E no Store local
  // ============================================================================
  const handleUpdateLead = async (leadId: string, updates: Partial<any>) => {
    try {
      // Atualizar no Supabase
      if (supabaseLead) {
        // Preparar updates para o Supabase (mapear campos corretamente)
        const supabaseUpdates: any = {};
        
        // Campos diretos que existem no schema
        if (updates.score !== undefined) supabaseUpdates.score = updates.score;
        if (updates.status) supabaseUpdates.status = updates.status;
        if (updates.notes) supabaseUpdates.notes = updates.notes;
        if (updates.tags) supabaseUpdates.tags = updates.tags;
        if (updates.name) supabaseUpdates.name = updates.name;
        if (updates.email) supabaseUpdates.email = updates.email;
        if (updates.phone) supabaseUpdates.phone = updates.phone;
        if (updates.whatsapp) supabaseUpdates.whatsapp = updates.whatsapp;
        if (updates.position) supabaseUpdates.position = updates.position;
        if (updates.source) supabaseUpdates.source = updates.source;
        if (updates.campaign) supabaseUpdates.campaign = updates.campaign;
        if (updates.medium) supabaseUpdates.medium = updates.medium;
        if (updates.estimated_value) supabaseUpdates.estimated_value = updates.estimated_value;
        if (updates.expected_close_date) supabaseUpdates.expected_close_date = updates.expected_close_date;
        if (updates.next_action_date) supabaseUpdates.next_action_date = updates.next_action_date;
        if (updates.last_contact_date) supabaseUpdates.last_contact_date = updates.last_contact_date;
        
        // ✅ MAPEAR campos do Store → Supabase
        if (updates.dealValue !== undefined) supabaseUpdates.estimated_value = updates.dealValue;
        if (updates.expectedCloseDate !== undefined) {
          supabaseUpdates.expected_close_date = updates.expectedCloseDate instanceof Date 
            ? updates.expectedCloseDate.toISOString().split('T')[0] 
            : updates.expectedCloseDate;
        }
        
        // Campos que vão para custom_fields (BANT, company, owner, website, etc)
        if (updates.bant || updates.wonDate || updates.lostDate || updates.lostReason || updates.lostCompetitor || 
            updates.company || updates.owner || updates.website || updates.companySize || updates.employeeCount) {
          const currentCustomFields = (supabaseLead as any).custom_fields || {};
          supabaseUpdates.custom_fields = {
            ...currentCustomFields,
            ...(updates.bant && { bant: updates.bant }),
            ...(updates.wonDate && { wonDate: updates.wonDate }),
            ...(updates.lostDate && { lostDate: updates.lostDate }),
            ...(updates.lostReason && { lostReason: updates.lostReason }),
            ...(updates.lostCompetitor && { lostCompetitor: updates.lostCompetitor }),
            ...(updates.company !== undefined && { company: updates.company }),
            ...(updates.owner !== undefined && { owner: updates.owner }),
            ...(updates.website !== undefined && { website: updates.website }),
            ...(updates.companySize !== undefined && { companySize: updates.companySize }),
            ...(updates.employeeCount !== undefined && { employeeCount: updates.employeeCount }),
          };
        }
        
        await updateSupabaseLead({
          id: leadId,
          updates: supabaseUpdates
        });
        console.log('[LeadDetailView] ✅ Lead atualizado no Supabase:', supabaseUpdates);
      }
      
      // Atualizar no Store local também
      updateLead(leadId, updates);
    } catch (error) {
      console.error('[LeadDetailView] ❌ Erro ao atualizar lead:', error);
      toast({
        title: "Erro ao atualizar lead",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = () => {
    if (!lead) return;
    
    const duplicatedLead: any = {
      ...lead,
      id: `lead-${Date.now()}`,
      name: `${lead.name} (Cópia)`,
      lastContact: new Date(),
      last_contact_date: new Date().toISOString(),
    };
    
    addLead(duplicatedLead);
    navigate(`/crm/${duplicatedLead.id}`);
  };

  const handleArchive = async () => {
    if (!lead) return;
    
    // Add archived tag and update status
    const archivedTags = lead.tags.includes('arquivado') 
      ? lead.tags 
      : [...lead.tags, 'arquivado'];
    
    await handleUpdateLead(lead.id, { tags: archivedTags });
    navigate('/crm');
  };

  const handleDelete = async () => {
    if (!lead) return;
    
    try {
      if (supabaseLead) {
        await deleteSupabaseLead(lead.id);
      }
      deleteLead(lead.id);
      navigate('/crm');
    } catch (error) {
      console.error('[LeadDetailView] ❌ Erro ao deletar lead:', error);
    }
  };

  const handleWon = async () => {
    if (!lead) return;
    
    await handleUpdateLead(lead.id, { 
      status: 'ganho', // ✅ ENUM CORRETO do Supabase
      wonDate: new Date()
    });
  };

  const handleLost = async () => {
    if (!lead) return;
    
    await handleUpdateLead(lead.id, { 
      status: 'perdido', // ✅ ENUM CORRETO do Supabase
      lostReason,
      lostCompetitor,
      lostDate: new Date()
    });
    
    setLostOpen(false);
  };

  const handleSaveNextAction = async () => {
    if (!lead || nextActionMissing) return;
    
    // Combine date and time into a Date object
    const dateTimeString = `${nextActionDate}T${nextActionTime}`;
    const nextActionDate_obj = new Date(dateTimeString);
    
    // ✅ SALVAR NO SUPABASE (next_action_date)
    await handleUpdateLead(lead.id, {
      nextAction: nextActionDate_obj,
      next_action_date: nextActionDate_obj.toISOString(),
    });
    
    // Adicionar ao histórico usando useSupabaseActivities
    try {
      await createActivity({
        lead_id: lead.id,
        type: "nextAction",
        title: `Próxima ação: ${nextActionText}`,
        description: `Agendado para ${format(nextActionDate_obj, "dd/MM/yyyy 'às' HH:mm")}`,
        activity_date: nextActionDate_obj.toISOString(),
      });
    } catch (error) {
      console.error('[LeadDetailView] Erro ao criar activity:', error);
    }
    
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

  const handleSaveNote = async () => {
    if (!noteContent.trim() || !lead) return;
    
    // ✅ SALVAR NOTA NO SUPABASE (notes field)
    const currentNotes = (lead as any).notes || '';
    const timestamp = format(new Date(), "dd/MM/yyyy HH:mm");
    const newNoteText = `[${timestamp}] ${noteContent}`;
    const updatedNotes = currentNotes ? `${currentNotes}\n\n${newNoteText}` : newNoteText;
    
    await handleUpdateLead(lead.id, {
      notes: updatedNotes,
    });
    
    // Adicionar também como activity para histórico
    try {
      await createActivity({
        lead_id: lead.id,
        type: "note",
        title: "Nota adicionada",
        description: noteContent,
      });
    } catch (error) {
      console.error('[LeadDetailView] Erro ao criar activity:', error);
    }
    
    setNoteContent("");
    
    toast({
      title: "Nota salva!",
      description: "A nota foi adicionada com sucesso",
    });
  };

  if (!lead) {
    return <div className="text-muted-foreground">Lead não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Botão Voltar para CRM */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2"
        onClick={() => navigate('/crm')}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para CRM
      </Button>
      
      {renderHeader({ lead, followersCount, daysInStage, setLostOpen, onWon: handleWon, onDuplicate: handleDuplicate, onArchive: handleArchive, onDeleteClick: () => setDeleteConfirmOpen(true) })}

      <div className="grid gap-4 xl:grid-cols-12">
        {renderProfileColumn(lead, handleUpdateLead)}

        {renderCentralColumn({
          lead,
          updateLead: handleUpdateLead,
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
          leadActivities,
          markAsCompleted,
          markAsPending,
          toast,
          onSaveNextAction: handleSaveNextAction,
          noteContent,
          setNoteContent,
          leadNotes: allLeadNotes,
          handleSaveNote,
        })}

        {renderSummaryColumn({ 
          lead, 
          nextActionMissing, 
          nextActionText, 
          nextActionDate, 
          nextActionTime,
          daysInStage,
          updateLead: handleUpdateLead,
          settings,
          activeSources,
          isLoadingLeadSources,
        })}
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
  // ✅ CORRIGIDO: Considerar os status do Supabase (novo, contatado, qualificado, proposta, negociacao, ganho, perdido)
  const status = (lead.status || 'open') as any;
  const isWon = status === 'won' || status === 'ganho';
  const isLost = status === 'lost' || status === 'perdido';
  const isActive = !isWon && !isLost; // Qualquer status que não seja ganho ou perdido é ativo
  
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
            {!isActive && (
              <Badge
                className={isWon ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}
              >
                {isWon ? "Ganho" : "Perdido"}
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
          <Button variant="secondary" size="sm" className="gap-2" onClick={onWon} disabled={!isActive}>
            <CheckCircle className="h-4 w-4" /> Ganho
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setLostOpen(true)} disabled={!isActive}>
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
          <CardTitle className="text-lg">Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Valor do negócio">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                R$
              </span>
              <Input 
                type="number" 
                defaultValue={lead.dealValue || (lead as any).estimated_value || 0} 
                placeholder="0,00"
                step="0.01"
                min={0}
                className="pl-10"
                onBlur={(e) => updateLead(lead.id, { dealValue: parseFloat(e.target.value) || 0 })} 
              />
            </div>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visão Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Idade do negócio</Label>
              <p className="text-sm font-semibold">
                {lead.createdAt 
                  ? `${Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias`
                  : '0 dias'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Média p/ ganhar</Label>
              <p className="text-sm font-semibold">
                30 dias
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Inativo (dias)</Label>
              <p className="text-sm font-semibold">
                {lead.lastContact 
                  ? Math.floor((Date.now() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24))
                  : 0} dias
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Criado em</Label>
              <p className="text-sm font-semibold">
                {lead.createdAt 
                  ? format(new Date(lead.createdAt), "dd/MM/yyyy", { locale: ptBR })
                  : format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-muted-foreground">Data de Fechamento Esperada</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={
                    lead.expectedCloseDate 
                      ? new Date(lead.expectedCloseDate).toISOString().slice(0,10) 
                      : ((lead as any).expected_close_date ? new Date((lead as any).expected_close_date).toISOString().slice(0,10) : '')
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const date = val ? new Date(`${val}T00:00:00`) : undefined;
                    updateLead(lead.id, { expectedCloseDate: date });
                  }}
                />
                {(lead.expectedCloseDate || (lead as any).expected_close_date) && (
                  <Badge variant="secondary" className="text-xs">
                    {format(
                      new Date(lead.expectedCloseDate || (lead as any).expected_close_date), 
                      "dd/MM/yyyy", 
                      { locale: ptBR }
                    )}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Esta data controla 100% a visão de previsão no CRM.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}

function renderCentralColumn(params: {
  lead: Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
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
  leadActivities: any[];
  markAsCompleted: (id: string) => Promise<any>;
  markAsPending: (id: string) => Promise<any>;
  toast: any;
  onSaveNextAction: () => void;
  noteContent: string;
  setNoteContent: (value: string) => void;
  leadNotes: Note[];
  handleSaveNote: () => void;
}) {
  const {
    lead,
    updateLead,
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
    leadActivities,
    markAsCompleted,
    markAsPending,
    toast,
    onSaveNextAction,
    noteContent,
    setNoteContent,
    leadNotes,
    handleSaveNote,
  } = params;

  return (
    <div className="space-y-4 xl:col-span-6">
      {/* Menu - Tabs: Foco e Histórico */}
      <Tabs value={tab} onValueChange={(value) => setTab(value as TabKey)} className="space-y-3">
        <TabsList className="w-full justify-start gap-1 rounded-xl border bg-muted/30 p-1">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {TAB_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ABA FOCO - Próxima Ação + Notas */}
        <TabsContent value="focus" className="space-y-4">
          {/* Próxima Ação */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Próxima Ação</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Agende e acompanhe o próximo passo com este lead
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-4">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={e => {
                  e.preventDefault();
                  if (!nextActionMissing) {
                    onSaveNextAction();
                  }
                }}
              >
                <div className="md:col-span-2">
                  <Field label="Tipo de ação">
                    <Select
                      value={nextActionText}
                      onValueChange={v => setNextActionText(v)}
                    >
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Escolha o tipo de ação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reunião">📅 Reunião</SelectItem>
                        <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                        <SelectItem value="E-mail">📧 E-mail</SelectItem>
                        <SelectItem value="Ligação">📞 Ligação</SelectItem>
                        <SelectItem value="Técnica">🔧 Técnica</SelectItem>
                        <SelectItem value="Follow-up">🔔 Follow-up</SelectItem>
                        <SelectItem value="Apresentação">🎯 Apresentação</SelectItem>
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
                      className="h-11"
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
                      className="h-11"
                    />
                  </Field>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label="Prioridade">
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="P1">🔴 P1 - Urgente</SelectItem>
                          <SelectItem value="P2">🟡 P2 - Importante</SelectItem>
                          <SelectItem value="P3">🟢 P3 - Normal</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={nextActionMissing}
                    className="w-full h-11 font-semibold"
                    size="lg"
                  >
                    {nextActionMissing ? "Preencha os campos" : "Salvar Próxima Ação"}
                  </Button>
                </div>
              </form>
              {nextActionMissing && (
                <div className="flex items-center gap-2 rounded-lg bg-warning/10 border border-warning/20 px-4 py-3 text-sm text-warning-foreground">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Preencha todos os campos acima para salvar a próxima ação</span>
                </div>
              )}
              {!nextActionMissing && (
                <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <span>
                    Próxima ação agendada: <strong>{nextActionText}</strong> em{" "}
                    {format(new Date(`${nextActionDate}T${nextActionTime}`), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notas</CardTitle>
              <p className="text-xs text-muted-foreground">
                Cole seu texto abaixo. A formatação será preservada automaticamente.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Escreva ou cole uma nota..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={6}
                  className="font-mono text-sm whitespace-pre-wrap"
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleSaveNote} disabled={!noteContent.trim()}>
                    Salvar Nota
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setNoteContent('')}
                    disabled={!noteContent.trim()}
                  >
                    Limpar
                  </Button>
                </div>
              </div>

              {/* List of notes */}
              <div className="space-y-3 pt-2">
                {leadNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma nota ainda. Adicione a primeira nota acima.
                  </p>
                ) : (
                  leadNotes
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .map((note) => (
                      <div key={note.id} className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {note.createdBy}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(note.createdAt, "dd/MM/yyyy 'às' HH:mm")}
                            </span>
                          </div>
                        </div>
                        <div 
                          className="text-sm whitespace-pre-wrap font-mono bg-muted/30 p-3 rounded-md"
                          style={{ 
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            lineHeight: '1.6'
                          }}
                        >
                          {note.content}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA HISTÓRICO - Timeline de Atividades */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Histórico de Atividades</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Acompanhe todas as interações e ações realizadas
                  </p>
                </div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {leadActivities.length} atividades
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TIMELINE_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all shadow-sm ${
                      isFilterActive(filters, filter.id)
                        ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent"
                    }`}
                    onClick={() => toggleFilter(filter.id, setFilters)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Nova Timeline com status visual */}
              <ActivityTimeline
                activities={leadActivities as any}
                onMarkComplete={async (id) => {
                  await markAsCompleted(id);
                  toast({
                    title: "✅ Atividade concluída!",
                    description: "A atividade foi marcada como concluída com sucesso",
                  });
                }}
                onMarkIncomplete={async (id) => {
                  await markAsPending(id);
                  toast({
                    title: "🔄 Atividade reaberta",
                    description: "A atividade foi marcada como pendente novamente",
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


function renderProductsColumn(
  lead: Lead,
  updateLead: (id: string, updates: Partial<Lead>) => void,
) {
  return (
    <div className="space-y-4 xl:col-span-6">
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
                  currency: 'BRL',
                  priceType: 'fixed',
                  discount: 0,
                  discountType: 'fixed',
                  taxRate: 0,
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
              {lead.products.map((product, index) => {
                // Calcular valores
                const basePrice = product.price || 0;
                const qty = product.quantity || 1;
                const subtotal = basePrice * qty;
                
                // Calcular desconto
                let discountAmount = 0;
                if (product.discountType === 'percentage') {
                  discountAmount = subtotal * ((product.discount || 0) / 100);
                } else {
                  discountAmount = product.discount || 0;
                }
                
                const afterDiscount = subtotal - discountAmount;
                
                // Calcular imposto
                const taxAmount = afterDiscount * ((product.taxRate || 0) / 100);
                const finalValue = afterDiscount + taxAmount;
                
                const currencySymbol = product.currency === 'USD' ? '$' : 'R$';
                
                return (
                  <div key={product.id} className="border rounded-lg p-4 bg-card space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Nome do produto/serviço"
                          defaultValue={product.name}
                          onBlur={(e) => {
                            const updatedProducts = [...(lead.products || [])];
                            updatedProducts[index] = { ...product, name: e.target.value };
                            updateLead(lead.id, { products: updatedProducts });
                          }}
                          className="h-9 font-medium"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updatedProducts = (lead.products || []).filter((_, i) => i !== index);
                          updateLead(lead.id, { products: updatedProducts });
                        }}
                        className="h-9 w-9 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                      {/* Preço */}
                      <div className="space-y-1.5 lg:col-span-2">
                        <Label className="text-xs">Preço</Label>
                        <div className="flex gap-2">
                          <Select
                            value={product.currency}
                            onValueChange={(value: 'BRL' | 'USD') => {
                              const updatedProducts = [...(lead.products || [])];
                              updatedProducts[index] = { ...product, currency: value };
                              updateLead(lead.id, { products: updatedProducts });
                            }}
                          >
                            <SelectTrigger className="w-[80px] h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BRL">R$</SelectItem>
                              <SelectItem value="USD">$</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            placeholder="0,00"
                            defaultValue={product.price}
                            step="0.01"
                            min={0}
                            onBlur={(e) => {
                              const updatedProducts = [...(lead.products || [])];
                              updatedProducts[index] = { ...product, price: parseFloat(e.target.value) || 0 };
                              updateLead(lead.id, { products: updatedProducts });
                            }}
                            className="h-9 flex-1"
                          />
                        </div>
                      </div>

                      {/* Quantidade */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Quantidade</Label>
                        <Input
                          type="number"
                          placeholder="1"
                          defaultValue={product.quantity}
                          min={1}
                          onBlur={(e) => {
                            const updatedProducts = [...(lead.products || [])];
                            updatedProducts[index] = { ...product, quantity: parseInt(e.target.value) || 1 };
                            updateLead(lead.id, { products: updatedProducts });
                          }}
                          className="h-9"
                        />
                      </div>

                      {/* Desconto */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Desconto</Label>
                        <div className="flex gap-2">
                          <Select
                            value={product.discountType}
                            onValueChange={(value: 'fixed' | 'percentage') => {
                              const updatedProducts = [...(lead.products || [])];
                              updatedProducts[index] = { ...product, discountType: value };
                              updateLead(lead.id, { products: updatedProducts });
                            }}
                          >
                            <SelectTrigger className="w-[70px] h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">{currencySymbol}</SelectItem>
                              <SelectItem value="percentage">%</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            placeholder="0"
                            defaultValue={product.discount}
                            step="0.01"
                            min={0}
                            onBlur={(e) => {
                              const updatedProducts = [...(lead.products || [])];
                              updatedProducts[index] = { ...product, discount: parseFloat(e.target.value) || 0 };
                              updateLead(lead.id, { products: updatedProducts });
                            }}
                            className="h-9 flex-1"
                          />
                        </div>
                      </div>

                      {/* Imposto */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Imposto (%)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          defaultValue={product.taxRate}
                          step="0.01"
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const updatedProducts = [...(lead.products || [])];
                            updatedProducts[index] = { ...product, taxRate: parseFloat(e.target.value) || 0 };
                            updateLead(lead.id, { products: updatedProducts });
                          }}
                          className="h-9"
                        />
                      </div>
                    </div>

                    {/* Cálculo detalhado */}
                    <div className="pt-2 border-t space-y-1 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal ({qty}x {currencySymbol} {basePrice.toFixed(2)}):</span>
                        <span>{currencySymbol} {subtotal.toFixed(2)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Desconto ({product.discountType === 'percentage' ? `${product.discount}%` : `${currencySymbol} ${product.discount}`}):</span>
                          <span className="text-destructive">- {currencySymbol} {discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {taxAmount > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Imposto ({product.taxRate}%):</span>
                          <span>+ {currencySymbol} {taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-sm pt-1 border-t">
                        <span>Valor Final:</span>
                        <span className="text-primary">{currencySymbol} {finalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total Geral:</span>
                  <span className="text-xl font-bold text-primary">
                    R$ {(lead.products || []).reduce((sum, p) => {
                      const basePrice = p.price || 0;
                      const qty = p.quantity || 1;
                      const subtotal = basePrice * qty;
                      
                      let discountAmount = 0;
                      if (p.discountType === 'percentage') {
                        discountAmount = subtotal * ((p.discount || 0) / 100);
                      } else {
                        discountAmount = p.discount || 0;
                      }
                      
                      const afterDiscount = subtotal - discountAmount;
                      const taxAmount = afterDiscount * ((p.taxRate || 0) / 100);
                      const finalValue = afterDiscount + taxAmount;
                      
                      return sum + finalValue;
                    }, 0).toFixed(2)}
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

function renderSummaryColumn({
  lead,
  nextActionMissing,
  nextActionText,
  nextActionDate,
  nextActionTime,
  daysInStage,
  updateLead,
  settings,
  activeSources,
  isLoadingLeadSources,
}: {
  lead: Lead;
  nextActionMissing: boolean;
  nextActionText: string;
  nextActionDate: string;
  nextActionTime: string;
  daysInStage: number;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  settings: Settings;
  activeSources: { id: string; name: string }[];
  isLoadingLeadSources: boolean;
}) {
  
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const calculateBANTScore = (bant: BANTMethodology) => {
    let score = 0;
    if (bant.budget) score += 25;
    if (bant.authority) score += 25;
    if (bant.need) score += 25;
    if (bant.timeline) score += 25;
    return score;
  };

  const handleBANTChange = async (field: keyof BANTMethodology, value: boolean) => {
    // Buscar BANT do custom_fields se existir, senão usar bant do lead local
    const customFieldsBant = (lead as any).custom_fields?.bant || {};
    const currentBant = lead.bant || customFieldsBant || {
      budget: false,
      authority: false,
      need: false,
      timeline: false,
    };
    
    const updatedBant = {
      ...currentBant,
      [field]: value,
      qualifiedAt: currentBant.qualifiedAt || new Date().toISOString(),
      qualifiedBy: currentBant.qualifiedBy || (lead as any).owner_id || (lead as any).owner || 'Sistema',
    };
    
    const newScore = calculateBANTScore(updatedBant);
    
    // Salvar usando a função updateLead passada por prop
    await updateLead(lead.id, {
      bant: updatedBant,
      score: newScore,
    });
  };

  // Buscar BANT do custom_fields ou do lead local
  const leadBant = (lead as any).custom_fields?.bant || lead.bant || {
    budget: false,
    authority: false,
    need: false,
    timeline: false,
  };

  return (
    <div className="space-y-4 xl:col-span-3">
      {/* BANT Qualification Card - SEMPRE EDITÁVEL */}
      <Card className={leadBant.budget || leadBant.authority || leadBant.need || leadBant.timeline 
        ? "border-2 border-primary/20" 
        : "border-2 border-dashed border-muted"}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className={leadBant.budget || leadBant.authority || leadBant.need || leadBant.timeline 
                  ? "h-5 w-5 text-success" 
                  : "h-5 w-5 text-muted-foreground"} />
                Qualificação BANT
              </CardTitle>
              <Badge variant="secondary" className={`${getScoreColor(lead.score)} font-bold`}>
                {lead.score || 0} pts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Budget */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('budget', !leadBant?.budget)}>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Budget</p>
                <p className="text-xs text-muted-foreground">Orçamento definido</p>
              </div>
              <Checkbox
                checked={leadBant.budget}
                onCheckedChange={(checked) => handleBANTChange('budget', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Authority */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('authority', !leadBant?.authority)}>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Authority</p>
                <p className="text-xs text-muted-foreground">Fala com decisor</p>
              </div>
              <Checkbox
                checked={leadBant.authority}
                onCheckedChange={(checked) => handleBANTChange('authority', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Need */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-warning/5 border border-warning/20 hover:bg-warning/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('need', !leadBant?.need)}>
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-warning-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Need</p>
                <p className="text-xs text-muted-foreground">Necessidade clara</p>
              </div>
              <Checkbox
                checked={leadBant.need}
                onCheckedChange={(checked) => handleBANTChange('need', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 transition-colors cursor-pointer"
                 onClick={() => handleBANTChange('timeline', !leadBant?.timeline)}>
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-success-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Timeline</p>
                <p className="text-xs text-muted-foreground">Prazo definido</p>
              </div>
              <Checkbox
                checked={leadBant.timeline}
                onCheckedChange={(checked) => handleBANTChange('timeline', checked as boolean)}
                className="h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Qualification Info */}
            {leadBant.qualifiedAt && (
              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium">Qualificado:</span>{' '}
                  {formatDistanceToNow(
                    typeof leadBant.qualifiedAt === 'string' 
                      ? new Date(leadBant.qualifiedAt) 
                      : leadBant.qualifiedAt, 
                    {
                      addSuffix: true,
                      locale: ptBR,
                    }
                  )}
                </p>
                {leadBant.qualifiedBy && (
                  <p>
                    <span className="font-medium">Por:</span> {leadBant.qualifiedBy}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <SummaryRow label="Owner" value={lead.owner} />
          <SummaryRow label="Empresa" value={lead.company} />
          <SummaryRow label="Etapa" value={STAGE_LABELS[lead.stage]} />
          <SummaryRow label="Probabilidade" value="70%" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fontes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Select 
            value={lead.source} 
            onValueChange={(value) => updateLead(lead.id, { source: value })}
            disabled={isLoadingLeadSources}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingLeadSources ? "Carregando..." : "Selecione a fonte"} />
            </SelectTrigger>
            <SelectContent>
              {activeSources.map((source) => (
                <SelectItem key={source.id} value={source.name}>
                  {source.name}
                </SelectItem>
              ))}
              {activeSources.length === 0 && !isLoadingLeadSources && (
                <div className="p-2 text-xs text-muted-foreground text-center">
                  Configure fontes em Configurações
                </div>
              )}
            </SelectContent>
          </Select>
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

function buildTimeline(filters: TimelineFilterId[], notes: Note[], activities: any[]): TimelineItem[] {
  // Construir itens do histórico a partir das notas e activities
  const noteItems: TimelineItem[] = notes.map((note) => ({
    id: note.id,
    type: "note" as const,
    typeLabel: "Nota",
    content: note.content,
    date: note.createdAt,
  }));
  
  const activityItems: TimelineItem[] = activities.map((activity) => {
    const typeLabels: Record<string, string> = {
      note: "Nota",
      call: "Chamada",
      email: "E-mail",
      wa: "WhatsApp",
      whatsapp: "WhatsApp",
      file: "Arquivo",
      task: "Tarefa",
      nextAction: "Próxima Ação",
      meeting: "Reunião",
      status_change: "Mudança de Status",
    };
    
    // ✅ COMPATIBILIDADE: Supabase activities vs Store local
    const activityType = activity.type || 'note';
    const activityContent = activity.description || activity.title || activity.content || 'Sem descrição';
    const activityDate = activity.created_at 
      ? new Date(activity.created_at) 
      : (activity.activity_date ? new Date(activity.activity_date) : (activity.createdAt || new Date()));
    
    return {
      id: activity.id,
      type: activityType as Exclude<TimelineFilterId, "all">,
      typeLabel: typeLabels[activityType] || activityType,
      content: activityContent,
      date: activityDate,
    };
  });
  
  const items = [...noteItems, ...activityItems];

  const activeFilters = filters.includes("all") ? ["note", "call", "email", "wa", "whatsapp", "file", "task", "nextAction", "meeting", "status_change"] : filters;
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
