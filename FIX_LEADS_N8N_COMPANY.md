# 🐛 FIX: Leads do n8n não aparecem + Nome da empresa não salva

## 📋 Problemas Identificados

### 1. **Leads criados via n8n não aparecem no frontend**

**Causa Raiz:**
- Cache do React Query não estava atualizando automaticamente
- Sem mecanismo de refetch periódico ou em tempo real

**Solução Implementada:**
```typescript
// useLeadsAPI.ts - useLeads()
refetchInterval: 30000, // Refetch a cada 30 segundos
refetchOnWindowFocus: true, // Refetch quando voltar à janela
```

**Como funciona agora:**
- ✅ A cada 30 segundos busca novos leads automaticamente
- ✅ Quando você volta para a aba do navegador, atualiza
- ✅ Logs adicionados para debug: `[useLeads] ✅ X leads encontrados`

---

### 2. **Nome da empresa não está sendo salvo**

**Causa Raiz:**
- A tabela `leads` tinha apenas `company_id` (foreign key)
- Não tinha o campo `company` (nome texto) para armazenar o nome da empresa
- O código estava tentando enviar `company` mas o banco ignorava

**Solução Implementada:**

#### A) Migration SQL criada:
```sql
-- Arquivo: supabase/migrations/add_company_field_to_leads.sql
ALTER TABLE public.leads ADD COLUMN company TEXT;
CREATE INDEX idx_leads_company ON public.leads(company);
```

#### B) Tipos TypeScript atualizados:
```typescript
// src/integrations/supabase/types.ts
Row: {
  company_id: string | null
  company: string | null  // ← ADICIONADO
}
```

#### C) Hook useLeadsAPI.ts atualizado:
```typescript
// Adicionado 'company' na lista de campos passthrough
const passthrough = [..., 'company', 'company_id', ...]
```

---

## 🚀 Como Aplicar a Correção

### Passo 1: Executar Migration no Supabase

1. Acesse: https://supabase.com/dashboard/project/[SEU_PROJETO]/sql
2. Cole o conteúdo de: `supabase/migrations/add_company_field_to_leads.sql`
3. Execute (Run)
4. Aguarde mensagem: `✅ Coluna "company" adicionada com sucesso`

### Passo 2: Testar no Frontend

1. Abra o CRM
2. Crie um novo lead preenchendo **Empresa**
3. Salve
4. Verifique no Supabase se o campo `company` foi preenchido

### Passo 3: Testar com n8n

1. Execute seu workflow n8n para criar um lead
2. Aguarde até 30 segundos (ou volte para a aba do CRM)
3. O lead deve aparecer automaticamente

---

## 🔍 Verificação e Debug

### Ver logs no console do navegador (F12):

```
[useLeads] 🔍 Buscando todos os leads...
[useLeads] ✅ 15 leads encontrados
```

### Ver no Supabase se a coluna foi criada:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name = 'company';
```

### Testar insert manual:

```sql
INSERT INTO leads (nome, company, owner_id)
VALUES ('João Silva', 'Tech Solutions', 'SEU_USER_ID');
```

---

## ✅ Resultados Esperados

### Antes:
- ❌ Leads do n8n não apareciam (precisava F5)
- ❌ Campo `company` enviado mas não salvo
- ❌ Dados ficavam apenas em `company_id`

### Depois:
- ✅ Leads do n8n aparecem em até 30 segundos
- ✅ Campo `company` salva o nome da empresa
- ✅ Pode usar `company_id` E `company` juntos
- ✅ Logs claros para debug

---

## 📝 Notas Técnicas

### Por que refetch automático em vez de real-time?

**Opção 1: Real-time (Supabase Realtime)**
```typescript
// Mais complexo, precisa configurar subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('leads')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, payload => {
      queryClient.invalidateQueries(['leads']);
    })
    .subscribe();
}, []);
```

**Opção 2: Refetch periódico (Implementado)**
```typescript
// Mais simples, funciona em 99% dos casos
refetchInterval: 30000, // 30 segundos
```

**Escolha:** Optamos pelo refetch periódico por:
- ✅ Mais simples de implementar
- ✅ Menor overhead no servidor
- ✅ Suficiente para a maioria dos casos (n8n não cria leads a cada segundo)
- ✅ Refetch on focus já ajuda muito

Se precisar de real-time verdadeiro, basta adicionar Supabase Realtime depois.

---

## 🔗 Arquivos Modificados

- ✅ `src/hooks/useLeadsAPI.ts` - Adicionado refetch + logs + campo company
- ✅ `src/integrations/supabase/types.ts` - Adicionado type company
- ✅ `supabase/migrations/add_company_field_to_leads.sql` - Migration SQL

---

## 🧪 Checklist de Testes

- [ ] Executar migration SQL no Supabase
- [ ] Criar lead via frontend com empresa → Verificar se `company` foi salvo
- [ ] Criar lead via n8n → Aguardar 30s → Lead aparece?
- [ ] Voltar para aba do CRM → Refetch automático funciona?
- [ ] Logs aparecem no console? (`F12` → Console)
- [ ] Campo `company` aparece no Supabase Table Editor?

---

**Data da Correção:** 09/11/2025  
**Desenvolvedor:** GitHub Copilot  
**Status:** ✅ Implementado e pronto para teste
