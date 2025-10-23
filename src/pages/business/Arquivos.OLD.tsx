import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  FileText,
  Folder,
  Upload,
  Download,
  Trash2,
  Search,
  Eye,
  Share2,
  Clock,
  User,
  HardDrive,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
  Archive,
  Plus,
  Filter,
  Star,
  MoreVertical,
  FolderOpen,
  Grid3x3,
  List,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'document' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'code' | 'archive' | 'other';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  modifiedAt: string;
  category: string;
  tags: string[];
  shared: boolean;
  starred: boolean;
  path: string;
  parentFolder?: string;
}

export default function Arquivos() {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Cálculos de métricas
  const totalFiles = files.filter(f => f.type === 'file').length;
  const totalFolders = files.filter(f => f.type === 'folder').length;
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const sharedFiles = files.filter(f => f.shared).length;
  const starredFiles = files.filter(f => f.starred).length;

  // Categorias únicas
  const categories = Array.from(new Set(files.map(f => f.category)));

  // Filtros
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    const matchesType = filterType === 'all' || 
                       (filterType === 'file' && file.type === 'file') ||
                       (filterType === 'folder' && file.type === 'folder');
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Funções
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder className="h-5 w-5 text-warning" />;
    
    switch (file.fileType) {
      case 'document':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-success" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-destructive" />;
      case 'audio':
        return <FileAudio className="h-5 w-5 text-info" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5 text-success" />;
      case 'code':
        return <FileCode className="h-5 w-5 text-purple-500" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-muted-foreground" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleViewFile = (file: FileItem) => {
    setSelectedFile(file);
    setIsViewDialogOpen(true);
  };

  const handleDeleteFile = () => {
    if (deleteId) {
      setFiles(files.filter(f => f.id !== deleteId));
      toast({
        title: 'Arquivo excluído',
        description: 'O arquivo foi removido com sucesso.',
      });
      setDeleteId(null);
    }
  };

  const handleToggleStar = (fileId: string) => {
    setFiles(files.map(f => 
      f.id === fileId ? { ...f, starred: !f.starred } : f
    ));
  };

  const handleDownload = (file: FileItem) => {
    toast({
      title: 'Download iniciado',
      description: `Baixando ${file.name}...`,
    });
  };

  const handleUpload = () => {
    toast({
      title: 'Upload',
      description: 'Funcionalidade de upload em desenvolvimento.',
    });
  };

  const storageUsed = (totalSize / (100 * 1024 * 1024)) * 100; // Assumindo 100GB de armazenamento
  const storageUsedGB = totalSize / (1024 * 1024 * 1024);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Arquivos</h1>
          <p className="text-muted-foreground">Organize e compartilhe documentos da equipe</p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Arquivos
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalFolders} pastas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Armazenamento
            </CardTitle>
            <HardDrive className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsedGB.toFixed(2)} GB</div>
            <Progress value={storageUsed} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compartilhados
            </CardTitle>
            <Share2 className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedFiles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Acessíveis pela equipe
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Favoritos
            </CardTitle>
            <Star className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{starredFiles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Marcados com estrela
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar arquivos e pastas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="file">Apenas Arquivos</SelectItem>
                <SelectItem value="folder">Apenas Pastas</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>

          {/* Lista de Arquivos */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {files.length === 0 ? 'Nenhum arquivo ou pasta' : 'Nenhum arquivo encontrado'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {files.length === 0
                  ? 'Faça upload de seus primeiros arquivos ou crie uma pasta'
                  : 'Tente ajustar os filtros de busca'}
              </p>
              {files.length === 0 && (
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(file.id);
                        }}
                      >
                        <Star className={`h-4 w-4 ${file.starred ? 'fill-warning text-warning' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {file.shared && <Share2 className="h-3 w-3" />}
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs">{file.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="truncate">{file.uploadedBy}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewFile(file)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(file.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{file.name}</p>
                          {file.starred && <Star className="h-4 w-4 fill-warning text-warning flex-shrink-0" />}
                          {file.shared && <Share2 className="h-4 w-4 text-info flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{file.category}</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {file.uploadedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(file.modifiedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFile(file)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(file)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStar(file.id)}
                          title="Favoritar"
                        >
                          <Star className={`h-4 w-4 ${file.starred ? 'fill-warning text-warning' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(file.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Arquivo</DialogTitle>
            <DialogDescription>
              Informações completas do arquivo
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedFile)}
                <div>
                  <h3 className="font-semibold text-lg">{selectedFile.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedFile.path}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <p className="text-sm">{selectedFile.type === 'folder' ? 'Pasta' : 'Arquivo'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tamanho</p>
                  <p className="text-sm">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                  <p className="text-sm">{selectedFile.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compartilhado</p>
                  <p className="text-sm">{selectedFile.shared ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enviado por</p>
                  <p className="text-sm">{selectedFile.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de upload</p>
                  <p className="text-sm">{new Date(selectedFile.uploadedAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Última modificação</p>
                  <p className="text-sm">{new Date(selectedFile.modifiedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {selectedFile.tags && selectedFile.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            {selectedFile && (
              <>
                <Button variant="secondary" onClick={() => handleDownload(selectedFile)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => handleToggleStar(selectedFile.id)}>
                  <Star className={`h-4 w-4 mr-2 ${selectedFile.starred ? 'fill-current' : ''}`} />
                  {selectedFile.starred ? 'Remover Favorito' : 'Adicionar Favorito'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
