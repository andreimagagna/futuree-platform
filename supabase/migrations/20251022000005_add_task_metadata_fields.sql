-- Migration: Adicionar campos de metadata às tasks
-- Created: 2025-10-22
-- Purpose: Adicionar checklist, comments e activities como JSONB até criarmos tabelas separadas

-- Adicionar campo checklist (array de objetos: {id, text, done})
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS checklist jsonb DEFAULT '[]'::jsonb;

-- Adicionar campo comments (array de objetos: {id, content, createdAt, createdBy})
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS comments jsonb DEFAULT '[]'::jsonb;

-- Adicionar campo activities (array de objetos: {id, type, content, createdAt, createdBy, metadata})
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS task_activities jsonb DEFAULT '[]'::jsonb;

-- Adicionar campo watchers (array de UUIDs de usuários)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS watchers jsonb DEFAULT '[]'::jsonb;

-- Adicionar campo time_tracked (minutos)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS time_tracked integer DEFAULT 0;

-- Adicionar campo estimated_time (minutos)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS estimated_time integer;

-- Adicionar campo due_time (hora da tarefa)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS due_time text;

-- Adicionar campo parent_task_id (para subtarefas)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS parent_task_id uuid REFERENCES tasks(id) ON DELETE CASCADE;

-- Adicionar campo project_id (se ainda não existir)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS project_id uuid;

-- Comentários nas colunas
COMMENT ON COLUMN tasks.checklist IS 'Lista de checklist da task (JSONB array)';
COMMENT ON COLUMN tasks.comments IS 'Comentários da task (JSONB array)';
COMMENT ON COLUMN tasks.task_activities IS 'Atividades relacionadas à task (JSONB array)';
COMMENT ON COLUMN tasks.watchers IS 'IDs de usuários observando a task (JSONB array)';
COMMENT ON COLUMN tasks.time_tracked IS 'Tempo rastreado em minutos';
COMMENT ON COLUMN tasks.estimated_time IS 'Tempo estimado em minutos';
COMMENT ON COLUMN tasks.due_time IS 'Hora de vencimento da task (HH:MM)';
COMMENT ON COLUMN tasks.parent_task_id IS 'ID da task pai (para subtarefas)';
COMMENT ON COLUMN tasks.project_id IS 'ID do projeto relacionado';
