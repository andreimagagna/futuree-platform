import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatorSolutions } from '@/store/creatorSolutionsStore';
import { Plus, Target, TrendingUp, Users, DollarSign, Edit, Trash2, X } from 'lucide-react';
import type { ContentPillar } from '@/types/creator';

const OBJECTIVE_CONFIG = {
  attraction: { label: 'Atração', icon: Users, color: 'bg-primary' },
  authority: { label: 'Autoridade', icon: Target, color: 'bg-accent' },
  engagement: { label: 'Engajamento', icon: TrendingUp, color: 'bg-success' },
  conversion: { label: 'Conversão', icon: DollarSign, color: 'bg-warning' },
};

const PILLAR_COLORS = [
  { value: 'hsl(0, 50%, 45%)', label: 'Vermelho Terroso' },
  { value: 'hsl(35, 60%, 55%)', label: 'Laranja' },
  { value: 'hsl(45, 70%, 50%)', label: 'Amarelo' },
  { value: 'hsl(140, 30%, 40%)', label: 'Verde' },
  { value: 'hsl(180, 25%, 45%)', label: 'Turquesa' },
  { value: 'hsl(200, 15%, 45%)', label: 'Cinza Azulado' },
  { value: 'hsl(25, 40%, 35%)', label: 'Marrom Quente' },
  { value: 'hsl(30, 10%, 45%)', label: 'Cinza-Marrom' },
];

export function ContentPillarsManager() {
  const { pillars, addPillar, updatePillar, deletePillar } = useCreatorSolutions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<ContentPillar | null>(null);

  const [formData, setFormData] = useState<Partial<ContentPillar>>({
    name: '',
    description: '',
    color: PILLAR_COLORS[0].value,
    objective: 'attraction',
    keywords: [],
    examples: [],
    frequency: 1,
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newExample, setNewExample] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: PILLAR_COLORS[0].value,
      objective: 'attraction',
      keywords: [],
      examples: [],
      frequency: 1,
    });
    setNewKeyword('');
    setNewExample('');
    setEditingPillar(null);
  };

  const handleOpenDialog = (pillar?: ContentPillar) => {
    if (pillar) {
      setFormData(pillar);
      setEditingPillar(pillar);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) return;

    const pillarData: ContentPillar = {
      id: editingPillar?.id || `pillar-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      color: formData.color || PILLAR_COLORS[0].value,
      objective: formData.objective || 'attraction',
      keywords: formData.keywords || [],
      examples: formData.examples || [],
      frequency: formData.frequency,
    };

    if (editingPillar) {
      updatePillar(editingPillar.id, pillarData);
    } else {
      addPillar(pillarData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pilar?')) {
      deletePillar(id);
    }
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setFormData({
      ...formData,
      keywords: [...(formData.keywords || []), newKeyword.trim()],
    });
    setNewKeyword('');
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords?.filter((k) => k !== keyword),
    });
  };

  const addExample = () => {
    if (!newExample.trim()) return;
    setFormData({
      ...formData,
      examples: [...(formData.examples || []), newExample.trim()],
    });
    setNewExample('');
  };

  const removeExample = (example: string) => {
    setFormData({
      ...formData,
      examples: formData.examples?.filter((e) => e !== example),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pilares de Conteúdo</h2>
          <p className="text-muted-foreground">
            Defina de 3 a 5 pilares que representem a essência do seu conteúdo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Pilar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPillar ? 'Editar Pilar' : 'Novo Pilar de Conteúdo'}</DialogTitle>
              <DialogDescription>
                Defina um pilar estratégico para organizar seu conteúdo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pillar-name">Nome do Pilar *</Label>
                <Input
                  id="pillar-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Educação Financeira, Mindset, Produtividade..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pillar-description">Descrição *</Label>
                <Textarea
                  id="pillar-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva do que se trata esse pilar e por que é importante"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PILLAR_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Objetivo</Label>
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
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Palavras-chave</Label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Adicione palavras-chave relacionadas"
                  />
                  <Button type="button" onClick={addKeyword} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords?.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Exemplos de Temas</Label>
                <div className="flex gap-2">
                  <Input
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExample())}
                    placeholder="Ex: Como economizar 30% da renda"
                  />
                  <Button type="button" onClick={addExample} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ul className="space-y-1 mt-2">
                  {formData.examples?.map((example, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">•</span>
                      <span className="flex-1">{example}</span>
                      <X
                        className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive"
                        onClick={() => removeExample(example)}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência Semanal Ideal</Label>
                <Input
                  id="frequency"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={!formData.name || !formData.description} className="flex-1">
                  {editingPillar ? 'Salvar Alterações' : 'Criar Pilar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pillars.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum pilar criado ainda</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Comece criando seus primeiros pilares de conteúdo
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
            const ObjectiveIcon = OBJECTIVE_CONFIG[pillar.objective].icon;
            return (
              <Card key={pillar.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: pillar.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{pillar.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <ObjectiveIcon className="w-3 h-3" />
                          {OBJECTIVE_CONFIG[pillar.objective].label}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(pillar)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(pillar.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{pillar.description}</p>
                  
                  {pillar.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {pillar.keywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {pillar.keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{pillar.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {pillar.frequency && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">{pillar.frequency}x</span> por semana
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
