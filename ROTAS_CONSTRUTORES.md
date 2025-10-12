# 📍 Estrutura de Rotas - Landing Pages e Construtores

## 🎯 Resumo Executivo

O sistema possui **2 rotas principais** de construtores de marketing:

1. **`/marketing/construtor-funil`** - Construtor de Funis de Marketing (✅ ATIVO)
2. **`/marketing/landing-pages`** - Editor de Landing Pages V2 (🚧 EM BREVE)

---

## 📊 Detalhamento das Rotas

### 1️⃣ **Construtor de Funis** (`/marketing/construtor-funil`)

**Status:** ✅ **ATIVO E FUNCIONAL**

**Componente:** `ConstrutorFunil.tsx` (1.300+ linhas)

**Descrição:**
Editor visual para criar funis de marketing com múltiplas etapas e ações.

**Características:**
- 🎨 **Interface Drag-and-Drop**: Arraste etapas e ações
- 📧 **Tipos de Ação**:
  - Email
  - SMS
  - WhatsApp
  - Espera (delays)
  - Condições (if/else logic)
  - Webhook
  - Tag
  - Score
- 🔄 **Fluxo Visual**: Canvas com conexões entre etapas
- 💾 **Auto-save**: Salva automaticamente no localStorage
- 📱 **Responsivo**: Interface adaptável
- 🎭 **Glassmorphism**: Sidebar e controles com backdrop-blur

**Tecnologias:**
- React Flow (para o canvas visual)
- @dnd-kit (drag-and-drop)
- TailwindCSS com glassmorphism
- localStorage para persistência

**Funcionalidades:**
```typescript
- Criar/editar/deletar etapas
- Conectar etapas (fluxo lógico)
- Configurar delays e condições
- Adicionar múltiplas ações por etapa
- Visualização em tempo real
- Sidebar com biblioteca de componentes
- Preview do funil completo
```

**Localização do Código:**
```
src/pages/marketing/ConstrutorFunil.tsx
```

---

### 2️⃣ **Editor de Landing Pages V2** (`/marketing/landing-pages`)

**Status:** 🚧 **EM BREVE** (com Glass Overlay)

**Componente:** `EditorLandingPage.tsx` (1.357 linhas)

**Descrição:**
Sistema avançado de edição inline para criar landing pages de alta conversão.

**Características Implementadas:**
- ✏️ **Edição Inline**: Click-to-edit em todos os elementos
- ⋮⋮ **Drag-and-Drop**: Reordenar componentes e elementos
- 🎨 **20+ Componentes**:
  - **Layout**: Header, Footer, Columns, Spacer, Divider
  - **Hero/CTA**: Hero, CTA
  - **Conteúdo**: Text, Features, Stats, Progress Bars
  - **Mídia**: Image, Video, Gallery
  - **Social**: Testimonials, Social Proof
  - **Conversão**: Pricing, FAQ, Form, Countdown
- 🛠️ **Floating Toolbar**: Formatação de texto (Bold, Italic, Underline, Align, Color)
- 🖼️ **Upload de Imagens**: Background images com overlay
- 💾 **Auto-save**: Salva a cada 30s
- ↩️ **Undo/Redo**: Histórico de 50 ações
- 📐 **PropertyEditor**: Painel lateral com edição avançada
- 🎯 **Seções Prontas**: 15+ seções otimizadas para conversão

**Componentes V2 com Inline Editing:**
```typescript
✅ HeroComponentV2        - Badge, título, CTAs editáveis
✅ FeaturesComponentV2    - Features com drag-drop
✅ PricingComponentV2     - Planos + features inline
✅ TestimonialComponentV2 - Rating clicável, drag-drop
✅ FAQComponentV2         - Accordion + add/remove inline
✅ CTAComponentV2         - Background upload + overlay
```

**Componentes Editáveis Base:**
```typescript
✅ EditableText   - Universal (h1-h6, p, span)
✅ EditableButton - CTAs com 4 variantes
✅ EditableBadge  - Tags com 5 cores
```

**Sistema Central:**
```typescript
✅ InlineEditorContext    - Context Provider com toolbar
✅ GlassOverlay          - Overlay de "Em Breve"
```

**Tecnologias:**
- @dnd-kit/core + sortable (drag-drop)
- TailwindCSS com glassmorphism
- localStorage (auto-save + 50 versões)
- useUndoRedo hook
- InlineEditorProvider (Context API)

**Localização do Código:**
```
src/pages/marketing/EditorLandingPage.tsx
src/components/landing-page/
  - HeroComponentV2.tsx
  - FeaturesComponentV2.tsx
  - PricingComponentV2.tsx
  - TestimonialComponentV2.tsx
  - FAQComponentV2.tsx
  - CTAComponentV2.tsx
  - EditableText.tsx
  - EditableButton.tsx
  - EditableBadge.tsx
  - InlineEditorContext.tsx
  - PropertyEditorV2.tsx
src/utils/
  - designTokens.ts (sistema de design)
  - readySections.ts (15+ seções prontas)
```

**Por Que Está "EM BREVE"?**
Sistema completo e funcional, mas sendo finalizado para lançamento. Glass Overlay ativo para evitar uso prematuro.

---

## 🔄 Diferenças Entre os Construtores

### **Construtor de Funis** vs **Editor de Landing Pages**

| Característica | Construtor de Funis | Editor de Landing Pages |
|---------------|---------------------|------------------------|
| **Propósito** | Criar fluxos de automação | Criar páginas de conversão |
| **Visual** | Flow-based (diagrama) | Component-based (WYSIWYG) |
| **Output** | Sequência de ações | Página HTML/React |
| **Foco** | Lógica e automação | Design e conversão |
| **Tecnologia** | React Flow | Drag-drop + Inline Editing |
| **Status** | ✅ Ativo | 🚧 Em Breve |

---

## 📁 Estrutura de Arquivos

```
src/
├── pages/
│   └── marketing/
│       ├── ConstrutorFunil.tsx      (1.300 linhas - Construtor de Funis)
│       └── EditorLandingPage.tsx    (1.357 linhas - Editor LP V2)
│
├── components/
│   └── landing-page/
│       ├── V2 Components (inline editing)
│       │   ├── HeroComponentV2.tsx
│       │   ├── FeaturesComponentV2.tsx
│       │   ├── PricingComponentV2.tsx
│       │   ├── TestimonialComponentV2.tsx
│       │   ├── FAQComponentV2.tsx
│       │   └── CTAComponentV2.tsx
│       │
│       ├── Editable Base Components
│       │   ├── EditableText.tsx
│       │   ├── EditableButton.tsx
│       │   └── EditableBadge.tsx
│       │
│       ├── Context & Utils
│       │   ├── InlineEditorContext.tsx
│       │   └── PropertyEditorV2.tsx
│       │
│       └── Old Components (v1)
│           ├── HeroComponent.tsx
│           ├── FeaturesComponent.tsx
│           └── ... (outros)
│
└── utils/
    ├── designTokens.ts        (Design system com UX best practices)
    ├── readySections.ts       (15+ seções prontas de alta conversão)
    └── landingPageTemplates.ts (Templates base)
```

---

## 🎨 Glassmorphism Implementado

Ambos os construtores utilizam glassmorphism para UI moderna:

### **Construtor de Funis:**
```css
bg-white/20 backdrop-blur-sm       /* Sidebar items */
bg-background/80 backdrop-blur-md   /* Header */
```

### **Editor Landing Pages:**
```css
bg-card/80 backdrop-blur-sm         /* Cards de componentes */
bg-card/95 backdrop-blur-md         /* Link editor popup */
bg-card/95 backdrop-blur-xl         /* Floating toolbar */
bg-white/10 backdrop-blur-xl        /* CTA glass container */
bg-blue-500/90 backdrop-blur-md     /* Info badges */
```

---

## 🚀 Próximos Passos

### **Para o Editor de Landing Pages:**

**Curto Prazo:**
1. ⏳ Remover Glass Overlay quando estiver pronto
2. ⏳ Testar sistema completo
3. ⏳ Implementar crop de imagens
4. ⏳ Adicionar mais atalhos de teclado

**Médio Prazo:**
1. ⏳ Criar versões V2 dos componentes restantes (Form, Header, Footer)
2. ⏳ Rich text editor avançado
3. ⏳ Image gallery inline management
4. ⏳ Integração com backend

**Longo Prazo:**
1. ⏳ AI-powered content suggestions
2. ⏳ A/B testing inline
3. ⏳ Real-time collaboration
4. ⏳ Version history visual

---

## 📊 Estatísticas do Código

### **Construtor de Funis:**
- **1 arquivo principal**: ConstrutorFunil.tsx (1.300 linhas)
- **Features**: 8 tipos de ação, drag-drop, fluxo visual
- **Status**: ✅ Produção

### **Editor de Landing Pages V2:**
- **10 arquivos principais**: 
  - EditorLandingPage.tsx (1.357 linhas)
  - 6 componentes V2 (~300 linhas cada)
  - 3 editáveis base (~150 linhas cada)
  - InlineEditorContext (400 linhas)
- **Total**: ~2.500 linhas de código
- **Features**: 20+ componentes, inline editing, drag-drop, auto-save, undo/redo
- **Status**: 🚧 Finalização

---

## 🎯 Conclusão

**Construtor de Funis**: Sistema completo e ativo para criar automações de marketing.

**Editor de Landing Pages V2**: Sistema avançado com edição inline, glassmorphism e 20+ componentes. Aguardando lançamento oficial.

Ambos compartilham filosofia de design moderna com glassmorphism e interfaces intuitivas drag-and-drop.
