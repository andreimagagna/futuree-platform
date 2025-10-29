# 🤖 Agente SDR de IA para WhatsApp

Sistema completo de atendimento inteligente via WhatsApp usando Cohere AI, Evolution API e Supabase.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Fluxo de Funcionamento](#fluxo-de-funcionamento)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O Agente SDR é um assistente de vendas inteligente que:
- Atende leads automaticamente no WhatsApp
- Qualifica contatos usando IA (Cohere)
- Agenda reuniões comerciais
- Permite takeover humano a qualquer momento
- Processa texto, áudio e imagens

## ✨ Funcionalidades

### 🔥 Recursos Principais

- **Resposta Inteligente**: Usa Cohere Command-R+ para conversas naturais
- **Buffer de Digitação**: Aguarda 7 segundos para evitar respostas a mensagens "picadas"
- **Modo Humano**: Sistema de timeout que pausa o bot quando um humano assume
- **Processamento de Mídia**:
  - Texto: Processamento direto
  - Áudio: Transcrição automática (Whisper)
  - Imagem: Análise visual (Cohere Vision)
- **Simulação de Digitação**: Delays realistas e indicador "digitando..."
- **Ferramentas (Tools)**:
  - ✅ Verificar disponibilidade de agenda
  - ✅ Agendar reuniões
  - ✅ Reagendar reuniões
  - ✅ Cancelar reuniões
  - ✅ Consultar dia da semana
  - ✅ Calculadora

## 🛠️ Stack Tecnológica

| Tecnologia | Função |
|------------|--------|
| **Cohere AI** | LLM (Command-R+) para conversação e análise |
| **Supabase** | Banco de dados PostgreSQL + Real-time |
| **Evolution API** | Integração com WhatsApp |
| **OpenAI Whisper** | Speech-to-Text para áudios |
| **React + TypeScript** | Frontend |
| **Node.js + Express** | Backend/Webhook |

## 🏗️ Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  WhatsApp   │────────▶│ Evolution API│────────▶│   Webhook   │
│   (Usuário) │         │              │         │  (Backend)  │
└─────────────┘         └──────────────┘         └──────┬──────┘
                                                         │
                                                         ▼
                        ┌────────────────────────────────────┐
                        │    Controlador de Webhook          │
                        │  1. Valida mensagem                │
                        │  2. Gerencia lead                  │
                        │  3. Verifica modo humano           │
                        │  4. Processa mídia                 │
                        │  5. Buffer de digitação (7s)       │
                        └──────┬─────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │ Supabase │   │ Cohere AI│   │ Evolution│
         │  (DB)    │   │   (LLM)  │   │   (Send) │
         └──────────┘   └──────────┘   └──────────┘
```

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- Conta Supabase
- Chave API Cohere
- Instância Evolution API configurada
- (Opcional) Chave API OpenAI para STT

### 1. Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/andreimagagna/futuree-platform.git
cd futuree-platform

# Instale dependências
npm install

# Backend
cd backend
npm install
```

### 2. Configure Variáveis de Ambiente

```bash
# Copie o exemplo
cp .env.example .env

# Edite com suas credenciais
nano .env
```

### 3. Execute as Migrations

```bash
# No Supabase SQL Editor, execute:
supabase/migrations/20251028_sdr_agent.sql
```

### 4. Instale Dependências do Backend

```bash
cd backend
npm install express cors @supabase/supabase-js cohere-ai axios
```

## ⚙️ Configuração

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute a migration SQL (arquivo `supabase/migrations/20251028_sdr_agent.sql`)
3. Copie as credenciais para `.env`

### 2. Cohere AI

1. Crie uma conta em [cohere.com](https://cohere.com)
2. Gere uma API key
3. Adicione ao `.env`: `VITE_COHERE_API_KEY=sua-chave`

### 3. Evolution API

#### Opção A: Usar Evolution API Hospedada

```bash
VITE_EVOLUTION_API_URL=https://sua-evolution-api.com
VITE_EVOLUTION_API_KEY=sua-chave-aqui
VITE_EVOLUTION_INSTANCE=futuree-sdr
```

#### Opção B: Rodar Localmente

```bash
# Clone Evolution API
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# Configure e rode
docker-compose up -d
```

### 4. Configure o Webhook

No painel da Evolution API, configure o webhook:

```json
{
  "url": "https://seu-dominio.com/api/webhook/whatsapp",
  "webhook_by_events": true,
  "events": [
    "messages.upsert",
    "messages.update"
  ]
}
```

**Para desenvolvimento local, use [ngrok](https://ngrok.com):**

```bash
# Terminal 1: Rode o backend
npm run dev:backend

# Terminal 2: Exponha com ngrok
ngrok http 4000

# Use a URL do ngrok no webhook
# Ex: https://abc123.ngrok.io/api/webhook/whatsapp
```

## 🚀 Como Usar

### Iniciar o Sistema

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
node index.cjs
```

### Acessar a Interface

1. Abra [http://localhost:5173/agent](http://localhost:5173/agent)
2. Você verá o painel de controle do agente
3. Ative/desative o agente conforme necessário

### Testar no WhatsApp

1. Envie uma mensagem para o número configurado na Evolution API
2. O agente responderá automaticamente
3. Acompanhe a conversa no painel

### Assumir Atendimento (Modo Humano)

1. No painel, clique em "Assumir Conversa"
2. O bot pausa por 15 minutos
3. Você pode responder manualmente
4. Clique em "Reativar Bot" para voltar ao modo automático

## 🔄 Fluxo de Funcionamento

### 1. Recebimento de Mensagem

```
WhatsApp → Evolution API → POST /api/webhook/whatsapp
```

### 2. Validação Inicial

- ✅ Verifica se não é mensagem própria (`fromMe === false`)
- ✅ Verifica tipo de mensagem suportada

### 3. Gerenciamento de Lead

- Busca lead pelo número
- Se não existe: cria novo lead + registro no CRM
- Atualiza `timeout` (agora + 15min)

### 4. Verificação de Modo Humano

```javascript
if (agora < lead.timeout) {
  // Humano atendendo - bot fica em silêncio
  return;
}
```

### 5. Processamento de Mídia

| Tipo | Processamento |
|------|---------------|
| Texto | Direto |
| Áudio | Whisper STT → Texto |
| Imagem | Cohere Vision → Descrição |

### 6. Buffer de Digitação (7 segundos)

```javascript
// Aguarda 7s para combinar mensagens
const finalMessage = await addToBuffer(sessionId, message);
```

### 7. Processamento com IA

```javascript
// Busca histórico (últimas 8 mensagens)
const history = await getRecentHistory(sessionId, 8);

// Chama Cohere com tools
const response = await cohere.chat({
  message: finalMessage,
  chatHistory: history,
  tools: TOOLS,
  preamble: SYSTEM_PROMPT,
});
```

### 8. Envio da Resposta

```javascript
// Divide em partes menores
const parts = splitMessage(response.text, 200);

// Envia com simulação de digitação
await sendMultipleMessages(number, parts);
```

## 📡 API Reference

### POST `/api/webhook/whatsapp`

Recebe webhooks da Evolution API.

**Request Body:**

```json
{
  "event": "messages.upsert",
  "instance": "futuree-sdr",
  "data": {
    "key": {
      "remoteJid": "5511999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "message-id"
    },
    "messageType": "conversation",
    "message": {
      "conversation": "Olá, quero saber mais sobre IA"
    },
    "pushName": "João Silva"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Webhook recebido e sendo processado"
}
```

## 🐛 Troubleshooting

### Bot não responde

1. ✅ Verifique se o webhook está configurado corretamente
2. ✅ Veja os logs do backend: `node index.cjs`
3. ✅ Confirme que `SDR_AGENT_ENABLED=true`
4. ✅ Verifique se não está em modo humano (timeout)

### Erro ao conectar com Cohere

```
Error: Unauthorized
```

- Verifique se `VITE_COHERE_API_KEY` está correto
- Confirme que a chave tem créditos disponíveis

### Erro ao conectar com Supabase

```
Error: Invalid API key
```

- Verifique `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Confirme que as tabelas foram criadas (migrations)

### Webhook não recebe mensagens

1. Use ngrok para expor localhost
2. Configure a URL no painel da Evolution
3. Teste enviando: `curl -X POST https://abc.ngrok.io/api/webhook/whatsapp -d '{"test":true}'`

### Áudio não é transcrito

- Verifique `VITE_OPENAI_API_KEY`
- Confirme que tem créditos na conta OpenAI

## 📝 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima Supabase | ✅ |
| `VITE_COHERE_API_KEY` | API Key do Cohere | ✅ |
| `VITE_EVOLUTION_API_URL` | URL da Evolution API | ✅ |
| `VITE_EVOLUTION_API_KEY` | API Key da Evolution | ✅ |
| `VITE_EVOLUTION_INSTANCE` | Nome da instância | ✅ |
| `VITE_OPENAI_API_KEY` | API Key OpenAI (STT) | ⚠️ Opcional |

## 🎓 Exemplo de Conversa

```
👤 Usuário: Oi
🤖 Agente: Olá! 👋 Sou o Andrei, CEO da Futuree AI. Como posso ajudar você hoje?

👤 Usuário: Quero saber sobre automação com IA
🤖 Agente: Ótimo! Desenvolvemos soluções personalizadas de IA para empresas, incluindo automação, chatbots e análise de dados. 
Que tipo de automação você está buscando?

👤 Usuário: Chatbot para atendimento
🤖 Agente: Perfeito! Temos expertise nisso. Que tal agendar uma reunião para eu te mostrar alguns cases e entender melhor sua necessidade?
Tenho horários disponíveis:
- Terça (29/10) às 14:00 ou 16:00
- Quarta (30/10) às 10:00 ou 15:00
Qual funciona melhor para você?

👤 Usuário: Terça às 14h
🤖 Agente: Ótimo! Só preciso confirmar alguns dados:
Qual seu nome completo e email?

👤 Usuário: João Silva, joao@empresa.com
🤖 Agente: Perfeito, João! ✅
Reunião agendada:
📅 Data: 29/10/2025
🕐 Horário: 14:00
📧 Email: joao@empresa.com

Você receberá um email de confirmação. Até lá! 👋
```

## 🔐 Segurança

- ✅ Nunca exponha suas API keys no frontend
- ✅ Use variáveis de ambiente
- ✅ Ative RLS (Row Level Security) no Supabase em produção
- ✅ Valide webhooks com assinaturas (HMAC)
- ✅ Use HTTPS em produção

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou PR.

## 📞 Suporte

- 📧 Email: contato@futuree.ai
- 💬 WhatsApp: (11) 9xxxx-xxxx
- 🌐 Site: [futuree.ai](https://futuree.ai)

---

Desenvolvido com ❤️ pela [Futuree AI](https://futuree.ai)
