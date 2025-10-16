-- ============================================
-- SQL RÁPIDO PARA TESTAR TABELA LEADS
-- Cole este SQL no Supabase SQL Editor
-- ============================================

-- 1. Verificar se a tabela existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'leads'
);
-- Se retornar "false", a tabela não existe!

-- 2. Se a tabela não existe, crie agora (versão simplificada):
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  origem TEXT,
  etapa TEXT DEFAULT 'captured',
  score INTEGER DEFAULT 0,
  owner_id UUID,
  proxima_acao_at TIMESTAMPTZ,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Desabilitar RLS temporariamente para testes
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- 4. Testar INSERT manual
INSERT INTO public.leads (nome, email, whatsapp, origem, etapa, score)
VALUES ('Teste Manual', 'teste@exemplo.com', '11999999999', 'teste', 'captured', 50)
RETURNING *;

-- 5. Ver todos os leads
SELECT * FROM public.leads ORDER BY created_at DESC;

-- 6. Limpar dados de teste (opcional)
-- DELETE FROM public.leads WHERE nome = 'Teste Manual';
