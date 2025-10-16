import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { useSupabaseStorage } from "@/hooks/use-supabase-storage";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  Upload,
  Edit,
} from "lucide-react";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  bio: string;
  avatar_url?: string;
}

const Profile = () => {
  const { toast } = useToast();
  const { leads } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // 🚀 MIGRADO PARA SUPABASE - substituindo localStorage
  const [profileData, setProfileData, profileLoading] = useSupabaseStorage<ProfileData>('user_preferences', {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    location: "",
    bio: "",
  });

  // Calcular estatísticas dinamicamente baseadas nos leads
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filtrar leads do mês atual
    const currentMonthLeads = leads.filter((lead) => {
      const createdAt = lead.createdAt ? new Date(lead.createdAt) : new Date();
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    });

    // Filtrar leads do mês passado
    const lastMonthLeads = leads.filter((lead) => {
      const createdAt = lead.createdAt ? new Date(lead.createdAt) : new Date();
      return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === lastMonthYear;
    });

    // Leads qualificados (stages: qualify, contact, proposal, closing ou BANT completo)
    const currentQualified = currentMonthLeads.filter(
      (lead) =>
        lead.stage !== 'captured' ||
        (lead.bant &&
          lead.bant.budget &&
          lead.bant.authority &&
          lead.bant.need &&
          lead.bant.timeline)
    ).length;

    const lastQualified = lastMonthLeads.filter(
      (lead) =>
        lead.stage !== 'captured' ||
        (lead.bant &&
          lead.bant.budget &&
          lead.bant.authority &&
          lead.bant.need &&
          lead.bant.timeline)
    ).length;

    // Negócios fechados (status won)
    const currentWon = currentMonthLeads.filter(
      (lead) => lead.status === 'won'
    ).length;

    const lastWon = lastMonthLeads.filter(
      (lead) => lead.status === 'won'
    ).length;

    // Taxa de conversão (won / total de leads qualificados)
    const currentConversionRate =
      currentQualified > 0 ? Math.round((currentWon / currentQualified) * 100) : 0;

    const lastConversionRate =
      lastQualified > 0 ? Math.round((lastWon / lastQualified) * 100) : 0;

    // Calcular variações percentuais
    const leadsVariacao =
      lastQualified > 0
        ? Math.round(((currentQualified - lastQualified) / lastQualified) * 100)
        : currentQualified > 0
        ? 100
        : 0;

    const conversionVariacao = currentConversionRate - lastConversionRate;

    const wonVariacao =
      lastWon > 0
        ? Math.round(((currentWon - lastWon) / lastWon) * 100)
        : currentWon > 0
        ? 100
        : 0;

    return {
      leadsQualificados: currentQualified,
      leadsQualificadosVariacao: leadsVariacao,
      taxaConversao: currentConversionRate,
      taxaConversaoVariacao: conversionVariacao,
      negociosFechados: currentWon,
      negociosFechadosVariacao: wonVariacao,
    };
  }, [leads]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚀 Salva automaticamente no Supabase via hook
    await setProfileData(profileData);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Dados são recarregados automaticamente do Supabase
    setIsEditing(false);
  };

  const getInitials = () => {
    return `${profileData.first_name?.charAt(0) || ''}${profileData.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Perfil Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>Atualize sua foto de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileData.avatar_url || ""} alt="Foto de perfil" />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Alterar Foto
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                JPG, PNG ou GIF. Máximo 2MB.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">Membro desde</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Janeiro 2024
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="first_name"
                      placeholder="Seu nome"
                      value={profileData.first_name}
                      onChange={handleInputChange}
                      className="pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Sobrenome</Label>
                  <Input
                    id="last_name"
                    placeholder="Seu sobrenome"
                    value={profileData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      placeholder="Vendas"
                      value={profileData.department}
                      onChange={handleInputChange}
                      className="pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Cidade, Estado"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      <Edit className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Estatísticas</CardTitle>
          <CardDescription>Seu desempenho este mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leads Qualificados</p>
                  <p className="text-2xl font-bold">{stats.leadsQualificados}</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${
                    stats.leadsQualificadosVariacao >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stats.leadsQualificadosVariacao >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stats.leadsQualificadosVariacao >= 0 ? '+' : ''}{stats.leadsQualificadosVariacao}% vs mês anterior
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-3">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                  <p className="text-2xl font-bold">{stats.taxaConversao}%</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${
                    stats.taxaConversaoVariacao >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stats.taxaConversaoVariacao >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stats.taxaConversaoVariacao >= 0 ? '+' : ''}{stats.taxaConversaoVariacao}% vs mês anterior
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-3">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Negócios Fechados</p>
                  <p className="text-2xl font-bold">{stats.negociosFechados}</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${
                    stats.negociosFechadosVariacao >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stats.negociosFechadosVariacao >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stats.negociosFechadosVariacao >= 0 ? '+' : ''}{stats.negociosFechadosVariacao}% vs mês anterior
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
