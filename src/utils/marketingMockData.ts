import { Campaign, MarketingTask } from '@/types/Marketing';
import { subDays, addDays } from 'date-fns';

export const mockCampaigns: Campaign[] = [];

export const mockMarketingTasks: MarketingTask[] = [];

export const calculateCampaignMetrics = (campaigns: Campaign[]) => {
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  
  const roi = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const costPerLead = totalLeads > 0 ? totalSpent / totalLeads : 0;
  
  return {
    activeCampaigns: activeCampaigns.length,
    totalCampaigns: campaigns.length,
    totalBudget,
    totalSpent,
    totalRevenue,
    totalLeads,
    totalImpressions,
    totalClicks,
    totalConversions,
    roi,
    ctr,
    conversionRate,
    costPerLead,
  };
};

export const filterCampaigns = (
  campaigns: Campaign[],
  filters: {
    status?: Campaign['status'][];
    type?: Campaign['type'][];
    search?: string;
  }
) => {
  return campaigns.filter(campaign => {
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(campaign.status)) return false;
    }
    
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(campaign.type)) return false;
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        campaign.name.toLowerCase().includes(search) ||
        campaign.description?.toLowerCase().includes(search) ||
        campaign.channels.some(c => c.toLowerCase().includes(search))
      );
    }
    
    return true;
  });
};
