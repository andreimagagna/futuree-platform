-- Garantir que a coluna owner_id existe na tabela tasks
ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Comentário explicativo
COMMENT ON COLUMN public.tasks.owner_id IS 'ID do proprietário da task (usuário que criou)';

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_owner_id ON public.tasks(owner_id);
