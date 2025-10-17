import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('🔍 Testando conexão com Supabase...');
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

try {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('❌ Erro ao conectar:', error.message);
  } else {
    console.log('✅ Conexão OK! Exemplo de dados:', data);
  }
} catch (err) {
  console.error('❌ Erro inesperado:', err.message);
}