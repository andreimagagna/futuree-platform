/**
 * TESTE DE CONEXÃO SUPABASE
 * 
 * Cole este código no Console do navegador (F12)
 * para verificar se a conexão está funcionando
 */

console.clear();
console.log('🔌 TESTE DE CONEXÃO SUPABASE\n');

// 1. Verificar variáveis de ambiente
console.log('1️⃣ Variáveis de ambiente:');
console.log('   URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('   Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Presente' : '❌ Ausente');
console.log('');

// 2. Testar conexão
console.log('2️⃣ Testando conexão...');
(async () => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erro na conexão:', error);
      console.log('   Código:', error.code);
      console.log('   Mensagem:', error.message);
      console.log('   Detalhes:', error.details || error.hint);
    } else {
      console.log('✅ Conexão OK! Tabela "leads" acessível');
    }
  } catch (err) {
    console.error('❌ Erro fatal:', err);
  }
  
  // 3. Testar autenticação
  console.log('\n3️⃣ Verificando autenticação...');
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError) {
    console.error('❌ Erro na autenticação:', authError);
  } else if (session) {
    console.log('✅ Usuário autenticado:');
    console.log('   Email:', session.user.email);
    console.log('   ID:', session.user.id);
  } else {
    console.warn('⚠️ Nenhuma sessão ativa (não logado)');
  }
  
  // 4. Testar query de leads
  console.log('\n4️⃣ Buscando leads...');
  const { data: leads, error: queryError } = await supabase
    .from('leads')
    .select('id, nome, email, etapa')
    .limit(3);
  
  if (queryError) {
    console.error('❌ Erro ao buscar leads:', queryError);
  } else {
    console.log(`✅ Encontrados ${leads?.length || 0} leads`);
    if (leads && leads.length > 0) {
      console.table(leads);
    }
  }
  
  // 5. Testar INSERT (só se autenticado)
  if (session) {
    console.log('\n5️⃣ Testando INSERT...');
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        nome: 'TESTE CONEXAO',
        email: `teste-${Date.now()}@conexao.com`,
        whatsapp: '11999999999',
        origem: 'Teste Conexao',
        etapa: 'capturado',
        score: 50,
        tags: ['teste'],
      })
      .select('*')
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError);
      console.log('   Código:', insertError.code);
      console.log('   Mensagem:', insertError.message);
      
      if (insertError.code === '23502') {
        console.log('\n💡 SOLUÇÃO: Campo obrigatório está faltando.');
        console.log('   Verifique se company_id ou owner_id são obrigatórios.');
      } else if (insertError.code === '42501') {
        console.log('\n💡 SOLUÇÃO: RLS está bloqueando.');
        console.log('   Execute: ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;');
      }
    } else {
      console.log('✅ Lead inserido com sucesso!');
      console.log('   ID:', newLead.id);
      console.log('   Nome:', newLead.nome);
    }
  }
  
  console.log('\n✨ TESTE COMPLETO!\n');
})();
