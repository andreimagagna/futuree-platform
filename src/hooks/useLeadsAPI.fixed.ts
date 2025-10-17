import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

const supabaseClient: any = supabase as any;

export function useLeads() {
  return useQuery<any[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from('leads').select('*');
      if (error) throw new Error(error.message || 'Error fetching leads');
      return (data as any) || [];
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const mutation = useMutation({
    mutationFn: async (lead: any) => {
      try {
        const userId = user?.id;
        if (userId && !lead.owner_id) lead.owner_id = userId;
      } catch {}
      const { data, error } = await supabaseClient.from('leads').insert([lead]).select();
      if (error) throw new Error(error.message || 'Insert failed');
      return data && data[0];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabaseClient.from('leads').update(updates).eq('id', id).select();
      if (error) throw new Error(error.message || 'Update failed');
      return data && data[0];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabaseClient.from('leads').delete().eq('id', id).select();
      if (error) throw new Error(error.message || 'Delete failed');
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}
