import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContentIdeas, useCreateContentIdea, useUpdateContentIdea, useDeleteContentIdea, useContentPillars } from '@/hooks/useCreatorAPI';
import { Lightbulb, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STATUS_CONFIG = {
  idea: { label: 'Ideia', color: 'bg-yellow-500' },
  'in-progress': { label: 'Em Progresso', color: 'bg-blue-500' },
  scheduled: { label: 'Agendado', color: 'bg-purple-500' },
  published: { label: 'Publicado', color: 'bg-green-500' },
  archived: { label: 'Arquivado', color: 'bg-gray-400' },
};

const PLATFORMS = ['instagram', 'linkedin', 'tiktok', 'youtube', 'blog', 'twitter', 'facebook'];

export function IdeasBoard() {
  const { toast } = useToast();
  const { data: ideas = [], isLoading } = useContentIdeas();
  const { data: pillars = [] } = useContentPillars();
  const { mutate: createIdea, isPending: isCreating } = useCreateContentIdea();
  const { mutate: updateIdea, isPending: isUpdating } = useUpdateContentIdea();
  const { mutate: deleteIdea } = useDeleteContentIdea();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'instagram',
    status: 'idea' as 'idea' | 'in-progress' | 'scheduled' | 'published' | 'archived',
    pillar_id: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      platform: 'instagram',
      status: 'idea' as 'idea' | 'in-progress' | 'scheduled' | 'published' | 'archived',
      pillar_id: '',
      notes: '',
    });
    setEditingIdea(null);
  };

  const handleOpenDialog = (idea?: any) => {
    if (idea) {
      setFormData({
        title: idea.title || '',
        description: idea.description || '',
        platform: idea.platform || 'instagram',
        status: (idea.status || 'idea') as any,
        pillar_id: idea.pillar_id || '',
        notes: idea.notes || '',
      });
      setEditingIdea(idea);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'A ideia precisa ter um título.',
        variant: 'destructive',
      });
      return;
    }

    if (editingIdea) {
      updateIdea(
        { id: editingIdea.id, data: formData },
        {
          onSuccess: () => {
            toast({ title: 'Ideia atualizada!', description: 'Suas alterações foram salvas.' });
            setIsDialogOpen(false);
            resetForm();
          },
          onError: () => {
            toast({ title: 'Erro ao atualizar', variant: 'destructive' });
          },
        }
      );
    } else {
      createIdea(formData, {
        onSuccess: () => {
          toast({ title: 'Ideia criada!', description: 'Nova ideia adicionada ao board.' });
          setIsDialogOpen(false);
          resetForm();
        },
        onError: () => {
          toast({ title: 'Erro ao criar', variant: 'destructive' });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ideia?')) return;

    deleteIdea(id, {
      onSuccess: () => {
        toast({ title: 'Ideia excluída', description: 'A ideia foi removida.' });
      },
      onError: () => {
        toast({ title: 'Erro ao excluir', variant: 'destructive' });
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Board de Ideias</h3>
          <p className="text-sm text-muted-foreground">
            Capture e organize suas ideias de conteúdo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Ideia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIdea ? 'Editar Ideia' : 'Nova Ideia'}</DialogTitle>
              <DialogDescription>
                Capture sua inspiração
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Tutorial de Excel para iniciantes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a ideia..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
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
              </div>

              {pillars.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="pillar_id">Pilar *</Label>
                  <Select
                    value={formData.pillar_id || undefined}
                    onValueChange={(value) => setFormData({ ...formData, pillar_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um pilar" />
                    </SelectTrigger>
                    <SelectContent>
                      {pillars.map((pillar) => (
                        <SelectItem key={pillar.id} value={pillar.id}>
                          {pillar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anotações adicionais..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isCreating || isUpdating || !formData.title.trim()}
                  className="flex-1"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingIdea ? 'Salvar' : 'Criar'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {ideas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma Ideia</h3>
            <p className="text-muted-foreground mb-4">
              Comece capturando suas ideias de conteúdo
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Ideia
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <CardTitle className="text-base line-clamp-2">
                      {idea.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDialog(idea)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(idea.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {idea.platform && (
                    <Badge variant="outline" className="text-xs">
                      {idea.platform}
                    </Badge>
                  )}
                  <Badge 
                    variant="secondary" 
                    className="text-xs text-white"
                    style={{ backgroundColor: STATUS_CONFIG[idea.status as keyof typeof STATUS_CONFIG]?.color }}
                  >
                    {STATUS_CONFIG[idea.status as keyof typeof STATUS_CONFIG]?.label || 'Ideia'}
                  </Badge>
                </div>
              </CardHeader>
              {idea.description && (
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {idea.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
