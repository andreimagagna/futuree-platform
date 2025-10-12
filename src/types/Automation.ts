// Tipos para Sistema de Automações

export type AutomationTrigger = 
  | 'lead_created'           // Quando um lead é criado
  | 'lead_qualified'         // Quando um lead é qualificado
  | 'lead_status_changed'    // Quando o status do lead muda
  | 'task_completed'         // Quando uma tarefa é completada
  | 'time_elapsed'           // Após X tempo desde um evento
  | 'no_response'            // Quando não há resposta em X tempo
  | 'email_opened'           // Quando o lead abre um email
  | 'link_clicked'           // Quando o lead clica em um link
  | 'form_submitted';        // Quando um formulário é enviado

export type AutomationAction = 
  | 'create_task'            // Criar uma tarefa
  | 'send_email'             // Enviar email
  | 'send_whatsapp'          // Enviar WhatsApp
  | 'update_lead_status'     // Atualizar status do lead
  | 'assign_to_user'         // Atribuir a um usuário
  | 'add_tag'                // Adicionar tag
  | 'update_score'           // Atualizar pontuação
  | 'create_notification';   // Criar notificação

export type AutomationCondition = {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
};

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  
  // Gatilho
  trigger: AutomationTrigger;
  triggerConfig?: {
    delay?: number;              // Atraso em minutos
    timeUnit?: 'minutes' | 'hours' | 'days';
    specificTime?: string;       // Hora específica (ex: "09:00")
  };
  
  // Condições (todas devem ser verdadeiras)
  conditions?: AutomationCondition[];
  
  // Ações a serem executadas
  actions: {
    type: AutomationAction;
    config: any;                 // Configuração específica da ação
    delay?: number;              // Atraso antes de executar (em minutos)
  }[];
  
  // Estatísticas
  executionCount: number;
  lastExecutedAt?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Régua de Follow-up específica
export interface FollowUpSequence {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  
  // Quando iniciar a sequência
  trigger: 'lead_created' | 'lead_qualified' | 'no_response';
  
  // Etapas da régua
  steps: FollowUpStep[];
  
  // Condições para aplicar
  conditions?: AutomationCondition[];
  
  // Estatísticas
  leadsInSequence: number;
  completionRate: number;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface FollowUpStep {
  id: string;
  order: number;
  delayDays: number;            // Dias após o passo anterior (ou trigger)
  delayHours?: number;          // Horas adicionais
  
  action: 'email' | 'whatsapp' | 'call' | 'task';
  
  // Configuração da ação
  config: {
    templateId?: string;        // ID do template de email/whatsapp
    subject?: string;
    message?: string;
    taskTitle?: string;
    taskDescription?: string;
    taskPriority?: 'low' | 'medium' | 'high';
    assignTo?: string;
  };
  
  // Condições para executar este passo
  conditions?: AutomationCondition[];
  
  // Parar sequência se...
  stopIf?: {
    leadResponded?: boolean;
    statusChanged?: string[];
    taskCompleted?: boolean;
  };
}

// Histórico de execução
export interface AutomationExecution {
  id: string;
  automationId: string;
  automationName: string;
  
  leadId: string;
  leadName: string;
  
  triggeredBy: AutomationTrigger;
  triggeredAt: string;
  
  actions: {
    type: AutomationAction;
    status: 'pending' | 'completed' | 'failed';
    executedAt?: string;
    error?: string;
    result?: any;
  }[];
  
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  completedAt?: string;
}

// Templates pré-configurados
export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'follow-up' | 'nurturing' | 'onboarding' | 'reengagement' | 'other';
  icon: string;
  
  // Configuração que será copiada
  rule: Partial<AutomationRule>;
}

// Configurações de automação
export interface AutomationSettings {
  enabled: boolean;
  maxExecutionsPerDay?: number;
  workingHours?: {
    start: string;  // "09:00"
    end: string;    // "18:00"
  };
  workingDays?: number[];  // 0-6 (domingo a sábado)
  timezone?: string;
}
