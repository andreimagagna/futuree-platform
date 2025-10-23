-- =============================================
-- Migration: Fix RLS Activities Trigger
-- Created: 2025-10-23
-- Purpose: Corrigir erro "row-level security policy" ao atualizar lead status
-- =============================================

-- ============================================================================
-- 1. CORRIGIR TRIGGER FUNCTION COM SECURITY DEFINER
-- ============================================================================

-- Recriar a função com SECURITY DEFINER para bypass RLS no trigger
CREATE OR REPLACE FUNCTION public.log_lead_status_change()
RETURNS TRIGGER
SECURITY DEFINER  -- ✅ BYPASS RLS dentro do trigger
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Registrar mudança de status
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.activities (
      lead_id, 
      user_id,  -- ✅ Usar user_id ao invés de deixar NULL
      type,     -- ✅ Usar apenas 'type' (não 'tipo')
      title, 
      description, 
      metadata,
      activity_date
    )
    VALUES (
      NEW.id,
      NEW.owner_id,  -- ✅ Pegar owner do lead
      'status_change',
      'Status alterado',
      format('Status alterado de "%s" para "%s"', OLD.status, NEW.status),
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status),
      NOW()
    );
  END IF;
  
  -- Registrar mudança de etapa
  IF OLD.etapa IS DISTINCT FROM NEW.etapa THEN
    INSERT INTO public.activities (
      lead_id, 
      user_id,  -- ✅ Usar user_id
      type,     -- ✅ Usar apenas 'type' (não 'tipo')
      title, 
      description, 
      metadata,
      activity_date
    )
    VALUES (
      NEW.id,
      NEW.owner_id,  -- ✅ Pegar owner do lead
      'status_change',
      'Etapa alterada',
      format('Etapa alterada de "%s" para "%s"', OLD.etapa, NEW.etapa),
      jsonb_build_object('old_etapa', OLD.etapa, 'new_etapa', NEW.etapa),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. COMENTÁRIO EXPLICATIVO
-- ============================================================================

COMMENT ON FUNCTION public.log_lead_status_change() IS 
'Registra automaticamente mudanças de status/etapa em activities. 
SECURITY DEFINER permite bypass de RLS para inserções automáticas do sistema.';

-- ============================================================================
-- 3. GARANTIR QUE TRIGGER EXISTE
-- ============================================================================

DROP TRIGGER IF EXISTS track_lead_status_change ON public.leads;
CREATE TRIGGER track_lead_status_change
  AFTER UPDATE ON public.leads
  FOR EACH ROW 
  EXECUTE FUNCTION public.log_lead_status_change();

-- ============================================================================
-- TESTES
-- ============================================================================

-- Para testar depois de aplicar:
-- UPDATE leads SET status = 'ganho' WHERE id = '{algum_lead_id}';
-- SELECT * FROM activities WHERE lead_id = '{algum_lead_id}' ORDER BY created_at DESC LIMIT 1;
