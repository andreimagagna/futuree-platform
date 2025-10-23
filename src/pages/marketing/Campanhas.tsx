import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Megaphone, 
  Plus, 
  Search,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Zap,
  Calendar,
  Filter as FilterIcon,
  Loader2
} from "lucide-react";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { CampaignDialog } from "@/components/marketing/CampaignDialog";
import { CampaignDetailsDialog } from "@/components/marketing/CampaignDetailsDialog";
import { mockCampaigns, calculateCampaignMetrics, filterCampaigns } from "@/utils/marketingMockData";
import { Campaign, CampaignStatus, CampaignType } from "@/types/Marketing";
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from "@/hooks/useMarketingAPI";
import { dbToFECampaign, feToDBCampaign } from "@/utils/marketingConverters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const Campanhas = () => {
  const { toast } = useToast();
  
  // Backend hooks
  const { data: backendCampaignsDB = [], isLoading } = useCampaigns();
  const { mutate: createCampaignDB } = useCreateCampaign();
  const { mutate: updateCampaignDB } = useUpdateCampaign();
  const { mutate: deleteCampaign } = useDeleteCampaign();
  
  // Converter dados do banco para o formato do frontend
  const backendCampaigns = useMemo(
    () => backendCampaignsDB.map(dbToFECampaign),
    [backendCampaignsDB]
  );
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<CampaignType[]>([]);
  
  // Dialogs state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
  // Usar dados do backend se disponível, senão mock
  const campaigns = backendCampaigns.length > 0 ? backendCampaigns : mockCampaigns;
  
  // Calcular métricas
  const metrics = useMemo(() => calculateCampaignMetrics(campaigns), [campaigns]);
  
  // Filtrar campanhas
  const filteredCampaigns = useMemo(() => {
    return filterCampaigns(campaigns, {
      status: statusFilter.length > 0 ? statusFilter : undefined,
      type: typeFilter.length > 0 ? typeFilter : undefined,
      search: searchTerm,
    });
  }, [campaigns, statusFilter, typeFilter, searchTerm]);
  
  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setDialogOpen(true);
  };
  
  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setDialogOpen(true);
  };
  
  const handleSaveCampaign = (campaign: Campaign) => {
    if (editingCampaign) {
      // Update existing - converter para formato do banco
      updateCampaignDB({
        id: campaign.id,
        updates: feToDBCampaign(campaign)
      }, {
        onSuccess: () => {
          toast({
            title: "Campanha atualizada",
            description: `A campanha "${campaign.name}" foi atualizada com sucesso.`,
          });
          setDialogOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: "Erro ao atualizar",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    } else {
      // Create new - converter para formato do banco
      createCampaignDB(feToDBCampaign(campaign), {
        onSuccess: () => {
          toast({
            title: "Campanha criada",
            description: `A campanha "${campaign.name}" foi criada com sucesso.`,
          });
          setDialogOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: "Erro ao criar",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    }
  };
  
  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDetailsOpen(true);
  };
  
  const handleToggleStatus = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    
    updateCampaignDB({
      id: campaignId,
      updates: { status: newStatus }
    }, {
      onSuccess: () => {
        toast({
          title: newStatus === 'active' ? "Campanha ativada" : "Campanha pausada",
          description: `A campanha "${campaign.name}" foi ${newStatus === 'active' ? 'ativada' : 'pausada'}.`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };
  
  const handleDeleteCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    
    deleteCampaign(campaignId, {
      onSuccess: () => {
        toast({
          title: "Campanha excluída",
          description: `A campanha "${campaign.name}" foi excluída com sucesso.`,
          variant: "destructive",
        });
      }
    });
  };
  
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
    <div className="space-y-6">
      {/* Header Padronizado */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe suas campanhas de marketing</p>
        </div>
        <Button onClick={handleCreateCampaign} className="gap-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Nova Campanha
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* KPIs Principais - Layout Simples */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Campanhas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics.activeCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  de {metrics.totalCampaigns} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Leads Gerados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{formatNumber(metrics.totalLeads)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(metrics.costPerLead)} por lead
                </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(metrics.totalSpent)} investido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              ROI Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-3xl font-bold",
              metrics.roi >= 100 ? "text-success" : metrics.roi >= 0 ? "text-warning" : "text-destructive"
            )}>
              {metrics.roi.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.conversionRate.toFixed(1)}% conversão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Simples */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Filtro Status */}
            <Select value={statusFilter[0] || "all"} onValueChange={(value) => {
              setStatusFilter(value === 'all' ? [] : [value as CampaignStatus]);
            }}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filtro Tipo */}
            <Select value={typeFilter[0] || "all"} onValueChange={(value) => {
              setTypeFilter(value === 'all' ? [] : [value as CampaignType]);
            }}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="ads">Ads</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Filtros Ativos */}
          {(statusFilter.length > 0 || typeFilter.length > 0 || searchTerm) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Filtros:</span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1.5 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {statusFilter.map(status => (
                <Badge key={status} variant="secondary" className="text-xs">
                  {status}
                  <button
                    onClick={() => setStatusFilter([])}
                    className="ml-1.5 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {typeFilter.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                  <button
                    onClick={() => setTypeFilter([])}
                    className="ml-1.5 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {(statusFilter.length > 0 || typeFilter.length > 0 || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter([]);
                    setTypeFilter([]);
                  }}
                  className="h-6 text-xs"
                >
                  Limpar
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Campanhas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campanha' : 'campanhas'}
          </h2>
        </div>
        
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <FilterIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma campanha encontrada</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleCreateCampaign}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira campanha
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteCampaign}
                onViewDetails={handleViewDetails}
                onEdit={handleEditCampaign}
              />
            ))}
          </div>
        )}
      </div>
      </>
      )}

      {/* Dialogs */}
      <CampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        campaign={editingCampaign}
        onSave={handleSaveCampaign}
      />

      <CampaignDetailsDialog
        campaign={selectedCampaign}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={(campaign) => {
          setDetailsOpen(false);
          handleEditCampaign(campaign);
        }}
      />
    </div>
  );
};