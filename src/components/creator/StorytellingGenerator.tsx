import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatorSolutions } from '@/store/creatorSolutionsStore';
import { Sparkles, Copy, BookOpen, Layers, Target, Heart, TrendingUp, Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FRAMEWORKS = [
  {
    id: 'framework-1',
    name: 'Hook - Story - Value - CTA',
    category: 'Storytelling',
    description: 'Estrutura clássica para engajamento e conversão',
    icon: Heart,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    structure: [
      { label: 'Hook (Gancho)', placeholder: 'Comece com algo que prenda a atenção imediatamente...', key: 'hook' },
      { label: 'Story (História)', placeholder: 'Conte uma história relevante, use detalhes e emoções...', key: 'story' },
      { label: 'Value (Valor)', placeholder: 'Entregue o aprendizado, insight ou dica prática...', key: 'value' },
      { label: 'CTA (Chamada)', placeholder: 'Termine com uma ação clara e específica...', key: 'cta' },
    ],
    tips: [
      'O gancho deve gerar curiosidade ou identificação em 3 segundos',
      'Use storytelling com detalhes específicos para criar conexão emocional',
      'O valor precisa ser aplicável e útil para sua audiência',
      'CTA deve ser clara e de fácil execução',
    ],
  },
  {
    id: 'framework-2',
    name: 'Problema - Agitação - Solução (PAS)',
    category: 'Vendas',
    description: 'Framework poderoso para despertar necessidade e oferecer solução',
    icon: Target,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    structure: [
      { label: 'Problema', placeholder: 'Identifique o problema real que sua audiência enfrenta...', key: 'problem' },
      { label: 'Agitação', placeholder: 'Intensifique a dor, mostre as consequências de não resolver...', key: 'agitate' },
      { label: 'Solução', placeholder: 'Apresente sua solução de forma clara e acessível...', key: 'solution' },
    ],
    tips: [
      'Seja específico sobre o problema - use situações reais',
      'Agite com empatia, não com manipulação',
      'A solução deve parecer natural e inevitável',
    ],
  },
  {
    id: 'framework-3',
    name: 'AIDA (Atenção - Interesse - Desejo - Ação)',
    category: 'Marketing',
    description: 'Framework clássico de marketing para conduzir à ação',
    icon: TrendingUp,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    structure: [
      { label: 'Atenção', placeholder: 'Capture a atenção com título ou abertura impactante...', key: 'attention' },
      { label: 'Interesse', placeholder: 'Desperte interesse mostrando relevância...', key: 'interest' },
      { label: 'Desejo', placeholder: 'Crie desejo mostrando benefícios e transformação...', key: 'desire' },
      { label: 'Ação', placeholder: 'Conduza à ação com CTA clara e urgência...', key: 'action' },
    ],
    tips: [
      'Atenção: Use números, perguntas ou afirmações ousadas',
      'Interesse: Mostre "o que tem pra mim?"',
      'Desejo: Pinte a visão da transformação',
      'Ação: Remova obstáculos e facilite o próximo passo',
    ],
  },
  {
    id: 'framework-4',
    name: 'Antes - Depois - Ponte',
    category: 'Transformação',
    description: 'Mostre a jornada de transformação',
    icon: Lightbulb,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    structure: [
      { label: 'Antes', placeholder: 'Descreva a situação inicial, os desafios e frustrações...', key: 'before' },
      { label: 'Depois', placeholder: 'Mostre o resultado final, a transformação alcançada...', key: 'after' },
      { label: 'Ponte', placeholder: 'Revele o que possibilitou a transformação...', key: 'bridge' },
    ],
    tips: [
      'O "antes" deve ser relatable - algo que a audiência reconheça',
      'O "depois" deve ser aspiracional mas realista',
      'A "ponte" é onde você se posiciona como guia',
    ],
  },
];

export function StorytellingGenerator() {
  const { templates, identity, calendar, updateCalendarItem } = useCreatorSolutions();
  const { toast } = useToast();
  
  // Framework mode state
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);
  const [frameworkContent, setFrameworkContent] = useState<Record<string, string>>({});

  // Storytelling mode state
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0]?.id || '');
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState({
    hook: '',
    story: '',
    value: '',
    cta: '',
  });

  const handleFrameworkChange = (framework: typeof FRAMEWORKS[0]) => {
    setSelectedFramework(framework);
    // Reset content when changing framework
    const newContent: Record<string, string> = {};
    framework.structure.forEach(field => {
      newContent[field.key] = '';
    });
    setFrameworkContent(newContent);
  };

  const handleContentChange = (key: string, value: string) => {
    setFrameworkContent(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyFramework = () => {
    const sections = selectedFramework.structure.map(field => {
      const content = frameworkContent[field.key] || '';
      return `${field.label.toUpperCase()}:\n${content || '(vazio)'}`;
    });
    
    const fullText = `Framework: ${selectedFramework.name}\n\n${sections.join('\n\n')}`;

    navigator.clipboard.writeText(fullText);
    toast({
      title: 'Copiado!',
      description: 'Framework copiado para a área de transferência.',
    });
  };

  const handleClear = () => {
    const newContent: Record<string, string> = {};
    selectedFramework.structure.forEach(field => {
      newContent[field.key] = '';
    });
    setFrameworkContent(newContent);
    toast({
      title: 'Limpo!',
      description: 'Conteúdo do framework foi limpo.',
    });
  };

  // Storytelling functions
  const handleGenerate = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    const personalizedStory = {
      hook: template.structure.hook,
      story: template.structure.story,
      value: template.structure.value,
      cta: template.structure.cta,
    };

    if (identity) {
      personalizedStory.hook = personalizedStory.hook.replace(
        '[situação problema]',
        'um desafio comum na minha jornada'
      );
    }

    setGeneratedStory(personalizedStory);

    toast({
      title: 'Storytelling gerado!',
      description: 'Agora você pode editar e personalizar conforme necessário.',
    });
  };

  const handleApplyToContent = () => {
    if (!selectedContent) {
      toast({
        title: 'Selecione um conteúdo',
        description: 'Escolha um conteúdo do calendário para aplicar o storytelling.',
        variant: 'destructive',
      });
      return;
    }

    updateCalendarItem(selectedContent, {
      storytelling: generatedStory,
    });

    toast({
      title: 'Storytelling aplicado!',
      description: 'O storytelling foi adicionado ao conteúdo selecionado.',
    });
  };

  const handleCopyStory = () => {
    const fullText = `
GANCHO:
${generatedStory.hook}

HISTÓRIA:
${generatedStory.story}

VALOR:
${generatedStory.value}

CALL TO ACTION:
${generatedStory.cta}
    `.trim();

    navigator.clipboard.writeText(fullText);
    toast({
      title: 'Copiado!',
      description: 'Storytelling copiado para a área de transferência.',
    });
  };

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          Storytelling & Frameworks
        </h2>
        <p className="text-muted-foreground">
          Crie conteúdos impactantes usando templates e frameworks estratégicos
        </p>
      </div>

      <Tabs defaultValue="frameworks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="frameworks" className="gap-2">
            <Layers className="w-4 h-4" />
            Frameworks
          </TabsTrigger>
          <TabsTrigger value="storytelling" className="gap-2">
            <Heart className="w-4 h-4" />
            Storytelling Generator
          </TabsTrigger>
        </TabsList>

        {/* FRAMEWORKS TAB */}
        <TabsContent value="frameworks" className="space-y-6">

          {/* Framework Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FRAMEWORKS.map((framework) => {
              const Icon = framework.icon;
              const isSelected = selectedFramework.id === framework.id;
              
              return (
                <Card
                  key={framework.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleFrameworkChange(framework)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className={`w-12 h-12 rounded-lg ${framework.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${framework.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{framework.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{framework.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {framework.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Framework Details */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Sobre o Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{selectedFramework.name}</h3>
                  <Badge variant="outline">{selectedFramework.category}</Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedFramework.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-semibold">Estrutura:</h4>
                  <div className="space-y-1">
                    {selectedFramework.structure.map((field, idx) => (
                      <div key={field.key} className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">{idx + 1}.</span>
                        <span className="text-sm">{field.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-semibold">Dicas:</h4>
                  <ul className="space-y-1">
                    {selectedFramework.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5 text-xs">•</span>
                        <span className="text-xs text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Framework Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Desenvolva seu Conteúdo
                    </CardTitle>
                    <CardDescription>Preencha cada seção do framework</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      Limpar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyFramework}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFramework.structure.map((field, idx) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {idx + 1}
                      </span>
                      {field.label}
                    </Label>
                    <Textarea
                      id={field.key}
                      value={frameworkContent[field.key] || ''}
                      onChange={(e) => handleContentChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={idx === 0 ? 2 : 3}
                      className="resize-none"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Framework Tips */}
          <Card className="border-primary/20 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Como Usar os Frameworks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>
                    <strong>Escolha o framework certo:</strong> Cada framework tem um propósito específico
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>
                    <strong>Siga a ordem:</strong> A sequência das seções é importante para guiar a audiência
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>
                    <strong>Adapte ao seu estilo:</strong> Use os frameworks como guia, mas mantenha sua voz autêntica
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STORYTELLING TAB */}
        <TabsContent value="storytelling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Templates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Templates de Storytelling
                </CardTitle>
                <CardDescription>Escolha um template para começar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplateData && (
                  <div className="space-y-3">
                    <div>
                      <Badge variant="secondary">{selectedTemplateData.useCase}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTemplateData.description}</p>

                    <div className="space-y-2 pt-2 border-t">
                      <h4 className="text-sm font-semibold">Estrutura do Template:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-muted p-2 rounded">
                          <span className="font-medium text-xs text-muted-foreground">GANCHO:</span>
                          <p className="mt-1">{selectedTemplateData.structure.hook}</p>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <span className="font-medium text-xs text-muted-foreground">HISTÓRIA:</span>
                          <p className="mt-1">{selectedTemplateData.structure.story}</p>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <span className="font-medium text-xs text-muted-foreground">VALOR:</span>
                          <p className="mt-1">{selectedTemplateData.structure.value}</p>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <span className="font-medium text-xs text-muted-foreground">CTA:</span>
                          <p className="mt-1">{selectedTemplateData.structure.cta}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleGenerate} className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Storytelling
                </Button>
              </CardContent>
            </Card>

            {/* Generated Story Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Storytelling Gerado
                </CardTitle>
                <CardDescription>Edite e personalize conforme necessário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hook">Gancho (Hook)</Label>
                  <Textarea
                    id="hook"
                    value={generatedStory.hook}
                    onChange={(e) => setGeneratedStory({ ...generatedStory, hook: e.target.value })}
                    placeholder="O gancho inicial que prende a atenção..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="story">História (Story)</Label>
                  <Textarea
                    id="story"
                    value={generatedStory.story}
                    onChange={(e) => setGeneratedStory({ ...generatedStory, story: e.target.value })}
                    placeholder="A história ou contexto que você quer contar..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor (Value)</Label>
                  <Textarea
                    id="value"
                    value={generatedStory.value}
                    onChange={(e) => setGeneratedStory({ ...generatedStory, value: e.target.value })}
                    placeholder="O aprendizado ou valor que você entrega..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta">Call to Action (CTA)</Label>
                  <Textarea
                    id="cta"
                    value={generatedStory.cta}
                    onChange={(e) => setGeneratedStory({ ...generatedStory, cta: e.target.value })}
                    placeholder="A chamada para ação..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label>Aplicar ao Conteúdo (opcional)</Label>
                  <Select value={selectedContent} onValueChange={setSelectedContent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um conteúdo do calendário" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendar
                        .filter((item) => item.status !== 'published')
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCopyStory} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    onClick={handleApplyToContent}
                    disabled={!selectedContent}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Storytelling Tips */}
          <Card className="border-primary/20 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Dicas para um Storytelling Matador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>
                    <strong>Gancho:</strong> Comece com algo que cause curiosidade ou identificação instantânea
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>
                    <strong>História:</strong> Use detalhes específicos e emoções reais para criar conexão
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>
                    <strong>Valor:</strong> Entregue um insight, dica ou aprendizado concreto e aplicável
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>
                    <strong>CTA:</strong> Termine com uma ação clara que incentive engajamento
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
