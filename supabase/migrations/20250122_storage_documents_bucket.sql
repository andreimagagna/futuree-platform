-- ============================================================================
-- SUPABASE STORAGE: DOCUMENTS BUCKET
-- ============================================================================
-- Criação do bucket para armazenamento de arquivos
-- Data: 2025-01-22
-- IMPORTANTE: Execute este SQL no Supabase Dashboard → SQL Editor
-- ============================================================================

-- PASSO 1: Criar bucket 'documents' (privado por padrão)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 
  'documents', 
  false,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv', 'application/zip']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PASSO 2: HABILITAR RLS NO BUCKET
-- ============================================================================
-- Isso deve ser feito pela interface do Supabase:
-- Storage → documents → Configuration → Enable RLS

-- ============================================================================
-- PASSO 3: CRIAR POLICIES VIA SUPABASE DASHBOARD
-- ============================================================================
-- As policies devem ser criadas pela interface do Supabase Storage, não por SQL direto
-- Vá em: Storage → documents → Policies → New Policy

-- ============================================================================
-- ALTERNATIVA: Se precisar criar via SQL, use esta abordagem:
-- ============================================================================

-- Limpar policies existentes (se houver)
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Policy 1: INSERT (Upload)
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: SELECT (View/Download)
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: UPDATE (Metadata)
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: DELETE (Remove)
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'documents';

-- Verificar policies criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%documents%';
