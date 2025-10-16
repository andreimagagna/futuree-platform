-- CONSULTA PARA VERIFICAR SCHEMA DA TABELA LEADS
-- Cole isto no SQL Editor do Supabase Dashboard

-- 1. Ver todas as colunas da tabela leads
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leads'
ORDER BY ordinal_position;

-- 2. Ver os tipos enum (se existirem)
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname LIKE '%lead%'
ORDER BY t.typname, e.enumsortorder;
