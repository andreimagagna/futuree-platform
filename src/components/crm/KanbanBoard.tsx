import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore, type Lead, type Funnel, type FunnelStage, type BANTMethodology } from "@/store/useStore";
import { useSupabaseLeads } from "@/hooks/useSupabaseLeads";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useSyncCRMFunnelsToStore, useCreateCRMFunnel, useUpdateCRMFunnel, useDeleteCRMFunnel, useCreateCRMStage, useUpdateCRMStage, useDeleteCRMStage } from "@/hooks/useCRMFunnels";
import { useSyncCRMTagsToStore, useCreateCRMTag, useUpdateCRMTag, useDeleteCRMTag, useTagsMap } from "@/hooks/useCRMTags";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { 
  Plus, 
  Settings, 
  GripVertical, 
  Trash2, 
  Edit2, 
  X, 
  Tags, 
  Filter,
  DollarSign,
  Users,
  Target,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CalendarIcon,
  MoveRight,
  MoreVertical,
  Archive,
} from "lucide-react";

export const KanbanBoard = () => {
  // ============================================================================
  // HOOKS - Supabase para persistência no banco de dados
  // ============================================================================
  const { user } = useAuth();
  
  // Buscar perfil do usuário para pegar o nome
  const { data: userProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('nome, full_name')
        .eq('id', user.id)
        .single();
      return data as { nome: string | null; full_name: string | null } | null;
    },
    enabled: !!user?.id,
  });

  // Nome do usuário logado (para usar como owner)
  const userName = userProfile?.nome || userProfile?.full_name || user?.email?.split('@')[0] || 'Sistema';
  
  const { 
    leads: supabaseLeads, 
    createLead: createSupabaseLead,
    updateLead: updateSupabaseLead,
    deleteLead: deleteSupabaseLead,
    isLoading: isLoadingLeads,
  } = useSupabaseLeads({
    // ✅ SEM FILTRO owner_id para permitir leads do n8n
  });

  // ============================================================================
  // HOOKS - Sincronização de Funis e Tags com Banco de Dados
  // ============================================================================
  useSyncCRMFunnelsToStore(); // Sincroniza funis do Supabase para Zustand
  useSyncCRMTagsToStore(); // Sincroniza tags do Supabase para Zustand
  const tagsMap = useTagsMap(); // Mapa de nome → ID das tags

  // Mutations para funis
  const createFunnelMutation = useCreateCRMFunnel();
  const updateFunnelMutation = useUpdateCRMFunnel();
  const deleteFunnelMutation = useDeleteCRMFunnel();
  
  // Mutations para estágios
  const createStageMutation = useCreateCRMStage();
  const updateStageMutation = useUpdateCRMStage();
  const deleteStageMutation = useDeleteCRMStage();
  
  // Mutations para tags
  const createTagMutation = useCreateCRMTag();
  const updateTagMutation = useUpdateCRMTag();
  const deleteTagMutation = useDeleteCRMTag();

  // ============================================================================
  // HOOKS - Store local para configurações (funnels, tags, etc)
  // ============================================================================
  const { 
    leads, 
    funnels, 
    activeFunnelId, 
    setActiveFunnel, 
    updateLead,
    addLead,
    setLeads, // ← Função para substituir TODOS os leads de uma vez
    addFunnel,
    updateFunnel,
    deleteFunnel,
    addStageToFunnel,
    removeStageFromFunnel,
    updateStageInFunnel,
    availableTags,
    addTag,
    updateTag,
    deleteTag,
  } = useStore();
  
  const [search, setSearch] = useState('');
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createLeadOpen, setCreateLeadOpen] = useState(false);
  const [bantQualificationOpen, setBantQualificationOpen] = useState(false);
  const [newFunnelName, setNewFunnelName] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#3B82F6');
  const [editingFunnel, setEditingFunnel] = useState<string | null>(null);
  const [editingFunnelName, setEditingFunnelName] = useState('');
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editingStageName, setEditingStageName] = useState('');
  const [editingStageColor, setEditingStageColor] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'funnel' | 'stage' | 'tag', id: string, funnelId?: string } | null>(null);
  const [editingLeadTags, setEditingLeadTags] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  
  // Tag management states
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  
  // Move lead between funnels state
  const [moveLeadDialogOpen, setMoveLeadDialogOpen] = useState(false);
  const [leadToMove, setLeadToMove] = useState<Lead | null>(null);
  const [targetFunnelId, setTargetFunnelId] = useState<string>('');
  
  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website',
    owner: '', // Será preenchido pelo useEffect abaixo
    notes: '',
    dealValue: '',
    expectedCloseDate: null as Date | null,
  });

  // Atualizar owner do formulário quando userName estiver disponível
  useEffect(() => {
    if (userName && !newLeadForm.owner) {
      setNewLeadForm(prev => ({ ...prev, owner: userName }));
    }
  }, [userName]);
  
  // BANT Qualification State
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);
  const [bantScore, setBantScore] = useState({
    budget: false,      // Tem orçamento definido?
    authority: false,   // Fala com decisor?
    need: false,        // Tem necessidade clara?
    timeline: false,    // Tem prazo definido?
  });
  
  // Filters
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [scoreFilter, setScoreFilter] = useState<{ min?: number; max?: number }>({});
  const [dealValueFilter, setDealValueFilter] = useState<{ min?: number; max?: number }>({});
  
  // Collapsible states for filter sections
  const [tagsOpen, setTagsOpen] = useState(true);
  const [sourceOpen, setSourceOpen] = useState(true);
  const [ownerOpen, setOwnerOpen] = useState(true);
  const [scoreOpen, setScoreOpen] = useState(true);
  const [dealValueOpen, setDealValueOpen] = useState(true);
  
  // Sort state
  type SortOption = 'none' | 'date-asc' | 'date-desc' | 'value-asc' | 'value-desc' | 'score-asc' | 'score-desc';
  const [sortBy, setSortBy] = useState<SortOption>('none');
  
  const navigate = useNavigate();

  // ============================================================================
  // SINCRONIZAÇÃO: Supabase → Store Local
  // Carrega leads do Supabase e sincroniza com store local (Zustand)
  // ============================================================================
  useEffect(() => {
    if (supabaseLeads !== undefined && !isLoadingLeads) {
      console.log('[KanbanBoard] 🔄 Sincronizando leads do Supabase:', supabaseLeads?.length || 0);
      
      // Converter leads do Supabase para formato do Store Local
      const leadsForStore: Lead[] = (supabaseLeads || []).map((supabaseLead) => {
        let customFields = (supabaseLead.custom_fields as any) || {};
        
        // 🔍 Verificar funnel_id em AMBOS os locais (custom_fields E campo direto)
        const funnelIdFromCustomFields = customFields.funnel_id;
        const funnelIdFromRoot = (supabaseLead as any).funnel_id;
        let finalFunnelId = funnelIdFromCustomFields || funnelIdFromRoot;
        
        console.log('[KanbanBoard] 🔍 Debug lead:', supabaseLead.name, {
          custom_fields: customFields,
          funnel_id_root: funnelIdFromRoot,
          funnel_id_custom: funnelIdFromCustomFields,
          final: finalFunnelId,
          stage_id: customFields.stage_id,
          notes: supabaseLead.notes,  // 📝 Verificar se notes está vindo do DB
          activeFunnelId: activeFunnelId
        });
        
        // ✅ Detectar leads sem funnel_id e atribuir automaticamente ao funil ativo
        if (!finalFunnelId) {
          console.warn('[KanbanBoard] ⚠️ Lead sem funnel_id:', supabaseLead.name, '→ Atribuindo ao funil:', activeFunnelId);
          
          // Atualizar customFields localmente
          customFields = {
            ...customFields,
            funnel_id: activeFunnelId,
            stage_id: activeFunnel.stages[0]?.id || 'captured',
            stage_name: activeFunnel.stages[0]?.name || 'Capturado',
          };
          finalFunnelId = activeFunnelId;
          
          // Atualizar no Supabase de forma assíncrona
          updateSupabaseLead({
            id: supabaseLead.id,
            updates: {
              custom_fields: customFields
            }
          }).catch(err => console.error('[KanbanBoard] ❌ Erro ao atualizar funnel_id:', err));
        } else {
          console.log('[KanbanBoard] ✅ Lead com funnel_id:', supabaseLead.name, '→', finalFunnelId);
          
          // ✅ Se tem funnel_id mas NÃO tem stage_id, atribuir primeiro estágio
          if (!customFields.stage_id) {
            console.warn('[KanbanBoard] ⚠️ Lead sem stage_id:', supabaseLead.name, '→ Buscando funil:', finalFunnelId);
            
            // Buscar o funil correspondente
            const leadFunnel = funnels.find(f => f.id === finalFunnelId);
            if (leadFunnel && leadFunnel.stages && leadFunnel.stages.length > 0) {
              const firstStage = leadFunnel.stages[0];
              console.log('[KanbanBoard] ✅ Atribuindo stage:', firstStage.name, '→', firstStage.id);
              
              // Atualizar customFields localmente
              customFields = {
                ...customFields,
                stage_id: firstStage.id,
                stage_name: firstStage.name,
              };
              
              // Atualizar no Supabase de forma assíncrona
              updateSupabaseLead({
                id: supabaseLead.id,
                updates: {
                  custom_fields: customFields
                }
              }).catch(err => console.error('[KanbanBoard] ❌ Erro ao atualizar stage_id:', err));
            }
          }
        }
        
        return {
          id: supabaseLead.id,
          name: supabaseLead.name || 'Lead sem nome',
          company: customFields.company || 'Empresa não informada',
          email: supabaseLead.email || '',
          whatsapp: supabaseLead.whatsapp || supabaseLead.phone || '',
          source: supabaseLead.source || 'Website',
          owner: customFields.owner || 'Sem responsável',
          stage: customFields.stage_id || 'captured',
          customStageId: customFields.stage_id,
          funnelId: finalFunnelId,
          score: supabaseLead.score || 0,
          status: supabaseLead.status as any,
          tags: supabaseLead.tags || [],
          lastContact: supabaseLead.last_contact_date ? new Date(supabaseLead.last_contact_date) : new Date(),
          notes: supabaseLead.notes || '',
          dealValue: supabaseLead.estimated_value ? Number(supabaseLead.estimated_value) : undefined,
          expectedCloseDate: supabaseLead.expected_close_date ? new Date(supabaseLead.expected_close_date) : undefined,
        };
      });
      
      // Atualizar store local com leads do Supabase
      // ✅ SUBSTITUIR todos os leads de uma vez (mais eficiente)
      console.log('[KanbanBoard] ✅ Carregando', leadsForStore.length, 'leads no Kanban');
      setLeads(leadsForStore);
    }
  }, [supabaseLeads, isLoadingLeads, setLeads]);

  const activeFunnel = funnels.find((f) => f.id === activeFunnelId) || funnels[0];
  
  // Get all unique values for filters
  const allTags = Array.from(new Set(leads.flatMap(l => l.tags)));
  const allSources = Array.from(new Set(leads.map(l => l.source)));
  const allOwners = Array.from(new Set(leads.map(l => l.owner)));
  
  // Sort function
  const sortLeads = (leadsToSort: Lead[]): Lead[] => {
    const sorted = [...leadsToSort];
    
    switch (sortBy) {
      case 'date-asc':
        return sorted.sort((a, b) => 
          (a.lastContact?.getTime() || 0) - (b.lastContact?.getTime() || 0)
        );
      case 'date-desc':
        return sorted.sort((a, b) => 
          (b.lastContact?.getTime() || 0) - (a.lastContact?.getTime() || 0)
        );
      case 'value-asc':
        return sorted.sort((a, b) => 
          (a.dealValue || 0) - (b.dealValue || 0)
        );
      case 'value-desc':
        return sorted.sort((a, b) => 
          (b.dealValue || 0) - (a.dealValue || 0)
        );
      case 'score-asc':
        return sorted.sort((a, b) => a.score - b.score);
      case 'score-desc':
        return sorted.sort((a, b) => b.score - a.score);
      default:
        return sorted;
    }
  };
  
  const filteredLeads = leads.filter((lead) => {
    // Exclude archived leads from Kanban view
    if ((lead.status as any) === 'arquivado' || lead.status === 'archived') return false;
    
    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());
    
    // Show leads in active funnel or those without a funnel (default stage-based)
    const matchesFunnel = !lead.funnelId || lead.funnelId === activeFunnelId;
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => lead.tags.includes(tag));
    
    // Source filter
    const matchesSource = selectedSources.length === 0 || 
      selectedSources.includes(lead.source);
    
    // Owner filter
    const matchesOwner = selectedOwners.length === 0 || 
      selectedOwners.includes(lead.owner);
    
    // Score filter
    const matchesScore = 
      (scoreFilter.min === undefined || lead.score >= scoreFilter.min) &&
      (scoreFilter.max === undefined || lead.score <= scoreFilter.max);
    
    // Deal value filter
    const leadDealValue = lead.dealValue || 0;
    const matchesDealValue = 
      (dealValueFilter.min === undefined || leadDealValue >= dealValueFilter.min) &&
      (dealValueFilter.max === undefined || leadDealValue <= dealValueFilter.max);
    
    return matchesSearch && matchesFunnel && matchesTags && matchesSource && matchesOwner && matchesScore && matchesDealValue;
  });

  const activeFiltersCount = 
    selectedTags.length + 
    selectedSources.length + 
    selectedOwners.length + 
    (scoreFilter.min !== undefined || scoreFilter.max !== undefined ? 1 : 0) +
    (dealValueFilter.min !== undefined || dealValueFilter.max !== undefined ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedSources([]);
    setSelectedOwners([]);
    setScoreFilter({});
    setDealValueFilter({});
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: string) => {
    if (!draggedLead) return;
    
    try {
      console.log('[KanbanBoard] 🔄 Movendo lead:', draggedLead.name, draggedLead.id);
      
      // ✅ BUSCAR lead atual do Supabase para garantir custom_fields completos
      const currentLead = supabaseLeads?.find(l => l.id === draggedLead.id);
      if (!currentLead) {
        console.error('[KanbanBoard] ❌ Lead não encontrado no Supabase:', draggedLead.id);
        return;
      }
      
      const currentCustomFields = (currentLead.custom_fields as any) || {};
      console.log('[KanbanBoard] 📦 custom_fields atuais do Supabase:', currentCustomFields);
      console.log('[KanbanBoard] 🎯 Novo stage:', stageId);
      
      const updates = {
        custom_fields: {
          ...currentCustomFields, // ✅ Preserva TODOS os campos do Supabase
          stage_id: stageId,
          stage_name: activeFunnel.stages.find(s => s.id === stageId)?.name || stageId,
          funnel_id: activeFunnelId,
        }
      };
      
      console.log('[KanbanBoard] 📝 Updates a serem enviados:', updates);
      
      const result = await updateSupabaseLead({
        id: draggedLead.id,
        updates
      });
      
      console.log('[KanbanBoard] ✅ Lead movido para stage:', stageId, 'Resultado:', result);
    } catch (error) {
      console.error('[KanbanBoard] ❌ Erro ao mover lead:', error);
    }
    
    // Update lead stage no Store local
    if (activeFunnel.isDefault) {
      updateLead(draggedLead.id, { stage: stageId as any });
    } else {
      updateLead(draggedLead.id, { 
        customStageId: stageId,
        funnelId: activeFunnelId,
      });
    }
    
    setDraggedLead(null);
  };

  const getLeadsForStage = (stageId: string) => {
    let stageLeads: Lead[];
    
    // Identificar o primeiro estágio visualmente (menor ordem)
    // Para exibir leads "órfãos" (sem stage definido) na primeira coluna
    const sortedStages = [...activeFunnel.stages].sort((a, b) => a.order - b.order);
    const firstStageId = sortedStages.length > 0 ? sortedStages[0].id : null;
    const isFirstStage = firstStageId === stageId;

    if (activeFunnel.isDefault) {
      stageLeads = filteredLeads.filter((l) => {
        if (l.stage === stageId) return true;
        // Fallback para leads sem stage no funil padrão
        if (isFirstStage && !l.stage) return true;
        return false;
      });
    } else {
      stageLeads = filteredLeads.filter((l) => {
        if (l.customStageId === stageId) return true;
        // Fallback: se é o primeiro estágio e o lead está neste funil mas sem customStageId
        if (isFirstStage && !l.customStageId) return true;
        return false;
      });
    }
    
    // Apply sorting
    return sortLeads(stageLeads);
  };

  const handleCreateFunnel = async () => {
    if (!newFunnelName.trim()) return;
    
    try {
      // Criar funil no banco de dados
      await createFunnelMutation.mutateAsync({
        name: newFunnelName,
        is_default: false,
      });
      
      setNewFunnelName('');
      console.log('✅ Funil criado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar funil:', error);
    }
  };

  const handleAddStage = async () => {
    if (!newStageName.trim()) return;
    
    try {
      // Criar estágio no banco de dados
      await createStageMutation.mutateAsync({
        funnel_id: activeFunnelId,
        name: newStageName,
        color: newStageColor,
        order_index: activeFunnel.stages.length,
      });
      
      setNewStageName('');
      setNewStageColor('#3B82F6');
      console.log('✅ Estágio criado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar estágio:', error);
    }
  };

  const handleEditFunnel = (funnelId: string) => {
    const funnel = funnels.find(f => f.id === funnelId);
    if (!funnel) return;
    setEditingFunnel(funnelId);
    setEditingFunnelName(funnel.name);
  };

  const handleSaveFunnelEdit = async () => {
    if (!editingFunnel || !editingFunnelName.trim()) return;
    
    try {
      await updateFunnelMutation.mutateAsync({
        id: editingFunnel,
        updates: { name: editingFunnelName },
      });
      
      setEditingFunnel(null);
      setEditingFunnelName('');
      console.log('✅ Funil atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar funil:', error);
    }
  };

  const handleEditStage = (stageId: string) => {
    const stage = activeFunnel.stages.find(s => s.id === stageId);
    if (!stage) return;
    setEditingStage(stageId);
    setEditingStageName(stage.name);
    setEditingStageColor(stage.color);
  };

  const handleSaveStageEdit = async () => {
    if (!editingStage || !editingStageName.trim()) return;
    
    try {
      await updateStageMutation.mutateAsync({
        id: editingStage,
        updates: {
          name: editingStageName,
          color: editingStageColor,
        },
      });
      
      setEditingStage(null);
      setEditingStageName('');
      setEditingStageColor('');
      console.log('✅ Estágio atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar estágio:', error);
    }
  };

  const handleDeleteClick = (type: 'funnel' | 'stage' | 'tag', id: string, funnelId?: string) => {
    setDeleteTarget({ type, id, funnelId });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      if (deleteTarget.type === 'funnel') {
        // Deleta funil do Supabase (funis mockados são removidos automaticamente pela sincronização)
        await deleteFunnelMutation.mutateAsync(deleteTarget.id);
        console.log('✅ Funil deletado com sucesso');
      } else if (deleteTarget.type === 'stage' && deleteTarget.funnelId) {
        await deleteStageMutation.mutateAsync(deleteTarget.id);
        console.log('✅ Estágio deletado com sucesso');
      } else if (deleteTarget.type === 'tag') {
        await deleteTagMutation.mutateAsync(deleteTarget.id);
        console.log('✅ Tag deletada com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro ao deletar:', error);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  // Tag management functions
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      await createTagMutation.mutateAsync({
        name: newTagName.trim(),
      });
      
      setNewTagName('');
      console.log('✅ Tag criada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar tag:', error);
    }
  };

  const handleEditTag = (tag: string) => {
    setEditingTag(tag);
    setEditingTagName(tag);
  };

  const handleSaveTagEdit = async () => {
    if (!editingTag || !editingTagName.trim()) return;
    if (editingTag === editingTagName.trim()) {
      // Sem mudanças
      setEditingTag(null);
      setEditingTagName('');
      return;
    }
    
    try {
      const tagId = tagsMap.get(editingTag);
      if (!tagId) {
        console.error('❌ Tag ID não encontrado para:', editingTag);
        return;
      }
      
      await updateTagMutation.mutateAsync({
        id: tagId,
        updates: { name: editingTagName.trim() },
      });
      
      setEditingTag(null);
      setEditingTagName('');
      console.log('✅ Tag atualizada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar tag:', error);
    }
  };

  const handleAddTag = (leadId: string) => {
    if (!newTag.trim()) return;
    
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const updatedTags = [...lead.tags, newTag.trim()];
    updateLead(leadId, { tags: updatedTags });
    setNewTag('');
  };

  const handleRemoveTag = (leadId: string, tagToRemove: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const updatedTags = lead.tags.filter(tag => tag !== tagToRemove);
    updateLead(leadId, { tags: updatedTags });
  };

  const handleOpenMoveLead = (lead: Lead) => {
    setLeadToMove(lead);
    setTargetFunnelId(lead.funnelId || 'default');
    setMoveLeadDialogOpen(true);
  };

  const handleMoveLead = async () => {
    if (!leadToMove || !targetFunnelId) return;
    
    try {
      const targetFunnel = funnels.find(f => f.id === targetFunnelId);
      if (!targetFunnel) return;
      
      const firstStageId = targetFunnel.stages[0]?.id;
      
      // Pegar custom_fields existentes do lead do Supabase
      const leadFromSupabase = supabaseLeads?.find(l => l.id === leadToMove.id);
      const existingCustomFields = (leadFromSupabase?.custom_fields as any) || {};
      
      // Atualizar lead no Supabase
      await updateSupabaseLead({
        id: leadToMove.id,
        updates: {
          custom_fields: {
            ...existingCustomFields,
            funnel_id: targetFunnelId,
            stage_id: firstStageId,
            stage_name: targetFunnel.stages[0]?.name || 'Capturado',
          },
        } as any,
      });
      
      console.log(`✅ Lead "${leadToMove.name}" movido para funil "${targetFunnel.name}"`);
      
      // Fechar dialog
      setMoveLeadDialogOpen(false);
      setLeadToMove(null);
      setTargetFunnelId('');
      
      // Se o lead foi movido para outro funil, mudar para esse funil
      if (targetFunnelId !== activeFunnelId) {
        setActiveFunnel(targetFunnelId);
      }
    } catch (error) {
      console.error('❌ Erro ao mover lead:', error);
    }
  };

  const handleCreateLead = async () => {
    if (!newLeadForm.name.trim() || !newLeadForm.company.trim()) return;
    
    const firstStageId = activeFunnel.stages[0]?.id;
    
    try {
      // ============================================================================
      // CRIAR LEAD NO SUPABASE - USANDO SCHEMA CORRETO
      // Schema real: name, email, phone, status, funnel_stage, etc.
      // ============================================================================
      const newLeadData: any = {
        // ✅ Campos que EXISTEM no schema
        name: newLeadForm.name, // ← Coluna correta: 'name' (não 'nome')
        email: newLeadForm.email || null,
        phone: newLeadForm.phone || null,
        whatsapp: newLeadForm.phone || null, // ← Mesmo telefone
        source: newLeadForm.source || null,
        status: 'novo', // ← USER-DEFINED type 'lead_status'
        owner_id: user?.id || null, // ✅ ID do usuário logado como responsável
        score: 0,
        tags: [],
        contact_count: 0,
        notes: newLeadForm.notes || null,
        estimated_value: newLeadForm.dealValue ? parseFloat(newLeadForm.dealValue) : null,
        expected_close_date: newLeadForm.expectedCloseDate || null,
        last_contact_date: new Date().toISOString(),
        
        // ✅ custom_fields para dados personalizados (funil, etapas, etc)
        custom_fields: {
          company: newLeadForm.company, // ← Não tem coluna 'company', salvar aqui
          owner: newLeadForm.owner, // ← Nome do responsável (para exibição)
          owner_id: user?.id || null, // ← ID do responsável (referência ao user)
          funnel_id: activeFunnelId, // ✅ SEMPRE salvar o funil ativo (inclusive 'default')
          stage_id: firstStageId,
          stage_name: activeFunnel.stages[0]?.name || 'Capturado',
          // Salvar também a etapa que QUERÍAMOS usar
          intended_funnel_stage: 'captured', // ← Para referência futura
        },
      };

      console.log('[KanbanBoard] 🚀 Criando lead no funil:', activeFunnelId, 'Dados:', newLeadData);
      console.log('[KanbanBoard] � custom_fields a serem salvos:', newLeadData.custom_fields);

      const createdLead = await createSupabaseLead(newLeadData);
      
      console.log('[KanbanBoard] ✅ Lead criado no Supabase:', createdLead);
      console.log('[KanbanBoard] 🔍 custom_fields recebidos:', (createdLead as any)?.custom_fields);
      
      // ✅ NÃO precisa adicionar manualmente - o useEffect vai sincronizar automaticamente
      // O React Query invalidará a query e o useEffect detectará a mudança em supabaseLeads
      
      // Reset form
      setNewLeadForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        source: 'Website',
        owner: 'Vendedor',
        notes: '',
        dealValue: '',
        expectedCloseDate: null,
      });
      
      // Salvar ID do lead criado e abrir qualificação BANT
      setCreatedLeadId(createdLead.id);
      setCreateLeadOpen(false);
      setBantQualificationOpen(true);
      
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      // O toast de erro já é exibido pelo hook useSupabaseLeads
    }
  };

  const calculateBANTScore = () => {
    const { budget, authority, need, timeline } = bantScore;
    let score = 0;
    
    // Cada critério BANT vale 25 pontos
    if (budget) score += 25;
    if (authority) score += 25;
    if (need) score += 25;
    if (timeline) score += 25;
    
    return score;
  };

  const handleBANTSubmit = async () => {
    if (!createdLeadId) return;
    
    const score = calculateBANTScore();
    
    // 🔥 BUSCAR custom_fields do SUPABASE, não do Zustand
    const leadFromSupabase = supabaseLeads?.find(l => l.id === createdLeadId);
    const existingCustomFields = (leadFromSupabase?.custom_fields as any) || {};
    
    console.log('[KanbanBoard] 📋 custom_fields antes do BANT:', existingCustomFields);
    
    // ✅ SALVAR NO SUPABASE (campo score + custom_fields com BANT)
    try {
      await updateSupabaseLead({
        id: createdLeadId,
        updates: {
          score,
          custom_fields: {
            ...existingCustomFields, // ✅ Preserva funnel_id, stage_id, etc.
            bant: {
              budget: bantScore.budget,
              authority: bantScore.authority,
              need: bantScore.need,
              timeline: bantScore.timeline,
              qualifiedAt: new Date().toISOString(),
              qualifiedBy: user?.email || existingCustomFields.owner || 'Sistema',
            }
          }
        }
      });
      
      console.log('[KanbanBoard] ✅ BANT salvo no Supabase com score:', score);
    } catch (error) {
      console.error('[KanbanBoard] ❌ Erro ao salvar BANT:', error);
    }
    
    // Também atualizar no Zustand Store (sincronização local)
    updateLead(createdLeadId, { 
      score,
      bant: {
        budget: bantScore.budget,
        authority: bantScore.authority,
        need: bantScore.need,
        timeline: bantScore.timeline,
        qualifiedAt: new Date(),
        qualifiedBy: existingCustomFields.owner || 'Sistema',
      }
    });
    
    // Reset BANT state
    setBantScore({
      budget: false,
      authority: false,
      need: false,
      timeline: false,
    });
    setCreatedLeadId(null);
    setBantQualificationOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Select value={activeFunnelId} onValueChange={setActiveFunnel}>
            <SelectTrigger className="w-[280px] border-dashed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {funnels.map((funnel) => {
                // Contar leads neste funil
                const leadsCount = leads.filter(lead => 
                  (!lead.funnelId ? funnel.id === 'default' : lead.funnelId === funnel.id) &&
                  (lead.status as any) !== 'arquivado' && lead.status !== 'archived'
                ).length;
                
                return (
                  <SelectItem key={funnel.id} value={funnel.id}>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>{funnel.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {leadsCount} lead{leadsCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          
          {/* Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <div className="p-2 space-y-4 max-h-[500px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Clear filters */}
                {activeFiltersCount > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Filtros Ativos</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-8 text-xs"
                      >
                        Limpar Tudo
                      </Button>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Tags Filter - Collapsible */}
                <Collapsible open={tagsOpen} onOpenChange={setTagsOpen}>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between px-0 py-1 hover:bg-transparent">
                        <DropdownMenuLabel className="px-0 py-0 cursor-pointer">Tags</DropdownMenuLabel>
                        <ChevronDown className={`h-4 w-4 transition-transform ${tagsOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2 pt-2">
                    {allTags.length > 0 ? (
                      allTags.map((tag) => (
                        <DropdownMenuCheckboxItem
                          key={tag}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => {
                            setSelectedTags(
                              checked
                                ? [...selectedTags, tag]
                                : selectedTags.filter((t) => t !== tag)
                            );
                          }}
                        >
                          {tag}
                        </DropdownMenuCheckboxItem>
                      ))
                    ) : (
                      <p className="px-2 py-1 text-xs text-muted-foreground">Nenhuma tag disponível</p>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Source Filter - Collapsible */}
                <Collapsible open={sourceOpen} onOpenChange={setSourceOpen}>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between px-0 py-1 hover:bg-transparent">
                        <DropdownMenuLabel className="px-0 py-0 cursor-pointer">Fonte</DropdownMenuLabel>
                        <ChevronDown className={`h-4 w-4 transition-transform ${sourceOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2 pt-2">
                    {allSources.map((source) => (
                      <DropdownMenuCheckboxItem
                        key={source}
                        checked={selectedSources.includes(source)}
                        onCheckedChange={(checked) => {
                          setSelectedSources(
                            checked
                              ? [...selectedSources, source]
                              : selectedSources.filter((s) => s !== source)
                          );
                        }}
                      >
                        {source}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Owner Filter - Collapsible */}
                <Collapsible open={ownerOpen} onOpenChange={setOwnerOpen}>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between px-0 py-1 hover:bg-transparent">
                        <DropdownMenuLabel className="px-0 py-0 cursor-pointer">Responsável</DropdownMenuLabel>
                        <ChevronDown className={`h-4 w-4 transition-transform ${ownerOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2 pt-2">
                    {allOwners.map((owner) => (
                      <DropdownMenuCheckboxItem
                        key={owner}
                        checked={selectedOwners.includes(owner)}
                        onCheckedChange={(checked) => {
                          setSelectedOwners(
                            checked
                              ? [...selectedOwners, owner]
                              : selectedOwners.filter((o) => o !== owner)
                          );
                        }}
                      >
                        {owner}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Score Filter - Collapsible */}
                <Collapsible open={scoreOpen} onOpenChange={setScoreOpen}>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between px-0 py-1 hover:bg-transparent">
                        <DropdownMenuLabel className="px-0 py-0 cursor-pointer">Score</DropdownMenuLabel>
                        <ChevronDown className={`h-4 w-4 transition-transform ${scoreOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-2 gap-2 px-2">
                      <div className="space-y-1">
                        <Label htmlFor="min-score" className="text-xs">Mínimo</Label>
                        <Input
                          id="min-score"
                          type="number"
                          placeholder="0"
                          min={0}
                          max={100}
                          value={scoreFilter.min ?? ''}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value) : undefined;
                            setScoreFilter({ ...scoreFilter, min: val });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="max-score" className="text-xs">Máximo</Label>
                        <Input
                          id="max-score"
                          type="number"
                          placeholder="100"
                          min={0}
                          max={100}
                          value={scoreFilter.max ?? ''}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value) : undefined;
                            setScoreFilter({ ...scoreFilter, max: val });
                          }}
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Deal Value Filter - Collapsible */}
                <Collapsible open={dealValueOpen} onOpenChange={setDealValueOpen}>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between px-0 py-1 hover:bg-transparent">
                        <DropdownMenuLabel className="px-0 py-0 cursor-pointer">Valor do Negócio</DropdownMenuLabel>
                        <ChevronDown className={`h-4 w-4 transition-transform ${dealValueOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-2 gap-2 px-2">
                      <div className="space-y-1">
                        <Label htmlFor="min-deal" className="text-xs">Mínimo (R$)</Label>
                        <Input
                          id="min-deal"
                          type="number"
                          placeholder="0"
                          min={0}
                          step="0.01"
                          value={dealValueFilter.min ?? ''}
                          onChange={(e) => {
                            const val = e.target.value ? parseFloat(e.target.value) : undefined;
                            setDealValueFilter({ ...dealValueFilter, min: val });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="max-deal" className="text-xs">Máximo (R$)</Label>
                        <Input
                          id="max-deal"
                          type="number"
                          placeholder="∞"
                          min={0}
                          step="0.01"
                          value={dealValueFilter.max ?? ''}
                          onChange={(e) => {
                            const val = e.target.value ? parseFloat(e.target.value) : undefined;
                            setDealValueFilter({ ...dealValueFilter, max: val });
                          }}
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortBy === 'none'}
                onCheckedChange={() => setSortBy('none')}
              >
                Padrão
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Data</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'date-desc'}
                onCheckedChange={() => setSortBy('date-desc')}
              >
                <ArrowDown className="h-3 w-3 mr-2" />
                Mais recente primeiro
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'date-asc'}
                onCheckedChange={() => setSortBy('date-asc')}
              >
                <ArrowUp className="h-3 w-3 mr-2" />
                Mais antiga primeiro
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Valor do Negócio</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'value-desc'}
                onCheckedChange={() => setSortBy('value-desc')}
              >
                <ArrowDown className="h-3 w-3 mr-2" />
                Maior valor primeiro
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'value-asc'}
                onCheckedChange={() => setSortBy('value-asc')}
              >
                <ArrowUp className="h-3 w-3 mr-2" />
                Menor valor primeiro
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Score</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'score-desc'}
                onCheckedChange={() => setSortBy('score-desc')}
              >
                <ArrowDown className="h-3 w-3 mr-2" />
                Maior score primeiro
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'score-asc'}
                onCheckedChange={() => setSortBy('score-asc')}
              >
                <ArrowUp className="h-3 w-3 mr-2" />
                Menor score primeiro
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => setCreateLeadOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar
          </Button>
          
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gerenciar Funis e Estágios</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Manage funnels list */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Funis Existentes</h3>
                  <div className="space-y-2">
                    {funnels.map((funnel) => (
                      <div
                        key={funnel.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        {editingFunnel === funnel.id ? (
                          <>
                            <Input
                              value={editingFunnelName}
                              onChange={(e) => setEditingFunnelName(e.target.value)}
                              className="flex-1"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleSaveFunnelEdit}>
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingFunnel(null);
                                setEditingFunnelName('');
                              }}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1">{funnel.name}</span>
                            {funnel.isDefault && (
                              <Badge variant="secondary">Padrão</Badge>
                            )}
                            {funnel.id.startsWith('mock-') && (
                              <Badge variant="outline" className="text-muted-foreground">Exemplo</Badge>
                            )}
                            <Badge variant="outline">{funnel.stages.length} estágios</Badge>
                            {!funnel.id.startsWith('mock-') && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditFunnel(funnel.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                {funnels.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteClick('funnel', funnel.id)}
                                    title={funnel.isDefault ? "Você pode deletar o funil padrão desde que tenha outros funis" : "Deletar funil"}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create new funnel */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Criar Novo Funil</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome do funil"
                      value={newFunnelName}
                      onChange={(e) => setNewFunnelName(e.target.value)}
                    />
                    <Button onClick={handleCreateFunnel}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar
                    </Button>
                  </div>
                </div>

                {/* Add stage to current funnel */}
                {activeFunnel && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Adicionar Estágio ao {activeFunnel.name}</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nome do estágio"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Label htmlFor="stage-color" className="sr-only">Cor</Label>
                        <Input
                          id="stage-color"
                          type="color"
                          value={newStageColor}
                          onChange={(e) => setNewStageColor(e.target.value)}
                          className="w-20"
                        />
                      </div>
                      <Button onClick={handleAddStage}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Current stages */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Estágios de {activeFunnel.name}</h3>
                  <div className="space-y-2">
                    {activeFunnel.stages.map((stage) => (
                      <div
                        key={stage.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        {editingStage === stage.id ? (
                          <>
                            <Input
                              value={editingStageName}
                              onChange={(e) => setEditingStageName(e.target.value)}
                              className="flex-1"
                              autoFocus
                            />
                            <Input
                              type="color"
                              value={editingStageColor}
                              onChange={(e) => setEditingStageColor(e.target.value)}
                              className="w-20"
                            />
                            <Button size="sm" onClick={handleSaveStageEdit}>
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingStage(null);
                                setEditingStageName('');
                                setEditingStageColor('');
                              }}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            <span className="flex-1">{stage.name}</span>
                            <Badge variant="secondary">
                              {getLeadsForStage(stage.id).length} leads
                            </Badge>
                            {!stage.id.startsWith('mock-') && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditStage(stage.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                {activeFunnel.stages.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteClick('stage', stage.id, activeFunnelId)}
                                    title="Você pode deletar desde que haja pelo menos 1 estágio restante"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tag Management Section */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Gerenciar Tags</h3>
                  <p className="text-sm text-muted-foreground">
                    Crie, edite ou exclua tags para organizar seus leads e tarefas
                  </p>
                  
                  {/* Existing tags */}
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium">Tags Existentes</h4>
                    <div className="space-y-2">
                      {availableTags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          {editingTag === tag ? (
                            <>
                              <Input
                                value={editingTagName}
                                onChange={(e) => setEditingTagName(e.target.value)}
                                className="flex-1"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveTagEdit();
                                  }
                                }}
                              />
                              <Button size="sm" onClick={handleSaveTagEdit}>
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingTag(null);
                                  setEditingTagName('');
                                }}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Tags className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="secondary" className="flex-1 justify-start">
                                {tag}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {leads.filter(l => l.tags.includes(tag)).length} lead{leads.filter(l => l.tags.includes(tag)).length !== 1 ? 's' : ''}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditTag(tag)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  const tagId = tagsMap.get(tag);
                                  if (tagId) {
                                    handleDeleteClick('tag', tagId);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                      {availableTags.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhuma tag criada ainda
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Create new tag */}
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium">Criar Nova Tag</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nome da tag"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCreateTag();
                          }
                        }}
                      />
                      <Button onClick={handleCreateTag}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Archived Leads Section */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Leads Arquivados</h3>
                  <p className="text-sm text-muted-foreground">
                    Leads arquivados não aparecem no funil. Você pode desarquivá-los a qualquer momento.
                  </p>
                  
                  <div className="space-y-2 mt-4">
                    {leads.filter(l => (l.status as any) === 'arquivado' || l.status === 'archived').length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum lead arquivado
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {leads
                          .filter(l => (l.status as any) === 'arquivado' || l.status === 'archived')
                          .map((lead) => (
                            <div
                              key={lead.id}
                              className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{lead.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {lead.company || 'Sem empresa'}
                                </p>
                              </div>
                              <Badge variant="secondary">Score: {lead.score}</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    await updateSupabaseLead({
                                      id: lead.id,
                                      updates: { status: 'novo' as any }
                                    });
                                    toast.success('Lead desarquivado com sucesso!');
                                  } catch (error) {
                                    console.error('Erro ao desarquivar lead:', error);
                                    toast.error('Erro ao desarquivar lead');
                                  }
                                }}
                              >
                                Desarquivar
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {activeFunnel.stages
          .sort((a, b) => a.order - b.order)
          .map((stage) => {
            const stageLeads = getLeadsForStage(stage.id);
            
            return (
              <div
                key={stage.id}
                className="flex-1 min-w-[300px] max-w-[350px]"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Stage Header */}
                <div className="mb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{stage.name}</h3>
                    <Badge variant="secondary" className="rounded-full">
                      {stageLeads.length}
                    </Badge>
                  </div>
                  <div
                    className="h-1 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                </div>

                {/* Lead Cards */}
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => navigate(`/crm/${lead.id}`)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold truncate">{lead.name}</p>
                                {/* ✅ BADGE CORRETO - só mostra para ganho ou perdido */}
                                {(['ganho', 'won', 'perdido', 'lost'].includes((lead.status as any) || '')) && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      ['won', 'ganho'].includes((lead.status as any) || '')
                                        ? 'border-green-600 text-green-600'
                                        : 'border-red-600 text-red-600'
                                    }`}
                                  >
                                    {['won', 'ganho'].includes((lead.status as any) || '') ? 'Ganho' : 'Perdido'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {lead.company}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                                {lead.score}
                              </div>
                              {/* Menu de ações do lead */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenMoveLead(lead);
                                  }}>
                                    <MoveRight className="h-4 w-4 mr-2" />
                                    Mover para outro funil
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      await updateSupabaseLead({
                                        id: lead.id,
                                        updates: { status: 'arquivado' as any }
                                      });
                                      toast.success('Lead arquivado com sucesso!');
                                    } catch (error) {
                                      console.error('Erro ao arquivar lead:', error);
                                      toast.error('Erro ao arquivar lead');
                                    }
                                  }}>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Arquivar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Footer */}
                          <div 
                            className="flex items-center justify-between text-xs text-muted-foreground"
                            onClick={() => navigate(`/crm/${lead.id}`)}
                          >
                            <div className="flex items-center gap-2">
                              <span>{lead.owner}</span>
                              {lead.dealValue && lead.dealValue > 0 && (
                                <>
                                  <span className="text-muted-foreground/50">•</span>
                                  <span className="font-semibold text-primary">
                                    R$ {lead.dealValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </>
                              )}
                            </div>
                            <span>
                              {formatDistanceToNow(lead.lastContact, {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Empty state */}
                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum lead neste estágio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Create Lead Dialog */}
      <Dialog open={createLeadOpen} onOpenChange={setCreateLeadOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-3 pb-4 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Criar Novo Lead</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Adicione um novo lead ao funil <span className="font-medium text-foreground">{activeFunnel.name}</span>
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid gap-5 py-4 overflow-y-auto flex-1 pr-2">
            {/* Informações Básicas */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Informações Básicas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-name" className="text-xs font-medium">
                    Nome do Lead <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lead-name"
                    placeholder="Ex: João Silva"
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="h-9"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="lead-company" className="text-xs font-medium">
                    Empresa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lead-company"
                    placeholder="Ex: Tech Solutions LTDA"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Informações de Contato
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-email" className="text-xs font-medium">
                    Email
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="joao@exemplo.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="h-9"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="lead-phone" className="text-xs font-medium">
                    Telefone / WhatsApp
                  </Label>
                  <Input
                    id="lead-phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Detalhes do Lead */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Detalhes do Lead
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-source" className="text-xs font-medium">
                    Fonte de Origem
                  </Label>
                  <Select 
                    value={newLeadForm.source} 
                    onValueChange={(value) => setNewLeadForm({ ...newLeadForm, source: value })}
                  >
                    <SelectTrigger id="lead-source" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="lead-owner" className="text-xs font-medium">
                    Responsável
                  </Label>
                  <Select 
                    value={newLeadForm.owner} 
                    onValueChange={(value) => setNewLeadForm({ ...newLeadForm, owner: value })}
                  >
                    <SelectTrigger id="lead-owner" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allOwners.map((owner) => (
                        <SelectItem key={owner} value={owner}>
                          {owner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Informações Comerciais */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Informações Comerciais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="deal-value" className="text-xs font-medium">
                    Valor do Negócio (R$)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deal-value"
                      type="number"
                      placeholder="0,00"
                      value={newLeadForm.dealValue}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, dealValue: e.target.value })}
                      className="h-9 pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="expected-close-date" className="text-xs font-medium">
                    Data de Fechamento Esperada
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="expected-close-date"
                        variant="outline"
                        className="w-full h-9 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newLeadForm.expectedCloseDate ? (
                          format(newLeadForm.expectedCloseDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span className="text-muted-foreground">Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newLeadForm.expectedCloseDate || undefined}
                        onSelect={(date) => setNewLeadForm({ ...newLeadForm, expectedCloseDate: date || null })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Observações Iniciais
              </h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="lead-notes" className="text-xs font-medium">
                  Notas
                </Label>
                <Textarea
                  id="lead-notes"
                  placeholder="Adicione observações relevantes sobre o lead..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => setCreateLeadOpen(false)}
              className="h-9 px-4"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateLead}
              disabled={!newLeadForm.name.trim() || !newLeadForm.company.trim()}
              className="h-9 px-4 gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Criar Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BANT Qualification Dialog */}
      <Dialog open={bantQualificationOpen} onOpenChange={setBantQualificationOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-2 pb-3 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Qualificação BANT</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Avalie o potencial do lead através da metodologia BANT
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
            {/* Explicação BANT */}
            <div className="p-3 bg-muted/50 rounded-lg border border-muted">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Marque os critérios que se aplicam ao lead. Cada critério vale <span className="font-semibold text-foreground">25 pontos</span>, 
                totalizando até <span className="font-semibold text-foreground">100 pontos</span> de score.
              </p>
            </div>

            {/* Budget */}
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bant-budget"
                    checked={bantScore.budget}
                    onCheckedChange={(checked) => 
                      setBantScore({ ...bantScore, budget: checked as boolean })
                    }
                    className="h-4 w-4"
                  />
                  <Label 
                    htmlFor="bant-budget" 
                    className="text-sm font-semibold cursor-pointer flex-1"
                  >
                    Budget (Orçamento)
                  </Label>
                  <Badge variant="secondary" className="text-xs">25 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  O lead possui orçamento definido ou capacidade financeira para investir?
                </p>
              </div>
            </div>

            {/* Authority */}
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bant-authority"
                    checked={bantScore.authority}
                    onCheckedChange={(checked) => 
                      setBantScore({ ...bantScore, authority: checked as boolean })
                    }
                    className="h-4 w-4"
                  />
                  <Label 
                    htmlFor="bant-authority" 
                    className="text-sm font-semibold cursor-pointer flex-1"
                  >
                    Authority (Autoridade)
                  </Label>
                  <Badge variant="secondary" className="text-xs">25 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Você está falando com o decisor ou alguém com poder de decisão?
                </p>
              </div>
            </div>

            {/* Need */}
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-warning-foreground" />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bant-need"
                    checked={bantScore.need}
                    onCheckedChange={(checked) => 
                      setBantScore({ ...bantScore, need: checked as boolean })
                    }
                    className="h-4 w-4"
                  />
                  <Label 
                    htmlFor="bant-need" 
                    className="text-sm font-semibold cursor-pointer flex-1"
                  >
                    Need (Necessidade)
                  </Label>
                  <Badge variant="secondary" className="text-xs">25 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  O lead tem uma necessidade clara e urgente que sua solução pode resolver?
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-success-foreground" />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bant-timeline"
                    checked={bantScore.timeline}
                    onCheckedChange={(checked) => 
                      setBantScore({ ...bantScore, timeline: checked as boolean })
                    }
                    className="h-4 w-4"
                  />
                  <Label 
                    htmlFor="bant-timeline" 
                    className="text-sm font-semibold cursor-pointer flex-1"
                  >
                    Timeline (Prazo)
                  </Label>
                  <Badge variant="secondary" className="text-xs">25 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Existe um prazo definido ou expectativa de quando a decisão será tomada?
                </p>
              </div>
            </div>

            {/* Score Preview */}
            <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Score Calculado</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Baseado nos critérios selecionados
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    calculateBANTScore() >= 75 ? 'text-green-600 dark:text-green-400' :
                    calculateBANTScore() >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {calculateBANTScore()}
                  </p>
                  <p className="text-xs text-muted-foreground">de 100 pontos</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t flex-shrink-0">
            {/* Botão único: Confirmar Score */}
            <Button 
              onClick={handleBANTSubmit}
              className="h-9 px-4 gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
            >
              <CheckCircle2 className="h-4 w-4" />
              {bantScore.budget || bantScore.authority || bantScore.need || bantScore.timeline 
                ? `Confirmar Score (${
                    (bantScore.budget ? 25 : 0) + 
                    (bantScore.authority ? 25 : 0) + 
                    (bantScore.need ? 25 : 0) + 
                    (bantScore.timeline ? 25 : 0)
                  } pts)`
                : 'Confirmar (0 pts)'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Lead Dialog */}
      <Dialog open={moveLeadDialogOpen} onOpenChange={setMoveLeadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mover Lead para Outro Funil</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Escolha o funil de destino para o lead <span className="font-semibold">{leadToMove?.name}</span>
            </p>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Funil de Destino</Label>
              <Select value={targetFunnelId} onValueChange={setTargetFunnelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o funil" />
                </SelectTrigger>
                <SelectContent>
                  {funnels
                    .filter(f => f.id !== leadToMove?.funnelId) // Não mostrar o funil atual
                    .map((funnel) => (
                      <SelectItem key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                O lead será movido para a primeira etapa do funil selecionado
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMoveLeadDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleMoveLead}
              disabled={!targetFunnelId || targetFunnelId === leadToMove?.funnelId}
              className="gap-2"
            >
              <MoveRight className="h-4 w-4" />
              Mover Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'funnel'
                ? 'Tem certeza que deseja excluir este funil? Todos os leads serão movidos para o funil padrão.'
                : deleteTarget?.type === 'stage'
                ? 'Tem certeza que deseja excluir este estágio? Todos os leads neste estágio serão movidos para o primeiro estágio.'
                : 'Tem certeza que deseja excluir esta tag? Ela será removida de todos os leads e tarefas que a utilizam.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
