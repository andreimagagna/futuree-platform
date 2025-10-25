# 📊 Database Schema - Futuree AI Solutions

## Visão Geral

Este documento descreve a estrutura completa do banco de dados PostgreSQL (Supabase) utilizado pela plataforma Futuree AI Solutions.

---

## 📋 Índice

- [Tabelas Principais](#tabelas-principais)
  - [leads](#leads)
  - [crm_funnels](#crm_funnels)
  - [crm_funnel_stages](#crm_funnel_stages)
  - [crm_tags](#crm_tags)
  - [activities](#activities)
  - [tasks](#tasks)
- [Tabelas de Marketing](#tabelas-de-marketing)
  - [saved_funnels](#saved_funnels)
  - [campaigns](#campaigns)
  - [landing_pages](#landing_pages)
  - [ab_tests](#ab_tests)
  - [lead_segments](#lead_segments)
- [Tabelas de Configuração](#tabelas-de-configuração)
  - [profiles](#profiles)
  - [companies](#companies)
  - [brand_settings](#brand_settings)
  - [lead_sources](#lead_sources)

---

## 📌 Tabelas Principais

### `leads`

Tabela central que armazena todos os leads/contatos do CRM.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ✅ | ID do usuário responsável (FK → auth.users) |
| `company_id` | `uuid` | ✅ | ID da empresa (FK → companies) |
| `name` | `text` | ❌ | Nome do lead (OBRIGATÓRIO) |
| `email` | `text` | ✅ | E-mail de contato |
| `phone` | `text` | ✅ | Telefone |
| `whatsapp` | `text` | ✅ | WhatsApp |
| `position` | `text` | ✅ | Cargo/Posição |
| `status` | `lead_status` | ✅ | Status do lead (enum) |
| `funnel_stage` | `funnel_stage` | ✅ | Estágio no funil (enum) |
| `funnel_id` | `uuid` | ✅ | Vincula lead a um funil personalizado |
| `funnel_stage_id` | `uuid` | ✅ | Vincula lead a um estágio personalizado |
| `score` | `integer` | ✅ | Pontuação/Score do lead |
| `source` | `text` | ✅ | Origem do lead (ex: website, indicação) |
| `campaign` | `text` | ✅ | Campanha de origem |
| `medium` | `text` | ✅ | Meio de origem (ex: social, email) |
| `estimated_value` | `numeric` | ✅ | Valor estimado do negócio |
| `expected_close_date` | `date` | ✅ | Data prevista de fechamento |
| `last_contact_date` | `timestamptz` | ✅ | Data do último contato |
| `next_action_date` | `timestamptz` | ✅ | Data da próxima ação agendada |
| `contact_count` | `integer` | ✅ | Contador de contatos |
| `tags` | `text[]` | ✅ | Array de tags |
| `custom_fields` | `jsonb` | ✅ | Campos personalizados (company, owner, BANT, etc) |
| `notes` | `text` | ✅ | Notas gerais |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |
| `converted_at` | `timestamptz` | ✅ | Data de conversão |
| `lost_reason` | `text` | ✅ | Motivo de perda (se perdido) |

**Enums:**
- `lead_status`: `'novo'`, `'em_contato'`, `'qualificado'`, `'proposta'`, `'negociacao'`, `'ganho'`, `'perdido'`
- `funnel_stage`: `'capturado'`, `'qualificacao'`, `'proposta'`, `'negociacao'`, `'fechamento'`

**Índices:**
- PK: `id`
- FK: `owner_id`, `company_id`, `funnel_id`, `funnel_stage_id`
- Index: `created_at`, `status`, `source`

---

### `crm_funnels`

Funis personalizados do CRM (Kanban).

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do usuário dono do funil |
| `name` | `text` | ❌ | Nome do funil |
| `is_default` | `boolean` | ✅ | Se é o funil padrão |
| `order_index` | `integer` | ✅ | Ordem de exibição |
| `settings` | `jsonb` | ✅ | Configurações adicionais |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

**RLS (Row Level Security):**
- ✅ Usuários só veem seus próprios funis
- ✅ Filtro automático por `owner_id`

---

### `crm_funnel_stages`

Estágios de cada funil do CRM.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `funnel_id` | `uuid` | ❌ | ID do funil (FK → crm_funnels) |
| `name` | `text` | ❌ | Nome do estágio |
| `color` | `text` | ✅ | Cor do estágio (hex) |
| `order_index` | `integer` | ✅ | Ordem no funil |
| `category` | `text` | ✅ | Categoria (topo, meio, fundo, vendas) |
| `settings` | `jsonb` | ✅ | Configurações adicionais |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

**Relacionamento:**
- N estágios → 1 funil
- Cascade delete: Se funil é deletado, estágios também são

---

### `crm_tags`

Tags para categorizar leads e oportunidades.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do usuário dono da tag |
| `name` | `text` | ❌ | Nome da tag |
| `color` | `text` | ✅ | Cor da tag (hex) |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

### `activities`

Registro de atividades/interações com leads.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `lead_id` | `uuid` | ✅ | ID do lead relacionado (FK → leads) |
| `user_id` | `uuid` | ✅ | ID do usuário que criou (FK → auth.users) |
| `type` | `text` | ❌ | Tipo (call, email, meeting, note, etc) |
| `title` | `text` | ❌ | Título da atividade |
| `description` | `text` | ✅ | Descrição detalhada |
| `completed` | `boolean` | ✅ | Se foi completada |
| `completed_at` | `timestamptz` | ✅ | Data de conclusão |
| `due_date` | `timestamptz` | ✅ | Data de vencimento |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

**Tipos comuns:**
- `call` - Chamada telefônica
- `email` - E-mail
- `meeting` - Reunião
- `note` - Nota/Anotação
- `whatsapp` - Mensagem WhatsApp

---

### `tasks`

Tarefas e ações a fazer relacionadas a leads.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `lead_id` | `uuid` | ✅ | ID do lead relacionado (FK → leads) |
| `created_by` | `uuid` | ✅ | ID do criador (FK → auth.users) |
| `assigned_to` | `uuid` | ✅ | ID do responsável (FK → auth.users) |
| `title` | `text` | ❌ | Título da task |
| `description` | `text` | ✅ | Descrição detalhada |
| `status` | `text` | ✅ | Status (pending, completed, cancelled) |
| `priority` | `text` | ✅ | Prioridade (P1, P2, P3) |
| `due_date` | `timestamptz` | ✅ | Data de vencimento |
| `completed_at` | `timestamptz` | ✅ | Data de conclusão |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

## 📣 Tabelas de Marketing

### `saved_funnels`

Funis visuais criados no Construtor de Funil.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `user_id` | `uuid` | ❌ | ID do criador (FK → auth.users) |
| `name` | `text` | ❌ | Nome do funil |
| `nodes` | `jsonb` | ✅ | Nós/Etapas do funil visual |
| `connections` | `jsonb` | ✅ | Conexões entre nós |
| `is_template` | `boolean` | ✅ | Se é um template |
| `is_public` | `boolean` | ✅ | Se é público |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

**Diferença:** `saved_funnels` são **visuais/marketing**, `crm_funnels` são **operacionais/vendas**

---

### `campaigns`

Campanhas de marketing.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do dono (FK → auth.users) |
| `name` | `text` | ❌ | Nome da campanha |
| `type` | `text` | ✅ | Tipo (email, social, ads, etc) |
| `status` | `text` | ✅ | Status (draft, active, paused, completed) |
| `budget` | `numeric` | ✅ | Orçamento |
| `spent` | `numeric` | ✅ | Valor gasto |
| `start_date` | `date` | ✅ | Data de início |
| `end_date` | `date` | ✅ | Data de término |
| `settings` | `jsonb` | ✅ | Configurações adicionais |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

### `landing_pages`

Landing pages criadas na plataforma.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do dono (FK → auth.users) |
| `name` | `text` | ❌ | Nome interno |
| `slug` | `text` | ❌ | URL slug (único) |
| `title` | `text` | ✅ | Título da página |
| `content` | `jsonb` | ✅ | Conteúdo/Blocos da página |
| `published` | `boolean` | ✅ | Se está publicada |
| `views` | `integer` | ✅ | Número de visualizações |
| `conversions` | `integer` | ✅ | Número de conversões |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

### `ab_tests`

Testes A/B de landing pages ou campanhas.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do dono (FK → auth.users) |
| `name` | `text` | ❌ | Nome do teste |
| `type` | `text` | ✅ | Tipo (landing_page, email, etc) |
| `status` | `text` | ✅ | Status (draft, running, completed) |
| `variants` | `jsonb` | ✅ | Variantes do teste |
| `results` | `jsonb` | ✅ | Resultados/Métricas |
| `winner` | `text` | ✅ | Variante vencedora |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

### `lead_segments`

Segmentações de leads para campanhas.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do dono (FK → auth.users) |
| `name` | `text` | ❌ | Nome do segmento |
| `filters` | `jsonb` | ✅ | Filtros de segmentação |
| `lead_count` | `integer` | ✅ | Número de leads no segmento |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

## ⚙️ Tabelas de Configuração

### `profiles`

Perfis de usuários (extensão de auth.users).

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | ID do usuário (PK, FK → auth.users) |
| `full_name` | `text` | ✅ | Nome completo |
| `avatar_url` | `text` | ✅ | URL do avatar |
| `company_id` | `uuid` | ✅ | ID da empresa (FK → companies) |
| `role` | `text` | ✅ | Papel/Cargo |
| `settings` | `jsonb` | ✅ | Configurações pessoais |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

### `companies`

Empresas/Organizações dos usuários.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `name` | `text` | ❌ | Nome da empresa |
| `domain` | `text` | ✅ | Domínio da empresa |
| `logo_url` | `text` | ✅ | URL do logo |
| `settings` | `jsonb` | ✅ | Configurações da empresa |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

### `brand_settings`

Configurações de marca/visual por usuário.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do dono (FK → auth.users) |
| `primary_color` | `text` | ✅ | Cor primária (hex) |
| `secondary_color` | `text` | ✅ | Cor secundária (hex) |
| `logo_url` | `text` | ✅ | URL do logo |
| `font_family` | `text` | ✅ | Família de fonte |
| `settings` | `jsonb` | ✅ | Outras configurações |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

### `lead_sources`

Fontes/Origens de leads configuráveis.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | `uuid` | ❌ | Identificador único (PK) |
| `owner_id` | `uuid` | ❌ | ID do dono (FK → auth.users) |
| `name` | `text` | ❌ | Nome da fonte |
| `active` | `boolean` | ✅ | Se está ativa |
| `settings` | `jsonb` | ✅ | Configurações adicionais |
| `created_at` | `timestamptz` | ✅ | Data de criação |
| `updated_at` | `timestamptz` | ✅ | Data de atualização |

---

## 🔐 Segurança (RLS)

### Row Level Security Policies

Todas as tabelas principais possuem **RLS (Row Level Security)** habilitado:

```sql
-- Exemplo de política RLS para leads
CREATE POLICY "Users can view their own leads"
ON leads FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own leads"
ON leads FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own leads"
ON leads FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own leads"
ON leads FOR DELETE
USING (owner_id = auth.uid());
```

**Tabelas com RLS:**
- ✅ `leads`
- ✅ `crm_funnels`
- ✅ `crm_funnel_stages` (via funnel)
- ✅ `crm_tags`
- ✅ `activities`
- ✅ `tasks`
- ✅ `saved_funnels`
- ✅ `campaigns`
- ✅ `landing_pages`
- ✅ `ab_tests`
- ✅ `lead_segments`
- ✅ `brand_settings`
- ✅ `lead_sources`

---

## 🔗 Relacionamentos Principais

```
auth.users (Supabase Auth)
  └── profiles (1:1)
  └── companies (N:1)
  └── leads (1:N) via owner_id
  └── crm_funnels (1:N)
      └── crm_funnel_stages (1:N)
  └── activities (1:N)
  └── tasks (1:N) via created_by/assigned_to
  └── campaigns (1:N)
  └── landing_pages (1:N)
  └── saved_funnels (1:N)

leads
  ├── activities (1:N)
  ├── tasks (1:N)
  ├── crm_funnels (N:1) via funnel_id
  └── crm_funnel_stages (N:1) via funnel_stage_id
```

---

## 📊 Campos JSONB Importantes

### `leads.custom_fields`

Estrutura flexível para dados personalizados:

```json
{
  "company": "Nome da Empresa",
  "owner": "Nome do Responsável",
  "owner_id": "uuid-do-responsável",
  "funnel_id": "uuid-do-funil",
  "stage_id": "uuid-do-estágio",
  "stage_name": "Nome do Estágio",
  "intended_funnel_stage": "captured",
  "website": "https://example.com",
  "companySize": "Pequena",
  "employeeCount": "1-10",
  "bant": {
    "budget": "Sim",
    "authority": "Não",
    "need": "Sim",
    "timeline": "3 meses"
  },
  "wonDate": "2025-10-23",
  "lostDate": null,
  "lostReason": null,
  "lostCompetitor": null
}
```

### `saved_funnels.nodes`

Estrutura de nós do funil visual:

```json
[
  {
    "id": "node-1",
    "type": "start",
    "label": "Captura",
    "metrics": { "leads": 100 }
  },
  {
    "id": "node-2",
    "type": "step",
    "label": "Qualificação",
    "metrics": { "leads": 75 }
  }
]
```

---

## 🗂️ Índices e Performance

### Índices Recomendados

```sql
-- Leads
CREATE INDEX idx_leads_owner_id ON leads(owner_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_funnel_id ON leads(funnel_id);
CREATE INDEX idx_leads_source ON leads(source);

-- Activities
CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_due_date ON activities(due_date);

-- Tasks
CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
```

---

## 📝 Notas Importantes

1. **Isolamento de Dados**: Todas as queries devem filtrar por `owner_id` ou usar RLS
2. **UUID v4**: Todos os IDs são UUIDs gerados pelo Supabase
3. **Timestamps**: Sempre em UTC com timezone (`timestamptz`)
4. **Soft Delete**: Considerar adicionar `deleted_at` para exclusão lógica
5. **Audit Trail**: Considerar tabela de auditoria para mudanças críticas
6. **JSONB**: Usar para dados flexíveis, mas cuidado com performance em queries complexas

---

## 🚀 Migrations

As migrations do Supabase estão em:
```
supabase/migrations/
├── 20251023000001_create_leads.sql
├── 20251023000002_create_crm_funnels.sql
├── 20251023000003_create_crm_tags.sql
├── 20251023000004_create_activities_tasks.sql
└── 20251023000005_create_crm_funnels_tags.sql
```

---

## 📚 Referências

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Última Atualização:** 24 de Outubro de 2025  
**Versão:** 1.0.0  
**Autor:** Futuree AI Solutions Team
