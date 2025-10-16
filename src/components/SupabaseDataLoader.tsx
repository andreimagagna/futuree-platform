import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStore, type Lead } from '@/store/useStore';

// Carrega leads do Supabase ao montar (se autenticado) e joga na store
export function SupabaseDataLoader({ children }: { children: React.ReactNode }) {
  const setLeads = useStore((s: any) => s.setLeads as (leads: Lead[]) => void);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      console.log('[Loader] Carregando leads do Supabase...');
      const { data: sessionRes } = await supabase.auth.getSession();
      const session = sessionRes?.session;
      if (!session) {
        console.log('[Loader] Sem sessão, pulando carregamento de leads');
        return;
      }

      const { data, error } = await supabase
        .from('leads')
        .select('id, nome, email, whatsapp, origem, etapa, score, proxima_acao_at, tags, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Loader] Erro ao carregar leads', { code: (error as any).code, message: error.message, details: (error as any).details || (error as any).hint });
        return;
      }

      if (!isMounted) return;

      // Mapear DB -> UI
      const stageDbToUi: Record<string, any> = {
        capturado: 'captured',
        qualificar: 'qualify',
        contato: 'contact',
        proposta: 'proposal',
        fechamento: 'closing',
      };

      const leads: Lead[] = (data || []).map((row: any) => ({
        id: String(row.id),
        name: String(row.nome ?? ''),
        company: '',
        email: String(row.email ?? ''),
        whatsapp: String(row.whatsapp ?? ''),
        stage: (stageDbToUi[row.etapa] ?? 'captured') as any,
        funnelId: 'default',
        score: Number(row.score ?? 0),
        owner: '',
        source: String(row.origem ?? ''),
        lastContact: row.updated_at ? new Date(row.updated_at) : new Date(),
        nextAction: row.proxima_acao_at ? new Date(row.proxima_acao_at) : undefined,
        tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
        notes: '',
        status: 'open',
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      }));

      setLeads(leads);
      console.log('[Loader] Leads carregados:', leads.length);
    }

    load();
    return () => { isMounted = false; };
  }, [setLeads]);

  return <>{children}</>;
}

export default SupabaseDataLoader;
