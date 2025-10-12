// Marketing Acquisition Task Types

export type AcquisitionChannel = 
  | 'organic-search'
  | 'paid-search'
  | 'social-organic'
  | 'social-paid'
  | 'email'
  | 'content'
  | 'referral'
  | 'direct'
  | 'partnerships';

export type AcquisitionStatus = 
  | 'planning'
  | 'in-progress'
  | 'active'
  | 'completed';

export type AcquisitionPriority = 'high' | 'medium' | 'low';

export interface AcquisitionMetrics {
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  cpl: number; // Cost Per Lead
  cpc: number; // Cost Per Click
  ctr: number; // Click Through Rate
  conversionRate: number;
}

export interface AcquisitionTask {
  id: string;
  title: string;
  description: string;
  channel: AcquisitionChannel;
  status: AcquisitionStatus;
  priority: AcquisitionPriority;
  
  // Datas
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  
  // Métricas (preenchimento manual)
  metrics: AcquisitionMetrics;
  
  // Objetivos
  goals: {
    targetLeads: number;
    targetBudget: number;
    targetCPL: number;
    targetConversionRate: number;
  };
  
  // Detalhes adicionais
  tags: string[];
  assignedTo: string;
  notes: string[];
  
  // Checklist de ações
  checklist: {
    id: string;
    text: string;
    done: boolean;
  }[];
}

export const channelLabels: Record<AcquisitionChannel, string> = {
  'organic-search': 'SEO / Busca Orgânica',
  'paid-search': 'Google Ads / SEM',
  'social-organic': 'Social Media Orgânico',
  'social-paid': 'Social Media Pago',
  'email': 'Email Marketing',
  'content': 'Marketing de Conteúdo',
  'referral': 'Programa de Indicação',
  'direct': 'Tráfego Direto',
  'partnerships': 'Parcerias',
};

export const channelIcons: Record<AcquisitionChannel, string> = {
  'organic-search': '🔍',
  'paid-search': '💰',
  'social-organic': '📱',
  'social-paid': '📢',
  'email': '📧',
  'content': '📝',
  'referral': '🤝',
  'direct': '🎯',
  'partnerships': '🔗',
};

export const channelColors: Record<AcquisitionChannel, string> = {
  'organic-search': 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
  'paid-search': 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  'social-organic': 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
  'social-paid': 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300',
  'email': 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
  'content': 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
  'referral': 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300',
  'direct': 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300',
  'partnerships': 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
};

export const statusLabels: Record<AcquisitionStatus, string> = {
  planning: 'Planejamento',
  'in-progress': 'Em Progresso',
  active: 'Ativa',
  completed: 'Concluída',
};

export const statusColors: Record<AcquisitionStatus, string> = {
  planning: 'border-l-muted-foreground',
  'in-progress': 'border-l-accent',
  active: 'border-l-success',
  completed: 'border-l-muted',
};

export const columnColors: Record<AcquisitionStatus, string> = {
  planning: 'bg-muted',
  'in-progress': 'bg-accent/10',
  active: 'bg-success/10',
  completed: 'bg-muted/50',
};

export const priorityColors: Record<AcquisitionPriority, string> = {
  high: 'bg-destructive text-destructive-foreground',
  medium: 'bg-warning text-warning-foreground',
  low: 'bg-muted text-muted-foreground',
};

export const priorityLabels: Record<AcquisitionPriority, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};
