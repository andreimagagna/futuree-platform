import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  Star,
  Layout,
  FileText,
  CheckSquare,
  Table,
  ListTodo,
  Calendar,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  AlertCircle,
  Info,
  Lightbulb,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Users,
  Palette,
  Sparkles,
  Layers,
  Maximize2,
  Minimize2,
  Target,
  BookOpen,
  Database,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BlockType =
  | 'text'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'list'
  | 'checklist'
  | 'quote'
  | 'code'
  | 'divider'
  | 'callout'
  | 'table'
  | 'kanban'
  | 'calendar';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    checked?: boolean;
    language?: string;
    icon?: string;
    color?: string;
    items?: string[];
    columns?: { name: string; items: string[] }[];
  };
  order: number;
}

interface Page {
  id: string;
  title: string;
  icon: string;
  cover?: string;
  description: string;
  blocks: Block[];
  tags: string[];
  favorite: boolean;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  template?: boolean;
}

interface Workspace {
  id: string;
  name: string;
  color: string;
  pages: Page[];
}

export default function NotionSolutions() {
  const { toast } = useToast();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'Meu Workspace',
      color: 'bg-primary',
      pages: [],
    },
  ]);

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState('1');
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newPage, setNewPage] = useState<Partial<Page>>({
    title: '',
    icon: '📄',
    description: '',
    tags: [],
    favorite: false,
    private: false,
    blocks: [],
  });

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  // Templates de páginas
  const pageTemplates = [
    {
      name: 'Página em Branco',
      icon: 'FileText',
      description: 'Comece do zero',
      blocks: [],
    },
    {
      name: 'Projeto',
      icon: 'Target',
      description: 'Gerencie projetos',
      blocks: [
        { type: 'heading1', content: 'Visão Geral do Projeto' },
        { type: 'text', content: 'Descreva os objetivos e metas do projeto...' },
        { type: 'heading2', content: 'Tarefas' },
        { type: 'checklist', content: 'Tarefa 1', metadata: { checked: false } },
        { type: 'checklist', content: 'Tarefa 2', metadata: { checked: false } },
        { type: 'heading2', content: 'Timeline' },
        { type: 'text', content: 'Adicione marcos importantes...' },
      ],
    },
    {
      name: 'Reunião',
      icon: 'Users',
      description: 'Notas de reunião',
      blocks: [
        { type: 'heading1', content: 'Reunião - [Data]' },
        { type: 'text', content: 'Participantes:' },
        { type: 'heading2', content: 'Agenda' },
        { type: 'list', content: 'Tópico 1' },
        { type: 'list', content: 'Tópico 2' },
        { type: 'heading2', content: 'Notas' },
        { type: 'text', content: 'Discussões e decisões...' },
        { type: 'heading2', content: 'Próximos Passos' },
        { type: 'checklist', content: 'Ação 1', metadata: { checked: false } },
      ],
    },
    {
      name: 'Documentação',
      icon: 'BookOpen',
      description: 'Documente processos',
      blocks: [
        { type: 'heading1', content: 'Documentação' },
        { type: 'callout', content: 'Informação importante sobre este documento', metadata: { icon: '💡', color: 'info' } },
        { type: 'heading2', content: 'Introdução' },
        { type: 'text', content: 'Contexto e overview...' },
        { type: 'heading2', content: 'Como Usar' },
        { type: 'list', content: 'Passo 1' },
        { type: 'list', content: 'Passo 2' },
        { type: 'heading2', content: 'Exemplos' },
        { type: 'code', content: 'exemplo de código', metadata: { language: 'javascript' } },
      ],
    },
    {
      name: 'Base de Conhecimento',
      icon: 'Database',
      description: 'Organize informações',
      blocks: [
        { type: 'heading1', content: 'Base de Conhecimento' },
        { type: 'text', content: 'Centralize todo conhecimento da equipe...' },
        { type: 'divider', content: '' },
        { type: 'heading2', content: 'Categorias' },
        { type: 'text', content: 'Organize por temas e tópicos' },
      ],
    },
  ];

  // Ícones de blocos
  const blockIcons = {
    text: FileText,
    heading1: Heading1,
    heading2: Heading2,
    heading3: Heading3,
    list: List,
    checklist: CheckSquare,
    quote: Quote,
    code: Code,
    divider: Minus,
    callout: AlertCircle,
    table: Table,
    kanban: Layout,
    calendar: Calendar,
  };

  const filteredPages = currentWorkspace?.pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const favoritePages = filteredPages.filter(p => p.favorite);
  const recentPages = [...filteredPages].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  // Funções de gerenciamento de páginas
  const handleCreatePage = (template?: typeof pageTemplates[0]) => {
    const blocks = template?.blocks.map((block, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      type: block.type as BlockType,
      content: block.content,
      metadata: block.metadata || {},
      order: index,
    })) || [];

    const page: Page = {
      id: Math.random().toString(36).substr(2, 9),
      title: newPage.title || template?.name || 'Nova Página',
      icon: newPage.icon || template?.icon || '📄',
      description: newPage.description || template?.description || '',
      blocks,
      tags: newPage.tags || [],
      favorite: newPage.favorite || false,
      private: newPage.private || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template: false,
    };

    setWorkspaces(workspaces.map(w =>
      w.id === currentWorkspaceId
        ? { ...w, pages: [...w.pages, page] }
        : w
    ));

    setCurrentPage(page);
    setIsPageDialogOpen(false);
    setNewPage({
      title: '',
      icon: '📄',
      description: '',
      tags: [],
      favorite: false,
      private: false,
      blocks: [],
    });

    toast({
      title: 'Página criada',
      description: `"${page.title}" foi criada com sucesso.`,
    });
  };

  const handleUpdatePage = (updatedPage: Page) => {
    setWorkspaces(workspaces.map(w =>
      w.id === currentWorkspaceId
        ? {
            ...w,
            pages: w.pages.map(p =>
              p.id === updatedPage.id
                ? { ...updatedPage, updatedAt: new Date().toISOString() }
                : p
            ),
          }
        : w
    ));
    setCurrentPage(updatedPage);
  };

  const handleDeletePage = () => {
    if (deleteId) {
      setWorkspaces(workspaces.map(w =>
        w.id === currentWorkspaceId
          ? { ...w, pages: w.pages.filter(p => p.id !== deleteId) }
          : w
      ));

      if (currentPage?.id === deleteId) {
        setCurrentPage(null);
      }

      toast({
        title: 'Página excluída',
        description: 'A página foi removida com sucesso.',
      });
      setDeleteId(null);
    }
  };

  const handleToggleFavorite = (pageId: string) => {
    setWorkspaces(workspaces.map(w =>
      w.id === currentWorkspaceId
        ? {
            ...w,
            pages: w.pages.map(p =>
              p.id === pageId ? { ...p, favorite: !p.favorite } : p
            ),
          }
        : w
    ));
  };

  const handleDuplicatePage = (page: Page) => {
    const duplicated: Page = {
      ...page,
      id: Math.random().toString(36).substr(2, 9),
      title: `${page.title} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkspaces(workspaces.map(w =>
      w.id === currentWorkspaceId
        ? { ...w, pages: [...w.pages, duplicated] }
        : w
    ));

    toast({
      title: 'Página duplicada',
      description: `"${duplicated.title}" foi criada.`,
    });
  };

  // Funções de gerenciamento de blocos
  const handleAddBlock = (type: BlockType) => {
    if (!currentPage) return;

    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      order: currentPage.blocks.length,
      metadata: type === 'checklist' ? { checked: false } : {},
    };

    const updatedPage = {
      ...currentPage,
      blocks: [...currentPage.blocks, newBlock],
    };

    handleUpdatePage(updatedPage);
    setIsBlockMenuOpen(false);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      blocks: currentPage.blocks.map(b =>
        b.id === blockId ? { ...b, ...updates } : b
      ),
    };

    handleUpdatePage(updatedPage);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      blocks: currentPage.blocks.filter(b => b.id !== blockId),
    };

    handleUpdatePage(updatedPage);
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!currentPage) return;

    const index = currentPage.blocks.findIndex(b => b.id === blockId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentPage.blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...currentPage.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    const updatedPage = {
      ...currentPage,
      blocks: newBlocks.map((block, i) => ({ ...block, order: i })),
    };

    handleUpdatePage(updatedPage);
  };

  const renderBlock = (block: Block) => {
    const commonClasses = "group relative hover:bg-muted/30 rounded-md transition-colors";

    switch (block.type) {
      case 'heading1':
        return (
          <div className={commonClasses}>
            <Input
              value={block.content}
              onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
              className="text-3xl font-bold border-0 bg-transparent px-2"
              placeholder="Título 1"
            />
            <BlockControls block={block} />
          </div>
        );

      case 'heading2':
        return (
          <div className={commonClasses}>
            <Input
              value={block.content}
              onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
              className="text-2xl font-semibold border-0 bg-transparent px-2"
              placeholder="Título 2"
            />
            <BlockControls block={block} />
          </div>
        );

      case 'heading3':
        return (
          <div className={commonClasses}>
            <Input
              value={block.content}
              onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
              className="text-xl font-medium border-0 bg-transparent px-2"
              placeholder="Título 3"
            />
            <BlockControls block={block} />
          </div>
        );

      case 'text':
        return (
          <div className={commonClasses}>
            <Textarea
              value={block.content}
              onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
              className="border-0 bg-transparent px-2 min-h-[60px] resize-none"
              placeholder="Digite algo..."
            />
            <BlockControls block={block} />
          </div>
        );

      case 'list':
        return (
          <div className={commonClasses}>
            <div className="flex items-start gap-2 px-2">
              <span className="mt-2">•</span>
              <Input
                value={block.content}
                onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                className="border-0 bg-transparent flex-1"
                placeholder="Item da lista"
              />
            </div>
            <BlockControls block={block} />
          </div>
        );

      case 'checklist':
        return (
          <div className={commonClasses}>
            <div className="flex items-center gap-2 px-2">
              <input
                type="checkbox"
                checked={block.metadata?.checked || false}
                onChange={(e) =>
                  handleUpdateBlock(block.id, {
                    metadata: { ...block.metadata, checked: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded"
              />
              <Input
                value={block.content}
                onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                className={`border-0 bg-transparent flex-1 ${
                  block.metadata?.checked ? 'line-through text-muted-foreground' : ''
                }`}
                placeholder="Tarefa"
              />
            </div>
            <BlockControls block={block} />
          </div>
        );

      case 'quote':
        return (
          <div className={commonClasses}>
            <div className="border-l-4 border-primary pl-4 py-2">
              <Textarea
                value={block.content}
                onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                className="border-0 bg-transparent italic text-muted-foreground resize-none"
                placeholder="Citação..."
              />
            </div>
            <BlockControls block={block} />
          </div>
        );

      case 'code':
        return (
          <div className={commonClasses}>
            <div className="bg-muted rounded-md p-4">
              <Textarea
                value={block.content}
                onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                className="border-0 bg-transparent font-mono text-sm resize-none"
                placeholder="código..."
              />
            </div>
            <BlockControls block={block} />
          </div>
        );

      case 'callout':
        return (
          <div className={commonClasses}>
            <div className={`rounded-md p-4 ${
              block.metadata?.color === 'info' ? 'bg-info/10 border-l-4 border-info' :
              block.metadata?.color === 'warning' ? 'bg-warning/10 border-l-4 border-warning' :
              block.metadata?.color === 'success' ? 'bg-success/10 border-l-4 border-success' :
              'bg-muted border-l-4 border-primary'
            }`}>
              <div className="flex gap-3">
                <span className="text-2xl">{block.metadata?.icon || '💡'}</span>
                <Textarea
                  value={block.content}
                  onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                  className="border-0 bg-transparent flex-1 resize-none"
                  placeholder="Destaque importante..."
                />
              </div>
            </div>
            <BlockControls block={block} />
          </div>
        );

      case 'divider':
        return (
          <div className={commonClasses}>
            <hr className="my-4 border-border" />
            <BlockControls block={block} />
          </div>
        );

      default:
        return null;
    }
  };

  const BlockControls = ({ block }: { block: Block }) => (
    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => handleMoveBlock(block.id, 'up')}
      >
        <GripVertical className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => handleDeleteBlock(block.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {!currentPage ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notion Solutions</h1>
            </div>
            <Button onClick={() => setIsPageDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Página
            </Button>
          </div>

          {/* Busca */}
          <Card>
            <CardContent className="pt-6">
              <Input
                placeholder="Buscar páginas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>

          {/* Favoritos */}
          {favoritePages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 fill-warning text-warning" />
                Favoritos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritePages.map(page => (
                  <PageCard key={page.id} page={page} />
                ))}
              </div>
            </div>
          )}

          {/* Recentes */}
          {recentPages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPages.map(page => (
                  <PageCard key={page.id} page={page} />
                ))}
              </div>
            </div>
          )}

          {/* Todas as páginas */}
          {filteredPages.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma página criada
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie sua primeira página personalizada
                </p>
                <Button onClick={() => setIsPageDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Página
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Editor de Página */
        <div className={isFullscreen ? 'fixed inset-0 z-50 bg-background overflow-auto p-6' : ''}>
          {/* Cabeçalho da Página */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(null)}
              >
                ← Voltar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFavorite(currentPage.id)}
                >
                  <Star className={`h-4 w-4 ${currentPage.favorite ? 'fill-warning text-warning' : ''}`} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDuplicatePage(currentPage)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUpdatePage({ ...currentPage, private: !currentPage.private })}
                    >
                      {currentPage.private ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                      {currentPage.private ? 'Tornar Público' : 'Tornar Privado'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteId(currentPage.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Ícone e Título */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-4">
                <Input
                  value={currentPage.icon}
                  onChange={(e) => handleUpdatePage({ ...currentPage, icon: e.target.value })}
                  className="w-16 h-16 text-4xl text-center border-0 bg-muted"
                  maxLength={2}
                />
                <div className="flex-1">
                  <Input
                    value={currentPage.title}
                    onChange={(e) => handleUpdatePage({ ...currentPage, title: e.target.value })}
                    className="text-4xl font-bold border-0 bg-transparent mb-2"
                    placeholder="Título da Página"
                  />
                  <Input
                    value={currentPage.description}
                    onChange={(e) => handleUpdatePage({ ...currentPage, description: e.target.value })}
                    className="text-muted-foreground border-0 bg-transparent"
                    placeholder="Adicione uma descrição..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentPage.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {currentPage.private && (
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Privado
                  </Badge>
                )}
              </div>

              {/* Blocos */}
              <div className="space-y-2">
                {currentPage.blocks.map(block => (
                  <div key={block.id}>{renderBlock(block)}</div>
                ))}

                {/* Botão Adicionar Bloco */}
                <DropdownMenu open={isBlockMenuOpen} onOpenChange={setIsBlockMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar bloco
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuItem onClick={() => handleAddBlock('text')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Texto
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddBlock('heading1')}>
                      <Heading1 className="h-4 w-4 mr-2" />
                      Título 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddBlock('heading2')}>
                      <Heading2 className="h-4 w-4 mr-2" />
                      Título 2
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddBlock('heading3')}>
                      <Heading3 className="h-4 w-4 mr-2" />
                      Título 3
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAddBlock('list')}>
                      <List className="h-4 w-4 mr-2" />
                      Lista
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddBlock('checklist')}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Lista de Tarefas
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAddBlock('quote')}>
                      <Quote className="h-4 w-4 mr-2" />
                      Citação
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddBlock('code')}>
                      <Code className="h-4 w-4 mr-2" />
                      Código
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddBlock('callout')}>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Destaque
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddBlock('divider')}>
                      <div className="h-px w-4 bg-border mr-2" />
                      Divisor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Criar Página */}
      <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Página</DialogTitle>
            <DialogDescription>
              Escolha um template ou comece do zero
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Templates */}
            <div>
              <h3 className="font-semibold mb-3">Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pageTemplates.map((template, index) => {
                  const IconComponent = template.icon === 'FileText' ? FileText :
                                       template.icon === 'Target' ? Target :
                                       template.icon === 'Users' ? Users :
                                       template.icon === 'BookOpen' ? BookOpen :
                                       template.icon === 'Database' ? Database : FileText;
                  
                  return (
                    <Card
                      key={index}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleCreatePage(template)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {template.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Personalizado */}
            <div>
              <h3 className="font-semibold mb-3">Página Personalizada</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    value={newPage.icon}
                    onChange={(e) => setNewPage({ ...newPage, icon: e.target.value })}
                    className="w-16 text-2xl text-center"
                    placeholder="📄"
                    maxLength={2}
                  />
                  <Input
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                    placeholder="Título da página"
                    className="flex-1"
                  />
                </div>
                <Textarea
                  value={newPage.description}
                  onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                  placeholder="Descrição (opcional)"
                  className="resize-none"
                />
                <Button onClick={() => handleCreatePage()} className="w-full">
                  Criar Página em Branco
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePage}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  function PageCard({ page }: { page: Page }) {
    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow group"
        onClick={() => setCurrentPage(page)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{page.icon}</span>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base truncate">{page.title}</CardTitle>
                <CardDescription className="text-xs truncate">
                  {page.description || 'Sem descrição'}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(page.id);
                }}
              >
                <Star className={`h-3 w-3 ${page.favorite ? 'fill-warning text-warning' : ''}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDuplicatePage(page)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeleteId(page.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{page.blocks.length} blocos</span>
            <span>{new Date(page.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
          {page.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {page.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {page.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{page.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}

// Componente Minus faltando
function Minus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
