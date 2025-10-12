import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Mail,
  Eye,
  Copy,
  Trash2,
  Edit,
  TrendingUp,
  Send,
  FileText,
  MoreVertical,
  Code,
  Sparkles,
} from "lucide-react";
import { EmailTemplate } from "@/types/Marketing";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const TemplatesEmail = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Mock data
  const [templates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Boas-vindas - Novo Lead",
      subject: "Bem-vindo(a) à {empresa}!",
      preheader: "Estamos felizes em tê-lo(a) conosco",
      html: "<div style='font-family: Arial, sans-serif; padding: 20px;'><h1 style='color: #8B7355;'>Olá {nome}!</h1><p>Seja bem-vindo(a) à {empresa}. Estamos muito felizes em ter você conosco!</p><p>Nossa equipe está à disposição para ajudar você a alcançar seus objetivos.</p></div>",
      plainText: "Olá {nome}, Seja bem-vindo(a)!",
      variables: [
        { name: "nome", placeholder: "{nome}", description: "Nome do lead", required: true },
        { name: "empresa", placeholder: "{empresa}", description: "Nome da empresa", required: true },
      ],
      category: "welcome",
      tags: ["boas-vindas", "primeiro-contato"],
      usageCount: 45,
      lastUsedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      avgOpenRate: 68.5,
      avgClickRate: 12.3,
      isActive: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdBy: "Admin",
    },
    {
      id: "2",
      name: "Follow-up - Sem Resposta",
      subject: "Ainda tem interesse em {produto}?",
      preheader: "Vimos que você não respondeu nosso último contato",
      html: "<div style='font-family: Arial, sans-serif; padding: 20px;'><h2 style='color: #6B5D52;'>Olá {nome}</h2><p>Notamos que você demonstrou interesse em nosso {produto}, mas ainda não recebemos sua resposta.</p><p>Podemos ajudar com alguma dúvida?</p></div>",
      plainText: "Olá {nome}, Notamos que você demonstrou interesse...",
      variables: [
        { name: "nome", placeholder: "{nome}", description: "Nome do lead", required: true },
        { name: "produto", placeholder: "{produto}", description: "Nome do produto", required: true },
      ],
      category: "followup",
      tags: ["follow-up", "reengajamento"],
      usageCount: 128,
      lastUsedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      avgOpenRate: 42.1,
      avgClickRate: 8.7,
      isActive: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdBy: "Admin",
    },
    {
      id: "3",
      name: "Nutrição - Conteúdo Educativo",
      subject: "Aprenda mais sobre {topico}",
      preheader: "Conteúdo exclusivo para você",
      html: "<div style='font-family: Arial, sans-serif; padding: 20px;'><h2 style='color: #5A7A5A;'>Olá {nome}</h2><p>Preparamos um conteúdo especial sobre {topico} que vai ajudar você a {objetivo}.</p><a href='{link}' style='background: #5A7A5A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;'>Acessar Conteúdo</a></div>",
      plainText: "Olá {nome}, Preparamos um conteúdo especial...",
      variables: [
        { name: "nome", placeholder: "{nome}", description: "Nome do lead", required: true },
        { name: "topico", placeholder: "{topico}", description: "Tópico do conteúdo", required: true },
        { name: "objetivo", placeholder: "{objetivo}", description: "Objetivo do conteúdo", required: false },
        { name: "link", placeholder: "{link}", description: "Link do conteúdo", required: true },
      ],
      category: "nurture",
      tags: ["educativo", "conteudo", "nutrição"],
      usageCount: 87,
      lastUsedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      avgOpenRate: 55.8,
      avgClickRate: 18.2,
      isActive: true,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdBy: "Content Team",
    },
  ]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryConfig = (category: EmailTemplate['category']) => {
    const configs = {
      welcome: { 
        color: 'border-primary text-primary bg-primary/5',
        label: 'Boas-vindas',
      },
      followup: { 
        color: 'border-accent text-accent bg-accent/5',
        label: 'Follow-up',
      },
      nurture: { 
        color: 'border-success text-success bg-success/5',
        label: 'Nutrição',
      },
      promotional: { 
        color: 'border-warning text-warning bg-warning/5',
        label: 'Promocional',
      },
      transactional: { 
        color: 'border-info text-info bg-info/5',
        label: 'Transacional',
      },
      other: { 
        color: 'border-muted-foreground text-muted-foreground bg-muted',
        label: 'Outro',
      },
    };
    
    return configs[category];
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 50) return "text-success";
    if (rate >= 30) return "text-warning";
    return "text-destructive";
  };

  const handleCreateTemplate = () => {
    toast({
      title: "Template criado",
      description: "O template de email foi criado com sucesso",
    });
    setTemplateDialogOpen(false);
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    toast({
      title: "Template duplicado",
      description: `"${template.name}" foi duplicado`,
    });
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    toast({
      title: "Template excluído",
      description: `"${template.name}" foi removido`,
      variant: "destructive",
    });
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{templates.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Templates Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {templates.filter((t) => t.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa Média de Abertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {(
                templates.reduce((acc, t) => acc + (t.avgOpenRate || 0), 0) / templates.length
              ).toFixed(1)}
              %
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {templates.reduce((acc, t) => acc + t.usageCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Ações */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="welcome">Boas-vindas</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="nurture">Nutrição</SelectItem>
                  <SelectItem value="promotional">Promocional</SelectItem>
                  <SelectItem value="transactional">Transacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setTemplateDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Templates */}
      {filteredTemplates.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum template encontrado</p>
              <p className="text-sm mt-1">
                {searchTerm
                  ? "Tente uma busca diferente"
                  : "Crie seu primeiro template de email"}
              </p>
              <Button
                onClick={() => setTemplateDialogOpen(true)}
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTemplates.map((template) => {
            const categoryConfig = getCategoryConfig(template.category);
            
            return (
              <Card
                key={template.id}
                className="group hover:shadow-lg transition-all border-2 hover:border-primary/40"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base truncate">{template.name}</CardTitle>
                        <Badge variant="outline" className={categoryConfig.color}>
                          {categoryConfig.label}
                        </Badge>
                      </div>
                      <CardDescription className="truncate">
                        <Mail className="h-3 w-3 inline mr-1" />
                        {template.subject}
                      </CardDescription>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(template)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTemplate(template)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  {template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Usado</p>
                      <p className="text-lg font-bold">{template.usageCount}x</p>
                    </div>
                    {template.avgOpenRate !== undefined && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Abertura</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(template.avgOpenRate)}`}>
                          {template.avgOpenRate.toFixed(1)}%
                        </p>
                      </div>
                    )}
                    {template.avgClickRate !== undefined && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Cliques</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(template.avgClickRate)}`}>
                          {template.avgClickRate.toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Variables */}
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {template.variables.length} variáve{template.variables.length === 1 ? "l" : "is"}:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 4).map((variable) => (
                        <Badge
                          key={variable.name}
                          variant="outline"
                          className="text-xs font-mono border-primary/40"
                        >
                          {variable.placeholder}
                        </Badge>
                      ))}
                      {template.variables.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.variables.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          template.isActive ? "bg-success" : "bg-muted-foreground"
                        }`}
                      />
                      <span>{template.isActive ? "Ativo" : "Inativo"}</span>
                    </div>
                    {template.lastUsedAt && (
                      <span>
                        Último uso: {format(template.lastUsedAt, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                      <Send className="h-3 w-3 mr-1" />
                      Usar Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog de Novo Template */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Novo Template de Email
            </DialogTitle>
            <DialogDescription>
              Crie um template reutilizável para suas campanhas de email
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do template</Label>
                <Input placeholder="Ex: Boas-vindas para novos leads" />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Boas-vindas</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="nurture">Nutrição</SelectItem>
                    <SelectItem value="promotional">Promocional</SelectItem>
                    <SelectItem value="transactional">Transacional</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assunto do email</Label>
              <Input placeholder="Use {variavel} para campos dinâmicos" />
              <p className="text-xs text-muted-foreground">
                Ex: Olá {"{nome}"}, bem-vindo(a) à {"{empresa}"}!
              </p>
            </div>

            <div className="space-y-2">
              <Label>Pré-header (opcional)</Label>
              <Input placeholder="Texto que aparece no preview do email" />
            </div>

            <div className="space-y-2">
              <Label>Corpo do email (HTML)</Label>
              <Textarea
                placeholder="<div style='font-family: Arial; padding: 20px;'><h1>Olá {nome},</h1>...</div>"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use HTML inline styling para garantir compatibilidade com clientes de email
              </p>
            </div>

            <div className="space-y-2">
              <Label>Variáveis disponíveis</Label>
              <div className="border-2 border-primary/20 rounded-lg p-4 space-y-3 bg-primary/5">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Variáveis detectadas automaticamente:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary text-primary font-mono">
                    {"{nome}"}
                  </Badge>
                  <Badge variant="outline" className="border-primary text-primary font-mono">
                    {"{empresa}"}
                  </Badge>
                  <Badge variant="outline" className="border-primary text-primary font-mono">
                    {"{email}"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  As variáveis serão substituídas automaticamente ao enviar o email
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input placeholder="Ex: boas-vindas, primeiro-contato, onboarding" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTemplate} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Preview */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>Preview do template de email</DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              {/* Email Header */}
              <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-semibold min-w-[80px]">Assunto:</span>
                  <span className="flex-1">{selectedTemplate.subject}</span>
                </div>
                {selectedTemplate.preheader && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold min-w-[80px]">Preview:</span>
                    <span className="flex-1">{selectedTemplate.preheader}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-semibold min-w-[80px]">Categoria:</span>
                  <Badge variant="outline" className={getCategoryConfig(selectedTemplate.category).color}>
                    {getCategoryConfig(selectedTemplate.category).label}
                  </Badge>
                </div>
              </div>

              {/* Email Body Preview */}
              <div>
                <Label className="mb-2 block">Preview do Email:</Label>
                <div
                  className="border-2 rounded-lg p-6 bg-background min-h-[300px]"
                  dangerouslySetInnerHTML={{ __html: selectedTemplate.html }}
                />
              </div>

              {/* Variables */}
              <div>
                <Label className="mb-2 block flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Variáveis do Template:
                </Label>
                <div className="border-2 rounded-lg p-4 space-y-2">
                  {selectedTemplate.variables.map((variable) => (
                    <div
                      key={variable.name}
                      className="flex items-start gap-3 p-2 rounded bg-muted/50"
                    >
                      <Badge variant="outline" className="font-mono border-primary/40">
                        {variable.placeholder}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{variable.description}</p>
                        {variable.required && (
                          <Badge variant="outline" className="mt-1 text-xs border-destructive text-destructive">
                            Obrigatória
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              {selectedTemplate.avgOpenRate !== undefined && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-1">Usado</p>
                    <p className="text-2xl font-bold">{selectedTemplate.usageCount}x</p>
                  </div>
                  <div className="border-2 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-1">Taxa de Abertura</p>
                    <p className={`text-2xl font-bold ${getPerformanceColor(selectedTemplate.avgOpenRate)}`}>
                      {selectedTemplate.avgOpenRate.toFixed(1)}%
                    </p>
                  </div>
                  {selectedTemplate.avgClickRate !== undefined && (
                    <div className="border-2 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">Taxa de Cliques</p>
                      <p className={`text-2xl font-bold ${getPerformanceColor(selectedTemplate.avgClickRate)}`}>
                        {selectedTemplate.avgClickRate.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Fechar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Usar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
