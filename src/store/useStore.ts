import { create } from 'zustand';

export type LeadStage = 'captured' | 'qualify' | 'contact' | 'proposal' | 'closing';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type Priority = 'P1' | 'P2' | 'P3';
export type DateRange = 'today' | 'this_week' | 'this_month' | 'custom';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  stage: LeadStage;
  score: number;
  owner: string;
  source: string;
  lastContact: Date;
  nextAction?: Date;
  tags: string[];
  notes: string;
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

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

interface StoreState {
  // UI State
  dateRange: DateRange;

  // Data
  leads: Lead[];
  tasks: Task[];
  projects: Project[];
  conversations: Conversation[];
  notes: Note[];
  
  // Gamification
  gameState: GameState;
  missions: Mission[];
  
  // Agent
  agentActive: boolean;
  
  // Actions
  setDateRange: (range: DateRange) => void;

  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addNote: (note: Note) => void;

  toggleAgent: () => void;
  completeMission: (id: string) => void;
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    company: 'Tech Corp',
    email: 'joao@techcorp.com',
    whatsapp: '(11) 99999-0001',
    stage: 'qualify',
    score: 85,
    owner: 'Você',
    source: 'Website',
    lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextAction: new Date(Date.now() + 24 * 60 * 60 * 1000),
    tags: ['hot', 'enterprise'],
    notes: 'Cliente muito interessado em integração',
  },
  {
    id: '2',
    name: 'Maria Santos',
    company: 'Innovation Labs',
    email: 'maria@innovation.com',
    whatsapp: '(11) 99999-0002',
    stage: 'contact',
    score: 92,
    owner: 'Você',
    source: 'LinkedIn',
    lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nextAction: new Date(Date.now() + 2 * 60 * 60 * 1000),
    tags: ['hot', 'startup'],
    notes: 'Precisa de demo',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    company: 'Digital Solutions',
    email: 'pedro@digital.com',
    whatsapp: '(11) 99999-0003',
    stage: 'proposal',
    score: 78,
    owner: 'Você',
    source: 'Indicação',
    lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['warm'],
    notes: 'Aguardando orçamento',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Enviar proposta comercial para Tech Corp',
    leadId: '1',
    priority: 'P1',
    status: 'in_progress',
    dueDate: new Date(),
    dueTime: '14:00',
    assignee: 'Você',
    tags: ['proposta', 'urgente'],
    description: 'Incluir detalhes de integração e pricing',
    checklist: [
      { id: '1', text: 'Revisar preços', done: true },
      { id: '2', text: 'Adicionar casos de uso', done: false },
    ],
  },
  {
    id: '2',
    title: 'Demo do produto para Innovation Labs',
    leadId: '2',
    priority: 'P1',
    status: 'backlog',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    dueTime: '10:00',
    assignee: 'Você',
    tags: ['demo'],
    description: 'Preparar ambiente de demonstração',
    checklist: [],
  },
  {
    id: '3',
    title: 'Follow-up com Digital Solutions',
    leadId: '3',
    priority: 'P2',
    status: 'backlog',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    assignee: 'Você',
    tags: ['follow-up'],
    description: 'Verificar se receberam a proposta',
    checklist: [],
  },
];

const mockNotes: Note[] = [
  {
    id: '1',
    leadId: '1',
    content: 'Cliente mencionou que o budget para o projeto é de $5k.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    createdBy: 'Você',
  },
  {
    id: '2',
    leadId: '2',
    content: 'A decisora principal, Ana, está de férias até dia 20.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdBy: 'Você',
  }
];

export const useStore = create<StoreState>((set) => ({
  dateRange: 'this_week',
  leads: mockLeads,
  tasks: mockTasks,
  notes: mockNotes,
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
  
  setDateRange: (range) => set({ dateRange: range }),

  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
  })),
  deleteLead: (id) => set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),

  toggleAgent: () => set((state) => ({ agentActive: !state.agentActive })),
  completeMission: (id) => set((state) => ({
    missions: state.missions.map((m) => (m.id === id ? { ...m, completed: true, current: m.target } : m)),
    gameState: {
      ...state.gameState,
      xp: state.gameState.xp + 100,
    },
  })),
}));
