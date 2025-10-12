import { Campaign } from '@/types/Marketing';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Share2, 
  DollarSign, 
  FileText, 
  Calendar,
  TrendingUp,
  Target,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaignId: string) => void;
  onToggleStatus?: (campaignId: string) => void;
  onViewDetails?: (campaign: Campaign) => void;
}

const campaignTypeConfig = {
  email: {
    icon: Mail,
    label: 'Email',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  social: {
    icon: Share2,
    label: 'Social Media',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  ads: {
    icon: DollarSign,
    label: 'Ads',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
  content: {
    icon: FileText,
    label: 'Content',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  event: {
    icon: Calendar,
    label: 'Event',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
  },
};

const statusConfig = {
  draft: {
    label: 'Rascunho',
    color: 'default',
    className: '',
  },
  active: {
    label: 'Ativa',
    color: 'default',
    className: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
  },
  paused: {
    label: 'Pausada',
    color: 'default',
    className: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
  },
  completed: {
    label: 'Concluída',
    color: 'default',
    className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  },
};

export const CampaignCard = ({
  campaign,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: CampaignCardProps) => {
  const typeConfig = campaignTypeConfig[campaign.type];
  const TypeIcon = typeConfig.icon;
  
  const budgetUsed = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
  const roi = campaign.spent > 0 ? ((campaign.revenue - campaign.spent) / campaign.spent) * 100 : 0;
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
  
  const daysRemaining = differenceInDays(new Date(campaign.endDate), new Date());
  const isEnding = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining < 0;
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
    return `R$ ${value.toFixed(0)}`;
  };
  
  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn('p-2 rounded-lg', typeConfig.bgColor)}>
              <TypeIcon className={cn('h-5 w-5', typeConfig.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-base mb-1 truncate cursor-pointer hover:text-primary"
                onClick={() => onViewDetails?.(campaign)}
              >
                {campaign.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant={statusConfig[campaign.status].color as any}
                  className={statusConfig[campaign.status].className}
                >
                  {statusConfig[campaign.status].label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {typeConfig.label}
                </Badge>
                {isEnding && campaign.status === 'active' && (
                  <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                    Termina em {daysRemaining}d
                  </Badge>
                )}
                {isExpired && campaign.status === 'active' && (
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                    Expirada
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(campaign)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(campaign)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              {campaign.status === 'active' && (
                <DropdownMenuItem onClick={() => onToggleStatus?.(campaign.id)}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </DropdownMenuItem>
              )}
              {campaign.status === 'paused' && (
                <DropdownMenuItem onClick={() => onToggleStatus?.(campaign.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  Reativar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(campaign.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {campaign.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {campaign.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Período */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(campaign.startDate), 'dd MMM', { locale: ptBR })} - {format(new Date(campaign.endDate), 'dd MMM yyyy', { locale: ptBR })}
          </span>
        </div>
        
        {/* Budget Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">
              {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all rounded-full',
                budgetUsed >= 90 ? 'bg-destructive' : budgetUsed >= 70 ? 'bg-warning' : 'bg-primary'
              )}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {budgetUsed.toFixed(0)}% utilizado
          </div>
        </div>
        
        {/* Métricas Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <div className="text-xs text-muted-foreground mb-1">ROI</div>
            <div className={cn(
              'text-lg font-bold',
              roi >= 100 ? 'text-success dark:text-green-400' : roi >= 0 ? 'text-warning dark:text-yellow-400' : 'text-destructive'
            )}>
              {roi.toFixed(0)}%
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1">Receita</div>
            <div className="text-lg font-bold">
              {formatCurrency(campaign.revenue)}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1">Leads</div>
            <div className="text-lg font-bold flex items-center gap-1">
              <Target className="h-4 w-4 text-primary" />
              {formatNumber(campaign.leads)}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1">Conversões</div>
            <div className="text-lg font-bold flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-success dark:text-green-400" />
              {formatNumber(campaign.conversions)}
            </div>
          </div>
        </div>
        
        {/* Métricas Extras (se houver cliques/impressions) */}
        {campaign.impressions > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
            <div>
              <span className="text-muted-foreground">CTR: </span>
              <span className="font-medium">{ctr.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Conv.: </span>
              <span className="font-medium">{conversionRate.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Impressões: </span>
              <span className="font-medium">{formatNumber(campaign.impressions)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cliques: </span>
              <span className="font-medium">{formatNumber(campaign.clicks)}</span>
            </div>
          </div>
        )}
        
        {/* Canais */}
        {campaign.channels.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t">
            {campaign.channels.slice(0, 3).map((channel) => (
              <Badge key={channel} variant="secondary" className="text-xs">
                {channel}
              </Badge>
            ))}
            {campaign.channels.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{campaign.channels.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
