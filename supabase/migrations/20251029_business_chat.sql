-- Migration: Create business_chat_sessions table
-- Created: 2025-10-29
-- Description: Tabela para armazenar sessões de chat business com IA

CREATE TABLE IF NOT EXISTS business_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_chat_sessions_user_id ON business_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_business_chat_sessions_updated_at ON business_chat_sessions(updated_at DESC);

-- RLS (Row Level Security)
ALTER TABLE business_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own chat sessions
CREATE POLICY "Users can access their own chat sessions" ON business_chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_business_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_chat_sessions_updated_at
  BEFORE UPDATE ON business_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_business_chat_sessions_updated_at();

-- Grant permissions
GRANT ALL ON business_chat_sessions TO postgres, anon, authenticated, service_role;

-- Comments
COMMENT ON TABLE business_chat_sessions IS 'Sessões de chat business com IA - armazena histórico de conversas';
COMMENT ON COLUMN business_chat_sessions.messages IS 'Array de mensagens no formato: [{id, role, message, timestamp}]';