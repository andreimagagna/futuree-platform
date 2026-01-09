/**
 * useCRMFunnels - Hooks para gerenciar funis e estágios do CRM no Supabase
 * 
 * Diferença entre saved_funnels e crm_funnels:
 * - saved_funnels: Funis visuais de marketing (Construtor de Funil)
 * - crm_funnels: Funis do CRM para gestão de leads (KanbanBoard)
 * 
 * ⚠️ IMPORTANTE: Execute a migration antes de usar:
 * supabase/migrations/20251023000005_create_crm_funnels_tags.sql
 * 
 * NOTA: Tipos do Supabase com bypass temporário
 */

// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useStore, Funnel, FunnelStage } from '@/store/useStore';
import { useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface CRMFunnel {
  id: string;
  owner_id: string;
  name: string;
  is_default: boolean;
  order_index: number;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  stages?: CRMFunnelStage[];
}

interface CRMFunnelStage {
  id: string;
  funnel_id: string;
  name: string;
  color: string;
  order_index: number;
  category?: 'topo' | 'meio' | 'fundo' | 'vendas' | 'perdido';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CreateFunnelInput {
  name: string;
  is_default?: boolean;
}

interface CreateStageInput {
  funnel_id: string;
  name: string;
  color: string;
  order_index: number;
  category?: 'topo' | 'meio' | 'fundo' | 'vendas' | 'perdido';
}

// ============================================================================
// CONVERTER DB ↔ STORE
// ============================================================================

function dbFunnelToStore(dbFunnel: CRMFunnel): Funnel {
  return {
    id: dbFunnel.id,
    name: dbFunnel.name,
    isDefault: dbFunnel.is_default,
    stages: (dbFunnel.stages || []).map(s => ({
      id: s.id,
      name: s.name,
      color: s.color,
      order: s.order_index,
      category: s.category,
    })),
  };
}

function storeFunnelToDb(storeFunnel: Partial<Funnel>): Partial<CRMFunnel> {
  return {
    name: storeFunnel.name,
    is_default: storeFunnel.isDefault,
  };
}

// ============================================================================
// QUERY: Listar Funis
// ============================================================================

export function useCRMFunnels() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['crm_funnels', user?.id],
    queryFn: async () => {
      console.log('[useCRMFunnels] 🔍 Buscando funis do CRM...');

      if (!user?.id) {
        console.log('[useCRMFunnels] ⚠️ Usuário não autenticado');
        return [];
      }

      // Busca funis com seus estágios (filtrado por owner_id)
      const { data: funnels, error: funnelsError } = await (supabase as any)
        .from('crm_funnels')
        .select('*')
        .eq('owner_id', user.id)
        .order('order_index', { ascending: true });

      if (funnelsError) {
        console.error('[useCRMFunnels] ❌ Erro ao buscar funis:', funnelsError);
        throw funnelsError;
      }

      // Busca estágios apenas dos funis do usuário
      const funnelIds = funnels?.map(f => f.id) || [];
      
      if (funnelIds.length === 0) {
        console.log('[useCRMFunnels] ✅ Nenhum funil encontrado');
        return [];
      }

      const { data: stages, error: stagesError } = await (supabase as any)
        .from('crm_funnel_stages')
        .select('*')
        .in('funnel_id', funnelIds)
        .order('order_index', { ascending: true });

      if (stagesError) {
        console.error('[useCRMFunnels] ❌ Erro ao buscar estágios:', stagesError);
        throw stagesError;
      }

      // Combina funis com seus estágios
      const funnelsWithStages = (funnels || []).map(funnel => ({
        ...funnel,
        stages: (stages || []).filter(s => s.funnel_id === funnel.id),
      }));

      console.log('[useCRMFunnels] ✅ Funis carregados:', funnelsWithStages.length);
      return funnelsWithStages as CRMFunnel[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// ============================================================================
// MUTATION: Criar Funil
// ============================================================================

export function useCreateCRMFunnel() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (input: CreateFunnelInput) => {
      console.log('[useCreateCRMFunnel] 📝 Criando funil:', input);

      const { data, error } = await supabase
        .from('crm_funnels' as any)
        .insert([{
          owner_id: user?.id,
          name: input.name,
          is_default: input.is_default || false,
          order_index: 999, // Será reordenado depois
        }])
        .select()
        .single();

      if (error) {
        console.error('[useCreateCRMFunnel] ❌ Erro:', error);
        throw error;
      }

      console.log('[useCreateCRMFunnel] ✅ Funil criado:', data);
      return data as CRMFunnel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_funnels'] });
    },
  });
}

// ============================================================================
// MUTATION: Atualizar Funil
// ============================================================================

export function useUpdateCRMFunnel() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CRMFunnel> }) => {
      console.log('[useUpdateCRMFunnel] 📝 Atualizando funil:', id, updates);

      const { data, error } = await (supabase as any)
        .from('crm_funnels')
        .update(updates)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('[useUpdateCRMFunnel] ❌ Erro:', error);
        throw error;
      }

      console.log('[useUpdateCRMFunnel] ✅ Funil atualizado:', data);
      return data as CRMFunnel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_funnels'] });
    },
  });
}

// ============================================================================
// MUTATION: Deletar Funil
// ============================================================================

export function useDeleteCRMFunnel() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('[useDeleteCRMFunnel] 🗑️ Deletando funil:', id);

      const { error } = await (supabase as any)
        .from('crm_funnels')
        .delete()
        .eq('id', id)
        .eq('owner_id', user?.id);

      if (error) {
        console.error('[useDeleteCRMFunnel] ❌ Erro:', error);
        throw error;
      }

      console.log('[useDeleteCRMFunnel] ✅ Funil deletado');
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_funnels'] });
    },
  });
}

// ============================================================================
// MUTATION: Criar Estágio
// ============================================================================

export function useCreateCRMStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStageInput) => {
      console.log('[useCreateCRMStage] 📝 Criando estágio:', input);

      const { data, error } = await (supabase as any)
        .from('crm_funnel_stages')
        .insert([input])
        .select()
        .single();

      if (error) {
        console.error('[useCreateCRMStage] ❌ Erro:', error);
        throw error;
      }

      console.log('[useCreateCRMStage] ✅ Estágio criado:', data);
      return data as CRMFunnelStage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_funnels'] });
    },
  });
}

// ============================================================================
// MUTATION: Atualizar Estágio
// ============================================================================

export function useUpdateCRMStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CRMFunnelStage> }) => {
      console.log('[useUpdateCRMStage] 📝 Atualizando estágio:', id, updates);

      const { data, error } = await (supabase as any)
        .from('crm_funnel_stages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useUpdateCRMStage] ❌ Erro:', error);
        throw error;
      }

      console.log('[useUpdateCRMStage] ✅ Estágio atualizado:', data);
      return data as CRMFunnelStage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_funnels'] });
    },
  });
}

// ============================================================================
// MUTATION: Deletar Estágio
// ============================================================================

export function useDeleteCRMStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('[useDeleteCRMStage] 🗑️ Deletando estágio:', id);

      const { error } = await (supabase as any)
        .from('crm_funnel_stages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useDeleteCRMStage] ❌ Erro:', error);
        throw error;
      }

      console.log('[useDeleteCRMStage] ✅ Estágio deletado');
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_funnels'] });
    },
  });
}

// ============================================================================
// HOOK: Sincronizar Supabase ↔ Zustand Store
// ============================================================================

export function useSyncCRMFunnelsToStore() {
  const { data: dbFunnels, isLoading } = useCRMFunnels();
  const { funnels: storeFunnels, addFunnel, updateFunnel, deleteFunnel } = useStore();

  useEffect(() => {
    if (!dbFunnels || isLoading) return;

    console.log('[useSyncCRMFunnelsToStore] 🔄 Sincronizando funis do DB para Store...');
    
    // Converte funis do DB para formato do Store
    const convertedFunnels = dbFunnels.map(dbFunnelToStore);

    // Se o usuário já tem funis no DB, remove os funis mockados
    if (convertedFunnels.length > 0) {
      const mockFunnels = storeFunnels.filter(f => f.id.startsWith('mock-'));
      mockFunnels.forEach(mockFunnel => {
        console.log('[useSyncCRMFunnelsToStore] 🗑️ Removendo funil mockado (usuário tem funis próprios):', mockFunnel.name);
        deleteFunnel(mockFunnel.id);
      });
    }

    // Atualiza store apenas se houver diferenças
    const dbIds = new Set(convertedFunnels.map(f => f.id));
    const storeIds = new Set(storeFunnels.map(f => f.id));

    // Remove funis que não existem mais no DB (mas não remove funis mockados se não houver funis no DB)
    storeFunnels.forEach(storeFunnel => {
      const isMockFunnel = storeFunnel.id.startsWith('mock-');
      // Remove se: não está no DB, não é mock, OU é mock mas o usuário já tem funis próprios
      if (!dbIds.has(storeFunnel.id) && (!isMockFunnel || convertedFunnels.length > 0)) {
        console.log('[useSyncCRMFunnelsToStore] 🗑️ Removendo funil:', storeFunnel.name);
        deleteFunnel(storeFunnel.id);
      }
    });

    // Adiciona/atualiza funis do DB
    convertedFunnels.forEach(dbFunnel => {
      if (!storeIds.has(dbFunnel.id)) {
        console.log('[useSyncCRMFunnelsToStore] ➕ Adicionando funil:', dbFunnel.name);
        addFunnel(dbFunnel);
      } else {
        // Verifica se precisa atualizar
        const storeFunnel = storeFunnels.find(f => f.id === dbFunnel.id);
        if (storeFunnel && JSON.stringify(storeFunnel) !== JSON.stringify(dbFunnel)) {
          console.log('[useSyncCRMFunnelsToStore] 🔄 Atualizando funil:', dbFunnel.name);
          updateFunnel(dbFunnel.id, dbFunnel);
        }
      }
    });

    console.log('[useSyncCRMFunnelsToStore] ✅ Sincronização completa');
  }, [dbFunnels, isLoading]);
}
