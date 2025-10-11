import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore, type Lead, type Funnel, type FunnelStage, type BANTMethodology } from "@/store/useStore";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
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
} from "lucide-react";

export const KanbanBoard = () => {
  const { 
    leads, 
    funnels, 
    activeFunnelId, 
    setActiveFunnel, 
    updateLead,
    addLead,
    addFunnel,
    updateFunnel,
    deleteFunnel,
    addStageToFunnel,
    removeStageFromFunnel,
    updateStageInFunnel,
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
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'funnel' | 'stage', id: string, funnelId?: string } | null>(null);
  const [editingLeadTags, setEditingLeadTags] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  
  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website',
    owner: 'Vendedor',
    notes: '',
  });
  
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
  
  const navigate = useNavigate();

  const activeFunnel = funnels.find((f) => f.id === activeFunnelId) || funnels[0];
  
  // Get all unique values for filters
  const allTags = Array.from(new Set(leads.flatMap(l => l.tags)));
  const allSources = Array.from(new Set(leads.map(l => l.source)));
  const allOwners = Array.from(new Set(leads.map(l => l.owner)));
  
  const filteredLeads = leads.filter((lead) => {
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
    
    return matchesSearch && matchesFunnel && matchesTags && matchesSource && matchesOwner && matchesScore;
  });

  const activeFiltersCount = 
    selectedTags.length + 
    selectedSources.length + 
    selectedOwners.length + 
    (scoreFilter.min !== undefined || scoreFilter.max !== undefined ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedSources([]);
    setSelectedOwners([]);
    setScoreFilter({});
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

  const handleDrop = (stageId: string) => {
    if (!draggedLead) return;
    
    // Update lead stage
    if (activeFunnelId === 'default') {
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
    if (activeFunnelId === 'default') {
      return filteredLeads.filter((l) => l.stage === stageId);
    }
    return filteredLeads.filter((l) => l.customStageId === stageId);
  };

  const handleCreateFunnel = () => {
    if (!newFunnelName.trim()) return;
    
    const newFunnel: Funnel = {
      id: `funnel-${Date.now()}`,
      name: newFunnelName,
      isDefault: false,
      stages: [
        { id: 'stage-1', name: 'Novo', color: '#3B82F6', order: 0 },
      ],
    };
    
    addFunnel(newFunnel);
    setNewFunnelName('');
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    
    const newStage: FunnelStage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
      color: newStageColor,
      order: activeFunnel.stages.length,
    };
    
    addStageToFunnel(activeFunnelId, newStage);
    setNewStageName('');
    setNewStageColor('#3B82F6');
  };

  const handleEditFunnel = (funnelId: string) => {
    const funnel = funnels.find(f => f.id === funnelId);
    if (!funnel) return;
    setEditingFunnel(funnelId);
    setEditingFunnelName(funnel.name);
  };

  const handleSaveFunnelEdit = () => {
    if (!editingFunnel || !editingFunnelName.trim()) return;
    updateFunnel(editingFunnel, { name: editingFunnelName });
    setEditingFunnel(null);
    setEditingFunnelName('');
  };

  const handleEditStage = (stageId: string) => {
    const stage = activeFunnel.stages.find(s => s.id === stageId);
    if (!stage) return;
    setEditingStage(stageId);
    setEditingStageName(stage.name);
    setEditingStageColor(stage.color);
  };

  const handleSaveStageEdit = () => {
    if (!editingStage || !editingStageName.trim()) return;
    updateStageInFunnel(activeFunnelId, editingStage, {
      name: editingStageName,
      color: editingStageColor,
    });
    setEditingStage(null);
    setEditingStageName('');
    setEditingStageColor('');
  };

  const handleDeleteClick = (type: 'funnel' | 'stage', id: string, funnelId?: string) => {
    setDeleteTarget({ type, id, funnelId });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'funnel') {
      deleteFunnel(deleteTarget.id);
    } else if (deleteTarget.type === 'stage' && deleteTarget.funnelId) {
      removeStageFromFunnel(deleteTarget.funnelId, deleteTarget.id);
    }
    
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
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

  const handleCreateLead = () => {
    if (!newLeadForm.name.trim() || !newLeadForm.company.trim()) return;
    
    const firstStageId = activeFunnel.stages[0]?.id;
    const leadId = `lead-${Date.now()}`;
    
    const newLead: Lead = {
      id: leadId,
      name: newLeadForm.name,
      company: newLeadForm.company,
      email: newLeadForm.email,
      whatsapp: newLeadForm.phone,
      source: newLeadForm.source,
      owner: newLeadForm.owner,
      stage: activeFunnelId === 'default' ? (firstStageId as any) : 'captured',
      customStageId: activeFunnelId !== 'default' ? firstStageId : undefined,
      funnelId: activeFunnelId !== 'default' ? activeFunnelId : undefined,
      score: 0, // Começa com 0, será calculado pelo BANT
      tags: [],
      lastContact: new Date(),
      notes: newLeadForm.notes,
    };
    
    addLead(newLead);
    
    // Reset form
    setNewLeadForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      source: 'Website',
      owner: 'Vendedor',
      notes: '',
    });
    
    // Salvar ID do lead criado e abrir qualificação BANT
    setCreatedLeadId(leadId);
    setCreateLeadOpen(false);
    setBantQualificationOpen(true);
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

  const handleBANTSubmit = () => {
    if (!createdLeadId) return;
    
    const score = calculateBANTScore();
    const lead = leads.find(l => l.id === createdLeadId);
    
    updateLead(createdLeadId, { 
      score,
      bant: {
        budget: bantScore.budget,
        authority: bantScore.authority,
        need: bantScore.need,
        timeline: bantScore.timeline,
        qualifiedAt: new Date(),
        qualifiedBy: lead?.owner || 'Sistema',
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

  const handleSkipBANT = () => {
    if (createdLeadId) {
      // Zera o score e não salva informações BANT quando pular
      updateLead(createdLeadId, { 
        score: 0,
        bant: undefined,
      });
    }
    
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
          <h2 className="font-display text-2xl font-bold">CRM</h2>
          <Select value={activeFunnelId} onValueChange={setActiveFunnel}>
            <SelectTrigger className="w-[220px] border-dashed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {funnels.map((funnel) => (
                <SelectItem key={funnel.id} value={funnel.id}>
                  {funnel.name}
                </SelectItem>
              ))}
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
              <div className="p-2 space-y-4">
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

                {/* Tags Filter */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="px-0 py-1">Tags</DropdownMenuLabel>
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
                </div>

                <Separator />

                {/* Source Filter */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="px-0 py-1">Fonte</DropdownMenuLabel>
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
                </div>

                <Separator />

                {/* Owner Filter */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="px-0 py-1">Responsável</DropdownMenuLabel>
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
                </div>

                <Separator />

                {/* Score Filter */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="px-0 py-1">Score</DropdownMenuLabel>
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
                </div>
              </div>
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
                            <Badge variant="outline">{funnel.stages.length} estágios</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditFunnel(funnel.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {!funnel.isDefault && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick('funnel', funnel.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStage(stage.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {!activeFunnel.isDefault && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick('stage', stage.id, activeFunnelId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
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
                          <div 
                            className="flex items-start justify-between gap-2"
                            onClick={() => navigate(`/crm/${lead.id}`)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold truncate">{lead.name}</p>
                                {lead.status && lead.status !== 'open' && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      lead.status === 'won'
                                        ? 'border-green-600 text-green-600'
                                        : 'border-red-600 text-red-600'
                                    }`}
                                  >
                                    {lead.status === 'won' ? 'Ganho' : 'Perdido'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {lead.company}
                              </p>
                            </div>
                            <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1">
                            {lead.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs group relative"
                              >
                                {tag}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(lead.id, tag);
                                  }}
                                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                            
                            {/* Add Tag Popover */}
                            <Popover 
                              open={editingLeadTags === lead.id} 
                              onOpenChange={(open) => {
                                setEditingLeadTags(open ? lead.id : null);
                                if (!open) setNewTag('');
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLeadTags(lead.id);
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Tag
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent 
                                className="w-64" 
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="new-tag">Adicionar Tag</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="new-tag"
                                      placeholder="Nome da tag..."
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleAddTag(lead.id);
                                        }
                                      }}
                                    />
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAddTag(lead.id)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Footer */}
                          <div 
                            className="flex items-center justify-between text-xs text-muted-foreground"
                            onClick={() => navigate(`/crm/${lead.id}`)}
                          >
                            <span>{lead.owner}</span>
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
      <Dialog open={bantQualificationOpen} onOpenChange={(open) => {
        if (!open) handleSkipBANT();
      }}>
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
            <Button 
              variant="outline" 
              onClick={handleSkipBANT}
              className="h-9 px-4"
            >
              Pular Qualificação
            </Button>
            <Button 
              onClick={handleBANTSubmit}
              className="h-9 px-4 gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirmar Score
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
                : 'Tem certeza que deseja excluir este estágio? Todos os leads neste estágio serão movidos para o primeiro estágio.'}
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
