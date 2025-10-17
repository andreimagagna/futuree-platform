import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

const supabaseClient: any = supabase as any;

export function useLeadsClean() {
  return useQuery<any[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from('leads').select('*');
      if (error) throw new Error(error.message || 'Error fetching leads');
      return (data as any) || [];
    },
  });
}

export function useCreateLeadClean() {
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
