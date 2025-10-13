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
import { Lightbulb, Plus, ArrowRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ContentIdea, ContentStatus } from '@/types/creator';

const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; icon: any }> = {
  idea: { label: 'Ideia', color: 'bg-yellow-500', icon: Lightbulb },
  draft: { label: 'Rascunho', color: 'bg-blue-500', icon: Clock },
  produced: { label: 'Produzido', color: 'bg-purple-500', icon: AlertCircle },
  published: { label: 'Publicado', color: 'bg-green-500', icon: CheckCircle2 },
};

export function IdeasBoard() {
  const { ideas, pillars, addIdea, updateIdea, deleteIdea } = useCreatorSolutions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ContentIdea | null>(null);

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

  const handleStatusChange = (ideaId: string, newStatus: ContentStatus) => {
    updateIdea(ideaId, { status: newStatus });
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

  const getIdeasByStatus = (status: ContentStatus) => {
    return ideas.filter((idea) => idea.status === status);
  };

  const getPillarName = (pillarId?: string) => {
    if (!pillarId) return null;
    return pillars.find((p) => p.id === pillarId)?.name;
  };

  const getPillarColor = (pillarId?: string) => {
    if (!pillarId) return null;
    return pillars.find((p) => p.id === pillarId)?.color;
  };

  const PRIORITY_COLORS = {
    low: 'border-gray-300',
    medium: 'border-yellow-400',
    high: 'border-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Board de Ideias</h2>
          <p className="text-muted-foreground">Gerencie o fluxo das suas ideias até a publicação</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Ideia
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const ideasInStatus = getIdeasByStatus(status as ContentStatus);
          const StatusIcon = config.icon;

          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                <StatusIcon className="w-4 h-4" />
                <span className="font-semibold text-sm">{config.label}</span>
                <Badge variant="secondary" className="ml-auto">
                  {ideasInStatus.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {ideasInStatus.map((idea) => {
                  const pillarColor = getPillarColor(idea.pillarId);
                  const pillarName = getPillarName(idea.pillarId);

                  return (
                    <Card
                      key={idea.id}
                      className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                        PRIORITY_COLORS[idea.priority]
                      }`}
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

                        {idea.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {idea.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {idea.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{idea.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Status Navigation */}
                        <div className="flex gap-1 pt-2 border-t">
                          {status !== 'published' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                const statuses: ContentStatus[] = ['idea', 'draft', 'produced', 'published'];
                                const currentIndex = statuses.indexOf(status as ContentStatus);
                                if (currentIndex < statuses.length - 1) {
                                  handleStatusChange(idea.id, statuses[currentIndex + 1]);
                                }
                              }}
                            >
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Avançar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {ideasInStatus.length === 0 && (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <p className="text-xs text-muted-foreground">Nenhuma ideia neste estágio</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingIdea ? 'Editar Ideia' : 'Nova Ideia de Conteúdo'}</DialogTitle>
            <DialogDescription>Capture e organize suas ideias criativas</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea-title">Título da Ideia *</Label>
              <Input
                id="idea-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: 5 dicas para aumentar a produtividade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idea-description">Descrição</Label>
              <Textarea
                id="idea-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva a ideia com mais detalhes..."
                rows={3}
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
              <Label htmlFor="inspiration">Fonte de Inspiração</Label>
              <Input
                id="inspiration"
                value={formData.inspiration}
                onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                placeholder="Ex: Tendência no TikTok, concorrente X, artigo Y..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Adicione tags"
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

            {editingIdea && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
