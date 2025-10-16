const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// ===========================================
// ROTAS PARA AGENT (MENSAGENS WHATSAPP)
// ===========================================

// Buscar leads para o Agent
app.get('/leads', async (req, res) => {
  try {
    // Aqui você buscaria do seu banco de dados
    // Por enquanto, exemplo mockado
    const leads = [
      {
        id: '1',
        name: 'João Silva',
        phone: '+5511999999999',
        status: 'active',
        lastMessage: 'Olá, tenho interesse no produto...'
      }
    ];

    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

// Buscar mensagens de um lead
app.get('/messages/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;

    // Aqui você buscaria mensagens do banco
    const messages = [
      {
        id: '1',
        leadId,
        text: 'Olá, tenho interesse no produto',
        fromMe: false,
        createdAt: new Date().toISOString()
      }
    ];

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

// Enviar mensagem
app.post('/send', async (req, res) => {
  try {
    const { leadId, text } = req.body;

    // Aqui você integraria com WhatsApp API
    // Exemplo: Twilio, 360Dialog, etc.

    const message = {
      id: Date.now().toString(),
      leadId,
      text,
      fromMe: true,
      createdAt: new Date().toISOString()
    };

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// Atualizar status do lead
app.patch('/leads/:leadId/status', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status } = req.body;

    // Aqui você atualizaria no banco
    // E poderia notificar via WhatsApp

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// ===========================================
// ROTAS PARA WEBHOOKS (OPCIONAL)
// ===========================================

// Webhook do WhatsApp
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const { messages } = req.body;

    // Processar mensagens recebidas
    for (const message of messages) {
      // Salvar no banco
      // Notificar frontend via Supabase realtime
    }

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no webhook' });
  }
});

// ===========================================
// HEALTH CHECK
// ===========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ===========================================
// INICIAR SERVIDOR
// ===========================================

app.listen(PORT, () => {
  console.log(`🚀 API Agent rodando na porta ${PORT}`);
  console.log(`📱 Webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
});</content>
<parameter name="filePath">c:\Users\andre\Futuree-Solutions\futuree-ai-solutions\exemplo-api-rest.js