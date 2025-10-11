# 📊 Dashboards e Inteligência de Gaps - Funil

## 🎯 Visão Geral

O funil agora possui **inteligência avançada de análise** que identifica automaticamente:

- 🏥 **Health Score** - Saúde geral do funil (0-100)
- 📈 **Previsão de Vendas** - Forecast baseado em dados atuais
- ⚠️ **Alertas Automáticos** - Leads em risco e gargalos
- 🔴 **Gaps e Gargalos** - Pontos de fricção no processo
- 💡 **Oportunidades** - Onde focar para crescer
- ⚡ **Velocidade** - Quantos leads fluem por dia

---

## 🏥 1. Health Score do Funil

### Cálculo Inteligente

```typescript
funnelHealthScore = Math.min(100, Math.round(
  (overallConversion * 0.4) +                    // 40% conversão geral
  ((totalLeads / 50) * 30) +                     // 30% volume
  ((etapasSaudaveis / 3) * 30)                   // 30% etapas saudáveis
));
```

### Componentes do Score:

**1. Conversão Geral (40%):**
- Taxa de conversão do Topo → Vendas
- Benchmark: >20% = bom

**2. Volume de Leads (30%):**
- Quantidade total no pipeline
- Benchmark: 50 leads = score máximo

**3. Etapas Saudáveis (30%):**
- Quantas etapas têm conversão >50%
- Benchmark: 3 de 3 etapas = score máximo

### Classificação:

| Score | Label | Cor | Ação |
|-------|-------|-----|------|
| 80-100 | Excelente | Verde | Manter o ritmo |
| 60-79 | Bom | Verde | Pequenos ajustes |
| 40-59 | Regular | Amarelo | Atenção necessária |
| 0-39 | Crítico | Vermelho | Ação imediata |

### Visual:

```
┌─────────────────────────────────────┐
│ 🔄 Health Score do Funil            │
│                                     │
│     72          [Bom]               │
│                                     │
│ ████████████████████░░░░░░  72%    │
│                                     │
│ Conversão Geral:        18.5%      │
│ Volume de Leads:        45          │
│ Etapas Saudáveis:       2/3         │
└─────────────────────────────────────┘
```

---

## 📈 2. Previsão de Vendas (Forecast)

### Cálculo Inteligente

Baseado na **taxa de conversão atual** entre Fundo → Vendas:

```typescript
expectedWins = Math.floor(
  leadsEmFundo * (taxaConversãoVendas / 100)
);

expectedValue = 
  valorTotalEmFundo * (taxaConversãoVendas / 100);

timeToClose = tempoMédioNoFunil * 1.5;
```

### Exemplo:

**Dados atuais:**
- Leads em Fundo: 18
- Taxa Fundo → Vendas: 66%
- Valor total em Fundo: R$ 90.000
- Tempo médio: 12 dias

**Previsão:**
- Fechamentos esperados: **12 negócios**
- Valor previsto: **R$ 59.400**
- Tempo até fechamento: **18 dias**

### Visual:

```
┌─────────────────────────────────────┐
│ 📊 Previsão de Vendas               │
│                                     │
│ Fechamentos Esperados               │
│        12                           │
│ dos 18 leads em Fundo               │
│                                     │
│ Valor Previsto                      │
│    R$ 59.400                        │
│                                     │
│ ⏱️ Tempo médio: 18 dias             │
└─────────────────────────────────────┘
```

---

## ⚠️ 3. Alertas de Atenção

### Três Tipos de Alertas:

#### 🔴 Leads em Risco
```typescript
atRiskLeads = leads.filter(lead => {
  daysSinceContact > 14 && 
  status !== 'won' && 
  status !== 'lost'
});
```

**Critérios:**
- Sem contato há mais de 14 dias
- Status ainda aberto
- Não ganho nem perdido

**Ação:** Reativar contato urgentemente

#### 🟡 Gargalo Identificado
```typescript
bottlenecks = categoryMetrics
  .filter(metric => metric.conversionRate < 50%)
  .sort(menor → maior);
```

**Critérios:**
- Taxa de conversão < 50%
- Maior perda de leads

**Ação:** Revisar processo dessa etapa

#### 🔵 Leads Estagnados
```typescript
stagnantLeads = leads.filter(lead => {
  diasNaEtapa > 7
});
```

**Critérios:**
- Mais de 7 dias na mesma etapa
- Sem movimento no funil

**Ação:** Impulsionar para próxima etapa

### Visual:

```
┌─────────────────────────────────────┐
│ ⚠️  Alertas de Atenção              │
│                                     │
│ 🔴 Leads em Risco          [8]     │
│    Sem contato há mais de 14 dias  │
│                                     │
│ 🟡 Gargalo Identificado    [42%]   │
│    Meio do Funil com baixa conversão│
│                                     │
│ 🔵 Leads Estagnados        [15]    │
│    Há mais de 7 dias na mesma etapa│
└─────────────────────────────────────┘
```

---

## 🔴 4. Gargalos Identificados

### Análise Detalhada de Gaps

Para cada gargalo (conversão <50%), mostra:

**1. Ranking de Severidade:**
- #1, #2, #3... (pior para melhor)

**2. Taxa de Conversão:**
- Percentual real vs esperado (>50%)

**3. Leads Perdidos (Estimativa):**
```typescript
leadsPerdidos = leadsDoTopo * ((100 - conversão) / 100)
```

**4. Valor em Risco:**
```typescript
valorEmRisco = valorTotalDaEtapa * 0.3
```
30% do valor total é considerado em risco

**5. Ação Recomendada:**
- Sugestão automática baseada na etapa

### Exemplo de Gargalo:

```
┌─────────────────────────────────────┐
│ #1  Meio do Funil          42.5%   │
│                                     │
│ Leads perdidos:    ~26              │
│ Valor em risco:    R$ 12.000        │
│                                     │
│ ⚡ Ação recomendada:                │
│ Revisar processo de meio do funil   │
│ e identificar pontos de fricção     │
└─────────────────────────────────────┘
```

### Se não houver gargalos:

```
┌─────────────────────────────────────┐
│      ✅                              │
│                                     │
│ Nenhum gargalo crítico identificado!│
│                                     │
│ Todas as conversões estão           │
│ acima de 50%                        │
└─────────────────────────────────────┘
```

---

## 💡 5. Oportunidades de Crescimento

### Análise de Performance

**1. Melhor Performance:**
- Identifica a etapa com maior conversão
- Sugestão: Replicar processo nas outras

```
✅ Melhor Performance
   Fundo do Funil        85.7%
   ✨ Replicar esse processo nas outras etapas
```

**2. Maior Oportunidade:**
- Etapa com conversão <70%
- Calcula potencial de ganho

```
📉 Maior Oportunidade
   Meio do Funil         55%
   💡 Potencial de ganho se melhorar para 70%: +5 leads
```

**3. Distribuição de Valor:**
- Top 3 categorias por valor
- Percentual do total

```
Distribuição de Valor
Vendas      R$ 45.000    45%
Fundo       R$ 30.000    30%
Meio        R$ 25.000    25%
```

**4. Velocidade do Funil:**
- Leads por dia em cada etapa
- Tempo médio total

```
⚡ Velocidade do Funil

Leads/dia (Topo)    1.5
Vendas/dia          0.4

⏱️ Tempo médio no funil: 12 dias
```

---

## 📊 6. Métricas Calculadas

### Fórmulas Utilizadas:

#### Taxa de Conversão
```typescript
conversão = (leadsEtapaAtual / leadsEtapaAnterior) * 100
```

#### Leads Perdidos
```typescript
perdidos = leadsDoTopo - leadsEtapaAtual
```

#### Valor em Risco
```typescript
valorRisco = valorTotal * percentualEmRisco
```

#### Velocidade
```typescript
velocidade = leadsNaEtapa / 30 dias
```

#### Tempo Médio
```typescript
tempoMédio = Σ(dataAtual - dataCriação) / totalLeads
```

#### Health Score
```typescript
health = min(100, (
  (conversãoGeral * 0.4) +
  ((volume / 50) * 30) +
  ((etapasSaudáveis / 3) * 30)
))
```

---

## 🎨 Design e Cores

### Código de Cores por Severidade:

| Tipo | Cor | Uso |
|------|-----|-----|
| Crítico | `text-destructive` | Vermelho - Ação imediata |
| Atenção | `text-warning` | Amarelo - Monitorar |
| Bom | `text-success` | Verde - Está funcionando |
| Neutro | `text-muted-foreground` | Cinza - Informativo |

### Backgrounds:

```css
success-light   /* Verde claro - Positivo */
warning-light   /* Amarelo claro - Atenção */
destructive-light /* Vermelho claro - Crítico */
primary-light   /* Marrom claro - Neutro */
info-light      /* Azul claro - Informação */
accent-light    /* Marrom escuro - Destaque */
```

---

## 🧠 Inteligência Aplicada

### 1. Identificação Automática de Gaps

**Sistema analisa:**
- ✅ Conversões abaixo de 50% → Gargalo
- ✅ Sem contato >14 dias → Lead em risco
- ✅ Mesma etapa >7 dias → Lead estagnado
- ✅ Alto valor + baixa conversão → Oportunidade

### 2. Recomendações Contextuais

**Para gargalos:**
> "Revisar processo de [etapa] e identificar pontos de fricção"

**Para melhor performance:**
> "Replicar esse processo nas outras etapas"

**Para oportunidades:**
> "Potencial de ganho se melhorar para 70%: +X leads"

### 3. Previsões Baseadas em Dados

**Forecast de vendas:**
- Usa taxa de conversão histórica
- Calcula leads esperados
- Estima valor total
- Projeta tempo de fechamento

### 4. Health Score Ponderado

**Prioriza conversão (40%):**
- Mais importante que volume
- Qualidade sobre quantidade

**Considera volume (30%):**
- Pipeline saudável precisa volume
- Benchmark: 50 leads

**Valida processo (30%):**
- Etapas saudáveis = processo funcional
- Mínimo 50% de conversão por etapa

---

## 📈 Casos de Uso

### Cenário 1: Funil Saudável

**Dados:**
- Health Score: 85
- Conversão geral: 26%
- Todas etapas >60%
- Nenhum gargalo

**Dashboard mostra:**
- ✅ Score "Excelente" em verde
- ✅ Nenhum gargalo crítico
- ✅ Previsão otimista de vendas
- 💡 Focar em manter o ritmo

### Cenário 2: Gargalo no Meio

**Dados:**
- Health Score: 52
- Meio do Funil: 38% conversão
- 26 leads perdidos
- R$ 12k em risco

**Dashboard mostra:**
- ⚠️ Score "Regular" em amarelo
- 🔴 Gargalo #1: Meio do Funil
- 💡 Ação: Revisar processo
- 📊 Potencial: +15 leads se melhorar

### Cenário 3: Leads em Risco

**Dados:**
- 15 leads sem contato >14 dias
- 8 leads estagnados
- Health Score: 45

**Dashboard mostra:**
- ⚠️ 15 alertas de leads em risco
- 🔵 8 leads estagnados
- 💡 Ação: Reativar contatos urgente
- 📉 Risco de perda de R$ 30k

---

## 🚀 Benefícios

### Para SDRs:

1. **Visibilidade clara** de onde focar energia
2. **Alertas automáticos** de leads que precisam atenção
3. **Priorização inteligente** baseada em dados
4. **Insights acionáveis** sem análise manual

### Para Gestores:

1. **Health Score único** para acompanhar saúde do pipeline
2. **Identificação automática** de gargalos
3. **Forecast confiável** baseado em dados reais
4. **Análise de gaps** para melhorar processo

### Para o Negócio:

1. **Otimização contínua** do funil
2. **Redução de perda** de leads
3. **Aumento de conversão** com ações direcionadas
4. **Previsibilidade** de receita

---

## 📋 Resumo das Métricas

| Métrica | O que mede | Ação se ruim |
|---------|-----------|--------------|
| Health Score | Saúde geral (0-100) | Revisar processo todo |
| Gargalos | Conversões <50% | Otimizar etapa específica |
| Leads em Risco | >14 dias sem contato | Reativar urgente |
| Estagnados | >7 dias mesma etapa | Impulsionar movimento |
| Forecast | Vendas esperadas | Ajustar expectativas |
| Velocidade | Leads/dia | Aumentar volume topo |
| Valor em Risco | Valor que pode perder | Focar em alto valor |

---

## ✨ Resultado Final

O funil agora possui:

✅ **Inteligência de negócio** embutida  
✅ **Identificação automática** de problemas  
✅ **Recomendações acionáveis** claras  
✅ **Forecast confiável** de vendas  
✅ **Visibilidade total** de gaps  
✅ **Health Score** único e fácil  
✅ **Análise sem esforço** manual  

**Sistema completo de business intelligence para o funil de vendas!** 🎉
