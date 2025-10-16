import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Componente de debug para verificar sincronização de leads
 * Adicione no App.tsx temporariamente: <LeadsDebugger />
 */
export function LeadsDebugger() {
  const { user } = useAuthContext();
  const leads = useStore((state) => state.leads);

  useEffect(() => {
    console.log('🐛 [DEBUG] LeadsDebugger montado');
    console.log('🐛 [DEBUG] Usuário:', user ? `${user.email} (${user.id})` : 'Não autenticado');
    console.log('🐛 [DEBUG] Leads no store:', leads.length);
  }, []);

  useEffect(() => {
    console.log('🐛 [DEBUG] Leads mudaram:', {
      quantidade: leads.length,
      leads: leads.map(l => ({ id: l.id, name: l.name }))
    });
  }, [leads]);

  useEffect(() => {
    if (!user) {
      console.log('🐛 [DEBUG] Usuário não autenticado, pulando teste de conexão');
      return;
    }

    const testSupabaseConnection = async () => {
      console.log('🐛 [DEBUG] Testando conexão com Supabase...');
      
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('count')
          .limit(1);

        if (error) {
          console.error('🐛 [DEBUG] ❌ Erro ao conectar:', error);
        } else {
          console.log('🐛 [DEBUG] ✅ Conexão OK, leads na tabela:', data);
        }
      } catch (err) {
        console.error('🐛 [DEBUG] ❌ Erro inesperado:', err);
      }
    };

    testSupabaseConnection();
  }, [user]);

  // Não renderiza nada visualmente
  return null;
}
