export type LeadStage = 'captured' | 'qualify' | 'contact' | 'proposal' | 'closing';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type Priority = 'P1' | 'P2' | 'P3';

export interface BANTMethodology {
  budget: boolean;      // Tem orçamento definido?
  authority: boolean;   // Fala com decisor?
  need: boolean;        // Tem necessidade clara?
  timeline: boolean;    // Tem prazo definido?
  qualifiedAt?: Date;   // Data da qualificação
  qualifiedBy?: string; // Quem qualificou
}

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
  bant?: BANTMethodology; // Metodologia BANT
  website?: string; // Site da empresa
  companySize?: string; // Porte da empresa
  employeeCount?: string; // Número de funcionários
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