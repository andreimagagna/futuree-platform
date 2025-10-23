/**
 * ==========================================================================
 * 🎨 CREATOR SOLUTIONS API - React Query Hooks
 * ==========================================================================
 * Hook completo para todas as funcionalidades de Creator Solutions
 * Integração com Supabase + React Query v5
 * 
 * NOTA: Os tipos do Supabase precisam ser gerados. Por enquanto, usando
 * type assertions para bypass de erros de tipagem.
 * ==========================================================================
 */

// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

// ============================================================================
// ðŸ“‹ TYPES & INTERFACES
// ============================================================================

// Creator Identity
export interface CreatorIdentity {
  id: string;
  name: string;
  niche: string;
  bio?: string;
  target_audience?: string[];
  objectives?: {
    attraction?: boolean;
    authority?: boolean;
    engagement?: boolean;
    conversion?: boolean;
  };
  tone_of_voice?: string;
  avatar_url?: string;
  banner_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Content Pillar
export interface ContentPillar {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  objective?: 'attraction' | 'authority' | 'engagement' | 'conversion';
  target_audience?: string;
  key_topics?: string[];
  content_count?: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Editorial Calendar
export interface EditorialContent {
  id: string;
  title: string;
  pillar_id?: string;
  platform?: 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'blog' | 'twitter' | 'facebook';
  format?: 'post' | 'reel' | 'video' | 'article' | 'story' | 'carousel' | 'podcast';
  scheduled_date?: string;
  published_date?: string;
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
  content_text?: string;
  media_urls?: string[];
  hashtags?: string[];
  storytelling?: {
    hook?: string;
    story?: string;
    value?: string;
    cta?: string;
  };
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    reach?: number;
    engagement_rate?: number;
  };
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Content Idea
export interface ContentIdea {
  id: string;
  title: string;
  description?: string;
  pillar_id?: string;
  platform?: string;
  format?: string;
  status?: 'idea' | 'in-progress' | 'scheduled' | 'published' | 'archived';
  priority?: 'alta' | 'media' | 'baixa';
  inspiration_source?: string;
  notes?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Storytelling Template
export interface StorytellingTemplate {
  id: string;
  name: string;
  description?: string;
  structure: {
    hook?: string;
    story?: string;
    value?: string;
    cta?: string;
  };
  use_case?: string;
  is_default?: boolean;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

// Brand Settings
export interface BrandSettings {
  id: string;
  company_name?: string;
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
  social_links?: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  custom_domain?: string;
  custom_styles?: any;
  owner_id: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ðŸŽ¨ 1. CREATOR IDENTITY HOOKS
// ============================================================================

/**
 * GET: Busca identidade do creator (Ãºnico por usuÃ¡rio)
 */
export function useCreatorIdentity() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['creatorIdentity', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_identity')
        .select('*')
        .eq('owner_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('[useCreatorIdentity] Error:', error);
        throw error;
      }
      return data as CreatorIdentity | null;
    },
    enabled: !!user?.id,
  });
}

/**
 * POST/PUT: Cria ou atualiza identidade (upsert)
 */
export function useUpsertCreatorIdentity() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<CreatorIdentity>) => {
      const payload = { ...data, owner_id: user?.id };

      const { data: result, error } = await supabase
        .from('creator_identity')
        .upsert(payload as any, { onConflict: 'owner_id' })
        .select()
        .single();

      if (error) throw error;
      return result as CreatorIdentity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorIdentity'] });
    },
  });
}

// ============================================================================
// ðŸŽ¯ 2. CONTENT PILLARS HOOKS
// ============================================================================

/**
 * GET: Lista todos os pilares
 */
export function useContentPillars() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['contentPillars', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_pillars')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[useContentPillars] Error:', error);
        throw error;
      }
      return data as ContentPillar[];
    },
    enabled: !!user?.id,
  });
}

/**
 * POST: Cria novo pilar
 */
export function useCreateContentPillar() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<ContentPillar>) => {
      const { data: result, error } = await supabase
        .from('content_pillars')
        .insert({ ...data, owner_id: user?.id } as any)
        .select()
        .single();

      if (error) throw error;
      return result as ContentPillar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
    },
  });
}

/**
 * PUT: Atualiza pilar
 */
export function useUpdateContentPillar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentPillar> }) => {
      const updateData: any = data;
      const { data: result, error } = await supabase
        .from('content_pillars')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as ContentPillar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
    },
  });
}

/**
 * DELETE: Remove pilar
 */
export function useDeleteContentPillar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_pillars')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
      queryClient.invalidateQueries({ queryKey: ['editorialCalendar'] });
    },
  });
}

// ============================================================================
// ðŸ“… 3. EDITORIAL CALENDAR HOOKS
// ============================================================================

/**
 * GET: Lista conteÃºdos do calendÃ¡rio (com filtros opcionais)
 */
export function useEditorialCalendar(filters?: {
  status?: string;
  platform?: string;
  pillar_id?: string;
}) {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['editorialCalendar', user?.id, filters],
    queryFn: async () => {
      let query = supabase
        .from('editorial_calendar')
        .select('*')
        .eq('owner_id', user?.id);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }
      if (filters?.pillar_id) {
        query = query.eq('pillar_id', filters.pillar_id);
      }

      const { data, error } = await query.order('scheduled_date', { ascending: true });

      if (error) {
        console.error('[useEditorialCalendar] Error:', error);
        throw error;
      }
      return data as EditorialContent[];
    },
    enabled: !!user?.id,
  });
}

/**
 * POST: Cria novo conteÃºdo no calendÃ¡rio
 */
export function useCreateEditorialContent() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<EditorialContent>) => {
      const { data: result, error } = await supabase
        .from('editorial_calendar')
        .insert({ ...data, owner_id: user?.id } as any)
        .select()
        .single();

      if (error) throw error;
      return result as EditorialContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorialCalendar'] });
    },
  });
}

/**
 * PUT: Atualiza conteÃºdo
 */
export function useUpdateEditorialContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EditorialContent> }) => {
      const { data: result, error } = await supabase
        .from('editorial_calendar')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as EditorialContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorialCalendar'] });
    },
  });
}

/**
 * DELETE: Remove conteÃºdo
 */
export function useDeleteEditorialContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('editorial_calendar')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorialCalendar'] });
    },
  });
}

/**
 * PUT: Atualiza mÃ©tricas de um conteÃºdo publicado
 */
export function useUpdateContentMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, metrics }: { id: string; metrics: EditorialContent['metrics'] }) => {
      const { data: result, error } = await supabase
        .from('editorial_calendar')
        .update({ metrics } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as EditorialContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorialCalendar'] });
    },
  });
}

// ============================================================================
// ðŸ’¡ 4. CONTENT IDEAS HOOKS
// ============================================================================

/**
 * GET: Lista ideias de conteÃºdo
 */
export function useContentIdeas(filters?: { status?: string; pillar_id?: string }) {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['contentIdeas', user?.id, filters],
    queryFn: async () => {
      let query = supabase
        .from('content_ideas')
        .select('*')
        .eq('owner_id', user?.id);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.pillar_id) {
        query = query.eq('pillar_id', filters.pillar_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('[useContentIdeas] Error:', error);
        throw error;
      }
      return data as ContentIdea[];
    },
    enabled: !!user?.id,
  });
}

/**
 * POST: Cria nova ideia
 */
export function useCreateContentIdea() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<ContentIdea>) => {
      const { data: result, error } = await supabase
        .from('content_ideas')
        .insert({ ...data, owner_id: user?.id } as any)
        .select()
        .single();

      if (error) throw error;
      return result as ContentIdea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentIdeas'] });
    },
  });
}

/**
 * PUT: Atualiza ideia
 */
export function useUpdateContentIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentIdea> }) => {
      const { data: result, error } = await supabase
        .from('content_ideas')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as ContentIdea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentIdeas'] });
    },
  });
}

/**
 * DELETE: Remove ideia
 */
export function useDeleteContentIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentIdeas'] });
    },
  });
}

/**
 * POST: Move ideia para o calendÃ¡rio editorial
 */
export function useMoveIdeaToCalendar() {
  const queryClient = useQueryClient();
  const createContent = useCreateEditorialContent();
  const updateIdea = useUpdateContentIdea();

  return useMutation({
    mutationFn: async ({
      ideaId,
      scheduledDate,
      additionalData,
    }: {
      ideaId: string;
      scheduledDate: string;
      additionalData?: Partial<EditorialContent>;
    }) => {
      // 1. Buscar ideia
      const { data: idea, error: ideaError } = await supabase
        .from('content_ideas')
        .select('*')
        .eq('id', ideaId)
        .single();

      if (ideaError) throw ideaError;

      // 2. Criar no calendÃ¡rio
      const calendarData: Partial<EditorialContent> = {
        title: idea.title,
        pillar_id: idea.pillar_id,
        platform: idea.platform as any,
        format: idea.format as any,
        scheduled_date: scheduledDate,
        status: 'scheduled',
        ...additionalData,
      };

      await createContent.mutateAsync(calendarData);

      // 3. Atualizar status da ideia
      await updateIdea.mutateAsync({
        id: ideaId,
        data: { status: 'scheduled' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['editorialCalendar'] });
    },
  });
}

// ============================================================================
// ðŸ“ 5. STORYTELLING TEMPLATES HOOKS
// ============================================================================

/**
 * GET: Lista templates (prÃ³prios + defaults do sistema)
 */
export function useStorytellingTemplates() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['storytellingTemplates', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('storytelling_templates')
        .select('*')
        .or(`owner_id.eq.${user?.id},is_default.eq.true`)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StorytellingTemplate[];
    },
    enabled: !!user?.id,
  });
}

/**
 * POST: Cria novo template
 */
export function useCreateStorytellingTemplate() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<StorytellingTemplate>) => {
      const { data: result, error } = await supabase
        .from('storytelling_templates')
        .insert({ ...data, owner_id: user?.id } as any)
        .select()
        .single();

      if (error) throw error;
      return result as StorytellingTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storytellingTemplates'] });
    },
  });
}

/**
 * PUT: Atualiza template
 */
export function useUpdateStorytellingTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StorytellingTemplate> }) => {
      const { data: result, error } = await supabase
        .from('storytelling_templates')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as StorytellingTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storytellingTemplates'] });
    },
  });
}

/**
 * DELETE: Remove template
 */
export function useDeleteStorytellingTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('storytelling_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storytellingTemplates'] });
    },
  });
}

/**
 * POST: Gera conteÃºdo a partir de um template
 */
export function useGenerateFromTemplate() {
  return useMutation({
    mutationFn: async ({
      templateId,
      customData,
    }: {
      templateId: string;
      customData?: Record<string, string>;
    }) => {
      // 1. Buscar template
      const { data: template, error } = await supabase
        .from('storytelling_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;

      // 2. Gerar conteÃºdo baseado no template
      const generated = { ...template.structure };

      // Substituir variÃ¡veis se houver customData
      if (customData) {
        Object.keys(generated).forEach((key) => {
          let text = generated[key];
          Object.entries(customData).forEach(([variable, value]) => {
            text = text.replace(new RegExp(`{${variable}}`, 'g'), value);
          });
          generated[key] = text;
        });
      }

      return { template, generated };
    },
  });
}

// ============================================================================
// ðŸ“Š 6. ANALYTICS & METRICS
// ============================================================================

/**
 * GET: EstatÃ­sticas gerais do creator
 */
export function useCreatorAnalytics() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['creatorAnalytics', user?.id],
    queryFn: async () => {
      // Buscar todas as tabelas em paralelo
      const [pillars, calendar, ideas, identity] = await Promise.all([
        supabase.from('content_pillars').select('*').eq('owner_id', user?.id),
        supabase.from('editorial_calendar').select('*').eq('owner_id', user?.id),
        supabase.from('content_ideas').select('*').eq('owner_id', user?.id),
        supabase.from('creator_identity').select('*').eq('owner_id', user?.id).maybeSingle(),
      ]);

      const analytics = {
        // Pilares
        total_pillars: pillars.data?.length || 0,

        // Calendário
        total_content: calendar.data?.length || 0,
        published_content: (calendar.data as any)?.filter((c: any) => c.status === 'published').length || 0,
        scheduled_content: (calendar.data as any)?.filter((c: any) => c.status === 'scheduled').length || 0,
        draft_content: (calendar.data as any)?.filter((c: any) => c.status === 'draft').length || 0,

        // Ideias
        total_ideas: ideas.data?.length || 0,
        ideas_in_progress: (ideas.data as any)?.filter((i: any) => i.status === 'in-progress').length || 0,

        // Métricas agregadas
        total_views: (calendar.data as any)?.reduce((sum: number, c: any) => sum + (c.metrics?.views || 0), 0) || 0,
        total_likes: (calendar.data as any)?.reduce((sum: number, c: any) => sum + (c.metrics?.likes || 0), 0) || 0,
        total_engagement:
          (calendar.data as any)?.reduce(
            (sum: number, c: any) =>
              sum +
              (c.metrics?.likes || 0) +
              (c.metrics?.comments || 0) +
              (c.metrics?.shares || 0),
            0
          ) || 0,

        // Identidade
        has_identity: !!identity.data,
      };

      return analytics;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // 30s
  });
}

// ============================================================================
// 🎨 6. BRAND SETTINGS HOOKS
// ============================================================================

/**
 * GET: Busca configurações de marca (único por usuário)
 */
export function useBrandSettings() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['brandSettings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('owner_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('[useBrandSettings] Error:', error);
        throw error;
      }
      return data as BrandSettings | null;
    },
    enabled: !!user?.id,
  });
}

/**
 * POST/PUT: Cria ou atualiza configurações de marca (upsert)
 */
export function useUpsertBrandSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<BrandSettings>) => {
      const payload = {
        ...data,
        owner_id: user?.id,
      };

      const { data: result, error } = await supabase
        .from('brand_settings')
        .upsert(payload as any, { onConflict: 'owner_id' })
        .select()
        .single();

      if (error) throw error;
      return result as BrandSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandSettings'] });
    },
  });
}

/**
 * PUT: Atualiza configurações de marca
 */
export function useUpdateBrandSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BrandSettings> }) => {
      const { data: result, error } = await supabase
        .from('brand_settings')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as BrandSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandSettings'] });
    },
  });
}
