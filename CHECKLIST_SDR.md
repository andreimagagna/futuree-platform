# ✅ CHECKLIST DE INSTALAÇÃO DO AGENTE SDR

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 PRÉ-REQUISITOS

- [ ] Node.js 18+ instalado
- [ ] Conta no Supabase criada
- [ ] Conta no Cohere AI criada
- [ ] Instância Evolution API configurada
- [ ] (Opcional) Conta OpenAI para STT de áudio

## 🔧 CONFIGURAÇÃO INICIAL

### 1. Dependências

- [ ] Executei `npm install` no diretório principal
- [ ] Executei `npm install` no diretório `backend`
- [ ] Instalei `cohere-ai`: `npm install cohere-ai`
- [ ] Instalei dependências do backend: `cd backend && npm install axios express cors @supabase/supabase-js cohere-ai`

### 2. Variáveis de Ambiente

- [ ] Copiei `.env.example` para `.env`
- [ ] Configurei `VITE_SUPABASE_URL`
- [ ] Configurei `VITE_SUPABASE_ANON_KEY`
- [ ] Configurei `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Configurei `VITE_COHERE_API_KEY`
- [ ] Configurei `COHERE_API_KEY`
- [ ] Configurei `VITE_EVOLUTION_API_URL`
- [ ] Configurei `VITE_EVOLUTION_API_KEY`
- [ ] Configurei `VITE_EVOLUTION_INSTANCE`
- [ ] Configurei `EVOLUTION_API_URL` (backend)
- [ ] Configurei `EVOLUTION_API_KEY` (backend)
- [ ] Configurei `EVOLUTION_INSTANCE` (backend)
- [ ] (Opcional) Configurei `VITE_OPENAI_API_KEY` para áudio

### 3. Banco de Dados

- [ ] Acessei o Supabase Dashboard
- [ ] Abri o SQL Editor
- [ ] Executei a migration `supabase/migrations/20251028_sdr_agent.sql`
- [ ] Verifiquei que as tabelas foram criadas:
  - [ ] `sdr_leads`
  - [ ] `sdr_chat_memory`
  - [ ] `sdr_meetings`
  - [ ] `sdr_agent_config`
  - [ ] `sdr_agent_logs`
- [ ] Verifiquei que a view `sdr_agent_stats` foi criada

### 4. Backend

- [ ] Iniciei o backend: `cd backend && node index.cjs`
- [ ] Vi a mensagem "Backend rodando na porta 4000"
- [ ] Testei o endpoint: `curl http://localhost:4000/api/webhook/whatsapp -d '{"test":true}'`
- [ ] Recebi resposta de sucesso

### 5. Webhook

**Desenvolvimento Local:**

- [ ] Instalei ngrok: `npm install -g ngrok`
- [ ] Executei `ngrok http 4000`
- [ ] Copiei a URL do ngrok (ex: `https://abc123.ngrok.io`)
- [ ] Configurei webhook na Evolution API: `https://abc123.ngrok.io/api/webhook/whatsapp`

**OU Produção:**

- [ ] Configurei webhook com URL pública: `https://meu-dominio.com/api/webhook/whatsapp`

**Configuração do Webhook:**

- [ ] Acessei painel da Evolution API
- [ ] Configurei webhook_url
- [ ] Ativei `webhook_by_events: true`
- [ ] Adicionei evento `messages.upsert`
- [ ] Salvei as configurações

### 6. Frontend

- [ ] Iniciei o frontend: `npm run dev`
- [ ] Acessei `http://localhost:5173/agent`
- [ ] Vi o painel do Agente SDR
- [ ] Vi as estatísticas (0 no início)
- [ ] Vi o SDRControlPanel

## 🧪 TESTES

### Teste 1: Backend

```bash
curl -X POST http://localhost:4000/api/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "event": "messages.upsert",
    "instance": "futuree-sdr",
    "data": {
      "key": {
        "remoteJid": "5511999999999@s.whatsapp.net",
        "fromMe": false,
        "id": "test-123"
      },
      "messageType": "conversation",
      "message": {
        "conversation": "Teste"
      },
      "pushName": "Teste"
    }
  }'
```

**Resultado esperado:**
- [ ] Recebi resposta `{"success": true, ...}`
- [ ] Vi logs no terminal do backend
- [ ] Não houve erros

### Teste 2: Supabase

No SQL Editor do Supabase:

```sql
-- Deve retornar as estatísticas
SELECT * FROM sdr_agent_stats;

-- Deve retornar vazio (ou dados se já testou)
SELECT * FROM sdr_leads LIMIT 5;
SELECT * FROM sdr_chat_memory LIMIT 5;
```

**Resultado esperado:**
- [ ] Queries executaram sem erros
- [ ] Vi estrutura das tabelas correta

### Teste 3: WhatsApp Real

- [ ] Enviei mensagem "Olá" para o número configurado
- [ ] Recebi resposta do agente em até 10 segundos
- [ ] A resposta foi natural e contextualizada
- [ ] Vi o lead criado no Supabase
- [ ] Vi o histórico salvo no chat_memory

### Teste 4: Buffer de Digitação

- [ ] Enviei "Oi"
- [ ] Imediatamente enviei "Tudo bem?"
- [ ] Imediatamente enviei "Quero saber sobre IA"
- [ ] O agente aguardou 7 segundos
- [ ] Respondeu uma única vez considerando todas as mensagens

### Teste 5: Modo Humano

- [ ] Acessei o painel `http://localhost:5173/agent`
- [ ] Cliquei em "Assumir Conversa" (se disponível)
- [ ] Enviei mensagem pelo WhatsApp
- [ ] O bot NÃO respondeu (modo humano ativo)
- [ ] Esperei 15 minutos ou desativei manualmente
- [ ] O bot voltou a responder

### Teste 6: Agendamento

- [ ] Conversei com o bot
- [ ] Pedi para agendar uma reunião
- [ ] O bot consultou disponibilidade
- [ ] Escolhi um horário
- [ ] Forneci nome e email
- [ ] O bot confirmou o agendamento
- [ ] Vi o agendamento na tabela `sdr_meetings`

## 🔍 VERIFICAÇÕES DE SEGURANÇA

- [ ] `.env` está no `.gitignore`
- [ ] Não expus API keys no código frontend
- [ ] Webhook usa HTTPS em produção
- [ ] (Opcional) Ativei RLS no Supabase

## 📊 MONITORAMENTO

- [ ] Configurei logs do backend
- [ ] Configurei alertas de erro
- [ ] Monitorei uso da API Cohere
- [ ] Monitorei uso da API OpenAI (se aplicável)

## ✅ FINALIZAÇÃO

- [ ] Li `SDR_AGENT_README.md` completamente
- [ ] Li `INSTALACAO_SDR.md` completamente
- [ ] Entendi o fluxo do sistema
- [ ] Testei todos os recursos principais
- [ ] Sistema está funcionando 100%

## 🎉 PRONTO PARA PRODUÇÃO?

Antes de colocar em produção:

- [ ] Testei por pelo menos 1 semana em desenvolvimento
- [ ] Testei todos os cenários (texto, áudio, imagem)
- [ ] Testei edge cases (mensagens estranhas, erros, etc.)
- [ ] Configurei backup do banco de dados
- [ ] Configurei monitoramento de uptime
- [ ] Documentei processo de manutenção
- [ ] Treinei equipe para usar o painel

## 📞 SUPORTE

Se algum item falhou, consulte:

1. **Logs do Backend**: Verifique o terminal onde `node index.cjs` está rodando
2. **Console do Navegador**: Pressione F12 e veja erros
3. **Supabase Logs**: Acesse Logs no Supabase Dashboard
4. **Evolution API Logs**: Verifique logs da sua instância

## 🐛 PROBLEMAS COMUNS

### ❌ "Cannot find module 'axios'"
```bash
cd backend && npm install axios
```

### ❌ "Cannot find module 'cohere-ai'"
```bash
npm install cohere-ai
```

### ❌ "Table sdr_leads does not exist"
Execute a migration SQL novamente no Supabase.

### ❌ "Unauthorized" no Cohere
Verifique se `VITE_COHERE_API_KEY` está correto e tem créditos.

### ❌ Bot não responde
1. Verifique logs do backend
2. Confirme que webhook está configurado
3. Teste com curl primeiro
4. Verifique se não está em modo humano

### ❌ "Error: connect ECONNREFUSED"
A Evolution API não está rodando ou URL está errada.

---

**Data da instalação:** _____________

**Instalado por:** _____________

**Status:** [ ] Em Desenvolvimento  [ ] Em Testes  [ ] Em Produção
