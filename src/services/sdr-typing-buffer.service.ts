// ============================================
// BUFFER DE DIGITAÇÃO - AGENTE SDR
// Evita respostas a mensagens "picadas"
// ============================================

import { TypingBuffer } from '@/types/sdr-agent';

// Armazena os buffers de digitação em memória
// Em produção, considere usar Redis para persistência
const buffers = new Map<string, TypingBuffer>();

// Configuração
const BUFFER_DELAY_MS = 7000; // 7 segundos de espera

// ========== GERENCIAMENTO DO BUFFER ==========

/**
 * Adiciona uma mensagem ao buffer de um usuário
 * Retorna uma Promise que resolve quando o buffer expira (sem novas mensagens)
 */
export async function addToBuffer(
  sessionId: string,
  message: string
): Promise<string> {
  return new Promise((resolve) => {
    // Obtém ou cria o buffer
    let buffer = buffers.get(sessionId);

    if (!buffer) {
      buffer = {
        session_id: sessionId,
        messages: [],
        last_message_at: Date.now(),
      };
      buffers.set(sessionId, buffer);
    }

    // Cancela o timeout anterior (se existir)
    if (buffer.timeout_id) {
      clearTimeout(buffer.timeout_id);
    }

    // Adiciona a mensagem ao buffer
    buffer.messages.push(message);
    buffer.last_message_at = Date.now();

    console.log(`[Buffer] Mensagem adicionada para ${sessionId}. Total: ${buffer.messages.length}`);

    // Cria novo timeout
    buffer.timeout_id = setTimeout(() => {
      // Buffer expirou - combina todas as mensagens
      const combinedMessage = combineMessages(buffer!.messages);
      
      console.log(`[Buffer] Timeout expirado para ${sessionId}. Processando...`);
      
      // Limpa o buffer
      clearBuffer(sessionId);
      
      // Resolve com a mensagem combinada
      resolve(combinedMessage);
    }, BUFFER_DELAY_MS);

    // Atualiza o buffer
    buffers.set(sessionId, buffer);
  });
}

/**
 * Combina múltiplas mensagens em uma única mensagem
 */
function combineMessages(messages: string[]): string {
  if (messages.length === 1) {
    return messages[0];
  }

  // Junta as mensagens com quebra de linha
  return messages.join('\n');
}

/**
 * Limpa o buffer de um usuário
 */
export function clearBuffer(sessionId: string): void {
  const buffer = buffers.get(sessionId);

  if (buffer?.timeout_id) {
    clearTimeout(buffer.timeout_id);
  }

  buffers.delete(sessionId);
  console.log(`[Buffer] Limpo para ${sessionId}`);
}

/**
 * Verifica se existe um buffer ativo para um usuário
 */
export function hasActiveBuffer(sessionId: string): boolean {
  return buffers.has(sessionId);
}

/**
 * Obtém informações do buffer atual
 */
export function getBufferInfo(sessionId: string): TypingBuffer | null {
  return buffers.get(sessionId) || null;
}

/**
 * Limpa todos os buffers (útil para reset do sistema)
 */
export function clearAllBuffers(): void {
  buffers.forEach((buffer) => {
    if (buffer.timeout_id) {
      clearTimeout(buffer.timeout_id);
    }
  });

  buffers.clear();
  console.log('[Buffer] Todos os buffers limpos');
}

// ========== UTILITÁRIOS ==========

/**
 * Define o tempo de delay do buffer (em milissegundos)
 * Útil para testes ou configuração dinâmica
 */
let currentDelay = BUFFER_DELAY_MS;

export function setBufferDelay(delayMs: number): void {
  currentDelay = delayMs;
  console.log(`[Buffer] Delay configurado para ${delayMs}ms`);
}

export function getBufferDelay(): number {
  return currentDelay;
}

/**
 * Obtém estatísticas dos buffers ativos
 */
export function getBufferStats(): {
  active_buffers: number;
  total_messages: number;
  sessions: string[];
} {
  let totalMessages = 0;
  const sessions: string[] = [];

  buffers.forEach((buffer, sessionId) => {
    totalMessages += buffer.messages.length;
    sessions.push(sessionId);
  });

  return {
    active_buffers: buffers.size,
    total_messages: totalMessages,
    sessions,
  };
}
