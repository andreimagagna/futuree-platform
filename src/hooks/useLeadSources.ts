import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

export interface LeadSource {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  owner_id: string;
}

/**
 * Hook para buscar fontes de leads do usuário
 * Usado em Settings e no CRM (detalhes dos leads)
 */
export const useLeadSources = () => {
  const { user } = useAuthContext();

  const query = useQuery({
    queryKey: ['lead_sources', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_sources')
        .select('*')
        .eq('owner_id', user?.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as LeadSource[];
    },
    enabled: !!user,
  });

  // Retornar apenas fontes ativas para dropdowns
  const activeSources = query.data?.filter((source) => source.is_active) || [];

  return {
    ...query,
    leadSources: query.data || [],
    activeSources,
  };
};
