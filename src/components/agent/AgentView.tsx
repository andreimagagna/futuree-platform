import { useState, useEffect } from 'react';
import { Lead, Message } from '@/types/Agent';
import { fetchLeads } from '@/api/agentLeads';
import { fetchMessages, sendMessage, transferLead } from '@/api/agentMessages';
import { AgentSidebar } from './AgentSidebar';
import { AgentChat } from './AgentChat';
import { AgentLeadInfo } from './AgentLeadInfo';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Activity } from 'lucide-react';
import { toast } from 'sonner';

export const AgentView = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentActive, setAgentActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    if (selectedLeadId) {
      loadMessages(selectedLeadId);
    }
  }, [selectedLeadId]);

  const loadLeads = async () => {
    try {
      const data = await fetchLeads();
      setLeads(data);
      if (data.length > 0 && !selectedLeadId) {
        setSelectedLeadId(data[0].id);
      }
    } catch (error) {
      toast.error('Erro ao carregar leads');
      console.error(error);
    }
  };

  const loadMessages = async (leadId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchMessages(leadId);
      setMessages(data);
    } catch (error) {
      toast.error('Erro ao carregar mensagens');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedLeadId) return;
    try {
      const newMessage = await sendMessage(selectedLeadId, text);
      setMessages((prev) => [...prev, newMessage]);
      toast.success('Mensagem enviada!');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
      console.error(error);
    }
  };

  const handleTransferLead = async () => {
    if (!selectedLeadId) return;
    try {
      await transferLead(selectedLeadId);
      toast.success('Lead transferido para atendimento humano!', {
        description: 'A equipe de vendas foi notificada.',
      });
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLeadId ? { ...lead, status: 'manual' as const } : lead
        )
      );
    } catch (error) {
      toast.error('Erro ao transferir lead');
      console.error(error);
    }
  };

  const handleRefresh = () => {
    if (selectedLeadId) {
      loadMessages(selectedLeadId);
      toast.info('Mensagens atualizadas!');
    }
  };

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;
  const activeConversations = leads.filter((lead) => lead.status === 'active').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agente SDR</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg border border-border">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {activeConversations} conversas ativas
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg border border-border">
            <span className="text-sm font-medium">
              Agente {agentActive ? 'Ativo' : 'Pausado'}
            </span>
            <Switch
              checked={agentActive}
              onCheckedChange={(checked) => {
                setAgentActive(checked);
                toast.success(checked ? 'Agente ativado!' : 'Agente pausado');
              }}
            />
            <Badge variant={agentActive ? 'default' : 'secondary'}>
              {agentActive ? <><Play className="h-3 w-3 mr-1" />Ativo</> : <><Pause className="h-3 w-3 mr-1" />Pausado</>}
            </Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        <div className="col-span-3">
          <AgentSidebar leads={leads} selectedLeadId={selectedLeadId} onSelectLead={setSelectedLeadId} />
        </div>
        <div className="col-span-6">
          <AgentChat messages={messages} selectedLeadName={selectedLead?.name || null} onSendMessage={handleSendMessage} onRefresh={handleRefresh} isLoading={isLoading} />
        </div>
        <div className="col-span-3">
          <AgentLeadInfo lead={selectedLead} onTransfer={handleTransferLead} />
        </div>
      </div>
    </div>
  );
};
