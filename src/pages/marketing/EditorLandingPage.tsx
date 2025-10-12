import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Download,
  Share2,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LandingPageTemplate, LandingPageComponent, ComponentType } from '@/types/LandingPage';
import { LANDING_PAGE_TEMPLATES, EMPTY_TEMPLATE } from '@/utils/landingPageTemplates';
import { PREMIUM_TEMPLATES } from '@/utils/premiumTemplates';

// Import all components
import { HeroComponent } from '@/components/landing-page/HeroComponent';
import { HeroFullScreen } from '@/components/landing-page/sections/HeroFullScreen';
import { BentoGrid } from '@/components/landing-page/sections/BentoGrid';
import { InteractiveShowcase } from '@/components/landing-page/sections/InteractiveShowcase';
import { StatsCounter } from '@/components/landing-page/sections/StatsCounter';
import { FormComponent } from '@/components/landing-page/FormComponent';
import { FeaturesComponent } from '@/components/landing-page/FeaturesComponent';
import { CountdownComponent } from '@/components/landing-page/CountdownComponent';
import { SocialProofComponent } from '@/components/landing-page/SocialProofComponent';
import { PricingComponent } from '@/components/landing-page/PricingComponent';
import { FAQComponent } from '@/components/landing-page/FAQComponent';
import { TestimonialComponent } from '@/components/landing-page/TestimonialComponent';
import { CTAComponent } from '@/components/landing-page/CTAComponent';
import { PropertyEditor } from '@/components/landing-page/PropertyEditor';

const COMPONENT_LIBRARY: { type: ComponentType; label: string; icon: string; category: string }[] = [
  { type: 'hero-fullscreen', label: 'Hero Fullscreen', icon: 'Maximize', category: 'premium' },
  { type: 'bento-grid', label: 'Bento Grid', icon: 'LayoutGrid', category: 'premium' },
  { type: 'interactive-showcase', label: 'Showcase Interativo', icon: 'Sparkles', category: 'premium' },
  { type: 'stats-counter', label: 'Contador Stats', icon: 'BarChart3', category: 'premium' },
  { type: 'hero', label: 'Hero Section', icon: 'Layout', category: 'basic' },
  { type: 'form', label: 'Formulário', icon: 'FileText', category: 'basic' },
  { type: 'features', label: 'Features', icon: 'Grid3x3', category: 'basic' },
  { type: 'pricing', label: 'Pricing', icon: 'DollarSign', category: 'basic' },
  { type: 'testimonial', label: 'Depoimentos', icon: 'MessageSquare', category: 'basic' },
  { type: 'faq', label: 'FAQ', icon: 'HelpCircle', category: 'basic' },
  { type: 'countdown', label: 'Contador', icon: 'Clock', category: 'basic' },
  { type: 'social-proof', label: 'Prova Social', icon: 'Users', category: 'basic' },
  { type: 'cta', label: 'Call-to-Action', icon: 'Target', category: 'basic' },
];

// Combine all templates
const ALL_TEMPLATES = [...PREMIUM_TEMPLATES, ...LANDING_PAGE_TEMPLATES];

export default function LandingPageEditor() {
  const [currentPage, setCurrentPage] = useState<LandingPageTemplate | null>(null);
  const [components, setComponents] = useState<LandingPageComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<LandingPageComponent | null>(null);
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pageName, setPageName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadTemplate = (template: LandingPageTemplate) => {
    setCurrentPage(template);
    // Add order to components if missing
    const componentsWithOrder = template.components.map((comp, index) => ({
      ...comp,
      order: comp.order || index + 1,
    }));
    setComponents(componentsWithOrder);
    setShowTemplateDialog(false);
    toast({
      title: "Template carregado",
      description: `Template "${template.name}" carregado com sucesso!`,
    });
  };

  const addComponent = (type: ComponentType) => {
    const newComponent: LandingPageComponent = {
      id: `component-${Date.now()}`,
      type,
      order: components.length + 1,
      props: getDefaultProps(type),
      styles: getDefaultStyles(type),
    };

    setComponents([...components, newComponent]);
    toast({
      title: "Componente adicionado",
      description: `Componente ${type} foi adicionado à página`,
    });
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    setSelectedComponent(null);
    toast({
      title: "Componente removido",
      description: "O componente foi removido da página",
    });
  };

  const duplicateComponent = (component: LandingPageComponent) => {
    const newComponent: LandingPageComponent = {
      ...component,
      id: `component-${Date.now()}`,
      order: components.length + 1,
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (updatedComponent: LandingPageComponent) => {
    setComponents(components.map(c => 
      c.id === updatedComponent.id ? updatedComponent : c
    ));
    setSelectedComponent(updatedComponent);
  };

  const selectComponent = (component: LandingPageComponent) => {
    setSelectedComponent(component);
    setShowPropertyEditor(true);
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const index = components.findIndex(c => c.id === id);
    if (index === -1) return;

    const newComponents = [...components];
    if (direction === 'up' && index > 0) {
      [newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]];
    } else if (direction === 'down' && index < newComponents.length - 1) {
      [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
    }

    // Update order
    newComponents.forEach((comp, idx) => {
      comp.order = idx + 1;
    });

    setComponents(newComponents);
  };

  const savePage = () => {
    if (!pageName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a landing page",
        variant: "destructive",
      });
      return;
    }

    const pageData: LandingPageTemplate = {
      id: `lp-${Date.now()}`,
      name: pageName,
      category: currentPage?.category || 'produto',
      description: '',
      components,
      settings: currentPage?.settings || { title: pageName },
      isPublished: false,
      createdAt: new Date().toISOString(),
    };

    const saved = JSON.parse(localStorage.getItem('landingPages') || '[]');
    saved.push(pageData);
    localStorage.setItem('landingPages', JSON.stringify(saved));

    setShowSaveDialog(false);
    toast({
      title: "Landing Page salva!",
      description: `"${pageName}" foi salva com sucesso.`,
    });
  };

  const renderComponent = (component: LandingPageComponent) => {
    const isSelected = selectedComponent?.id === component.id;
    const wrapperClass = `relative group cursor-pointer transition-all duration-200 ${
      isSelected ? 'ring-4 ring-blue-600 ring-offset-4 shadow-2xl' : 'hover:ring-2 hover:ring-blue-300'
    }`;

    const commonProps: any = {
      ...component.props,
      ...component.styles,
      isEditing: true,
      onEdit: () => selectComponent(component),
    };

    switch (component.type) {
      case 'hero':
        return <div key={component.id} className={wrapperClass}><HeroComponent {...commonProps} /></div>;
      case 'hero-fullscreen':
        return <div key={component.id} className={wrapperClass}><HeroFullScreen {...commonProps} /></div>;
      case 'bento-grid':
        return <div key={component.id} className={wrapperClass}><BentoGrid {...commonProps} /></div>;
      case 'interactive-showcase':
        return <div key={component.id} className={wrapperClass}><InteractiveShowcase {...commonProps} /></div>;
      case 'stats-counter':
        return <div key={component.id} className={wrapperClass}><StatsCounter {...commonProps} /></div>;
      case 'form':
        return <div key={component.id} className={wrapperClass}><FormComponent {...commonProps} /></div>;
      case 'features':
        return <div key={component.id} className={wrapperClass}><FeaturesComponent {...commonProps} /></div>;
      case 'countdown':
        return <div key={component.id} className={wrapperClass}><CountdownComponent {...commonProps} /></div>;
      case 'social-proof':
        return <div key={component.id} className={wrapperClass}><SocialProofComponent {...commonProps} /></div>;
      case 'pricing':
        return <div key={component.id} className={wrapperClass}><PricingComponent {...commonProps} /></div>;
      case 'faq':
        return <div key={component.id} className={wrapperClass}><FAQComponent {...commonProps} /></div>;
      case 'testimonial':
        return <div key={component.id} className={wrapperClass}><TestimonialComponent {...commonProps} /></div>;
      case 'cta':
        return <div key={component.id} className={wrapperClass}><CTAComponent {...commonProps} /></div>;
      default:
        return null;
    }
  };

  const previewClass =
    previewMode === 'mobile' ? 'max-w-sm' :
    previewMode === 'tablet' ? 'max-w-2xl' :
    'max-w-full';

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-primary">Editor de Landing Pages</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode */}
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowTemplateDialog(true)}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Templates
            </Button>

            <Button size="sm" onClick={() => setShowSaveDialog(true)}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>

            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Component Library */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-24 z-50 h-8 w-8 rounded-full bg-background border shadow-md hover:bg-muted transition-all duration-300 ${
            isSidebarCollapsed ? 'left-2' : 'left-[270px]'
          }`}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Left Sidebar - Components */}
        <div
          className={`border-r bg-muted/30 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? 'w-0' : 'w-72'
          }`}
        >
          <div className={`p-4 space-y-4 ${isSidebarCollapsed ? 'hidden' : ''}`}>
            <div>
              <h3 className="font-bold mb-3 text-primary">Componentes Premium</h3>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {COMPONENT_LIBRARY.filter(c => c.category === 'premium').map((comp) => (
                  <Button
                    key={comp.type}
                    variant="outline"
                    size="sm"
                    className="justify-start bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30 hover:from-purple-600/20 hover:to-pink-600/20"
                    onClick={() => addComponent(comp.type)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {comp.label}
                  </Button>
                ))}
              </div>

              <h3 className="font-bold mb-3 mt-6">Componentes Básicos</h3>
              <div className="grid grid-cols-2 gap-2">
                {COMPONENT_LIBRARY.filter(c => c.category === 'basic').map((comp) => (
                  <Button
                    key={comp.type}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => addComponent(comp.type)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {comp.label}
                  </Button>
                ))}
              </div>
            </div>

            {selectedComponent && (
              <div className="pt-4 border-t">
                <h3 className="font-bold mb-3">Componente Selecionado</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => moveComponent(selectedComponent.id, 'up')}
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Mover para Cima
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => moveComponent(selectedComponent.id, 'down')}
                  >
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Mover para Baixo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => duplicateComponent(selectedComponent)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => deleteComponent(selectedComponent.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas/Preview */}
        <div className="flex-1 overflow-y-auto bg-muted p-8">
          <div className={`mx-auto bg-white shadow-2xl transition-all duration-300 ${previewClass}`}>
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-2xl font-bold mb-2">Página Vazia</h3>
                <p className="text-muted-foreground mb-6">
                  Escolha um template ou adicione componentes para começar
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setShowTemplateDialog(true)}>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Escolher Template
                  </Button>
                  <Button variant="outline" onClick={() => addComponent('hero')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Componente
                  </Button>
                </div>
              </div>
            ) : (
              components.map(renderComponent)
            )}
          </div>
        </div>

        {/* Property Editor - Right Sidebar */}
        {showPropertyEditor && selectedComponent && (
          <div className="w-80 border-l bg-background overflow-y-auto">
            <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold">Editar Componente</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPropertyEditor(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <PropertyEditor
              component={selectedComponent}
              onUpdate={updateComponent}
              onClose={() => setShowPropertyEditor(false)}
            />
          </div>
        )}
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Escolha um Template</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="saas">SaaS</TabsTrigger>
              <TabsTrigger value="produto">Produto</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="webinar">Webinar</TabsTrigger>
              <TabsTrigger value="ebook">E-book</TabsTrigger>
              <TabsTrigger value="demo">Demo</TabsTrigger>
            </TabsList>

            {(['all', 'saas', 'produto', 'marketing', 'webinar', 'ebook', 'demo'] as const).map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {category === 'all' && (
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => loadTemplate(EMPTY_TEMPLATE)}
                    >
                      <CardContent className="p-6">
                        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                          <Plus className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="font-bold mb-1">Página em Branco</h3>
                        <p className="text-sm text-muted-foreground">
                          Comece do zero
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {ALL_TEMPLATES
                    .filter((t) => category === 'all' || t.category === category)
                    .map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
                          template.palette ? 'bg-gradient-to-br from-purple-900/10 to-pink-900/10 border-purple-500/20' : ''
                        }`}
                        onClick={() => loadTemplate(template)}
                      >
                        <CardContent className="p-6">
                          <div className={`aspect-video rounded-lg mb-4 flex items-center justify-center ${
                            template.palette 
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                              : 'bg-gradient-to-br from-primary/10 to-primary/5'
                          }`}>
                            <span className="text-4xl">{template.palette ? '⚡' : '🎨'}</span>
                          </div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold">{template.name}</h3>
                            {template.palette && (
                              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{template.category}</Badge>
                            {template.typography && (
                              <Badge variant="outline">{template.typography}</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Landing Page</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="page-name">Nome da Página*</Label>
              <Input
                id="page-name"
                placeholder="Ex: Webinar Marketing 2025"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="text-xs text-muted-foreground">
              • {components.length} componentes
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={savePage}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper functions
function getDefaultProps(type: ComponentType): Record<string, any> {
  switch (type) {
    case 'hero':
      return {
        title: 'Título do Hero',
        subtitle: 'Subtítulo explicativo',
        ctaText: 'Call to Action',
        alignment: 'center',
      };
    case 'hero-fullscreen':
      return {
        title: 'Transforme Seu Futuro',
        subtitle: 'Novidade 2025',
        description: 'Descubra a nova geração de soluções inovadoras',
        primaryCTA: 'Começar Agora',
        secondaryCTA: 'Saiba Mais',
        palette: 'cyberpunk',
        typography: 'modern',
        alignment: 'center',
        overlay: true,
        overlayOpacity: 60,
      };
    case 'bento-grid':
      return {
        items: [
          { title: 'Recurso Principal', description: 'Descrição detalhada', icon: 'zap', size: 'large', highlight: true },
          { title: 'Recurso 2', description: 'Funcionalidade extra', icon: 'shield', size: 'medium' },
          { title: 'Recurso 3', description: 'Mais benefícios', icon: 'star', size: 'medium' },
          { title: 'Recurso 4', description: 'Adicional', icon: 'check', size: 'small' },
          { title: 'Recurso 5', description: 'Extra', icon: 'trending', size: 'small' },
        ],
        palette: 'cyberpunk',
        style: 'glassmorphism',
      };
    case 'interactive-showcase':
      return {
        title: 'Recursos Poderosos',
        subtitle: 'Tecnologia avançada',
        tabs: [
          {
            name: 'Dashboard',
            title: 'Analytics em Tempo Real',
            description: 'Visualize métricas críticas',
            features: ['Gráficos interativos', 'Filtros avançados', 'Exportação de dados'],
          },
          {
            name: 'Automação',
            title: 'Workflows Inteligentes',
            description: 'Automatize processos complexos',
            features: ['Editor visual', 'Templates prontos', 'Integrações'],
          },
        ],
        palette: 'cyberpunk',
      };
    case 'stats-counter':
      return {
        title: 'Números Impressionantes',
        subtitle: 'Resultados comprovados',
        stats: [
          { number: '10', suffix: 'K+', label: 'Clientes', description: 'Em todo o mundo' },
          { number: '99', suffix: '%', label: 'Satisfação', description: 'Taxa de aprovação' },
          { number: '24', suffix: '/7', label: 'Suporte', description: 'Sempre disponível' },
          { number: '5', suffix: 'x', label: 'ROI', description: 'Retorno médio' },
        ],
        layout: 'grid',
        palette: 'cyberpunk',
      };
    case 'form':
      return {
        title: 'Formulário',
        fields: [
          { id: 'name', type: 'text', label: 'Nome', required: true },
          { id: 'email', type: 'email', label: 'E-mail', required: true },
        ],
        submitText: 'Enviar',
      };
    case 'features':
      return {
        title: 'Nossos Recursos',
        features: [
          { icon: 'Target', title: 'Feature 1', description: 'Descrição do feature 1' },
          { icon: 'TrendingUp', title: 'Feature 2', description: 'Descrição do feature 2' },
          { icon: 'Users', title: 'Feature 3', description: 'Descrição do feature 3' },
        ],
      };
    case 'cta':
      return {
        title: 'Pronto para começar?',
        subtitle: 'Junte-se a milhares de clientes satisfeitos',
        ctaText: 'Começar Agora',
      };
    default:
      return {};
  }
}

function getDefaultStyles(type: ComponentType): Record<string, any> {
  switch (type) {
    case 'hero':
      return {
        backgroundColor: 'hsl(18,30%,25%)',
        color: 'white',
        padding: '80px 20px',
      };
    case 'form':
      return {
        backgroundColor: 'hsl(40,20%,97%)',
        padding: '60px 20px',
      };
    default:
      return {
        padding: '60px 20px',
      };
  }
}
