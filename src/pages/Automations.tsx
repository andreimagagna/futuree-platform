import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Workflow,
  Mail,
  Phone,
  MessageSquare,
  Tag,
  Star,
  Activity,
  BarChart3,
  Trash2,
  Edit,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { mockAutomationRules, mockFollowUpSequences, mockAutomationTemplates, mockAutomationExecutions } from '@/utils/automationMockData';
import type { AutomationRule, AutomationTemplate, AutomationExecution } from '@/types/Automation';

export default function Automations() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates] = useState<AutomationTemplate[]>(mockAutomationTemplates);
  const [executions] = useState<AutomationExecution[]>([]);
  const { toast } = useToast();
  
  // Dialog states
  const [showNewAutomation, setShowNewAutomation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditAutomation, setShowEditAutomation] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [newAutomationName, setNewAutomationName] = useState('');
  const [newAutomationDescription, setNewAutomationDescription] = useState('');
  const [newAutomationTrigger, setNewAutomationTrigger] = useState('lead_created');
  const [automationActions, setAutomationActions] = useState<any[]>([]);
  
  // Settings states
  const [workingHoursStart, setWorkingHoursStart] = useState('08:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('18:00');
  const [timezone, setTimezone] = useState('america/sao_paulo');
  const [executeOnWeekends, setExecuteOnWeekends] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [activeTab, setActiveTab] = useState('rules');
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const handleCreateAutomation = () => {
    if (!newAutomationName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da automação é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Validar que tem pelo menos uma ação
    if (automationActions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma ação à automação",
        variant: "destructive",
      });
      return;
    }

    // Validar que todas as ações de criar tarefa têm título
    const invalidActions = automationActions.filter(
      action => action.type === 'create_task' && !action.config.title?.trim()
    );

    if (invalidActions.length > 0) {
      toast({
        title: "Erro",
        description: "Todas as tarefas precisam ter um título",
        variant: "destructive",
      });
      return;
    }

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newAutomationName,
      description: newAutomationDescription,
      isActive: true,
      trigger: newAutomationTrigger as any,
      conditions: [],
      actions: automationActions,
      executionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'User',
    };

    setRules([...rules, newRule]);
    setShowNewAutomation(false);
    setNewAutomationName('');
    setNewAutomationDescription('');
    setNewAutomationTrigger('lead_created');
    setAutomationActions([]);

    toast({
      title: "Automação criada!",
      description: `"${newAutomationName}" foi criada com ${automationActions.length} ações.`,
    });
  };

  const handleEditAutomation = (rule: AutomationRule) => {
    setEditingRule(rule);
    setNewAutomationName(rule.name);
    setNewAutomationDescription(rule.description || '');
    setNewAutomationTrigger(rule.trigger);
    setAutomationActions(rule.actions || []);
    setShowEditAutomation(true);
  };

  const handleUpdateAutomation = () => {
    if (!editingRule) return;

    if (!newAutomationName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da automação é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Validar que tem pelo menos uma ação
    if (automationActions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma ação à automação",
        variant: "destructive",
      });
      return;
    }

    // Validar que todas as ações de criar tarefa têm título
    const invalidActions = automationActions.filter(
      action => action.type === 'create_task' && !action.config.title?.trim()
    );

    if (invalidActions.length > 0) {
      toast({
        title: "Erro",
        description: "Todas as tarefas precisam ter um título",
        variant: "destructive",
      });
      return;
    }

    const updatedRule: AutomationRule = {
      ...editingRule,
      name: newAutomationName,
      description: newAutomationDescription,
      trigger: newAutomationTrigger as any,
      actions: automationActions,
      updatedAt: new Date().toISOString(),
    };

    setRules(rules.map(r => r.id === editingRule.id ? updatedRule : r));
    setShowEditAutomation(false);
    setEditingRule(null);
    setNewAutomationName('');
    setNewAutomationDescription('');
    setNewAutomationTrigger('lead_created');
    setAutomationActions([]);

    toast({
      title: "Automação atualizada!",
      description: `"${newAutomationName}" foi atualizada com ${automationActions.length} ações.`,
    });
  };

  const handleAddAction = () => {
    const newAction = {
      type: 'create_task',
      config: {
        title: '',
        description: '',
        priority: 'medium',
        dueInDays: 0,
        taskType: 'call'
      },
      delay: 0
    };
    setAutomationActions([...automationActions, newAction]);
  };

  const handleRemoveAction = (index: number) => {
    setAutomationActions(automationActions.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (index: number, field: string, value: any) => {
    const updated = [...automationActions];
    if (field.startsWith('config.')) {
      const configField = field.replace('config.', '');
      updated[index] = {
        ...updated[index],
        config: {
          ...updated[index].config,
          [configField]: value
        }
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    setAutomationActions(updated);
  };

  const handleMoveAction = (index: number, direction: 'up' | 'down') => {
    const newActions = [...automationActions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newActions.length) return;
    
    [newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]];
    setAutomationActions(newActions);
  };

  const handleDuplicateAction = (index: number) => {
    const actionToDuplicate = {...automationActions[index]};
    const newActions = [...automationActions];
    newActions.splice(index + 1, 0, actionToDuplicate);
    setAutomationActions(newActions);
    
    toast({
      title: "Ação duplicada",
      description: "A ação foi duplicada com sucesso.",
    });
  };

  const handleUseTemplate = (template: AutomationTemplate) => {
    const newRule: AutomationRule = {
      ...template.rule,
      id: `rule-${Date.now()}`,
      name: template.rule.name || template.name,
      description: template.rule.description || template.description,
      trigger: template.rule.trigger,
      conditions: template.rule.conditions || [],
      actions: template.rule.actions || [],
      isActive: true,
      executionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'User',
    };

    setRules([...rules, newRule]);
    setShowTemplatePreview(false);

    toast({
      title: "Template aplicado!",
      description: `Automação "${template.name}" foi criada a partir do template.`,
    });
    
    // Mudar para a aba de regras
    setActiveTab('rules');
  };

  const handlePreviewTemplate = (template: AutomationTemplate) => {
    setSelectedTemplate(template);
    setShowTemplatePreview(true);
  };

  const handleDeleteRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    setRules(rules.filter(r => r.id !== id));
    
    toast({
      title: "Automação excluída",
      description: `"${rule?.name}" foi removida.`,
    });
  };

  const handleDuplicateRule = (rule: AutomationRule) => {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Cópia)`,
      executionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRules([...rules, newRule]);

    toast({
      title: "Automação duplicada",
      description: `"${newRule.name}" foi criada.`,
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create_task': return <CheckCircle2 className="h-4 w-4" />;
      case 'send_email': return <Mail className="h-4 w-4" />;
      case 'send_whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'add_tag': return <Tag className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      lead_created: 'Lead Criado',
      lead_qualified: 'Lead Qualificado',
      lead_status_changed: 'Status Alterado',
      time_elapsed: 'Tempo Decorrido',
      no_response: 'Sem Resposta',
      email_opened: 'Email Aberto',
      email_clicked: 'Email Clicado',
      form_submitted: 'Formulário Enviado',
      score_threshold: 'Score Atingido'
    };
    return labels[trigger] || trigger;
  };

  const totalAutomations = 0;
  const activeAutomations = 0;
  const totalExecutions = 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(18,30%,25%)]">Automações</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações de Automação</DialogTitle>
                <DialogDescription>
                  Configure as preferências globais de automações
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Horário de Funcionamento</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Automações serão executadas apenas dentro deste horário
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Início</Label>
                      <Input 
                        type="time" 
                        value={workingHoursStart}
                        onChange={(e) => setWorkingHoursStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Fim</Label>
                      <Input 
                        type="time" 
                        value={workingHoursEnd}
                        onChange={(e) => setWorkingHoursEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/sao_paulo">América/São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="america/new_york">América/Nova York (UTC-5)</SelectItem>
                      <SelectItem value="europe/london">Europa/Londres (UTC+0)</SelectItem>
                      <SelectItem value="asia/tokyo">Ásia/Tóquio (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <Label>Executar automações aos finais de semana</Label>
                    <p className="text-xs text-muted-foreground">Permite execução sábado e domingo</p>
                  </div>
                  <Switch 
                    checked={executeOnWeekends}
                    onCheckedChange={setExecuteOnWeekends}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Limite de execuções diárias</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Número máximo de automações que podem ser executadas por dia
                  </p>
                  <Input 
                    type="number" 
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(parseInt(e.target.value) || 100)}
                    min="1" 
                  />
                </div>
                <div className="border-t pt-4">
                  <Label className="mb-2 block">Resumo das Configurações</Label>
                  <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horário:</span>
                      <span className="font-medium">{workingHoursStart} - {workingHoursEnd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Finais de semana:</span>
                      <span className="font-medium">{executeOnWeekends ? 'Sim' : 'Não'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Limite diário:</span>
                      <span className="font-medium">{dailyLimit} execuções</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-[hsl(18,30%,25%)] hover:bg-[hsl(18,30%,20%)]"
                  onClick={() => {
                    setShowSettings(false);
                    localStorage.setItem('automation-settings', JSON.stringify({
                      workingHoursStart,
                      workingHoursEnd,
                      timezone,
                      executeOnWeekends,
                      dailyLimit
                    }));
                    toast({
                      title: "Configurações salvas",
                      description: "As preferências foram atualizadas com sucesso.",
                    });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewAutomation} onOpenChange={setShowNewAutomation}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[hsl(18,30%,25%)] hover:bg-[hsl(18,30%,20%)]">
                <Plus className="h-4 w-4 mr-2" />
                Nova Automação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Automação</DialogTitle>
                <DialogDescription>
                  Configure uma nova regra de automação personalizada
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Automação*</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Follow-up automático"
                    value={newAutomationName}
                    onChange={(e) => setNewAutomationName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o que esta automação faz..."
                    value={newAutomationDescription}
                    onChange={(e) => setNewAutomationDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger">Gatilho</Label>
                  <Select value={newAutomationTrigger} onValueChange={setNewAutomationTrigger}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead_created">Lead Criado</SelectItem>
                      <SelectItem value="lead_qualified">Lead Qualificado</SelectItem>
                      <SelectItem value="lead_status_changed">Status Alterado</SelectItem>
                      <SelectItem value="time_elapsed">Tempo Decorrido</SelectItem>
                      <SelectItem value="no_response">Sem Resposta</SelectItem>
                      <SelectItem value="email_opened">Email Aberto</SelectItem>
                      <SelectItem value="email_clicked">Email Clicado</SelectItem>
                      <SelectItem value="form_submitted">Formulário Enviado</SelectItem>
                      <SelectItem value="score_threshold">Score Atingido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions Builder */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label>Ações da Automação ({automationActions.length})</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddAction}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Ação
                    </Button>
                  </div>

                  {automationActions.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                      Nenhuma ação adicionada. Clique em "Adicionar Ação" para começar.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {automationActions.map((action, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Ação {index + 1}</span>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleMoveAction(index, 'up')}
                                    disabled={index === 0}
                                    title="Mover para cima"
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleMoveAction(index, 'down')}
                                    disabled={index === automationActions.length - 1}
                                    title="Mover para baixo"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleDuplicateAction(index)}
                                  title="Duplicar"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleRemoveAction(index)}
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs">Tipo de Ação</Label>
                                <Select
                                  value={action.type}
                                  onValueChange={(value) => handleUpdateAction(index, 'type', value)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="create_task">Criar Tarefa</SelectItem>
                                    <SelectItem value="send_email">Enviar Email</SelectItem>
                                    <SelectItem value="send_whatsapp">Enviar WhatsApp</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Atraso (minutos)</Label>
                                <Input
                                  type="number"
                                  className="h-9"
                                  value={action.delay}
                                  onChange={(e) => handleUpdateAction(index, 'delay', parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                  min="0"
                                />
                              </div>
                            </div>

                            {action.type === 'create_task' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-xs">Título da Tarefa*</Label>
                                  <Input
                                    className="h-9"
                                    value={action.config.title || ''}
                                    onChange={(e) => handleUpdateAction(index, 'config.title', e.target.value)}
                                    placeholder="Ex: Ligar para o lead"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs">Descrição</Label>
                                  <Textarea
                                    rows={2}
                                    value={action.config.description || ''}
                                    onChange={(e) => handleUpdateAction(index, 'config.description', e.target.value)}
                                    placeholder="Instruções para a tarefa..."
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <div className="space-y-2">
                                    <Label className="text-xs">Tipo</Label>
                                    <Select
                                      value={action.config.taskType || 'call'}
                                      onValueChange={(value) => handleUpdateAction(index, 'config.taskType', value)}
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="call">
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            Ligação
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="whatsapp">
                                          <div className="flex items-center gap-2">
                                            <MessageSquare className="h-3 w-3" />
                                            WhatsApp
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="email">
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            Email
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-xs">Prioridade</Label>
                                    <Select
                                      value={action.config.priority || 'medium'}
                                      onValueChange={(value) => handleUpdateAction(index, 'config.priority', value)}
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Baixa</SelectItem>
                                        <SelectItem value="medium">Média</SelectItem>
                                        <SelectItem value="high">Alta</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-xs">Vence em (dias)</Label>
                                    <Input
                                      type="number"
                                      className="h-9"
                                      value={action.config.dueInDays || 0}
                                      onChange={(e) => handleUpdateAction(index, 'config.dueInDays', parseInt(e.target.value) || 0)}
                                      min="0"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowNewAutomation(false);
                  setNewAutomationName('');
                  setNewAutomationDescription('');
                  setAutomationActions([]);
                }}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-[hsl(18,30%,25%)] hover:bg-[hsl(18,30%,20%)]"
                  onClick={handleCreateAutomation}
                >
                  Criar Automação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Automation Dialog */}
      <Dialog open={showEditAutomation} onOpenChange={setShowEditAutomation}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Automação</DialogTitle>
            <DialogDescription>
              Modifique as configurações da automação
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Automação*</Label>
              <Input
                id="edit-name"
                placeholder="Ex: Follow-up automático"
                value={newAutomationName}
                onChange={(e) => setNewAutomationName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                placeholder="Descreva o que esta automação faz..."
                value={newAutomationDescription}
                onChange={(e) => setNewAutomationDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-trigger">Gatilho</Label>
              <Select value={newAutomationTrigger} onValueChange={setNewAutomationTrigger}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_created">Lead Criado</SelectItem>
                  <SelectItem value="lead_qualified">Lead Qualificado</SelectItem>
                  <SelectItem value="lead_status_changed">Status Alterado</SelectItem>
                  <SelectItem value="time_elapsed">Tempo Decorrido</SelectItem>
                  <SelectItem value="no_response">Sem Resposta</SelectItem>
                  <SelectItem value="email_opened">Email Aberto</SelectItem>
                  <SelectItem value="email_clicked">Email Clicado</SelectItem>
                  <SelectItem value="form_submitted">Formulário Enviado</SelectItem>
                  <SelectItem value="score_threshold">Score Atingido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions Builder */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label>Ações da Automação ({automationActions.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAction}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Ação
                </Button>
              </div>

              {automationActions.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  Nenhuma ação adicionada. Clique em "Adicionar Ação" para começar.
                </div>
              ) : (
                <div className="space-y-3">
                  {automationActions.map((action, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Ação {index + 1}</span>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMoveAction(index, 'up')}
                                disabled={index === 0}
                                title="Mover para cima"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMoveAction(index, 'down')}
                                disabled={index === automationActions.length - 1}
                                title="Mover para baixo"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDuplicateAction(index)}
                              title="Duplicar"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleRemoveAction(index)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Tipo de Ação</Label>
                            <Select
                              value={action.type}
                              onValueChange={(value) => handleUpdateAction(index, 'type', value)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="create_task">Criar Tarefa</SelectItem>
                                <SelectItem value="send_email">Enviar Email</SelectItem>
                                <SelectItem value="send_whatsapp">Enviar WhatsApp</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Atraso (minutos)</Label>
                            <Input
                              type="number"
                              className="h-9"
                              value={action.delay}
                              onChange={(e) => handleUpdateAction(index, 'delay', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>

                        {action.type === 'create_task' && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-xs">Título da Tarefa*</Label>
                              <Input
                                className="h-9"
                                value={action.config.title || ''}
                                onChange={(e) => handleUpdateAction(index, 'config.title', e.target.value)}
                                placeholder="Ex: Ligar para o lead"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Descrição</Label>
                              <Textarea
                                rows={2}
                                value={action.config.description || ''}
                                onChange={(e) => handleUpdateAction(index, 'config.description', e.target.value)}
                                placeholder="Instruções para a tarefa..."
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="space-y-2">
                                <Label className="text-xs">Tipo</Label>
                                <Select
                                  value={action.config.taskType || 'call'}
                                  onValueChange={(value) => handleUpdateAction(index, 'config.taskType', value)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="call">
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        Ligação
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="whatsapp">
                                      <div className="flex items-center gap-2">
                                        <MessageSquare className="h-3 w-3" />
                                        WhatsApp
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="email">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-3 w-3" />
                                        Email
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Prioridade</Label>
                                <Select
                                  value={action.config.priority || 'medium'}
                                  onValueChange={(value) => handleUpdateAction(index, 'config.priority', value)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Baixa</SelectItem>
                                    <SelectItem value="medium">Média</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Vence em (dias)</Label>
                                <Input
                                  type="number"
                                  className="h-9"
                                  value={action.config.dueInDays || 0}
                                  onChange={(e) => handleUpdateAction(index, 'config.dueInDays', parseInt(e.target.value) || 0)}
                                  min="0"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowEditAutomation(false);
              setEditingRule(null);
              setNewAutomationName('');
              setNewAutomationDescription('');
              setAutomationActions([]);
            }}>
              Cancelar
            </Button>
            <Button 
              className="bg-[hsl(18,30%,25%)] hover:bg-[hsl(18,30%,20%)]"
              onClick={handleUpdateAutomation}
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={showTemplatePreview} onOpenChange={setShowTemplatePreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedTemplate?.icon}</span>
              <div>
                <DialogTitle>{selectedTemplate?.name}</DialogTitle>
                <DialogDescription>{selectedTemplate?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Gatilho</Label>
                  <div className="bg-muted p-3 rounded-lg">
                    <Badge variant="outline">
                      <Zap className="h-3 w-3 mr-1" />
                      {getTriggerLabel(selectedTemplate.rule.trigger)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Categoria</Label>
                  <div className="bg-muted p-3 rounded-lg">
                    <Badge variant="outline" className="capitalize">
                      {selectedTemplate.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Ações Configuradas ({selectedTemplate.rule.actions?.length || 0})
                </Label>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedTemplate.rule.actions?.map((action, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(18,30%,25%)] text-white text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              {getActionIcon(action.type)}
                              <span className="font-medium text-sm">
                                {action.type === 'create_task' && 'Criar Tarefa'}
                                {action.type === 'send_email' && 'Enviar Email'}
                                {action.type === 'send_whatsapp' && 'Enviar WhatsApp'}
                              </span>
                              {action.delay > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {action.delay < 60 ? `${action.delay}min` : 
                                   action.delay < 1440 ? `${Math.floor(action.delay / 60)}h` :
                                   `${Math.floor(action.delay / 1440)}d`}
                                </Badge>
                              )}
                            </div>
                            
                            {action.config.title && (
                              <div className="text-sm font-medium">{action.config.title}</div>
                            )}
                            
                            {action.config.description && (
                              <div className="text-xs text-muted-foreground">{action.config.description}</div>
                            )}
                            
                            <div className="flex gap-2 text-xs">
                              {action.config.taskType && (
                                <Badge variant="outline" className="text-xs">
                                  {action.config.taskType === 'call' && <Phone className="h-3 w-3 mr-1" />}
                                  {action.config.taskType === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                                  {action.config.taskType === 'email' && <Mail className="h-3 w-3 mr-1" />}
                                  {action.config.taskType}
                                </Badge>
                              )}
                              {action.config.priority && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    action.config.priority === 'high' ? 'border-red-500 text-red-500' :
                                    action.config.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                                    'border-gray-500 text-gray-500'
                                  }`}
                                >
                                  {action.config.priority === 'high' && 'Alta'}
                                  {action.config.priority === 'medium' && 'Média'}
                                  {action.config.priority === 'low' && 'Baixa'}
                                </Badge>
                              )}
                              {action.config.dueInDays !== undefined && action.config.dueInDays > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Vence em {action.config.dueInDays}d
                                </Badge>
                              )}
                              {action.config.dueInHours !== undefined && action.config.dueInHours > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Vence em {action.config.dueInHours}h
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="h-4 w-4" />
                  Resumo do Template
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de ações:</span>
                    <span className="font-medium">{selectedTemplate.rule.actions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração total:</span>
                    <span className="font-medium">
                      {Math.max(...(selectedTemplate.rule.actions?.map(a => a.delay) || [0])) >= 1440
                        ? `${Math.floor(Math.max(...(selectedTemplate.rule.actions?.map(a => a.delay) || [0])) / 1440)} dias`
                        : `${Math.floor(Math.max(...(selectedTemplate.rule.actions?.map(a => a.delay) || [0])) / 60)} horas`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTemplatePreview(false)}>
              Fechar
            </Button>
            <Button 
              className="bg-[hsl(18,30%,25%)] hover:bg-[hsl(18,30%,20%)]"
              onClick={() => selectedTemplate && handleUseTemplate(selectedTemplate)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Usar este Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Automações</CardDescription>
            <CardTitle className="text-3xl">{totalAutomations}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Workflow className="h-4 w-4 mr-1" />
              {activeAutomations} ativas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Execuções (30 dias)</CardDescription>
            <CardTitle className="text-3xl">{totalExecutions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1" />
              Nenhuma execução
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Taxa de Conclusão</CardDescription>
            <CardTitle className="text-3xl">0%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Média geral
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">
            <Zap className="h-4 w-4 mr-2" />
            Regras de Automação
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Star className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="executions">
            <BarChart3 className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Automation Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          {rules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma automação criada</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Comece criando uma nova automação ou use um template pronto
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('templates')}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Ver Templates
                  </Button>
                  <Button
                    className="bg-[hsl(18,30%,25%)] hover:bg-[hsl(18,30%,20%)]"
                    onClick={() => setShowNewAutomation(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Automação
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      {rule.isActive ? (
                        <Badge variant="default" className="bg-[hsl(140,30%,40%)]">
                          <Play className="h-3 w-3 mr-1" />
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Pause className="h-3 w-3 mr-1" />
                          Pausada
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditAutomation(rule)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicateRule(rule)}
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRule(rule.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Trigger */}
                  <div>
                    <div className="text-sm font-medium mb-2">Gatilho:</div>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {getTriggerLabel(rule.trigger)}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="text-sm font-medium mb-2">Ações ({rule.actions.length}):</div>
                    <div className="flex flex-wrap gap-2">
                      {rule.actions.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs bg-muted px-3 py-1.5 rounded-md"
                        >
                          {getActionIcon(action.type)}
                          <span>
                            {action.type === 'create_task' && `Criar tarefa`}
                            {action.type === 'send_email' && `Enviar email`}
                            {action.type === 'send_whatsapp' && `WhatsApp`}
                            {action.type === 'update_lead_status' && `Atualizar status`}
                            {action.type === 'add_tag' && `Adicionar tag`}
                            {action.type === 'create_notification' && `Notificação`}
                            {action.type === 'update_score' && `Atualizar score`}
                          </span>
                          {action.delay > 0 && (
                            <span className="text-muted-foreground">
                              • {action.delay < 60 ? `${action.delay}min` : 
                                  action.delay < 1440 ? `${Math.floor(action.delay / 60)}h` :
                                  `${Math.floor(action.delay / 1440)}d`}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-2 border-t text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      {rule.executionCount} execuções
                    </div>
                    {rule.lastExecutedAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Última: {new Date(rule.lastExecutedAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{template.icon}</span>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getTriggerLabel(template.rule.trigger)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {template.rule.actions?.length || 0} ações
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.max(...(template.rule.actions?.map(a => a.delay) || [0])) >= 1440
                          ? `${Math.floor(Math.max(...(template.rule.actions?.map(a => a.delay) || [0])) / 1440)} dias`
                          : `${Math.floor(Math.max(...(template.rule.actions?.map(a => a.delay) || [0])) / 60)} horas`
                        }
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-3">Tipos de contato:</div>
                      <div className="flex gap-2">
                        {template.rule.actions?.some(a => a.config.taskType === 'call') && (
                          <Badge variant="secondary" className="text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            Ligação
                          </Badge>
                        )}
                        {template.rule.actions?.some(a => a.config.taskType === 'whatsapp') && (
                          <Badge variant="secondary" className="text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            WhatsApp
                          </Badge>
                        )}
                        {template.rule.actions?.some(a => a.config.taskType === 'email') && (
                          <Badge variant="secondary" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[hsl(18,30%,25%)] hover:bg-[hsl(18,30%,20%)]"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Usar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Executions History Tab */}
        <TabsContent value="executions" className="space-y-4">
          {executions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma execução registrada</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Quando as automações forem executadas, o histórico aparecerá aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            executions.map((execution) => (
            <Card key={execution.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{execution.automationName}</CardTitle>
                    <CardDescription className="mt-1">
                      Lead: {execution.leadName}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    execution.status === 'completed' ? 'default' :
                    execution.status === 'in_progress' ? 'secondary' :
                    'destructive'
                  }>
                    {execution.status === 'completed' && 'Concluída'}
                    {execution.status === 'in_progress' && 'Em andamento'}
                    {execution.status === 'failed' && 'Falhou'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Iniciada: {new Date(execution.triggeredAt).toLocaleString('pt-BR')}
                  </div>
                  
                  <div className="space-y-2">
                    {execution.actions.map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {action.status === 'completed' && (
                          <CheckCircle2 className="h-4 w-4 text-[hsl(140,30%,40%)]" />
                        )}
                        {action.status === 'pending' && (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        {action.status === 'failed' && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="capitalize">{action.type.replace('_', ' ')}</span>
                        {action.executedAt && (
                          <span className="text-xs text-muted-foreground">
                            • {new Date(action.executedAt).toLocaleTimeString('pt-BR')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
