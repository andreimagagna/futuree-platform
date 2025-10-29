// ============================================
// SERVIÇO DE INTEGRAÇÃO COHERE - AGENTE SDR
// ============================================

import { CohereClient } from 'cohere-ai';
import {
  CohereMessage,
  CohereTool,
  CohereResponse,
  ChatMessage,
  AvailabilitySlot,
  MeetingBooking,
  ToolExecutionResult,
} from '@/types/sdr-agent';
import {
  createMeeting,
  updateMeeting,
  cancelMeeting,
  getMeetingsByDate,
  isTimeSlotAvailable,
} from './sdr-supabase.service';

// Inicializar cliente Cohere
const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY || '',
});

// ========== SYSTEM PROMPT (PERSONA) ==========
const SYSTEM_PROMPT = `Você é Andrei, CEO da Futuree AI, uma empresa inovadora de soluções em inteligência artificial.

PERSONALIDADE:
- Profissional, mas amigável e acessível
- Objetivo e direto ao ponto
- Focado em resultados e agendamentos
- Usa linguagem clara e natural do WhatsApp
- Responde de forma concisa (evite textos longos)

OBJETIVO PRINCIPAL:
Sua missão é qualificar leads e agendar reuniões comerciais. Você deve:
1. Cumprimentar o lead de forma natural
2. Identificar a necessidade do cliente
3. Qualificar se o lead tem fit com nossas soluções de IA
4. Propor horários para uma reunião de apresentação
5. Confirmar agendamento com nome e email

REGRAS:
- SEMPRE seja educado e profissional
- NÃO invente informações ou preços
- Se não souber algo, seja honesto e ofereça agendar uma conversa
- Foque em agendar reuniões, não em vender pelo chat
- Use emojis moderadamente para humanizar (máximo 1-2 por mensagem)
- Pergunte uma coisa por vez
- Confirme os dados antes de agendar

INFORMAÇÕES SOBRE FUTUREE AI:
- Desenvolvemos soluções personalizadas de IA para empresas
- Foco em automação, chatbots, análise de dados e integração de IA
- Atendemos empresas de todos os portes
- Reuniões podem ser presenciais (São Paulo) ou online`;

// ========== FERRAMENTAS (TOOLS) ==========

const TOOLS: CohereTool[] = [
  {
    name: 'verificar_disponibilidade',
    description: 'Consulta os próximos horários disponíveis na agenda para reuniões. Retorna até 3 dias com 2-3 horários por dia.',
    parameter_definitions: {
      days_ahead: {
        description: 'Número de dias à frente para verificar (padrão: 3)',
        type: 'number',
        required: false,
      },
    },
  },
  {
    name: 'agendar_reuniao',
    description: 'Agenda uma nova reunião com o cliente. IMPORTANTE: Só use após confirmar nome, email e horário com o cliente.',
    parameter_definitions: {
      nome: {
        description: 'Nome completo do cliente',
        type: 'string',
        required: true,
      },
      email: {
        description: 'Email do cliente',
        type: 'string',
        required: true,
      },
      telefone: {
        description: 'Telefone do cliente (WhatsApp)',
        type: 'string',
        required: true,
      },
      data: {
        description: 'Data da reunião no formato YYYY-MM-DD',
        type: 'string',
        required: true,
      },
      hora: {
        description: 'Horário da reunião no formato HH:mm (ex: 14:00)',
        type: 'string',
        required: true,
      },
      observacoes: {
        description: 'Observações adicionais sobre a reunião',
        type: 'string',
        required: false,
      },
    },
  },
  {
    name: 'reagendar_reuniao',
    description: 'Reagenda uma reunião existente para uma nova data/hora.',
    parameter_definitions: {
      reuniao_id: {
        description: 'ID da reunião a ser reagendada',
        type: 'string',
        required: true,
      },
      nova_data: {
        description: 'Nova data no formato YYYY-MM-DD',
        type: 'string',
        required: true,
      },
      nova_hora: {
        description: 'Novo horário no formato HH:mm',
        type: 'string',
        required: true,
      },
    },
  },
  {
    name: 'cancelar_reuniao',
    description: 'Cancela uma reunião agendada.',
    parameter_definitions: {
      reuniao_id: {
        description: 'ID da reunião a ser cancelada',
        type: 'string',
        required: true,
      },
    },
  },
  {
    name: 'consultar_dia_da_semana',
    description: 'Converte uma data para o dia da semana em português.',
    parameter_definitions: {
      data: {
        description: 'Data no formato YYYY-MM-DD ou DD/MM/YYYY',
        type: 'string',
        required: true,
      },
    },
  },
  {
    name: 'calculator',
    description: 'Executa cálculos matemáticos simples.',
    parameter_definitions: {
      expression: {
        description: 'Expressão matemática a calcular (ex: "2+2", "10*5")',
        type: 'string',
        required: true,
      },
    },
  },
];

// ========== EXECUTORES DE FERRAMENTAS ==========

/**
 * Verifica disponibilidade de horários na agenda
 */
async function executeVerificarDisponibilidade(daysAhead: number = 3): Promise<ToolExecutionResult> {
  try {
    const slots: AvailabilitySlot[] = [];
    const today = new Date();
    
    // Horários de trabalho: 9h às 18h
    const workHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    for (let i = 1; i <= daysAhead; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Pula fins de semana
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = weekDays[date.getDay()];

      // Pega os agendamentos do dia
      const meetings = await getMeetingsByDate(dateStr);
      const bookedTimes = meetings.map(m => m.time);

      // Filtra horários disponíveis
      const availableTimes = workHours.filter(time => !bookedTimes.includes(time));

      // Adiciona até 2 horários por dia
      availableTimes.slice(0, 2).forEach(time => {
        slots.push({
          date: dateStr,
          time,
          day_of_week: dayOfWeek,
          available: true,
        });
      });
    }

    return {
      success: true,
      data: {
        message: 'Horários disponíveis encontrados',
        slots,
      },
    };
  } catch (error) {
    console.error('[Cohere Tool] Erro ao verificar disponibilidade:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao verificar disponibilidade',
    };
  }
}

/**
 * Agenda uma nova reunião
 */
async function executeAgendarReuniao(params: {
  nome: string;
  email: string;
  telefone: string;
  data: string;
  hora: string;
  observacoes?: string;
  leadId: string;
}): Promise<ToolExecutionResult> {
  try {
    // Verifica se o horário está disponível
    const available = await isTimeSlotAvailable(params.data, params.hora);
    
    if (!available) {
      return {
        success: false,
        data: null,
        error: 'Horário não disponível. Por favor, escolha outro.',
      };
    }

    // Cria o agendamento
    const meeting = await createMeeting({
      lead_id: params.leadId,
      name: params.nome,
      email: params.email,
      phone: params.telefone,
      date: params.data,
      time: params.hora,
      status: 'scheduled',
      notes: params.observacoes,
    });

    return {
      success: true,
      data: {
        message: 'Reunião agendada com sucesso!',
        meeting,
      },
    };
  } catch (error) {
    console.error('[Cohere Tool] Erro ao agendar reunião:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao agendar reunião',
    };
  }
}

/**
 * Reagenda uma reunião
 */
async function executeReagendarReuniao(
  reuniaoId: string,
  novaData: string,
  novaHora: string
): Promise<ToolExecutionResult> {
  try {
    const available = await isTimeSlotAvailable(novaData, novaHora);
    
    if (!available) {
      return {
        success: false,
        data: null,
        error: 'Novo horário não disponível',
      };
    }

    const meeting = await updateMeeting(reuniaoId, {
      date: novaData,
      time: novaHora,
    });

    return {
      success: true,
      data: {
        message: 'Reunião reagendada com sucesso!',
        meeting,
      },
    };
  } catch (error) {
    console.error('[Cohere Tool] Erro ao reagendar:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao reagendar reunião',
    };
  }
}

/**
 * Cancela uma reunião
 */
async function executeCancelarReuniao(reuniaoId: string): Promise<ToolExecutionResult> {
  try {
    await cancelMeeting(reuniaoId);

    return {
      success: true,
      data: {
        message: 'Reunião cancelada com sucesso',
      },
    };
  } catch (error) {
    console.error('[Cohere Tool] Erro ao cancelar:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao cancelar reunião',
    };
  }
}

/**
 * Converte data para dia da semana
 */
function executeConsultarDiaDaSemana(data: string): ToolExecutionResult {
  try {
    const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    // Tenta parsear diferentes formatos
    let dateObj: Date;
    if (data.includes('/')) {
      const [day, month, year] = data.split('/');
      dateObj = new Date(`20${year}-${month}-${day}`);
    } else {
      dateObj = new Date(data);
    }

    const dayOfWeek = weekDays[dateObj.getDay()];

    return {
      success: true,
      data: {
        date: data,
        day_of_week: dayOfWeek,
        message: `${data} cai em ${dayOfWeek}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Formato de data inválido',
    };
  }
}

/**
 * Calculadora simples
 */
function executeCalculator(expression: string): ToolExecutionResult {
  try {
    // Remove caracteres perigosos
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
    const result = eval(sanitized);

    return {
      success: true,
      data: {
        expression: sanitized,
        result,
        message: `${sanitized} = ${result}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Expressão matemática inválida',
    };
  }
}

// ========== EXECUTOR PRINCIPAL DE TOOLS ==========

/**
 * Executa uma tool call do Cohere
 */
async function executeTool(
  toolName: string,
  parameters: Record<string, any>,
  leadId?: string
): Promise<ToolExecutionResult> {
  console.log(`[Cohere Tool] Executando: ${toolName}`, parameters);

  switch (toolName) {
    case 'verificar_disponibilidade':
      return executeVerificarDisponibilidade(parameters.days_ahead);

    case 'agendar_reuniao':
      if (!leadId) {
        return { success: false, data: null, error: 'Lead ID não fornecido' };
      }
      return executeAgendarReuniao({
        nome: parameters.nome,
        email: parameters.email,
        telefone: parameters.telefone,
        data: parameters.data,
        hora: parameters.hora,
        observacoes: parameters.observacoes,
        leadId,
      });

    case 'reagendar_reuniao':
      return executeReagendarReuniao(
        parameters.reuniao_id,
        parameters.nova_data,
        parameters.nova_hora
      );

    case 'cancelar_reuniao':
      return executeCancelarReuniao(parameters.reuniao_id);

    case 'consultar_dia_da_semana':
      return executeConsultarDiaDaSemana(parameters.data);

    case 'calculator':
      return executeCalculator(parameters.expression);

    default:
      return {
        success: false,
        data: null,
        error: `Tool desconhecida: ${toolName}`,
      };
  }
}

// ========== FUNÇÃO PRINCIPAL DO AGENTE ==========

/**
 * Converte histórico interno para formato Cohere
 */
function convertToCohereHistory(history: ChatMessage[]): any[] {
  return history.map(msg => {
    const role = msg.role === 'human' ? 'USER' : msg.role === 'ai' ? 'CHATBOT' : 'SYSTEM';
    
    if (role === 'USER') {
      return { role, message: msg.content };
    } else if (role === 'CHATBOT') {
      return { role, message: msg.content };
    } else {
      return { role, message: msg.content };
    }
  });
}

/**
 * Processa uma mensagem com o agente Cohere
 */
export async function processWithCohere(
  message: string,
  sessionId: string,
  chatHistory: ChatMessage[] = [],
  leadId?: string
): Promise<CohereResponse> {
  try {
    console.log('[Cohere] Processando mensagem:', message);

    const cohereHistory = convertToCohereHistory(chatHistory);

    // Primeira chamada à API do Cohere
    let response = await cohere.chat({
      message,
      chatHistory: cohereHistory,
      tools: TOOLS,
      preamble: SYSTEM_PROMPT,
      model: 'command-r-plus',
      temperature: 0.7,
      maxTokens: 500,
    });

    console.log('[Cohere] Resposta inicial:', response);

    // Se houver tool calls, executá-las
    if (response.toolCalls && response.toolCalls.length > 0) {
      const toolResults = await Promise.all(
        response.toolCalls.map(async (toolCall) => {
          const result = await executeTool(toolCall.name, toolCall.parameters, leadId);
          
          return {
            call: toolCall,
            outputs: [result.success ? result.data : { error: result.error }],
          };
        })
      );

      console.log('[Cohere] Tool results:', toolResults);

      // Segunda chamada com os resultados das tools
      response = await cohere.chat({
        message: '',
        chatHistory: cohereHistory,
        tools: TOOLS,
        preamble: SYSTEM_PROMPT,
        model: 'command-r-plus',
        temperature: 0.7,
        maxTokens: 500,
        toolResults,
      });

      console.log('[Cohere] Resposta final:', response);
    }

    return {
      text: response.text || '',
      tool_calls: response.toolCalls?.map(tc => ({
        name: tc.name,
        parameters: tc.parameters,
      })),
      finish_reason: response.finishReason as any || 'COMPLETE',
      generation_id: response.generationId,
    };
  } catch (error) {
    console.error('[Cohere] Erro ao processar:', error);
    throw error;
  }
}

export { TOOLS, SYSTEM_PROMPT };
