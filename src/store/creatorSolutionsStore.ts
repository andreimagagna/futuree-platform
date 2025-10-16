import { create } from 'zustand';
import type {
  CreatorWorkspace,
  CreatorIdentity,
  ContentPillar,
  EditorialCalendarItem,
  ContentIdea,
  Trend,
  StorytellingTemplate,
  PerformanceSummary,
} from '@/types/creator';

interface CreatorSolutionsStore extends CreatorWorkspace {
  // Identity Actions
  setIdentity: (identity: CreatorIdentity) => void;
  updateIdentity: (updates: Partial<CreatorIdentity>) => void;
  
  // Pillars Actions
  addPillar: (pillar: ContentPillar) => void;
  updatePillar: (id: string, updates: Partial<ContentPillar>) => void;
  deletePillar: (id: string) => void;
  
  // Calendar Actions
  addCalendarItem: (item: EditorialCalendarItem) => void;
  updateCalendarItem: (id: string, updates: Partial<EditorialCalendarItem>) => void;
  deleteCalendarItem: (id: string) => void;
  moveCalendarItem: (id: string, newDate: string) => void;
  updateContentStatus: (id: string, status: EditorialCalendarItem['status']) => void;
  addMetricsToContent: (id: string, metrics: EditorialCalendarItem['metrics']) => void;
  
  // Ideas Actions
  addIdea: (idea: ContentIdea) => void;
  updateIdea: (id: string, updates: Partial<ContentIdea>) => void;
  deleteIdea: (id: string) => void;
  moveIdeaToCalendar: (ideaId: string, calendarItem: Omit<EditorialCalendarItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Trends Actions
  addTrend: (trend: Trend) => void;
  updateTrend: (id: string, updates: Partial<Trend>) => void;
  deleteTrend: (id: string) => void;
  
  // Templates Actions
  addTemplate: (template: StorytellingTemplate) => void;
  updateTemplate: (id: string, updates: Partial<StorytellingTemplate>) => void;
  deleteTemplate: (id: string) => void;
  generateStorytellingFromTemplate: (templateId: string, context: any) => EditorialCalendarItem['storytelling'];
  
  // Performance Actions
  addPerformanceSummary: (summary: PerformanceSummary) => void;
  
  // Utility Actions
  clearAll: () => void;
  exportData: () => CreatorWorkspace;
  importData: (data: Partial<CreatorWorkspace>) => void;
}

const initialState: CreatorWorkspace = {
  identity: null,
  pillars: [],
  calendar: [],
  ideas: [],
  trends: [],
  templates: [
    // Templates padrão de storytelling
    {
      id: 'template-1',
      name: 'Jornada Pessoal',
      description: 'Compartilhe sua jornada e transformação pessoal',
      structure: {
        hook: 'Há [tempo] atrás, eu estava [situação problema]...',
        story: 'Foi quando [evento transformador] aconteceu e mudou tudo...',
        value: 'O que aprendi foi que [aprendizado/insight]...',
        cta: 'E você, já passou por algo assim? Conta nos comentários!',
      },
      useCase: 'Conteúdos de conexão emocional e autoridade',
    },
    {
      id: 'template-2',
      name: 'Problema → Solução',
      description: 'Apresente um problema comum e sua solução',
      structure: {
        hook: 'Se você sente [problema/dor], isso é para você.',
        story: 'Muita gente não sabe, mas [contexto do problema]...',
        value: 'A solução é simples: [passo a passo ou dica]',
        cta: 'Salva esse post e coloca em prática hoje!',
      },
      useCase: 'Conteúdos educativos e de autoridade',
    },
    {
      id: 'template-3',
      name: 'Bastidores e Processo',
      description: 'Mostre os bastidores do seu trabalho',
      structure: {
        hook: 'Você pediu, tá aqui: como eu faço [processo]',
        story: 'Primeiro, [passo 1]. Depois [passo 2]. E por fim [passo 3].',
        value: 'O segredo está em [insight/diferencial]',
        cta: 'Quer mais conteúdos assim? Me segue!',
      },
      useCase: 'Conteúdos de engajamento e proximidade',
    },
  ],
  performanceSummaries: [],
};

export const useCreatorSolutions = create<CreatorSolutionsStore>()(
  (set, get) => ({
      ...initialState,

      // Identity
      setIdentity: (identity) => set({ identity }),
      updateIdentity: (updates) =>
        set((state) => ({
          identity: state.identity ? { ...state.identity, ...updates, updatedAt: new Date().toISOString() } : null,
        })),

      // Pillars
      addPillar: (pillar) => set((state) => ({ pillars: [...state.pillars, pillar] })),
      updatePillar: (id, updates) =>
        set((state) => ({
          pillars: state.pillars.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePillar: (id) => set((state) => ({ pillars: state.pillars.filter((p) => p.id !== id) })),

      // Calendar
      addCalendarItem: (item) =>
        set((state) => ({
          calendar: [...state.calendar, { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
        })),
      updateCalendarItem: (id, updates) =>
        set((state) => ({
          calendar: state.calendar.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
          ),
        })),
      deleteCalendarItem: (id) => set((state) => ({ calendar: state.calendar.filter((item) => item.id !== id) })),
      moveCalendarItem: (id, newDate) =>
        set((state) => ({
          calendar: state.calendar.map((item) =>
            item.id === id ? { ...item, scheduledDate: newDate, updatedAt: new Date().toISOString() } : item
          ),
        })),
      updateContentStatus: (id, status) =>
        set((state) => ({
          calendar: state.calendar.map((item) =>
            item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
          ),
        })),
      addMetricsToContent: (id, metrics) =>
        set((state) => ({
          calendar: state.calendar.map((item) =>
            item.id === id ? { ...item, metrics, updatedAt: new Date().toISOString() } : item
          ),
        })),

      // Ideas
      addIdea: (idea) =>
        set((state) => ({
          ideas: [...state.ideas, { ...idea, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
        })),
      updateIdea: (id, updates) =>
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id ? { ...idea, ...updates, updatedAt: new Date().toISOString() } : idea
          ),
        })),
      deleteIdea: (id) => set((state) => ({ ideas: state.ideas.filter((idea) => idea.id !== id) })),
      moveIdeaToCalendar: (ideaId, calendarItem) => {
        const idea = get().ideas.find((i) => i.id === ideaId);
        if (!idea) return;

        const newCalendarItem: EditorialCalendarItem = {
          ...calendarItem,
          id: `content-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          calendar: [...state.calendar, newCalendarItem],
          ideas: state.ideas.filter((i) => i.id !== ideaId),
        }));
      },

      // Trends
      addTrend: (trend) => set((state) => ({ trends: [...state.trends, trend] })),
      updateTrend: (id, updates) =>
        set((state) => ({
          trends: state.trends.map((trend) => (trend.id === id ? { ...trend, ...updates } : trend)),
        })),
      deleteTrend: (id) => set((state) => ({ trends: state.trends.filter((trend) => trend.id !== id) })),

      // Templates
      addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((template) => (template.id === id ? { ...template, ...updates } : template)),
        })),
      deleteTemplate: (id) => set((state) => ({ templates: state.templates.filter((template) => template.id !== id) })),
      generateStorytellingFromTemplate: (templateId, context) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) return undefined;

        // Aqui você pode adicionar lógica mais sofisticada de geração
        // Por enquanto, retorna a estrutura do template
        return {
          hook: template.structure.hook,
          story: template.structure.story,
          value: template.structure.value,
          cta: template.structure.cta,
        };
      },

      // Performance
      addPerformanceSummary: (summary) =>
        set((state) => ({ performanceSummaries: [...state.performanceSummaries, summary] })),

      // Utility
      clearAll: () => set(initialState),
      exportData: () => get(),
      importData: (data) => set((state) => ({ ...state, ...data })),
    })
);
