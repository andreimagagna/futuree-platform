-- ============================================================================
-- MIGRAÇÃO CONSOLIDADA - NOTIFICAÇÕES E INTEGRAÇÃO DE TODAS AS SOLUÇÕES
-- ============================================================================
-- Data: 2025-10-22
-- Descrição: Cria tabela de notificações e integra com todas as soluções
-- ============================================================================

-- ============================================================================
-- 1. NOTIFICAÇÕES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Conteúdo da notificação
  type TEXT NOT NULL CHECK (type IN (
    'task_assigned',
    'task_completed',
    'task_due_soon',
    'task_overdue',
    'lead_updated',
    'lead_assigned',
    'activity_created',
    'message_received',
    'campaign_launched',
    'campaign_ended',
    'deal_won',
    'deal_lost',
    'project_milestone',
    'mention',
    'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Metadados
  data JSONB DEFAULT '{}'::jsonb,
  link TEXT,
  
  -- Estado
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  
  -- Relacionamentos opcionais
  related_type TEXT CHECK (related_type IN (
    'task',
    'marketing_task',
    'lead',
    'activity',
    'message',
    'campaign',
    'deal',
    'project'
  )),
  related_id UUID,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

-- Índices para notificações
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_related ON public.notifications(related_type, related_id);

-- RLS Policies para notificações
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Função para criar notificações automaticamente
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}'::jsonb,
  p_link TEXT DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, message, data, link, related_type, related_id
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_data, p_link, p_related_type, p_related_id
  ) RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. TRIGGERS PARA NOTIFICAÇÕES AUTOMÁTICAS
-- ============================================================================

-- Notificar quando task é atribuída
CREATE OR REPLACE FUNCTION notify_task_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL AND (OLD IS NULL OR OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    PERFORM create_notification(
      NEW.assigned_to::UUID,
      'task_assigned',
      'Nova tarefa atribuída',
      'Você recebeu uma nova tarefa: ' || NEW.title,
      jsonb_build_object('task_id', NEW.id, 'task_title', NEW.title),
      '/tasks',
      'task',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_task_assigned
  AFTER INSERT OR UPDATE OF assigned_to ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_task_assigned();

-- Notificar quando marketing task é atribuída
CREATE OR REPLACE FUNCTION notify_marketing_task_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    -- Aqui você pode implementar lógica para converter assigned_to (TEXT) para UUID se necessário
    -- Por enquanto, vamos criar notificação apenas para o owner
    PERFORM create_notification(
      NEW.owner_id,
      'task_assigned',
      'Nova tarefa de marketing',
      'Nova tarefa criada: ' || NEW.title,
      jsonb_build_object('task_id', NEW.id, 'task_title', NEW.title),
      '/marketing/tasks',
      'marketing_task',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_marketing_task_assigned
  AFTER INSERT OR UPDATE OF assigned_to ON public.marketing_tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_marketing_task_assigned();

-- Notificar quando lead é atribuído
CREATE OR REPLACE FUNCTION notify_lead_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL AND (OLD IS NULL OR OLD.owner_id IS DISTINCT FROM NEW.owner_id) THEN
    PERFORM create_notification(
      NEW.owner_id,
      'lead_assigned',
      'Novo lead atribuído',
      'Você recebeu um novo lead: ' || COALESCE(NEW.name, NEW.nome, 'Sem nome'),
      jsonb_build_object('lead_id', NEW.id, 'lead_name', COALESCE(NEW.name, NEW.nome)),
      '/crm',
      'lead',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_lead_assigned
  AFTER INSERT OR UPDATE OF owner_id ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_lead_assigned();

-- Notificar quando task está vencendo (executar via cron job)
CREATE OR REPLACE FUNCTION notify_tasks_due_soon()
RETURNS void AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data, link, related_type, related_id)
  SELECT 
    t.assigned_to::UUID,
    'task_due_soon',
    'Tarefa vencendo em breve',
    'A tarefa "' || t.title || '" vence hoje',
    jsonb_build_object('task_id', t.id, 'task_title', t.title, 'due_date', t.due_date),
    '/tasks',
    'task',
    t.id
  FROM public.tasks t
  WHERE t.assigned_to IS NOT NULL
    AND t.due_date = CURRENT_DATE
    AND t.status NOT IN ('done', 'concluida')
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications n
      WHERE n.user_id = t.assigned_to::UUID
        AND n.type = 'task_due_soon'
        AND n.related_id = t.id
        AND n.created_at > CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. TABELAS DE INTEGRAÇÃO BUSINESS SOLUTIONS
-- ============================================================================

-- Customer Success Metrics
CREATE TABLE IF NOT EXISTS public.cs_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  nps_score INTEGER CHECK (nps_score >= -100 AND nps_score <= 100),
  mrr NUMERIC DEFAULT 0,
  churn_risk TEXT CHECK (churn_risk IN ('low', 'medium', 'high')),
  last_interaction DATE,
  contract_end_date DATE,
  notes TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cs_metrics_owner ON public.cs_metrics(owner_id);
CREATE INDEX IF NOT EXISTS idx_cs_metrics_health ON public.cs_metrics(health_score);
CREATE INDEX IF NOT EXISTS idx_cs_metrics_churn ON public.cs_metrics(churn_risk);

-- Finance Records
CREATE TABLE IF NOT EXISTS public.finance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('pago', 'pendente', 'atrasado')),
  payment_method TEXT,
  notes TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_records_owner ON public.finance_records(owner_id);
CREATE INDEX IF NOT EXISTS idx_finance_records_type ON public.finance_records(type);
CREATE INDEX IF NOT EXISTS idx_finance_records_date ON public.finance_records(date DESC);

-- Strategic Goals (OKRs)
CREATE TABLE IF NOT EXISTS public.strategic_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('financeiro', 'crescimento', 'produto', 'operacional', 'pessoas')),
  priority TEXT CHECK (priority IN ('alta', 'media', 'baixa')),
  status TEXT CHECK (status IN ('nao-iniciado', 'em-andamento', 'concluido', 'pausado')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  key_results JSONB DEFAULT '[]'::jsonb,
  responsible TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategic_goals_owner ON public.strategic_goals(owner_id);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_status ON public.strategic_goals(status);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_category ON public.strategic_goals(category);

-- Files/Documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file', 'folder')),
  file_type TEXT,
  size_bytes BIGINT DEFAULT 0,
  path TEXT NOT NULL,
  parent_folder_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_shared BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_owner ON public.documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_parent ON public.documents(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);

-- Notion-style Pages
CREATE TABLE IF NOT EXISTS public.notion_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT,
  cover TEXT,
  description TEXT,
  blocks JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  workspace_id UUID,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notion_pages_owner ON public.notion_pages(owner_id);
CREATE INDEX IF NOT EXISTS idx_notion_pages_workspace ON public.notion_pages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notion_pages_favorite ON public.notion_pages(is_favorite);

-- ============================================================================
-- 4. RLS POLICIES PARA BUSINESS SOLUTIONS
-- ============================================================================

-- CS Metrics
ALTER TABLE public.cs_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own CS metrics"
  ON public.cs_metrics FOR ALL USING (auth.uid() = owner_id);

-- Finance Records
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own finance records"
  ON public.finance_records FOR ALL USING (auth.uid() = owner_id);

-- Strategic Goals
ALTER TABLE public.strategic_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own strategic goals"
  ON public.strategic_goals FOR ALL USING (auth.uid() = owner_id);

-- Documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own documents"
  ON public.documents FOR ALL USING (auth.uid() = owner_id);

-- Notion Pages
ALTER TABLE public.notion_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notion pages"
  ON public.notion_pages FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 5. TRIGGERS DE UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CS Metrics
CREATE TRIGGER trigger_cs_metrics_updated_at
  BEFORE UPDATE ON public.cs_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Finance Records
CREATE TRIGGER trigger_finance_records_updated_at
  BEFORE UPDATE ON public.finance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Strategic Goals
CREATE TRIGGER trigger_strategic_goals_updated_at
  BEFORE UPDATE ON public.strategic_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Documents
CREATE TRIGGER trigger_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Notion Pages
CREATE TRIGGER trigger_notion_pages_updated_at
  BEFORE UPDATE ON public.notion_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE public.notifications IS 'Sistema de notificações unificado para toda a plataforma';
COMMENT ON TABLE public.cs_metrics IS 'Métricas de Customer Success';
COMMENT ON TABLE public.finance_records IS 'Registros financeiros (receitas e despesas)';
COMMENT ON TABLE public.strategic_goals IS 'Objetivos estratégicos (OKRs)';
COMMENT ON TABLE public.documents IS 'Sistema de arquivos e documentos';
COMMENT ON TABLE public.notion_pages IS 'Páginas estilo Notion para base de conhecimento';
