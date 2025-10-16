import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiServices, type QueryOptions, type MutationOptions } from '../services/api';
import { toast } from 'sonner';

/**
 * Cache Layer - Pensando em Escala
 *
 * Esta camada fornece cache inteligente, sincronização em tempo real,
 * e otimização de performance para as operações de API.
 */

// ========================================
// CACHE CONFIGURATION
// ========================================

export const CACHE_CONFIG = {
  // Tempo de cache padrão (5 minutos)
  defaultStaleTime: 5 * 60 * 1000,
  // Tempo de garbage collection (10 minutos)
  defaultGcTime: 10 * 60 * 1000,
  // Retry automático em falhas
  defaultRetry: 3,
  // Retry delay exponencial
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// ========================================
// CACHE KEYS
// ========================================

export const CACHE_KEYS = {
  leads: {
    all: ['leads'] as const,
    lists: () => [...CACHE_KEYS.leads.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...CACHE_KEYS.leads.lists(), filters] as const,
    details: () => [...CACHE_KEYS.leads.all, 'detail'] as const,
    detail: (id: string) => [...CACHE_KEYS.leads.details(), id] as const,
  },
  userPreferences: {
    all: ['userPreferences'] as const,
    details: () => [...CACHE_KEYS.userPreferences.all, 'detail'] as const,
    detail: (id: string) => [...CACHE_KEYS.userPreferences.details(), id] as const,
  },
  companySettings: {
    all: ['companySettings'] as const,
    details: () => [...CACHE_KEYS.companySettings.all, 'detail'] as const,
    detail: (id: string) => [...CACHE_KEYS.companySettings.details(), id] as const,
  },
  savedFunnels: {
    all: ['savedFunnels'] as const,
    lists: () => [...CACHE_KEYS.savedFunnels.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...CACHE_KEYS.savedFunnels.lists(), filters] as const,
    details: () => [...CACHE_KEYS.savedFunnels.all, 'detail'] as const,
    detail: (id: string) => [...CACHE_KEYS.savedFunnels.details(), id] as const,
  },
  landingPages: {
    all: ['landingPages'] as const,
    lists: () => [...CACHE_KEYS.landingPages.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...CACHE_KEYS.landingPages.lists(), filters] as const,
    details: () => [...CACHE_KEYS.landingPages.all, 'detail'] as const,
    detail: (id: string) => [...CACHE_KEYS.landingPages.details(), id] as const,
  },
  automationSettings: {
    all: ['automationSettings'] as const,
    lists: () => [...CACHE_KEYS.automationSettings.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...CACHE_KEYS.automationSettings.lists(), filters] as const,
    details: () => [...CACHE_KEYS.automationSettings.all, 'detail'] as const,
    detail: (id: string) => [...CACHE_KEYS.automationSettings.details(), id] as const,
  },
};

// ========================================
// HOOKS DE CACHE PARA LEADS
// ========================================

export function useLeads(options: QueryOptions = {}, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: CACHE_KEYS.leads.list(options.filters || {}),
    queryFn: () => apiServices.leads.query(options),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    ...queryOptions,
  });
}

export function useLead(id: string, select = '*', queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: CACHE_KEYS.leads.detail(id),
    queryFn: () => apiServices.leads.findById(id, select),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!id,
    ...queryOptions,
  });
}

export function useLeadsByOwner(ownerId: string, options: QueryOptions = {}, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: [...CACHE_KEYS.leads.list(options.filters || {}), 'owner', ownerId],
    queryFn: () => apiServices.leads.findByOwner(ownerId, options),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!ownerId,
    ...queryOptions,
  });
}

export function useCreateLead(mutationOptions?: Partial<UseMutationOptions>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiServices.leads.create(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.leads.all });
      toast.success('Lead criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar lead: ${error.message}`);
    },
    ...mutationOptions,
  });
}

export function useUpdateLead(mutationOptions?: Partial<UseMutationOptions<any, any, { id: string; updates: any }>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      apiServices.leads.update(id, updates),
    onSuccess: (data, variables) => {
      // Atualizar cache específico
      queryClient.setQueryData(CACHE_KEYS.leads.detail(variables.id), data);
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.leads.lists() });
      toast.success('Lead atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar lead: ${error.message}`);
    },
    ...mutationOptions,
  });
}

export function useDeleteLead(mutationOptions?: Partial<UseMutationOptions<any, any, string>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiServices.leads.delete(id),
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: CACHE_KEYS.leads.detail(id) });
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.leads.lists() });
      toast.success('Lead removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover lead: ${error.message}`);
    },
    ...mutationOptions,
  });
}

// ========================================
// HOOKS DE CACHE PARA USER PREFERENCES
// ========================================

export function useUserPreferences(userId: string, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: CACHE_KEYS.userPreferences.detail(userId),
    queryFn: () => apiServices.userPreferences.findByUser(userId),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!userId,
    ...queryOptions,
  });
}

export function useUpdateUserPreferences(mutationOptions?: Partial<UseMutationOptions<any, any, { userId: string; preferences: any }>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: any }) =>
      apiServices.userPreferences.updateUserPreferences(userId, preferences),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(CACHE_KEYS.userPreferences.detail(variables.userId), data);
      toast.success('Preferências atualizadas!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar preferências: ${error.message}`);
    },
    ...mutationOptions,
  });
}

// ========================================
// HOOKS DE CACHE PARA COMPANY SETTINGS
// ========================================

export function useCompanySettings(companyId: string, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: CACHE_KEYS.companySettings.detail(companyId),
    queryFn: () => apiServices.companySettings.findByCompany(companyId),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!companyId,
    ...queryOptions,
  });
}

export function useUpdateCompanySettings(mutationOptions?: Partial<UseMutationOptions<any, any, { companyId: string; settings: any }>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, settings }: { companyId: string; settings: any }) =>
      apiServices.companySettings.updateCompanySettings(companyId, settings),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(CACHE_KEYS.companySettings.detail(variables.companyId), data);
      toast.success('Configurações da empresa atualizadas!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar configurações: ${error.message}`);
    },
    ...mutationOptions,
  });
}

// ========================================
// HOOKS DE CACHE PARA SAVED FUNNELS
// ========================================

export function useSavedFunnels(userId: string, options: QueryOptions = {}, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: CACHE_KEYS.savedFunnels.list({ ...options.filters, user_id: userId }),
    queryFn: () => apiServices.savedFunnels.findByUser(userId, options),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!userId,
    ...queryOptions,
  });
}

export function useCreateSavedFunnel(mutationOptions?: Partial<UseMutationOptions>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiServices.savedFunnels.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.savedFunnels.all });
      toast.success('Funil salvo com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao salvar funil: ${error.message}`);
    },
    ...mutationOptions,
  });
}

// ========================================
// HOOKS DE CACHE PARA LANDING PAGES
// ========================================

export function useLandingPages(userId: string, options: QueryOptions = {}, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: CACHE_KEYS.landingPages.list({ ...options.filters, user_id: userId }),
    queryFn: () => apiServices.landingPages.findByUser(userId, options),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!userId,
    ...queryOptions,
  });
}

export function useLandingPageBySlug(slug: string, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: [...CACHE_KEYS.landingPages.details(), 'slug', slug],
    queryFn: () => apiServices.landingPages.findBySlug(slug),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!slug,
    ...queryOptions,
  });
}

export function usePublishedLandingPages(options: QueryOptions = {}, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: [...CACHE_KEYS.landingPages.lists(), 'published', options.filters],
    queryFn: () => apiServices.landingPages.findPublished(options),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    ...queryOptions,
  });
}

// ========================================
// HOOKS DE CACHE PARA AUTOMATION SETTINGS
// ========================================

export function useAutomationSettings(userId: string, options: QueryOptions = {}, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: CACHE_KEYS.automationSettings.list({ ...options.filters, user_id: userId }),
    queryFn: () => apiServices.automationSettings.findByUser(userId, options),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!userId,
    ...queryOptions,
  });
}

export function useAutomationSetting(userId: string, key: string, queryOptions?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: [...CACHE_KEYS.automationSettings.details(), userId, key],
    queryFn: () => apiServices.automationSettings.findByKey(userId, key),
    staleTime: CACHE_CONFIG.defaultStaleTime,
    gcTime: CACHE_CONFIG.defaultGcTime,
    retry: CACHE_CONFIG.defaultRetry,
    retryDelay: CACHE_CONFIG.retryDelay,
    enabled: !!userId && !!key,
    ...queryOptions,
  });
}

export function useUpsertAutomationSetting(mutationOptions?: Partial<UseMutationOptions<any, any, { userId: string; key: string; value: any }>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, key, value }: { userId: string; key: string; value: any }) =>
      apiServices.automationSettings.upsertSetting(userId, key, value),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.automationSettings.lists()
      });
      toast.success('Configuração de automação atualizada!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar configuração: ${error.message}`);
    },
    ...mutationOptions,
  });
}

// ========================================
// UTILITIES
// ========================================

// Hook para prefetch de dados
export function usePrefetchLeads() {
  const queryClient = useQueryClient();

  const prefetch = (options: QueryOptions = {}) => {
    queryClient.prefetchQuery({
      queryKey: CACHE_KEYS.leads.list(options.filters || {}),
      queryFn: () => apiServices.leads.query(options),
      staleTime: CACHE_CONFIG.defaultStaleTime,
    });
  };

  return { prefetch };
}

// Hook para otimistic updates
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  const update = <T>(
    queryKey: any[],
    updater: (old: T | undefined) => T | undefined
  ) => {
    queryClient.setQueryData(queryKey, updater);
  };

  const rollback = (queryKey: any[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { update, rollback };
}