import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCreatorIdentity, useUpsertCreatorIdentity } from '@/hooks/useCreatorAPI';
import { Sparkles, User, Target, MessageSquare, Plus, X, Loader2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CreatorIdentityForm() {
  const { toast } = useToast();
  const { data: identity, isLoading } = useCreatorIdentity();
  const { mutate: upsertIdentity, isPending } = useUpsertCreatorIdentity();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    bio: '',
    target_audience: [] as string[],
    objectives: {
      attraction: false,
      authority: false,
      engagement: false,
      conversion: false,
    },
    tone_of_voice: '',
  });

  const [newAudience, setNewAudience] = useState('');

  useEffect(() => {
    if (identity) {
      setFormData({
        name: identity.name || '',
        niche: identity.niche || '',
        bio: identity.bio || '',
        target_audience: identity.target_audience || [],
        objectives: {
          attraction: identity.objectives?.attraction || false,
          authority: identity.objectives?.authority || false,
          engagement: identity.objectives?.engagement || false,
          conversion: identity.objectives?.conversion || false,
        },
        tone_of_voice: identity.tone_of_voice || '',
      });
    }
  }, [identity]);

  const handleSave = () => {
    if (!formData.name || !formData.niche) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome e nicho para continuar.',
        variant: 'destructive',
      });
      return;
    }

    upsertIdentity(formData, {
      onSuccess: () => {
        toast({
          title: 'Identidade salva!',
          description: 'Suas informações foram atualizadas com sucesso.',
        });
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast({
          title: 'Erro ao salvar',
          description: error.message || 'Tente novamente.',
          variant: 'destructive',
        });
      },
    });
  };

  const addAudience = () => {
    if (!newAudience.trim()) return;
    setFormData({
      ...formData,
      target_audience: [...formData.target_audience, newAudience.trim()],
    });
    setNewAudience('');
  };

  const removeAudience = (audience: string) => {
    setFormData({
      ...formData,
      target_audience: formData.target_audience.filter((a) => a !== audience),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando identidade...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isEditing && identity) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  {identity.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-2xl">{identity.name}</CardTitle>
                  <CardDescription className="text-base mt-1">{identity.niche}</CardDescription>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Bio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {identity.bio || 'Nenhuma bio definida'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {identity.objectives?.attraction && (
                  <Badge variant="secondary" className="gap-1">
                    <Users className="w-3 h-3" />
                    Atração
                  </Badge>
                )}
                {identity.objectives?.authority && (
                  <Badge variant="secondary" className="gap-1">
                    <Target className="w-3 h-3" />
                    Autoridade
                  </Badge>
                )}
                {identity.objectives?.engagement && (
                  <Badge variant="secondary" className="gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Engajamento
                  </Badge>
                )}
                {identity.objectives?.conversion && (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    Conversão
                  </Badge>
                )}
                {!Object.values(identity.objectives || {}).some(v => v) && (
                  <p className="text-sm text-muted-foreground">Nenhum objetivo definido</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {identity.target_audience && identity.target_audience.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Público-Alvo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {identity.target_audience.map((audience, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {audience}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {identity.tone_of_voice && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5" />
                Tom de Voz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {identity.tone_of_voice}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {identity ? 'Editar Identidade' : 'Criar Identidade do Creator'}
        </CardTitle>
        <CardDescription>
          Defina quem você é, seu nicho e como se comunica com seu público
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome / Nome Artístico *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome como creator"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="niche">Nicho *</Label>
            <Input
              id="niche"
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              placeholder="Ex: Design, Marketing, Tecnologia..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Conte um pouco sobre você e seu trabalho..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Público-Alvo</Label>
          <div className="flex gap-2">
            <Input
              value={newAudience}
              onChange={(e) => setNewAudience(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAudience())}
              placeholder="Ex: Empreendedores, Designers..."
            />
            <Button type="button" onClick={addAudience} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.target_audience.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.target_audience.map((audience, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1 px-3 py-1">
                  {audience}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeAudience(audience)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label>Objetivos de Conteúdo</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
              <input
                type="checkbox"
                id="attraction"
                checked={formData.objectives.attraction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    objectives: { ...formData.objectives, attraction: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="attraction" className="cursor-pointer flex-1">
                <span className="font-medium">Atração</span>
                <p className="text-xs text-muted-foreground">Conquistar novos seguidores</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
              <input
                type="checkbox"
                id="authority"
                checked={formData.objectives.authority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    objectives: { ...formData.objectives, authority: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="authority" className="cursor-pointer flex-1">
                <span className="font-medium">Autoridade</span>
                <p className="text-xs text-muted-foreground">Demonstrar expertise</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
              <input
                type="checkbox"
                id="engagement"
                checked={formData.objectives.engagement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    objectives: { ...formData.objectives, engagement: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="engagement" className="cursor-pointer flex-1">
                <span className="font-medium">Engajamento</span>
                <p className="text-xs text-muted-foreground">Criar conexão</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
              <input
                type="checkbox"
                id="conversion"
                checked={formData.objectives.conversion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    objectives: { ...formData.objectives, conversion: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="conversion" className="cursor-pointer flex-1">
                <span className="font-medium">Conversão</span>
                <p className="text-xs text-muted-foreground">Gerar vendas</p>
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone_of_voice">Tom de Voz</Label>
          <Textarea
            id="tone_of_voice"
            value={formData.tone_of_voice}
            onChange={(e) => setFormData({ ...formData, tone_of_voice: e.target.value })}
            placeholder="Ex: Inspirador e acessível, técnico mas didático, casual e bem-humorado..."
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSave} disabled={isPending || !formData.name || !formData.niche} className="flex-1">
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Sparkles className="w-4 h-4 mr-2" />
            Salvar Identidade
          </Button>
          {identity && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
