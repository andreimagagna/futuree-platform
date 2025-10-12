import { useState, useEffect } from 'react';
import { Campaign, CampaignType, CampaignStatus } from '@/types/Marketing';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { format } from 'date-fns';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign | null;
  onSave: (campaign: Campaign) => void;
}

const campaignTypes: { value: CampaignType; label: string }[] = [
  { value: 'email', label: 'Email Marketing' },
  { value: 'social', label: 'Social Media' },
  { value: 'ads', label: 'Ads (Paid)' },
  { value: 'content', label: 'Content Marketing' },
  { value: 'event', label: 'Event' },
];

const campaignStatuses: { value: CampaignStatus; label: string }[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'active', label: 'Ativa' },
  { value: 'paused', label: 'Pausada' },
  { value: 'completed', label: 'Concluída' },
];

const defaultChannels = ['Email', 'LinkedIn', 'Google Ads', 'Facebook', 'Instagram', 'Twitter', 'Blog', 'YouTube'];
const defaultAudiences = ['C-Level', 'Gerentes', 'Tech Leads', 'Marketing', 'Vendas', 'SMBs', 'Enterprise', 'Startups'];

export const CampaignDialog = ({
  open,
  onOpenChange,
  campaign,
  onSave,
}: CampaignDialogProps) => {
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    type: 'email',
    status: 'draft',
    description: '',
    budget: 0,
    spent: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    channels: [],
    targetAudience: [],
    goals: [],
    impressions: 0,
    clicks: 0,
    conversions: 0,
    leads: 0,
    revenue: 0,
    creatives: [],
    landingPages: [],
  });

  const [newChannel, setNewChannel] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    if (campaign) {
      setFormData(campaign);
    } else {
      // Reset form for new campaign
      setFormData({
        name: '',
        type: 'email',
        status: 'draft',
        description: '',
        budget: 0,
        spent: 0,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        channels: [],
        targetAudience: [],
        goals: [],
        impressions: 0,
        clicks: 0,
        conversions: 0,
        leads: 0,
        revenue: 0,
        creatives: [],
        landingPages: [],
      });
    }
  }, [campaign, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const campaignData: Campaign = {
      id: campaign?.id || `campaign-${Date.now()}`,
      name: formData.name || '',
      type: formData.type || 'email',
      status: formData.status || 'draft',
      description: formData.description,
      budget: Number(formData.budget) || 0,
      spent: Number(formData.spent) || 0,
      startDate: formData.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: formData.endDate || format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      channels: formData.channels || [],
      targetAudience: formData.targetAudience || [],
      goals: formData.goals || [],
      impressions: Number(formData.impressions) || 0,
      clicks: Number(formData.clicks) || 0,
      conversions: Number(formData.conversions) || 0,
      leads: Number(formData.leads) || 0,
      revenue: Number(formData.revenue) || 0,
      creatives: formData.creatives || [],
      landingPages: formData.landingPages || [],
      createdAt: campaign?.createdAt || now,
      updatedAt: now,
    };

    onSave(campaignData);
    onOpenChange(false);
  };

  const addChannel = (channel: string) => {
    if (channel && !formData.channels?.includes(channel)) {
      setFormData(prev => ({
        ...prev,
        channels: [...(prev.channels || []), channel],
      }));
      setNewChannel('');
    }
  };

  const removeChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels?.filter(c => c !== channel) || [],
    }));
  };

  const addAudience = (audience: string) => {
    if (audience && !formData.targetAudience?.includes(audience)) {
      setFormData(prev => ({
        ...prev,
        targetAudience: [...(prev.targetAudience || []), audience],
      }));
      setNewAudience('');
    }
  };

  const removeAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience?.filter(a => a !== audience) || [],
    }));
  };

  const addGoal = () => {
    if (newGoal && !formData.goals?.includes(newGoal)) {
      setFormData(prev => ({
        ...prev,
        goals: [...(prev.goals || []), newGoal],
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals?.filter(g => g !== goal) || [],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {campaign ? 'Editar Campanha' : 'Nova Campanha'}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da campanha de marketing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Campanha *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Lançamento Produto Q4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as CampaignType }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o objetivo e estratégia da campanha..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as CampaignStatus }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data Fim *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Orçamento</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Total (R$) *</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spent">Investido (R$)</Label>
                <Input
                  id="spent"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.spent}
                  onChange={(e) => setFormData(prev => ({ ...prev, spent: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Targeting */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Segmentação</h3>
            
            <div className="space-y-2">
              <Label>Canais</Label>
              <div className="flex gap-2">
                <Select value={newChannel} onValueChange={addChannel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultChannels.map(channel => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.channels?.map(channel => (
                  <Badge key={channel} variant="secondary">
                    {channel}
                    <button
                      type="button"
                      onClick={() => removeChannel(channel)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Público-Alvo</Label>
              <div className="flex gap-2">
                <Select value={newAudience} onValueChange={addAudience}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione uma audiência" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultAudiences.map(audience => (
                      <SelectItem key={audience} value={audience}>
                        {audience}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.targetAudience?.map(audience => (
                  <Badge key={audience} variant="secondary">
                    {audience}
                    <button
                      type="button"
                      onClick={() => removeAudience(audience)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Objetivos</h3>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Ex: 500 leads qualificados"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addGoal();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addGoal}>
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {formData.goals?.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Métricas (apenas para edição) */}
          {campaign && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Métricas</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leads">Leads</Label>
                  <Input
                    id="leads"
                    type="number"
                    min="0"
                    value={formData.leads}
                    onChange={(e) => setFormData(prev => ({ ...prev, leads: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversions">Conversões</Label>
                  <Input
                    id="conversions"
                    type="number"
                    min="0"
                    value={formData.conversions}
                    onChange={(e) => setFormData(prev => ({ ...prev, conversions: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">Receita (R$)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.revenue}
                    onChange={(e) => setFormData(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="impressions">Impressões</Label>
                  <Input
                    id="impressions"
                    type="number"
                    min="0"
                    value={formData.impressions}
                    onChange={(e) => setFormData(prev => ({ ...prev, impressions: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clicks">Cliques</Label>
                  <Input
                    id="clicks"
                    type="number"
                    min="0"
                    value={formData.clicks}
                    onChange={(e) => setFormData(prev => ({ ...prev, clicks: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {campaign ? 'Salvar Alterações' : 'Criar Campanha'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
