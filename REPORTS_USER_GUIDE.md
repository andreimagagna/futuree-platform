# 📊 Guia Rápido - Relatórios

## 🚀 Como Usar o Novo Sistema de Relatórios

### Acesso
1. Clique em **"Relatórios"** no menu lateral
2. A página carregará automaticamente com dados reais do sistema

---

## 📈 Visão Geral da Tela

### Topo - KPIs Principais

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 💰 RECEITA  │ 📈 PIPELINE │ 🎯 QUALIF.  │ 🏆 CONVERSÃO│
│   R$ XXk    │   R$ XXk    │   XX.X%     │   XX.X%     │
│   ↑ +XX%    │  XX deals   │ Leads→Qual  │ Leads→Won   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Filtros

```
📅 Período: [Últimos 30 dias ▼]  🔄 Comparação: [vs Período anterior ▼]  
                                  [🔄 Atualizar]  [📥 Exportar]
```

### Tabs Disponíveis

```
┌──────────┬────────┬──────────────┬──────────┬──────────┬─────────────┐
│ 📊 VISÃO │ 💰 VENDAS│ 🎯 QUALIF. │ 📅 REUNIÕES│ 📈 PREVISÃO│ 🏆 PERFORMANCE│
│  GERAL   │        │            │          │          │             │
└──────────┴────────┴──────────────┴──────────┴──────────┴─────────────┘
```

---

## 🎯 O Que Cada Tab Mostra

### 📊 Visão Geral
**Layout**: 2x2 Grid de gráficos principais

```
┌──────────────────┬──────────────────┐
│ 💰 Vendas        │ 🎪 Funil         │
│ (6 meses)        │ (Conversão)      │
├──────────────────┼──────────────────┤
│ 🎯 Qualificação  │ 📈 Previsão      │
│ (6 meses)        │ (Forecast)       │
└──────────────────┴──────────────────┘
```

**Use para**: Visão rápida de todas as métricas principais

---

### 💰 Vendas
**Foco**: Receita, deals fechados e análise de pipeline

**Gráficos**:
- 📊 Evolução de Vendas (destaque)
- 🎪 Funil de Conversão
- 📈 Previsão de Vendas

**Métricas Mostradas**:
- Receita total mensal (R$)
- Número de deals fechados
- Ticket médio por deal
- Tendência de crescimento

**Use para**: Reuniões de resultado, análise de faturamento

---

### 🎯 Qualificação
**Foco**: Performance de qualificação de leads

**Gráficos**:
- 📊 Qualificação por Período (destaque)
- 🎪 Funil de Conversão

**Métricas Mostradas**:
- Leads contatados
- Leads qualificados
- Leads desqualificados
- Taxa de qualificação (%)

**Use para**: Otimizar processo de qualificação, treinar SDRs

---

### 📅 Reuniões
**Foco**: Agendamentos e performance de reuniões

**Gráficos**:
- 📊 Reuniões por Semana (destaque)
- 📈 Cards de Métricas
- 🏆 Performance Geral

**Métricas Mostradas**:
- Reuniões agendadas
- Reuniões realizadas
- No-shows
- Taxa de conversão pós-reunião

**Use para**: Melhorar show-up rate, otimizar agenda

---

### 📈 Previsão
**Foco**: Forecast e análise de pipeline

**Gráficos**:
- 📊 Previsão de Vendas (destaque)
- 📋 Card de Análise de Pipeline
- 💰 Vendas Históricas

**Métricas Mostradas**:
- Receita realizada
- Forecast ponderado
- Meta estabelecida
- Probabilidade de atingimento
- Pipeline ativo

**Cálculo do Forecast**:
```
Forecast = Realizado + 
           (Deals em Proposta × 40%) + 
           (Deals em Fechamento × 70%)
```

**Use para**: Planejamento financeiro, previsão de resultados

---

### 🏆 Performance
**Foco**: Análise multidimensional de performance

**Gráficos**:
- 🕸️ Radar de Performance (destaque)
- 🎯 Qualificação
- 📅 Reuniões

**Dimensões Analisadas**:
1. **Leads Contatados** (meta: 150)
2. **Taxa Qualificação** (meta: 50)
3. **Deals Fechados** (meta: 20)
4. **Reuniões Realizadas** (meta: 30)
5. **Tarefas Concluídas** (meta: variável)
6. **Tempo Resposta** (meta: 4h)

**Use para**: Avaliação de performance, identificar gaps

---

## 🎛️ Usando os Filtros

### Período

**Opções Disponíveis**:
- ⏰ Últimos 7 dias
- 📅 Últimos 30 dias (padrão)
- 📆 Últimos 90 dias
- 📊 Últimos 6 meses
- 📈 Último ano
- 🔧 Período customizado

**Como usar**:
1. Clique no dropdown de período
2. Selecione a opção desejada
3. Todos os gráficos atualizam automaticamente

---

### Comparação

**Opções Disponíveis**:
- ❌ Sem comparação (padrão)
- ↔️ vs Período anterior
- 📅 vs Mesmo período ano passado

**Como usar**:
1. Clique no dropdown de comparação
2. Selecione o tipo de comparação
3. Badge "Comparando" aparece
4. Gráficos mostram dados comparativos (em desenvolvimento)

---

### Ações

**🔄 Atualizar**
- Recalcula todos os dados
- Útil após adicionar novos leads/tasks
- Mostra notificação de sucesso

**📥 Exportar**
- Prepara relatório para download
- Formatos: PDF, Excel (em desenvolvimento)
- Inclui todos os gráficos visíveis

---

## 📊 Interpretando os Gráficos

### Gráfico de Área (Vendas)

```
  R$
  │     ╱╲
  │    ╱  ╲    ╱╲
  │   ╱    ╲  ╱  ╲
  │  ╱      ╲╱    ╲
  └──────────────────── Meses
```

**Verde**: Receita  
**Marrom**: Número de deals  
**Preenchimento**: Área sob a curva

---

### Gráfico de Barras (Qualificação)

```
     │ ███ Contatados
     │ ███ Qualificados  
     │ ███ Desqualificados
     └────────────────────
       Mês 1  Mês 2  Mês 3
```

**Altura**: Quantidade de leads  
**Cores**: Verde (qualif.), Vermelho (desqual.)

---

### Gráfico de Linhas (Reuniões)

```
  100%│      ●────●
      │     ╱      ╲
   50%│  ●─╱        ╲─●
      │               
     0└────────────────── Semanas
```

**Linhas contínuas**: Números absolutos  
**Linha tracejada**: Taxa de conversão (%)

---

### Funil Horizontal (Conversão)

```
Novos Leads     ██████████████████ 100 (100%)
Qualificação    ████████████       60 (60%)
Contato         ██████████         50 (50%)
Proposta        ███████            35 (35%)
Fechamento      ████               20 (20%)
Fechados        ██                 10 (10%)
```

**Largura**: Quantidade de leads  
**Cores**: Do accent (topo) ao success (fundo)

---

### Radar (Performance)

```
        Contatados
            │
Resp.───────●───────Qualif.
  │      ╱   ╲      │
  │    ╱       ╲    │
  └──●           ●──┘
   Tarefas    Reuniões
```

**Área interna (marrom)**: Performance atual  
**Área externa (verde)**: Meta estabelecida  
**Overlap**: Indica atingimento da meta

---

## 🎯 Casos de Uso Comuns

### 1. Reunião Semanal de Resultados

**Passos**:
1. Acesse tab **"Visão Geral"**
2. Configure período: "Últimos 7 dias"
3. Compare: "vs Período anterior"
4. Apresente os 4 KPIs
5. Destaque gráfico de Vendas

**Tempo**: ~5 minutos

---

### 2. Análise Mensal de Performance

**Passos**:
1. Configure período: "Últimos 30 dias"
2. Vá para tab **"Performance"**
3. Analise radar - identifique gaps
4. Vá para tabs específicas de métricas baixas
5. Exporte relatório

**Tempo**: ~15 minutos

---

### 3. Planejamento de Forecast

**Passos**:
1. Acesse tab **"Previsão"**
2. Configure período: "Últimos 6 meses"
3. Analise tendência histórica
4. Verifique pipeline ativo
5. Ajuste metas se necessário

**Tempo**: ~10 minutos

---

### 4. Otimização de Qualificação

**Passos**:
1. Acesse tab **"Qualificação"**
2. Configure período: "Últimos 90 dias"
3. Identifique meses com baixa qualificação
4. Analise funil de conversão
5. Crie plano de ação para SDRs

**Tempo**: ~20 minutos

---

## 💡 Dicas de Uso

### ✅ Boas Práticas

1. **Atualize regularmente**: Use "🔄 Atualizar" após adicionar leads/tasks
2. **Use comparações**: Ative comparações para ver tendências
3. **Explore tabs**: Cada tab tem foco diferente - use o mais adequado
4. **Exporte insights**: Clique em "📥 Exportar" para documentar
5. **Analise tendências**: Períodos longos (6 meses) mostram padrões

### ❌ Evite

1. **Período muito curto**: 7 dias pode não ser representativo
2. **Ignorar filtros**: Use filtros para análises específicas
3. **Só ver KPIs**: Explore os gráficos para entender o "porquê"
4. **Não documentar**: Exporte relatórios importantes

---

## 🔢 Fórmulas Principais

### Taxa de Qualificação
```
(Leads Qualificados / Leads Contatados) × 100
```

### Taxa de Conversão
```
(Deals Fechados / Total de Leads) × 100
```

### Ticket Médio
```
Receita Total / Número de Deals
```

### Forecast Ponderado
```
Realizado + 
(Pipeline Proposta × 0.4) + 
(Pipeline Fechamento × 0.7)
```

### Performance Média
```
Σ(Métrica Atual / Métrica Meta × 100) / Total de Métricas
```

---

## 🆘 Troubleshooting

### "Gráficos vazios"
**Causa**: Sem dados no período selecionado  
**Solução**: Escolha período maior ou adicione dados

### "KPIs em 0%"
**Causa**: Sem leads/tasks no mês atual  
**Solução**: Normal para início de mês

### "Forecast muito alto/baixo"
**Causa**: Poucos deals em pipeline  
**Solução**: Adicione mais deals ou ajuste probabilidades

### "Dados não atualizam"
**Causa**: Cache do navegador  
**Solução**: Clique em "🔄 Atualizar"

---

## 📱 Atalhos de Teclado (Futuro)

```
Ctrl/Cmd + R = Atualizar dados
Ctrl/Cmd + E = Exportar relatório
Ctrl/Cmd + 1-6 = Navegar entre tabs
```

---

## 🎓 Próximos Passos

Após dominar os relatórios básicos, explore:

1. **Análise de Tendências**: Compare múltiplos períodos
2. **Drill-down**: Clique em gráficos para ver detalhes (em dev)
3. **Filtros Avançados**: Por SDR, região, produto (em dev)
4. **Exportação Avançada**: PDF com insights automáticos (em dev)

---

## 📞 Suporte

Encontrou um problema? Tem uma sugestão?

- 📧 Reporte bugs ou sugestões
- 📖 Veja documentação completa em `REPORTS_ROADMAP.md`
- 🔧 Código-fonte em `src/components/reports/`

---

**Desenvolvido com ❤️ para Futuree AI - Tríade Solutions**  
*Última atualização: Outubro 2025*
