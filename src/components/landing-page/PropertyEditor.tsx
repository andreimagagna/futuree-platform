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
import {
  Type,
  Palette,
  Layout,
  Image,
  Settings,
  Zap,
  X,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { LandingPageComponent } from '@/types/LandingPage';

interface PropertyEditorProps {
  component: LandingPageComponent | null;
  onUpdate: (component: LandingPageComponent) => void;
  onClose: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdate,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['content', 'style']);

  if (!component) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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

  const renderContentEditor = () => {
    const props = component.props;

    return (
      <div className="space-y-6">
        {/* Title */}
        {props.title !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Título
            </Label>
            <Input
              value={props.title || ''}
              onChange={(e) => updateProp('title', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900 font-medium"
              placeholder="Digite o título"
            />
          </div>
        )}

        {/* Subtitle */}
        {props.subtitle !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Subtítulo</Label>
            <Input
              value={props.subtitle || ''}
              onChange={(e) => updateProp('subtitle', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900"
              placeholder="Digite o subtítulo"
            />
          </div>
        )}

        {/* Description */}
        {props.description !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Descrição</Label>
            <Textarea
              value={props.description || ''}
              onChange={(e) => updateProp('description', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900 min-h-[100px]"
              placeholder="Digite a descrição"
            />
          </div>
        )}

        {/* Primary CTA */}
        {props.primaryCTA !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Botão Principal</Label>
            <Input
              value={props.primaryCTA || ''}
              onChange={(e) => updateProp('primaryCTA', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900"
              placeholder="Texto do botão"
            />
          </div>
        )}

        {/* Secondary CTA */}
        {props.secondaryCTA !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Botão Secundário</Label>
            <Input
              value={props.secondaryCTA || ''}
              onChange={(e) => updateProp('secondaryCTA', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900"
              placeholder="Texto do botão secundário"
            />
          </div>
        )}

        {/* Badge */}
        {props.badge !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Badge</Label>
            <Input
              value={props.badge || ''}
              onChange={(e) => updateProp('badge', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900"
              placeholder="Texto do badge"
            />
          </div>
        )}
      </div>
    );
  };

  const renderStyleEditor = () => {
    const props = component.props;
    const styles = component.styles || {};

    return (
      <div className="space-y-6">
        {/* Theme */}
        {props.theme !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Tema
            </Label>
            <Select value={props.theme || 'light'} onValueChange={(value) => updateProp('theme', value)}>
              <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white border-2 border-gray-300" />
                    Claro
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-900 border-2 border-gray-700" />
                    Escuro
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Alignment */}
        {props.alignment !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Alinhamento
            </Label>
            <Select value={props.alignment || 'center'} onValueChange={(value) => updateProp('alignment', value)}>
              <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Layout */}
        {props.layout !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Layout</Label>
            <Select value={props.layout || 'grid'} onValueChange={(value) => updateProp('layout', value)}>
              <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="image-left">Imagem Esquerda</SelectItem>
                <SelectItem value="image-right">Imagem Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Overlay Opacity */}
        {props.overlayOpacity !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">
              Opacidade do Overlay: {props.overlayOpacity || 60}%
            </Label>
            <Slider
              value={[props.overlayOpacity || 60]}
              onValueChange={([value]) => updateProp('overlayOpacity', value)}
              min={0}
              max={100}
              step={5}
              className="slider"
            />
          </div>
        )}

        {/* Background Color */}
        <div>
          <Label className="text-sm font-bold text-gray-900 mb-2">Cor de Fundo</Label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: 'Branco', value: 'bg-white' },
              { name: 'Cinza Claro', value: 'bg-gray-50' },
              { name: 'Cinza Escuro', value: 'bg-gray-900' },
              { name: 'Preto', value: 'bg-black' },
              { name: 'Azul', value: 'bg-blue-600' },
              { name: 'Roxo', value: 'bg-purple-600' },
              { name: 'Verde', value: 'bg-green-600' },
              { name: 'Laranja', value: 'bg-orange-600' },
            ].map((color) => (
              <button
                key={color.value}
                onClick={() => updateStyle('backgroundColor', color.value)}
                className={`h-12 rounded-lg border-2 ${color.value} ${
                  styles.backgroundColor === color.value
                    ? 'border-blue-600 ring-2 ring-blue-600'
                    : 'border-gray-300'
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Padding */}
        <div>
          <Label className="text-sm font-bold text-gray-900 mb-2">Espaçamento Interno</Label>
          <Select 
            value={styles.padding || 'py-20 px-6'} 
            onValueChange={(value) => updateStyle('padding', value)}
          >
            <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="py-12 px-6">Pequeno</SelectItem>
              <SelectItem value="py-20 px-6">Médio</SelectItem>
              <SelectItem value="py-32 px-6">Grande</SelectItem>
              <SelectItem value="py-40 px-6">Extra Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderMediaEditor = () => {
    const props = component.props;

    return (
      <div className="space-y-6">
        {/* Background Image */}
        {props.backgroundImage !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Imagem de Fundo (URL)
            </Label>
            <Input
              value={props.backgroundImage || ''}
              onChange={(e) => updateProp('backgroundImage', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        )}

        {/* Image */}
        {props.image !== undefined && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Imagem (URL)</Label>
            <Input
              value={props.image || ''}
              onChange={(e) => updateProp('image', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        )}

        {/* Video URL */}
        {(props.backgroundVideo !== undefined || props.video !== undefined) && (
          <div>
            <Label className="text-sm font-bold text-gray-900 mb-2">Vídeo (URL)</Label>
            <Input
              value={props.backgroundVideo || props.video || ''}
              onChange={(e) => updateProp(props.backgroundVideo !== undefined ? 'backgroundVideo' : 'video', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900"
              placeholder="https://exemplo.com/video.mp4"
            />
            <p className="text-xs text-gray-600 mt-1">
              Formatos suportados: MP4, WebM
            </p>
          </div>
        )}

        {/* Overlay Toggle */}
        {props.overlay !== undefined && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <button
              onClick={() => updateProp('overlay', !props.overlay)}
              className={`w-12 h-6 rounded-full transition-colors ${
                props.overlay ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                props.overlay ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
            <Label className="text-sm font-bold text-gray-900">
              Overlay Escuro
            </Label>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col border-2 border-gray-300 shadow-2xl bg-white">
      <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Propriedades
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium mt-1">
              {component.type.replace('-', ' ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:font-bold data-[state=active]:shadow-md"
            >
              <Type className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger 
              value="style"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:font-bold data-[state=active]:shadow-md"
            >
              <Palette className="w-4 h-4 mr-2" />
              Estilo
            </TabsTrigger>
            <TabsTrigger 
              value="media"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:font-bold data-[state=active]:shadow-md"
            >
              <Image className="w-4 h-4 mr-2" />
              Mídia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            {renderContentEditor()}
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            {renderStyleEditor()}
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            {renderMediaEditor()}
          </TabsContent>
        </Tabs>
      </CardContent>

      <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold"
          >
            <Check className="w-4 h-4 mr-2" />
            Aplicar
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
          >
            Fechar
          </Button>
        </div>
      </div>
    </Card>
  );
};
