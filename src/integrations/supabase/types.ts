// ============================================================================
// SUPABASE DATABASE TYPES
// Gerado automaticamente baseado no schema do banco de dados
// Data: 2025-10-22
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ============================================================================
      // PROFILES
      // ============================================================================
      profiles: {
        Row: {
          id: string
          email: string
          nome: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'manager' | 'user' | 'viewer'
          phone: string | null
          department: string | null
          position: string | null
          bio: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nome?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'user' | 'viewer'
          phone?: string | null
          department?: string | null
          position?: string | null
          bio?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'user' | 'viewer'
          phone?: string | null
          department?: string | null
          position?: string | null
          bio?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // COMPANIES
      // ============================================================================
      companies: {
        Row: {
          id: string
          nome: string
          name: string | null
          cnpj: string | null
          site: string | null
          website: string | null
          industry: string | null
          size: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string
          phone: string | null
          email: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          name?: string | null
          cnpj?: string | null
          site?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string
          phone?: string | null
          email?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          name?: string | null
          cnpj?: string | null
          site?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string
          phone?: string | null
          email?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // LEADS
      // ============================================================================
      leads: {
        Row: {
          id: string
          company_id: string | null
          owner_id: string | null
          nome: string
          name: string | null
          email: string | null
          phone: string | null
          whatsapp: string | null
          position: string | null
          status: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'
          etapa: 'capturado' | 'qualificar' | 'contato' | 'proposta' | 'fechamento'
          qualification_stage: 'QLD' | 'MQL' | 'SQL' | 'OPP' | null
          score: number
          origem: string | null
          source: string | null
          campaign: string | null
          medium: string | null
          estimated_value: string | null
          expected_close_date: string | null
          last_contact_date: string | null
          proxima_acao_at: string | null
          next_action_date: string | null
          contact_count: number
          tags: string[] | null
          custom_fields: Json
          notes: string | null
          created_at: string
          updated_at: string
          converted_at: string | null
          lost_reason: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          owner_id?: string | null
          nome: string
          name?: string | null
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          position?: string | null
          status?: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'
          etapa?: 'capturado' | 'qualificar' | 'contato' | 'proposta' | 'fechamento'
          qualification_stage?: 'QLD' | 'MQL' | 'SQL' | 'OPP' | null
          score?: number
          origem?: string | null
          source?: string | null
          campaign?: string | null
          medium?: string | null
          estimated_value?: string | null
          expected_close_date?: string | null
          last_contact_date?: string | null
          proxima_acao_at?: string | null
          next_action_date?: string | null
          contact_count?: number
          tags?: string[] | null
          custom_fields?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
          converted_at?: string | null
          lost_reason?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          owner_id?: string | null
          nome?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          position?: string | null
          status?: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'
          etapa?: 'capturado' | 'qualificar' | 'contato' | 'proposta' | 'fechamento'
          qualification_stage?: 'QLD' | 'MQL' | 'SQL' | 'OPP' | null
          score?: number
          origem?: string | null
          source?: string | null
          campaign?: string | null
          medium?: string | null
          estimated_value?: string | null
          expected_close_date?: string | null
          last_contact_date?: string | null
          proxima_acao_at?: string | null
          next_action_date?: string | null
          contact_count?: number
          tags?: string[] | null
          custom_fields?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
          converted_at?: string | null
          lost_reason?: string | null
        }
      }
      // ============================================================================
      // DEALS
      // ============================================================================
      deals: {
        Row: {
          id: string
          lead_id: string
          owner_id: string | null
          name: string | null
          valor_previsto: string | null
          amount: string | null
          etapa: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'
          stage: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'
          probability: number
          fechamento_previsto: string | null
          expected_close_date: string | null
          closed_date: string | null
          is_won: boolean
          is_lost: boolean
          lost_reason: string | null
          products: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          owner_id?: string | null
          name?: string | null
          valor_previsto?: string | null
          amount?: string | null
          etapa?: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'
          stage?: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'
          probability?: number
          fechamento_previsto?: string | null
          expected_close_date?: string | null
          closed_date?: string | null
          is_won?: boolean
          is_lost?: boolean
          lost_reason?: string | null
          products?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          owner_id?: string | null
          name?: string | null
          valor_previsto?: string | null
          amount?: string | null
          etapa?: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'
          stage?: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'
          probability?: number
          fechamento_previsto?: string | null
          expected_close_date?: string | null
          closed_date?: string | null
          is_won?: boolean
          is_lost?: boolean
          lost_reason?: string | null
          products?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // TASKS
      // ============================================================================
      tasks: {
        Row: {
          id: string
          lead_id: string | null
          project_id: string | null
          assigned_to: string | null
          owner_id: string | null
          created_by: string | null
          titulo: string | null
          title: string
          descricao: string | null
          description: string | null
          status: 'todo' | 'doing' | 'done' | 'em_progresso' | 'concluida' | 'cancelada'
          prioridade: 'P1' | 'P2' | 'P3' | 'baixa' | 'media' | 'alta' | 'urgente'
          priority: 'P1' | 'P2' | 'P3' | 'baixa' | 'media' | 'alta' | 'urgente'
          start_at: string | null
          due_at: string | null
          due_date: string | null
          completed_at: string | null
          tags: string[] | null
          attachments: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          project_id?: string | null
          assigned_to?: string | null
          owner_id?: string | null
          created_by?: string | null
          titulo?: string | null
          title: string
          descricao?: string | null
          description?: string | null
          status?: 'todo' | 'doing' | 'done' | 'em_progresso' | 'concluida' | 'cancelada'
          prioridade?: 'P1' | 'P2' | 'P3' | 'baixa' | 'media' | 'alta' | 'urgente'
          priority?: 'P1' | 'P2' | 'P3' | 'baixa' | 'media' | 'alta' | 'urgente'
          start_at?: string | null
          due_at?: string | null
          due_date?: string | null
          completed_at?: string | null
          tags?: string[] | null
          attachments?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          project_id?: string | null
          assigned_to?: string | null
          owner_id?: string | null
          created_by?: string | null
          titulo?: string | null
          title?: string
          descricao?: string | null
          description?: string | null
          status?: 'todo' | 'doing' | 'done' | 'em_progresso' | 'concluida' | 'cancelada'
          prioridade?: 'P1' | 'P2' | 'P3' | 'baixa' | 'media' | 'alta' | 'urgente'
          priority?: 'P1' | 'P2' | 'P3' | 'baixa' | 'media' | 'alta' | 'urgente'
          start_at?: string | null
          due_at?: string | null
          due_date?: string | null
          completed_at?: string | null
          tags?: string[] | null
          attachments?: Json
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // ACTIVITIES
      // ============================================================================
      activities: {
        Row: {
          id: string
          lead_id: string
          user_id: string | null
          tipo: 'nota' | 'chamada' | 'email' | 'wa_msg' | 'sistema' | 'call' | 'meeting' | 'status_change'
          type: 'nota' | 'chamada' | 'email' | 'wa_msg' | 'sistema' | 'call' | 'meeting' | 'status_change'
          title: string | null
          texto: string | null
          description: string | null
          metadata: Json
          actor: string | null
          duration_minutes: number | null
          activity_date: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id?: string | null
          tipo: 'nota' | 'chamada' | 'email' | 'wa_msg' | 'sistema' | 'call' | 'meeting' | 'status_change'
          type: 'nota' | 'chamada' | 'email' | 'wa_msg' | 'sistema' | 'call' | 'meeting' | 'status_change'
          title?: string | null
          texto?: string | null
          description?: string | null
          metadata?: Json
          actor?: string | null
          duration_minutes?: number | null
          activity_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string | null
          tipo?: 'nota' | 'chamada' | 'email' | 'wa_msg' | 'sistema' | 'call' | 'meeting' | 'status_change'
          type?: 'nota' | 'chamada' | 'email' | 'wa_msg' | 'sistema' | 'call' | 'meeting' | 'status_change'
          title?: string | null
          texto?: string | null
          description?: string | null
          metadata?: Json
          actor?: string | null
          duration_minutes?: number | null
          activity_date?: string
          created_at?: string
        }
      }
      // ============================================================================
      // PROJECTS
      // ============================================================================
      projects: {
        Row: {
          id: string
          titulo: string
          title: string | null
          descricao: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          title?: string | null
          descricao?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          title?: string | null
          descricao?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // CONVERSATIONS & MESSAGES
      // ============================================================================
      conversations: {
        Row: {
          id: string
          lead_id: string
          canal: string
          status: 'aberta' | 'encerrada'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          canal?: string
          status?: 'aberta' | 'encerrada'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          canal?: string
          status?: 'aberta' | 'encerrada'
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          direction: 'in' | 'out'
          texto: string
          raw_json: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          direction: 'in' | 'out'
          texto: string
          raw_json?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          direction?: 'in' | 'out'
          texto?: string
          raw_json?: Json | null
          created_at?: string
        }
      }
      }
      // ============================================================================
      // USER PREFERENCES
      // ============================================================================
      user_preferences: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          department: string | null
          location: string | null
          bio: string | null
          avatar_url: string | null
          theme: string
          language: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          department?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          language?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          department?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          language?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // COMPANY SETTINGS
      // ============================================================================
      company_settings: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          cnpj: string | null
          address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string
          website: string | null
          business_area: string | null
          company_size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          cnpj?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          website?: string | null
          business_area?: string | null
          company_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          cnpj?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          website?: string | null
          business_area?: string | null
          company_size?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // SAVED FUNNELS
      // ============================================================================
      saved_funnels: {
        Row: {
          id: string
          user_id: string
          name: string
          nodes: Json
          connections: Json
          is_template: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          nodes?: Json
          connections?: Json
          is_template?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          nodes?: Json
          connections?: Json
          is_template?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // LANDING PAGES
      // ============================================================================
      landing_pages: {
        Row: {
          id: string
          user_id: string
          name: string
          components: Json
          styles: Json
          slug: string
          is_published: boolean
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          views_count: number
          conversions_count: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          components?: Json
          styles?: Json
          slug: string
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          views_count?: number
          conversions_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          components?: Json
          styles?: Json
          slug?: string
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          views_count?: number
          conversions_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      // ============================================================================
      // AUTOMATION SETTINGS
      // ============================================================================
      automation_settings: {
        Row: {
          id: string
          user_id: string
          settings_key: string
          settings_value: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          settings_key: string
          settings_value: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          settings_key?: string
          settings_value?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // SDR CONFIG
      // ============================================================================
      sdr_config: {
        Row: {
          id: string
          mode: 'ativo' | 'pausado' | 'leitura'
          tom: string
          guardrails: Json | null
          horario_silencio: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mode?: 'ativo' | 'pausado' | 'leitura'
          tom?: string
          guardrails?: Json | null
          horario_silencio?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mode?: 'ativo' | 'pausado' | 'leitura'
          tom?: string
          guardrails?: Json | null
          horario_silencio?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      // ============================================================================
      // AI RESULTS
      // ============================================================================
      ai_results: {
        Row: {
          id: string
          lead_id: string
          kind: string
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          kind: string
          payload: Json
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          kind?: string
          payload?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'user' | 'viewer'
      lead_status: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'
      lead_stage: 'capturado' | 'qualificar' | 'contato' | 'proposta' | 'fechamento'
      qualification_stage: 'QLD' | 'MQL' | 'SQL' | 'OPP'
      deal_stage: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'
      task_priority: 'P1' | 'P2' | 'P3' | 'baixa' | 'media' | 'alta' | 'urgente'
      task_status: 'todo' | 'doing' | 'done' | 'em_progresso' | 'concluida' | 'cancelada'
      activity_type: 'nota' | 'chamada' | 'email' | 'wa_msg' | 'sistema' | 'call' | 'meeting' | 'status_change'
      conversation_status: 'aberta' | 'encerrada'
      message_direction: 'in' | 'out'
      sdr_mode: 'ativo' | 'pausado' | 'leitura'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ============================================================================
// HELPER TYPES
// ============================================================================
export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']

export type Company = Database['public']['Tables']['companies']['Row']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type CompanyUpdate = Database['public']['Tables']['companies']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type Activity = Database['public']['Tables']['activities']['Row']
export type ActivityInsert = Database['public']['Tables']['activities']['Insert']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']

export type Deal = Database['public']['Tables']['deals']['Row']
export type DealInsert = Database['public']['Tables']['deals']['Insert']
export type DealUpdate = Database['public']['Tables']['deals']['Update']
