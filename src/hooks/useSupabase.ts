/**
 * ============================================================================
 * HOOKS SUPABASE - ARQUIVO UNIFICADO
 * ============================================================================
 * Todos os hooks para interagir com o Supabase em um único arquivo
 * 
 * Tabelas disponíveis:
 * - Companies (Empresas)
 * - Tasks (Tarefas)
 * - Activities (Atividades)
 * - Profiles (Perfis de usuário)
 * - Deals (Negociações)
 * - Projects (Projetos)
 * - Messages & Conversations (Mensagens e Conversas)
 * 
 * Cada hook fornece:
 * - Query para buscar dados (com cache automático)
 * - Mutations para criar, atualizar, deletar
 * - Estados de loading
 * - Tratamento de erros com toast
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  Company,
  CompanyInsert,
  CompanyUpdate,
  Task,
  TaskInsert,
  TaskUpdate,
  Activity,
  ActivityInsert,
  ActivityUpdate,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Deal,
  DealInsert,
  DealUpdate,
} from '@/integrations/supabase/types';
import { toast } from 'sonner';

// ============================================================================
// COMPANIES (Empresas)
// ============================================================================

const COMPANIES_KEY = ['companies'] as const;

export function useSupabaseCompanies() {
  const queryClient = useQueryClient();

  const {
    data: companies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: COMPANIES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Company[];
    },
  });

  const { mutateAsync: createCompany, isPending: isCreating } = useMutation({
    mutationFn: async (newCompany: CompanyInsert) => {
      // @ts-ignore
      const { data, error } = await supabase.from('companies').insert(newCompany).select().single();
      if (error) throw new Error(error.message);
      return data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY });
      toast.success('Empresa criada com sucesso!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  const { mutateAsync: updateCompany, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CompanyUpdate }) => {
      // @ts-ignore
      const { data, error } = await supabase.from('companies').update(updates).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY });
      toast.success('Empresa atualizada!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  const { mutateAsync: deleteCompany, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY });
      toast.success('Empresa deletada!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  return {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// ============================================================================
// TASKS (Tarefas)
// ============================================================================

const TASKS_KEY = ['tasks'] as const;

interface UseTasksOptions {
  leadId?: string;
  assignedTo?: string;
}

export function useSupabaseTasks(options: UseTasksOptions = {}) {
  const queryClient = useQueryClient();
  const { leadId, assignedTo } = options;

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...TASKS_KEY, leadId, assignedTo],
    queryFn: async () => {
      let query = supabase.from('tasks').select('*');

      if (leadId) query = query.eq('lead_id', leadId);
      if (assignedTo) query = query.eq('assigned_to', assignedTo);

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Task[];
    },
  });

  const { mutateAsync: createTask, isPending: isCreating } = useMutation({
    mutationFn: async (newTask: TaskInsert) => {
      // @ts-ignore
      const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
      if (error) throw new Error(error.message);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarefa criada!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  const { mutateAsync: updateTask, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      // @ts-ignore
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarefa atualizada!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  const { mutateAsync: deleteTask, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarefa deletada!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// ============================================================================
// ACTIVITIES (Atividades)
// ============================================================================

const ACTIVITIES_KEY = ['activities'] as const;

interface UseActivitiesOptions {
  leadId?: string;
}

export function useSupabaseActivities(options: UseActivitiesOptions = {}) {
  const queryClient = useQueryClient();
  const { leadId } = options;

  const {
    data: activities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...ACTIVITIES_KEY, leadId],
    queryFn: async () => {
      let query = supabase.from('activities').select('*');

      if (leadId) query = query.eq('lead_id', leadId);

      query = query.order('activity_date', { ascending: false });

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Activity[];
    },
  });

  const { mutateAsync: createActivity, isPending: isCreating } = useMutation({
    mutationFn: async (newActivity: ActivityInsert) => {
      // @ts-ignore
      const { data, error } = await supabase.from('activities').insert(newActivity).select().single();
      if (error) throw new Error(error.message);
      return data as Activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEY });
      toast.success('Atividade registrada!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  return {
    activities,
    isLoading,
    error,
    createActivity,
    isCreating,
  };
}

// ============================================================================
// PROFILES (Perfis de usuário)
// ============================================================================

const PROFILES_KEY = ['profiles'] as const;

export function useSupabaseProfiles() {
  const queryClient = useQueryClient();

  const {
    data: profiles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: PROFILES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw new Error(error.message);
      return data as Profile[];
    },
  });

  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProfileUpdate }) => {
      // @ts-ignore
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY });
      toast.success('Perfil atualizado!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  return {
    profiles,
    isLoading,
    error,
    updateProfile,
    isUpdating,
  };
}

// ============================================================================
// DEALS (Negociações)
// ============================================================================

const DEALS_KEY = ['deals'] as const;

interface UseDealsOptions {
  leadId?: string;
}

export function useSupabaseDeals(options: UseDealsOptions = {}) {
  const queryClient = useQueryClient();
  const { leadId } = options;

  const {
    data: deals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...DEALS_KEY, leadId],
    queryFn: async () => {
      let query = supabase.from('deals').select('*');

      if (leadId) query = query.eq('lead_id', leadId);

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Deal[];
    },
  });

  const { mutateAsync: createDeal, isPending: isCreating } = useMutation({
    mutationFn: async (newDeal: DealInsert) => {
      // @ts-ignore
      const { data, error } = await supabase.from('deals').insert(newDeal).select().single();
      if (error) throw new Error(error.message);
      return data as Deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_KEY });
      toast.success('Deal criado!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  const { mutateAsync: updateDeal, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DealUpdate }) => {
      // @ts-ignore
      const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data as Deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_KEY });
      toast.success('Deal atualizado!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  const { mutateAsync: deleteDeal, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('deals').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_KEY });
      toast.success('Deal deletado!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  return {
    deals,
    isLoading,
    error,
    createDeal,
    updateDeal,
    deleteDeal,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
