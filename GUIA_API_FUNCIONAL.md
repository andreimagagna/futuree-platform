# 🚀 Guia: Deixando a API Funcional

## 📊 Status Atual

✅ **Supabase (Backend Principal)**: Já está 100% funcional
📝 **API REST (Agent)**: Usando dados mockados (opcional)

## 🎯 O que Você Precisa?

### Opção 1: ✅ SISTEMA JÁ FUNCIONAL (Recomendado)

**Nada!** Seu sistema já está funcionando perfeitamente com Supabase.

**O que já funciona:**
- ✅ CRM completo (leads, funis, qualificações)
- ✅ Autenticação de usuários
- ✅ Perfil e configurações
- ✅ Marketing (funis, landing pages)
- ✅ Cache inteligente
- ✅ Realtime (atualizações instantâneas)

**Para usar:**
```bash
npm run dev
# Abra: http://localhost:8080
```

---

### Opção 2: 🔧 API REST Própria (Opcional)

Se quiser funcionalidades específicas do Agent (mensagens WhatsApp), você pode configurar uma API própria.

#### 📋 O que seria necessário:

**1. Servidor/API Backend:**
```javascript
// Exemplo de API simples (Node.js + Express)
const express = require('express');
const app = express();

app.get('/leads', (req, res) => {
  // Retornar leads do seu sistema
  res.json(leadsData);
});

app.listen(3001, () => {
  console.log('API rodando na porta 3001');
});
```

**2. Configuração de Subdomínio:**

**Opção A - Mesmo domínio:**
```
seu-site.com/api/leads
```

**Opção B - Subdomínio:**
```
api.seu-site.com/leads
```

**3. Configuração no .env:**
```env
VITE_API_URL="https://api.seu-site.com"
# ou
VITE_API_URL="https://seu-site.com/api"
```

**4. CORS no seu servidor:**
```javascript
app.use(cors({
  origin: 'https://seu-site.com',
  credentials: true
}));
```

---

## 🌐 Configuração de Subdomínios

### Se usar subdomínio (api.seu-site.com):

**1. No seu provedor de domínio:**
```
Tipo: CNAME
Nome: api
Valor: seu-site.com
```

**2. No servidor:**
- Configure o servidor para responder em `api.seu-site.com`
- Certificado SSL para o subdomínio

### Se usar caminho (/api):

**1. Mesmo domínio:**
```
seu-site.com/api/leads
```

**2. No servidor web (nginx/apache):**
```nginx
location /api {
  proxy_pass http://localhost:3001;
  proxy_set_header Host $host;
}
```

---

## 💡 Recomendação

**Para começar: Use apenas o Supabase!**

Seu sistema já está completo e funcional. A API REST é apenas para funcionalidades específicas do Agent (WhatsApp), que pode ser implementada depois.

**Fluxo atual:**
```
Frontend → Supabase → PostgreSQL
                ↓
         Realtime subscriptions
```

**Fluxo futuro (opcional):**
```
Frontend → API REST → WhatsApp API
                ↓
         Supabase (dados principais)
```

---

## 📁 Arquivos Criados para API (Opcional)

Se decidir implementar a API REST, foram criados estes arquivos de exemplo:

- **`exemplo-api-rest.js`** - API completa com rotas para leads, mensagens e webhooks
- **`package-api.json`** - Dependências da API
- **`.env.api.example`** - Configurações de ambiente
- **`README-API.md`** - Documentação completa da API

### 🚀 Para testar a API opcional:

```bash
# Instalar dependências
npm install express cors nodemon

# Copiar arquivo de configuração
cp .env.api.example .env

# Executar
npm run dev

# Testar
curl http://localhost:3001/health
```

### 📡 Endpoints da API:

- `GET /leads` - Buscar leads
- `GET /messages/:leadId` - Buscar mensagens
- `POST /send` - Enviar mensagem WhatsApp
- `POST /webhook/whatsapp` - Receber mensagens
- `GET /health` - Status da API

---

---

## 🚀 Conclusão

**Você NÃO precisa de subdomínio nem API adicional agora!**

Seu sistema já está 100% funcional com Supabase. A API REST é opcional e só necessária se quiser integrar com WhatsApp ou outros serviços externos específicos.

**Próximos passos:**
1. Teste o sistema: `npm run dev`
2. Use todas as funcionalidades do CRM
3. Implemente API REST apenas se precisar do Agent avançado</content>
<parameter name="filePath">c:\Users\andre\Futuree-Solutions\futuree-ai-solutions\GUIA_API_FUNCIONAL.md