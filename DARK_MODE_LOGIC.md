# 🌓 Lógica de Inversão - Dark Mode

## 🎨 Conceito de Inversão Automática

### Light Mode (Padrão)
```
┌─────────────────────────────┐
│   Logo / Ícone Ativo        │
├─────────────────────────────┤
│  🟤 Fundo: Marrom #53392D   │
│  ⚪ Ícone: Branco           │
└─────────────────────────────┘
```

### Dark Mode (Invertido)
```
┌─────────────────────────────┐
│   Logo / Ícone Ativo        │
├─────────────────────────────┤
│  🟡 Fundo: Bege Claro       │
│  🟤 Ícone: Marrom Escuro    │
└─────────────────────────────┘
```

---

## 🔄 Como Funciona

### Variáveis CSS Reativas

#### Light Mode
```css
:root {
  --primary: 18 30% 25%;        /* 🟤 Marrom escuro */
  --primary-foreground: 0 0% 100%; /* ⚪ Branco */
}
```

#### Dark Mode
```css
.dark {
  --primary: 35 40% 75%;        /* 🟡 Bege claro */
  --primary-foreground: 20 15% 10%; /* 🟤 Marrom escuro */
}
```

### Uso nos Componentes
```tsx
// O mesmo código funciona em ambos os modos!
<div className="bg-gradient-to-br from-primary to-accent">
  <Sparkles className="text-primary-foreground" />
</div>
```

---

## ✨ Componentes com Inversão

### 1. Logo do Header
```tsx
// Light: fundo marrom + ícone branco
// Dark: fundo bege + ícone marrom
<div className="bg-gradient-to-br from-primary to-accent">
  <Sparkles className="text-primary-foreground animate-pulse" />
</div>
```

### 2. Ícones Ativos da Sidebar
```tsx
// Light: fundo marrom + ícone branco
// Dark: fundo bege + ícone marrom
<div className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
  <Icon className="w-5 h-5" />
</div>
```

### 3. Botões Primários
```tsx
// Light: fundo marrom + texto branco
// Dark: fundo bege + texto marrom
<Button className="bg-primary text-primary-foreground">
  Ação Principal
</Button>
```

### 4. Badges de Destaque
```tsx
// Light: fundo marrom + texto branco
// Dark: fundo bege + texto marrom
<Badge className="bg-primary text-primary-foreground">
  Ativo
</Badge>
```

---

## 🎯 Regras de Aplicação

### ✅ Sempre Use
- `bg-primary` para fundos principais
- `text-primary-foreground` para texto/ícones sobre `bg-primary`
- `border-primary` para bordas de destaque

### ❌ Nunca Use
- Cores hardcoded como `text-white` ou `bg-[#53392D]`
- `text-white` em elementos que devem se adaptar
- Valores HSL diretos no className

### 💡 Dica Pro
Quando um elemento tem `bg-primary`, sempre use `text-primary-foreground` para o conteúdo interno!

---

## 📊 Tabela de Conversão Automática

| Classe Tailwind          | Light Mode      | Dark Mode         |
|--------------------------|-----------------|-------------------|
| `bg-primary`             | 🟤 Marrom Escuro| 🟡 Bege Claro     |
| `text-primary`           | 🟤 Marrom Escuro| 🟡 Bege Claro     |
| `text-primary-foreground`| ⚪ Branco       | 🟤 Marrom Escuro  |
| `bg-accent`              | 🟤 Marrom Médio | 🟡 Bege Médio     |
| `text-accent`            | 🟤 Marrom Médio | 🟡 Bege Médio     |
| `bg-success`             | 🟢 Verde Escuro | 🟢 Verde Claro    |
| `bg-warning`             | 🟠 Âmbar Escuro | 🟠 Âmbar Claro    |
| `bg-destructive`         | 🔴 Vermelho Esc.| 🔴 Vermelho Claro |

---

## 🔍 Exemplos Práticos

### Exemplo 1: Card com Logo
```tsx
<Card>
  {/* Fundo se adapta automaticamente */}
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
    {/* Ícone inverte cor automaticamente */}
    <Sparkles className="h-6 w-6 text-primary-foreground" />
  </div>
</Card>
```

**Resultado:**
- Light: Fundo marrom → Ícone branco
- Dark: Fundo bege → Ícone marrom

### Exemplo 2: Botão de Ação
```tsx
<Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
  Salvar
</Button>
```

**Resultado:**
- Light: Botão marrom com texto branco
- Dark: Botão bege com texto marrom

### Exemplo 3: Badge de Status
```tsx
<Badge className="bg-primary/10 text-primary border-primary/20">
  Ativo
</Badge>
```

**Resultado:**
- Light: Fundo marrom claro, texto marrom escuro
- Dark: Fundo bege claro, texto bege claro

---

## 🎨 Paleta Completa

### Primary (Principal)
| Variável             | Light Mode         | Dark Mode          |
|----------------------|--------------------|--------------------|
| `--primary`          | `hsl(18 30% 25%)`  | `hsl(35 40% 75%)`  |
| `--primary-foreground`| `hsl(0 0% 100%)`  | `hsl(20 15% 10%)`  |
| `--primary-hover`    | `hsl(18 30% 20%)`  | `hsl(35 40% 80%)`  |

### Accent (Complementar)
| Variável             | Light Mode         | Dark Mode          |
|----------------------|--------------------|--------------------|
| `--accent`           | `hsl(18 25% 30%)`  | `hsl(35 35% 65%)`  |
| `--accent-foreground`| `hsl(0 0% 100%)`   | `hsl(20 15% 10%)`  |

### Status Colors
| Variável             | Light Mode         | Dark Mode          |
|----------------------|--------------------|--------------------|
| `--success`          | `hsl(140 30% 40%)` | `hsl(140 35% 55%)` |
| `--warning`          | `hsl(35 60% 55%)`  | `hsl(35 70% 65%)`  |
| `--destructive`      | `hsl(0 50% 45%)`   | `hsl(0 55% 60%)`   |

---

## ✅ Checklist de Validação

Ao criar um novo componente, verifique:

- [ ] Usei `bg-primary` ao invés de cores hardcoded?
- [ ] Usei `text-primary-foreground` para texto sobre `bg-primary`?
- [ ] Testei o componente em ambos os modos (light/dark)?
- [ ] O contraste está adequado em ambos os modos?
- [ ] As transições estão suaves ao mudar de tema?

---

## 🚀 Resultado

Com essa lógica de inversão automática, conseguimos:

✅ **Consistência**: Mesma lógica de cores em todo o app
✅ **Manutenibilidade**: Mudanças centralizadas em variáveis CSS
✅ **Acessibilidade**: Contraste adequado garantido
✅ **Elegância**: Transições suaves e naturais
✅ **Produtividade**: Desenvolvedores não precisam se preocupar com dark mode

---

**Desenvolvido com ❤️ para Futuree AI - Tríade Solutions**
