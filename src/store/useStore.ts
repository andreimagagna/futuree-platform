import { create } from 'zustand';

export type LeadStage = 'captured' | 'qualify' | 'contact' | 'proposal' | 'closing';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type Priority = 'P1' | 'P2' | 'P3';
export type DateRange = 'today' | 'this_week' | 'this_month' | 'custom';

export type FunnelCategory = 'topo' | 'meio' | 'fundo' | 'vendas';

export interface FunnelStage {
  id: string;
  name: string;
  color: string;
  order: number;
  category?: FunnelCategory; // Categoria inteligente do funil
}

export interface Funnel {
  id: string;
  name: string;
  stages: FunnelStage[];
  isDefault: boolean;
}

export interface BANTMethodology {
  budget: boolean;      // Tem orçamento definido?
  authority: boolean;   // Fala com decisor?
  need: boolean;        // Tem necessidade clara?
  timeline: boolean;    // Tem prazo definido?
  qualifiedAt?: Date;   // Data da qualificação
  qualifiedBy?: string; // Quem qualificou
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: 'BRL' | 'USD'; // Moeda
  priceType: 'fixed' | 'percentage'; // Tipo de preço (fixo ou percentual)
  discount: number; // Desconto (valor absoluto ou %)
  discountType: 'fixed' | 'percentage'; // Tipo de desconto
  taxRate: number; // Taxa de imposto em %
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  stage: LeadStage;
  funnelId?: string;
  customStageId?: string;
  score: number;
  owner: string;
  source: string;
  lastContact: Date;
  nextAction?: Date;
  tags: string[];
  notes: string;
  status?: 'open' | 'won' | 'lost';
  lostReason?: string;
  lostCompetitor?: string;
  wonDate?: Date;
  lostDate?: Date;
  bant?: BANTMethodology; // Metodologia BANT
  website?: string; // Site da empresa
  companySize?: string; // Porte da empresa (Pequena, Média, Grande, Corporativa)
  employeeCount?: string; // Número de funcionários
  dealValue?: number; // Valor do negócio
  products?: Product[]; // Produtos associados ao negócio
  createdAt?: Date; // Data de criação do lead
  expectedCloseDate?: Date; // Data de fechamento esperada
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'comment';

export interface TaskActivity {
  id: string;
  type: ActivityType;
  content: string;
  createdAt: Date;
  createdBy: string;
  metadata?: {
    duration?: number; // em minutos
    from?: string; // status anterior
    to?: string; // status novo
  };
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  leadId?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  dueTime?: string;
  assignee: string;
  tags: string[];
  description: string;
  checklist: { id: string; text: string; done: boolean }[];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  completedAt?: Date;
  activities: TaskActivity[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  watchers: string[]; // Lista de usuários observando a tarefa
  timeTracked?: number; // Tempo rastreado em minutos
  estimatedTime?: number; // Tempo estimado em minutos
  subtasks?: string[]; // IDs de subtarefas
  parentTaskId?: string; // ID da tarefa pai
}

export interface Project {
  id: string;
  name: string;
  color: string;
  leadIds: string[];
}

export interface Conversation {
  id: string;
  leadId: string;
  messages: { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }[];
  intent?: string;
  status: 'active' | 'paused' | 'transferred';
}

export interface Mission {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface Note {
  id: string;
  content: string;
  leadId?: string;
  dealId?: string;
  createdAt: Date;
  createdBy: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: "note" | "call" | "email" | "wa" | "file" | "task" | "nextAction";
  content: string;
  createdAt: Date;
  createdBy?: string;
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

export interface Settings {
  leadSources: string[];
  owners: string[];
  goals: {
    monthlyRevenue: number;
    monthlyLeads: number;
    conversionRate: number;
    averageTicket: number;
    monthlyMeetings: number;
    wonDeals: number;
  };
}

interface StoreState {
  // UI State
  dateRange: DateRange;
  activeFunnelId: string;

  // Data
  leads: Lead[];
  tasks: Task[];
  projects: Project[];
  conversations: Conversation[];
  notes: Note[];
  activities: Activity[];
  funnels: Funnel[];
  availableTags: string[]; // Global list of available tags
  
  // Gamification
  gameState: GameState;
  missions: Mission[];
  
  // Agent
  agentActive: boolean;
  
  // Settings
  settings: Settings;
  
  // Actions
  setDateRange: (range: DateRange) => void;
  setActiveFunnel: (id: string) => void;

  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Task activities
  addTaskActivity: (taskId: string, activity: TaskActivity) => void;
  addTaskComment: (taskId: string, comment: TaskComment) => void;
  addTaskAttachment: (taskId: string, attachment: TaskAttachment) => void;
  deleteTaskComment: (taskId: string, commentId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  
  addNote: (note: Note) => void;
  addActivity: (activity: Activity) => void;

  addFunnel: (funnel: Funnel) => void;
  updateFunnel: (id: string, updates: Partial<Funnel>) => void;
  deleteFunnel: (id: string) => void;
  addStageToFunnel: (funnelId: string, stage: FunnelStage) => void;
  removeStageFromFunnel: (funnelId: string, stageId: string) => void;
  updateStageInFunnel: (funnelId: string, stageId: string, updates: Partial<FunnelStage>) => void;

  // Tag management
  addTag: (tag: string) => void;
  updateTag: (oldTag: string, newTag: string) => void;
  deleteTag: (tag: string) => void;

  // Settings management
  addLeadSource: (source: string) => void;
  removeLeadSource: (source: string) => void;
  addOwner: (owner: string) => void;
  removeOwner: (owner: string) => void;
  updateGoals: (goals: Partial<Settings['goals']>) => void;

  toggleAgent: () => void;
  completeMission: (id: string) => void;
}

// Mock data
const mockFunnels: Funnel[] = [
  {
    id: 'default',
    name: 'Funil Padrão',
    isDefault: true,
    stages: [
      { id: 'captured', name: 'Capturado', color: 'hsl(var(--muted-foreground))', order: 0, category: 'topo' },
      { id: 'qualify', name: 'Qualificar', color: 'hsl(var(--accent))', order: 1, category: 'meio' },
      { id: 'contact', name: 'Contato', color: 'hsl(var(--primary))', order: 2, category: 'fundo' },
      { id: 'proposal', name: 'Proposta', color: 'hsl(var(--warning))', order: 3, category: 'vendas' },
      { id: 'closing', name: 'Fechamento', color: 'hsl(var(--success))', order: 4, category: 'vendas' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Funil Enterprise',
    isDefault: false,
    stages: [
      { id: 'lead', name: 'Lead', color: 'hsl(var(--muted-foreground))', order: 0, category: 'topo' },
      { id: 'discovery', name: 'Discovery', color: 'hsl(var(--accent))', order: 1, category: 'meio' },
      { id: 'demo', name: 'Demo', color: 'hsl(var(--info))', order: 2, category: 'meio' },
      { id: 'poc', name: 'POC', color: 'hsl(var(--primary))', order: 3, category: 'fundo' },
      { id: 'negotiation', name: 'Negociação', color: 'hsl(var(--warning))', order: 4, category: 'vendas' },
      { id: 'closed', name: 'Fechado', color: 'hsl(var(--success))', order: 5, category: 'vendas' },
    ],
  },
];

const mockLeads: Lead[] = [];const mockTasks: Task[] = [];

const mockNotes: Note[] = [];

export const useStore = create<StoreState>((set) => ({
  dateRange: 'this_week',
  activeFunnelId: 'default',
  leads: mockLeads,
  tasks: mockTasks,
  notes: mockNotes,
  activities: [],
  funnels: mockFunnels,
  availableTags: [],
  projects: [
    { id: '1', name: 'Onboarding Q1', color: '#5B8DEF', leadIds: ['1', '2'] },
    { id: '2', name: 'Enterprise Deals', color: '#34C759', leadIds: ['3'] },
  ],
  conversations: [
    {
      id: '1',
      leadId: '1',
      status: 'active',
      intent: 'interesse_alto',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Olá, gostaria de saber mais sobre a solução',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Olá João! Fico feliz com seu interesse. Nossa solução ajuda empresas a automatizar...',
          timestamp: new Date(Date.now() - 28 * 60 * 1000),
        },
      ],
    },
  ],
  
  gameState: {
    xp: 2450,
    level: 7,
    streak: 12,
    badges: ['first_lead', '10_deals', 'week_perfect'],
  },
  
  missions: [
    { id: '1', title: 'Contatar 5 leads', target: 5, current: 3, completed: false },
    { id: '2', title: 'Fechar 1 deal', target: 1, current: 0, completed: false },
    { id: '3', title: 'Completar todas as tarefas do dia', target: 3, current: 1, completed: false },
  ],
  
  agentActive: true,
  
  settings: {
    leadSources: [],
    owners: [],
    goals: {
      monthlyRevenue: 0,
      monthlyLeads: 0,
      conversionRate: 0,
      averageTicket: 0,
      monthlyMeetings: 0,
      wonDeals: 0,
    },
  },
  
  setDateRange: (range) => set({ dateRange: range }),
  setActiveFunnel: (id) => set({ activeFunnelId: id }),

  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
  })),
  deleteLead: (id) => set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)),
  })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  
  // Task activities
  addTaskActivity: (taskId, activity) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { ...t, activities: [...t.activities, activity], updatedAt: new Date() } : t
    ),
  })),
  addTaskComment: (taskId, comment) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { ...t, comments: [...t.comments, comment], updatedAt: new Date() } : t
    ),
  })),
  addTaskAttachment: (taskId, attachment) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { ...t, attachments: [...t.attachments, attachment], updatedAt: new Date() } : t
    ),
  })),
  deleteTaskComment: (taskId, commentId) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { ...t, comments: t.comments.filter((c) => c.id !== commentId), updatedAt: new Date() } : t
    ),
  })),
  addChecklistItem: (taskId, text) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { 
        ...t, 
        checklist: [...t.checklist, { id: `ck-${Date.now()}`, text, done: false }],
        updatedAt: new Date() 
      } : t
    ),
  })),
  deleteChecklistItem: (taskId, itemId) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { ...t, checklist: t.checklist.filter((c) => c.id !== itemId), updatedAt: new Date() } : t
    ),
  })),
  toggleChecklistItem: (taskId, itemId) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { 
        ...t, 
        checklist: t.checklist.map((c) => c.id === itemId ? { ...c, done: !c.done } : c),
        updatedAt: new Date() 
      } : t
    ),
  })),
  
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),

  addFunnel: (funnel) => set((state) => ({ funnels: [...state.funnels, funnel] })),
  updateFunnel: (id, updates) => set((state) => ({
    funnels: state.funnels.map((f) => (f.id === id ? { ...f, ...updates } : f)),
  })),
  deleteFunnel: (id) => set((state) => ({ 
    funnels: state.funnels.filter((f) => f.id !== id),
    activeFunnelId: state.activeFunnelId === id ? 'default' : state.activeFunnelId,
  })),
  addStageToFunnel: (funnelId, stage) => set((state) => ({
    funnels: state.funnels.map((f) => 
      f.id === funnelId ? { ...f, stages: [...f.stages, stage] } : f
    ),
  })),
  removeStageFromFunnel: (funnelId, stageId) => set((state) => ({
    funnels: state.funnels.map((f) => 
      f.id === funnelId ? { ...f, stages: f.stages.filter((s) => s.id !== stageId) } : f
    ),
  })),
  updateStageInFunnel: (funnelId, stageId, updates) => set((state) => ({
    funnels: state.funnels.map((f) => 
      f.id === funnelId 
        ? { ...f, stages: f.stages.map((s) => s.id === stageId ? { ...s, ...updates } : s) }
        : f
    ),
  })),

  // Tag management
  addTag: (tag) => set((state) => ({
    availableTags: state.availableTags.includes(tag) 
      ? state.availableTags 
      : [...state.availableTags, tag],
  })),
  updateTag: (oldTag, newTag) => set((state) => ({
    availableTags: state.availableTags.map((t) => t === oldTag ? newTag : t),
    leads: state.leads.map((l) => ({
      ...l,
      tags: l.tags.map((t) => t === oldTag ? newTag : t),
    })),
    tasks: state.tasks.map((t) => ({
      ...t,
      tags: t.tags.map((tag) => tag === oldTag ? newTag : tag),
    })),
  })),
  deleteTag: (tag) => set((state) => ({
    availableTags: state.availableTags.filter((t) => t !== tag),
    leads: state.leads.map((l) => ({
      ...l,
      tags: l.tags.filter((t) => t !== tag),
    })),
    tasks: state.tasks.map((t) => ({
      ...t,
      tags: t.tags.filter((tg) => tg !== tag),
    })),
  })),

  // Settings management
  addLeadSource: (source) => set((state) => ({
    settings: {
      ...state.settings,
      leadSources: state.settings.leadSources.includes(source)
        ? state.settings.leadSources
        : [...state.settings.leadSources, source],
    },
  })),
  removeLeadSource: (source) => set((state) => ({
    settings: {
      ...state.settings,
      leadSources: state.settings.leadSources.filter((s) => s !== source),
    },
  })),
  addOwner: (owner) => set((state) => ({
    settings: {
      ...state.settings,
      owners: state.settings.owners.includes(owner)
        ? state.settings.owners
        : [...state.settings.owners, owner],
    },
  })),
  removeOwner: (owner) => set((state) => ({
    settings: {
      ...state.settings,
      owners: state.settings.owners.filter((o) => o !== owner),
    },
  })),
  updateGoals: (goals) => set((state) => ({
    settings: {
      ...state.settings,
      goals: {
        ...state.settings.goals,
        ...goals,
      },
    },
  })),

  toggleAgent: () => set((state) => ({ agentActive: !state.agentActive })),
  completeMission: (id) => set((state) => ({
    missions: state.missions.map((m) => (m.id === id ? { ...m, completed: true, current: m.target } : m)),
    gameState: {
      ...state.gameState,
      xp: state.gameState.xp + 100,
    },
  })),
}));
