-- Adicionar ENUM para status de atividades
DO $$ BEGIN
  CREATE TYPE public.activity_status AS ENUM (
    'pending',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Adicionar colunas de status e conclusão na tabela activities
ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS status activity_status DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Criar índice para buscar atividades por status
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);

-- Comentários
COMMENT ON COLUMN public.activities.status IS 'Status da atividade: pending (pendente), completed (concluída), cancelled (cancelada)';
COMMENT ON COLUMN public.activities.completed_at IS 'Data e hora em que a atividade foi marcada como concluída';
