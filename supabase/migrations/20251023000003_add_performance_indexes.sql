-- =============================================
-- Migration: Performance Indexes for CRM Metrics
-- Created: 2025-10-23
-- Purpose: Otimizar queries de metas e relatórios
-- =============================================

-- Índice composto para buscar leads por owner e data
-- Usado em: Settings.tsx e Reports.tsx (query crmMetrics)
CREATE INDEX IF NOT EXISTS idx_leads_owner_created_status 
ON leads(owner_id, created_at DESC, status);

-- Índice para buscar leads ganhos (status = 'ganho' ou 'won')
CREATE INDEX IF NOT EXISTS idx_leads_status_estimated_value 
ON leads(status, estimated_value) 
WHERE status = 'ganho';

-- Índice composto para buscar activities por owner, tipo e data
-- Usado em: Settings.tsx e Reports.tsx (query crmMetrics)
CREATE INDEX IF NOT EXISTS idx_activities_user_type_date 
ON activities(user_id, type, activity_date DESC);

-- Índice para buscar reuniões especificamente
CREATE INDEX IF NOT EXISTS idx_activities_reuniao 
ON activities(user_id, activity_date DESC) 
WHERE type = 'reuniao';

-- Índice para company_goals por owner
-- Usado em: Settings.tsx e Reports.tsx
CREATE INDEX IF NOT EXISTS idx_company_goals_owner 
ON company_goals(owner_id, created_at DESC);

-- Comentários explicativos
COMMENT ON INDEX idx_leads_owner_created_status IS 
'Otimiza queries de leads filtradas por owner_id e data (Settings/Reports)';

COMMENT ON INDEX idx_leads_status_estimated_value IS 
'Otimiza cálculo de receita mensal (apenas leads ganhos)';

COMMENT ON INDEX idx_activities_user_type_date IS 
'Otimiza queries de activities filtradas por user_id, tipo e data';

COMMENT ON INDEX idx_activities_reuniao IS 
'Otimiza contagem de reuniões do mês (partial index, user_id)';

COMMENT ON INDEX idx_company_goals_owner IS 
'Otimiza busca de metas da empresa por owner_id';

-- =============================================
-- Análise de performance (opcional)
-- =============================================

-- Analyze tables para atualizar estatísticas
ANALYZE leads;
ANALYZE activities;
ANALYZE company_goals;

-- =============================================
-- Verificar índices criados
-- =============================================

-- Para verificar se os índices foram criados:
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
