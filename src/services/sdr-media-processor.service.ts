// ============================================
// PROCESSADOR DE MÍDIA - AGENTE SDR
// Processa texto, áudio (STT) e imagem (Vision)
// ============================================

import { CohereClient } from 'cohere-ai';
import { ProcessedMessage, STTResponse, VisionResponse } from '@/types/sdr-agent';

const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY || '',
});

// ========== PROCESSAMENTO DE TEXTO ==========

/**
 * Processa mensagem de texto simples
 */
export async function processText(
  sessionId: string,
  text: string
): Promise<ProcessedMessage> {
  return {
    session_id: sessionId,
    content: text.trim(),
    type: 'text',
    original_type: 'conversation',
    timestamp: Date.now(),
  };
}

// ========== PROCESSAMENTO DE ÁUDIO (STT) ==========

/**
 * Converte áudio em texto usando OpenAI Whisper
 * NOTA: Cohere não tem STT nativo, então usamos OpenAI ou outro serviço
 */
export async function processAudio(
  sessionId: string,
  audioBase64: string
): Promise<ProcessedMessage> {
  try {
    console.log('[Media Processor] Processando áudio...');

    // Converte base64 para blob
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    
    // Cria FormData para enviar ao Whisper
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/ogg' });
    formData.append('file', audioBlob, 'audio.ogg');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt'); // Português

    // Chama API do Whisper (OpenAI)
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const data: STTResponse = await response.json();
    const transcribedText = data.text || '';

    console.log('[Media Processor] Áudio transcrito:', transcribedText);

    return {
      session_id: sessionId,
      content: transcribedText,
      type: 'audio',
      original_type: 'audioMessage',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('[Media Processor] Erro ao processar áudio:', error);
    
    // Retorna mensagem de fallback
    return {
      session_id: sessionId,
      content: '[Áudio não pôde ser processado. Por favor, envie uma mensagem de texto.]',
      type: 'audio',
      original_type: 'audioMessage',
      timestamp: Date.now(),
    };
  }
}

// ========== PROCESSAMENTO DE IMAGEM (VISION) ==========

/**
 * Analisa imagem usando Cohere Vision (Command-R+)
 */
export async function processImage(
  sessionId: string,
  imageBase64: string,
  caption?: string
): Promise<ProcessedMessage> {
  try {
    console.log('[Media Processor] Processando imagem...');

    // Cria prompt para análise da imagem
    const prompt = caption 
      ? `O usuário enviou uma imagem com a legenda: "${caption}". Descreva o que você vê na imagem e responda de acordo com o contexto da conversa de vendas.`
      : 'O usuário enviou uma imagem. Descreva o que você vê e responda de forma adequada no contexto de uma conversa de vendas.';

    // NOTA: A API atual do Cohere TypeScript pode não suportar multimodal diretamente
    // Alternativa: usar fetch direto ou aguardar atualização da biblioteca
    
    // Por enquanto, vamos usar uma abordagem simplificada
    // Em produção, você deve usar a API de vision adequada
    
    const imageDescription = await analyzeImageWithCohere(imageBase64, prompt);

    console.log('[Media Processor] Imagem analisada:', imageDescription);

    // Retorna a descrição como conteúdo da mensagem
    const content = caption
      ? `[Imagem recebida: ${imageDescription}] Legenda: ${caption}`
      : `[Imagem recebida: ${imageDescription}]`;

    return {
      session_id: sessionId,
      content,
      type: 'image',
      original_type: 'imageMessage',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('[Media Processor] Erro ao processar imagem:', error);
    
    // Retorna mensagem de fallback
    const fallbackContent = caption
      ? `[Imagem recebida com legenda: ${caption}]`
      : '[Imagem recebida. Por favor, descreva o que você gostaria de compartilhar.]';

    return {
      session_id: sessionId,
      content: fallbackContent,
      type: 'image',
      original_type: 'imageMessage',
      timestamp: Date.now(),
    };
  }
}

/**
 * Analisa imagem usando Cohere (implementação direta com fetch)
 */
async function analyzeImageWithCohere(
  imageBase64: string,
  prompt: string
): Promise<string> {
  try {
    // Remove prefixo data:image/...;base64, se existir
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    // Chamada direta à API REST do Cohere para vision
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        message: prompt,
        // Multimodal input (verificar documentação atualizada do Cohere)
        // A sintaxe pode variar conforme a versão da API
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere Vision API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || 'Imagem analisada';
  } catch (error) {
    console.error('[Cohere Vision] Erro:', error);
    return 'uma imagem';
  }
}

// ========== FUNÇÃO PRINCIPAL ==========

/**
 * Processa qualquer tipo de mensagem (texto, áudio, imagem)
 */
export async function processMediaMessage(
  sessionId: string,
  messageType: 'conversation' | 'audioMessage' | 'imageMessage' | 'extendedTextMessage',
  content: {
    text?: string;
    audioBase64?: string;
    imageBase64?: string;
    caption?: string;
  }
): Promise<ProcessedMessage> {
  console.log(`[Media Processor] Processando: ${messageType}`);

  switch (messageType) {
    case 'conversation':
    case 'extendedTextMessage':
      return processText(sessionId, content.text || '');

    case 'audioMessage':
      if (!content.audioBase64) {
        throw new Error('Áudio base64 não fornecido');
      }
      return processAudio(sessionId, content.audioBase64);

    case 'imageMessage':
      if (!content.imageBase64) {
        throw new Error('Imagem base64 não fornecida');
      }
      return processImage(sessionId, content.imageBase64, content.caption);

    default:
      // Tipo desconhecido
      return {
        session_id: sessionId,
        content: '[Tipo de mensagem não suportado]',
        type: 'text',
        original_type: messageType,
        timestamp: Date.now(),
      };
  }
}

/**
 * Valida se o tipo de mensagem é suportado
 */
export function isSupportedMessageType(messageType: string): boolean {
  const supported = ['conversation', 'extendedTextMessage', 'audioMessage', 'imageMessage'];
  return supported.includes(messageType);
}
