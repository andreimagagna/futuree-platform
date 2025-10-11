# 🎯 Funil Inteligente - Categorização Automática

## 🧠 Conceito: Inteligência de Categorização

O funil agora possui **inteligência para categorizar automaticamente** qualquer etapa de qualquer funil em 4 categorias universais:

1. **Topo** - Captura e primeiro contato
2. **Meio** - Qualificação e descoberta  
3. **Fundo** - Demonstração e validação
4. **Vendas** - **Negócios ganhos e fechados** (apenas com status `won`)

### 💡 Por que isso é importante?

Independente de quantos funis você tenha (Padrão, Enterprise, SaaS, etc.) ou quantas etapas cada um possua, **o sistema sempre vai mostrar uma visão consolidada** do pipeline inteiro.

### 🏆 Regra Especial de Vendas

**IMPORTANTE:** A categoria "Vendas" segue uma regra especial:

```typescript
// ✨ Só vai para "Vendas" se o lead tiver status "won"
if (finalCategory === 'vendas' && lead.status !== 'won') {
  // Se a categoria seria "vendas" mas o lead não está "won",
  // considera como "fundo" (ainda não fechou)
  finalCategory = 'fundo';
}
```

Isso significa que:
- ✅ **Leads com `status: 'won'`** → Categoria "Vendas" (negócio ganho)
- ❌ **Leads em etapa de "Proposta"/"Fechamento" mas `status !== 'won'`** → Categoria "Fundo" (ainda negociando)

Essa lógica garante que apenas **negócios realmente fechados e ganhos** apareçam na categoria Vendas!

---

## 🔗 Atalhos para Abrir Leads

### Navegação Rápida

Cada lead na lista expandida possui um **botão de atalho** que aparece ao passar o mouse:

```tsx
<Button
  variant="ghost"
  onClick={() => navigate('/crm', { state: { selectedLeadId: lead.id } })}
>
  <ExternalLink className="h-4 w-4" />
</Button>
```

**Características:**
- 🖱️ **Aparece no hover** - Botão visível apenas ao passar o mouse
- 🎯 **Navegação direta** - Vai para a aba CRM com o lead selecionado
- ⚡ **Acesso rápido** - Clique e veja todos os detalhes do lead
- 🚫 **Não expande** - `stopPropagation()` evita expandir/colapsar o card

**Visual:**
```
┌─────────────────────────────────────────────┐
│ JS  João Silva                        [🔗]  │
│     Tech Corp                                │
│     R$ 50.000            Score: 85          │
└─────────────────────────────────────────────┘
     ↑ hover mostra botão de atalho
```

### Badge de Status "Ganho"

Leads com `status: 'won'` exibem um badge especial:

```tsx
{lead.status === 'won' && (
  <Badge variant="default" className="bg-success">
    <Award className="h-3 w-3" />
    Ganho
  </Badge>
)}
```

**Visual:**
```
João Silva [🏆 Ganho]
Tech Corp
```

---

## 🔍 Como Funciona a Categorização

### 1. Categorização Manual (Prioritária)

Você pode definir explicitamente a categoria de cada etapa:

```typescript
{
  id: 'qualify',
  name: 'Qualificar',
  color: 'hsl(var(--accent))',
  order: 1,
  category: 'meio' // ✅ Definida manualmente
}
```

### 2. Categorização Automática por Palavras-Chave

Se não houver categoria definida, o sistema analisa o **nome da etapa** em busca de palavras-chave:

#### 🔴 VENDAS (Prioridade Alta)
```
Palavras: fechamento, closing, negociação, negotiation, 
          proposta, proposal, contrato, contract, 
          fechado, closed, won, ganho
```

#### 🟢 TOPO
```
Palavras: capturado, captured, lead, novo, new, 
          prospect, primeiro contato, first contact
```

#### 🟡 MEIO
```
Palavras: qualif, discovery, demo, apresentação, 
          presentation, análise, analysis
```

#### 🟠 FUNDO
```
Palavras: contato, contact, poc, prova, trial, 
          avaliação, evaluation
```

### 3. Fallback por Posição Relativa

Se nenhuma palavra-chave for encontrada, usa a **posição da etapa no funil**:

```typescript
const position = order / (totalStages - 1);

if (position < 0.25) return 'topo';    // Primeiros 25%
if (position < 0.5)  return 'meio';    // 25% - 50%
if (position < 0.75) return 'fundo';   // 50% - 75%
return 'vendas';                        // Últimos 25%
```

---

## 📊 Estrutura de Dados

### FunnelCategory Type
```typescript
export type FunnelCategory = 'topo' | 'meio' | 'fundo' | 'vendas';
```

### FunnelStage Interface
```typescript
export interface FunnelStage {
  id: string;
  name: string;
  color: string;
  order: number;
  category?: FunnelCategory; // ✨ Nova propriedade
}
```

### CategoryMetric Interface
```typescript
interface CategoryMetric {
  category: FunnelCategory;
  name: string;              // "Topo do Funil"
  description: string;       // "Captura e primeiro contato"
  color: string;             // Cor da categoria
  icon: React.ReactNode;     // Ícone visual
  count: number;             // Número de leads
  totalValue: number;        // Valor total em BRL
  leads: Lead[];             // Array de leads
  conversionRate: number;    // Taxa de conversão %
  stageNames: string[];      // Nomes das etapas agregadas
}
```

---

## 🎨 Visual do Funil

### 4 Cards Principais (Categorias)

Cada categoria é exibida em um card grande com:

```
┌─────────────────────────────────────────────────┐
│ 🎯 Topo do Funil                           ▼    │
│    Captura e primeiro contato                   │
│                                                  │
│ 👥 Leads    💰 Valor    📈 Conversão  📋 Etapas │
│    15       R$ 50k      100%          Capturado │
│                                                  │
│ ████████████████████░░░░░░░░░░░░░░░  60%       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 🎯 Meio do Funil                           ▼    │
│ ...                                              │
```

### Características Visuais:

✅ **Ícones por Categoria:**
- Topo: `<Layers />` - Camadas representando entrada
- Meio: `<Target />` - Alvo de qualificação
- Fundo: `<TrendingUp />` - Tendência de crescimento
- Vendas: `<ShoppingCart />` - Carrinho de compras

✅ **Cores do Sistema:**
- Topo: `hsl(var(--muted-foreground))` - Cinza
- Meio: `hsl(var(--accent))` - Marrom escuro
- Fundo: `hsl(var(--primary))` - Marrom quente
- Vendas: `hsl(var(--success))` - Verde

✅ **Interatividade:**
- Click para expandir e ver lista de leads
- Mostra nomes das etapas agregadas
- Background proporcional ao volume
- Barra de progresso com percentual

---

## 📈 Métricas Calculadas

### Por Categoria:

1. **Contagem de Leads** - Soma de todos os leads nessa categoria
2. **Valor Total** - Soma de todos os `dealValue`
3. **Taxa de Conversão** - Percentual em relação à categoria anterior
4. **Etapas Agregadas** - Nomes de todas as etapas que pertencem a essa categoria

### Exemplo:

Se você tem:
- Funil Padrão: `Capturado` → `Qualificar` → `Contato` → `Proposta` → `Fechamento`
- Funil Enterprise: `Lead` → `Discovery` → `Demo` → `POC` → `Negociação` → `Fechado`

O sistema vai agregar:

**Topo:**
- Capturado (Funil Padrão)
- Lead (Funil Enterprise)
- Total: X leads

**Meio:**
- Qualificar (Funil Padrão)
- Discovery (Funil Enterprise)
- Demo (Funil Enterprise)
- Total: Y leads

**Fundo:**
- Contato (Funil Padrão)
- POC (Funil Enterprise)
- Total: Z leads

**Vendas:**
- Proposta (Funil Padrão)
- Fechamento (Funil Padrão)
- Negociação (Funil Enterprise)
- Fechado (Funil Enterprise)
- Total: W leads

---

## 🔄 Lógica de Mapeamento de Leads

### Passo 1: Encontrar a Etapa do Lead

```typescript
// Se o lead tem funnelId customizado
if (lead.funnelId && lead.customStageId) {
  leadStage = allStages.find(
    s => s.funnelId === lead.funnelId && s.id === lead.customStageId
  );
}
// Senão, usar funil padrão
else {
  leadStage = allStages.find(s => s.id === lead.stage);
}
```

### Passo 2: Mapear para Categoria

```typescript
const category = leadStage.category || 
  inferStageCategory(leadStage.name, leadStage.order, totalStages);

categoryMetrics[category].count++;
categoryMetrics[category].totalValue += lead.dealValue || 0;
categoryMetrics[category].leads.push(lead);
```

### Passo 3: Calcular Conversão

```typescript
if (index > 0) {
  const previousMetric = categoryMetrics[index - 1];
  if (previousMetric.count > 0) {
    metric.conversionRate = (metric.count / previousMetric.count) * 100;
  }
}
```

---

## 🎯 Casos de Uso

### Cenário 1: Funil Único

**Funil Padrão:**
- Capturado (15 leads) → **TOPO**
- Qualificar (10 leads) → **MEIO**
- Contato (7 leads) → **FUNDO**
- Proposta (4 leads) → **VENDAS**
- Fechamento (2 leads) → **VENDAS**

**Resultado:**
- Topo: 15 leads
- Meio: 10 leads (66.7% conversão)
- Fundo: 7 leads (70% conversão)
- Vendas: 6 leads (85.7% conversão)

### Cenário 2: Múltiplos Funis

**Funil Padrão + Funil Enterprise:**

| Etapa | Funil | Categoria | Leads |
|-------|-------|-----------|-------|
| Capturado | Padrão | Topo | 10 |
| Lead | Enterprise | Topo | 5 |
| Qualificar | Padrão | Meio | 7 |
| Discovery | Enterprise | Meio | 3 |
| Demo | Enterprise | Meio | 2 |
| Contato | Padrão | Fundo | 5 |
| POC | Enterprise | Fundo | 2 |
| Proposta | Padrão | Vendas | 3 |
| Negociação | Enterprise | Vendas | 1 |
| Fechamento | Padrão | Vendas | 2 |
| Fechado | Enterprise | Vendas | 1 |

**Resultado Agregado:**
- Topo: 15 leads (Capturado + Lead)
- Meio: 12 leads (Qualificar + Discovery + Demo)
- Fundo: 7 leads (Contato + POC)
- Vendas: 7 leads (Proposta + Negociação + Fechamento + Fechado)

---

## 🎨 Componentes Visuais

### Cards de Resumo (Topo)
```tsx
<Card>
  <CardTitle>
    <Users /> Total no Pipeline
  </CardTitle>
  <div className="text-3xl font-bold">{totalLeads}</div>
  <p>leads ativos</p>
</Card>
```

### Cards de Categoria
```tsx
<Card onClick={() => expand(category)}>
  {/* Ícone + Nome + Descrição */}
  {/* Métricas: Leads, Valor, Conversão, Etapas */}
  {/* Barra de progresso */}
  {/* Lista expandível de leads */}
</Card>
```

### Painel de Insights
```tsx
<Card>
  <CardTitle>Distribuição do Pipeline</CardTitle>
  {categoryMetrics.map(metric => (
    <div>
      {metric.name}: {metric.count} leads ({percent}%)
    </div>
  ))}
</Card>
```

---

## ✨ Vantagens da Abordagem

### 1. **Flexibilidade Total**
- Funciona com qualquer número de funis
- Funciona com qualquer número de etapas
- Funciona com qualquer nome de etapa

### 2. **Visão Consolidada**
- Um único lugar para ver todo o pipeline
- Comparação fácil entre categorias
- Identificação rápida de gargalos

### 3. **Inteligência Automática**
- Não precisa configurar manualmente
- Inferência inteligente por palavras-chave
- Fallback por posição relativa

### 4. **Escalabilidade**
- Adicione quantos funis quiser
- Adicione quantas etapas quiser
- Sistema sempre vai categorizar corretamente

### 5. **Análise de Negócio**
- Taxa de conversão entre categorias universais
- Valor total por fase do funil
- Distribuição percentual clara

---

## 🚀 Exemplos de Categorização

### Exemplo 1: Etapa "Qualificação BANT"
```typescript
inferStageCategory("Qualificação BANT", 1, 5)
// Resultado: 'meio' (palavra-chave: "qualif")
```

### Exemplo 2: Etapa "Proposta Comercial"
```typescript
inferStageCategory("Proposta Comercial", 3, 5)
// Resultado: 'vendas' (palavra-chave: "proposta")
```

### Exemplo 3: Etapa "Etapa 2"
```typescript
inferStageCategory("Etapa 2", 1, 4)
// Resultado: 'meio' (fallback: position = 1/3 = 33%, que é < 50%)
```

### Exemplo 4: Etapa "Discovery Call"
```typescript
inferStageCategory("Discovery Call", 2, 6)
// Resultado: 'meio' (palavra-chave: "discovery")
```

---

## 🎯 Roadmap de Melhorias

### Próximas Funcionalidades:

**Fase 1: ✅ Implementado**
- [x] Categorização inteligente
- [x] Agregação de múltiplos funis
- [x] Visão por categorias (Topo, Meio, Fundo, Vendas)
- [x] Taxa de conversão entre categorias

**Fase 2: Em Planejamento**
- [ ] Machine Learning para melhorar categorização
- [ ] Histórico de movimento entre categorias
- [ ] Tempo médio em cada categoria
- [ ] Alertas de leads estagnados por categoria

**Fase 3: Futuro**
- [ ] Previsão de fechamento por categoria
- [ ] Benchmark de conversão por indústria
- [ ] Recomendações de ações por categoria
- [ ] Exportação de relatórios

---

## 📋 Resumo

O novo funil é:

✅ **Inteligente** - Categoriza automaticamente  
✅ **Flexível** - Funciona com qualquer funil  
✅ **Consolidado** - Visão única de todo o pipeline  
✅ **Visual** - Design limpo e informativo  
✅ **Acionável** - Insights claros para tomada de decisão  

**Independente de quantos funis ou etapas você tenha, o sistema sempre vai mostrar uma visão clara de Topo → Meio → Fundo → Vendas!** 🎉
