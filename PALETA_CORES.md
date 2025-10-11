# 🎨 Paleta de Cores - Design System

## Visão Geral
Este documento define a paleta de cores oficial do projeto, baseada no tema **Neutral Earthy** (Cinza, Marrom, Preto, Bege, Branco) implementado no Funil.

## 🎯 Cores Principais

### Primary (Marrom Quente)
```css
--primary: 25 40% 35%
--primary-foreground: 40 20% 98%
--primary-hover: 25 40% 30%
--primary-light: 25 40% 95%
```
**Uso**: Ações principais, destaque de CTAs, bordas de foco

**Tailwind Classes**:
- `bg-primary` | `text-primary` | `border-primary`
- `hover:bg-primary-hover`

---

### Secondary (Bege Claro)
```css
--secondary: 40 15% 92%
--secondary-foreground: 0 0% 15%
```
**Uso**: Superfícies secundárias, backgrounds alternativos

**Tailwind Classes**:
- `bg-secondary` | `text-secondary-foreground`

---

### Accent (Cinza-Marrom Escuro)
```css
--accent: 30 10% 45%
--accent-foreground: 40 20% 98%
--accent-light: 30 10% 90%
```
**Uso**: Elementos de destaque, badges, ícones importantes

**Tailwind Classes**:
- `bg-accent` | `text-accent` | `border-accent`

---

## 🚦 Cores de Status

### Success (Verde Terroso)
```css
--success: 140 30% 40%
--success-foreground: 0 0% 100%
--success-light: 140 30% 95%
```
**Uso**: Sucesso, vendas ganhas, metas atingidas, leads qualificados

**Tailwind Classes**:
- `bg-success` | `text-success` | `border-success`

**Exemplos**:
- Conversões ≥ 70%
- Leads com status "won"
- Tarefas concluídas
- Score BANT ≥ 75

---

### Warning (Laranja/Amarelo Quente)
```css
--warning: 35 60% 55%
--warning-foreground: 0 0% 15%
--warning-light: 35 60% 95%
```
**Uso**: Atenção necessária, prazos próximos, conversões médias

**Tailwind Classes**:
- `bg-warning` | `text-warning` | `border-warning`

**Exemplos**:
- Conversões entre 40-70%
- Tarefas com prazo hoje
- Score BANT 50-74
- Leads em negociação

---

### Destructive (Vermelho Terroso)
```css
--destructive: 0 50% 45%
--destructive-foreground: 0 0% 100%
--destructive-light: 0 50% 95%
```
**Uso**: Erros, alertas críticos, conversões baixas, prazos vencidos

**Tailwind Classes**:
- `bg-destructive` | `text-destructive` | `border-destructive`

**Exemplos**:
- Conversões < 40%
- Leads em risco (14+ dias sem contato)
- Tarefas atrasadas
- Score BANT < 50
- Prioridade P1

---

### Info (Cinza Azulado)
```css
--info: 200 15% 45%
--info-foreground: 0 0% 100%
--info-light: 200 15% 95%
```
**Uso**: Informações gerais, tooltips, mensagens neutras

**Tailwind Classes**:
- `bg-info` | `text-info` | `border-info`

---

## 🎨 Cores Neutras

### Background e Foreground
```css
--background: 40 20% 97%
--foreground: 0 0% 15%
```

### Muted (Silenciado)
```css
--muted: 40 10% 94%
--muted-foreground: 0 0% 45%
```
**Uso**: Textos secundários, labels, placeholders

### Border e Input
```css
--border: 30 8% 85%
--input: 40 10% 94%
```

---

## 📋 Mapeamento de Prioridades

### Tarefas
- **P1 (Alta)**: `bg-destructive` / `text-destructive`
- **P2 (Média)**: `bg-warning` / `text-warning`
- **P3 (Baixa)**: `bg-accent` / `text-accent` ou `bg-muted`

### Status de Tarefas
- **Backlog**: `bg-muted` / `border-muted-foreground`
- **In Progress**: `bg-accent/10` / `border-accent`
- **Review**: `bg-warning/10` / `border-warning`
- **Done**: `bg-success/10` / `border-success`

---

## 🎯 Funil - Categorias

### Topo
```tsx
color: 'hsl(var(--muted-foreground))'
```
- Leads novos, primeiro contato
- Cinza neutro

### Meio
```tsx
color: 'hsl(var(--accent))'
```
- Leads em qualificação
- Cinza-marrom mais escuro

### Fundo
```tsx
color: 'hsl(var(--primary))'
```
- Leads qualificados, em negociação
- Marrom principal

### Vendas
```tsx
color: 'hsl(var(--success))'
```
- Apenas leads com `status === 'won'`
- Verde terroso de sucesso

---

## 🚫 Cores Removidas

As seguintes cores foram **REMOVIDAS** da paleta e **NÃO devem ser usadas**:

- ❌ `bg-blue-*` / `text-blue-*` / `border-blue-*`
- ❌ `bg-purple-*` / `text-purple-*` / `border-purple-*`
- ❌ `bg-green-*` / `text-green-*` / `border-green-*` (usar `success` no lugar)
- ❌ `bg-orange-*` / `text-orange-*` / `border-orange-*` (usar `warning` no lugar)
- ❌ `bg-red-*` / `text-red-*` / `border-red-*` (usar `destructive` no lugar)
- ❌ `bg-yellow-*` / `text-yellow-*` / `border-yellow-*` (usar `warning` no lugar)

---

## ✅ Regras de Uso

### 1. Sempre use variáveis HSL
```tsx
// ✅ CORRETO
className="bg-primary text-primary-foreground"
color: 'hsl(var(--success))'

// ❌ ERRADO
className="bg-blue-500"
color: '#3b82f6'
```

### 2. Use opacidade com /
```tsx
// ✅ CORRETO
className="bg-primary/20 border-success/30"

// ❌ ERRADO
className="bg-primary-200 border-success-300"
```

### 3. Contexto semântico
```tsx
// ✅ CORRETO - Uso semântico
score >= 70 ? "text-success" : "text-destructive"

// ❌ ERRADO - Cor arbitrária
score >= 70 ? "text-green-600" : "text-red-600"
```

### 4. Suporte dark mode automático
```tsx
// ✅ CORRETO - Variáveis se adaptam ao tema
className="bg-card text-card-foreground"

// ❌ ERRADO - Hardcoded
className="bg-white dark:bg-gray-900"
```

---

## 📊 Exemplos de Implementação

### Score de Health (Funil)
```tsx
const getHealthColor = (score: number) => {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};
```

### Taxa de Conversão
```tsx
const getConversionColor = (rate: number) => {
  if (rate >= 70) return 'text-success';
  if (rate >= 40) return 'text-warning';
  return 'text-destructive';
};
```

### Cards com Bordas Coloridas
```tsx
<Card className="border-2 border-primary/20 hover:border-primary/40">
  {/* Conteúdo */}
</Card>

<Card className="border-2 border-success/20">
  {/* Card de sucesso */}
</Card>
```

### Badges de Status
```tsx
<Badge variant="outline" className="text-success border-success">
  Ganho
</Badge>

<Badge variant="destructive">
  Crítico
</Badge>

<Badge variant="outline" className="text-warning border-warning">
  Atenção
</Badge>
```

---

## 🔄 Arquivos Padronizados

### ✅ Componentes Atualizados
- [x] `src/components/FunnelVisual.tsx` (Referência principal)
- [x] `src/components/dashboard/TaskCard.tsx`
- [x] `src/components/tasks/TaskCalendar.tsx`
- [x] `src/components/tasks/TasksView.tsx`
- [x] `src/components/tasks/TaskListView.tsx`
- [x] `src/components/LeadCard.tsx`
- [x] `src/components/crm/LeadDetailView.tsx`

### 📝 Sistema de Temas
- [x] `src/index.css` (Definições base em HSL)

---

## 📚 Referências

- **Design System**: Monday.com inspired
- **Tema**: Neutral Earthy (Cinza, Marrom, Bege, Branco)
- **Formato**: HSL (Hue, Saturation, Lightness)
- **Framework**: Tailwind CSS + shadcn/ui

---

**Última Atualização**: 11 de Outubro de 2025
**Versão**: 2.0 - Padronização Completa
