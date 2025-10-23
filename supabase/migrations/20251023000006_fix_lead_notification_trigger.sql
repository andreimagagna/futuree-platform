-- ============================================================================
-- FIX: Corrigir triggers de notificações que referenciam campo "nome"
-- Data: 2025-10-23
-- Problema: Triggers tentam acessar NEW.nome mas só existe NEW.name
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Corrigir função notify_lead_assigned (do arquivo 20251022000009)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_lead_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL AND (OLD IS NULL OR OLD.owner_id IS DISTINCT FROM NEW.owner_id) THEN
    PERFORM create_notification(
      NEW.owner_id,
      'lead_assigned',
      'Novo lead atribuído',
      'Você recebeu um novo lead: ' || COALESCE(NEW.name, 'Sem nome'), -- ✅ Removido NEW.nome
      jsonb_build_object('lead_id', NEW.id, 'lead_name', COALESCE(NEW.name, 'Sem nome')), -- ✅ Removido NEW.nome
      '/crm',
      'lead',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recriar trigger
DROP TRIGGER IF EXISTS trigger_notify_lead_assigned ON public.leads;

CREATE TRIGGER trigger_notify_lead_assigned
  AFTER INSERT OR UPDATE OF owner_id ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_lead_assigned();

-- ---------------------------------------------------------------------------
-- 2. Verificar se existe função notify_new_lead e corrigir também
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir notificação quando um novo lead é criado
  IF NEW.owner_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      data,
      is_read
    ) VALUES (
      NEW.owner_id,
      'lead_assigned',
      'Novo Lead Atribuído',
      'Você recebeu um novo lead: ' || COALESCE(NEW.name, 'Sem nome'), -- ✅ Removido NEW.nome
      jsonb_build_object('lead_id', NEW.id, 'lead_name', COALESCE(NEW.name, 'Sem nome')), -- ✅ Removido NEW.nome
      FALSE
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Comentários
-- ---------------------------------------------------------------------------
COMMENT ON FUNCTION public.notify_lead_assigned() IS 'Notifica usuário quando um lead é atribuído (corrigido para usar apenas NEW.name)';
COMMENT ON FUNCTION public.notify_new_lead() IS 'Notifica usuário quando um novo lead é criado (corrigido para usar apenas NEW.name)';
