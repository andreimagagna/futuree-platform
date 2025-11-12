-- ============================================
-- MIGRATION: SDR Agent Tables
-- Versão: 1.0
-- Data: 2025-10-28
-- ============================================

-- Tabela: sdr_leads
-- Armazena os leads do WhatsApp
CREATE TABLE IF NOT EXISTS sdr_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT UNIQUE NOT NULL, -- Número do WhatsApp (ex: 5511999999999)
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction TIMESTAMPTZ,
  timeout TIMESTAMPTZ, -- Controle de atendimento humano
  crm_id TEXT, -- ID do lead no CRM principal
  
  -- Metadados adicionais
  push_name TEXT, -- Nome do perfil do WhatsApp
  profile_picture_url TEXT,
  status TEXT DEFAULT 'active', -- active, blocked, archived
  
  -- Índices
  CONSTRAINT valid_number CHECK (number ~ '^[0-9]+$')
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sdr_leads_number ON sdr_leads(number);
CREATE INDEX IF NOT EXISTS idx_sdr_leads_timeout ON sdr_leads(timeout);
CREATE INDEX IF NOT EXISTS idx_sdr_leads_created_at ON sdr_leads(created_at DESC);

-- Comentários
COMMENT ON TABLE sdr_leads IS 'Leads gerenciados pelo Agente SDR via WhatsApp';
COMMENT ON COLUMN sdr_leads.timeout IS 'Quando o timeout estiver no futuro, o bot fica em silêncio (modo humano)';

-- ============================================

-- Tabela: sdr_chat_memory
-- Armazena o histórico de conversas
CREATE TABLE IF NOT EXISTS sdr_chat_memory (
  session_id TEXT PRIMARY KEY, -- Usa o número do WhatsApp como ID
  history JSONB DEFAULT '[]'::jsonb, -- Array de mensagens
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadados
  message_count INTEGER GENERATED ALWAYS AS (jsonb_array_length(history)) STORED
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sdr_chat_memory_updated ON sdr_chat_memory(updated_at DESC);

-- Comentários
COMMENT ON TABLE sdr_chat_memory IS 'Histórico de conversas do Agente SDR (memória da IA)';
COMMENT ON COLUMN sdr_chat_memory.history IS 'Array de objetos: [{ role: "human"|"ai", content: "...", timestamp: "..." }]';

-- ============================================

-- Tabela: sdr_meetings
-- Armazena agendamentos de reuniões
CREATE TABLE IF NOT EXISTS sdr_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES sdr_leads(id) ON DELETE CASCADE,
  
  -- Dados do agendamento
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'scheduled', -- scheduled, confirmed, cancelled, completed
  
  -- Observações
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sdr_meetings_lead_id ON sdr_meetings(lead_id);
CREATE INDEX IF NOT EXISTS idx_sdr_meetings_date ON sdr_meetings(date, time);
CREATE INDEX IF NOT EXISTS idx_sdr_meetings_status ON sdr_meetings(status);

-- Comentários
COMMENT ON TABLE sdr_meetings IS 'Reuniões agendadas pelo Agente SDR';
COMMENT ON COLUMN sdr_meetings.status IS 'Status: scheduled (agendada), confirmed (confirmada), cancelled (cancelada), completed (realizada)';

-- ============================================

-- Tabela: sdr_agent_config
-- Configurações do agente
CREATE TABLE IF NOT EXISTS sdr_agent_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Configurações gerais
  enabled BOOLEAN DEFAULT true,
  auto_respond BOOLEAN DEFAULT true,
  qualify_leads BOOLEAN DEFAULT true,
  
  -- Timings
  human_takeover_timeout INTEGER DEFAULT 15, -- minutos
  typing_buffer_delay INTEGER DEFAULT 7, -- segundos
  
  -- IA
  max_tokens_per_response INTEGER DEFAULT 500,
  temperature NUMERIC(3,2) DEFAULT 0.7,
  
  -- Horário comercial
  business_hours_only BOOLEAN DEFAULT false,
  business_hours_start TIME DEFAULT '09:00',
  business_hours_end TIME DEFAULT '18:00',
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insere configuração padrão
INSERT INTO sdr_agent_config (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE sdr_agent_config IS 'Configurações globais do Agente SDR';

-- ============================================

-- Tabela: sdr_agent_logs
-- Logs de atividade do agente
CREATE TABLE IF NOT EXISTS sdr_agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES sdr_leads(id) ON DELETE SET NULL,
  
  -- Tipo de evento
  event_type TEXT NOT NULL, -- message_received, message_sent, meeting_scheduled, error, etc.
  
  -- Dados do evento
  data JSONB DEFAULT '{}'::jsonb,
  
  -- Resultado
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sdr_logs_created_at ON sdr_agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sdr_logs_event_type ON sdr_agent_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_sdr_logs_lead_id ON sdr_agent_logs(lead_id);

COMMENT ON TABLE sdr_agent_logs IS 'Logs de atividade do Agente SDR para auditoria';

-- ============================================

-- Function: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_sdr_meetings_updated_at
  BEFORE UPDATE ON sdr_meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sdr_agent_config_updated_at
  BEFORE UPDATE ON sdr_agent_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sdr_chat_memory_updated_at
  BEFORE UPDATE ON sdr_chat_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================

-- RLS (Row Level Security) - Opcional
-- Descomente se quiser ativar RLS

-- ALTER TABLE sdr_leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sdr_chat_memory ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sdr_meetings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sdr_agent_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de exemplo (ajuste conforme sua necessidade)
-- CREATE POLICY "Permitir leitura para usuários autenticados"
--   ON sdr_leads FOR SELECT
--   USING (auth.role() = 'authenticated');

-- ============================================

-- Views úteis

-- View: Estatísticas do agente
CREATE OR REPLACE VIEW sdr_agent_stats AS
SELECT
  (SELECT COUNT(*) FROM sdr_leads) AS total_leads,
  (SELECT COUNT(*) FROM sdr_leads WHERE created_at >= CURRENT_DATE) AS leads_today,
  (SELECT COUNT(*) FROM sdr_meetings WHERE status = 'scheduled') AS meetings_scheduled,
  (SELECT COUNT(*) FROM sdr_meetings WHERE date = CURRENT_DATE) AS meetings_today,
  (SELECT COUNT(*) FROM sdr_chat_memory WHERE updated_at >= CURRENT_DATE) AS active_conversations_today;

COMMENT ON VIEW sdr_agent_stats IS 'Estatísticas em tempo real do Agente SDR';

-- ============================================

GRANT ALL ON sdr_leads TO postgres, anon, authenticated, service_role;
GRANT ALL ON sdr_chat_memory TO postgres, anon, authenticated, service_role;
GRANT ALL ON sdr_meetings TO postgres, anon, authenticated, service_role;
GRANT ALL ON sdr_agent_config TO postgres, anon, authenticated, service_role;
GRANT ALL ON sdr_agent_logs TO postgres, anon, authenticated, service_role;
GRANT SELECT ON sdr_agent_stats TO postgres, anon, authenticated, service_role;
