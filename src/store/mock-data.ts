import { Lead, Task, Note } from './model-types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    company: 'Tech Corp',
    email: 'joao@techcorp.com',
    whatsapp: '(11) 99999-0001',
    stage: 'qualify',
    score: 85,
    owner: 'Você',
    source: 'Website',
    lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextAction: new Date(Date.now() + 24 * 60 * 60 * 1000),
    tags: ['hot', 'enterprise'],
    notes: 'Cliente muito interessado em integração',
    dealValue: 45000,
    products: [
      { id: 'p1', name: 'Software ERP', price: 30000, quantity: 1 },
      { id: 'p2', name: 'Consultoria', price: 15000, quantity: 1 },
    ],
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: false,
      qualifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      qualifiedBy: 'Você',
    },
  },
  {
    id: '2',
    name: 'Maria Santos',
    company: 'Innovation Labs',
    email: 'maria@innovation.com',
    whatsapp: '(11) 99999-0002',
    stage: 'contact',
    score: 92,
    owner: 'Você',
    source: 'LinkedIn',
    lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nextAction: new Date(Date.now() + 2 * 60 * 60 * 1000),
    tags: ['hot', 'startup'],
    notes: 'Precisa de demo',
    dealValue: 12500,
    products: [
      { id: 'p3', name: 'Licença SaaS Anual', price: 12500, quantity: 1 },
    ],
    bant: {
      budget: true,
      authority: false,
      need: true,
      timeline: true,
      qualifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      qualifiedBy: 'Você',
    },
  },
  {
    id: '3',
    name: 'Pedro Costa',
    company: 'Digital Solutions',
    email: 'pedro@digital.com',
    whatsapp: '(11) 99999-0003',
    stage: 'proposal',
    score: 78,
    owner: 'Você',
    source: 'Indicação',
    lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['warm'],
    notes: 'Aguardando orçamento',
    dealValue: 89000,
    products: [
      { id: 'p4', name: 'Sistema Customizado', price: 75000, quantity: 1 },
      { id: 'p5', name: 'Treinamento', price: 7000, quantity: 2 },
    ],
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true,
      qualifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      qualifiedBy: 'Você',
    },
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Enviar proposta comercial para Tech Corp',
    leadId: '1',
    priority: 'P1',
    status: 'in_progress',
    dueDate: new Date(),
    dueTime: '14:00',
    assignee: 'Você',
    tags: ['proposta', 'urgente'],
    description: 'Incluir detalhes de integração e pricing',
    checklist: [
      { id: '1', text: 'Revisar preços', done: true },
      { id: '2', text: 'Adicionar casos de uso', done: false },
    ],
  },
  {
    id: '2',
    title: 'Demo do produto para Innovation Labs',
    leadId: '2',
    priority: 'P1',
    status: 'backlog',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    dueTime: '10:00',
    assignee: 'Você',
    tags: ['demo'],
    description: 'Preparar ambiente de demonstração',
    checklist: [],
  },
  {
    id: '3',
    title: 'Follow-up com Digital Solutions',
    leadId: '3',
    priority: 'P2',
    status: 'backlog',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    assignee: 'Você',
    tags: ['follow-up'],
    description: 'Verificar se receberam a proposta',
    checklist: [],
  },
];

export const mockNotes: Note[] = [
  {
    id: '1',
    leadId: '1',
    content: 'Cliente mencionou que o budget para o projeto é de $5k.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    createdBy: 'Você',
  },
  {
    id: '2',
    leadId: '2',
    content: 'A decisora principal, Ana, está de férias até dia 20.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdBy: 'Você',
  }
];

export const mockMeetings = [
  {
    id: '1',
    title: 'Demo Tech Corp',
    description: 'Apresentação da solução para time técnico',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: 60,
    attendees: ['João Silva', 'Maria Tech'],
    leadId: '1'
  },
  {
    id: '2',
    title: 'Follow-up Innovation Labs',
    description: 'Alinhamento de próximos passos',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    duration: 30,
    attendees: ['Maria Santos'],
    leadId: '2'
  }
];

export const mockActivities = [
  {
    id: '1',
    description: 'Email enviado: Proposta Comercial',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'email',
    leadId: '1'
  },
  {
    id: '2',
    description: 'Ligação realizada (2min)',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'call',
    leadId: '2'
  },
  {
    id: '3',
    description: 'Reunião realizada: Demo inicial',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: 'meeting',
    leadId: '3'
  }
];
