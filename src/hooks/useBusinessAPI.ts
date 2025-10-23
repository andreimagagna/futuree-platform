/**
 * ============================================================================
 * HOOKS: Business Solutions API
 * ============================================================================
 * Hooks React Query para gerenciar todos os recursos de Business
 * 
 * Recursos:
 * - Customer Success
 * - Finanças
 * - Estratégico
 * - Arquivos
 * - Notion Solutions
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

const supabaseClient: any = supabase as any;

// ============================================================================
// TYPES
// ============================================================================

export interface CustomerSuccessMetric {
  id: string;
  customer_id: string;
  metric_type: 'nps' | 'csat' | 'churn_risk' | 'health_score' | 'usage' | 'engagement';
  value: number;
  period: string;
  notes?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceRecord {
  id: string;
  type: 'receita' | 'despesa' | 'investimento';
  category: string;
  amount: number;
  description?: string;
  date: string;
  status: 'pendente' | 'pago' | 'cancelado';
  payment_method?: string;
  reference?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StrategicGoal {
  id: string;
  title: string;
  description?: string;
  type: 'okr' | 'kpi' | 'meta' | 'projeto';
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado';
  start_date?: string;
  end_date?: string;
  progress: number;
  owner_id?: string;
  team_members?: string[];
  metrics?: any;
  created_at?: string;
  updated_at?: string;
}

export interface FileDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  folder?: string;
  tags?: string[];
  shared_with?: string[];
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotionPage {
  id: string;
  title: string;
  content?: any;
  type: 'page' | 'database' | 'doc';
  parent_id?: string;
  tags?: string[];
  shared_with?: string[];
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// 1. CUSTOMER SUCCESS
// ============================================================================

export function useCSMetrics() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['cs_metrics', user?.id],
    queryFn: async () => {
      console.log('[useCSMetrics] 🔍 Buscando métricas de CS...');
      
      const { data, error } = await supabaseClient
        .from('cs_metrics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useCSMetrics] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useCSMetrics] ✅ Métricas:', data?.length);
      return (data || []) as CustomerSuccessMetric[];
    },
    enabled: !!user,
  });
}

export function useCreateCSMetric() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (metric: Partial<CustomerSuccessMetric>) => {
      console.log('[useCreateCSMetric] 📝 Criando métrica:', metric);
      
      const { id, created_at, updated_at, ...metricData } = metric as any;
      
      const { data, error } = await supabaseClient
        .from('cs_metrics')
        .insert([{ ...metricData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateCSMetric] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateCSMetric] ✅ Criada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cs_metrics'] });
    },
  });
}

export function useUpdateCSMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CustomerSuccessMetric> }) => {
      console.log('[useUpdateCSMetric] 📝 Atualizando:', id, updates);
      
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('cs_metrics')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('[useUpdateCSMetric] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateCSMetric] ✅ Atualizada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cs_metrics'] });
    },
  });
}

export function useDeleteCSMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('cs_metrics')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cs_metrics'] });
    },
  });
}

// ============================================================================
// 2. FINANÇAS
// ============================================================================

export function useFinanceRecords() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['finance_records', user?.id],
    queryFn: async () => {
      console.log('[useFinanceRecords] 🔍 Buscando registros financeiros...');
      
      const { data, error } = await supabaseClient
        .from('finance_records')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('[useFinanceRecords] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useFinanceRecords] ✅ Registros:', data?.length);
      return (data || []) as FinanceRecord[];
    },
    enabled: !!user,
  });
}

export function useCreateFinanceRecord() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (record: Partial<FinanceRecord>) => {
      console.log('[useCreateFinanceRecord] 📝 Criando registro:', record);
      
      const { id, created_at, updated_at, ...recordData } = record as any;
      
      const { data, error } = await supabaseClient
        .from('finance_records')
        .insert([{ ...recordData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateFinanceRecord] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateFinanceRecord] ✅ Criado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_records'] });
    },
  });
}

export function useUpdateFinanceRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FinanceRecord> }) => {
      console.log('[useUpdateFinanceRecord] 📝 Atualizando:', id, updates);
      
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('finance_records')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('[useUpdateFinanceRecord] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateFinanceRecord] ✅ Atualizado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_records'] });
    },
  });
}

export function useDeleteFinanceRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('finance_records')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_records'] });
    },
  });
}

// ============================================================================
// 3. ESTRATÉGICO
// ============================================================================

export function useStrategicGoals() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['strategic_goals', user?.id],
    queryFn: async () => {
      console.log('[useStrategicGoals] 🔍 Buscando metas estratégicas...');
      
      const { data, error } = await supabaseClient
        .from('strategic_goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useStrategicGoals] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useStrategicGoals] ✅ Metas:', data?.length);
      return (data || []) as StrategicGoal[];
    },
    enabled: !!user,
  });
}

export function useCreateStrategicGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (goal: Partial<StrategicGoal>) => {
      console.log('[useCreateStrategicGoal] 📝 Criando meta:', goal);
      
      const { id, created_at, updated_at, ...goalData } = goal as any;
      
      const { data, error } = await supabaseClient
        .from('strategic_goals')
        .insert([{ ...goalData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateStrategicGoal] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateStrategicGoal] ✅ Criada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic_goals'] });
    },
  });
}

export function useUpdateStrategicGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StrategicGoal> }) => {
      console.log('[useUpdateStrategicGoal] 📝 Atualizando:', id, updates);
      
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('strategic_goals')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('[useUpdateStrategicGoal] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateStrategicGoal] ✅ Atualizada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic_goals'] });
    },
  });
}

export function useDeleteStrategicGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('strategic_goals')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic_goals'] });
    },
  });
}

// ============================================================================
// 4. DOCUMENTS (ARQUIVOS)
// ============================================================================

export interface Document {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  file_url?: string;
  folder_path?: string;
  parent_folder_id?: string;
  description?: string;
  tags?: string[];
  version?: number;
  is_starred?: boolean;
  is_archived?: boolean;
  shared_with?: string[];
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export function useDocuments(filters?: {
  folder_path?: string;
  parent_folder_id?: string;
  is_starred?: boolean;
  is_archived?: boolean;
  file_type?: string;
}) {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async () => {
      let query = supabaseClient
        .from('documents')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (filters?.folder_path) {
        query = query.eq('folder_path', filters.folder_path);
      }
      if (filters?.parent_folder_id) {
        query = query.eq('parent_folder_id', filters.parent_folder_id);
      }
      if (filters?.is_starred !== undefined) {
        query = query.eq('is_starred', filters.is_starred);
      }
      if (filters?.is_archived !== undefined) {
        query = query.eq('is_archived', filters.is_archived);
      }
      if (filters?.file_type) {
        query = query.eq('file_type', filters.file_type);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      
      console.log('[useDocuments] 📄 Documents carregados:', data?.length);
      return data as Document[];
    },
    enabled: !!user,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (newDocument: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabaseClient
        .from('documents')
        .insert({
          ...newDocument,
          owner_id: user?.id,
          version: 1,
          is_starred: false,
          is_archived: false,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useCreateDocument] ✅ Documento criado:', data);
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Document> & { id: string }) => {
      // Remove campos que não devem ser atualizados
      const { owner_id, created_at, updated_at, ...validUpdates } = updates as any;

      const { data, error } = await supabaseClient
        .from('documents')
        .update(validUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useUpdateDocument] ✅ Documento atualizado:', data);
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      console.log('[useDeleteDocument] ✅ Documento deletado:', id);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useStarDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_starred }: { id: string; is_starred: boolean }) => {
      const { data, error } = await supabaseClient
        .from('documents')
        .update({ is_starred })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useStarDocument] ⭐ Documento favorito atualizado:', data);
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useShareDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, shared_with }: { id: string; shared_with: string[] }) => {
      const { data, error } = await supabaseClient
        .from('documents')
        .update({ shared_with })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useShareDocument] 🔗 Documento compartilhado:', data);
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// ============================================================================
// 5. NOTION PAGES
// ============================================================================

export interface NotionPageDB {
  id: string;
  title: string;
  workspace?: string;
  page_type: 'page' | 'database' | 'doc' | 'wiki';
  blocks?: any; // JSONB
  parent_page_id?: string;
  tags?: string[];
  is_favorite?: boolean;
  shared_with?: string[];
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export function useNotionPages(filters?: {
  workspace?: string;
  page_type?: string;
  is_favorite?: boolean;
  parent_page_id?: string;
}) {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['notion_pages', filters],
    queryFn: async () => {
      let query = supabaseClient
        .from('notion_pages')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (filters?.workspace) {
        query = query.eq('workspace', filters.workspace);
      }
      if (filters?.page_type) {
        query = query.eq('page_type', filters.page_type);
      }
      if (filters?.is_favorite !== undefined) {
        query = query.eq('is_favorite', filters.is_favorite);
      }
      if (filters?.parent_page_id) {
        query = query.eq('parent_page_id', filters.parent_page_id);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      
      console.log('[useNotionPages] 📝 Notion pages carregadas:', data?.length);
      return data as NotionPageDB[];
    },
    enabled: !!user,
  });
}

export function useCreateNotionPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (newPage: Omit<NotionPageDB, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabaseClient
        .from('notion_pages')
        .insert({
          ...newPage,
          owner_id: user?.id,
          is_favorite: false,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useCreateNotionPage] ✅ Notion page criada:', data);
      return data as NotionPageDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
    },
  });
}

export function useUpdateNotionPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NotionPageDB> & { id: string }) => {
      // Remove campos que não devem ser atualizados
      const { owner_id, created_at, updated_at, ...validUpdates } = updates as any;

      const { data, error } = await supabaseClient
        .from('notion_pages')
        .update(validUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useUpdateNotionPage] ✅ Notion page atualizada:', data);
      return data as NotionPageDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
    },
  });
}

export function useDeleteNotionPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('notion_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      console.log('[useDeleteNotionPage] ✅ Notion page deletada:', id);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
    },
  });
}

export function useUpdateNotionBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, blocks }: { id: string; blocks: any }) => {
      const { data, error } = await supabaseClient
        .from('notion_pages')
        .update({ blocks })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useUpdateNotionBlocks] 📝 Blocks atualizados:', data);
      return data as NotionPageDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
    },
  });
}

export function useFavoriteNotionPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_favorite }: { id: string; is_favorite: boolean }) => {
      const { data, error } = await supabaseClient
        .from('notion_pages')
        .update({ is_favorite })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      console.log('[useFavoriteNotionPage] ⭐ Favorito atualizado:', data);
      return data as NotionPageDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
    },
  });
}
