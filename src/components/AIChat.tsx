/**
 * ============================================================================
 * CHAT COM IA - ASSISTENTE INTELIGENTE
 * ============================================================================
 * Chat inteligente integrado ao CRM com análise de dados em tempo real
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, X, TrendingUp, AlertCircle, Lightbulb, Sparkles } from 'lucide-react';
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
    <Card className="flex flex-col h-[700px] w-full shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border-2 border-primary/20 shadow-sm">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
              Análise Inteligente do seu CRM
              <Badge variant="outline" className="gap-1 border-primary/30 text-primary text-xs">
                <Sparkles className="h-3 w-3" />
                Online
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Assistente de IA para vendas
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10">
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      {/* Stats Bar */}
      <div className="flex gap-3 px-6 py-4 bg-muted/30 border-b">
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 border-primary/30">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold">{leads.length}</span> Leads
        </Badge>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 border-accent/30">
          <Lightbulb className="h-3.5 w-3.5 text-accent" />
          <span className="font-semibold">{funnels.length}</span> Funis
        </Badge>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border mr-12 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Analisando dados...</span>
              </div>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-6 py-4 border-t border-b bg-gradient-to-r from-primary/5 to-transparent">
          <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Sugestões rápidas:
          </p>
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
                className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
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
      <CardContent className="p-5 border-t bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte sobre seus leads, pipeline, ou peça insights..."
            disabled={isLoading}
            className="flex-1 h-12 px-4 text-base border-2 focus:border-primary transition-all"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 h-12 w-12 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5" />
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
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-primary to-primary/80 text-white'
            : 'bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20'
        }`}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-primary" />}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 rounded-2xl p-4 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-primary to-primary/90 text-white ml-12'
            : 'bg-gradient-to-br from-muted to-muted/50 border border-border mr-12'
        }`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
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
  // Processar markdown de forma mais robusta
  const processLine = (line: string): JSX.Element | null => {
    if (!line.trim()) return null;

    // Lista com bullet points (- ou •)
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const text = line.substring(line.indexOf(' ') + 1);
      return <li key={Math.random()}>{processInlineFormatting(text)}</li>;
    }

    // Parágrafo normal
    return <p key={Math.random()}>{processInlineFormatting(line)}</p>;
  };

  // Processar formatação inline (negrito, itálico, etc)
  const processInlineFormatting = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let currentText = text;
    let index = 0;

    // Regex para encontrar **texto** (negrito)
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;
    let lastIndex = 0;

    while ((match = boldRegex.exec(currentText)) !== null) {
      // Adicionar texto antes do negrito
      if (match.index > lastIndex) {
        parts.push(currentText.substring(lastIndex, match.index));
      }
      
      // Adicionar texto em negrito
      parts.push(<strong key={`bold-${index++}`}>{match[1]}</strong>);
      
      lastIndex = boldRegex.lastIndex;
    }

    // Adicionar resto do texto
    if (lastIndex < currentText.length) {
      parts.push(currentText.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  // Separar por linhas e processar
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: JSX.Element[] = [];

  lines.forEach((line, idx) => {
    const element = processLine(line);
    
    if (element?.type === 'li') {
      listItems.push(element);
    } else {
      // Se temos itens de lista acumulados, criar ul
      if (listItems.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc list-inside space-y-1 my-2">{listItems}</ul>);
        listItems = [];
      }
      
      if (element) {
        elements.push(element);
      }
    }
  });

  // Adicionar lista final se existir
  if (listItems.length > 0) {
    elements.push(<ul key="list-final" className="list-disc list-inside space-y-1 my-2">{listItems}</ul>);
  }

  return <div className="space-y-2">{elements}</div>;
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
