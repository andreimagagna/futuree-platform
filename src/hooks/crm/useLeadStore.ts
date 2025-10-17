/**
 * Hook useLeadStore - Integração Zustand + Supabase
 * 
 * Este hook substitui o useStore().leads fazendo com que todas as operações
 * de leads sejam salvas automaticamente no Supabase.
 */

// import { useStore } from '@/store/useStore';
import { 
  useCreateLead, 
  useUpdateLead, 
  useDeleteLead 
// import { useLeads } from '@/hooks/useLeadsAPI';



/**
 * Converte Lead do Zustand para LeadInsert do Supabase
 */

  return {
    name: lead.name,
    email: lead.email || null,
    phone: lead.whatsapp || null,
    whatsapp: lead.whatsapp || null,
    position: null, // Adicionar ao Lead se necessário
    status: 'novo', // Mapear status conforme necessário
    funnel_stage: mapStageToSupabase(lead.stage),
    score: lead.score || 0,
    source: lead.source || null,
    campaign: null,
    medium: null,
    estimated_value: lead.dealValue || null,
    expected_close_date: lead.expectedCloseDate?.toISOString() || null,
    last_contact_date: lead.lastContact?.toISOString() || null,
    next_action_date: lead.nextAction?.toISOString() || null,
    contact_count: 0,
    tags: lead.tags || [],
    custom_fields: {
      company: lead.company,
      owner: lead.owner,
      notes: lead.notes,
      website: lead.website,
      companySize: lead.companySize,
      employeeCount: lead.employeeCount,
      products: lead.products ? JSON.parse(JSON.stringify(lead.products)) : null,
      bant: lead.bant ? JSON.parse(JSON.stringify(lead.bant)) : null,
      lostReason: lead.lostReason,
      lostCompetitor: lead.lostCompetitor,
    } as any,
    notes: lead.notes || null,
  };
}

/**
 * Mapeia stages do Zustand para Supabase
 */
function mapStageToSupabase(stage: Lead['stage']): 'capturado' | 'qualificacao' | 'apresentacao' | 'proposta' | 'negociacao' | 'fechamento' {

    captured: 'capturado',
    qualify: 'qualificacao',
    contact: 'apresentacao',
    proposal: 'proposta',
    closing: 'fechamento',
  };
  return stageMap[stage] || 'capturado';
}

/**
 * Mapeia status do Zustand para Supabase
 */

  if (!status) return 'novo';
  
  const statusMap: Record<string, 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'> = {
    open: 'novo',
    won: 'ganho',
    lost: 'perdido',
  };
  
  return statusMap[status] || 'novo';
}

/**
 * Hook principal que sincroniza Zustand com Supabase
 */
export function useLeadStore() {
  // TODO: Buscar leads do backend via hook
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  /**
   * Adiciona lead salvando no Supabase e atualizando Zustand
   */

    try {
      // 1. Salvar no Supabase
      const supabaseLead = convertToSupabaseLead(lead);
      const savedLead = await createLeadMutation.mutateAsync(supabaseLead);

      // 2. Atualizar Zustand com o ID do Supabase
      const leadWithSupabaseId = {
        ...lead,
        id: savedLead.id, // Usar ID do Supabase
      };


      return savedLead;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  };

  /**
   * Atualiza lead salvando no Supabase e atualizando Zustand
   */

    try {
      // 1. Preparar updates para o Supabase
      const supabaseUpdates: LeadUpdate = {};

      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.email) supabaseUpdates.email = updates.email;
      if (updates.whatsapp) {
        supabaseUpdates.phone = updates.whatsapp;
        supabaseUpdates.whatsapp = updates.whatsapp;
      }
      if (updates.score !== undefined) supabaseUpdates.score = updates.score;
      if (updates.source) supabaseUpdates.source = updates.source;
      if (updates.dealValue !== undefined) supabaseUpdates.estimated_value = updates.dealValue;
      if (updates.expectedCloseDate) supabaseUpdates.expected_close_date = updates.expectedCloseDate.toISOString();
      if (updates.lastContact) supabaseUpdates.last_contact_date = updates.lastContact.toISOString();
      if (updates.nextAction) supabaseUpdates.next_action_date = updates.nextAction.toISOString();
      if (updates.tags) supabaseUpdates.tags = updates.tags;
      if (updates.notes) supabaseUpdates.notes = updates.notes;
      
      // Mapear stage se alterado
      if (updates.stage) {
        supabaseUpdates.funnel_stage = mapStageToSupabase(updates.stage);
      }

      // Mapear status se alterado
      if (updates.status) {
        supabaseUpdates.status = mapStatusToSupabase(updates.status);
      }

      // Campos customizados
      const customFields: any = {};
      if (updates.company) customFields.company = updates.company;
      if (updates.owner) customFields.owner = updates.owner;
      if (updates.website) customFields.website = updates.website;
      if (updates.companySize) customFields.companySize = updates.companySize;
      if (updates.employeeCount) customFields.employeeCount = updates.employeeCount;
      if (updates.products) customFields.products = updates.products;
      if (updates.bant) customFields.bant = updates.bant;
      if (updates.lostReason) customFields.lostReason = updates.lostReason;
      if (updates.lostCompetitor) customFields.lostCompetitor = updates.lostCompetitor;

      if (Object.keys(customFields).length > 0) {
        // Buscar lead atual para mesclar custom_fields

        const currentCustomFields = (currentLead as any)?.custom_fields || {};
        supabaseUpdates.custom_fields = { ...currentCustomFields, ...customFields };
      }

      // 2. Salvar no Supabase
      const savedLead = await updateLeadMutation.mutateAsync({ id, updates: supabaseUpdates });

      // 3. Atualizar Zustand


      return savedLead;
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      throw error;
    }
  };

  /**
   * Deleta lead do Supabase e Zustand
   */
  const deleteLead = async (id: string) => {
    try {
      // 1. Deletar do Supabase (soft delete)
      await deleteLeadMutation.mutateAsync(id);

      // 2. Remover do Zustand

    } catch (error) {
      console.error('Erro ao deletar lead:', error);
      throw error;
    }
  };

  return {
    // State do Zustand

    
    // Actions que salvam no Supabase
    addLead,
    updateLead,
    deleteLead,
    
    // Status das mutations
    isCreating: createLeadMutation.isPending,
    isUpdating: updateLeadMutation.isPending,
    isDeleting: deleteLeadMutation.isPending,
  };
}
