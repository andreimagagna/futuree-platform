import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditorialCalendar, useCreateEditorialContent, useUpdateEditorialContent, useDeleteEditorialContent, useContentPillars } from '@/hooks/useCreatorAPI';
import { Calendar as CalendarIcon, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const STATUS_CONFIG = {
  draft: { label: 'Rascunho', color: 'bg-gray-500' },
  scheduled: { label: 'Agendado', color: 'bg-blue-500' },
  published: { label: 'Publicado', color: 'bg-green-500' },
  archived: { label: 'Arquivado', color: 'bg-gray-400' },
};

const PLATFORMS = ['instagram', 'linkedin', 'tiktok', 'youtube', 'blog', 'twitter', 'facebook'];
const FORMATS = ['post', 'reel', 'video', 'article', 'story', 'carousel', 'podcast'];

export function EditorialCalendar() {
  const { toast } = useToast();
  const { data: calendar = [], isLoading } = useEditorialCalendar();
  const { data: pillars = [] } = useContentPillars();
  const { mutate: createContent, isPending: isCreating } = useCreateEditorialContent();
  const { mutate: updateContent, isPending: isUpdating } = useUpdateEditorialContent();
  const { mutate: deleteContent } = useDeleteEditorialContent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content_text: '',
    platform: 'instagram' as 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'blog' | 'twitter' | 'facebook',
    format: 'post' as 'post' | 'reel' | 'video' | 'article' | 'story' | 'carousel' | 'podcast',
    status: 'draft' as 'draft' | 'scheduled' | 'published' | 'archived',
    scheduled_date: '',
    pillar_id: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content_text: '',
      platform: 'instagram' as 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'blog' | 'twitter' | 'facebook',
      format: 'post' as 'post' | 'reel' | 'video' | 'article' | 'story' | 'carousel' | 'podcast',
      status: 'draft' as 'draft' | 'scheduled' | 'published' | 'archived',
      scheduled_date: '',
      pillar_id: '',
    });
    setEditingContent(null);
  };

  const handleOpenDialog = (content?: any) => {
    if (content) {
      setFormData({
        title: content.title || '',
        content_text: content.content_text || '',
        platform: (content.platform || 'instagram') as any,
        format: (content.format || 'post') as any,
        status: (content.status || 'draft') as any,
        scheduled_date: content.scheduled_date ? content.scheduled_date.split('T')[0] : '',
        pillar_id: content.pillar_id || '',
      });
      setEditingContent(content);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'O conteúdo precisa ter um título.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      ...formData,
      scheduled_date: formData.scheduled_date || null,
    };

    if (editingContent) {
      updateContent(
        { id: editingContent.id, data: payload },
        {
          onSuccess: () => {
            toast({ title: 'Conteúdo atualizado!', description: 'Suas alterações foram salvas.' });
            setIsDialogOpen(false);
            resetForm();
          },
          onError: () => {
            toast({ title: 'Erro ao atualizar', variant: 'destructive' });
          },
        }
      );
    } else {
      createContent(payload, {
        onSuccess: () => {
          toast({ title: 'Conteúdo criado!', description: 'Conteúdo adicionado ao calendário.' });
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
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return;

    deleteContent(id, {
      onSuccess: () => {
        toast({ title: 'Conteúdo excluído', description: 'O conteúdo foi removido.' });
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
          <h3 className="text-lg font-semibold">Calendário Editorial</h3>
          <p className="text-sm text-muted-foreground">
            Planeje e organize suas publicações
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingContent ? 'Editar Conteúdo' : 'Novo Conteúdo'}</DialogTitle>
              <DialogDescription>
                Planeje seu próximo conteúdo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: 5 Dicas de Produtividade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_text">Descrição</Label>
                <Textarea
                  id="content_text"
                  value={formData.content_text}
                  onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                  placeholder="Descreva o conteúdo..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value: any) => setFormData({ ...formData, platform: value })}
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
                  <Label htmlFor="format">Formato</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value: any) => setFormData({ ...formData, format: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATS.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format.charAt(0).toUpperCase() + format.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Data de Publicação</Label>
                  <Input
                    id="scheduled_date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  />
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

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isCreating || isUpdating || !formData.title.trim()}
                  className="flex-1"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingContent ? 'Salvar' : 'Criar'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {calendar.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Calendário Vazio</h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não planejou nenhum conteúdo
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Planejar Primeiro Conteúdo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calendar.map((content) => (
            <Card key={content.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base line-clamp-2 flex-1">
                    {content.title}
                  </CardTitle>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDialog(content)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(content.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {content.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {content.format}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="text-xs text-white"
                    style={{ backgroundColor: STATUS_CONFIG[content.status as keyof typeof STATUS_CONFIG]?.color }}
                  >
                    {STATUS_CONFIG[content.status as keyof typeof STATUS_CONFIG]?.label || 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {content.content_text && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {content.content_text}
                  </p>
                )}
                {content.scheduled_date && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {format(new Date(content.scheduled_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
