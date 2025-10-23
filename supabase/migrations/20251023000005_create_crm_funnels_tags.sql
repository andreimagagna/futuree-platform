-- ============================================================================
-- MIGRATION: CRM Funnels & Tags Management
-- Data: 2025-10-23
-- Descrição: Cria tabelas para persistir funis personalizados do CRM e tags globais
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABELA: crm_funnels (Funis do CRM - diferente de saved_funnels do marketing)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Informações do funil
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  
  -- Configurações
  settings JSONB DEFAULT '{}',
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para crm_funnels
CREATE INDEX IF NOT EXISTS idx_crm_funnels_owner ON public.crm_funnels(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_funnels_default ON public.crm_funnels(is_default);

-- RLS para crm_funnels
ALTER TABLE public.crm_funnels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own funnels" ON public.crm_funnels;
CREATE POLICY "Users can view own funnels" ON public.crm_funnels
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own funnels" ON public.crm_funnels;
CREATE POLICY "Users can insert own funnels" ON public.crm_funnels
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own funnels" ON public.crm_funnels;
CREATE POLICY "Users can update own funnels" ON public.crm_funnels
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own funnels" ON public.crm_funnels;
CREATE POLICY "Users can delete own funnels" ON public.crm_funnels
  FOR DELETE USING (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- 2. TABELA: crm_funnel_stages (Estágios personalizados de cada funil)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_funnel_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funnel_id UUID NOT NULL REFERENCES public.crm_funnels(id) ON DELETE CASCADE,
  
  -- Informações do estágio
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  order_index INTEGER NOT NULL DEFAULT 0,
  
  -- Categoria inteligente (topo, meio, fundo, vendas)
  category TEXT CHECK (category IN ('topo', 'meio', 'fundo', 'vendas')),
  
  -- Configurações
  settings JSONB DEFAULT '{}',
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para crm_funnel_stages
CREATE INDEX IF NOT EXISTS idx_crm_funnel_stages_funnel ON public.crm_funnel_stages(funnel_id);
CREATE INDEX IF NOT EXISTS idx_crm_funnel_stages_order ON public.crm_funnel_stages(funnel_id, order_index);

-- RLS para crm_funnel_stages
ALTER TABLE public.crm_funnel_stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view stages of own funnels" ON public.crm_funnel_stages;
CREATE POLICY "Users can view stages of own funnels" ON public.crm_funnel_stages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.crm_funnels 
      WHERE crm_funnels.id = crm_funnel_stages.funnel_id 
      AND crm_funnels.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert stages to own funnels" ON public.crm_funnel_stages;
CREATE POLICY "Users can insert stages to own funnels" ON public.crm_funnel_stages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.crm_funnels 
      WHERE crm_funnels.id = crm_funnel_stages.funnel_id 
      AND crm_funnels.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update stages of own funnels" ON public.crm_funnel_stages;
CREATE POLICY "Users can update stages of own funnels" ON public.crm_funnel_stages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.crm_funnels 
      WHERE crm_funnels.id = crm_funnel_stages.funnel_id 
      AND crm_funnels.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete stages of own funnels" ON public.crm_funnel_stages;
CREATE POLICY "Users can delete stages of own funnels" ON public.crm_funnel_stages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.crm_funnels 
      WHERE crm_funnels.id = crm_funnel_stages.funnel_id 
      AND crm_funnels.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 3. TABELA: crm_tags (Tags globais para organização)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Informações da tag
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  
  -- Contadores (denormalizados para performance)
  leads_count INTEGER DEFAULT 0,
  tasks_count INTEGER DEFAULT 0,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: tag única por usuário
  UNIQUE(owner_id, name)
);

-- Índices para crm_tags
CREATE INDEX IF NOT EXISTS idx_crm_tags_owner ON public.crm_tags(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_tags_name ON public.crm_tags(owner_id, name);

-- RLS para crm_tags
ALTER TABLE public.crm_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tags" ON public.crm_tags;
CREATE POLICY "Users can view own tags" ON public.crm_tags
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own tags" ON public.crm_tags;
CREATE POLICY "Users can insert own tags" ON public.crm_tags
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own tags" ON public.crm_tags;
CREATE POLICY "Users can update own tags" ON public.crm_tags
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own tags" ON public.crm_tags;
CREATE POLICY "Users can delete own tags" ON public.crm_tags
  FOR DELETE USING (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- 4. VINCULAR LEADS A FUNIS PERSONALIZADOS
-- ---------------------------------------------------------------------------
-- Adiciona coluna para vincular lead a funil e estágio personalizados
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS funnel_id UUID REFERENCES public.crm_funnels(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS funnel_stage_id UUID REFERENCES public.crm_funnel_stages(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_funnel ON public.leads(funnel_id);
CREATE INDEX IF NOT EXISTS idx_leads_funnel_stage ON public.leads(funnel_stage_id);

-- ---------------------------------------------------------------------------
-- 5. TRIGGERS PARA UPDATED_AT
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_crm_funnels_updated_at ON public.crm_funnels;
CREATE TRIGGER update_crm_funnels_updated_at
  BEFORE UPDATE ON public.crm_funnels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_funnel_stages_updated_at ON public.crm_funnel_stages;
CREATE TRIGGER update_crm_funnel_stages_updated_at
  BEFORE UPDATE ON public.crm_funnel_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_tags_updated_at ON public.crm_tags;
CREATE TRIGGER update_crm_tags_updated_at
  BEFORE UPDATE ON public.crm_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 6. FUNÇÃO PARA SINCRONIZAR CONTADORES DE TAGS
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sync_tag_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza contadores quando tags são adicionadas/removidas de leads
  IF TG_TABLE_NAME = 'leads' THEN
    -- Incrementa contador para novas tags
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
      UPDATE public.crm_tags
      SET leads_count = (
        SELECT COUNT(*) FROM public.leads 
        WHERE owner_id = NEW.owner_id 
        AND NEW.tags && ARRAY[crm_tags.name]
      )
      WHERE owner_id = NEW.owner_id
      AND name = ANY(NEW.tags);
    END IF;
    
    -- Decrementa contador para tags removidas
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
      UPDATE public.crm_tags
      SET leads_count = (
        SELECT COUNT(*) FROM public.leads 
        WHERE owner_id = OLD.owner_id 
        AND OLD.tags && ARRAY[crm_tags.name]
      )
      WHERE owner_id = OLD.owner_id
      AND name = ANY(OLD.tags);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 7. CRIAR FUNIL PADRÃO PARA USUÁRIOS EXISTENTES
-- ---------------------------------------------------------------------------
-- Insere funil padrão para cada usuário que ainda não tem
INSERT INTO public.crm_funnels (owner_id, name, is_default, order_index)
SELECT 
  id,
  'Funil Padrão',
  true,
  0
FROM public.profiles
WHERE NOT EXISTS (
  SELECT 1 FROM public.crm_funnels 
  WHERE crm_funnels.owner_id = profiles.id
)
ON CONFLICT DO NOTHING;

-- Insere estágios padrão para cada funil criado
INSERT INTO public.crm_funnel_stages (funnel_id, name, color, order_index, category)
SELECT 
  f.id,
  stage_data.name,
  stage_data.color,
  stage_data.order_index,
  stage_data.category
FROM public.crm_funnels f
CROSS JOIN (
  VALUES 
    ('Capturado', '#6B7280', 0, 'topo'),
    ('Qualificar', '#8B5CF6', 1, 'meio'),
    ('Demo', '#3B82F6', 2, 'meio'),
    ('POC', '#0EA5E9', 3, 'fundo'),
    ('Negociação', '#F59E0B', 4, 'vendas'),
    ('Fechado', '#10B981', 5, 'vendas')
) AS stage_data(name, color, order_index, category)
WHERE f.is_default = true
AND NOT EXISTS (
  SELECT 1 FROM public.crm_funnel_stages 
  WHERE crm_funnel_stages.funnel_id = f.id
)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 8. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ---------------------------------------------------------------------------
COMMENT ON TABLE public.crm_funnels IS 'Funis personalizados do CRM (diferente de saved_funnels que é para marketing visual)';
COMMENT ON TABLE public.crm_funnel_stages IS 'Estágios personalizados de cada funil do CRM';
COMMENT ON TABLE public.crm_tags IS 'Tags globais para organização de leads e tarefas';
COMMENT ON COLUMN public.crm_funnel_stages.category IS 'Categoria inteligente: topo, meio, fundo, vendas';
COMMENT ON COLUMN public.leads.funnel_id IS 'Vincula lead a um funil personalizado';
COMMENT ON COLUMN public.leads.funnel_stage_id IS 'Vincula lead a um estágio personalizado do funil';
