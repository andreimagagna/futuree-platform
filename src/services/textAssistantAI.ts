/**
 * ============================================================================
 * TEXT ASSISTANT AI SERVICE
 * ============================================================================
 * Assistente de IA para construção e melhoria de textos usando Cohere
 * ============================================================================
 */

import { CohereClient } from 'cohere-ai';

const COHERE_API_KEY = import.meta.env.VITE_API_COHERE || '3Bji1bbllv12ZLgHyMwvNrCt6swa19FEQ65iiVDX';

const cohere = new CohereClient({
  token: COHERE_API_KEY,
});

// ============================================================================
// TEXT ASSISTANT - Auxiliar na construção de textos
// ============================================================================

export async function assistTextWithAI(
  prompt: string,
  currentTitle: string,
  currentContent: string
): Promise<string> {
  try {
    const contextPrompt = buildTextContext(currentTitle, currentContent);
    
    const response = await cohere.chat({
      message: prompt,
      preamble: `Você é um assistente de escrita profissional e criativo. Seu objetivo é ajudar na construção, melhoria e edição de textos.

CONTEXTO DO DOCUMENTO:
${contextPrompt}

INSTRUÇÕES:
- Seja objetivo e direto nas sugestões
- Mantenha o tom profissional quando solicitado
- Preserve a intenção original do autor
- Corrija erros gramaticais e ortográficos
- Melhore a clareza e coesão do texto
- Use Markdown quando necessário (negrito, títulos, listas)
- Seja criativo quando solicitado expansão de ideias
- Para resumos, seja conciso e capture os pontos principais

IMPORTANTE: Retorne APENAS o texto melhorado/sugerido, sem explicações adicionais, a menos que especificamente solicitado.`,
      model: 'command-r-08-2024',
      temperature: 0.7,
    });

    return response.text;
  } catch (error) {
    console.error('[TextAssistantAI] Erro:', error);
    throw new Error('Erro ao processar solicitação. Tente novamente.');
  }
}

// ============================================================================
// FUNÇÕES ESPECÍFICAS DE ASSISTÊNCIA
// ============================================================================

export async function improveText(text: string): Promise<string> {
  const prompt = `Melhore o seguinte texto, tornando-o mais claro, coeso e profissional:

${text}`;
  
  return assistTextWithAI(prompt, "", text);
}

export async function fixGrammar(text: string): Promise<string> {
  const prompt = `Corrija os erros gramaticais e ortográficos do seguinte texto, mantendo o estilo original:

${text}`;
  
  return assistTextWithAI(prompt, "", text);
}

export async function summarizeText(text: string): Promise<string> {
  const prompt = `Resuma o seguinte texto em tópicos principais:

${text}`;
  
  return assistTextWithAI(prompt, "", text);
}

export async function expandIdeas(text: string): Promise<string> {
  const prompt = `Expanda as ideias do seguinte texto, adicionando mais detalhes, exemplos e explicações:

${text}`;
  
  return assistTextWithAI(prompt, "", text);
}

export async function makeMoreProfessional(text: string): Promise<string> {
  const prompt = `Reescreva o seguinte texto em um tom mais profissional e formal:

${text}`;
  
  return assistTextWithAI(prompt, "", text);
}

export async function simplifyLanguage(text: string): Promise<string> {
  const prompt = `Simplifique a linguagem do seguinte texto, tornando-o mais acessível e fácil de entender:

${text}`;
  
  return assistTextWithAI(prompt, "", text);
}

export async function continueWriting(currentText: string): Promise<string> {
  const prompt = `Continue escrevendo o seguinte texto de forma natural e coerente:

${currentText}`;
  
  return assistTextWithAI(prompt, "", currentText);
}

export async function createOutline(topic: string): Promise<string> {
  const prompt = `Crie um outline/estrutura detalhada para um texto sobre: ${topic}

Formate usando Markdown com títulos e subtópicos.`;
  
  return assistTextWithAI(prompt, topic, "");
}

// ============================================================================
// HELPERS
// ============================================================================

function buildTextContext(title: string, content: string): string {
  const parts: string[] = [];
  
  if (title && title !== "Sem título") {
    parts.push(`Título: "${title}"`);
  }
  
  if (content) {
    const preview = content.length > 500 
      ? content.substring(0, 500) + "..." 
      : content;
    parts.push(`Conteúdo atual:\n${preview}`);
  } else {
    parts.push("Documento vazio");
  }
  
  return parts.join("\n\n");
}
