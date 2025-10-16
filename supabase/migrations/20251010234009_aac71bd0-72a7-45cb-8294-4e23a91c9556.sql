-- ============================================================================
-- FUTUREE AI SOLUTIONS - DATABASE SCHEMA
-- Migration completa do zero com autenticação e estrutura CRM
-- Data: 2025-10-16
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUMS
-- ============================================================================

-- Roles de usuário
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'user', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Status de lead
DO $$ BEGIN
  CREATE TYPE public.lead_status AS ENUM (
    'novo',
    'contatado', 
    'qualificado',
    'proposta',
    'negociacao',
    'ganho',
    'perdido'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Etapas do funil (compatível com código existente)
DO $$ BEGIN
  CREATE TYPE public.lead_stage AS ENUM (
    'capturado',
    'qualificar',
    'contato',
    'proposta',
    'fechamento'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Stages de qualificação
DO $$ BEGIN
  CREATE TYPE public.qualification_stage AS ENUM ('QLD', 'MQL', 'SQL', 'OPP');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Stages de deal
DO $$ BEGIN
  CREATE TYPE public.deal_stage AS ENUM (
    'prospeccao',
    'qualificacao',
    'proposta',
    'negociacao',
    'fechamento',
    'ganho',
    'perdido'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Prioridade de tasks
DO $$ BEGIN
  CREATE TYPE public.task_priority AS ENUM ('P1', 'P2', 'P3', 'baixa', 'media', 'alta', 'urgente');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Status de tasks
DO $$ BEGIN
  CREATE TYPE public.task_status AS ENUM ('todo', 'doing', 'done', 'em_progresso', 'concluida', 'cancelada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tipo de atividade
DO $$ BEGIN
  CREATE TYPE public.activity_type AS ENUM (
    'nota',
    'chamada',
    'email',
    'wa_msg',
    'sistema',
    'call',
    'meeting',
    'status_change'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Status de conversa
DO $$ BEGIN
  CREATE TYPE public.conversation_status AS ENUM ('aberta', 'encerrada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Direção de mensagem
DO $$ BEGIN
  CREATE TYPE public.message_direction AS ENUM ('in', 'out');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Modo SDR
DO $$ BEGIN
  CREATE TYPE public.sdr_mode AS ENUM ('ativo', 'pausado', 'leitura');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. TABELAS PRINCIPAIS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 3.1 PROFILES (Perfis de Usuário)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nome TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  phone TEXT,
  department TEXT,
  position TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ---------------------------------------------------------------------------
-- 3.2 COMPANIES (Empresas)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  name TEXT,
  cnpj TEXT,
  site TEXT,
  website TEXT,
  industry TEXT,
  size TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para companies
CREATE INDEX IF NOT EXISTS idx_companies_nome ON public.companies(nome);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON public.companies(cnpj);
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON public.companies(created_by);

-- ---------------------------------------------------------------------------
-- 3.3 LEADS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Informações básicas
  nome TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  position TEXT,
  
  -- Status e qualificação (campos duplos para compatibilidade)
  status lead_status DEFAULT 'novo',
  etapa lead_stage DEFAULT 'capturado',
  qualification_stage qualification_stage,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  
  -- Origem e tracking
  origem TEXT,
  source TEXT,
  campaign TEXT,
  medium TEXT,
  
  -- Dados comerciais
  estimated_value DECIMAL(12, 2),
  expected_close_date DATE,
  
  -- Interação
  last_contact_date TIMESTAMPTZ,
  proxima_acao_at TIMESTAMPTZ,
  next_action_date TIMESTAMPTZ,
  contact_count INTEGER DEFAULT 0,
  
  -- Metadados
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  lost_reason TEXT
);

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_owner ON public.leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_company ON public.leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_etapa ON public.leads(etapa);
CREATE INDEX IF NOT EXISTS idx_leads_qualification_stage ON public.leads(qualification_stage);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- ---------------------------------------------------------------------------
-- 3.4 DEALS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Informações do deal
  name TEXT,
  valor_previsto DECIMAL(12, 2),
  amount DECIMAL(12, 2),
  etapa deal_stage DEFAULT 'prospeccao',
  stage deal_stage DEFAULT 'prospeccao',
  probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  
  -- Datas importantes
  fechamento_previsto DATE,
  expected_close_date DATE,
  closed_date DATE,
  
  -- Status
  is_won BOOLEAN DEFAULT FALSE,
  is_lost BOOLEAN DEFAULT FALSE,
  lost_reason TEXT,
  
  -- Metadados
  products JSONB DEFAULT '[]',
  notes TEXT,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para deals
CREATE INDEX IF NOT EXISTS idx_deals_lead ON public.deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_owner ON public.deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_etapa ON public.deals(etapa);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_is_won ON public.deals(is_won);
CREATE INDEX IF NOT EXISTS idx_deals_expected_close ON public.deals(expected_close_date);

-- ---------------------------------------------------------------------------
-- 3.5 PROJECTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  title TEXT,
  descricao TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3.6 TASKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Informações da task
  titulo TEXT,
  title TEXT NOT NULL,
  descricao TEXT,
  description TEXT,
  status task_status DEFAULT 'todo',
  prioridade task_priority DEFAULT 'P2',
  priority task_priority DEFAULT 'media',
  
  -- Datas
  start_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Metadados
  tags TEXT[],
  attachments JSONB DEFAULT '[]',
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tasks
CREATE INDEX IF NOT EXISTS idx_tasks_lead ON public.tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_owner ON public.tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- ---------------------------------------------------------------------------
-- 3.7 ACTIVITIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Tipo e conteúdo
  tipo activity_type NOT NULL,
  type activity_type NOT NULL,
  title TEXT,
  texto TEXT,
  description TEXT,
  
  -- Metadados
  metadata JSONB DEFAULT '{}',
  actor TEXT,
  duration_minutes INTEGER,
  
  -- Data
  activity_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para activities
CREATE INDEX IF NOT EXISTS idx_activities_lead ON public.activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_tipo ON public.activities(tipo);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(activity_date DESC);

-- ---------------------------------------------------------------------------
-- 3.8 CONVERSATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  canal TEXT DEFAULT 'whatsapp',
  status conversation_status DEFAULT 'aberta',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON public.conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);

-- ---------------------------------------------------------------------------
-- 3.9 MESSAGES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  direction message_direction NOT NULL,
  texto TEXT NOT NULL,
  raw_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- ---------------------------------------------------------------------------
-- 3.10 SDR CONFIG
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sdr_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mode sdr_mode DEFAULT 'leitura',
  tom TEXT DEFAULT 'profissional',
  guardrails JSONB,
  horario_silencio JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3.11 AI RESULTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ai_results_lead ON public.ai_results(lead_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_kind ON public.ai_results(kind);

-- ============================================================================
-- 4. TABELAS PARA SUBSTITUIR LOCALSTORAGE
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 4.1 USER_PREFERENCES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  department TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4.2 COMPANY_SETTINGS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ---------------------------------------------------------------------------
-- 4.3 SAVED_FUNNELS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]',
  connections JSONB NOT NULL DEFAULT '[]',
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_funnels_user ON public.saved_funnels(user_id);

-- ---------------------------------------------------------------------------
-- 4.4 LANDING_PAGES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  components JSONB NOT NULL DEFAULT '[]',
  styles JSONB DEFAULT '{}',
  slug TEXT UNIQUE,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  views_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_user ON public.landing_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON public.landing_pages(slug);

-- ---------------------------------------------------------------------------
-- 4.5 AUTOMATION_SETTINGS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automation_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  settings_key TEXT NOT NULL,
  settings_value JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, settings_key)
);

CREATE INDEX IF NOT EXISTS idx_automation_settings_user ON public.automation_settings(user_id);

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.companies;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.leads;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.deals;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.projects;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.tasks;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.conversations;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.sdr_config;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.sdr_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.user_preferences;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.company_settings;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.saved_funnels;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.saved_funnels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.landing_pages;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.automation_settings;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.automation_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Trigger para criar perfil automaticamente
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Trigger para registrar mudanças de status
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.activities (lead_id, tipo, type, title, texto, description, metadata)
    VALUES (
      NEW.id,
      'status_change',
      'status_change',
      'Status alterado',
      format('Status alterado de "%s" para "%s"', OLD.status, NEW.status),
      format('Status alterado de "%s" para "%s"', OLD.status, NEW.status),
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  
  IF OLD.etapa IS DISTINCT FROM NEW.etapa THEN
    INSERT INTO public.activities (lead_id, tipo, type, title, texto, description, metadata)
    VALUES (
      NEW.id,
      'status_change',
      'status_change',
      'Etapa alterada',
      format('Etapa alterada de "%s" para "%s"', OLD.etapa, NEW.etapa),
      format('Etapa alterada de "%s" para "%s"', OLD.etapa, NEW.etapa),
      jsonb_build_object('old_etapa', OLD.etapa, 'new_etapa', NEW.etapa)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_lead_status_change ON public.leads;
CREATE TRIGGER track_lead_status_change
  AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.log_lead_status_change();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sdr_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

-- Policies para PROFILES
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON public.profiles;
CREATE POLICY "Usuários podem ver todos os perfis"
  ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policies para COMPANIES
DROP POLICY IF EXISTS "Usuários podem ver empresas" ON public.companies;
CREATE POLICY "Usuários podem ver empresas"
  ON public.companies FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar empresas" ON public.companies;
CREATE POLICY "Usuários podem criar empresas"
  ON public.companies FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem atualizar empresas" ON public.companies;
CREATE POLICY "Usuários podem atualizar empresas"
  ON public.companies FOR UPDATE TO authenticated USING (true);

-- Policies para LEADS
DROP POLICY IF EXISTS "Usuários podem ver todos leads" ON public.leads;
CREATE POLICY "Usuários podem ver todos leads"
  ON public.leads FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar leads" ON public.leads;
CREATE POLICY "Usuários podem criar leads"
  ON public.leads FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem atualizar leads" ON public.leads;
CREATE POLICY "Usuários podem atualizar leads"
  ON public.leads FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem deletar leads" ON public.leads;
CREATE POLICY "Usuários podem deletar leads"
  ON public.leads FOR DELETE TO authenticated USING (true);

-- Policies para DEALS
DROP POLICY IF EXISTS "Usuários podem ver deals" ON public.deals;
CREATE POLICY "Usuários podem ver deals"
  ON public.deals FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar deals" ON public.deals;
CREATE POLICY "Usuários podem criar deals"
  ON public.deals FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem atualizar deals" ON public.deals;
CREATE POLICY "Usuários podem atualizar deals"
  ON public.deals FOR UPDATE TO authenticated USING (true);

-- Policies para PROJECTS
DROP POLICY IF EXISTS "Usuários podem ver projetos" ON public.projects;
CREATE POLICY "Usuários podem ver projetos"
  ON public.projects FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar projetos" ON public.projects;
CREATE POLICY "Usuários podem criar projetos"
  ON public.projects FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem atualizar projetos" ON public.projects;
CREATE POLICY "Usuários podem atualizar projetos"
  ON public.projects FOR UPDATE TO authenticated USING (true);

-- Policies para TASKS
DROP POLICY IF EXISTS "Usuários podem ver tasks" ON public.tasks;
CREATE POLICY "Usuários podem ver tasks"
  ON public.tasks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar tasks" ON public.tasks;
CREATE POLICY "Usuários podem criar tasks"
  ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem atualizar tasks" ON public.tasks;
CREATE POLICY "Usuários podem atualizar tasks"
  ON public.tasks FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem deletar tasks" ON public.tasks;
CREATE POLICY "Usuários podem deletar tasks"
  ON public.tasks FOR DELETE TO authenticated USING (true);

-- Policies para ACTIVITIES
DROP POLICY IF EXISTS "Usuários podem ver atividades" ON public.activities;
CREATE POLICY "Usuários podem ver atividades"
  ON public.activities FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar atividades" ON public.activities;
CREATE POLICY "Usuários podem criar atividades"
  ON public.activities FOR INSERT TO authenticated WITH CHECK (true);

-- Policies para CONVERSATIONS
DROP POLICY IF EXISTS "Usuários podem ver conversas" ON public.conversations;
CREATE POLICY "Usuários podem ver conversas"
  ON public.conversations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar conversas" ON public.conversations;
CREATE POLICY "Usuários podem criar conversas"
  ON public.conversations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem atualizar conversas" ON public.conversations;
CREATE POLICY "Usuários podem atualizar conversas"
  ON public.conversations FOR UPDATE TO authenticated USING (true);

-- Policies para MESSAGES
DROP POLICY IF EXISTS "Usuários podem ver mensagens" ON public.messages;
CREATE POLICY "Usuários podem ver mensagens"
  ON public.messages FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar mensagens" ON public.messages;
CREATE POLICY "Usuários podem criar mensagens"
  ON public.messages FOR INSERT TO authenticated WITH CHECK (true);

-- Policies para SDR_CONFIG
DROP POLICY IF EXISTS "Usuários podem ver config SDR" ON public.sdr_config;
CREATE POLICY "Usuários podem ver config SDR"
  ON public.sdr_config FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar config SDR" ON public.sdr_config;
CREATE POLICY "Usuários podem atualizar config SDR"
  ON public.sdr_config FOR UPDATE TO authenticated USING (true);

-- Policies para AI_RESULTS
DROP POLICY IF EXISTS "Usuários podem ver resultados IA" ON public.ai_results;
CREATE POLICY "Usuários podem ver resultados IA"
  ON public.ai_results FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários podem criar resultados IA" ON public.ai_results;
CREATE POLICY "Usuários podem criar resultados IA"
  ON public.ai_results FOR INSERT TO authenticated WITH CHECK (true);

-- Policies para USER_PREFERENCES
DROP POLICY IF EXISTS "Usuários podem ver próprias preferências" ON public.user_preferences;
CREATE POLICY "Usuários podem ver próprias preferências"
  ON public.user_preferences FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir preferências" ON public.user_preferences;
CREATE POLICY "Usuários podem inserir preferências"
  ON public.user_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar preferências" ON public.user_preferences;
CREATE POLICY "Usuários podem atualizar preferências"
  ON public.user_preferences FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Policies para COMPANY_SETTINGS
DROP POLICY IF EXISTS "Usuários podem ver company settings" ON public.company_settings;
CREATE POLICY "Usuários podem ver company settings"
  ON public.company_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir company settings" ON public.company_settings;
CREATE POLICY "Usuários podem inserir company settings"
  ON public.company_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar company settings" ON public.company_settings;
CREATE POLICY "Usuários podem atualizar company settings"
  ON public.company_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Policies para SAVED_FUNNELS
DROP POLICY IF EXISTS "Usuários podem ver funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem ver funis"
  ON public.saved_funnels FOR SELECT TO authenticated USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Usuários podem criar funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem criar funis"
  ON public.saved_funnels FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem atualizar funis"
  ON public.saved_funnels FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar funis" ON public.saved_funnels;
CREATE POLICY "Usuários podem deletar funis"
  ON public.saved_funnels FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies para LANDING_PAGES
DROP POLICY IF EXISTS "Usuários podem ver landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem ver landing pages"
  ON public.landing_pages FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Público pode ver landing pages publicadas" ON public.landing_pages;
CREATE POLICY "Público pode ver landing pages publicadas"
  ON public.landing_pages FOR SELECT TO anon USING (is_published = true);

DROP POLICY IF EXISTS "Usuários podem criar landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem criar landing pages"
  ON public.landing_pages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem atualizar landing pages"
  ON public.landing_pages FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar landing pages" ON public.landing_pages;
CREATE POLICY "Usuários podem deletar landing pages"
  ON public.landing_pages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies para AUTOMATION_SETTINGS
DROP POLICY IF EXISTS "Usuários podem ver automation settings" ON public.automation_settings;
CREATE POLICY "Usuários podem ver automation settings"
  ON public.automation_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir automation settings" ON public.automation_settings;
CREATE POLICY "Usuários podem inserir automation settings"
  ON public.automation_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar automation settings" ON public.automation_settings;
CREATE POLICY "Usuários podem atualizar automation settings"
  ON public.automation_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- 7. FUNÇÕES AUXILIARES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_leads', COUNT(*),
    'leads_this_month', COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW())),
    'avg_score', ROUND(AVG(score), 2),
    'conversion_rate', ROUND(
      (COUNT(*) FILTER (WHERE status = 'ganho')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
      2
    )
  )
  INTO stats
  FROM public.leads
  WHERE owner_id = user_id;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. HABILITAR REALTIME
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- ============================================================================
-- 9. COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE public.profiles IS 'Perfis de usuários do sistema';
COMMENT ON TABLE public.companies IS 'Empresas/Organizações cadastradas';
COMMENT ON TABLE public.leads IS 'Leads do CRM';
COMMENT ON TABLE public.deals IS 'Negócios/Oportunidades de venda';
COMMENT ON TABLE public.projects IS 'Projetos para agrupar tarefas';
COMMENT ON TABLE public.tasks IS 'Tarefas relacionadas aos leads';
COMMENT ON TABLE public.activities IS 'Histórico de atividades dos leads';
COMMENT ON TABLE public.conversations IS 'Conversas com leads';
COMMENT ON TABLE public.messages IS 'Mensagens das conversas';
COMMENT ON TABLE public.sdr_config IS 'Configuração do agente SDR';
COMMENT ON TABLE public.ai_results IS 'Resultados de processamento de IA';
COMMENT ON TABLE public.user_preferences IS 'Preferências do usuário (profile + tema)';
COMMENT ON TABLE public.company_settings IS 'Configurações da empresa do usuário';
COMMENT ON TABLE public.saved_funnels IS 'Funis salvos pelo usuário';
COMMENT ON TABLE public.landing_pages IS 'Landing pages criadas pelo usuário';
COMMENT ON TABLE public.automation_settings IS 'Configurações de automação';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================