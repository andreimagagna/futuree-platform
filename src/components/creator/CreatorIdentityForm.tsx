import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCreatorSolutions } from '@/store/creatorSolutionsStore';
import { Sparkles, User, Heart, Target, MessageSquare, Plus, X } from 'lucide-react';
import type { CreatorIdentity } from '@/types/creator';

export function CreatorIdentityForm() {
  const { identity, setIdentity, updateIdentity } = useCreatorSolutions();
  const [isEditing, setIsEditing] = useState(!identity);

  const [formData, setFormData] = useState<Partial<CreatorIdentity>>(
    identity || {
      name: '',
      positioning: '',
      personality: [],
      purpose: '',
      voiceAndTone: {
        voice: '',
        tone: '',
        vocabulary: [],
      },
      storytelling: {
        origin: '',
        journey: '',
        impact: '',
        differentials: [],
      },
    }
  );

  const [newPersonalityTrait, setNewPersonalityTrait] = useState('');
  const [newVocabularyWord, setNewVocabularyWord] = useState('');
  const [newDifferential, setNewDifferential] = useState('');

  const handleSave = () => {
    if (!formData.name) return;

    const identityData: CreatorIdentity = {
      id: identity?.id || `identity-${Date.now()}`,
      name: formData.name,
      positioning: formData.positioning || '',
      personality: formData.personality || [],
      purpose: formData.purpose || '',
      voiceAndTone: formData.voiceAndTone || { voice: '', tone: '', vocabulary: [] },
      storytelling: formData.storytelling || { origin: '', journey: '', impact: '', differentials: [] },
      createdAt: identity?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (identity) {
      updateIdentity(identityData);
    } else {
      setIdentity(identityData);
    }

    setIsEditing(false);
  };

  const addPersonalityTrait = () => {
    if (!newPersonalityTrait.trim()) return;
    setFormData({
      ...formData,
      personality: [...(formData.personality || []), newPersonalityTrait.trim()],
    });
    setNewPersonalityTrait('');
  };

  const removePersonalityTrait = (trait: string) => {
    setFormData({
      ...formData,
      personality: formData.personality?.filter((t) => t !== trait),
    });
  };

  const addVocabularyWord = () => {
    if (!newVocabularyWord.trim()) return;
    setFormData({
      ...formData,
      voiceAndTone: {
        ...formData.voiceAndTone!,
        vocabulary: [...(formData.voiceAndTone?.vocabulary || []), newVocabularyWord.trim()],
      },
    });
    setNewVocabularyWord('');
  };

  const removeVocabularyWord = (word: string) => {
    setFormData({
      ...formData,
      voiceAndTone: {
        ...formData.voiceAndTone!,
        vocabulary: formData.voiceAndTone?.vocabulary.filter((w) => w !== word) || [],
      },
    });
  };

  const addDifferential = () => {
    if (!newDifferential.trim()) return;
    setFormData({
      ...formData,
      storytelling: {
        ...formData.storytelling!,
        differentials: [...(formData.storytelling?.differentials || []), newDifferential.trim()],
      },
    });
    setNewDifferential('');
  };

  const removeDifferential = (diff: string) => {
    setFormData({
      ...formData,
      storytelling: {
        ...formData.storytelling!,
        differentials: formData.storytelling?.differentials.filter((d) => d !== diff) || [],
      },
    });
  };

  if (!isEditing && identity) {
    return (
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {identity.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-2xl">{identity.name}</CardTitle>
                  <CardDescription className="text-base">{identity.positioning}</CardDescription>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Editar Identidade
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Personality & Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personalidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {identity.personality.map((trait) => (
                  <Badge key={trait} variant="secondary">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Propósito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{identity.purpose}</p>
            </CardContent>
          </Card>
        </div>

        {/* Voice & Tone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Voz e Tom
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Voz</Label>
                <p className="font-medium">{identity.voiceAndTone.voice}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tom</Label>
                <p className="font-medium">{identity.voiceAndTone.tone}</p>
              </div>
            </div>
            {identity.voiceAndTone.vocabulary.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Vocabulário Característico</Label>
                <div className="flex flex-wrap gap-2">
                  {identity.voiceAndTone.vocabulary.map((word) => (
                    <Badge key={word} variant="outline">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storytelling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Storytelling Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Origem</Label>
              <p className="text-sm text-muted-foreground mt-1">{identity.storytelling.origin}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Jornada</Label>
              <p className="text-sm text-muted-foreground mt-1">{identity.storytelling.journey}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Impacto Desejado</Label>
              <p className="text-sm text-muted-foreground mt-1">{identity.storytelling.impact}</p>
            </div>
            {identity.storytelling.differentials.length > 0 && (
              <div>
                <Label className="text-sm font-semibold mb-2 block">Diferenciais</Label>
                <ul className="space-y-1">
                  {identity.storytelling.differentials.map((diff, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {identity ? 'Editar Identidade do Creator' : 'Criar Identidade do Creator'}
          </CardTitle>
          <CardDescription>
            Defina quem você é, o que você representa e como se comunica com seu público
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome e Posicionamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Creator *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="positioning">Posicionamento</Label>
              <Input
                id="positioning"
                value={formData.positioning}
                onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
                placeholder="Ex: Creator de produtividade para empreendedores"
              />
            </div>
          </div>

          {/* Propósito */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Propósito / Missão</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Ex: Ajudar empreendedores a otimizarem seu tempo e alcançarem mais resultados com menos esforço"
              rows={3}
            />
          </div>

          {/* Personalidade */}
          <div className="space-y-2">
            <Label>Traços de Personalidade</Label>
            <div className="flex gap-2">
              <Input
                value={newPersonalityTrait}
                onChange={(e) => setNewPersonalityTrait(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPersonalityTrait())}
                placeholder="Ex: Autêntico, Inspirador, Técnico..."
              />
              <Button type="button" onClick={addPersonalityTrait} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.personality?.map((trait) => (
                <Badge key={trait} variant="secondary" className="gap-1">
                  {trait}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removePersonalityTrait(trait)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Voz e Tom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voice">Voz</Label>
              <Input
                id="voice"
                value={formData.voiceAndTone?.voice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    voiceAndTone: { ...formData.voiceAndTone!, voice: e.target.value },
                  })
                }
                placeholder="Ex: Amigável, Profissional, Irreverente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tom</Label>
              <Input
                id="tone"
                value={formData.voiceAndTone?.tone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    voiceAndTone: { ...formData.voiceAndTone!, tone: e.target.value },
                  })
                }
                placeholder="Ex: Motivacional, Educativo, Humorístico"
              />
            </div>
          </div>

          {/* Vocabulário */}
          <div className="space-y-2">
            <Label>Vocabulário Característico</Label>
            <div className="flex gap-2">
              <Input
                value={newVocabularyWord}
                onChange={(e) => setNewVocabularyWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVocabularyWord())}
                placeholder="Palavras e expressões que você usa com frequência"
              />
              <Button type="button" onClick={addVocabularyWord} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.voiceAndTone?.vocabulary.map((word) => (
                <Badge key={word} variant="outline" className="gap-1">
                  {word}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeVocabularyWord(word)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Storytelling */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Storytelling Base</h3>
            
            <div className="space-y-2">
              <Label htmlFor="origin">Origem - De onde você veio?</Label>
              <Textarea
                id="origin"
                value={formData.storytelling?.origin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storytelling: { ...formData.storytelling!, origin: e.target.value },
                  })
                }
                placeholder="Conte sua história de origem, seu background, de onde começou..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="journey">Jornada - Como chegou até aqui?</Label>
              <Textarea
                id="journey"
                value={formData.storytelling?.journey}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storytelling: { ...formData.storytelling!, journey: e.target.value },
                  })
                }
                placeholder="Descreva sua trajetória, os desafios, as transformações..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impacto - Que diferença quer fazer?</Label>
              <Textarea
                id="impact"
                value={formData.storytelling?.impact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storytelling: { ...formData.storytelling!, impact: e.target.value },
                  })
                }
                placeholder="Qual impacto você deseja gerar nas pessoas que te seguem?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Diferenciais - O que te torna único?</Label>
              <div className="flex gap-2">
                <Input
                  value={newDifferential}
                  onChange={(e) => setNewDifferential(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDifferential())}
                  placeholder="Ex: 10 anos de experiência, metodologia própria..."
                />
                <Button type="button" onClick={addDifferential} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ul className="space-y-1 mt-2">
                {formData.storytelling?.differentials.map((diff, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-purple-500">•</span>
                    <span className="flex-1">{diff}</span>
                    <X className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive" onClick={() => removeDifferential(diff)} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            {identity && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            )}
            <Button onClick={handleSave} disabled={!formData.name} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              {identity ? 'Salvar Alterações' : 'Criar Identidade'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
