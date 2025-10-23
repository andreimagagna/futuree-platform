-- ============================================================================
-- ATUALIZAR TABELA TASKS - Adicionar colunas faltantes
-- ============================================================================
-- Data: 2025-10-22
-- Descrição: Adiciona colunas necessárias para o sistema de tasks funcionar
--            corretamente com checklist, comentários, time tracking, etc.
-- ============================================================================

-- Adicionar colunas que faltam na tabela tasks
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_time TIME;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS checklist JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS task_activities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS watchers TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS time_tracked INTEGER DEFAULT 0;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS estimated_time INTEGER;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_checklist ON public.tasks USING GIN (checklist);
CREATE INDEX IF NOT EXISTS idx_tasks_comments ON public.tasks USING GIN (comments);
CREATE INDEX IF NOT EXISTS idx_tasks_watchers ON public.tasks USING GIN (watchers);

-- Comentários nas colunas
COMMENT ON COLUMN public.tasks.due_time IS 'Horário específico de vencimento da task';
COMMENT ON COLUMN public.tasks.checklist IS 'Lista de itens do checklist em formato JSON: [{ id, text, done }]';
COMMENT ON COLUMN public.tasks.comments IS 'Comentários da task em formato JSON: [{ id, text, user_id, created_at }]';
COMMENT ON COLUMN public.tasks.task_activities IS 'Histórico de atividades/mudanças da task';
COMMENT ON COLUMN public.tasks.watchers IS 'Array de IDs de usuários que estão observando a task';
COMMENT ON COLUMN public.tasks.time_tracked IS 'Tempo rastreado em minutos';
COMMENT ON COLUMN public.tasks.estimated_time IS 'Tempo estimado para conclusão em minutos';
COMMENT ON COLUMN public.tasks.parent_task_id IS 'ID da task pai (para subtasks)';

-- Atualizar trigger de updated_at se não existir
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tasks_updated_at ON public.tasks;
CREATE TRIGGER trigger_update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();
