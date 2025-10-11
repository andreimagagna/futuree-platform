import { Lead } from '@/types/Agent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserCog, Building2, TrendingUp, Tag, Clock, PhoneCall } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AgentLeadInfoProps {
  lead: Lead | null;
  onTransfer: () => void;
}

export const AgentLeadInfo = ({ lead, onTransfer }: AgentLeadInfoProps) => {
  if (!lead) {
    return (
      <div className="h-full bg-card border border-border rounded-lg p-4">
        <div className="text-center text-muted-foreground mt-8">
          <UserCog className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhum lead selecionado</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-blue-500';
    return 'text-muted-foreground';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Interesse Alto 🔥';
    if (score >= 60) return 'Qualificado ✓';
    return 'Aquecendo...';
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Detalhes do Lead
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Name & Company */}
        <Card className="p-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Nome</p>
              <h3 className="text-lg font-semibold">{lead.name}</h3>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">{lead.company}</span>
            </div>
          </div>
        </Card>

        {/* Score */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className={cn('h-4 w-4', getScoreColor(lead.score))} />
              <span className="text-sm text-muted-foreground">Score</span>
            </div>
            <span className={cn('text-2xl font-bold', getScoreColor(lead.score))}>
              {lead.score}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{getScoreLabel(lead.score)}</p>
          
          {/* Score Bar */}
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                lead.score >= 80 ? 'bg-primary' : lead.score >= 60 ? 'bg-blue-500' : 'bg-muted-foreground'
              )}
              style={{ width: `${lead.score}%` }}
            />
          </div>
        </Card>

        {/* Tags */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Status */}
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant={lead.status === 'active' ? 'default' : 'secondary'}
              >
                {lead.status === 'active' ? '🤖 Agente Ativo' : '👤 Atendimento Manual'}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                Última atualização{' '}
                {formatDistanceToNow(new Date(lead.updatedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={onTransfer}
            variant="destructive"
            className="w-full"
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Transferir para Humano
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            O lead será transferido para atendimento manual
          </p>
        </div>
      </div>
    </div>
  );
};
