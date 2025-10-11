-- Criação de ENUMs para o sistema
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.lead_stage AS ENUM ('capturado', 'qualificar', 'contato', 'proposta', 'fechamento');
CREATE TYPE public.qualification_stage AS ENUM ('QLD', 'MQL', 'SQL', 'OPP');
CREATE TYPE public.deal_stage AS ENUM ('prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechamento', 'ganho', 'perdido');
CREATE TYPE public.task_priority AS ENUM ('P1', 'P2', 'P3');
CREATE TYPE public.task_status AS ENUM ('todo', 'doing', 'done');
CREATE TYPE public.activity_type AS ENUM ('nota', 'chamada', 'email', 'wa_msg', 'sistema');
CREATE TYPE public.conversation_status AS ENUM ('aberta', 'encerrada');
CREATE TYPE public.message_direction AS ENUM ('in', 'out');
CREATE TYPE public.sdr_mode AS ENUM ('ativo', 'pausado', 'leitura');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT,
  role app_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de roles (segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Função de segurança para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Tabela de empresas
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  site TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  origem TEXT,
  etapa lead_stage DEFAULT 'capturado',
  qualification_stage qualification_stage,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  proxima_acao_at TIMESTAMPTZ,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de deals
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  valor_previsto DECIMAL(12, 2),
  etapa deal_stage DEFAULT 'prospeccao',
  fechamento_previsto DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de projetos (opcional, para agrupamento)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  prioridade task_priority DEFAULT 'P2',
  status task_status DEFAULT 'todo',
  start_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de atividades (timeline)
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  tipo activity_type NOT NULL,
  texto TEXT,
  metadata JSONB,
  actor TEXT, -- 'user' ou 'agente'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de conversas
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  canal TEXT DEFAULT 'whatsapp',
  status conversation_status DEFAULT 'aberta',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  direction message_direction NOT NULL,
  texto TEXT NOT NULL,
  raw_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de configuração do agente SDR
CREATE TABLE public.sdr_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode sdr_mode DEFAULT 'leitura',
  tom TEXT DEFAULT 'profissional',
  guardrails JSONB,
  horario_silencio JSONB, -- ex: {"inicio": "22:00", "fim": "08:00"}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configuração padrão do SDR
INSERT INTO public.sdr_config (id, mode, tom, guardrails, horario_silencio)
VALUES (
  gen_random_uuid(),
  'leitura',
  'profissional',
  '{"max_mensagens_por_dia": 50, "aguardar_resposta_minutos": 30}'::jsonb,
  '{"inicio": "22:00", "fim": "08:00"}'::jsonb
);

-- Tabela de resultados da IA
CREATE TABLE public.ai_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  kind TEXT NOT NULL, -- 'intent', 'qualifiers', 'score', 'sentiment'
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
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

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver todos os perfis"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas RLS para user_roles
CREATE POLICY "Usuários autenticados podem ver roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

-- Políticas RLS para companies
CREATE POLICY "Usuários podem ver todas empresas"
  ON public.companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar empresas"
  ON public.companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar empresas"
  ON public.companies FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas RLS para leads
CREATE POLICY "Usuários podem ver todos leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar leads"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem deletar leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para deals
CREATE POLICY "Usuários podem ver todos deals"
  ON public.deals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar deals"
  ON public.deals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar deals"
  ON public.deals FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas RLS para projects
CREATE POLICY "Usuários podem ver todos projetos"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar projetos"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar projetos"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas RLS para tasks
CREATE POLICY "Usuários podem ver todas tarefas"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar tarefas"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar tarefas"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem deletar tarefas"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para activities
CREATE POLICY "Usuários podem ver todas atividades"
  ON public.activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar atividades"
  ON public.activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para conversations
CREATE POLICY "Usuários podem ver todas conversas"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar conversas"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar conversas"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas RLS para messages
CREATE POLICY "Usuários podem ver todas mensagens"
  ON public.messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar mensagens"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para sdr_config
CREATE POLICY "Usuários podem ver configuração SDR"
  ON public.sdr_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar configuração SDR"
  ON public.sdr_config FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas RLS para ai_results
CREATE POLICY "Usuários podem ver resultados IA"
  ON public.ai_results FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar resultados IA"
  ON public.ai_results FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    'user'
  );
  
  -- Adicionar role padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sdr_config_updated_at
  BEFORE UPDATE ON public.sdr_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Realtime para mensagens e atividades
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;