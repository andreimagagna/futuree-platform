-- ============================================================================
-- MIGRATION: Marketing Solutions - Tabelas Completas
-- Created: 2025-10-22
-- Purpose: Criar todas as tabelas para o módulo de Marketing
-- ============================================================================

-- ============================================================================
-- 1. CAMPANHAS DE MARKETING
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('email', 'social', 'ads', 'content', 'events', 'other')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  
  -- Datas
  start_date timestamptz,
  end_date timestamptz,
  
  -- Budget
  budget numeric(10, 2),
  spent numeric(10, 2) DEFAULT 0,
  
  -- Métricas
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  revenue numeric(10, 2) DEFAULT 0,
  
  -- Configurações
  target_audience jsonb DEFAULT '[]'::jsonb, -- Segmentos alvo
  channels jsonb DEFAULT '[]'::jsonb, -- Canais utilizados
  goals jsonb DEFAULT '[]'::jsonb, -- Objetivos da campanha
  
  -- Metadata
  owner_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 2. FUNIS DE CONVERSÃO (EM BREVE)
-- ============================================================================
-- CREATE TABLE IF NOT EXISTS marketing_funnels (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   
--   -- Informações básicas
--   name text NOT NULL,
--   description text,
--   type text DEFAULT 'sales' CHECK (type IN ('sales', 'lead_generation', 'awareness', 'engagement', 'retention')),
--   status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
--   
--   -- Estrutura do funil (JSON com stages)
--   stages jsonb NOT NULL DEFAULT '[]'::jsonb,
--   -- Exemplo: [
--   --   {id: "1", name: "Awareness", conversions: 1000, dropoff: 200},
--   --   {id: "2", name: "Interest", conversions: 800, dropoff: 300},
--   --   {id: "3", name: "Decision", conversions: 500, dropoff: 100},
--   --   {id: "4", name: "Action", conversions: 400, dropoff: 0}
--   -- ]
--   
--   -- Configurações
--   automation_rules jsonb DEFAULT '[]'::jsonb, -- Regras de automação
--   triggers jsonb DEFAULT '[]'::jsonb, -- Gatilhos
--   
--   -- Métricas
--   total_entries integer DEFAULT 0,
--   total_conversions integer DEFAULT 0,
--   conversion_rate numeric(5, 2) DEFAULT 0,
--   
--   -- Relacionamentos
--   campaign_id uuid,
--   
--   -- Metadata
--   owner_id uuid,
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now()
-- );

-- ============================================================================
-- 3. LANDING PAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  name text NOT NULL,
  slug text UNIQUE NOT NULL, -- URL slug
  title text,
  description text,
  
  -- Status
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Conteúdo (JSON builder)
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Exemplo: [
  --   {type: "hero", title: "...", subtitle: "...", cta: {...}},
  --   {type: "features", items: [...]},
  --   {type: "pricing", plans: [...]},
  --   {type: "testimonials", items: [...]},
  --   {type: "form", fields: [...]}
  -- ]
  
  -- SEO
  meta_title text,
  meta_description text,
  meta_keywords text[],
  
  -- Design
  theme jsonb DEFAULT '{}'::jsonb, -- Cores, fontes, etc
  custom_css text,
  custom_js text,
  
  -- Tracking
  analytics_code text, -- Google Analytics, etc
  pixel_code text, -- Facebook Pixel, etc
  
  -- Métricas
  views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  conversions integer DEFAULT 0,
  conversion_rate numeric(5, 2) DEFAULT 0,
  
  -- Relacionamentos
  campaign_id uuid,
  
  -- Metadata
  owner_id uuid,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 4. TESTES A/B
-- ============================================================================
CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  name text NOT NULL,
  description text,
  hypothesis text, -- Hipótese do teste
  
  -- Status
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'cancelled')),
  
  -- Configuração
  test_type text NOT NULL CHECK (test_type IN ('landing_page', 'email', 'ad', 'cta', 'headline', 'other')),
  traffic_split jsonb DEFAULT '{"A": 50, "B": 50}'::jsonb, -- % de tráfego por variante
  
  -- Variantes
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Exemplo: [
  --   {id: "A", name: "Control", content: {...}, metrics: {...}},
  --   {id: "B", name: "Variant 1", content: {...}, metrics: {...}}
  -- ]
  
  -- Datas
  start_date timestamptz,
  end_date timestamptz,
  
  -- Métricas globais
  total_participants integer DEFAULT 0,
  confidence_level numeric(5, 2) DEFAULT 0,
  winner_variant text, -- ID da variante vencedora
  
  -- Relacionamentos
  landing_page_id uuid,
  campaign_id uuid,
  
  -- Metadata
  owner_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 5. BRANDING / IDENTIDADE VISUAL
-- ============================================================================
CREATE TABLE IF NOT EXISTS brand_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações da marca
  company_name text NOT NULL,
  tagline text,
  description text,
  
  -- Cores
  primary_color text DEFAULT '#3B82F6',
  secondary_color text DEFAULT '#10B981',
  accent_color text DEFAULT '#F59E0B',
  text_color text DEFAULT '#1F2937',
  background_color text DEFAULT '#FFFFFF',
  
  -- Tipografia
  font_heading text DEFAULT 'Inter',
  font_body text DEFAULT 'Inter',
  
  -- Logos
  logo_url text,
  logo_dark_url text, -- Logo para dark mode
  favicon_url text,
  
  -- Imagens
  og_image_url text, -- Open Graph image
  cover_image_url text,
  
  -- Redes sociais
  social_links jsonb DEFAULT '{}'::jsonb,
  -- Exemplo: {"facebook": "...", "instagram": "...", "linkedin": "..."}
  
  -- Contato
  email text,
  phone text,
  address jsonb DEFAULT '{}'::jsonb,
  
  -- Configurações adicionais
  custom_domain text,
  custom_styles jsonb DEFAULT '{}'::jsonb,
  
  -- Metadata
  owner_id uuid,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 6. SEGMENTOS DE LEADS
-- ============================================================================
CREATE TABLE IF NOT EXISTS lead_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  name text NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'users',
  
  -- Tipo de segmento
  type text NOT NULL DEFAULT 'manual' CHECK (type IN ('manual', 'dynamic', 'smart')),
  
  -- Regras de segmentação (para segmentos dinâmicos)
  rules jsonb DEFAULT '[]'::jsonb,
  -- Exemplo: [
  --   {field: "score", operator: ">=", value: 80},
  --   {field: "tags", operator: "contains", value: "vip"},
  --   {field: "status", operator: "equals", value: "qualified"}
  -- ]
  
  -- Leads incluídos (para segmentos manuais)
  lead_ids uuid[] DEFAULT ARRAY[]::uuid[],
  
  -- Métricas
  lead_count integer DEFAULT 0,
  active_count integer DEFAULT 0,
  conversion_rate numeric(5, 2) DEFAULT 0,
  
  -- Relacionamentos
  campaign_id uuid,
  
  -- Metadata
  owner_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 7. ÍNDICES para performance
-- ============================================================================

-- Campanhas
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON marketing_campaigns(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_owner ON marketing_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON marketing_campaigns(start_date, end_date);

-- Funis (Em breve)
-- CREATE INDEX IF NOT EXISTS idx_funnels_campaign ON marketing_funnels(campaign_id);
-- CREATE INDEX IF NOT EXISTS idx_funnels_owner ON marketing_funnels(owner_id);

-- Landing Pages
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_campaign ON landing_pages(campaign_id);

-- Testes A/B
CREATE INDEX IF NOT EXISTS idx_ab_tests_landing_page ON ab_tests(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_campaign ON ab_tests(campaign_id);

-- Segmentos
CREATE INDEX IF NOT EXISTS idx_segments_type ON lead_segments(type);
CREATE INDEX IF NOT EXISTS idx_segments_campaign ON lead_segments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_segments_owner ON lead_segments(owner_id);

-- ============================================================================
-- 8. RLS (Row Level Security) Policies
-- ============================================================================

-- Campanhas
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own campaigns" ON marketing_campaigns;
CREATE POLICY "Users can view their own campaigns" ON marketing_campaigns
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create campaigns" ON marketing_campaigns;
CREATE POLICY "Users can create campaigns" ON marketing_campaigns
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own campaigns" ON marketing_campaigns;
CREATE POLICY "Users can update their own campaigns" ON marketing_campaigns
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete their own campaigns" ON marketing_campaigns;
CREATE POLICY "Users can delete their own campaigns" ON marketing_campaigns
  FOR DELETE USING (true);

-- Funis (Em breve)
-- ALTER TABLE marketing_funnels ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Users can view their own funnels" ON marketing_funnels;
-- CREATE POLICY "Users can view their own funnels" ON marketing_funnels
--   FOR SELECT USING (true);
-- 
-- DROP POLICY IF EXISTS "Users can create funnels" ON marketing_funnels;
-- CREATE POLICY "Users can create funnels" ON marketing_funnels
--   FOR INSERT WITH CHECK (true);
-- 
-- DROP POLICY IF EXISTS "Users can update their own funnels" ON marketing_funnels;
-- CREATE POLICY "Users can update their own funnels" ON marketing_funnels
--   FOR UPDATE USING (true);
-- 
-- DROP POLICY IF EXISTS "Users can delete their own funnels" ON marketing_funnels;
-- CREATE POLICY "Users can delete their own funnels" ON marketing_funnels
--   FOR DELETE USING (true);

-- Landing Pages
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own landing pages" ON landing_pages;
CREATE POLICY "Users can view their own landing pages" ON landing_pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create landing pages" ON landing_pages;
CREATE POLICY "Users can create landing pages" ON landing_pages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own landing pages" ON landing_pages;
CREATE POLICY "Users can update their own landing pages" ON landing_pages
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete their own landing pages" ON landing_pages;
CREATE POLICY "Users can delete their own landing pages" ON landing_pages
  FOR DELETE USING (true);

-- Testes A/B
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own ab tests" ON ab_tests;
CREATE POLICY "Users can view their own ab tests" ON ab_tests
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create ab tests" ON ab_tests;
CREATE POLICY "Users can create ab tests" ON ab_tests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own ab tests" ON ab_tests;
CREATE POLICY "Users can update their own ab tests" ON ab_tests
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete their own ab tests" ON ab_tests;
CREATE POLICY "Users can delete their own ab tests" ON ab_tests
  FOR DELETE USING (true);

-- Branding
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own brand settings" ON brand_settings;
CREATE POLICY "Users can view their own brand settings" ON brand_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create brand settings" ON brand_settings;
CREATE POLICY "Users can create brand settings" ON brand_settings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own brand settings" ON brand_settings;
CREATE POLICY "Users can update their own brand settings" ON brand_settings
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete their own brand settings" ON brand_settings;
CREATE POLICY "Users can delete their own brand settings" ON brand_settings
  FOR DELETE USING (true);

-- Segmentos
ALTER TABLE lead_segments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own segments" ON lead_segments;
CREATE POLICY "Users can view their own segments" ON lead_segments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create segments" ON lead_segments;
CREATE POLICY "Users can create segments" ON lead_segments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own segments" ON lead_segments;
CREATE POLICY "Users can update their own segments" ON lead_segments
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete their own segments" ON lead_segments;
CREATE POLICY "Users can delete their own segments" ON lead_segments
  FOR DELETE USING (true);

-- ============================================================================
-- 9. TRIGGERS para updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_funnels_updated_at BEFORE UPDATE ON marketing_funnels
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_settings_updated_at BEFORE UPDATE ON brand_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_segments_updated_at BEFORE UPDATE ON lead_segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE marketing_campaigns IS 'Campanhas de marketing com métricas e tracking';
-- COMMENT ON TABLE marketing_funnels IS 'Funis de conversão com stages e automação';
COMMENT ON TABLE landing_pages IS 'Landing pages criadas com builder visual';
COMMENT ON TABLE ab_tests IS 'Testes A/B para otimização de conversão';
COMMENT ON TABLE brand_settings IS 'Configurações de identidade visual da marca';
COMMENT ON TABLE lead_segments IS 'Segmentos de leads para targeting e análise';
