// ============================================================================
// SUPABASE DATABASE TYPES
// Gerado baseado na estrutura do banco de dados
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
      leads: {
        Row: {
          id: string
          company_id: string | null
          owner_id: string | null
          name: string
          email: string | null
          phone: string | null
          whatsapp: string | null
          position: string | null
          status: Database['public']['Enums'] extends infer E ? (E extends { lead_status: any } ? E['lead_status'] : string) : string | null
          funnel_stage: Database['public']['Enums'] extends infer F ? (F extends { funnel_stage: any } ? F['funnel_stage'] : string) : string | null
          score: number | null
          source: string | null
          campaign: string | null
          medium: string | null
          estimated_value: string | null
          expected_close_date: string | null
          last_contact_date: string | null
          next_action_date: string | null
          contact_count: number | null
          tags: string[] | null
          custom_fields: Json | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
          converted_at: string | null
          lost_reason: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          owner_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          position?: string | null
          status?: string | null
          funnel_stage?: string | null
          score?: number | null
          source?: string | null
          campaign?: string | null
          medium?: string | null
          estimated_value?: string | null
          expected_close_date?: string | null
          last_contact_date?: string | null
          next_action_date?: string | null
          contact_count?: number | null
          tags?: string[] | null
          custom_fields?: Json | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          converted_at?: string | null
          lost_reason?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          owner_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          position?: string | null
          status?: string | null
          funnel_stage?: string | null
          score?: number | null
          source?: string | null
          campaign?: string | null
          medium?: string | null
          estimated_value?: string | null
          expected_close_date?: string | null
          last_contact_date?: string | null
          next_action_date?: string | null
          contact_count?: number | null
          tags?: string[] | null
          custom_fields?: Json | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          converted_at?: string | null
          lost_reason?: string | null
        }
      }
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
          theme: string | null
          language: string | null
          notifications_enabled: boolean | null
          created_at: string | null
          updated_at: string | null
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
          theme?: string | null
          language?: string | null
          notifications_enabled?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          theme?: string | null
          language?: string | null
          notifications_enabled?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      company_settings: {
        Row: {
          id: string
          company_name: string | null
          company_size: string | null
          industry: string | null
          website: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          tax_id: string | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          font_family: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          tax_id?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          font_family?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          tax_id?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          font_family?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      saved_funnels: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          funnel_data: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          funnel_data: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          funnel_data?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
      landing_pages: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          content: Json
          published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          content: Json
          published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          content?: Json
          published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      automation_settings: {
        Row: {
          id: string
          user_id: string
          setting_key: string
          setting_value: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          setting_key: string
          setting_value: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          setting_key?: string
          setting_value?: Json
          created_at?: string | null
          updated_at?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
