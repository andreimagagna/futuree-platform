import { Lead } from '@/types/Agent';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Building2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentSidebarProps {
  leads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (leadId: string) => void;
}

export const AgentSidebar = ({ leads, selectedLeadId, onSelectLead }: AgentSidebarProps) => {
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-yellow-500 text-black';
    if (score >= 60) return 'bg-blue-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Interesse Alto';
    if (score >= 60) return 'Qualificado';
    return 'Aquecendo';
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Conversas Ativas</h2>
        <p className="text-sm text-muted-foreground">{leads.length} leads ativos</p>
      </div>

      {/* Leads List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {leads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className={cn(
                'w-full p-3 rounded-lg text-left transition-all duration-200',
                'hover:bg-muted/50',
                selectedLeadId === lead.id
                  ? 'bg-muted border border-primary'
                  : 'bg-transparent border border-transparent'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{lead.name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                    <Building2 className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                </div>
                {lead.score >= 80 && (
                  <TrendingUp className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn('text-xs px-2 py-0.5', getScoreBadgeColor(lead.score))}>
                  {lead.score} · {getScoreLabel(lead.score)}
                </Badge>
                {lead.status === 'manual' && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    Manual
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {formatDistanceToNow(new Date(lead.updatedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
