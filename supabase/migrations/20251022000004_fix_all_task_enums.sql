-- Migration: Adicionar valores faltantes aos ENUMs de tasks
-- Created: 2025-10-22
-- Purpose: Adicionar P1/P2/P3 ao task_priority e in_progress/completed/cancelled ao task_status

-- ============================================
-- TASK_PRIORITY ENUM
-- ============================================

-- Adicionar P1 se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'P1' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_priority')
  ) THEN
    ALTER TYPE task_priority ADD VALUE 'P1';
    RAISE NOTICE 'Valor P1 adicionado ao ENUM task_priority';
  ELSE
    RAISE NOTICE 'Valor P1 já existe no ENUM task_priority';
  END IF;
END $$;

-- Adicionar P2 se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'P2' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_priority')
  ) THEN
    ALTER TYPE task_priority ADD VALUE 'P2';
    RAISE NOTICE 'Valor P2 adicionado ao ENUM task_priority';
  ELSE
    RAISE NOTICE 'Valor P2 já existe no ENUM task_priority';
  END IF;
END $$;

-- Adicionar P3 se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'P3' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_priority')
  ) THEN
    ALTER TYPE task_priority ADD VALUE 'P3';
    RAISE NOTICE 'Valor P3 adicionado ao ENUM task_priority';
  ELSE
    RAISE NOTICE 'Valor P3 já existe no ENUM task_priority';
  END IF;
END $$;

-- ============================================
-- TASK_STATUS ENUM
-- ============================================

-- Adicionar in_progress se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'in_progress' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_status')
  ) THEN
    ALTER TYPE task_status ADD VALUE 'in_progress';
    RAISE NOTICE 'Valor in_progress adicionado ao ENUM task_status';
  ELSE
    RAISE NOTICE 'Valor in_progress já existe no ENUM task_status';
  END IF;
END $$;

-- Adicionar completed se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'completed' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_status')
  ) THEN
    ALTER TYPE task_status ADD VALUE 'completed';
    RAISE NOTICE 'Valor completed adicionado ao ENUM task_status';
  ELSE
    RAISE NOTICE 'Valor completed já existe no ENUM task_status';
  END IF;
END $$;

-- Adicionar cancelled se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'cancelled' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_status')
  ) THEN
    ALTER TYPE task_status ADD VALUE 'cancelled';
    RAISE NOTICE 'Valor cancelled adicionado ao ENUM task_status';
  ELSE
    RAISE NOTICE 'Valor cancelled já existe no ENUM task_status';
  END IF;
END $$;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Mostrar todos os valores de task_priority
SELECT 'task_priority ENUM values:' as info;
SELECT enumlabel as priority_value 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_priority')
ORDER BY enumsortorder;

-- Mostrar todos os valores de task_status
SELECT 'task_status ENUM values:' as info;
SELECT enumlabel as status_value 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'task_status')
ORDER BY enumsortorder;
