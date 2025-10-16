# API REST - Futuree Solutions

Esta é uma API REST opcional para funcionalidades avançadas do Agent (integração WhatsApp).

## 🚀 Quando Usar Esta API

**Você NÃO precisa desta API** se estiver usando apenas:
- CRM básico
- Dashboards
- Gestão de leads
- Funil de vendas
- Relatórios

**Você PRECISA desta API** apenas se quiser:
- Integração com WhatsApp para mensagens automáticas
- Webhooks para receber mensagens
- Funcionalidades avançadas do Agent

## 📦 Instalação

```bash
# Instalar dependências
npm install express cors

# Para desenvolvimento
npm install -D nodemon
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.api.example .env
```

2. Configure as variáveis de ambiente no `.env`

## 🚀 Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Testar
npm test
```

## 📡 Endpoints

### Leads
- `GET /leads` - Buscar todos os leads
- `PATCH /leads/:id/status` - Atualizar status do lead

### Mensagens
- `GET /messages/:leadId` - Buscar mensagens de um lead
- `POST /send` - Enviar mensagem via WhatsApp

### Webhooks
- `POST /webhook/whatsapp` - Receber mensagens do WhatsApp

### Health Check
- `GET /health` - Verificar status da API

## 🌐 Deploy

### Opção 1: Vercel
```bash
npm i -g vercel
vercel --prod
```

### Opção 2: Railway
```bash
npm i -g @railway/cli
railway login
railway deploy
```

### Opção 3: Heroku
```bash
heroku create futuree-api
git push heroku main
```

## 🔗 Conexão com Frontend

No seu `.env` do frontend, adicione:
```
VITE_API_URL=https://sua-api.vercel.app
```

## 📱 Integração WhatsApp

Para mensagens reais, integre com:
- **Twilio**: Fácil, pago
- **360Dialog**: Oficial WhatsApp, pago
- **Meta WhatsApp Business API**: Complexo, precisa aprovação

## 🔄 Sincronização com Supabase

A API pode sincronizar dados com seu Supabase existente para manter consistência.