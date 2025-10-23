/**
 * ==========================================================================
 * ⚙️ OPERATIONAL PROCESSES API - React Query Hooks
 * ==========================================================================
 * Hook completo para gerenciamento de Processos Operacionais
 * Integração com Supabase + React Query v5
 * 
 * NOTA: Tipos do Supabase com bypass temporário
 * ==========================================================================
 */

// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

// ============================================================================
// ðŸ“‹ TYPES & INTERFACES
// ============================================================================

export interface ProcessStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  responsible?: string;
  estimated_hours?: number;
}

export interface ProcessMetrics {
  avg_time_hours?: number;
  success_rate?: number;
  executions_count?: number;
  last_execution?: string;
}

export interface OperationalProcess {
  id: string;
  name: string;
  description?: string;
  category: 'vendas' | 'marketing' | 'cs' | 'financeiro' | 'operacoes' | 'rh' | 'ti' | 'outro';
  status: 'ativo' | 'em-revisao' | 'pausado' | 'desativado';
  steps?: ProcessStep[];
  responsible?: string;
  team_members?: string[];
  sla_hours?: number;
  automation_level?: 'manual' | 'semi-auto' | 'automatizado';
  last_execution_date?: string;
  metrics?: ProcessMetrics;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// âš™ï¸ CRUD HOOKS
// ============================================================================

/**
 * GET: Lista processos com filtros opcionais
 */
export function useOperationalProcesses(filters?: {
  category?: string;
  status?: string;
  automation_level?: string;
}) {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['operationalProcesses', user?.id, filters],
    queryFn: async () => {
      let query = supabase
        .from('operational_processes')
        .select('*')
        .eq('owner_id', user?.id);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.automation_level) {
        query = query.eq('automation_level', filters.automation_level);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as OperationalProcess[];
    },
    enabled: !!user?.id,
  });
}

/**
 * GET: Busca um processo especÃ­fico por ID
 */
export function useOperationalProcess(id: string) {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['operationalProcess', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operational_processes')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user?.id)
        .single();

      if (error) throw error;
      return data as OperationalProcess;
    },
    enabled: !!user?.id && !!id,
  });
}

/**
 * POST: Cria novo processo
 */
export function useCreateOperationalProcess() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<OperationalProcess>) => {
      const { data: result, error } = await supabase
        .from('operational_processes')
        .insert({ ...data, owner_id: user?.id })
        .select()
        .single();

      if (error) throw error;
      return result as OperationalProcess;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
    },
  });
}

/**
 * PUT: Atualiza processo
 */
export function useUpdateOperationalProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OperationalProcess> }) => {
      const { data: result, error } = await supabase
        .from('operational_processes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as OperationalProcess;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
      queryClient.invalidateQueries({ queryKey: ['operationalProcess', data.id] });
    },
  });
}

/**
 * DELETE: Remove processo
 */
export function useDeleteOperationalProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operational_processes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
    },
  });
}

// ============================================================================
// ðŸŽ¯ FUNCIONALIDADES ESPECÃFICAS
// ============================================================================

/**
 * PUT: Atualiza apenas os passos do processo
 */
export function useUpdateProcessSteps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, steps }: { id: string; steps: ProcessStep[] }) => {
      const { data: result, error } = await supabase
        .from('operational_processes')
        .update({ steps })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as OperationalProcess;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcess', data.id] });
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
    },
  });
}

/**
 * PUT: Atualiza mÃ©tricas do processo
 */
export function useUpdateProcessMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, metrics }: { id: string; metrics: ProcessMetrics }) => {
      const { data: result, error } = await supabase
        .from('operational_processes')
        .update({ metrics })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as OperationalProcess;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcess', data.id] });
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
    },
  });
}

/**
 * PUT: Registra execuÃ§Ã£o do processo
 */
export function useLogProcessExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      execution_time_hours,
      success,
    }: {
      id: string;
      execution_time_hours: number;
      success: boolean;
    }) => {
      // 1. Buscar processo atual
      const { data: process, error: fetchError } = await supabase
        .from('operational_processes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 2. Calcular novas mÃ©tricas
      const currentMetrics = process.metrics || {
        avg_time_hours: 0,
        success_rate: 0,
        executions_count: 0,
      };

      const newExecutionsCount = (currentMetrics.executions_count || 0) + 1;
      const successCount =
        (currentMetrics.executions_count || 0) * (currentMetrics.success_rate || 0) / 100 +
        (success ? 1 : 0);

      const newMetrics: ProcessMetrics = {
        executions_count: newExecutionsCount,
        avg_time_hours:
          ((currentMetrics.avg_time_hours || 0) * (currentMetrics.executions_count || 0) +
            execution_time_hours) /
          newExecutionsCount,
        success_rate: (successCount / newExecutionsCount) * 100,
        last_execution: new Date().toISOString(),
      };

      // 3. Atualizar processo
      const { data: result, error: updateError } = await supabase
        .from('operational_processes')
        .update({
          metrics: newMetrics,
          last_execution_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return result as OperationalProcess;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcess', data.id] });
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
      queryClient.invalidateQueries({ queryKey: ['processAnalytics'] });
    },
  });
}

/**
 * PUT: Altera status do processo
 */
export function useChangeProcessStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: OperationalProcess['status'];
    }) => {
      const { data: result, error } = await supabase
        .from('operational_processes')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as OperationalProcess;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcess', data.id] });
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
    },
  });
}

/**
 * POST: Duplica processo existente
 */
export function useDuplicateProcess() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (processId: string) => {
      // 1. Buscar processo original
      const { data: original, error: fetchError } = await supabase
        .from('operational_processes')
        .select('*')
        .eq('id', processId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Criar cÃ³pia
      const { data: result, error: createError } = await supabase
        .from('operational_processes')
        .insert({
          name: `${original.name} (CÃ³pia)`,
          description: original.description,
          category: original.category,
          status: 'em-revisao',
          steps: original.steps,
          responsible: original.responsible,
          team_members: original.team_members,
          sla_hours: original.sla_hours,
          automation_level: original.automation_level,
          owner_id: user?.id,
        })
        .select()
        .single();

      if (createError) throw createError;
      return result as OperationalProcess;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operationalProcesses'] });
    },
  });
}

// ============================================================================
// ðŸ“Š ANALYTICS
// ============================================================================

/**
 * GET: EstatÃ­sticas gerais dos processos
 */
export function useProcessAnalytics() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['processAnalytics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operational_processes')
        .select('*')
        .eq('owner_id', user?.id);

      if (error) throw error;

      const processes = data as OperationalProcess[];

      const analytics = {
        // Contadores gerais
        total_processes: processes.length,
        active_processes: processes.filter((p) => p.status === 'ativo').length,
        review_processes: processes.filter((p) => p.status === 'em-revisao').length,
        paused_processes: processes.filter((p) => p.status === 'pausado').length,

        // Por categoria
        by_category: processes.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),

        // Por nÃ­vel de automaÃ§Ã£o
        manual: processes.filter((p) => p.automation_level === 'manual').length,
        semi_auto: processes.filter((p) => p.automation_level === 'semi-auto').length,
        automated: processes.filter((p) => p.automation_level === 'automatizado').length,

        // MÃ©tricas agregadas
        total_executions: processes.reduce(
          (sum, p) => sum + (p.metrics?.executions_count || 0),
          0
        ),
        avg_success_rate:
          processes
            .filter((p) => p.metrics?.success_rate)
            .reduce((sum, p) => sum + (p.metrics?.success_rate || 0), 0) /
            (processes.filter((p) => p.metrics?.success_rate).length || 1) || 0,
        avg_execution_time:
          processes
            .filter((p) => p.metrics?.avg_time_hours)
            .reduce((sum, p) => sum + (p.metrics?.avg_time_hours || 0), 0) /
            (processes.filter((p) => p.metrics?.avg_time_hours).length || 1) || 0,
      };

      return analytics;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // 30s
  });
}

/**
 * GET: Lista processos com SLA vencido ou prÃ³ximo do vencimento
 */
export function useProcessesBySLA() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['processesBySLA', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operational_processes')
        .select('*')
        .eq('owner_id', user?.id)
        .eq('status', 'ativo')
        .not('sla_hours', 'is', null);

      if (error) throw error;

      const processes = data as OperationalProcess[];

      return {
        critical: processes.filter((p) => (p.sla_hours || 0) <= 2),
        warning: processes.filter((p) => (p.sla_hours || 0) > 2 && (p.sla_hours || 0) <= 8),
        normal: processes.filter((p) => (p.sla_hours || 0) > 8),
      };
    },
    enabled: !!user?.id,
  });
}

