import { config } from 'dotenv';
config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function testCreateLead() {
  try {
    console.log('🧪 Testando criação direta no Supabase...');

    const testLead = {
      name: 'Test Lead',
      company: 'Test Company',
      email: 'test@example.com',
      whatsapp: '+5511999999999',
      stage: 'captured',
      source: 'test',
      score: 50,
      owner: 'Test User',
      lastContact: new Date().toISOString(),
      tags: [],
      notes: 'Test lead creation'
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(testLead)
      .select();

    if (error) {
      console.error('❌ Erro ao criar lead:', error);
      return;
    }

    console.log('✅ Lead criado com sucesso:', data);

    // Limpar o lead de teste
    if (data && data[0]) {
      await supabase.from('leads').delete().eq('id', data[0].id);
      console.log('🧹 Lead de teste removido');
    }

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

testCreateLead();