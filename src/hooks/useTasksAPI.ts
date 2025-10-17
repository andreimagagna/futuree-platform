import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

const supabaseClient: any = supabase as any;

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from('tasks').select('*');
      if (error) {
        console.error('[useTasks] Supabase error', error);
        throw new Error(error.message || 'Error fetching tasks from Supabase');
      }
      return (data as any) || [];
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const mutation = useMutation({
    mutationFn: async (task: any) => {
      // Attach authenticated user id when available to satisfy RLS policies
      const userId = user?.id;
      if (userId && !task.created_by) {
        task.created_by = userId;
      }

      const { data, error } = await supabaseClient.from('tasks').insert([task]).select();
      if (error) {
        console.error('[useCreateTask] Supabase insert error', error, task);
        throw new Error(error.message || 'Error inserting task into Supabase');
      }
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}
