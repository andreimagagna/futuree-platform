import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Type,
  Heart,
  Target,
  Sparkles,
  Plus,
  X,
  Save,
  BookOpen,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface PrimalBranding {
  creationStory: string;
  creed: string;
  icons: string[];
  rituals: string[];
  pagans: string[];
  sacredWords: string[];
  leader: string;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  additional: string[];
}

interface Typography {
  primaryFont: string;
  secondaryFont: string;
  headingStyle: string;
  bodyStyle: string;
}

interface Manifesto {
  vision: string;
  mission: string;
  values: string[];
  purpose: string;
}

interface Positioning {
  targetAudience: string;
  problem: string;
  solution: string;
  differentiator: string;
  promise: string;
}

interface BrandingData {
  primalBranding: PrimalBranding;
  colorPalette: ColorPalette;
  typography: Typography;
  manifesto: Manifesto;
  positioning: Positioning;
}

const initialData: BrandingData = {
  primalBranding: {
    creationStory: '',
    creed: '',
    icons: [],
    rituals: [],
    pagans: [],
    sacredWords: [],
    leader: '',
  },
  colorPalette: {
    primary: '',
    secondary: '',
    accent: '',
    additional: [],
  },
  typography: {
    primaryFont: '',
    secondaryFont: '',
    headingStyle: '',
    bodyStyle: '',
  },
  manifesto: {
    vision: '',
    mission: '',
    values: [],
    purpose: '',
  },
  positioning: {
    targetAudience: '',
    problem: '',
    solution: '',
    differentiator: '',
    promise: '',
  },
};

export function Branding() {
  const [data, setData] = useLocalStorage<BrandingData>('branding-data', initialData);
  const [activeTab, setActiveTab] = useState('primal');
  const { toast } = useToast();

  const [newItem, setNewItem] = useState('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleSave = () => {
    toast({
      title: 'Branding salvo',
      description: 'Todas as informações foram salvas automaticamente',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
    toast({
      title: 'Copiado!',
      description: `${text} copiado para a área de transferência`,
    });
  };

  const addItem = (category: 'icons' | 'rituals' | 'pagans' | 'sacredWords' | 'values' | 'additional') => {
    if (!newItem.trim()) return;

    if (category === 'values') {
      setData({
        ...data,
        manifesto: {
          ...data.manifesto,
          values: [...data.manifesto.values, newItem.trim()],
        },
      });
    } else if (category === 'additional') {
      setData({
        ...data,
        colorPalette: {
          ...data.colorPalette,
          additional: [...data.colorPalette.additional, newItem.trim()],
        },
      });
    } else {
      setData({
        ...data,
        primalBranding: {
          ...data.primalBranding,
          [category]: [...data.primalBranding[category], newItem.trim()],
        },
      });
    }
    setNewItem('');
  };

  const removeItem = (category: 'icons' | 'rituals' | 'pagans' | 'sacredWords' | 'values' | 'additional', index: number) => {
    if (category === 'values') {
      setData({
        ...data,
        manifesto: {
          ...data.manifesto,
          values: data.manifesto.values.filter((_, i) => i !== index),
        },
      });
    } else if (category === 'additional') {
      setData({
        ...data,
        colorPalette: {
          ...data.colorPalette,
          additional: data.colorPalette.additional.filter((_, i) => i !== index),
        },
      });
    } else {
      setData({
        ...data,
        primalBranding: {
          ...data.primalBranding,
          [category]: data.primalBranding[category].filter((_, i) => i !== index),
        },
      });
    }
  };

  const completionPercentage = () => {
    let filled = 0;
    let total = 0;

    // Primal Branding
    total += 7;
    if (data.primalBranding.creationStory) filled++;
    if (data.primalBranding.creed) filled++;
    if (data.primalBranding.icons.length > 0) filled++;
    if (data.primalBranding.rituals.length > 0) filled++;
    if (data.primalBranding.pagans.length > 0) filled++;
    if (data.primalBranding.sacredWords.length > 0) filled++;
    if (data.primalBranding.leader) filled++;

    // Color Palette
    total += 3;
    if (data.colorPalette.primary) filled++;
    if (data.colorPalette.secondary) filled++;
    if (data.colorPalette.accent) filled++;

    // Typography
    total += 2;
    if (data.typography.primaryFont) filled++;
    if (data.typography.secondaryFont) filled++;

    // Manifesto
    total += 4;
    if (data.manifesto.vision) filled++;
    if (data.manifesto.mission) filled++;
    if (data.manifesto.values.length > 0) filled++;
    if (data.manifesto.purpose) filled++;

    // Positioning
    total += 5;
    if (data.positioning.targetAudience) filled++;
    if (data.positioning.problem) filled++;
    if (data.positioning.solution) filled++;
    if (data.positioning.differentiator) filled++;
    if (data.positioning.promise) filled++;

    return Math.round((filled / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            Branding
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `branding_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            toast({
              title: 'Exportado com sucesso',
              description: 'Seu branding foi exportado em JSON',
            });
          }}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completude do Branding</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={completionPercentage() === 100 ? "default" : "secondary"}>
                      {completionPercentage()}%
                    </Badge>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${completionPercentage()}%` }}
                  />
                </div>
                {completionPercentage() < 100 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Continue preenchendo para ter clareza total da sua marca
                  </p>
                )}
                {completionPercentage() === 100 && (
                  <p className="text-xs text-success mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Branding completo! Sua marca tem uma identidade sólida.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {[
                  data.primalBranding.creationStory,
                  data.primalBranding.creed,
                  data.primalBranding.leader,
                  data.colorPalette.primary,
                  data.typography.primaryFont,
                  data.manifesto.vision,
                  data.positioning.targetAudience
                ].filter(Boolean).length}
              </div>
              <div className="text-xs text-muted-foreground">seções preenchidas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="primal" className="gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Primal Branding</span>
            {[
              data.primalBranding.creationStory,
              data.primalBranding.creed,
              data.primalBranding.leader,
            ].filter(Boolean).length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {[
                  data.primalBranding.creationStory,
                  data.primalBranding.creed,
                  data.primalBranding.icons.length > 0,
                  data.primalBranding.rituals.length > 0,
                  data.primalBranding.pagans.length > 0,
                  data.primalBranding.sacredWords.length > 0,
                  data.primalBranding.leader,
                ].filter(Boolean).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="palette" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Paleta</span>
            {[data.colorPalette.primary, data.colorPalette.secondary, data.colorPalette.accent].filter(Boolean).length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {[data.colorPalette.primary, data.colorPalette.secondary, data.colorPalette.accent].filter(Boolean).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-2">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Tipografia</span>
            {[data.typography.primaryFont, data.typography.secondaryFont].filter(Boolean).length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {[data.typography.primaryFont, data.typography.secondaryFont].filter(Boolean).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="manifesto" className="gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Manifesto</span>
            {[data.manifesto.vision, data.manifesto.mission, data.manifesto.purpose].filter(Boolean).length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {[data.manifesto.vision, data.manifesto.mission, data.manifesto.values.length > 0, data.manifesto.purpose].filter(Boolean).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="positioning" className="gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Posicionamento</span>
            {[data.positioning.targetAudience, data.positioning.problem, data.positioning.solution].filter(Boolean).length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {[
                  data.positioning.targetAudience,
                  data.positioning.problem,
                  data.positioning.solution,
                  data.positioning.differentiator,
                  data.positioning.promise,
                ].filter(Boolean).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Primal Branding */}
        <TabsContent value="primal" className="space-y-6">
          {/* Info Card */}
          <Card className="border-primary/20 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Sobre Primal Branding</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Criado por Patrick Hanlon, o Primal Branding identifica 7 elementos que transformam produtos em movimentos culturais. 
                    Marcas como Apple, Nike e Starbucks usam esses princípios para criar comunidades leais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Os 7 Elementos do Primal Branding</CardTitle>
              <CardDescription>
                Construa uma marca que cria conexão emocional profunda com seu público
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="creationStory">1. História de Criação</Label>
                <p className="text-xs text-muted-foreground">
                  Exemplo: "Tudo começou quando percebi que pequenos empreendedores não tinham acesso a ferramentas profissionais de gestão..."
                </p>
                <Textarea
                  id="creationStory"
                  value={data.primalBranding.creationStory}
                  onChange={(e) => setData({
                    ...data,
                    primalBranding: { ...data.primalBranding, creationStory: e.target.value }
                  })}
                  placeholder="Por que sua marca existe? Qual é a história de origem? Conte o momento fundador, o problema que viu, a transformação que busca..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creed">2. Credo (Manifesto)</Label>
                <p className="text-xs text-muted-foreground">
                  Exemplo: "Acreditamos que todo empreendedor merece ter as mesmas ferramentas que grandes empresas. Acreditamos em transparência total..."
                </p>
                <Textarea
                  id="creed"
                  value={data.primalBranding.creed}
                  onChange={(e) => setData({
                    ...data,
                    primalBranding: { ...data.primalBranding, creed: e.target.value }
                  })}
                  placeholder="No que sua marca acredita? Quais são seus princípios fundamentais? Use frases como 'Acreditamos que...'"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>3. Ícones</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Símbolos visuais que representam sua marca
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Ex: Logo, mascote, cores específicas..."
                    onKeyDown={(e) => e.key === 'Enter' && addItem('icons')}
                  />
                  <Button onClick={() => addItem('icons')} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.primalBranding.icons.map((icon, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {icon}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeItem('icons', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>4. Rituais</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Ações repetitivas que conectam sua marca com os clientes
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Ex: Experiência de unboxing, ritual de boas-vindas..."
                    onKeyDown={(e) => e.key === 'Enter' && addItem('rituals')}
                  />
                  <Button onClick={() => addItem('rituals')} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.primalBranding.rituals.map((ritual, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {ritual}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeItem('rituals', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>5. Pagãos (Não-Clientes)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Quem NÃO é seu público? Definir isso ajuda a criar identidade
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Ex: Pessoas que buscam apenas preço..."
                    onKeyDown={(e) => e.key === 'Enter' && addItem('pagans')}
                  />
                  <Button onClick={() => addItem('pagans')} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.primalBranding.pagans.map((pagan, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {pagan}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeItem('pagans', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>6. Palavras Sagradas</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Linguagem única e jargões que criam senso de pertencimento
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Ex: Termos específicos, slogans..."
                    onKeyDown={(e) => e.key === 'Enter' && addItem('sacredWords')}
                  />
                  <Button onClick={() => addItem('sacredWords')} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.primalBranding.sacredWords.map((word, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {word}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeItem('sacredWords', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leader">7. Líder</Label>
                <Input
                  id="leader"
                  value={data.primalBranding.leader}
                  onChange={(e) => setData({
                    ...data,
                    primalBranding: { ...data.primalBranding, leader: e.target.value }
                  })}
                  placeholder="Quem é o rosto/liderança da marca?"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Color Palette */}
        <TabsContent value="palette" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paleta de Cores</CardTitle>
              <CardDescription>
                Defina as cores que representam a identidade visual da sua marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary"
                      type="color"
                      value={data.colorPalette.primary || '#000000'}
                      onChange={(e) => setData({
                        ...data,
                        colorPalette: { ...data.colorPalette, primary: e.target.value }
                      })}
                      className="h-10 w-20"
                    />
                    <Input
                      value={data.colorPalette.primary}
                      onChange={(e) => setData({
                        ...data,
                        colorPalette: { ...data.colorPalette, primary: e.target.value }
                      })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary"
                      type="color"
                      value={data.colorPalette.secondary || '#000000'}
                      onChange={(e) => setData({
                        ...data,
                        colorPalette: { ...data.colorPalette, secondary: e.target.value }
                      })}
                      className="h-10 w-20"
                    />
                    <Input
                      value={data.colorPalette.secondary}
                      onChange={(e) => setData({
                        ...data,
                        colorPalette: { ...data.colorPalette, secondary: e.target.value }
                      })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent">Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent"
                      type="color"
                      value={data.colorPalette.accent || '#000000'}
                      onChange={(e) => setData({
                        ...data,
                        colorPalette: { ...data.colorPalette, accent: e.target.value }
                      })}
                      className="h-10 w-20"
                    />
                    <Input
                      value={data.colorPalette.accent}
                      onChange={(e) => setData({
                        ...data,
                        colorPalette: { ...data.colorPalette, accent: e.target.value }
                      })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cores Adicionais</Label>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Ex: #FF5733"
                    onKeyDown={(e) => e.key === 'Enter' && addItem('additional')}
                  />
                  <Button onClick={() => addItem('additional')} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.colorPalette.additional.map((color, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-2"
                      style={{ backgroundColor: color, color: '#fff' }}
                    >
                      {color}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeItem('additional', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {(data.colorPalette.primary || data.colorPalette.secondary || data.colorPalette.accent) && (
                <div className="space-y-2">
                  <Label>Preview da Paleta</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {data.colorPalette.primary && (
                      <div className="space-y-2">
                        <div
                          className="h-24 rounded-lg border shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          style={{ backgroundColor: data.colorPalette.primary }}
                          onClick={() => copyToClipboard(data.colorPalette.primary)}
                          title="Clique para copiar"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Primária</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => copyToClipboard(data.colorPalette.primary)}
                          >
                            {copiedColor === data.colorPalette.primary ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {data.colorPalette.secondary && (
                      <div className="space-y-2">
                        <div
                          className="h-24 rounded-lg border shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          style={{ backgroundColor: data.colorPalette.secondary }}
                          onClick={() => copyToClipboard(data.colorPalette.secondary)}
                          title="Clique para copiar"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Secundária</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => copyToClipboard(data.colorPalette.secondary)}
                          >
                            {copiedColor === data.colorPalette.secondary ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {data.colorPalette.accent && (
                      <div className="space-y-2">
                        <div
                          className="h-24 rounded-lg border shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          style={{ backgroundColor: data.colorPalette.accent }}
                          onClick={() => copyToClipboard(data.colorPalette.accent)}
                          title="Clique para copiar"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Destaque</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => copyToClipboard(data.colorPalette.accent)}
                          >
                            {copiedColor === data.colorPalette.accent ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {data.colorPalette.additional.length > 0 && (
                    <div className="grid grid-cols-6 gap-2 pt-2">
                      {data.colorPalette.additional.map((color, index) => (
                        <div key={index} className="space-y-1">
                          <div
                            className="h-16 rounded-lg border shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                            style={{ backgroundColor: color }}
                            onClick={() => copyToClipboard(color)}
                            title="Clique para copiar"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
              <CardDescription>
                Defina as fontes e estilos tipográficos da sua marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryFont">Fonte Primária</Label>
                  <Input
                    id="primaryFont"
                    value={data.typography.primaryFont}
                    onChange={(e) => setData({
                      ...data,
                      typography: { ...data.typography, primaryFont: e.target.value }
                    })}
                    placeholder="Ex: Inter, Roboto, Montserrat..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryFont">Fonte Secundária</Label>
                  <Input
                    id="secondaryFont"
                    value={data.typography.secondaryFont}
                    onChange={(e) => setData({
                      ...data,
                      typography: { ...data.typography, secondaryFont: e.target.value }
                    })}
                    placeholder="Ex: Georgia, Merriweather..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headingStyle">Estilo de Títulos</Label>
                <Textarea
                  id="headingStyle"
                  value={data.typography.headingStyle}
                  onChange={(e) => setData({
                    ...data,
                    typography: { ...data.typography, headingStyle: e.target.value }
                  })}
                  placeholder="Ex: Bold, tamanhos grandes, all caps para h1..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyStyle">Estilo de Corpo de Texto</Label>
                <Textarea
                  id="bodyStyle"
                  value={data.typography.bodyStyle}
                  onChange={(e) => setData({
                    ...data,
                    typography: { ...data.typography, bodyStyle: e.target.value }
                  })}
                  placeholder="Ex: Regular, line-height 1.6, tamanho 16px..."
                  rows={3}
                />
              </div>

              {/* Typography Preview */}
              {(data.typography.primaryFont || data.typography.secondaryFont) && (
                <div className="space-y-4 p-6 border rounded-lg bg-muted/30">
                  <Label>Preview Tipográfico</Label>
                  {data.typography.primaryFont && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Fonte Primária: {data.typography.primaryFont}</p>
                      <div className="space-y-1">
                        <h1 className="text-4xl font-bold" style={{ fontFamily: data.typography.primaryFont }}>
                          Heading 1
                        </h1>
                        <h2 className="text-3xl font-bold" style={{ fontFamily: data.typography.primaryFont }}>
                          Heading 2
                        </h2>
                        <h3 className="text-2xl font-semibold" style={{ fontFamily: data.typography.primaryFont }}>
                          Heading 3
                        </h3>
                      </div>
                    </div>
                  )}
                  {data.typography.secondaryFont && (
                    <div className="space-y-2 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">Fonte Secundária: {data.typography.secondaryFont}</p>
                      <p className="text-base" style={{ fontFamily: data.typography.secondaryFont }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manifesto */}
        <TabsContent value="manifesto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manifesto da Marca</CardTitle>
              <CardDescription>
                Articule a essência e propósito da sua marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vision">Visão</Label>
                <Textarea
                  id="vision"
                  value={data.manifesto.vision}
                  onChange={(e) => setData({
                    ...data,
                    manifesto: { ...data.manifesto, vision: e.target.value }
                  })}
                  placeholder="Onde você quer chegar? Qual o futuro que você imagina?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Missão</Label>
                <Textarea
                  id="mission"
                  value={data.manifesto.mission}
                  onChange={(e) => setData({
                    ...data,
                    manifesto: { ...data.manifesto, mission: e.target.value }
                  })}
                  placeholder="Por que você existe? O que você faz?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Valores</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Princípios que guiam suas decisões e comportamentos
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Ex: Transparência, Inovação, Excelência..."
                    onKeyDown={(e) => e.key === 'Enter' && addItem('values')}
                  />
                  <Button onClick={() => addItem('values')} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.manifesto.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {value}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeItem('values', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Propósito</Label>
                <Textarea
                  id="purpose"
                  value={data.manifesto.purpose}
                  onChange={(e) => setData({
                    ...data,
                    manifesto: { ...data.manifesto, purpose: e.target.value }
                  })}
                  placeholder="Qual é o impacto que você quer causar no mundo?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positioning */}
        <TabsContent value="positioning" className="space-y-6">
          {/* Brand Summary Card */}
          {completionPercentage() >= 50 && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-lg">Resumo da Marca</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {data.primalBranding.leader && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-20">Líder:</span>
                    <span className="text-muted-foreground">{data.primalBranding.leader}</span>
                  </div>
                )}
                {data.manifesto.purpose && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-20">Propósito:</span>
                    <span className="text-muted-foreground">{data.manifesto.purpose}</span>
                  </div>
                )}
                {data.manifesto.values.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-20">Valores:</span>
                    <div className="flex flex-wrap gap-1">
                      {data.manifesto.values.map((value, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {data.colorPalette.primary && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-20">Cores:</span>
                    <div className="flex gap-1">
                      {data.colorPalette.primary && (
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: data.colorPalette.primary }}
                          title={data.colorPalette.primary}
                        />
                      )}
                      {data.colorPalette.secondary && (
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: data.colorPalette.secondary }}
                          title={data.colorPalette.secondary}
                        />
                      )}
                      {data.colorPalette.accent && (
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: data.colorPalette.accent }}
                          title={data.colorPalette.accent}
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Posicionamento de Marca</CardTitle>
              <CardDescription>
                Defina como sua marca se posiciona no mercado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Público-Alvo</Label>
                <Textarea
                  id="targetAudience"
                  value={data.positioning.targetAudience}
                  onChange={(e) => setData({
                    ...data,
                    positioning: { ...data.positioning, targetAudience: e.target.value }
                  })}
                  placeholder="Para quem você está falando? Quem é seu cliente ideal?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem">Problema</Label>
                <Textarea
                  id="problem"
                  value={data.positioning.problem}
                  onChange={(e) => setData({
                    ...data,
                    positioning: { ...data.positioning, problem: e.target.value }
                  })}
                  placeholder="Qual problema seu público enfrenta?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">Solução</Label>
                <Textarea
                  id="solution"
                  value={data.positioning.solution}
                  onChange={(e) => setData({
                    ...data,
                    positioning: { ...data.positioning, solution: e.target.value }
                  })}
                  placeholder="Como sua marca resolve esse problema?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="differentiator">Diferencial</Label>
                <Textarea
                  id="differentiator"
                  value={data.positioning.differentiator}
                  onChange={(e) => setData({
                    ...data,
                    positioning: { ...data.positioning, differentiator: e.target.value }
                  })}
                  placeholder="O que torna você único? Por que escolher você e não a concorrência?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promise">Promessa de Marca</Label>
                <Textarea
                  id="promise"
                  value={data.positioning.promise}
                  onChange={(e) => setData({
                    ...data,
                    positioning: { ...data.positioning, promise: e.target.value }
                  })}
                  placeholder="O que você promete entregar para seus clientes?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Positioning Statement */}
          {data.positioning.targetAudience && data.positioning.problem && (
            <Card className="border-primary/20 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Declaração de Posicionamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  Para <strong>{data.positioning.targetAudience || '[público-alvo]'}</strong> que{' '}
                  <strong>{data.positioning.problem || '[problema]'}</strong>, nossa marca é{' '}
                  <strong>{data.positioning.solution || '[solução]'}</strong> e{' '}
                  <strong>{data.positioning.differentiator || '[diferencial]'}</strong>.{' '}
                  Prometemos <strong>{data.positioning.promise || '[promessa]'}</strong>.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
