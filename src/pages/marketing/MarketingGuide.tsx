import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Megaphone,
  CheckSquare,
  GitBranch,
  Sparkles,
  Database,
  Palette,
  Layout,
  BookOpen,
  ArrowRight,
  Play,
  Target,
  Users,
  Heart,
  Type,
  Zap,
  TrendingUp,
  Lightbulb,
  Calendar,
  Tag,
  Mail
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function MarketingGuide() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const features = [
    {
      id: 'campanhas',
      title: 'Campanhas',
      icon: Megaphone,
      description: 'Gerencie campanhas de marketing do início ao fim',
      color: 'text-accent',
      path: '/marketing/campanhas',
      items: [
        { title: 'Criação de Campanhas', desc: 'Nome, objetivo, período e orçamento' },
        { title: 'Múltiplos Canais', desc: 'Email, Social, Ads, WhatsApp, SEO' },
        { title: 'Status Tracking', desc: 'Draft, Active, Paused, Completed' },
        { title: 'Métricas', desc: 'Impressões, cliques, conversões e ROI' },
        { title: 'Templates', desc: 'Modelos prontos para diferentes objetivos' },
      ]
    },
    {
      id: 'tasks',
      title: 'Tasks',
      icon: CheckSquare,
      description: 'Gestão de tarefas de marketing',
      color: 'text-warning',
      path: '/marketing/tasks',
      items: [
        { title: 'Kanban Board', desc: 'To Do, In Progress, Review, Done' },
        { title: 'Checklists', desc: 'Subtarefas com progress tracking' },
        { title: 'Prioridades', desc: 'Alta, Média, Baixa com indicadores visuais' },
        { title: 'Datas e Prazos', desc: 'Due dates e alertas de vencimento' },
        { title: 'Categorização', desc: 'Organize por tipo de atividade' },
      ]
    },
    {
      id: 'construtor-funil',
      icon: GitBranch,
      description: 'Crie funis de conversão visuais e interativos',
      color: 'text-primary',
      path: '/marketing/construtor-funil',
      comingSoon: true,
      items: [
        { title: 'Editor Visual', desc: 'Drag-and-drop de etapas do funil' },
        { title: 'Etapas Customizáveis', desc: 'Nome, descrição e configuração' },
        { title: 'Automações', desc: 'Triggers e ações entre etapas' },
        { title: 'Templates Prontos', desc: 'Funis pré-configurados para começar rápido' },
        { title: 'Analytics Integrado', desc: 'Métricas de conversão em tempo real' },
      ]
    },
    {
      id: 'creator-solutions',
      title: 'Creator Solutions',
      icon: Sparkles,
      description: 'Ferramentas para criadores de conteúdo',
      color: 'text-success',
      path: '/marketing/creator-solutions',
      items: [
        { title: 'Identidade do Creator', desc: 'Defina quem você é e sua voz' },
        { title: 'Pilares de Conteúdo', desc: '3-5 temas principais com objetivos' },
        { title: 'Calendário Editorial', desc: 'Planeje conteúdos com datas e plataformas' },
        { title: 'Board de Ideias', desc: 'Capture e organize ideias de conteúdo' },
        { title: 'Gerador de Storytelling', desc: 'Templates para criar narrativas envolventes' },
      ]
    },
    {
      id: 'base-leads',
      title: 'Base de Leads',
      icon: Database,
      description: 'CRM simples para gerenciar contatos',
      color: 'text-muted-foreground',
      path: '/marketing/base-leads',
      items: [
        { title: 'CRUD Completo', desc: 'Criar, editar, visualizar e deletar leads' },
        { title: 'Informações Detalhadas', desc: 'Nome, email, telefone, empresa, cargo' },
        { title: 'Status de Lead', desc: 'Lead, Qualificado, Cliente, Perdido' },
        { title: 'Tags e Origem', desc: 'Categorize e rastreie fonte dos leads' },
        { title: 'Busca e Filtros', desc: 'Encontre leads rapidamente' },
        { title: 'Exportação', desc: 'Exporte sua base em CSV' },
      ]
    },
    {
      id: 'landing-pages',
      title: 'Landing Pages',
      icon: Layout,
      description: 'Editor de landing pages (Em breve)',
      color: 'text-accent',
      path: '/marketing/landing-pages',
      comingSoon: true,
      items: [
        { title: 'Editor Visual', desc: 'Construa páginas sem código' },
        { title: 'Templates Premium', desc: 'Designs profissionais prontos' },
        { title: 'Mobile Responsive', desc: 'Páginas otimizadas para mobile' },
        { title: 'SEO Optimized', desc: 'Meta tags e performance' },
      ]
    },
  ];

  const quickTips = [
    {
      title: 'Planeje com Antecedência',
      icon: Calendar,
      tip: 'Use o Calendário Editorial para planejar conteúdos com pelo menos 2 semanas de antecedência',
      color: 'text-primary'
    },
    {
      title: 'Consistência é Chave',
      icon: Target,
      tip: 'Mantenha seus pilares de conteúdo alinhados com o Branding para mensagem consistente',
      color: 'text-success'
    },
    {
      title: 'Capture Ideias',
      icon: Lightbulb,
      tip: 'Use o Board de Ideias sempre que tiver inspiração - não deixe passar!',
      color: 'text-warning'
    },
    {
      title: 'Nutra Seus Leads',
      icon: Users,
      tip: 'Base de Leads + Campanhas = Nutrição efetiva. Segmente e personalize',
      color: 'text-accent'
    },
    {
      title: 'Teste e Otimize',
      icon: TrendingUp,
      tip: 'Use métricas das Campanhas para identificar o que funciona e replique',
      color: 'text-success'
    },
    {
      title: 'Branded Content',
      icon: Heart,
      tip: 'Primal Branding + Creator Solutions = Conteúdo autêntico que converte',
      color: 'text-primary'
    },
  ];

  const workflows = [
    {
      title: 'Workflow: Lançamento de Campanha Completa',
      steps: [
        { number: 1, action: 'Definir Branding', detail: 'Complete Paleta, Tipografia e Posicionamento' },
        { number: 2, action: 'Criar Pilares de Conteúdo', detail: 'Em Creator Solutions, defina 3-5 pilares estratégicos' },
        { number: 3, action: 'Planejar Calendário', detail: 'Schedule conteúdos alinhados aos pilares' },
        { number: 4, action: 'Criar Campanha', detail: 'Configure objetivo, canais, orçamento e período' },
        { number: 5, action: 'Construir Funil', detail: 'Use Construtor de Funis para mapear jornada' },
        { number: 6, action: 'Executar e Monitorar', detail: 'Acompanhe métricas e ajuste conforme necessário' },
      ]
    },
    {
      title: 'Workflow: Nutrição de Leads',
      steps: [
        { number: 1, action: 'Importar/Adicionar Leads', detail: 'Na Base de Leads, adicione contatos' },
        { number: 2, action: 'Segmentar por Tags', detail: 'Organize por interesse, origem ou estágio' },
        { number: 3, action: 'Criar Campanha de Email', detail: 'Configure campanha segmentada' },
        { number: 4, action: 'Preparar Conteúdo', detail: 'Use Board de Ideias e Storytelling' },
        { number: 5, action: 'Agendar Envios', detail: 'Planeje sequência de emails' },
        { number: 6, action: 'Qualificar Leads', detail: 'Mova leads engajados para "Qualificado"' },
      ]
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Guia do Marketing Solution
        </h1>
        <p className="text-muted-foreground mt-1">
          Tudo que você precisa saber para dominar o Marketing Solution
        </p>
      </div>

      {/* Quick Access Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Bem-vindo ao Marketing Solution!</h3>
              <p className="text-sm text-muted-foreground">
                Ferramentas completas para campanhas, conteúdo e branding
              </p>
            </div>
            <Badge className="text-base px-4 py-2">
              <Play className="h-4 w-4 mr-2" />
              7 Módulos Integrados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Megaphone className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="workflows">
            <ArrowRight className="h-4 w-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Zap className="h-4 w-4 mr-2" />
            Dicas Rápidas
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isComingSoon = !!feature.comingSoon;
              return (
                <Card key={feature.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                            {isComingSoon && (
                              <Badge variant="secondary" className="text-xs">Em Breve</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleNavigate(feature.path)}
                        disabled={isComingSoon}
                      >
                        {isComingSoon ? 'Em Breve' : 'Acessar'}
                        {!isComingSoon && <ArrowRight className="h-4 w-4 ml-2" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {feature.items.map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="mt-0.5">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: Workflows */}
        <TabsContent value="workflows" className="space-y-4">
          {workflows.map((workflow, wIdx) => (
            <Card key={wIdx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  {workflow.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflow.steps.map((step) => (
                    <div key={step.number} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="font-semibold mb-1">{step.action}</h4>
                        <p className="text-sm text-muted-foreground">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Integration Tips */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Integração Entre Módulos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Creator Solutions + Branding</strong>
                    <p className="text-muted-foreground mt-1">
                      Use os pilares de conteúdo alinhados com o Primal Branding para mensagem consistente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
                  <Database className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Base de Leads + Campanhas</strong>
                    <p className="text-muted-foreground mt-1">
                      Segmente leads por tags e crie campanhas personalizadas para cada grupo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
                  <GitBranch className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Construtor de Funis + Landing Pages</strong>
                    <p className="text-muted-foreground mt-1">
                      Crie funis visuais e conecte com landing pages otimizadas para conversão
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Dicas Rápidas */}
        <TabsContent value="tips" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {quickTips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <Card key={idx} className="hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 bg-muted rounded-lg ${tip.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.tip}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Best Practices */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Melhores Práticas de Marketing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">1</Badge>
                  <div>
                    <strong>Documente seu Branding primeiro</strong>
                    <p className="text-muted-foreground mt-1">
                      Complete os 7 elementos do Primal Branding antes de criar qualquer campanha
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">2</Badge>
                  <div>
                    <strong>Crie um calendário editorial mensal</strong>
                    <p className="text-muted-foreground mt-1">
                      Planeje todo conteúdo com antecedência - improviso não escala
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">3</Badge>
                  <div>
                    <strong>Segmente sua base de leads</strong>
                    <p className="text-muted-foreground mt-1">
                      Use tags inteligentes para personalizar comunicação
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">4</Badge>
                  <div>
                    <strong>Acompanhe métricas de campanhas</strong>
                    <p className="text-muted-foreground mt-1">
                      ROI, conversão e engajamento devem guiar decisões
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">5</Badge>
                  <div>
                    <strong>Reutilize e repurpose conteúdo</strong>
                    <p className="text-muted-foreground mt-1">
                      Um post pode virar email, story, carousel e vídeo
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Primal Branding Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Os 7 Elementos do Primal Branding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <strong>1. História de Criação</strong>
                  <p className="text-muted-foreground mt-1">Por que você existe?</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <strong>2. Credo</strong>
                  <p className="text-muted-foreground mt-1">No que você acredita?</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <strong>3. Ícones</strong>
                  <p className="text-muted-foreground mt-1">Símbolos visuais</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <strong>4. Rituais</strong>
                  <p className="text-muted-foreground mt-1">Ações repetitivas</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <strong>5. Pagãos</strong>
                  <p className="text-muted-foreground mt-1">Quem não é seu público</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <strong>6. Palavras Sagradas</strong>
                  <p className="text-muted-foreground mt-1">Linguagem única</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg col-span-2">
                  <strong>7. Líder</strong>
                  <p className="text-muted-foreground mt-1">Rosto da marca</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Pronto para começar?</h3>
              <p className="text-sm text-muted-foreground">
                Comece pelo Branding e construa uma base sólida
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleNavigate('/marketing/branding')}>
                <Palette className="h-4 w-4 mr-2" />
                Ir para Branding
              </Button>
              <Button onClick={() => handleNavigate('/marketing/campanhas')}>
                <Megaphone className="h-4 w-4 mr-2" />
                Criar Campanha
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
