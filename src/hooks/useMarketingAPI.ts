/**
 * ============================================================================
 * HOOKS: Marketing Solutions API
 * ============================================================================
 * Hooks React Query para gerenciar todos os recursos de Marketing
 * 
 * Recursos:
 * - Campanhas
 * - Funis de conversão
 * - Landing Pages
 * - Testes A/B
 * - Branding
 * - Segmentos de Leads
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

const supabaseClient: any = supabase as any;

// ============================================================================
// TYPES - Alinhados com o banco de dados Supabase (snake_case)
// ============================================================================

// Interface para o banco (snake_case)
export interface CampaignDB {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'social' | 'ads' | 'content' | 'events' | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  leads_generated?: number;
  revenue?: number;
  target_audience?: any[];
  channels?: any[];
  goals?: any[];
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipo para uso no frontend (compatível com Marketing.ts)
export type Campaign = CampaignDB;

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  type: 'sales' | 'lead_generation' | 'awareness' | 'engagement' | 'retention';
  status: 'draft' | 'active' | 'paused' | 'archived';
  stages: any[];
  automation_rules?: any[];
  triggers?: any[];
  total_entries?: number;
  total_conversions?: number;
  conversion_rate?: number;
  campaign_id?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LandingPage {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  sections: any[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  theme?: any;
  custom_css?: string;
  custom_js?: string;
  analytics_code?: string;
  pixel_code?: string;
  views?: number;
  unique_visitors?: number;
  conversions?: number;
  conversion_rate?: number;
  funnel_id?: string;
  campaign_id?: string;
  owner_id?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  hypothesis?: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  test_type: 'landing_page' | 'email' | 'ad' | 'cta' | 'headline' | 'other';
  traffic_split?: any;
  variants: any[];
  start_date?: string;
  end_date?: string;
  total_participants?: number;
  confidence_level?: number;
  winner_variant?: string;
  landing_page_id?: string;
  campaign_id?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BrandSettings {
  id: string;
  company_name: string;
  tagline?: string;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  text_color?: string;
  background_color?: string;
  font_heading?: string;
  font_body?: string;
  logo_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  og_image_url?: string;
  cover_image_url?: string;
  social_links?: any;
  email?: string;
  phone?: string;
  address?: any;
  custom_domain?: string;
  custom_styles?: any;
  owner_id?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LeadSegment {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  type: 'manual' | 'dynamic' | 'smart';
  rules?: any[];
  lead_ids?: string[];
  lead_count?: number;
  active_count?: number;
  conversion_rate?: number;
  campaign_id?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// 1. CAMPANHAS
// ============================================================================

export function useCampaigns() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['marketing_campaigns', user?.id],
    queryFn: async () => {
      console.log('[useCampaigns] 🔍 Buscando campanhas...');
      
      const { data, error } = await supabaseClient
        .from('marketing_campaigns')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useCampaigns] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useCampaigns] ✅ Campanhas:', data?.length);
      return (data || []) as Campaign[];
    },
    enabled: !!user,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (campaign: Partial<Campaign>) => {
      console.log('[useCreateCampaign] 📝 Criando campanha:', campaign);
      
      // Remover campos que não devem ser enviados
      const { id, created_at, updated_at, ...campaignData } = campaign as any;
      
      const { data, error } = await supabaseClient
        .from('marketing_campaigns')
        .insert([{ ...campaignData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateCampaign] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateCampaign] ✅ Criada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
      console.log('[useUpdateCampaign] 📝 Atualizando:', id, updates);
      
      // Remover campos que não devem ser atualizados
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('marketing_campaigns')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select();
      
      if (error) {
        console.error('[useUpdateCampaign] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateCampaign] ✅ Atualizada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('marketing_campaigns')
        .delete()
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] });
    },
  });
}

// ============================================================================
// 2. FUNIS
// ============================================================================

export function useFunnels() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['marketing_funnels', user?.id],
    queryFn: async () => {
      console.log('[useFunnels] 🔍 Buscando funis...');
      
      const { data, error } = await supabaseClient
        .from('marketing_funnels')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useFunnels] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useFunnels] ✅ Funis:', data?.length);
      return (data || []) as Funnel[];
    },
    enabled: !!user,
  });
}

export function useCreateFunnel() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (funnel: Partial<Funnel>) => {
      console.log('[useCreateFunnel] 📝 Criando funil:', funnel);
      
      // Remover campos que não devem ser enviados
      const { id, created_at, updated_at, ...funnelData } = funnel as any;
      
      const { data, error } = await supabaseClient
        .from('marketing_funnels')
        .insert([{ ...funnelData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateFunnel] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateFunnel] ✅ Criado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_funnels'] });
    },
  });
}

export function useUpdateFunnel() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Funnel> }) => {
      console.log('[useUpdateFunnel] 📝 Atualizando:', id, updates);
      
      // Remover campos que não devem ser atualizados
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('marketing_funnels')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select();
      
      if (error) {
        console.error('[useUpdateFunnel] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateFunnel] ✅ Atualizado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_funnels'] });
    },
  });
}

export function useDeleteFunnel() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('marketing_funnels')
        .delete()
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_funnels'] });
    },
  });
}

// ============================================================================
// 3. LANDING PAGES
// ============================================================================

export function useLandingPages() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['landing_pages', user?.id],
    queryFn: async () => {
      console.log('[useLandingPages] 🔍 Buscando landing pages...');
      
      const { data, error } = await supabaseClient
        .from('landing_pages')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useLandingPages] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useLandingPages] ✅ Landing pages:', data?.length);
      return (data || []) as LandingPage[];
    },
    enabled: !!user,
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (page: Partial<LandingPage>) => {
      console.log('[useCreateLandingPage] 📝 Criando landing page:', page);
      
      // Remover campos que não devem ser enviados
      const { id, created_at, updated_at, ...pageData } = page as any;
      
      const { data, error } = await supabaseClient
        .from('landing_pages')
        .insert([{ ...pageData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateLandingPage] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateLandingPage] ✅ Criada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing_pages'] });
    },
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LandingPage> }) => {
      console.log('[useUpdateLandingPage] 📝 Atualizando:', id, updates);
      
      // Remover campos que não devem ser atualizados
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('landing_pages')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select();
      
      if (error) {
        console.error('[useUpdateLandingPage] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateLandingPage] ✅ Atualizada:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing_pages'] });
    },
  });
}

export function useDeleteLandingPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('landing_pages')
        .delete()
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing_pages'] });
    },
  });
}

// ============================================================================
// 4. TESTES A/B
// ============================================================================

export function useABTests() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['ab_tests', user?.id],
    queryFn: async () => {
      console.log('[useABTests] 🔍 Buscando testes A/B...');
      
      const { data, error } = await supabaseClient
        .from('ab_tests')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useABTests] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useABTests] ✅ Testes:', data?.length);
      return (data || []) as ABTest[];
    },
    enabled: !!user,
  });
}

export function useCreateABTest() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (test: Partial<ABTest>) => {
      console.log('[useCreateABTest] 📝 Criando teste A/B:', test);
      
      // Remover campos que não devem ser enviados
      const { id, created_at, updated_at, ...testData } = test as any;
      
      const { data, error } = await supabaseClient
        .from('ab_tests')
        .insert([{ ...testData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateABTest] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateABTest] ✅ Criado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ab_tests'] });
    },
  });
}

export function useUpdateABTest() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ABTest> }) => {
      console.log('[useUpdateABTest] 📝 Atualizando:', id, updates);
      
      // Remover campos que não devem ser atualizados
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('ab_tests')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select();
      
      if (error) {
        console.error('[useUpdateABTest] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateABTest] ✅ Atualizado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ab_tests'] });
    },
  });
}

// ============================================================================
// 5. BRANDING
// ============================================================================

export function useBrandSettings() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['brand_settings', user?.id],
    queryFn: async () => {
      console.log('[useBrandSettings] 🔍 Buscando configurações de marca...');
      
      const { data, error } = await supabaseClient
        .from('brand_settings')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('[useBrandSettings] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useBrandSettings] ✅ Brand settings:', data?.[0]);
      return data?.[0] as BrandSettings | null;
    },
    enabled: !!user,
  });
}

export function useCreateBrandSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (settings: Partial<BrandSettings>) => {
      console.log('[useCreateBrandSettings] 📝 Criando configurações:', settings);
      
      // Remover campos que não devem ser enviados
      const { id, created_at, updated_at, ...settingsData } = settings as any;
      
      const { data, error } = await supabaseClient
        .from('brand_settings')
        .insert([{ ...settingsData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateBrandSettings] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateBrandSettings] ✅ Criado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand_settings'] });
    },
  });
}

export function useUpdateBrandSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BrandSettings> }) => {
      console.log('[useUpdateBrandSettings] 📝 Atualizando:', id, updates);
      
      // Remover campos que não devem ser atualizados
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('brand_settings')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select();
      
      if (error) {
        console.error('[useUpdateBrandSettings] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateBrandSettings] ✅ Atualizado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand_settings'] });
    },
  });
}

// ============================================================================
// 6. SEGMENTOS DE LEADS
// ============================================================================

export function useLeadSegments() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['lead_segments', user?.id],
    queryFn: async () => {
      console.log('[useLeadSegments] 🔍 Buscando segmentos...');
      
      const { data, error } = await supabaseClient
        .from('lead_segments')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false});
      
      if (error) {
        console.error('[useLeadSegments] ❌ Erro:', error);
        throw new Error(error.message);
      }
      
      console.log('[useLeadSegments] ✅ Segmentos:', data?.length);
      return (data || []) as LeadSegment[];
    },
    enabled: !!user,
  });
}

export function useCreateLeadSegment() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (segment: Partial<LeadSegment>) => {
      console.log('[useCreateLeadSegment] 📝 Criando segmento:', segment);
      
      // Remover campos que não devem ser enviados
      const { id, created_at, updated_at, ...segmentData } = segment as any;
      
      const { data, error } = await supabaseClient
        .from('lead_segments')
        .insert([{ ...segmentData, owner_id: user?.id }])
        .select();
      
      if (error) {
        console.error('[useCreateLeadSegment] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useCreateLeadSegment] ✅ Criado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_segments'] });
    },
  });
}

export function useUpdateLeadSegment() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LeadSegment> }) => {
      console.log('[useUpdateLeadSegment] 📝 Atualizando:', id, updates);
      
      // Remover campos que não devem ser atualizados
      const { id: _, created_at, updated_at, owner_id, ...updateData } = updates as any;
      
      const { data, error } = await supabaseClient
        .from('lead_segments')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select();
      
      if (error) {
        console.error('[useUpdateLeadSegment] ❌ Erro:', error);
        throw new Error(error.message);
      }
      console.log('[useUpdateLeadSegment] ✅ Atualizado:', data);
      return data && data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_segments'] });
    },
  });
}

export function useDeleteLeadSegment() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('lead_segments')
        .delete()
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw new Error(error.message);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_segments'] });
    },
  });
}

// ============================================================================
// MARKETING TASKS - Tarefas de Marketing
// ============================================================================

export interface MarketingTaskDB {
  id?: string;
  title: string;
  description?: string | null;
  type: 'content' | 'campaign' | 'social' | 'email' | 'ads' | 'seo' | 'design' | 'other'; // Valores do banco
  status: 'todo' | 'doing' | 'done' | 'blocked'; // Valores do banco de dados
  priority: 'baixa' | 'media' | 'alta' | 'urgente'; // Valores do banco de dados
  campaign_id?: string | null;
  assigned_to?: string | null;
  due_date?: string | null;
  // due_time removido - não existe na tabela marketing_tasks
  completed_at?: string | null;
  checklist?: any[] | null;
  tags?: string[] | null;
  category?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

// GET - Buscar todas as tarefas de marketing
export function useMarketingTasks(filters?: any) {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['marketing_tasks', filters],
    queryFn: async () => {
      let query = supabaseClient
        .from('marketing_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtrar por owner se usuário logado
      if (user?.id && !filters?.allUsers) {
        query = query.eq('owner_id', user.id);
      }

      // Aplicar filtros adicionais
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.campaign_id) {
        query = query.eq('campaign_id', filters.campaign_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar tarefas de marketing:', error);
        throw new Error(error.message);
      }

      console.log('✅ Tarefas de marketing carregadas:', data?.length);
      return data || [];
    },
    enabled: !!user,
  });
}

// POST - Criar nova tarefa de marketing
export function useCreateMarketingTask() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (taskData: Partial<MarketingTaskDB>) => {
      console.log('📝 Criando tarefa de marketing:', taskData);
      
      // Remover campos que não devem ser enviados no INSERT
      const { id, created_at, updated_at, ...dataToInsert } = taskData;

      // Remover campos undefined e null
      const cleanData = Object.entries(dataToInsert).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const insertData = {
        ...cleanData,
        owner_id: user?.id,
      };

      console.log('🔍 Dados que serão enviados:', insertData);
      console.log('🔍 Campos:', Object.keys(insertData));
      console.log('🔍 Valores de cada campo:', JSON.stringify(insertData, null, 2));

      const { data, error } = await supabaseClient
        .from('marketing_tasks')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar tarefa de marketing:', error);
        console.error('❌ ERROR MESSAGE:', error.message);
        console.error('❌ ERROR DETAILS:', error.details);
        console.error('❌ ERROR HINT:', error.hint);
        console.error('❌ ERROR CODE:', error.code);
        console.error('❌ Detalhes completos:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        console.error('❌ Dados que causaram erro:', JSON.stringify(insertData, null, 2));
        
        // Mostrar mensagem mais clara
        alert(`Erro ao criar task: ${error.message}\nDetalhes: ${error.details || 'N/A'}\nHint: ${error.hint || 'N/A'}`);
        
        throw new Error(error.message);
      }

      console.log('✅ Tarefa de marketing criada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_tasks'] });
    },
  });
}

// PUT - Atualizar tarefa de marketing existente
export function useUpdateMarketingTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...taskData }: Partial<MarketingTaskDB> & { id: string }) => {
      console.log('📝 Atualizando tarefa de marketing:', id, taskData);
      
      // Remover campos que não devem ser atualizados
      const { created_at, updated_at, owner_id, ...dataToUpdate } = taskData;

      const { data, error } = await supabaseClient
        .from('marketing_tasks')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar tarefa de marketing:', error);
        throw new Error(error.message);
      }

      console.log('✅ Tarefa de marketing atualizada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_tasks'] });
    },
  });
}

// DELETE - Deletar tarefa de marketing
export function useDeleteMarketingTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando tarefa de marketing:', id);
      
      const { error } = await supabaseClient
        .from('marketing_tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Erro ao deletar tarefa de marketing:', error);
        throw new Error(error.message);
      }

      console.log('✅ Tarefa de marketing deletada');
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_tasks'] });
    },
  });
}
