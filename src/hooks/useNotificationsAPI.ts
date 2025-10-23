/**
 * ============================================================================
 * HOOKS: Notifications API
 * ============================================================================
 * Hooks React Query para gerenciar notificações do usuário
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

const supabaseClient: any = supabase as any;

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: 
    | 'task_assigned'
    | 'task_completed'
    | 'task_due_soon'
    | 'task_overdue'
    | 'lead_updated'
    | 'lead_assigned'
    | 'activity_created'
    | 'message_received'
    | 'campaign_launched'
    | 'campaign_ended'
    | 'deal_won'
    | 'deal_lost'
    | 'project_milestone'
    | 'mention'
    | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  link?: string;
  is_read: boolean;
  is_archived: boolean;
  related_type?: 'task' | 'marketing_task' | 'lead' | 'activity' | 'message' | 'campaign' | 'deal' | 'project';
  related_id?: string;
  created_at: string;
  read_at?: string;
  archived_at?: string;
}

// ============================================================================
// GET - Buscar notificações do usuário
// ============================================================================

export function useNotifications(filters?: {
  unreadOnly?: boolean;
  type?: string;
  limit?: number;
}) {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['notifications', user?.id, filters],
    queryFn: async () => {
      console.log('[useNotifications] 🔔 Buscando notificações...');
      
      let query = supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (filters?.unreadOnly) {
        query = query.eq('is_read', false);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useNotifications] ❌ Erro:', error);
        throw new Error(error.message);
      }

      console.log('[useNotifications] ✅ Notificações carregadas:', data?.length);
      return data || [];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });
}

// ============================================================================
// GET - Contar notificações não lidas
// ============================================================================

export function useUnreadCount() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['notifications', 'unread-count', user?.id],
    queryFn: async () => {
      const { count, error } = await supabaseClient
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('is_read', false)
        .eq('is_archived', false);

      if (error) {
        console.error('[useUnreadCount] ❌ Erro:', error);
        throw new Error(error.message);
      }

      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });
}

// ============================================================================
// PUT - Marcar notificação como lida
// ============================================================================

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('[useMarkAsRead] 👁️ Marcando como lida:', notificationId);
      
      const { data, error } = await supabaseClient
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        console.error('[useMarkAsRead] ❌ Erro:', error);
        throw new Error(error.message);
      }

      console.log('[useMarkAsRead] ✅ Marcada como lida');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============================================================================
// PUT - Marcar todas como lidas
// ============================================================================

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      console.log('[useMarkAllAsRead] 👁️ Marcando todas como lidas');
      
      const { error } = await supabaseClient
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) {
        console.error('[useMarkAllAsRead] ❌ Erro:', error);
        throw new Error(error.message);
      }

      console.log('[useMarkAllAsRead] ✅ Todas marcadas como lidas');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============================================================================
// PUT - Arquivar notificação
// ============================================================================

export function useArchiveNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('[useArchiveNotification] 📦 Arquivando:', notificationId);
      
      const { data, error } = await supabaseClient
        .from('notifications')
        .update({ 
          is_archived: true,
          archived_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        console.error('[useArchiveNotification] ❌ Erro:', error);
        throw new Error(error.message);
      }

      console.log('[useArchiveNotification] ✅ Arquivada');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============================================================================
// DELETE - Deletar notificação
// ============================================================================

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('[useDeleteNotification] 🗑️ Deletando:', notificationId);
      
      const { error } = await supabaseClient
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('[useDeleteNotification] ❌ Erro:', error);
        throw new Error(error.message);
      }

      console.log('[useDeleteNotification] ✅ Deletada');
      return { id: notificationId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============================================================================
// POST - Criar notificação manual (admin/system)
// ============================================================================

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read' | 'is_archived'>) => {
      console.log('[useCreateNotification] 📬 Criando notificação:', notification);
      
      const { data, error } = await supabaseClient
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) {
        console.error('[useCreateNotification] ❌ Erro:', error);
        throw new Error(error.message);
      }

      console.log('[useCreateNotification] ✅ Criada');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
