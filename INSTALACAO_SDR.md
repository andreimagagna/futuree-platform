# 🎉 AGENTE SDR DE IA PARA WHATSAPP - INSTALADO COM SUCESSO!

## ✅ Arquivos Criados

### 📁 Tipos TypeScript
- `src/types/sdr-agent.ts` - Todas as interfaces e tipos do sistema

### 🔧 Serviços
- `src/services/sdr-supabase.service.ts` - Gerenciamento de leads, chat memory e agendamentos
- `src/services/sdr-cohere.service.ts` - Integração com Cohere AI + ferramentas (tools)
- `src/services/sdr-evolution.service.ts` - Integração com Evolution API (WhatsApp)
- `src/services/sdr-media-processor.service.ts` - Processamento de texto, áudio e imagem
- `src/services/sdr-typing-buffer.service.ts` - Buffer de digitação (evita mensagens picadas)
- `src/services/sdr-webhook-controller.service.ts` - Controlador principal do webhook

### 🎨 Frontend
- `src/pages/Agent.tsx` - Página principal com painel de controle
- `src/components/SDRControlPanel.tsx` - Componente de controle (já existia, atualizado)

### 🗄️ Backend
- `backend/index.cjs` - Endpoint do webhook adicionado

### 📊 Banco de Dados
- `supabase/migrations/20251028_sdr_agent.sql` - Migration completa com todas as tabelas

### 📚 Documentação
- `.env.example` - Template de variáveis de ambiente
- `SDR_AGENT_README.md` - Documentação completa do sistema

## 🚀 PRÓXIMOS PASSOS PARA ATIVAR O SISTEMA

### 1. Instalar Dependências Necessárias

```bash
# No diretório principal
npm install cohere-ai

# No diretório backend
cd backend
npm install express cors @supabase/supabase-js cohere-ai axios
cd ..
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o exemplo
cp .env.example .env

# Edite o arquivo .env e preencha:
nano .env
```

**Variáveis obrigatórias:**
```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service

# Cohere
VITE_COHERE_API_KEY=sua-chave-cohere
COHERE_API_KEY=sua-chave-cohere

# Evolution API
VITE_EVOLUTION_API_URL=http://localhost:8080
VITE_EVOLUTION_API_KEY=sua-chave-evolution
VITE_EVOLUTION_INSTANCE=futuree-sdr
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua-chave-evolution
EVOLUTION_INSTANCE=futuree-sdr

# OpenAI (opcional - só para áudio)
VITE_OPENAI_API_KEY=sua-chave-openai
```

### 3. Executar Migrations no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Abra o arquivo `supabase/migrations/20251028_sdr_agent.sql`
4. Copie todo o conteúdo
5. Cole no SQL Editor e clique em **Run**

### 4. Iniciar o Backend

```bash
cd backend
node index.cjs
```

O backend deve mostrar: `Backend rodando na porta 4000`

### 5. Configurar Webhook na Evolution API

**Opção A: Via API**

```bash
curl -X POST "http://localhost:8080/webhook/set/futuree-sdr" \
  -H "apikey: sua-chave-evolution" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:4000/api/webhook/whatsapp",
    "webhook_by_events": true,
    "events": ["messages.upsert"]
  }'
```

**Opção B: Via Painel da Evolution**

Configure o webhook para: `http://localhost:4000/api/webhook/whatsapp`

**Para produção ou desenvolvimento com acesso externo, use ngrok:**

```bash
# Terminal separado
ngrok http 4000

# Copie a URL (ex: https://abc123.ngrok.io)
# Configure o webhook para: https://abc123.ngrok.io/api/webhook/whatsapp
```

### 6. Iniciar o Frontend

```bash
# Em outro terminal, no diretório principal
npm run dev
```

### 7. Acessar o Sistema

Abra o navegador em: [http://localhost:5173/agent](http://localhost:5173/agent)

### 8. Testar o Agente

1. Envie uma mensagem para o número configurado na Evolution API
2. O agente deve responder automaticamente
3. Veja os logs no terminal do backend

## 🎯 COMO FUNCIONA

### Fluxo Completo:

```
1. Usuário envia mensagem no WhatsApp
   ↓
2. Evolution API recebe e envia para webhook
   ↓
3. Webhook valida e processa (backend)
   ↓
4. Cria/busca lead no Supabase
   ↓
5. Verifica modo humano (timeout)
   ↓
6. Processa mídia (texto/áudio/imagem)
   ↓
7. Buffer de digitação (aguarda 7s)
   ↓
8. Envia para Cohere AI
   ↓
9. IA gera resposta com tools
   ↓
10. Divide resposta em partes
   ↓
11. Envia via Evolution API com delays
```

## 🛠️ RECURSOS IMPLEMENTADOS

### ✅ Núcleo do Sistema
- [x] Tipos TypeScript completos
- [x] Integração com Supabase (Leads, Chat Memory, Meetings)
- [x] Integração com Cohere AI
- [x] Integração com Evolution API
- [x] Processador de mídia (texto, áudio, imagem)
- [x] Buffer de digitação (7 segundos)
- [x] Controlador de webhook
- [x] Endpoint backend
- [x] Migrations SQL

### ✅ Ferramentas da IA (Tools)
- [x] Verificar disponibilidade de agenda
- [x] Agendar reunião
- [x] Reagendar reunião
- [x] Cancelar reunião
- [x] Consultar dia da semana
- [x] Calculadora

### ✅ Controles
- [x] Modo humano (timeout)
- [x] Simulação de digitação
- [x] Indicador "digitando..."
- [x] Divisão de mensagens longas
- [x] Logs e auditoria

### ✅ Interface
- [x] Painel de controle SDR
- [x] Estatísticas em tempo real
- [x] Visualização de conversas
- [x] Gestão de agendamentos

## 📊 ESTRUTURA DO BANCO DE DADOS

### Tabelas Criadas:

1. **sdr_leads** - Leads do WhatsApp
2. **sdr_chat_memory** - Histórico de conversas
3. **sdr_meetings** - Agendamentos
4. **sdr_agent_config** - Configurações do agente
5. **sdr_agent_logs** - Logs de auditoria

### Views:

- **sdr_agent_stats** - Estatísticas em tempo real

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### 1. Teste o Backend

```bash
curl -X POST http://localhost:4000/api/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

Deve retornar: `{"success": true, ...}`

### 2. Teste o Supabase

No SQL Editor do Supabase:

```sql
-- Verificar tabelas
SELECT * FROM sdr_leads LIMIT 5;
SELECT * FROM sdr_chat_memory LIMIT 5;
SELECT * FROM sdr_agent_stats;
```

### 3. Teste o Cohere

No frontend, console do navegador:

```javascript
import { processWithCohere } from '@/services/sdr-cohere.service';

// Teste simples
processWithCohere('Olá', 'test-session', [])
  .then(r => console.log('Cohere OK:', r))
  .catch(e => console.error('Erro:', e));
```

## 🐛 TROUBLESHOOTING

### Erro: Cannot find module 'axios'

```bash
cd backend
npm install axios
```

### Erro: Cannot find module 'cohere-ai'

```bash
npm install cohere-ai
```

### Erro: Supabase table not found

Execute a migration SQL novamente no Supabase Dashboard.

### Bot não responde

1. Verifique logs do backend
2. Confirme que o webhook está configurado
3. Verifique se `SDR_AGENT_ENABLED=true`
4. Teste com `fromMe: false` no webhook

## 📝 PERSONALIZAÇÃO

### Alterar Persona do Agente

Edite em `src/services/sdr-cohere.service.ts`:

```typescript
const SYSTEM_PROMPT = `
Você é [SEU NOME], [SEU CARGO] da [SUA EMPRESA]...
`;
```

### Alterar Timeout de Atendimento Humano

Em `.env`:

```env
SDR_HUMAN_TIMEOUT_MINUTES=15  # Altere para o valor desejado
```

### Alterar Buffer de Digitação

Em `.env`:

```env
SDR_TYPING_BUFFER_SECONDS=7  # Altere para o valor desejado
```

## 🎓 EXEMPLO DE USO

```javascript
// Exemplo de como usar os serviços manualmente

import { 
  getLeadByNumber, 
  createLead, 
  addMessageToHistory 
} from '@/services/sdr-supabase.service';

import { processWithCohere } from '@/services/sdr-cohere.service';

import { sendAIResponse } from '@/services/sdr-evolution.service';

// 1. Criar lead
const lead = await createLead('5511999999999', 'João Silva');

// 2. Processar com IA
const response = await processWithCohere(
  'Olá, quero saber sobre IA',
  '5511999999999',
  []
);

// 3. Enviar resposta
await sendAIResponse('5511999999999', response.text);

// 4. Salvar no histórico
await addMessageToHistory('5511999999999', 'ai', response.text);
```

## 📞 SUPORTE

Se tiver dúvidas ou encontrar problemas:

1. Consulte `SDR_AGENT_README.md` para documentação completa
2. Verifique os logs do backend e frontend
3. Teste cada serviço individualmente

## 🎉 PRONTO!

O Agente SDR está completamente implementado e pronto para uso!

**Próximos passos:**
1. Configure as variáveis de ambiente
2. Execute as migrations
3. Inicie o backend
4. Configure o webhook
5. Teste enviando mensagens

**Boa sorte! 🚀**
