import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BookOpen,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Lightbulb,
  Target,
  Zap,
  ArrowRight,
  Play,
  CheckCircle2,
  FolderKanban,
  Settings,
  FileSpreadsheet,
  HeartHandshake
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuiaBusiness = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const businessFeatures = [
    {
      id: 'estrategico',
      title: 'Estratégico',
      icon: Target,
      description: 'Planejamento estratégico e visão de longo prazo',
      color: 'text-blue-500',
      path: '/business/estrategico',
      items: [
        { title: 'OKRs & Metas', desc: 'Defina objetivos e resultados-chave trimestrais' },
        { title: 'Roadmap de Produto', desc: 'Planeje releases e funcionalidades futuras' },
        { title: 'Análise SWOT', desc: 'Forças, Fraquezas, Oportunidades e Ameaças' },
        { title: 'KPIs Estratégicos', desc: 'Indicadores de crescimento e market share' },
        { title: 'Visão de Mercado', desc: 'Tendências, competitors e posicionamento' },
        { title: 'Planejamento Financeiro', desc: 'Projeções de receita e investimentos' },
      ]
    },
    {
      id: 'operacional',
      title: 'Operacional',
      icon: Settings,
      description: 'Gestão de operações e processos diários',
      color: 'text-green-500',
      path: '/business/operacional',
      items: [
        { title: 'Processos & SOPs', desc: 'Padronize procedimentos operacionais' },
        { title: 'Gestão de Recursos', desc: 'Alocação de equipe e materiais' },
        { title: 'Indicadores Operacionais', desc: 'Produtividade, eficiência e qualidade' },
        { title: 'Cadeia de Suprimentos', desc: 'Fornecedores, estoque e logística' },
        { title: 'Automação de Processos', desc: 'Workflows e integrações automatizadas' },
        { title: 'Controle de Qualidade', desc: 'Métricas de performance e satisfação' },
      ]
    },
    {
      id: 'financas',
      title: 'Finanças',
      icon: DollarSign,
      description: 'Controle financeiro e análise de resultados',
      color: 'text-yellow-500',
      path: '/business/financas',
      items: [
        { title: 'Fluxo de Caixa', desc: 'Entradas, saídas e saldo projetado' },
        { title: 'DRE & Balanço', desc: 'Demonstrativos financeiros completos' },
        { title: 'Análise de Custos', desc: 'Custos fixos, variáveis e margem' },
        { title: 'Budget & Forecast', desc: 'Orçamento anual e previsões mensais' },
        { title: 'Contas a Pagar/Receber', desc: 'Gestão de fornecedores e clientes' },
        { title: 'Impostos & Compliance', desc: 'Obrigações fiscais e regulatórias' },
      ]
    },
    {
      id: 'customer-success',
      title: 'Customer Success',
      icon: HeartHandshake,
      description: 'Gestão de relacionamento e sucesso do cliente',
      color: 'text-purple-500',
      path: '/business/customer-success',
      items: [
        { title: 'Onboarding de Clientes', desc: 'Processo de ativação e treinamento' },
        { title: 'Health Score', desc: 'Pontuação de saúde e engajamento' },
        { title: 'Churn Prevention', desc: 'Identificação de riscos e retenção' },
        { title: 'NPS & Feedback', desc: 'Net Promoter Score e pesquisas' },
        { title: 'Upsell & Cross-sell', desc: 'Oportunidades de expansão' },
        { title: 'Customer Journey', desc: 'Mapeamento da jornada do cliente' },
      ]
    },
    {
      id: 'arquivos',
      title: 'Arquivos',
      icon: FolderKanban,
      description: 'Gestão de documentos e base de conhecimento',
      color: 'text-orange-500',
      path: '/business/arquivos',
      items: [
        { title: 'Biblioteca de Documentos', desc: 'Organize contratos, propostas e manuais' },
        { title: 'Versionamento', desc: 'Controle de versões e histórico' },
        { title: 'Compartilhamento', desc: 'Permissões e links compartilháveis' },
        { title: 'Templates', desc: 'Modelos reutilizáveis de documentos' },
        { title: 'Base de Conhecimento', desc: 'Wiki interna e documentação' },
        { title: 'Busca Inteligente', desc: 'Encontre documentos rapidamente' },
      ]
    },
    {
      id: 'notion-solutions',
      title: 'Notion Solutions',
      icon: Lightbulb,
      description: 'Templates e workspaces do Notion integrados',
      color: 'text-pink-500',
      path: '/business/notion-solutions',
      items: [
        { title: 'Templates de Negócio', desc: 'Modelos prontos para diferentes áreas' },
        { title: 'Databases Conectadas', desc: 'CRM, projetos e tarefas sincronizados' },
        { title: 'Dashboards Notion', desc: 'Visões personalizadas e relatórios' },
        { title: 'Automações', desc: 'Integre com Zapier e Make' },
        { title: 'Colaboração', desc: 'Workspaces compartilhados com o time' },
        { title: 'Wiki Empresarial', desc: 'Base de conhecimento centralizada' },
      ]
    },
  ];

  const quickTips = [
    {
      title: 'Visão 360°',
      icon: Target,
      tip: 'Use todos os módulos integrados para ter uma visão completa do seu negócio',
      color: 'text-blue-500'
    },
    {
      title: 'OKRs Trimestrais',
      icon: TrendingUp,
      tip: 'Defina Objetivos e Key Results a cada trimestre no módulo Estratégico',
      color: 'text-green-500'
    },
    {
      title: 'Health Score Cliente',
      icon: HeartHandshake,
      tip: 'Monitore o score de saúde dos clientes semanalmente para prevenir churn',
      color: 'text-purple-500'
    },
    {
      title: 'Fluxo de Caixa',
      icon: DollarSign,
      tip: 'Atualize o fluxo de caixa diariamente para ter controle financeiro preciso',
      color: 'text-yellow-500'
    },
    {
      title: 'SOPs Documentados',
      icon: FileText,
      tip: 'Crie procedimentos padrão para todas as operações críticas do negócio',
      color: 'text-orange-500'
    },
    {
      title: 'Notion Integration',
      icon: Lightbulb,
      tip: 'Sincronize seus workspaces do Notion para centralizar toda informação',
      color: 'text-pink-500'
    },
  ];

  const workflows = [
    {
      title: 'Workflow: Planejamento Estratégico Completo',
      steps: [
        { number: 1, action: 'Análise SWOT', detail: 'Identifique forças, fraquezas, oportunidades e ameaças' },
        { number: 2, action: 'Definir OKRs', detail: 'Estabeleça 3-5 objetivos com resultados-chave mensuráveis' },
        { number: 3, action: 'Criar Roadmap', detail: 'Planeje releases e milestones dos próximos 12 meses' },
        { number: 4, action: 'Alocar Budget', detail: 'Distribua recursos financeiros por iniciativa' },
        { number: 5, action: 'Definir KPIs', detail: 'Escolha indicadores para acompanhar progresso' },
        { number: 6, action: 'Review Mensal', detail: 'Revise e ajuste estratégia mensalmente' },
      ]
    },
    {
      title: 'Workflow: Gestão de Customer Success',
      steps: [
        { number: 1, action: 'Onboarding', detail: 'Configure processo de ativação do cliente (0-30 dias)' },
        { number: 2, action: 'Health Score', detail: 'Defina critérios de pontuação (uso, engajamento, suporte)' },
        { number: 3, action: 'Check-ins Regulares', detail: 'Agende reuniões trimestrais com todos os clientes' },
        { number: 4, action: 'Pesquisas NPS', detail: 'Envie NPS a cada 6 meses para medir satisfação' },
        { number: 5, action: 'Identificar Riscos', detail: 'Marque clientes com score baixo para ação preventiva' },
        { number: 6, action: 'Upsell Opportunities', detail: 'Ofereça upgrades para clientes engajados' },
      ]
    },
    {
      title: 'Workflow: Controle Financeiro Mensal',
      steps: [
        { number: 1, action: 'Lançamentos', detail: 'Registre todas entradas e saídas do mês' },
        { number: 2, action: 'Conciliação Bancária', detail: 'Compare extratos com lançamentos internos' },
        { number: 3, action: 'DRE Mensal', detail: 'Gere demonstrativo de resultados do período' },
        { number: 4, action: 'Análise de Variação', detail: 'Compare realizado vs orçado vs período anterior' },
        { number: 5, action: 'Projeção de Caixa', detail: 'Atualize forecast dos próximos 3 meses' },
        { number: 6, action: 'Report Executivo', detail: 'Apresente resultados para diretoria/sócios' },
      ]
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Guia do Business Solution
        </h1>
        <p className="text-muted-foreground mt-2">
          Sistema completo de gestão empresarial integrado
        </p>
      </div>

      {/* Quick Access Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Bem-vindo ao Business Solution!</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie estratégia, operações, finanças, customer success e muito mais
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
            <Target className="h-4 w-4 mr-2" />
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
            {businessFeatures.map((feature) => {
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
                  <CheckCircle2 className="h-5 w-5 text-primary" />
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

          {/* Integração com Sales Solution */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Integração com Sales Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  O Business Solution trabalha em conjunto com o Sales Solution para uma gestão completa:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-card rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm">📊 Dados Compartilhados</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Receita vem do CRM para Finanças</li>
                      <li>• Clientes fechados vão para CS</li>
                      <li>• Metas estratégicas alimentam Funil</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm">🔄 Workflows Cruzados</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Lead fechado → Onboarding CS</li>
                      <li>• NPS baixo → Tarefa no CRM</li>
                      <li>• Meta atingida → Análise financeira</li>
                    </ul>
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
                Melhores Práticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">1</Badge>
                  <div>
                    <strong>Review Estratégico Trimestral</strong>
                    <p className="text-muted-foreground mt-1">
                      Revise OKRs e ajuste estratégia a cada 3 meses com toda liderança
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">2</Badge>
                  <div>
                    <strong>Processos Bem Documentados</strong>
                    <p className="text-muted-foreground mt-1">
                      Mantenha SOPs atualizados para todas operações críticas do negócio
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">3</Badge>
                  <div>
                    <strong>Controle Financeiro Rigoroso</strong>
                    <p className="text-muted-foreground mt-1">
                      Feche o mês até o dia 5 e revise DRE vs orçado mensalmente
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">4</Badge>
                  <div>
                    <strong>Foco em Customer Success</strong>
                    <p className="text-muted-foreground mt-1">
                      Monitore health score semanalmente - prevenir churn é mais barato que adquirir
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">5</Badge>
                  <div>
                    <strong>Base de Conhecimento Centralizada</strong>
                    <p className="text-muted-foreground mt-1">
                      Use Arquivos e Notion para centralizar toda documentação empresarial
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="mt-0.5">6</Badge>
                  <div>
                    <strong>KPIs em Tempo Real</strong>
                    <p className="text-muted-foreground mt-1">
                      Configure dashboards com métricas atualizadas automaticamente
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Métricas Chave por Módulo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Métricas-Chave por Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Estratégico
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• % de OKRs atingidos</li>
                      <li>• Market share</li>
                      <li>• ROI de iniciativas</li>
                      <li>• Velocidade de execução</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-green-500" />
                      Operacional
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Eficiência operacional</li>
                      <li>• Taxa de erro/retrabalho</li>
                      <li>• Tempo médio de processo</li>
                      <li>• Utilização de recursos</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      Finanças
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Margem EBITDA</li>
                      <li>• Burn rate</li>
                      <li>• Days Sales Outstanding (DSO)</li>
                      <li>• Índice de liquidez</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <HeartHandshake className="h-4 w-4 text-purple-500" />
                      Customer Success
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• NPS (Net Promoter Score)</li>
                      <li>• Churn rate</li>
                      <li>• Customer Lifetime Value</li>
                      <li>• Time to Value (TTV)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Comece a Gerenciar seu Negócio</h3>
              <p className="text-sm text-muted-foreground">
                Explore cada módulo e tenha controle total da sua empresa
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => handleNavigate('/business/estrategico')}>
                <Target className="h-4 w-4 mr-2" />
                Planejamento
              </Button>
              <Button onClick={() => handleNavigate('/business/financas')}>
                <DollarSign className="h-4 w-4 mr-2" />
                Finanças
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuiaBusiness;
