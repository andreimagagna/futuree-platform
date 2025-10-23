import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

// ============================================================================
// TYPES
// ============================================================================

export interface Profile {
  id: string;
  email: string;
  nome: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user' | 'manager';
  phone: string | null;
  department: string | null;
  position: string | null;
  bio: string | null;
  preferences: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      desktop?: boolean;
    };
    timezone?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  nome?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  preferences?: Profile['preferences'];
}

// ============================================================================
// HOOK
// ============================================================================

export const useProfileSettings = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar perfil do usuário
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      console.log('[useProfileSettings] 🚀 INICIANDO BUSCA DE PERFIL');
      console.log('[useProfileSettings] user?.id:', user?.id);
      
      if (!user?.id) {
        console.error('[useProfileSettings] ❌ Usuário não autenticado!');
        throw new Error('Usuário não autenticado');
      }

      console.log('[useProfileSettings] 📡 Fazendo query no Supabase...');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, nome, full_name, avatar_url, role, phone, department, position, bio, preferences, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle();
      
      console.log('[useProfileSettings] 📦 Query executada. Data:', data, 'Error:', error);

      if (error) {
        console.error('[useProfileSettings] Erro ao buscar perfil:', error);
        throw error;
      }
      
      // Se não encontrar perfil, criar um novo
      if (!data) {
        console.warn('[useProfileSettings] ⚠️ Perfil não existe. Criando novo perfil...');
        
        const newProfile = {
          id: user.id,
          email: user.email || '',
          nome: user.email?.split('@')[0] || '',
          full_name: user.email?.split('@')[0] || '',
          role: 'user' as const,
          preferences: {},
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .maybeSingle();
        
        if (createError) {
          console.error('[useProfileSettings] ❌ Erro ao criar perfil:', createError);
          throw createError;
        }
        
        console.log('[useProfileSettings] ✅ Perfil criado com sucesso!');
        return createdProfile as Profile;
      }
      
      const profile = data as any;
      console.log('[useProfileSettings] ✅ Perfil encontrado!');
      console.log('[useProfileSettings] 📥 Dados completos:', JSON.stringify(data, null, 2));
      console.log('[useProfileSettings] 🔍 Campos específicos:');
      console.log('  - phone:', profile.phone);
      console.log('  - department:', profile.department);
      console.log('  - position:', profile.position);
      console.log('  - bio:', profile.bio);
      return data as Profile;
    },
    enabled: !!user?.id,
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnMount: 'always', // Sempre buscar ao montar o componente
    refetchOnWindowFocus: false, // Não buscar ao focar a janela
  });

  // Atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: ProfileUpdateData) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      console.log('[useProfileSettings] Atualizando perfil:', JSON.stringify(updates, null, 2));

      // Garantir que apenas campos válidos sejam enviados
      // Aceita valores undefined, null ou strings (inclusive vazias)
      const validUpdates: any = {};
      if ('nome' in updates) validUpdates.nome = updates.nome || null;
      if ('full_name' in updates) validUpdates.full_name = updates.full_name || null;
      if ('phone' in updates) validUpdates.phone = updates.phone || null;
      if ('department' in updates) validUpdates.department = updates.department || null;
      if ('position' in updates) validUpdates.position = updates.position || null;
      if ('bio' in updates) validUpdates.bio = updates.bio || null;
      if ('avatar_url' in updates) validUpdates.avatar_url = updates.avatar_url || null;
      if ('preferences' in updates) validUpdates.preferences = updates.preferences || {};
      
      validUpdates.updated_at = new Date().toISOString();

      console.log('[useProfileSettings] 📦 Campos recebidos:', Object.keys(updates));
      console.log('[useProfileSettings] 📤 Enviando para Supabase:', JSON.stringify(validUpdates, null, 2));

      const { data, error } = await (supabase as any)
        .from('profiles')
        .update(validUpdates)
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[useProfileSettings] ❌ Erro ao atualizar:', error);
        throw error;
      }
      
      console.log('[useProfileSettings] ✅ Perfil atualizado com sucesso!');
      console.log('[useProfileSettings] 📥 Dados retornados do Supabase:', JSON.stringify(data, null, 2));
      return data as Profile;
    },
    onSuccess: async (data) => {
      console.log('[useProfileSettings] 🔄 Invalidando cache e forçando refetch...');
      // Invalidar cache para forçar nova busca
      await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      console.log('[useProfileSettings] ✅ Cache invalidado!');
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  // Atualizar avatar
  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Upload do arquivo para o Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatar_url = urlData.publicUrl;

      // Atualizar perfil com nova URL
      const { data, error } = await (supabase as any)
        .from('profiles')
        .update({ avatar_url, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', user?.id], data);
      toast({
        title: 'Avatar atualizado!',
        description: 'Sua foto de perfil foi alterada.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar avatar',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  // Atualizar preferências
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: Partial<Profile['preferences']>) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const currentPreferences = profile?.preferences || {};
      const newPreferences = { ...currentPreferences, ...preferences };

      const { data, error } = await (supabase as any)
        .from('profiles')
        .update({
          preferences: newPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', user?.id], data);
      toast({
        title: 'Preferências salvas!',
        description: 'Suas configurações foram atualizadas.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar preferências',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  // Atualizar senha
  const updatePasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Senha atualizada!',
        description: 'Sua senha foi alterada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar senha',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: async (data: ProfileUpdateData) => {
      console.log('[useProfileSettings] updateProfile chamado com:', data);
      try {
        const result = await updateProfileMutation.mutateAsync(data);
        console.log('[useProfileSettings] ✅ Mutation completed:', result);
        return result;
      } catch (error) {
        console.error('[useProfileSettings] ❌ Mutation failed:', error);
        throw error;
      }
    },
    isUpdatingProfile: updateProfileMutation.isPending,
    updateAvatar: updateAvatarMutation.mutate,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
};
