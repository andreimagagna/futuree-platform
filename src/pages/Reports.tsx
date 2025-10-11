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
} from "lucide-react";
import { useStore } from "@/store/useStore";
import SalesChart from "@/components/reports/SalesChart";
import QualificationChart from "@/components/reports/QualificationChart";
import MeetingsChart from "@/components/reports/MeetingsChart";
import ForecastChart from "@/components/reports/ForecastChart";
import ConversionFunnelChart from "@/components/reports/ConversionFunnelChart";
import PerformanceChart from "@/components/reports/PerformanceChart";
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
  const { leads, tasks } = useStore();
  const [period, setPeriod] = useState<PeriodType>('30days');
  const [comparison, setComparison] = useState<'none' | 'previous' | 'lastYear'>('none');
  const [activeTab, setActiveTab] = useState('overview');

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
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
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
