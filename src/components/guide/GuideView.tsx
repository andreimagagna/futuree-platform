import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Users2, 
  Target, 
  BarChart4, 
  CheckSquare, 
  Bot,
  Zap,
  TrendingUp,
  Calendar,
  Filter,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  Play,
  MessageSquare,
  FileSpreadsheet,
  Settings,
  BookOpen
} from "lucide-react";
import { useState } from "react";

interface GuideViewProps {
  onNavigate?: (view: string) => void;
}

export const GuideView = ({ onNavigate }: GuideViewProps = {}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral do seu pipeline de vendas',
      color: 'text-blue-500',
      path: '/',
      items: [
        { title: 'Pipeline Summary', desc: 'Visualize leads por etapa em Kanban ou Funil' },
        { title: 'Activity Timeline', desc: 'Acompanhe atividades recentes do time' },
        { title: 'Agenda Widget', desc: 'Reuniões agendadas para hoje' },
        { title: 'Operations Panel', desc: 'Gerencie tarefas com drag-and-drop' },
      ]
    },
    {
      id: 'crm',
      title: 'CRM',
      icon: Users2,
      description: 'Gestão completa de leads e pipeline',
      color: 'text-green-500',
      path: '/crm',
      items: [
        { title: 'Kanban de Leads', desc: 'Arraste leads entre etapas do funil' },
        { title: 'Detalhes do Lead', desc: 'Edite informações, adicione tags e histórico' },
        { title: 'Próxima Ação', desc: 'Defina reuniões, ligações, e-mails e WhatsApp' },
        { title: 'BANT Methodology', desc: 'Qualifique com Budget, Authority, Need, Timeline' },
        { title: 'Forecast', desc: 'Previsão de vendas com probabilidade' },
        { title: 'Multi-Funnels', desc: 'Gerencie múltiplos funis de vendas' },
      ]
    },
    {
      id: 'funnel',
      title: 'Funil',
      icon: FileSpreadsheet,
      description: 'Análise visual do funil de vendas',
      color: 'text-purple-500',
      path: '/funnel',
      items: [
        { title: 'Health Score', desc: 'Score de saúde do funil em tempo real (0-100)' },
        { title: 'Sistema de Metas', desc: 'Configure metas por nível de qualificação' },
        { title: 'Métricas Detalhadas', desc: 'Conversão, volume, velocidade e qualidade' },
        { title: 'Funil Visual', desc: 'Visualização gráfica das etapas' },
        { title: 'Análise por Categoria', desc: 'Performance High/Medium/Low priority' },
      ]
    },
    {
      id: 'reports',
      title: 'Relatórios',
      icon: BarChart4,
      description: 'Análises e gráficos avançados',
      color: 'text-orange-500',
      path: '/reports',
      items: [
        { title: 'Sales Chart', desc: 'Receita, deals e ticket médio (6 meses)' },
        { title: 'Qualification Chart', desc: 'Taxa de qualificação e desqualificação' },
        { title: 'Meetings Chart', desc: 'Reuniões agendadas, realizadas e no-show' },
        { title: 'Forecast Chart', desc: 'Previsão vs real vs meta' },
        { title: 'Conversion Funnel', desc: 'Funil de conversão com 6 etapas' },
        { title: 'Performance Radar', desc: 'Análise multi-dimensional' },
        { title: 'Filtros de Período', desc: '7d, 30d, 90d, 6m, 1y - dados reais' },
        { title: 'KPIs Principais', desc: 'Receita, pipeline, qualificação, conversão' },
      ]
    },
    {
      id: 'tasks',
      title: 'Tarefas',
      icon: CheckSquare,
      description: 'Gestão de tarefas e atividades',
      color: 'text-pink-500',
      path: '/tasks',
      items: [
        { title: 'Kanban de Tarefas', desc: 'Backlog, In Progress, Review, Done' },
        { title: 'Drag & Drop', desc: 'Arraste tarefas entre colunas' },
        { title: 'Calendário', desc: 'Visualize tarefas por data' },
        { title: 'Checklists', desc: 'Progress bars de itens completados' },
        { title: 'Prioridades', desc: 'P1 (alta), P2 (média), P3 (baixa)' },
        { title: 'Prazos', desc: 'Indicadores de overdue e dias restantes' },
      ]
    },
    {
      id: 'automations',
      title: 'Automações',
      icon: Zap,
      description: 'Automatize processos e workflows',
      color: 'text-warning',
      path: '/automations',
      items: [
        { title: 'Triggers Inteligentes', desc: 'Ative ações baseadas em eventos' },
        { title: 'Workflows Visuais', desc: 'Crie fluxos de automação com drag-and-drop' },
        { title: 'Ações Customizadas', desc: 'Email, WhatsApp, tarefas, notificações' },
        { title: 'Condições', desc: 'Lógica condicional (if/then/else)' },
        { title: 'Templates Prontos', desc: 'Automações pré-configuradas' },
        { title: 'Histórico de Execução', desc: 'Veja todas automações executadas' },
      ]
    },
    {
      id: 'agent',
      title: 'Agente Virtual',
      icon: Bot,
      description: 'Conversas automatizadas com IA',
      color: 'text-cyan-500',
      comingSoon: true,
      items: [
        { title: 'Chat Interface', desc: 'Interface de 3 colunas (leads/chat/detalhes)' },
        { title: 'Conversas Ativas', desc: 'Lista de leads sendo atendidos' },
        { title: 'Score do Lead', desc: 'Visualize score de interesse (0-100)' },
        { title: 'Toggle Agente', desc: 'Ative/Pause respostas automáticas' },
        { title: 'Transferência', desc: 'Transfira para atendimento humano' },
        { title: 'Histórico', desc: 'Mensagens ordenadas cronologicamente' },
      ]
    },
  ];

  const quickTips = [
    {
      title: 'Arraste e Solte',
      icon: Zap,
      tip: 'Use drag-and-drop no CRM e Tarefas para mover itens rapidamente entre etapas',
      color: 'text-yellow-500'
    },
    {
      title: 'Filtros Ativos',
      icon: Filter,
      tip: 'Os filtros de período em Relatórios funcionam em tempo real com seus dados',
      color: 'text-blue-500'
    },
    {
      title: 'Health Score',
      icon: TrendingUp,
      tip: 'Score abaixo de 40 é crítico. Revise volume, conversão e velocidade do funil',
      color: 'text-red-500'
    },
    {
      title: 'Reuniões Priority',
      icon: Calendar,
      tip: 'Reunião é a primeira opção em "Próxima Ação" no CRM - sempre priorize!',
      color: 'text-green-500'
    },
    {
      title: 'Metas no Funil',
      icon: Target,
      tip: 'Configure metas por nível (High/Medium/Low) e acompanhe progress bars',
      color: 'text-purple-500'
    },
    {
      title: 'Multi-Funnels',
      icon: FileSpreadsheet,
      tip: 'Gerencie diferentes produtos/serviços com funis separados no CRM',
      color: 'text-orange-500'
    },
  ];

  const workflows = [
    {
      title: 'Workflow Completo: Do Lead ao Fechamento',
      steps: [
        { number: 1, action: 'Criar Lead no CRM', detail: 'Adicione nome, empresa, e-mail e telefone' },
        { number: 2, action: 'Qualificar com BANT', detail: 'Preencha Budget, Authority, Need, Timeline' },
        { number: 3, action: 'Definir Próxima Ação', detail: 'Escolha: Reunião, WhatsApp, E-mail ou Ligação' },
        { number: 4, action: 'Criar Tarefa', detail: 'Adicione checklist e prazo' },
        { number: 5, action: 'Mover no Pipeline', detail: 'Arraste para etapas: Qualify → Contact → Proposal → Closing' },
        { number: 6, action: 'Acompanhar Métricas', detail: 'Verifique Health Score e Relatórios periodicamente' },
      ]
    },
    {
      title: 'Workflow Rápido: Qualificação Express',
      steps: [
        { number: 1, action: 'Abrir Lead no CRM', detail: 'Clique no card do lead' },
        { number: 2, action: 'Preencher Score', detail: 'Adicione pontuação (0-100)' },
        { number: 3, action: 'Adicionar Tags', detail: 'Ex: "Hot Lead", "Enterprise", "Decision Maker"' },
        { number: 4, action: 'Agendar Reunião', detail: 'Próxima Ação → Reunião + Data + Hora' },
        { number: 5, action: 'Salvar', detail: 'Todas alterações são salvas automaticamente' },
      ]
    },
  ];

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      const view = path === '/' ? 'dashboard' : path.replace('/', '');
      onNavigate(view);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Guia do Sales Solution
        </h1>
      </div>

      {/* Quick Access Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Bem-vindo ao Sales Solution!</h3>
              <p className="text-sm text-muted-foreground">
                Sistema completo de gestão de vendas com 6 módulos integrados
              </p>
            </div>
            <Badge className="text-base px-4 py-2">
              <Play className="h-4 w-4 mr-2" />
              Comece Agora
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" />
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

        {/* TAB 1: Overview das Funcionalidades */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleNavigate(feature.path)}
                      >
                        Acessar
                        <ArrowRight className="h-4 w-4 ml-2" />
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
                  <Settings className="h-5 w-5 text-primary" />
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

          {/* Common Actions Quick Reference */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Ações Comuns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Criar
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <kbd className="px-2 py-0.5 bg-card rounded text-xs">+ Novo Lead</kbd> no CRM</li>
                    <li>• <kbd className="px-2 py-0.5 bg-card rounded text-xs">+ Nova Tarefa</kbd> no Dashboard</li>
                    <li>• <kbd className="px-2 py-0.5 bg-card rounded text-xs">Configurar Meta</kbd> no Funil</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Editar
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Clique no card do lead para abrir detalhes</li>
                    <li>• Arraste cards para mudar de etapa</li>
                    <li>• Edite tarefas inline ou no drawer</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use filtros de período em Relatórios</li>
                    <li>• Filtre por tags, prioridade e valor no CRM</li>
                    <li>• Ordene tarefas por status ou prazo</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Botão de deletar em cada card</li>
                    <li>• Confirmação antes de excluir</li>
                    <li>• Ação irreversível - tenha cuidado!</li>
                  </ul>
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

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atalhos e Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Navegação Rápida</h4>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Dashboard</span>
                      <Badge variant="outline">Tecla D</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">CRM</span>
                      <Badge variant="outline">Tecla C</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Tarefas</span>
                      <Badge variant="outline">Tecla T</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Relatórios</span>
                      <Badge variant="outline">Tecla R</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Funil</span>
                      <Badge variant="outline">Tecla F</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Agente</span>
                      <Badge variant="outline">Tecla A</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Guia</span>
                      <Badge variant="outline">Tecla G</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">⚡ Recursos Avançados</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>useMemo</strong> em Relatórios: Otimização de performance para grandes volumes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Real-time Updates</strong>: Todas as métricas atualizam automaticamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Zustand Store</strong>: Estado global persistente entre páginas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Toast Notifications</strong>: Feedback visual para todas as ações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Responsive Design</strong>: Funciona perfeitamente em mobile e desktop</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">📊 Interpretando Métricas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-muted/50 rounded">
                      <strong>Health Score:</strong> Pontuação composta de 4 fatores:
                      <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                        <li>• Conversão (35%) - Taxa de fechamento</li>
                        <li>• Volume (25%) - Quantidade de leads</li>
                        <li>• Qualidade (25%) - Etapas saudáveis</li>
                        <li>• Velocidade (15%) - Leads/dia no topo</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <strong>Classificação:</strong>
                      <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                        <li>• 80-100: <Badge variant="default" className="ml-1">Excelente</Badge></li>
                        <li>• 60-79: <Badge variant="secondary" className="ml-1">Bom</Badge></li>
                        <li>• 40-59: <Badge variant="outline" className="ml-1">Regular</Badge></li>
                        <li>• 0-39: <Badge variant="destructive" className="ml-1">Crítico</Badge></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Melhores Práticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">1</Badge>
                  <div>
                    <strong>Atualize o CRM diariamente</strong>
                    <p className="text-muted-foreground mt-1">
                      Mantenha informações de leads sempre atualizadas para métricas precisas
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">2</Badge>
                  <div>
                    <strong>Priorize reuniões presenciais</strong>
                    <p className="text-muted-foreground mt-1">
                      Use "Reunião" como próxima ação sempre que possível - maior taxa de conversão
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">3</Badge>
                  <div>
                    <strong>Configure metas realistas</strong>
                    <p className="text-muted-foreground mt-1">
                      Baseie metas no histórico e capacidade do time, ajuste mensalmente
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">4</Badge>
                  <div>
                    <strong>Monitore o Health Score semanalmente</strong>
                    <p className="text-muted-foreground mt-1">
                      Score abaixo de 40 requer ação imediata - analise gargalos no funil
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">5</Badge>
                  <div>
                    <strong>Use tags para segmentação</strong>
                    <p className="text-muted-foreground mt-1">
                      Organize leads por origem, interesse, urgência - facilita follow-ups
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Precisa de ajuda?</h3>
              <p className="text-sm text-muted-foreground">
                Explore cada módulo ou entre em contato com o suporte
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleNavigate('/')}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Ir para Dashboard
              </Button>
              <Button onClick={() => handleNavigate('/crm')}>
                <Users2 className="h-4 w-4 mr-2" />
                Começar no CRM
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
