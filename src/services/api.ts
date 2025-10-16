import { supabase } from '@/integrations/supabase/client';

/**
 * API Service Layer - Pensando em Escala
 *
 * Esta camada fornece serviços otimizados para operações de banco de dados
 * com foco em performance, escalabilidade e manutenibilidade.
 */

// ========================================
// TYPES
// ========================================

export type TableName = 'leads' | 'user_preferences' | 'company_settings' | 'saved_funnels' | 'landing_pages' | 'automation_settings';

export interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  realtime?: boolean;
}

export interface MutationOptions {
  optimistic?: boolean;
  invalidateCache?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  retry?: number;
}

// ========================================
// BASE SERVICE CLASS
// ========================================

export class BaseApiService {
  protected table: string;

  constructor(table: string) {
    this.table = table;
  }

  // Query com cache inteligente
  async query(options: QueryOptions = {}): Promise<any[]> {
    const {
      select = '*',
      filters = {},
      orderBy,
      limit,
      offset
    } = options;

    let query = (supabase as any)
      .from(this.table)
      .select(select);

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'string' && value.includes('.')) {
          // Suporte para operadores como gte.70
          const [op, val] = value.split('.');
          if (op === 'gte') query = query.gte(key, Number(val));
          else if (op === 'lte') query = query.lte(key, Number(val));
          else if (op === 'gt') query = query.gt(key, Number(val));
          else if (op === 'lt') query = query.lt(key, Number(val));
          else query = query.eq(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });

    // Ordenação
    if (orderBy) {
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending ?? true
      });
    }

    // Paginação
    if (limit) query = query.limit(limit);
    if (offset) query = query.range(offset, offset + (limit || 10) - 1);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Buscar por ID
  async findById(id: string, select = '*'): Promise<any | null> {
    const { data, error } = await (supabase as any)
      .from(this.table)
      .select(select)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  // Criar com validação
  async create(data: any, options: MutationOptions = {}): Promise<any> {
    const { onSuccess, onError } = options;

    try {
      // Validação básica
      this.validateInsertData(data);

      const { data: result, error } = await (supabase as any)
        .from(this.table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      onSuccess?.(result);
      return result;
    } catch (error) {
      onError?.(error);
      throw error;
    }
  }

  // Atualizar com validação
  async update(id: string, updates: any, options: MutationOptions = {}): Promise<any> {
    const { onSuccess, onError } = options;

    try {
      // Validação básica
      this.validateUpdateData(updates);

      const { data, error } = await (supabase as any)
        .from(this.table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      onSuccess?.(data);
      return data;
    } catch (error) {
      onError?.(error);
      throw error;
    }
  }

  // Deletar com soft delete se suportado
  async delete(id: string, options: MutationOptions = {}): Promise<boolean> {
    const { onSuccess, onError } = options;

    try {
      // Verificar se a tabela suporta soft delete
      if (this.hasSoftDelete()) {
        const { error } = await (supabase as any)
          .from(this.table)
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from(this.table)
          .delete()
          .eq('id', id);

        if (error) throw error;
      }

      onSuccess?.(true);
      return true;
    } catch (error) {
      onError?.(error);
      throw error;
    }
  }

  // Contar registros
  async count(filters: Record<string, any> = {}): Promise<number> {
    let query = (supabase as any)
      .from(this.table)
      .select('*', { count: 'exact', head: true });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }

  // Busca com paginação
  async paginate(options: QueryOptions & { page: number; pageSize: number }) {
    const { page, pageSize, ...queryOptions } = options;
    const offset = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.query({ ...queryOptions, limit: pageSize, offset }),
      this.count(queryOptions.filters)
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      }
    };
  }

  // Métodos para validação (podem ser sobrescritos)
  protected validateInsertData(data: any): void {
    // Implementar validações específicas por tabela
  }

  protected validateUpdateData(data: any): void {
    // Implementar validações específicas por tabela
  }

  protected hasSoftDelete(): boolean {
    // Verificar se a tabela tem campo deleted_at
    return false; // Por padrão, não tem
  }
}

// ========================================
// SERVICES ESPECÍFICOS
// ========================================

export class LeadsService extends BaseApiService {
  constructor() {
    super('leads');
  }

  // Buscar leads por owner
  async findByOwner(ownerId: string, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, owner_id: ownerId }
    });
  }

  // Buscar leads por empresa
  async findByCompany(companyId: string, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, company_id: companyId }
    });
  }

  // Buscar leads por etapa
  async findByStage(stage: string, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, etapa: stage }
    });
  }

  // Buscar leads por origem
  async findByOrigin(origin: string, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, origem: origin }
    });
  }

  // Buscar leads com score alto
  async findHighScore(minScore: number = 70, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, score: `gte.${minScore}` }
    });
  }

  protected validateInsertData(data: any): void {
    if (!data.name) {
      throw new Error('Nome é obrigatório para leads');
    }
  }
}

export class UserPreferencesService extends BaseApiService {
  constructor() {
    super('user_preferences');
  }

  // Buscar preferências por usuário
  async findByUser(userId: string) {
    return this.findById(userId);
  }

  // Atualizar preferências do usuário
  async updateUserPreferences(userId: string, preferences: any) {
    return this.update(userId, preferences);
  }

  protected validateInsertData(data: any): void {
    if (!data.id) {
      throw new Error('ID do usuário é obrigatório');
    }
  }
}

export class CompanySettingsService extends BaseApiService {
  constructor() {
    super('company_settings');
  }

  // Buscar configurações por empresa
  async findByCompany(companyId: string) {
    return this.findById(companyId);
  }

  // Atualizar configurações da empresa
  async updateCompanySettings(companyId: string, settings: any) {
    return this.update(companyId, settings);
  }

  protected validateInsertData(data: any): void {
    if (!data.id) {
      throw new Error('ID da empresa é obrigatório');
    }
  }
}

export class SavedFunnelsService extends BaseApiService {
  constructor() {
    super('saved_funnels');
  }

  // Buscar funnels por usuário
  async findByUser(userId: string, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, user_id: userId }
    });
  }

  // Buscar funnel por nome
  async findByName(userId: string, name: string) {
    return this.query({
      filters: { user_id: userId, name }
    });
  }

  protected validateInsertData(data: any): void {
    if (!data.user_id) {
      throw new Error('ID do usuário é obrigatório');
    }
    if (!data.name) {
      throw new Error('Nome do funnel é obrigatório');
    }
    if (!data.funnel_data) {
      throw new Error('Dados do funnel são obrigatórios');
    }
  }
}

export class LandingPagesService extends BaseApiService {
  constructor() {
    super('landing_pages');
  }

  // Buscar landing pages por usuário
  async findByUser(userId: string, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, user_id: userId }
    });
  }

  // Buscar por slug
  async findBySlug(slug: string) {
    const result = await this.query({
      filters: { slug }
    });
    return result[0] || null;
  }

  // Buscar páginas publicadas
  async findPublished(options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, published: true }
    });
  }

  protected validateInsertData(data: any): void {
    if (!data.user_id) {
      throw new Error('ID do usuário é obrigatório');
    }
    if (!data.title) {
      throw new Error('Título é obrigatório');
    }
    if (!data.slug) {
      throw new Error('Slug é obrigatório');
    }
    if (!data.content) {
      throw new Error('Conteúdo é obrigatório');
    }
  }
}

export class AutomationSettingsService extends BaseApiService {
  constructor() {
    super('automation_settings');
  }

  // Buscar configurações por usuário
  async findByUser(userId: string, options: QueryOptions = {}) {
    return this.query({
      ...options,
      filters: { ...options.filters, user_id: userId }
    });
  }

  // Buscar configuração específica
  async findByKey(userId: string, key: string) {
    const result = await this.query({
      filters: { user_id: userId, setting_key: key }
    });
    return result[0] || null;
  }

  // Atualizar ou criar configuração
  async upsertSetting(userId: string, key: string, value: any) {
    const existing = await this.findByKey(userId, key);

    if (existing) {
      return this.update(existing.id, {
        setting_value: value
      });
    } else {
      return this.create({
        user_id: userId,
        setting_key: key,
        setting_value: value
      });
    }
  }

  protected validateInsertData(data: any): void {
    if (!data.user_id) {
      throw new Error('ID do usuário é obrigatório');
    }
    if (!data.setting_key) {
      throw new Error('Chave da configuração é obrigatória');
    }
    if (data.setting_value === undefined) {
      throw new Error('Valor da configuração é obrigatório');
    }
  }
}

// ========================================
// FACTORY PARA CRIAR INSTÂNCIAS
// ========================================

export const apiServices = {
  leads: new LeadsService(),
  userPreferences: new UserPreferencesService(),
  companySettings: new CompanySettingsService(),
  savedFunnels: new SavedFunnelsService(),
  landingPages: new LandingPagesService(),
  automationSettings: new AutomationSettingsService(),
} as const;

// Type helper
export type ApiServices = typeof apiServices;