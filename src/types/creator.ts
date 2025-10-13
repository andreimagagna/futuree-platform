// ============================================================================
// CREATOR SOLUTIONS - TYPES
// ============================================================================

// Identidade e Narrativa do Criador
export interface CreatorIdentity {
  id: string;
  name: string;
  positioning: string; // Posicionamento no mercado
  personality: string[]; // Traços de personalidade (ex: "autêntico", "inspirador", "técnico")
  purpose: string; // Propósito/missão do criador
  voiceAndTone: {
    voice: string; // Voz (ex: "amigável", "profissional", "irreverente")
    tone: string; // Tom (ex: "motivacional", "educativo", "humorístico")
    vocabulary: string[]; // Palavras/expressões características
  };
  storytelling: {
    origin: string; // De onde veio
    journey: string; // Jornada até aqui
    impact: string; // Impacto que deseja gerar
    differentials: string[]; // Diferenciais únicos
  };
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Pilar de Conteúdo
export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  color: string; // Para identificação visual
  objective: 'attraction' | 'authority' | 'engagement' | 'conversion';
  keywords: string[];
  examples: string[]; // Exemplos de temas neste pilar
  frequency?: number; // Frequência semanal ideal
}

// Canal de Publicação
export type SocialChannel = 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'linkedin' | 'blog' | 'podcast' | 'other';

// Formato de Conteúdo
export type ContentFormat = 'post' | 'reel' | 'story' | 'carousel' | 'video' | 'short' | 'article' | 'thread' | 'live' | 'podcast';

// Status do Conteúdo
export type ContentStatus = 'idea' | 'draft' | 'produced' | 'published';

// Item do Calendário Editorial
export interface EditorialCalendarItem {
  id: string;
  title: string;
  description: string;
  pillarId: string; // Referência ao pilar
  channel: SocialChannel;
  format: ContentFormat;
  scheduledDate: string;
  status: ContentStatus;
  storytelling?: {
    hook: string; // Gancho inicial
    story: string; // História/contexto
    value: string; // Valor/aprendizado
    cta: string; // Call to Action
  };
  hashtags?: string[];
  metadata?: {
    thumbnailUrl?: string;
    durationMinutes?: number;
    collaborators?: string[];
  };
  metrics?: ContentMetrics;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Métrica de Conteúdo
export interface ContentMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  reach?: number;
  engagement?: number; // Taxa de engajamento (%)
  conversions?: number;
  learnings?: string[]; // Aprendizados desta publicação
  performanceRating?: 1 | 2 | 3 | 4 | 5; // Auto-avaliação
}

// Ideia de Conteúdo (Brainstorm)
export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  pillarId?: string;
  inspiration?: string; // Fonte de inspiração (tendência, concorrente, etc)
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  status: ContentStatus;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Tendência
export interface Trend {
  id: string;
  name: string;
  description: string;
  source: string; // Onde foi identificada
  relevance: 'low' | 'medium' | 'high';
  expiresAt?: string; // Data de validade da tendência
  tags: string[];
  appliedInContent?: string[]; // IDs de conteúdos que usaram essa tendência
  createdAt: string;
}

// Template de Storytelling
export interface StorytellingTemplate {
  id: string;
  name: string;
  description: string;
  structure: {
    hook: string; // Template para gancho
    story: string; // Template para história
    value: string; // Template para valor
    cta: string; // Template para CTA
  };
  useCase: string; // Quando usar este template
  examples?: string[];
}

// Performance Summary
export interface PerformanceSummary {
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  totalPublications: number;
  byChannel: Record<SocialChannel, number>;
  byPillar: Record<string, number>;
  topPerformers: EditorialCalendarItem[];
  averageEngagement: number;
  totalReach: number;
  keyLearnings: string[];
  improvements: string[];
}

// Creator Workspace (Estado Global)
export interface CreatorWorkspace {
  identity: CreatorIdentity | null;
  pillars: ContentPillar[];
  calendar: EditorialCalendarItem[];
  ideas: ContentIdea[];
  trends: Trend[];
  templates: StorytellingTemplate[];
  performanceSummaries: PerformanceSummary[];
}
