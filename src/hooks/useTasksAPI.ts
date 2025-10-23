import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

const supabaseClient: any = supabase as any;

export function useTasks() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      console.log('[useTasks] 🔍 Buscando tasks do Supabase...');
      console.log('[useTasks] User ID:', user?.id);
      
      const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useTasks] ❌ Erro Supabase:', error);
        throw new Error(error.message || 'Error fetching tasks from Supabase');
      }
      
      console.log('[useTasks] ✅ Tasks do Supabase:', data?.length);
      console.log('[useTasks] Tasks brutas:', data);
      
      // ============================================================================
      // MAPEAR dados do Supabase para formato do Frontend
      // ============================================================================
      const mappedTasks = (data || []).map((task: any) => {
        // Mapear status: Supabase usa 'todo', 'em_progresso', etc.
        // Frontend espera 'backlog', 'in_progress', 'review', 'done'
        const statusMap: Record<string, string> = {
          'todo': 'backlog',
          'doing': 'in_progress',
          'em_progresso': 'in_progress',
          'done': 'done',
          'concluida': 'done',
          'cancelada': 'done',
          'in_progress': 'in_progress',
          'completed': 'done',
          'cancelled': 'done',
        };
        
        // Mapear priority: Supabase tem 'alta', 'media', 'baixa'
        // Frontend espera 'P1', 'P2', 'P3'
        const priorityMap: Record<string, string> = {
          'alta': 'P1',
          'urgente': 'P1',
          'media': 'P2',
          'baixa': 'P3',
          'P1': 'P1',
          'P2': 'P2',
          'P3': 'P3',
        };
        
        return {
          id: task.id,
          title: task.title,
          description: task.description || '',
          status: statusMap[task.status] || 'backlog',
          priority: priorityMap[task.priority] || 'P2',
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          dueTime: task.due_time || undefined,
          assignee: task.assigned_to || user?.email || 'Você',
          tags: task.tags || [],
          checklist: task.checklist || [],
          createdAt: task.created_at ? new Date(task.created_at) : new Date(),
          createdBy: task.created_by || user?.id || '',
          updatedAt: task.updated_at ? new Date(task.updated_at) : undefined,
          completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
          activities: task.task_activities || [],
          comments: task.comments || [],
          attachments: task.attachments || [],
          watchers: task.watchers || [],
          timeTracked: task.time_tracked || 0,
          estimatedTime: task.estimated_time || undefined,
          leadId: task.lead_id,
          projectId: task.project_id,
          parentTaskId: task.parent_task_id,
        };
      });
      
      console.log('[useTasks] ✅ Tasks mapeadas:', mappedTasks.length);
      console.log('[useTasks] Exemplo de task mapeada:', mappedTasks[0]);
      
      return mappedTasks;
    },
    enabled: !!user, // Só busca se tiver usuário logado
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const mutation = useMutation({
    mutationFn: async (task: any) => {
      console.log('[useCreateTask] 📝 Iniciando criação de task');
      console.log('[useCreateTask] Task recebida:', task);
      console.log('[useCreateTask] User:', user);
      
      const userId = user?.id;
      
      if (!userId) {
        console.error('[useCreateTask] ❌ Usuário não autenticado!');
        throw new Error('Usuário não autenticado');
      }
      
      // Map apenas campos válidos do Supabase
      // WORKAROUND: Mapear valores do frontend para ENUMs do Supabase
      const priorityMap: Record<string, string> = {
        'P1': 'alta',
        'P2': 'media',
        'P3': 'baixa',
        'alta': 'alta',
        'media': 'media',
        'baixa': 'baixa',
        'urgente': 'urgente',
      };
      
      const statusMap: Record<string, string> = {
        'todo': 'todo',
        'doing': 'em_progresso',
        'done': 'concluida',
        'in_progress': 'em_progresso',
        'completed': 'concluida',
        'cancelled': 'cancelada',
        'em_progresso': 'em_progresso',
        'concluida': 'concluida',
        'cancelada': 'cancelada',
      };
      
      const mappedPriority = priorityMap[task.priority] || 'media';
      const mappedStatus = statusMap[task.status || 'todo'] || 'todo';
      
      const validTask = {
        title: task.title,
        description: task.description || '',
        status: mappedStatus,
        priority: mappedPriority,
        due_date: task.dueDate ? (task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate) : null,
        due_time: task.dueTime || null,
        tags: task.tags || [],
        assigned_to: userId,
        owner_id: userId,
        created_by: userId,
        checklist: task.checklist || [],
        comments: task.comments || [],
        task_activities: task.activities || [],
        watchers: task.watchers || [],
        time_tracked: task.timeTracked || 0,
        estimated_time: task.estimatedTime || null,
        // project_id removido - não existe na tabela
        parent_task_id: task.parentTaskId || null,
        lead_id: task.leadId || null, // Adicionado lead_id que existe na tabela
      };

      console.log('[useCreateTask] ✅ Task mapeada:', validTask);
      console.log('[useCreateTask] Mapeamentos:', {
        'priority': `${task.priority} → ${mappedPriority}`,
        'status': `${task.status || 'todo'} → ${mappedStatus}`
      });
      console.log('[useCreateTask] 🚀 Enviando para Supabase...');

      const { data, error } = await supabaseClient.from('tasks').insert([validTask]).select();
      
      if (error) {
        console.error('[useCreateTask] ❌ Erro Supabase:', error);
        console.error('[useCreateTask] Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(error.message || 'Erro ao criar task');
      }
      
      console.log('[useCreateTask] ✅ Task criada com sucesso!', data);
      return data && data[0];
    },
    onSuccess: (data) => {
      console.log('[useCreateTask] 🎉 onSuccess:', data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('[useCreateTask] 💥 onError:', error);
    },
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      console.log('[useUpdateTask] 📝 Atualizando task:', id);
      console.log('[useUpdateTask] Updates recebidos:', updates);
      
      // Mapear valores do frontend para Supabase
      const priorityMap: Record<string, string> = {
        'P1': 'alta',
        'P2': 'media',
        'P3': 'baixa',
        'alta': 'alta',
        'media': 'media',
        'baixa': 'baixa',
        'urgente': 'urgente',
      };
      
      const statusMap: Record<string, string> = {
        'backlog': 'todo',
        'in_progress': 'em_progresso',
        'review': 'em_progresso',
        'done': 'concluida',
        'todo': 'todo',
        'doing': 'em_progresso',
        'em_progresso': 'em_progresso',
        'concluida': 'concluida',
        'cancelada': 'cancelada',
      };
      
      // Map apenas campos válidos do Supabase
      const validUpdates: any = {};
      
      if ('title' in updates) validUpdates.title = updates.title;
      if ('description' in updates) validUpdates.description = updates.description;
      if ('status' in updates) {
        validUpdates.status = statusMap[updates.status] || updates.status;
      }
      if ('priority' in updates) {
        validUpdates.priority = priorityMap[updates.priority] || updates.priority;
      }
      if ('dueDate' in updates) {
        validUpdates.due_date = updates.dueDate ? 
          (updates.dueDate instanceof Date ? updates.dueDate.toISOString() : updates.dueDate) : null;
      }
      if ('dueTime' in updates) validUpdates.due_time = updates.dueTime;
      if ('tags' in updates) validUpdates.tags = updates.tags;
      if ('assignee' in updates) validUpdates.assigned_to = updates.assignee;
      if ('checklist' in updates) validUpdates.checklist = updates.checklist;
      if ('comments' in updates) validUpdates.comments = updates.comments;
      if ('activities' in updates) validUpdates.task_activities = updates.activities;
      if ('watchers' in updates) validUpdates.watchers = updates.watchers;
      if ('timeTracked' in updates) validUpdates.time_tracked = updates.timeTracked;
      if ('estimatedTime' in updates) validUpdates.estimated_time = updates.estimatedTime;
      if ('projectId' in updates) validUpdates.project_id = updates.projectId;
      if ('parentTaskId' in updates) validUpdates.parent_task_id = updates.parentTaskId;
      
      // Se marcar como done, adicionar completed_at
      if (validUpdates.status === 'concluida' || validUpdates.status === 'done') {
        validUpdates.completed_at = new Date().toISOString();
      }

      console.log('[useUpdateTask] ✅ Updates mapeados:', validUpdates);

      const { data, error } = await supabaseClient
        .from('tasks')
        .update(validUpdates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('[useUpdateTask] ❌ Erro Supabase:', error);
        console.error('[useUpdateTask] Updates que causaram erro:', validUpdates);
        throw new Error(error.message || 'Error updating task');
      }
      
      console.log('[useUpdateTask] 🎉 Task atualizada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      console.log('[useUpdateTask] ♻️ Invalidando cache...');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('[useDeleteTask] Supabase delete error', error);
        throw new Error(error.message || 'Error deleting task');
      }
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}
