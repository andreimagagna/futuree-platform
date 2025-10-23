-- Verificar e corrigir ENUM task_priority
-- Primeiro, adicionar os valores P1, P2, P3 se não existirem

-- Adicionar P1
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'task_priority' AND e.enumlabel = 'P1'
  ) THEN
    ALTER TYPE task_priority ADD VALUE 'P1';
  END IF;
END $$;

-- Adicionar P2
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'task_priority' AND e.enumlabel = 'P2'
  ) THEN
    ALTER TYPE task_priority ADD VALUE 'P2';
  END IF;
END $$;

-- Adicionar P3
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'task_priority' AND e.enumlabel = 'P3'
  ) THEN
    ALTER TYPE task_priority ADD VALUE 'P3';
  END IF;
END $$;

-- Verificar resultado
SELECT enumlabel as priority_values 
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'task_priority'
ORDER BY e.enumsortorder;
