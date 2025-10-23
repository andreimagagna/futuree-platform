/**
 * ============================================================================
 * CONVERTERS: Marketing Data
 * ============================================================================
 * Funções para converter entre formatos do banco de dados (snake_case)
 * e o formato do frontend (camelCase)
 * ============================================================================
 */

import { Campaign as CampaignDB } from '@/hooks/useMarketingAPI';
import { Campaign as CampaignFE } from '@/types/Marketing';

/**
 * Converte Campaign do banco (snake_case) para o frontend (camelCase)
 */
export function dbToFECampaign(db: CampaignDB): CampaignFE {
  return {
    id: db.id,
    name: db.name,
    type: db.type as any,
    status: db.status as any,
    startDate: db.start_date || '',
    endDate: db.end_date || '',
    budget: db.budget || 0,
    spent: db.spent || 0,
    impressions: db.impressions || 0,
    clicks: db.clicks || 0,
    conversions: db.conversions || 0,
    leads: db.leads_generated || 0,
    revenue: db.revenue || 0,
    targetAudience: db.target_audience || [],
    channels: db.channels || [],
    creatives: [],
    landingPages: [],
    description: db.description,
    goals: db.goals,
    createdAt: db.created_at || new Date().toISOString(),
    updatedAt: db.updated_at || new Date().toISOString(),
  };
}

/**
 * Converte Campaign do frontend (camelCase) para o banco (snake_case)
 */
export function feToDBCampaign(fe: Partial<CampaignFE>): Partial<CampaignDB> {
  const db: Partial<CampaignDB> = {
    name: fe.name,
    description: fe.description,
    type: fe.type as any,
    status: fe.status as any,
    start_date: fe.startDate,
    end_date: fe.endDate,
    budget: fe.budget,
    spent: fe.spent,
    impressions: fe.impressions,
    clicks: fe.clicks,
    conversions: fe.conversions,
    leads_generated: fe.leads,
    revenue: fe.revenue,
    target_audience: fe.targetAudience,
    channels: fe.channels,
    goals: fe.goals,
  };

  // Remover campos undefined
  Object.keys(db).forEach(key => {
    if (db[key as keyof typeof db] === undefined) {
      delete db[key as keyof typeof db];
    }
  });

  return db;
}
