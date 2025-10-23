// Marketing Types

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ads' | 'content' | 'events' | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  
  // Métricas
  impressions: number;
  clicks: number;
  conversions: number;
  leads: number;
  revenue: number;
  
  // Targeting
  targetAudience: string[];
  channels: string[];
  
  // Assets
  creatives: string[];
  landingPages: string[];
  
  // Descrição
  description?: string;
  goals?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  campaignId: string;
  name: string;
  subject: string;
  preheader: string;
  fromName: string;
  fromEmail: string;
  
  // Conteúdo
  template: string;
  html: string;
  
  // Segmentação
  segments: string[];
  recipientCount: number;
  
  // Agendamento
  scheduledFor?: string;
  sentAt?: string;
  
  // Métricas
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  
  // A/B Test
  isABTest: boolean;
  variants?: EmailVariant[];
}

export interface EmailVariant {
  id: string;
  name: string;
  subject: string;
  percentage: number;
  winner: boolean;
}

export interface SocialPost {
  id: string;
  campaignId?: string;
  content: string;
  platforms: ('linkedin' | 'instagram' | 'facebook' | 'twitter' | 'tiktok')[];
  
  // Media
  images: string[];
  videos: string[];
  
  // Scheduling
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: string;
  publishedAt?: string;
  
  // Engagement
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  
  // Tags
  hashtags: string[];
  mentions: string[];
}

export interface ContentPiece {
  id: string;
  title: string;
  type: 'blog' | 'ebook' | 'whitepaper' | 'case-study' | 'infographic' | 'video';
  status: 'idea' | 'draft' | 'review' | 'published';
  
  // SEO
  keywords: string[];
  metaDescription: string;
  targetUrl: string;
  
  // Planning
  assignedTo: string;
  dueDate: string;
  publishDate?: string;
  
  // Performance
  views: number;
  shares: number;
  leads: number;
  conversions: number;
  
  // Content
  wordCount: number;
  readingTime: number;
  
  // Topic cluster
  pillarPage?: string;
  relatedContent: string[];
}

export interface LandingPage {
  id: string;
  campaignId: string;
  name: string;
  url: string;
  template: string;
  
  // Elements
  headline: string;
  subheadline: string;
  cta: string;
  formId: string;
  
  // Tracking
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  
  // Performance
  visitors: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: number;
  
  // A/B Test
  isABTest: boolean;
  variants?: LandingPageVariant[];
}

export interface LandingPageVariant {
  id: string;
  name: string;
  conversionRate: number;
  winner: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  landingPageId: string;
  campaignId: string;
  
  // Lead data
  email: string;
  name: string;
  company?: string;
  phone?: string;
  customFields: Record<string, any>;
  
  // Tracking
  source: string;
  medium: string;
  campaign: string;
  
  submittedAt: string;
  leadCreated: boolean;
  leadId?: string;
}

export interface MarketingMetrics {
  // Aquisição
  totalLeads: number;
  leadsByChannel: Record<string, number>;
  costPerLead: number;
  
  // Conversão
  mql: number; // Marketing Qualified Leads
  sql: number; // Sales Qualified Leads
  customers: number;
  conversionRate: number;
  
  // Financeiro
  totalSpent: number;
  revenue: number;
  roi: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  
  // Engajamento
  emailOpenRate: number;
  emailClickRate: number;
  socialEngagementRate: number;
  websiteVisitors: number;
  avgSessionDuration: number;
}

export type CampaignType = Campaign['type'];
export type CampaignStatus = Campaign['status'];

// Marketing Tasks Types

export interface MarketingTask {
  id: string;
  title: string;
  description?: string;
  type: MarketingTaskType;
  status: MarketingTaskStatus;
  priority: 'P1' | 'P2' | 'P3';
  
  // Relacionamento
  campaignId?: string;
  assignedTo: string;
  
  // Datas
  dueDate?: string;
  dueTime?: string;
  completedAt?: string;
  
  // Checklist
  checklist: TaskChecklistItem[];
  
  // Tags e categorias
  tags: string[];
  category: MarketingCategory;
  
  // Métricas (quando aplicável)
  estimatedHours?: number;
  actualHours?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export type MarketingTaskType = 
  | 'criar_conteudo'      // Criar post, artigo, vídeo
  | 'revisar_copy'        // Revisar textos
  | 'design'              // Criar arte, banner, infográfico
  | 'agendar_post'        // Agendar redes sociais
  | 'configurar_ads'      // Configurar anúncios
  | 'criar_landing'       // Criar landing page
  | 'email_marketing'     // Criar/enviar email
  | 'analise'             // Análise de resultados
  | 'pesquisa'            // Pesquisa de mercado, keywords
  | 'reuniao'             // Reuniões de planejamento
  | 'aprovacao'           // Aguardando aprovação
  | 'outro';

export type MarketingTaskStatus = 
  | 'backlog' 
  | 'in_progress' 
  | 'review' 
  | 'done';

export type MarketingCategory = 
  | 'conteudo'           // Criação de conteúdo
  | 'social_media'       // Redes sociais
  | 'email'              // Email marketing
  | 'paid_ads'           // Anúncios pagos
  | 'seo'                // SEO
  | 'analytics'          // Analytics
  | 'design'             // Design
  | 'outro';

// ===== GESTÃO DE CONTEÚDO =====

export interface ContentAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'landing-page' | 'template' | 'other';
  url: string;
  thumbnail?: string;
  fileSize?: number;
  mimeType?: string;
  
  // Organização
  tags: string[];
  category: string;
  folder?: string;
  
  // Uso
  usedInCampaigns: string[];
  downloads: number;
  views: number;
  
  // Metadata
  description?: string;
  alt?: string; // Para imagens
  duration?: number; // Para vídeos (em segundos)
  
  // Datas
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  
  // Conteúdo
  html: string;
  plainText?: string;
  thumbnail?: string;
  
  // Variáveis dinâmicas disponíveis
  variables: TemplateVariable[];
  
  // Categorização
  category: 'welcome' | 'followup' | 'nurture' | 'promotional' | 'transactional' | 'other';
  tags: string[];
  
  // Uso
  usageCount: number;
  lastUsedAt?: Date;
  
  // Métricas médias (quando enviado)
  avgOpenRate?: number;
  avgClickRate?: number;
  
  // Metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TemplateVariable {
  name: string; // Ex: "nome", "empresa", "data"
  placeholder: string; // Ex: "{nome}", "{{empresa}}"
  description: string;
  required: boolean;
  defaultValue?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'campaign_launch' | 'social_post' | 'email_send' | 'event' | 'webinar' | 'deadline' | 'meeting' | 'other';
  
  // Data e hora
  date: Date;
  startTime?: string; // "09:00"
  endTime?: string;   // "10:00"
  allDay: boolean;
  
  // Detalhes
  description?: string;
  location?: string; // Para eventos presenciais
  
  // Associações
  campaignId?: string;
  taskIds: string[];
  assignedTo: string[];
  
  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  
  // Notificações
  reminders: EventReminder[];
  
  // Metadata
  color?: string;
  url?: string; // Link relacionado
  attachments: string[];
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EventReminder {
  id: string;
  type: 'email' | 'notification' | 'sms';
  timing: number; // Minutos antes do evento
  sent: boolean;
}

export interface ContentFolder {
  id: string;
  name: string;
  parentId?: string; // Para subpastas
  color?: string;
  icon?: string;
  itemCount: number;
  createdAt: Date;
}

// ===== INTELIGÊNCIA DE LEADS =====

export type MarketingLeadStatus = 'novo' | 'nutricao' | 'mql' | 'sql' | 'desqualificado' | 'enviado_vendas';

export interface MarketingLead {
  id: string;
  name: string;
  company: string;
  email: string;
  whatsapp?: string;
  website?: string;
  
  // Marketing específico
  marketingStatus: MarketingLeadStatus;
  leadScore: number;
  source: string;
  campaignId?: string;
  channel: string;
  
  // Demografia
  jobTitle?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  
  // Tags e segmentação
  tags: string[];
  interests: string[];
  
  // Timeline de engajamento
  engagementTimeline: EngagementEvent[];
  
  // Métricas
  firstContact: Date;
  lastActivity: Date;
  totalPageViews: number;
  totalEmailOpens: number;
  totalEmailClicks: number;
  totalDownloads: number;
  
  // Status de vendas (quando enviado)
  sentToSales?: boolean;
  sentToSalesAt?: Date;
  sentToSalesBy?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EngagementEvent {
  id: string;
  type: 'page_view' | 'email_open' | 'email_click' | 'form_submit' | 'download' | 'webinar_registration' | 'webinar_attendance' | 'social_interaction';
  timestamp: Date;
  details: {
    url?: string;
    emailSubject?: string;
    formName?: string;
    assetName?: string;
    webinarName?: string;
    socialPlatform?: string;
  };
  scoreChange: number;
  campaignId?: string;
}

export interface LeadScoringRule {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  condition: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range';
    value: any;
  };
  scoreChange: number;
  active: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface MarketingMetrics {
  // Aquisição
  totalLeads: number;
  leadsByChannel: Record<string, number>;
  costPerLead: number;
  
  // Conversão
  mql: number; // Marketing Qualified Leads
  sql: number; // Sales Qualified Leads
  customers: number;
  conversionRate: number;
  
  // Financeiro
  totalSpent: number;
  revenue: number;
  roi: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  
  // Engajamento
  emailOpenRate: number;
  emailClickRate: number;
  socialEngagementRate: number;
  websiteVisitors: number;
  avgSessionDuration: number;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  investment: number;
  leadsGenerated: number;
  costPerLead: number;
  mqlConversionRate: number;
  sqlConversionRate: number;
  revenue: number;
  roi: number;
}


