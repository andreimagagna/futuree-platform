import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

// ============================================================================
// TYPES - Baseado na tabela tasks do Supabase
// ============================================================================
export interface Task {
  id: string;
  lead_id?: string;
  assigned_to?: string;
  created_by?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  due_date?: string;
  completed_at?: string;
  tags?: string[];
  attachments?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskInput {
  lead_id?: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'baixa' | 'media' | 'alta' | 'urgente';
  due_date?: string;
  tags?: string[];
  attachments?: any[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'baixa' | 'media' | 'alta' | 'urgente';
  due_date?: string;
  completed_at?: string;
  tags?: string[];
  attachments?: any[];
}

// ============================================================================
// HOOK - CRUD de Tasks do Supabase
// ============================================================================
export function useSupabaseTasks(leadId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  // ============================================================================
  // QUERY - Buscar tasks
  // ============================================================================
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', leadId],
    queryFn: async () => {
      let query = (supabase as any)
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtrar por lead se fornecido
      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useSupabaseTasks] Erro ao buscar tasks:', error);
        throw error;
      }

      console.log('[useSupabaseTasks] Tasks carregadas:', data?.length);
      return data as Task[];
    },
    enabled: !!user, // Só busca se tiver usuário logado
  });

  // ============================================================================
  // MUTATION - Criar task
  // ============================================================================
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: CreateTaskInput) => {
      console.log('[useSupabaseTasks] Criando task:', newTask);

      const taskData = {
        ...newTask,
        created_by: user?.id, // Criador da task
        assigned_to: user?.id, // Por padrão, atribuída ao criador
        status: newTask.status || 'todo',
        priority: newTask.priority || 'media',
      };

      const { data, error } = await (supabase as any)
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) {
        console.error('[useSupabaseTasks] Erro ao criar task:', error);
        throw error;
      }

      console.log('[useSupabaseTasks] ✅ Task criada:', data);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // ============================================================================
  // MUTATION - Atualizar task
  // ============================================================================
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTaskInput }) => {
      console.log('[useSupabaseTasks] Atualizando task:', id, updates);

      // Se marcar como done, adicionar completed_at
      if (updates.status === 'done' && !updates.completed_at) {
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await (supabase as any)
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useSupabaseTasks] Erro ao atualizar task:', error);
        throw error;
      }

      console.log('[useSupabaseTasks] ✅ Task atualizada:', data);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // ============================================================================
  // MUTATION - Deletar task
  // ============================================================================
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('[useSupabaseTasks] Deletando task:', id);

      const { error } = await (supabase as any)
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useSupabaseTasks] Erro ao deletar task:', error);
        throw error;
      }

      console.log('[useSupabaseTasks] ✅ Task deletada');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    // Data
    tasks: tasks || [],
    isLoading,
    error,

    // Mutations
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,

    // States
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}
