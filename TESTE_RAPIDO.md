# ⚡ TESTE RÁPIDO - CONFIRMAR BACKEND

## 🎯 O que foi feito:

✅ **Hook `useLeadsCrud` reescrito do ZERO**
- Opera direto no Supabase (sem intermediários)
- Logs detalhados em cada operação
- Mapeamento correto UI ↔ DB

✅ **Build compilando sem erros**

✅ **Server rodando na porta 8082**

---

## 🧪 TESTE AGORA (3 minutos):

### 1️⃣ Abrir aplicação
```
http://localhost:8082
```

### 2️⃣ Fazer login (se necessário)

### 3️⃣ Abrir Console do Browser
- Pressione **F12**
- Vá para aba **Console**
- Limpe o console (**Ctrl+L**)

### 4️⃣ Criar um lead
1. Vá para **CRM**
2. Clique em **"Novo Lead"** ou **"+ Adicionar Lead"**
3. Preencha:
   ```
   Nome: Teste Final Backend
   Empresa: Tech Corp
   Email: teste@final.com
   Telefone: 11999999999
   Etapa: Capturado
   Origem: Teste Manual
   ```
4. Clique em **"Criar Lead"** ou **"Salvar"**

### 5️⃣ VERIFICAR CONSOLE - Deve aparecer:

```
[CreateLeadForm] 📝 Submetendo formulário: ...
[CreateLeadForm] 🚀 Chamando addLead...
[useLeadsCrud] 🆕 Criando novo lead...
[useLeadsCrud] leadToDbRow: ...
[useLeadsCrud] 📤 Enviando para backend: ...
[useLeadsCrud] ✅ Lead criado no backend: ...
[useLeadsCrud] 🔄 Store atualizada com novo lead
[CreateLeadForm] ✅ Lead criado!
```

### 6️⃣ Verificar no Supabase
1. Abra https://supabase.com
2. Vá para seu projeto
3. **Table Editor** → **leads**
4. Procure pelo lead "Teste Final Backend"

---

## ❌ SE DER ERRO:

### Erro: "row-level security policy"
**Cole no SQL Editor do Supabase:**
```sql
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
```

### Erro: "null value in column 'company_id'"
**Envie o erro completo aqui no chat**

### Erro: "null value in column 'owner_id'"
**Envie o erro completo aqui no chat**

### Lead não aparece na lista
1. Recarregue a página (F5)
2. Veja se o toast verde apareceu ("Lead criado com sucesso!")
3. Verifique no Table Editor do Supabase se o lead está lá

---

## 📋 CHECKLIST:

- [ ] App rodando em localhost:8082
- [ ] Console do browser aberto (F12)
- [ ] Lead criado pela interface
- [ ] Logs apareceram no console
- [ ] Toast verde de sucesso
- [ ] Lead visível no Supabase Table Editor

---

## 🎯 RESPONDA:

1. **O toast verde apareceu?** (Sim/Não)
2. **Quais logs apareceram no console?** (Cole aqui)
3. **O lead aparece no Supabase?** (Sim/Não)
4. **Se deu erro, qual foi?** (Cole a mensagem)

---

**Arquivos modificados:**
- `src/hooks/crm/useLeadsCrud.ts` (reescrito 100%)
- `src/components/dashboard/forms/CreateLeadForm.tsx` (logs adicionados)

**Status:** PRONTO PARA TESTE ✅
