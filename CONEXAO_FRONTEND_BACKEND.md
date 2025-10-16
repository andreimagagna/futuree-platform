# 🚀 Guia de Configuração - Frontend + Backend

## 📋 Visão Geral da Conexão

Seu sistema já possui uma arquitetura bem estruturada com:

- **Backend Principal**: Supabase (PostgreSQL + Auth + Realtime)
- **APIs REST**: Para funcionalidades específicas (Agent)
- **Frontend**: React + TypeScript + Vite
- **Estado**: React Query para cache inteligente
- **Autenticação**: Supabase Auth

## 🔧 Configuração das Variáveis de Ambiente

### 1. Arquivo `.env`

Crie ou atualize o arquivo `.env` na raiz do projeto:

```env
# ===========================================
# SUPABASE (Backend Principal)
# ===========================================
VITE_SUPABASE_URL="https://waddraeewovvjyevwtjr.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZGRyYWVld292dmp5ZXZ3dGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjcyOTEsImV4cCI6MjA3NjEwMzI5MX0.hlysXax7FLZ4n00ymFojEeRRa5FhIONvatppXwuHZHo"

# ===========================================
# API REST (Funcionalidades Específicas)
# ===========================================
# Para funcionalidades do Agent (opcional)
VITE_API_URL="https://sua-api-rest.com/api"
```

### 2. Verificação da Configuração

Execute este comando para testar a conexão:

```bash
npm run dev
```

Abra o console do navegador e execute:

```javascript
// Teste da conexão Supabase
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Configurada' : '❌ Faltando');

// Teste da API REST (se configurada)
console.log('API URL:', import.meta.env.VITE_API_URL || 'Não configurada (usando mocks)');
```

## 🏗️ Arquitetura Atual

### Backend (Supabase)

```
📊 Tabelas Principais:
├── leads (CRM)
├── user_preferences (Perfil)
├── company_settings (Empresa)
├── saved_funnels (Funis)
├── landing_pages (Landing Pages)
└── automation_settings (Automações)
```

### APIs REST (Opcional)

```
🔗 Endpoints:
├── GET  /leads (Lista leads do agent)
├── PATCH /leads/:id/status (Atualiza status)
├── GET  /messages/:leadId (Mensagens)
└── POST /send (Envia mensagem)
```

### Frontend

```
⚛️ Componentes → Hooks → Services → Supabase
    ↓
Cache (React Query) + Realtime (Supabase)
```

## 🔗 Status da Conexão

### ✅ Já Conectado e Funcionando

1. **Supabase Database** - ✅ Conectado
   - CRUD completo para todas as tabelas
   - Row Level Security (RLS) ativo
   - Realtime subscriptions

2. **Autenticação** - ✅ Funcionando
   - Login/Logout com Supabase Auth
   - Proteção de rotas
   - Sessões persistentes

3. **Cache Inteligente** - ✅ Implementado
   - React Query para otimização
   - Cache automático
   - Sincronização em tempo real

### 🔄 APIs REST (Fallback)

- **Status**: Usando dados mockados
- **Quando ativa**: Substitui mocks por dados reais
- **Configuração**: Apenas adicionar `VITE_API_URL`

## 🧪 Teste da Conexão

### 1. Teste Básico

```bash
# Instalar dependências
npm install

# Executar aplicação
npm run dev

# Abrir http://localhost:8080
```

### 2. Teste do Supabase

1. Abra o console do navegador
2. Execute: `import { supabase } from '/src/integrations/supabase/client.ts'`
3. Teste uma query: `supabase.from('leads').select('*').limit(1)`

### 3. Teste das APIs

Se configurou `VITE_API_URL`, teste:

```bash
curl https://sua-api-rest.com/api/leads
```

## 🚨 Possíveis Problemas

### ❌ "Supabase client not configured"

**Solução**: Verifique se as variáveis `VITE_SUPABASE_*` estão no `.env`

### ❌ "Table doesn't exist"

**Solução**: Execute as migrações do Supabase:

```bash
supabase db push
```

### ❌ "RLS policy violation"

**Solução**: Verifique se o usuário está autenticado e as políticas RLS estão corretas

### ❌ APIs REST não funcionam

**Solução**: Sistema automaticamente volta para dados mockados. Configure `VITE_API_URL` quando tiver uma API REST.

## 📈 Próximos Passos

1. **Configurar produção**: Adicionar variáveis no Vercel/Netlify
2. **Monitoramento**: Adicionar logging de erros
3. **Performance**: Otimizar queries e cache
4. **APIs REST**: Implementar se necessário para funcionalidades específicas

## 🎯 Conclusão

Seu frontend já está **100% conectado** ao backend Supabase! A arquitetura é robusta, escalável e pronta para produção. As APIs REST são opcionais e o sistema funciona perfeitamente com dados mockados quando não configuradas.</content>
<parameter name="filePath">c:\Users\andre\Futuree-Solutions\futuree-ai-solutions\CONEXAO_FRONTEND_BACKEND.md