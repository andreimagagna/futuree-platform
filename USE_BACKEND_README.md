# Hook useBackend - Guia Simples

## O que é?

Um hook unificado e simples para fazer operações CRUD no Supabase, substituindo todos os hooks complexos anteriores.

## Por que usar?

- ✅ **API simples e consistente**
- ✅ **Menos código boilerplate**
- ✅ **Gerenciamento automático de loading/error**
- ✅ **Suporte a realtime**
- ✅ **TypeScript completo**
- ✅ **Toasts automáticos de sucesso/erro**

## Como usar

### 1. Importação

```typescript
import { useBackend, useLeads, useCompanies, useTasks } from '@/hooks/use-backend';
```

### 2. Uso básico

```typescript
function MyComponent() {
  const { data, loading, error, create, update, remove } = useBackend({
    table: 'leads',
    orderBy: { column: 'created_at', ascending: false }
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          <span>{item.nome}</span>
          <button onClick={() => update(item.id, { nome: 'Novo nome' })}>
            Editar
          </button>
          <button onClick={() => remove(item.id)}>
            Remover
          </button>
        </div>
      ))}

      <button onClick={() => create({ nome: 'Novo item' })}>
        Criar
      </button>
    </div>
  );
}
```

### 3. Com filtros

```typescript
const { data: myLeads } = useBackend({
  table: 'leads',
  filters: { owner_id: user?.id },
  orderBy: { column: 'created_at', ascending: false }
});
```

### 4. Com realtime

```typescript
const { data: leads } = useBackend({
  table: 'leads',
  realtime: true // Atualiza automaticamente quando outros usuários mudam
});
```

### 5. Hooks específicos

```typescript
// Para leads
const { data: leads, create, update, remove } = useLeads();

// Para empresas
const { data: companies } = useCompanies();

// Para tarefas
const { data: tasks } = useTasks();
```

### 6. Com callbacks

```typescript
const { data } = useBackend({
  table: 'leads',
  onSuccess: (data) => console.log('Dados carregados:', data),
  onError: (error) => console.error('Erro:', error)
});
```

## Migração dos hooks antigos

### Antes (useLeadsCrud)
```typescript
const { createLead, updateLead, deleteLead, leads, loading } = useLeadsCrud();
```

### Depois (useBackend)
```typescript
const { data: leads, loading, create: createLead, update: updateLead, remove: deleteLead } = useBackend({
  table: 'leads',
  orderBy: { column: 'created_at', ascending: false }
});
```

### Antes (useSupabaseStorage)
```typescript
const [profile, setProfile] = useSupabaseStorage('user_preferences', defaultProfile);
```

### Depois (useBackend)
```typescript
const { data: [profile], update } = useBackend({
  table: 'user_preferences',
  filters: { id: user?.id },
  limit: 1
});
```

## API Completa

```typescript
interface UseBackendOptions<T> {
  table: string;           // Nome da tabela
  select?: string;         // Campos a selecionar (default: '*')
  filters?: Record<string, any>; // Filtros a aplicar
  orderBy?: { column: string; ascending?: boolean }; // Ordenação
  limit?: number;          // Limite de resultados
  realtime?: boolean;      // Habilitar realtime (default: false)
  onError?: (error: any) => void;   // Callback de erro
  onSuccess?: (data: T[]) => void;  // Callback de sucesso
}

interface UseBackendReturn<T> {
  data: T[];                    // Dados carregados
  loading: boolean;             // Estado de loading
  error: string | null;         // Erro (se houver)
  create: (item: Partial<T>) => Promise<T | null>;     // Criar item
  update: (id: string, updates: Partial<T>) => Promise<T | null>; // Atualizar item
  remove: (id: string) => Promise<boolean>;            // Remover item
  refresh: () => Promise<void>; // Recarregar dados
  clearError: () => void;       // Limpar erro
}
```

## Benefícios

1. **Simplicidade**: Uma API para todas as operações CRUD
2. **Consistência**: Mesmo padrão em toda a aplicação
3. **Performance**: Gerenciamento inteligente de estado
4. **DX**: TypeScript completo e autocomplete
5. **Realtime**: Suporte nativo a mudanças em tempo real
6. **Error handling**: Tratamento automático de erros com toasts
7. **Flexibilidade**: Filtros, ordenação, limites customizáveis