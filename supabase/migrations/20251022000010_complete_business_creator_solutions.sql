-- ============================================================================
-- 🚀 MIGRAÇÃO COMPLETA - BUSINESS & CREATOR SOLUTIONS
-- ============================================================================
-- Data: 2025-10-22
-- Descrição: Cria TODAS as tabelas para Business e Creator Solutions
-- Total: 11 tabelas + RLS + Triggers + Indexes
-- ============================================================================

-- ============================================================================
-- SECTION 1: BUSINESS SOLUTIONS (5 TABELAS)
-- ============================================================================

-- ============================================================================
-- 1. CUSTOMER SUCCESS METRICS (Base de Clientes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cs_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação do Cliente
  customer_id UUID DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  
  -- Métricas de Saúde
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  nps_score INTEGER CHECK (nps_score >= -100 AND nps_score <= 100),
  mrr NUMERIC DEFAULT 0,
  churn_risk TEXT CHECK (churn_risk IN ('low', 'medium', 'high')),
  
  -- Datas importantes
  last_interaction DATE,
  contract_end_date DATE,
  
  -- Observações
  notes TEXT,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cs_metrics_owner ON public.cs_metrics(owner_id);
CREATE INDEX IF NOT EXISTS idx_cs_metrics_customer ON public.cs_metrics(customer_id);
CREATE INDEX IF NOT EXISTS idx_cs_metrics_health ON public.cs_metrics(health_score);
CREATE INDEX IF NOT EXISTS idx_cs_metrics_churn ON public.cs_metrics(churn_risk);

ALTER TABLE public.cs_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own CS metrics"
  ON public.cs_metrics FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 2. FINANCE RECORDS (Registros Financeiros)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.finance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Tipo e Categoria
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Valores
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  
  -- Status
  status TEXT CHECK (status IN ('pago', 'pendente', 'atrasado')),
  payment_method TEXT,
  
  -- Observações
  notes TEXT,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_records_owner ON public.finance_records(owner_id);
CREATE INDEX IF NOT EXISTS idx_finance_records_type ON public.finance_records(type);
CREATE INDEX IF NOT EXISTS idx_finance_records_date ON public.finance_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_finance_records_status ON public.finance_records(status);

ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own finance records"
  ON public.finance_records FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 3. STRATEGIC GOALS (Objetivos Estratégicos / OKRs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.strategic_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  title TEXT NOT NULL,
  description TEXT,
  
  -- Classificação
  category TEXT CHECK (category IN ('financeiro', 'crescimento', 'produto', 'operacional', 'pessoas')),
  priority TEXT CHECK (priority IN ('alta', 'media', 'baixa')),
  
  -- Status e Progresso
  status TEXT CHECK (status IN ('nao-iniciado', 'em-andamento', 'concluido', 'pausado')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Datas
  deadline DATE,
  
  -- Key Results (OKRs)
  key_results JSONB DEFAULT '[]'::jsonb,
  
  -- Responsabilidade
  responsible TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategic_goals_owner ON public.strategic_goals(owner_id);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_status ON public.strategic_goals(status);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_category ON public.strategic_goals(category);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_priority ON public.strategic_goals(priority);

ALTER TABLE public.strategic_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own strategic goals"
  ON public.strategic_goals FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 4. DOCUMENTS (Sistema de Arquivos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações do arquivo/pasta
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file', 'folder')),
  file_type TEXT,
  size_bytes BIGINT DEFAULT 0,
  path TEXT NOT NULL,
  
  -- Estrutura hierárquica
  parent_folder_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  
  -- Organização
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Compartilhamento
  is_shared BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  
  -- Auditoria
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_owner ON public.documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_parent ON public.documents(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_path ON public.documents(path);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON public.documents FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 5. NOTION PAGES (Páginas estilo Notion)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notion_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações da página
  title TEXT NOT NULL,
  icon TEXT,
  cover TEXT,
  description TEXT,
  
  -- Conteúdo (blocos estilo Notion)
  blocks JSONB DEFAULT '[]'::jsonb,
  
  -- Organização
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Configurações
  is_favorite BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  
  -- Workspace
  workspace_id UUID,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notion_pages_owner ON public.notion_pages(owner_id);
CREATE INDEX IF NOT EXISTS idx_notion_pages_workspace ON public.notion_pages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notion_pages_favorite ON public.notion_pages(is_favorite);
CREATE INDEX IF NOT EXISTS idx_notion_pages_blocks ON public.notion_pages USING GIN (blocks);

ALTER TABLE public.notion_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notion pages"
  ON public.notion_pages FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- SECTION 2: CREATOR SOLUTIONS (5 TABELAS)
-- ============================================================================

-- ============================================================================
-- 6. CREATOR IDENTITY (Identidade do Creator)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.creator_identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações Pessoais
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  bio TEXT,
  
  -- Público-alvo
  target_audience TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Objetivos (JSON: {attraction: bool, authority: bool, engagement: bool, conversion: bool})
  objectives JSONB DEFAULT '{}'::jsonb,
  
  -- Tom de Voz
  tone_of_voice TEXT,
  
  -- Mídia
  avatar_url TEXT,
  banner_url TEXT,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creator_identity_owner ON public.creator_identity(owner_id);

ALTER TABLE public.creator_identity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own creator identity"
  ON public.creator_identity FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 7. CONTENT PILLARS (Pilares de Conteúdo)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.content_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações do Pilar
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  
  -- Objetivo do Pilar
  objective TEXT CHECK (objective IN ('attraction', 'authority', 'engagement', 'conversion')),
  
  -- Público-alvo específico
  target_audience TEXT,
  
  -- Tópicos-chave
  key_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Métricas
  content_count INTEGER DEFAULT 0,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_pillars_owner ON public.content_pillars(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_pillars_objective ON public.content_pillars(objective);

ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own content pillars"
  ON public.content_pillars FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 8. EDITORIAL CALENDAR (Calendário Editorial)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.editorial_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações do Conteúdo
  title TEXT NOT NULL,
  pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL,
  
  -- Plataforma e Formato
  platform TEXT CHECK (platform IN ('instagram', 'linkedin', 'tiktok', 'youtube', 'blog', 'twitter', 'facebook')),
  format TEXT CHECK (format IN ('post', 'reel', 'video', 'article', 'story', 'carousel', 'podcast')),
  
  -- Datas
  scheduled_date DATE,
  published_date DATE,
  
  -- Status
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  
  -- Conteúdo
  content_text TEXT,
  media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Storytelling (JSON: {hook, story, value, cta})
  storytelling JSONB DEFAULT '{}'::jsonb,
  
  -- Métricas (JSON: {views, likes, comments, shares, saves, reach, engagement_rate})
  metrics JSONB DEFAULT '{}'::jsonb,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editorial_calendar_owner ON public.editorial_calendar(owner_id);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_pillar ON public.editorial_calendar(pillar_id);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_platform ON public.editorial_calendar(platform);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_status ON public.editorial_calendar(status);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_scheduled ON public.editorial_calendar(scheduled_date);

ALTER TABLE public.editorial_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own editorial calendar"
  ON public.editorial_calendar FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 9. CONTENT IDEAS (Banco de Ideias)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações da Ideia
  title TEXT NOT NULL,
  description TEXT,
  
  -- Relacionamento
  pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL,
  
  -- Plataforma e Formato sugeridos
  platform TEXT,
  format TEXT,
  
  -- Status
  status TEXT CHECK (status IN ('idea', 'in-progress', 'scheduled', 'published', 'archived')),
  priority TEXT CHECK (priority IN ('alta', 'media', 'baixa')),
  
  -- Inspiração
  inspiration_source TEXT,
  notes TEXT,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_ideas_owner ON public.content_ideas(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_pillar ON public.content_ideas(pillar_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_status ON public.content_ideas(status);
CREATE INDEX IF NOT EXISTS idx_content_ideas_priority ON public.content_ideas(priority);

ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own content ideas"
  ON public.content_ideas FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- 10. STORYTELLING TEMPLATES (Templates de Storytelling)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.storytelling_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações do Template
  name TEXT NOT NULL,
  description TEXT,
  
  -- Estrutura (JSON: {hook, story, value, cta})
  structure JSONB NOT NULL,
  
  -- Caso de Uso
  use_case TEXT,
  
  -- Template padrão do sistema
  is_default BOOLEAN DEFAULT false,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_storytelling_templates_owner ON public.storytelling_templates(owner_id);
CREATE INDEX IF NOT EXISTS idx_storytelling_templates_default ON public.storytelling_templates(is_default);

ALTER TABLE public.storytelling_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all default templates"
  ON public.storytelling_templates FOR SELECT USING (is_default = true OR auth.uid() = owner_id);

CREATE POLICY "Users can manage their own templates"
  ON public.storytelling_templates FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own templates"
  ON public.storytelling_templates FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own templates"
  ON public.storytelling_templates FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================================
-- SECTION 3: PROCESSOS OPERACIONAIS (1 TABELA)
-- ============================================================================

-- ============================================================================
-- 11. OPERATIONAL PROCESSES (Processos Operacionais)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.operational_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações do Processo
  name TEXT NOT NULL,
  description TEXT,
  
  -- Categoria
  category TEXT CHECK (category IN ('vendas', 'marketing', 'cs', 'financeiro', 'operacoes', 'rh', 'ti', 'outro')),
  
  -- Status
  status TEXT CHECK (status IN ('ativo', 'em-revisao', 'pausado', 'desativado')),
  
  -- Passos (JSON: [{id, title, description, order, responsible}])
  steps JSONB DEFAULT '[]'::jsonb,
  
  -- Responsabilidade
  responsible TEXT,
  team_members TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- SLA
  sla_hours INTEGER,
  
  -- Automação
  automation_level TEXT CHECK (automation_level IN ('manual', 'semi-auto', 'automatizado')),
  
  -- Última execução
  last_execution_date DATE,
  
  -- Métricas (JSON: {avg_time, success_rate, executions_count})
  metrics JSONB DEFAULT '{}'::jsonb,
  
  -- Auditoria
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operational_processes_owner ON public.operational_processes(owner_id);
CREATE INDEX IF NOT EXISTS idx_operational_processes_category ON public.operational_processes(category);
CREATE INDEX IF NOT EXISTS idx_operational_processes_status ON public.operational_processes(status);
CREATE INDEX IF NOT EXISTS idx_operational_processes_automation ON public.operational_processes(automation_level);

ALTER TABLE public.operational_processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own operational processes"
  ON public.operational_processes FOR ALL USING (auth.uid() = owner_id);

-- ============================================================================
-- SECTION 4: TRIGGERS DE UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas as tabelas
CREATE TRIGGER trigger_cs_metrics_updated_at
  BEFORE UPDATE ON public.cs_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_finance_records_updated_at
  BEFORE UPDATE ON public.finance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_strategic_goals_updated_at
  BEFORE UPDATE ON public.strategic_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notion_pages_updated_at
  BEFORE UPDATE ON public.notion_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_creator_identity_updated_at
  BEFORE UPDATE ON public.creator_identity
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_content_pillars_updated_at
  BEFORE UPDATE ON public.content_pillars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_editorial_calendar_updated_at
  BEFORE UPDATE ON public.editorial_calendar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_content_ideas_updated_at
  BEFORE UPDATE ON public.content_ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_storytelling_templates_updated_at
  BEFORE UPDATE ON public.storytelling_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_operational_processes_updated_at
  BEFORE UPDATE ON public.operational_processes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 5: COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE public.cs_metrics IS 'Métricas de Customer Success para base de clientes';
COMMENT ON TABLE public.finance_records IS 'Registros financeiros (receitas e despesas)';
COMMENT ON TABLE public.strategic_goals IS 'Objetivos estratégicos e OKRs';
COMMENT ON TABLE public.documents IS 'Sistema de arquivos e documentos com estrutura hierárquica';
COMMENT ON TABLE public.notion_pages IS 'Páginas estilo Notion para base de conhecimento';
COMMENT ON TABLE public.creator_identity IS 'Identidade e posicionamento do creator';
COMMENT ON TABLE public.content_pillars IS 'Pilares de conteúdo estratégico';
COMMENT ON TABLE public.editorial_calendar IS 'Calendário editorial para planejamento de conteúdo';
COMMENT ON TABLE public.content_ideas IS 'Banco de ideias de conteúdo';
COMMENT ON TABLE public.storytelling_templates IS 'Templates de storytelling reutilizáveis';
COMMENT ON TABLE public.operational_processes IS 'Processos operacionais e workflows';

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

-- Verificação final
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'cs_metrics',
        'finance_records',
        'strategic_goals',
        'documents',
        'notion_pages',
        'creator_identity',
        'content_pillars',
        'editorial_calendar',
        'content_ideas',
        'storytelling_templates',
        'operational_processes'
    );
    
    RAISE NOTICE '✅ Migração concluída! % tabelas criadas/verificadas', table_count;
END $$;
