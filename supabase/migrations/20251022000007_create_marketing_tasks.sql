-- ============================================================================
-- MARKETING TASKS - Tabela de Tarefas de Marketing
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.marketing_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'P3' CHECK (priority IN ('P1', 'P2', 'P3')),
  
  -- Relacionamentos
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
  assigned_to TEXT NOT NULL,
  
  -- Datas
  due_date DATE,
  due_time TIME,
  completed_at TIMESTAMPTZ,
  
  -- Checklist e dados estruturados
  checklist JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT NOT NULL,
  
  -- Métricas
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  
  -- Controle
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_marketing_tasks_owner ON public.marketing_tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_tasks_status ON public.marketing_tasks(status);
CREATE INDEX IF NOT EXISTS idx_marketing_tasks_campaign ON public.marketing_tasks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_tasks_category ON public.marketing_tasks(category);
CREATE INDEX IF NOT EXISTS idx_marketing_tasks_due_date ON public.marketing_tasks(due_date);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_marketing_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_marketing_tasks_updated_at
  BEFORE UPDATE ON public.marketing_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_marketing_tasks_updated_at();

-- RLS Policies
ALTER TABLE public.marketing_tasks ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver suas próprias tarefas
CREATE POLICY "Users can view their own marketing tasks"
  ON public.marketing_tasks
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Política: Usuários podem inserir suas próprias tarefas
CREATE POLICY "Users can insert their own marketing tasks"
  ON public.marketing_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Política: Usuários podem atualizar suas próprias tarefas
CREATE POLICY "Users can update their own marketing tasks"
  ON public.marketing_tasks
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Política: Usuários podem deletar suas próprias tarefas
CREATE POLICY "Users can delete their own marketing tasks"
  ON public.marketing_tasks
  FOR DELETE
  USING (auth.uid() = owner_id);

-- Comentários
COMMENT ON TABLE public.marketing_tasks IS 'Tarefas de marketing organizadas em kanban';
COMMENT ON COLUMN public.marketing_tasks.checklist IS 'Array de itens do checklist em formato JSON';
COMMENT ON COLUMN public.marketing_tasks.tags IS 'Tags para organização e busca';
COMMENT ON COLUMN public.marketing_tasks.category IS 'Categoria: conteudo, social_media, email, paid_ads, seo, analytics, design, outro';
