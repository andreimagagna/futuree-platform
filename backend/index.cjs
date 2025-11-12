const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Configure Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://YOUR_SUPABASE_URL.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
);

app.get('/api/leads', async (req, res) => {
  const { data, error } = await supabase.from('leads').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/leads', async (req, res) => {
  const { data, error } = await supabase.from('leads').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/api/companies', async (req, res) => {
  const { data, error } = await supabase.from('companies').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/profiles', async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ========== SDR AGENT - WHATSAPP WEBHOOK ==========
app.post('/api/webhook/whatsapp', async (req, res) => {
  try {
    console.log('[Webhook] Recebido:', JSON.stringify(req.body, null, 2));

    const webhookData = req.body;

    // Validação básica
    if (!webhookData || !webhookData.data || !webhookData.data.key) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formato de webhook inválido' 
      });
    }

    // Ignora mensagens próprias (evita loop)
    if (webhookData.data.key.fromMe) {
      return res.status(200).json({ 
        success: true, 
        message: 'Mensagem própria ignorada' 
      });
    }

    // Processa de forma assíncrona (não bloqueia a resposta)
    processWebhookAsync(webhookData, supabase);

    // Retorna 200 imediatamente para Evolution API
    res.status(200).json({ 
      success: true, 
      message: 'Webhook recebido e sendo processado' 
    });

  } catch (error) {
    console.error('[Webhook] Erro:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Processa webhook em background
async function processWebhookAsync(webhookData, supabaseClient) {
  try {
    const { CohereClient } = require('cohere-ai');
    
    // Extrai dados
    const remoteJid = webhookData.data.key.remoteJid;
    const phoneNumber = remoteJid.replace('@s.whatsapp.net', '');
    const messageType = webhookData.data.messageType;
    const messageContent = extractMessageContent(webhookData.data);

    console.log(`[SDR] Processando: ${phoneNumber} | Tipo: ${messageType}`);

    // Busca ou cria lead
    let { data: lead } = await supabaseClient
      .from('sdr_leads')
      .select('*')
      .eq('number', phoneNumber)
      .single();

    if (!lead) {
      const { data: newLead } = await supabaseClient
        .from('sdr_leads')
        .insert({ 
          number: phoneNumber,
          name: webhookData.data.pushName || 'Visitante',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      lead = newLead;
    }

    // Verifica modo humano
    if (lead.timeout && new Date(lead.timeout) > new Date()) {
      console.log('[SDR] Modo humano ativo - ignorando');
      return;
    }

    // Atualiza timeout
    const timeoutDate = new Date();
    timeoutDate.setMinutes(timeoutDate.getMinutes() + 15);
    await supabaseClient
      .from('sdr_leads')
      .update({ timeout: timeoutDate.toISOString() })
      .eq('id', lead.id);

    // Processa mensagem com Cohere
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });

    // Busca histórico
    const { data: memoryData } = await supabaseClient
      .from('sdr_chat_memory')
      .select('history')
      .eq('session_id', phoneNumber)
      .single();

    const chatHistory = memoryData?.history || [];

    // Chama Cohere
    const response = await cohere.chat({
      message: messageContent.text || '[Mensagem de mídia]',
      chatHistory: chatHistory.slice(-8).map(msg => ({
        role: msg.role === 'human' ? 'USER' : 'CHATBOT',
        message: msg.content,
      })),
      preamble: `Você é Andrei, CEO da Futuree AI. Seu objetivo é agendar reuniões comerciais de forma profissional e amigável.`,
      model: 'command-r-plus',
      temperature: 0.7,
    });

    // Salva no histórico
    const newHistory = [
      ...chatHistory,
      { role: 'human', content: messageContent.text, timestamp: new Date().toISOString() },
      { role: 'ai', content: response.text, timestamp: new Date().toISOString() },
    ].slice(-50);

    await supabaseClient
      .from('sdr_chat_memory')
      .upsert({
        session_id: phoneNumber,
        history: newHistory,
        updated_at: new Date().toISOString(),
      });

    // Envia resposta via Evolution API
    const axios = require('axios');
    const evolutionUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
    const evolutionKey = process.env.EVOLUTION_API_KEY;
    const evolutionInstance = process.env.EVOLUTION_INSTANCE || 'futuree-sdr';

    await axios.post(
      `${evolutionUrl}/message/sendText/${evolutionInstance}`,
      {
        number: remoteJid,
        text: response.text,
      },
      {
        headers: {
          'apikey': evolutionKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[SDR] Resposta enviada com sucesso!');

  } catch (error) {
    console.error('[SDR Background] Erro:', error);
  }
}

function extractMessageContent(data) {
  const { message, messageType } = data;
  
  if (messageType === 'conversation') {
    return { text: message?.conversation || '' };
  }
  
  if (messageType === 'extendedTextMessage') {
    return { text: message?.extendedTextMessage?.text || '' };
  }
  
  return { text: '' };
}

app.listen(4000, () => {
  console.log('Backend rodando na porta 4000');
});
