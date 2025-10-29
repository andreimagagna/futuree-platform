import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Bot, MessageSquare, Users, Calendar, Activity, Settings, PlayCircle, PauseCircle, Zap } from "lucide-react";
import { SDRControlPanel } from "@/components/SDRControlPanel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Agent = () => {
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    messagesToday: 0,
    meetingsScheduled: 0,
  });

  const [isActive, setIsActive] = useState(true);

  return (
    <AppLayout currentView="agent">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              Agente SDR Virtual
            </h1>
            <p className="text-muted-foreground mt-2">
              Assistente de vendas inteligente com IA para WhatsApp
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className={`${isActive ? "bg-success" : "bg-muted"} px-4 py-2 text-sm`}
            >
              {isActive ? (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Agente Ativo
                </>
              ) : (
                <>
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Pausado
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversas Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalConversations}</div>
                <Users className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary">{stats.activeConversations}</div>
                <MessageSquare className="h-8 w-8 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mensagens Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-accent">{stats.messagesToday}</div>
                <Zap className="h-8 w-8 text-accent/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reuniões Agendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-success">{stats.meetingsScheduled}</div>
                <Calendar className="h-8 w-8 text-success/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="control" className="space-y-4">
          <TabsList>
            <TabsTrigger value="control">
              <Settings className="h-4 w-4 mr-2" />
              Controle
            </TabsTrigger>
            <TabsTrigger value="conversations">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversas
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Agendamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-4">
            <SDRControlPanel />

            <Card>
              <CardHeader>
                <CardTitle>Como Funciona o Agente SDR</CardTitle>
                <CardDescription>
                  Sistema completo de atendimento inteligente no WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">1</span>
                      </div>
                      <h4 className="font-semibold">Recebe Mensagens</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      O agente recebe mensagens via WhatsApp através da Evolution API
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">2</span>
                      </div>
                      <h4 className="font-semibold">Processa com IA</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      Usa Cohere AI para entender e responder de forma natural
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">3</span>
                      </div>
                      <h4 className="font-semibold">Qualifica Leads</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      Identifica necessidades e qualifica automaticamente
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <span className="text-success font-semibold">4</span>
                      </div>
                      <h4 className="font-semibold">Agenda Reuniões</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      Propõe horários e confirma agendamentos automaticamente
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">🎯 Recursos Especiais</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✅ Buffer de digitação (aguarda 7s para evitar mensagens picadas)</li>
                    <li>✅ Modo de atendimento humano (você pode assumir a conversa a qualquer momento)</li>
                    <li>✅ Suporte a áudio (transcrição automática) e imagens (análise visual)</li>
                    <li>✅ Simulação de digitação realista para parecer mais humano</li>
                    <li>✅ Memória de conversa com histórico completo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Conversas Recentes</CardTitle>
                <CardDescription>
                  Acompanhe as conversas do agente em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma conversa ativa no momento</p>
                  <p className="text-sm mt-2">As conversas aparecerão aqui quando o agente receber mensagens</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos</CardTitle>
                <CardDescription>
                  Reuniões agendadas pelo agente SDR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhum agendamento no momento</p>
                  <p className="text-sm mt-2">Os agendamentos confirmados aparecerão aqui</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Agent;
