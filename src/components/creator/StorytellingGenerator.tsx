import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStorytellingTemplates } from '@/hooks/useCreatorAPI';
import { Sparkles, Loader2 } from 'lucide-react';

export function StorytellingGenerator() {
  const { data: templates = [], isLoading } = useStorytellingTemplates();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Templates de Storytelling</h3>
        <p className="text-sm text-muted-foreground">
          Estruturas prontas para criar narrativas envolventes
        </p>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Template</h3>
            <p className="text-muted-foreground">
              Crie templates de storytelling personalizados
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {template.name}
                  </CardTitle>
                  {template.is_default && (
                    <Badge variant="secondary" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {template.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {template.structure?.hook && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Hook:</p>
                    <p className="text-sm">{template.structure.hook}</p>
                  </div>
                )}
                {template.structure?.story && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">História:</p>
                    <p className="text-sm">{template.structure.story}</p>
                  </div>
                )}
                {template.structure?.value && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Valor:</p>
                    <p className="text-sm">{template.structure.value}</p>
                  </div>
                )}
                {template.structure?.cta && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">CTA:</p>
                    <p className="text-sm">{template.structure.cta}</p>
                  </div>
                )}
                {template.use_case && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      💡 {template.use_case}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
