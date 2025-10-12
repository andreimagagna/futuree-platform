import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  BarChart3, 
  DollarSign,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import SalesChart from "@/components/reports/SalesChart";
import QualificationChart from "@/components/reports/QualificationChart";
import MeetingsChart from "@/components/reports/MeetingsChart";
import ForecastChart from "@/components/reports/ForecastChart";
import ConversionFunnelChart from "@/components/reports/ConversionFunnelChart";
import PerformanceChart from "@/components/reports/PerformanceChart";
import { GoalProgress } from "@/components/reports/GoalProgress";
import ReportFilters, { PeriodType } from "@/components/reports/ReportFilters";
import {
  generateSalesData,
  generateQualificationData,
  generateMeetingsData,
  generateForecastData,
  generateConversionFunnelData,
  generatePerformanceData,
  calculateKPIs,
  filterLeadsByPeriod,
  filterTasksByPeriod,
} from "@/utils/reportHelpers";
import { toast } from "sonner";

const Reports = () => {
  const { leads, tasks, settings } = useStore();
  const [period, setPeriod] = useState<PeriodType>('30days');
  const [comparison, setComparison] = useState<'none' | 'previous' | 'lastYear'>('none');
  const [activeTab, setActiveTab] = useState('goals');

  // Filtra os dados pelo período selecionado
  const filteredLeads = useMemo(() => 
    filterLeadsByPeriod(leads, period), 
    [leads, period]
  );
  
  const filteredTasks = useMemo(() => 
    filterTasksByPeriod(tasks, period), 
    [tasks, period]
  );

  // Calcula os dados dos gráficos usando dados filtrados
  const salesData = useMemo(() => generateSalesData(filteredLeads, 6), [filteredLeads]);
  const qualificationData = useMemo(() => generateQualificationData(filteredLeads, 6), [filteredLeads]);
  const meetingsData = useMemo(() => generateMeetingsData(filteredTasks, 8), [filteredTasks]);
  const forecastData = useMemo(() => generateForecastData(leads, 6), [leads]); // Forecast usa todos os leads
  const conversionFunnelData = useMemo(() => generateConversionFunnelData(filteredLeads), [filteredLeads]);
  const performanceData = useMemo(() => generatePerformanceData(filteredLeads, filteredTasks), [filteredLeads, filteredTasks]);
  const kpis = useMemo(() => calculateKPIs(leads, tasks), [leads, tasks]); // KPIs usam todos os dados

  // Calcular valores atuais para comparar com metas
  const currentMetrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filtrar leads do mês atual
    const monthLeads = leads.filter(lead => {
      const createdAt = lead.createdAt || new Date();
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    });
    
    // Calcular receita do mês (leads ganhos)
    const wonLeads = monthLeads.filter(l => l.status === 'won');
    const monthlyRevenue = wonLeads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
    
    // Contar leads do mês
    const monthlyLeads = monthLeads.length;
    
    // Calcular taxa de conversão (won / total)
    const conversionRate = monthLeads.length > 0 
      ? (wonLeads.length / monthLeads.length) * 100 
      : 0;
    
    // Calcular ticket médio
    const averageTicket = wonLeads.length > 0 
      ? monthlyRevenue / wonLeads.length 
      : 0;
    
    // Contar reuniões do mês (tarefas com 'reunião' ou 'meeting' no título)
    const monthlyMeetings = tasks.filter(task => {
      const dueDate = task.dueDate || new Date();
      const isThisMonth = dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
      const isMeeting = task.title.toLowerCase().includes('reunião') || 
                       task.title.toLowerCase().includes('meeting') ||
                       task.title.toLowerCase().includes('call');
      return isThisMonth && isMeeting;
    }).length;
    
    // Contar negócios ganhos
    const wonDeals = wonLeads.length;
    
    return {
      monthlyRevenue,
      monthlyLeads,
      conversionRate,
      averageTicket,
      monthlyMeetings,
      wonDeals,
    };
  }, [leads, tasks]);

  const handleExport = () => {
    const periodLabels = {
      '7days': 'últimos 7 dias',
      '30days': 'últimos 30 dias',
      '90days': 'últimos 90 dias',
      '6months': 'últimos 6 meses',
      '1year': 'último ano',
      'custom': 'período personalizado',
    };

    toast.success("Relatório exportado com sucesso!", {
      description: `Dados do período: ${periodLabels[period]}`,
    });
    // Implementar lógica de exportação real aqui
  };

  const handleRefresh = () => {
    toast.info("Dados atualizados!", {
      description: `${filteredLeads.length} leads e ${filteredTasks.length} tarefas no período selecionado.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h2>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita do Mês</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    R$ {(kpis.thisMonthRevenue / 1000).toFixed(0)}k
                  </h3>
                  {kpis.revenueGrowth !== 0 && (
                    <span className={`flex items-center text-sm font-medium ${
                      kpis.revenueGrowth > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {kpis.revenueGrowth > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(kpis.revenueGrowth).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pipeline Ativo</p>
                <h3 className="text-2xl font-bold">
                  R$ {(kpis.pipelineValue / 1000).toFixed(0)}k
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpis.activeDeals} deals em negociação
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Qualificação</p>
                <h3 className="text-2xl font-bold">
                  {kpis.qualificationRate.toFixed(1)}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Leads contatados → qualificados
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                <h3 className="text-2xl font-bold">
                  {kpis.conversionRate.toFixed(1)}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Leads → deals fechados
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <ReportFilters
        period={period}
        onPeriodChange={setPeriod}
        comparison={comparison}
        onComparisonChange={setComparison}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Gráficos em Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            Metas
          </TabsTrigger>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="sales">
            <DollarSign className="h-4 w-4 mr-2" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="qualification">
            <Target className="h-4 w-4 mr-2" />
            Qualificação
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Calendar className="h-4 w-4 mr-2" />
            Reuniões
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <TrendingUp className="h-4 w-4 mr-2" />
            Previsão
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Award className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <GoalProgress
              title="Receita Mensal"
              current={currentMetrics.monthlyRevenue}
              goal={settings.goals.monthlyRevenue}
              format="currency"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <GoalProgress
              title="Leads do Mês"
              current={currentMetrics.monthlyLeads}
              goal={settings.goals.monthlyLeads}
              format="number"
              icon={<Users className="h-5 w-5" />}
            />
            <GoalProgress
              title="Taxa de Conversão"
              current={currentMetrics.conversionRate}
              goal={settings.goals.conversionRate}
              format="percentage"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <GoalProgress
              title="Ticket Médio"
              current={currentMetrics.averageTicket}
              goal={settings.goals.averageTicket}
              format="currency"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <GoalProgress
              title="Reuniões do Mês"
              current={currentMetrics.monthlyMeetings}
              goal={settings.goals.monthlyMeetings}
              format="number"
              icon={<Calendar className="h-5 w-5" />}
            />
            <GoalProgress
              title="Negócios Ganhos"
              current={currentMetrics.wonDeals}
              goal={settings.goals.wonDeals}
              format="number"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SalesChart data={salesData} />
            <ConversionFunnelChart data={conversionFunnelData} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <QualificationChart data={qualificationData} />
            <ForecastChart data={forecastData} />
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SalesChart data={salesData} />
          <div className="grid gap-4 md:grid-cols-2">
            <ConversionFunnelChart data={conversionFunnelData} />
            <ForecastChart data={forecastData} />
          </div>
        </TabsContent>

        <TabsContent value="qualification" className="space-y-4">
          <QualificationChart data={qualificationData} />
          <ConversionFunnelChart data={conversionFunnelData} />
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <MeetingsChart data={meetingsData} />
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Realização</span>
                    <span className="text-2xl font-bold text-success">
                      {meetingsData.length > 0 
                        ? ((meetingsData.reduce((sum, d) => sum + d.completed, 0) / 
                            meetingsData.reduce((sum, d) => sum + d.scheduled, 0)) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de No-show</span>
                    <span className="text-2xl font-bold text-destructive">
                      {meetingsData.length > 0
                        ? ((meetingsData.reduce((sum, d) => sum + d.noShow, 0) / 
                            meetingsData.reduce((sum, d) => sum + d.scheduled, 0)) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversão Média</span>
                    <span className="text-2xl font-bold text-primary">
                      {meetingsData.length > 0
                        ? (meetingsData.reduce((sum, d) => sum + d.conversionRate, 0) / 
                            meetingsData.length).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <PerformanceChart data={performanceData} />
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <ForecastChart data={forecastData} />
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Análise de Pipeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Valor Total em Pipeline</span>
                    <span className="font-bold text-primary">
                      R$ {(kpis.pipelineValue / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Deals Ativos</span>
                    <span className="font-bold text-accent">{kpis.activeDeals}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Ticket Médio Estimado</span>
                    <span className="font-bold text-success">
                      R$ {kpis.activeDeals > 0 
                        ? ((kpis.pipelineValue / kpis.activeDeals) / 1000).toFixed(0) 
                        : 0}k
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <SalesChart data={salesData} />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceChart data={performanceData} />
          <div className="grid gap-4 md:grid-cols-2">
            <QualificationChart data={qualificationData} />
            <MeetingsChart data={meetingsData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
