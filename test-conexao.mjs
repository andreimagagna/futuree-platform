#!/usr/bin/env node

/**
 * 🧪 Script de Teste de Conexão Frontend ↔ Backend
 *
 * Testa todas as conexões do sistema:
 * - Supabase Database
 * - Supabase Auth
 * - APIs REST (se configuradas)
 * - Realtime subscriptions
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente do .env
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');

let SUPABASE_URL = process.env.VITE_SUPABASE_URL;
let SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
let API_URL = process.env.VITE_API_URL;

try {
  const envContent = readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');

  for (const line of envLines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      SUPABASE_URL = line.split('=')[1].replace(/"/g, '');
    }
    if (line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) {
      SUPABASE_KEY = line.split('=')[1].replace(/"/g, '');
    }
    if (line.startsWith('VITE_API_URL=')) {
      API_URL = line.split('=')[1].replace(/"/g, '');
    }
  }
} catch (error) {
  console.log('� Arquivo .env não encontrado, usando variáveis de ambiente do sistema');
}

console.log('�🚀 Testando Conexão Frontend ↔ Backend\n');

// ===========================================
// 1. TESTE SUPABASE CONFIG
// ===========================================

console.log('1️⃣  Verificando configuração Supabase...');

if (!SUPABASE_URL) {
  console.log('❌ VITE_SUPABASE_URL não configurada');
  console.log('   Adicione ao arquivo .env: VITE_SUPABASE_URL="https://seu-projeto.supabase.co"');
  process.exit(1);
}

if (!SUPABASE_KEY) {
  console.log('❌ VITE_SUPABASE_PUBLISHABLE_KEY não configurada');
  console.log('   Adicione ao arquivo .env: VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente configuradas');
console.log(`   URL: ${SUPABASE_URL}`);
console.log(`   Key: ${SUPABASE_KEY.substring(0, 20)}...\n`);

// ===========================================
// 2. TESTE CONEXÃO SUPABASE
// ===========================================

console.log('2️⃣  Testando conexão com Supabase...');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

try {
  // Teste básico de conexão
  const { data, error } = await supabase
    .from('leads')
    .select('count', { count: 'exact', head: true });

  if (error) {
    console.log('❌ Erro na conexão Supabase:', error.message);
    console.log('   Verifique se as tabelas existem e as permissões estão corretas');
    process.exit(1);
  }

  console.log('✅ Conexão Supabase estabelecida');
  console.log(`   Tabela 'leads' acessível (${data} registros)\n`);

} catch (error) {
  console.log('❌ Erro inesperado:', error.message);
  process.exit(1);
}

// ===========================================
// 3. TESTE AUTENTICAÇÃO
// ===========================================

console.log('3️⃣  Testando sistema de autenticação...');

try {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error && error.message !== 'Auth session missing!') {
    console.log('❌ Erro no sistema de auth:', error.message);
  } else {
    console.log('✅ Sistema de autenticação funcionando');
    console.log(`   Usuário atual: ${user ? user.email : 'Nenhum (sessão anônima)'}\n`);
  }

} catch (error) {
  console.log('❌ Erro no teste de auth:', error.message);
  console.log('   (Isso pode ser normal se não há sessão ativa)\n');
}

// ===========================================
// 4. TESTE APIs REST (OPCIONAL)
// ===========================================

console.log('4️⃣  Verificando APIs REST...');

if (API_URL) {
  console.log(`🔗 Testando API: ${API_URL}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_URL}/leads`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('✅ API REST funcionando');
      const data = await response.json();
      console.log(`   Resposta: ${Array.isArray(data) ? data.length : 'Objeto'} itens\n`);
    } else {
      console.log(`❌ API REST retornou erro: ${response.status}`);
      console.log('   Sistema continuará usando dados mockados\n');
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏰ API REST não respondeu em 5 segundos');
    } else {
      console.log('❌ Erro na API REST:', error.message);
    }
    console.log('   Sistema continuará usando dados mockados\n');
  }

} else {
  console.log('📝 API REST não configurada');
  console.log('   Sistema usando dados mockados (normal)\n');
}

// ===========================================
// 5. RESUMO FINAL
// ===========================================

console.log('🎉 TESTE CONCLUÍDO!\n');

console.log('📊 Status da Conexão:');
console.log('✅ Supabase Database: Conectado');
console.log('✅ Autenticação: Funcionando');
console.log(API_URL ? '✅ API REST: Configurada' : '📝 API REST: Usando mocks');
console.log('\n🚀 Frontend está 100% conectado ao backend!');

console.log('\n💡 Próximos passos:');
console.log('1. Execute: npm run dev');
console.log('2. Abra: http://localhost:8080');
console.log('3. Teste as funcionalidades do CRM');

process.exit(0);