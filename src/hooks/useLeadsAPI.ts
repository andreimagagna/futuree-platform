import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
// Ensure Postgrest generics resolve by creating a typed local alias
const supabaseClient = supabase as unknown as SupabaseClient<Database>;
import { useAuthContext } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

// Strongly-typed aliases for the leads table
type LeadRow = Database['public']['Tables']['leads']['Row'];
type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];

export function useLeads() {
  return useQuery<LeadRow[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leads').select('*');
      if (error) {
        console.error('[useLeads] Supabase error', error);
        throw new Error(error.message || 'Error fetching leads from Supabase');
      }
      // map DB rows (english names) to UI-friendly names (Portuguese)
      const mapFromDb = (row: any) => {
        if (!row) return row;
        const out = { ...row };
        if ('name' in row) out.nome = row.name;
        if ('source' in row) out.origem = row.source;
        if ('funnel_stage' in row) out.etapa = row.funnel_stage;
        if ('next_action_date' in row) out.proxima_acao_at = row.next_action_date;
        return out as LeadRow;
      };

      return ((data || []) as any[]).map(mapFromDb) as LeadRow[];
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const mutation = useMutation({
    mutationFn: async (lead: Partial<Record<string, any>>) => {
      // map frontend fields (Portuguese) to DB column names (English)
      const mapToDb = (input: Record<string, any>) => {
        const out: Record<string, any> = {};
        // name / nome
        if ('name' in input) out.name = input.name;
        if ('nome' in input) out.name = input.nome;
        // source / origem
        if ('source' in input) out.source = input.source;
        if ('origem' in input) out.source = input.origem;
        // funnel stage / etapa / qualification_stage
        if ('funnel_stage' in input) out.funnel_stage = input.funnel_stage;
        if ('etapa' in input) out.funnel_stage = input.etapa;
        if ('qualification_stage' in input) out.funnel_stage = out.funnel_stage ?? input.qualification_stage;
        // next action
        if ('next_action_date' in input) out.next_action_date = input.next_action_date;
        if ('proxima_acao_at' in input) out.next_action_date = input.proxima_acao_at;
        // simple direct mappings where names align or are common
        const passthrough = ['email', 'whatsapp', 'score', 'tags', 'custom_fields', 'notes', 'phone', 'position', 'company_id', 'owner_id', 'estimated_value', 'expected_close_date', 'last_contact_date', 'contact_count', 'campaign', 'medium', 'status', 'converted_at', 'lost_reason', 'created_at', 'updated_at'];
        for (const k of passthrough) {
          if (k in input) out[k] = input[k];
        }
        return out;
      };

      const mapFromDb = (row: Record<string, any>) => {
        const out: Record<string, any> = { ...row };
        // mirror bilingual fields so UI can keep using Portuguese names if it expects them
        if ('name' in row) out.nome = row.name;
        if ('source' in row) out.origem = row.source;
        if ('funnel_stage' in row) out.etapa = row.funnel_stage;
        if ('next_action_date' in row) out.proxima_acao_at = row.next_action_date;
        // phone / whatsapp are the same; keep both if needed
        if ('phone' in row) out.phone = row.phone;
        if ('whatsapp' in row) out.whatsapp = row.whatsapp;
        return out;
      };

      try {
        // Read session directly to avoid race conditions where context isn't updated yet
        const { data: sessionData } = await supabase.auth.getSession();
        const ownerId = sessionData?.session?.user?.id ?? user?.id ?? null;

        const dbLead = mapToDb(lead as Record<string, any>);
        if (ownerId && !('owner_id' in dbLead)) dbLead.owner_id = ownerId;

  const { data, error } = await (supabaseClient.from('leads') as any).insert([dbLead] as any).select();
        if (error) {
          console.error('[useCreateLead] Supabase insert error', error, dbLead);
          throw new Error(error.message || 'Error inserting lead into Supabase');
        }
        return (data && mapFromDb(data[0])) as any;
      } catch (e) {
        console.warn('[useCreateLead] error during insert', e);
        throw e;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: LeadUpdate }) => {
  const { data, error } = await (supabaseClient.from('leads') as any).update(updates as unknown as Record<string, any>).eq('id', id).select();
      if (error) {
        console.error('[useUpdateLead] Supabase update error', error, id, updates);
        throw new Error(error.message || 'Error updating lead in Supabase');
      }
      return (data && data[0]) as LeadRow;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
  const { data, error } = await (supabaseClient.from('leads') as any).delete().eq('id', id).select();
      if (error) {
        console.error('[useDeleteLead] Supabase delete error', error, id);
        throw new Error(error.message || 'Error deleting lead from Supabase');
      }
      return data as LeadRow[];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return { ...mutation, mutate: mutation.mutateAsync } as typeof mutation & { mutate: typeof mutation.mutateAsync };
}
