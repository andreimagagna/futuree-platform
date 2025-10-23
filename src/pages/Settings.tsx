import { useState, useEffect } from 'react';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Lock,
  Loader2,
  Camera,
  Save,
  Tag,
  Users,
  Target,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

// ============================================================================
// INTERFACES - SISTEMA
// ============================================================================

interface LeadSource {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  owner_id: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  owner_id: string;
}

interface CompanyGoal {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Metas pré-estabelecidas do sistema
const PREDEFINED_GOALS = [
  {
    key: 'receita_mensal',
    title: 'Receita Mensal',
    unit: 'R$',
    description: 'Faturamento total do mês',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
  },
  {
    key: 'leads_mes',
    title: 'Leads do Mês',
    unit: 'leads',
    description: 'Novos leads captados',
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/20',
  },
  {
    key: 'taxa_conversao',
    title: 'Taxa de Conversão',
    unit: '%',
    description: 'Percentual de conversão de leads',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
  },
  {
    key: 'ticket_medio',
    title: 'Ticket Médio',
    unit: 'R$',
    description: 'Valor médio por venda',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
  },
  {
    key: 'reunioes_mes',
    title: 'Reuniões do Mês',
    unit: 'reuniões',
    description: 'Número de reuniões realizadas',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
  },
  {
    key: 'negocios_ganhos',
    title: 'Negócios Ganhos',
    unit: 'negócios',
    description: 'Total de negócios fechados',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
  },
] as const;

export const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  // Hook de perfil
  const {
    profile,
    isLoading: isLoadingProfile,
    refetch,
    updateProfile,
    isUpdatingProfile,
    updateAvatar,
    isUpdatingAvatar,
    updatePreferences,
    isUpdatingPreferences,
    updatePassword,
    isUpdatingPassword,
  } = useProfileSettings();

  // ============================================================================
  // STATE - PERFIL
  // ============================================================================
  const [profileForm, setProfileForm] = useState({
    nome: '',
    full_name: '',
    phone: '',
    department: '',
    position: '',
    bio: '',
  });

  // Forçar refetch ao montar componente
  useEffect(() => {
    console.log('[Settings] 🚀 Componente montado, forçando refetch...');
    refetch();
  }, []); // Apenas na montagem

  // Atualizar form quando profile carregar
  useEffect(() => {
    console.log('[Settings] 🔄 Profile carregado:', profile);
    console.log('[Settings] 🔍 Profile completo:', JSON.stringify(profile, null, 2));
    if (profile) {
      console.log('[Settings] 📝 Preenchendo formulário com:');
      console.log('  - phone:', profile.phone);
      console.log('  - department:', profile.department);
      console.log('  - position:', profile.position);
      console.log('  - bio:', profile.bio);
      
      setProfileForm({
        nome: profile.nome || '',
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        department: profile.department || '',
        position: profile.position || '',
        bio: profile.bio || '',
      });
      
      console.log('[Settings] ✅ Formulário preenchido!');
    }
  }, [profile]);

  // ============================================================================
  // STATE - SENHA
  // ============================================================================
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ============================================================================
  // STATE - FONTES DE LEADS
  // ============================================================================
  const [isLeadSourceDialogOpen, setIsLeadSourceDialogOpen] = useState(false);
  const [editingLeadSource, setEditingLeadSource] = useState<LeadSource | null>(null);
  const [leadSourceForm, setLeadSourceForm] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  // ============================================================================
  // STATE - EQUIPE
  // ============================================================================
  const [isTeamMemberDialogOpen, setIsTeamMemberDialogOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamMemberForm, setTeamMemberForm] = useState({
    name: '',
    email: '',
    role: '',
    is_active: true,
  });
  const [sendInviteEmail, setSendInviteEmail] = useState(true); // ✅ Novo: opção de enviar convite

  // ============================================================================
  // STATE - METAS
  // ============================================================================
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoalKey, setEditingGoalKey] = useState<string | null>(null);
  const [goalTargetValue, setGoalTargetValue] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // ============================================================================
  // STATE - DELETE CONFIRMATION
  // ============================================================================
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: string;
    id: string;
    name: string;
  } | null>(null);

  // ============================================================================
  // QUERIES - SISTEMA
  // ============================================================================

  // Lead Sources Query
  const { data: leadSources = [], isLoading: loadingLeadSources } = useQuery({
    queryKey: ['lead_sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_sources')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LeadSource[];
    },
    enabled: !!user,
  });

  // Team Members Query
  const { data: teamMembers = [], isLoading: loadingTeamMembers } = useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!user,
  });

  // Company Goals Query
  const { data: companyGoals = [], isLoading: loadingGoals } = useQuery({
    queryKey: ['company_goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_goals')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CompanyGoal[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    gcTime: 10 * 60 * 1000, // Garbage collection após 10 minutos
  });

  // Query OTIMIZADA para calcular valores reais do CRM
  const { data: crmMetrics, isLoading: loadingCrmMetrics, refetch: refetchCrmMetrics } = useQuery({
    queryKey: ['crm_metrics', selectedMonth, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Calcular primeiro e último dia do mês
      const [year, month] = selectedMonth.split('-').map(Number);
      const firstDay = new Date(year, month - 1, 1).toISOString();
      const lastDay = new Date(year, month, 0, 23, 59, 59).toISOString();

      console.log('🔍 Buscando métricas CRM:', { firstDay, lastDay, userId: user.id });

      // Executar queries em paralelo para melhor performance
      const [leadsResult, activitiesResult] = await Promise.all([
        // Query otimizada: buscar leads do mês com campos corretos
        supabase
          .from('leads')
          .select('status, estimated_value, created_at')
          .eq('owner_id', user.id)
          .gte('created_at', firstDay)
          .lte('created_at', lastDay),
        
        // Query otimizada: contar reuniões (usar user_id e activity_date)
        supabase
          .from('activities')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('type', 'reuniao')
          .gte('activity_date', firstDay)
          .lte('activity_date', lastDay)
      ]);

      if (leadsResult.error) {
        console.error('❌ Erro ao buscar leads:', leadsResult.error);
      }
      if (activitiesResult.error) {
        console.error('❌ Erro ao buscar activities:', activitiesResult.error);
      }

      const leadsData = leadsResult.data || [];
      const reunioesMes = activitiesResult.count || 0;

      console.log('📊 Dados encontrados:', { 
        totalLeads: leadsData.length, 
        reunioes: reunioesMes,
      });

      // Calcular métricas (processamento client-side é rápido)
      const totalLeads = leadsData.length;
      const ganhos = leadsData.filter((l: any) => l.status === 'ganho' || l.status === 'won');
      const negociosGanhos = ganhos.length;
      const receitaMensal = ganhos.reduce((sum: number, l: any) => sum + (l.estimated_value || 0), 0);
      const ticketMedio = negociosGanhos > 0 ? receitaMensal / negociosGanhos : 0;
      const taxaConversao = totalLeads > 0 ? (negociosGanhos / totalLeads) * 100 : 0;

      console.log('✅ Métricas calculadas:', {
        receita_mensal: receitaMensal,
        leads_mes: totalLeads,
        taxa_conversao: taxaConversao,
        ticket_medio: ticketMedio,
        reunioes_mes: reunioesMes,
        negocios_ganhos: negociosGanhos,
      });

      return {
        receita_mensal: receitaMensal,
        leads_mes: totalLeads,
        taxa_conversao: taxaConversao,
        ticket_medio: ticketMedio,
        reunioes_mes: reunioesMes,
        negocios_ganhos: negociosGanhos,
      };
    },
    enabled: !!user && !!selectedMonth,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos (evita refetch desnecessário)
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Não refetch ao voltar para a janela
    refetchOnMount: false, // Não refetch ao montar se já tem cache válido
  });

  // ============================================================================
  // MUTATIONS - METAS (apenas upsert de target)
  // ============================================================================

  const upsertGoalMutation = useMutation({
    mutationFn: async ({ goalKey, target }: { goalKey: string; target: number }) => {
      const predefinedGoal = PREDEFINED_GOALS.find((g) => g.key === goalKey);
      if (!predefinedGoal) throw new Error('Meta não encontrada');

      // Buscar se já existe
      const { data: existing } = await (supabase as any)
        .from('company_goals')
        .select('id')
        .eq('owner_id', user?.id)
        .eq('title', predefinedGoal.title)
        .maybeSingle();

      if (existing) {
        // Update
        const { error } = await (supabase as any)
          .from('company_goals')
          .update({
            target,
            unit: predefinedGoal.unit,
            description: predefinedGoal.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await (supabase as any)
          .from('company_goals')
          .insert([
            {
              title: predefinedGoal.title,
              description: predefinedGoal.description,
              target,
              current: 0,
              unit: predefinedGoal.unit,
              owner_id: user?.id,
            },
          ]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_goals'] });
      setIsGoalDialogOpen(false);
      setEditingGoalKey(null);
      setGoalTargetValue(0);
      toast({ title: 'Meta atualizada com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar meta', description: error.message, variant: 'destructive' });
    },
  });

  // ============================================================================
  // MUTATIONS - FONTES DE LEADS
  // ============================================================================

  const createLeadSourceMutation = useMutation({
    mutationFn: async (source: typeof leadSourceForm) => {
      const { error } = await (supabase as any)
        .from('lead_sources')
        .insert([{ ...source, owner_id: user?.id }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      setIsLeadSourceDialogOpen(false);
      setLeadSourceForm({ name: '', description: '', is_active: true });
      toast({ title: 'Fonte de lead criada com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao criar fonte', description: error.message, variant: 'destructive' });
    },
  });

  const updateLeadSourceMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LeadSource> & { id: string }) => {
      const { error } = await (supabase as any)
        .from('lead_sources')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      setIsLeadSourceDialogOpen(false);
      setEditingLeadSource(null);
      toast({ title: 'Fonte atualizada com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar fonte', description: error.message, variant: 'destructive' });
    },
  });

  const deleteLeadSourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('lead_sources').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      setDeleteConfirm(null);
      toast({ title: 'Fonte excluída com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao excluir fonte', description: error.message, variant: 'destructive' });
    },
  });

  // ============================================================================
  // MUTATIONS - EQUIPE
  // ============================================================================

  const createTeamMemberMutation = useMutation({
    mutationFn: async (member: typeof teamMemberForm & { sendInvite?: boolean }) => {
      // 1. Adicionar membro à tabela
      const { error } = await (supabase as any)
        .from('team_members')
        .insert([{ ...member, owner_id: user?.id }]);
      if (error) throw error;

      // 2. Enviar convite por email se solicitado
      if (member.sendInvite) {
        const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(member.email, {
          data: {
            full_name: member.name,
            role: member.role,
            invited_by: user?.email,
          },
          redirectTo: `${window.location.origin}/login`,
        });
        
        if (inviteError) {
          console.error('Erro ao enviar convite:', inviteError);
          // Não falhar a operação por causa do convite
          toast({ 
            title: 'Membro adicionado', 
            description: 'Mas não foi possível enviar o convite por email. Você pode reenviar manualmente.',
            variant: 'default'
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      setIsTeamMemberDialogOpen(false);
      setTeamMemberForm({ name: '', email: '', role: '', is_active: true });
      setSendInviteEmail(true);
      toast({ title: 'Membro adicionado com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao adicionar membro', description: error.message, variant: 'destructive' });
    },
  });

  const updateTeamMemberMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TeamMember> & { id: string }) => {
      const { error } = await (supabase as any)
        .from('team_members')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      setIsTeamMemberDialogOpen(false);
      setEditingTeamMember(null);
      toast({ title: 'Membro atualizado com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar membro', description: error.message, variant: 'destructive' });
    },
  });

  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('team_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      setDeleteConfirm(null);
      toast({ title: 'Membro removido com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao remover membro', description: error.message, variant: 'destructive' });
    },
  });

  // ============================================================================
  // HANDLERS - PERFIL
  // ============================================================================

  const handleUpdateProfile = async () => {
    console.log('[Settings] Salvando perfil com dados:', profileForm);
    console.log('[Settings] user:', user);
    console.log('[Settings] updateProfile type:', typeof updateProfile);
    
    if (!updateProfile) {
      console.error('[Settings] ❌ updateProfile is undefined!');
      toast({
        title: 'Erro',
        description: 'Função de atualização não disponível',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await updateProfile(profileForm);
      console.log('[Settings] ✅ Profile updated successfully');
    } catch (error) {
      console.error('[Settings] ❌ Error updating profile:', error);
    }
  };

  const handleClearCacheAndRefetch = async () => {
    console.log('[Settings] 🗑️ Limpando cache do React Query...');
    await queryClient.invalidateQueries({ queryKey: ['profile'] });
    await refetch();
    console.log('[Settings] ✅ Cache limpo e dados recarregados!');
    toast({
      title: 'Cache limpo!',
      description: 'Dados recarregados do banco de dados.',
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 2MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Apenas imagens são permitidas');
        return;
      }

      updateAvatar(file);
    }
  };

  const handleUpdatePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    updatePassword(passwordForm.newPassword);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:w-auto gap-2">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="account">
            <Lock className="w-4 h-4 mr-2" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="lead-sources">
            <Tag className="w-4 h-4 mr-2" />
            Fontes de Leads
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="w-4 h-4 mr-2" />
            Equipe
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="w-4 h-4 mr-2" />
            Metas
          </TabsTrigger>
        </TabsList>

        {/* TAB: PERFIL */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile?.nome?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Camera className="w-4 h-4" />
                      {isUpdatingAvatar ? 'Enviando...' : 'Alterar foto de perfil'}
                    </div>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isUpdatingAvatar}
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG ou GIF. Máximo 2MB.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nome"
                      placeholder="Seu nome"
                      value={profileForm.nome}
                      onChange={(e) => setProfileForm({ ...profileForm, nome: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      placeholder="Nome completo"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O e-mail não pode ser alterado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      placeholder="Ex: Marketing"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="position"
                      placeholder="Ex: Gerente de Vendas"
                      value={profileForm.position}
                      onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    console.log('🔵 BOTÃO CLICADO!');
                    console.log('🔵 profileForm completo:', JSON.stringify(profileForm, null, 2));
                    console.log('🔵 Telefone:', profileForm.phone);
                    console.log('🔵 Departamento:', profileForm.department);
                    console.log('🔵 Cargo:', profileForm.position);
                    console.log('🔵 Bio:', profileForm.bio);
                    console.log('🔵 isUpdatingProfile:', isUpdatingProfile);
                    handleUpdateProfile();
                  }} 
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearCacheAndRefetch}
                  disabled={isLoadingProfile}
                  className="ml-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: CONTA */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Altere sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo de 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                  {isUpdatingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Lock className="w-4 h-4 mr-2" />
                  Atualizar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis relacionadas à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">
                Deletar Conta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: FONTES DE LEADS */}
        <TabsContent value="lead-sources" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fontes de Leads</CardTitle>
                  <CardDescription>
                    Gerencie as origens dos seus leads
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingLeadSource(null);
                    setLeadSourceForm({ name: '', description: '', is_active: true });
                    setIsLeadSourceDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Fonte
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingLeadSources ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : leadSources.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma fonte de lead cadastrada</p>
                  <p className="text-sm mt-2">Clique em "Nova Fonte" para começar</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>{source.description || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={source.is_active ? 'default' : 'secondary'}>
                            {source.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingLeadSource(source);
                              setLeadSourceForm({
                                name: source.name,
                                description: source.description || '',
                                is_active: source.is_active,
                              });
                              setIsLeadSourceDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm({ type: 'lead_source', id: source.id, name: source.name })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: EQUIPE */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Equipe</CardTitle>
                  <CardDescription>
                    Gerencie os membros da sua equipe
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingTeamMember(null);
                    setTeamMemberForm({ name: '', email: '', role: '', is_active: true });
                    setIsTeamMemberDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Membro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingTeamMembers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum membro cadastrado</p>
                  <p className="text-sm mt-2">Clique em "Adicionar Membro" para começar</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <Badge variant={member.is_active ? 'default' : 'secondary'}>
                            {member.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTeamMember(member);
                              setTeamMemberForm({
                                name: member.name,
                                email: member.email,
                                role: member.role,
                                is_active: member.is_active,
                              });
                              setIsTeamMemberDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm({ type: 'team_member', id: member.id, name: member.name })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: METAS */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Metas da Empresa</CardTitle>
                  <CardDescription>
                    Configure e acompanhe suas métricas em tempo real
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchCrmMetrics()}
                    disabled={loadingCrmMetrics}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingCrmMetrics ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const d = new Date();
                        d.setMonth(d.getMonth() - i);
                        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                        return (
                          <SelectItem key={value} value={value}>
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingGoals || loadingCrmMetrics ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {PREDEFINED_GOALS.map((predefined) => {
                    // Buscar meta configurada
                    const goal = companyGoals.find((g) => g.title === predefined.title);
                    const targetValue = goal?.target || 0;
                    
                    // Buscar valor real do CRM
                    const currentValue = crmMetrics?.[predefined.key as keyof typeof crmMetrics] || 0;
                    
                    // Calcular progresso
                    const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
                    const progressColor = progress >= 100 ? 'text-success' : progress >= 70 ? 'text-warning' : 'text-destructive';

                    return (
                      <Card 
                        key={predefined.key} 
                        className={`relative overflow-hidden hover:shadow-md transition-shadow border-l-4 ${predefined.borderColor} ${predefined.bgColor}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className={`text-base font-semibold ${predefined.color}`}>
                                {predefined.title}
                              </CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {predefined.description}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingGoalKey(predefined.key);
                                setGoalTargetValue(targetValue);
                                setIsGoalDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-bold">
                                {predefined.unit === 'R$' 
                                  ? currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                  : predefined.unit === '%'
                                  ? `${currentValue.toFixed(1)}%`
                                  : currentValue.toLocaleString('pt-BR')}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {predefined.unit !== 'R$' && predefined.unit !== '%' && predefined.unit}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Meta: {predefined.unit === 'R$' 
                                ? targetValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                : predefined.unit === '%'
                                ? `${targetValue.toFixed(1)}%`
                                : `${targetValue.toLocaleString('pt-BR')} ${predefined.unit}`}
                            </div>
                          </div>
                          
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-medium ${progressColor}`}>
                              {progress.toFixed(0)}% atingido
                            </span>
                            {progress >= 100 ? (
                              <Badge variant="default" className="text-xs bg-success">
                                ✓ Atingida
                              </Badge>
                            ) : progress >= 70 ? (
                              <Badge variant="secondary" className="text-xs">
                                No caminho
                              </Badge>
                            ) : targetValue === 0 ? (
                              <Badge variant="outline" className="text-xs">
                                Sem meta
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                Atenção
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DIALOG: EDITAR META */}
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Definir Meta</DialogTitle>
              <DialogDescription>
                {editingGoalKey && PREDEFINED_GOALS.find((g) => g.key === editingGoalKey)?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Mês de Referência</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const d = new Date();
                      d.setMonth(d.getMonth() - i);
                      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                      const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                      return (
                        <SelectItem key={value} value={value}>
                          {label.charAt(0).toUpperCase() + label.slice(1)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor da Meta</Label>
                <Input
                  type="number"
                  placeholder="Digite o valor da meta"
                  value={goalTargetValue || ''}
                  onChange={(e) => setGoalTargetValue(Number(e.target.value))}
                  min={0}
                  step={editingGoalKey === 'receita_mensal' || editingGoalKey === 'ticket_medio' ? 0.01 : editingGoalKey === 'taxa_conversao' ? 0.1 : 1}
                />
                <p className="text-xs text-muted-foreground">
                  {editingGoalKey && `Unidade: ${PREDEFINED_GOALS.find((g) => g.key === editingGoalKey)?.unit}`}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsGoalDialogOpen(false);
                  setEditingGoalKey(null);
                  setGoalTargetValue(0);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (editingGoalKey && goalTargetValue > 0) {
                    upsertGoalMutation.mutate({ goalKey: editingGoalKey, target: goalTargetValue });
                  }
                }}
                disabled={!editingGoalKey || goalTargetValue <= 0}
              >
                {upsertGoalMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Meta'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG: CRIAR/EDITAR FONTE DE LEAD */}
        <Dialog open={isLeadSourceDialogOpen} onOpenChange={setIsLeadSourceDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLeadSource ? 'Editar Fonte' : 'Nova Fonte de Lead'}</DialogTitle>
              <DialogDescription>
                Configure as origens dos seus leads
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Fonte</Label>
                <Input
                  placeholder="Ex: Facebook Ads, Indicação, LinkedIn..."
                  value={leadSourceForm.name}
                  onChange={(e) => setLeadSourceForm({ ...leadSourceForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  placeholder="Descreva a fonte..."
                  value={leadSourceForm.description}
                  onChange={(e) => setLeadSourceForm({ ...leadSourceForm, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={leadSourceForm.is_active}
                  onCheckedChange={(checked) => setLeadSourceForm({ ...leadSourceForm, is_active: checked })}
                />
                <Label>Fonte ativa</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsLeadSourceDialogOpen(false);
                  setEditingLeadSource(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (editingLeadSource) {
                    updateLeadSourceMutation.mutate({ id: editingLeadSource.id, ...leadSourceForm });
                  } else {
                    createLeadSourceMutation.mutate(leadSourceForm);
                  }
                }}
                disabled={!leadSourceForm.name}
              >
                {(createLeadSourceMutation.isPending || updateLeadSourceMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Fonte'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG: CRIAR/EDITAR MEMBRO DA EQUIPE */}
        <Dialog open={isTeamMemberDialogOpen} onOpenChange={setIsTeamMemberDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTeamMember ? 'Editar Membro' : 'Novo Membro da Equipe'}</DialogTitle>
              <DialogDescription>
                Adicione membros à sua equipe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Nome completo"
                  value={teamMemberForm.name}
                  onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={teamMemberForm.email}
                  onChange={(e) => setTeamMemberForm({ ...teamMemberForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  placeholder="Ex: Vendedor, Gerente, SDR..."
                  value={teamMemberForm.role}
                  onChange={(e) => setTeamMemberForm({ ...teamMemberForm, role: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={teamMemberForm.is_active}
                  onCheckedChange={(checked) => setTeamMemberForm({ ...teamMemberForm, is_active: checked })}
                />
                <Label>Membro ativo</Label>
              </div>
              {!editingTeamMember && (
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Switch
                    checked={sendInviteEmail}
                    onCheckedChange={setSendInviteEmail}
                  />
                  <div className="flex-1">
                    <Label>Enviar convite por e-mail</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      O membro receberá um e-mail para criar sua conta e acessar a plataforma
                    </p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsTeamMemberDialogOpen(false);
                  setEditingTeamMember(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (editingTeamMember) {
                    updateTeamMemberMutation.mutate({ id: editingTeamMember.id, ...teamMemberForm });
                  } else {
                    createTeamMemberMutation.mutate({ ...teamMemberForm, sendInvite: sendInviteEmail });
                  }
                }}
                disabled={!teamMemberForm.name || !teamMemberForm.email || !teamMemberForm.role}
              >
                {(createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Membro'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ALERT DIALOG: CONFIRMAR EXCLUSÃO */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a excluir "{deleteConfirm?.name}". Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!deleteConfirm) return;
                  
                  if (deleteConfirm.type === 'lead_source') {
                    deleteLeadSourceMutation.mutate(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'team_member') {
                    deleteTeamMemberMutation.mutate(deleteConfirm.id);
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Tabs>
    </div>
  );
};

export default Settings;
