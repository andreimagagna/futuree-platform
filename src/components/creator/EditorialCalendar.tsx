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
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Instagram, Youtube, TrendingUp } from 'lucide-react';
import type { EditorialCalendarItem, SocialChannel, ContentFormat } from '@/types/creator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CHANNEL_ICONS: Record<SocialChannel, any> = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: TrendingUp,
  twitter: TrendingUp,
  linkedin: TrendingUp,
  blog: TrendingUp,
  podcast: TrendingUp,
  other: TrendingUp,
};

const CHANNEL_LABELS: Record<SocialChannel, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  blog: 'Blog',
  podcast: 'Podcast',
  other: 'Outro',
};

const FORMAT_LABELS: Record<ContentFormat, string> = {
  post: 'Post',
  reel: 'Reel',
  story: 'Story',
  carousel: 'Carrossel',
  video: 'Vídeo',
  short: 'Short',
  article: 'Artigo',
  thread: 'Thread',
  live: 'Live',
  podcast: 'Podcast',
};

export function EditorialCalendar() {
  const { calendar, pillars, addCalendarItem, updateCalendarItem, deleteCalendarItem, updateContentStatus } =
    useCreatorSolutions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditorialCalendarItem | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [formData, setFormData] = useState<Partial<EditorialCalendarItem>>({
    title: '',
    description: '',
    pillarId: '',
    channel: 'instagram',
    format: 'post',
    scheduledDate: new Date().toISOString().split('T')[0],
    status: 'idea',
    hashtags: [],
    notes: '',
  });

  const [newHashtag, setNewHashtag] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      pillarId: '',
      channel: 'instagram',
      format: 'post',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'idea',
      hashtags: [],
      notes: '',
    });
    setNewHashtag('');
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: EditorialCalendarItem) => {
    if (item) {
      setFormData(item);
      setEditingItem(item);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.pillarId) return;

    const itemData: Omit<EditorialCalendarItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description || '',
      pillarId: formData.pillarId!,
      channel: formData.channel || 'instagram',
      format: formData.format || 'post',
      scheduledDate: formData.scheduledDate || new Date().toISOString(),
      status: formData.status || 'idea',
      hashtags: formData.hashtags,
      storytelling: formData.storytelling,
      notes: formData.notes,
      metadata: formData.metadata,
    };

    if (editingItem) {
      updateCalendarItem(editingItem.id, itemData);
    } else {
      addCalendarItem({
        ...itemData,
        id: `content-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const addHashtag = () => {
    if (!newHashtag.trim()) return;
    const tag = newHashtag.trim().startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
    setFormData({
      ...formData,
      hashtags: [...(formData.hashtags || []), tag],
    });
    setNewHashtag('');
  };

  const removeHashtag = (tag: string) => {
    setFormData({
      ...formData,
      hashtags: formData.hashtags?.filter((t) => t !== tag),
    });
  };

  const getPillar = (pillarId: string) => {
    return pillars.find((p) => p.id === pillarId);
  };

  const sortedCalendar = [...calendar].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendário Editorial</h2>
          <p className="text-muted-foreground">Planeje e organize suas publicações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            {viewMode === 'list' ? 'Visão Calendário' : 'Visão Lista'}
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Conteúdo
          </Button>
        </div>
      </div>

      {sortedCalendar.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Calendário vazio</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Comece adicionando seus primeiros conteúdos planejados
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Conteúdo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedCalendar.map((item) => {
            const pillar = getPillar(item.pillarId);
            const ChannelIcon = CHANNEL_ICONS[item.channel];

            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Date */}
                    <div className="flex-shrink-0 text-center">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">
                          {format(new Date(item.scheduledDate), 'd', { locale: ptBR })}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {format(new Date(item.scheduledDate), 'MMM', { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {pillar && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: pillar.color }}
                              />
                            )}
                            <h3 className="font-semibold">{item.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              if (confirm('Excluir este conteúdo?')) {
                                deleteCalendarItem(item.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <ChannelIcon className="w-3 h-3" />
                          {CHANNEL_LABELS[item.channel]}
                        </Badge>
                        <Badge variant="outline">{FORMAT_LABELS[item.format]}</Badge>
                        {pillar && <Badge variant="secondary">{pillar.name}</Badge>}
                        <Badge
                          variant={
                            item.status === 'published'
                              ? 'default'
                              : item.status === 'produced'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {item.status === 'idea' && 'Ideia'}
                          {item.status === 'draft' && 'Rascunho'}
                          {item.status === 'produced' && 'Produzido'}
                          {item.status === 'published' && 'Publicado'}
                        </Badge>
                      </div>

                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.hashtags.slice(0, 5).map((tag) => (
                            <span key={tag} className="text-xs text-primary">
                              {tag}
                            </span>
                          ))}
                          {item.hashtags.length > 5 && (
                            <span className="text-xs text-muted-foreground">+{item.hashtags.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Conteúdo' : 'Novo Conteúdo Planejado'}</DialogTitle>
            <DialogDescription>Adicione um novo conteúdo ao seu calendário editorial</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-title">Título *</Label>
              <Input
                id="content-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: 5 dicas para aumentar produtividade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-description">Descrição / Roteiro</Label>
              <Textarea
                id="content-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o conteúdo, roteiro, pontos principais..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Pilar *</Label>
                <Select
                  value={formData.pillarId}
                  onValueChange={(value) => setFormData({ ...formData, pillarId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
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
                <Label>Canal</Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value: any) => setFormData({ ...formData, channel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value: any) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FORMAT_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled-date">Data Programada</Label>
                <Input
                  id="scheduled-date"
                  type="date"
                  value={formData.scheduledDate?.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>

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
                    <SelectItem value="idea">Ideia</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="produced">Produzido</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hashtags</Label>
              <div className="flex gap-2">
                <Input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  placeholder="Ex: produtividade"
                />
                <Button type="button" onClick={addHashtag} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.hashtags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeHashtag(tag)}>×</button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas / Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Anotações adicionais, lembretes, etc..."
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!formData.title || !formData.pillarId} className="flex-1">
                {editingItem ? 'Salvar Alterações' : 'Adicionar ao Calendário'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
