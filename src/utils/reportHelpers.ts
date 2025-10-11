import type { Lead, Task } from '@/store/useStore';
import { startOfMonth, endOfMonth, subMonths, format, startOfWeek, endOfWeek, subWeeks, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type PeriodType = '7days' | '30days' | '90days' | '6months' | '1year' | 'custom';

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
  const data: SalesData[] = [];
  
  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    const monthLeads = leads.filter(lead => {
      if (!lead.lastContact || lead.status !== 'won') return false;
      const contactDate = new Date(lead.lastContact);
      return contactDate >= monthStart && contactDate <= monthEnd;
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
  
  return data;
};

// Gera dados de qualificação por mês
export const generateQualificationData = (leads: Lead[], monthsBack: number = 6): QualificationData[] => {
  const data: QualificationData[] = [];
  
  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    const monthLeads = leads.filter(lead => {
      if (!lead.lastContact) return false;
      const contactDate = new Date(lead.lastContact);
      return contactDate >= monthStart && contactDate <= monthEnd;
    });
    
    const contacted = monthLeads.length;
    const qualified = monthLeads.filter(lead => 
      lead.stage === 'proposal' || lead.stage === 'closing' || lead.status === 'won'
    ).length;
    const disqualified = monthLeads.filter(lead => lead.status === 'lost').length;
    const rate = contacted > 0 ? (qualified / contacted) * 100 : 0;
    
    data.push({
      month: format(targetDate, 'MMM/yy', { locale: ptBR }),
      contacted,
      qualified,
      disqualified,
      rate,
    });
  }
  
  return data;
};

// Gera dados de reuniões por semana  
export const generateMeetingsData = (tasks: Task[], weeksBack: number = 8): MeetingsData[] => {
  const data: MeetingsData[] = [];
  
  for (let i = weeksBack - 1; i >= 0; i--) {
    const targetDate = subWeeks(new Date(), i);
    const weekStart = startOfWeek(targetDate, { locale: ptBR });
    const weekEnd = endOfWeek(targetDate, { locale: ptBR });
    
    // Filtra tarefas da semana (assumindo que reuniões têm "meeting" ou "reunião" no título)
    const weekTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const isMeeting = task.title.toLowerCase().includes('reunião') || 
                        task.title.toLowerCase().includes('meeting');
      return dueDate >= weekStart && dueDate <= weekEnd && isMeeting;
    });
    
    const scheduled = weekTasks.length;
    const completed = weekTasks.filter(task => task.status === 'done').length;
    const noShow = weekTasks.filter(task => {
      const isPast = task.dueDate && new Date(task.dueDate) < new Date();
      return task.status !== 'done' && isPast;
    }).length;
    
    // Simula taxa de conversão (em produção, viria de dados reais)
    const conversionRate = completed > 0 ? Math.random() * 30 + 20 : 0;
    
    data.push({
      week: `Sem ${format(weekStart, 'dd/MM', { locale: ptBR })}`,
      scheduled,
      completed,
      noShow,
      conversionRate: Number(conversionRate.toFixed(1)),
    });
  }
  
  return data;
};

// Gera dados de previsão de vendas
export const generateForecastData = (leads: Lead[], monthsAhead: number = 6): ForecastData[] => {
  const data: ForecastData[] = [];
  
  for (let i = 0; i < monthsAhead; i++) {
    const targetDate = subMonths(new Date(), -i);
    
    // Calcula dados reais para meses passados
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    const monthLeads = leads.filter(lead => {
      if (!lead.lastContact) return false;
      const contactDate = new Date(lead.lastContact);
      return contactDate >= monthStart && contactDate <= monthEnd;
    });
    
    const actual = monthLeads
      .filter(lead => lead.status === 'won')
      .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
    
    // Pipeline value (leads em proposta/fechamento) ponderado pela probabilidade
    const pipelineLeads = leads.filter(lead => 
      lead.stage === 'proposal' || lead.stage === 'closing'
    );
    
    const forecast = pipelineLeads.reduce((sum, lead) => {
      const probability = lead.stage === 'closing' ? 0.7 : 0.4;
      return sum + ((lead.dealValue || 0) * probability);
    }, 0) + actual;
    
    const target = 150000; // Meta fixa para exemplo (em produção, seria configurável)
    const probability = forecast > 0 ? Math.min((forecast / target) * 100, 100) : 0;
    
    data.push({
      month: format(targetDate, 'MMM/yy', { locale: ptBR }),
      actual,
      forecast,
      target,
      probability: Number(probability.toFixed(0)),
    });
  }
  
  return data;
};

// Gera dados de funil de conversão
export const generateConversionFunnelData = (leads: Lead[]): ConversionFunnelData[] => {
  const stages = [
    { status: 'captured', name: 'Novos Leads', color: 'hsl(var(--accent))' },
    { status: 'qualify', name: 'Qualificação', color: 'hsl(var(--primary))' },
    { status: 'contact', name: 'Contato', color: 'hsl(200 70% 50%)' },
    { status: 'proposal', name: 'Proposta', color: 'hsl(var(--warning))' },
    { status: 'closing', name: 'Fechamento', color: 'hsl(35 80% 55%)' },
    { status: 'won', name: 'Fechados', color: 'hsl(var(--success))' },
  ];
  
  const totalLeads = leads.length;
  
  return stages.map(stage => {
    const count = stage.status === 'won' 
      ? leads.filter(lead => lead.status === 'won').length
      : leads.filter(lead => lead.stage === stage.status).length;
    
    const percentage = totalLeads > 0 ? Number(((count / totalLeads) * 100).toFixed(1)) : 0;
    
    return {
      stage: stage.name,
      count,
      percentage,
      color: stage.color,
    };
  });
};

// Gera dados de performance
export const generatePerformanceData = (leads: Lead[], tasks: Task[]): PerformanceData[] => {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  
  const thisMonthLeads = leads.filter(lead => {
    if (!lead.lastContact) return false;
    const contactDate = new Date(lead.lastContact);
    return contactDate >= thisMonthStart;
  });
  
  const contacted = thisMonthLeads.length;
  const qualified = thisMonthLeads.filter(lead => 
    lead.stage === 'proposal' || lead.stage === 'closing' || lead.status === 'won'
  ).length;
  const won = thisMonthLeads.filter(lead => lead.status === 'won').length;
  
  // Conta reuniões completadas (tarefas com "reunião" no título)
  const meetingTasks = tasks.filter(task => 
    task.title.toLowerCase().includes('reunião') || task.title.toLowerCase().includes('meeting')
  );
  const completedMeetings = meetingTasks.filter(task => task.status === 'done').length;
  
  const allTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  
  const avgResponseTime = 2.5; // Simulado (em produção, seria calculado)
  
  return [
    { metric: 'Leads Contatados', current: contacted, target: 150, fullMark: 200 },
    { metric: 'Taxa Qualificação', current: qualified, target: 50, fullMark: 100 },
    { metric: 'Deals Fechados', current: won, target: 20, fullMark: 40 },
    { metric: 'Reuniões Realizadas', current: completedMeetings, target: 30, fullMark: 50 },
    { metric: 'Tarefas Concluídas', current: completedTasks, target: allTasks, fullMark: allTasks },
    { metric: 'Tempo Resposta (h)', current: Math.round(avgResponseTime), target: 4, fullMark: 8 },
  ];
};

// Calcula KPIs gerais
export const calculateKPIs = (leads: Lead[], tasks: Task[]) => {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  
  const thisMonthLeads = leads.filter(lead => {
    if (!lead.lastContact) return false;
    const contactDate = new Date(lead.lastContact);
    return contactDate >= thisMonthStart;
  });
  
  const lastMonthLeads = leads.filter(lead => {
    if (!lead.lastContact) return false;
    const contactDate = new Date(lead.lastContact);
    return contactDate >= lastMonthStart && contactDate <= lastMonthEnd;
  });
  
  const thisMonthRevenue = thisMonthLeads
    .filter(lead => lead.status === 'won')
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  
  const lastMonthRevenue = lastMonthLeads
    .filter(lead => lead.status === 'won')
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;
  
  const qualificationRate = thisMonthLeads.length > 0
    ? (thisMonthLeads.filter(lead => 
        lead.stage === 'proposal' || lead.stage === 'closing' || lead.status === 'won'
      ).length / thisMonthLeads.length) * 100
    : 0;
  
  const conversionRate = thisMonthLeads.length > 0
    ? (thisMonthLeads.filter(lead => lead.status === 'won').length / thisMonthLeads.length) * 100
    : 0;
  
  const pipelineValue = leads
    .filter(lead => lead.stage === 'proposal' || lead.stage === 'closing')
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  
  return {
    thisMonthRevenue,
    revenueGrowth,
    qualificationRate,
    conversionRate,
    pipelineValue,
    totalLeads: leads.length,
    activeDeals: leads.filter(lead => 
      lead.stage === 'proposal' || lead.stage === 'closing'
    ).length,
  };
};
