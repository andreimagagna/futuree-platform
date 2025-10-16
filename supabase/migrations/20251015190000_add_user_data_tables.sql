-- ============================================================================
-- MIGRATION: Substituir localStorage por Supabase
-- Adiciona tabelas para armazenar dados que estavam no localStorage
-- Data: 2025-10-15
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. USER_PREFERENCES (Profile + Tema)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados do Profile
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  department TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  
  -- Preferências de UI
  theme TEXT DEFAULT 'light', -- 'light' ou 'dark'
  language TEXT DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_preferences_theme ON public.user_preferences(theme);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS set_updated_at_user_preferences ON public.user_preferences;
CREATE TRIGGER set_updated_at_user_preferences 
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver próprias preferências" ON public.user_preferences;
CREATE POLICY "Usuários podem ver próprias preferências"
  ON public.user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir próprias preferências" ON public.user_preferences;
CREATE POLICY "Usuários podem inserir próprias preferências"
  ON public.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar próprias preferências" ON public.user_preferences;
CREATE POLICY "Usuários podem atualizar próprias preferências"
  ON public.user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 2. COMPANY_SETTINGS (Dados da Empresa - Settings.tsx)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Informações da Empresa
  company_name TEXT,
  cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Brasil',
  website TEXT,
  business_area TEXT,
  company_size TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir apenas um registro por usuário
  UNIQUE(user_id)
);

-- Trigger
DROP TRIGGER IF EXISTS set_updated_at_company_settings ON public.company_settings;
CREATE TRIGGER set_updated_at_company_settings 
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver próprias configurações de empresa" ON public.company_settings;
CREATE POLICY "Usuários podem ver próprias configurações de empresa"
  ON public.company_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir configurações de empresa" ON public.company_settings;
CREATE POLICY "Usuários podem inserir configurações de empresa"
  ON public.company_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar configurações de empresa" ON public.company_settings;
CREATE POLICY "Usuários podem atualizar configurações de empresa"
  ON public.company_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. SAVED_FUNNELS (Construtor de Funil)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados do Funil
  name TEXT NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]',
  connections JSONB NOT NULL DEFAULT '[]',
  
  -- Metadados
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_saved_funnels_user ON public.saved_funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_funnels_name ON public.saved_funnels(name);

-- Trigger
DROP TRIGGER IF EXISTS set_updated_at_saved_funnels ON public.saved_funnels;
CREATE TRIGGER set_updated_at_saved_funnels 
  BEFORE UPDATE ON public.saved_funnels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.saved_funnels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver próprios funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem ver próprios funis"
  ON public.saved_funnels FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Usuários podem criar funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem criar funis"
  ON public.saved_funnels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar próprios funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem atualizar próprios funis"
  ON public.saved_funnels FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar próprios funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem deletar próprios funis"
  ON public.saved_funnels FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. LANDING_PAGES (Editor de Landing Pages)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados da Landing Page
  name TEXT NOT NULL,
  components JSONB NOT NULL DEFAULT '[]',
  styles JSONB DEFAULT '{}',
  
  -- Configurações
  slug TEXT UNIQUE,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_landing_pages_user ON public.landing_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON public.landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_published ON public.landing_pages(is_published);

-- Trigger
DROP TRIGGER IF EXISTS set_updated_at_landing_pages ON public.landing_pages;
CREATE TRIGGER set_updated_at_landing_pages 
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver próprias landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem ver próprias landing pages"
  ON public.landing_pages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Público pode ver landing pages publicadas" ON public.landing_pages;
CREATE POLICY "Público pode ver landing pages publicadas"
  ON public.landing_pages FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Usuários podem criar landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem criar landing pages"
  ON public.landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar próprias landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem atualizar próprias landing pages"
  ON public.landing_pages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar próprias landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem deletar próprias landing pages"
  ON public.landing_pages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. AUTOMATION_SETTINGS (Configurações de Automação)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automation_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Configurações
  settings_key TEXT NOT NULL,
  settings_value JSONB NOT NULL,
  
  -- Metadados
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir chave única por usuário
  UNIQUE(user_id, settings_key)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_automation_settings_user ON public.automation_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_settings_key ON public.automation_settings(settings_key);

-- Trigger
DROP TRIGGER IF EXISTS set_updated_at_automation_settings ON public.automation_settings;
CREATE TRIGGER set_updated_at_automation_settings 
  BEFORE UPDATE ON public.automation_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver próprias configurações de automação" ON public.automation_settings;
CREATE POLICY "Usuários podem ver próprias configurações de automação"
  ON public.automation_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir configurações de automação" ON public.automation_settings;
CREATE POLICY "Usuários podem inserir configurações de automação"
  ON public.automation_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar configurações de automação" ON public.automation_settings;
CREATE POLICY "Usuários podem atualizar configurações de automação"
  ON public.automation_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================
COMMENT ON TABLE public.user_preferences IS 'Preferências do usuário (profile + tema)';
COMMENT ON TABLE public.company_settings IS 'Configurações da empresa do usuário';
COMMENT ON TABLE public.saved_funnels IS 'Funis salvos pelo usuário';
COMMENT ON TABLE public.landing_pages IS 'Landing pages criadas pelo usuário';
COMMENT ON TABLE public.automation_settings IS 'Configurações de automação';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
