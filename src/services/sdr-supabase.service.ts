// ============================================
// SERVIÇO DE INTEGRAÇÃO SUPABASE - AGENTE SDR
// ============================================

import { supabase } from '@/lib/supabaseClient';
import { Lead, ChatMemory, ChatMessage, MeetingBooking } from '@/types/sdr-agent';

// ========== GERENCIAMENTO DE LEADS ==========

/**
 * Busca um lead pelo número do WhatsApp
 */
export async function getLeadByNumber(number: string): Promise<Lead | null> {
  try {
    const { data, error } = await supabase
      .from('sdr_leads')
      .select('*')
      .eq('number', number)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as Lead;
  } catch (error) {
    console.error('[SDR] Erro ao buscar lead:', error);
    throw error;
  }
}

/**
 * Cria um novo lead no Supabase
 */
export async function createLead(number: string, name?: string, crmId?: string): Promise<Lead> {
  try {
    const { data, error } = await supabase
      .from('sdr_leads')
      .insert({
        number,
        name,
        crm_id: crmId,
        created_at: new Date().toISOString(),
        timeout: null,
      })
      .select()
      .single();

    if (error) throw error;

    return data as Lead;
  } catch (error) {
    console.error('[SDR] Erro ao criar lead:', error);
    throw error;
  }
}

/**
 * Atualiza o timeout do lead (controle de atendimento humano)
 * @param number - Número do WhatsApp
 * @param minutes - Minutos para adicionar ao timeout (padrão: 15)
 */
export async function updateLeadTimeout(number: string, minutes: number = 15): Promise<void> {
  try {
    const timeoutDate = new Date();
    timeoutDate.setMinutes(timeoutDate.getMinutes() + minutes);

    const { error } = await supabase
      .from('sdr_leads')
      .update({
        timeout: timeoutDate.toISOString(),
        last_interaction: new Date().toISOString(),
      })
      .eq('number', number);

    if (error) throw error;
  } catch (error) {
    console.error('[SDR] Erro ao atualizar timeout:', error);
    throw error;
  }
}

/**
 * Verifica se o lead está em modo de atendimento humano
 * Retorna TRUE se humano está atendendo (bot deve ficar em silêncio)
 */
export async function isHumanMode(number: string): Promise<boolean> {
  try {
    const lead = await getLeadByNumber(number);
    
    if (!lead || !lead.timeout) {
      return false; // Sem timeout = bot pode responder
    }

    const now = new Date();
    const timeoutDate = new Date(lead.timeout);

    // Se agora < timeout, humano ainda está atendendo
    return now < timeoutDate;
  } catch (error) {
    console.error('[SDR] Erro ao verificar modo humano:', error);
    return false; // Em caso de erro, permite bot responder
  }
}

/**
 * Ativa o modo de atendimento humano (desliga o bot temporariamente)
 */
export async function enableHumanMode(number: string, minutes: number = 15): Promise<void> {
  await updateLeadTimeout(number, minutes);
}

/**
 * Desativa o modo de atendimento humano (reativa o bot)
 */
export async function disableHumanMode(number: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('sdr_leads')
      .update({ timeout: null })
      .eq('number', number);

    if (error) throw error;
  } catch (error) {
    console.error('[SDR] Erro ao desativar modo humano:', error);
    throw error;
  }
}

/**
 * Lista todos os leads
 */
export async function listLeads(limit: number = 100): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('sdr_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data as Lead[];
  } catch (error) {
    console.error('[SDR] Erro ao listar leads:', error);
    throw error;
  }
}

// ========== GERENCIAMENTO DE MEMÓRIA DE CHAT ==========

/**
 * Busca o histórico de conversa de um lead
 */
export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('sdr_chat_memory')
      .select('history')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return []; // Não encontrado = histórico vazio
      throw error;
    }

    return (data?.history || []) as ChatMessage[];
  } catch (error) {
    console.error('[SDR] Erro ao buscar histórico:', error);
    return [];
  }
}

/**
 * Adiciona uma mensagem ao histórico de conversa
 */
export async function addMessageToHistory(
  sessionId: string,
  role: 'human' | 'ai' | 'system',
  content: string
): Promise<void> {
  try {
    const history = await getChatHistory(sessionId);
    
    const newMessage: ChatMessage = {
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...history, newMessage];

    // Limita o histórico às últimas 50 mensagens
    const trimmedHistory = updatedHistory.slice(-50);

    const { error } = await supabase
      .from('sdr_chat_memory')
      .upsert({
        session_id: sessionId,
        history: trimmedHistory,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('[SDR] Erro ao adicionar mensagem ao histórico:', error);
    throw error;
  }
}

/**
 * Limpa o histórico de conversa de um lead
 */
export async function clearChatHistory(sessionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('sdr_chat_memory')
      .delete()
      .eq('session_id', sessionId);

    if (error) throw error;
  } catch (error) {
    console.error('[SDR] Erro ao limpar histórico:', error);
    throw error;
  }
}

/**
 * Obtém as últimas N mensagens do histórico para enviar à IA
 */
export async function getRecentHistory(sessionId: string, count: number = 8): Promise<ChatMessage[]> {
  const history = await getChatHistory(sessionId);
  return history.slice(-count);
}

// ========== GERENCIAMENTO DE AGENDAMENTOS ==========

/**
 * Cria um novo agendamento de reunião
 */
export async function createMeeting(booking: Omit<MeetingBooking, 'id' | 'created_at' | 'updated_at'>): Promise<MeetingBooking> {
  try {
    const { data, error } = await supabase
      .from('sdr_meetings')
      .insert({
        ...booking,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data as MeetingBooking;
  } catch (error) {
    console.error('[SDR] Erro ao criar agendamento:', error);
    throw error;
  }
}

/**
 * Atualiza um agendamento existente
 */
export async function updateMeeting(id: string, updates: Partial<MeetingBooking>): Promise<MeetingBooking> {
  try {
    const { data, error } = await supabase
      .from('sdr_meetings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as MeetingBooking;
  } catch (error) {
    console.error('[SDR] Erro ao atualizar agendamento:', error);
    throw error;
  }
}

/**
 * Cancela um agendamento
 */
export async function cancelMeeting(id: string): Promise<void> {
  await updateMeeting(id, { status: 'cancelled' });
}

/**
 * Busca agendamentos por lead
 */
export async function getMeetingsByLead(leadId: string): Promise<MeetingBooking[]> {
  try {
    const { data, error } = await supabase
      .from('sdr_meetings')
      .select('*')
      .eq('lead_id', leadId)
      .order('date', { ascending: true });

    if (error) throw error;

    return data as MeetingBooking[];
  } catch (error) {
    console.error('[SDR] Erro ao buscar agendamentos:', error);
    return [];
  }
}

/**
 * Busca agendamentos por data
 */
export async function getMeetingsByDate(date: string): Promise<MeetingBooking[]> {
  try {
    const { data, error } = await supabase
      .from('sdr_meetings')
      .select('*')
      .eq('date', date)
      .in('status', ['scheduled', 'confirmed'])
      .order('time', { ascending: true });

    if (error) throw error;

    return data as MeetingBooking[];
  } catch (error) {
    console.error('[SDR] Erro ao buscar agendamentos por data:', error);
    return [];
  }
}

/**
 * Verifica disponibilidade de horário
 */
export async function isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('sdr_meetings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .in('status', ['scheduled', 'confirmed']);

    if (error) throw error;

    return !data || data.length === 0;
  } catch (error) {
    console.error('[SDR] Erro ao verificar disponibilidade:', error);
    return false;
  }
}
