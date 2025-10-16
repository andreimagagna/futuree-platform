import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CACHE_KEYS } from './use-api-cache';
import { toast } from 'sonner';

/**
 * Realtime Layer - Pensando em Escala
 *
 * Esta camada fornece sincronização em tempo real dos dados
 * com atualização automática do cache quando mudanças ocorrem.
 */

// ========================================
// REALTIME SUBSCRIPTION MANAGER
// ========================================

class RealtimeManager {
  private subscriptions: Map<string, any> = new Map();
  private queryClient: any;

  constructor(queryClient: any) {
    this.queryClient = queryClient;
  }

  // Inscrever em mudanças de uma tabela
  subscribe(table: string, callback: (payload: any) => void) {
    const channelName = `realtime:${table}`;

    if (this.subscriptions.has(channelName)) {
      return; // Já inscrito
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(channelName, channel);
  }

  // Cancelar inscrição
  unsubscribe(table: string) {
    const channelName = `realtime:${table}`;
    const channel = this.subscriptions.get(channelName);

    if (channel) {
      supabase.removeChannel(channel);
      this.subscriptions.delete(channelName);
    }
  }

  // Cancelar todas as inscrições
  unsubscribeAll() {
    this.subscriptions.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}

// ========================================
// REALTIME HOOKS
// ========================================

export function useRealtimeLeads() {
  const queryClient = useQueryClient();
  const manager = new RealtimeManager(queryClient);

  const handleLeadChange = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        // Adicionar novo lead ao cache
        queryClient.setQueryData(
          CACHE_KEYS.leads.detail(newRecord.id),
          newRecord
        );
        // Invalidar listas para refetch
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.leads.lists(),
          refetchType: 'none' // Não refetch automático, apenas invalidar
        });
        toast.success('Novo lead adicionado!');
        break;

      case 'UPDATE':
        // Atualizar lead no cache
        queryClient.setQueryData(
          CACHE_KEYS.leads.detail(newRecord.id),
          newRecord
        );
        // Invalidar listas
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.leads.lists(),
          refetchType: 'none'
        });
        break;

      case 'DELETE':
        // Remover lead do cache
        queryClient.removeQueries({
          queryKey: CACHE_KEYS.leads.detail(oldRecord.id)
        });
        // Invalidar listas
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.leads.lists(),
          refetchType: 'none'
        });
        toast.info('Lead removido!');
        break;
    }
  }, [queryClient]);

  useEffect(() => {
    manager.subscribe('leads', handleLeadChange);

    return () => {
      manager.unsubscribe('leads');
    };
  }, [handleLeadChange]);

  return manager;
}

export function useRealtimeUserPreferences(userId: string) {
  const queryClient = useQueryClient();
  const manager = new RealtimeManager(queryClient);

  const handlePreferencesChange = useCallback((payload: any) => {
    const { eventType, new: newRecord } = payload;

    if (eventType === 'UPDATE' && newRecord.id === userId) {
      queryClient.setQueryData(
        CACHE_KEYS.userPreferences.detail(userId),
        newRecord
      );
      toast.info('Preferências atualizadas em outro dispositivo!');
    }
  }, [queryClient, userId]);

  useEffect(() => {
    if (userId) {
      manager.subscribe('user_preferences', handlePreferencesChange);
    }

    return () => {
      manager.unsubscribe('user_preferences');
    };
  }, [handlePreferencesChange, userId]);

  return manager;
}

export function useRealtimeCompanySettings(companyId: string) {
  const queryClient = useQueryClient();
  const manager = new RealtimeManager(queryClient);

  const handleSettingsChange = useCallback((payload: any) => {
    const { eventType, new: newRecord } = payload;

    if (eventType === 'UPDATE' && newRecord.id === companyId) {
      queryClient.setQueryData(
        CACHE_KEYS.companySettings.detail(companyId),
        newRecord
      );
      toast.info('Configurações da empresa atualizadas!');
    }
  }, [queryClient, companyId]);

  useEffect(() => {
    if (companyId) {
      manager.subscribe('company_settings', handleSettingsChange);
    }

    return () => {
      manager.unsubscribe('company_settings');
    };
  }, [handleSettingsChange, companyId]);

  return manager;
}

export function useRealtimeSavedFunnels(userId: string) {
  const queryClient = useQueryClient();
  const manager = new RealtimeManager(queryClient);

  const handleFunnelChange = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    // Só processar mudanças do usuário atual
    if ((newRecord?.user_id !== userId) && (oldRecord?.user_id !== userId)) {
      return;
    }

    switch (eventType) {
      case 'INSERT':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.savedFunnels.lists()
        });
        toast.success('Novo funil salvo!');
        break;

      case 'UPDATE':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.savedFunnels.lists()
        });
        break;

      case 'DELETE':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.savedFunnels.lists()
        });
        toast.info('Funil removido!');
        break;
    }
  }, [queryClient, userId]);

  useEffect(() => {
    if (userId) {
      manager.subscribe('saved_funnels', handleFunnelChange);
    }

    return () => {
      manager.unsubscribe('saved_funnels');
    };
  }, [handleFunnelChange, userId]);

  return manager;
}

export function useRealtimeLandingPages(userId: string) {
  const queryClient = useQueryClient();
  const manager = new RealtimeManager(queryClient);

  const handlePageChange = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    // Só processar mudanças do usuário atual
    if ((newRecord?.user_id !== userId) && (oldRecord?.user_id !== userId)) {
      return;
    }

    switch (eventType) {
      case 'INSERT':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.landingPages.lists()
        });
        toast.success('Nova landing page criada!');
        break;

      case 'UPDATE':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.landingPages.lists()
        });
        if (newRecord.published !== oldRecord?.published) {
          toast.info(`Landing page ${newRecord.published ? 'publicada' : 'despublicada'}!`);
        }
        break;

      case 'DELETE':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.landingPages.lists()
        });
        toast.info('Landing page removida!');
        break;
    }
  }, [queryClient, userId]);

  useEffect(() => {
    if (userId) {
      manager.subscribe('landing_pages', handlePageChange);
    }

    return () => {
      manager.unsubscribe('landing_pages');
    };
  }, [handlePageChange, userId]);

  return manager;
}

export function useRealtimeAutomationSettings(userId: string) {
  const queryClient = useQueryClient();
  const manager = new RealtimeManager(queryClient);

  const handleSettingChange = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    // Só processar mudanças do usuário atual
    if ((newRecord?.user_id !== userId) && (oldRecord?.user_id !== userId)) {
      return;
    }

    switch (eventType) {
      case 'INSERT':
      case 'UPDATE':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.automationSettings.lists()
        });
        toast.info('Configuração de automação atualizada!');
        break;

      case 'DELETE':
        queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.automationSettings.lists()
        });
        toast.info('Configuração de automação removida!');
        break;
    }
  }, [queryClient, userId]);

  useEffect(() => {
    if (userId) {
      manager.subscribe('automation_settings', handleSettingChange);
    }

    return () => {
      manager.unsubscribe('automation_settings');
    };
  }, [handleSettingChange, userId]);

  return manager;
}

// ========================================
// HOOK COMBINADO PARA TODAS AS SUBSCRIÇÕES
// ========================================

export function useRealtimeSync(options: {
  userId?: string;
  companyId?: string;
  enableLeads?: boolean;
  enablePreferences?: boolean;
  enableCompanySettings?: boolean;
  enableFunnels?: boolean;
  enableLandingPages?: boolean;
  enableAutomation?: boolean;
} = {}) {
  const {
    userId,
    companyId,
    enableLeads = true,
    enablePreferences = true,
    enableCompanySettings = true,
    enableFunnels = true,
    enableLandingPages = true,
    enableAutomation = true,
  } = options;

  // Ativar subscriptions conforme configuração
  useRealtimeLeads();
  if (enablePreferences && userId) useRealtimeUserPreferences(userId);
  if (enableCompanySettings && companyId) useRealtimeCompanySettings(companyId);
  if (enableFunnels && userId) useRealtimeSavedFunnels(userId);
  if (enableLandingPages && userId) useRealtimeLandingPages(userId);
  if (enableAutomation && userId) useRealtimeAutomationSettings(userId);

  return {
    isConnected: true, // Supabase mantém conexão automaticamente
  };
}

// ========================================
// UTILITIES PARA REALTIME
// ========================================

// Hook para broadcast de mudanças locais
export function useBroadcastChange() {
  const broadcast = useCallback((table: string, action: string, data: any) => {
    // Aqui poderíamos implementar broadcast via WebSocket ou Server-Sent Events
    // Por enquanto, apenas log
    console.log(`Broadcasting ${action} on ${table}:`, data);
  }, []);

  return { broadcast };
}

// Hook para optimistic updates com rollback
export function useOptimisticRealtime() {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    <T>(
      queryKey: any[],
      updater: (old: T | undefined) => T | undefined,
      rollbackData?: T
    ) => {
      // Aplicar mudança otimista
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, updater);

      // Retornar função de rollback
      return () => {
        queryClient.setQueryData(queryKey, rollbackData || previousData);
      };
    },
    [queryClient]
  );

  return { optimisticUpdate };
}