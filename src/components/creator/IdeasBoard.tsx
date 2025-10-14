import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatorSolutions } from '@/store/creatorSolutionsStore';
import { Lightbulb, Plus, Star, Zap, Brain, Sparkles, Filter } from 'lucide-react';
import type { ContentIdea, ContentStatus } from '@/types/creator';

export function IdeasBoard() {
  const { ideas, pillars, addIdea, updateIdea, deleteIdea } = useCreatorSolutions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ContentIdea | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterPillar, setFilterPillar] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<ContentIdea>>({
    title: '',
    description: '',
    pillarId: undefined,
    inspiration: '',
    priority: 'medium',
    tags: [],
    status: 'idea',
  });

  const [newTag, setNewTag] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      pillarId: undefined,
      inspiration: '',
      priority: 'medium',
      tags: [],
      status: 'idea',
    });
    setNewTag('');
    setEditingIdea(null);
  };

  const handleOpenDialog = (idea?: ContentIdea) => {
    if (idea) {
      setFormData(idea);
      setEditingIdea(idea);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) return;

    const ideaData: ContentIdea = {
      id: editingIdea?.id || `idea-${Date.now()}`,
      title: formData.title,
      description: formData.description || '',
      pillarId: formData.pillarId,
      inspiration: formData.inspiration,
      priority: formData.priority || 'medium',
      tags: formData.tags || [],
      status: formData.status || 'idea',
      createdAt: editingIdea?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingIdea) {
      updateIdea(editingIdea.id, ideaData);
    } else {
      addIdea(ideaData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), newTag.trim()],
    });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag),
    });
  };

  const getPillarName = (pillarId?: string) => {
    if (!pillarId) return null;
    return pillars.find((p) => p.id === pillarId)?.name;
  };

  const getPillarColor = (pillarId?: string) => {
    if (!pillarId) return null;
    return pillars.find((p) => p.id === pillarId)?.color;
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (filterPriority !== 'all' && idea.priority !== filterPriority) return false;
    if (filterPillar !== 'all' && idea.pillarId !== filterPillar) return false;
    return true;
  });

  const priorityCount = {
    high: ideas.filter(i => i.priority === 'high').length,
    medium: ideas.filter(i => i.priority === 'medium').length,
    low: ideas.filter(i => i.priority === 'low').length,
  };

  const PRIORITY_CONFIG = {
    high: { label: 'Alta Prioridade', icon: Zap, color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive' },
    medium: { label: 'Média Prioridade', icon: Star, color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning' },
    low: { label: 'Baixa Prioridade', icon: Brain, color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-muted-foreground' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            Brainstorm de Ideias
          </h2>
          <p className="text-muted-foreground">Capture e organize todas as suas ideias criativas</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Ideia
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Ideias</p>
                <p className="text-2xl font-bold">{ideas.length}</p>
              </div>
              <Brain className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold">{priorityCount.high}</p>
              </div>
              <Zap className="w-8 h-8 text-destructive/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média Prioridade</p>
                <p className="text-2xl font-bold">{priorityCount.medium}</p>
              </div>
              <Star className="w-8 h-8 text-warning/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Baixa Prioridade</p>
                <p className="text-2xl font-bold">{priorityCount.low}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Filtrar por Prioridade</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    <SelectItem value="high">Alta Prioridade</SelectItem>
                    <SelectItem value="medium">Média Prioridade</SelectItem>
                    <SelectItem value="low">Baixa Prioridade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Filtrar por Pilar</Label>
                <Select value={filterPillar} onValueChange={setFilterPillar}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Pilares</SelectItem>
                    {pillars.map((pillar) => (
                      <SelectItem key={pillar.id} value={pillar.id}>
                        {pillar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brainstorm Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => {
          const ideasByPriority = filteredIdeas.filter((idea) => idea.priority === priority);
          const Icon = config.icon;

          return (
            <div key={priority} className="space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className={`font-semibold text-sm ${config.color}`}>{config.label}</span>
                <Badge variant="secondary" className="ml-auto">
                  {ideasByPriority.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {ideasByPriority.map((idea) => {
                  const pillarColor = getPillarColor(idea.pillarId);
                  const pillarName = getPillarName(idea.pillarId);

                  return (
                    <Card
                      key={idea.id}
                      className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow ${config.borderColor}`}
                      onClick={() => handleOpenDialog(idea)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2">{idea.title}</h4>
                        
                        {idea.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{idea.description}</p>
                        )}

                        {pillarName && (
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: pillarColor || '#999' }}
                            />
                            <span className="text-xs text-muted-foreground">{pillarName}</span>
                          </div>
                        )}

                        {idea.inspiration && (
                          <div className="flex items-start gap-1">
                            <Sparkles className="w-3 h-3 text-muted-foreground mt-0.5" />
                            <span className="text-xs text-muted-foreground line-clamp-1">{idea.inspiration}</span>
                          </div>
                        )}

                        {idea.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {idea.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {idea.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{idea.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {ideasByPriority.length === 0 && (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <p className="text-xs text-muted-foreground">Nenhuma ideia</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      {ideas.length === 0 && (
        <Card className="border-primary/20 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Dicas para um Brainstorm Efetivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Capture todas as ideias sem filtro - quantidade antes de qualidade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Use tags para agrupar ideias relacionadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Defina prioridades para focar nas ideias mais promissoras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Anote a inspiração - de onde veio a ideia</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingIdea ? 'Editar Ideia' : 'Nova Ideia'}</DialogTitle>
            <DialogDescription>Capture sua ideia criativa</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea-title">Título da Ideia *</Label>
              <Input
                id="idea-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Como organizar tarefas usando método Pomodoro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idea-description">Descrição / Notas</Label>
              <Textarea
                id="idea-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Desenvolva a ideia, adicione detalhes, insights, possíveis abordagens..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pilar</Label>
                <Select
                  value={formData.pillarId}
                  onValueChange={(value) => setFormData({ ...formData, pillarId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pilar" />
                  </SelectTrigger>
                  <SelectContent>
                    {pillars.map((pillar) => (
                      <SelectItem key={pillar.id} value={pillar.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
                          {pillar.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspiration">Fonte de Inspiração / Contexto</Label>
              <Input
                id="inspiration"
                value={formData.inspiration}
                onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                placeholder="Ex: Conversa com cliente, tendência no Instagram, problema comum..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (para organizar e filtrar)</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Ex: tutorial, dica rápida, caso real"
                />
                <Button type="button" onClick={addTag} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>×</button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {editingIdea && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Excluir esta ideia?')) {
                      deleteIdea(editingIdea.id);
                      setIsDialogOpen(false);
                      resetForm();
                    }
                  }}
                >
                  Excluir
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!formData.title} className="flex-1">
                {editingIdea ? 'Salvar' : 'Criar Ideia'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
