// Re-export the canonical supabase client from the generated integrations client
import { supabase as integrationsSupabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Re-export the typed supabase client so downstream imports keep the Database generic
export const supabase: SupabaseClient<Database> = integrationsSupabase as unknown as SupabaseClient<Database>;

// Helper to test connectivity from the browser (call from console)
export async function testConnection() {
  try {
    // Prefer an auth/session check first
    const sessionRes = await supabase.auth.getSession();
    if (sessionRes.error) {
      // Try a simple read to check DB connectivity
      const res = await supabase.from('leads').select('id').limit(1);
      return res;
    }
    return sessionRes;
  } catch (err) {
    return { error: err };
  }
}

export default supabase;
