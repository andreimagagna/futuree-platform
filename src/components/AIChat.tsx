/**
 * ============================================================================
 * CHAT COM IA - COHERE AI ASSISTANT
 * ============================================================================
 * Chat inteligente integrado ao CRM com análise de dados em tempo real
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, X, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { chatWithAI, ChatMessage } from '@/services/cohereAI';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSupabaseLeads } from '@/hooks/useSupabaseLeads';
import { useCRMFunnels } from '@/hooks/useCRMFunnels';

interface AIChatProps {
  onClose?: () => void;
  initialContext?: 'leads' | 'funnels' | 'insights';
}

export function AIChat({ onClose, initialContext = 'leads' }: AIChatProps) {
  const { user } = useAuthContext();
  const { leads } = useSupabaseLeads();
  const funnelsQuery = useCRMFunnels();
  const funnels = funnelsQuery.data || [];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mensagem de boas-vindas
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(initialContext, leads.length, funnels.length);
      setMessages([
        {
          role: 'CHATBOT',
          message: welcomeMessage,
        },
      ]);
    }
  }, [initialContext, leads.length, funnels.length]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Adicionar mensagem do usuário
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'USER', message: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Preparar contexto do CRM
      const context = {
        leads,
        funnels,
        user,
        stats: {
          totalLeads: leads.length,
          newLeads: leads.filter(l => l.status === 'novo').length,
          activeLeads: leads.filter(l => l.status === 'contatado' || l.status === 'qualificado' || l.status === 'negociacao').length,
          wonDeals: leads.filter(l => l.status === 'ganho').length,
          lostDeals: leads.filter(l => l.status === 'perdido').length,
        },
      };

      // Chamar IA com contexto
      const aiResponse = await chatWithAI(userMessage, context, messages);

      // Adicionar resposta da IA
      setMessages([
        ...newMessages,
        { role: 'CHATBOT', message: aiResponse },
      ]);
    } catch (err: any) {
      console.error('[AIChat] Erro:', err);
      setError(err.message || 'Erro ao processar mensagem');
      
      // Adicionar mensagem de erro
      setMessages([
        ...newMessages,
        {
          role: 'CHATBOT',
          message: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Analisar Pipeline', prompt: 'Analise meu pipeline de vendas e dê insights' },
    { label: 'Leads Prioritários', prompt: 'Quais leads devo priorizar hoje?' },
    { label: 'Previsão de Vendas', prompt: 'Qual a previsão de vendas para este mês?' },
    { label: 'Sugestões de Ações', prompt: 'Que ações devo tomar para aumentar conversão?' },
  ];

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Assistente IA</CardTitle>
            <p className="text-sm text-muted-foreground">
              Análise inteligente do seu CRM
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      {/* Stats Bar */}
      <div className="flex gap-2 px-6 py-3 bg-muted/30 border-b">
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          {leads.length} Leads
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Lightbulb className="h-3 w-3" />
          {funnels.length} Funis
        </Badge>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Analisando dados...</span>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-6 py-3 border-t border-b bg-muted/20">
          <p className="text-xs text-muted-foreground mb-2">Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(action.prompt);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-6 py-2 bg-destructive/10 border-t border-destructive/20">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      {/* Input Area */}
      <CardContent className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte sobre seus leads, pipeline, ou peça insights..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          A IA tem acesso aos seus dados do CRM para fornecer insights personalizados
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MESSAGE BUBBLE COMPONENT
// ============================================================================

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'USER';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 rounded-lg p-4 ${
          isUser
            ? 'bg-primary text-primary-foreground ml-12'
            : 'bg-muted mr-12'
        }`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MessageContent content={message.message} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MESSAGE CONTENT FORMATTER
// ============================================================================

function MessageContent({ content }: { content: string }) {
  // Formatar markdown básico
  const formattedContent = content
    .split('\n')
    .map((line, idx) => {
      // Lista com bullet points
      if (line.trim().startsWith('- ')) {
        return <li key={idx}>{line.substring(2)}</li>;
      }
      // Títulos
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
        return <strong key={idx}>{line.replace(/\*\*/g, '')}</strong>;
      }
      // Parágrafo normal
      if (line.trim()) {
        return <p key={idx}>{line}</p>;
      }
      return null;
    })
    .filter(Boolean);

  return <>{formattedContent}</>;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getWelcomeMessage(context: string, leadsCount: number, funnelsCount: number): string {
  const messages = {
    leads: `👋 Olá! Sou seu assistente de IA para o CRM.

Posso ajudar você com análises e insights sobre seus **${leadsCount} leads** ativos.

**Algumas coisas que posso fazer:**
- Analisar a qualidade dos seus leads
- Sugerir próximas ações para cada lead
- Identificar oportunidades e riscos
- Prever resultados de vendas
- Recomendar estratégias de conversão

O que você gostaria de saber?`,

    funnels: `👋 Olá! Estou aqui para ajudar com seus **${funnelsCount} funis** de vendas.

**Posso analisar:**
- Performance de cada estágio do funil
- Taxa de conversão entre etapas
- Gargalos no processo de vendas
- Oportunidades de otimização

Como posso ajudar?`,

    insights: `👋 Olá! Pronto para gerar insights sobre seu pipeline!

**Métricas disponíveis:**
- ${leadsCount} leads no pipeline
- ${funnelsCount} funis configurados
- Análise de conversão e performance

Que tipo de insight você precisa hoje?`,
  };

  return messages[context] || messages.leads;
}
