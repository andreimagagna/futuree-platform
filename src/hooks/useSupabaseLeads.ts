/**
 * ============================================================================
 * HOOK: useSupabaseLeads
 * ============================================================================
 * Hook para gerenciar Leads usando Supabase diretamente
 * 
 * Funcionalidades:
 * - Buscar todos os leads
 * - Buscar lead por ID
 * - Criar novo lead
 * - Atualizar lead
 * - Deletar lead
 * - Filtros e ordenação
 * - Cache automático com React Query
 * 
 * Uso:
 * ```tsx
 * const { leads, isLoading, createLead, updateLead, deleteLead } = useSupabaseLeads();
 * ```
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Lead, LeadInsert, LeadUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// ============================================================================
// QUERY KEYS
// ============================================================================
const LEADS_QUERY_KEY = ['leads'] as const;

const getLeadQueryKey = (id: string) => ['leads', id] as const;

// ============================================================================
// TIPOS
// ============================================================================
interface UseSupabaseLeadsOptions {
  enabled?: boolean;
  filters?: {
    status?: Lead['status'];
    etapa?: Lead['etapa'];
    owner_id?: string;
  };
  orderBy?: {
    column: keyof Lead;
    ascending?: boolean;
  };
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================
export function useSupabaseLeads(options: UseSupabaseLeadsOptions = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Pegar usuário logado
  const { enabled = true, filters, orderBy } = options;

  // ============================================================================
  // QUERY: Buscar todos os leads
  // ============================================================================
  const {
    data: leads = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...LEADS_QUERY_KEY, filters, orderBy],
    queryFn: async () => {
      let query = supabase.from('leads').select('*');

      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.etapa) {
        query = query.eq('etapa', filters.etapa);
      }
      if (filters?.owner_id) {
        query = query.eq('owner_id', filters.owner_id);
      }

      // Aplicar ordenação
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      } else {
        // Ordenação padrão: mais recentes primeiro
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useSupabaseLeads] Erro ao buscar leads:', error);
        throw new Error(error.message);
      }

      return data as Lead[];
    },
    enabled,
  });

  // ============================================================================
  // MUTATION: Criar lead
  // ============================================================================
  const { mutateAsync: createLead, isPending: isCreating } = useMutation({
    mutationFn: async (newLead: LeadInsert) => {
      // ============================================================================
      // INJEÇÃO AUTOMÁTICA DO owner_id
      // Se não for fornecido, usa o ID do usuário logado
      // ============================================================================
      const leadWithOwner = {
        ...newLead,
        owner_id: newLead.owner_id || user?.id,
      };

      console.log('[useSupabaseLeads] Criando lead com owner_id:', leadWithOwner.owner_id);

      const { data, error } = await supabase
        .from('leads')
        .insert(leadWithOwner as any)
        .select()
        .single();

      if (error) {
        console.error('[useSupabaseLeads] Erro ao criar lead:', error);
        throw new Error(error.message);
      }

      console.log('[useSupabaseLeads] Lead criado com sucesso:', data);
      return data as Lead;
    },
    onSuccess: (newLead) => {
      // Invalidar cache para recarregar lista
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast.success('Lead criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar lead: ${error.message}`);
    },
  });

  // ============================================================================
  // MUTATION: Atualizar lead
  // ============================================================================
  const { mutateAsync: updateLead, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: LeadUpdate }) => {
      console.log('[useSupabaseLeads] 📝 Atualizando lead:', id, updates);
      
      const { data, error } = await (supabase as any)
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[useSupabaseLeads] Erro ao atualizar lead:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error('[useSupabaseLeads] Lead não encontrado');
        throw new Error('Lead não encontrado');
      }

      console.log('[useSupabaseLeads] ✅ Lead atualizado:', data);
      return data as Lead;
    },
    onSuccess: (updatedLead) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getLeadQueryKey(updatedLead.id) });
      toast.success('Lead atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar lead: ${error.message}`);
    },
  });

  // ============================================================================
  // MUTATION: Deletar lead
  // ============================================================================
  const { mutateAsync: deleteLead, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) {
        console.error('[useSupabaseLeads] Erro ao deletar lead:', error);
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: (deletedId) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getLeadQueryKey(deletedId) });
      toast.success('Lead deletado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao deletar lead: ${error.message}`);
    },
  });

  return {
    // Dados
    leads,
    isLoading,
    error,

    // Métodos
    createLead,
    updateLead,
    deleteLead,
    refetch,

    // Estados
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// ============================================================================
// HOOK: Buscar lead específico por ID
// ============================================================================
export function useSupabaseLead(id: string | null) {
  return useQuery({
    queryKey: id ? getLeadQueryKey(id) : ['leads', 'null'],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('[useSupabaseLead] Erro ao buscar lead:', error);
        throw new Error(error.message);
      }

      return data as Lead;
    },
    enabled: !!id,
  });
}

// ============================================================================
// HOOK: Buscar leads com estatísticas
// ============================================================================
export function useSupabaseLeadsStats() {
  return useQuery({
    queryKey: ['leads', 'stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase.from('leads').select('status, score, etapa');

      if (error) {
        console.error('[useSupabaseLeadsStats] Erro ao buscar estatísticas:', error);
        throw new Error(error.message);
      }

      const leadsData = leads as Array<{ status: Lead['status']; score: number; etapa: Lead['etapa'] }>;

      // Calcular estatísticas
      const total = leadsData?.length || 0;
      const novos = leadsData?.filter((l) => l.status === 'novo').length || 0;
      const qualificados = leadsData?.filter((l) => l.status === 'qualificado').length || 0;
      const ganhos = leadsData?.filter((l) => l.status === 'ganho').length || 0;
      const perdidos = leadsData?.filter((l) => l.status === 'perdido').length || 0;
      const avgScore =
        leadsData && leadsData.length > 0
          ? leadsData.reduce((sum, l) => sum + (l.score || 0), 0) / leadsData.length
          : 0;

      return {
        total,
        novos,
        qualificados,
        ganhos,
        perdidos,
        avgScore: Math.round(avgScore),
        taxaConversao: total > 0 ? Math.round((ganhos / total) * 100) : 0,
      };
    },
  });
}
