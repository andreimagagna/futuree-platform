import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Settings as SettingsIcon,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import { useSyncCRMFunnelsToStore } from "@/hooks/useCRMFunnels";
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Interfaces
interface CompanyGoal {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Metas pré-estabelecidas (mesmas do Settings)
const PREDEFINED_GOALS = [
  {
    key: 'receita_mensal',
    title: 'Receita Mensal',
    unit: 'R$',
    description: 'Faturamento total do mês',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
  },
  {
    key: 'leads_mes',
    title: 'Leads do Mês',
    unit: 'leads',
    description: 'Novos leads captados',
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/20',
  },
  {
    key: 'taxa_conversao',
    title: 'Taxa de Conversão',
    unit: '%',
    description: 'Percentual de conversão de leads',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
  },
  {
    key: 'ticket_medio',
    title: 'Ticket Médio',
    unit: 'R$',
    description: 'Valor médio por venda',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
  },
  {
    key: 'reunioes_mes',
    title: 'Reuniões do Mês',
    unit: 'reuniões',
    description: 'Número de reuniões realizadas',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
  },
  {
    key: 'negocios_ganhos',
    title: 'Negócios Ganhos',
    unit: 'negócios',
    description: 'Total de negócios fechados',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
  },
] as const;

const Reports = () => {
  const { user } = useAuthContext();
  useSyncCRMFunnelsToStore(); // Garante que funis estejam sincronizados
  const { funnels } = useStore();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodType>('30days');
  const [comparison, setComparison] = useState<'none' | 'previous' | 'lastYear'>('none');
  const [activeTab, setActiveTab] = useState('goals');
  
  // ✅ Estado para meta de vendas personalizada
  const [customSalesTarget, setCustomSalesTarget] = useState<number>(() => {
    const saved = localStorage.getItem('customSalesTarget');
    return saved ? Number(saved) : 100000; // Meta padrão: R$ 100k
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // State for manual goal editing
  const [editingGoalKey, setEditingGoalKey] = useState<string | null>(null);
  const [tempGoalValue, setTempGoalValue] = useState<string>("");
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const queryClient = useQueryClient();

  // Salvar meta no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('customSalesTarget', customSalesTarget.toString());
  }, [customSalesTarget]);

  // ============================================================================
  // ✅ BUSCAR DADOS REAIS DO SUPABASE
  // ============================================================================
  
  // Buscar leads do Supabase
  const { data: supabaseLeads = [], isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('📊 Reports - Buscando leads do Supabase...');
      
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, status, funnel_stage, estimated_value, created_at, updated_at, score, email, phone, whatsapp, source, tags, notes, company_id, custom_fields')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Reports - Erro ao buscar leads:', error);
        throw error;
      }
      
      console.log('✅ Reports - Leads encontrados:', data?.length, 'primeiro lead:', data?.[0]);
      
      // Mapear para formato do frontend completo
      return (data || []).map((lead: any) => {
        const customFields = lead.custom_fields || {};
        
        return {
          id: lead.id,
          name: lead.name,
          company: '', // company_id é UUID, não nome
          email: lead.email || '',
          whatsapp: lead.phone || lead.whatsapp || '',
          status: lead.status || 'novo',
          stage: lead.funnel_stage || 'novo',
          // Mapear propriedades para usar na função categorizeLead
          funnelId: customFields.funnel_id || customFields.funnelId,
          customStageId: customFields.stage_id || customFields.stageId,
          dealValue: lead.estimated_value || 0,
          lastContact: lead.updated_at,
          createdAt: new Date(lead.created_at),
          score: lead.score || 0,
          owner: user?.email || '',
          budget: 0,
          authority: false,
          need: false,
          timing: '',
          fonte: lead.source || '',
          source: lead.source || '',
          tags: lead.tags || [],
          notes: lead.notes || '',
        };
      });
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // Cache por 1 minuto (tempo real)
  });

  // Buscar tasks do Supabase
  const { data: supabaseTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('📊 Reports - Buscando tasks do Supabase...');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, description, status, priority, due_date, created_at, updated_at, completed_at, assigned_to, tags, checklist, created_by')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Reports - Erro ao buscar tasks:', error);
        throw error;
      }
      
      console.log('✅ Reports - Tasks encontradas:', data?.length);
      
      // Mapear para formato do frontend completo
      return (data || []).map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: (task.status === 'done' || task.status === 'concluida' ? 'done' : 
                task.status === 'doing' || task.status === 'em_progresso' ? 'in_progress' : 
                task.status === 'review' ? 'review' : 'backlog') as 'backlog' | 'in_progress' | 'review' | 'done',
        priority: (task.priority === 'alta' || task.priority === 'urgente' ? 'P1' : 
                  task.priority === 'media' ? 'P2' : 'P3') as 'P1' | 'P2' | 'P3',
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        createdBy: task.created_by || user?.id || '',
        assignee: task.assigned_to || user?.email || 'Você',
        tags: task.tags || [],
        checklist: task.checklist || [],
        activities: [],
        comments: [],
        attachments: [],
        watchers: [],
      }));
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // Cache por 1 minuto (tempo real)
  });

  // Usar dados do Supabase como fonte principal
  const leads = supabaseLeads;
  const tasks = supabaseTasks;

  // ✅ DEBUG: Log dos dados para verificar
  console.log('📊 Reports - Dados carregados:', {
    totalLeads: leads.length,
    totalTasks: tasks.length,
    leads: leads.slice(0, 3), // Primeiros 3 leads
    tasks: tasks.slice(0, 3), // Primeiras 3 tasks
  });

  // Buscar metas da empresa do Supabase - OTIMIZADO
  const { data: companyGoals = [], isLoading: isLoadingGoals } = useQuery<CompanyGoal[]>({
    queryKey: ['companyGoals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('company_goals')
        .select('id, title, target, current, unit, owner_id') // Apenas campos necessários
        .eq('owner_id', user.id);
      if (error) throw error;
      return (data || []) as CompanyGoal[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    gcTime: 10 * 60 * 1000,
  });

  // Buscar métricas do CRM (dados reais) do Supabase - OTIMIZADO
  const { data: crmMetrics, isLoading: isLoadingMetrics, refetch: refetchCrmMetrics } = useQuery({
    queryKey: ['crmMetrics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString();
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString();

      console.log('🔍 Reports - Buscando métricas CRM:', { firstDayOfMonth, lastDayOfMonth, userId: user.id });

      // Executar queries em PARALELO para melhor performance
      const [leadsResult, activitiesResult] = await Promise.all([
        // Query otimizada: usar campos corretos
        supabase
          .from('leads')
          .select('status, estimated_value, created_at')
          .eq('owner_id', user.id)
          .gte('created_at', firstDayOfMonth)
          .lte('created_at', lastDayOfMonth),
        
        // Query otimizada: usar user_id e activity_date
        supabase
          .from('activities')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('type', 'reuniao')
          .gte('activity_date', firstDayOfMonth)
          .lte('activity_date', lastDayOfMonth)
      ]);

      if (leadsResult.error) {
        console.error('❌ Reports - Erro ao buscar leads:', leadsResult.error);
        throw leadsResult.error;
      }
      if (activitiesResult.error) {
        console.error('❌ Reports - Erro ao buscar activities:', activitiesResult.error);
        throw activitiesResult.error;
      }

      const monthLeads = leadsResult.data || [];
      const reunioes_mes = activitiesResult.count || 0;

      console.log('📊 Reports - Dados encontrados:', { 
        totalLeads: monthLeads.length, 
        reunioes: reunioes_mes
      });

      // Calcular métricas (processamento rápido no client)
      const wonLeads = monthLeads.filter((l: any) => l.status === 'ganho' || l.status === 'won');
      const receita_mensal = wonLeads.reduce((sum: number, lead: any) => 
        sum + (lead.estimated_value || 0), 0
      );
      const leads_mes = monthLeads.length;
      const taxa_conversao = leads_mes > 0 ? (wonLeads.length / leads_mes) * 100 : 0;
      const ticket_medio = wonLeads.length > 0 ? receita_mensal / wonLeads.length : 0;
      const negocios_ganhos = wonLeads.length;

      console.log('✅ Reports - Métricas calculadas:', {
        receita_mensal,
        leads_mes,
        taxa_conversao,
        ticket_medio,
        reunioes_mes,
        negocios_ganhos,
      });

      return {
        receita_mensal,
        leads_mes,
        taxa_conversao,
        ticket_medio,
        reunioes_mes,
        negocios_ganhos,
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos (puxar apenas quando necessário)
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Não refetch ao voltar para a janela
    refetchOnMount: false, // Não refetch ao montar se já tem cache válido
  });

  const handleUpdateGoalCurrent = async (title: string, newValue: number) => {
    try {
      setIsUpdatingGoal(true);
      
      // Find existing goal
      const goal = companyGoals.find(g => g.title === title);
      
      if (!goal) {
        toast.error("Meta não encontrada. Configure-a em Configurações primeiro.");
        return;
      }

      const { error } = await supabase
        .from('company_goals')
        .update({ current: newValue, updated_at: new Date().toISOString() })
        .eq('id', goal.id);

      if (error) throw error;

      toast.success("Valor atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['companyGoals'] });
      setEditingGoalKey(null);
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      toast.error("Erro ao atualizar valor.");
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  // ✅ USAR TODOS OS DADOS (TEMPO REAL) - Não filtrar por período
  const filteredLeads = leads; // Todos os leads
  const filteredTasks = tasks; // Todas as tasks

  // Calcula os dados dos gráficos usando TODOS os dados
  const salesData = useMemo(() => {
    console.log('📊 Reports - Gerando salesData com:', { totalLeads: leads.length });
    return generateSalesData(leads, 6);
  }, [leads]);
  
  const qualificationData = useMemo(() => {
    console.log('📊 Reports - Gerando qualificationData com:', { totalLeads: leads.length });
    return generateQualificationData(leads, 6, funnels);
  }, [leads, funnels]);
  
  const meetingsData = useMemo(() => {
    console.log('📊 Reports - Gerando meetingsData com:', { totalTasks: tasks.length });
    return generateMeetingsData(tasks, 8);
  }, [tasks]);
  
  const forecastData = useMemo(() => {
    console.log('📊 Reports - Gerando forecastData com:', { totalLeads: leads.length });
    // Buscar meta de "Receita Mensal" das metas da empresa
    const receitaMensalGoal = companyGoals.find(g => g.title === 'Receita Mensal');
    const monthlyTarget = receitaMensalGoal?.target || customSalesTarget;
    return generateForecastData(leads, 6, monthlyTarget, funnels);
  }, [leads, companyGoals, customSalesTarget, funnels]);
  
  const conversionFunnelData = useMemo(() => {
    console.log('📊 Reports - Gerando conversionFunnelData com:', { totalLeads: leads.length });
    return generateConversionFunnelData(leads, funnels);
  }, [leads, funnels]);
  
  const performanceData = useMemo(() => {
    console.log('📊 Reports - Gerando performanceData com:', { 
      totalLeads: leads.length, 
      totalTasks: tasks.length 
    });
    return generatePerformanceData(leads, tasks);
  }, [leads, tasks]);
  
  const kpis = useMemo(() => {
    console.log('📊 Reports - Calculando KPIs com:', { totalLeads: leads.length, totalTasks: tasks.length });
    return calculateKPIs(leads, tasks);
  }, [leads, tasks]);

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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-muted-foreground">Acompanhe métricas e resultados de vendas</p>
        </div>
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
                      {Math.abs(Math.round(kpis.revenueGrowth))}%
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
                  {Math.round(kpis.qualificationRate)}%
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
                  {Math.round(kpis.conversionRate)}%
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
          {/* Header com botão de configurar metas */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Metas da Empresa</h2>
              <p className="text-sm text-muted-foreground">Acompanhe o progresso das metas definidas</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
              className="gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Configurar Metas
            </Button>
          </div>

          {isLoadingGoals || isLoadingMetrics ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PREDEFINED_GOALS.map((predefined) => {
                // Buscar meta configurada
                const goal = companyGoals.find((g) => g.title === predefined.title);
                const targetValue = goal?.target || 0;
                
                // Buscar valor real do CRM
                let currentValue = crmMetrics?.[predefined.key as keyof typeof crmMetrics] || 0;

                // OVERRIDE: Para Reuniões do Mês, permitir controle manual
                const isManualControl = predefined.key === 'reunioes_mes';
                if (isManualControl && goal) {
                   // Se houver controle manual, usamos o valor salvo na meta (current)
                   // Fallback para 0 se undefined
                   currentValue = goal.current || 0;
                }
                
                // Calcular progresso
                const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
                const progressColor = progress >= 100 ? 'text-success' : progress >= 70 ? 'text-warning' : 'text-destructive';

                const isEditing = editingGoalKey === predefined.key;

                return (
                  <Card 
                    key={predefined.key} 
                    className={`relative overflow-hidden hover:shadow-lg transition-all border-l-4 ${predefined.borderColor} ${predefined.bgColor}`}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${predefined.color}`}>
                            {predefined.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {predefined.description}
                          </p>
                        </div>
                        {isManualControl && (
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-6 w-6 text-muted-foreground hover:text-foreground"
                             onClick={() => {
                               if (isEditing) {
                                 setEditingGoalKey(null);
                               } else {
                                 setEditingGoalKey(predefined.key);
                                 setTempGoalValue(currentValue.toString());
                               }
                             }}
                             title="Alterar valor manualmente"
                           >
                             <Pencil className="h-3 w-3" />
                           </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                                <Input 
                                    className="h-8 w-20 px-2 py-1 text-sm bg-background" 
                                    type="number" 
                                    value={tempGoalValue} 
                                    onChange={(e) => setTempGoalValue(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex">
                                    <Button 
                                        size="icon" 
                                        variant="ghost"
                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100" 
                                        disabled={isUpdatingGoal}
                                        onClick={() => handleUpdateGoalCurrent(predefined.title, Number(tempGoalValue))}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                        onClick={() => setEditingGoalKey(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                          ) : (
                          <span className="text-3xl font-bold">
                            {predefined.unit === 'R$' 
                              ? currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                              : predefined.unit === '%'
                              ? `${Math.round(currentValue)}%`
                              : currentValue.toLocaleString('pt-BR')}
                          </span>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {predefined.unit !== 'R$' && predefined.unit !== '%' && predefined.unit}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Meta: {predefined.unit === 'R$' 
                            ? targetValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : predefined.unit === '%'
                            ? `${Math.round(targetValue)}%`
                            : `${targetValue.toLocaleString('pt-BR')} ${predefined.unit}`}
                        </div>
                      </div>
                      
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${progressColor}`}>
                          {Math.round(progress)}% atingido
                        </span>
                        {progress >= 100 ? (
                          <Badge variant="default" className="bg-success">
                            ✓ Atingida
                          </Badge>
                        ) : progress >= 70 ? (
                          <Badge variant="secondary">
                            No caminho
                          </Badge>
                        ) : targetValue === 0 ? (
                          <Badge variant="outline">
                            Sem meta
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Atenção
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
                        ? Math.round((meetingsData.reduce((sum, d) => sum + d.completed, 0) / 
                            meetingsData.reduce((sum, d) => sum + d.scheduled, 0)) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de No-show</span>
                    <span className="text-2xl font-bold text-destructive">
                      {meetingsData.length > 0
                        ? Math.round((meetingsData.reduce((sum, d) => sum + d.noShow, 0) / 
                            meetingsData.reduce((sum, d) => sum + d.scheduled, 0)) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversão Média</span>
                    <span className="text-2xl font-bold text-primary">
                      {meetingsData.length > 0
                        ? Math.round(meetingsData.reduce((sum, d) => sum + d.conversionRate, 0) / 
                            meetingsData.length)
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Análise de Pipeline</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTarget(!isEditingTarget)}
                    className="h-8 px-2"
                  >
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {/* Meta de Vendas Personalizável */}
                  <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Meta de Vendas do Mês</span>
                      {isEditingTarget && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">R$</span>
                          <input
                            type="number"
                            value={customSalesTarget}
                            onChange={(e) => setCustomSalesTarget(Number(e.target.value))}
                            className="w-32 px-2 py-1 text-sm border rounded-md"
                            placeholder="100000"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              setIsEditingTarget(false);
                              toast.success('Meta atualizada!');
                            }}
                            className="h-7 px-3"
                          >
                            Salvar
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-primary text-lg">
                        R$ {(customSalesTarget / 1000).toFixed(0)}k
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={(kpis.thisMonthRevenue / customSalesTarget) * 100} 
                          className="w-24 h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {Math.round((kpis.thisMonthRevenue / customSalesTarget) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

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
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Análise de Fechamento</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-success/5 border border-success/20">
                    <span className="text-sm">Previsão Próximos 30 Dias</span>
                    <span className="font-bold text-success">
                      R$ {forecastData.length > 0 
                        ? (forecastData[0].forecast / 1000).toFixed(0) 
                        : 0}k
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Taxa de Conversão Histórica</span>
                    <span className="font-bold text-primary">{Math.round(kpis.conversionRate)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Ciclo Médio de Vendas</span>
                    <span className="font-bold text-accent">
                      {(() => {
                        const wonLeads = leads.filter(l => {
                          const status = (l as any).status;
                          return status === 'won' || status === 'ganho';
                        });
                        if (wonLeads.length === 0) return '0 dias';
                        const avgDays = wonLeads.reduce((sum, lead) => {
                          const created = lead.createdAt ? new Date(lead.createdAt).getTime() : 0;
                          const updated = (lead as any).updated_at ? new Date((lead as any).updated_at).getTime() : 0;
                          const days = updated > created ? Math.floor((updated - created) / (1000 * 60 * 60 * 24)) : 0;
                          return sum + days;
                        }, 0) / wonLeads.length;
                        return `${Math.round(avgDays)} dias`;
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SalesChart data={salesData} />
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Projeção vs Realizado</h3>
                <div className="space-y-3">
                  {forecastData.slice(0, 3).map((month, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-muted-foreground">
                          {Math.round((month.forecast / month.target) * 100)}% da meta
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Progress value={(month.actual / month.target) * 100} className="h-2" />
                        </div>
                        <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                          R$ {(month.forecast / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

```        <TabsContent value="performance" className="space-y-4">
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
