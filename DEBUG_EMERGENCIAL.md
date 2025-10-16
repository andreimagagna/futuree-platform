# 🚨 DEBUG EMERGENCIAL - LEADS NÃO SALVAM NO BACKEND

## ✅ O QUE FOI FEITO:

### 1. **Hook `useLeadsCrud` 100% reescrito**
- ✅ Todas as operações vão DIRETO para o Supabase
- ✅ Logs detalhados com emojis: 🆕 🔄 ✅ ❌
- ✅ Mapeamento correto: UI (captured) ↔ DB (capturado)
- ✅ Campos corretos: nome, email, whatsapp, origem, etapa
- ✅ Toast notifications em todas operações

### 2. **CreateLeadForm atualizado**
- ✅ Usa novo `addLead()` do hook
- ✅ Logs detalhados para debug
- ✅ Não gera ID (deixa o banco gerar UUID)

### 3. **Build compilando sem erros**
- ✅ `npm run build` → SUCCESS
- ✅ TypeScript sem erros de tipo
- ✅ Dev server rodando na porta 8082

---

## 🔍 COMO TESTAR AGORA:

### Passo 1: Abrir Console do Browser
1. Pressione **F12**
2. Vá para aba **Console**
3. Limpe o console (**Ctrl+L**)

### Passo 2: Verificar Autenticação
Cole no console:
```javascript
const { data } = await supabase.auth.getSession();
console.log('Autenticado?', !!data.session, 'Email:', data.session?.user?.email);
```

**Se aparecer `null` ou `undefined`:**
- ❌ Você não está logado
- ✅ Faça login no sistema primeiro

### Passo 3: Testar Query Direta
Cole no console:
```javascript
const { data, error } = await supabase.from('leads').select('*').limit(3);
console.log('Leads no banco:', data?.length || 0, 'Erro:', error);
if (data) console.table(data);
```

**Possíveis resultados:**

#### ✅ Sucesso: `Leads no banco: X`
- Significa que a conexão está OK
- Pode criar leads pela interface

#### ❌ Erro: `row-level security policy`
**SOLUÇÃO:** Desabilitar RLS temporariamente
```sql
-- Cole no SQL Editor do Supabase Dashboard:
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
```

#### ❌ Erro: `relation "public.leads" does not exist`
**SOLUÇÃO:** Executar migrations
```powershell
cd c:\Users\andre\Futuree-Solutions\futuree-ai-solutions
npm run apply-migrations
```

### Passo 4: Criar Lead pela Interface
1. Vá para **CRM** → **Novo Lead**
2. Preencha o formulário:
   ```
   Nome: Teste Backend Final
   Empresa: Tech Corp
   Email: teste@backend.com
   Telefone: (11) 98765-4321
   Etapa: Capturado
   Origem: Teste Manual
   ```
3. Clique em **"Criar Lead"**

### Passo 5: Verificar Logs no Console
Você **DEVE** ver esta sequência:

```
[CreateLeadForm] 📝 Submetendo formulário: {...}
[CreateLeadForm] 🚀 Chamando addLead...
[useLeadsCrud] 🆕 Criando novo lead...
[useLeadsCrud] leadToDbRow: {input: {...}, output: {nome: "Teste Backend Final", ...}}
[useLeadsCrud] 📤 Enviando para backend: {nome: "Teste Backend Final", ...}
[useLeadsCrud] dbRowToLead: {input: {...}, output: {...}}
[useLeadsCrud] ✅ Lead criado no backend: {id: "uuid", name: "Teste Backend Final", ...}
[useLeadsCrud] 🔄 Store atualizada com novo lead
[CreateLeadForm] ✅ Lead criado!
```

**Se aparecer toast verde:** ✅ "Lead criado com sucesso!"

**Se aparecer toast vermelho:** ❌ "Erro ao criar lead"
- Verifique a mensagem de erro no console
- Veja soluções abaixo

---

## ❌ ERROS COMUNS E SOLUÇÕES:

### 1. "new row violates row-level security policy"
```sql
-- Supabase Dashboard → SQL Editor:
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- Ou criar policy permissiva:
CREATE POLICY "allow_all_leads" ON public.leads
FOR ALL USING (true) WITH CHECK (true);
```

### 2. "null value in column 'company_id' violates not-null constraint"
O campo `company_id` é obrigatório. Atualizar hook:

```typescript
// Em src/hooks/crm/useLeadsCrud.ts, linha ~45
function leadToDbRow(lead: Partial<Lead>) {
  const dbRow = {
    nome: lead.name || '',
    email: lead.email || null,
    whatsapp: lead.whatsapp || null,
    origem: lead.source || null,
    etapa: lead.stage ? STAGE_UI_TO_DB[lead.stage] || 'capturado' : 'capturado',
    score: lead.score ?? 50,
    proxima_acao_at: lead.nextAction ? new Date(lead.nextAction).toISOString() : null,
    tags: lead.tags || [],
    company_id: '00000000-0000-0000-0000-000000000000', // ← ADICIONAR
  };
```

### 3. "null value in column 'owner_id' violates not-null constraint"
Adicionar `owner_id` também:

```typescript
const { data } = await supabase.auth.getSession();
const userId = data.session?.user?.id;

const dbRow = {
  // ... outros campos
  company_id: '00000000-0000-0000-0000-000000000000',
  owner_id: userId, // ← ADICIONAR
};
```

### 4. "column 'nome' does not exist"
O schema está errado. Verificar migration:
```sql
-- SQL Editor:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads';
```

Deve mostrar: `nome`, `email`, `whatsapp`, `origem`, `etapa`

### 5. Lead não aparece na lista depois de criar
**Causa:** Store não atualizou

**Solução 1:** Recarregar página (F5)

**Solução 2:** Verificar se `SupabaseDataLoader` está no `App.tsx`:
```tsx
// src/App.tsx deve ter:
import SupabaseDataLoader from "@/components/SupabaseDataLoader";

<SupabaseDataLoader>
  <RouterProvider router={router} />
</SupabaseDataLoader>
```

---

## 🔒 VERIFICAR RLS POLICIES:

1. Abra **Supabase Dashboard**
2. Vá para **Authentication** → **Policies**
3. Selecione tabela **`public.leads`**
4. Deve ter policies para INSERT, UPDATE, DELETE

**Se não tiver policies, crie:**

```sql
-- Permitir SELECT para usuários autenticados
CREATE POLICY "users_select_own_leads" ON public.leads
FOR SELECT USING (auth.uid() = owner_id);

-- Permitir INSERT para usuários autenticados
CREATE POLICY "users_insert_leads" ON public.leads
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Permitir UPDATE para usuários autenticados
CREATE POLICY "users_update_own_leads" ON public.leads
FOR UPDATE USING (auth.uid() = owner_id);

-- Permitir DELETE para usuários autenticados
CREATE POLICY "users_delete_own_leads" ON public.leads
FOR DELETE USING (auth.uid() = owner_id);
```

---

## 🧪 TESTE FINAL:

Cole este script completo no console:

```javascript
console.clear();
console.log('🧪 TESTE COMPLETO DE BACKEND\n');

// 1. Auth
const { data: session } = await supabase.auth.getSession();
console.log('1️⃣ Autenticado:', !!session.session);
if (!session.session) {
  console.error('❌ FAÇA LOGIN PRIMEIRO!');
} else {
  console.log('   Email:', session.session.user.email);
  
  // 2. Query
  const { data: leads, error: queryError } = await supabase
    .from('leads')
    .select('*')
    .limit(3);
  
  console.log('2️⃣ Query leads:', leads?.length || 0, 'leads');
  if (queryError) {
    console.error('   ❌ Erro:', queryError.message);
  }
  
  // 3. Insert
  console.log('3️⃣ Testando INSERT...');
  const { data: newLead, error: insertError } = await supabase
    .from('leads')
    .insert({
      nome: 'Teste Console Debug',
      email: 'debug@test.com',
      whatsapp: '11999999999',
      origem: 'Console',
      etapa: 'capturado',
      score: 50,
      tags: ['debug'],
      owner_id: session.session.user.id, // Importante!
    })
    .select('*')
    .single();
  
  if (insertError) {
    console.error('   ❌ Erro ao inserir:', insertError);
    console.log('   Código:', insertError.code);
    console.log('   Mensagem:', insertError.message);
  } else {
    console.log('   ✅ Lead criado:', newLead.id);
    console.table([{
      id: newLead.id.substring(0, 8),
      nome: newLead.nome,
      email: newLead.email,
      etapa: newLead.etapa,
    }]);
  }
}

console.log('\n✨ TESTE COMPLETO!');
```

---

## 📊 VERIFICAR NO SUPABASE:

1. **Supabase Dashboard**
2. **Table Editor**
3. Tabela **`leads`**
4. Procurar pelo lead "Teste Backend Final" ou "Teste Console Debug"

---

## 🎯 CHECKLIST FINAL:

- [ ] Servidor dev rodando (porta 8082)
- [ ] Usuário logado no sistema
- [ ] Console do browser aberto (F12)
- [ ] Teste de autenticação OK
- [ ] Teste de query OK
- [ ] Teste de insert via console OK
- [ ] Criar lead pela interface
- [ ] Ver logs no console
- [ ] Verificar toast de sucesso
- [ ] Confirmar lead no Table Editor do Supabase

---

**Status:** Hook reescrito, build OK, aguardando teste manual para confirmar persistência.

**Última atualização:** Sistema pronto para teste com logs completos.


## 🔍 PASSO 1: Verificar Console do Navegador

Abra F12 e procure por TODOS esses logs:

### Logs Obrigatórios (devem aparecer):
```
🔵 useLeadsSync: Hook rodando
🟢 LeadsSyncProvider montado
✅ Leads carregados do Supabase: X
🔵 Configurando listener do Zustand...
✅ Listener do Zustand configurado
```

### Se NÃO aparecerem esses logs:
- ❌ O hook não está rodando
- **Solução:** Reinicie o servidor (Ctrl+C e `npm run dev`)

### Quando criar um lead, deve aparecer:
```
🔵 Store mudou: { antes: X, depois: Y }
🔄 Sincronizando novo lead com Supabase: Nome do Lead
📝 Preparando para salvar lead: Nome do Lead
📤 Enviando para Supabase: {...}
✅ Lead salvo com sucesso no Supabase: {...}
```

---

## 🔍 PASSO 2: Verificar Tabela no Supabase

1. **Vá no Supabase Dashboard**: https://supabase.com/dashboard
2. **Seu Projeto** → **SQL Editor**
3. **Cole e Execute:**

```sql
-- Verifica se a tabela existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'leads'
);
```

### ✅ Se retornar `true`:
- Tabela existe, vá para Passo 3

### ❌ Se retornar `false`:
- **A tabela NÃO existe!**
- Cole e execute o SQL do arquivo `SQL_TESTE_RAPIDO.sql`

---

## 🔍 PASSO 3: Testar INSERT Manual

No SQL Editor, execute:

```sql
INSERT INTO public.leads (nome, email, whatsapp)
VALUES ('Teste Manual', 'teste@exemplo.com', '11999999999')
RETURNING *;
```

### ✅ Se funcionar:
- Problema está no código JavaScript, não no banco

### ❌ Se der erro:
- Copie o erro COMPLETO e me envie

**Erros Comuns:**

| Erro | Causa | Solução |
|------|-------|---------|
| `relation "leads" does not exist` | Tabela não criada | Rode SQL_TESTE_RAPIDO.sql |
| `new row violates row-level security` | RLS bloqueando | `ALTER TABLE leads DISABLE ROW LEVEL SECURITY;` |
| `null value in column "nome"` | Campo obrigatório faltando | Verifique mapeamento |

---

## 🔍 PASSO 4: Verificar Autenticação

No console do navegador (F12), cole e execute:

```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('Usuário:', user);
```

### ✅ Deve retornar:
```json
{
  "id": "uuid-aqui",
  "email": "seu@email.com",
  ...
}
```

### ❌ Se retornar `null`:
- Você não está autenticado
- Faça logout e login novamente

---

## 🔍 PASSO 5: Verificar Variáveis de Ambiente

Abra `.env` ou `.env.local` e confirme:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

### Teste no console:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
```

Ambos devem retornar valores (não `undefined`).

---

## 🔍 PASSO 6: Forçar Recriação do Cliente Supabase

Se nada funcionar, adicione no console:

```javascript
// Testar conexão direta
const { data, error } = await supabase
  .from('leads')
  .insert({
    nome: 'Teste Direto',
    email: 'direto@teste.com',
    etapa: 'captured',
    score: 50
  })
  .select();

console.log('Resultado:', { data, error });
```

### ✅ Se funcionar:
- Problema está no hook/listener

### ❌ Se der erro:
- Copie o erro e me envie

---

## 📊 CHECKLIST DE DEBUG

Marque conforme testa:

- [ ] Logs do useLeadsSync aparecem no console
- [ ] Tabela `leads` existe no Supabase
- [ ] INSERT manual funciona no SQL Editor
- [ ] Usuário está autenticado (`getUser()` retorna dados)
- [ ] Variáveis de ambiente estão corretas
- [ ] RLS está desabilitado (temporariamente)
- [ ] Console NÃO mostra erros vermelhos

---

## 🆘 SE TUDO FALHAR

**Me envie:**

1. **Print do console completo** (F12, aba Console, Ctrl+A, Ctrl+C)
2. **Resultado de:** `SELECT * FROM leads;` no SQL Editor
3. **Resultado de:** `SELECT * FROM pg_tables WHERE tablename = 'leads';`
4. **Print das variáveis de ambiente** (com keys ocultadas)

---

**Atualizado:** 16/10/2025 - 20:30
