import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Tag, 
  Users, 
  Target,
  Plus, 
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  User,
  Mail,
  Briefcase,
  Calendar,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

// ==================== INTERFACES ====================

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
  description: string | null;
  target: number;
  current: number;
  unit: string;
  deadline: string | null;
  created_at: string;
  owner_id: string;
}

// ==================== COMPONENT ====================

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  // ========== STATES ==========
  const [activeTab, setActiveTab] = useState("lead-sources");
  
  // Lead Sources
  const [isLeadSourceDialogOpen, setIsLeadSourceDialogOpen] = useState(false);
  const [editingLeadSource, setEditingLeadSource] = useState<LeadSource | null>(null);
  const [leadSourceForm, setLeadSourceForm] = useState({
    name: "",
    description: "",
    is_active: true
  });

  // Team Members
  const [isTeamMemberDialogOpen, setIsTeamMemberDialogOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamMemberForm, setTeamMemberForm] = useState({
    name: "",
    email: "",
    role: "",
    is_active: true
  });

  // Company Goals
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<CompanyGoal | null>(null);
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    target: 0,
    current: 0,
    unit: "",
    deadline: ""
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  // ========== QUERIES ==========

  // Lead Sources
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
    enabled: !!user
  });

  // Team Members
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
    enabled: !!user
  });

  // Company Goals
  const { data: companyGoals = [], isLoading: loadingGoals } = useQuery({
    queryKey: ['company_goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_goals')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CompanyGoal[];
    },
    enabled: !!user
  });

  // ========== MUTATIONS ==========

  // Lead Sources Mutations
  const createLeadSourceMutation = useMutation({
    mutationFn: async (data: typeof leadSourceForm) => {
      const { error } = await (supabase as any)
        .from('lead_sources')
        .insert([{
          ...data,
          owner_id: user?.id,
          description: data.description || null
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      setIsLeadSourceDialogOpen(false);
      resetLeadSourceForm();
      toast({ title: "Fonte de lead criada com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar fonte de lead", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateLeadSourceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof leadSourceForm }) => {
      const { error } = await (supabase as any)
        .from('lead_sources')
        .update({
          ...data,
          description: data.description || null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      setIsLeadSourceDialogOpen(false);
      setEditingLeadSource(null);
      resetLeadSourceForm();
      toast({ title: "Fonte de lead atualizada com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar fonte de lead", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteLeadSourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lead_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      setDeleteConfirm(null);
      toast({ title: "Fonte de lead removida com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover fonte de lead", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Team Members Mutations
  const createTeamMemberMutation = useMutation({
    mutationFn: async (data: typeof teamMemberForm) => {
      const { error } = await (supabase as any)
        .from('team_members')
        .insert([{
          ...data,
          owner_id: user?.id
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      setIsTeamMemberDialogOpen(false);
      resetTeamMemberForm();
      toast({ title: "Responsável adicionado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao adicionar responsável", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateTeamMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof teamMemberForm }) => {
      const { error } = await (supabase as any)
        .from('team_members')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      setIsTeamMemberDialogOpen(false);
      setEditingTeamMember(null);
      resetTeamMemberForm();
      toast({ title: "Responsável atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar responsável", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      setDeleteConfirm(null);
      toast({ title: "Responsável removido com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover responsável", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Company Goals Mutations
  const createGoalMutation = useMutation({
    mutationFn: async (data: typeof goalForm) => {
      const { error } = await (supabase as any)
        .from('company_goals')
        .insert([{
          ...data,
          owner_id: user?.id,
          description: data.description || null,
          deadline: data.deadline || null
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_goals'] });
      setIsGoalDialogOpen(false);
      resetGoalForm();
      toast({ title: "Meta criada com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar meta", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof goalForm }) => {
      const { error } = await (supabase as any)
        .from('company_goals')
        .update({
          ...data,
          description: data.description || null,
          deadline: data.deadline || null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_goals'] });
      setIsGoalDialogOpen(false);
      setEditingGoal(null);
      resetGoalForm();
      toast({ title: "Meta atualizada com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar meta", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_goals'] });
      setDeleteConfirm(null);
      toast({ title: "Meta removida com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover meta", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // ========== HANDLERS ==========

  // Lead Sources
  const resetLeadSourceForm = () => {
    setLeadSourceForm({ name: "", description: "", is_active: true });
  };

  const handleCreateLeadSource = () => {
    setEditingLeadSource(null);
    resetLeadSourceForm();
    setIsLeadSourceDialogOpen(true);
  };

  const handleEditLeadSource = (source: LeadSource) => {
    setEditingLeadSource(source);
    setLeadSourceForm({
      name: source.name,
      description: source.description || "",
      is_active: source.is_active
    });
    setIsLeadSourceDialogOpen(true);
  };

  const handleSaveLeadSource = () => {
    if (!leadSourceForm.name.trim()) {
      toast({ 
        title: "Nome obrigatório", 
        description: "Digite um nome para a fonte de lead",
        variant: "destructive" 
      });
      return;
    }

    if (editingLeadSource) {
      updateLeadSourceMutation.mutate({ id: editingLeadSource.id, data: leadSourceForm });
    } else {
      createLeadSourceMutation.mutate(leadSourceForm);
    }
  };

  // Team Members
  const resetTeamMemberForm = () => {
    setTeamMemberForm({ name: "", email: "", role: "", is_active: true });
  };

  const handleCreateTeamMember = () => {
    setEditingTeamMember(null);
    resetTeamMemberForm();
    setIsTeamMemberDialogOpen(true);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamMemberForm({
      name: member.name,
      email: member.email,
      role: member.role,
      is_active: member.is_active
    });
    setIsTeamMemberDialogOpen(true);
  };

  const handleSaveTeamMember = () => {
    if (!teamMemberForm.name.trim() || !teamMemberForm.email.trim()) {
      toast({ 
        title: "Campos obrigatórios", 
        description: "Nome e email são obrigatórios",
        variant: "destructive" 
      });
      return;
    }

    if (editingTeamMember) {
      updateTeamMemberMutation.mutate({ id: editingTeamMember.id, data: teamMemberForm });
    } else {
      createTeamMemberMutation.mutate(teamMemberForm);
    }
  };

  // Company Goals
  const resetGoalForm = () => {
    setGoalForm({ title: "", description: "", target: 0, current: 0, unit: "", deadline: "" });
  };

  const handleCreateGoal = () => {
    setEditingGoal(null);
    resetGoalForm();
    setIsGoalDialogOpen(true);
  };

  const handleEditGoal = (goal: CompanyGoal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description || "",
      target: goal.target,
      current: goal.current,
      unit: goal.unit,
      deadline: goal.deadline || ""
    });
    setIsGoalDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (!goalForm.title.trim() || goalForm.target <= 0) {
      toast({ 
        title: "Campos obrigatórios", 
        description: "Título e meta são obrigatórios",
        variant: "destructive" 
      });
      return;
    }

    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, data: goalForm });
    } else {
      createGoalMutation.mutate(goalForm);
    }
  };

  // Delete
  const handleDelete = () => {
    if (!deleteConfirm) return;

    switch (deleteConfirm.type) {
      case 'lead_source':
        deleteLeadSourceMutation.mutate(deleteConfirm.id);
        break;
      case 'team_member':
        deleteTeamMemberMutation.mutate(deleteConfirm.id);
        break;
      case 'goal':
        deleteGoalMutation.mutate(deleteConfirm.id);
        break;
    }
  };

  // ========== RENDER ==========

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold">Configurações</h2>
        <p className="text-muted-foreground">
          Configure fontes de leads, responsáveis e metas da empresa
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lead-sources" className="gap-2">
            <Tag className="h-4 w-4" />
            Fontes de Leads
          </TabsTrigger>
          <TabsTrigger value="team-members" className="gap-2">
            <Users className="h-4 w-4" />
            Responsáveis
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <Target className="h-4 w-4" />
            Metas e Objetivos
          </TabsTrigger>
        </TabsList>

        {/* ==================== TAB: FONTES DE LEADS ==================== */}
        <TabsContent value="lead-sources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Fontes de Leads
                  </CardTitle>
                  <CardDescription>
                    Gerencie as origens dos seus leads (Google Ads, Indicação, etc)
                  </CardDescription>
                </div>
                <Button onClick={handleCreateLeadSource}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Fonte
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingLeadSources ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : leadSources.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Nenhuma fonte de lead cadastrada</p>
                  <p className="text-sm text-muted-foreground">
                    Clique em "Nova Fonte" para adicionar
                  </p>
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
                        <TableCell className="text-muted-foreground">
                          {source.description || "—"}
                        </TableCell>
                        <TableCell>
                          {source.is_active ? (
                            <Badge className="bg-success">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Circle className="h-3 w-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLeadSource(source)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm({ 
                                type: 'lead_source', 
                                id: source.id, 
                                name: source.name 
                              })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB: RESPONSÁVEIS ==================== */}
        <TabsContent value="team-members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Responsáveis (Owners)
                  </CardTitle>
                  <CardDescription>
                    Gerencie os membros da equipe responsáveis por leads e tarefas
                  </CardDescription>
                </div>
                <Button onClick={handleCreateTeamMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Responsável
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingTeamMembers ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Nenhum responsável cadastrado</p>
                  <p className="text-sm text-muted-foreground">
                    Clique em "Novo Responsável" para adicionar
                  </p>
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
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            {member.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.email}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.role || "—"}
                        </TableCell>
                        <TableCell>
                          {member.is_active ? (
                            <Badge className="bg-success">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Circle className="h-3 w-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTeamMember(member)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm({ 
                                type: 'team_member', 
                                id: member.id, 
                                name: member.name 
                              })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB: METAS E OBJETIVOS ==================== */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Metas e Objetivos
                  </CardTitle>
                  <CardDescription>
                    Defina e acompanhe as metas da empresa
                  </CardDescription>
                </div>
                <Button onClick={handleCreateGoal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingGoals ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : companyGoals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Nenhuma meta cadastrada</p>
                  <p className="text-sm text-muted-foreground">
                    Clique em "Nova Meta" para adicionar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyGoals.map((goal) => {
                    const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;

                    return (
                      <Card key={goal.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-1">{goal.title}</h4>
                              {goal.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {goal.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {goal.deadline && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditGoal(goal)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirm({ 
                                  type: 'goal', 
                                  id: goal.id, 
                                  name: goal.title 
                                })}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="font-semibold">
                                {goal.current} / {goal.target} {goal.unit}
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-success" />
                              <span className="font-medium text-success">
                                {progress.toFixed(1)}% alcançado
                              </span>
                            </div>
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
      </Tabs>

      {/* ==================== DIALOG: LEAD SOURCE ==================== */}
      <Dialog open={isLeadSourceDialogOpen} onOpenChange={setIsLeadSourceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLeadSource ? "Editar Fonte de Lead" : "Nova Fonte de Lead"}
            </DialogTitle>
            <DialogDescription>
              Configure uma origem para rastreamento de leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={leadSourceForm.name}
                onChange={(e) => setLeadSourceForm({ ...leadSourceForm, name: e.target.value })}
                placeholder="Ex: Google Ads, Indicação, Facebook"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={leadSourceForm.description}
                onChange={(e) => setLeadSourceForm({ ...leadSourceForm, description: e.target.value })}
                placeholder="Detalhes sobre esta fonte..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={leadSourceForm.is_active}
                onChange={(e) => setLeadSourceForm({ ...leadSourceForm, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeadSourceDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLeadSource}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== DIALOG: TEAM MEMBER ==================== */}
      <Dialog open={isTeamMemberDialogOpen} onOpenChange={setIsTeamMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTeamMember ? "Editar Responsável" : "Novo Responsável"}
            </DialogTitle>
            <DialogDescription>
              Adicione um membro da equipe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">Nome *</Label>
              <Input
                id="member-name"
                value={teamMemberForm.name}
                onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name: e.target.value })}
                placeholder="João Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={teamMemberForm.email}
                onChange={(e) => setTeamMemberForm({ ...teamMemberForm, email: e.target.value })}
                placeholder="joao@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={teamMemberForm.role}
                onChange={(e) => setTeamMemberForm({ ...teamMemberForm, role: e.target.value })}
                placeholder="SDR, Closer, CS Manager..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="member-active"
                checked={teamMemberForm.is_active}
                onChange={(e) => setTeamMemberForm({ ...teamMemberForm, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="member-active">Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamMemberDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTeamMember}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== DIALOG: COMPANY GOAL ==================== */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? "Editar Meta" : "Nova Meta"}
            </DialogTitle>
            <DialogDescription>
              Defina um objetivo para a empresa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Título *</Label>
              <Input
                id="goal-title"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                placeholder="Ex: Receita Mensal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">Descrição</Label>
              <Textarea
                id="goal-description"
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                placeholder="Detalhes sobre esta meta..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Meta *</Label>
                <Input
                  id="target"
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({ ...goalForm, target: Number(e.target.value) })}
                  placeholder="100000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current">Atual</Label>
                <Input
                  id="current"
                  type="number"
                  value={goalForm.current}
                  onChange={(e) => setGoalForm({ ...goalForm, current: Number(e.target.value) })}
                  placeholder="50000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  value={goalForm.unit}
                  onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                  placeholder="R$, Leads, %..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveGoal}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== ALERT DIALOG: DELETE CONFIRMATION ==================== */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteConfirm?.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
