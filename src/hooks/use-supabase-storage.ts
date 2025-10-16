import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Hook para substituir localStorage por Supabase
 * Mantém a mesma API do useLocalStorage para facilitar migração
 * 
 * @example
 * const [profile, setProfile] = useSupabaseStorage('user_preferences', {
 *   first_name: '',
 *   last_name: ''
 * });
 */
export function useSupabaseStorage<T>(
  table: 'user_preferences' | 'company_settings' | 'automation_settings',
  defaultValue: T,
  key?: string // Usado apenas para automation_settings
): [T, (value: T | ((prev: T) => T)) => Promise<void>, boolean] {
  const { user } = useAuthContext();
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // Carregar dados do Supabase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        if (table === 'user_preferences') {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
            console.error('Erro ao carregar preferências:', error);
            return;
          }

          if (data) {
            setValue(data as T);
          }
        } else if (table === 'company_settings') {
          const { data, error } = await supabase
            .from('company_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Erro ao carregar configurações da empresa:', error);
            return;
          }

          if (data) {
            setValue(data as T);
          }
        } else if (table === 'automation_settings' && key) {
          const { data, error } = await supabase
            .from('automation_settings')
            .select('*')
            .eq('user_id', user.id)
            .eq('settings_key', key)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Erro ao carregar configurações de automação:', error);
            return;
          }

          if (data) {
            setValue(data.settings_value as T);
          }
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, table, key]);

  // Salvar dados no Supabase
  const updateValue = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      if (!user) return;

      const valueToSave = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(value)
        : newValue;

      setValue(valueToSave);

      try {
        if (table === 'user_preferences') {
          const { error } = await supabase
            .from('user_preferences')
            .upsert({
              id: user.id,
              ...(valueToSave as object),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (error) {
            console.error('Erro ao salvar preferências:', error);
          }
        } else if (table === 'company_settings') {
          const { error } = await supabase
            .from('company_settings')
            .upsert({
              user_id: user.id,
              ...(valueToSave as object),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (error) {
            console.error('Erro ao salvar configurações da empresa:', error);
          }
        } else if (table === 'automation_settings' && key) {
          const { error } = await supabase
            .from('automation_settings')
            .upsert({
              user_id: user.id,
              settings_key: key,
              settings_value: valueToSave,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,settings_key'
            });

          if (error) {
            console.error('Erro ao salvar configurações de automação:', error);
          }
        }
      } catch (err) {
        console.error('Erro inesperado ao salvar dados:', err);
      }
    },
    [user, table, key, value]
  );

  return [value, updateValue, loading];
}

/**
 * Hook especializado para landing pages
 */
export function useLandingPages() {
  const { user } = useAuthContext();
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadLandingPages = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar landing pages:', error);
          return;
        }

        setLandingPages(data || []);
      } catch (err) {
        console.error('Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLandingPages();
  }, [user]);

  const saveLandingPage = useCallback(
    async (page: any) => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .upsert({
            ...page,
            user_id: user.id,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao salvar landing page:', error);
          return;
        }

        setLandingPages(prev => {
          const index = prev.findIndex(p => p.id === data.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = data;
            return updated;
          }
          return [data, ...prev];
        });

        return data;
      } catch (err) {
        console.error('Erro inesperado:', err);
      }
    },
    [user]
  );

  const deleteLandingPage = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('landing_pages')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao deletar landing page:', error);
          return;
        }

        setLandingPages(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error('Erro inesperado:', err);
      }
    },
    [user]
  );

  return {
    landingPages,
    saveLandingPage,
    deleteLandingPage,
    loading
  };
}

/**
 * Hook especializado para funis salvos
 */
export function useSavedFunnels() {
  const { user } = useAuthContext();
  const [funnels, setFunnels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadFunnels = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_funnels')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar funis:', error);
          return;
        }

        setFunnels(data || []);
      } catch (err) {
        console.error('Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFunnels();
  }, [user]);

  const saveFunnel = useCallback(
    async (funnel: any) => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('saved_funnels')
          .upsert({
            ...funnel,
            user_id: user.id,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao salvar funil:', error);
          return;
        }

        setFunnels(prev => {
          const index = prev.findIndex(f => f.id === data.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = data;
            return updated;
          }
          return [data, ...prev];
        });

        return data;
      } catch (err) {
        console.error('Erro inesperado:', err);
      }
    },
    [user]
  );

  const deleteFunnel = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('saved_funnels')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao deletar funil:', error);
          return;
        }

        setFunnels(prev => prev.filter(f => f.id !== id));
      } catch (err) {
        console.error('Erro inesperado:', err);
      }
    },
    [user]
  );

  return {
    funnels,
    saveFunnel,
    deleteFunnel,
    loading
  };
}
