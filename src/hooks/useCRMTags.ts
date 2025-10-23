/**
 * useCRMTags - Hooks para gerenciar tags globais no Supabase
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface CRMTag {
  id: string;
  owner_id: string;
  name: string;
  color: string;
  leads_count: number;
  tasks_count: number;
  created_at: string;
  updated_at: string;
}

interface CreateTagInput {
  name: string;
  color?: string;
}

// ============================================================================
// QUERY: Listar Tags
// ============================================================================

export function useCRMTags() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['crm_tags', user?.id],
    queryFn: async () => {
      console.log('[useCRMTags] 🔍 Buscando tags...');

      const { data, error } = await (supabase as any)
        .from('crm_tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('[useCRMTags] ❌ Erro:', error);
        throw error;
      }

      console.log('[useCRMTags] ✅ Tags carregadas:', data?.length);
      return (data || []) as CRMTag[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// ============================================================================
// MUTATION: Criar Tag
// ============================================================================

export function useCreateCRMTag() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (input: CreateTagInput) => {
      console.log('[useCreateCRMTag] 📝 Criando tag:', input);

      const { data, error } = await (supabase as any)
        .from('crm_tags')
        .insert([{
          owner_id: user?.id,
          name: input.name,
          color: input.color || '#6B7280',
          leads_count: 0,
          tasks_count: 0,
        }])
        .select()
        .single();

      if (error) {
        console.error('[useCreateCRMTag] ❌ Erro:', error);
        throw error;
      }

      console.log('[useCreateCRMTag] ✅ Tag criada:', data);
      return data as CRMTag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_tags'] });
    },
  });
}

// ============================================================================
// MUTATION: Atualizar Tag
// ============================================================================

export function useUpdateCRMTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CRMTag> }) => {
      console.log('[useUpdateCRMTag] 📝 Atualizando tag:', id, updates);

      const { data, error } = await (supabase as any)
        .from('crm_tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useUpdateCRMTag] ❌ Erro:', error);
        throw error;
      }

      console.log('[useUpdateCRMTag] ✅ Tag atualizada:', data);
      return data as CRMTag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_tags'] });
    },
  });
}

// ============================================================================
// MUTATION: Deletar Tag
// ============================================================================

export function useDeleteCRMTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('[useDeleteCRMTag] 🗑️ Deletando tag:', id);

      const { error } = await (supabase as any)
        .from('crm_tags')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useDeleteCRMTag] ❌ Erro:', error);
        throw error;
      }

      console.log('[useDeleteCRMTag] ✅ Tag deletada');
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_tags'] });
    },
  });
}

// ============================================================================
// HOOK: Sincronizar Supabase ↔ Zustand Store
// ============================================================================

export function useSyncCRMTagsToStore() {
  const { data: dbTags, isLoading } = useCRMTags();
  const { availableTags, addTag, deleteTag } = useStore();

  useEffect(() => {
    if (!dbTags || isLoading) return;

    console.log('[useSyncCRMTagsToStore] 🔄 Sincronizando tags do DB para Store...');
    
    const dbTagNames = new Set(dbTags.map(t => t.name));
    const storeTagNames = new Set(availableTags);

    // Remove tags que não existem mais no DB
    availableTags.forEach(tag => {
      if (!dbTagNames.has(tag)) {
        console.log('[useSyncCRMTagsToStore] 🗑️ Removendo tag:', tag);
        deleteTag(tag);
      }
    });

    // Adiciona tags do DB
    dbTags.forEach(dbTag => {
      if (!storeTagNames.has(dbTag.name)) {
        console.log('[useSyncCRMTagsToStore] ➕ Adicionando tag:', dbTag.name);
        addTag(dbTag.name);
      }
    });

    console.log('[useSyncCRMTagsToStore] ✅ Sincronização completa');
  }, [dbTags, isLoading]);
}

// ============================================================================
// HOOK: Obter mapa de tags (nome → ID)
// ============================================================================

export function useTagsMap(): Map<string, string> {
  const { data: dbTags } = useCRMTags();
  
  const tagsMap = new Map<string, string>();
  
  if (dbTags) {
    dbTags.forEach(tag => {
      tagsMap.set(tag.name, tag.id);
    });
  }
  
  return tagsMap;
}
