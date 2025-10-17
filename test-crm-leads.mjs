import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('🔍 Testando CRM (leads)...');
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Buscar leads existentes
try {
  const { data, error } = await supabase.from('leads').select('*').limit(5);
  if (error) {
    console.error('❌ Erro ao buscar leads:', error.message);
  } else {
    console.log('✅ Leads encontrados:', data);
  }
} catch (err) {
  console.error('❌ Erro inesperado:', err.message);
}

// 2. Criar lead de teste
const testLead = {
  nome: 'Lead Teste CRM',
  name: 'Lead Teste CRM',
  email: 'lead.crm@email.com',
  phone: '(11) 90000-0000',
  status: 'novo',
  funnel_stage: 'capturado', // <-- CORRETO!
  source: 'teste',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

try {
  const { data, error } = await supabase.from('leads').insert(testLead).select();
  if (error) {
    console.error('❌ Erro ao criar lead:', error.message);
  } else {
    console.log('✅ Lead criado:', data);
  }
} catch (err) {
  console.error('❌ Erro inesperado ao criar lead:', err.message);
}