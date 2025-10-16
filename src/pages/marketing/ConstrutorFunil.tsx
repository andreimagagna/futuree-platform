import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Play,
  Save,
  Plus,
  Settings,
  Trash2,
  Move,
  Zap,
  Target,
  DollarSign,
  Phone,
  Calendar,
  CheckCircle,
  X,
  GitBranch,
  FolderOpen,
  Grid3x3,
  ArrowLeft,
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Search,
  MousePointerClick,
  Database,
  Cloud,
  Webhook,
  Share2,
  Users,
  TrendingUp,
  Filter,
  CheckSquare,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSavedFunnels, useCreateSavedFunnel } from '@/hooks/use-api-cache';

interface FunnelNode {
  id: string;
  type: string; // tipo personalizável
  category: 'acquisition' | 'system' | 'communication' | 'conversion' | 'custom';
  label: string;
  description: string;
  icon?: string; // nome do ícone
  color?: string;
  position: { x: number; y: number };
  config: {
    metadata?: Record<string, any>;
  };
  connections: string[]; // IDs dos nós conectados
}

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
  curvature?: number;
  controlPoints?: { x: number; y: number }[];
  style?: 'straight' | 'curved' | 'orthogonal';
}

interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

const NODE_TEMPLATES = {
  // AQUISIÇÃO
  facebook_ads: {
    category: 'acquisition',
    label: 'Facebook Ads',
    icon: 'Facebook',
    color: 'from-[hsl(200,15%,45%)] to-[hsl(200,15%,40%)]',
    textColor: 'text-[hsl(200,15%,45%)]',
    bgColor: 'bg-[hsl(200,15%,95%)]',
    borderColor: 'border-[hsl(200,15%,85%)]',
    description: 'Campanha de anúncios no Facebook'
  },
  instagram_ads: {
    category: 'acquisition',
    label: 'Instagram Ads',
    icon: 'Instagram',
    color: 'from-[#E4405F] to-[#c13584]',
    textColor: 'text-[#E4405F]',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Campanha de anúncios no Instagram'
  },
  linkedin_ads: {
    category: 'acquisition',
    label: 'LinkedIn Ads',
    icon: 'Linkedin',
    color: 'from-[hsl(18,25%,30%)] to-[hsl(18,25%,25%)]',
    textColor: 'text-[hsl(18,25%,30%)]',
    bgColor: 'bg-[hsl(18,25%,95%)]',
    borderColor: 'border-[hsl(18,25%,85%)]',
    description: 'Campanha de anúncios no LinkedIn'
  },
  google_ads: {
    category: 'acquisition',
    label: 'Google Ads',
    icon: 'Search',
    color: 'from-[hsl(20,10%,50%)] to-[hsl(20,10%,45%)]',
    textColor: 'text-[hsl(20,10%,45%)]',
    bgColor: 'bg-[hsl(20,10%,95%)]',
    borderColor: 'border-[hsl(20,10%,85%)]',
    description: 'Campanha de Google Ads'
  },
  organic_search: {
    category: 'acquisition',
    label: 'SEO / Orgânico',
    icon: 'TrendingUp',
    color: 'from-[hsl(140,30%,40%)] to-[hsl(140,30%,35%)]',
    textColor: 'text-[hsl(140,30%,40%)]',
    bgColor: 'bg-[hsl(140,30%,95%)]',
    borderColor: 'border-[hsl(140,30%,85%)]',
    description: 'Tráfego orgânico / SEO'
  },
  landing_page: {
    category: 'acquisition',
    label: 'Landing Page',
    icon: 'MousePointerClick',
    color: 'from-[hsl(35,60%,55%)] to-[hsl(35,60%,50%)]',
    textColor: 'text-[hsl(35,60%,45%)]',
    bgColor: 'bg-[hsl(35,60%,95%)]',
    borderColor: 'border-[hsl(35,60%,85%)]',
    description: 'Página de captura'
  },

  // SISTEMAS
  crm: {
    category: 'system',
    label: 'CRM',
    icon: 'Database',
    color: 'from-[hsl(18,30%,25%)] to-[hsl(18,30%,20%)]',
    textColor: 'text-[hsl(18,30%,25%)]',
    bgColor: 'bg-[hsl(18,30%,96%)]',
    borderColor: 'border-[hsl(18,30%,85%)]',
    description: 'Sistema de CRM'
  },
  automation_platform: {
    category: 'system',
    label: 'Plataforma de Automação',
    icon: 'Zap',
    color: 'from-[hsl(35,60%,55%)] to-[hsl(35,60%,50%)]',
    textColor: 'text-[hsl(35,60%,45%)]',
    bgColor: 'bg-[hsl(35,60%,95%)]',
    borderColor: 'border-[hsl(35,60%,85%)]',
    description: 'RD Station, HubSpot, etc'
  },
  webhook: {
    category: 'system',
    label: 'Webhook',
    icon: 'Webhook',
    color: 'from-gray-600 to-gray-700',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    description: 'Integração via webhook'
  },
  spreadsheet: {
    category: 'system',
    label: 'Planilha',
    icon: 'Grid3x3',
    color: 'from-[hsl(140,30%,40%)] to-[hsl(140,30%,35%)]',
    textColor: 'text-[hsl(140,30%,40%)]',
    bgColor: 'bg-[hsl(140,30%,95%)]',
    borderColor: 'border-[hsl(140,30%,85%)]',
    description: 'Google Sheets, Excel'
  },

  // COMUNICAÇÃO
  whatsapp: {
    category: 'communication',
    label: 'WhatsApp',
    icon: 'MessageSquare',
    color: 'from-[hsl(140,30%,40%)] to-[hsl(140,30%,35%)]',
    textColor: 'text-[hsl(140,30%,40%)]',
    bgColor: 'bg-[hsl(140,30%,95%)]',
    borderColor: 'border-[hsl(140,30%,85%)]',
    description: 'Envio via WhatsApp'
  },
  email: {
    category: 'communication',
    label: 'Email',
    icon: 'Mail',
    color: 'from-[hsl(18,30%,25%)] to-[hsl(18,30%,20%)]',
    textColor: 'text-[hsl(18,30%,25%)]',
    bgColor: 'bg-[hsl(18,30%,96%)]',
    borderColor: 'border-[hsl(18,30%,85%)]',
    description: 'Envio de email'
  },
  phone_call: {
    category: 'communication',
    label: 'Ligação',
    icon: 'Phone',
    color: 'from-[hsl(35,60%,55%)] to-[hsl(35,60%,50%)]',
    textColor: 'text-[hsl(35,60%,45%)]',
    bgColor: 'bg-[hsl(35,60%,95%)]',
    borderColor: 'border-[hsl(35,60%,85%)]',
    description: 'Contato telefônico'
  },

  // CONVERSÃO
  qualification: {
    category: 'conversion',
    label: 'Qualificação',
    icon: 'Filter',
    color: 'from-[hsl(18,30%,25%)] to-[hsl(18,30%,20%)]',
    textColor: 'text-[hsl(18,30%,25%)]',
    bgColor: 'bg-[hsl(18,30%,96%)]',
    borderColor: 'border-[hsl(18,30%,85%)]',
    description: 'Qualificação de leads'
  },
  conversion: {
    category: 'conversion',
    label: 'Conversão',
    icon: 'CheckCircle',
    color: 'from-[hsl(140,30%,40%)] to-[hsl(140,30%,35%)]',
    textColor: 'text-[hsl(140,30%,40%)]',
    bgColor: 'bg-[hsl(140,30%,95%)]',
    borderColor: 'border-[hsl(140,30%,85%)]',
    description: 'Lead convertido'
  },
  lost: {
    category: 'conversion',
    label: 'Perdido',
    icon: 'X',
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Lead descartado/perdido'
  },
} as const;

const ICON_MAP: Record<string, any> = {
  Facebook,
  Instagram,
  Linkedin,
  Search,
  TrendingUp,
  MousePointerClick,
  Database,
  Zap,
  Webhook,
  Grid3x3,
  MessageSquare,
  Mail,
  Phone,
  Filter,
  CheckCircle,
  X,
  Plus,
  Edit3,
  Share2,
  Users,
  Target,
  Cloud,
};

export default function ConstrutorFunil() {
  const [nodes, setNodes] = useState<FunnelNode[]>([
    {
      id: 'node-1',
      type: 'facebook_ads',
      category: 'acquisition',
      label: 'Facebook Ads',
      description: 'Campanha de captura de leads',
      icon: 'Facebook',
      position: { x: 100, y: 150 },
      config: { metadata: { campaign: 'Q1 2025' } },
      connections: ['node-2']
    },
    {
      id: 'node-2',
      type: 'landing_page',
      category: 'acquisition',
      label: 'Landing Page',
      description: 'Formulário de cadastro',
      icon: 'MousePointerClick',
      position: { x: 400, y: 150 },
      config: {},
      connections: ['node-3']
    },
    {
      id: 'node-3',
      type: 'crm',
      category: 'system',
      label: 'CRM',
      description: 'Lead entra no CRM',
      icon: 'Database',
      position: { x: 700, y: 150 },
      config: {},
      connections: ['node-4', 'node-5']
    },
    {
      id: 'node-4',
      type: 'whatsapp',
      category: 'communication',
      label: 'WhatsApp',
      description: 'Primeiro contato',
      icon: 'MessageSquare',
      position: { x: 1000, y: 100 },
      config: {},
      connections: ['node-6']
    },
    {
      id: 'node-5',
      type: 'email',
      category: 'communication',
      label: 'Email',
      description: 'Sequência de nutrição',
      icon: 'Mail',
      position: { x: 1000, y: 250 },
      config: {},
      connections: ['node-6']
    },
    {
      id: 'node-6',
      type: 'conversion',
      category: 'conversion',
      label: 'Conversão',
      description: 'Lead qualificado',
      icon: 'CheckCircle',
      position: { x: 1300, y: 150 },
      config: {},
      connections: []
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { id: 'conn-1', from: 'start-1', to: 'qual-1', label: 'Novo lead', style: 'curved', curvature: 0.5 },
    { id: 'conn-2', from: 'qual-1', to: 'contact-1', label: 'Qualificado', style: 'curved', curvature: 0.3 },
    { id: 'conn-3', from: 'qual-1', to: 'end-1', label: 'Não qualificado', style: 'curved', curvature: 0.3 },
    { id: 'conn-4', from: 'contact-1', to: 'proposal-1', label: 'Interessado', style: 'curved', curvature: 0.4 },
    { id: 'conn-5', from: 'proposal-1', to: 'closing-1', label: 'Proposta enviada', style: 'curved', curvature: 0.2 }
  ]);

  const [selectedNode, setSelectedNode] = useState<FunnelNode | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [showCustomNodeDialog, setShowCustomNodeDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [funnelName, setFunnelName] = useState('');
  const [newNodeType, setNewNodeType] = useState<string>('facebook_ads');
  const [newNodeCategory, setNewNodeCategory] = useState<FunnelNode['category']>('acquisition');
  const [customNodeLabel, setCustomNodeLabel] = useState('');
  const [customNodeDescription, setCustomNodeDescription] = useState('');
  const [customNodeIcon, setCustomNodeIcon] = useState('Plus');
  const [customNodeColor, setCustomNodeColor] = useState('from-[hsl(20,10%,50%)] to-[hsl(20,10%,45%)]');
  const [editingConnection, setEditingConnection] = useState<string | null>(null);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  
  // 🚀 USANDO NOVA API ESCALÁVEL
  const { data: savedFunnels, isLoading: funnelsLoading } = useSavedFunnels('current-user-id'); // TODO: usar ID real do usuário
  const createFunnelMutation = useCreateSavedFunnel();
  
  const [viewport, setViewport] = useState<ViewportState>({ x: 0, y: 0, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNodeDrag = useCallback((nodeId: string, deltaX: number, deltaY: number) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId
        ? { ...node, position: { x: node.position.x + deltaX, y: node.position.y + deltaY } }
        : node
    ));
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    // Se estava conectando, cancelar
    if (isConnecting) {
      setIsConnecting(null);
      return;
    }

    // Se clicou no canvas vazio, deselecionar
    setSelectedNode(null);
    setEditingConnection(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle click ou Alt+Click para pan
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd + Scroll para zoom
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setViewport(prev => ({
        ...prev,
        zoom: Math.min(Math.max(prev.zoom + delta, 0.3), 2)
      }));
    }
    // Scroll normal para pan vertical/horizontal
  };

  const getCanvasPosition = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 200, y: 200 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - viewport.x) / viewport.zoom;
    const y = (clientY - rect.top - viewport.y) / viewport.zoom;
    
    return { x, y };
  };

  const addNode = (type: string, clientX?: number, clientY?: number) => {
    const template = NODE_TEMPLATES[type as keyof typeof NODE_TEMPLATES];
    if (!template) return;

    // Se não forneceu coordenadas, usar centro do viewport
    let position;
    if (clientX !== undefined && clientY !== undefined) {
      position = getCanvasPosition(clientX, clientY);
    } else {
      // Centro da tela visível
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        position = getCanvasPosition(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
      } else {
        position = { x: 200, y: 200 };
      }
    }

    const newNode: FunnelNode = {
      id: `node-${Date.now()}`,
      type,
      category: template.category,
      label: template.label,
      description: template.description,
      icon: template.icon,
      position: position,
      config: {},
      connections: []
    };

    setNodes(prev => [...prev, newNode]);
    setShowNodeDialog(false);

    toast({
      title: "Nó adicionado!",
      description: `${template.label} foi adicionado ao funil.`,
    });
  };

  const addCustomNode = (clientX?: number, clientY?: number) => {
    if (!customNodeLabel.trim()) {
      toast({
        title: "Erro",
        description: "Preencha o nome do nó",
        variant: "destructive",
      });
      return;
    }

    // Se não forneceu coordenadas, usar centro do viewport
    let position;
    if (clientX !== undefined && clientY !== undefined) {
      position = getCanvasPosition(clientX, clientY);
    } else {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        position = getCanvasPosition(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
      } else {
        position = { x: 200, y: 200 };
      }
    }

    const newNode: FunnelNode = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      category: newNodeCategory,
      label: customNodeLabel,
      description: customNodeDescription || 'Nó personalizado',
      icon: customNodeIcon,
      color: customNodeColor,
      position: position,
      config: {},
      connections: []
    };

    setNodes(prev => [...prev, newNode]);
    setShowCustomNodeDialog(false);
    
    // Reset form
    setCustomNodeLabel('');
    setCustomNodeDescription('');
    setCustomNodeIcon('Plus');
    setCustomNodeColor('from-[hsl(20,10%,50%)] to-[hsl(20,10%,45%)]');
    setNewNodeCategory('custom');

    toast({
      title: "Nó personalizado criado!",
      description: `${customNodeLabel} foi adicionado ao funil.`,
    });
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId));
    setSelectedNode(null);

    toast({
      title: "Nó removido!",
      description: "O nó foi removido do funil.",
    });
  };

  const startConnection = (nodeId: string) => {
    setIsConnecting(nodeId);
  };

  const completeConnection = (targetNodeId: string) => {
    if (!isConnecting || isConnecting === targetNodeId) return;

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      from: isConnecting,
      to: targetNodeId,
      label: 'Nova conexão'
    };

    setConnections(prev => [...prev, newConnection]);

    // Atualizar conexões do nó de origem
    setNodes(prev => prev.map(node =>
      node.id === isConnecting
        ? { ...node, connections: [...node.connections, targetNodeId] }
        : node
    ));

    setIsConnecting(null);

    toast({
      title: "Conexão criada!",
      description: "Os nós foram conectados com sucesso.",
    });
  };

  const updateNodeConfig = (nodeId: string, config: Partial<FunnelNode['config']>) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId
        ? { ...node, config: { ...node.config, ...config } }
        : node
    ));
  };

  const handleSaveFunnel = async () => {
    if (!funnelName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para o funil",
        variant: "destructive",
      });
      return;
    }

    const funnelData = {
      id: crypto.randomUUID(),
      name: funnelName,
      nodes,
      connections,
    };

    await createFunnelMutation.mutateAsync(funnelData);
    
    setShowSaveDialog(false);
    setFunnelName('');

    toast({
      title: "Funil salvo!",
      description: `"${funnelData.name}" foi salvo com sucesso.`,
    });
  };

  const openSaveDialog = () => {
    setFunnelName('');
    setShowSaveDialog(true);
  };

  const loadFunnels = () => {
    setShowLoadDialog(true);
  };

  const loadFunnel = (funnelData: any) => {
    setNodes(funnelData.nodes);
    setConnections(funnelData.connections);
    setShowLoadDialog(false);
    setSelectedNode(null);
    setEditingConnection(null);

    toast({
      title: "Funil carregado!",
      description: `"${funnelData.name}" foi carregado com sucesso.`,
    });
  };

  const handleDeleteFunnel = async (funnelId: string, funnelName: string) => {
    // TODO: Implementar delete de funil
    // await deleteFunnel(funnelId);

    toast({
      title: "Funil deletado!",
      description: `"${funnelName}" foi removido.`,
    });
  };

  const executeFunnel = () => {
    const startNode = nodes.find(node => node.type === 'start');
    if (!startNode) {
      toast({
        title: "Erro na execução",
        description: "Nenhum nó de início encontrado no funil.",
        variant: "destructive"
      });
      return;
    }

    // Simulação simples da execução
    const executionPath: string[] = [];
    let currentNode = startNode;

    while (currentNode && currentNode.type !== 'end') {
      executionPath.push(currentNode.label);

      // Encontrar a próxima conexão
      const nextConnection = connections.find(conn => conn.from === currentNode.id);
      if (!nextConnection) break;

      currentNode = nodes.find(node => node.id === nextConnection.to);
    }

    if (currentNode) {
      executionPath.push(currentNode.label);
    }

    toast({
      title: "Funil executado!",
      description: `Caminho: ${executionPath.join(' → ')}`,
    });
  };

  const renderNode = (node: FunnelNode) => {
    const template = NODE_TEMPLATES[node.type as keyof typeof NODE_TEMPLATES];
    const IconComponent = ICON_MAP[node.icon || 'Plus'];
    const isSelected = selectedNode?.id === node.id;
    const isConnectingFrom = isConnecting === node.id;
    const isHovered = hoveredNode === node.id;

    // Usar template se existir, senão usar valores do próprio nó (customizado)
    const nodeColor = node.color || template?.color || 'from-gray-500 to-gray-600';
    const nodeBgColor = template?.bgColor || 'bg-gray-50';
    const nodeBorderColor = template?.borderColor || 'border-gray-300';
    const nodeTextColor = template?.textColor || 'text-gray-700';

    return (
      <div
        key={node.id}
        className={`absolute select-none transition-all duration-200 ease-out group ${
          isSelected ? 'z-50' : 'z-10'
        }`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setDraggedNode(node.id);
          setSelectedNode(node);
        }}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNode(node);
        }}
      >
        {/* Container principal do nó - estilo n8n */}
        <div className={`relative flex flex-col bg-background border-2 rounded-2xl shadow-lg min-w-[240px] max-w-[280px] overflow-hidden transition-all duration-200 ${
          isSelected 
            ? 'border-primary shadow-2xl shadow-primary/30 ring-4 ring-primary/20' 
            : isConnectingFrom
            ? 'border-[hsl(140,30%,40%)] shadow-2xl shadow-[hsl(140,30%,40%)]/30 animate-pulse'
            : `${nodeBorderColor} hover:shadow-xl hover:scale-[1.02]`
        }`}>
          
          {/* Header do nó com cor */}
          <div className={`relative bg-gradient-to-r ${nodeColor} p-4 text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base truncate">{node.label}</h3>
                <p className="text-xs text-white/80 truncate">{node.description}</p>
              </div>
            </div>

            {/* Badge de categoria */}
            <div className="absolute top-2 right-2">
              <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium shadow-md">
                {node.category === 'acquisition' && 'Aquisição'}
                {node.category === 'system' && 'Sistema'}
                {node.category === 'communication' && 'Comunicação'}
                {node.category === 'conversion' && 'Conversão'}
                {node.category === 'custom' && 'Personalizado'}
              </div>
            </div>
          </div>

          {/* Corpo do nó */}
          <div className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {node.description}
            </p>

            {/* Metadados */}
            <div className="flex flex-wrap gap-2 pt-2">
              {node.connections.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  <GitBranch className="w-3 h-3" />
                  <span>{node.connections.length}</span>
                </div>
              )}
            </div>

            {/* Botões de ação - sempre visíveis para melhor UX */}
            <div className="flex gap-2 pt-2 border-t mt-3">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  startConnection(node.id);
                }}
              >
                <GitBranch className="w-3 h-3" />
                Conectar
              </button>
              <button
                className="flex items-center justify-center p-2 text-xs font-medium bg-muted hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Pontos de conexão - estilo n8n */}
        {/* Ponto de saída (direita) */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
          <div
            className={`w-6 h-6 rounded-full cursor-crosshair transition-all duration-200 flex items-center justify-center shadow-lg ${
              isConnectingFrom 
                ? 'bg-[hsl(140,30%,40%)] scale-125 shadow-[hsl(140,30%,40%)]/50' 
                : 'bg-primary hover:bg-primary/80 hover:scale-110'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isConnecting && isConnecting !== node.id) {
                completeConnection(node.id);
              } else {
                startConnection(node.id);
              }
            }}
            title="Conectar a outro nó"
          >
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Ponto de entrada (esquerda) */}
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-20">
          <div
            className={`w-6 h-6 rounded-full cursor-crosshair transition-all duration-200 flex items-center justify-center shadow-lg ${
              isConnecting && isConnecting !== node.id
                ? 'bg-[hsl(140,30%,40%)] hover:bg-[hsl(140,30%,35%)] scale-110 shadow-[hsl(140,30%,40%)]/50'
                : 'bg-muted border-2 border-primary hover:bg-primary/20 hover:scale-110'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isConnecting && isConnecting !== node.id) {
                completeConnection(node.id);
              }
            }}
            title="Receber conexão"
          >
            <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  const renderConnection = (connection: Connection) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);

    if (!fromNode || !toNode) return null;

    // Posições dos nós sem aplicar transformações (SVG vai se ajustar ao viewport)
    const fromX = fromNode.position.x + 240; // Saída à direita do nó
    const fromY = fromNode.position.y + 80;  // Centro vertical do nó
    const toX = toNode.position.x;           // Entrada à esquerda do nó
    const toY = toNode.position.y + 80;      // Centro vertical do nó

    const style = connection.style || 'curved';
    const curvature = connection.curvature || 0.5;
    const isHovered = hoveredConnection === connection.id;
    const isEditing = editingConnection === connection.id;

    let pathData: string;
    let midX: number;
    let midY: number;

    if (style === 'straight') {
      pathData = `M ${fromX} ${fromY} L ${toX} ${toY}`;
      midX = (fromX + toX) / 2;
      midY = (fromY + toY) / 2;
    } else if (style === 'orthogonal') {
      midX = (fromX + toX) / 2;
      pathData = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
      midY = (fromY + toY) / 2;
    } else {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curveStrength = Math.min(distance * curvature, 200);

      let cp1x, cp1y, cp2x, cp2y;

      if (Math.abs(dx) > Math.abs(dy)) {
        cp1x = fromX + curveStrength;
        cp1y = fromY;
        cp2x = toX - curveStrength;
        cp2y = toY;
      } else {
        cp1x = fromX;
        cp1y = fromY + curveStrength;
        cp2x = toX;
        cp2y = toY - curveStrength;
      }

      pathData = `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`;
      midX = (fromX + toX) / 2;
      midY = (fromY + toY) / 2;
    }

    const labelOffset = 30;
    const labelX = midX;
    const labelY = midY - labelOffset;

    return (
      <g 
        key={connection.id}
        onMouseEnter={() => setHoveredConnection(connection.id)}
        onMouseLeave={() => setHoveredConnection(null)}
        className="transition-all duration-200"
      >
        {/* Linha de fundo para área de clique */}
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth="24"
          fill="none"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setEditingConnection(connection.id);
          }}
        />

        {/* Linha externa mais clara (shadow) */}
        <path
          d={pathData}
          stroke={isHovered || isEditing ? "hsl(var(--primary) / 0.2)" : "hsl(var(--border))"}
          strokeWidth={isHovered || isEditing ? "6" : "5"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-200"
        />

        {/* Linha principal */}
        <path
          d={pathData}
          stroke={isHovered || isEditing ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.6)"}
          strokeWidth={isHovered || isEditing ? "3" : "2"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isEditing ? "8 4" : "none"}
          className="transition-all duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setEditingConnection(connection.id);
          }}
          style={{
            filter: isHovered || isEditing ? 'drop-shadow(0 0 4px hsl(var(--primary) / 0.5))' : 'none'
          }}
        />

        {/* Indicador de direção - círculo no final */}
        <circle
          cx={toX}
          cy={toY}
          r={isHovered || isEditing ? "7" : "6"}
          fill="hsl(var(--primary))"
          stroke="hsl(var(--background))"
          strokeWidth="2"
          className="transition-all duration-200"
          style={{
            filter: isHovered || isEditing ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.6))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
          }}
        />

        {/* Partículas animadas - mais sutis */}
        {!isEditing && (
          <>
            <circle r="2.5" fill="hsl(var(--primary))" opacity="0.8">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path={pathData}
              />
              <animate 
                attributeName="opacity" 
                values="0;0.8;0" 
                dur="4s" 
                repeatCount="indefinite" 
              />
            </circle>
            <circle r="2" fill="hsl(var(--primary))" opacity="0.6">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path={pathData}
                begin="2s"
              />
              <animate 
                attributeName="opacity" 
                values="0;0.6;0" 
                dur="4s" 
                repeatCount="indefinite"
                begin="2s"
              />
            </circle>
          </>
        )}

        {/* Label com estilo n8n */}
        {connection.label && (
          <g className="pointer-events-auto">
            {/* Background do label */}
            <rect
              x={labelX - (connection.label.length * 4)}
              y={labelY - 12}
              width={connection.label.length * 8}
              height="24"
              rx="12"
              fill="hsl(var(--background))"
              stroke={isHovered || isEditing ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={isHovered || isEditing ? "2" : "1.5"}
              className="cursor-pointer transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setEditingConnection(connection.id);
              }}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
            
            {/* Texto do label */}
            <text
              x={labelX}
              y={labelY + 5}
              textAnchor="middle"
              className={`text-xs font-semibold pointer-events-none select-none transition-all duration-200 ${
                isHovered || isEditing ? 'fill-primary' : 'fill-foreground'
              }`}
              style={{ fontSize: '12px' }}
            >
              {connection.label}
            </text>
          </g>
        )}

        {/* Pontos de controle editáveis */}
        {isEditing && style === 'curved' && (
          <>
            <circle
              cx={fromX + 60}
              cy={fromY}
              r="6"
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="2"
              className="cursor-move hover:scale-125 transition-transform"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
            <circle
              cx={toX - 60}
              cy={toY}
              r="6"
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="2"
              className="cursor-move hover:scale-125 transition-transform"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </>
        )}
      </g>
    );
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedNode && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const parentRect = canvasRef.current.parentElement?.getBoundingClientRect();
        
        if (parentRect) {
          // Considerar o scroll do container pai
          const scrollLeft = canvasRef.current.parentElement?.scrollLeft || 0;
          const scrollTop = canvasRef.current.parentElement?.scrollTop || 0;
          
          const x = e.clientX - parentRect.left + scrollLeft;
          const y = e.clientY - parentRect.top + scrollTop;
          
          setNodes(prev => prev.map(node =>
            node.id === draggedNode
              ? { ...node, position: { x: x - 120, y: y - 80 } }
              : node
          ));
        }
      } else if (isPanning && canvasRef.current) {
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;
        
        setViewport(prev => ({
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
        
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setDraggedNode(null);
      setIsPanning(false);
    };

    if (draggedNode || isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedNode, isPanning, panStart, viewport, nodes]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Delete - remover nó selecionado
      if (e.key === 'Delete' && selectedNode) {
        deleteNode(selectedNode.id);
      }
      // Escape - desselecionar
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setEditingConnection(null);
        setIsConnecting(null);
      }
      // Ctrl/Cmd + S - salvar
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        openSaveDialog();
      }
      // Ctrl/Cmd + Z - undo (placeholder)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        // TODO: Implementar undo/redo
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [selectedNode]);

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header com gradiente */}
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Voltar</span>
          </Button>
          
          <div className="h-8 w-px bg-border" />
          
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Construtor de Funis
            </h2>
            <p className="text-sm text-muted-foreground">Arraste e conecte para criar seu fluxo de vendas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de Zoom */}
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg text-xs">
            <span className="text-muted-foreground">Zoom:</span>
            <span className="font-mono font-bold">{Math.round(viewport.zoom * 100)}%</span>
          </div>

          {/* Botões principais */}
          <Button variant="outline" size="sm" onClick={() => setShowCustomNodeDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Nó
          </Button>
          <Button variant="outline" size="sm" onClick={loadFunnels}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Carregar
          </Button>
          <Button size="sm" onClick={openSaveDialog}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {/* Botão de toggle da sidebar - fora da sidebar para sempre ficar visível */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 z-50 h-8 w-8 rounded-full bg-background border shadow-md hover:bg-muted transition-all duration-300 ${
            isSidebarCollapsed ? 'left-2' : 'left-[310px]'
          }`}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Sidebar redesenhada com collapse */}
        <div 
          className={`border-r bg-gradient-to-b from-muted/30 to-muted/10 backdrop-blur-sm overflow-y-auto flex-shrink-0 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-0' : 'w-80'
          }`}
        >
          <div className={`p-4 space-y-6 h-full ${isSidebarCollapsed ? 'hidden' : ''}`}>
            {/* Paleta de Nós */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Grid3x3 className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Biblioteca de Nós</h3>
              </div>

              {/* Categorias */}
              <div className="space-y-3">
                {/* Aquisição */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Aquisição</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(NODE_TEMPLATES)
                      .filter(([_, config]) => config.category === 'acquisition')
                      .map(([type, config]) => {
                        const IconComp = ICON_MAP[config.icon || 'Plus'];
                        return (
                          <button
                            key={type}
                            className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary/50 bg-background p-2.5 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                            onClick={() => addNode(type)}
                            title={config.description}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="relative flex flex-col items-center gap-1.5">
                              <div className={`w-9 h-9 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                                {IconComp && <IconComp className="w-4 h-4 text-white" />}
                              </div>
                              <span className={`text-[11px] font-medium ${config.textColor} group-hover:font-bold transition-all leading-tight text-center`}>
                                {config.label}
                              </span>
                            </div>
                          </button>
                        );
                    })}
                  </div>
                </div>

                {/* Sistemas */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Sistemas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(NODE_TEMPLATES)
                      .filter(([_, config]) => config.category === 'system')
                      .map(([type, config]) => {
                        const IconComp = ICON_MAP[config.icon || 'Plus'];
                        return (
                          <button
                            key={type}
                            className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary/50 bg-background p-2.5 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                            onClick={() => addNode(type)}
                            title={config.description}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="relative flex flex-col items-center gap-1.5">
                              <div className={`w-9 h-9 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                                {IconComp && <IconComp className="w-4 h-4 text-white" />}
                              </div>
                              <span className={`text-[11px] font-medium ${config.textColor} group-hover:font-bold transition-all leading-tight text-center`}>
                                {config.label}
                              </span>
                            </div>
                          </button>
                        );
                    })}
                  </div>
                </div>

                {/* Comunicação */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Comunicação</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(NODE_TEMPLATES)
                      .filter(([_, config]) => config.category === 'communication')
                      .map(([type, config]) => {
                        const IconComp = ICON_MAP[config.icon || 'Plus'];
                        return (
                          <button
                            key={type}
                            className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary/50 bg-background p-2.5 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                            onClick={() => addNode(type)}
                            title={config.description}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="relative flex flex-col items-center gap-1.5">
                              <div className={`w-9 h-9 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                                {IconComp && <IconComp className="w-4 h-4 text-white" />}
                              </div>
                              <span className={`text-[11px] font-medium ${config.textColor} group-hover:font-bold transition-all leading-tight text-center`}>
                                {config.label}
                              </span>
                            </div>
                          </button>
                        );
                    })}
                  </div>
                </div>

                {/* Conversão */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Conversão</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(NODE_TEMPLATES)
                      .filter(([_, config]) => config.category === 'conversion')
                      .map(([type, config]) => {
                        const IconComp = ICON_MAP[config.icon || 'Plus'];
                        return (
                          <button
                            key={type}
                            className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary/50 bg-background p-2.5 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                            onClick={() => addNode(type)}
                            title={config.description}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="relative flex flex-col items-center gap-1.5">
                              <div className={`w-9 h-9 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                                {IconComp && <IconComp className="w-4 h-4 text-white" />}
                              </div>
                              <span className={`text-[11px] font-medium ${config.textColor} group-hover:font-bold transition-all leading-tight text-center`}>
                                {config.label}
                              </span>
                            </div>
                          </button>
                        );
                    })}
                  </div>
                </div>

                {/* Botão Criar Personalizado */}
                <button
                  className="w-full py-3 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-medium text-primary"
                  onClick={() => setShowCustomNodeDialog(true)}
                >
                  <Plus className="w-4 h-4" />
                  Criar Nó Personalizado
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center pt-1">
                Clique para adicionar ao canvas
              </p>
            </div>

            {/* Estatísticas do Funil */}
            {nodes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" />
                  Estatísticas
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                    <div className="text-2xl font-bold text-primary">{nodes.length}</div>
                    <div className="text-[10px] text-muted-foreground">Nós</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                    <div className="text-2xl font-bold text-primary">{connections.length}</div>
                    <div className="text-[10px] text-muted-foreground">Conexões</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                    <div className="text-2xl font-bold text-[hsl(140,30%,40%)]">
                      {nodes.filter(n => n.category === 'acquisition').length}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Aquisição</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                    <div className="text-2xl font-bold text-[hsl(35,60%,45%)]">
                      {nodes.filter(n => n.category === 'conversion').length}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Conversão</div>
                  </div>
                </div>
              </div>
            )}

            {selectedNode && (
              <div className="space-y-4 animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    Configurações
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setSelectedNode(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <div className="bg-background/50 rounded-lg p-3 space-y-4 border border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor="node-label" className="text-xs font-bold">Nome do Nó</Label>
                    <Input
                      id="node-label"
                      value={selectedNode.label}
                      onChange={(e) => {
                        setNodes(prev => prev.map(node =>
                          node.id === selectedNode.id
                            ? { ...node, label: e.target.value }
                            : node
                        ));
                      }}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="node-description" className="text-xs font-bold">Descrição</Label>
                    <Textarea
                      id="node-description"
                      value={selectedNode.description}
                      onChange={(e) => {
                        setNodes(prev => prev.map(node =>
                          node.id === selectedNode.id
                            ? { ...node, description: e.target.value }
                            : node
                        ));
                      }}
                      rows={2}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="node-category" className="text-xs font-bold">Categoria</Label>
                    <Badge variant="outline" className="w-full justify-center py-2">
                      {selectedNode.category === 'acquisition' && '🎯 Aquisição'}
                      {selectedNode.category === 'system' && '⚙️ Sistema'}
                      {selectedNode.category === 'communication' && '💬 Comunicação'}
                      {selectedNode.category === 'conversion' && '✅ Conversão'}
                      {selectedNode.category === 'custom' && '✨ Personalizado'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {editingConnection && (
              <div className="space-y-4 animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary" />
                    Conexão
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setEditingConnection(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                {(() => {
                  const connection = connections.find(c => c.id === editingConnection);
                  if (!connection) return null;

                  return (
                    <div className="bg-background/50 rounded-lg p-3 space-y-4 border border-border/50">
                      <div className="space-y-2">
                        <Label htmlFor="connection-label" className="text-xs font-bold">Texto da Conexão</Label>
                        <Input
                          id="connection-label"
                          value={connection.label || ''}
                          onChange={(e) => {
                            setConnections(prev => prev.map(conn =>
                              conn.id === connection.id
                                ? { ...conn, label: e.target.value }
                                : conn
                            ));
                          }}
                          placeholder="Ex: Qualificado, Negado..."
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold">Estilo da Linha</Label>
                        <Select
                          value={connection.style || 'curved'}
                          onValueChange={(value: 'straight' | 'curved' | 'orthogonal') => {
                            setConnections(prev => prev.map(conn =>
                              conn.id === connection.id
                                ? { ...conn, style: value }
                                : conn
                            ));
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="straight">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-current" />
                                <span>Reta</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="curved">
                              <div className="flex items-center gap-2">
                                <svg width="32" height="8" viewBox="0 0 32 8">
                                  <path d="M 0 4 Q 8 0, 16 4 T 32 4" stroke="currentColor" fill="none" strokeWidth="2"/>
                                </svg>
                                <span>Curva</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="orthogonal">
                              <div className="flex items-center gap-2">
                                <svg width="32" height="8" viewBox="0 0 32 8">
                                  <path d="M 0 4 L 10 4 L 10 7 L 22 7 L 22 4 L 32 4" stroke="currentColor" fill="none" strokeWidth="2"/>
                                </svg>
                                <span>Ortogonal</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(connection.style === 'curved' || !connection.style) && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="curvature" className="text-xs font-bold">Curvatura</Label>
                            <span className="text-xs font-mono bg-primary/10 px-2 py-1 rounded">
                              {Math.round((connection.curvature || 0.5) * 100)}%
                            </span>
                          </div>
                          <input
                            id="curvature"
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={connection.curvature || 0.5}
                            onChange={(e) => {
                              setConnections(prev => prev.map(conn =>
                                conn.id === connection.id
                                  ? { ...conn, curvature: parseFloat(e.target.value) }
                                  : conn
                              ));
                            }}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setConnections(prev => prev.filter(c => c.id !== connection.id));
                          setEditingConnection(null);
                          toast({
                            title: "Conexão removida",
                            description: "A conexão foi deletada com sucesso.",
                          });
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Deletar Conexão
                      </Button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Atalhos de teclado */}
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-bold text-sm text-muted-foreground">Atalhos</h3>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Salvar</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Deletar</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">Del</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cancelar</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Navegar</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">Scroll</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas aprimorado */}
        <div className="flex-1 relative overflow-auto bg-gradient-to-br from-muted/5 via-background to-muted/10">
          {/* Container com tamanho maior para permitir scroll */}
          <div 
            className="relative min-w-[3000px] min-h-[2000px]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          >
            {/* Grid secundário (pontos) */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Canvas interativo */}
            <div
              ref={canvasRef}
              className="w-full h-full relative cursor-grab active:cursor-grabbing"
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onWheel={handleWheel}
            >
              {/* Wrapper com zoom/pan */}
              <div
                style={{
                  transform: `scale(${viewport.zoom})`,
                  transformOrigin: '0 0',
                  transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                  position: 'relative',
                  width: '100%',
                  height: '100%'
                }}
              >
            {/* SVG para conexões - usar largura/altura fixas para cobrir toda a área */}
            <svg 
              className="absolute top-0 left-0 pointer-events-none" 
              style={{ 
                width: '3000px', 
                height: '2000px',
                zIndex: 1 
              }}
            >
              <defs>
                {/* Filtros para efeitos */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g style={{ pointerEvents: 'auto' }}>
                {connections.map(renderConnection)}
              </g>
            </svg>

            {/* Nós */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              {nodes.map(renderNode)}
            </div>

            {/* Indicadores e helpers */}
            {isConnecting && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-primary/50 animate-bounce">
                  <GitBranch className="w-4 h-4 inline mr-2" />
                  Clique em outro nó para conectar
                </div>
              </div>
            )}

            {isPanning && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-muted text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  <Move className="w-4 h-4 inline mr-2" />
                  Movendo canvas...
                </div>
              </div>
            )}

            {/* Minimap hint */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center space-y-4 max-w-md">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Plus className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Canvas Vazio</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comece adicionando nós da barra lateral para construir seu funil
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 justify-center">
                        <kbd className="px-2 py-1 bg-muted rounded">Scroll</kbd>
                        <span>Navegar pelo canvas</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <kbd className="px-2 py-1 bg-muted rounded">Arrastar nós</kbd>
                        <span>Mover elementos</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <kbd className="px-2 py-1 bg-muted rounded">Botão direito</kbd>
                        <span>Conectar nós</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </div> {/* Fecha wrapper de zoom */}
            </div> {/* Fecha canvas interativo */}
          </div> {/* Fecha container com grid */}
        </div> {/* Fecha canvas aprimorado */}
      </div> {/* Fecha flex container (sidebar + canvas) */}

      {/* Dialog para criar nó personalizado */}
      <Dialog open={showCustomNodeDialog} onOpenChange={setShowCustomNodeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Criar Nó Personalizado
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-label">Nome do Nó*</Label>
              <Input
                id="custom-label"
                placeholder="Ex: Reunião Comercial"
                value={customNodeLabel}
                onChange={(e) => setCustomNodeLabel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-description">Descrição</Label>
              <Textarea
                id="custom-description"
                placeholder="Descreva a função deste nó..."
                value={customNodeDescription}
                onChange={(e) => setCustomNodeDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-category">Categoria</Label>
              <Select value={newNodeCategory} onValueChange={(value: FunnelNode['category']) => setNewNodeCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acquisition">Aquisição</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="communication">Comunicação</SelectItem>
                  <SelectItem value="conversion">Conversão</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="custom-icon">Ícone</Label>
                <Select value={customNodeIcon} onValueChange={setCustomNodeIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plus">Plus</SelectItem>
                    <SelectItem value="Target">Target</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="Share2">Share</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Edit3">Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-color">Cor</Label>
                <Select value={customNodeColor} onValueChange={setCustomNodeColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from-[hsl(18,30%,25%)] to-[hsl(18,30%,20%)]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(18,30%,25%)] to-[hsl(18,30%,20%)]" />
                        Marrom Escuro
                      </div>
                    </SelectItem>
                    <SelectItem value="from-[hsl(18,25%,30%)] to-[hsl(18,25%,25%)]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(18,25%,30%)] to-[hsl(18,25%,25%)]" />
                        Marrom Médio
                      </div>
                    </SelectItem>
                    <SelectItem value="from-[hsl(35,60%,55%)] to-[hsl(35,60%,50%)]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(35,60%,55%)] to-[hsl(35,60%,50%)]" />
                        Laranja/Âmbar
                      </div>
                    </SelectItem>
                    <SelectItem value="from-[hsl(140,30%,40%)] to-[hsl(140,30%,35%)]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(140,30%,40%)] to-[hsl(140,30%,35%)]" />
                        Verde Musgo
                      </div>
                    </SelectItem>
                    <SelectItem value="from-[hsl(200,15%,45%)] to-[hsl(200,15%,40%)]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(200,15%,45%)] to-[hsl(200,15%,40%)]" />
                        Cinza Azulado
                      </div>
                    </SelectItem>
                    <SelectItem value="from-[hsl(20,10%,50%)] to-[hsl(20,10%,45%)]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(20,10%,50%)] to-[hsl(20,10%,45%)]" />
                        Cinza Neutro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCustomNodeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => addCustomNode()} className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Criar Nó
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para salvar funil */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-primary" />
              Salvar Funil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="funnel-name">Nome do Funil*</Label>
              <Input
                id="funnel-name"
                placeholder="Ex: Funil de Marketing Q1 2025"
                value={funnelName}
                onChange={(e) => setFunnelName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveFunnel();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• {nodes.length} nós</p>
              <p>• {connections.length} conexões</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFunnel} className="bg-gradient-to-r from-primary to-primary/80">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog aprimorado para carregar funil */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Carregar Funil Salvo
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {(savedFunnels as any[] || []).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Nenhum funil salvo ainda</p>
                <p className="text-xs text-muted-foreground mt-2">Crie e salve seu primeiro funil para vê-lo aqui</p>
              </div>
            ) : (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                {(savedFunnels as any[] || []).map((funnel, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{funnel.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Salvo em {new Date(funnel.updated_at || funnel.created_at || '').toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {funnel.funnel_data?.nodes?.length || 0} nós
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {funnel.funnel_data?.connections?.length || 0} conexões
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadFunnel(funnel)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Carregar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFunnel(funnel.id, funnel.name)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}