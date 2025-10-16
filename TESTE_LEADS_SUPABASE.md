# 🧪 TESTE: Verificar Integração de Leads com Supabase

## ✅ Passo a Passo para Testar

### 1. Abrir o Console do Navegador
1. Pressione **F12** no navegador
2. Vá na aba **Console**
3. Deixe o console aberto durante o teste

### 2. Criar um Lead no CRM
1. Vá para `/crm`
2. Clique em **"Criar Lead"** ou **"Adicionar Lead"**
3. Preencha os dados:
   - Nome: `Teste João`
   - Email: `teste@exemplo.com`
   - Empresa: `Empresa Teste`
   - Telefone: `11999999999`

### 3. Observar os Logs no Console

Você DEVE ver essas mensagens:

```
✅ Leads carregados do Supabase: X
🔄 Sincronizando novo lead com Supabase: Teste João
📝 Preparando para salvar lead: Teste João
📤 Enviando para Supabase: {...}
✅ Lead salvo com sucesso no Supabase: {...}
✅ Lead salvo no Supabase: Teste João
```

### 4. Verificar no Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Vá no seu projeto
3. Clique em **"Table Editor"** no menu lateral
4. Selecione a tabela **`leads`**
5. Verifique se o lead apareceu com:
   - ✅ Nome correto (coluna `nome`)
   - ✅ Email correto (coluna `email`)
   - ✅ Data de criação (coluna `created_at`)

### 5. Recarregar a Página

1. Pressione **F5** ou **Ctrl+R**
2. O lead deve **continuar aparecendo** no CRM
3. Verifique no console:
   ```
   ✅ Leads carregados do Supabase: 1
   ```

---

## ❌ Se NÃO Funcionar

### Cenário 1: Não vê os logs no console

**Problema:** O hook `useLeadsSync` pode não estar rodando.

**Solução:**
1. Verifique se o `LeadsSyncProvider` está no `App.tsx`
2. Reinicie o servidor (`Ctrl+C` e rode `npm run dev` novamente)

### Cenário 2: Erro "❌ Usuário não autenticado"

**Problema:** Usuário não está logado ou sessão expirou.

**Solução:**
1. Faça logout e login novamente
2. Verifique se as variáveis de ambiente estão corretas:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   ```

### Cenário 3: Erro de RLS (Row Level Security)

**Erro no console:**
```
❌ Erro ao salvar lead no Supabase: {
  "code": "42501",
  "message": "new row violates row-level security policy"
}
```

**Solução:** Desabilitar RLS temporariamente para testar:

```sql
-- No SQL Editor do Supabase
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
```

**⚠️ IMPORTANTE:** Depois de testar, crie políticas corretas:

```sql
-- Reabilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas operações (APENAS PARA TESTE!)
CREATE POLICY "Permitir tudo temporário"
ON leads
FOR ALL
USING (true)
WITH CHECK (true);
```

### Cenário 4: Erro "relation 'public.leads' does not exist"

**Problema:** A tabela `leads` não existe no Supabase.

**Solução:** Rodar a migration:

1. Vá no **SQL Editor** do Supabase
2. Cole o conteúdo de:
   ```
   supabase/migrations/20251010234009_aac71bd0-72a7-45cb-8294-4e23a91c9556.sql
   ```
3. Execute o SQL

---

## 🔍 Logs Esperados vs Reais

### ✅ Cenário de Sucesso

| Ação | Log Esperado |
|------|--------------|
| App inicia | `✅ Leads carregados do Supabase: X` |
| Cria lead | `🔄 Sincronizando novo lead` |
| Salva no banco | `✅ Lead salvo com sucesso no Supabase` |
| Recarrega | Lead permanece visível |

### ❌ Cenário de Erro

| Erro | Log | Causa Provável |
|------|-----|----------------|
| Não autentica | `❌ Usuário não autenticado` | Sessão expirada |
| RLS bloqueia | `new row violates row-level security` | RLS ativo sem políticas |
| Tabela não existe | `relation 'public.leads' does not exist` | Migration não rodada |
| Timeout | `fetch failed` | Problema de rede/URL errada |

---

## 📊 Checklist Final

Marque cada item após testar:

- [ ] Console mostra logs de sincronização
- [ ] Lead aparece no Supabase após criar
- [ ] Lead permanece após recarregar página
- [ ] Pode editar lead e mudanças salvam
- [ ] Pode deletar lead e remove do banco
- [ ] Sem erros no console do navegador

---

## 🆘 Se Precisar de Ajuda

1. **Copie TODOS os logs do console** (Ctrl+A, Ctrl+C)
2. **Tire print da tabela `leads` no Supabase**
3. **Me envie** dizendo qual cenário de erro aconteceu

---

**Última atualização:** 16/10/2025
