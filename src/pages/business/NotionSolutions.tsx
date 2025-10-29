/**
 * ============================================================================
 * NOTION SOLUTIONS - Versão Simples com Auto-Save
 * ============================================================================
 * Editor de páginas estilo Notion com salvamento automático
 * ============================================================================
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText,
  Plus,
  Loader2,
  Trash2,
  Star,
  Check,
  Clock,
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link,
  Sparkles,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { assistTextWithAI } from "@/services/textAssistantAI";

// ============================================================================
// TYPES
// ============================================================================

interface NotionPage {
  id: string;
  title: string;
  content: string | null;
  is_favorite: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const NotionSolutions = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [selectedPage, setSelectedPage] = useState<NotionPage | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isMarkdownMode, setIsMarkdownMode] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);

  // Debounce para auto-save (1.5 segundos)
  const debouncedTitle = useDebounce(title, 1500);
  const debouncedContent = useDebounce(content, 1500);

  // ============================================================================
  // QUERIES
  // ============================================================================

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['notion_pages', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notion_pages')
        .select('*')
        .eq('owner_id', user?.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as NotionPage[];
    },
    enabled: !!user?.id,
  });

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('notion_pages')
        .insert({
          title: "Sem título",
          content: "",
          is_favorite: false,
          owner_id: user?.id,
        } as any)
        .select()
        .single();
      
      if (error) throw error;
      return data as NotionPage;
    },
    onSuccess: (newPage) => {
      if (!newPage) return;
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
      setSelectedPage(newPage);
      setTitle(newPage.title);
      setContent(newPage.content || "");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('notion_pages')
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
      setIsSaving(false);
      setLastSaved(new Date());
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notion_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
      setSelectedPage(null);
      setTitle("");
      setContent("");
      toast({ title: "Página deletada com sucesso" });
    },
  });

  // ============================================================================
  // AUTO-SAVE EFFECT
  // ============================================================================

  useEffect(() => {
    if (!selectedPage) return;
    if (title === selectedPage.title && content === (selectedPage.content || "")) return;

    setIsSaving(true);
    updateMutation.mutate({
      id: selectedPage.id,
      updates: { title, content },
    });
  }, [debouncedTitle, debouncedContent]);

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPage) return;

      // Ctrl/Cmd + B = Negrito
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        formatBold();
      }

      // Ctrl/Cmd + I = Itálico
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        formatItalic();
      }

      // Ctrl/Cmd + K = Link
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        formatLink();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPage, content]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSelectPage = (page: NotionPage) => {
    setSelectedPage(page);
    setTitle(page.title);
    setContent(page.content || "");
  };

  const handleNewPage = () => {
    createMutation.mutate();
  };

  const handleDelete = () => {
    if (!selectedPage) return;
    if (confirm("Deletar esta página?")) {
      deleteMutation.mutate(selectedPage.id);
    }
  };

  const handleToggleFavorite = () => {
    if (!selectedPage) return;
    updateMutation.mutate({
      id: selectedPage.id,
      updates: { is_favorite: !selectedPage.is_favorite },
    });
    setSelectedPage({ ...selectedPage, is_favorite: !selectedPage.is_favorite });
  };

  const handleBack = () => {
    setSelectedPage(null);
    setTitle("");
    setContent("");
    setShowAIAssistant(false);
    setAiPrompt("");
    setAiResponse("");
  };

  // ============================================================================
  // AI ASSISTANT
  // ============================================================================

  const handleAIRequest = async () => {
    if (!aiPrompt.trim()) return;

    setIsAILoading(true);
    setAiResponse("");

    try {
      const response = await assistTextWithAI(aiPrompt, title, content);
      setAiResponse(response);
      
      toast({
        title: "✨ IA respondeu!",
        description: "Confira a sugestão abaixo",
      });
    } catch (error) {
      console.error("Erro ao consultar IA:", error);
      toast({
        title: "Erro ao consultar IA",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleInsertAIResponse = () => {
    if (!aiResponse) return;
    
    setContent(prev => {
      if (!prev) return aiResponse;
      return `${prev}\n\n${aiResponse}`;
    });
    
    setAiResponse("");
    setAiPrompt("");
    
    toast({
      title: "✅ Texto inserido!",
      description: "A sugestão da IA foi adicionada ao documento",
    });
  };

  // ============================================================================
  // FORMATAÇÃO DE TEXTO
  // ============================================================================

  const insertFormatting = (before: string, after: string = before, placeholder: string = "texto") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    setContent(newContent);
    
    // Manter foco e reposicionar cursor
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const formatBold = () => insertFormatting("**", "**", "negrito");
  const formatItalic = () => insertFormatting("*", "*", "itálico");
  const formatH1 = () => insertFormatting("# ", "", "Título 1");
  const formatH2 = () => insertFormatting("## ", "", "Título 2");
  const formatH3 = () => insertFormatting("### ", "", "Título 3");
  const formatList = () => insertFormatting("- ", "", "item");
  const formatOrderedList = () => insertFormatting("1. ", "", "item");
  const formatQuote = () => insertFormatting("> ", "", "citação");
  const formatCode = () => insertFormatting("`", "`", "código");
  const formatLink = () => insertFormatting("[", "](url)", "texto do link");

  // ============================================================================
  // RENDERIZAR CONTEÚDO COM FORMATAÇÃO
  // ============================================================================

  const renderFormattedContent = (text: string) => {
    if (!text) return "";

    let html = text;

    // Títulos (H1, H2, H3)
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mt-8 mb-4">$1</h1>');

    // Negrito
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');

    // Itálico
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // Listas não ordenadas
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/(<li class="ml-6 list-disc">.+<\/li>\n?)+/g, '<ul class="my-3">$&</ul>');

    // Listas ordenadas
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>');
    html = html.replace(/(<li class="ml-6 list-decimal">.+<\/li>\n?)+/g, '<ol class="my-3">$&</ol>');

    // Citações
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground">$1</blockquote>');

    // Código inline
    html = html.replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Quebras de linha
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // VIEW: Editor de Página
  if (selectedPage) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Topbar */}
        <div className="border-b bg-card px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {isSaving ? (
                <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
              ) : lastSaved ? (
                <Check className="h-4 w-4 text-success" />
              ) : null}
              <span className="text-sm text-muted-foreground">
                {isSaving ? "Salvando..." : lastSaved ? "Salvo" : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isMarkdownMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMarkdownMode(true)}
            >
              Markdown
            </Button>
            <Button
              variant={!isMarkdownMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMarkdownMode(false)}
            >
              Texto Puro
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant={showAIAssistant ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {showAIAssistant ? "Fechar IA" : "Assistente IA"}
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  selectedPage.is_favorite && "fill-warning text-warning"
                )}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Toolbar de Formatação - Sempre visível */}
        <div className="border-b bg-card px-6 py-2 flex items-center gap-1 overflow-x-auto">
          <Button variant="ghost" size="sm" onClick={formatBold} title="Negrito (Ctrl+B)">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={formatItalic} title="Itálico (Ctrl+I)">
            <Italic className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={formatH1} title="Título 1">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={formatH2} title="Título 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={formatH3} title="Título 3">
            <Heading3 className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={formatList} title="Lista">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={formatOrderedList} title="Lista Numerada">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={formatQuote} title="Citação">
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={formatCode} title="Código">
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={formatLink} title="Link">
            <Link className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto flex">
          {/* Conteúdo Principal */}
          <div className={cn("flex-1 overflow-auto", showAIAssistant && "border-r")}>
            <div className="max-w-5xl mx-auto px-16 py-12">
              {/* Título */}
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sem título"
                className="text-5xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-6 placeholder:text-muted-foreground/40"
              />

              {/* Conteúdo com formatação condicional */}
              {isMarkdownMode ? (
                <div 
                  className="min-h-[600px] text-lg prose prose-lg max-w-none cursor-text"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setContent(e.currentTarget.textContent || "")}
                  dangerouslySetInnerHTML={{ __html: renderFormattedContent(content) }}
                />
              ) : (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Cole seu texto aqui..."
                  className="min-h-[600px] text-lg border-none shadow-none focus-visible:ring-0 px-0 resize-none placeholder:text-muted-foreground/40"
                />
              )}
            </div>
          </div>

          {/* Assistente IA - Sidebar */}
          {showAIAssistant && (
            <div className="w-[400px] bg-muted/30 overflow-auto">
              <div className="p-6 space-y-4 sticky top-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Assistente IA</h3>
                      <p className="text-xs text-muted-foreground">
                        Auxílio inteligente para seus textos
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAIAssistant(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Card className="border-2">
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        O que você precisa?
                      </label>
                      <Textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ex: Melhore este texto, torne mais profissional, corrija gramática, resuma em tópicos..."
                        rows={4}
                        className="resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            handleAIRequest();
                          }
                        }}
                      />
                    </div>

                    <Button
                      onClick={handleAIRequest}
                      disabled={!aiPrompt.trim() || isAILoading}
                      className="w-full gap-2"
                    >
                      {isAILoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Enviar para IA
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Ctrl/Cmd + Enter para enviar
                    </p>
                  </CardContent>
                </Card>

                {/* Resposta da IA */}
                {aiResponse && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Sugestão da IA
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiResponse("")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Overview da resposta */}
                      <div className="bg-card/50 rounded-lg p-3 border">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Overview
                            </p>
                            <p className="text-sm">
                              {aiResponse.length > 150 
                                ? `${aiResponse.substring(0, 150).split('\n')[0]}...` 
                                : aiResponse.split('\n')[0]}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{aiResponse.split('\n').length} linhas</span>
                              <span>•</span>
                              <span>{aiResponse.split(' ').length} palavras</span>
                              <span>•</span>
                              <span>{aiResponse.length} caracteres</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Conteúdo completo com formatação */}
                      <div 
                        className="bg-card rounded-lg p-4 text-sm max-h-[400px] overflow-auto prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: renderFormattedContent(aiResponse) 
                        }}
                      />

                      <div className="flex gap-2">
                        <Button
                          onClick={handleInsertAIResponse}
                          className="flex-1 gap-2"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                          Inserir no Documento
                        </Button>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(aiResponse);
                            toast({
                              title: "📋 Copiado!",
                              description: "Texto copiado para área de transferência",
                            });
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Copiar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sugestões rápidas */}
                {!aiResponse && !isAILoading && (
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <label className="text-sm font-medium">Sugestões rápidas:</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Melhore este texto",
                          "Torne mais profissional",
                          "Corrija gramática",
                          "Resuma em tópicos",
                          "Expanda as ideias",
                          "Simplifique a linguagem",
                        ].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => setAiPrompt(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // VIEW: Lista de Páginas
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notion Solutions</h1>
          <p className="text-muted-foreground mt-1">Suas páginas e documentos</p>
        </div>
        <Button onClick={handleNewPage}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Página
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma página ainda</h3>
          <p className="text-muted-foreground mb-6">
            Crie sua primeira página para começar a organizar suas ideias
          </p>
          <Button onClick={handleNewPage}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Página
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
              onClick={() => handleSelectPage(page)}
            >
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-5 h-5 text-primary" />
                {page.is_favorite && (
                  <Star className="w-4 h-4 fill-warning text-warning" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {page.title || "Sem título"}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {page.content || "Vazio"}
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Atualizado {new Date(page.updated_at).toLocaleDateString('pt-BR')}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotionSolutions;
