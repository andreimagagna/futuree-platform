import { useLeads, useLead, useLeadsByOwner, useCreateLead, useUpdateLead, useDeleteLead } from './use-api-cache';
import { useRealtimeLeads } from './use-realtime';
import type { QueryOptions } from '../services/api';

/**
 * API Unificada - Pensando em Escala
 *
 * Hook principal que combina services, cache e realtime em uma interface unificada.
 * Este é o hook que deve ser usado pelos componentes.
 */

// ========================================
// HOOK UNIFICADO PARA LEADS
// ========================================

export function useLeadsAPI(options: QueryOptions = {}) {
  // Cache hooks
  const leadsQuery = useLeads(options);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  // Realtime subscription
  useRealtimeLeads();

  return {
    // Dados
    leads: leadsQuery.data || [],
    isLoading: leadsQuery.isLoading,
    error: leadsQuery.error,
    isRefetching: leadsQuery.isRefetching,

    // Ações
    createLead: createMutation.mutate,
    updateLead: updateMutation.mutate,
    deleteLead: deleteMutation.mutate,

    // Estados das mutações
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Utilitários
    refetch: leadsQuery.refetch,
    invalidate: () => leadsQuery.refetch(),
  };
}

export function useLeadAPI(id: string, select = '*') {
  // Cache hooks
  const leadQuery = useLead(id, select);
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  // Realtime subscription
  useRealtimeLeads();

  return {
    // Dados
    lead: leadQuery.data,
    isLoading: leadQuery.isLoading,
    error: leadQuery.error,
    isRefetching: leadQuery.isRefetching,

    // Ações
    updateLead: (updates: any) => updateMutation.mutate({ id, updates }),
    deleteLead: () => deleteMutation.mutate(id),

    // Estados das mutações
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Utilitários
    refetch: leadQuery.refetch,
  };
}

export function useLeadsByOwnerAPI(ownerId: string, options: QueryOptions = {}) {
  // Cache hooks
  const leadsQuery = useLeadsByOwner(ownerId, options);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  // Realtime subscription
  useRealtimeLeads();

  return {
    // Dados
    leads: leadsQuery.data || [],
    isLoading: leadsQuery.isLoading,
    error: leadsQuery.error,
    isRefetching: leadsQuery.isRefetching,

    // Ações
    createLead: createMutation.mutate,
    updateLead: updateMutation.mutate,
    deleteLead: deleteMutation.mutate,

    // Estados das mutações
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Utilitários
    refetch: leadsQuery.refetch,
  };
}

// ========================================
// HOOK UNIFICADO GENÉRICO
// ========================================

/**
 * Hook genérico para qualquer tabela
 * Uso avançado - para casos não cobertos pelos hooks específicos
 */
export function useTableAPI(tableName: string) {
  // Este hook pode ser expandido para suportar qualquer tabela
  // Por enquanto, retorna uma interface básica

  return {
    // Placeholder - implementar conforme necessário
    query: (options: QueryOptions) => {
      console.log(`Querying ${tableName} with options:`, options);
      // Implementar lógica genérica
    },
    create: (data: any) => {
      console.log(`Creating in ${tableName}:`, data);
      // Implementar lógica genérica
    },
    update: (id: string, updates: any) => {
      console.log(`Updating ${tableName} ${id}:`, updates);
      // Implementar lógica genérica
    },
    delete: (id: string) => {
      console.log(`Deleting from ${tableName}:`, id);
      // Implementar lógica genérica
    },
  };
}

// ========================================
// HOOK PARA DASHBOARD/ANALYTICS
// ========================================

export function useDashboardAPI() {
  // Combinar múltiplas queries para dashboard
  const leadsQuery = useLeads();
  const leadsByOwner = useLeadsByOwner('current-user-id'); // Substituir por ID real

  return {
    // Dados agregados
    totalLeads: (leadsQuery.data as any[])?.length || 0,
    myLeads: (leadsByOwner.data as any[])?.length || 0,

    // Estados de loading
    isLoading: leadsQuery.isLoading || leadsByOwner.isLoading,

    // Dados detalhados
    allLeads: leadsQuery.data || [],
    ownerLeads: leadsByOwner.data || [],

    // Utilitários
    refetchAll: () => {
      leadsQuery.refetch();
      leadsByOwner.refetch();
    },
  };
}

// ========================================
// HOOK PARA BULK OPERATIONS
// ========================================

export function useBulkOperationsAPI() {
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const bulkUpdate = async (leads: Array<{ id: string; updates: any }>) => {
    const promises = leads.map(({ id, updates }) =>
      updateMutation.mutateAsync({ id, updates })
    );
    return Promise.all(promises);
  };

  const bulkDelete = async (ids: string[]) => {
    const promises = ids.map(id => deleteMutation.mutateAsync(id));
    return Promise.all(promises);
  };

  return {
    bulkUpdate,
    bulkDelete,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ========================================
// HOOK PARA SEARCH/FILTER
// ========================================

export function useSearchAPI() {
  const leadsQuery = useLeads();

  const search = (query: string, filters: Record<string, any> = {}) => {
    // Implementar lógica de busca
    const searchTerm = query.toLowerCase();

    return ((leadsQuery.data as any[]) || []).filter(lead => {
      const matchesSearch = !query ||
        lead.nome?.toLowerCase().includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm) ||
        lead.whatsapp?.includes(searchTerm);

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return lead[key] === value;
      });

      return matchesSearch && matchesFilters;
    });
  };

  return {
    search,
    isLoading: leadsQuery.isLoading,
    refetch: leadsQuery.refetch,
  };
}

// ========================================
// HOOK PARA PAGINAÇÃO INFINITA
// ========================================

export function useInfiniteLeadsAPI(options: QueryOptions = {}) {
  // Implementar paginação infinita
  const leadsQuery = useLeads({
    ...options,
    limit: 20, // Itens por página
  });

  const loadMore = () => {
    // Implementar lógica de load more
    console.log('Loading more leads...');
  };

  return {
    leads: leadsQuery.data || [],
    hasNextPage: true, // Calcular baseado na resposta
    isLoading: leadsQuery.isLoading,
    isLoadingMore: false, // Estado de loading adicional
    loadMore,
    refetch: leadsQuery.refetch,
  };
}

// ========================================
// HOOK PARA OFFLINE/SYNC
// ========================================

export function useOfflineSyncAPI() {
  // Implementar sincronização offline
  const isOnline = navigator.onLine;

  return {
    isOnline,
    pendingChanges: [], // Mudanças pendentes para sync
    sync: () => {
      console.log('Syncing offline changes...');
    },
    isSyncing: false,
  };
}

// ========================================
// EXPORTS
// ========================================

export {
  // Re-export cache hooks para uso avançado
  useLeads as useLeadsCache,
  useLead as useLeadCache,
  useLeadsByOwner as useLeadsByOwnerCache,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
} from './use-api-cache';

export {
  // Re-export realtime hooks
  useRealtimeSync,
} from './use-realtime';