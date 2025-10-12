import { AutomationRule, FollowUpSequence, AutomationTemplate, AutomationExecution } from '@/types/Automation';

// Inicializar sem regras - usuário criará usando templates
export const mockAutomationRules: AutomationRule[] = [];

// Inicializar sem sequências - usuário criará usando templates
export const mockFollowUpSequences: FollowUpSequence[] = [];

export const mockAutomationTemplates: AutomationTemplate[] = [
  {
    id: 't1',
    name: 'Régua Completa - 8 Tentativas',
    description: 'Sequência de 14 dias com 8 pontos de contato alternando Ligação, WhatsApp e Email',
    category: 'follow-up',
    icon: '📞',
    rule: {
      name: 'Régua Completa - 8 Tentativas',
      description: 'Automação com 8 tentativas de contato ao longo de 14 dias',
      trigger: 'lead_created',
      actions: [
        {
          type: 'create_task',
          config: {
            title: '1ª Tentativa - Ligação',
            description: 'Fazer primeira ligação para o lead',
            priority: 'high',
            dueInHours: 1,
            taskType: 'call'
          },
          delay: 0
        },
        {
          type: 'create_task',
          config: {
            title: '2ª Tentativa - WhatsApp',
            description: 'Enviar mensagem via WhatsApp se não atendeu a ligação',
            priority: 'high',
            dueInHours: 4,
            taskType: 'whatsapp'
          },
          delay: 240  // 4 horas
        },
        {
          type: 'create_task',
          config: {
            title: '3ª Tentativa - Email',
            description: 'Enviar email de apresentação',
            priority: 'medium',
            dueInDays: 1,
            taskType: 'email'
          },
          delay: 1440  // 1 dia
        },
        {
          type: 'create_task',
          config: {
            title: '4ª Tentativa - Ligação',
            description: 'Segunda tentativa de ligação',
            priority: 'medium',
            dueInDays: 2,
            taskType: 'call'
          },
          delay: 2880  // 2 dias
        },
        {
          type: 'create_task',
          config: {
            title: '5ª Tentativa - WhatsApp',
            description: 'Segunda mensagem WhatsApp com proposta de valor',
            priority: 'medium',
            dueInDays: 4,
            taskType: 'whatsapp'
          },
          delay: 5760  // 4 dias
        },
        {
          type: 'create_task',
          config: {
            title: '6ª Tentativa - Email',
            description: 'Email de follow-up com case de sucesso',
            priority: 'medium',
            dueInDays: 6,
            taskType: 'email'
          },
          delay: 8640  // 6 dias
        },
        {
          type: 'create_task',
          config: {
            title: '7ª Tentativa - Ligação',
            description: 'Terceira tentativa de ligação',
            priority: 'low',
            dueInDays: 9,
            taskType: 'call'
          },
          delay: 12960  // 9 dias
        },
        {
          type: 'create_task',
          config: {
            title: '8ª Tentativa - WhatsApp (Final)',
            description: 'Última tentativa via WhatsApp antes de desqualificar',
            priority: 'low',
            dueInDays: 14,
            taskType: 'whatsapp'
          },
          delay: 20160  // 14 dias
        }
      ]
    }
  },
  {
    id: 't2',
    name: 'Régua Intensiva - 8 Tentativas em 7 Dias',
    description: 'Sequência acelerada com 8 contatos em uma semana para leads quentes',
    category: 'follow-up',
    icon: '🚀',
    rule: {
      name: 'Régua Intensiva - 8 Tentativas em 7 Dias',
      description: 'Automação intensiva para leads com alto potencial',
      trigger: 'lead_created',
      conditions: [
        {
          field: 'score',
          operator: 'greater_than',
          value: 70
        }
      ],
      actions: [
        {
          type: 'create_task',
          config: {
            title: '1ª Tentativa - Ligação Imediata',
            description: 'Lead quente! Ligar imediatamente',
            priority: 'high',
            dueInHours: 0,
            taskType: 'call'
          },
          delay: 0
        },
        {
          type: 'create_task',
          config: {
            title: '2ª Tentativa - WhatsApp',
            description: 'WhatsApp caso não atenda',
            priority: 'high',
            dueInHours: 2,
            taskType: 'whatsapp'
          },
          delay: 120  // 2 horas
        },
        {
          type: 'create_task',
          config: {
            title: '3ª Tentativa - Email',
            description: 'Email com proposta personalizada',
            priority: 'high',
            dueInHours: 6,
            taskType: 'email'
          },
          delay: 360  // 6 horas
        },
        {
          type: 'create_task',
          config: {
            title: '4ª Tentativa - Ligação',
            description: 'Segunda ligação',
            priority: 'high',
            dueInDays: 1,
            taskType: 'call'
          },
          delay: 1440  // 1 dia
        },
        {
          type: 'create_task',
          config: {
            title: '5ª Tentativa - WhatsApp',
            description: 'WhatsApp com depoimento de cliente',
            priority: 'medium',
            dueInDays: 2,
            taskType: 'whatsapp'
          },
          delay: 2880  // 2 dias
        },
        {
          type: 'create_task',
          config: {
            title: '6ª Tentativa - Email',
            description: 'Email com urgência/escassez',
            priority: 'medium',
            dueInDays: 3,
            taskType: 'email'
          },
          delay: 4320  // 3 dias
        },
        {
          type: 'create_task',
          config: {
            title: '7ª Tentativa - Ligação',
            description: 'Terceira ligação - última tentativa ativa',
            priority: 'medium',
            dueInDays: 5,
            taskType: 'call'
          },
          delay: 7200  // 5 dias
        },
        {
          type: 'create_task',
          config: {
            title: '8ª Tentativa - WhatsApp Final',
            description: 'Mensagem de despedida - última chance',
            priority: 'low',
            dueInDays: 7,
            taskType: 'whatsapp'
          },
          delay: 10080  // 7 dias
        }
      ]
    }
  },
  {
    id: 't3',
    name: 'Régua Equilibrada - 8 Tentativas Mix',
    description: 'Sequência balanceada de 10 dias com mix estratégico de canais',
    category: 'follow-up',
    icon: '⚖️',
    rule: {
      name: 'Régua Equilibrada - 8 Tentativas Mix',
      description: 'Automação equilibrada alternando entre os 3 canais de contato',
      trigger: 'lead_created',
      actions: [
        {
          type: 'create_task',
          config: {
            title: '1ª Tentativa - Email de Boas-vindas',
            description: 'Email inicial apresentando a empresa',
            priority: 'high',
            dueInHours: 1,
            taskType: 'email'
          },
          delay: 0
        },
        {
          type: 'create_task',
          config: {
            title: '2ª Tentativa - Ligação',
            description: 'Primeira ligação de qualificação',
            priority: 'high',
            dueInHours: 6,
            taskType: 'call'
          },
          delay: 360  // 6 horas
        },
        {
          type: 'create_task',
          config: {
            title: '3ª Tentativa - WhatsApp',
            description: 'WhatsApp com link para agendar reunião',
            priority: 'high',
            dueInDays: 1,
            taskType: 'whatsapp'
          },
          delay: 1440  // 1 dia
        },
        {
          type: 'create_task',
          config: {
            title: '4ª Tentativa - Email',
            description: 'Email com case de sucesso',
            priority: 'medium',
            dueInDays: 3,
            taskType: 'email'
          },
          delay: 4320  // 3 dias
        },
        {
          type: 'create_task',
          config: {
            title: '5ª Tentativa - Ligação',
            description: 'Segunda ligação - entender objeções',
            priority: 'medium',
            dueInDays: 5,
            taskType: 'call'
          },
          delay: 7200  // 5 dias
        },
        {
          type: 'create_task',
          config: {
            title: '6ª Tentativa - WhatsApp',
            description: 'WhatsApp com FAQ ou vídeo explicativo',
            priority: 'medium',
            dueInDays: 7,
            taskType: 'whatsapp'
          },
          delay: 10080  // 7 dias
        },
        {
          type: 'create_task',
          config: {
            title: '7ª Tentativa - Email',
            description: 'Email com oferta especial',
            priority: 'low',
            dueInDays: 9,
            taskType: 'email'
          },
          delay: 12960  // 9 dias
        },
        {
          type: 'create_task',
          config: {
            title: '8ª Tentativa - Ligação Final',
            description: 'Última ligação antes de marcar como não responsivo',
            priority: 'low',
            dueInDays: 10,
            taskType: 'call'
          },
          delay: 14400  // 10 dias
        }
      ]
    }
  },
  {
    id: 't4',
    name: 'Régua Agressiva - 8 Tentativas em 5 Dias',
    description: 'Sequência super intensiva para oportunidades urgentes',
    category: 'follow-up',
    icon: '🔥',
    rule: {
      name: 'Régua Agressiva - 8 Tentativas em 5 Dias',
      description: 'Automação agressiva para leads com urgência ou eventos especiais',
      trigger: 'lead_created',
      actions: [
        {
          type: 'create_task',
          config: {
            title: '1ª Tentativa - Ligação NOW',
            description: 'Contato imediato - oportunidade urgente',
            priority: 'high',
            dueInHours: 0,
            taskType: 'call'
          },
          delay: 0
        },
        {
          type: 'create_task',
          config: {
            title: '2ª Tentativa - WhatsApp',
            description: 'WhatsApp logo após primeira tentativa',
            priority: 'high',
            dueInHours: 1,
            taskType: 'whatsapp'
          },
          delay: 60  // 1 hora
        },
        {
          type: 'create_task',
          config: {
            title: '3ª Tentativa - Email',
            description: 'Email de urgência',
            priority: 'high',
            dueInHours: 3,
            taskType: 'email'
          },
          delay: 180  // 3 horas
        },
        {
          type: 'create_task',
          config: {
            title: '4ª Tentativa - Ligação',
            description: 'Segunda ligação no mesmo dia',
            priority: 'high',
            dueInHours: 8,
            taskType: 'call'
          },
          delay: 480  // 8 horas
        },
        {
          type: 'create_task',
          config: {
            title: '5ª Tentativa - WhatsApp',
            description: 'WhatsApp dia 2',
            priority: 'high',
            dueInDays: 1,
            taskType: 'whatsapp'
          },
          delay: 1440  // 1 dia
        },
        {
          type: 'create_task',
          config: {
            title: '6ª Tentativa - Email',
            description: 'Email dia 3',
            priority: 'medium',
            dueInDays: 2,
            taskType: 'email'
          },
          delay: 2880  // 2 dias
        },
        {
          type: 'create_task',
          config: {
            title: '7ª Tentativa - Ligação',
            description: 'Terceira ligação dia 4',
            priority: 'medium',
            dueInDays: 3,
            taskType: 'call'
          },
          delay: 4320  // 3 dias
        },
        {
          type: 'create_task',
          config: {
            title: '8ª Tentativa - WhatsApp Final',
            description: 'Última tentativa dia 5',
            priority: 'medium',
            dueInDays: 4,
            taskType: 'whatsapp'
          },
          delay: 5760  // 4 dias
        }
      ]
    }
  }
];

// Histórico zerado - sem execuções
export const mockAutomationExecutions: AutomationExecution[] = [];
