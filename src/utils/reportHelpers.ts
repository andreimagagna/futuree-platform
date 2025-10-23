import type { Lead, Task } from '@/store/useStore';
import { startOfMonth, endOfMonth, subMonths, format, startOfWeek, endOfWeek, subWeeks, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type PeriodType = '7days' | '30days' | '90days' | '6months' | '1year' | 'custom';

// ✅ FUNÇÃO HELPER: Categoriza lead por estágio (mesma lógica do FunnelVisual)
export const categorizeLead = (lead: Lead): 'topo' | 'meio' | 'fundo' | 'vendas' | 'perdido' | null => {
  const statusStr = String((lead as any).status || '').toLowerCase();
  const stageStr = String((lead as any).stage || (lead as any).funnel_stage || '').toLowerCase();
  
  // Status sobrepõe tudo
  if (statusStr === 'ganho' || statusStr === 'won') return 'vendas';
  if (statusStr === 'perdido' || statusStr === 'lost') return 'perdido';
  
  // Categorizar por estágio
  if (['novo', 'new', 'captured', 'lead', 'contatado', 'contact', 'contacted', 'open', ''].includes(stageStr)) {
    return 'topo';
  }
  
  if (['qualificado', 'qualified', 'qualify', 'qualification', 'proposta', 'proposal', 'apresentacao', 'presentation'].includes(stageStr)) {
    return 'meio';
  }
  
  if (['negociacao', 'negotiation', 'closing', 'fechamento', 'contrato', 'contract'].includes(stageStr)) {
    return 'fundo';
  }
  
  // Padrão: topo
  return 'topo';
};

// Filtra leads por período
export const filterLeadsByPeriod = (leads: Lead[], period: PeriodType): Lead[] => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case '7days':
      startDate = startOfDay(subDays(now, 7));
      break;
    case '30days':
      startDate = startOfDay(subDays(now, 30));
      break;
    case '90days':
      startDate = startOfDay(subDays(now, 90));
      break;
    case '6months':
      startDate = startOfMonth(subMonths(now, 6));
      break;
    case '1year':
      startDate = startOfMonth(subMonths(now, 12));
      break;
    default:
      return leads; // custom será implementado depois
  }

  return leads.filter(lead => {
    if (!lead.lastContact) return false;
    const contactDate = new Date(lead.lastContact);
    return contactDate >= startDate && contactDate <= now;
  });
};

// Filtra tasks por período
export const filterTasksByPeriod = (tasks: Task[], period: PeriodType): Task[] => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case '7days':
      startDate = startOfDay(subDays(now, 7));
      break;
    case '30days':
      startDate = startOfDay(subDays(now, 30));
      break;
    case '90days':
      startDate = startOfDay(subDays(now, 90));
      break;
    case '6months':
      startDate = startOfMonth(subMonths(now, 6));
      break;
    case '1year':
      startDate = startOfMonth(subMonths(now, 12));
      break;
    default:
      return tasks; // custom será implementado depois
  }

  return tasks.filter(task => {
    if (!task.createdAt) return false;
    const createdDate = new Date(task.createdAt);
    return createdDate >= startDate && createdDate <= now;
  });
};

export interface SalesData {
  month: string;
  revenue: number;
  deals: number;
  avgTicket: number;
}

export interface QualificationData {
  month: string;
  contacted: number;
  qualified: number;
  disqualified: number;
  rate: number;
}

export interface MeetingsData {
  week: string;
  scheduled: number;
  completed: number;
  noShow: number;
  conversionRate: number;
}

export interface ForecastData {
  month: string;
  actual: number;
  forecast: number;
  target: number;
  probability: number;
}

export interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PerformanceData {
  metric: string;
  current: number;
  target: number;
  fullMark: number;
}

// Gera dados de vendas por mês
export const generateSalesData = (leads: Lead[], monthsBack: number = 6): SalesData[] => {
  console.log('📊 generateSalesData - Início:', { totalLeads: leads.length, monthsBack });
  const data: SalesData[] = [];
  
  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    // ✅ Usar createdAt e aceitar 'ganho' ou 'won'
    const monthLeads = leads.filter(lead => {
      const createdDate = lead.createdAt ? new Date(lead.createdAt) : null;
      if (!createdDate) return false;
      
      const status = (lead as any).status;
      const isWon = status === 'won' || status === 'ganho';
      
      return createdDate >= monthStart && createdDate <= monthEnd && isWon;
    });
    
    const revenue = monthLeads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
    const deals = monthLeads.length;
    const avgTicket = deals > 0 ? revenue / deals : 0;
    
    data.push({
      month: format(targetDate, 'MMM/yy', { locale: ptBR }),
      revenue,
      deals,
      avgTicket,
    });
  }
  
  console.log('📊 generateSalesData - Resultado:', data);
  return data;
};

// Gera dados de qualificação por mês
export const generateQualificationData = (leads: Lead[], monthsBack: number = 6): QualificationData[] => {
  console.log('📊 generateQualificationData - Início:', { totalLeads: leads.length });
  const data: QualificationData[] = [];
  
  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    // ✅ Usar createdAt
    const monthLeads = leads.filter(lead => {
      const createdDate = lead.createdAt ? new Date(lead.createdAt) : null;
      if (!createdDate) return false;
      return createdDate >= monthStart && createdDate <= monthEnd;
    });
    
    const contacted = monthLeads.length;
    
    // ✅ Qualificados: leads com score > 0 ou em estágios avançados
    const qualified = monthLeads.filter(lead => {
      const stage = (lead as any).stage;
      const status = (lead as any).status;
      const isQualified = lead.score > 0 || 
                         ['proposta', 'negociacao', 'proposal', 'closing'].includes(stage) ||
                         status === 'ganho' || status === 'won';
      return isQualified;
    }).length;
    
    // ✅ Desqualificados: leads perdidos
    const disqualified = monthLeads.filter(lead => {
      const status = (lead as any).status;
      return status === 'lost' || status === 'perdido';
    }).length;
    
    const rate = contacted > 0 ? (qualified / contacted) * 100 : 0;
    
    data.push({
      month: format(targetDate, 'MMM/yy', { locale: ptBR }),
      contacted,
      qualified,
      disqualified,
      rate,
    });
  }
  
  console.log('📊 generateQualificationData - Resultado:', data);
  return data;
};

// Gera dados de reuniões por semana  
export const generateMeetingsData = (tasks: Task[], weeksBack: number = 8): MeetingsData[] => {
  console.log('📊 generateMeetingsData - Início:', { totalTasks: tasks.length });
  const data: MeetingsData[] = [];
  
  for (let i = weeksBack - 1; i >= 0; i--) {
    const targetDate = subWeeks(new Date(), i);
    const weekStart = startOfWeek(targetDate, { locale: ptBR });
    const weekEnd = endOfWeek(targetDate, { locale: ptBR });
    
    // ✅ Filtra tarefas que são reuniões e foram criadas/agendadas nesta semana
    const weekTasks = tasks.filter(task => {
      // Verificar se é reunião
      const isMeeting = task.title.toLowerCase().includes('reunião') || 
                        task.title.toLowerCase().includes('meeting') ||
                        task.title.toLowerCase().includes('call') ||
                        task.title.toLowerCase().includes('demo');
      
      if (!isMeeting) return false;
      
      // Verificar data (usar dueDate ou createdAt)
      const taskDate = task.dueDate || task.createdAt;
      if (!taskDate) return false;
      
      const dateToCheck = new Date(taskDate);
      return dateToCheck >= weekStart && dateToCheck <= weekEnd;
    });
    
    const scheduled = weekTasks.length;
    const completed = weekTasks.filter(task => task.status === 'done').length;
    
    // ✅ No-show: reuniões não concluídas que já passaram
    const noShow = weekTasks.filter(task => {
      if (task.status === 'done') return false;
      const isPast = task.dueDate && new Date(task.dueDate) < new Date();
      return isPast;
    }).length;
    
    // ✅ Taxa de conversão baseada em completadas - ARREDONDADO
    const conversionRate = scheduled > 0 ? (completed / scheduled) * 100 : 0;
    
    data.push({
      week: `Sem ${format(weekStart, 'dd/MM', { locale: ptBR })}`,
      scheduled,
      completed,
      noShow,
      conversionRate: Math.round(conversionRate), // Arredondado sem casas decimais
    });
  }
  
  console.log('📊 generateMeetingsData - Resultado:', data);
  return data;
};

// Gera dados de previsão de vendas
export const generateForecastData = (leads: Lead[], monthsAhead: number = 6, monthlyTarget?: number): ForecastData[] => {
  console.log('📊 generateForecastData - Início:', { totalLeads: leads.length, monthlyTarget });
  const data: ForecastData[] = [];
  const now = new Date();
  
  for (let i = 0; i < monthsAhead; i++) {
    const targetDate = subMonths(now, -i); // Meses futuros
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const isPastMonth = targetDate < now;
    
    // ✅ Dados reais (meses passados)
    const monthLeads = leads.filter(lead => {
      const createdDate = lead.createdAt ? new Date(lead.createdAt) : null;
      if (!createdDate) return false;
      return createdDate >= monthStart && createdDate <= monthEnd;
    });
    
    const actual = monthLeads
      .filter(lead => {
        const status = (lead as any).status;
        return status === 'won' || status === 'ganho';
      })
      .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
    
    // ✅ Pipeline com data de fechamento esperada
    const pipelineLeads = leads.filter(lead => {
      const stage = (lead as any).stage;
      const status = (lead as any).status;
      const isActive = !['won', 'ganho', 'lost', 'perdido'].includes(status);
      const expectedCloseDate = (lead as any).expected_close_date ? new Date((lead as any).expected_close_date) : null;
      
      // Considera leads que têm data esperada neste mês OU estão em estágios avançados
      const isInMonth = expectedCloseDate && expectedCloseDate >= monthStart && expectedCloseDate <= monthEnd;
      const isAdvancedStage = ['proposta', 'negociacao', 'proposal', 'closing'].includes(stage);
      
      return isActive && (isInMonth || (!expectedCloseDate && isAdvancedStage && !isPastMonth));
    });
    
    // ✅ Forecast ponderado por estágio + probabilidade da data
    const forecast = pipelineLeads.reduce((sum, lead) => {
      const stage = (lead as any).stage;
      const expectedCloseDate = (lead as any).expected_close_date ? new Date((lead as any).expected_close_date) : null;
      
      // Probabilidade baseada no estágio
      let stageProbability = 0.3;
      if (stage === 'closing' || stage === 'negociacao') stageProbability = 0.7;
      else if (stage === 'proposal' || stage === 'proposta') stageProbability = 0.5;
      
      // Aumenta probabilidade se tem data de fechamento definida
      if (expectedCloseDate) stageProbability = Math.min(stageProbability + 0.2, 0.9);
      
      return sum + ((lead.dealValue || 0) * stageProbability);
    }, 0);
    
    const finalForecast = isPastMonth ? actual : actual + forecast;
    
    // ✅ Meta: usar meta da empresa ou estimativa
    const target = monthlyTarget || (finalForecast > 0 ? finalForecast * 1.2 : 50000);
    const probabilityValue = target > 0 ? Math.min((finalForecast / target) * 100, 100) : 0;
    
    data.push({
      month: format(targetDate, 'MMM/yy', { locale: ptBR }),
      actual,
      forecast: finalForecast,
      target,
      probability: Math.round(probabilityValue),
    });
  }
  
  console.log('📊 generateForecastData - Resultado:', data);
  return data;
};

// Gera dados de funil de conversão
export const generateConversionFunnelData = (leads: Lead[]): ConversionFunnelData[] => {
  console.log('📊 generateConversionFunnelData - Início:', { totalLeads: leads.length });
  
  const totalLeads = leads.length;
  
  // Categorizar todos os leads usando a função helper
  const categories = {
    topo: [] as Lead[],
    meio: [] as Lead[],
    fundo: [] as Lead[],
    vendas: [] as Lead[],
    perdido: [] as Lead[],
  };
  
  leads.forEach(lead => {
    const category = categorizeLead(lead);
    if (category && category !== 'perdido') {
      categories[category].push(lead);
    } else if (category === 'perdido') {
      categories.perdido.push(lead);
    }
  });
  
  console.log('📊 Categorização:', {
    topo: categories.topo.length,
    meio: categories.meio.length,
    fundo: categories.fundo.length,
    vendas: categories.vendas.length,
    perdido: categories.perdido.length,
  });
  
  const result = [
    {
      stage: 'Topo do Funil',
      count: categories.topo.length,
      percentage: totalLeads > 0 ? Math.round((categories.topo.length / totalLeads) * 100) : 0,
      color: 'hsl(var(--accent))',
    },
    {
      stage: 'Meio do Funil',
      count: categories.meio.length,
      percentage: totalLeads > 0 ? Math.round((categories.meio.length / totalLeads) * 100) : 0,
      color: 'hsl(var(--primary))',
    },
    {
      stage: 'Fundo do Funil',
      count: categories.fundo.length,
      percentage: totalLeads > 0 ? Math.round((categories.fundo.length / totalLeads) * 100) : 0,
      color: 'hsl(var(--warning))',
    },
    {
      stage: 'Fechados',
      count: categories.vendas.length,
      percentage: totalLeads > 0 ? Math.round((categories.vendas.length / totalLeads) * 100) : 0,
      color: 'hsl(var(--success))',
    },
    {
      stage: 'Perdidos',
      count: categories.perdido.length,
      percentage: totalLeads > 0 ? Math.round((categories.perdido.length / totalLeads) * 100) : 0,
      color: 'hsl(var(--destructive))',
    },
  ];
  
  console.log('📊 generateConversionFunnelData - Resultado:', result);
  return result;
};

// Gera dados de performance
export const generatePerformanceData = (leads: Lead[], tasks: Task[]): PerformanceData[] => {
  console.log('📊 generatePerformanceData - Início:', { totalLeads: leads.length, totalTasks: tasks.length });
  
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  
  // ✅ Usar createdAt
  const thisMonthLeads = leads.filter(lead => {
    const createdDate = lead.createdAt ? new Date(lead.createdAt) : null;
    if (!createdDate) return false;
    return createdDate >= thisMonthStart;
  });
  
  const contacted = thisMonthLeads.length;
  
  // ✅ Qualificados
  const qualified = thisMonthLeads.filter(lead => {
    const stage = (lead as any).stage;
    const status = (lead as any).status;
    return lead.score > 0 || 
           ['proposta', 'negociacao', 'proposal', 'closing'].includes(stage) ||
           status === 'ganho' || status === 'won';
  }).length;
  
  // ✅ Ganhos
  const won = thisMonthLeads.filter(lead => {
    const status = (lead as any).status;
    return status === 'won' || status === 'ganho';
  }).length;
  
  // ✅ Reuniões completadas
  const meetingTasks = tasks.filter(task => 
    task.title.toLowerCase().includes('reunião') || 
    task.title.toLowerCase().includes('meeting') ||
    task.title.toLowerCase().includes('call') ||
    task.title.toLowerCase().includes('demo')
  );
  const completedMeetings = meetingTasks.filter(task => task.status === 'done').length;
  
  // ✅ Tasks completadas
  const allTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  
  // ✅ Tempo médio de resposta (simulado - em produção viria de activities)
  const avgResponseTime = 2.5;
  
  // ✅ Definir metas baseadas nos valores atuais
  const contactedTarget = contacted > 0 ? contacted * 1.5 : 100;
  const qualifiedTarget = qualified > 0 ? qualified * 1.3 : 70;
  const wonTarget = won > 0 ? won * 1.2 : 20;
  const meetingsTarget = completedMeetings > 0 ? completedMeetings * 1.2 : 30;
  const tasksTarget = allTasks > 0 ? allTasks : 50;
  
  const result = [
    { 
      metric: 'Leads Contatados', 
      current: contacted, 
      target: contactedTarget, 
      fullMark: Math.max(contacted, contactedTarget, 200) 
    },
    { 
      metric: 'Taxa Qualificação', 
      current: contacted > 0 ? (qualified / contacted) * 100 : 0, 
      target: 70, 
      fullMark: 100 
    },
    { 
      metric: 'Deals Fechados', 
      current: won, 
      target: wonTarget, 
      fullMark: Math.max(won, wonTarget, 40) 
    },
    { 
      metric: 'Reuniões Realizadas', 
      current: completedMeetings, 
      target: meetingsTarget, 
      fullMark: Math.max(completedMeetings, meetingsTarget, 50) 
    },
    { 
      metric: 'Tarefas Concluídas', 
      current: completedTasks, 
      target: Math.round(allTasks * 0.8), 
      fullMark: allTasks || 100 
    },
    { 
      metric: 'Tempo Resposta (h)', 
      current: avgResponseTime, 
      target: 2, 
      fullMark: 8 
    },
  ];
  
  console.log('📊 generatePerformanceData - Resultado:', result);
  return result;
};

// Calcula KPIs gerais
export const calculateKPIs = (leads: Lead[], tasks: Task[]) => {
  console.log('📊 calculateKPIs - Início:', { totalLeads: leads.length, totalTasks: tasks.length });
  
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  
  console.log('📊 calculateKPIs - Períodos:', {
    thisMonthStart: thisMonthStart.toISOString(),
    lastMonthStart: lastMonthStart.toISOString(),
    lastMonthEnd: lastMonthEnd.toISOString(),
  });
  
  // ✅ USAR createdAt ao invés de lastContact (mais confiável)
  const thisMonthLeads = leads.filter(lead => {
    const createdDate = lead.createdAt ? new Date(lead.createdAt) : null;
    if (!createdDate) return false;
    return createdDate >= thisMonthStart;
  });
  
  const lastMonthLeads = leads.filter(lead => {
    const createdDate = lead.createdAt ? new Date(lead.createdAt) : null;
    if (!createdDate) return false;
    return createdDate >= lastMonthStart && createdDate <= lastMonthEnd;
  });
  
  console.log('📊 calculateKPIs - Leads filtrados:', {
    thisMonthLeads: thisMonthLeads.length,
    lastMonthLeads: lastMonthLeads.length,
  });
  
  // ✅ ACEITAR tanto 'won' quanto 'ganho' como status válido
  const isWon = (lead: Lead) => {
    const status = (lead as any).status;
    return status === 'won' || status === 'ganho';
  };
  
  const thisMonthRevenue = thisMonthLeads
    .filter(isWon)
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  
  const lastMonthRevenue = lastMonthLeads
    .filter(isWon)
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  
  // ✅ Crescimento de receita - ARREDONDADO
  const revenueGrowth = lastMonthRevenue > 0 
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : 0;
  
  // ✅ Taxa de qualificação: leads com score > 0 ou em estágios avançados - ARREDONDADO
  const qualificationRate = thisMonthLeads.length > 0
    ? Math.round((thisMonthLeads.filter(lead => {
        const stage = (lead as any).stage;
        return lead.score > 0 || stage === 'proposta' || stage === 'negociacao' || 
               stage === 'proposal' || stage === 'closing' || isWon(lead);
      }).length / thisMonthLeads.length) * 100)
    : 0;
  
  // ✅ Taxa de conversão: leads ganhos / total de leads - ARREDONDADO
  const conversionRate = thisMonthLeads.length > 0
    ? Math.round((thisMonthLeads.filter(isWon).length / thisMonthLeads.length) * 100)
    : 0;
  
  // ✅ Pipeline ativo: leads em proposta/negociação (NÃO ganhos nem perdidos)
  const pipelineValue = leads
    .filter(lead => {
      const status = (lead as any).status;
      const stage = (lead as any).stage;
      const isActive = !['won', 'ganho', 'lost', 'perdido'].includes(status);
      const isInPipeline = ['proposta', 'negociacao', 'proposal', 'closing', 'qualificado'].includes(stage);
      return isActive && (isInPipeline || lead.dealValue > 0);
    })
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  
  // ✅ Active deals: leads que estão sendo negociados
  const activeDeals = leads.filter(lead => {
    const status = (lead as any).status;
    const stage = (lead as any).stage;
    const isActive = !['won', 'ganho', 'lost', 'perdido'].includes(status);
    const isInPipeline = ['proposta', 'negociacao', 'proposal', 'closing'].includes(stage);
    return isActive && isInPipeline;
  }).length;
  
  const result = {
    thisMonthRevenue,
    revenueGrowth,
    qualificationRate,
    conversionRate,
    pipelineValue,
    totalLeads: leads.length,
    activeDeals,
  };
  
  console.log('📊 calculateKPIs - Resultado:', result);
  
  return result;
};
