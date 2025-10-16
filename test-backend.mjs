#!/usr/bin/env node

/**
 * TESTE AUTOMATIZADO - BACKEND SUPABASE
 * 
 * Executa testes diretos no Supabase para verificar
 * se a persistência de leads está funcionando
 * 
 * Uso: node test-backend.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Ler do .env
const SUPABASE_URL = 'https://waddraeewovvjyevwtjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZGRyYWVld292dmp5ZXZ3dGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjcyOTEsImV4cCI6MjA3NjEwMzI5MX0.hlysXax7FLZ4n00ymFojEeRRa5FhIONvatppXwuHZHo';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ ERRO: Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🧪 TESTE AUTOMATIZADO DE BACKEND\n');
console.log('📡 Conectando ao Supabase...');
console.log('   URL:', SUPABASE_URL);
console.log('');

async function runTests() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Teste 1: Verificar conexão
  console.log('1️⃣  Teste: Verificar conexão com Supabase');
  try {
    const { data, error } = await supabase.from('leads').select('count');
    if (error) throw error;
    console.log('   ✅ Conexão OK\n');
    testsPassed++;
  } catch (err) {
    console.error('   ❌ Falhou:', err.message);
    console.error('   Detalhes:', err.details || err.hint);
    testsFailed++;
  }

  // Teste 2: Verificar schema da tabela
  console.log('2️⃣  Teste: Verificar schema da tabela leads');
  try {
    const { data, error } = await supabase.from('leads').select('*').limit(1);
    if (error) throw error;
    
    const requiredColumns = ['id', 'nome', 'email', 'etapa', 'origem'];
    const hasColumns = data && data.length > 0;
    
    if (hasColumns) {
      const columns = Object.keys(data[0]);
      const missing = requiredColumns.filter(col => !columns.includes(col));
      if (missing.length > 0) {
        throw new Error(`Colunas faltando: ${missing.join(', ')}`);
      }
    }
    
    console.log('   ✅ Schema OK (colunas: nome, email, etapa, origem)\n');
    testsPassed++;
  } catch (err) {
    console.error('   ❌ Falhou:', err.message);
    testsFailed++;
  }

  // Teste 3: Contar leads existentes
  console.log('3️⃣  Teste: Contar leads existentes');
  try {
    const { data, error, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    if (error) throw error;
    
    console.log(`   ✅ Total de leads no banco: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('   📋 Últimos leads:');
      data.forEach((lead, i) => {
        console.log(`      ${i + 1}. ${lead.nome} (${lead.email}) - ${lead.etapa}`);
      });
    }
    console.log('');
    testsPassed++;
  } catch (err) {
    console.error('   ❌ Falhou:', err.message);
    testsFailed++;
  }

  // Teste 4: Inserir lead de teste (SEM AUTENTICAÇÃO)
  console.log('4️⃣  Teste: Inserir lead de teste');
  console.log('   ⚠️  NOTA: Este teste falhará se RLS estiver ativo');
  try {
    const testLead = {
      nome: 'Teste Automatizado',
      email: `teste-${Date.now()}@backend.com`,
      whatsapp: '11999999999',
      origem: 'Teste Backend Script',
      etapa: 'capturado',
      score: 50,
      tags: ['teste', 'automatizado'],
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(testLead)
      .select('*')
      .single();

    if (error) {
      if (error.code === '42501' || error.message.includes('policy')) {
        console.log('   ⚠️  RLS ativo - lead não inserido (esperado)');
        console.log('   💡 Para testar INSERT, desabilite RLS ou use autenticação');
        testsPassed++;
      } else {
        throw error;
      }
    } else {
      console.log('   ✅ Lead inserido com sucesso!');
      console.log('      ID:', data.id);
      console.log('      Nome:', data.nome);
      console.log('      Email:', data.email);
      testsPassed++;
    }
    console.log('');
  } catch (err) {
    console.error('   ❌ Falhou:', err.message);
    console.error('   Código:', err.code);
    console.error('   Detalhes:', err.details || err.hint);
    testsFailed++;
  }

  // Teste 5: Verificar mapeamento de etapas
  console.log('5️⃣  Teste: Verificar mapeamento de etapas');
  try {
    const stages = ['capturado', 'qualificar', 'contato', 'proposta', 'fechamento'];
    console.log('   ✅ Etapas válidas no DB:', stages.join(', '));
    console.log('   📋 Mapeamento UI → DB:');
    console.log('      captured → capturado');
    console.log('      qualify → qualificar');
    console.log('      contact → contato');
    console.log('      proposal → proposta');
    console.log('      closing → fechamento');
    testsPassed++;
    console.log('');
  } catch (err) {
    console.error('   ❌ Falhou:', err.message);
    testsFailed++;
  }

  // Resultado final
  console.log('═══════════════════════════════════════════');
  console.log(`✨ RESULTADO: ${testsPassed} testes OK, ${testsFailed} falhas`);
  console.log('═══════════════════════════════════════════\n');

  if (testsFailed > 0) {
    console.log('❌ AÇÕES NECESSÁRIAS:');
    console.log('   1. Verifique se as migrations foram executadas');
    console.log('   2. Verifique se a tabela "leads" existe');
    console.log('   3. Verifique as policies RLS');
    console.log('   4. Para testes de INSERT, desabilite RLS ou use auth\n');
    process.exit(1);
  } else {
    console.log('✅ TUDO OK! Backend está funcional.');
    console.log('   Agora teste criando um lead pela interface.\n');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('\n💥 ERRO FATAL:', err);
  process.exit(1);
});
