/**
 * ============================================================================
 * HOOK: useAuth
 * ============================================================================
 * Hook completo para autenticação com Supabase
 * 
 * Funcionalidades:
 * - Login (email/senha)
 * - Signup (criar conta)
 * - Logout
 * - Recuperar senha
 * - Atualizar perfil
 * - Verificar sessão
 * 
 * Uso:
 * ```tsx
 * const { user, signIn, signUp, signOut, isLoading } = useAuth();
 * ```
 * ============================================================================
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

// ============================================================================
// TIPOS
// ============================================================================

interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  nome?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  fullName?: string;
  nome?: string;
  avatarUrl?: string;
  phone?: string;
  department?: string;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useAuth() {
  const { user, session, loading: authLoading, signOut: contextSignOut } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // SIGN UP - Criar nova conta
  // ============================================================================
  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || data.nome,
            nome: data.nome || data.fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Verificar se precisa confirmar email
      if (authData.user && !authData.session) {
        toast.info('Verifique seu email para confirmar a conta!');
        return { user: authData.user, needsEmailConfirmation: true };
      }

      toast.success('Conta criada com sucesso!');
      return { user: authData.user, needsEmailConfirmation: false };
    } catch (error: any) {
      console.error('[useAuth] Erro ao criar conta:', error);
      
      // Mensagens de erro em português
      if (error.message?.includes('already registered')) {
        toast.error('Este email já está cadastrado');
      } else if (error.message?.includes('password')) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
      } else {
        toast.error(`Erro ao criar conta: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // SIGN IN - Login
  // ============================================================================
  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        throw signInError;
      }

      toast.success('Login realizado com sucesso!');
      return authData;
    } catch (error: any) {
      console.error('[useAuth] Erro ao fazer login:', error);
      
      // Mensagens de erro em português
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Confirme seu email antes de fazer login');
      } else {
        toast.error(`Erro ao fazer login: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // SIGN OUT - Logout
  // ============================================================================
  const signOut = async () => {
    setIsLoading(true);
    try {
      await contextSignOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('[useAuth] Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // RESET PASSWORD - Recuperar senha
  // ============================================================================
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('[useAuth] Erro ao recuperar senha:', error);
      toast.error(`Erro ao recuperar senha: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // UPDATE PASSWORD - Atualizar senha
  // ============================================================================
  const updatePassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success('Senha atualizada com sucesso!');
    } catch (error: any) {
      console.error('[useAuth] Erro ao atualizar senha:', error);
      toast.error(`Erro ao atualizar senha: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // UPDATE PROFILE - Atualizar perfil
  // ============================================================================
  const updateProfile = async (updates: UpdateProfileData) => {
    if (!user) {
      toast.error('Você precisa estar logado para atualizar o perfil');
      return;
    }

    setIsLoading(true);
    try {
      // Atualizar dados do auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName || updates.nome,
          nome: updates.nome || updates.fullName,
        },
      });

      if (authError) {
        throw authError;
      }

      // Atualizar tabela profiles
      // @ts-ignore
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName || updates.nome,
          nome: updates.nome || updates.fullName,
          avatar_url: updates.avatarUrl,
          phone: updates.phone,
          department: updates.department,
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('[useAuth] Erro ao atualizar perfil:', error);
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // GET PROFILE - Buscar perfil do usuário
  // ============================================================================
  const getProfile = async (userId?: string) => {
    const id = userId || user?.id;
    if (!id) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('[useAuth] Erro ao buscar perfil:', error);
      return null;
    }
  };

  // ============================================================================
  // VERIFICAR SE ESTÁ AUTENTICADO
  // ============================================================================
  const isAuthenticated = !!user && !!session;

  return {
    // Estado
    user,
    session,
    isAuthenticated,
    isLoading: authLoading || isLoading,

    // Métodos de autenticação
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,

    // Métodos de perfil
    updateProfile,
    getProfile,
  };
}

// ============================================================================
// HOOK: useRequireAuth
// ============================================================================
// Hook para proteger rotas que requerem autenticação
// ============================================================================

export function useRequireAuth() {
  const { user, isLoading } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
