import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  Send,
  Pause,
  Play,
  User,
  TrendingUp,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const AgentView = () => {
  const { conversations, leads, agentActive, toggleAgent } = useStore();
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]?.id);
  const [messageText, setMessageText] = useState('');

  const currentConversation = conversations.find((c) => c.id === selectedConversation);
  const currentLead = currentConversation
    ? leads.find((l) => l.id === currentConversation.leadId)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agente SDR Virtual</h2>
          <p className="text-muted-foreground">Conversas automatizadas com leads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Agente {agentActive ? 'Ativo' : 'Pausado'}</span>
            <Switch checked={agentActive} onCheckedChange={toggleAgent} />
          </div>
          <Badge variant={agentActive ? 'default' : 'secondary'} className={agentActive ? 'bg-success' : ''}>
            {agentActive ? (
              <>
                <Play className="h-3 w-3 mr-1" />
                Ativo
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pausado
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Conversations List */}
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Conversas Ativas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-1 p-2">
                {conversations.map((conv) => {
                  const lead = leads.find((l) => l.id === conv.leadId);
                  const lastMessage = conv.messages[conv.messages.length - 1];
                  const isSelected = selectedConversation === conv.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{lead?.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {lead?.score}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {lastMessage.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(lastMessage.timestamp, { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-6 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {currentLead?.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentLead?.name}</p>
                  <p className="text-sm text-muted-foreground">{currentLead?.company}</p>
                </div>
              </div>
              {currentConversation?.intent && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  {currentConversation.intent}
                </Badge>
              )}
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {currentConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'assistant' ? 'text-muted-foreground' : 'opacity-75'
                      }`}
                    >
                      {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite uma mensagem..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // Add message logic here
                    setMessageText('');
                  }
                }}
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Lead Insights */}
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Insights do Lead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentLead && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <span className="text-2xl font-bold text-primary">{currentLead.score}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    +12 pontos hoje
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Empresa</h4>
                  <p className="text-sm text-muted-foreground">{currentLead.company}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Origem</h4>
                  <Badge variant="secondary">{currentLead.source}</Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentLead.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Próximos Passos Sugeridos
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Agendar demo do produto</li>
                    <li>• Enviar case de sucesso</li>
                    <li>• Conectar com especialista</li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Transferir para Humano
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
