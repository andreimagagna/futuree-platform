-- ============================================================================
-- Migration: Add content column to notion_pages
-- Description: Adiciona coluna content para editor rico HTML
-- Date: 2025-10-23
-- ============================================================================

-- Adicionar coluna content para conteúdo HTML do editor rico
ALTER TABLE public.notion_pages 
ADD COLUMN IF NOT EXISTS content TEXT;

-- Comentário explicativo
COMMENT ON COLUMN public.notion_pages.content IS 'Conteúdo HTML do editor rico TipTap';

-- Migrar dados existentes (se houver) de blocks para content
-- UPDATE public.notion_pages 
-- SET content = blocks::text 
-- WHERE content IS NULL AND blocks IS NOT NULL AND blocks != '[]'::jsonb;
