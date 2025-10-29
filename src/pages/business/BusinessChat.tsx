import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Bot,
  User,
  Trash2,
  MessageSquare,
  Sparkles,
  Loader2,
  Plus,
  History,
  Save
} from "lucide-react";
import { chatWithAI, ChatMessage } from "@/services/cohereAI";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BusinessChatMessage extends ChatMessage {
  id: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: BusinessChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export function BusinessChat() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<BusinessChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat sessions from localStorage (temporary until Supabase table is created)
  const loadChatSessions = () => {
    try {
      const saved = localStorage.getItem('business_chat_sessions');
      if (saved) {
        const sessions: ChatSession[] = JSON.parse(saved).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    }
  };

  // Save chat sessions to localStorage (temporary)
  const saveChatSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem('business_chat_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Erro ao salvar sessões:', error);
    }
  };

  const saveChatSession = async (session: ChatSession) => {
    // Temporary: save to localStorage until Supabase table is created
    const updatedSessions = chatSessions.map(s => s.id === session.id ? session : s);
    saveChatSessions(updatedSessions);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: `Chat ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setShowHistory(false);
    }
  };

  const deleteChatSession = async (sessionId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);
    saveChatSessions(updatedSessions);

    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }

    toast({
      title: "✅ Chat excluído",
      description: "A conversa foi removida permanentemente",
    });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: BusinessChatMessage = {
      id: crypto.randomUUID(),
      role: 'USER',
      message: message.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    // Create session if it doesn't exist
    let currentSession = chatSessions.find(s => s.id === currentSessionId);
    if (!currentSession) {
      currentSession = {
        id: crypto.randomUUID(),
        title: message.trim().slice(0, 50) + (message.length > 50 ? "..." : ""),
        messages: newMessages,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setChatSessions(prev => [currentSession!, ...prev]);
      setCurrentSessionId(currentSession.id);
    } else {
      currentSession.messages = newMessages;
      currentSession.updatedAt = new Date();
    }

    try {
      // Get AI response
      const context = "Você é um assistente de IA especializado em negócios, estratégia empresarial, gestão e soluções tecnológicas. Forneça respostas profissionais, práticas e acionáveis.";
      const aiResponse = await chatWithAI(userMessage.message, context, messages);

      const aiMessage: BusinessChatMessage = {
        id: crypto.randomUUID(),
        role: 'CHATBOT',
        message: aiResponse,
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);

      // Update session
      currentSession.messages = finalMessages;
      await saveChatSession(currentSession);

      // Update sessions list
      setChatSessions(prev =>
        prev.map(s => s.id === currentSession!.id ? currentSession! : s)
      );

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível obter resposta da IA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Chat History Sidebar */}
      {showHistory && (
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Chats
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 pb-3">
              <Button
                onClick={createNewChat}
                className="w-full gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Novo Chat
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="px-4 space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => loadChatSession(session.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(session.updatedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {session.messages.length} mensagens
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession(session.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              Chat com IA Business
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                Histórico
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={createNewChat}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Chat
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bem-vindo ao Chat Business!</h3>
                  <p className="text-muted-foreground mb-4">
                    Converse com nossa IA especializada em negócios, estratégia e gestão empresarial.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "Como melhorar minha estratégia de vendas?",
                      "Preciso de ideias para otimizar processos",
                      "Como implementar automação no meu negócio?",
                      "Análise SWOT da minha empresa"
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessage(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === 'USER' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'CHATBOT' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.role === 'USER'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className={`text-sm whitespace-pre-wrap ${msg.role === 'CHATBOT' ? 'font-bold' : ''}`}>{msg.message}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {format(msg.timestamp, "HH:mm", { locale: ptBR })}
                      </p>
                    </div>

                    {msg.role === 'USER' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <Separator />

          {/* Input Area */}
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Enviar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Pressione Enter para enviar • Shift+Enter para nova linha
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}