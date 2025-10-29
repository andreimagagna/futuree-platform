// ============================================
// SERVIÇO DE INTEGRAÇÃO EVOLUTION API - WHATSAPP
// ============================================

import axios, { AxiosInstance } from 'axios';
import { EvolutionSendTextRequest } from '@/types/sdr-agent';

// Configuração da Evolution API
const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = import.meta.env.VITE_EVOLUTION_INSTANCE || 'futuree-sdr';

// Cliente HTTP configurado
const evolutionClient: AxiosInstance = axios.create({
  baseURL: EVOLUTION_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': EVOLUTION_API_KEY,
  },
});

// ========== UTILITÁRIOS ==========

/**
 * Formata número de WhatsApp para padrão Evolution
 * @param number - Número no formato 5511999999999 ou +55 11 99999-9999
 * @returns Número formatado: 5511999999999@s.whatsapp.net
 */
export function formatWhatsAppNumber(number: string): string {
  // Remove caracteres não numéricos
  const cleaned = number.replace(/\D/g, '');
  
  // Se não tiver @s.whatsapp.net, adiciona
  if (!number.includes('@')) {
    return `${cleaned}@s.whatsapp.net`;
  }
  
  return number;
}

/**
 * Extrai apenas o número limpo (sem @s.whatsapp.net)
 */
export function extractPhoneNumber(remoteJid: string): string {
  return remoteJid.replace('@s.whatsapp.net', '').replace(/\D/g, '');
}

/**
 * Calcula delay baseado no tamanho da mensagem
 * Simula tempo de digitação humano
 */
export function calculateTypingDelay(text: string): number {
  const charactersPerSecond = 100; // Velocidade média de digitação
  const baseDelay = 1000; // 1 segundo mínimo
  const maxDelay = 5000; // 5 segundos máximo
  
  const calculatedDelay = (text.length / charactersPerSecond) * 1000;
  
  return Math.min(Math.max(calculatedDelay, baseDelay), maxDelay);
}

/**
 * Divide mensagem longa em partes menores para parecer natural
 */
export function splitMessage(text: string, maxLength: number = 200): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const parts: string[] = [];
  const sentences = text.split(/[.!?\n]+/).filter(s => s.trim());

  let currentPart = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    
    if (!trimmed) continue;

    // Se adicionar essa frase ultrapassar o limite
    if ((currentPart + ' ' + trimmed).length > maxLength) {
      // Salva a parte atual e começa uma nova
      if (currentPart) {
        parts.push(currentPart.trim());
      }
      currentPart = trimmed;
    } else {
      currentPart += (currentPart ? ' ' : '') + trimmed;
    }
  }

  // Adiciona a última parte
  if (currentPart) {
    parts.push(currentPart.trim());
  }

  return parts.length > 0 ? parts : [text];
}

// ========== FUNÇÕES DE ENVIO ==========

/**
 * Envia uma mensagem de texto simples
 */
export async function sendText(number: string, text: string, delay: number = 0): Promise<void> {
  try {
    const formattedNumber = formatWhatsAppNumber(number);

    // Aguarda o delay (simulação de digitação)
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const payload = {
      number: formattedNumber,
      text,
    };

    console.log('[Evolution] Enviando mensagem:', payload);

    const response = await evolutionClient.post(
      `/message/sendText/${EVOLUTION_INSTANCE}`,
      payload
    );

    console.log('[Evolution] Mensagem enviada:', response.data);
  } catch (error) {
    console.error('[Evolution] Erro ao enviar mensagem:', error);
    throw error;
  }
}

/**
 * Envia uma mensagem com indicador "digitando..."
 */
export async function sendPresenceTyping(number: string): Promise<void> {
  try {
    const formattedNumber = formatWhatsAppNumber(number);

    await evolutionClient.post(`/chat/sendPresence/${EVOLUTION_INSTANCE}`, {
      number: formattedNumber,
      presence: 'composing', // "digitando..."
    });
  } catch (error) {
    console.error('[Evolution] Erro ao enviar presença:', error);
    // Não quebra o fluxo se falhar
  }
}

/**
 * Remove indicador "digitando..."
 */
export async function sendPresenceAvailable(number: string): Promise<void> {
  try {
    const formattedNumber = formatWhatsAppNumber(number);

    await evolutionClient.post(`/chat/sendPresence/${EVOLUTION_INSTANCE}`, {
      number: formattedNumber,
      presence: 'available',
    });
  } catch (error) {
    console.error('[Evolution] Erro ao enviar presença:', error);
  }
}

/**
 * Envia mensagem com simulação de digitação realista
 */
export async function sendTextWithTyping(number: string, text: string): Promise<void> {
  try {
    const typingDelay = calculateTypingDelay(text);

    // Mostra "digitando..."
    await sendPresenceTyping(number);

    // Aguarda o delay de digitação
    await new Promise(resolve => setTimeout(resolve, typingDelay));

    // Envia a mensagem
    await sendText(number, text);

    // Remove "digitando..."
    await sendPresenceAvailable(number);
  } catch (error) {
    console.error('[Evolution] Erro ao enviar com digitação:', error);
    throw error;
  }
}

/**
 * Envia múltiplas mensagens em sequência (mensagens "picadas")
 * Simula uma conversa natural
 */
export async function sendMultipleMessages(number: string, messages: string[]): Promise<void> {
  try {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      // Mostra "digitando..." antes de cada mensagem
      await sendPresenceTyping(number);

      // Delay baseado no tamanho da mensagem
      const typingDelay = calculateTypingDelay(message);
      await new Promise(resolve => setTimeout(resolve, typingDelay));

      // Envia a mensagem
      await sendText(number, message);

      // Pequeno intervalo entre mensagens (500ms a 1.5s)
      if (i < messages.length - 1) {
        const betweenDelay = Math.random() * 1000 + 500;
        await new Promise(resolve => setTimeout(resolve, betweenDelay));
      }
    }

    // Remove "digitando..." ao final
    await sendPresenceAvailable(number);
  } catch (error) {
    console.error('[Evolution] Erro ao enviar múltiplas mensagens:', error);
    throw error;
  }
}

/**
 * Envia resposta da IA de forma natural (divide e envia com delays)
 */
export async function sendAIResponse(number: string, response: string): Promise<void> {
  try {
    // Divide a resposta em partes
    const parts = splitMessage(response, 200);

    console.log(`[Evolution] Enviando resposta em ${parts.length} parte(s)`);

    // Envia cada parte com simulação de digitação
    await sendMultipleMessages(number, parts);
  } catch (error) {
    console.error('[Evolution] Erro ao enviar resposta da IA:', error);
    throw error;
  }
}

// ========== FUNÇÕES DE MÍDIA ==========

/**
 * Baixa mídia (áudio/imagem) enviada pelo usuário
 */
export async function downloadMedia(messageKey: string): Promise<Buffer | null> {
  try {
    const response = await evolutionClient.get(
      `/chat/getBase64FromMediaMessage/${EVOLUTION_INSTANCE}`,
      {
        params: { key: messageKey },
      }
    );

    if (response.data?.base64) {
      return Buffer.from(response.data.base64, 'base64');
    }

    return null;
  } catch (error) {
    console.error('[Evolution] Erro ao baixar mídia:', error);
    return null;
  }
}

/**
 * Envia uma imagem
 */
export async function sendImage(
  number: string,
  imageUrl: string,
  caption?: string
): Promise<void> {
  try {
    const formattedNumber = formatWhatsAppNumber(number);

    await evolutionClient.post(`/message/sendMedia/${EVOLUTION_INSTANCE}`, {
      number: formattedNumber,
      mediatype: 'image',
      media: imageUrl,
      caption,
    });
  } catch (error) {
    console.error('[Evolution] Erro ao enviar imagem:', error);
    throw error;
  }
}

/**
 * Envia um áudio
 */
export async function sendAudio(number: string, audioUrl: string): Promise<void> {
  try {
    const formattedNumber = formatWhatsAppNumber(number);

    await evolutionClient.post(`/message/sendMedia/${EVOLUTION_INSTANCE}`, {
      number: formattedNumber,
      mediatype: 'audio',
      media: audioUrl,
      ptt: true, // Push-to-talk (áudio de voz)
    });
  } catch (error) {
    console.error('[Evolution] Erro ao enviar áudio:', error);
    throw error;
  }
}

// ========== FUNÇÕES DE STATUS ==========

/**
 * Verifica se a instância está conectada
 */
export async function checkConnectionStatus(): Promise<boolean> {
  try {
    const response = await evolutionClient.get(`/instance/connectionState/${EVOLUTION_INSTANCE}`);
    
    return response.data?.state === 'open';
  } catch (error) {
    console.error('[Evolution] Erro ao verificar conexão:', error);
    return false;
  }
}

/**
 * Obtém informações da instância
 */
export async function getInstanceInfo(): Promise<any> {
  try {
    const response = await evolutionClient.get(`/instance/fetchInstances`, {
      params: { instanceName: EVOLUTION_INSTANCE },
    });

    return response.data;
  } catch (error) {
    console.error('[Evolution] Erro ao obter info da instância:', error);
    return null;
  }
}

// ========== FUNÇÕES DE WEBHOOK ==========

/**
 * Configura webhook da Evolution API
 */
export async function setWebhook(webhookUrl: string): Promise<void> {
  try {
    await evolutionClient.post(`/webhook/set/${EVOLUTION_INSTANCE}`, {
      url: webhookUrl,
      webhook_by_events: true,
      events: [
        'messages.upsert',
        'messages.update',
      ],
    });

    console.log('[Evolution] Webhook configurado:', webhookUrl);
  } catch (error) {
    console.error('[Evolution] Erro ao configurar webhook:', error);
    throw error;
  }
}

/**
 * Marca mensagem como lida
 */
export async function markAsRead(number: string, messageId: string): Promise<void> {
  try {
    const formattedNumber = formatWhatsAppNumber(number);

    await evolutionClient.post(`/chat/markMessageAsRead/${EVOLUTION_INSTANCE}`, {
      readMessages: [{
        id: messageId,
        fromMe: false,
        remoteJid: formattedNumber,
      }],
    });
  } catch (error) {
    console.error('[Evolution] Erro ao marcar como lida:', error);
    // Não quebra o fluxo
  }
}

export { evolutionClient };
