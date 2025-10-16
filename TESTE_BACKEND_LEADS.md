# 🔍 Guia de Teste - Persistência de Leads no Backend

## O que foi feito:

### 1. **Hook `useLeadsCrud` completamente reescrito**
- ✅ Operações vão **direto para o Supabase**
- ✅ Logs detalhados em cada operação
- ✅ Mapeamento correto de colunas (nome, email, whatsapp, origem, etapa, etc)
- ✅ Mapeamento correto de etapas (captured ↔ capturado, qualify ↔ qualificar, etc)
- ✅ Toast notifications para feedback do usuário
- ✅ Carregamento automático de leads ao montar

### 2. **CreateLeadForm atualizado**
- ✅ Usa o novo `addLead` do hook
- ✅ Logs detalhados para debug
- ✅ Não gera ID local (deixa o banco gerar)

### 3. **Logs implementados**
Todos os logs começam com `[useLeadsCrud]` e incluem emojis para facilitar identificação:
- 🆕 Criar lead
- 🔄 Atualizar lead
- 🗑️ Deletar lead
- ✅ Sucesso
- ❌ Erro
- 📤 Envio para backend
- 🔄 Carregando dados

## Como testar:

### Passo 1: Abrir o Console do Navegador
1. Abra o Chrome DevTools (F12)
2. Vá para a aba "Console"
3. Limpe o console (ícone 🚫 ou Ctrl+L)

### Passo 2: Criar um Lead
1. Vá para o CRM
2. Clique em "Novo Lead" ou "Adicionar Lead"
3. Preencha o formulário:
   - Nome: "Teste Backend"
   - Empresa: "Empresa Teste"
   - Email: "teste@backend.com"
   - Telefone: "(11) 98765-4321"
   - Etapa: "Capturado"
   - Origem: "Teste Manual"
4. Clique em "Criar Lead"

### Passo 3: Verificar os Logs
No console, você deve ver algo assim:

```
[CreateLeadForm] 📝 Submetendo formulário: {name: "Teste Backend", ...}
[CreateLeadForm] 🚀 Chamando addLead...
[useLeadsCrud] 🆕 Criando novo lead... {name: "Teste Backend", ...}
[useLeadsCrud] leadToDbRow: {input: {...}, output: {nome: "Teste Backend", ...}}
[useLeadsCrud] 📤 Enviando para backend: {nome: "Teste Backend", email: "teste@backend.com", ...}
[useLeadsCrud] dbRowToLead: {input: {...}, output: {...}}
[useLeadsCrud] ✅ Lead criado no backend: {id: "uuid...", name: "Teste Backend", ...}
[useLeadsCrud] 🔄 Store atualizada com novo lead
[CreateLeadForm] ✅ Lead criado!
```

### Passo 4: Verificar no Supabase
1. Abra o Supabase Dashboard
2. Vá para "Table Editor"
3. Selecione a tabela `leads`
4. Você deve ver o novo lead com:
   - `nome`: "Teste Backend"
   - `email`: "teste@backend.com"
   - `etapa`: "capturado"
   - `origem`: "Teste Manual"

## Possíveis Erros e Soluções:

### ❌ Erro: "new row violates row-level security policy"
**Causa:** Policies RLS bloqueando inserção

**Solução:**
1. Abra Supabase Dashboard → Authentication
2. Verifique se está logado
3. Se não estiver, vá para SQL Editor e execute:
```sql
-- Desabilitar RLS temporariamente para testes
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
```

### ❌ Erro: "column 'company_id' is required"
**Causa:** Coluna obrigatória não está sendo enviada

**Solução:** Atualizar o hook para incluir `company_id`:
```typescript
const dbRow = {
  nome: lead.name || '',
  email: lead.email || null,
  whatsapp: lead.whatsapp || null,
  origem: lead.source || null,
  etapa: lead.stage ? STAGE_UI_TO_DB[lead.stage] : 'capturado',
  score: lead.score ?? 50,
  proxima_acao_at: lead.nextAction ? new Date(lead.nextAction).toISOString() : null,
  tags: lead.tags || [],
  company_id: 'ID_DA_EMPRESA', // ← Adicionar isto
};
```

### ❌ Erro: "null value in column 'nome' violates not-null constraint"
**Causa:** Nome vazio sendo enviado

**Solução:** Já está tratado no código (usa `lead.name || ''`)

### ❌ Lead não aparece na lista após criar
**Causa:** Store não foi atualizada ou carregamento não aconteceu

**Solução:**
1. Verifique os logs: deve haver `[useLeadsCrud] 🔄 Store atualizada`
2. Recarregue a página (F5)
3. Verifique se o `SupabaseDataLoader` está sendo usado no `App.tsx`

## Verificação Rápida:

Execute no console do navegador:
```javascript
// Verificar se Supabase está conectado
console.log('Supabase:', window.location.origin, 'Auth:', await (await fetch('/api/auth/session')).ok);

// Testar query direta
const { data, error } = await supabase.from('leads').select('*').limit(5);
console.log('Leads no banco:', data?.length || 0, 'Erro:', error);
```

## Status Esperado:

✅ **Hook reescrito com logs detalhados**
✅ **Form atualizado para usar novo hook**
✅ **Mapeamentos corretos (UI ↔ DB)**
✅ **Operações diretas no Supabase**
✅ **Toast notifications funcionando**

## Próximos Passos (se ainda não funcionar):

1. Verificar se há erros de RLS
2. Verificar se `company_id` e `owner_id` são obrigatórios
3. Verificar se a autenticação está ativa
4. Testar query direta no SQL Editor do Supabase

---

**Última atualização:** Hook reescrito com logs completos e operações diretas no backend.
