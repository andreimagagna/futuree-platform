import { create } from 'zustand';
import type { Lead, Task, Note, Project, Conversation, Mission, GameState } from './types';

export type DateRange = 'today' | 'this_week' | 'this_month' | 'custom';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number;
  attendees: string[];
  leadId?: string;
}

export interface Activity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'email' | 'call' | 'meeting' | 'note';
  leadId?: string;
}

interface LoadingState {
  leads: boolean;
  tasks: boolean;
  meetings: boolean;
  activities: boolean;
}

interface ErrorState {
  leads?: string;
  tasks?: string;
  meetings?: string;
  activities?: string;
}

interface StoreState {
  // Data
  leads: Lead[];
  tasks: Task[];
  projects: Project[];
  conversations: Conversation[];
  notes: Note[];
  meetings: Meeting[];
  activities: Activity[];
  
  // UI State
  dateRange: DateRange;
  loading: LoadingState;
  error: ErrorState;
  selectedView: string;
  isSidebarOpen: boolean;

  // Gamification
  gameState: GameState;
  missions: Mission[];
  
  // Agent
  agentActive: boolean;

  // Actions
  fetch: (resource: 'leads' | 'tasks' | 'meetings' | 'activities') => Promise<void>;
  setLoading: (resource: keyof LoadingState, isLoading: boolean) => void;
  setError: (resource: keyof ErrorState, error: string | undefined) => void;
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

export type { StoreState };