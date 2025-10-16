/**
 * SCRIPT DE DIAGNÓSTICO - TESTE DE BACKEND
 * 
 * Cole este script no Console do navegador (F12 → Console)
 * para testar a conexão com o Supabase e verificar leads
 */

console.clear();
console.log('🔍 INICIANDO DIAGNÓSTICO...\n');

// 1. Verificar se Supabase está disponível
console.log('📦 1. Verificando Supabase...');
if (typeof supabase !== 'undefined') {
  console.log('✅ Supabase client está disponível');
} else {
  console.error('❌ Supabase client não encontrado!');
  console.log('💡 Tente: import { supabase } from "@/integrations/supabase/client"');
}

// 2. Testar autenticação
console.log('\n🔐 2. Testando autenticação...');
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro ao obter sessão:', error);
  } else if (data.session) {
    console.log('✅ Usuário autenticado:', data.session.user.email);
    console.log('   User ID:', data.session.user.id);
  } else {
    console.warn('⚠️ Nenhuma sessão ativa (não logado)');
  }
});

// 3. Testar query de leads
console.log('\n📊 3. Testando query de leads...');
supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(5)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Erro ao buscar leads:', error);
      console.log('   Código:', error.code);
      console.log('   Mensagem:', error.message);
      console.log('   Detalhes:', error.details || error.hint);
    } else {
      console.log('✅ Leads encontrados:', data.length);
      if (data.length > 0) {
        console.table(data.map(l => ({
          id: l.id.substring(0, 8) + '...',
          nome: l.nome,
          email: l.email,
          etapa: l.etapa,
          origem: l.origem,
          score: l.score,
          created_at: new Date(l.created_at).toLocaleString('pt-BR')
        })));
      } else {
        console.log('   Nenhum lead encontrado no banco');
      }
    }
  });

// 4. Testar inserção de lead (TESTE)
console.log('\n🆕 4. Para testar inserção, execute:');
console.log(`
testInsert = async () => {
  const { data, error } = await supabase
    .from('leads')
    .insert({
      nome: 'Teste Console',
      email: 'teste@console.com',
      whatsapp: '11999999999',
      origem: 'Console Debug',
      etapa: 'capturado',
      score: 50,
      tags: ['teste']
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('❌ Erro:', error);
  } else {
    console.log('✅ Lead criado:', data);
  }
};

// Execute: testInsert()
`);

// 5. Verificar RLS policies
console.log('\n🔒 5. Para verificar políticas RLS, vá para:');
console.log('   Supabase Dashboard → Authentication → Policies');
console.log('   Tabela: public.leads');

console.log('\n✨ DIAGNÓSTICO COMPLETO!\n');
console.log('📋 Próximos passos:');
console.log('   1. Verifique se está autenticado (item 2)');
console.log('   2. Veja quantos leads existem (item 3)');
console.log('   3. Teste inserção com: testInsert()');
console.log('   4. Verifique RLS policies se houver erro de permissão');
