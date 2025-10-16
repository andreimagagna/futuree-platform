# 🚀 Migração de localStorage para Supabase

## ⚠️ IMPORTANTE: Aplicar Migration Primeiro

Antes de usar os novos hooks, você precisa aplicar a migration no Supabase.

### Método 1: Supabase Dashboard (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Crie uma nova query
5. Copie todo o conteúdo de `supabase/migrations/20251015190000_add_user_data_tables.sql`
6. Cole na query
7. Clique em **Run** ▶️

### Método 2: Supabase CLI (se tiver configurado)

```powershell
npx supabase db push
```

---

## 📋 Mudanças Implementadas

### ✅ 1. Migration SQL Criada
**Arquivo:** `supabase/migrations/20251015190000_add_user_data_tables.sql`

Tabelas criadas:
- `user_preferences` - Preferências do usuário (profile + tema)
- `company_settings` - Configurações da empresa
- `saved_funnels` - Funis salvos
- `landing_pages` - Landing pages
- `automation_settings` - Configurações de automação

Todas com:
- ✅ RLS (Row Level Security) habilitado
- ✅ Políticas de acesso por usuário
- ✅ Triggers para updated_at
- ✅ Índices otimizados

### ✅ 2. Hooks Criados
**Arquivo:** `src/hooks/use-supabase-storage.ts`

Hooks disponíveis:

#### `useSupabaseStorage`
Substitui `useLocalStorage` para dados simples:

```tsx
// ANTES (localStorage)
const [profile, setProfile] = useLocalStorage('profileData', {
  first_name: '',
  last_name: ''
});

// DEPOIS (Supabase)
const [profile, setProfile, loading] = useSupabaseStorage('user_preferences', {
  first_name: '',
  last_name: ''
});
```

#### `useLandingPages`
Gerencia landing pages no Supabase:

```tsx
const { landingPages, saveLandingPage, deleteLandingPage, loading } = useLandingPages();

// Salvar
await saveLandingPage({
  id: 'uuid-aqui',
  name: 'Minha LP',
  components: [...]
});

// Deletar
await deleteLandingPage('uuid-aqui');
```

#### `useSavedFunnels`
Gerencia funis no Supabase:

```tsx
const { funnels, saveFunnel, deleteFunnel, loading } = useSavedFunnels();

// Salvar
await saveFunnel({
  id: 'uuid-aqui',
  name: 'Meu Funil',
  nodes: [...],
  connections: [...]
});

// Deletar
await deleteFunnel('uuid-aqui');
```

---

## 📝 Componentes a Migrar

### ⏳ Profile.tsx
```tsx
// ANTES
const [profileData, setProfileData] = useLocalStorage('profileData', {
  name: '',
  email: user?.email || '',
  phone: '',
  department: '',
  location: '',
  bio: ''
});

// DEPOIS
const [profileData, setProfileData, loading] = useSupabaseStorage('user_preferences', {
  first_name: '',
  last_name: '',
  phone: '',
  department: '',
  location: '',
  bio: ''
});
```

### ⏳ Settings.tsx
```tsx
// ANTES
const [companyData, setCompanyData] = useLocalStorage("companyData", {
  companyName: "",
  cnpj: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Brasil"
});

// DEPOIS
const [companyData, setCompanyData, loading] = useSupabaseStorage('company_settings', {
  company_name: "",
  cnpj: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Brasil"
});
```

### ⏳ ConstrutorFunil.tsx
```tsx
// ANTES
const [savedFunnels, setSavedFunnels] = useState(() => {
  const stored = localStorage.getItem('savedFunnels');
  return stored ? JSON.parse(stored) : [];
});

useEffect(() => {
  localStorage.setItem('savedFunnels', JSON.stringify(savedFunnels));
}, [savedFunnels]);

// DEPOIS
const { funnels, saveFunnel, deleteFunnel, loading } = useSavedFunnels();
```

### ⏳ EditorLandingPage.tsx
```tsx
// ANTES
const [landingPages, setLandingPages] = useState(() => {
  const stored = localStorage.getItem('landingPages');
  return stored ? JSON.parse(stored) : [];
});

// DEPOIS
const { landingPages, saveLandingPage, deleteLandingPage, loading } = useLandingPages();
```

### ⏳ Topbar.tsx (Tema)
```tsx
// ANTES
const [theme, setTheme] = useLocalStorage('theme', 'light');

// DEPOIS
const [preferences, setPreferences, loading] = useSupabaseStorage('user_preferences', {
  theme: 'light'
});

const theme = preferences.theme;
const setTheme = (newTheme) => setPreferences({ ...preferences, theme: newTheme });
```

---

## ✅ Vantagens da Migração

### 🔒 Segurança
- ✅ Dados não ficam mais no navegador
- ✅ RLS garante que usuário só acessa seus dados
- ✅ Backup automático no PostgreSQL

### 🌐 Multi-dispositivo
- ✅ Dados sincronizados entre dispositivos
- ✅ Acesse de qualquer lugar
- ✅ Não perde dados limpando cache

### 👥 Multi-usuário
- ✅ Cada usuário vê apenas seus dados
- ✅ Preparado para colaboração futura
- ✅ Logs de auditoria (created_at, updated_at)

### 📊 Performance
- ✅ Busca otimizada com índices
- ✅ Queries filtradas por usuário
- ✅ Real-time com Supabase Realtime (futuro)

---

## 🧪 Como Testar

1. **Aplicar a migration** (ver início deste doc)
2. **Fazer login** na aplicação
3. **Testar cada componente:**
   - Profile: Editar e salvar perfil
   - Settings: Configurar dados da empresa
   - Construtor: Criar e salvar funil
   - Landing Pages: Criar e salvar LP
   - Topbar: Trocar tema
4. **Verificar no Supabase:**
   - Dashboard → Table Editor
   - Ver dados salvos em cada tabela

---

## 📚 Próximos Passos

1. ✅ Aplicar migration no Supabase
2. ⏳ Migrar Profile.tsx
3. ⏳ Migrar Settings.tsx
4. ⏳ Migrar ConstrutorFunil.tsx
5. ⏳ Migrar EditorLandingPage.tsx
6. ⏳ Migrar Topbar.tsx (tema)
7. ⏳ Remover código localStorage antigo
8. ⏳ Testar tudo

---

## 🆘 Troubleshooting

### Erro: "Cannot find table 'user_preferences'"
➡️ Migration não foi aplicada. Ver início deste doc.

### Erro: "useAuthContext must be used within AuthProvider"
➡️ Componente não está dentro do AuthProvider. Verificar App.tsx.

### Dados não aparecem
➡️ Verificar se usuário está logado: `console.log(user)`

### Loading infinito
➡️ Verificar RLS policies no Supabase Dashboard

---

## 💡 Dicas

- Use `loading` para mostrar skeleton/spinner
- Dados são salvos automaticamente no Supabase
- Não precisa JSON.parse/stringify
- RLS garante segurança automática
