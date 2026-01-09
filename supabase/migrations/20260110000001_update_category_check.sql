-- Atualiza a constraint de categoria para incluir 'perdido'
ALTER TABLE public.crm_funnel_stages DROP CONSTRAINT IF EXISTS crm_funnel_stages_category_check;

ALTER TABLE public.crm_funnel_stages 
  ADD CONSTRAINT crm_funnel_stages_category_check 
  CHECK (category IN ('topo', 'meio', 'fundo', 'vendas', 'perdido'));
