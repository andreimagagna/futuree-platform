import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContentPillars, useCreateContentPillar, useUpdateContentPillar, useDeleteContentPillar } from '@/hooks/useCreatorAPI';
import { Plus, Target, TrendingUp, Users, DollarSign, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OBJECTIVE_CONFIG = {
  attraction: { label: 'Atração', icon: Users, color: 'bg-blue-500' },
  authority: { label: 'Autoridade', icon: Target, color: 'bg-purple-500' },
  engagement: { label: 'Engajamento', icon: TrendingUp, color: 'bg-green-500' },
  conversion: { label: 'Conversão', icon: DollarSign, color: 'bg-orange-500' },
};

const PILLAR_COLORS = [
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#eab308', label: 'Amarelo' },
  { value: '#22c55e', label: 'Verde' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#ec4899', label: 'Rosa' },
];

export function ContentPillarsManager() {
  const { toast } = useToast();
  const { data: pillars = [], isLoading } = useContentPillars();
  const { mutate: createPillar, isPending: isCreating } = useCreateContentPillar();
  const { mutate: updatePillar, isPending: isUpdating } = useUpdateContentPillar();
  const { mutate: deletePillar } = useDeleteContentPillar();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PILLAR_COLORS[0].value,
    objective: 'attraction' as 'attraction' | 'authority' | 'engagement' | 'conversion',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: PILLAR_COLORS[0].value,
      objective: 'attraction',
    });
    setEditingPillar(null);
  };

  const handleOpenDialog = (pillar?: any) => {
    if (pillar) {
      setFormData({
        name: pillar.name || '',
        description: pillar.description || '',
        color: pillar.color || PILLAR_COLORS[0].value,
        objective: pillar.objective || 'attraction',
      });
      setEditingPillar(pillar);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'O pilar precisa ter um nome.',
        variant: 'destructive',
      });
      return;
    }

    if (editingPillar) {
      updatePillar(
        { id: editingPillar.id, data: formData },
        {
          onSuccess: () => {
            toast({ title: 'Pilar atualizado!', description: 'Suas alterações foram salvas.' });
            setIsDialogOpen(false);
            resetForm();
          },
          onError: () => {
            toast({ title: 'Erro ao atualizar', variant: 'destructive' });
          },
        }
      );
    } else {
      createPillar(formData, {
        onSuccess: () => {
          toast({ title: 'Pilar criado!', description: 'Novo pilar adicionado com sucesso.' });
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
    if (!confirm('Tem certeza que deseja excluir este pilar?')) return;

    deletePillar(id, {
      onSuccess: () => {
        toast({ title: 'Pilar excluído', description: 'O pilar foi removido.' });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pilares de Conteúdo</h3>
          <p className="text-sm text-muted-foreground">
            Defina os temas principais do seu conteúdo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Pilar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPillar ? 'Editar Pilar' : 'Novo Pilar'}</DialogTitle>
              <DialogDescription>
                Crie pilares estratégicos para organizar seu conteúdo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pilar *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Dicas de Produtividade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o foco deste pilar..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Objetivo</Label>
                <Select
                  value={formData.objective}
                  onValueChange={(value: any) => setFormData({ ...formData, objective: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(OBJECTIVE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="w-4 h-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PILLAR_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`h-10 rounded-lg border-2 transition-all ${
                        formData.color === color.value ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isCreating || isUpdating || !formData.name.trim()}
                  className="flex-1"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingPillar ? 'Salvar' : 'Criar'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pillars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum pilar criado</h3>
            <p className="text-muted-foreground mb-4">
              Crie pilares para organizar seu conteúdo estrategicamente
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Pilar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar) => {
            const ObjectiveIcon = OBJECTIVE_CONFIG[pillar.objective as keyof typeof OBJECTIVE_CONFIG]?.icon || Target;
            return (
              <Card key={pillar.id} className="relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: pillar.color || '#3b82f6' }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ObjectiveIcon className="w-5 h-5" />
                        {pillar.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {OBJECTIVE_CONFIG[pillar.objective as keyof typeof OBJECTIVE_CONFIG]?.label || 'Atração'}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenDialog(pillar)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(pillar.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {pillar.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pillar.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
