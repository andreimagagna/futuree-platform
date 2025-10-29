// ============================================
// CONTROLADOR PRINCIPAL DO WEBHOOK - AGENTE SDR
// Orquestra todo o fluxo: Webhook -> Processar -> IA -> Responder
// ============================================

import {
  WhatsAppWebhook,
  WhatsAppMessageData,
  WebhookProcessResult,
} from '@/types/sdr-agent';

// Importa todos os serviços
import {
  getLeadByNumber,
  createLead,
  updateLeadTimeout,
  isHumanMode,
  getChatHistory,
  addMessageToHistory,
  getRecentHistory,
} from './sdr-supabase.service';

import { processWithCohere } from './sdr-cohere.service';

import {
  extractPhoneNumber,
  sendAIResponse,
  markAsRead,
} from './sdr-evolution.service';

import { processMediaMessage, isSupportedMessageType } from './sdr-media-processor.service';

import { addToBuffer } from './sdr-typing-buffer.service';

// ========== FLUXO PRINCIPAL ==========

/**
 * Processa webhook recebido da Evolution API
 */
export async function handleWhatsAppWebhook(
  webhookData: WhatsAppWebhook
): Promise<WebhookProcessResult> {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[SDR Webhook] Novo webhook recebido');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const messageData = webhookData.data;

    // ========== REGRA 1: IGNORAR MENSAGENS PRÓPRIAS ==========
    if (messageData.key.fromMe) {
      console.log('[SDR] ✋ Mensagem própria - ignorando (evita loop)');
      return {
        success: true,
        message: 'Mensagem própria ignorada',
      };
    }

    // ========== REGRA 2: EXTRAIR DADOS ==========
    const remoteJid = messageData.key.remoteJid;
    const phoneNumber = extractPhoneNumber(remoteJid);
    const messageType = messageData.messageType;
    const messageId = messageData.key.id;

    console.log(`[SDR] 📱 Número: ${phoneNumber}`);
    console.log(`[SDR] 📝 Tipo: ${messageType}`);

    // Verifica se o tipo de mensagem é suportado
    if (!isSupportedMessageType(messageType)) {
      console.log(`[SDR] ⚠️ Tipo de mensagem não suportado: ${messageType}`);
      return {
        success: true,
        message: 'Tipo de mensagem não suportado',
      };
    }

    // ========== REGRA 3: GERENCIAR LEAD ==========
    let lead = await getLeadByNumber(phoneNumber);

    if (!lead) {
      console.log('[SDR] 🆕 Novo lead - criando registro...');
      lead = await createLead(
        phoneNumber,
        messageData.pushName || 'Visitante'
      );
      console.log(`[SDR] ✅ Lead criado: ${lead.id}`);
    } else {
      console.log(`[SDR] 📋 Lead existente: ${lead.id}`);
    }

    // Atualiza timeout (adiciona 15 minutos)
    await updateLeadTimeout(phoneNumber, 15);

    // ========== REGRA 4: VERIFICAR MODO HUMANO ==========
    const humanModeActive = await isHumanMode(phoneNumber);

    if (humanModeActive) {
      console.log('[SDR] 👤 Modo humano ATIVO - bot em silêncio');
      
      // Marca como lida para o usuário saber que foi recebida
      await markAsRead(phoneNumber, messageId);

      return {
        success: true,
        message: 'Modo humano ativo - bot pausado',
        lead_id: lead.id,
        human_mode: true,
      };
    }

    // ========== REGRA 5: PROCESSAR MÍDIA ==========
    console.log('[SDR] 🎬 Processando conteúdo da mensagem...');

    const messageContent = extractMessageContent(messageData);
    
    const processedMessage = await processMediaMessage(
      phoneNumber,
      messageType as any,
      messageContent
    );

    console.log(`[SDR] 📄 Conteúdo processado: "${processedMessage.content}"`);

    // ========== REGRA 6: BUFFER DE DIGITAÇÃO ==========
    console.log('[SDR] ⏳ Adicionando ao buffer de digitação (7s)...');

    // Esta Promise só resolve quando o buffer expirar (7 segundos sem novas mensagens)
    const finalMessage = await addToBuffer(phoneNumber, processedMessage.content);

    console.log(`[SDR] ✅ Buffer expirado. Mensagem final: "${finalMessage}"`);

    // ========== REGRA 7: VERIFICAR MODO HUMANO NOVAMENTE ==========
    // Durante o buffer, um humano pode ter assumido o atendimento
    const humanModeAfterBuffer = await isHumanMode(phoneNumber);

    if (humanModeAfterBuffer) {
      console.log('[SDR] 👤 Modo humano ATIVADO durante buffer - cancelando resposta');
      return {
        success: true,
        message: 'Modo humano ativado durante buffer',
        lead_id: lead.id,
        human_mode: true,
      };
    }

    // ========== REGRA 8: PROCESSAR COM IA ==========
    console.log('[SDR] 🤖 Enviando para Cohere AI...');

    // Adiciona mensagem do usuário ao histórico
    await addMessageToHistory(phoneNumber, 'human', finalMessage);

    // Busca histórico recente (últimas 8 mensagens)
    const chatHistory = await getRecentHistory(phoneNumber, 8);

    // Processa com Cohere
    const aiResponse = await processWithCohere(
      finalMessage,
      phoneNumber,
      chatHistory,
      lead.id
    );

    console.log(`[SDR] 🎯 Resposta da IA: "${aiResponse.text}"`);

    // Adiciona resposta da IA ao histórico
    await addMessageToHistory(phoneNumber, 'ai', aiResponse.text);

    // ========== REGRA 9: ENVIAR RESPOSTA ==========
    console.log('[SDR] 📤 Enviando resposta ao usuário...');

    await sendAIResponse(phoneNumber, aiResponse.text);

    console.log('[SDR] ✅ Resposta enviada com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return {
      success: true,
      message: 'Webhook processado com sucesso',
      lead_id: lead.id,
      response_sent: true,
      human_mode: false,
    };
  } catch (error) {
    console.error('[SDR Webhook] ❌ ERRO:', error);
    
    return {
      success: false,
      message: 'Erro ao processar webhook',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// ========== UTILITÁRIOS ==========

/**
 * Extrai o conteúdo da mensagem baseado no tipo
 */
function extractMessageContent(data: WhatsAppMessageData): {
  text?: string;
  audioBase64?: string;
  imageBase64?: string;
  caption?: string;
} {
  const { message, messageType } = data;

  if (!message) {
    return {};
  }

  switch (messageType) {
    case 'conversation':
      return {
        text: message.conversation || '',
      };

    case 'extendedTextMessage':
      return {
        text: message.extendedTextMessage?.text || '',
      };

    case 'audioMessage':
      // NOTA: A URL do áudio precisa ser baixada e convertida para base64
      // Isso deve ser feito no serviço de mídia
      return {
        audioBase64: message.audioMessage?.url || '',
      };

    case 'imageMessage':
      return {
        imageBase64: message.imageMessage?.url || '',
        caption: message.imageMessage?.caption,
      };

    default:
      return {};
  }
}

/**
 * Valida estrutura do webhook
 */
export function isValidWebhook(data: any): data is WhatsAppWebhook {
  return (
    data &&
    typeof data === 'object' &&
    data.event &&
    data.data &&
    data.data.key &&
    data.data.key.remoteJid
  );
}

// ========== FUNÇÕES DE CONTROLE ==========

/**
 * Ativa modo humano para um número (desliga o bot temporariamente)
 */
export async function enableHumanTakeover(
  phoneNumber: string,
  minutes: number = 15
): Promise<void> {
  console.log(`[SDR Control] 👤 Ativando modo humano para ${phoneNumber} (${minutes}min)`);
  await updateLeadTimeout(phoneNumber, minutes);
}

/**
 * Desativa modo humano (reativa o bot)
 */
export async function disableHumanTakeover(phoneNumber: string): Promise<void> {
  console.log(`[SDR Control] 🤖 Desativando modo humano para ${phoneNumber}`);
  await updateLeadTimeout(phoneNumber, 0); // Timeout no passado = bot ativo
}

/**
 * Envia mensagem manual (como humano)
 */
export async function sendManualMessage(
  phoneNumber: string,
  message: string
): Promise<void> {
  console.log(`[SDR Control] 💬 Enviando mensagem manual para ${phoneNumber}`);
  
  // Ativa modo humano automaticamente
  await enableHumanTakeover(phoneNumber, 15);
  
  // Adiciona ao histórico
  await addMessageToHistory(phoneNumber, 'human', `[HUMANO]: ${message}`);
  
  // Envia via Evolution
  await sendAIResponse(phoneNumber, message);
}
