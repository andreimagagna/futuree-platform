// ============================================
// TIPOS DO AGENTE SDR DE IA PARA WHATSAPP
// ============================================

// ========== LEAD & CHAT MEMORY ==========
export interface Lead {
  id: string;
  number: string; // Número WhatsApp: 55119...
  created_at: string;
  timeout: string | null; // Controle de atendimento humano
  crm_id?: string | null; // ID do lead no CRM principal
  name?: string;
  email?: string;
  last_interaction?: string;
}

export interface ChatMessage {
  role: 'human' | 'ai' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatMemory {
  session_id: string; // number do lead
  history: ChatMessage[];
  updated_at?: string;
}

// ========== WHATSAPP / EVOLUTION API ==========
export interface WhatsAppWebhook {
  event: string;
  instance: string;
  data: WhatsAppMessageData;
}

export interface WhatsAppMessageData {
  key: {
    remoteJid: string; // Número do usuário
    fromMe: boolean;
    id: string;
  };
  pushName?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
    audioMessage?: {
      url?: string;
      mimetype?: string;
      ptt?: boolean;
    };
    imageMessage?: {
      url?: string;
      caption?: string;
      mimetype?: string;
    };
  };
  messageType: 'conversation' | 'extendedTextMessage' | 'audioMessage' | 'imageMessage';
  messageTimestamp: number;
}

export interface EvolutionSendTextRequest {
  number: string;
  text: string;
  delay?: number; // Delay em ms
}

export interface EvolutionSendMediaRequest {
  number: string;
  mediatype: 'image' | 'audio' | 'video' | 'document';
  media: string; // URL ou base64
  caption?: string;
  fileName?: string;
}

// ========== COHERE ==========
export interface CohereMessage {
  role: 'USER' | 'CHATBOT' | 'SYSTEM';
  content: string;
}

export interface CohereTool {
  name: string;
  description: string;
  parameter_definitions: {
    [key: string]: {
      description: string;
      type: string;
      required: boolean;
    };
  };
}

export interface CohereToolCall {
  name: string;
  parameters: Record<string, any>;
}

export interface CohereResponse {
  text: string;
  tool_calls?: CohereToolCall[];
  finish_reason: 'COMPLETE' | 'MAX_TOKENS' | 'ERROR' | 'TOOL_CALL';
  generation_id?: string;
}

export interface CohereRequest {
  message: string;
  chat_history?: CohereMessage[];
  tools?: CohereTool[];
  temperature?: number;
  max_tokens?: number;
  preamble?: string; // System prompt
}

// ========== AGENDA / CALENDAR ==========
export interface AvailabilitySlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  day_of_week: string;
  available: boolean;
}

export interface MeetingBooking {
  id?: string;
  lead_id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ========== BUFFER DE DIGITAÇÃO ==========
export interface TypingBuffer {
  session_id: string;
  messages: string[];
  last_message_at: number; // timestamp
  timeout_id?: NodeJS.Timeout;
}

// ========== PROCESSAMENTO DE MÍDIA ==========
export interface ProcessedMessage {
  session_id: string;
  content: string;
  type: 'text' | 'audio' | 'image';
  original_type: string;
  timestamp: number;
}

export interface STTResponse {
  text: string;
  language?: string;
  confidence?: number;
}

export interface VisionResponse {
  description: string;
  objects?: string[];
  text?: string;
}

// ========== CONTROLE DO AGENTE ==========
export interface AgentConfig {
  enabled: boolean;
  auto_respond: boolean;
  qualify_leads: boolean;
  human_takeover_timeout: number; // em minutos (padrão: 15)
  typing_buffer_delay: number; // em segundos (padrão: 7)
  max_tokens_per_response: number;
  temperature: number;
  business_hours_only: boolean;
  business_hours_start?: string; // "09:00"
  business_hours_end?: string; // "18:00"
}

export interface AgentStats {
  total_conversations: number;
  active_conversations: number;
  messages_sent_today: number;
  messages_received_today: number;
  meetings_scheduled_today: number;
  average_response_time: number; // em segundos
  human_takeovers: number;
}

// ========== RESPOSTAS DA API ==========
export interface WebhookProcessResult {
  success: boolean;
  message: string;
  lead_id?: string;
  response_sent?: boolean;
  human_mode?: boolean;
  error?: string;
}

export interface ToolExecutionResult {
  success: boolean;
  data: any;
  error?: string;
}
