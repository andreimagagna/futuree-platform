import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBrandSettings, useUpsertBrandSettings } from '@/hooks/useCreatorAPI';
import { Loader2, Save, Building2, Palette, Link as LinkIcon, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BrandSettingsForm() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useBrandSettings();
  const { mutate: upsertSettings, isPending } = useUpsertBrandSettings();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    primary_color: '#3b82f6',
    secondary_color: '#8b5cf6',
    accent_color: '#ec4899',
    text_color: '#1f2937',
    background_color: '#ffffff',
    font_heading: 'Inter',
    font_body: 'Inter',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        primary_color: settings.primary_color || '#3b82f6',
        secondary_color: settings.secondary_color || '#8b5cf6',
        accent_color: settings.accent_color || '#ec4899',
        text_color: settings.text_color || '#1f2937',
        background_color: settings.background_color || '#ffffff',
        font_heading: settings.font_heading || 'Inter',
        font_body: settings.font_body || 'Inter',
      });
    }
  }, [settings]);

  const handleSave = () => {
    const payload = {
      primary_color: formData.primary_color,
      secondary_color: formData.secondary_color,
      accent_color: formData.accent_color,
      text_color: formData.text_color,
      background_color: formData.background_color,
      font_heading: formData.font_heading,
      font_body: formData.font_body,
    };

    upsertSettings(payload, {
      onSuccess: () => {
        toast({ 
          title: 'Configurações salvas!', 
          description: 'As configurações da marca foram atualizadas com sucesso.' 
        });
        setIsEditing(false);
      },
      onError: (error) => {
        console.error('Erro ao salvar configurações:', error);
        toast({ 
          title: 'Erro ao salvar', 
          description: 'Não foi possível salvar as configurações. Tente novamente.',
          variant: 'destructive' 
        });
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Modo visualização quando não está editando e tem dados
  if (!isEditing && settings) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <CardTitle className="text-lg md:text-xl">Identidade Visual da Marca</CardTitle>
              </div>
              <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                Editar
              </Button>
            </div>
            <CardDescription className="text-sm">Paleta de cores e tipografia configuradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {/* Cores */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Paleta de Cores</p>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                <div className="text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 shadow-sm" 
                    style={{ backgroundColor: settings.primary_color }}
                  />
                  <p className="text-xs mt-1.5 font-medium">Primária</p>
                  <p className="text-xs text-muted-foreground">{settings.primary_color}</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 shadow-sm" 
                    style={{ backgroundColor: settings.secondary_color }}
                  />
                  <p className="text-xs mt-1.5 font-medium">Secundária</p>
                  <p className="text-xs text-muted-foreground">{settings.secondary_color}</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 shadow-sm" 
                    style={{ backgroundColor: settings.accent_color }}
                  />
                  <p className="text-xs mt-1.5 font-medium">Destaque</p>
                  <p className="text-xs text-muted-foreground">{settings.accent_color}</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 shadow-sm" 
                    style={{ backgroundColor: settings.text_color }}
                  />
                  <p className="text-xs mt-1.5 font-medium">Texto</p>
                  <p className="text-xs text-muted-foreground">{settings.text_color}</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 shadow-sm" 
                    style={{ backgroundColor: settings.background_color }}
                  />
                  <p className="text-xs mt-1.5 font-medium">Fundo</p>
                  <p className="text-xs text-muted-foreground">{settings.background_color}</p>
                </div>
              </div>
            </div>

            {/* Tipografia */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Tipografia</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Fonte dos Títulos</p>
                  <p className="font-semibold text-sm md:text-base" style={{ fontFamily: settings.font_heading }}>
                    {settings.font_heading || 'Inter'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fonte do Corpo</p>
                  <p className="font-normal text-sm md:text-base" style={{ fontFamily: settings.font_body }}>
                    {settings.font_body || 'Inter'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Identidade Visual */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <CardTitle className="text-lg md:text-xl">Identidade Visual</CardTitle>
          </div>
          <CardDescription className="text-sm">Defina as cores e fontes da sua marca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Cores */}
          <div className="space-y-3 md:space-y-4">
            <Label className="text-sm md:text-base">Paleta de Cores</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color" className="text-xs md:text-sm">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primary_color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-14 h-9 md:w-16 md:h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    placeholder="#3b82f6"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_color" className="text-xs md:text-sm">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="secondary_color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-14 h-9 md:w-16 md:h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    placeholder="#8b5cf6"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent_color" className="text-xs md:text-sm">Cor de Destaque</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="accent_color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-14 h-9 md:w-16 md:h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    placeholder="#ec4899"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_color" className="text-xs md:text-sm">Cor do Texto</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="text_color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-14 h-9 md:w-16 md:h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    placeholder="#1f2937"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background_color" className="text-xs md:text-sm">Cor de Fundo</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="background_color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="w-14 h-9 md:w-16 md:h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    placeholder="#ffffff"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fontes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="font_heading" className="text-xs md:text-sm">Fonte dos Títulos</Label>
              <Input
                id="font_heading"
                value={formData.font_heading}
                onChange={(e) => setFormData({ ...formData, font_heading: e.target.value })}
                placeholder="Ex: Inter, Poppins"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="font_body" className="text-xs md:text-sm">Fonte do Corpo</Label>
              <Input
                id="font_body"
                value={formData.font_body}
                onChange={(e) => setFormData({ ...formData, font_body: e.target.value })}
                placeholder="Ex: Inter, Roboto"
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões Salvar/Cancelar */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3">
        {settings && (
          <Button onClick={() => setIsEditing(false)} variant="outline" size="lg" className="w-full sm:w-auto">
            Cancelar
          </Button>
        )}
        <Button onClick={handleSave} disabled={isPending} size="lg" className="w-full sm:w-auto">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
