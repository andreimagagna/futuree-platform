import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useCreatorIdentity, 
  useContentPillars, 
  useEditorialCalendar, 
  useContentIdeas 
} from '@/hooks/useCreatorAPI';
import { 
  User, 
  Target, 
  Calendar, 
  Lightbulb, 
  Sparkles, 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Loader2
} from 'lucide-react';
import { CreatorIdentityForm } from '@/components/creator/CreatorIdentityForm';
import { ContentPillarsManager } from '@/components/creator/ContentPillarsManager';
import { EditorialCalendar } from '@/components/creator/EditorialCalendar';
import { IdeasBoard } from '@/components/creator/IdeasBoard';
import { StorytellingGenerator } from '@/components/creator/StorytellingGenerator';
import { Badge } from '@/components/ui/badge';

export function CreatorSolutions() {
  // 🔥 INTEGRAÇÃO COM SUPABASE - Usando React Query
  const { data: identity, isLoading: loadingIdentity } = useCreatorIdentity();
  const { data: pillars = [], isLoading: loadingPillars } = useContentPillars();
  const { data: calendar = [], isLoading: loadingCalendar } = useEditorialCalendar();
  const { data: ideas = [], isLoading: loadingIdeas } = useContentIdeas();
  
  const [activeTab, setActiveTab] = useState('identity');
  
  const isLoading = loadingIdentity || loadingPillars || loadingCalendar || loadingIdeas;

  // Statistics
  const stats = {
    pillars: pillars.length,
    scheduledContent: calendar.filter(c => c.status !== 'published').length,
    publishedContent: calendar.filter(c => c.status === 'published').length,
    activeIdeas: ideas.filter(i => i.status === 'idea').length,
  };

  const OBJECTIVE_CONFIG = {
    attraction: { label: 'Atração', icon: Users, color: 'text-primary' },
    authority: { label: 'Autoridade', icon: Target, color: 'text-accent' },
    engagement: { label: 'Engajamento', icon: TrendingUp, color: 'text-success' },
    conversion: { label: 'Conversão', icon: DollarSign, color: 'text-warning' },
  };

  return (
    <div className="space-y-6">
      {/* Header Padronizado */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Creator Solutions</h1>
          <p className="text-muted-foreground">Crie conteúdo estratégico e fortaleça sua presença digital</p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Carregando...</span>
          </div>
        )}
      </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pilares Ativos</p>
                  <p className="text-2xl font-bold">
                    {loadingPillars ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      stats.pillars
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conteúdos Planejados</p>
                  <p className="text-2xl font-bold">
                    {loadingCalendar ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      stats.scheduledContent
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Publicados</p>
                  <p className="text-2xl font-bold">
                    {loadingCalendar ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      stats.publishedContent
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ideias</p>
                  <p className="text-2xl font-bold">
                    {loadingIdeas ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      stats.activeIdeas
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="identity" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Identidade</span>
            </TabsTrigger>
            <TabsTrigger value="pillars" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Pilares</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendário</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Ideias</span>
            </TabsTrigger>
            <TabsTrigger value="storytelling" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Storytelling</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <CreatorIdentityForm />
            
            {/* Quick Tips */}
            {!identity && (
              <Card className="border-primary/20 bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Por que definir sua identidade?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Clareza sobre quem você é e o que representa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Consistência na comunicação em todos os canais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Conexão mais profunda com sua audiência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Base para criar storytelling autêntico e impactante</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pillars" className="space-y-6">
            <ContentPillarsManager />
            
            {/* Pillars Overview */}
            {pillars.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Objetivo</CardTitle>
                  <CardDescription>Veja como seus pilares se distribuem por objetivo estratégico</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(OBJECTIVE_CONFIG).map(([key, config]) => {
                      const count = pillars.filter(p => p.objective === key).length;
                      const Icon = config.icon;
                      return (
                        <div key={key} className="text-center space-y-2">
                          <div className={`w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center ${config.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{count}</p>
                            <p className="text-xs text-muted-foreground">{config.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <EditorialCalendar />
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            <IdeasBoard />
          </TabsContent>

          <TabsContent value="storytelling" className="space-y-6">
            <StorytellingGenerator />
          </TabsContent>
        </Tabs>

        {/* Onboarding Guide */}
        {!identity && pillars.length === 0 && (
          <Card className="border-2 border-dashed border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Comece sua jornada criativa!
              </CardTitle>
              <CardDescription>Siga esses passos para configurar seu workspace completo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Defina sua Identidade</p>
                    <p className="text-sm text-muted-foreground">Comece estabelecendo quem você é, sua voz e propósito</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Crie seus Pilares de Conteúdo</p>
                    <p className="text-sm text-muted-foreground">Defina 3 a 5 pilares estratégicos para organizar seu conteúdo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Brainstorm de Ideias</p>
                    <p className="text-sm text-muted-foreground">Capture todas as suas ideias no board e organize-as</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Planeje no Calendário</p>
                    <p className="text-sm text-muted-foreground">Transforme ideias em conteúdos planejados com datas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <p className="font-semibold">Crie Storytelling Envolvente</p>
                    <p className="text-sm text-muted-foreground">Use os templates para criar narrativas que conectam</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
