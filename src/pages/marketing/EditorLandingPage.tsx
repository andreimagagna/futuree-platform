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
  Undo2,
  Redo2,
  Clock,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import { useUndoRedo } from '@/hooks/use-undo-redo';
import { LandingPageTemplate, LandingPageComponent, ComponentType } from '@/types/LandingPage';
import { LANDING_PAGE_TEMPLATES, EMPTY_TEMPLATE } from '@/utils/landingPageTemplates';
import { getAllReadySections, getSectionsByCategory } from '@/utils/readySections';

// Import Inline Editor Context
import { InlineEditorProvider } from '@/components/landing-page/InlineEditorContext';

// Import V2 components (with inline editing)
import { HeroComponentV2 } from '@/components/landing-page/HeroComponentV2';
import { FeaturesComponentV2 } from '@/components/landing-page/FeaturesComponentV2';
import { PricingComponentV2 } from '@/components/landing-page/PricingComponentV2';
import { TestimonialComponentV2 } from '@/components/landing-page/TestimonialComponentV2';
import { FAQComponentV2 } from '@/components/landing-page/FAQComponentV2';
import { CTAComponentV2 } from '@/components/landing-page/CTAComponentV2';

// Import all other components
import { HeroComponent } from '@/components/landing-page/HeroComponent';
import { FormComponent } from '@/components/landing-page/FormComponent';
import { FeaturesComponent } from '@/components/landing-page/FeaturesComponent';
import { CountdownComponent } from '@/components/landing-page/CountdownComponent';
import { SocialProofComponent } from '@/components/landing-page/SocialProofComponent';
import { PricingComponent } from '@/components/landing-page/PricingComponent';
import { FAQComponent } from '@/components/landing-page/FAQComponent';
import { TestimonialComponent } from '@/components/landing-page/TestimonialComponent';
import { CTAComponent } from '@/components/landing-page/CTAComponent';
import { TextBlockComponent } from '@/components/landing-page/TextBlockComponent';
import { SpacerComponent } from '@/components/landing-page/SpacerComponent';
import { DividerComponent } from '@/components/landing-page/DividerComponent';
import { ImageComponent } from '@/components/landing-page/ImageComponent';
import { VideoComponent } from '@/components/landing-page/VideoComponent';
import { HeaderComponent } from '@/components/landing-page/HeaderComponent';
import { FooterComponent } from '@/components/landing-page/FooterComponent';
import { GalleryComponent } from '@/components/landing-page/GalleryComponent';
import { ColumnsComponent } from '@/components/landing-page/ColumnsComponent';
import { ProgressBarsComponent } from '@/components/landing-page/ProgressBarsComponent';
import { StatsComponent } from '@/components/landing-page/StatsComponent';
import { PropertyEditorV2 } from '@/components/landing-page/PropertyEditorV2';
import { DraggableComponentList } from '@/components/landing-page/DraggableComponentList';
import { GlassOverlay } from '@/components/ui/GlassOverlay';
import { Sparkles } from 'lucide-react';

const COMPONENT_LIBRARY: { type: ComponentType; label: string; icon: string; category: string }[] = [
  // Layout & Structure
  { type: 'header', label: 'Header/Navbar', icon: 'LayoutDashboard', category: 'layout' },
  { type: 'footer', label: 'Footer', icon: 'PanelBottom', category: 'layout' },
  { type: 'columns', label: 'Colunas', icon: 'Columns', category: 'layout' },
  { type: 'spacer', label: 'Espaçamento', icon: 'ArrowUpDown', category: 'layout' },
  { type: 'divider', label: 'Divisor', icon: 'Minus', category: 'layout' },
  
  // Hero & CTA
  { type: 'hero', label: 'Hero Section', icon: 'Layout', category: 'hero' },
  { type: 'cta', label: 'Call-to-Action', icon: 'Target', category: 'hero' },
  
  // Content
  { type: 'text', label: 'Bloco de Texto', icon: 'Type', category: 'content' },
  { type: 'features', label: 'Features', icon: 'Grid3x3', category: 'content' },
  { type: 'stats', label: 'Estatísticas', icon: 'BarChart', category: 'content' },
  { type: 'progress', label: 'Barras de Progresso', icon: 'Activity', category: 'content' },
  
  // Media
  { type: 'image', label: 'Imagem', icon: 'Image', category: 'media' },
  { type: 'video', label: 'Vídeo', icon: 'Video', category: 'media' },
  { type: 'gallery', label: 'Galeria', icon: 'Images', category: 'media' },
  
  // Social Proof
  { type: 'testimonial', label: 'Depoimentos', icon: 'MessageSquare', category: 'social' },
  { type: 'social-proof', label: 'Prova Social', icon: 'Users', category: 'social' },
  
  // Conversion
  { type: 'form', label: 'Formulário', icon: 'FileText', category: 'conversion' },
  { type: 'pricing', label: 'Pricing', icon: 'DollarSign', category: 'conversion' },
  { type: 'countdown', label: 'Contador', icon: 'Clock', category: 'conversion' },
  
  // Information
  { type: 'faq', label: 'FAQ', icon: 'HelpCircle', category: 'info' },
];

// Use apenas templates básicos
const ALL_TEMPLATES = LANDING_PAGE_TEMPLATES;

export default function LandingPageEditor() {
  const [currentPage, setCurrentPage] = useState<LandingPageTemplate | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Undo/Redo functionality
  const {
    state: components,
    setState: setComponentsState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo([]);

  const [selectedComponent, setSelectedComponent] = useState<LandingPageComponent | null>(null);
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'components' | 'sections'>('sections'); // Default to sections
  const [showTemplateDialog, setShowTemplateDialog] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pageName, setPageName] = useState('');

  // Auto-save functionality
  const { lastSaved, isSaving, manualSave } = useAutoSave(
    currentPage?.id || null,
    components,
    currentPage,
    { enabled: !!currentPage }
  );

  // Helper to update components with history tracking
  const setComponents = (newComponents: LandingPageComponent[] | ((prev: LandingPageComponent[]) => LandingPageComponent[])) => {
    const updatedComponents = typeof newComponents === 'function' ? newComponents(components) : newComponents;
    addToHistory(updatedComponents);
  };

  const loadTemplate = (template: LandingPageTemplate) => {
    setCurrentPage(template);
    // Add order to components if missing
    const componentsWithOrder = template.components.map((comp, index) => ({
      ...comp,
      order: comp.order || index + 1,
    }));
    setComponentsState(componentsWithOrder); // Use setState directly, não addToHistory
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

  const updateComponentProps = (id: string, newProps: any) => {
    setComponents(
      components.map(c => 
        c.id === id ? { ...c, props: newProps } : c
      )
    );
  };

  const duplicateComponent = (component: LandingPageComponent) => {
    const newComponent: LandingPageComponent = {
      ...component,
      id: `component-${Date.now()}`,
      order: components.length + 1,
    };
    setComponents([...components, newComponent]);
  };

  const addReadySection = (sectionId: string) => {
    const allSections = getAllReadySections();
    const section = allSections.find(s => s.id === sectionId);
    
    if (section && section.components) {
      const newComponents = section.components.map((comp, index) => ({
        ...comp,
        id: `component-${Date.now()}-${index}`,
        order: components.length + index + 1,
      }));
      
      setComponents([...components, ...newComponents]);
      
      toast({
        title: "Seção adicionada!",
        description: `${section.name} foi adicionada com sucesso.`,
      });
    }
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
    // Todos os componentes básicos esperam { props: {...}, styles: {...} } (aninhado)
    const isSelected = selectedComponent?.id === component.id;
    
    const wrappedProps: any = {
      props: component.props,
      styles: component.styles,
      isEditing: isSelected,
      onEdit: () => selectComponent(component),
      onUpdate: (newProps: any) => updateComponentProps(component.id, newProps),
    };

    switch (component.type) {
      case 'hero':
        return <HeroComponentV2 {...wrappedProps} />;
      case 'header':
        return <HeaderComponent {...wrappedProps} />;
      case 'footer':
        return <FooterComponent {...wrappedProps} />;
      case 'form':
        return <FormComponent {...wrappedProps} />;
      case 'features':
        return <FeaturesComponentV2 {...wrappedProps} />;
      case 'countdown':
        return <CountdownComponent {...wrappedProps} />;
      case 'social-proof':
        return <SocialProofComponent {...wrappedProps} />;
      case 'pricing':
        return <PricingComponentV2 {...wrappedProps} />;
      case 'faq':
        return <FAQComponentV2 {...wrappedProps} />;
      case 'testimonial':
        return <TestimonialComponentV2 {...wrappedProps} />;
      case 'cta':
        return <CTAComponentV2 {...wrappedProps} />;
      case 'text':
        return <TextBlockComponent {...wrappedProps} />;
      case 'image':
        return <ImageComponent {...wrappedProps} />;
      case 'video':
        return <VideoComponent {...wrappedProps} />;
      case 'gallery':
        return <GalleryComponent {...wrappedProps} />;
      case 'columns':
        return <ColumnsComponent {...wrappedProps} />;
      case 'stats':
        return <StatsComponent {...wrappedProps} />;
      case 'progress':
        return <ProgressBarsComponent {...wrappedProps} />;
      case 'spacer':
        return <SpacerComponent {...wrappedProps} />;
      case 'divider':
        return <DividerComponent {...wrappedProps} />;
      default:
        return null;
    }
  };

  const previewClass =
    previewMode === 'mobile' ? 'max-w-sm' :
    previewMode === 'tablet' ? 'max-w-2xl' :
    'max-w-full';

  return (
    <InlineEditorProvider>
      <div className="flex flex-col h-screen bg-background relative">
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
            {/* Undo/Redo */}
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Desfazer (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Refazer (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Auto-save Indicator */}
            {currentPage && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted text-xs">
                {isSaving ? (
                  <>
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <Clock className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">
                      Salvo {new Date(lastSaved).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>Não salvo</span>
                  </>
                )}
              </div>
            )}

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
        {/* Left Sidebar - Components Library (Unbounce Style) */}
        <div
          className={`border-r bg-card overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? 'w-0' : 'w-80'
          }`}
        >
          <div className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            {/* Sidebar Header */}
            <div className="sticky top-0 z-10 bg-card border-b">
              <div className="p-4 pb-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Construtor</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarCollapsed(true)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs value={sidebarTab} onValueChange={(v) => setSidebarTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-none border-t">
                  <TabsTrigger value="sections" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    🎯 Seções Prontas
                  </TabsTrigger>
                  <TabsTrigger value="components" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    🧩 Componentes
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="p-4 space-y-6">
              {/* Seções Prontas Tab */}
              {sidebarTab === 'sections' && (
                <div className="space-y-6">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs text-primary font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Seções otimizadas para alta conversão
                    </p>
                  </div>
                  
                  {/* Hero Sections */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">🚀</span>
                      Hero Sections
                    </h4>
                    <div className="space-y-2">
                      {getSectionsByCategory('hero').map((section: any) => (
                        <Card
                          key={section.id}
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] group"
                          onClick={() => addReadySection(section.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{section.thumbnail}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{section.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Trust Sections */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">🏆</span>
                      Prova Social
                    </h4>
                    <div className="space-y-2">
                      {getSectionsByCategory('trust').map((section: any) => (
                        <Card
                          key={section.id}
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] group"
                          onClick={() => addReadySection(section.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{section.thumbnail}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{section.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Features Sections */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      Features & Benefícios
                    </h4>
                    <div className="space-y-2">
                      {getSectionsByCategory('features').map((section: any) => (
                        <Card
                          key={section.id}
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] group"
                          onClick={() => addReadySection(section.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{section.thumbnail}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{section.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Sections */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">💳</span>
                      Pricing
                    </h4>
                    <div className="space-y-2">
                      {getSectionsByCategory('pricing').map((section: any) => (
                        <Card
                          key={section.id}
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] group"
                          onClick={() => addReadySection(section.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{section.thumbnail}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{section.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">⭐</span>
                      Depoimentos
                    </h4>
                    <div className="space-y-2">
                      {getSectionsByCategory('social').map((section: any) => (
                        <Card
                          key={section.id}
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] group"
                          onClick={() => addReadySection(section.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{section.thumbnail}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{section.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      CTAs de Conversão
                    </h4>
                    <div className="space-y-2">
                      {getSectionsByCategory('conversion').map((section: any) => (
                        <Card
                          key={section.id}
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] group"
                          onClick={() => addReadySection(section.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{section.thumbnail}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{section.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* FAQ */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">❓</span>
                      FAQ
                    </h4>
                    <div className="space-y-2">
                      {getSectionsByCategory('info').map((section: any) => (
                        <Card
                          key={section.id}
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] group"
                          onClick={() => addReadySection(section.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{section.thumbnail}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{section.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Components Library Tab */}
              {sidebarTab === 'components' && (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-900 font-semibold">
                      💡 Componentes individuais para personalização avançada
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {COMPONENT_LIBRARY.map((comp) => (
                      <Card
                        key={comp.type}
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
                        onClick={() => addComponent(comp.type)}
                      >
                        <CardContent className="p-3">
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <Plus className="w-4 h-4" />
                            </div>
                            <p className="font-medium text-xs leading-tight">{comp.label}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowTemplateDialog(true)}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Carregar Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setComponents([])}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Tudo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Sidebar Button (when collapsed) */}
        {isSidebarCollapsed && (
          <Button
            variant="default"
            size="sm"
            className="absolute top-24 left-4 z-50 shadow-lg"
            onClick={() => setIsSidebarCollapsed(false)}
          >
            <ChevronRight className="h-4 h-4 mr-2" />
            Abrir Biblioteca
          </Button>
        )}

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
              <div className="pl-16">
                <DraggableComponentList
                  components={components}
                  selectedComponentId={selectedComponent?.id}
                  onReorder={setComponents}
                  onSelectComponent={selectComponent}
                  onDeleteComponent={deleteComponent}
                  onDuplicateComponent={duplicateComponent}
                  renderComponent={renderComponent}
                />
              </div>
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
            <PropertyEditorV2
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
                        className="cursor-pointer hover:shadow-lg transition-all duration-300"
                        onClick={() => loadTemplate(template)}
                      >
                        <CardContent className="p-6">
                          <div className="aspect-video rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <span className="text-4xl">🎨</span>
                          </div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold">{template.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{template.category}</Badge>
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
    </InlineEditorProvider>
  );
}

// Helper functions
function getDefaultProps(type: ComponentType): Record<string, any> {
  switch (type) {
    case 'hero':
      return {
        title: 'Transforme Seu Negócio Hoje',
        subtitle: 'Soluções Inovadoras',
        description: 'Descubra ferramentas poderosas para impulsionar seus resultados',
        primaryCTA: 'Começar Agora',
        secondaryCTA: 'Saiba Mais',
        alignment: 'center',
      };
    case 'header':
      return {
        logo: '',
        logoText: 'Logo',
        menuItems: [
          { label: 'Início', link: '#' },
          { label: 'Recursos', link: '#recursos' },
          { label: 'Preços', link: '#precos' },
          { label: 'Contato', link: '#contato' },
        ],
        ctaText: 'Começar',
        ctaLink: '#',
        sticky: true,
        transparent: false,
        alignment: 'space-between',
      };
    case 'footer':
      return {
        logo: '',
        logoText: 'Logo',
        description: 'Construindo o futuro com inovação e excelência.',
        columns: [
          {
            title: 'Produto',
            links: [
              { label: 'Recursos', url: '#' },
              { label: 'Preços', url: '#' },
              { label: 'FAQ', url: '#' },
            ],
          },
          {
            title: 'Empresa',
            links: [
              { label: 'Sobre', url: '#' },
              { label: 'Blog', url: '#' },
              { label: 'Carreiras', url: '#' },
            ],
          },
        ],
        socialLinks: [
          { platform: 'facebook', url: '#' },
          { platform: 'twitter', url: '#' },
          { platform: 'linkedin', url: '#' },
        ],
        contactInfo: {
          email: 'contato@exemplo.com',
          phone: '+55 11 1234-5678',
          address: 'São Paulo, SP',
        },
        copyrightText: '© 2025 Todos os direitos reservados.',
        showNewsletter: true,
        newsletterTitle: 'Fique por dentro',
        newsletterPlaceholder: 'Seu email',
      };
    case 'gallery':
      return {
        images: [
          { url: 'https://via.placeholder.com/800x600?text=Imagem+1', title: 'Imagem 1', description: 'Descrição da imagem 1' },
          { url: 'https://via.placeholder.com/800x600?text=Imagem+2', title: 'Imagem 2', description: 'Descrição da imagem 2' },
          { url: 'https://via.placeholder.com/800x600?text=Imagem+3', title: 'Imagem 3', description: 'Descrição da imagem 3' },
        ],
        layout: 'grid',
        columns: 3,
        showThumbnails: true,
        autoplay: false,
        autoplayInterval: 3000,
        showCaptions: true,
      };
    case 'columns':
      return {
        columns: [
          {
            width: 6,
            items: [
              { type: 'text', content: '<h3>Coluna 1</h3><p>Conteúdo da primeira coluna</p>' },
            ],
            verticalAlign: 'top',
          },
          {
            width: 6,
            items: [
              { type: 'text', content: '<h3>Coluna 2</h3><p>Conteúdo da segunda coluna</p>' },
            ],
            verticalAlign: 'top',
          },
        ],
        gap: 4,
        mobileStack: true,
        reverseOnMobile: false,
      };
    case 'stats':
      return {
        title: 'Números que Impressionam',
        subtitle: 'Resultados comprovados',
        stats: [
          { value: '10,000', label: 'Clientes', suffix: '+', icon: 'users', trend: 15, color: 'hsl(25, 40%, 35%)' },
          { value: '50', label: 'Países', suffix: '+', icon: 'target', trend: 8, color: 'hsl(25, 40%, 35%)' },
          { value: '99.9', label: 'Uptime', suffix: '%', icon: 'zap', trend: 2, color: 'hsl(25, 40%, 35%)' },
          { value: '4.9', label: 'Avaliação', suffix: '/5', icon: 'award', trend: 5, color: 'hsl(25, 40%, 35%)' },
        ],
        layout: 'grid',
        animated: true,
        showIcons: true,
        showTrends: true,
      };
    case 'progress':
      return {
        title: 'Nossas Habilidades',
        subtitle: 'Expertise comprovada',
        items: [
          { label: 'Design', value: 90, color: 'hsl(25, 40%, 35%)', showValue: true },
          { label: 'Desenvolvimento', value: 85, color: 'hsl(25, 40%, 35%)', showValue: true },
          { label: 'Marketing', value: 80, color: 'hsl(25, 40%, 35%)', showValue: true },
          { label: 'Suporte', value: 95, color: 'hsl(25, 40%, 35%)', showValue: true },
        ],
        animated: true,
        style: 'bar',
        height: 12,
      };
    case 'form':
      return {
        title: 'Entre em Contato',
        subtitle: 'Fale conosco',
        description: 'Preencha o formulário abaixo',
        fields: [
          { id: 'name', type: 'text', label: 'Nome Completo', placeholder: 'Seu nome', required: true },
          { id: 'email', type: 'email', label: 'E-mail', placeholder: 'seu@email.com', required: true },
          { id: 'message', type: 'textarea', label: 'Mensagem', placeholder: 'Sua mensagem...', required: false },
        ],
        submitText: 'Enviar Mensagem',
        privacyText: 'Seus dados estão seguros conosco',
      };
    case 'features':
      return {
        title: 'Recursos Incríveis',
        subtitle: 'Tudo que você precisa',
        description: 'Ferramentas poderosas para o seu sucesso',
        features: [
          { icon: 'Zap', title: 'Rápido e Eficiente', description: 'Performance otimizada para máxima velocidade' },
          { icon: 'Shield', title: 'Seguro e Confiável', description: 'Proteção avançada para seus dados' },
          { icon: 'Users', title: 'Colaborativo', description: 'Trabalhe em equipe de forma integrada' },
          { icon: 'TrendingUp', title: 'Escalável', description: 'Cresce junto com seu negócio' },
          { icon: 'Heart', title: 'Suporte Dedicado', description: 'Equipe pronta para ajudar 24/7' },
          { icon: 'Star', title: 'Qualidade Premium', description: 'Excelência em cada detalhe' },
        ],
        layout: 'grid',
        columns: 3,
      };
    case 'pricing':
      return {
        title: 'Planos e Preços',
        subtitle: 'Escolha o plano ideal',
        description: 'Preços transparentes, sem taxas ocultas',
        tiers: [
          {
            name: 'Básico',
            price: 'R$ 49',
            period: '/mês',
            description: 'Para começar',
            features: ['5 projetos', '10GB armazenamento', 'Suporte por email'],
            ctaText: 'Começar Grátis',
            highlighted: false,
          },
          {
            name: 'Pro',
            price: 'R$ 99',
            period: '/mês',
            description: 'Mais popular',
            features: ['Projetos ilimitados', '100GB armazenamento', 'Suporte prioritário', 'API access'],
            ctaText: 'Começar Teste',
            highlighted: true,
          },
          {
            name: 'Enterprise',
            price: 'Personalizado',
            period: '',
            description: 'Para grandes equipes',
            features: ['Tudo ilimitado', 'Suporte dedicado', 'SLA garantido', 'Treinamento'],
            ctaText: 'Falar com Vendas',
            highlighted: false,
          },
        ],
      };
    case 'testimonial':
      return {
        title: 'O Que Dizem Nossos Clientes',
        subtitle: 'Histórias de sucesso',
        testimonials: [
          {
            quote: 'Produto incrível! Aumentou nossa produtividade em 300%',
            author: 'Maria Silva',
            role: 'CEO',
            company: 'TechCorp',
            avatar: '',
            rating: 5,
          },
          {
            quote: 'Melhor investimento do ano. ROI impressionante!',
            author: 'João Santos',
            role: 'CTO',
            company: 'StartupXYZ',
            avatar: '',
            rating: 5,
          },
          {
            quote: 'Suporte excepcional e produto de altíssima qualidade',
            author: 'Ana Costa',
            role: 'Product Manager',
            company: 'Innovation Labs',
            avatar: '',
            rating: 5,
          },
        ],
      };
    case 'faq':
      return {
        title: 'Perguntas Frequentes',
        subtitle: 'Tire suas dúvidas',
        items: [
          {
            question: 'Como funciona o período de teste?',
            answer: 'Você tem 14 dias para testar gratuitamente, sem precisar de cartão de crédito.',
          },
          {
            question: 'Posso cancelar a qualquer momento?',
            answer: 'Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou taxas.',
          },
          {
            question: 'Qual é o prazo de suporte?',
            answer: 'Oferecemos suporte 24/7 por email, chat e telefone para todos os planos.',
          },
          {
            question: 'Os dados são seguros?',
            answer: 'Sim! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança.',
          },
        ],
      };
    case 'countdown':
      return {
        title: 'Oferta Especial Termina Em',
        subtitle: 'Não perca essa oportunidade',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        ctaText: 'Garantir Meu Desconto',
      };
    case 'social-proof':
      return {
        title: 'Empresas que Confiam',
        subtitle: 'Junte-se a milhares de clientes satisfeitos',
        logos: [
          { name: 'Empresa 1', url: '' },
          { name: 'Empresa 2', url: '' },
          { name: 'Empresa 3', url: '' },
          { name: 'Empresa 4', url: '' },
          { name: 'Empresa 5', url: '' },
        ],
        stats: {
          customers: '10,000+',
          rating: '4.9/5',
          reviews: '2,500+',
        },
      };
    case 'cta':
      return {
        title: 'Pronto para Começar?',
        subtitle: 'Junte-se a milhares de clientes satisfeitos',
        description: 'Comece seu teste gratuito hoje mesmo, sem necessidade de cartão de crédito',
        ctaText: 'Começar Agora Grátis',
        ctaLink: '#',
        ctaSecondaryText: 'Agendar Demo',
        ctaSecondaryLink: '#',
        showTrustBadges: true,
      };
    case 'text':
      return {
        content: 'Digite seu texto aqui. Você pode personalizar o alinhamento, tamanho da fonte e peso da fonte.',
        alignment: 'left',
        fontSize: 'base',
        fontWeight: 'normal',
      };
    case 'image':
      return {
        src: 'https://via.placeholder.com/800x400?text=Adicione+sua+imagem',
        alt: 'Imagem',
        width: 100,
        alignment: 'center',
        caption: '',
      };
    case 'video':
      return {
        url: '',
        type: 'youtube',
        autoplay: false,
        controls: true,
        width: 100,
        alignment: 'center',
        caption: '',
      };
    case 'spacer':
      return {
        height: 40,
      };
    case 'divider':
      return {
        thickness: 1,
        style: 'solid',
        width: 100,
      };
    default:
      return {
        title: 'Novo Componente',
        description: 'Personalize este componente',
      };
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
    case 'header':
      return {
        backgroundColor: 'white',
        borderBottom: '1px solid hsl(0,0%,90%)',
        padding: '0',
      };
    case 'footer':
      return {
        backgroundColor: 'hsl(0,0%,98%)',
        borderTop: '1px solid hsl(0,0%,90%)',
        padding: '0',
      };
    case 'form':
      return {
        backgroundColor: 'hsl(40,20%,97%)',
        padding: '60px 20px',
      };
    case 'gallery':
      return {
        padding: '60px 20px',
      };
    case 'columns':
      return {
        padding: '60px 20px',
      };
    case 'stats':
      return {
        backgroundColor: 'hsl(40,20%,97%)',
        padding: '60px 20px',
      };
    case 'progress':
      return {
        padding: '60px 20px',
      };
    case 'text':
      return {
        padding: '20px 20px',
      };
    case 'image':
      return {
        padding: '40px 20px',
      };
    case 'video':
      return {
        padding: '40px 20px',
      };
    case 'spacer':
      return {
        padding: '0',
      };
    case 'divider':
      return {
        padding: '20px 20px',
        borderColor: 'hsl(0,0%,80%)',
      };
    default:
      return {
        padding: '60px 20px',
      };
  }
}
