# 🚨 PROBLEMA CRÍTICO ENCONTRADO

## ❌ ERRO: "Could not find the 'etapa' column"

### 📋 O QUE ISSO SIGNIFICA:
A tabela `leads` existe no Supabase, mas **não tem a coluna 'etapa'**.

Isso acontece porque:
1. ✅ A migration SQL está correta (tem a coluna 'etapa')
2. ❌ Mas a migration **não foi executada** no banco de dados

---

## ✅ SOLUÇÃO: Executar a Migration

### Opção 1: Via SQL Editor do Supabase (RECOMENDADO)

1. Abra **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo do arquivo:
   ```
   supabase/migrations/20251010234009_aac71bd0-72a7-45cb-8294-4e23a91c9556.sql
   ```
5. Clique em **Run** (ou F5)

**⚠️ IMPORTANTE:** Se a tabela `leads` já existir, você verá erro "relation already exists". Nesse caso, use a **Opção 2**.

---

### Opção 2: Adicionar Apenas a Coluna 'etapa' (RÁPIDO)

Se a tabela `leads` já existe, execute este SQL para adicionar a coluna:

```sql
-- 1. Verificar se a coluna existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'etapa'
    ) THEN
        -- 2. Adicionar a coluna
        ALTER TABLE public.leads 
        ADD COLUMN etapa lead_stage DEFAULT 'capturado';
        
        RAISE NOTICE 'Coluna etapa adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna etapa já existe!';
    END IF;
END $$;

-- 3. Verificar resultado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;
```

---

### Opção 3: Recriar a Tabela do Zero (CUIDADO: APAGA DADOS)

⚠️ **ATENÇÃO:** Isso apagará todos os dados da tabela `leads`!

```sql
-- 1. Dropar tabela existente
DROP TABLE IF EXISTS public.leads CASCADE;

-- 2. Criar tipo enum (se não existir)
CREATE TYPE public.lead_stage AS ENUM (
    'capturado', 
    'qualificar', 
    'contato', 
    'proposta', 
    'fechamento'
);

-- 3. Criar tabela correta
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  origem TEXT,
  etapa lead_stage DEFAULT 'capturado',
  qualification_stage TEXT,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  proxima_acao_at TIMESTAMPTZ,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas básicas
CREATE POLICY "Usuários autenticados podem ver leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir leads"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (true);
```

---

## 🧪 DEPOIS DE EXECUTAR, TESTE:

### No SQL Editor:
```sql
-- Ver estrutura da tabela
\d+ public.leads

-- Ou
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads';
```

### No Terminal:
```powershell
cd c:\Users\andre\Futuree-Solutions\futuree-ai-solutions
node test-backend.mjs
```

### No Console do Browser:
```javascript
const { data, error } = await supabase
  .from('leads')
  .insert({
    nome: 'Teste',
    email: 'teste@test.com',
    whatsapp: '11999999999',
    origem: 'Teste',
    etapa: 'capturado',
    score: 50,
    tags: []
  })
  .select('*')
  .single();

console.log(data ? '✅ SUCCESS' : '❌ ERROR', error || data);
```

---

## 📊 QUAL OPÇÃO ESCOLHER?

| Situação | Opção Recomendada |
|----------|-------------------|
| Tabela `leads` não existe | **Opção 1** (migration completa) |
| Tabela existe mas falta coluna | **Opção 2** (adicionar coluna) |
| Tabela está bagunçada | **Opção 3** (recriar - APAGA DADOS) |
| Tem dados importantes | **Opção 2** (preserva dados) |

---

## ✅ APÓS CORRIGIR O SCHEMA:

1. ✅ Recarregue a página (F5)
2. ✅ Tente criar um lead novamente
3. ✅ Verifique os logs no console
4. ✅ Confirme no Supabase Table Editor

---

**ME DIGA QUAL OPÇÃO VOCÊ ESCOLHEU E O RESULTADO!**
