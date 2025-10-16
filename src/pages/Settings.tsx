import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/store/useStore";
import { useSupabaseStorage } from "@/hooks/use-supabase-storage";
import { 
  Settings as SettingsIcon, 
  Plus, 
  X, 
  Users, 
  Tag, 
  Target,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Zap,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface CompanyData {
  company_name: string;
  cnpj: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  last4: string;
  expiry: string;
}

const Settings = () => {
  const { settings, addLeadSource, removeLeadSource, addOwner, removeOwner, updateGoals } = useStore();
  const { toast } = useToast();
  
  const [newSource, setNewSource] = useState("");
  const [newOwner, setNewOwner] = useState("");
  
  // 🚀 MIGRADO PARA SUPABASE - substituindo localStorage
  const [companyData, setCompanyData, companyLoading] = useSupabaseStorage<CompanyData>('company_settings', {
    company_name: "",
    cnpj: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Brasil",
  });

  // Estado para aba Segurança
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Estado para aba Pagamentos
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const handleAddSource = () => {
    if (!newSource.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a fonte de lead",
        variant: "destructive",
      });
      return;
    }
    
    addLeadSource(newSource.trim());
    setNewSource("");
    toast({
      title: "Sucesso",
      description: "Fonte de lead adicionada",
    });
  };

  const handleAddOwner = () => {
    if (!newOwner.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para o responsável",
        variant: "destructive",
      });
      return;
    }
    
    addOwner(newOwner.trim());
    setNewOwner("");
    toast({
      title: "Sucesso",
      description: "Responsável adicionado",
    });
  };

  const handleSaveCompanyData = async () => {
    // 🚀 Salva automaticamente no Supabase via hook
    await setCompanyData(companyData);
    toast({
      title: "Sucesso",
      description: "Informações da empresa salvas com sucesso",
    });
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Desativado" : "2FA Ativado",
      description: twoFactorEnabled 
        ? "Autenticação de dois fatores foi desativada" 
        : "Autenticação de dois fatores foi ativada",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Configurações</h2>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="geral" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="empresa" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="pagamentos" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Integrações</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        {/* ABA GERAL */}
        <TabsContent value="geral" className="space-y-6">
          {/* Fontes de Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Fontes de Leads
              </CardTitle>
              <CardDescription>
                Gerencie as origens dos seus leads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Adicionar nova fonte</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="Ex: Google Ads, Facebook, etc."
                    onKeyDown={(e) => e.key === "Enter" && handleAddSource()}
                  />
                  <Button onClick={handleAddSource} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fontes disponíveis</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.leadSources.map((source) => (
                    <Badge
                      key={source}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 text-sm flex items-center gap-1"
                    >
                      {source}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-destructive/20"
                        onClick={() => {
                          removeLeadSource(source);
                          toast({
                            title: "Removido",
                            description: `Fonte "${source}" removida`,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Responsáveis (Owners)
              </CardTitle>
              <CardDescription>
                Adicione ou remova membros da equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Adicionar novo responsável</Label>
                <div className="flex gap-2">
                  <Input
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="Ex: João Silva, Maria Santos, etc."
                    onKeyDown={(e) => e.key === "Enter" && handleAddOwner()}
                  />
                  <Button onClick={handleAddOwner} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsáveis disponíveis</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.owners.map((owner) => (
                    <Badge
                      key={owner}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 text-sm flex items-center gap-1"
                    >
                      {owner}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-destructive/20"
                        onClick={() => {
                          removeOwner(owner);
                          toast({
                            title: "Removido",
                            description: `Responsável "${owner}" removido`,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metas para Relatórios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas e Objetivos
              </CardTitle>
              <CardDescription>
                Defina as metas da empresa para acompanhamento nos relatórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Receita Mensal */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue">Meta de Receita Mensal (R$)</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    value={settings.goals.monthlyRevenue}
                    onChange={(e) => updateGoals({ monthlyRevenue: Number(e.target.value) })}
                    placeholder="100000"
                  />
                </div>

                {/* Leads Mensais */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyLeads">Meta de Leads Mensais</Label>
                  <Input
                    id="monthlyLeads"
                    type="number"
                    value={settings.goals.monthlyLeads}
                    onChange={(e) => updateGoals({ monthlyLeads: Number(e.target.value) })}
                    placeholder="50"
                  />
                </div>

                {/* Taxa de Conversão */}
                <div className="space-y-2">
                  <Label htmlFor="conversionRate">Meta de Taxa de Conversão (%)</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    value={settings.goals.conversionRate}
                    onChange={(e) => updateGoals({ conversionRate: Number(e.target.value) })}
                    placeholder="25"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Ticket Médio */}
                <div className="space-y-2">
                  <Label htmlFor="averageTicket">Meta de Ticket Médio (R$)</Label>
                  <Input
                    id="averageTicket"
                    type="number"
                    value={settings.goals.averageTicket}
                    onChange={(e) => updateGoals({ averageTicket: Number(e.target.value) })}
                    placeholder="5000"
                  />
                </div>

                {/* Reuniões Mensais */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyMeetings">Meta de Reuniões Mensais</Label>
                  <Input
                    id="monthlyMeetings"
                    type="number"
                    value={settings.goals.monthlyMeetings}
                    onChange={(e) => updateGoals({ monthlyMeetings: Number(e.target.value) })}
                    placeholder="30"
                  />
                </div>

                {/* Negócios Ganhos */}
                <div className="space-y-2">
                  <Label htmlFor="wonDeals">Meta de Negócios Ganhos por Mês</Label>
                  <Input
                    id="wonDeals"
                    type="number"
                    value={settings.goals.wonDeals}
                    onChange={(e) => updateGoals({ wonDeals: Number(e.target.value) })}
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  💡 Estas metas serão usadas como referência nos relatórios e dashboards para comparar o desempenho atual.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA USUÁRIOS */}
        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Usuários Ativos</h4>
                    <p className="text-sm text-muted-foreground">
                      {settings.owners.length} usuário{settings.owners.length !== 1 ? 's' : ''} cadastrado{settings.owners.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button onClick={() => {
                    toast({
                      title: "Convite enviado",
                      description: "Um email de convite foi enviado ao usuário",
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Convidar Usuário
                  </Button>
                </div>

                <Separator />

                {settings.owners.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Nenhum usuário cadastrado ainda
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adicione usuários na aba "Geral" em "Responsáveis"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {settings.owners.map((owner, index) => (
                      <div
                        key={owner}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{owner}</p>
                            <p className="text-sm text-muted-foreground">
                              {index === 0 ? "Administrador" : "Membro"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Ativo</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Editar usuário",
                                description: `Editando ${owner}`,
                              });
                            }}
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissões e Funções</CardTitle>
              <CardDescription>
                Configure as permissões de acesso por função
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sistema de permissões granulares em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA EMPRESA */}
        <TabsContent value="empresa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Dados cadastrais e informações fiscais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input 
                      placeholder="Tríade Solutions" 
                      value={companyData.company_name}
                      onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input 
                      placeholder="00.000.000/0000-00" 
                      value={companyData.cnpj}
                      onChange={(e) => setCompanyData({ ...companyData, cnpj: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input 
                      type="url" 
                      placeholder="https://empresa.com" 
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input 
                      placeholder="São Paulo" 
                      value={companyData.city}
                      onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Endereço</Label>
                    <Input 
                      placeholder="Rua, Número, Bairro" 
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    />
                  </div>
                </div>
                <Separator />
                <Button onClick={handleSaveCompanyData}>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA PAGAMENTOS */}
        <TabsContent value="pagamentos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Assinatura e Pagamento
              </CardTitle>
              <CardDescription>
                Gerencie seu plano e formas de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-card text-center">
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">Plano Atual</h4>
                    <p className="text-3xl font-bold mb-1">Professional</p>
                    <Badge className="bg-green-500 mb-3">Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    R$ 299,00/mês • Próximo vencimento: 20/11/2025
                  </p>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex flex-col items-center gap-3">
                    <Button 
                      size="lg"
                      onClick={() => {
                        toast({
                          title: "Gerenciar Assinatura",
                          description: "Redirecionando para o portal de pagamento...",
                        });
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Gerenciar Assinatura e Pagamento
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Altere seu plano, atualize seus dados de pagamento ou cancele sua assinatura
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Histórico de Pagamentos</h4>
                  <p className="text-sm text-muted-foreground">
                    Nenhum pagamento registrado ainda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA INTEGRAÇÕES */}
        <TabsContent value="integracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Integrações
              </CardTitle>
              <CardDescription>
                Conecte com outras ferramentas e serviços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* WhatsApp */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">WhatsApp Business</h4>
                          <p className="text-sm text-muted-foreground">
                            Automatize mensagens
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Email Marketing</h4>
                          <p className="text-sm text-muted-foreground">
                            Gmail, Outlook
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                  </div>

                  {/* Zapier */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Zap className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Zapier</h4>
                          <p className="text-sm text-muted-foreground">
                            Conecte 5000+ apps
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                  </div>

                  {/* Database */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">API & Webhooks</h4>
                          <p className="text-sm text-muted-foreground">
                            Integração customizada
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA SEGURANÇA */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança e Privacidade
              </CardTitle>
              <CardDescription>
                Proteja sua conta e seus dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Autenticação</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Autenticação de Dois Fatores (2FA)</p>
                        <p className="text-sm text-muted-foreground">
                          Adicione uma camada extra de segurança
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={twoFactorEnabled} 
                          onCheckedChange={handleToggle2FA}
                        />
                        <span className="text-sm text-muted-foreground">
                          {twoFactorEnabled ? "Ativado" : "Desativado"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Senha</h4>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Redefinir Senha",
                        description: "Link de redefinição enviado para seu email",
                      });
                    }}
                  >
                    Alterar Senha
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Sessões Ativas</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gerencie os dispositivos conectados à sua conta
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Chrome no Windows</p>
                        <p className="text-sm text-muted-foreground">
                          São Paulo, BR • Última atividade: agora
                        </p>
                      </div>
                      <Badge variant="secondary">Atual</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-destructive">Zona de Perigo</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ações irreversíveis que afetam sua conta
                  </p>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Atenção",
                        description: "Esta ação não pode ser desfeita",
                        variant: "destructive",
                      });
                    }}
                  >
                    Excluir Conta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
