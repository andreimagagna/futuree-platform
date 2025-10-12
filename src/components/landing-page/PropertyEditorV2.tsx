import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Type,
  Palette,
  Layout,
  Image as ImageIcon,
  Settings,
  Zap,
  X,
  Plus,
  Trash2,
  Upload,
  Link2,
  Eye,
  EyeOff,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Check,
} from 'lucide-react';
import { LandingPageComponent } from '@/types/LandingPage';
import { COLOR_PALETTES, TYPOGRAPHY_PRESETS } from '@/utils/premiumDesignSystem';

interface PropertyEditorV2Props {
  component: LandingPageComponent | null;
  onUpdate: (component: LandingPageComponent) => void;
  onClose: () => void;
}

export const PropertyEditorV2: React.FC<PropertyEditorV2Props> = ({
  component,
  onUpdate,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);

  if (!component) return null;

  const updateProp = (key: string, value: any) => {
    onUpdate({
      ...component,
      props: {
        ...component.props,
        [key]: value,
      },
    });
  };

  const updateStyle = (key: string, value: any) => {
    onUpdate({
      ...component,
      styles: {
        ...component.styles,
        [key]: value,
      },
    });
  };

  const updateNestedProp = (path: string[], value: any) => {
    const newProps = { ...component.props };
    let current: any = newProps;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    
    onUpdate({
      ...component,
      props: newProps,
    });
  };

  // Array helpers
  const addArrayItem = (key: string, defaultItem: any) => {
    const currentArray = component.props[key] || [];
    updateProp(key, [...currentArray, defaultItem]);
  };

  const updateArrayItem = (key: string, index: number, field: string, value: any) => {
    const currentArray = [...(component.props[key] || [])];
    currentArray[index] = {
      ...currentArray[index],
      [field]: value,
    };
    updateProp(key, currentArray);
  };

  const removeArrayItem = (key: string, index: number) => {
    const currentArray = component.props[key] || [];
    updateProp(key, currentArray.filter((_: any, i: number) => i !== index));
  };

  // Color picker component
  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-xs font-semibold">{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="pr-12"
            placeholder="#000000"
          />
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded border-2 border-gray-300 cursor-pointer shadow-sm"
            style={{ backgroundColor: value || '#000000' }}
            onClick={() => setColorPickerOpen(label)}
          />
        </div>
        <Input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 p-1 cursor-pointer"
        />
      </div>
    </div>
  );

  // Preset color swatches
  const ColorSwatches = ({ onChange }: { onChange: (color: string) => void }) => {
    const presetColors = [
      '#000000', '#FFFFFF', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
    ];

    return (
      <div className="grid grid-cols-6 gap-2 mt-2">
        {presetColors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform shadow-sm"
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    );
  };

  // Render text content editor
  const renderContentTab = () => {
    const props = component.props;

    return (
      <div className="space-y-6 p-4">
        <Accordion type="multiple" defaultValue={['texts', 'media', 'ctas']} className="w-full">
          {/* Texts Section */}
          <AccordionItem value="texts">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Textos
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Title */}
              {props.title !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Título Principal</Label>
                  <Input
                    value={props.title || ''}
                    onChange={(e) => updateProp('title', e.target.value)}
                    placeholder="Digite o título..."
                    className="font-semibold"
                  />
                </div>
              )}

              {/* Subtitle */}
              {props.subtitle !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Subtítulo</Label>
                  <Input
                    value={props.subtitle || ''}
                    onChange={(e) => updateProp('subtitle', e.target.value)}
                    placeholder="Digite o subtítulo..."
                  />
                </div>
              )}

              {/* Description */}
              {props.description !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Descrição</Label>
                  <Textarea
                    value={props.description || ''}
                    onChange={(e) => updateProp('description', e.target.value)}
                    placeholder="Digite a descrição..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              )}

              {/* Badge */}
              {props.badge !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Badge/Tag</Label>
                  <Input
                    value={props.badge || ''}
                    onChange={(e) => updateProp('badge', e.target.value)}
                    placeholder="Ex: Novo, Premium, Destaque"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* CTAs Section */}
          <AccordionItem value="ctas">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Botões CTA
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Primary CTA */}
              {props.primaryCTA !== undefined && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Botão Primário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Texto do Botão</Label>
                      <Input
                        value={props.primaryCTA || ''}
                        onChange={(e) => updateProp('primaryCTA', e.target.value)}
                        placeholder="Ex: Começar Agora"
                      />
                    </div>
                    {props.primaryCTALink !== undefined && (
                      <div className="space-y-2">
                        <Label className="text-xs">Link</Label>
                        <Input
                          value={props.primaryCTALink || ''}
                          onChange={(e) => updateProp('primaryCTALink', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Secondary CTA */}
              {props.secondaryCTA !== undefined && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Botão Secundário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Texto do Botão</Label>
                      <Input
                        value={props.secondaryCTA || ''}
                        onChange={(e) => updateProp('secondaryCTA', e.target.value)}
                        placeholder="Ex: Saiba Mais"
                      />
                    </div>
                    {props.secondaryCTALink !== undefined && (
                      <div className="space-y-2">
                        <Label className="text-xs">Link</Label>
                        <Input
                          value={props.secondaryCTALink || ''}
                          onChange={(e) => updateProp('secondaryCTALink', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Button Text (for CTA components) */}
              {props.buttonText !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Texto do Botão</Label>
                  <Input
                    value={props.buttonText || ''}
                    onChange={(e) => updateProp('buttonText', e.target.value)}
                    placeholder="Digite o texto do botão..."
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Media Section */}
          <AccordionItem value="media">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Imagens & Mídia
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Background Image */}
              {props.backgroundImage !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Imagem de Fundo</Label>
                  <Input
                    value={props.backgroundImage || ''}
                    onChange={(e) => updateProp('backgroundImage', e.target.value)}
                    placeholder="URL da imagem..."
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Imagem
                  </Button>
                </div>
              )}

              {/* Image */}
              {props.image !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Imagem</Label>
                  <Input
                    value={props.image || ''}
                    onChange={(e) => updateProp('image', e.target.value)}
                    placeholder="URL da imagem..."
                  />
                  {props.image && (
                    <img
                      src={props.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Erro+ao+carregar';
                      }}
                    />
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Imagem
                  </Button>
                </div>
              )}

              {/* Video */}
              {props.video !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Vídeo (URL)</Label>
                  <Input
                    value={props.video || ''}
                    onChange={(e) => updateProp('video', e.target.value)}
                    placeholder="URL do vídeo (MP4)..."
                  />
                </div>
              )}

              {/* Background Video */}
              {props.backgroundVideo !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Vídeo de Fundo</Label>
                  <Input
                    value={props.backgroundVideo || ''}
                    onChange={(e) => updateProp('backgroundVideo', e.target.value)}
                    placeholder="URL do vídeo..."
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Arrays Section (Features, Stats, Items, etc.) */}
          {(props.features || props.stats || props.items || props.testimonials || props.faqs) && (
            <AccordionItem value="items">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Itens da Lista
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* Features */}
                {props.features !== undefined && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Features</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addArrayItem('features', { title: '', description: '', icon: '✨' })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    {(props.features as any[] || []).map((feature: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={feature.title || ''}
                                onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)}
                                placeholder="Título"
                                className="font-semibold"
                              />
                              <Textarea
                                value={feature.description || ''}
                                onChange={(e) => updateArrayItem('features', index, 'description', e.target.value)}
                                placeholder="Descrição"
                                rows={2}
                              />
                              {feature.icon !== undefined && (
                                <Input
                                  value={feature.icon || ''}
                                  onChange={(e) => updateArrayItem('features', index, 'icon', e.target.value)}
                                  placeholder="Ícone (emoji ou nome)"
                                />
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeArrayItem('features', index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Stats */}
                {props.stats !== undefined && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Estatísticas</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addArrayItem('stats', { value: '100+', label: 'Clientes' })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    {(props.stats as any[] || []).map((stat: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={stat.value || ''}
                                onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                                placeholder="Valor (ex: 1000+)"
                                className="font-bold"
                              />
                              <Input
                                value={stat.label || ''}
                                onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                                placeholder="Label"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeArrayItem('stats', index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Generic Items */}
                {props.items !== undefined && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Itens</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addArrayItem('items', { title: '', description: '' })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    {(props.items as any[] || []).map((item: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={item.title || ''}
                                onChange={(e) => updateArrayItem('items', index, 'title', e.target.value)}
                                placeholder="Título"
                              />
                              <Textarea
                                value={item.description || ''}
                                onChange={(e) => updateArrayItem('items', index, 'description', e.target.value)}
                                placeholder="Descrição"
                                rows={2}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeArrayItem('items', index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    );
  };

  // Render style editor
  const renderStyleTab = () => {
    const styles = component.styles || {};
    const props = component.props;

    return (
      <div className="space-y-6 p-4">
        <Accordion type="multiple" defaultValue={['colors', 'typography', 'layout']} className="w-full">
          {/* Colors Section */}
          <AccordionItem value="colors">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Cores
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Color Palette Selector */}
              {props.palette !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Paleta de Cores</Label>
                  <Select
                    value={props.palette || 'cyberpunk'}
                    onValueChange={(value) => updateProp('palette', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(COLOR_PALETTES).map((palette) => (
                        <SelectItem key={palette} value={palette}>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: COLOR_PALETTES[palette].primary }}
                              />
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: COLOR_PALETTES[palette].secondary }}
                              />
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: COLOR_PALETTES[palette].accent }}
                              />
                            </div>
                            <span className="capitalize">{palette.replace('-', ' ')}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Background Color */}
              <ColorPicker
                label="Cor de Fundo"
                value={styles.backgroundColor || '#FFFFFF'}
                onChange={(value) => updateStyle('backgroundColor', value)}
              />
              <ColorSwatches onChange={(value) => updateStyle('backgroundColor', value)} />

              {/* Text Color */}
              <ColorPicker
                label="Cor do Texto"
                value={styles.textColor || '#000000'}
                onChange={(value) => updateStyle('textColor', value)}
              />
              <ColorSwatches onChange={(value) => updateStyle('textColor', value)} />

              {/* Button Color */}
              {(props.primaryCTA || props.buttonText) && (
                <>
                  <ColorPicker
                    label="Cor do Botão"
                    value={styles.buttonColor || '#3B82F6'}
                    onChange={(value) => updateStyle('buttonColor', value)}
                  />
                  <ColorSwatches onChange={(value) => updateStyle('buttonColor', value)} />
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Typography Section */}
          <AccordionItem value="typography">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Tipografia
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Typography System */}
              {props.typography !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Sistema de Tipografia</Label>
                  <Select
                    value={props.typography || 'modern'}
                    onValueChange={(value) => updateProp('typography', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(TYPOGRAPHY_PRESETS).map((system) => (
                        <SelectItem key={system} value={system}>
                          <span className="capitalize">{TYPOGRAPHY_PRESETS[system].name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Tamanho da Fonte</Label>
                <Select
                  value={styles.fontSize || 'base'}
                  onValueChange={(value) => updateStyle('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">Extra Small</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                    <SelectItem value="2xl">2XL</SelectItem>
                    <SelectItem value="3xl">3XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Weight */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Peso da Fonte</Label>
                <Select
                  value={styles.fontWeight || 'normal'}
                  onValueChange={(value) => updateStyle('fontWeight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semibold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Text Alignment */}
              {props.alignment !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Alinhamento</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={props.alignment === 'left' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => updateProp('alignment', 'left')}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={props.alignment === 'center' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => updateProp('alignment', 'center')}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={props.alignment === 'right' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => updateProp('alignment', 'right')}
                    >
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Layout & Spacing */}
          <AccordionItem value="layout">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Layout & Espaçamento
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Padding */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Padding</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">Vertical</Label>
                    <Input
                      type="number"
                      value={styles.paddingY || 16}
                      onChange={(e) => updateStyle('paddingY', parseInt(e.target.value))}
                      min="0"
                      max="200"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Horizontal</Label>
                    <Input
                      type="number"
                      value={styles.paddingX || 16}
                      onChange={(e) => updateStyle('paddingX', parseInt(e.target.value))}
                      min="0"
                      max="200"
                    />
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Margin</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">Top</Label>
                    <Input
                      type="number"
                      value={styles.marginTop || 0}
                      onChange={(e) => updateStyle('marginTop', parseInt(e.target.value))}
                      min="0"
                      max="200"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Bottom</Label>
                    <Input
                      type="number"
                      value={styles.marginBottom || 0}
                      onChange={(e) => updateStyle('marginBottom', parseInt(e.target.value))}
                      min="0"
                      max="200"
                    />
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Border Radius (px)</Label>
                <Slider
                  value={[styles.borderRadius || 0]}
                  onValueChange={([value]) => updateStyle('borderRadius', value)}
                  max={50}
                  step={1}
                  className="py-2"
                />
                <div className="text-xs text-gray-500 text-right">{styles.borderRadius || 0}px</div>
              </div>

              {/* Shadow */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Sombra</Label>
                <Select
                  value={styles.shadow || 'none'}
                  onValueChange={(value) => updateStyle('shadow', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem sombra</SelectItem>
                    <SelectItem value="sm">Pequena</SelectItem>
                    <SelectItem value="md">Média</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                    <SelectItem value="xl">Extra Grande</SelectItem>
                    <SelectItem value="2xl">2XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Advanced Settings */}
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações Avançadas
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Theme */}
              {props.theme !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Tema</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={props.theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => updateProp('theme', 'light')}
                    >
                      Light
                    </Button>
                    <Button
                      variant={props.theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => updateProp('theme', 'dark')}
                    >
                      Dark
                    </Button>
                  </div>
                </div>
              )}

              {/* Layout (for split components) */}
              {props.layout !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Layout</Label>
                  <Select
                    value={props.layout || 'image-right'}
                    onValueChange={(value) => updateProp('layout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image-right">Imagem à Direita</SelectItem>
                      <SelectItem value="image-left">Imagem à Esquerda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Overlay */}
              {props.overlay !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Overlay</Label>
                    <Switch
                      checked={props.overlay || false}
                      onCheckedChange={(checked) => updateProp('overlay', checked)}
                    />
                  </div>
                  {props.overlay && props.overlayOpacity !== undefined && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Opacidade (%)</Label>
                      <Slider
                        value={[props.overlayOpacity || 60]}
                        onValueChange={([value]) => updateProp('overlayOpacity', value)}
                        max={100}
                        step={5}
                        className="py-2"
                      />
                      <div className="text-xs text-gray-500 text-right">{props.overlayOpacity || 60}%</div>
                    </div>
                  )}
                </div>
              )}

              {/* Animation */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Animação</Label>
                <Select
                  value={styles.animation || 'none'}
                  onValueChange={(value) => updateStyle('animation', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem animação</SelectItem>
                    <SelectItem value="fadeIn">Fade In</SelectItem>
                    <SelectItem value="slideUp">Slide Up</SelectItem>
                    <SelectItem value="scaleIn">Scale In</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Editar Componente</h3>
          <p className="text-xs text-gray-500 mt-1">
            {component.type.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="content" className="flex-1">
            <Type className="w-4 h-4 mr-2" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="style" className="flex-1">
            <Palette className="w-4 h-4 mr-2" />
            Estilo
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="content" className="m-0">
            {renderContentTab()}
          </TabsContent>

          <TabsContent value="style" className="m-0">
            {renderStyleTab()}
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Actions */}
      <div className="border-t p-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => {
          // Reset to defaults
          const defaultProps = getDefaultPropsForType(component.type);
          onUpdate({ ...component, props: defaultProps });
        }}>
          Resetar
        </Button>
        <Button size="sm" className="flex-1" onClick={onClose}>
          <Check className="w-4 h-4 mr-2" />
          Aplicar
        </Button>
      </div>
    </div>
  );
};

// Helper function to get default props for a component type
function getDefaultPropsForType(type: string): any {
  const defaults: Record<string, any> = {
    'hero': { title: 'Título do Hero', subtitle: 'Subtítulo', description: 'Descrição', primaryCTA: 'Começar' },
    'hero-fullscreen': { title: 'Título Fullscreen', subtitle: 'Subtítulo', description: 'Descrição', primaryCTA: 'Começar Agora' },
    'features': { title: 'Features', subtitle: 'Nossos Recursos', features: [] },
    'pricing': { title: 'Preços', subtitle: 'Escolha seu plano', plans: [] },
    'cta': { title: 'Pronto para começar?', buttonText: 'Começar Agora' },
    'testimonial': { title: 'Depoimentos', testimonials: [] },
  };

  return defaults[type] || {};
}
