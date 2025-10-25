/**
 * ============================================================================
 * COHERE AI SERVICE
 * ============================================================================
 * Serviço de Inteligência Artificial usando Cohere para análise de dados do CRM
 * 
 * Funcionalidades:
 * - Chat inteligente com contexto dos dados
 * - Análise de leads e oportunidades
 * - Insights de vendas e previsões
 * - Sugestões de próximas ações
 * - Análise de performance
 * ============================================================================
 */

import { CohereClient } from 'cohere-ai';

const COHERE_API_KEY = import.meta.env.VITE_API_COHERE || '3Bji1bbllv12ZLgHyMwvNrCt6swa19FEQ65iiVDX';

const cohere = new CohereClient({
  token: COHERE_API_KEY,
});

// ============================================================================
// TYPES
// ============================================================================

export interface ChatMessage {
  role: 'USER' | 'CHATBOT';
  message: string;
}

export interface LeadAnalysis {
  score: number;
  insights: string[];
  nextActions: string[];
  risks: string[];
  opportunities: string[];
}

export interface SalesInsight {
  summary: string;
  trends: string[];
  predictions: string[];
  recommendations: string[];
}

// ============================================================================
// CHAT AI - Conversa inteligente com contexto
// ============================================================================

export async function chatWithAI(
  message: string,
  context: any,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Preparar contexto do CRM
    const contextPrompt = buildContextPrompt(context);
    
    // Preparar histórico de conversa no formato correto
    const chatHistoryFormatted = chatHistory.map(msg => ({
      role: msg.role,
      message: msg.message,
    }));

    const response = await cohere.chat({
      message,
      chatHistory: chatHistoryFormatted,
      preamble: `Você é um assistente de IA especializado em CRM e vendas B2B. 
Você tem acesso aos dados do CRM do usuário e pode fornecer insights, análises e recomendações.

Contexto atual do CRM:
${contextPrompt}

Seja objetivo, prático e forneça insights acionáveis. Use dados concretos quando disponíveis.`,
      model: 'command-r-08-2024',
      temperature: 0.7,
    });

    return response.text;
  } catch (error) {
    console.error('[CohereAI] Erro no chat:', error);
    throw new Error('Erro ao processar mensagem. Tente novamente.');
  }
}

// ============================================================================
// ANÁLISE DE LEAD - Insights individuais
// ============================================================================

export async function analyzeLeadWithAI(lead: any): Promise<LeadAnalysis> {
  try {
    const prompt = `Analise este lead do CRM e forneça insights acionáveis:

**Dados do Lead:**
- Nome: ${lead.name}
- Empresa: ${lead.company || 'Não informada'}
- Email: ${lead.email || 'Não informado'}
- Telefone: ${lead.phone || 'Não informado'}
- Score: ${lead.score || 0}/100
- Status: ${lead.status}
- Estágio: ${lead.stage || lead.funnel_stage || 'Não definido'}
- Fonte: ${lead.source || 'Não informada'}
- Valor Estimado: ${lead.dealValue || lead.estimated_value || 'Não informado'}
- Último Contato: ${lead.lastContact || lead.last_contact_date || 'Nunca'}
- Tags: ${lead.tags?.join(', ') || 'Nenhuma'}
- Notas: ${lead.notes || 'Nenhuma nota'}

Forneça a análise em formato JSON com:
{
  "score": número de 0-100 (qualidade do lead),
  "insights": [array de insights sobre o lead],
  "nextActions": [array de próximas ações recomendadas],
  "risks": [array de riscos identificados],
  "opportunities": [array de oportunidades identificadas]
}`;

    const response = await cohere.chat({
      message: prompt,
      model: 'command-r-08-2024',
      temperature: 0.3,
    });

    // Tentar parsear JSON da resposta
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback: criar estrutura manualmente
    return {
      score: lead.score || 50,
      insights: ['Análise completa disponível na resposta'],
      nextActions: ['Entre em contato em até 24h'],
      risks: [],
      opportunities: [],
    };
  } catch (error) {
    console.error('[CohereAI] Erro ao analisar lead:', error);
    throw new Error('Erro ao analisar lead. Tente novamente.');
  }
}

// ============================================================================
// INSIGHTS DE VENDAS - Análise geral do pipeline
// ============================================================================

export async function generateSalesInsights(data: {
  leads: any[];
  funnels: any[];
  activities: any[];
  period?: string;
}): Promise<SalesInsight> {
  try {
    const { leads, funnels, activities, period = 'últimos 30 dias' } = data;

    const prompt = `Analise os dados do pipeline de vendas e forneça insights estratégicos:

**Métricas Gerais:**
- Total de Leads: ${leads.length}
- Leads por Status: ${getLeadsByStatus(leads)}
- Leads por Estágio: ${getLeadsByStage(leads)}
- Valor Total do Pipeline: R$ ${calculateTotalValue(leads)}
- Taxa de Conversão: ${calculateConversionRate(leads)}%
- Atividades Registradas: ${activities.length}

**Distribuição por Fonte:**
${getLeadsBySource(leads)}

**Período:** ${period}

Forneça a análise em formato JSON com:
{
  "summary": "resumo executivo de 2-3 frases",
  "trends": [array de tendências identificadas],
  "predictions": [array de previsões para próximo período],
  "recommendations": [array de recomendações estratégicas]
}`;

    const response = await cohere.chat({
      message: prompt,
      model: 'command-r-08-2024',
      temperature: 0.5,
    });

    // Tentar parsear JSON da resposta
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback
    return {
      summary: 'Análise completa dos dados do CRM disponível.',
      trends: ['Crescimento constante de leads'],
      predictions: ['Manutenção do ritmo atual'],
      recommendations: ['Continue monitorando as métricas'],
    };
  } catch (error) {
    console.error('[CohereAI] Erro ao gerar insights:', error);
    throw new Error('Erro ao gerar insights. Tente novamente.');
  }
}

// ============================================================================
// SUGESTÃO DE PRÓXIMA AÇÃO - Baseado em contexto
// ============================================================================

export async function suggestNextAction(lead: any, recentActivities: any[]): Promise<string[]> {
  try {
    const prompt = `Com base no histórico do lead, sugira as 3 melhores próximas ações:

**Lead:** ${lead.name} (${lead.company})
**Status Atual:** ${lead.status}
**Último Contato:** ${lead.lastContact || lead.last_contact_date || 'Nunca'}
**Score:** ${lead.score || 0}/100

**Atividades Recentes:**
${recentActivities.slice(0, 5).map(a => `- ${a.type}: ${a.title || a.description}`).join('\n')}

Retorne apenas um array JSON de strings com as 3 ações:
["ação 1", "ação 2", "ação 3"]`;

    const response = await cohere.chat({
      message: prompt,
      model: 'command-r-08-2024',
      temperature: 0.6,
    });

    // Tentar parsear array JSON
    const arrayMatch = response.text.match(/\[[\s\S]*?\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }

    return [
      'Fazer follow-up por email',
      'Agendar call de qualificação',
      'Enviar proposta personalizada',
    ];
  } catch (error) {
    console.error('[CohereAI] Erro ao sugerir ações:', error);
    return ['Entre em contato em breve', 'Qualifique o lead', 'Prepare proposta'];
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function buildContextPrompt(context: any): string {
  const { leads = [], funnels = [], activities = [], user = {} } = context;

  return `
- Total de Leads: ${leads.length}
- Funis Ativos: ${funnels.length}
- Atividades Recentes: ${activities.length}
- Usuário: ${user.email || 'Não identificado'}
- Leads Novos: ${leads.filter((l: any) => l.status === 'novo').length}
- Leads em Negociação: ${leads.filter((l: any) => l.status === 'negociacao').length}
- Taxa de Conversão: ${calculateConversionRate(leads)}%
  `.trim();
}

function getLeadsByStatus(leads: any[]): string {
  const statusCount: Record<string, number> = {};
  leads.forEach(lead => {
    const status = lead.status || 'indefinido';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
  return Object.entries(statusCount)
    .map(([status, count]) => `${status}: ${count}`)
    .join(', ');
}

function getLeadsByStage(leads: any[]): string {
  const stageCount: Record<string, number> = {};
  leads.forEach(lead => {
    const stage = lead.stage || lead.funnel_stage || 'indefinido';
    stageCount[stage] = (stageCount[stage] || 0) + 1;
  });
  return Object.entries(stageCount)
    .map(([stage, count]) => `${stage}: ${count}`)
    .join(', ');
}

function getLeadsBySource(leads: any[]): string {
  const sourceCount: Record<string, number> = {};
  leads.forEach(lead => {
    const source = lead.source || 'indefinida';
    sourceCount[source] = (sourceCount[source] || 0) + 1;
  });
  return Object.entries(sourceCount)
    .map(([source, count]) => `- ${source}: ${count} leads`)
    .join('\n');
}

function calculateTotalValue(leads: any[]): string {
  const total = leads.reduce((sum, lead) => {
    const value = lead.dealValue || lead.estimated_value || 0;
    return sum + (typeof value === 'number' ? value : parseFloat(value) || 0);
  }, 0);
  return total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function calculateConversionRate(leads: any[]): number {
  if (leads.length === 0) return 0;
  const won = leads.filter(l => l.status === 'ganho' || l.status === 'won').length;
  return Math.round((won / leads.length) * 100);
}

// ============================================================================
// ANÁLISE DE TEXTO - Extrair insights de notas/descrições
// ============================================================================

export async function analyzeText(text: string, type: 'note' | 'email' | 'proposal'): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  keyPoints: string[];
  actionItems: string[];
}> {
  try {
    const prompt = `Analise o seguinte ${type} e extraia:

${text}

Retorne em formato JSON:
{
  "sentiment": "positive" | "neutral" | "negative",
  "keyPoints": [principais pontos mencionados],
  "actionItems": [ações identificadas]
}`;

    const response = await cohere.chat({
      message: prompt,
      model: 'command-r-08-2024',
      temperature: 0.3,
    });

    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      sentiment: 'neutral',
      keyPoints: [],
      actionItems: [],
    };
  } catch (error) {
    console.error('[CohereAI] Erro ao analisar texto:', error);
    return {
      sentiment: 'neutral',
      keyPoints: [],
      actionItems: [],
    };
  }
}
