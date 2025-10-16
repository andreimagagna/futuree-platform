// ============================================================================
// SUPABASE DATABASE TYPES
// Gerado automaticamente pelo Supabase
// ============================================================================
// 
// INSTRUÇÕES:
// 1. Vá para: https://supabase.com/dashboard/project/SEU_PROJECT_ID/api
// 2. Encontre a seção "TypeScript Types" ou "Type Definitions"
// 3. Copie TODO o código TypeScript
// 4. Cole AQUI, substituindo este comentário
// 
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
      // COLE OS TIPOS AQUI
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
