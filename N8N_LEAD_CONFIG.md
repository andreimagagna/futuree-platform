# 📝 Configuração do n8n para Criar Leads no CRM

## ⚠️ Problema Identificado

O lead criado via n8n **não está aparecendo** no frontend porque:

1. ✅ O lead está sendo criado no banco (você mostrou o JSON)
2. ❌ Mas pode estar faltando o campo **`nome`** (obrigatório)
3. ❌ O filtro `owner_id` pode estar bloqueando se o ID não for exato

---

## 🔧 Solução: Campos Obrigatórios no n8n

### Payload correto para criar lead via n8n:

```json
{
  "nome": "Andrei Magagna",
  "name": "Andrei Magagna",
  "company": "Futuree AI",
  "email": "andrei@futuree.org",
  "phone": "+55 51 99356-9285",
  "whatsapp": "+55 51 99356-9285",
  "owner_id": "26c83ade-97d2-46eb-8eea-c0b97fe8dabb",
  "source": "LinkedIn Ads",
  "status": "novo",
  "funnel_stage": "capturado",
  "score": 0,
  "notes": "Nome do formulário: Plano de Marketing Digital 2026\n\nURL LinkedIn: https://www.linkedin.com/in/andreimagagna\n\nCargo: Fundador & CEO",
  "custom_fields": {}
}
```

### ⚠️ Campos OBRIGATÓRIOS:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | **OBRIGATÓRIO** - Nome do lead (português) |
| `name` | string | Opcional - Nome do lead (inglês, para compatibilidade) |
| `company` | string | **RECOMENDADO** - Nome da empresa |
| `owner_id` | UUID | **IMPORTANTE** - ID do usuário responsável |
| `email` | string | Email do lead |

---

## 🔍 Debug: Por que o lead não aparece?

### Verificar no Console do Navegador (F12):

Abra o CRM e veja os logs:

```
[useSupabaseLeads] 🔍 Buscando leads com filtros: { owner_id: "26c83ade-97d2-46eb-8eea-c0b97fe8dabb" }
[useSupabaseLeads] 🔍 Filtrando por owner_id: 26c83ade-97d2-46eb-8eea-c0b97fe8dabb
[useSupabaseLeads] ✅ 15 leads encontrados
```

### Se o lead não aparecer:

1. **Verifique se o `owner_id` está correto**
   - O ID no n8n: `26c83ade-97d2-46eb-8eea-c0b97fe8dabb`
   - O ID do usuário logado deve ser EXATAMENTE o mesmo

2. **Verifique se tem o campo `nome`**
   ```sql
   SELECT id, nome, name, company, owner_id 
   FROM leads 
   WHERE id = '7c2bdb46-7f61-487c-a831-fd452a8ff491';
   ```

3. **Aguarde até 30 segundos**
   - O frontend agora faz refetch automático a cada 30 segundos
   - Ou volte para a aba do navegador (refetch on focus)

---

## ✅ Checklist de Validação

Antes de criar o lead via n8n, verifique:

- [ ] Campo `nome` está preenchido (obrigatório)
- [ ] Campo `company` está preenchido (recomendado)
- [ ] Campo `owner_id` é o UUID do usuário logado
- [ ] Status é `"novo"` (um dos valores permitidos)
- [ ] Campo `custom_fields` é um objeto JSON válido (pode ser `{}`)

---

## 🚀 Atualização Automática

Agora o CRM atualiza automaticamente:
- ✅ A cada **30 segundos**
- ✅ Quando você **volta para a aba** do navegador
- ✅ Logs detalhados no console (F12)

---

## 📊 Verificar no Supabase

### Query para ver todos os leads (sem filtro):

```sql
SELECT 
  id,
  nome,
  name,
  company,
  email,
  owner_id,
  created_at,
  updated_at
FROM leads
ORDER BY created_at DESC
LIMIT 20;
```

### Query para ver apenas seus leads:

```sql
SELECT 
  id,
  nome,
  name,
  company,
  email,
  created_at
FROM leads
WHERE owner_id = '26c83ade-97d2-46eb-8eea-c0b97fe8dabb'
ORDER BY created_at DESC;
```

---

## 🔧 Teste Rápido

### 1. Criar lead de teste via SQL:

```sql
INSERT INTO leads (
  nome,
  name,
  company,
  email,
  owner_id,
  source,
  status,
  funnel_stage,
  score,
  custom_fields
) VALUES (
  'Teste Lead',
  'Teste Lead',
  'Empresa Teste',
  'teste@teste.com',
  '26c83ade-97d2-46eb-8eea-c0b97fe8dabb',
  'Teste Manual',
  'novo',
  'capturado',
  0,
  '{}'::jsonb
) RETURNING *;
```

### 2. Verificar se aparece no frontend:
- Abra o CRM
- Aguarde até 30 segundos
- O lead "Teste Lead" deve aparecer

---

## 📝 Template n8n

Use este payload no seu workflow n8n:

```json
{
  "nome": "{{ $json.name }}",
  "name": "{{ $json.name }}",
  "company": "{{ $json.company }}",
  "email": "{{ $json.email }}",
  "phone": "{{ $json.phone }}",
  "whatsapp": "{{ $json.phone }}",
  "owner_id": "26c83ade-97d2-46eb-8eea-c0b97fe8dabb",
  "source": "{{ $json.source || 'LinkedIn Ads' }}",
  "status": "novo",
  "funnel_stage": "capturado",
  "score": 0,
  "notes": "{{ $json.notes }}",
  "custom_fields": {}
}
```

---

**Data:** 09/11/2025  
**Status:** ✅ Configurado com refetch automático
