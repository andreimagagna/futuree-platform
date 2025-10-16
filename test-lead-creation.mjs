import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function testCreateLead() {
  console.log('🧪 Testando criação de lead...');

  const testLead = {
    name: 'João Silva',
    nome: 'João Silva',
    company: 'Tech Corp',
    email: 'joao@teste.com',
    whatsapp: '+5511999999999',
    stage: 'captured',
    source: 'teste',
    score: 50,
    owner: 'Test User',
    lastContact: new Date().toISOString(),
    tags: [],
    notes: 'Lead de teste'
  };

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert(testLead)
      .select();

    if (error) {
      console.error('❌ Erro:', error);
      return;
    }

    console.log('✅ Lead criado:', data);

    // Limpar
    if (data && data[0]) {
      await supabase.from('leads').delete().eq('id', data[0].id);
      console.log('🧹 Teste limpo');
    }

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

testCreateLead();