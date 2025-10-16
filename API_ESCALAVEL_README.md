# API Escalável - Arquitetura Completa

Esta documentação descreve a arquitetura de API escalável criada para o projeto, com foco em performance, manutenibilidade e escalabilidade.

## 🏗️ Arquitetura Geral

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Hooks API     │    │   Services      │
│                 │    │                 │    │                 │
│ - useLeadsAPI() │◄──►│ - useLeads()    │◄──►│ - LeadsService  │
│ - useLeadAPI()  │    │ - useCreateLead()│    │ - BaseApiService│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▲
                                │
                    ┌─────────────────┐
                    │   Cache Layer   │
                    │                 │
                    │ - React Query   │
                    │ - Cache Keys    │
                    │ - Optimistic UI │
                    └─────────────────┘
                                ▲
                                │
                    ┌─────────────────┐
                    │ Realtime Layer  │
                    │                 │
                    │ - Supabase RT   │
                    │ - Auto-sync     │
                    │ - Live updates  │
                    └─────────────────┘
```

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   └── api.ts              # Camada de serviços base
├── hooks/
│   ├── use-api.ts          # Hooks unificados (interface principal)
│   ├── use-api-cache.ts    # Camada de cache com React Query
│   └── use-realtime.ts     # Sincronização em tempo real
└── integrations/
    └── supabase/
        └── client.ts       # Cliente Supabase
```

## 🚀 Como Usar

### Uso Básico - Leads

```tsx
import { useLeadsAPI, useLeadAPI } from '@/hooks/use-api';

function LeadsList() {
  const {
    leads,
    isLoading,
    createLead,
    updateLead,
    deleteLead,
    isCreating,
    isUpdating,
    isDeleting
  } = useLeadsAPI();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id}>
          <h3>{lead.nome}</h3>
          <button onClick={() => updateLead({ id: lead.id, updates: { nome: 'Novo nome' } })}>
            Atualizar
          </button>
          <button onClick={() => deleteLead(lead.id)}>
            Deletar
          </button>
        </div>
      ))}

      <button
        onClick={() => createLead({ nome: 'Novo Lead', email: 'teste@email.com' })}
        disabled={isCreating}
      >
        {isCreating ? 'Criando...' : 'Criar Lead'}
      </button>
    </div>
  );
}
```

### Uso com Realtime

```tsx
import { useLeadsAPI, useRealtimeSync } from '@/hooks/use-api';

function RealtimeLeadsList() {
  const leadsAPI = useLeadsAPI();

  // Ativar sincronização em tempo real
  useRealtimeSync({
    userId: 'user-123',
    enableLeads: true,
  });

  // Agora todas as mudanças são refletidas automaticamente!
  return (
    <div>
      {leadsAPI.leads.map(lead => (
        <div key={lead.id}>{lead.nome}</div>
      ))}
    </div>
  );
}
```

### Busca e Filtros

```tsx
import { useSearchAPI } from '@/hooks/use-api';

function SearchableLeads() {
  const [query, setQuery] = useState('');
  const { search, isLoading } = useSearchAPI();

  const filteredLeads = search(query, { etapa: 'qualificacao' });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar leads..."
      />

      {filteredLeads.map(lead => (
        <div key={lead.id}>{lead.nome}</div>
      ))}
    </div>
  );
}
```

## 🔧 Camadas da Arquitetura

### 1. Services Layer (`src/services/api.ts`)

Camada base que fornece operações CRUD para cada tabela:

```typescript
// Uso direto (avançado)
import { apiServices } from '@/services/api';

const leads = await apiServices.leads.query({
  filters: { owner_id: 'user-123' },
  orderBy: { column: 'created_at', ascending: false }
});

const newLead = await apiServices.leads.create({
  nome: 'João Silva',
  email: 'joao@email.com'
});
```

**Características:**
- ✅ Validação de dados
- ✅ Filtros avançados
- ✅ Paginação
- ✅ Contagem de registros
- ✅ Suporte a operadores (gte, lte, etc.)

### 2. Cache Layer (`src/hooks/use-api-cache.ts`)

Gerenciamento inteligente de cache com React Query:

```typescript
// Cache automático
const { data: leads, isLoading } = useLeads({
  filters: { owner_id: 'user-123' }
});

// Mutations com otimização
const createLead = useCreateLead();
createLead.mutate({ nome: 'Novo Lead' }); // Cache atualizado automaticamente
```

**Características:**
- ✅ Cache automático (5min stale time)
- ✅ Revalidação em background
- ✅ Retry automático em falhas
- ✅ Invalidação inteligente de cache
- ✅ Optimistic updates
- ✅ Garbage collection

### 3. Realtime Layer (`src/hooks/use-realtime.ts`)

Sincronização automática de dados:

```typescript
// Sincronização em tempo real
useRealtimeLeads(); // Atualiza automaticamente quando leads mudam

// Sincronização seletiva
useRealtimeSync({
  userId: 'user-123',
  enableLeads: true,
  enableFunnels: true,
  enableLandingPages: false,
});
```

**Características:**
- ✅ Atualização automática do cache
- ✅ Notificações toast
- ✅ Supabase Realtime
- ✅ Filtros por usuário/empresa
- ✅ Reconexão automática

### 4. Unified API Layer (`src/hooks/use-api.ts`)

Interface unificada e fácil de usar:

```typescript
// Tudo em um lugar
const {
  leads,           // Dados
  isLoading,       // Estados
  createLead,      // Ações
  updateLead,
  deleteLead,
  isCreating,      // Estados das ações
  isUpdating,
  isDeleting,
} = useLeadsAPI();
```

## 🎯 Funcionalidades Avançadas

### Paginação Infinita

```typescript
const {
  leads,
  hasNextPage,
  loadMore,
  isLoadingMore
} = useInfiniteLeadsAPI();

<button
  onClick={loadMore}
  disabled={!hasNextPage || isLoadingMore}
>
  Carregar mais
</button>
```

### Operações em Massa

```typescript
const { bulkUpdate, bulkDelete } = useBulkOperationsAPI();

// Atualizar múltiplos leads
await bulkUpdate([
  { id: '1', updates: { etapa: 'fechado' } },
  { id: '2', updates: { etapa: 'perdido' } },
]);

// Deletar múltiplos
await bulkDelete(['1', '2', '3']);
```

### Sincronização Offline

```typescript
const { isOnline, pendingChanges, sync, isSyncing } = useOfflineSyncAPI();

if (!isOnline) {
  // Modo offline - mudanças são armazenadas localmente
  createLead({ nome: 'Lead Offline' });
}

if (isOnline && pendingChanges.length > 0) {
  // Volta online - sincronizar mudanças pendentes
  sync();
}
```

### Dashboard com Dados Agregados

```typescript
const {
  totalLeads,
  myLeads,
  allLeads,
  ownerLeads,
  refetchAll
} = useDashboardAPI();

<div>
  <h2>Total de Leads: {totalLeads}</h2>
  <h3>Meus Leads: {myLeads}</h3>
  <button onClick={refetchAll}>Atualizar</button>
</div>
```

## 🔄 Estratégias de Cache

### Cache Keys Estruturados

```typescript
const CACHE_KEYS = {
  leads: {
    all: ['leads'] as const,
    lists: () => [...CACHE_KEYS.leads.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...CACHE_KEYS.leads.lists(), filters] as const,
    details: () => [...CACHE_KEYS.leads.all, 'detail'] as const,
    detail: (id: string) => [...CACHE_KEYS.leads.details(), id] as const,
  },
};
```

### Invalidação Inteligente

```typescript
// Quando criar um lead
queryClient.invalidateQueries({ queryKey: CACHE_KEYS.leads.lists() });

// Quando atualizar um lead específico
queryClient.setQueryData(CACHE_KEYS.leads.detail(id), newData);
queryClient.invalidateQueries({ queryKey: CACHE_KEYS.leads.lists() });
```

### Optimistic Updates

```typescript
const updateLead = useMutation({
  mutationFn: updateLeadAPI,
  onMutate: async ({ id, updates }) => {
    // Cancelar queries em andamento
    await queryClient.cancelQueries({ queryKey: CACHE_KEYS.leads.detail(id) });

    // Snapshot do estado anterior
    const previousLead = queryClient.getQueryData(CACHE_KEYS.leads.detail(id));

    // Aplicar mudança otimista
    queryClient.setQueryData(CACHE_KEYS.leads.detail(id), (old: any) => ({
      ...old,
      ...updates
    }));

    // Retornar rollback function
    return { previousLead };
  },
  onError: (err, variables, context) => {
    // Rollback em caso de erro
    if (context?.previousLead) {
      queryClient.setQueryData(
        CACHE_KEYS.leads.detail(variables.id),
        context.previousLead
      );
    }
  },
  onSettled: (data, error, variables) => {
    // Sempre refetch após settled
    queryClient.invalidateQueries({ queryKey: CACHE_KEYS.leads.detail(variables.id) });
  },
});
```

## 📊 Monitoramento e Performance

### Métricas de Cache

```typescript
// Hook para métricas
function useCacheMetrics() {
  const queryClient = useQueryClient();

  return {
    cacheSize: queryClient.getQueryCache().getAll().length,
    staleQueries: queryClient.getQueryCache().getAll().filter(q => q.isStale()).length,
    errorQueries: queryClient.getQueryCache().getAll().filter(q => q.state.status === 'error').length,
  };
}
```

### Logging de Performance

```typescript
// Middleware para logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onSuccess: (data, query) => {
        console.log(`Query ${query.queryKey} succeeded in ${Date.now() - query.state.dataUpdatedAt}ms`);
      },
      onError: (error, query) => {
        console.error(`Query ${query.queryKey} failed:`, error);
      },
    },
    mutations: {
      onSuccess: (data, variables, context) => {
        console.log(`Mutation succeeded:`, { data, variables });
      },
      onError: (error, variables, context) => {
        console.error(`Mutation failed:`, { error, variables });
      },
    },
  },
});
```

## 🚀 Escalabilidade

### Adicionando Novas Tabelas

1. **Adicionar service** em `src/services/api.ts`:
```typescript
export class NewTableService extends BaseApiService<'new_table'> {
  constructor() {
    super('new_table');
  }

  // Métodos específicos...
}
```

2. **Adicionar cache hooks** em `src/hooks/use-api-cache.ts`:
```typescript
export function useNewTable(options: QueryOptions = {}) {
  return useQuery({
    queryKey: CACHE_KEYS.newTable.list(options.filters || {}),
    queryFn: () => apiServices.newTable.query(options),
    // ... config
  });
}
```

3. **Adicionar realtime** em `src/hooks/use-realtime.ts`:
```typescript
export function useRealtimeNewTable() {
  // ... implementação
}
```

4. **Adicionar hook unificado** em `src/hooks/use-api.ts`:
```typescript
export function useNewTableAPI() {
  // ... interface unificada
}
```

### Estratégias de Otimização

- **Lazy Loading**: Carregar dados apenas quando necessário
- **Prefetching**: Pré-carregar dados prováveis
- **Background Sync**: Sincronizar dados em background
- **Request Deduplication**: Evitar requests duplicadas
- **Pagination**: Carregar dados em chunks
- **Virtual Scrolling**: Para listas grandes

## 🧪 Testes

### Testando Services

```typescript
import { apiServices } from '@/services/api';

describe('LeadsService', () => {
  it('should create a lead', async () => {
    const lead = await apiServices.leads.create({
      nome: 'Test Lead',
      email: 'test@email.com'
    });

    expect(lead.nome).toBe('Test Lead');
  });
});
```

### Testando Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useLeadsAPI } from '@/hooks/use-api';

describe('useLeadsAPI', () => {
  it('should load leads', async () => {
    const { result } = renderHook(() => useLeadsAPI());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.leads).toBeDefined();
  });
});
```

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado no Supabase:

```sql
-- Políticas de exemplo
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
```

### Validação de Dados

Validação implementada na camada de services:

```typescript
protected validateInsertData(data: any): void {
  if (!data.nome) {
    throw new Error('Nome é obrigatório');
  }
  // ... outras validações
}
```

## 📈 Próximos Passos

1. **GraphQL**: Migrar para GraphQL para queries mais eficientes
2. **Service Worker**: Para offline-first experience
3. **WebSockets**: Para tempo real mais avançado
4. **Edge Computing**: Para latência reduzida
5. **Analytics**: Métricas detalhadas de performance
6. **A/B Testing**: Para otimização de UX

---

Esta arquitetura fornece uma base sólida e escalável para o crescimento da aplicação, com foco em performance, manutenibilidade e experiência do usuário.