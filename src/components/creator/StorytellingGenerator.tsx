import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCreatorSolutions } from '@/store/creatorSolutionsStore';
import { Sparkles, Copy, RefreshCw, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function StorytellingGenerator() {
  const { templates, identity, calendar, updateCalendarItem } = useCreatorSolutions();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0]?.id || '');
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState({
    hook: '',
    story: '',
    value: '',
    cta: '',
  });

  const handleGenerate = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    // Aqui você pode implementar uma lógica mais sofisticada de geração
    // Por enquanto, vamos usar os templates com variações baseadas na identidade do creator
    const personalizedStory = {
      hook: template.structure.hook,
      story: template.structure.story,
      value: template.structure.value,
      cta: template.structure.cta,
    };

    // Se há identidade definida, podemos personalizar mais
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

  const handleCopyToClipboard = () => {
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
        <h2 className="text-2xl font-bold">Gerador de Storytelling</h2>
        <p className="text-muted-foreground">
          Crie histórias envolventes usando templates estratégicos
        </p>
      </div>

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
              <Button onClick={handleCopyToClipboard} variant="outline" className="flex-1">
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

      {/* Tips Section */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Dicas para um Storytelling Matador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>
                <strong>Gancho:</strong> Comece com algo que cause curiosidade ou identificação instantânea
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>
                <strong>História:</strong> Use detalhes específicos e emoções reais para criar conexão
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>
                <strong>Valor:</strong> Entregue um insight, dica ou aprendizado concreto e aplicável
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>
                <strong>CTA:</strong> Termine com uma ação clara que incentive engajamento
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
